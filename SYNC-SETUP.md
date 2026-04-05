# 🔄 Sistema de Sincronização Automática - Brasil Quiz

## ⚠️ IMPORTANTE: Token GitHub Compromissado

Um token GitHub foi compartilhado em texto plano e **DEVE SER REVOGADO IMEDIATAMENTE**.

### 🚨 O que fazer agora:

1. **Revogue o token antigo:**
   - Vá em: https://github.com/settings/tokens
   - Procure por `Brasil-Quiz-Auto-Sync`
   - Clique em "Delete"

2. **Gere um novo token:**
   - Vá em: https://github.com/settings/tokens/new
   - Clique em "Generate new token (classic)"
   - Nome: `Brasil-Quiz-Auto-Sync`
   - Permissões necessárias:
     - ✅ `repo` (full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
   - Clique em "Generate token"
   - **COPIE O TOKEN GERADO** (apareça apenas uma vez!)

3. **Configure o token no arquivo `config.js`:**
   - Abra `/workspaces/brasil/config.js`
   - Substitua `SEU_TOKEN_AQUI` pelo novo token
   - **NÃO FAÇA COMMIT** deste arquivo com o token exposto

4. **Não versionem o arquivo config.js com token:**
   - Adicione ao `.gitignore`:
   ```
   config.js
   ```

## 🔄 Como funciona agora

### **Fluxo Automático:**

```
1️⃣ José (Candidato) responde /congresso/
   ↓
   → Auto-sincroniza para GitHub (data/candidates.json)

2️⃣ Maria (Usuária) responde /
   ↓
   → Carrega candidatos automaticamente do GitHub
   ↓
   → Vê José nos resultados ✅
   ↓
   → Auto-sincroniza suas respostas para GitHub

3️⃣ João (Candidato) responde /congresso/
   ↓
   → Auto-sincroniza para GitHub
   ↓
   → Próximos usuários veem João também ✅
```

## 🛠️ Funcionalidades

### **Sincronização Automática:**
- ✅ Quando candidato salva → Sync para GitHub
- ✅ Quando usuário termina quiz → Sync de respostas
- ✅ Ao iniciar → Carrega dados mais recentes do GitHub
- ✅ Atualização em tempo real

### **Fallback Automático:**
- Se GitHub indisponível → Usa IndexedDB local
- Se IndexedDB indisponível → Usa localStorage
- Nunca perde dados

### **Segurança:**
- Token configurado em arquivo separado (config.js)
- Arquivo config.js pode ser ignorado do Git (.gitignore)
- GitHub Pages é apenas para visualização pública

## 📝 Arquivos Criados/Modificados

- **`github-sync.js`** → Sistema de sincronização GitHub
- **`config.js`** → Configuração do token (⚠️ CUIDADO)
- **Arquivos atualizados:**
  - `index.html` - Adicionados scripts
  - `script.js` - Sincronização automática no showResults()
  - `congresso/index.html` - Scripts adicionados
  - `congresso/candidate-setup.js` - Sync ao salvar candidato
  - `candidates.js` - Carrega do GitHub na inicialização

## ⚠️ Lembre-se

1. **NÃO COMPARTILHE** o token em texto plano
2. **NUNCA** faça commit do config.js com token exposto
3. **REVOGUE** o token antigo imediatamente
4. Use **variáveis de ambiente** em produção (GitHub Secrets)

## 🚀 Próximos passos

1. Revogue o token antigo
2. Gere um novo token
3. Configure em `config.js`
4. Teste o fluxo completo
5. (Opcional) Configure GitHub Secrets para produção

## ✨ Benefícios

- **Automático:** Sem ação manual do admin
- **Tempo Real:** Dados sincronizados instantaneamente
- **Confiável:** Fallback automático se GitHub cair
- **Fácil:** Configuração simples
- **Seguro:** Token configurável/revogável
