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
  updatePostStatus,
} = require('./Posts/post');

const {
  login,
  signup,
  uploadImage,
  getAuthenticatedUser,
} = require('./Accounts/users');

app.post('/login', validate('login'), login);
app.post('/signup', validate('signup'), signup);
app.post('/users/image', auth, uploadImage);
app.get('/getuser', auth, getAuthenticatedUser);

app.get('/items', getProducts);
app.get('/item', getProduct);
app.get('/item-by-category', getProductByCatagory);
app.get('/item-by-sub-category', getProductBySubCatagory);
app.post('/subCatagory', subCatagory);

app.post('/posts', auth, validate('post'), postItem);
app.post('/updateItemStatus', auth, updatePostStatus);

exports.api = functions.https.onRequest(app);
