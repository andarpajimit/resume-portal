//Controller is used to handle request, apply logic, call model, and send response back to the client.
const pool = require('../config/db');
const resumeModel = require('../models/resumeModel');/*This imports model layer
Model contains database logic (like insert query)
Keeps controller clean (MVC pattern)
*/

const createResume = async(req,res)=>{
    try{
        const {email,phoneNumber} = req.body;
        /*without destructuirng 
        const email = req.body.email;
const phoneNumber = req.body.phoneNumber;*/
        const query = `
            SELECT * FROM resumes 
            WHERE email = $1 or phone_number = $2`;
            const values = [email,phoneNumber];
            //execute query
            const checkDuplicate = await pool.query(query,values);

            // handle duplicate
            if(checkDuplicate.rows.length > 0){
                return res.status(400).json({
                    message:"Email or Phone number already exists"
                });
            }
            // insert data using model
            const resume = await resumeModel.createResume(req.body); //Send full data to model

            //success response
            res.status(201).json({
                message:"Application submitted successfully",
                data : resume //Client needs confirmation
            });
        
        
    }catch(error){
        //Error handling
        res.status(500).json({
            error:error.message
        });
    }
};

module.exports = {
    createResume
};