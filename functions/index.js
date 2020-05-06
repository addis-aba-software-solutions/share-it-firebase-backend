const functions = require('firebase-functions');
const app = require('express')();
const firebase = require('firebase');
const { firebaseConfig } = require('./utils/firebase');
firebase.initializeApp(firebaseConfig);
const { validate } = require('./utils/validater');
// const { API } = require('./utils/api');
const { login, signup } = require('./Accounts/users');
const { addProduct, getProducts, getProduct, getProductByCatagory, getProductBySubCatagory } = require('./Posts/post');


app.post('/login', validate('login'), login);
// app.post('/signup', validate('signup'), signup);
app.post('/signup', validate('signup'), signup);
app.post('/addProduct', validate('post'), addProduct);
app.get('/items', getProducts);
app.get('/item', getProduct);
app.get('/item-by-category', getProductByCatagory);
app.get('/item-by-sub-category', getProductBySubCatagory);
exports.api = functions.https.onRequest(app);
