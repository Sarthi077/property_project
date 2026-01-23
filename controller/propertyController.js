import formidable from "formidable";
import { connection } from "../config/db.js";
import slugify from "slugify";
import path from "path";
import fs from "fs";

export const createProperty=async(req,res)=>{
    
    const form=formidable({

        multiples:true,
        uploadDir:path.join(process.cwd(),'uploads/properties'),
        keepExtensions:true,
        maxFieldsSize:5*1024*1024

    });

    form.parse(req,async(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                status:false,
                message:err.message
            })
        }
    
        console.log("fields=",fields)
     
        const name=fields.name?.[0];
        
    
        const description=fields.description?.[0];
        

        const city=fields.city?.[0];
        

        const country=fields.country?.[0];
        

        const rent=Number(fields.rent?.[0]);
        

        const amount=fields.amount?.[0];
        console.log("amount=",amount);

        const bedRooms=fields.bedRooms?.[0];
        

        const pId=fields.pId?.[0];
        
        
        



        if (!name || !country || !city || !bedRooms) {
            return res.status(400).json({
            status: false,
            message: " please fill all the required filed ",
            });
        }


        try {

            const slug = slugify(name, { lower: true, strict: true });
            
        
            const userId=req.user;

            let images = files.images;

            const [rows]=await connection.execute(
            `insert into fields  
                (name, slug, description, city , country 
                , rent , amount , bedRooms ,p_id,user_id)
                values (?,?,?,?,?,?,?,?,?,?)`,
                [   name,slug,description,city,country,
                    rent,amount,bedRooms,pId,userId
                ],
            );
            console.log("rows for debug = ",rows)

            if (images) {
                if (!Array.isArray(images)) {
                    images = [images];
                }

                const imageValues = [];

                for (const image of images) {
                    if (!image.mimetype.startsWith("image/")) {
                        fs.unlinkSync(image.filepath);
                        continue;
                    }

                    const imagePath = `uploads/properties/${path.basename(image.filepath)}`;
                    imageValues.push([pId, imagePath]);
                }

                if (imageValues.length) {
                    await connection.query(
                        `
                        insert into property_image (p_id, image_url) values ?
                        `,
                        [imageValues],
                    );
                }
            }


            return res.status(200).json({
                status:true,
                message:"property is created"
            })

        } 
        catch (err) {
            
            console.error(err);

            return res.status(400).json({
                status: false,
                message: " create property failed",
            });
        }
    });
}

export const  updateProperty=async(req,res)=>{
    

    const form = formidable({
        multiples: true,
        uploadDir: path.join(process.cwd(), "uploads/properties"),
        keepExtensions: true,
        maxFieldsSize: 5 * 1024 * 1024,
    });

    form.parse(req, async (err, fields, files) => {
        
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            })
        }

        const pId = req.params.id;
        if (!pId) {
            return res.status(400).json({
                status: false,
                message: "id is  required for update property",
            });
        }  

        try{
            
            const [rows]=await connection.execute(
                `select * from fields 
                where p_id=? and user_id=? `
                ,[pId,req.user]
            )

            if(rows.length==0){
                return  res.status(404).json({
                    status:false,
                    message:"property not found "
                })
            }

            // await connection.execute(
            //     `
            //     update fields set name=?,slug=?,description=?,
            //     country=?,city=?,rent_price=?,deposit=?,bedroom=? where p_id=?
            //     `,[name,slug,description,country,city,rent,amount,bedRooms,pId]
            // )


            const updates = {};

            if (fields.name?.[0]) {
                updates.name = fields.name[0];
                updates.slug = slugify(fields.name[0], { strict: true, lower: true });

                const [result] = await connection.query(
                    `SELECT * FROM fields WHERE slug=? and p_id!=?`
                    , [updates.slug,pId]);

                if (result.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Name already exists, Change Property Name",
                    });
                }
            }

            if (fields.description?.[0]) updates.description = fields.description[0];
            if (fields.city?.[0]) updates.city = fields.city[0];
            if (fields.country?.[0]) updates.country = fields.country[0];
            if (fields.rent?.[0]) updates.rent = fields.rent[0];
            if (fields.amount?.[0])updates.amount = fields.amount[0];
            if (fields.bedRooms?.[0]) updates.bedRooms = fields.bedRooms[0];
            
            console.log("updates=",updates);

            if (Object.keys(updates).length > 0) {
                await connection.query(
                    `UPDATE fields SET ? WHERE p_id = ?`
                    , [updates, pId]
                );
            }

            let images = files.images;

            if (images) {
                if (!Array.isArray(images)) {
                    images = [images];
                }

                const [oldImages] = await connection.query(
                    `SELECT image_url FROM property_image WHERE p_id=?`
                    , [pId]
                );

                for (const img of oldImages) {
                    const filePath = path.join(process.cwd(), img.image_url);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }

                await connection.query(
                    "DELETE FROM property_image WHERE p_id=?"
                    , [pId]
                );

                const imageValues = [];

                for (const image of images) {
                    if (!image.mimetype.startsWith("image/")) {
                        fs.unlinkSync(image.filepath);
                        continue;
                    }

                    const imagePath = `uploads/properties/${path.basename(image.filepath)}`;
                    imageValues.push([pId, imagePath]);
                }

                if (imageValues.length > 0) {
                    await connection.query(
                        "INSERT INTO property_image (p_id, image_url) VALUES ?"
                        , [imageValues,]
                    );
                }
            }


            return res.status(200).json({
                status:true,
                message:"update property done"
            })

        }


        catch(err){

            console.error(err);

            return res.status(500).json({
                status:false,
                message:"  update property failed"
            })

        }
    })
}

export const deleteProperty=async(req,res)=>{
    
    const pId=req.params.id;
    

    if(!pId){
        return res.status(400).json({
    
            status:false,
            message:"id is required to delete"

        })
    }

    try{

        const [row]= await connection.execute(
            `
            select * from fields where user_id=? and p_id=?
            `,[req.user,pId]
        )
    

        if(row.length==0){
            return res.status(404).json({
    
                status:false,
                message:"property not found"

            })
        }
    

        await connection.execute(
            `
            update fields set is_active=false where p_id=?
            `,[pId]
        )

        return res.status(200).json({
            
            status:false,
            message:"property delete successfully"

        })
    }

    catch(err){
    
        console.error(err);

        return res.status(500).json({
        
            status:false,
            message:"delete property failed"

        })

    }
}

export const listProperty=async(req,res)=>{
    
    try{

        
        const [properties]=await connection.execute(
            `
            select * from fields where user_id=? and is_active=true order by created_at 
            `,[req.user]
        )

        if(properties.length==0){
            return res.status(400).json({
                status:false,
                message:" property not found of this user"
            })
        }

        return res.status(200).json({
        
            success:true,
            message:"listing all property done",
            properties

        })

    }


    catch(err){
    
        console.error(err);

        return res.status(500).json({
            
            status:false,
            message:"listing failed"
            
        })
    }

}

export const listAllProperty=async(req,res)=>{

    try{

        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const offset = (page - 1) * limit;

        console.log(page, limit);

        const [properties]= await connection.query(
            `select * from fields 
            where is_active=1 
            order by created_at desc 
            limit ? , ? `
            ,[offset,limit]
        )

        return res.status(200).json({
            status:true,
            message:" public active property",
            page,
            limit,
            properties
        })

    }
    catch(err){
        
        console.error(err);

        return res.status(500).json({
        
            status:false,
            message:" listing all property failed "

        })
    }

}