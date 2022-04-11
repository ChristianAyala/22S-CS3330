const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Student = require('../models/students');

const accessTokenSecret = 'mysupercoolsecret';

const authenticateStudent = async (email, password) => {
    const user = await User.authenticateUser(email, password);
    if (user === null) {
        return user;
    }
    const students = await Student.findUserByEmail(email);
    console.log('Students', students);
    const accessToken = jwt.sign({ ...students[0], claims: ['student'] }, accessTokenSecret);

    return accessToken;
    
}

module.exports = {
    authenticateStudent
};