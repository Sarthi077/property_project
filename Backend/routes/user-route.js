import express from "express";
import { registerUser, loginUser, getUserProfile, deleteUserProfile,  userLogout, editUserProfile, changePassword } from "../controller/user-controller.js";

const router=express.Router();

router.post("/signin",registerUser);
router.post("/login",loginUser);
router.get("/profile/:id",getUserProfile);
router.get("/profile/delete/:id",deleteUserProfile);
router.get("/logout/:id",userLogout);
router.post("/edit-user-profile/:id",editUserProfile);
router.post("/change-password-user-profile/:id",changePassword);



export default router;
