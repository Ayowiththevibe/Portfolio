const express = require('express');

const sendemail = express.Router();

const {sendEmailcontroller} = require('../controller/sendemailcontroller')

sendemail.post('/', sendEmailcontroller)

module.exports = sendemail;

