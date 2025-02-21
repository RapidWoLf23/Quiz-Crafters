document.addEventListener("DOMContentLoaded", function () {
    let questions = [
        { question: "What is the capital of France?", options: ["Paris", "London", "Berlin", "Madrid"], answer: "Paris" },
        { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: "Mars" },
        { question: "What is the largest mammal?", options: ["Elephant", "Blue Whale", "Giraffe", "Dolphin"], answer: "Blue Whale" },
        { question: "Who wrote 'Hamlet'?", options: ["Shakespeare", "Hemingway", "Austen", "Orwell"], answer: "Shakespeare" },
        { question: "Which element has the chemical symbol 'O'?", options: ["Oxygen", "Gold", "Silver", "Iron"], answer: "Oxygen" },
        // Add more questions to total 50 and shuffle
    ];

    // Shuffle questions and pick 10
    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    let selectedQuestions = shuffle(questions).slice(0, 10);

    let questionContainer = document.getElementById("question-container");
    let submitBtn = document.getElementById("submitBtn");
    let resultContainer = document.getElementById("result-container");
    let retryBtn = document.getElementById("retryBtn");
    let timerElement = document.getElementById("time");
    
    let userAnswers = {};
    let timer = 20 * 60; // 20 minutes in seconds

    function startTimer() {
        let interval = setInterval(() => {
            let minutes = Math.floor(timer / 60);
            let seconds = timer % 60;
            timerElement.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
            if (timer === 0) {
                clearInterval(interval);
                endQuiz();
            }
            timer--;
        }, 1000);
    }

    function displayQuestions() {
        questionContainer.innerHTML = "";
        selectedQuestions.forEach((q, index) => {
            let div = document.createElement("div");
            div.classList.add("question");
            div.innerHTML = `<p>${index + 1}. ${q.question}</p>`;
            q.options.forEach(option => {
                div.innerHTML += `<label><input type="radio" name="q${index}" value="${option}"> ${option}</label><br>`;
            });
            questionContainer.appendChild(div);
        });
    }

    submitBtn.addEventListener("click", function () {
        selectedQuestions.forEach((q, index) => {
            let selected = document.querySelector(`input[name="q${index}"]:checked`);
            if (selected) {
                userAnswers[index] = selected.value;
            }
        });
        endQuiz();
    });

    function endQuiz() {
        questionContainer.style.display = "none";
        submitBtn.style.display = "none";
        resultContainer.style.display = "block";
    }

    retryBtn.addEventListener("click", function () {
        location.reload();
    });

    startTimer();
    displayQuestions();
});
