// Load candidates from IndexedDB with backup system
let candidates = [];

// Carregar candidatos do IndexedDB na inicialização
async function initCandidates() {
    try {
        await db.init();
        candidates = await db.getCandidates();
        console.log(`✅ ${candidates.length} candidatos carregados`);
    } catch (e) {
        console.error('Erro ao carregar candidatos:', e);
        candidates = [];
    }
}

initCandidates();