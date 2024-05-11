import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1EJ1zGh-cdxQQQOGpgplqxku2FvvJg5I",
  authDomain: "proyecto-final-e45c0.firebaseapp.com",
  projectId: "proyecto-final-e45c0",
  storageBucket: "proyecto-final-e45c0.appspot.com",
  messagingSenderId: "402988538852",
  appId: "1:402988538852:web:f8e813de94231f64f705f1",
  measurementId: "G-B8G23M1JC6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };