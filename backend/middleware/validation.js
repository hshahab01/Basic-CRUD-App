
const { param, body, validationResult, checkSchema } = require('express-validator');
const Test = require('../models/testModel');

module.exports = {
  validateId: () => {
    return [
      param('id').custom(async value => {
        const user = await Test.findById(value);
        if (!user) {
          throw new Error('User does not exist');
        }
      }),
    ];
  },
  validateData: () => {
    return [
      body('data').custom(async (value, { req }) => {
        await Promise.all([
          body('fileName').notEmpty().withMessage('Enter a file name').run(req),
          body('name').notEmpty().withMessage('Name is mandatory').run(req),
          body('email').notEmpty().trim().isEmail().withMessage('Invalid email').run(req),
          body('password').notEmpty().isLength({ min: 8, max: 12 }).withMessage('Invalid password').run(req),
          body('contact').notEmpty().trim().isMobilePhone().withMessage('Invalid contact').run(req),
        ]);
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
          throw new Error('Invalid input data');
        }
      })
    ]
  },
  validateData1: () =>
    checkSchema({
      name: {
        notEmpty: true,
        errorMessage: 'Name field cannot be empty',
      },
      email: {
        trim: true,
        isEmail: true,
        notEmpty: true,
        errorMessage: 'Invalid email',
      },
      password: {
        notEmpty: true,
        isLength: {
          options: { min: 8, max: 12 },

        },
        errorMessage: 'Invalid password',
      },
      contact: {
        trim: true,
        isMobilePhone: true,
        notEmpty: true,
        errorMessage: 'Invalid contact number',
      },
    })
}

