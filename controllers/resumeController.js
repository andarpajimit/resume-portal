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

//GET
const getResume = async (req, res) => {
    try {
        const { email, phoneNumber } = req.query;

        if (!email && !phoneNumber) {
            return res.status(400).json({
                message: "Provide email or phoneNumber"
            });
        }

        // ONLY FETCH (no insert)
        const data = await resumeModel.getResume(email, phoneNumber);

        if (data.length === 0) {
            return res.status(404).json({ message: "Not found" });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//GET ALL
const getAllResumes = async (req, res) => {
    try {
        const data = await resumeModel.getAllResumes();

        if (data.length === 0) {
            return res.status(404).json({
                message: "No resumes found"
            });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//PUT
const updateResume = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await resumeModel.updateResume(id, req.body);

        if (!updated) {
            return res.status(404).json({ 
                message: "Not found" 
            });
        }

        res.status(200).json(updated);

    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
};

// PATCH
const patchResume = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await resumeModel.patchResume(id, req.body);

        if (!updated) {
            return res.status(404).json({ 
                message: "Not found" 
            });
        }

        res.status(200).json({
            message:"Data Updated Successfully",
            data : updated
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE
const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await resumeModel.deleteResume(id);

        if (!deleted) {
            return res.status(404).json({ message: "Not found" });
        }

        res.status(200).json({
            message: "Deleted successfully",
            data: deleted
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createResume,
    getResume,
    getAllResumes,
    updateResume,
    patchResume,
    deleteResume
};