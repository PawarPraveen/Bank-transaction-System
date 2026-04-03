
const express = require('express');

const accountController = require('../controller/account.controller');

const router = express.Router();

router.post('/create', accountController.createAccount);
router.get('/account/:accountId', accountController.getAccountDetails);

module.exports = router;


