import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();;

function verifyUserToken(req, res, next) {
  if (!authHeader) {
      return res.status(401).json({ error: "Missing Authorization" });
  }

  const token = authHeader && authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user_id = decoded.user_id;
    next();
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export default {
  verifyUserToken
};