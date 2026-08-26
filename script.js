const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");
const factButton = document.getElementById("factButton");
const fact = document.getElementById("fact");
const themeButton = document.getElementById("themeButton");

menuButton.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".phrase-card").forEach((card) => {
  card.addEventListener("click", () => {
    const isActive = card.classList.toggle("active");
    const meaning = card.dataset.meaning;
    const instruction = card.querySelector("small");

    instruction.textContent = isActive ? meaning : "Click to reveal translation";
  });
});

const facts = [
  "Manx is a Goidelic Celtic language, related to Irish and Scottish Gaelic.",
  "The Manx word for the Isle of Man is Mannin.",
  "Manx Gaelic is taught at the island's only Manx-medium primary school, Bunscoill Ghaelgagh."
];

let factIndex = 0;

factButton.addEventListener("click", () => {
  fact.textContent = facts[factIndex];
  factIndex = (factIndex + 1) % facts.length;
  factButton.textContent = "Show another fact";
});

document.querySelectorAll(".answer-button").forEach((button) => {
  button.addEventListener("click", () => {
    const result = document.getElementById("quizResult");

    if (button.dataset.correct === "true") {
      result.textContent = "✓ Yindyss! That's correct.";
      result.style.color = "#f4c95d";
    } else {
      result.textContent = "Not quite — try another answer!";
      result.style.color = "#ffb3b3";
    }
  });
});

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("night");
  themeButton.textContent = document.body.classList.contains("night")
    ? "Return to daylight"
    : "Toggle island night";
});