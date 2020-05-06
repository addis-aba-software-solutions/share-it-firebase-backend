const functions = require('firebase-functions');
const app = require('express')();
const firebase = require('firebase');
const { auth } = require('./utils/routeAuth');
const { firebaseConfig } = require('./utils/firebase');
firebase.initializeApp(firebaseConfig);
const { validate } = require('./utils/validater');
const {
  login,
  signup,
  uploadImage,
  getAuthenticatedUser,
} = require('./Accounts/users');
const { uploadPostImage } = require('./Posts/post');

app.post('/login', validate('login'), login);
app.post('/signup', validate('signup'), signup);
app.post('/users/image', auth, uploadImage);
// app.post('/user', auth, getAuthenticatedUser);
app.post('/posts', auth, uploadPostImage);
exports.api = functions.https.onRequest(app);
