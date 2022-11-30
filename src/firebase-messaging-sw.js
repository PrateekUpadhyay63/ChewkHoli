// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js');
// second option
// import {initializeApp} from "firebase/app";
// import {getMessaging, onBackgroundMessage} from "firebase/messaging/sw";
// 
// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.

firebase.initializeApp({
    apiKey: "AIzaSyD3lDEfCon7Grkw7lirjQY13zFa6qRPgJA",
    authDomain: "dubaipolice-5fbda.firebaseapp.com",
    projectId: "dubaipolice-5fbda",
    storageBucket: "dubaipolice-5fbda.appspot.com",
    messagingSenderId: "254203612880",
    appId: "1:254203612880:web:78e65d01b4cd65caa258d5",
    measurementId: "G-LP71GNN9MZ"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log("Received background message ", payload);
  if(payload.data.notification_type == "call"){
    const notificationTitle = payload.data.name;
    const notificationOptions = {
      body: `${payload.data.sender_Name} has started group call`,
      // icon: './assets/images/logo/dubai-police.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  }else {
    const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.body,
      // icon: './assets/images/logo/dubai-police.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  }
  //   self.addEventListener('notificationclick', function(event){
  //     const nUrl = "http://localhost:4201/notifications/notifications"
  //     // event. notification.data.customProperty;
  //  })
  });

//second option
// const messaging = getMessaging(initializeApp({
//     apiKey: "AIzaSyD3lDEfCon7Grkw7lirjQY13zFa6qRPgJA",
//     authDomain: "dubaipolice-5fbda.firebaseapp.com",
//     projectId: "dubaipolice-5fbda",
//     storageBucket: "dubaipolice-5fbda.appspot.com",
//     messagingSenderId: "254203612880",
//     appId: "1:254203612880:web:78e65d01b4cd65caa258d5",
//     measurementId: "G-LP71GNN9MZ"
//   }));