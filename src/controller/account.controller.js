const accountModel = require('../models/account.model');


async function createAccount(req, res) {
    const userId = req.user._id;
    try {
        const existingAccount = await accountModel.findOne({ use: userId });    
        if (existingAccount) {
            return res.status(400).json({ message: 'Account already exists for this user' });
        }   
    const account = await accountModel.create({ use: userId });
    return res.status(201).json({ message: 'Account created successfully', account });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating account', error: error.message });
    }
}
async function getAccountDetails(req, res) {
    const accountId = req.params.userId;
    try {
        const account = await accountModel.findOne({ _id: accountId }).populate('user', 'username email');
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }   
        if (account.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }
        return res.status(200).json({ account });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching account details', error: error.message });
    }
}

    
module.exports = { createAccount, getAccountDetails };
