document.addEventListener("DOMContentLoaded", function () {
    // 50 Questions Array (Inserted as requested)
    let questions = [
        { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Lisbon"], answer: "Paris" },
        { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: "Mars" },
        { question: "What is the past tense of 'go'?", options: ["Went", "Gone", "Goed", "Going"], answer: "Went" },
        { question: "Which of these is a synonym for 'happy'?", options: ["Sad", "Joyful", "Angry", "Bored"], answer: "Joyful" },
        { question: "What is the plural of 'child'?", options: ["Childs", "Children", "Childes", "Child"], answer: "Children" },
        { question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], answer: "William Shakespeare" },
        { question: "What is the opposite of 'beneath'?", options: ["Above", "Below", "Under", "Beside"], answer: "Above" },
        { question: "Which word is a noun?", options: ["Run", "Beautiful", "Happiness", "Quickly"], answer: "Happiness" },
        { question: "What is the comparative form of 'good'?", options: ["Gooder", "Better", "Best", "Well"], answer: "Better" },
        { question: "Which punctuation mark is used at the end of a question?", options: [".", ",", "!", "?"], answer: "?" },
        { question: "What is the literary term for the main character in a story?", options: ["Antagonist", "Protagonist", "Narrator", "Foil"], answer: "Protagonist" },
        { question: "Which of these is a preposition?", options: ["Quickly", "And", "Under", "Jump"], answer: "Under" },
        { question: "What is the meaning of 'benevolent'?", options: ["Kind", "Evil", "Lazy", "Angry"], answer: "Kind" },
        { question: "Which sentence is in the passive voice?", options: ["The cat chased the mouse.", "The mouse was chased by the cat.", "The cat is chasing the mouse.", "The mouse chased the cat."], answer: "The mouse was chased by the cat." },
        { question: "What is the superlative form of 'far'?", options: ["Farther", "Farthest", "Farer", "Farest"], answer: "Farthest" },
        { question: "Which of these is a compound word?", options: ["Sunflower", "Running", "Beautiful", "Happiness"], answer: "Sunflower" },
        { question: "What is the meaning of 'ephemeral'?", options: ["Lasting a short time", "Eternal", "Difficult", "Bright"], answer: "Lasting a short time" },
        { question: "Which word is spelled correctly?", options: ["Recieve", "Achieve", "Decieve", "Perceive"], answer: "Achieve" },
        { question: "What is the literary term for a play on words?", options: ["Metaphor", "Simile", "Pun", "Alliteration"], answer: "Pun" },
        { question: "Which of these is a conjunction?", options: ["But", "Run", "Quickly", "Under"], answer: "But" },
        { question: "What is the past participle of 'eat'?", options: ["Ate", "Eaten", "Eating", "Eats"], answer: "Eaten" },
        { question: "Which of these is an example of alliteration?", options: ["She sells seashells by the seashore.", "The cat sat on the mat.", "I am so tired.", "Run as fast as you can."], answer: "She sells seashells by the seashore." },
        { question: "What is the meaning of 'gregarious'?", options: ["Shy", "Sociable", "Angry", "Lazy"], answer: "Sociable" },
        { question: "Which of these is a modal verb?", options: ["Run", "Can", "Jump", "Quickly"], answer: "Can" }
    ];
// Shuffle function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleArray(questions); // Shuffle the questions

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 120; // 2-minute timer
let timerInterval;

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const submitButton = document.getElementById("submit");
const resultElement = document.getElementById("result");
const timerElement = document.getElementById("timer");

// Start Timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000);
}

// Display question
function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }

    let currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    optionsElement.innerHTML = "";

    currentQuestion.options.forEach(option => {
        let button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option-btn");
        button.onclick = () => selectAnswer(option);
        optionsElement.appendChild(button);
    });
}

// Select answer
function selectAnswer(selected) {
    let correct = questions[currentQuestionIndex].answer;
    if (selected === correct) {
        score++;
    }
    currentQuestionIndex++;
    displayQuestion();
}

// End Quiz
function endQuiz() {
    clearInterval(timerInterval);
    questionElement.textContent = "Quiz Over!";
    optionsElement.innerHTML = `Your Score: ${score}/${questions.length}`;
    submitButton.style.display = "none";
}

// Start the quiz
submitButton.addEventListener("click", () => {
    startTimer();
    submitButton.style.display = "none";
    displayQuestion();
});
