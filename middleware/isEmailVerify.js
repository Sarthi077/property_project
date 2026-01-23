import { connection } from "../config/db.js";

export const isEmailVerify=async(req,res,next)=>{

    try{

        const userId=req.user;
        

        const [rows]=await connection.execute(
            `
            select user_email from users where is_verify=true and user_id=?
            `,[userId]
        )
        console.log("row for debug=",rows)

        if(rows.length==0){
            return res.status(400).json({
                status:false,
                message:" user  is not verify please verify email  "
            })
        }
        next();



    }
    catch(err){
        
        console.error(err);

        return res.status(500).json({
            status:false,
            message:"is email verify failed "
        })
    }

}