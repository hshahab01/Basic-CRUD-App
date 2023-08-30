const express = require('express');
const router = express.Router();
const {createUser, deleteUser, getUser, updateContact} = require('../controller/testController')
const idValidator = require('../middleware/validation')


const idValidation = idValidator.validateId();
const dataValidation = idValidator.validateData();
const dataValidation1 = idValidator.validateData1();
router.post('/', dataValidation1, createUser);
router.get('/get', getUser);
router.put('/update/:id', idValidation, updateContact);
router.delete('/delete/:id', idValidation, deleteUser);

module.exports = router