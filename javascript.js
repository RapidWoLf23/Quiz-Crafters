const questions = [
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
    { question: "Which of these is a modal verb?", options: ["Run", "Can", "Jump", "Quickly"], answer: "Can" },
    { question: "What is the plural of 'mouse' (the animal)?", options: ["Mouses", "Mice", "Mousees", "Mices"], answer: "Mice" },
    { question: "Which of these is an example of a metaphor?", options: ["Her smile was a ray of sunshine.", "She is as sweet as sugar.", "The wind howled.", "The stars twinkled."], answer: "Her smile was a ray of sunshine." },
    { question: "What is the meaning of 'meticulous'?", options: ["Careless", "Detailed", "Lazy", "Angry"], answer: "Detailed" },
    { question: "Which word is an adverb?", options: ["Quickly", "Run", "Happy", "Sun"], answer: "Quickly" },
    { question: "What is the opposite of 'victory'?", options: ["Success", "Defeat", "Win", "Triumph"], answer: "Defeat" },
    { question: "Which of these is a synonym for 'brave'?", options: ["Cowardly", "Fearful", "Courageous", "Timid"], answer: "Courageous" },
    { question: "What is the meaning of 'ambiguous'?", options: ["Clear", "Unclear", "Happy", "Sad"], answer: "Unclear" },
    { question: "Which of these is an example of personification?", options: ["The wind whispered through the trees.", "The cat sat on the mat.", "She is as tall as a tree.", "The sun is a golden ball."], answer: "The wind whispered through the trees." },
    { question: "What is the plural of 'leaf'?", options: ["Leafs", "Leaves", "Leafes", "Leafies"], answer: "Leaves" },
    { question: "Which of these is a synonym for 'angry'?", options: ["Happy", "Furious", "Calm", "Sad"], answer: "Furious" },
    { question: "What is the meaning of 'nostalgia'?", options: ["Fear of the future", "Longing for the past", "Happiness", "Anger"], answer: "Longing for the past" },
    { question: "Which of these is an example of a simile?", options: ["Her eyes were stars.", "She is as brave as a lion.", "The wind howled.", "The sun smiled."], answer: "She is as brave as a lion." },
    { question: "What is the plural of 'knife'?", options: ["Knifes", "Knives", "Knifees", "Knivies"], answer: "Knives" },
    { question: "Which of these is a synonym for 'sad'?", options: ["Happy", "Joyful", "Miserable", "Excited"], answer: "Miserable" },
    { question: "What is the meaning of 'resilient'?", options: ["Fragile", "Strong", "Weak", "Flexible"], answer: "Flexible" },
    { question: "Which of these is an example of hyperbole?", options: ["I'm so hungry I could eat a horse.", "The sky is blue.", "She is tall.", "The cat sat on the mat."], answer: "I'm so hungry I could eat a horse." },
    { question: "What is the plural of 'deer'?", options: ["Deers", "Deer", "Deeres", "Deeries"], answer: "Deer" },
    { question: "Which of these is a synonym for 'smart'?", options: ["Dumb", "Intelligent", "Slow", "Lazy"], answer: "Intelligent" },
    { question: "What is the meaning of 'verbose'?", options: ["Concise", "Wordy", "Quiet", "Loud"], answer: "Wordy" },
    { question: "Which of these is an example of onomatopoeia?", options: ["Buzz", "Run", "Happy", "Sun"], answer: "Buzz" },
    { question: "What is the plural of 'sheep'?", options: ["Sheeps", "Sheep", "Sheepes", "Sheepies"], answer: "Sheep" },
    { question: "Which of these is a synonym for 'quick'?", options: ["Slow", "Fast", "Lazy", "Angry"], answer: "Fast" },
    { question: "What is the meaning of 'altruistic'?", options: ["Selfish", "Selfless", "Angry", "Lazy"], answer: "Selfless" },
    { question: "Which of these is an example of irony?", options: ["A fire station burns down.", "The sky is blue.", "She is tall.", "The cat sat on the mat."], answer: "A fire station burns down." },
    { question: "What is the plural of 'fish'?", options: ["Fishs", "Fish", "Fishes", "Fishies"], answer: "Fish" },
    { question: "Which of these is a synonym for 'big'?", options: ["Small", "Large", "Tiny", "Little"], answer: "Large" }
];

let currentQuestionIndex = 0;
let shuffledQuestions = [];
let score = 0;
let timer;
let timeLeft = 1200; // 20 minutes

// Shuffle questions and start quiz
function confirmStart() {
    if (confirm("Do you want to start the test?")) {
        location.href = "test.html";
        shuffledQuestions = questions.sort(() => Math.random() - 0.5).slice(0, 10);
        localStorage.setItem("quizData", JSON.stringify(shuffledQuestions));
    }
}

// Load questions on test page
window.onload = function () {
    if (window.location.pathname.includes("test.html")) {
        shuffledQuestions = JSON.parse(localStorage.getItem("quizData"));
        displayQuestion();
        startTimer();
    }
};

function displayQuestion() {
    let container = document.getElementById("questionContainer");
    container.innerHTML = `
        <h2>${shuffledQuestions[currentQuestionIndex].question}</h2>
        ${shuffledQuestions[currentQuestionIndex].options.map(opt => 
            `<button class="optionBtn" onclick="selectAnswer('${opt}')">${opt}</button>`
        ).join("")}
    `;
    updateProgress();
}

function nextQuestion() {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        alert("This is the last question. Click Submit to finish the test.");
    }
}

function selectAnswer(selected) {
    if (selected === shuffledQuestions[currentQuestionIndex].answer) {
        score++;
    }
    nextQuestion();
}

// Timer function
function startTimer() {
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Time is up! Submitting test...");
            submitTest();
        } else {
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            document.getElementById("timer").innerText = `Time Left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
            timeLeft--;
        }
    }, 1000);
}

// Submit test and show result
function submitTest() {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
        if (!confirm("You have unanswered questions. Submit anyway?")) return;
    }
    
    clearInterval(timer);
    document.body.innerHTML = `
        <h1>Your Score: ${score}/10</h1>
        <p id="thankYouMessage">🎉 Congratulations! Thank you for taking the test! 🎉</p>
        <button onclick="location.href='index.html'">Retry</button>
    `;
}

// Update progress bar
function updateProgress() {
    let progress = (currentQuestionIndex + 1) / shuffledQuestions.length * 100;
    document.getElementById("progress").style.width = `${progress}%`;
}

// Suggestion Box Functionality
function openSuggestionBox() {
    let suggestion = prompt("Enter your suggestion:");
    if (suggestion) {
        localStorage.setItem("suggestion", suggestion);
        alert("Suggestion saved!");
    }
}
