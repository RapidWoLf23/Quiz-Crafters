document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById("submit"); // Start Quiz button
    const questionElement = document.getElementById("question"); // Question display
    const optionsContainer = document.getElementById("options"); // Options display

    let currentQuestionIndex = 0;
    let quizStarted = false;
    let score = 0;

    // Sample questions
    const questions = [
        { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Lisbon"], answer: "Paris" },
        { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: "Mars" },
        { question: "What is the past tense of 'go'?", options: ["Went", "Gone", "Goed", "Going"], answer: "Went" }
    ];

    // Function to start quiz with confirmation
    startBtn.addEventListener("click", function () {
        let confirmStart = confirm("Are you sure you want to start the quiz?");
        if (confirmStart) {
            quizStarted = true;
            startBtn.style.display = "none"; // Hide start button
            loadQuestion();
        }
    });

    // Function to load questions
    function loadQuestion() {
        if (currentQuestionIndex < questions.length) {
            const currentQuestion = questions[currentQuestionIndex];
            questionElement.textContent = currentQuestion.question;
            
            optionsContainer.innerHTML = "";
            currentQuestion.options.forEach(option => {
                const button = document.createElement("button");
                button.textContent = option;
                button.classList.add("option-btn");
                button.onclick = () => checkAnswer(button, option);
                optionsContainer.appendChild(button);
            });
        } else {
            showResults();
        }
    }

    // Function to check answer
    function checkAnswer(button, selectedOption) {
        const correctAnswer = questions[currentQuestionIndex].answer;

        // Disable all buttons after selection
        Array.from(optionsContainer.children).forEach(btn => btn.disabled = true);

        if (selectedOption === correctAnswer) {
            button.style.backgroundColor = "green"; // Highlight correct answer
            score++;
        } else {
            button.style.backgroundColor = "red"; // Highlight wrong answer
        }

        setTimeout(() => {
            currentQuestionIndex++;
            loadQuestion();
        }, 1000);
    }

    // Function to show results
    function showResults() {
        questionElement.textContent = `Quiz Complete! Your score: ${score}/${questions.length}`;
        optionsContainer.innerHTML = "";
    }
});
