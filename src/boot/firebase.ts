import { boot } from 'quasar/wrappers';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.API_KEY || '',
  authDomain: process.env.AUTH_DOMAIN || '',
  projectId: process.env.PROJECT_ID || '',
  storageBucket: process.env.STORAGE_BUCKET || '',
  messagingSenderId: process.env.MESSAGING_SENDER_ID || '',
  appId: process.env.APP_ID || '',
  measurementId: process.env.MEASUREMENT_ID || '',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default boot(({ app }) => {
  // Opcional: injetar o db globalmente, embora seja melhor importá-lo diretamente nos stores/serviços
  app.config.globalProperties.$db = db;
  app.config.globalProperties.$auth = auth;
});

export { auth, db };
