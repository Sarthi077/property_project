import express from "express";
import {
  createProperty,
  deleteProperty,
  listProperty,
  updateProperty,
  listAllProperty,
} from "../controller/propertyController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { isEmailVerify } from "../middleware/isEmailVerify.js";

const router=express.Router();


router.route("/create-property").post(isAuthenticated, isEmailVerify,createProperty);

router.route("/update-property/:id").post(isAuthenticated,isEmailVerify,updateProperty);

router.delete("/delete-property/:id",isAuthenticated,isEmailVerify,deleteProperty);

router.route("/list-property/").get(isAuthenticated,isEmailVerify,listProperty);

router.route("/list-all-property/").get(listAllProperty);

export default router;