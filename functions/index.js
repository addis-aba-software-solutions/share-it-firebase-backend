const functions = require('firebase-functions');
const app = require('express')();
const firebase = require('firebase');
const { auth } = require('./utils/routeAuth');
const { firebaseConfig } = require('./utils/firebase');
firebase.initializeApp(firebaseConfig);
const { validate } = require('./utils/validater');
const { login, signup, uploadImage } = require('./Accounts/users');

app.post('/login', validate('login'), login);
app.post('/signup', validate('signup'), signup);
app.post('/users/image', auth, uploadImage);
exports.api = functions.https.onRequest(app);
