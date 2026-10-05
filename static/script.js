const API_URL = "http://localhost:5000/api";

// ==========================================
// REPORT ITEM
// ==========================================

const itemForm = document.getElementById("itemForm");

if (itemForm) {

const urlParams =
    new URLSearchParams(window.location.search);

const selectedType =
    urlParams.get("type");


if (selectedType === "lost" ||
    selectedType === "found") {

    document.getElementById("type").value =
        selectedType;

}


itemForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const message =
            document.getElementById(
                "formMessage"
            );


        const item = {

            type:
                document.getElementById(
                    "type"
                ).value,

            name:
                document.getElementById(
                    "itemName"
                ).value,

            category:
                document.getElementById(
                    "category"
                ).value,

            description:
                document.getElementById(
                    "description"
                ).value,

            color:
                document.getElementById(
                    "color"
                ).value,

            location:
                document.getElementById(
                    "location"
                ).value,

            date:
                document.getElementById(
                    "date"
                ).value

        };


        try {

            const response =
                await fetch(
                    `${API_URL}/items`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(item)
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to submit report"
                );

            }


            message.textContent =
                "Report submitted successfully!";

            message.className =
                "form-message success";


            itemForm.reset();


        } catch (error) {

            console.error(error);


            message.textContent =
                "Could not connect to the backend. Make sure the server is running.";

            message.className =
                "form-message error";

        }

    }
);


}

// ==========================================
// SEARCH ITEMS
// ==========================================

const searchButton =
document.getElementById(
"searchButton"
);

if (searchButton) {

searchButton.addEventListener(
    "click",
    searchItems
);


document
    .getElementById("searchInput")
    .addEventListener(
        "keypress",
        function(event) {

            if (event.key === "Enter") {

                searchItems();

            }

        }
    );


}

async function searchItems() {

const keyword =
    document
        .getElementById("searchInput")
        .value
        .trim()
        .toLowerCase();


const type =
    document.getElementById(
        "searchType"
    ).value;


const results =
    document.getElementById(
        "searchResults"
    );


const resultCount =
    document.getElementById(
        "resultCount"
    );


results.innerHTML = `
    <div class="empty">

        <div class="empty-icon">
            ⏳
        </div>

        <h3>
            Searching...
        </h3>

        <p>
            Please wait.
        </p>

    </div>
`;


try {

    const response =
        await fetch(
            `${API_URL}/items`
        );


    const items =
        await response.json();


    if (!response.ok) {

        throw new Error(
            "Could not load items"
        );

    }


    const filtered =
        items.filter(function(item) {

            const searchableText = `

                ${item.name}

                ${item.category}

                ${item.location}

                ${item.description}

                ${item.color}

            `.toLowerCase();


            const keywordMatch =
                keyword === "" ||
                searchableText.includes(
                    keyword
                );


            const typeMatch =
                type === "all" ||
                item.type === type;


            return (
                keywordMatch &&
                typeMatch
            );

        });


    resultCount.textContent =
        `${filtered.length} item${
            filtered.length === 1
                ? ""
                : "s"
        }`;


    displayItems(filtered);


} catch (error) {

    console.error(error);


    results.innerHTML = `
        <div class="empty">

            <div class="empty-icon">
                ⚠️
            </div>

            <h3>
                Backend not connected
            </h3>

            <p>
                Start the backend server
                and search again.
            </p>

        </div>
    `;

}


}

// ==========================================
// DISPLAY ITEMS
// ==========================================

function displayItems(items) {

const results =
    document.getElementById(
        "searchResults"
    );


if (items.length === 0) {

    results.innerHTML = `
        <div class="empty">

            <div class="empty-icon">
                🔍
            </div>

            <h3>
                No items found
            </h3>

            <p>
                Try another keyword.
            </p>

        </div>
    `;

    return;

}


results.innerHTML =
    items.map(function(item) {

        return `

            <article class="report-card">

                <span class="status ${item.type}">
                    ${item.type.toUpperCase()}
                </span>

                <h3>
                    ${escapeHTML(item.name)}
                </h3>

                <p>
                    ${escapeHTML(item.description)}
                </p>

                <div class="report-info">

                    🏷️
                    ${escapeHTML(item.category)}

                    <br>

                    🎨
                    ${escapeHTML(item.color || "Not specified")}

                    <br>

                    📍
                    ${escapeHTML(item.location)}

                    <br>

                    📅
                    ${escapeHTML(item.date)}

                </div>

            </article>

        `;

    }).join("");


}

// ==========================================
// DASHBOARD
// ==========================================

async function loadDashboard() {

const lostCount =
    document.getElementById(
        "lostCount"
    );


if (!lostCount) {
    return;
}


try {

    const response =
        await fetch(
            `${API_URL}/items`
        );


    const items =
        await response.json();


    const lost =
        items.filter(
            item => item.type === "lost"
        );


    const found =
        items.filter(
            item => item.type === "found"
        );


    document.getElementById(
        "lostCount"
    ).textContent =
        lost.length;


    document.getElementById(
        "foundCount"
    ).textContent =
        found.length;


    const matches =
        calculateMatches(
            lost,
            found
        );


    document.getElementById(
        "matchCount"
    ).textContent =
        matches;


    document.getElementById(
        "returnedCount"
    ).textContent =
        items.filter(
            item => item.returned === true
        ).length;


    displayRecentReports(items);

} catch (error) {

    console.error(
        "Dashboard error:",
        error
    );

}


}

// ==========================================
// SIMPLE MATCHING SYSTEM
// ==========================================

function calculateMatches(lostItems, foundItems) {

let matches = 0;


lostItems.forEach(function(lost) {

    foundItems.forEach(function(found) {

        let score = 0;


        if (
            lost.category ===
            found.category
        ) {

            score += 40;

        }


        if (
            lost.color &&
            found.color &&
            lost.color.toLowerCase() ===
            found.color.toLowerCase()
        ) {

            score += 20;

        }


        if (
            lost.location &&
            found.location &&
            lost.location.toLowerCase()
                .includes(
                    found.location.toLowerCase()
                )
        ) {

            score += 20;

        }


        const lostWords =
            lost.name
                .toLowerCase()
                .split(" ");


        const foundWords =
            found.name
                .toLowerCase()
                .split(" ");


        const commonWords =
            lostWords.filter(
                word =>
                    foundWords.includes(word)
            );


        if (commonWords.length > 0) {

            score += 20;

        }


        if (score >= 60) {

            matches++;

        }

    });

});


return matches;


}

// ==========================================
// RECENT REPORTS
// ==========================================

function displayRecentReports(items) {

const container =
    document.getElementById(
        "recentReports"
    );


if (!container) {
    return;
}


if (items.length === 0) {

    return;

}


const recent =
    [...items]
        .reverse()
        .slice(0, 6);


container.innerHTML =
    recent.map(function(item) {

        return `

            <article class="report-card">

                <span class="status ${item.type}">
                    ${item.type.toUpperCase()}
                </span>

                <h3>
                    ${escapeHTML(item.name)}
                </h3>

                <p>
                    ${escapeHTML(item.description)}
                </p>

                <div class="report-info">

                    📍
                    ${escapeHTML(item.location)}

                    <br>

                    📅
                    ${escapeHTML(item.date)}

                </div>

            </article>

        `;

    }).join("");


}

// ==========================================
// HTML SAFETY
// ==========================================

function escapeHTML(value) {

if (!value) {
    return "";
}


return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");


}

// ==========================================
// START DASHBOARD
// ==========================================

loadDashboard();
