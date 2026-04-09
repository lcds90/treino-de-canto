import { boot } from 'quasar/wrappers';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC4CaHqMFodB6_9hw5p8u3F9w3h5L8i5Ew",
  authDomain: "rotina-canto.firebaseapp.com",
  projectId: "rotina-canto",
  storageBucket: "rotina-canto.firebasestorage.app",
  messagingSenderId: "738031758900",
  appId: "1:738031758900:web:4739ebdeaaaeb8f9fa6461",
  measurementId: "G-YJEMFQZK8B"
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
