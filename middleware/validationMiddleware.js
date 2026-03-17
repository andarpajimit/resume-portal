//In Express.js, middleware runs before the controller
const { body, validationResult } = require('express-validator');

//we group everything into one variable
/*without array
routes.js
---------
router.post(
 '/apply',
 10 validation lines here,
 controller
)
*/
/*
With array
routes.js
---------
router.post('/apply', validateResume, controller)

middleware/validateResume.js
*/
//req.bod.firstName
const validateResume = [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('phoneNumber').isLength({min:10,max:10}).withMessage('Phone number must be 10 digits'),
    body('skills').notEmpty().withMessage('Skills are required'),
    body('appliedPosition').notEmpty().withMessage('Applied position required'),
    body('earliestPossibleStartDate').notEmpty().isDate().withMessage('Start date must be valid'),
    /*
    custome formate for date
    body('earliestPossibleStartDate')
  .isDate({ format: 'DD-MM-YYYY', strictMode: true })
  .withMessage('Start date must be in DD-MM-YYYY format')
*/
    body('interviewDate').notEmpty().isDate().withMessage('Interview date must be valid'),

    // it will run after all validation
    (req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty){
            return res.status(400).json({
                errors : errors.array() // test this during demo
            });
        }
        next();       
    }   
]       
module.exports = validateResume;