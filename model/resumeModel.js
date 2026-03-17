const pool = require('../config/db');

//data is an object sent from the controller.
const createResume = async(data)=>{

    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        skills,
        projectDescription,
        appliedPosition,
        earliestPossibleStartDate,
        interviewDate
    } = data;

    const query = `INSERT INTO resumes ( firstName,
        lastName,
        email,
        phoneNumber,
        skills,
        projectDescription,
        appliedPosition,
        earliestPossibleStartDate,
        interviewDate)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
        `;

        /* using place holder in SQL query 
        Prevents SQL Injection
        ✔ Safer database queries
        ✔ Faster query execution (query plan reuse)
        ✔ Cleaner code
        */



    const values = [
        firstName,
        lastName,
        email,
        phoneNumber,
        skills,
        projectDescription,
        appliedPosition,
        earliestPossibleStartDate,
        interviewDate
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};

module.exports = {
    createResume
}