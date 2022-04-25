const Student = require('../models/students');
const User = require('../models/users');
/**
 * knex will run all seed files in the seeds directory. As such, trying to insert
 * data, especially duplicate primary key data that you may have hardcoded, will
 * likely fail. BUT, you also want to be able to wipe the database and re-populate
 * with starter data. As such, the first seed file is meant to delete everything
 * out of your tables. So this function goes through each table in my schema and
 * deletes all records.
 */
exports.seed = async function() {
  await User.deleteMany({});
  await Student.deleteMany({});
};
