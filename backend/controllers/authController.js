const { StreamChat } = require('stream-chat');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// inicijalizacija Stream
const streamClient = new StreamChat(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);

// =====================
// REGISTER (samo user)
// =====================
exports.register = async (req, res) => {
    console.log(req.body);
    try {
        const firstName = req.body.firstName.replace(/\s/g, '_').toLowerCase();
        const lastName = req.body.lastName.replace(/\s/g, '_').toLowerCase();
        const username = `${firstName}${lastName}`;

        const password = req.body.password.replace(/\s/g, '_').toLowerCase();
        if (!password) return res.status(400).json({ error: 'Password is required' });

        // proveri MongoDB
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // kreiraj user u MongoDB
        const user = await User.create({
            username,
            password: hashedPassword,
            role: 'user',
            streamId: username,
            firstname: req.body.firstName,
            lastname: req.body.lastName
        });

        // kreiraj user u Stream Chat
        await streamClient.updateUser({
            id: username,
            name: firstName,
            role: 'user'
        });

        // kreiraj chat kanal sa adminom
        const channel = streamClient.channel('messaging', username, {
            name: `Chat with ${username}`,
            created_by: { id: 'admin' }
        });
        await channel.create();
        await channel.addMembers([username, 'admin']);

        // generiši Stream token
        const token = streamClient.createToken(username);

        res.status(201).json({
            userId: username,
            role: 'user',
            token,
            streamApiKey: process.env.STREAM_API_KEY
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const firstName = req.body.firstName.replace(/\s/g, '_').toLowerCase();
        const lastName = req.body.lastName.replace(/\s/g, '_').toLowerCase();
        const username = `${firstName}${lastName}`;
        const password = req.body.password;

        // proveri MongoDB
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // provera passworda
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

        // generiši Stream token
        const token = streamClient.createToken(user.username);

        res.status(200).json({
            userId: user.username,
            role: user.role,
            token,
            streamApiKey: process.env.STREAM_API_KEY
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};