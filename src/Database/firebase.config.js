// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUbRUcfIxOmft2LUrwtDGbjR_NMQz7IC4",
  authDomain: "chatting-app-711fb.firebaseapp.com",
  projectId: "chatting-app-711fb",
  storageBucket: "chatting-app-711fb.firebasestorage.app",
  messagingSenderId: "141432526955",
  appId: "1:141432526955:web:f7f4a9b769a6ef4bfab92e",
  measurementId: "G-W6D478H8HL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;