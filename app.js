/* app.is place where you connect everything together,
Create the app
Add middleware
Connect routes */



const express = require('express');
const app = express();

const router = require('./routes/resumeRoutes');

app.use(express.json()); // Converts incoming JSON → JavaScript object
/*Middleware to Parse JSON 
Stores it in: req.body */

// adding base URL
app.use('/api/v1/resume', router);

module.exports = app;
