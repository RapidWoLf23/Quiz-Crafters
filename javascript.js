document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById("submit"); // Start Quiz button
    const questionElement = document.getElementById("question"); // Question display
    const optionsContainer = document.getElementById("options"); // Options display
    const nextBtn = document.getElementById("next"); // Next Question button
    const timerElement = document.getElementById("timer"); // Timer display
    let currentQuestionIndex = 0;
    let quizStarted = false;
    let score = 0;
    let selectedQuestions = [];
    let timer;
    let timeLeft = 1200; // 20 minutes in seconds

    // All 50 questions (unchanged, keep your full question list here)
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

    // Function to shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Function to start the timer
    function startTimer() {
        timer = setInterval(() => {
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            timerElement.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (timeLeft === 0) {
                clearInterval(timer);
                endQuiz("Time's up!");
            }

            timeLeft--;
        }, 1000);
    }

    // Function to start quiz with confirmation
    startBtn.addEventListener("click", function () {
        let confirmStart = confirm("Are you sure you want to start the quiz?");
        if (confirmStart) {
            quizStarted = true;
            startBtn.style.display = "none"; // Hide start button
            nextBtn.style.display = "block"; // Show Next button
            startTimer();
            startQuiz();
        }
    });

    // Function to select 10 random questions
    function startQuiz() {
        shuffleArray(questions);
        selectedQuestions = questions.slice(0, 10);
        currentQuestionIndex = 0;
        score = 0;
        loadQuestion();
    }

    // Function to load questions
    function loadQuestion() {
        if (currentQuestionIndex < selectedQuestions.length) {
            const currentQuestion = selectedQuestions[currentQuestionIndex];
            questionElement.textContent = `Q${currentQuestionIndex + 1}: ${currentQuestion.question}`;

            optionsContainer.innerHTML = "";
            shuffleArray(currentQuestion.options);
            currentQuestion.options.forEach(option => {
                const button = document.createElement("button");
                button.textContent = option;
                button.classList.add("option-btn");
                button.onclick = () => checkAnswer(button, option);
                optionsContainer.appendChild(button);
            });

            // Hide next button on the last question
            if (currentQuestionIndex === selectedQuestions.length - 1) {
                nextBtn.style.display = "none";
                startBtn.style.display = "block"; // Show Submit button
                startBtn.textContent = "Submit"; // Change button text to "Submit"
            } else {
                nextBtn.style.display = "block";
                startBtn.style.display = "none";
            }

        } else {
            showResults();
        }
    }

    // Function to check answer
    function checkAnswer(button, selectedOption) {
        const correctAnswer = selectedQuestions[currentQuestionIndex].answer;
        Array.from(optionsContainer.children).forEach(btn => btn.disabled = true);

        if (selectedOption === correctAnswer) {
            button.style.backgroundColor = "green";
            score++;
        } else {
            button.style.backgroundColor = "red";
        }
    }

    // Next button functionality
    nextBtn.addEventListener("click", function () {
        if (quizStarted && currentQuestionIndex < selectedQuestions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            showResults();
        }
    });

    // Function to show results
    function showResults() {
        clearInterval(timer); // Stop timer when quiz ends
        endQuiz(`Quiz Complete! Your score: ${score}/10`);
    }

    // Function to end quiz (handles both normal and timer expiration)
    function endQuiz(message) {
        questionElement.textContent = message;
        optionsContainer.innerHTML = "";
        nextBtn.style.display = "none";
        startBtn.style.display = "none";
    }
});
