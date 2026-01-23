import express from 'express';
import { forgetPass,resetPass } from '../controller/passwordController.js';

const router=express.Router();

router.post("/forget-password",forgetPass);
router.post("/reset-password",resetPass);

export  default router;
