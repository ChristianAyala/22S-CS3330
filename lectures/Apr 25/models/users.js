const mongoose = require('../database/mongo');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const User = mongoose.model('User', UserSchema);

const createNewUser = async (email, password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({ email, password: hashedPassword });
    
    const result = await user.save();

    return result;
};

const findUserByEmail = async (email) => {
    const query = User.find({ email });
    const result = await query;
    return result;
}

const authenticateUser = async (email, password) => {
    const users = await findUserByEmail(email);
    console.log('Results of users query', users);
    if (users.length === 0) {
        console.error(`No users matched the email: ${email}`);
        return null;
    }
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        delete user.password;
        return user;
    }
    return null;
}


module.exports = {
    createNewUser,
    findUserByEmail,
    authenticateUser,
    deleteMany: User.deleteMany
};