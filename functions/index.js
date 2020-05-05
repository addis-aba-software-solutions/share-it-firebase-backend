const functions = require('firebase-functions');
const app = require('express')();
const firebase = require('firebase');
const { firebaseConfig } = require('./utils/firebase');
firebase.initializeApp(firebaseConfig);
const { validate } = require('./utils/validater');
// const { API } = require('./utils/api');
const { login, signup } = require('./Accounts/users');

app.post('/login', validate('login'), login);
app.post('/signup', validate('signup'), signup);
exports.api = functions.https.onRequest(app);
