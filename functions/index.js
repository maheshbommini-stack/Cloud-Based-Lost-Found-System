const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");

const admin = require("firebase-admin");

const {
  calculateMatchScore
} = require("./matching");

admin.initializeApp();

const db = admin.firestore();


// =====================================================
// AUTOMATIC MATCHING
// =====================================================

exports.findPotentialMatches = onDocumentCreated(
  "items/{itemId}",
  async (event) => {

    const newItem = event.data?.data();

    if (!newItem) {
      console.log("No item data found.");
      return;
    }

    const itemId = event.params.itemId;

    console.log(`New item created: ${itemId}`);

    const oppositeType =
      newItem.type === "LOST"
        ? "FOUND"
        : "LOST";

    const snapshot = await db
      .collection("items")
      .where("type", "==", oppositeType)
      .where("status", "==", "ACTIVE")
      .get();

    if (snapshot.empty) {
      console.log("No possible matching items found.");
      return;
    }

    const batch = db.batch();

    for (const document of snapshot.docs) {

      const existingItem = document.data();

      // Do not match an item with itself
      if (document.id === itemId) {
        continue;
      }

      const score = calculateMatchScore(
        newItem,
        existingItem
      );

      console.log(
        `Comparing ${itemId} with ${document.id}: ${score}`
      );

      // Potential match threshold
      if (score >= 60) {

        const matchRef = db.collection("matches").doc();

        batch.set(matchRef, {
          itemId:
            newItem.type === "LOST"
              ? itemId
              : document.id,

          matchedItemId:
            newItem.type === "LOST"
              ? document.id
              : itemId,

          score: score,

          status: "PENDING",

          createdAt:
            admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    await batch.commit();

    console.log("Matching process completed.");
  }
);


// =====================================================
// CREATE CLAIM
// =====================================================

exports.createClaim = onCall(async (request) => {

  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in."
    );
  }

  const {
    itemId,
    matchId,
    message
  } = request.data;

  if (!itemId || !matchId) {
    throw new HttpsError(
      "invalid-argument",
      "itemId and matchId are required."
    );
  }

  const claimRef = await db.collection("claims").add({

    itemId,

    matchId,

    userId: request.auth.uid,

    message: message || "",

    status: "PENDING",

    createdAt:
      admin.firestore.FieldValue.serverTimestamp()
  });

  return {
    success: true,
    claimId: claimRef.id
  };
});


// =====================================================
// ADMIN APPROVE CLAIM
// =====================================================

exports.approveClaim = onCall(async (request) => {

  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Authentication required."
    );
  }

  const adminUid = request.auth.uid;

  const adminDoc = await db
    .collection("users")
    .doc(adminUid)
    .get();

  if (!adminDoc.exists ||
      adminDoc.data().role !== "admin") {

    throw new HttpsError(
      "permission-denied",
      "Admin access required."
    );
  }

  const {
    claimId
  } = request.data;

  if (!claimId) {
    throw new HttpsError(
      "invalid-argument",
      "claimId is required."
    );
  }

  const claimRef =
    db.collection("claims").doc(claimId);

  const claimDoc =
    await claimRef.get();

  if (!claimDoc.exists) {
    throw new HttpsError(
      "not-found",
      "Claim not found."
    );
  }

  const claim = claimDoc.data();

  const batch = db.batch();

  // Update claim
  batch.update(claimRef, {
    status: "APPROVED",
    reviewedBy: adminUid,
    reviewedAt:
      admin.firestore.FieldValue.serverTimestamp()
  });

  // Mark item as returned
  if (claim.itemId) {

    const itemRef =
      db.collection("items").doc(claim.itemId);

    batch.update(itemRef, {
      status: "RETURNED",
      returnedAt:
        admin.firestore.FieldValue.serverTimestamp()
    });
  }

  await batch.commit();

  return {
    success: true,
    message: "Claim approved."
  };
});


// =====================================================
// ADMIN REJECT CLAIM
// =====================================================

exports.rejectClaim = onCall(async (request) => {

  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Authentication required."
    );
  }

  const adminUid = request.auth.uid;

  const adminDoc = await db
    .collection("users")
    .doc(adminUid)
    .get();

  if (!adminDoc.exists ||
      adminDoc.data().role !== "admin") {

    throw new HttpsError(
      "permission-denied",
      "Admin access required."
    );
  }

  const { claimId } = request.data;

  if (!claimId) {
    throw new HttpsError(
      "invalid-argument",
      "claimId is required."
    );
  }

  await db
    .collection("claims")
    .doc(claimId)
    .update({
      status: "REJECTED",
      reviewedBy: adminUid,
      reviewedAt:
        admin.firestore.FieldValue.serverTimestamp()
    });

  return {
    success: true,
    message: "Claim rejected."
  };
});
