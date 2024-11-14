const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('./models/user');
const  Employee  = require('./models/employee');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const employeeRouter = require('./routes/put-edited-emp')
const {createEmployeeRouter} = require('./routes/createEmployee');

const app = express();
const PORT = 8000;
const JWT_SECRET = "secret_key"; 

// Middleware
app.use(bodyParser.json());
app.use( cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specific HTTP methods
    credentials: true, // Include credentials (e.g., cookies, authorization headers)
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
}));
app.use(employeeRouter);
// app.use(createEmployeeRouter)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// verify JWT
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

app.get('/',(req, res)=>{
    res.send('<h1>Raama Sita</h1>');
})

// Routes
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).send('Username and password are required.');

    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('Invalid username.');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if( user.password !== password ) {
        return res.status(400).send('Invalid password.');
    }
    // if (!isPasswordValid) return res.status(400).send('Invalid password.');

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    console.log('tokeNN:', token);
    res.status(200).send({ message: 'Login successful',  token: token });
});

app.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).send('Error fetching employees');
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync('uploads')) { fs.mkdirSync('uploads');}
        console.log('Raama Sita destintn');
        cb(null, "uploads/"); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        console.log('Raama Sita name');
        cb(null, `${Date.now()}-${file.originalname}`); // Rename file
    },
});

const upload = multer({ storage });


app.get('/employees', async (req, res) => {
    try { 
        const employees = await Employee.find(); 
        res.status(200).json(employees); 
    } 
    catch (error) { 
        res.status(500).send('Error retrieving employees: ' + error); 
    }
});


app.post(
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

app.put("/employee/:id", authenticateToken,
    upload.single("profileImage"), 
    async (req, res) => {
        try {
            const { id } = req.params;
            console.log("Id recived in PUT:", id);
            const { name, email, mobile,gender, coursesCompleted, designation } = req.body
            console.log(name, email, mobile,gender, coursesCompleted, designation);

            let parsedCourses;
            console.log('Raama Sita bef parse checkedItems(courses)');

            if(coursesCompleted) {
                parsedCourses = JSON.parse(coursesCompleted);
            }
            console.log('Raama Sita aft parse checkedItems(courses)');

            const updatedEmployee = await Employee.findByIdAndUpdate(
                id, 
                { name, email, mobile, gender, coursesCompleted : parsedCourses, designation}, 
                { new: true }
            );

            console.log("Edit :", id);
            if (!updatedEmployee) {
                return res.status(404).json({ message: "Employee not found" });
            } else if (req.file) { 
                updatedEmployee.profileImage = req.file.path; 
                await updatedEmployee.save();
            }

            res.status(200).json({ message: "Employee updated successfully", employee: JSON.stringify(updatedEmployee) });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error", error: err });
        }
    });

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports =  authenticateToken
module.exports = storage