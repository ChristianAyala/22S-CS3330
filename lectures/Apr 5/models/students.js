const knex = require('../database/knex');

const STUDENTS_TABLE = 'students';

const findUserByEmail = async (email) => {
    const query = knex(STUDENTS_TABLE).where({ email });
    const result = await query;
    return result;
}

module.exports = {
    findUserByEmail
};