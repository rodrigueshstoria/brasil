// Sistema de sincronização automática com GitHub
class GitHubSync {
    constructor() {
        this.repoOwner = 'rodrigueshstoria';
        this.repoName = 'brasil';
        this.branch = 'main';
        this.token = null; // Será definido via config
    }

    setToken(token) {
        this.token = token;
    }

    async syncCandidates(candidates) {
        if (!this.token) {
            console.warn('⚠️ Token não configurado. Sincronização automática desativada.');
            return false;
        }

        try {
            const data = {
                candidates: candidates,
                lastUpdate: new Date().toISOString()
            };

            await this.commitFile(
                'data/candidates.json',
                JSON.stringify(data, null, 2),
                `[Auto-sync] Atualizar candidatos - ${new Date().toLocaleString('pt-BR')}`
            );

            console.log('✅ Candidatos sincronizados no GitHub');
            return true;
        } catch (e) {
            console.error('❌ Erro ao sincronizar candidatos:', e);
            return false;
        }
    }

    async syncUsers(users) {
        if (!this.token) {
            console.warn('⚠️ Token não configurado. Sincronização automática desativada.');
            return false;
        }

        try {
            const data = {
                users: users,
                lastUpdate: new Date().toISOString()
            };

            await this.commitFile(
                'data/users.json',
                JSON.stringify(data, null, 2),
                `[Auto-sync] Atualizar respostas de usuários - ${new Date().toLocaleString('pt-BR')}`
            );

            console.log('✅ Respostas sincronizadas no GitHub');
            return true;
        } catch (e) {
            console.error('❌ Erro ao sincronizar respostas:', e);
            return false;
        }
    }

    async commitFile(filePath, content, message) {
        // Passo 1: Obter SHA do arquivo atual
        const getShaUrl = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${filePath}`;
        
        let sha = null;
        try {
            const getResponse = await fetch(getShaUrl, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (getResponse.ok) {
                const data = await getResponse.json();
                sha = data.sha;
            }
        } catch (e) {
            console.log('Arquivo não existe ainda, será criado novo');
        }

        // Passo 2: Fazer commit
        const commitUrl = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${filePath}`;
        
        const commitData = {
            message: message,
            content: btoa(content),
            branch: this.branch
        };

        if (sha) {
            commitData.sha = sha;
        }

        const response = await fetch(commitUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commitData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`GitHub API error: ${errorData.message}`);
        }

        return response.json();
    }

    async pullLatestData() {
        try {
            // Puxar certificados do GitHub
            const candidatesResponse = await fetch(`https://raw.githubusercontent.com/${this.repoOwner}/${this.repoName}/${this.branch}/data/candidates.json`);
            const candidatesData = await candidatesResponse.json();

            // Puxar usuários do GitHub
            const usersResponse = await fetch(`https://raw.githubusercontent.com/${this.repoOwner}/${this.repoName}/${this.branch}/data/users.json`);
            const usersData = await usersResponse.json();

            console.log('✅ Dados puxados do GitHub');
            return {
                candidates: candidatesData.candidates || [],
                users: usersData.users || []
            };
        } catch (e) {
            console.error('❌ Erro ao puxar dados do GitHub:', e);
            return null;
        }
    }
}

// Instância global
const githubSync = new GitHubSync();
