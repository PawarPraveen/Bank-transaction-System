const { router }  = require('express');
const transactionController = require('../controller/transaction.controller');
const AuthSystemUser = require('../middleware/authSystemUser.middleware');
const Router = require('express').Router;



const transactionRouter = Router();

transactionRouter.post('/', AuthSystemUser, transactionController.createTransaction);
transactionRouter.post('/system/init-funds', AuthSystemUser, transactionController.createTransaction);

module.exports = transactionRouter;