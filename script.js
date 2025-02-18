const allQuestions = [
    // Here you should add all 500 English MCQs. For now, I am adding a small subset.
    {
        question: "What is the capital of England?",
        options: ["London", "Paris", "Berlin", "Madrid"],
        answer: "London"
    },
    {
        question: "Which of these is a synonym for 'happy'?",
        options: ["Sad", "Joyful", "Angry", "Calm"],
        answer: "Joyful"
    },
    // Add 498 more questions here...
];

document.addEventListener('DOMContentLoaded', function() {
    // Handle click on "Take the Test" tab with animation
    document.getElementById('take-test-tab').addEventListener('click', function(e) {
        e.preventDefault();
        const takeTestSection = document.getElementById('take-test');
        takeTestSection.classList.remove('hidden');
    });

    // Function to start the test
    function startTest(subject) {
        if (subject === 'English') {
            // Select random 10 questions (you can change the number as needed)
            const randomQuestions = getRandomQuestions(10);
            // Display these questions or handle the quiz logic here
            alert(`You are starting the English test with ${randomQuestions.length} questions!`);
            randomQuestions.forEach((q, index) => {
                console.log(`Q${index + 1}: ${q.question}`);
                q.options.forEach((opt, i) => console.log(`Option ${i + 1}: ${opt}`));
            });
        }
    }

    // Function to get random questions
    function getRandomQuestions(number) {
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, number);
    }

    // Expose startTest function for button onclick
    window.startTest = startTest;
});
