function normalize(value) {
  if (!value) return "";

  return value
    .toString()
    .trim()
    .toLowerCase();
}

function words(value) {
  return normalize(value)
    .split(/\s+/)
    .filter(Boolean);
}

function calculateMatchScore(item1, item2) {
  let score = 0;

  const category1 = normalize(item1.category);
  const category2 = normalize(item2.category);

  const color1 = normalize(item1.color);
  const color2 = normalize(item2.color);

  const location1 = normalize(item1.location);
  const location2 = normalize(item2.location);

  const name1 = normalize(item1.itemName);
  const name2 = normalize(item2.itemName);

  // Category - 30 points
  if (category1 && category1 === category2) {
    score += 30;
  }

  // Color - 20 points
  if (color1 && color1 === color2) {
    score += 20;
  }

  // Location - 25 points
  if (location1 && location1 === location2) {
    score += 25;
  }

  // Item name - 25 points
  if (name1 && name2) {
    if (name1 === name2) {
      score += 25;
    } else {
      const nameWords1 = words(name1);
      const nameWords2 = words(name2);

      const commonWords = nameWords1.filter(
        word => nameWords2.includes(word)
      );

      if (commonWords.length > 0) {
        score += 15;
      }
    }
  }

  return score;
}

module.exports = {
  calculateMatchScore
};
