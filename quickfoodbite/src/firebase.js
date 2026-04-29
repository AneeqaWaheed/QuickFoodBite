// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu0EXrDYRiwnY_iLv-ESMKwpyw35Ca1Sc",
  authDomain: "burgershop-2975b.firebaseapp.com",
  projectId: "burgershop-2975b",
  storageBucket: "burgershop-2975b.appspot.com",
  messagingSenderId: "908185664888",
  appId: "1:908185664888:web:af2f96c792da4162e0dc8d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
