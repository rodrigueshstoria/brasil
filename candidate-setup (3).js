// Verificar se apuração está pública
document.addEventListener('DOMContentLoaded', async () => {
    const isPublic = localStorage.getItem('apuracao-public') === 'true';
    
    if (isPublic) {
        document.getElementById('closed-screen').classList.add('hidden');
        document.getElementById('apuracao-screen').classList.remove('hidden');
        await loadApuracao();
    } else {
        document.getElementById('closed-screen').classList.remove('hidden');
        document.getElementById('apuracao-screen').classList.add('hidden');
    }
});

// Event listeners
document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = '../index.html';
});

document.getElementById('back-btn-apuracao').addEventListener('click', () => {
    window.location.href = '../index.html';
});

async function loadApuracao() {
    try {
        await db.init();
        const latestData = await githubSync.pullLatestData();
        if (latestData) {
            await db.saveCandidates(latestData.candidates || []);
            await db.saveUsers(latestData.users || []);
        }

        const candidates = await db.getCandidates();
        const users = await db.getUsers();

        loadCandidatesApuracao(candidates);
        loadUsersApuracao(users);
        updateLastUpdate();
    } catch (e) {
        console.error('Erro ao carregar apuração:', e);
    }
}

function loadCandidatesApuracao(candidates) {
    const container = document.getElementById('candidates-apuracao');
    
    if (candidates.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum candidato cadastrado.</p>';
        return;
    }

    container.innerHTML = candidates.map((candidate, index) => `
        <div class="data-item" onclick="toggleAnswersVisibility(this)">
            <div class="item-header">🗳️ ${candidate.name}</div>
            <div class="item-details">
                <strong>Respostas completas:</strong> ${candidate.answers.length}/15
            </div>
            <div class="item-answers">
                <strong>Posicionamento do Candidato:</strong>
                ${candidate.answers.map((ans, i) => `
                    <div class="answer-row">
                        <span class="answer-label">Pergunta ${i+1}:</span>
                        <span class="answer-value">${ans}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function loadUsersApuracao(users) {
    const container = document.getElementById('users-apuracao');
    
    if (users.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum participante cadastrado.</p>';
        return;
    }

    container.innerHTML = users.map((user, index) => `
        <div class="data-item" onclick="toggleAnswersVisibility(this)">
            <div class="item-header">👥 Participante #${index + 1}</div>
            <div class="item-details">
                <strong>Respostas completas:</strong> ${user.answers.length}/15<br>
                <strong>Data:</strong> ${new Date(user.timestamp).toLocaleString('pt-BR')}
            </div>
            <div class="item-answers">
                <strong>Respostas do Participante:</strong>
                ${user.answers.map((ans, i) => `
                    <div class="answer-row">
                        <span class="answer-label">Pergunta ${i+1}:</span>
                        <span class="answer-value">${ans}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function toggleAnswersVisibility(element) {
    const answersDiv = element.querySelector('.item-answers');
    answersDiv.classList.toggle('visible');
    element.classList.toggle('expanded');
}

function updateLastUpdate() {
    const now = new Date();
    const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('last-update').textContent = time;
}

// Auto-refresh a cada 30 segundos
setInterval(() => {
    const isPublic = localStorage.getItem('apuracao-public') === 'true';
    if (isPublic) {
        loadApuracao();
    } else {
        location.reload();
    }
}, 30000);
