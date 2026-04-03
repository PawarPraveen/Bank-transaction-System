const mongoose = require('mongoose');
const Transaction = require('./transaction.model');

const ledgerSchema = new mongoose.Schema({
    account : {
        type : mongoose.Schema.Types.ObjectId,  
        ref : 'Account',
        required : true,
        index : true,
        immutable : true
    },
    balance : {
        type : Number,
        required : true,
        min : 0,
        immutable : true
    },
    Transaction : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Transaction',
        required : true,
        index : true,
        immutable : true
    },
    type : {
        type : String,
        enum : ['debit', 'credit'],
        required : true,
       immutable : true
    }
}, {
    timestamps : true
});

function preventNegativeBalance(next) {
    if (this.balance < 0) {
        return next(new Error('Balance cannot be negative'));
    }
    return next();
}

ledgerSchema.pre('save', preventNegativeBalance);
ledgerSchema.pre('findOneAndUpdate', preventNegativeBalance);

function preventTransactionModification(next) {
    if (this.isModified('Transaction')) {
        return next(new Error('Transaction reference cannot be modified'));
    }   
    return next();
}

ledgerSchema.pre('save', preventTransactionModification);
ledgerSchema.pre('findOneAndUpdate', preventTransactionModification);
ledgerSchema.pre('updateOne', preventTransactionModification);
ledgerSchema.pre('updateMany', preventTransactionModification);
ledgerSchema.pre('update', preventTransactionModification); 
ledgerSchema.pre('deleteOne', preventTransactionModification);
ledgerSchema.pre('deleteMany', preventTransactionModification);
ledgerSchema.pre('remove', preventTransactionModification);
ledgerSchema.pre('findOneAndDelete', preventTransactionModification);
ledgerSchema.pre('findOneAndRemove', preventTransactionModification);

const Ledger = mongoose.model('Ledger', ledgerSchema);

module.exports = Ledger;