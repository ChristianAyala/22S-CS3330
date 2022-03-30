## March 28 Lecture: Knex Query Building and Basic Authentication

This directory focuses on two things: integrating with a query builder library known as
knex (http://knexjs.org) and basic password storage / checking.

### Knex Migrations

First, knex. Knex is a query builder. Rather than having a static set of query strings in
your model files, you can have a query builder generate these queries for you. This becomes
particularly useful when you have 1 to many search parameters (read: WHERE clauses) that
require you to put the right number of ? placeholders in a query.

Knex also supports the concept of "migrations". Think about a database for an application.
As the feature set of the application evolves over time, you need to update the database
from one schema to another. This can be things like adding or removing a column from a table,
updating existing records with some new data, or adding / removing entire tables to the schema.
Migrations, therefore, allow you to define two things to support this:

- an "up" function, that updates your database schema to some new version
- a "down" function, that downgrades your database schema to a previous version.

In general, the "down" function should be the "mirror" or "undo" of your up function. If your
up function adds a column, the down function should remove the column. If your up adds a table,
your down should remove the table. Think of migrations as steps on a ladder: you should be able
to take a step up to some newer version, while also being able to take a step down and end up
exactly where you were before.

knex is a library that supports these migrations. First, run the following in terminal to
install knex as a globally available dependency:

```sh
npm install -g knex
```

In this folder you will find a `knexfile.js`. This tells knex how to connect to your database.
Adjust the credentials / database name as needed.

Next, you will find a `migrations/` directory. This directory has a list of files that are
run _in the order that the files are listed_. This is why the file names have timestamps:
it lets the OS of your application order them correctly.

Suppose you want to change the schema of your database somehow. First, run the following
command to generate a new migration file:

```sh
knex migrate:make [name of migration]

# For example:
knex migrate:make add_professors_table
```

This will generate a file called `migrations/20220328185907_add_professors_table.js`. Note
the timestamp: it should be the last file in your directory when you order it by
name. In the file you'll see the following:

```js

exports.up = function(knex) {
    // Modify your schema here
};

exports.down = function(knex) {
    // revert your schema updates here
};
```

Inside the up and down functions you will outline any changes to your schema to move it
"forward in time" (up) or "backwards in time" (down). Anything you can do in SQL you can
also do via this knex libary (reference: http://knexjs.org/#Schema-createTable)

Once you've defined your schema updates in code, it's now time to run them. To migrate
your database to a new version, run the following in terminal:

```sh
knex migrate:up
```

Any migrations that have not been run previously are then executed, bringing your database
up to the latest version. To undo those changes, a.k.a. run the down migrations, run the
following:

```sh
knex migrate:down
```

Now that your migrations have been run and your schema is up to date, you can then start
your node server and interact with those new tables / schemas.

## Query Bulding and Password Mgmt

For this section, take a look at `models/users.js`, which handles user management. User
passwords should NEVER be stored in plain text (that is just ripe for hacking and abuse).
Instead, you want to store them securely through the use of salting and hashing.

Before continuing, read the following article from Auth0, a leading company in the user identification space:
https://auth0.com/blog/adding-salt-to-hashing-a-better-way-to-store-passwords/

Once you read through that, then refer to `models/users.js` and in-class lecture content
for more info on the topic.
