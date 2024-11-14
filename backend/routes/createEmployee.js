const express = require('express');
const storage = require('../index');
const multer = require("multer");
const Employee = require('../models/employee');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "secret_key"; 
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access Denied');

    jwt.verify(token, JWT_SECRET, (err, user) => {
        console.log('token varify err in authenticat TOKen');
        if (err) return res.status(403).send('Invalid Token');
        req.user = user;
        console.log('token varified successfully');
        next();
    });
};

const createEmployeeRouter = express.Router();

const upload = multer({ storage: storage });

createEmployeeRouter.post(
    "/create-employee",
    authenticateToken,
    upload.single("profileImage"), // Handle single file upload
    async (req, res) => {
        const { username, email, mobile, designation, gender, checkedItems } = req.body;

        if (!username || !email )
            return res.status(400).send("username and email fields are required");

        try {
            const existingUser = await Employee.findOne({  email: email  });
            if (existingUser) {
                return res.status(400).send('Email already exists');
            }
            let parsedCourses;
            if(checkedItems) {
                parsedCourses = JSON.parse(checkedItems);
            }
            console.log('Raama Sita aft parse checkedItems(courses)');

            const newEmployee = new Employee({
                name: username,
                email: email,
                mobile: mobile || null,
                designation: designation || null,
                gender: gender || null,
                profileImage: req.file?  req.file.path : null, // Save file path
                coursesCompleted: parsedCourses || null,
            });

            await newEmployee.save();
            res.status(201).send("Employee created successfully");
        } catch (err) {
            console.error( 'back err:', err);
            res.status(500).send("backend Error creating employee");
        }
    }
);

// Create Employee route
// createEmployeeRouter.post( "/create-employee", authenticateToken, upload.single("profileImage"), 
//     async (req, res) => {
//         const { username, email, mobile, designation, gender, checkedItems } = req.body;

//         if (!username || !email )
//             return res.status(400).send("username and email fields are required");

//         try {
//             const existingUser = await Employee.findOne({  email: email  });
//             if (existingUser) {
//                 return res.status(400).send('Email already exists');
//             }
//             const parsedCourses = JSON.parse(checkedItems); 

//             const newEmployee = new Employee({
//                 username: username,
//                 email: email,
//                 mobile: mobile || null,
//                 designation: designation || null,
//                 gender: gender || null,
//                 profileImage: req.file.path || null, // Save file path
//                 coursesCompleted: parsedCourses || null,
//             });

//             await newEmployee.save();
//             res.status(201).send("Employee created successfully");
//         } catch (err) {
//             console.error(err);
//             res.status(500).send("Error creating employee");
//         }
//     }
// );

module.exports = {
    createEmployeeRouter
}