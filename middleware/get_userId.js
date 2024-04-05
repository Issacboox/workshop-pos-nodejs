const jwt = require('jsonwebtoken');

function getUserId(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming token is sent in the Authorization header
    if (!token) {
      return res.status(401).json({ message: 'Please Login' });
    }
  
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid JWT token' });
      }
      req.userId = decoded._id; // Assuming your JWT payload includes a _id field
      console.log('User ID:', req.userId); // Add this line to log the user ID
      next();
    });
  }
  

module.exports = getUserId;
