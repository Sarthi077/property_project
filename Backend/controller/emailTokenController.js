import {v4 as uuidv4}from 'uuid';
import { sendEmail } from "../config/verifyMail.js";
import { connection } from "../config/db.js";
import  dotenv from 'dotenv'
dotenv.config();

export const generateEmailVerifyToken=async(email,password)=>{
    
    const token=uuidv4();
    
    const expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    const tokenStore = await connection.execute(
        `insert into email_verify 
        (email,passwrd,token,expire) values
        (?,?,?,?)`,[email,password,token,expireAt]
    );
    
    
    const verificationLink=`${process.env.APP_URL}/api/verify/verify-email?token=${token}`;
    
    await sendEmail({
        to: email,
        subject: "Verify your email",
        html: `
            <h2>Email Verification</h2>
            <p>Please click the link below to verify your email:</p>
            <a href="${verificationLink}">${verificationLink}</a>
            <p>This link expires in 24 hours.</p>
            `,
    });
    return verificationLink;
    
}



export const verifyEmail=async(req,res)=>{
    const {token}=req.query;


    if (!token) {
    
        return res.status(400).json({
        message: "Verification token is required",
        success: false,

      });
    }

    try{

        const [record]=await connection.execute(
            `select * from email_verify 
            where token=? and expire>NOW()`,[token]
        )


        if(record.length==0){
            return res.status(400).json({
                success:false,
                message:"Invalid  or expire token "
            })
        }


        const verify=record[0];

        await connection.execute(
            `  UPDATE users SET is_verify=TRUE  WHERE user_email=?`,
            [verify.email]
        )
        
        await connection.execute(
            `
            delete from email_verify where email=?
            `,[verify.email]
        )

        return res.status(200).json({
           success: true,
           message: "Email verified successfully",
        });

    }

    catch(err){
        console.error(err);

    
        return res.status(401).json({
            success:"false",
            message:" Error verifyEmail"


        });
    }
}