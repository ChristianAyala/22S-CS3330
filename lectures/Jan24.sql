-- Welcome to a SQL script file!
-- Comments are lines that start with two dashes --

-- PostgreSQL is a database _engine_, and thus can manage any number of databases
-- Show all databases currently in my system. On a fresh install, there are a few
-- pre-included databases that you can look into, but ultimately will never use.

-- If you're using Datagrip, put your cursor over this next line and hit command-enter
-- (ctrl-enter on windows / linux). Or hit the play button right above this.
SELECT datname FROM pg_database;

-- Reading from left to right, we are selecting all database names from a table called pg_database.
-- So the engine uses a database to manage other databases!

-- Any SQL keywords, such as SELECT and FROM, are capitalized by convention.

-- Let's create a database that will house data about students. It can eventually house
-- all sorts of entities (some may or may not be directly related to students), so
-- we will use a generic name.
CREATE DATABASE smu;

-- Now query for the databases in our system, which should include our SMU DB.
SELECT datname FROM pg_database;

-- Update your connection parameters in datagrip to connect to SMU, then come back here.
-- Now let's start setting up our DB to save Student records.
CREATE TABLE student (
    id VARCHAR(8),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    gpa FLOAT
);

-- VARCHAR: like a string datatype. The 8 or 50 is used to pre-allocate space, but the
-- actual data may be longer or shorter than that.
-- FLOAT: Floating point number data
-- Other common datatypes:
--      SMALLINT, INTEGER, BIGINT (2, 4 and 8 byte integers, respectively)
--      DECIMAL (Arbitrary precision)
--      BOOLEAN (for boolean data)
--      VARCHAR (character data)
--      JSON (For JSON data, allows for querying of nested fields)
-- https://www.postgresql.org/docs/9.5/datatype.html

-- Common practices:
-- A table name and attribute names are usually lower cased and use snake_case

-- Oh no, we didn't specify a primary key! Let's delete (DROP) our table and try again
DROP TABLE student;

-- Let's redefine our table structure, this time identifying the ID as a unique identifier
CREATE TABLE student (
    id VARCHAR(8) PRIMARY KEY, -- This now tells PG that we can uniquely identify a student record by ID
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    gpa FLOAT
);

-- Take a look at the table structure
-- There is a KEY called student_pkey: this is PG telling you that there is a primary key
-- There is an INDEX on the primary key. EVERY primary and foreign key gets an INDEX, often
-- a B-tree behind the scenes, so that I can VERY efficiently query for data.
-- An INDEX is often kept in memory, while the data itself is kept on disk.

-- Now lets query for all the data in my table.
SELECT * FROM student;

-- Breaking that down a bit:
-- SELECT: I am pulling (select'ing) every piece of data that matches some criteria
-- *: I am interested in all attributes (columns) within that relation
-- FROM student: I am pulling data specific to students

-- There is no data in our table, so we get an empty table.
-- Let's fill in some data.
INSERT INTO student (id, first_name, last_name, gpa)
VALUES
('1234', 'Mark', 'Fontenot', 3.8),
('5678', 'Andrew', 'Quicksall', 4.0),
('1357', 'Christian', 'Ayala', 2.5);

-- Breaking that down:
-- INSERT INTO student: I am inserting data into the student table. I can only insert data into ONE
-- table at a time. Inserting data to multiple tables requires multiple queries
-- (id, first_name, last_name, gpa): Listing the order of attributes I am inserting data into.
-- VALUES (...): The set of values to insert. The order of values should match the order of attributes.

-- We've inserted data, so let's run our SELECT again.
SELECT * FROM student;

-- We can query for specific attributes, which can limit the response size for large datasets
SELECT first_name, last_name FROM student;

-- What happens if we insert a student with an ID that already exists in our system?
INSERT INTO student (id, first_name, last_name, gpa)
VALUES
('1234', 'Duplicate', 'Student', 4.0);

-- We get an error! Postgres is maintaining the INTEGRITY of our schema by rejecting
-- a duplicate primary key.

-- Now let's query for all students that match a give filter: a minimum GPA of 3.0
SELECT * FROM student
WHERE gpa >= 3.0;

-- What about a query looking for string equality?
SELECT * FROM student
WHERE first_name = 'Mark';

-- Or perhaps some loose string matching?
SELECT * FROM student
WHERE last_name LIKE 'Font%';

-- Your usual comparison operators are available.

-- Note how we break apart parts of the SQL Query into separate lines for readability

-- Now let's add another table, that will store some address data.
-- In this example, let's say that a student can only belong to a single address.
CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    street1 VARCHAR(30) NOT NULL,
    street2 VARCHAR(30),
    city VARCHAR(30) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip INTEGER NOT NULL
);

-- New terms:
-- SERIAL: An auto-incrementing number used as an ID. Postgres maintains the current value
--         of the key for us, so we just need to keep adding new data to have that number increment
-- NOT NULL: We define most of our address fields as required (can't be NULL).

-- Let's see how many tables we have now
SELECT *
FROM pg_catalog.pg_tables
WHERE schemaname = 'public';

-- We should see our student table and our address table.
-- On the left, highlight the "tables" folder, right click, and select Diagrams -> Show Visualization
-- You should now see a clearer visualization of the two tables and their attributes.

-- Just like with students, we can add some data to our address table
INSERT INTO address (street1, street2, city, state, zip)
VALUES
('123 Main', NULL, 'Dallas', 'TX', 75201),
('456 Elm', NULL, 'Fort Worth', 'TX', 75117);

SELECT * FROM address;
-- Note how the id field was omitted in the INSERT statements, but they are assigned in
-- the table. This is useful when you need a unique identifier, but don't really care WHAT
-- the value of the identifier is at the time you're storing the data.