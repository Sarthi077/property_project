import jwt from 'jsonwebtoken';
import dotenv  from 'dotenv';
dotenv.config(); 

const JWT_SECRET=process.env.JWT_SECRET;
const authorize= async (req, res, next)=> {
    try{
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
            message: "Token missing",
            });
        }

        const token = authHeader.split(" ")[1]; // Bearer <token>

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
export default authorize;