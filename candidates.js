// Load candidates from IndexedDB with backup system
let candidates = [];

// Carregar candidatos do IndexedDB na inicialização
async function initCandidates() {
    try {
        await db.init();

        if (typeof firebaseManager !== 'undefined' && firebaseManager.enabled) {
            const firebaseCandidates = await firebaseManager.getCandidates();
            if (firebaseCandidates.length > 0) {
                candidates = firebaseCandidates;
                console.log(`✅ ${candidates.length} candidatos carregados do Firebase`);
                return;
            }
        }

        // Carregar do IndexedDB quando não há candidatos no Firebase
        candidates = await db.getCandidates();
        console.log(`✅ ${candidates.length} candidatos carregados de IndexedDB`);
    } catch (e) {
        console.error('Erro ao carregar candidatos:', e);
        // Fallback para IndexedDB
        try {
            candidates = await db.getCandidates();
            console.log(`⚠️ Candidatos carregados de fallback (IndexedDB)`);
        } catch (fallbackError) {
            console.error('Erro ao carregar fallback:', fallbackError);
            candidates = [];
        }
    }
}

initCandidates();