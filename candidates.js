// Load candidates from IndexedDB with backup system
let candidates = [];

// Carregar candidatos do IndexedDB na inicialização
async function initCandidates() {
    try {
        await db.init();
        
        // Tentar puxar do GitHub primeiro
        const latestData = await githubSync.pullLatestData();
        if (latestData && latestData.candidates.length > 0) {
            candidates = latestData.candidates;
            await db.saveCandidates(candidates);
            console.log(`✅ ${candidates.length} candidatos carregados do GitHub`);
        } else {
            // Se não conseguir do GitHub, carregar do IndexedDB
            candidates = await db.getCandidates();
            console.log(`✅ ${candidates.length} candidatos carregados de IndexedDB`);
        }
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