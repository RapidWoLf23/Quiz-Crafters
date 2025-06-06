import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Included for Firebase setup, though not directly used for quiz data persistence in this version.

// Main App component
const App = () => {
    // Firebase related states
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // Page state: Controls which page is currently displayed
    const [currentPage, setCurrentPage] = useState('welcome'); // Possible values: 'welcome', 'details', 'loading', 'quiz', 'confirm', 'results'

    // Quiz details state: Stores user inputs for quiz generation
    const [userName, setUserName] = useState('');
    const [subject, setSubject] = useState('');
    const [specificTopic, setSpecificTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(5); // Default number of questions
    const [difficulty, setDifficulty] = useState('easy'); // Default difficulty level

    // Quiz dynamic content state: Stores generated questions and user answers
    const [quizQuestions, setQuizQuestions] = useState([]); // Array of question objects
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index of the currently displayed question
    const [userAnswers, setUserAnswers] = useState({}); // Stores user's selected answers: { questionIndex: selectedOptionIndex }
    const userAnswersRef = useRef({}); // Using a ref for userAnswers to ensure it's always current in timer callback

    // Timer state for individual questions
    const [timeLeft, setTimeLeft] = useState(0); // Time remaining for the current question
    const timerRef = useRef(null); // Ref to hold the interval timer ID

    // UI states for loading, errors, and confirmations
    const [isLoading, setIsLoading] = useState(false); // Indicates if AI is generating content
    const [subjectPlaceholder, setSubjectPlaceholder] = useState('e.g., Science, History, Math'); // Dynamic placeholder for subject
    const [topicPlaceholder, setTopicPlaceholder] = useState('e.g., Quantum Physics, World War II'); // Dynamic placeholder for topic
    const [errorMessage, setErrorMessage] = useState(''); // Displays error messages to the user
    const [showConfirmation, setShowConfirmation] = useState(false); // Controls visibility of the submission confirmation dialog

    // State for explanation feature
    const [showingExplanationIndex, setShowingExplanationIndex] = useState(null); // Index of question whose explanation is being shown
    const [explanationLoading, setExplanationLoading] = useState(false); // Loading state for explanation
    const [currentExplanation, setCurrentExplanation] = useState(''); // Stores the fetched explanation text

    // OpenRouter API Key (directly from user's input for OpenRouter model)
    const openRouterApiKey = "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";
    const openRouterModel = "google/gemma-3-27b-it:free"; // The AI model to use from OpenRouter

    // Effect hook for Firebase Initialization and Authentication
    useEffect(() => {
        try {
            // Retrieve Firebase config from global variable, or use an empty object if not defined
            const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
            const app = initializeApp(firebaseConfig); // Initialize Firebase app
            const firestore = getFirestore(app); // Get Firestore instance
            const authentication = getAuth(app); // Get Auth instance

            setDb(firestore); // Store Firestore instance in state
            setAuth(authentication); // Store Auth instance in state

            // Set up an authentication state change listener
            const unsubscribe = onAuthStateChanged(authentication, async (user) => {
                if (user) {
                    // If a user is signed in, set their UID and mark auth as ready
                    setUserId(user.uid);
                    setIsAuthReady(true);
                } else {
                    // If no user is signed in, try to sign in with custom token or anonymously
                    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
                    if (initialAuthToken) {
                        // Use custom token if available
                        await signInWithCustomToken(authentication, initialAuthToken);
                    } else {
                        // Otherwise, sign in anonymously
                        await signInAnonymously(authentication);
                    }
                }
            });

            // Cleanup function: Unsubscribe from auth state changes when component unmounts
            return () => unsubscribe();
        } catch (error) {
            console.error("Firebase initialization failed:", error);
            setErrorMessage("Failed to initialize the app. Please try again.");
        }
    }, []); // Empty dependency array ensures this effect runs only once on mount

    // Function to call OpenRouter API for text generation (for quiz questions, placeholders, AND explanations)
    const callOpenRouterApi = async (prompt) => {
        const messages = [{ role: "user", content: prompt }];

        const payload = {
            model: openRouterModel,
            messages: messages,
            extra_headers: {
                "HTTP-Referer": "https://quiz-app.example.com",
                "X-Title": "AI Quiz Master"
            },
            extra_body: {}
        };

        try {
            const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openRouterApiKey}` // Use OpenRouter's specific API key
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.choices && result.choices.length > 0 && result.choices[0].message && result.choices[0].message.content) {
                return result.choices[0].message.content;
            } else {
                console.error("Unexpected OpenRouter API response structure:", result);
                return null;
            }
        } catch (error) {
            console.error("Error calling OpenRouter API:", error);
            setErrorMessage("Failed to fetch data from AI. Please check your network or API key.");
            return null;
        }
    };

    // Effect hook to fetch dynamic placeholders for Subject and Topic input fields
    useEffect(() => {
        const fetchPlaceholders = async () => {
            if (isAuthReady) { // Only fetch if Firebase Auth is ready
                // Prompts to get example subjects and topics from OpenRouter
                const subjectPrompt = `Provide 3-5 diverse examples of general quiz subjects (e.g., 'Science', 'History', 'Math', 'Literature', 'Geography'). Return as a comma-separated list of strings.`;
                const topicPrompt = `Provide 3-5 diverse examples of specific topics within a general subject (e.g., 'Quantum Physics', 'World War II', 'Algebra', 'Shakespearean Sonnets', 'Volcanoes'). Return as a comma-separated list of strings.`;

                const subjectsRaw = await callOpenRouterApi(subjectPrompt);
                const topicsRaw = await callOpenRouterApi(topicPrompt);

                // Update placeholder states if responses are valid
                if (subjectsRaw) {
                    const subjectArray = subjectsRaw.split(',').map(s => s.trim()).filter(s => s); // Filter out empty strings
                    if (subjectArray.length > 0) {
                        setSubjectPlaceholder(`e.g., ${subjectArray.join(', ')}`);
                    }
                }
                if (topicsRaw) {
                    const topicArray = topicsRaw.split(',').map(t => t.trim()).filter(t => t); // Filter out empty strings
                    if (topicArray.length > 0) {
                        setTopicPlaceholder(`e.g., ${topicArray.join(', ')}`);
                    }
                }
            }
        };
        fetchPlaceholders();
    }, [isAuthReady]); // Re-run this effect when authentication state changes

    // Helper function to clean the raw AI response string from markdown
    const cleanJsonResponse = (rawString) => {
        if (rawString.startsWith('```json') && rawString.endsWith('```')) {
            // Remove the markdown code block wrapper
            return rawString.substring(7, rawString.length - 3).trim();
        }
        return rawString.trim();
    };

    // Function to generate the quiz questions using the OpenRouter API (Gemma)
    const generateQuiz = async () => {
        setIsLoading(true); // Set loading state to true
        setErrorMessage(''); // Clear any previous error messages
        try {
            // Construct the prompt for the OpenRouter model, explicitly asking for JSON output
            const prompt = `Generate ${numQuestions} multiple-choice quiz questions on the subject of "${subject}".
                ${specificTopic ? `Focus specifically on the topic of "${specificTopic}".` : ''}
                The difficulty level should be "${difficulty}".
                Each question should have 3 to 5 options.
                For each question, also provide an appropriate time limit in seconds (e.g., 20, 30, 45, 60) based on its length and difficulty.
                The response MUST be a JSON array of objects, where each object has the following properties:
                - "question": a string containing the quiz question.
                - "options": an array of strings for the multiple-choice options.
                - "correctAnswerIndex": a number (0-indexed) indicating the correct option.
                - "timeLimitSeconds": a number for the time limit for this specific question.
                Ensure the JSON is perfectly formatted and does not contain any leading/trailing text or comments.`;

            // Call the OpenRouter API with the prompt
            const dataStringRaw = await callOpenRouterApi(prompt);

            // If data string is successfully received, attempt to parse it as JSON
            if (dataStringRaw) {
                // Clean the raw response string before parsing JSON
                const dataString = cleanJsonResponse(dataStringRaw);
                try {
                    const data = JSON.parse(dataString); // Parse the received JSON string
                    // If data is successfully parsed and is an array with questions
                    if (Array.isArray(data) && data.length > 0) {
                        setQuizQuestions(data); // Store the generated questions
                        setCurrentQuestionIndex(0); // Start from the first question
                        userAnswersRef.current = {}; // Clear any previous user answers
                        setTimeLeft(data[0].timeLimitSeconds); // Set initial time for the first question
                        setCurrentPage('quiz'); // Navigate to the quiz page
                    } else {
                        setErrorMessage('AI did not return valid quiz questions. Please try again with different parameters.');
                    }
                } catch (parseError) {
                    console.error("Failed to parse quiz JSON from AI:", parseError, "Raw response:", dataStringRaw);
                    setErrorMessage('Failed to understand quiz data from AI. Please try different parameters.');
                }
            } else {
                setErrorMessage('No response received from AI. Please try again.');
            }
        } catch (error) {
            console.error("Error generating quiz:", error);
            setErrorMessage('An unexpected error occurred while generating the quiz. Please try again.');
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    // Function to fetch explanation for a specific question using OpenRouter API (Gemma)
    const fetchExplanation = async (qIndex) => {
        setExplanationLoading(true);
        setCurrentExplanation(''); // Clear previous explanation
        setShowingExplanationIndex(qIndex); // Set the index of the question whose explanation is loading

        const question = quizQuestions[qIndex];
        const userAnswerIndex = userAnswersRef.current[qIndex];
        const correctAnswerIndex = question.correctAnswerIndex;

        let prompt = `Provide a detailed explanation for the following quiz question:\n\nQuestion: ${question.question}\nOptions: ${question.options.join(', ')}\nCorrect Answer: ${question.options[correctAnswerIndex]}.`;

        if (userAnswerIndex !== undefined && userAnswerIndex !== correctAnswerIndex) {
            prompt += `\n\nYour selected answer was "${question.options[userAnswerIndex]}", which was incorrect. Please explain why the correct answer is right and why your selected answer was wrong.`;
        } else if (userAnswerIndex === correctAnswerIndex) {
            prompt += `\n\nYou answered this correctly. Explain why this is the correct answer.`;
        }
        prompt += `\n\nKeep the explanation concise and to the point.`; // Added for conciseness for explanations.

        try {
            const explanation = await callOpenRouterApi(prompt); // Use OpenRouter API for explanation
            if (explanation) {
                setCurrentExplanation(explanation);
            } else {
                setCurrentExplanation("Could not retrieve explanation at this time.");
            }
        } catch (error) {
            console.error("Error fetching explanation:", error);
            setCurrentExplanation("Failed to load explanation due to an error.");
        } finally {
            setExplanationLoading(false);
        }
    };

    // Effect hook for the quiz timer logic
    useEffect(() => {
        if (currentPage === 'quiz' && timeLeft > 0) {
            // Start the timer if on the quiz page and time is remaining
            timerRef.current = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft <= 0 && currentPage === 'quiz' && quizQuestions.length > 0) {
            // If time runs out on the quiz page, clear timer and move to next question (or submit if last)
            clearInterval(timerRef.current);
            handleNextQuestion();
        }

        // Cleanup function: Clear the interval when component unmounts or dependencies change
        return () => clearInterval(timerRef.current);
    }, [timeLeft, currentPage, currentQuestionIndex, quizQuestions]); // Dependencies for timer logic

    // Handles user selecting an option for the current question
    const handleOptionSelect = (optionIndex) => {
        userAnswersRef.current = {
            ...userAnswersRef.current,
            [currentQuestionIndex]: optionIndex // Store the selected option index for the current question
        };
        // Update state to trigger re-render for UI updates
        setUserAnswers({ ...userAnswersRef.current });
    };

    // Handles moving to the next question
    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            // If not the last question, increment index and set timer for the new question
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setTimeLeft(quizQuestions[currentQuestionIndex + 1].timeLimitSeconds);
        } else {
            // If it's the last question, show the submission confirmation
            setShowConfirmation(true);
        }
    };

    // Handles moving to the previous question
    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            // If not the first question, decrement index and set timer for the new question
            setCurrentQuestionIndex(prevIndex => prevIndex - 1);
            setTimeLeft(quizQuestions[currentQuestionIndex - 1].timeLimitSeconds);
        }
    };

    // Handles submitting the quiz
    const handleSubmitQuiz = () => {
        setShowConfirmation(false); // Hide confirmation dialog
        setCurrentPage('results'); // Navigate to results page
        clearInterval(timerRef.current); // Stop the timer
    };

    // Calculates the user's final score
    const calculateScore = () => {
        let score = 0;
        quizQuestions.forEach((q, index) => {
            // Increment score if user's answer matches the correct answer
            if (userAnswersRef.current[index] === q.correctAnswerIndex) {
                score++;
            }
        });
        return score;
    };

    // Renders the appropriate page based on the current `currentPage` state
    const renderPage = () => {
        switch (currentPage) {
            case 'welcome':
                return (
                    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 p-4 font-inter">
                        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Welcome to the AI Quiz Master!</h1>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Test your knowledge across various subjects and topics.
                                This quiz is dynamically generated by AI, ensuring fresh questions every time!
                            </p>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Get ready to challenge yourself with personalized questions based on your preferences.
                            </p>
                            <button
                                onClick={() => setCurrentPage('details')}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                            >
                                Start Quiz
                            </button>
                        </div>
                    </div>
                );

            case 'details':
                return (
                    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-4 font-inter">
                        <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full">
                            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Quiz Details</h2>
                            {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Your Name:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">Subject:</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder={subjectPlaceholder}
                                        className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="topic" className="block text-gray-700 text-sm font-bold mb-2">Specific Topic (Optional):</label>
                                    <input
                                        type="text"
                                        id="topic"
                                        value={specificTopic}
                                        onChange={(e) => setSpecificTopic(e.target.value)}
                                        placeholder={topicPlaceholder}
                                        className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="numQuestions" className="block text-gray-700 text-sm font-bold mb-2">Number of Questions:</label>
                                    <input
                                        type="number"
                                        id="numQuestions"
                                        value={numQuestions}
                                        onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value, 10)) || 1)} // Ensure at least 1 question, and parse to int
                                        min="1"
                                        max="20" // Cap max questions to prevent excessive AI calls and long loading times
                                        className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="difficulty" className="block text-gray-700 text-sm font-bold mb-2">Difficulty Level:</label>
                                    <select
                                        id="difficulty"
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                        <option value="professional">Professional</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                                <button
                                    onClick={() => {
                                        // Basic validation before attempting to generate quiz
                                        if (!userName.trim() || !subject.trim()) {
                                            setErrorMessage('Please fill in your Name and Subject.');
                                            return;
                                        }
                                        setCurrentPage('loading'); // Show loading page
                                        generateQuiz(); // Start quiz generation
                                    }}
                                    disabled={isLoading} // Disable button while loading
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
                                >
                                    {isLoading ? 'Generating Quiz...' : 'Begin Quiz'}
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'loading':
                return (
                    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 p-4 font-inter">
                        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                            {/* Simple spinning loader animation */}
                            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500 mb-6 mx-auto"></div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-3">Preparing Your Quiz...</h2>
                            <p className="text-gray-600">This might take a moment as AI crafts your unique questions.</p>
                            {userId && <p className="text-xs text-gray-500 mt-4">User ID: {userId}</p>} {/* Display userId for debugging/info */}
                        </div>
                    </div>
                );

            case 'quiz':
                const currentQuestion = quizQuestions[currentQuestionIndex];
                // Fallback if no questions are loaded (should ideally not happen after successful generation)
                if (!currentQuestion) {
                    return (
                        <div className="flex items-center justify-center min-h-screen bg-gray-100 font-inter">
                            <p className="text-xl text-gray-700">No questions loaded. Please go back and try again.</p>
                            <button onClick={() => setCurrentPage('details')} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Back to Details</button>
                        </div>
                    );
                }
                return (
                    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 to-cyan-600 p-4 font-inter">
                        <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl w-full relative">
                            {/* Timer display */}
                            <div className="absolute top-4 right-4 bg-gray-800 text-white py-2 px-4 rounded-full text-lg font-bold">
                                Time Left: {timeLeft < 0 ? '0' : timeLeft}s
                            </div>
                            {/* Question number display */}
                            <div className="absolute top-4 left-4 bg-blue-500 text-white py-2 px-4 rounded-full text-lg font-bold">
                                Question {currentQuestionIndex + 1} of {quizQuestions.length}
                            </div>
                            {/* Question text */}
                            <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-6 text-center">{currentQuestion.question}</h2>
                            {/* Options grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {currentQuestion.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleOptionSelect(index)}
                                        className={`w-full py-3 px-5 rounded-lg border-2 text-left transition duration-200 ease-in-out
                                            ${userAnswersRef.current[currentQuestionIndex] === index
                                                ? 'bg-blue-500 text-white border-blue-600 shadow-md' // Style for selected option
                                                : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-blue-100 hover:border-blue-400' // Default and hover styles
                                            } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                            {/* Navigation buttons */}
                            <div className="flex justify-between items-center gap-4 mt-6">
                                <button
                                    onClick={handlePreviousQuestion}
                                    disabled={currentQuestionIndex === 0}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                                >
                                    Previous
                                </button>
                                {currentQuestionIndex < quizQuestions.length - 1 ? (
                                    <button
                                        onClick={handleNextQuestion}
                                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setShowConfirmation(true)} // Show confirmation on submit
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                                    >
                                        Submit Quiz
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Submission Confirmation Modal */}
                        {showConfirmation && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                                <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm w-full">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Submission</h3>
                                    <p className="text-gray-600 mb-6">Are you sure you want to submit the quiz? You won't be able to change your answers after submitting.</p>
                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={() => setShowConfirmation(false)}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSubmitQuiz}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                                        >
                                            Confirm Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'results':
                const score = calculateScore();
                return (
                    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 p-4 font-inter overflow-auto">
                        <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl w-full my-8">
                            <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Quiz Results</h2>
                            <p className="text-2xl font-bold text-center text-gray-700 mb-8">
                                {userName}, your score: <span className="text-green-600">{score}</span> out of {quizQuestions.length}
                            </p>

                            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Review Questions & Answers</h3>
                            <div className="space-y-8">
                                {quizQuestions.map((q, qIndex) => (
                                    <div key={qIndex} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                                        <p className="text-lg font-semibold text-gray-900 mb-3">
                                            Q{qIndex + 1}: {q.question}
                                        </p>
                                        <ul className="space-y-2 mb-4">
                                            {q.options.map((option, oIndex) => (
                                                <li
                                                    key={oIndex}
                                                    className={`py-2 px-4 rounded-md transition duration-150 ease-in-out
                                                        ${oIndex === q.correctAnswerIndex ? 'bg-green-100 text-green-800 font-medium' : ''}
                                                        ${userAnswersRef.current[qIndex] === oIndex && oIndex !== q.correctAnswerIndex ? 'bg-red-100 text-red-800 line-through' : ''}
                                                        ${userAnswersRef.current[qIndex] === oIndex && oIndex === q.correctAnswerIndex ? 'border-2 border-green-500' : ''}
                                                    `}
                                                >
                                                    {option}
                                                    {oIndex === q.correctAnswerIndex && <span className="ml-2 text-green-700">(Correct Answer)</span>}
                                                    {userAnswersRef.current[qIndex] === oIndex && oIndex !== q.correctAnswerIndex && <span className="ml-2 text-red-700">(Your Answer - Incorrect)</span>}
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            onClick={() => fetchExplanation(qIndex)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                                            disabled={explanationLoading && showingExplanationIndex === qIndex}
                                        >
                                            {explanationLoading && showingExplanationIndex === qIndex ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white inline-block mr-2"></div>
                                            ) : (
                                                'Show Explanation ✨'
                                            )}
                                        </button>
                                        {showingExplanationIndex === qIndex && (
                                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-gray-700">
                                                {explanationLoading ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                                                        <span>Loading explanation...</span>
                                                    </div>
                                                ) : (
                                                    <p>{currentExplanation}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => {
                                        setCurrentPage('details'); // Go back to details to take another quiz
                                        setQuizQuestions([]); // Clear questions
                                        userAnswersRef.current = {}; // Clear user answers
                                        setCurrentQuestionIndex(0); // Reset current question index
                                        setErrorMessage(''); // Clear error messages
                                        setShowingExplanationIndex(null); // Clear explanation state
                                        setCurrentExplanation(''); // Clear explanation text
                                    }}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                                >
                                    Take Another Quiz
                                </button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="App">
            {renderPage()}
        </div>
    );
};

export default App;
