import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuration Firebase KitMotors
const firebaseConfig = {
  apiKey: "AIzaSyBXGhtdGKAhjVUcFHiLW4R_PWbv_cUz7zg",
  authDomain: "kitmotors-app-web.firebaseapp.com",
  projectId: "kitmotors-app-web",
  storageBucket: "kitmotors-app-web.firebasestorage.app",
  messagingSenderId: "217733694314",
  appId: "1:217733694314:web:53a2979fcc03b081535b13",
  measurementId: "G-ZQ2HHSL8R3"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Exporter les services
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
