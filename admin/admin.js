// Senha de administrador (mude isso para uma senha forte!)
const ADMIN_PASSWORD = 'Pinguelo1';

// Event listeners
document.getElementById('admin-login-btn').addEventListener('click', checkAdminPassword);
document.getElementById('admin-password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAdminPassword();
});
document.getElementById('back-to-main').addEventListener('click', () => {
    window.location.href = '../index.html';
});
document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('make-public-checkbox').addEventListener('change', togglePublicStatus);
document.getElementById('export-btn').addEventListener('click', exportData);
document.getElementById('clear-data-btn').addEventListener('click', clearAllData);

function checkAdminPassword() {
    const password = document.getElementById('admin-password').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('admin-screen').classList.remove('hidden');
        loadAdminDashboard();
    } else {
        alert('Senha de administrador incorreta!');
        document.getElementById('admin-password').value = '';
    }
}

function loadAdminDashboard() {
    const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const isPublic = localStorage.getItem('apuracao-public') === 'true';

    // Atualizar estatísticas
    document.getElementById('candidates-count').textContent = candidates.length;
    document.getElementById('users-count').textContent = users.length;

    // Atualizar checkbox de público
    document.getElementById('make-public-checkbox').checked = isPublic;
    updatePublicStatus(isPublic);

    // Carregar lista de candidatos
    loadCandidatesList(candidates);

    // Carregar lista de usuários
    loadUsersList(users);
}

function loadCandidatesList(candidates) {
    const container = document.getElementById('candidates-list');
    
    if (candidates.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum candidato cadastrado ainda.</p>';
        return;
    }

    container.innerHTML = candidates.map((candidate, index) => `
        <div class="data-item" onclick="toggleAnswersVisibility(this)">
            <div class="item-header">${candidate.name}</div>
            <div class="item-details">
                <strong>Respostas cadastradas:</strong> ${candidate.answers.length}/15
            </div>
            <div class="item-answers">
                <strong>Respostas:</strong><br>
                ${candidate.answers.map((ans, i) => `<div style="margin-top: 5px;"><strong>Q${i+1}:</strong> ${ans}</div>`).join('')}
            </div>
        </div>
    `).join('');
}

function loadUsersList(users) {
    const container = document.getElementById('users-list');
    
    if (users.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum participante cadastrado ainda.</p>';
        return;
    }

    container.innerHTML = users.map((user, index) => `
        <div class="data-item" onclick="toggleAnswersVisibility(this)">
            <div class="item-header">${user.name || 'Participante #' + (index + 1)}</div>
            <div class="item-details">
                <strong>Respostas cadastradas:</strong> ${user.answers.length}/15<br>
                <strong>Data:</strong> ${new Date(user.timestamp).toLocaleString('pt-BR')}
            </div>
            <div class="item-answers">
                <strong>Respostas:</strong><br>
                ${user.answers.map((ans, i) => `<div style="margin-top: 5px;"><strong>Q${i+1}:</strong> ${ans}</div>`).join('')}
            </div>
        </div>
    `).join('');
}

function toggleAnswersVisibility(element) {
    const answersDiv = element.querySelector('.item-answers');
    answersDiv.classList.toggle('visible');
    element.classList.toggle('expanded');
}

function togglePublicStatus() {
    const isChecked = document.getElementById('make-public-checkbox').checked;
    localStorage.setItem('apuracao-public', isChecked.toString());
    updatePublicStatus(isChecked);
}

function updatePublicStatus(isPublic) {
    const statusElement = document.getElementById('public-status');
    if (isPublic) {
        statusElement.textContent = '✅ Status: Público - Apuração visível para todos';
        statusElement.classList.add('public');
    } else {
        statusElement.textContent = '🔒 Status: Privado - Apuração oculta';
        statusElement.classList.remove('public');
    }
}

function exportData() {
    const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    const data = {
        exportDate: new Date().toLocaleString('pt-BR'),
        candidates,
        users,
        summary: {
            totalCandidates: candidates.length,
            totalUsers: users.length
        }
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `apuracao_${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    alert('Dados exportados com sucesso!');
}

function clearAllData() {
    if (confirm('⚠️ ATENÇÃO! Isso vai deletar TODOS os dados (candidatos e participantes). Tem certeza?')) {
        if (confirm('Tem certeza mesmo? Esta ação NÃO pode ser desfeita!')) {
            localStorage.removeItem('candidates');
            localStorage.removeItem('users');
            localStorage.removeItem('apuracao-public');
            alert('Todos os dados foram deletados!');
            loadAdminDashboard();
        }
    }
}

function logout() {
    document.getElementById('admin-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('admin-password').value = '';
}
