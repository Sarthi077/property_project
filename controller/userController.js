import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connection } from "../config/db.js";
import { generateEmailVerifyToken } from "./emailTokenController.js";
import dotenv from 'dotenv';

dotenv.config();


export const registerUser=async(req,res)=>{

    const {userId,userName,userEmail,userPass} = req.body;
    

    if(!userId || !userName || !userEmail || !userPass){
        return res.status(400).json({
            status:false,
            message:"all fields are required"
        })
    }
    
    
    const [existingUser]=await connection.execute(
        `
        select user_id from users where user_email=?     
        `,[userEmail]
    )

    if(existingUser.length>0){

        return res.status(404).json({
            status:false,
            message:"email already exists"
        })
    }
    
    const hashPass = await bcrypt.hash(userPass, 10);

    const [result] = await connection.execute(
        `insert into users  
        (user_id,user_email,user_name,user_pass,hash_pass) 
        values(?,?,?,?,?)`,
        [userId, userEmail, userName, userPass, hashPass]
    );
    
    const  link=await generateEmailVerifyToken(userEmail,userPass);

    const token=jwt.sign(
        {
            userId:result.userId,
            email:userEmail
        },
        process.env.JWT_SECRET,
        {expiresIn:'1d'}
    )

    

    return res.status(200).json({
        status: "success",
        message: "Registered successfully. Please verify your email.",
        link,
        token
    });
}


export const loginUser=async(req,res)=>{

    try {

        const JWT_SECRET=process.env.JWT_SECRET;

        const password = req.body.userPass;
 
        const email = req.body.userEmail;


        if (!email || !password) {
            
            return res.status(400).json({
            
                status: 400,
                message: "username and passsword is required ",

            });
        }
        

        const [rows] = await connection.execute(
            `select user_id, user_email,hash_pass from users where user_email=? `,
            [email]
        );
    

        if (rows.length == 0) {
        
            return res.status(404).json({
                status: 404, 
                message: "user not found " 
            });
        }
        

        const user = rows[0];


        if(rows.is_active==0){
            return res.status(400).json({
                status:false,
                message:"user deleted account"
            })
        }


        if(rows.is_verify==0){
            return res.status(400).json({
                status:false,
                message:" please verify your email"
            })
        }

        const passMatch = await bcrypt.compare(password, user.hash_pass);

        
        if (!passMatch) {
            
            return res.status(400).json({
                status:400,
                message:" invalid password"

            });
        }


        const token = jwt.sign(
        {
            email: user.user_email,
            user_id: user.user_id

        },
        JWT_SECRET,
        {
            expiresIn: "1h",
        }
        );

        
        await connection.execute(
            ` update users set token=?  where user_email=?`,
            [token,email]
        )

        return res.status(200).json({
            
            status: "success",
            message: "login successful",
            token,
        
        });
    } 


    catch (err) {
        console.error(err);

        return res.status(500).json({ 
        
            status: false, 
            message: " server error  " 

        });
    }
}


export const editUserProfile=async(req,res)=>{
    
    try{

        const userName=req.body.userName;
    
        const userId=req.body.userId;
    

        if(!userName){
            return res.status(400).json({
                status:false,
                message:"Username is Required"
            })
        }

        const [rows]=await connection.execute(
            `select * from users where user_id=?`,[userId]
        )

        if(rows.length==0){
            return res.status(400).json({
                status:false,
                message:" user id  not exist please try again "
            })
        }


        await connection.execute(
            ` update users set user_name=? where user_id=?`,[userName,userId]
        )


        return  res.status(200).json({
    
            status:true,
            message:" UserName Changed Successfully"

        })

    }


    catch(err){
        
        console.error(err);

        return res.status(400).json({
        
            success:false,
            message:" Edit user profile fail"

        })
    }
}


export const userLogout=async(req,res)=>{
    
    try{

        const userId=req.params.id;
        
        const authHeader=req.headers.authorization;

        if(!authHeader){
            return res.status(400).json({
                status:false,
                message:"no auth token provided"
            })
        }

        const token=authHeader.split(" ")[1];

        const decoded=jwt.decode(token);
        
        const expireAt=new Date(decoded.exp*1000);
        

        await connection.execute(
            ` insert into blacklist_token 
            (token , expire_at) values (?,?)`
            ,[token,expireAt]
        )

        await connection.execute(
            `update users set token=null  
            where user_id=?`,[userId]
        )
        return res.status(200).json({
            status:true,
            message:"user log out successfully"
        })        
    }
    catch(err){

        console.log(err);

        return res.status(400).json({
            status:false,
            message:"user logout fail"
        })
    }
}

export const getUserProfile = async (req, res) => {
    try {
        
        const [users] = await connection.execute
        (   `
            SELECT user_id, user_name, user_email
            FROM users WHERE user_id=?
            `
            ,[req.user]
        );

        
        return res.status(200).json({
            success: true,
            data: users[0],

        });

    } 
    
    catch (error) {
        console.log(error);

        return res.status(500).json({
            
            success: false,
            message: "Failed to fetch profile",

        });
    }
};

export const changePassword=async(req,res)=>{

    const userId=req.body.userId;
    
    const oldPassword=req.body.oldPassword;
    
    const newPassword=req.body.newPassword;
    

    if(!newPassword || !oldPassword){
        return res.status(400).json({
            status:false,
            message:"Old Password and New Password both require"
        })
    }

    try{

        const [users]=await connection.execute(
            ` select hash_pass from users where user_id=?`,[userId]
        )

        
        const hashPassword=users[0].hash_pass;
        
        
        const passwordMatch=await bcrypt.compare(oldPassword,hashPassword);
        

        if(!passwordMatch){
            return res.status(400).json({
                status:false,
                message:"old password is  incorrect"
            })
        }


        const newHashPassword=await bcrypt.hash(newPassword,10);


        await connection.execute(
            ` update users set user_pass=? ,hash_pass=? where user_id=?`,
            [newPassword,newHashPassword,userId]
        )

        return res.status(200).json({
            
            status:true,
            message:" Profile  Password changed "

        })
    }


    catch(err){
        
        console.error(err);

        return res.status(500).json({
            
            status:false,
            message:"Change Password Failed"

        })
    }
}

export const deleteUserProfile=async(req,res)=>{
    
    try{

        await connection.execute(
            'update users set is_verify=false where user_id=?',
            [req.params.id]
        )

        return res.status(200).json({
            
            status:true,
            message:"user profile delete"

        })
    }


    catch(err){
        
        console.log(err);

        return res.status(400).json({
            success:false,
            message:" user profile delete fails "
        })
    }
}
