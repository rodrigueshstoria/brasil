# brasil
Eleição do Brasil

## Configuração do GitHub Token

Para que a sincronização funcione no GitHub Pages, é necessário que o arquivo `config.js` exista no repositório e contenha seu token GitHub válido.

O arquivo deve ter este formato:

```javascript
const GITHUB_TOKEN = 'SEU_TOKEN_AQUI';

if (typeof githubSync !== 'undefined' && GITHUB_TOKEN && GITHUB_TOKEN !== 'SEU_TOKEN_AQUI') {
    githubSync.setToken(GITHUB_TOKEN);
    console.log('✅ GitHub sync ativado');
}
```

### Importante
- Se você não quiser expor o token publicamente, não coloque o `config.js` no repositório.
- Mas usando apenas o GitHub Pages sem servidor, o token precisa estar disponível no código para que a sincronização funcione.
