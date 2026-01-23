import { verifyEmail } from "../controller/emailTokenController.js";
import express from "express";

const router=express.Router();

router.get("/verify-email",verifyEmail);

export default router;
