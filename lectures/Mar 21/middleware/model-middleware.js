const connectToDatabase = require('../models/database-helpers');
const Professor = require('../models/professor');
const Student = require('../models/student');

/**
 * This middleware function is meant to be registered BEFORE the route handlers (see index.js)
 * This sets up a connection to the database. We modify the request object by tacking on the
 * models and disconnect function. Any FUTURE middleware / route handler thus has access to
 * those models / disconnect function by virtue of the fact that the request object is the same
 * one through the whole chain
 */
const createModelsMiddleware = async (req, res, next) => {
    console.log('Connecting to the database');
    const { DBQuery, disconnect } = await connectToDatabase();
    req.models = {
        student: new Student(DBQuery, disconnect),
        professor: new Professor(DBQuery, disconnect)
    }
    req.disconnect = disconnect;
    next();
}

/**
 * This middleware function is meant to be registered AFTER the route handlers (see index.js)
 * This closes the connection to the DB.
 */
const disconnectFromDatababaseMiddleware = (req, res, next) => {
    console.log('Disconnecting from the database');
    req.disconnect();
    next();
}

module.exports = {
    createModelsMiddleware,
    disconnectFromDatababaseMiddleware
}