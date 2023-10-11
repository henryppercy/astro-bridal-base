import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAzVUpEOiTctRqLJzHqvdtvqRWZzsgaAl4",
  authDomain: "astro-bridal-base.firebaseapp.com",
  projectId: "astro-bridal-base",
  storageBucket: "astro-bridal-base.appspot.com",
  messagingSenderId: "284128060875",
  appId: "1:284128060875:web:a37abe8c16ff707fc0c24e"
};

export const app = initializeApp(firebaseConfig);
