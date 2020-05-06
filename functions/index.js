const functions = require('firebase-functions');
const app = require('express')();
const firebase = require('firebase');
const cors = require('cors');
const { auth } = require('./utils/routeAuth');
const { firebaseConfig } = require('./utils/firebase');
const { validate } = require('./utils/validater');

firebase.initializeApp(firebaseConfig);
app.use(cors());

const {
  getProducts,
  getProduct,
  getProductByCatagory,
  getProductBySubCatagory,
  postItem,
  subCatagory,
} = require('./Posts/post');

const { login, signup, uploadImage } = require('./Accounts/users');

app.post('/login', validate('login'), login);
app.post('/signup', validate('signup'), signup);
app.post('/users/image', auth, uploadImage);

app.get('/items', auth, getProducts);
app.get('/item', auth, getProduct);
app.get('/item-by-category', auth, getProductByCatagory);
app.get('/item-by-sub-category', auth, getProductBySubCatagory);
app.post('/subCatagory', auth, subCatagory);

app.post('/posts', auth, validate('post'), postItem);

exports.api = functions.https.onRequest(app);
