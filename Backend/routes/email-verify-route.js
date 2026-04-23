import { verifyEmail } from "../controller/email-token.js";
import express from "express";

const router=express.Router();

router.get("/verify-email",verifyEmail);

export default router;
