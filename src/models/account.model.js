const mongoose = require('mongoose');
const { captureRejectionSymbol } = require('nodemailer/lib/xoauth2');

const accountSchema = new mongoose.Schema({
    use : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
        index : true
    },
     status : {
        type : String,
        enum : ['active', 'inactive', 'suspended'],
        default : 'active'
     },
        currency : {
        type : String,
        required : true,
        default : 'INR'
        }
}, {
    timestamps : true
});

accountSchema.index({ use: 1 , status: 1 });
   
const Account = mongoose.model('Account', accountSchema);

module.exports = Account;