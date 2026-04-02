const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { sendRegistrationEmail } = require('../services/mail.services');

async function register(req, res) {
    try {
        const { mail, name, password } = req.body;

        if (!mail || !name || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // 1. Create the user
        const newUser = await User.create({ mail, name, password });

        // 2. Generate the token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // 3. Set the cookie FIRST, then send the JSON response
        res.cookie('token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000
        });

        // 4. Send registration email
        await sendRegistrationEmail(newUser.mail, newUser.name).catch(err => console.error('Email send failed:', err));

        return res.status(201).json({ 
            message: "User registered successfully", 
            user: { id: newUser._id, name: newUser.name, mail: newUser.mail } 
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

async function login(req, res) {
    try {
        const { mail, password } = req.body;    
        if (!mail || !password) {
            return res.status(400).json({ message: "Please provide both email and password" });
        }   
        const user = await User.findOne({ mail }).select('+password');
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000
        });
        return res.status(200).json({ 
            message: "Login successful", 
            user: { id: user._id, name: user.name, mail: user.mail } 
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}


module.exports = { register, login };
