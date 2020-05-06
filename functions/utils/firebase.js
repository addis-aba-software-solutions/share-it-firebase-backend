var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://share-it-5c4ec.firebaseio.com"
});

const db = admin.firestore();
const firebaseConfig = {
  apiKey: 'AIzaSyDt2YfICPZr7gFzPK25SzwkSPM0JinwAQY',
  authDomain: 'share-it-5c4ec.firebaseapp.com',
  databaseURL: 'https://share-it-5c4ec.firebaseio.com',
  projectId: 'share-it-5c4ec',
  storageBucket: 'share-it-5c4ec.appspot.com',
  messagingSenderId: '719844398617',
  appId: '1:719844398617:web:2d3efb4f29a7c10f2b3c88',
  measurementId: 'G-6MD6G5DXKS',
};
module.exports = { admin, db, firebaseConfig };
