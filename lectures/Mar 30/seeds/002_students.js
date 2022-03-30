const random = require('../utils/random-generator');

/**
 * A student is tied to the user table via a foreign key through the email address.
 * As such, we need to first load some users that were randomly generated in the
 * previous seed file. Then, we take those emails and assign them to some randomly
 * generated students using the overrides we specified in the random-generator
 * file.
 */
exports.seed = async function(knex) {
    // Use knex to load 5 users
    const users = await knex('users').limit(5);

    // Map through each user, and generate a random student record with that user's email
    const students = users.map((user) => {
      return random.student({ email: user.email });
    });

    // Then insert the five students we generated
    await knex('students').insert(students);
};
  