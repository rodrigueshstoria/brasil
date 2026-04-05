let currentQuestionIndex = 0;
let userAnswers = [];
let quizCompleted = false;

// Sistema de cookies/localStorage para salvar progresso
const PROGRESS_KEY = 'quiz_progress';
const COMPLETED_KEY = 'quiz_completed';

document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('restart-btn').addEventListener('click', restartQuiz);
document.getElementById('save-progress-btn').addEventListener('click', saveProgress);

// Carregar progresso automaticamente ao iniciar
document.addEventListener('DOMContentLoaded', loadProgress);

document.querySelectorAll('input[name="answer"]').forEach(radio => {
    radio.addEventListener('change', () => {
        document.getElementById('next-btn').disabled = false;
        document.querySelectorAll('.answer-option').forEach(label => label.classList.remove('selected'));
        radio.parentElement.classList.add('selected');
    });
});

function startQuiz() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    showQuestion(currentQuestionIndex);
}

function showQuestion(index) {
    const question = questions[index];
    document.getElementById('question-category').textContent = question.category;
    document.getElementById('question-text').textContent = question.text;
    document.getElementById('current-question').textContent = index + 1;

    // Atualizar barra de progresso gradiente (verde para azul)
    const progressPercent = ((index + 1) / questions.length) * 100;
    const progressFill = document.getElementById('progress-fill');
    progressFill.style.width = progressPercent + '%';

    // Gradiente dinâmico: verde (0%) -> azul (100%)
    const greenValue = Math.round(255 * (1 - progressPercent / 100));
    const blueValue = Math.round(255 * (progressPercent / 100));
    progressFill.style.background = `linear-gradient(to right, rgb(${greenValue}, 255, 0), rgb(0, ${blueValue}, 255))`;

    // Update options
    const options = question.options;
    const labels = document.querySelectorAll('.answer-option span');
    labels.forEach((span, i) => {
        span.textContent = `${i + 1} - ${options[i]}`;
    });

    document.querySelectorAll('input[name="answer"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('.answer-option').forEach(label => label.classList.remove('selected'));
    document.getElementById('next-btn').disabled = true;

    // Mostrar botão salvar se não estiver completo
    const saveBtn = document.getElementById('save-progress-btn');
    if (!quizCompleted) {
        saveBtn.style.display = 'inline-block';
    } else {
        saveBtn.style.display = 'none';
    }
}

function nextQuestion() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        userAnswers.push(parseInt(selectedAnswer.value));
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion(currentQuestionIndex);
            // Salvar progresso automaticamente
            saveProgress();
        } else {
            quizCompleted = true;
            localStorage.setItem(COMPLETED_KEY, 'true');
            showResults();
        }
    }
}

function showResults() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');

    if (candidates.length === 0) {
        document.getElementById('ideology-profile').textContent = generateIdeologyProfile(userAnswers);
        document.getElementById('candidates-ranking').innerHTML = '<p>Nenhum candidato cadastrado ainda. Acesse /congresso para cadastrar.</p>';
        return;
    }

    const ideologyProfile = generateIdeologyProfile(userAnswers);
    document.getElementById('ideology-profile').textContent = ideologyProfile;

    const rankings = candidates.map(candidate => {
        let totalDiff = 0;
        for (let i = 0; i < userAnswers.length; i++) {
            totalDiff += Math.abs(userAnswers[i] - candidate.answers[i]);
        }
        const compatibility = Math.max(0, 100 - (totalDiff / (questions.length * 4)) * 100);
        return { name: candidate.name, compatibility: Math.round(compatibility) };
    });

    rankings.sort((a, b) => b.compatibility - a.compatibility);

    const topRankings = rankings.slice(0, 3); // Limit to top 3

    const rankingContainer = document.getElementById('candidates-ranking');
    rankingContainer.innerHTML = '';
    topRankings.forEach(rank => {
        const div = document.createElement('div');
        div.className = 'candidate';
        div.innerHTML = `<span>${rank.name}</span><span>${rank.compatibility}%</span>`;
        rankingContainer.appendChild(div);
    });
}

function saveProgress() {
    const progressData = {
        currentQuestionIndex,
        userAnswers,
        quizCompleted,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressData));

    // Mostrar confirmação visual
    const saveBtn = document.getElementById('save-progress-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = '💾 Salvo!';
    saveBtn.style.backgroundColor = '#28a745';

    setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.backgroundColor = '';
    }, 1500);
}

function loadProgress() {
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    const isCompleted = localStorage.getItem(COMPLETED_KEY) === 'true';

    if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        currentQuestionIndex = progressData.currentQuestionIndex || 0;
        userAnswers = progressData.userAnswers || [];
        quizCompleted = progressData.quizCompleted || false;

        // Se já completou o quiz, mostrar resultados
        if (isCompleted && userAnswers.length === questions.length) {
            document.getElementById('start-screen').classList.add('hidden');
            showResults();
            return;
        }

        // Se tem progresso parcial, mostrar mensagem de continuação
        if (userAnswers.length > 0) {
            const continueBtn = document.createElement('button');
            continueBtn.id = 'continue-btn';
            continueBtn.textContent = `Continuar Quiz (Pergunta ${currentQuestionIndex + 1})`;
            continueBtn.style.backgroundColor = '#17a2b8';
            continueBtn.style.marginTop = '20px';

            const startScreen = document.getElementById('start-screen');
            startScreen.appendChild(continueBtn);

            continueBtn.addEventListener('click', () => {
                startQuiz();
            });
        }
    }
}

function restartQuiz() {
    // Salvar respostas do usuário antes de reiniciar
    if (userAnswers.length === questions.length) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({
            id: Date.now(),
            answers: userAnswers,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('users', JSON.stringify(users));
    }

    currentQuestionIndex = 0;
    userAnswers = [];
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
}