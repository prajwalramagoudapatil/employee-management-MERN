const express = require("express");
const Employee = require("../models/employee"); // Assume the Employee schema is already defined
const router = express.Router();
const jwt = require('jsonwebtoken');
// const storage  = require('../index');
const multer  = require("multer");

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
};// Update employee details

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Raama Sita destintn');
        cb(null, "uploads/"); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        console.log('Raama Sita name');
        cb(null, `${Date.now()}-${file.originalname}`); // Rename file
    },
});

const upload = multer({ storage: storage });




router.get("/employee/:id", authenticateToken, async (req, res) => {
    console.log('GET(employee/:id)');
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);
        console.log("Id recived:", id, 'emp with id:', employee);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        if (employee.profileImage) {
            employee.profileImage = employee.profileImage.replace(/\\/g, "/");
        }

        res.status(200).json(employee);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete('/employee/:id',async(req, res)=>{
    try { 
        const { id } = req.params; 
        const deletedEmployee = await Employee.findByIdAndDelete(id); 
        if (!deletedEmployee) { 
            return res.status(404).send('Employee not found'); 
        } 
        res.status(200).send('Employee deleted successfully'); 
    } catch (error) { 
        res.status(500).send('Error deleting employee: ' + error);
    }
});

module.exports = router;
