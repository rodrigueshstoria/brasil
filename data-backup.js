// Sistema robusto de persistência de dados
class DataBackup {
    constructor() {
        this.CANDIDATES_KEY = 'candidates';
        this.BACKUP_KEY = 'candidates_backup';
        this.LAST_SAVE_KEY = 'candidates_last_save';
        this.checkInterval = null;
    }

    saveCandidates(candidates) {
        try {
            // Salvar no localStorage principal
            localStorage.setItem(this.CANDIDATES_KEY, JSON.stringify(candidates));
            
            // Fazer backup
            localStorage.setItem(this.BACKUP_KEY, JSON.stringify(candidates));
            
            // Registrar timestamp
            localStorage.setItem(this.LAST_SAVE_KEY, new Date().toISOString());
            
            console.log('✅ Candidatos salvos com sucesso!');
            return true;
        } catch (e) {
            console.error('❌ Erro ao salvar candidatos:', e);
            return false;
        }
    }

    getCandidates() {
        try {
            // Tentar carregar do localStorage principal
            let candidates = localStorage.getItem(this.CANDIDATES_KEY);
            
            if (candidates) {
                return JSON.parse(candidates);
            }
            
            // Se não encontrar, tentar backup
            const backup = localStorage.getItem(this.BACKUP_KEY);
            if (backup) {
                console.warn('⚠️ Candidatos recuperados do backup!');
                candidates = JSON.parse(backup);
                // Restaurar no localStorage principal
                localStorage.setItem(this.CANDIDATES_KEY, backup);
                return candidates;
            }
            
            return [];
        } catch (e) {
            console.error('❌ Erro ao carregar candidatos:', e);
            return [];
        }
    }

    checkDataIntegrity() {
        const candidates = this.getCandidates();
        const backup = localStorage.getItem(this.BACKUP_KEY);
        
        if (!backup && candidates.length > 0) {
            // Se não tem backup mas tem dados, fazer backup
            this.saveCandidates(candidates);
        }
        
        return candidates;
    }

    getLastSaveTime() {
        const timestamp = localStorage.getItem(this.LAST_SAVE_KEY);
        if (timestamp) {
            return new Date(timestamp).toLocaleString('pt-BR');
        }
        return 'Nunca';
    }

    validatePrivateMode() {
        // Testa se está em modo privado
        return new Promise((resolve) => {
            const test = '__localStorage_test__';
            try {
                localStorage.setItem(test, test);
                localStorage.removeItem(test);
                resolve(false); // Não está em modo privado
            } catch (e) {
                resolve(true); // Está em modo privado
            }
        });
    }

    startIntegrityCheck() {
        // Verificar a cada 30 segundos
        this.checkInterval = setInterval(() => {
            this.checkDataIntegrity();
        }, 30000);
    }

    stopIntegrityCheck() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
    }
}

// Instância global
const dataBackup = new DataBackup();
