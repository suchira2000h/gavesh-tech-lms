import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyArAPeCPA8dHNaUm6dsMA1j7ef40ChddU4",
  authDomain: "gavesh-tech-lms.firebaseapp.com",
  projectId: "gavesh-tech-lms",
  storageBucket: "gavesh-tech-lms.firebasestorage.app",
  messagingSenderId: "572392534858",
  appId: "1:572392534858:web:1cbae79e92c3062cca47b3",
  measurementId: "G-PN0308V4F3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
