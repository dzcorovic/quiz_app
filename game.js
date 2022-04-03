const question = document.getElementById("question")
const choices = Array.from(document.getElementsByClassName("choice-text"))
const progressText = document.getElementById("progressText")
const progressBarFull = document.getElementById("progressBarFull")
const scoreText = document.getElementById("score")
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let avaliableQuestion = [];

let questions = [];
fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
    .then(res => {
        return res.json();
    })
    .then(loadedQuestions => {
        questions = loadedQuestions.results.map(loadedQuestion => {
            const formatedQuestion = {
                question: loadedQuestion.question
            };
            const answerChoices = [... loadedQuestion.incorrect_answers];
            
            formatedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            answerChoices.splice(
                formatedQuestion.answer -1,
                0,
                loadedQuestion.correct_answer
            );
            answerChoices.forEach((choice, index) => {
                formatedQuestion["choice" + (index+1)] = choice;
            })
            return formatedQuestion;
        })
        startGame();
    })
    .catch(err => {
        console.error(err)
    })

// CONSTANTS

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    avaliableQuestion = [... questions]
    getNewQuestion();
    game.style.display = 'flex';
    loader.style.display = 'none';
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
