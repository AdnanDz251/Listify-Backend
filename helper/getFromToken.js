import jwt from 'jsonwebtoken'
import dotenv from "dotenv";

dotenv.config();

async function getId(req) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken.user_id;
}

export default {
    getId
  };