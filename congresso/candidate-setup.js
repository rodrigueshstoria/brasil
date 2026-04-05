// Senhas válidas para acesso dos candidatos
const validPasswords = [
    'horizonte',
    'velocity',
    'misterio',
    'notebook',
    'fragment',
    'solitude',
    'universo',
    'midnight',
    'cascata',
    'mountain',
    'liberdade',
    'fortress',
    'aventura',
    'emeralds',
    'infinito',
    'blueprint',
    'relogios',
    'pathway',
    'oceanoaz',
    'distance'
];

let currentQuestionIndex = 0;
let userAnswers = [];
let quizCompleted = false;

// Sistema de cookies/localStorage para salvar progresso dos candidatos
const CANDIDATE_PROGRESS_KEY = 'candidate_progress';
const CANDIDATE_COMPLETED_KEY = 'candidate_completed';

document.getElementById('password-btn').addEventListener('click', checkPassword);
document.getElementById('back-to-main').addEventListener('click', () => window.location.href = '../index.html');
document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('save-btn').addEventListener('click', saveCandidate);
document.getElementById('back-btn').addEventListener('click', () => location.reload());

// Carregar progresso automaticamente ao iniciar
document.addEventListener('DOMContentLoaded', loadCandidateProgress);

document.querySelectorAll('input[name="answer"]').forEach(radio => {
    radio.addEventListener('change', () => {
        document.getElementById('next-btn').disabled = false;
        document.querySelectorAll('.answer-option').forEach(label => label.classList.remove('selected'));
        radio.parentElement.classList.add('selected');
    });
});

function checkPassword() {
    const password = document.getElementById('password-input').value;
    if (validPasswords.includes(password)) {
        document.getElementById('password-screen').classList.add('hidden');
        document.getElementById('start-screen').classList.remove('hidden');

        // Verificar se há progresso salvo para este candidato
        const savedProgress = localStorage.getItem(CANDIDATE_PROGRESS_KEY);
        const isCompleted = localStorage.getItem(CANDIDATE_COMPLETED_KEY) === 'true';

        if (savedProgress && !isCompleted) {
            const continueBtn = document.createElement('button');
            continueBtn.id = 'continue-candidate-btn';
            continueBtn.textContent = 'Continuar Cadastro Salvo';
            continueBtn.style.backgroundColor = '#17a2b8';
            continueBtn.style.marginTop = '20px';

            const startScreen = document.getElementById('start-screen');
            startScreen.appendChild(continueBtn);

            continueBtn.addEventListener('click', () => {
                startQuiz();
            });
        }
    } else {
        alert('Senha incorreta!');
    }
}

function startQuiz() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    showQuestion(0);
}

function showQuestion(index) {
    const question = questions[index];
    document.getElementById('question-category').textContent = question.category;
    document.getElementById('question-text').textContent = question.text;
    document.getElementById('current-question').textContent = index + 1;
    const progressPercent = ((index + 1) / questions.length) * 100;
    document.getElementById('progress-fill').style.width = progressPercent + '%';
    
    // Update options
    const options = question.options;
    const labels = document.querySelectorAll('.answer-option span');
    labels.forEach((span, i) => {
        span.textContent = `${i + 1} - ${options[i]}`;
    });

    // Limpar seleções anteriores
    document.querySelectorAll('input[name="answer"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('.answer-option').forEach(label => label.classList.remove('selected'));

    // Carregar resposta anterior se existir
    if (userAnswers[index] !== undefined) {
        const previousAnswer = userAnswers[index];
        const radioToCheck = document.querySelector(`input[name="answer"][value="${previousAnswer}"]`);
        if (radioToCheck) {
            radioToCheck.checked = true;
            radioToCheck.parentElement.classList.add('selected');
        }
    }
    
    document.getElementById('next-btn').disabled = true;
}

function nextQuestion() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        const answerValue = parseInt(selectedAnswer.value);

        // Se já existe uma resposta para esta pergunta, atualiza; senão, adiciona
        if (userAnswers[currentQuestionIndex] !== undefined) {
            userAnswers[currentQuestionIndex] = answerValue;
        } else {
            userAnswers.push(answerValue);
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion(currentQuestionIndex);
            // Salvar progresso automaticamente
            saveCandidateProgress();
        } else {
            showSaveScreen();
        }
    }
}

function showSaveScreen() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('save-screen').classList.remove('hidden');
}

async function saveCandidate() {
    const name = document.getElementById('candidate-name').value.trim();
    if (name && userAnswers.length === questions.length) {
        try {
            await db.init();
            const candidates = await db.getCandidates();
            candidates.push({ 
                name, 
                answers: userAnswers,
                savedAt: new Date().toISOString()
            });
            
            await db.saveCandidates(candidates);
            
            // Sincronizar automaticamente com GitHub
            const synced = await githubSync.syncCandidates(candidates);
            if (synced) {
                alert('✅ Candidato salvo e sincronizado com sucesso!\n\nOutros usuários verão seus dados automaticamente.');
            } else {
                alert('✅ Candidato salvo localmente!\n\n(A sincronização com GitHub requer token configurado)');
            }
            
            // Limpar progresso após salvar com sucesso
            localStorage.removeItem(CANDIDATE_PROGRESS_KEY);
            localStorage.removeItem(CANDIDATE_COMPLETED_KEY);

            location.reload();
        } catch (e) {
            alert('❌ Erro ao salvar candidato.');
            console.error(e);
        }
    } else {
        alert('Por favor, insira um nome válido.');
    }
}

function saveCandidateProgress() {
    const progressData = {
        currentQuestionIndex,
        userAnswers,
        quizCompleted,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem(CANDIDATE_PROGRESS_KEY, JSON.stringify(progressData));
}

function loadCandidateProgress() {
    const savedProgress = localStorage.getItem(CANDIDATE_PROGRESS_KEY);
    const isCompleted = localStorage.getItem(CANDIDATE_COMPLETED_KEY) === 'true';

    if (savedProgress && !isCompleted) {
        const progressData = JSON.parse(savedProgress);
        currentQuestionIndex = progressData.currentQuestionIndex || 0;
        userAnswers = progressData.userAnswers || [];
        quizCompleted = progressData.quizCompleted || false;
    }
}