const { db } = require('../utils/firebase');
const firebase = require('firebase');
const { validationResult } = require('express-validator');
exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    // Register the user with email and password and get token
    const data = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    const token = await data.user.getIdToken();

    // Get registered user data
    const userId = data.user.uid;
    const newUser = {
      userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      facebook: req.body.facebook,
      telegram: req.body.telegram,
      whatsapp: req.body.whatsapp,
      gender: req.body.gender,
      birthDay: req.body.birthDay,
      description: req.body.description,
      streetAddress: req.body.streetAddress,
      streetAddress2: req.body.streetAddress2,
      state: req.body.state,
      zipcode: req.body.zipcode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // ADD user with email as a document id
    await db.doc(`/users/${newUser.email}`).set(newUser);
    // Return the token
    return res.status(201).json({
      message: `User ${data.user.uid} Successfully Registered!`,
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const loginData = {
      email: req.body.email,
      password: req.body.password,
    };
    // Login user with email and password
    const logedInUser = await firebase
      .auth()
      .signInWithEmailAndPassword(loginData.email, loginData.password);
    // Get user token
    const token = await logedInUser.user.getIdToken();
    return res.status(200).json({
      token,
    });
  } catch (error) {
    if (
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/user-not-found'
    ) {
      return res.status(403).json({
        errors: 'Invalid password or email',
      });
    } else {
      return res.status(500).json({
        errors: error.code,
      });
    }
  }
};