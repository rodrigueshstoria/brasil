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

document.getElementById('password-btn').addEventListener('click', checkPassword);
document.getElementById('back-to-main').addEventListener('click', () => window.location.href = 'index.html');
document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('save-btn').addEventListener('click', saveCandidate);
document.getElementById('back-btn').addEventListener('click', () => location.reload());

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
    
    document.querySelectorAll('input[name="answer"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('.answer-option').forEach(label => label.classList.remove('selected'));
    document.getElementById('next-btn').disabled = true;
}

function nextQuestion() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        userAnswers.push(parseInt(selectedAnswer.value));
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion(currentQuestionIndex);
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
            alert('✅ Candidato salvo com sucesso!\n\nValor salvo em: ' + new Date().toLocaleString('pt-BR'));
            
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