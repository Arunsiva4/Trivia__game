// --- DOM Elements ---
const startButton = document.getElementById('startButton');
const playAgainButton = document.getElementById('playAgainButton');
const gameControls = document.getElementById('game-controls');
const quizArea = document.getElementById('quiz-area');
const endScreen = document.getElementById('end-screen');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('time');
const finalScoreDisplay = document.getElementById('final-score');
const totalQuestionsDisplay = document.getElementById('total-questions');
const feedbackElement = document.getElementById('feedback');

// --- Game State Variables ---
let shuffledQuestions;
let currentQuestionIndex;
let score;
let timeLeft;
let timerInterval;
const TIME_PER_QUESTION = 10; // seconds

// --- Quiz Questions ---
const questions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Rome"],
        correctAnswer: "Paris"
    },
    {
        question: "Which planet is known as the 'Red Planet'?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        correctAnswer: "Mars"
    },
    {
        question: "What is 7 multiplied by 8?",
        options: ["42", "56", "64", "72"],
        correctAnswer: "56"
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctAnswer: "Pacific Ocean"
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
        correctAnswer: "Leonardo da Vinci"
    },
    {
        question: "What is the chemical symbol for water?",
        options: ["H2O2", "CO2", "H2O", "O2"],
        correctAnswer: "H2O"
    },
    {
        question: "Which country is famous for the Great Wall?",
        options: ["India", "Japan", "China", "Egypt"],
        correctAnswer: "China"
    },
    {
        question: "What is the fastest land animal?",
        options: ["Lion", "Cheetah", "Gazelle", "Horse"],
        correctAnswer: "Cheetah"
    },
    {
        question: "How many continents are there?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "7"
    },
    {
        question: "What is the currency of Japan?",
        options: ["Yuan", "Won", "Yen", "Dollar"],
        correctAnswer: "Yen"
    }
];

// --- Event Listeners ---
startButton.addEventListener('click', startGame);
playAgainButton.addEventListener('click', startGame);

// --- Game Functions ---

function startGame() {
    console.log("Game Started!");
    score = 0;
    currentQuestionIndex = 0;
    shuffledQuestions = questions.sort(() => Math.random() - 0.5); // Shuffle questions
    scoreDisplay.textContent = score; // Reset score display

    // Hide start/end screens, show quiz area
    gameControls.classList.add('hide');
    endScreen.classList.add('hide');
    quizArea.classList.remove('hide');
    feedbackElement.classList.add('hide'); // Hide previous feedback

    setNextQuestion();
}

function setNextQuestion() {
    resetState(); // Clear previous buttons and feedback

    if (currentQuestionIndex < shuffledQuestions.length) {
        startTimer();
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    } else {
        endGame();
    }
}

function showQuestion(question) {
    questionElement.textContent = question.question;
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('btn');
        if (option === question.correctAnswer) {
            button.dataset.correct = true; // Mark correct answer
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearInterval(timerInterval); // Stop any existing timer
    timerDisplay.textContent = TIME_PER_QUESTION; // Reset timer display
    feedbackElement.classList.add('hide'); // Hide feedback
    feedbackElement.classList.remove('correct', 'incorrect'); // Remove colors

    // Clear previous answer buttons
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    clearInterval(timerInterval); // Stop timer immediately when an answer is selected
    const selectedButton = e.target;
    const isCorrect = selectedButton.dataset.correct === "true";

    if (isCorrect) {
        score++;
        scoreDisplay.textContent = score;
        feedbackElement.textContent = "Correct!";
        feedbackElement.classList.add('correct');
    } else {
        feedbackElement.textContent = "Incorrect!";
        feedbackElement.classList.add('incorrect');
    }
    feedbackElement.classList.remove('hide');

    // Apply styles to all buttons to show correct/incorrect
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add('correct');
        } else {
            // Only mark selected incorrect button as incorrect, others remain neutral
            if (button === selectedButton) {
                button.classList.add('incorrect');
            }
        }
        button.disabled = true; // Disable all buttons after selection
    });

    // Move to next question after a short delay
    setTimeout(() => {
        currentQuestionIndex++;
        setNextQuestion();
    }, 1000); // 1.5 seconds delay
}

function startTimer() {
    timeLeft = TIME_PER_QUESTION;
    timerDisplay.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // Automatically mark answer as incorrect if time runs out
            feedbackElement.textContent = "Time's up!";
            feedbackElement.classList.add('incorrect');
            feedbackElement.classList.remove('hide');

            // Show the correct answer
            Array.from(answerButtonsElement.children).forEach(button => {
                if (button.dataset.correct === "true") {
                    button.classList.add('correct');
                }
                button.disabled = true; // Disable all buttons
            });

            setTimeout(() => {
                currentQuestionIndex++;
                setNextQuestion();
            }, 1500);
        }
    }, 1000); // Update every 1 second
}

function endGame() {
    clearInterval(timerInterval); // Ensure timer is stopped
    quizArea.classList.add('hide');
    endScreen.classList.remove('hide');
    finalScoreDisplay.textContent = score;
    totalQuestionsDisplay.textContent = questions.length;
}

// --- Initial Setup ---
// Initially hide quiz and end screens
quizArea.classList.add('hide');
endScreen.classList.add('hide');