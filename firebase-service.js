// Gerencia leitura e escrita no Firebase Firestore.
class FirebaseManager {
    constructor() {
        this.enabled = false;
        this.db = null;
    }

    init(config) {
        if (!config || !config.apiKey || !config.projectId) {
            console.warn('⚠️ Firebase não configurado corretamente. Verifique FIREBASE_CONFIG em config.js.');
            return;
        }

        try {
            firebase.initializeApp(config);
            this.db = firebase.firestore();
            this.enabled = true;
            console.log('✅ Firebase inicializado');
        } catch (e) {
            console.error('❌ Erro ao inicializar Firebase:', e);
            this.enabled = false;
        }
    }

    async saveCandidate(candidate) {
        if (!this.enabled) return false;
        try {
            await this.db.collection('candidates').doc(candidate.name).set({
                ...candidate,
                savedAt: candidate.savedAt || new Date().toISOString()
            });
            console.log(`✅ Candidato "${candidate.name}" salvo no Firebase`);
            return true;
        } catch (e) {
            console.error('❌ Erro ao salvar candidato no Firebase:', e);
            return false;
        }
    }

    async getCandidates() {
        if (!this.enabled) return [];
        try {
            const snapshot = await this.db.collection('candidates').get();
            return snapshot.docs.map(doc => doc.data());
        } catch (e) {
            console.error('❌ Erro ao carregar candidatos do Firebase:', e);
            return [];
        }
    }

    async saveUserResponse(user) {
        if (!this.enabled) return false;
        try {
            await this.db.collection('userResponses').add({
                ...user,
                timestamp: user.timestamp || new Date().toISOString()
            });
            console.log('✅ Resposta do usuário salva no Firebase');
            return true;
        } catch (e) {
            console.error('❌ Erro ao salvar resposta do usuário no Firebase:', e);
            return false;
        }
    }

    async getUserResponses() {
        if (!this.enabled) return [];
        try {
            const snapshot = await this.db.collection('userResponses').get();
            return snapshot.docs.map(doc => doc.data());
        } catch (e) {
            console.error('❌ Erro ao carregar respostas de usuários do Firebase:', e);
            return [];
        }
    }
}

const firebaseManager = new FirebaseManager();
