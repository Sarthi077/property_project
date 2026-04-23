import express from "express";
import cors from "cors";
import path from "path";
import verifyEmail  from "./routes/emailVerifyRoute.js";
import passwordRoute from "./routes/passwordRoute.js"
import userRoute from "./routes/userRoute.js";
import dotenv from 'dotenv'
import propertyRoute from "./routes/propertyRoute.js"
dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.get("/", (req, res) => {
  res.send(" hello from home page property rent project ");
});


app.use("/api/verify", verifyEmail);


app.use("/api/user",userRoute);


app.use("/api/password",passwordRoute);


app.use("/api/property",propertyRoute);

const PORT = 4000|| process.env.PORT ;

console.log(PORT);

app.listen(PORT, () => {
  console.log(` server is running on ${PORT} `);
});

