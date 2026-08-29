const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");
const categoryList = document.querySelector(".category-list");
const returnButton = document.querySelector(".return-button");

menuButton.addEventListener("click", () => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
});

if (categoryList && returnButton) {
  const quizButton = document.createElement("button");
  quizButton.className = "topic-quiz-button";
  quizButton.textContent = "Take the quiz →";
  quizButton.type = "button";

  const quizPanel = document.createElement("section");
  quizPanel.className = "topic-quiz";
  quizPanel.hidden = true;
  quizPanel.innerHTML = `
    <div class="quiz-top">
      <span class="quiz-progress">Question 1 of 5</span>
      <span class="quiz-hearts" aria-label="3 hearts">❤️ ❤️ ❤️</span>
    </div>

    <div class="quiz-progress-bar">
      <span></span>
    </div>

    <p class="quiz-label">TRANSLATE THIS WORD</p>
    <h3 class="topic-question"></h3>
    <p class="quiz-prompt">Choose the correct English meaning.</p>

    <div class="topic-answers"></div>
    <p class="topic-feedback" aria-live="polite"></p>

    <button class="quiz-next-button" type="button" hidden>
      Continue →
    </button>

    <button class="quiz-restart-button" type="button" hidden>
      Try again
    </button>
  `;

  returnButton.before(quizButton);
  returnButton.before(quizPanel);

  const quizData = [...categoryList.querySelectorAll(".category-item")].map((item) => {
    const wordElement = item.querySelector("strong");
    const meaningElement = item.querySelector("span");

    const word = wordElement.cloneNode(true);
    word.querySelectorAll("small").forEach((small) => small.remove());

    return {
      word: word.textContent.trim(),
      meaning: meaningElement.textContent.trim()
    };
  });

  const totalQuestions = Math.min(5, quizData.length);
  let questions = [];
  let currentQuestion = 0;
  let hearts = 3;
  let answered = false;

  const progressText = quizPanel.querySelector(".quiz-progress");
  const progressBar = quizPanel.querySelector(".quiz-progress-bar span");
  const heartsText = quizPanel.querySelector(".quiz-hearts");
  const questionText = quizPanel.querySelector(".topic-question");
  const answersContainer = quizPanel.querySelector(".topic-answers");
  const feedback = quizPanel.querySelector(".topic-feedback");
  const nextButton = quizPanel.querySelector(".quiz-next-button");
  const restartButton = quizPanel.querySelector(".quiz-restart-button");

  function shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
  }

  function startQuiz() {
    questions = shuffle(quizData).slice(0, totalQuestions);
    currentQuestion = 0;
    hearts = 3;
    answered = false;

    quizButton.hidden = true;
    quizPanel.hidden = false;
    restartButton.hidden = true;

    showQuestion();
    quizPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function showQuestion() {
    const question = questions[currentQuestion];
    const wrongAnswers = shuffle(
      quizData
        .filter((item) => item.meaning !== question.meaning)
        .map((item) => item.meaning)
    ).slice(0, 2);

    const answers = shuffle([question.meaning, ...wrongAnswers]);

    progressText.textContent = `Question ${currentQuestion + 1} of ${totalQuestions}`;
    progressBar.style.width = `${(currentQuestion / totalQuestions) * 100}%`;
    heartsText.textContent = "❤️ ".repeat(hearts) + "🖤 ".repeat(3 - hearts);
    heartsText.setAttribute("aria-label", `${hearts} hearts remaining`);
    questionText.textContent = question.word;
    answersContainer.innerHTML = "";
    feedback.textContent = "";
    feedback.className = "topic-feedback";
    nextButton.hidden = true;
    answered = false;

    answers.forEach((answer) => {
      const answerButton = document.createElement("button");
      answerButton.className = "topic-answer";
      answerButton.type = "button";
      answerButton.textContent = answer;

      answerButton.addEventListener("click", () => {
        if (answered) return;

        if (answer === question.meaning) {
          answered = true;
          answerButton.classList.add("correct");
          feedback.textContent = "✓ Correct! Yindyss!";
          feedback.classList.add("correct-feedback");

          answersContainer.querySelectorAll("button").forEach((button) => {
            button.disabled = true;
          });

          if (currentQuestion === totalQuestions - 1) {
            nextButton.textContent = "Finish quiz";
          } else {
            nextButton.textContent = "Continue →";
          }

          nextButton.hidden = false;
        } else {
          hearts--;
          answerButton.classList.add("incorrect");
          answerButton.disabled = true;
          heartsText.textContent = "❤️ ".repeat(hearts) + "🖤 ".repeat(3 - hearts);
          heartsText.setAttribute("aria-label", `${hearts} hearts remaining`);
          feedback.textContent = hearts
            ? "Not quite. Try another answer!"
            : `The correct answer is “${question.meaning}”.`;

          if (!hearts) {
            answered = true;
            answersContainer.querySelectorAll("button").forEach((button) => {
              button.disabled = true;

              if (button.textContent === question.meaning) {
                button.classList.add("correct");
              }
            });

            nextButton.textContent = "Try again";
            nextButton.hidden = false;
          }
        }
      });

      answersContainer.appendChild(answerButton);
    });
  }

  nextButton.addEventListener("click", () => {
    if (!hearts) {
      startQuiz();
      return;
    }

    if (currentQuestion === totalQuestions - 1) {
      progressBar.style.width = "100%";
      questionText.textContent = "Quiz complete! 🎉";
      answersContainer.innerHTML = "";
      feedback.textContent = "Amazing work! You completed this topic.";
      feedback.className = "topic-feedback correct-feedback";
      nextButton.hidden = true;
      restartButton.hidden = false;
      return;
    }

    currentQuestion++;
    showQuestion();
  });

  restartButton.addEventListener("click", startQuiz);
  quizButton.addEventListener("click", startQuiz);

  const quizStyles = document.createElement("style");
  quizStyles.textContent = `
    .topic-quiz-button {
      background: var(--red);
      border: 0;
      color: var(--white);
      cursor: pointer;
      display: block;
      font: inherit;
      font-weight: 700;
      margin: 38px auto 0;
      padding: 16px 24px;
      transition: 0.25s ease;
    }

    .topic-quiz-button:hover,
    .quiz-next-button:hover,
    .quiz-restart-button:hover {
      background: var(--dark-red);
      transform: translateY(-3px);
    }

    .topic-quiz {
      background: var(--white);
      border: 4px solid var(--gold);
      border-radius: 18px;
      box-shadow: 0 12px 30px rgba(64, 22, 28, 0.14);
      margin: 38px auto 0;
      max-width: 700px;
      padding: 28px;
      text-align: center;
    }

    .quiz-top {
      align-items: center;
      color: var(--muted);
      display: flex;
      font-size: 0.85rem;
      font-weight: 700;
      justify-content: space-between;
      margin-bottom: 14px;
    }

    .quiz-hearts {
      letter-spacing: 2px;
    }

    .quiz-progress-bar {
      background: #eadccd;
      border-radius: 20px;
      height: 10px;
      margin-bottom: 32px;
      overflow: hidden;
    }

    .quiz-progress-bar span {
      background: var(--gold);
      border-radius: inherit;
      display: block;
      height: 100%;
      transition: width 0.3s ease;
      width: 0;
    }

    .quiz-label {
      color: var(--red);
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.16em;
      margin: 0;
    }

    .topic-question {
      color: var(--dark-red);
      font-family: "Playfair Display", serif;
      font-size: clamp(2.2rem, 6vw, 4rem);
      margin: 18px 0 8px;
    }

    .quiz-prompt {
      color: var(--muted);
      margin-bottom: 25px;
    }

    .topic-answers {
      display: grid;
      gap: 12px;
      grid-template-columns: 1fr;
      margin: auto;
      max-width: 500px;
    }

    .topic-answer {
      background: var(--cream);
      border: 2px solid #eadccd;
      border-radius: 10px;
      color: var(--ink);
      cursor: pointer;
      font: inherit;
      font-weight: 700;
      padding: 15px;
      text-align: left;
      transition: 0.2s ease;
    }

    .topic-answer:hover:not(:disabled) {
      border-color: var(--gold);
      transform: translateX(4px);
    }

    .topic-answer.correct {
      background: #dff4df;
      border-color: #46a447;
      color: #246b28;
    }

    .topic-answer.incorrect {
      background: #ffe1e1;
      border-color: var(--red);
      color: var(--red);
    }

    .topic-feedback {
      color: var(--red);
      font-weight: 700;
      min-height: 26px;
    }

    .correct-feedback {
      color: #29832d;
    }

    .quiz-next-button,
    .quiz-restart-button {
      background: var(--gold);
      border: 0;
      color: var(--ink);
      cursor: pointer;
      font: inherit;
      font-weight: 700;
      margin-top: 12px;
      padding: 14px 24px;
      transition: 0.25s ease;
    }

    @media (max-width: 500px) {
      .topic-quiz {
        padding: 20px 15px;
      }

      .quiz-top {
        align-items: flex-start;
        flex-direction: column;
        gap: 8px;
      }
    }
  `;

  document.head.appendChild(quizStyles);
}
