const question = document.getElementById("question")
const choices = Array.from(document.getElementsByClassName("choice-text"))
const progressText = document.getElementById("progressText")
const progressBarFull = document.getElementById("progressBarFull")
const scoreText = document.getElementById("score")

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let avaliableQuestion = [];

let questions = [];
fetch("questions.json")
    .then(res => {
        return res.json();
    })
    .then(loadedQuestions => {
        questions = loadedQuestions;
        console.log(questions)
        startGame();
    })
    .catch(err => {
        console.error(err)
    })

// CONSTANTS

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    avaliableQuestion = [... questions]
    getNewQuestion();
}

getNewQuestion = () => {
    if (avaliableQuestion.length == 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('/end.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    const questionIndex = Math.floor(Math.random() * avaliableQuestion.length);
    currentQuestion = avaliableQuestion[questionIndex];
    question.innerText = currentQuestion.question;
    progressBarFull.style.width = `${( questionCounter / MAX_QUESTIONS ) * 100}%`;

    choices.forEach( choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    })
    avaliableQuestion.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach( choice => {
    choice.addEventListener("click", e => { 
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        const classToApply = 
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'
        selectedChoice.parentElement.classList.add(classToApply)
        if (classToApply == 'correct') {
            incrementScore(CORRECT_BONUS)
        }

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion();
        }, 1000)

});
})

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}
