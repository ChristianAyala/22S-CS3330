-- Right now we have two tables: student and address. But they have no explicit
-- relationship to one another in our schema.
-- Let's add that!
ALTER TABLE student
ADD COLUMN address_id INTEGER;

-- So a student HAS AN address (a single address ID). This ID should match an ID
-- found in the address table.

-- Now let's look at the contents of the tables
SELECT * FROM student;
SELECT * FROM address;

-- We can add a student that lives on address 2 (our Fort Worth address).
INSERT INTO student (id, first_name, last_name, gpa, address_id)
VALUES
('3841', 'Katie', 'Adams', 3.78, 2);

-- Let's do an explicit lookup of the student by ID
SELECT * FROM student
WHERE id = '3841';

-- So we see address_id of 2, so lookup the address by that ID
SELECT * FROM address
WHERE id = 2;

-- Great, we're relating data! But what happens if we add a student with an address
-- that doesn't exist in the system?
INSERT INTO student (id, first_name, last_name, gpa, address_id)
VALUES
('4375', 'John', 'Smith', 3.78, 100);

SELECT * FROM student;

-- That succeeded... Hooray?
-- So it _looks_ like there is a relationship now, but we just inserted "bad" data.
-- Let's do some cleanup and tell PG that we want there to be a foreign key relationship:
-- We are binding two columns from two tables together.

-- First let's delete our student that had that bad address
DELETE FROM student
WHERE id = '4375';

-- Now let's modify our student table. We're going to alter the address_id column
-- to be a foreign key, mapped to the primary key of the address table. Note that
-- a foreign key in one table MUST be mapped to a primary key of some other table.
ALTER TABLE student
ADD CONSTRAINT student_to_address_foreign_key
FOREIGN KEY (address_id)
REFERENCES address (id);

-- ALTER TABLE: We're changing the structure of a table
-- ADD CONSTRAINT: We're creating a named constraint on our schema that our engine will uphold
-- FOREIGN KEY: the column that will REFER TO a value in another table
-- REFERENCES: the table and column that our new foreign key constraint REFERS TO.

-- Now do a diagram visualization. What do you see different? We have a relation!

-- Our Schema now has an explicit relationship (constraint) across two tables.
-- In order for us to add address data to our student table, we have to provide
-- either a NULL value (no address) or an address ID that exists in the address table.

-- Let's try running the previous query that added an ID that doesn't exist.
INSERT INTO student (id, first_name, last_name, gpa, address_id)
VALUES
('4375', 'John', 'Smith', 3.78, 100);

-- We should see an error! Updating that address_id value should let it work:
INSERT INTO student (id, first_name, last_name, gpa, address_id)
VALUES
('4375', 'John', 'Smith', 3.78, 1);

-- Multiple students can make to the same address (roommates?)
UPDATE student
SET address_id = 1
WHERE student.id = '1234';

SELECT * FROM student;

-- Students may not be the only entities that live at an address. An address
-- is generic: all sorts of categories of people or entites can be associated to
-- an address. Let's create a new entity, but setup the relationship at the same
-- time we define the structure of the table itself.
CREATE TABLE professor (
    id VARCHAR(8) PRIMARY KEY,
    first_name VARCHAR(20),
    last_name VARCHAR(20),
    department VARCHAR(4),
    address_id INTEGER REFERENCES address (id) NOT NULL
);

-- In this case, a professor HAS AN address. And MUST have an address, since we
-- marked it as NOT NULL.
INSERT INTO address (street1, street2, city, state, zip)
VALUES
('789 Commerce', 'PO Box 28482', 'Dallas', 'TX', 75212);

INSERT INTO professor (id, first_name, last_name, department, address_id)
VALUES
('3590', 'John', 'Fattaruso', 'PHYS', 3);

SELECT * FROM professor;

-- Note that our address table has no idea about what's related to it.
-- The address table stores data related to an address.
