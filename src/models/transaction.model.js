const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromAccount : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Account',
        required : true,
        index : true
    },
    toAccount : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Account',
        required : true,
        index : true
    },
    amount : {
        type : Number,
        required : true,
        min : 0
    },  
    idempotencyKey : {
        type : String,
        required : true,        
        unique : true,
        index : true
    }

}, {
    timestamps : true
}); 


transactionSchema.index({ fromAccount: 1, toAccount: 1, amount: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);                       


module.exports = Transaction;