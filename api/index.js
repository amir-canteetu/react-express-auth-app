import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import axios from 'axios';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import _ from 'lodash';

dotenv.config();
const apiUserEndpoint   = process.env.APIUSERSURL || "http://localhost:3001/users";
const requestOrigin     = process.env.CLIENT_URL || "http://localhost:5173";
const PORT              = process.env.PORT || 3000;
const app               = express();

app.use(express.json());
app.use(cookieParser());
// Enable CORS
app.use(cors({ origin: requestOrigin, credentials: true }));

// Load the private and public keys
const privateKey = fs.readFileSync('config/ec_private.pem', 'utf8');
const publicKey = fs.readFileSync('config/ec_public.pem', 'utf8');

app.post('/auth/register', async (req, res) => {

    const { username, password, role, email } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simulate adding the user to the "database"
    const newUser = { username, password: hashedPassword, role, email };

    // Use axios to post the user to the mock JSON server
    await axios.post(apiUserEndpoint, newUser);

    const { data: users } = await axios.get(apiUserEndpoint);
    const user = users.find(u => u.email === email);

    // Create JWT token with user info
    const token = jwt.sign({ id: user.id, username:user.username, role: user.role }, privateKey, { algorithm: 'ES256', expiresIn: '1h' });

    // Send token as HTTP-only, secure cookie
    res.cookie('auth-token', token, {
      httpOnly: true, //cookie cannot be accessed through the client-side js
      secure: process.env.NODE_ENV === 'production', // Only set to true in production (when using HTTPS)
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Use 'None' only in production, otherwise 'Lax'
      maxAge: 3600000, // 1 hour
    });

    const userWithoutPsswd = _.pick(user, ['id','username','role','email']);
    res.status(201).json({ message: 'User registered successfully', user: userWithoutPsswd });
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    // Fetch users from the mock JSON server
    const { data: users } = await axios.get(apiUserEndpoint);
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send('Invalid credentials');
    }

    // Create JWT token with user info
    const token = jwt.sign({ id: user.id, username:user.username, role: user.role }, privateKey, { algorithm: 'ES256', expiresIn: '1h' });

    // Send token as HTTP-only, secure cookie
    res.cookie('auth-token', token, {
      httpOnly: true, //cookie cannot be accessed through the client-side js
      secure: process.env.NODE_ENV === 'production', // Only set to true in production (when using HTTPS)
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Use 'None' only in production, otherwise 'Lax'
      maxAge: 3600000, // 1 hour
    });

    const userWithoutPsswd = _.pick(user, ['id','username','role','email']);
    res.json({ message: 'Login successful', user: userWithoutPsswd });
});

const verifyToken = (req, res, next) => {
      const token       = req.cookies['auth-token']; // Retrieve token from cookies

      if (!token) {
          return res.status(401).json({ message: 'Access denied. No token provided.' });
      }

      jwt.verify(token, publicKey, { algorithms: ['ES256'] }, (err, decoded) => {
          if (err) {
          if (err.name === 'TokenExpiredError') {
              return res.status(401).json({ message: 'Token expired' });
          }
          return res.status(403).json({ message: 'Invalid token' });
          }

          req.user = decoded; // Attach decoded user info to req
          next(); // Pass control to the next handler
      });
};

app.get('/auth/verify-token', verifyToken, (req, res) => {
      res.json({ message: `Welcome`, user: req.user });
});

app.post('/auth/logout', (req, res) => {
    res.clearCookie('auth-token');
    res.json({ message: 'Logged out successfully'});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
