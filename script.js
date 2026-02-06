// Vocabulary Dataset
// Russian to French family member translations
const vocabulary = [
    { russian: "мама", french: "mère" },
    { russian: "папа", french: "père" },
    { russian: "родители", french: "parents" },
    { russian: "брат", french: "frère" },
    { russian: "сестра", french: "sœur" },
    { russian: "бабушка", french: "grand-mère" },
    { russian: "дедушка", french: "grand-père" },
    { russian: "бабушка и дедушка", french: "grands-parents" },
    { russian: "сын", french: "fils" },
    { russian: "дочь", french: "fille" },
    { russian: "дети", french: "enfants" },
    { russian: "муж", french: "mari" },
    { russian: "жена", french: "femme" },
    { russian: "дядя", french: "oncle" },
    { russian: "тётя", french: "tante" },
    { russian: "двоюродный брат", french: "cousin" },
    { russian: "двоюродная сестра", french: "cousine" },
    { russian: "семья", french: "famille" }
];

// Game Configuration
const TOTAL_QUESTIONS = 20;
let currentQuestion = 0;
let score = 0;
let questions = [];
let gameActive = false;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const nextBtn = document.getElementById('next-btn');
const questionCounter = document.getElementById('question-counter');
const progressFill = document.getElementById('progress-fill');
const scoreEl = document.getElementById('score');
const russianWordEl = document.getElementById('russian-word');
const optionsContainer = document.getElementById('options-container');
const feedbackArea = document.getElementById('feedback-area');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackMessage = document.getElementById('feedback-message');
const finalScoreEl = document.getElementById('final-score');
const scorePercentageEl = document.getElementById('score-percentage');
const correctAnswersEl = document.getElementById('correct-answers');
const resultMessageEl = document.getElementById('result-message');

// Initialize Game
function initGame() {
    // Reset game state
    currentQuestion = 0;
    score = 0;
    gameActive = true;
    
    // Generate questions
    questions = generateQuestions();
    
    // Update UI
    scoreEl.textContent = score;
    updateProgress();
    
    // Show first question
    showQuestion();
    
    // Switch screens
    startScreen.classList.remove('active');
    resultsScreen.classList.remove('active');
    quizScreen.classList.add('active');
}

// Generate Random Questions
function generateQuestions() {
    const questions = [];
    
    // We have 18 words, but need 20 questions
    // Some words will repeat to reach 20 questions
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        // Select a random word from vocabulary
        const randomIndex = Math.floor(Math.random() * vocabulary.length);
        const question = { ...vocabulary[randomIndex] };
        
        // Generate wrong answers
        const wrongAnswers = generateWrongAnswers(question.french);
        const options = [question.french, ...wrongAnswers];
        
        // Shuffle options
        question.options = shuffleArray(options);
        question.correctIndex = question.options.indexOf(question.french);
        
        questions.push(question);
    }
    
    return questions;
}

// Generate 3 Wrong Answers
function generateWrongAnswers(correctAnswer) {
    const wrongAnswers = [];
    const allFrenchWords = vocabulary.map(item => item.french);
    
    // Filter out the correct answer
    const availableWords = allFrenchWords.filter(word => word !== correctAnswer);
    
    // Shuffle and take 3
    const shuffled = shuffleArray([...availableWords]);
    return shuffled.slice(0, 3);
}

// Display Current Question
function showQuestion() {
    const question = questions[currentQuestion];
    
    // Update Russian word
    russianWordEl.textContent = question.russian;
    
    // Update question counter
    questionCounter.textContent = `Вопрос ${currentQuestion + 1}/${TOTAL_QUESTIONS}`;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Create option buttons
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.dataset.index = index;
        
        // Add click event
        button.addEventListener('click', () => checkAnswer(index, question.correctIndex));
        
        optionsContainer.appendChild(button);
    });
    
    // Hide feedback area
    feedbackArea.classList.add('hidden');
    
    // Update progress bar
    updateProgress();
}

