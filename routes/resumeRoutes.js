const express = require('express');
const router = express.Router();

//const resumeController = require('../controllers/resumeController'); ref-1
const validateResume = require('../middleware/validationMiddleware'); //imports whole object
const { createResume } = require('../controllers/resumeController'); //extracts only the function
/*Rename while destructuring
const { createResume: create } = require('../controllers/resumeController');*/


router.post("/apply",
    validateResume,//middleware
    createResume



    /* we can direclty write here  ref - 1
    resumeController.createResume 
    -> something.functionName  it means,
    functionName is inside something (object/module)
    */
);

module.exports = router;
