// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  hmr: false,
  //  apiUrl: 'http://localhost:3015/v1'
  //  apiUrl: "https://dubaipoliceapistage.iworklab.com/v1", /* Staging server for internal testing and use  */
  apiUrl:"https://dubaipoliceapidev.iworklab.com/v1" /* Development Server URL(Client)  */,
  domainUrl: "dbchatdev.iworklab.com",
  domainPort: "5443",
  audioServerUrl: "dbvoicedev.iworklab.com",
  adminJid: 'admin@dbchatdev.iworklab.com', // for chat notification
  firebase: {
    apiKey: "AIzaSyD3lDEfCon7Grkw7lirjQY13zFa6qRPgJA",
    authDomain: "dubaipolice-5fbda.firebaseapp.com",
    projectId: "dubaipolice-5fbda",
    storageBucket: "dubaipolice-5fbda.appspot.com",
    messagingSenderId: "254203612880",
    appId: "1:254203612880:web:78e65d01b4cd65caa258d5",
    measurementId: "G-LP71GNN9MZ"
  },
  mapStyleUrl: 'https://map.rpipro.xyz/hot/{z}/{x}/{y}.png',
  liveStreamServrUrl: "https://dbstreamdev.iworklab.com/api/server",
  socketUrl: "wss://dubaipoliceapidev.iworklab.com",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
