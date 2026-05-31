importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyAA20CGNPi0Ndv0-Nr1L0vSlCpIArh2Pvs",
  authDomain: "delivery-notifications-b312c.firebaseapp.com",
  projectId: "delivery-notifications-b312c",
  storageBucket: "delivery-notifications-b312c.firebasestorage.app",
  messagingSenderId: "73549844097",
  appId: "1:73549844097:web:7d3b092d04cf075b178780",
  measurementId: "G-7L74RCF56J"
  
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo192.png",
  });
});