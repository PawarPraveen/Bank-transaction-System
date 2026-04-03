const express = require('express');
const AuthRoutes = require('./routes/auth.route');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const account = require('./models/account.model');
const accountRouter = require('./routes/account.route');
const Authmiddleware = require('./middleware/auth.middleware');
const transactionRouter = require('./routes/transaction.route');
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', AuthRoutes);
app.use('/api/accounts', Authmiddleware.authenticateToken, accountRouter);
app.use('/api/transactions', transactionRouter);

module.exports = app;