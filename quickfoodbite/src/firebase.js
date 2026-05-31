import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAA20CGNPi0Ndv0-Nr1L0vSlCpIArh2Pvs",
  authDomain: "delivery-notifications-b312c.firebaseapp.com",
  projectId: "delivery-notifications-b312c",
  storageBucket: "delivery-notifications-b312c.firebasestorage.app",
  messagingSenderId: "73549844097",
  appId: "1:73549844097:web:7d3b092d04cf075b178780",
  measurementId: "G-7L74RCF56J"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);