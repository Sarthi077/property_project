import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connection } from "../config/db.js";
import { generateEmailVerifyToken } from "./email-token.js";
import dotenv from 'dotenv';

dotenv.config();
export const registerUser=async(req,res)=>{

    const userId = req.body.userId;
    console.log(userId);
    const userName = req.body.userName;
    console.log(userName);
    const userEmail = req.body.userEmail;
    console.error(userEmail);
    const userPass = req.body.userPass;
    console.log(userPass);
    console.log("test2");
    const hashPass = await bcrypt.hash(userPass, 10);
    console.log("test3");
    console.log("hashed password of user=", hashPass);
    console.log("test4");
    const [result] = await connection.execute(
        `insert into users  
        (user_id,user_email,user_name,user_pass,hash_pass) 
        values(?,?,?,?,?)`,
        [userId, userEmail, userName, userPass, hashPass]
    );
    console.log(result);

    await generateEmailVerifyToken(userEmail,userPass);

    return res.json({
        status: "success",
        message: "Registered successfully. Please verify your email.",
    });
}

export const loginUser=async(req,res)=>{
    try {
        const JWT_SECRET=process.env.JWT_SECRET;
        console.log("login route hit ")
        const password = req.body.userPass;
        const email = req.body.userEmail;
        console.log("email=", email);
        console.log("password=", password);

        console.log("test1");
        if (!email || !password) {
        return res.status(400).json({
            status: 400,
            message: "username and passsword is required ",
        });
        }
        console.log("test2");

        const [hashPassword] = await connection.execute(
            `select  user_email,hash_pass from users where user_email=? `,
            [email]
        );
        console.log("hashPassword read from db of user with same email =",hashPassword);

        if (hashPassword.length == 0) {
            return res.status(404).json({ status: 404, message: "user not found " });
        }
        const user = hashPassword[0];

        const passMatch = await bcrypt.compare(password, user.hash_pass);
        console.log("passmatch variable=",passMatch)
        if (!passMatch) {
            return res.json(" invalid password");
        }

        console.log("test4");
        const token = jwt.sign(
        {
            email: hashPassword.user_email,
        },
        JWT_SECRET,
        {
            expiresIn: "1h",
        }
        );

        console.log("test5");
        console.log(token);
        res.json({
        status: "success",
        message: "login successful",
        token,
        });
    } 
    catch (err) {
        console.error(err);
        return res.json({ status: 501, message: " server error  " });
    }
}

export const editUserProfile=async(req,res)=>{
    try{

        const userName=req.body.userName;
        console.log(userName);

        const userId=req.body.userId;
        console.log(userId);

        if(!userName){
            return res.status(400).json({
                status:false,
                message:"Username is Required"
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
        return res.status(200).cookie("token","",{maxAge:0}).json({
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
    ("SELECT user_id, user_name, user_email  FROM users WHERE user_id=?", [req.params.id]);

    return res.status(200).json({
      success: true,
      data: users[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export const changePassword=async(req,res)=>{

    const userId=req.body.userId;
    console.log(userId);

    const oldPassword=req.body.oldPassword;
    console.log(oldPassword);

    const newPassword=req.body.newPassword;
    console.log(newPassword);

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
        console.log(users);

        const hashPassword=users[0].hash_pass;
        console.log(hashPassword);
        const passwordMatch=await bcrypt.compare(oldPassword,hashPassword);
        console.log("test1")
        if(!passwordMatch){
            return res.status(400).json({
                status:false,
                message:"old password is  incorrect"
            })
        }

        console.log("test2");
        const newHashPassword=await bcrypt.hash(newPassword,10);
        console.log(newHashPassword);

        await connection.execute(
            ` update users set user_pass=? ,hash_pass=? where user_id=?`,[newPassword,newHashPassword,userId]
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
            'update users set is_verify=false where user_id=?',[req.params.id]
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
