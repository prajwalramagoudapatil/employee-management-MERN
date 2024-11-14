const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String,  },
    gender: { type: String,  },
    designation: { type: String,  },
    profileImage: { type: String,  },
    coursesCompleted: {
        MCA: { type: Boolean, default: false },
        BCA: { type: Boolean, default: false },
        BSC: { type: Boolean, default: false },
    },
    createdDate: { type: Date, default: Date.now },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;