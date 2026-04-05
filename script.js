let currentQuestionIndex = 0;
let userAnswers = [];

document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('restart-btn').addEventListener('click', restartQuiz);

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