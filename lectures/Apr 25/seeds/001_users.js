const random = require('../utils/random-generator');
const User = require('../models/users');

/**
 * Populates the user table. Using the chance n function (https://chancejs.com/miscellaneous/n.html)
 * we can very easily generate 10, 100, 100000 users by changing one value.
 * 
 * Keep in mind that these are pseudo random users, and thus the emails are pseudo random as well.
 * As such, if you pick bigger and bigger numbers, you are more likely to run into duplicate
 * email conflicts.
 */
exports.seed = async function(knex) {
    const users = random
        .n(random.user, 100)
        .map(user => new User(user));
    await Promise.all(users.map(user => user.save()));
};
  