// Check User's Answer
function checkAnswer(selectedIndex, correctIndex) {
    const question = questions[currentQuestion];
    const optionButtons = document.querySelectorAll('.option-btn');
    const isCorrect = selectedIndex === correctIndex;
    
    // Disable all buttons
    optionButtons.forEach(btn => btn.disabled = true);
    
    // Highlight correct and incorrect answers
    optionButtons.forEach((btn, index) => {
        if (index === correctIndex) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
    
    // Update score if correct
    if (isCorrect) {
        score++;
        scoreEl.textContent = score;
        
        // Show success feedback
        feedbackIcon.className = 'feedback-icon correct';
        feedbackIcon.innerHTML = '<i class="fas fa-check"></i>';
        feedbackTitle.textContent = 'Правильно!';
        feedbackTitle.style.color = '#4cc9f0';
        feedbackMessage.textContent = 'Отличный выбор!';
    } else {
        // Show error feedback
        feedbackIcon.className = 'feedback-icon incorrect';
        feedbackIcon.innerHTML = '<i class="fas fa-times"></i>';
        feedbackTitle.textContent = 'Неправильно';
        feedbackTitle.style.color = '#f72585';
        feedbackMessage.textContent = `Правильный ответ: ${question.french}`;
    }
    
    // Show feedback area
    feedbackArea.classList.remove('hidden');
    
    // Scroll to feedback area on mobile
    if (window.innerWidth < 768) {
        feedbackArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Move to Next Question
function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < TOTAL_QUESTIONS) {
        showQuestion();
    } else {
        finishGame();
    }
}

// Update Progress Bar
function updateProgress() {
    const progress = ((currentQuestion) / TOTAL_QUESTIONS) * 100;
    progressFill.style.width = `${progress}%`;
}

// Finish Game and Show Results
function finishGame() {
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
    
    // Update results display
    finalScoreEl.textContent = `${score}/${TOTAL_QUESTIONS}`;
    scorePercentageEl.textContent = `${percentage}%`;
    correctAnswersEl.textContent = score;
    
    // Set result message based on score
    let message = '';
    if (percentage === 100) {
        message = 'Идеально! Ты знаешь все семейные слова на французском! 🎉';
    } else if (percentage >= 80) {
        message = 'Отлично! Ты хорошо знаешь семейные слова на французском! 👍';
    } else if (percentage >= 60) {
        message = 'Хорошо! Ты знаешь основные семейные слова на французском! 👏';
    } else if (percentage >= 40) {
        message = 'Неплохо! Продолжай учить французские названия членов семьи! 💪';
    } else {
        message = 'Есть над чем поработать! Повтори слова и попробуй снова! 📚';
    }
    
    resultMessageEl.textContent = message;
    
    // Switch to results screen
    quizScreen.classList.remove('active');
    resultsScreen.classList.add('active');
}

// Utility Functions

// Fisher-Yates Shuffle Algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Event Listeners

// Start game button
startBtn.addEventListener('click', initGame);

// Restart game button
restartBtn.addEventListener('click', initGame);

// Next question button
nextBtn.addEventListener('click', nextQuestion);

// Keyboard navigation
document.addEventListener('keydown', (event) => {
    if (!gameActive) return;
    
    // Number keys 1-4 for answer selection
    if (event.key >= '1' && event.key <= '4') {
        const index = parseInt(event.key) - 1;
        const buttons = document.querySelectorAll('.option-btn');
        
        if (buttons[index] && !buttons[index].disabled) {
            buttons[index].click();
        }
    }
    
    // Space or Enter for next question
    if ((event.key === ' ' || event.key === 'Enter') && !feedbackArea.classList.contains('hidden')) {
        event.preventDefault();
        nextQuestion();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Family Quiz Game loaded successfully');
    console.log(`Vocabulary size: ${vocabulary.length} words`);
    console.log(`Total questions: ${TOTAL_QUESTIONS}`);
});
