const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    mail : {
        type : String,
        required : true,
        unique : [true, "Email already exists"],
        trim : true,
        lowercase : true,
        match : [/\S+@\S+\.\S+/, "Please provide a valid email address"]
    },
    name : {
        type : String,
        required : true,
        
    },
    password : {
        type : String,
        required : true,   
        minlength : [6, "Password must be at least 6 characters long"],
        select : false
    },
    systemuser : {
        type : Boolean,
        default : false,
        immutable : true,
        select : false
    },
    Timestamp : {
        type : Date,
        default : Date.now
    }
})
userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.comparePassword = async function(Password) {
    return await bcrypt.compare(Password, this.password);
};
const User = mongoose.model('User', userSchema);

module.exports = User;
