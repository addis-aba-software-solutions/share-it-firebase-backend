const { admin, db } = require('./firebase');

exports.auth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split('Bearer ')[1];
  } else {
    res.status(403).json({
      error: 'Unauthorized',
    });
  }

  try {
    decodedToken = await admin.auth().verifyIdToken(token);
  } catch (error) {
    return res.status(500).json({
      error: 'Invalid or expired Token',
    });
  }

  req.user = decodedToken;
  data = await db
    .collection('users')
    .where('userId', '==', req.user.uid)
    .limit(1)
    .get();
  req.user.email = data.docs[0].data().email;
  return next();
};
