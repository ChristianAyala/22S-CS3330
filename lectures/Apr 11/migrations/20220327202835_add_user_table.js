exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.primary('email');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
