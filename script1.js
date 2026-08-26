const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");
const wordSearch = document.getElementById("wordSearch");
const wordCards = document.querySelectorAll(".word-card");

menuButton.addEventListener("click", () => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
});

wordSearch.addEventListener("input", () => {
  const searchTerm = wordSearch.value.toLowerCase().trim();

  wordCards.forEach((card) => {
    const word = card.textContent.toLowerCase();
    card.hidden = !word.includes(searchTerm);
  });
});