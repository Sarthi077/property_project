import jwt from 'jsonwebtoken';
import dotenv  from 'dotenv';
import { connection } from '../config/db.js';

dotenv.config(); 


const isAuthenticated= async (req, res, next)=> {
    try{

      console.log("auth middleware hit")
      const JWT_SECRET = process.env.JWT_SECRET;

      // const JWT_SECRET="secret_key";

      console.log("jwt_secret=",JWT_SECRET)

      const authHeader = req.headers.authorization;

      const token = authHeader.split(" ")[1]; // Bearer <token>

       
      console.log("token = ",token);

      const [blacklist]= await connection.execute(
        `select t_id from blacklist_token where token=?`,[token]
      )
      
      if(blacklist.length>0){
        return  res.status(400).json({
          status:false,
          message:"token expire"
        })
      }

      
      const decoded = jwt.verify(token, JWT_SECRET);

      console.log("token = ",token)
      console.log("decoded = ",decoded)
      req.user = decoded.user_id;

      next();
    } 
    
    catch (error) {

      console.log(error);
       
      return res.status(401).json({
      status:false,
      message: "Invalid or expired token",
    });
  }
}

// isAuthenticated();
export default isAuthenticated;