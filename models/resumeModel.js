const pool = require('../config/db');

//data is an object sent from the controller.

// snake_case to camelCase

const mapToCamel = (row)=>({
    // right hand side data base table name same as it is
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phoneNumber: row.phone_number,
    skills: row.skills,
    projectDescription: row.project_description,
    appliedPosition: row.applied_position,
    earliestPossibleStartDate: row.earliest_possible_start_date,
    interviewDate: row.interview_date
});

// CREATE

const createResume = async(data) => {
        /*To extract values from an req.body object easily
        object destructuring
        const firstName = data.firstName;
        
        NOTE we can rename here..earliestPossibleStartDate: startDate,
         and then use startDate in const values
        */
         const {
            firstName, lastName, email, phoneNumber,
            skills, projectDescription, appliedPosition,
            earliestPossibleStartDate, interviewDate
        } = data;
        const query = `
        INSERT INTO resumes(
            first_name, last_name, email, phone_number,
            skills, project_description, applied_position,
            earliest_possible_start_date, interview_date
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
        `;
        // matches values with $1 ,$2,$3
        const values = [
            firstName, lastName, email, phoneNumber,
            skills, projectDescription, appliedPosition,
            earliestPossibleStartDate, interviewDate
        ];
        
        //Execute DB query
        const result = await pool.query(query,values);

        // convert DB response to Json format

        return mapToCamel(result.rows[0])
};

// GET (get data by email or phone number)
const getResume =   async(email,phoneNumber)=>{
    const query = `SELECT * FROM resume WHERE email=$1 OR phone_number=$2`;
    const values = [email,phoneNumber];
    const result = await pool.query(query,values);
    return result.rows.map((row) => mapToCamel(row))
};

// PUT (full update)
const updateResume = async(id,data) =>{
    const{
        firstName, lastName, email, phoneNumber,
        skills, projectDescription, appliedPosition,
        earliestPossibleStartDate, interviewDate
    } = data;

    const query = `UPDATE resumes SET
    first_name=$1, last_name=$2, email=$3, phone_number=$4,
    skills=$5, project_description=$6, applied_position=$7,
    earliest_possible_start_date=$8, interview_date=$9
    WHERE id=$10 RETURNING *`;

    const values = [
        firstName, lastName, email, phoneNumber,
        skills, projectDescription, appliedPosition,
        earliestPossibleStartDate, interviewDate
    ];

    const result = await pool.query(query,values);
    if(result.rows[0]){
        return mapToCamel(result.rows[0]);
    }else{
        return null;
    }
};

// PATCH (partial update)


const patchResume = async(id,data)=>{

    const fieldMap = {
        firstName: "first_name",
        lastName: "last_name",
        email: "email",
        phoneNumber: "phone_number",
        skills: "skills",
        projectDescription: "project_description",
        appliedPosition: "applied_position",
        earliestPossibleStartDate: "earliest_possible_start_date",
        interviewDate: "interview_date"
    };
    const fields = Object.keys(data);
    const setQuery = fields
        .map((field, index) => `${fieldMap[field]}=$${index + 1}`)
        .join(', ');
    const values = Object.values(data);
    const query = `
        UPDATE resumes SET ${setQuery}
        WHERE id=$${fields.length + 1}
        RETURNING *
    `;
    const result = await pool.query(query, [...values, id]);

    if (result.rows[0]) {
        return mapToCamel(result.rows[0]);
    } else {
        return null;
    }
};

// DELETE
const deleteResume = async (id) => {
    const result = await pool.query(
        `DELETE FROM resumes WHERE id=$1 RETURNING *`,
        [id]
    );

    if (result.rows[0]) {
        return mapToCamel(result.rows[0]);
    } else {
        return null;
    }
};

module.exports = {
    createResume,
    getResume,
    updateResume,
    patchResume,
    deleteResume
};
