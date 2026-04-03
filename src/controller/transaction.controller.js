const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledgeer.model');
const EmailService = require('../services/email.service');
const accountModel = require('../models/account.model');

async function createTransaction(req, res) {
    const { fromAccount, toAccount, amount } = req.body;
    const idempotencyKey = req.headers['idempotency-key'];

    if (!idempotencyKey || !fromAccount || !toAccount || !amount) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const existingTransaction = await transactionModel.findOne({ idempotencyKey });
        if (existingTransaction) {
            return res.status(200).json({ message: 'Transaction already processed', transaction: existingTransaction });
        }   
        const transaction = await transactionModel.create({ fromAccount, toAccount, amount, idempotencyKey });
        await ledgerModel.create({ account: fromAccount, amount: -amount, transaction: transaction._id });
        await ledgerModel.create({ account: toAccount, amount: amount, transaction: transaction._id });
        EmailService.sendTransactionNotification(fromAccount, toAccount, amount);
        return res.status(201).json({ message: 'Transaction created successfully', transaction });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating transaction', error: error.message });
    }   
}

async function initializeTransactions(req, res) {
    const { fromAccount, toAccount } = req.body;
    const idempotencyKey = req.headers['idempotency-key'];
    if (!fromAccount || !toAccount || !idempotencyKey) {
        return res.status(400).json({ message: 'fromAccount, toAccount and idempotencyKey are required' });
    }
    const touseraccount = await accountModel.findOne({
        _id: toAccount
    }).populate('user');
    if (!touseraccount) {
        return res.status(404).json({ message: 'Recipient account not found' });
    }
    const fromuseraccount = await accountModel.findOne({
        systemUser: true,
        user : req.user._id
    });
    if (!fromuseraccount) {
        return res.status(404).json({ message: 'Sender account not found' });
    }

    const session = await transactionModel.startSession();
    session.startTransaction();

    const transaction = new transactionModel({ fromAccount: fromuseraccount._id, toAccount, amount: 0, idempotencyKey, status : 'pending' });
    const debitEntry = await ledgerModel.create([{ account: fromuseraccount._id, balance: 0, transaction: transaction._id, type: 'debit' }], { session });
    const creditEntry = await ledgerModel.create([{ account: toAccount, balance: 0, transaction: transaction._id, type: 'credit' }], { session });  
    transaction.status = 'completed';
    await transaction.save({ session });         
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ message: 'Transaction initialized successfully', transaction: transaction });

}

module.exports = { createTransaction, initializeTransactions };