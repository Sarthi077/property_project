import express from "express";

import { registerUser, 
    loginUser,
    getUserProfile, 
    deleteUserProfile,  
    userLogout, 
    editUserProfile, 
    changePassword }
    from "../controller/userController.js";

import isAuthenticated from "../middleware/isAuthenticated.js";
import { isEmailVerify } from "../middleware/isEmailVerify.js";

const router=express.Router();

router.post("/signin",registerUser);

router.post("/login",loginUser);

router.route("/profile").get( isAuthenticated,isEmailVerify,getUserProfile);

router.route("/edit-user-profile/:id").post(isAuthenticated,isEmailVerify,editUserProfile);

router.route("/profile/delete/:id").get(isAuthenticated,isEmailVerify,deleteUserProfile);

router.route("/logout/:id").get(isAuthenticated,isEmailVerify,userLogout);

router.route("/change-password-user-profile/:id").post(isAuthenticated,isEmailVerify,changePassword);

export default router;
