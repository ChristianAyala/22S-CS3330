const random = require('../utils/random-generator');

/**
 * A professor is tied to the user table via a foreign key through the email address.
 * As such, we need to first load some users that were randomly generated in the
 * previous seed file. Then, we take those emails and assign them to some randomly
 * generated professors using the overrides we specified in the random-generator
 * file.
 */
exports.seed = async function(knex) {
    // Use knex to load 5 users. We apply an offset to skip the first five users
    // because those were assigned in the students.js seed file
    const users = await knex('users').limit(5).offset(5);

    // Map through each user, and generate a random professor record with that user's email
    const professors = users.map((user) => {
      return random.professor({ email: user.email });
    });

    // Then insert the five professors we generated
    await knex('professors').insert(professors);
};
  