const mongoose = require('../database/mongo');

const StudentSchema = new mongoose.Schema({
    name: String,
    email: String
});

const Student = mongoose.model('Student', StudentSchema);

const findUserByEmail = async (email) => {
    const query = Student.find({ email });
    const result = await query;
    return result;
}

const createStudent = async (name, email) => {
    const student = new Student({ name, email });
    return await student.save();
}

module.exports = {
    findUserByEmail,
    createStudent,
    deleteMany: Student.deleteMany
};