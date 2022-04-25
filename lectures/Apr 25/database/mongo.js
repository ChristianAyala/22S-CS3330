const mongoose = require('mongoose');

const host = 'mongo';
const port = 27017;
const username = 'root';
const password = 'secret';
const database = 'smu';

mongoose.connect(`mongodb://${username}:${password}@${host}:${port}/`);
// mongoose.connect('mongodb://root:secret@mongo:27017/');

module.exports = mongoose;