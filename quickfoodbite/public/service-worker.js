/* =========================================================
   QUICKFOODBITE SERVICE WORKER
   Firebase Cloud Messaging + Notification Handling
   ========================================================= */

importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);


/* =========================================================
   FIREBASE INITIALIZATION
   ========================================================= */

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


/* =========================================================
   INSTALL
   ========================================================= */

self.addEventListener("install", (event) => {
  console.log("[SW] Installed");

  // Activate the new worker immediately
  self.skipWaiting();
});


/* =========================================================
   ACTIVATE
   ========================================================= */

self.addEventListener("activate", (event) => {
  console.log("[SW] Activated");

  event.waitUntil(
    self.clients.claim()
  );
});


/* =========================================================
   FCM BACKGROUND MESSAGE
   ========================================================= */

messaging.onBackgroundMessage((payload) => {

  console.log(
    "[SW] FCM background message received:",
    payload
  );


  const notificationTitle =
    payload.notification?.title ||
    payload.data?.title ||
    "QuickFoodBite";

  const notificationBody =
    payload.notification?.body ||
    payload.data?.body ||
    "You have a new notification.";
const orderId = payload.data?.orderId;
  const notificationOptions = {
    body: notificationBody,

    icon: "/FleentLogo.png",

    badge: "/FleentLogo.png",


    
    data: {
      url:
        payload.data?.url ||
        `/dashboard/moderator/claim/${orderId}`,

      orderId:
        payload.data?.orderId || null
    },

    tag:
      payload.data?.orderId
        ? `quickfoodbite-order-${payload.data.orderId}`
        : "quickfoodbite-notification",

    renotify: true,

    requireInteraction: true
  };


  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});


/* =========================================================
   NOTIFICATION CLICK
   ========================================================= */

self.addEventListener("notificationclick", (event) => {

  console.log("[SW] Notification clicked");

  event.notification.close();

  const urlToOpen =
    event.notification.data?.url ||
    "/dashboard/moderator";


  event.waitUntil(

    self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    })

    .then((clientList) => {

      // If QuickFoodBite is already open
      for (const client of clientList) {

        if (
          client.url.includes("quickfoodbite.netlify.app") &&
          "focus" in client
        ) {

          client.focus();

          if ("navigate" in client) {
            return client.navigate(urlToOpen);
          }

          return;
        }
      }


      // Otherwise open a new tab
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }

    })

  );
});