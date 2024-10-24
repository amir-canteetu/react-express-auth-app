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

// Helper function to generate tokens
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, privateKey, { algorithm: 'ES256', expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, privateKey, { algorithm: 'ES256', expiresIn: '7d' });
};

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
    const accessToken   = generateAccessToken(user);
    const refreshToken  = generateRefreshToken(user);

    // Send refresh token as an HTTP-only, secure cookie
    res.cookie('refresh-token', refreshToken, {
      httpOnly: true, // Cookie cannot be accessed through the client-side JavaScript
      secure: process.env.NODE_ENV === 'production', // Only set secure to true in production (HTTPS)
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userWithoutPsswd = _.pick(user, ['id','username','role','email']);
    res.json({ 
      message: 'Login successful', 
      accessToken, 
      user: userWithoutPsswd
    });

});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const { data: users } = await axios.get(apiUserEndpoint);
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).send('api/index.js:User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).send('Invalid credentials');
  }

  const accessToken   = generateAccessToken(user);
  const refreshToken  = generateRefreshToken(user);

  // Send refresh token as an HTTP-only, secure cookie
  res.cookie('refresh-token', refreshToken, {
    httpOnly: true, // Cookie cannot be accessed through the client-side JavaScript
    secure: process.env.NODE_ENV === 'production', // Only set secure to true in production (HTTPS)
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send access token in response body
  const userWithoutPsswd = _.pick(user, ['id', 'username', 'role', 'email']);
  res.json({ 
    message: 'Login successful', 
    accessToken, 
    user: userWithoutPsswd
  });
});


app.post('/auth/refresh-token', (req, res) => {
  const refreshToken = req.cookies['refresh-token'];

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  jwt.verify(refreshToken, publicKey, { algorithms: ['ES256'] }, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({
      accessToken: newAccessToken,
      user: user
    });
  });
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
  res.clearCookie('refresh-token'); // Clear refresh token cookie on logout
  res.json({ message: 'Logged out successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
