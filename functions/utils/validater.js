const { body } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'signup':
      return [
        body('firstName', 'firstName must not be empty').notEmpty(),
        body('lastName', 'lastName must not be empty').notEmpty(),
        body('email', 'email must not be empty')
          .notEmpty()
          .if(body('email').notEmpty())
          .isEmail()
          .withMessage('Not a valid email address'),
        body('phoneNumber', 'phoneNumber must not be empty').notEmpty(),
        body('telegram').optional(),
        body('facebook').optional(),
        body('whatsapp').optional(),
        body('gender', 'gender must not be empty').notEmpty(),
        body('country', 'country must not be empty').notEmpty(),
        body('birthDay', 'birthDay must not be empty').notEmpty(),
        body('streetAddress', 'streetAddress must not be empty').notEmpty(),
        body('streetAddress2', 'streetAddress2 must not be empty').notEmpty(),
        body('state', 'state must not be empty').notEmpty(),
        body('zipcode', 'zipcode must not be empty').notEmpty(),
        body('password', 'password must not be empty').notEmpty(),
      ];
    case 'login':
      return [
        body('email', 'email must not be empty')
          .notEmpty()
          .if(body('email').notEmpty())
          .isEmail()
          .withMessage('Not a valid email address'),
        body('password', 'password must not be empty').notEmpty(),
      ];
    case 'post':
      return [body('title', 'firstName must not be empty').notEmpty()];

    default:
      return null;
  }
};
