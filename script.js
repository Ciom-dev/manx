const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");
const factButton = document.getElementById("factButton");
const fact = document.getElementById("fact");
const quizQuestion = document.getElementById("quizQuestion");
const quizAnswers = document.getElementById("quizAnswers");
const quizResult = document.getElementById("quizResult");

menuButton.addEventListener("click", () => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-label", "Open navigation menu");
  });
});

document.querySelectorAll(".phrase-card").forEach((card) => {
  card.addEventListener("click", () => {
    const isActive = card.classList.toggle("active");
    const meaning = card.dataset.meaning;
    const instruction = card.querySelector("small");

    instruction.textContent = isActive
      ? meaning
      : "Click to reveal translation";
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

  if (factIndex === facts.length - 1) {
    factButton.textContent = "All facts revealed!";
    factButton.disabled = true;
    factButton.setAttribute("aria-disabled", "true");
    return;
  }

  factIndex++;
  factButton.textContent = "Show another fact";
});

const quizQuestions = [
  {
    word: "Slaynt!",
    correct: "Cheers!",
    answers: ["Good night", "Cheers!", "Welcome"]
  },
  {
    word: "Moghrey",
    correct: "Morning",
    answers: ["Morning", "House", "Love"]
  },
  {
    word: "Graih",
    correct: "Love",
    answers: ["Friend", "Love", "Day"]
  },
  {
    word: "Mannin",
    correct: "The Isle of Man",
    answers: ["The Isle of Man", "Thank you", "Good"]
  }
];

let currentQuestion = 0;
let quizFinished = false;

function showQuizQuestion() {
  const question = quizQuestions[currentQuestion];

  quizQuestion.textContent = `What does “${question.word}” mean?`;
  quizAnswers.innerHTML = "";
  quizResult.textContent = "";

  question.answers.forEach((answer) => {
    const button = document.createElement("button");

    button.className = "answer-button";
    button.type = "button";
    button.textContent = answer;
    button.dataset.correct = answer === question.correct;

    button.addEventListener("click", () => {
      if (quizFinished) return;

      if (button.dataset.correct === "true") {
        if (currentQuestion === quizQuestions.length - 1) {
          quizFinished = true;
          quizResult.innerHTML =
            '✓ Yindyss! That’s correct. <a href="page1.html">Check the vocabulary page to learn more.</a>';

          document.querySelectorAll(".answer-button").forEach((answerButton) => {
            answerButton.disabled = true;
          });
        } else {
          quizResult.textContent = "✓ Yindyss! That's correct.";
          currentQuestion++;
          setTimeout(showQuizQuestion, 700);
        }
      } else {
        quizResult.textContent = "Not quite — try another answer!";
        button.disabled = true;
      }
    });

    quizAnswers.appendChild(button);
  });
}

const revealSections = document.querySelectorAll(
  ".intro-section, .phrases-section, .explore-strip, .quiz-section"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealSections.forEach((section) => {
  section.classList.add("reveal-section");
  revealObserver.observe(section);
});

showQuizQuestion();
