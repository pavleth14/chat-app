const { StreamChat } = require('stream-chat');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokens');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const streamClient = new StreamChat(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);

// =====================
// REGISTER
// =====================
exports.register = async (req, res) => {
    console.log(req.body);
    try {
        const firstName = req.body.firstName.replace(/\s/g, '_').toLowerCase();
        const lastName = req.body.lastName.replace(/\s/g, '_').toLowerCase();
        const role = req.body.role;
        const username = req.body.userName.replace(/\s/g, '_').toLowerCase();

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
            role: role,
            streamId: username,
            firstname: firstName,
            lastname: lastName
        });

        // // kreiraj user u Stream Chat
        // await streamClient.updateUser({
        //     id: username,
        //     name: firstName,
        //     role: role
        // });

        // // kreiraj chat kanal sa adminom
        // const channel = streamClient.channel('messaging', username, {
        //     name: `Chat with ${username}`,
        //     created_by: { id: 'admin' }
        // });
        // await channel.create();
        // await channel.addMembers([username, 'admin']);

        // // generiši Stream token
        // const token = streamClient.createToken(username);

        res.status(201).json({
            userId: username,
            role: role,
            // token,
            streamApiKey: process.env.STREAM_API_KEY
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// =====================
// LOGIN
// =====================
exports.login = async (req, res) => {
    try {        
        const username = req.body.userName; // koristiti email ili unique ID
        const password = req.body.password;

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

        // JWT
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const hashedRefresh = await bcrypt.hash(refreshToken, 10);
        user.refreshToken = hashedRefresh; // Razmisli o rotaciji refresh tokena (važna stvar)
        await user.save();

        res.cookie("accessToken", accessToken, { // Pavle promeni na accesss token
            httpOnly: true,
            secure: false, // promeni za produkciju: secure: process.env.NODE_ENV === "production"
            sameSite: "lax"
            // dodaj path za refresh rutu: path: "/auth/refresh"
        });

        const streamToken = streamClient.createToken(user.username);  // 13134466

        if (user.role === 'user') {
            await streamClient.updateUser(
                {
                    id: username,
                    name: username
                },
                streamToken
            );
            const channel = streamClient.channel('messaging', username, {
                name: `Chat with ${username}`,
                created_by: { id: 'admin' },
                members: [username, 'admin']
            });

            await channel.create();
            await channel.addMembers([username, 'admin']);

            res.json({
                userId: user.username,
                channelId: user.username,
                role: user.role,
                accessToken,
                streamToken,
                streamApiKey: process.env.STREAM_API_KEY,
                userNamee: user.username
            });

        } else {
            await streamClient.updateUser({
                id: user.username,
                name: user.username,
                role: 'admin'
            });
            const channel = streamClient.channel('messaging', "livechat", {
                name: "Customer Support Dashboard",
                created_by: { id: user.username },
                members: [user.username]
            });

            
            await channel.create();
            await channel.addMembers(['admin']);

            res.json({
                userId: user.username,
                adminName: user.username,
                role: user.role,
                accessToken,
                streamToken,
                streamApiKey: process.env.STREAM_API_KEY
            });
        }

        // res.json({
        //     userId: user.username,
        //     channelId: user.username,
        //     role: user.role,
        //     accessToken,
        //     streamToken,
        //     streamApiKey: process.env.STREAM_API_KEY
        // });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// =====================
// REFRESH TOKEN
// =====================
exports.refresh = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.sendStatus(401);

        const decoded = require("jsonwebtoken").verify(
            token,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.userId);
        if (!user) return res.sendStatus(403);

        // proveri hash
        let valid = false;
        for (let t of user.refreshTokens) {
            if (await bcrypt.compare(token, t)) {
                valid = true;
                break;
            }
        }

        if (!valid) return res.sendStatus(403);

        const newAccessToken = generateAccessToken(user);

        res.json({ accessToken: newAccessToken });

    } catch (err) {
        res.sendstatus(403);
    }
};

// =====================
// LOGOUT
// =====================




// exports.logout = async (req, res) => {
//     const token = req.cookies.refreshToken;
//     if (!token) return res.sendStatus(204);

//     const user = await User.findOne();

//     user.refreshTokens = user.refreshTokens.filter(async (t) => {
//         return !(await bcrypt.compare(token, t));
//     });

//     await user.save();

//     res.clearCookie("refreshToken");
//     res.sendStatus(204);
// };




exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = req.cookies.refreshToken;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.sendStatus(401);
        }

        const accessToken = authHeader.split(" ")[1];
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) return res.sendStatus(403);

        if (token) {
            const newTokens = [];
            for (let t of user.refreshTokens) {
                if (!(await bcrypt.compare(token, t))) {
                    newTokens.push(t);
                }
            }
            user.refreshTokens = newTokens;
            await user.save();
        }

        res.clearCookie("accessToken");
        res.sendStatus(204);

    } catch (err) {
        res.sendStatus(403);
    }
};



exports.useMe = async (req, res) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // Pavle vidi kako se trazi user u login
    const user = await User.findById(decoded.userId)//.select("-password");
    // Pavle ovako se vrv ne dobija isti token, da li treba isti?
    const streamToken = streamClient.createToken(user.username); // 13134466

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.status(200).json({
      userId: user.username,
      role: user.role,
      streamToken,        
      streamApiKey: process.env.STREAM_API_KEY,
      userNamee: user.username, 
      pavle: 'Pavle'
    });

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};