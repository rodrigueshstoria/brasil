// ⚠️ TEMPLATE DE CONFIGURAÇÃO
// Copie este arquivo para config.js e adicione seu token
// NÃO FAÇA COMMIT do config.js com token real!

const GITHUB_TOKEN = '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'; // Troque por seu novo token

// Inicializar sincronização
if (GITHUB_TOKEN && GITHUB_TOKEN !== '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') {
    githubSync.setToken(GITHUB_TOKEN);
    console.log('✅ GitHub sync ativado');
} else {
    console.warn('⚠️ GitHub token não configurado. Sincronização automática desativada.');
}
