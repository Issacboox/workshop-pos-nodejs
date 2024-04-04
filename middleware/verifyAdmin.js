const jwt = require('jsonwebtoken');
function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming token is sent in the Authorization header
  if (!token) {
    return res.status(401).json({ message: 'Missing JWT token' });
  }
  
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid JWT token' });
    }
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    next();
  });
}

module.exports = verifyAdmin;