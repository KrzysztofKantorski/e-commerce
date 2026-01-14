const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");


async function auth(req, res, next){

    try{
    let token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token;
    if (token === "null" || token === "undefined") {
            token = null;
    }
    if (!token) {
      return res.status(401).json({ error: 'Brak tokena dostępu' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT);
    
   
    
    // Find user in database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'User does not exist' });
    }
    
    
    req.user = user;
    
    next();
    
}
catch (error){
     console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Incorrect token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    res.status(500).json({ error: 'Auth error' });
  }
}

module.exports = auth;