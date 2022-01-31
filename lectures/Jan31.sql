-- Let's change it up and create a hotel reservation system. Think about the entities
-- and let's define some rules around those entities:

--   A hotel has many rooms
--   A hotel has many reservations
--   A hotel has many customers staying at that hotel
--   A reservation is tied to a single room and a single customer
--   A customer can have many reservations across many hotels

-- We already see some entities (nouns) and their relationships (verbs).
-- Let's define a schema to store this hotel data based on the rules above.

CREATE DATABASE hotel_system;

-- We need a hotel table
CREATE TABLE hotel (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- Next, some room information. A room is tied to a hotel. The combination
-- of hotel ID and room number uniquely identifies a room in my system.
CREATE TABLE room (
    room_number INTEGER,
    capacity INTEGER NOT NULL,
    is_smoking BOOLEAN NOT NULL DEFAULT FALSE,
    hotel_id INTEGER REFERENCES hotel(id),
    PRIMARY KEY (room_number, hotel_id)
);

-- Next, customer information
CREATE TABLE customer (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30)
);

-- Lastly, reservation information. For now, it's a room, customer,
-- and start / end date for a reservation. A null end date is allowed
-- for customers who are reserving a room indefinitely.
CREATE TABLE reservation (
    id SERIAL PRIMARY KEY,
    room_number INTEGER NOT NULL,
    hotel_id INTEGER NOT NULL,
    customer_id INTEGER REFERENCES customer(id),
    start_date DATE NOT NULL,
    end_date DATE,
    FOREIGN KEY (room_number, hotel_id) REFERENCES room(room_number, hotel_id)
);

-- You can see in the visualization that a reservation ties THREE entities together:
-- A hotel, a room, and a customer, even if the hotel is transitively connected
-- via the relationship defined in the room.

-- Now let's fill the tables with some data
INSERT INTO hotel (name)
VALUES
('Hampton Inn'),
('Hampton Inn & Suites');

INSERT INTO room (room_number, hotel_id, capacity, is_smoking)
VALUES
(101, 1, 2, FALSE),
(102, 1, 2, FALSE),
(103, 1, 4, FALSE),
(104, 1, 4, TRUE),
(201, 1, 6, FALSE),
(202, 1, 6, TRUE),
(11, 2, 2, FALSE),
(12, 2, 4, TRUE),
(21, 2, 4, FALSE),
(22, 2, 6, TRUE);

INSERT INTO customer (first_name, last_name)
VALUES
('Christian', 'Ayala'),
('Mark', 'Fontenot'),
('Andrew', 'Quicksall');

-- Gathering all the customer information is straightforward:
SELECT * FROM customer;

-- Figuring out my non-smoking rooms is also straightforward:
SELECT * FROM room
WHERE is_smoking = FALSE;

-- But what if I want to search for all non-smoking rooms at Hampton Inn?
-- Well we could update the filter to look for that ID:
SELECT * FROM room
WHERE is_smoking = FALSE
AND hotel_id = 1;

