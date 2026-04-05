// Sistema de persistência com IndexedDB (muito mais confiável que localStorage)
class DatabaseManager {
    constructor() {
        this.dbName = 'BrasilQuizDB';
        this.dbVersion = 1;
        this.candidatesStore = 'candidates';
        this.usersStore = 'users';
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('❌ Erro ao abrir IndexedDB');
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ IndexedDB inicializado');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                if (!db.objectStoreNames.contains(this.candidatesStore)) {
                    db.createObjectStore(this.candidatesStore, { keyPath: 'id' });
                }

                if (!db.objectStoreNames.contains(this.usersStore)) {
                    db.createObjectStore(this.usersStore, { keyPath: 'id' });
                }

                console.log('✅ Object stores criados');
            };
        });
    }

    async saveCandidates(candidates) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.candidatesStore], 'readwrite');
            const store = transaction.objectStore(this.candidatesStore);

            // Limpar dados antigos
            store.clear();

            // Salvar cada candidato
            candidates.forEach(candidate => {
                store.add({
                    id: candidate.name,
                    ...candidate,
                    savedAt: new Date().toISOString()
                });
            });

            transaction.oncomplete = () => {
                console.log('✅ Candidatos salvos em IndexedDB');
                resolve(true);
            };

            transaction.onerror = () => {
                console.error('❌ Erro ao salvar candidatos');
                reject(transaction.error);
            };
        });
    }

    async getCandidates() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.candidatesStore], 'readonly');
            const store = transaction.objectStore(this.candidatesStore);
            const request = store.getAll();

            request.onsuccess = () => {
                console.log(`✅ ${request.result.length} candidatos carregados de IndexedDB`);
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('❌ Erro ao carregar candidatos');
                reject(request.error);
            };
        });
    }

    async saveUsers(users) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.usersStore], 'readwrite');
            const store = transaction.objectStore(this.usersStore);

            // Limpar dados antigos
            store.clear();

            // Salvar cada usuário
            users.forEach((user, index) => {
                store.add({
                    id: Date.now() + index,
                    ...user,
                    savedAt: new Date().toISOString()
                });
            });

            transaction.oncomplete = () => {
                console.log('✅ Usuários salvos em IndexedDB');
                resolve(true);
            };

            transaction.onerror = () => {
                console.error('❌ Erro ao salvar usuários');
                reject(transaction.error);
            };
        });
    }

    async getUsers() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.usersStore], 'readonly');
            const store = transaction.objectStore(this.usersStore);
            const request = store.getAll();

            request.onsuccess = () => {
                console.log(`✅ ${request.result.length} usuários carregados de IndexedDB`);
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('❌ Erro ao carregar usuários');
                reject(request.error);
            };
        });
    }

    async clearAll() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.candidatesStore, this.usersStore], 'readwrite');

            transaction.objectStore(this.candidatesStore).clear();
            transaction.objectStore(this.usersStore).clear();

            transaction.oncomplete = () => {
                console.log('✅ Banco de dados limpo');
                resolve(true);
            };

            transaction.onerror = () => {
                console.error('❌ Erro ao limpar banco de dados');
                reject(transaction.error);
            };
        });
    }

    async loadFromJSON() {
        try {
            // Carregar candidatos do JSON
            const candidatesResponse = await fetch('./data/candidates.json');
            const candidatesData = await candidatesResponse.json();
            
            if (candidatesData.candidates && candidatesData.candidates.length > 0) {
                await this.saveCandidates(candidatesData.candidates);
                console.log('✅ Candidatos carregados do JSON');
            }

            // Carregar usuários do JSON
            const usersResponse = await fetch('./data/users.json');
            const usersData = await usersResponse.json();
            
            if (usersData.users && usersData.users.length > 0) {
                await this.saveUsers(usersData.users);
                console.log('✅ Usuários carregados do JSON');
            }
        } catch (e) {
            console.warn('⚠️ Não foi possível carregar dados do JSON (pode ser primeira vez)');
        }
    }
}

// Instância global
const db = new DatabaseManager();
