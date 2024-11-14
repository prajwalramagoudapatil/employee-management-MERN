const mongoose = require('mongoose');


// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/employee_db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});


const User = mongoose.model('t_login', userSchema);


module.exports = {
    User,
}