import { connection } from "../config/db";
import slugify from "slugify";

// Name, Slug, Description, City, Country, Rent Amount
// , Deposit Amount, Bed Rooms, Images, Is Active, Is Featured

export const createProperty=async(req,res)=>{
    
    const {
        name,
        slug,
        description,
        city,
        country,
        rent,
        amount,
        
    }

    try{

    }
    catch(err){
        console.error(err);
        return res.status(400).json({
            status:false,
            message:" create property failed"
        })
    }
}

