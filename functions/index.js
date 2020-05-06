const functions = require('firebase-functions');
const app = require('express')();
const firebase = require('firebase');
const { auth } = require('./utils/routeAuth');
const { firebaseConfig } = require('./utils/firebase');
firebase.initializeApp(firebaseConfig);
const { validate } = require('./utils/validater');
// const { API } = require('./utils/api');
const { login, signup } = require('./Accounts/users');
const { addProduct, getProducts, getProduct, getProductByCatagory, getProductBySubCatagory } = require('./Posts/post');

const {
    login,
    signup,
    uploadImage,
    getAuthenticatedUser,
} = require('./Accounts/users');
const { uploadPostImage, subCatagory } = require('./Posts/post');

app.post('/login', validate('login'), login);
// app.post('/signup', validate('signup'), signup);
app.post('/signup', validate('signup'), signup);
app.post('/addProduct', validate('post'), addProduct);
app.get('/items', getProducts);
app.get('/item', getProduct);
app.get('/item-by-category', getProductByCatagory);
app.get('/item-by-sub-category', getProductBySubCatagory);
app.post('/users/image', auth, uploadImage);
// app.post('/user', auth, getAuthenticatedUser);
app.post('/posts', auth, uploadPostImage);
app.post('/subCatagory', auth, subCatagory);
exports.api = functions.https.onRequest(app);
