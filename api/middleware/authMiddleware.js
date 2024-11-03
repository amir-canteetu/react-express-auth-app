import jwt from 'jsonwebtoken';
const publicKey   = fs.readFileSync('../config/ec_public.pem', 'utf8');

const verifyToken = (req, res, next) => {

  const authHeader  = req.headers['authorization'];
  const token       = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.status(401).json({ message: 'Access token missing' });

  jwt.verify(token, publicKey, { algorithms: ['ES256'] }, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired access token' });
    }

    req.user = decoded;
    next();
  });

};

export default verifyToken;
