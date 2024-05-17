require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT;
const secretKey = process.env.SECRET; 
const User = require('./models/User');
const checkFeatureFlag = require('./middlewares/checkFeatureFlag');
const checkAdmin = require('./middlewares/checkAdmin');
const connectDB = require('./config/database');


app.use(express.json());


connectDB();




app.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role: role || 'user' });
        await newUser.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(400).send('Error registering user');
    }
});



app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).send('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(400).send('Error logging in');
    }
});


app.get('/', checkFeatureFlag, (req, res) => {
    if (req.isFlagEnabled) {
        res.send('<html><body><h1>Carlos Feature Flags New Version</h1></body></html>');
    } else {
        res.send('<html><body><h1>Carlos Feature Flags Old Version</h1></body></html>');
    }
});



app.put('/user/:id/flag', checkFeatureFlag, checkAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const { flagEnabled } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.flagEnabled = flagEnabled;
        await user.save();

        res.send('User flag updated');
    } catch (error) {
        res.status(400).send('Error updating user flag');
    }
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
