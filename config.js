// ⚠️ TEMPLATE DE CONFIGURAÇÃO
// Copie este arquivo para config.js e adicione as credenciais do Firebase
// NÃO FAÇA COMMIT do config.js com dados sensíveis!

const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyDRpbo28T2bYmyrfHwHzMJG-CG23qAQcCQ',
    authDomain: 'quizwar-b4bc7.firebaseapp.com',
    projectId: 'quizwar-b4bc7',
    storageBucket: 'quizwar-b4bc7.firebasestorage.app',
    messagingSenderId: '747141031490',
    appId: '1:747141031490:web:26f314c265d46b161c2fdb',
    measurementId: 'G-Q2YZYVV66N'
};

// Inicializar Firebase
if (typeof firebaseManager !== 'undefined' && FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey !== 'SEU_API_KEY_AQUI') {
    firebaseManager.init(FIREBASE_CONFIG);
} else {
    console.warn('⚠️ Firebase não configurado. Use config.js para definir FIREBASE_CONFIG.');
}
