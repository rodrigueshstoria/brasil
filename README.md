# brasil
Eleição do Brasil

Este repositório agora está configurado para funcionar com Firebase Firestore. Você pode copiar os arquivos para o repositório `rodrigueshstoria` e testar lá.

## Configuração do Firebase

Para usar o app, crie um aplicativo web no Firebase e preencha `FIREBASE_CONFIG` em `config.js` com as credenciais do seu projeto.

O arquivo deve ter este formato:

```javascript
const FIREBASE_CONFIG = {
    apiKey: 'SEU_API_KEY_AQUI',
    authDomain: 'SEU_PROJECT_ID.firebaseapp.com',
    projectId: 'SEU_PROJECT_ID',
    storageBucket: 'SEU_PROJECT_ID.appspot.com',
    messagingSenderId: 'SEU_MESSAGING_SENDER_ID',
    appId: 'SEU_APP_ID',
    measurementId: 'SEU_MEASUREMENT_ID'
};
```

### Importante
- Não faça commit de `config.js` com credenciais reais.
- Verifique as regras do Firestore para permitir gravação/leitura enquanto estiver testando.
- O app salva respostas de usuários e candidatos no Firestore quando o Firebase estiver configurado.
