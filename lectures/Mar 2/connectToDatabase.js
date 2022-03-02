/**
 * Today we'll cover dependency modules and connecting to a database via Javascript.
 * First, dependencies. Javascript has a HUGE collection of open-source libraries that
 * you can very easily include in a project. So far, we've just been using the "node"
 * command to run scripts. "node" is the JS _runtime_ itself. That runtime can also
 * load any number of 3rd-party libraries, known as _dependencies_ or _packages_. Node
 * has a "package manager" called "npm" (Node Package Manager) that actually installs
 * and tracks versions of dependencies you want to use.
 * 
 * Start by running this command in the terminal:
 * 
 * npm init
 * 
 * You'll be prompted to answer a few questions. You can either fill them all in,
 * or just press enter if you don't know or don't care to respond. You'll find that
 * it creates a file called "package.json". This is a special file that npm generates
 * that tracks metadata about your app.
 * 
 * Now let's add a new dependency: mysql. MySQL is another database engine much like
 * Postgres, but since your lab / semester project will have you using mysql, we will
 * learn about it here so you can use it there. Run the following commands:
 * 
 * apt install mysql-server                 <- if you are on windows, may need to include sudo
 * brew install mysql                       <- if you are on mac
 * npm install --save mysql                 <- regardless of platform
 * 
 * Take a look at the package.json file. It now lists mysql in the dependencies block.
 * There is also a package-lock.json file. This file tells the package manager
 * EXACTLY where to find the dependency. Those two things together allow you to
 * hand the project / repo over to someone else, and when they run:
 * 
 * npm install
 * 
 * The package manager will download EXACTLY the same dependencies so everyone has a
 * consistent runtime.
 * 
 * The last new thing we see is a node_modules directory. This directory contains the
 * code of the dependencies themselves. So we have four things in our app:
 * 
 * 1. The code that we write
 * 2. A package.json file outlining the human-readable dependencies our app needs
 * 3. A package-lock.json file outlining where these dependencies can be found
 * 4. A node_modules directory containing the code of the dependencies themselves
 * 
 * Last important note: this directory includes a .gitignore file that tells git
 * to ignore (don't commit) the node_modules directory. This is standard practice:
 * you don't commit the dependencies themselves, just the definitions.
 * 
 * ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
 */

/**
 * That's a lot of build up. But now we are able to use the mysql dependency we installed.
 * Since it's located in the node_modules directory, it is a module that node can load
 * just like a module that we write.
 */

const mysql = require('mysql');

/**
 * Next, we establish a connection to the DB. The actual connection is created as an
 * asynchronous function, so we provide a callback function that handles the connection
 * error or success.
 */
const DBConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    insecureAuth: true,
});

DBConnection.connect((err) => {
    if (err) {
        console.error('There was a problem connecting to the DB', err);
        return;
    }
    connectionSuccessHandler();
});

const connectionSuccessHandler = () => {
    console.log('Successful connection!');
    createDatabase();
}

/**
 * Next, we create a database. Previously we've seen CREATE DATABASE db_name, but
 * since we might run this script multiple times, we add IF NOT EXISTS to make
 * sure we only create the DB if it doesn't already exist. Otherwise, do nothing.
 */
const createDatabase = () => {
    DBConnection.query('CREATE DATABASE IF NOT EXISTS smu', (err, results) => {
        if (err) {
            console.err('There was a problem creating a database');
            return;
        }
        console.log('Sucessfully created the smu database');
        createDatabasePromisified();
    });
}

