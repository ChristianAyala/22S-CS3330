exports.up = function(knex) {
    return knex.schema.createTable('students', (table) => {
      table.integer('id', 8);
      table.string('email').notNullable();
      table.string('name').notNullable();
      table.foreign('email').references('users.email');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('students');
  };
  