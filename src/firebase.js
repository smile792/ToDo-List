import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: "todo-list-20d1d.firebaseapp.com",
  projectId: "todo-list-20d1d",
  storageBucket: "todo-list-20d1d.firebasestorage.app",
  messagingSenderId: "644413083597",
  appId: "1:644413083597:web:c2aa4752ebb82898b77e84",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