const createDatabasePromisified = async () => {
    /**
     * We're getting deep into callbacks, which is not ideal. However, this structure
     * of having the last argument always be a callback that takes an error and results
     * objects is consistent and allows us to convert it to a promise. Node provides a
     * handy promisify function that wraps a callback-style async function into a promise.
     * 
     * Documentation here: https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original.
     * 
     * Let's convert the query function into a promise so that we can async / await all
     * future queries.
     */

    const util = require('util');
    const DBQuery = util.promisify(DBConnection.query).bind(DBConnection);

    try {
        const result = await DBQuery('CREATE DATABASE IF NOT EXISTS smu');
        console.log('Successfully recreated the DB');
    } catch (err) {
        console.error('There was a problem recreating the DB', err);
    }

    /**
     * Great, now we can do things without doing a whole bunch of callbacks everywhere. So let's
     * build a schema. If we want to create a couple of tables, we can define the query first
     * and then execute them back to back:
     */

    try {
        const useDatabaseQuery = `USE smu`;
        const studentTableQuery = `
            CREATE TABLE IF NOT EXISTS student (
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(30)
            )
        `;
        const courseTableQuery = `
            CREATE TABLE IF NOT EXISTS course (
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                department VARCHAR(30),
                course_number INTEGER
            )
        `;
        await DBQuery(useDatabaseQuery);
        await DBQuery(studentTableQuery);
        await DBQuery(courseTableQuery);

        console.log('Successfully created tables in the DB');

        /**
         * Once we switch to using the SMU database, we can create the tables in
         * parallel. This is safe to do in this case because these two tables have
         * no direct foreign key relationship that requires one to be created before
         * the other. If there WAS a foreign key relationship then we would need to
         * be sure that we create them in sequence.
         * 
         * The syntax for running promises in parallel is as such:
         */

        await Promise.all(
            [
                DBQuery(studentTableQuery),
                DBQuery(courseTableQuery)
            ]
        );

        /**
         * We await for a list of promises to ALL resolve.
         */

        console.log('Both queries were executed in parallel and were successful');

        /**
         * We can populate the DB in much the same way. Conveniently, the mysql library
         * just exposes a generic "query" function, and the return type of the query function
         * is always a promise that resolves to the results of the query.
         */

        const insertStudentsQuery = `
            INSERT INTO student(name)
            VALUES
            ('Christian Ayala'),
            ('Mark Fontenot'),
            ('Andrew Quicksall')
        `;
        const insertStudentsResult = await DBQuery(insertStudentsQuery);
        console.log('Inserted students with a result:', insertStudentsResult);

        /**
         * We see that the function resulted in an object with some metadata about what happened
         * with the queries. We see that 3 records were changed (change can mean inserted), with
         * no warnings.
         */

        /**
         * Last but not least, let's query for data and see what the results look like.
         */
        const selectQueryResults = await DBQuery('SELECT * FROM student');
        console.log('Results of the select query', selectQueryResults);

        /**
         * What we find is an array of record objects. Typically we do some application-level
         * processing on these records, and since it's an array, we can loop through each record
         * with a forEach loop
         */

        selectQueryResults.forEach((student) => {
            const nameSplit = student.name.split(' ');
            console.log('First name', nameSplit[0], 'Last Name', nameSplit[1]);
        });

        /**
         * Next we can run a query with a filter (a WHERE clause). Suppose that a user is given
         * a text field where they can enter a string to filter for students with a matching
         * first name. One way to do it would be to take that string, append it onto a SELECT
         * statement, and run it like we have been.
         */
        const firstNameFilter = 'Christian Ayala';
        const selectByFirstName = await DBQuery(`SELECT * FROM student WHERE name = '${firstNameFilter}'`);
        console.log('Results of a simple SELECT WHERE statement', selectByFirstName);

        /**
         * That works, but you may already know that this is ripe for abuse. What do you expect the
         * results would be of the following query?
         */
        const sneakyFirstNameFilter = "Christian Ayala' OR '1 = 1";
        const selectBySneakyFirstName = await DBQuery(`SELECT * FROM student WHERE name = '${sneakyFirstNameFilter}'`);
        console.log('Results of this new sneaky query', selectBySneakyFirstName);

        /**
         * Uh oh, we now get EVERYTHING back. This is known as a SQL Injection. Someone who knows
         * a thing or two about SQL could figure out how to "inject" SQL to get more results than
         * they are likely allowed to see. So there's a way to cleanly sanitize a query to make it
         * safe through the use of "SQL escaping". Through this process, you specify placeholders
         * where user input should go, and let the mysql library clean that for you.
         */
        const queryWithPlaceholders = 'SELECT * FROM student WHERE name = ?'; // The question mark denotes a placeholder
        const selectBySanitizedFirstName = await DBQuery(queryWithPlaceholders, [sneakyFirstNameFilter]);
        console.log('Results with the WHERE clause sanitized', selectBySanitizedFirstName);

        /**
         * So now that same string that caused a SQL injection gets "escaped" so that people can
         * no longer inject malicious query information.
         * 
         * Rule of thumb: ANYTIME you deal with input from an external source (browser input fields, for example),
         * you should ALWAYS use this escape method.
         * 
         * You can escape any number of arguments too. Just make sure you list them in the right order.
         */

        const queryForNameAndId = 'SELECT * FROM student WHERE name = ? and id = ?';
        const selectByNameAndId = await DBQuery(queryForNameAndId, ['Christian Ayala', 1]);
        console.log('Results for querying by multiple values', selectByNameAndId);

        /**
         * Now let's clean up our DB by clearing out the table of students and closing the connection
         */
        const deleteQuery = await DBQuery('DELETE FROM student');
        console.log('Successfully deleted the table of students', deleteQuery);

        DBConnection.end();

    } catch (err) {
        console.error('Failed to create tables', err);
    }
}

