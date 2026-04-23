import mysql from "mysql2/promise";
import dotenv from 'dotenv';
dotenv.config()
export const connection = await mysql.createConnection({
  
  host: "localhost",
  user: "root",
  password: "Proni@1977", // 👈 explicitly empty
  database: "property_project",


  // host: process.env.DB_HOST,


  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_DATABASE,
});

console.log("MySQL connected",connection.threadId);
