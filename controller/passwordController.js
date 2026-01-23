import { connection } from "../config/db.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../config/verifyMail.js";
import { v4 as uuidv4 } from "uuid";

export const forgetPass=async (req,res)=>{
    
    try{

        const email=req.body.userEmail
        

        if(!email){
            return res.json(" email is required");
        }

        const [user]=await connection.execute(
            'select user_id from users where user_email=? and  is_verify=true',[email]
        )

        const userId=user[0].user_id;


        if(user.length==0){
            return res.status(200).json({
                status:true,
                message:"password  reset link send to user mail"
            });
        }

        const token=uuidv4();
        

        const expireAt=new Date(Date.now()+60*60*1000);
        

        await connection.execute(
            `insert into password_reset (token,email,expire_at,user_id) values (?,?,?,?)`,[token,email,expireAt,userId]
        )
        

        const passwordResetLink=`http://localhost:4000/reset-password?token=${token}`;
        

        await sendEmail({
            to: email,
            subject: 'Reset your Password',
            html: `
                <h2>Password Reset</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${passwordResetLink}">${passwordResetLink}</a>
                <p>This link will expire in 1 hour.</p>
            `
        })

        return res.status(200).json({
            success: true,
            message: 'If the email exists, a reset link has been sent',
            token,
            passwordResetLink
        });

    } 

    catch (error) {
        
        console.log(error);

        return res.status(500).json({
        
            success: false,
            message: 'Forgot password failed'

        });
    }
}

export const resetPass=async(req,res)=>{
    
    try{
    
        const newPassword=req.body.newPassword;
    
        const token=req.body.token;
    
        const confirmPassword=req.body.confirmPassword;

        if(!token && !newPassword){
            return res.status(401).json({
                
                status:"failed",
                message:" token and passsword both require"

            })
        }

        if(newPassword!==confirmPassword){
            return res.status(400).json({
                status:false,
                message:"new password and confirm password does not match"
            })
        }

        const [row]= await connection.execute(
            `
            select * from password_reset where token=?`,
            [token]
        )


        if(row.length==0){
            
            return res.status(401).json({
            
                success:"false",
                message:"token invalid "

            });
        }

        const resetUser=row[0];

        const hashPassword= await bcrypt.hash(newPassword,10);

        await connection.execute(

            ` update users set user_pass=? , hash_pass=? where user_id=?`,
            [newPassword,hashPassword,resetUser.user_id]

        )

        await connection.execute(
        
            'delete from password_reset where user_id=?',
            [resetUser.user_id]

        )


        return res.status(200).json({
            
            success: true,
            message: "Password reset successful",

        });
        
    }
    catch(err){

        console.error(err);

        return res.json({
            status:"error ",
            message:"password reset fail "
        })
    }
}