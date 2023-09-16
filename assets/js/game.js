const question = document.getElementById("question");

const choices = Array.from(document.querySelectorAll(".choice-text"));
// ? Array.from -> returns an array

const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");
const loader = document.getElementById('loader');
const game = document.getElementById('game');

const progressBar = document.querySelector('.progress-bar-full');


let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=17&difficulty=easy&type=multiple").then(res => { 
  return res.json();
}).then(loadedQuestions => {
  questions = loadedQuestions.results.map(loadedQuestions => {
    const formattedQuestions = {
      question: loadedQuestions.question
    };

    const answerChoice = [...loadedQuestions.incorrect_answers]
    formattedQuestions.answer = Math.floor(Math.random() * 3) + 1;
    answerChoice.splice(formattedQuestions.answer - 1, 0, loadedQuestions.correct_answer);

    answerChoice.forEach((choice, index) => {
      formattedQuestions['choice' + (index + 1)] = choice;
    })

    return formattedQuestions;
  })
 
  startGame();
})
 .catch(error => {
  console.error(error);
 })

const correctBonus = 10;
const MAX_QUESTIONS = 10;

const startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  game.classList.remove('hide');
  loader.style.display = 'none';
};

const getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    // go to end page
    localStorage.setItem('mostRecentScore', score)
    return window.location.assign("end.html");
  }

  questionCounter++;
  
  questionCounterText.textContent = `${questionCounter}/${questions.length}` 
  progressBar.style.width = `${questionCounter/questions.length * 100}%`


  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.textContent = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.textContent = currentQuestion["choice" + number];
  });
  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;

    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply =
      selectedAnswer == currentQuestion.answer
        ? "correct__ans"
        : "incorrect__ans";

    if(classToApply === 'correct__ans'){
        incrementScore(correctBonus);
    }
    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

const incrementScore = number => {
    score += number
    scoreText.textContent = score
}