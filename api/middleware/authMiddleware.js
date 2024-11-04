import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicKeyPath = path.join(__dirname, '../config/ec_public.pem');
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

const verifyToken = (req, res, next) => {

  const authHeader  = req.headers['authorization'];
  const token       = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.status(401).json({ message: 'Access token missing' });

  jwt.verify(token, publicKey, { algorithms: ['ES256'] }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired access token' });
    }

    req.user = decoded;
    next();
  });

};

export default verifyToken;