-- But this implies that I know what the ID is for a hotel. What if I don't
-- know the ID, but I know the name, and I still want all non-smoking rooms
-- for a hotel with a given name? Well, let's start by doing a cartesian product
-- of all rooms and hotels, which will give every combination of room + hotel
-- (even if a room doesn't belong to a hotel). To do so, we do a CROSS JOIN,
-- which is the SQL equivalent of A cross B (AxB).
SELECT * FROM room
CROSS JOIN hotel;

-- There are 10 rooms and 2 hotels, so the cross product of the two tables
-- should result in 20 records. Remember: a cross product of two sets is the
-- set of all combinations of elements in A and elements in B.

-- Ideally I want records to show the hotel the room actually belongs to.
-- One way to do that is through a JOIN. This "joins" two tables together
-- such that rows that exist in a cartesian product ALSO match a given
-- criteria. More often than not, that criteria is that a foreign key (room.hotel_id)
-- in one table equals the corresponding primary key in another table (hotel.id).
SELECT * FROM room
JOIN hotel ON room.hotel_id = hotel.id;

-- We see in the result set that each room now ALSO includes the hotel information.
-- However, hotel_id is duplicated with an id column. That's not ideal. Let's
-- update our query to include just a few data points:
SELECT room.room_number, room.is_smoking, hotel.name
FROM room
JOIN hotel ON hotel.id = room.hotel_id;

-- Nice, that's easier to read. Now we can expand our query to filter on just
-- non-smoking rooms at the Hampton Inn
SELECT room.room_number, room.is_smoking, hotel.name
FROM room
JOIN hotel ON hotel.id = room.hotel_id
WHERE is_smoking = FALSE
AND hotel.name = 'Hampton Inn';

-- A common aggregate function is COUNT, which as the name implies, gives the
-- count of records that match a given criteria. Aggregate functions do some
-- kind of aggregation on an attribute or a set of attributes.
-- Let's start small and answer the question: how many hotels are in my system?
SELECT COUNT(*) FROM hotel;

-- COUNT(*) means the count of all records.

-- You can rename columns to make it clearer in your result set.
SELECT COUNT(*) AS number_of_hotels FROM hotel;

-- Next question: how many rooms are non-smoking?
SELECT COUNT(*) AS non_smoking_rooms FROM room
WHERE is_smoking = FALSE;

-- Let's apply that to a previous query to answer the question:
-- How many rooms at Hampton Inn are non-smoking?
SELECT COUNT(*) AS non_smoking_rooms_at_hampton_inn
FROM room
JOIN hotel ON hotel.id = room.hotel_id     -- Here we join the two tables together, matching foreign and primary keys
WHERE is_smoking = FALSE                           -- and then apply our filters. As long as column names are unique, you don't
AND hotel.name = 'Hampton Inn';                    -- need to specify table names. But it may be clearer to do so.

-- Ok so we're able to query for data where filters span multiple tables.
-- So let's bring in customers and reservations into the mix. We have
-- rooms, hotels, and customers in our system, now lets book some rooms.
INSERT INTO reservation (room_number, hotel_id, customer_id, start_date, end_date)
VALUES
(101, 1, 1, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day'),
(102, 1, 1, CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days'), -- Customer 1 booked 2 rooms
(102, 1, 1, CURRENT_DATE + INTERVAL '3 days', CURRENT_DATE + INTERVAL '4 days'),
(103, 1, 2, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day'),
(11, 2, 3, CURRENT_DATE, CURRENT_DATE + INTERVAL '5 days'),
(21, 2, 2, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day');

-- What happens if I try to reserve a room number and hotel ID that both
-- exist, but aren't a combo that is "valid" (i.e. the primary key doesn't exist)?
INSERT INTO reservation (room_number, hotel_id, customer_id, start_date, end_date)
VALUES
(101, 2, 2, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day');

-- So make sure your constraints (foreign keys) are valid!

-- Now lets take a look at all the reservations
SELECT * FROM reservation;

-- But I also need to know what hotel names are associated to each reservation,
-- because I don't know what hotel is associated to each ID off the top of my head.
-- So I JOIN the reservation table with the hotel table. Even though the two tables
-- aren't technically directly associated to each other (a reservation is tied to
-- a room which is tied to a hotel), I can still join those two tables together.
SELECT * FROM reservation
JOIN hotel ON reservation.hotel_id = hotel.id;

-- I'll trim down the number of columns on the previous query, and rename columns...
-- Now the result set is easier to read, right?
SELECT hotel.name as hotel_name, room_number, start_date, end_date
FROM reservation
JOIN hotel ON reservation.hotel_id = hotel.id;

-- You can do more than one JOIN if needed. Let's say I want the following information:
-- hotel name, room number, start date, end date, and customer first + last name.
-- In this case, we need to JOIN the hotel, customer, and reservation tables to
-- provide the data.
SELECT hotel.name as hotel_name, room_number, start_date, end_date, first_name, last_name
FROM reservation
JOIN hotel ON reservation.hotel_id = hotel.id             -- This pulls hotel info from the reservation
JOIN customer ON reservation.customer_id = customer.id;   -- And this pulls customer info.

-- Two JOIN's?? What if I want to pull the following information:
-- Everything above AND the room capacity?
-- Well the room capacity lives in the room table which we're not querying from
-- so let's JOIN on that too!
SELECT hotel.name as hotel_name, room_number, start_date, end_date, first_name, last_name, capacity
FROM reservation
JOIN hotel ON reservation.hotel_id = hotel.id             -- This pulls hotel info from the reservation
JOIN customer ON reservation.customer_id = customer.id    -- And this pulls customer info.
JOIN room ON hotel.id = room.hotel_id;                    -- And this pulls room info.

-- Uh oh, we get the error "column reference room_number is ambiguous".
-- Both the reservation table and the room table have a "room_number" column,
-- so the DB engine doesn't know what column in what table you're referring to.
-- Let's specify what table we want to pull that from.
SELECT hotel.name as hotel_name, room.room_number, start_date, end_date, first_name, last_name, capacity
FROM reservation
JOIN hotel ON reservation.hotel_id = hotel.id             -- This pulls hotel info from the reservation
JOIN customer ON reservation.customer_id = customer.id    -- And this pulls customer info.
JOIN room ON reservation.room_number = room.room_number AND reservation.hotel_id = room.hotel_id; -- And this pulls room info.

-- JOIN'ing across a bunch of tables still lets us filter using WHERE clauses.
-- Let's say I want all reservations for room 102.
SELECT hotel.name as hotel_name, room.room_number, start_date, end_date, first_name, last_name, capacity
FROM reservation
JOIN hotel ON reservation.hotel_id = hotel.id             -- This pulls hotel info from the reservation
JOIN customer ON reservation.customer_id = customer.id    -- And this pulls customer info.
JOIN room ON reservation.room_number = room.room_number AND reservation.hotel_id = room.hotel_id -- And this pulls room info.
WHERE room.room_number = 102;

-- How many reservations are there for room 102?
SELECT COUNT(*) FROM reservation
JOIN room ON reservation.room_number = room.room_number and reservation.hotel_id = room.hotel_id
WHERE room.room_number = 102;
