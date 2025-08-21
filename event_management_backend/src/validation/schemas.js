const { body, param } = require('express-validator');

const email = body('email').isEmail().withMessage('Valid email required');
const password = body('password').isLength({ min: 6 }).withMessage('Password min 6 chars');
const name = body('name').isString().notEmpty();

const authRegister = [name, email, password];
const authLogin = [email, password];

const mongoIdParam = (name) => param(name).isMongoId().withMessage('Invalid ID');

const createEvent = [
  body('title').isString().notEmpty(),
  body('description').optional().isString(),
  body('location').optional().isString(),
  body('startTime').isISO8601().toDate(),
  body('endTime').isISO8601().toDate(),
  body('capacity').optional().isInt({ min: 0 }).toInt(),
  body('isPublic').optional().isBoolean().toBoolean(),
];

const updateEvent = [
  body('title').optional().isString().notEmpty(),
  body('description').optional().isString(),
  body('location').optional().isString(),
  body('startTime').optional().isISO8601().toDate(),
  body('endTime').optional().isISO8601().toDate(),
  body('capacity').optional().isInt({ min: 0 }).toInt(),
  body('isPublic').optional().isBoolean().toBoolean(),
];

const rsvp = [
  mongoIdParam('id'),
  body('status').isIn(['yes', 'no', 'maybe']),
  body('note').optional().isString(),
];

module.exports = {
  authRegister,
  authLogin,
  mongoIdParam,
  createEvent,
  updateEvent,
  rsvp,
};
