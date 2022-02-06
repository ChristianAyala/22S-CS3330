
-- In our hotel system currently, we have 10 rooms and 6 reservations.
-- So not all rooms have reservations associated to them.
SELECT * FROM room;
SELECT * FROM reservation;
-- Let's answer the request: give me ALL rooms, and any reservations they may have.
-- There's an implication here that even if a room has no reservations, we still
-- want that room data. So in this case, an outer join would be perfect.
SELECT * FROM room
LEFT OUTER JOIN reservation r
    ON room.room_number = r.room_number
    AND room.hotel_id = r.hotel_id;

-- Some rooms show up multiple times (102) because they have multiple reservations.
-- Others show up with a single time because they have one reservation, while
-- others show up with several columns filled with null values because they have
-- no reservations.

-- Suppose that customer's are added to the system before they make reservations.
-- For example, a company OrderMyGear adds all their employees as customers of the
-- system in preparation for an as-of-now unscheduled trade show.
-- We add some customer records now.
INSERT INTO customer (first_name, last_name)
VALUES
('Drew', 'Simon'),
('Daniel', 'Hodges'),
('Zach', 'Bullough');

-- We now have 6 customers
SELECT * FROM customer;
DELETE FROM customer WHERE ID IN(7, 8, 9);

-- What customers have reservations? Let's start by gathering what customer ID's
-- are in my reservation table
SELECT customer_id FROM reservation;

-- We can get distinct ID's using the aggregate function DISTINCT
SELECT DISTINCT(customer_id) FROM reservation;

-- If we want the number of customers that have reservations, COUNT the number of DISTINCT customer id's
SELECT COUNT(DISTINCT(customer_id)) FROM reservation;

-- So we know that 3 customers have reservations. Let's answer the question:
-- Give me all customers and any reservations they may have.
SELECT * FROM reservation
RIGHT OUTER JOIN customer c
    ON reservation.customer_id = c.id;

-- Again, some customers show up multiple times because they have multiple
-- reservations. Some rows appear mostly empty because some customers don't
-- have reservations. But we have all the customer data, which is great!

-- We've mentioned aggregate functions like DISTINCT and COUNT. There are
-- many kinds of aggregate functions, including SUM, AVG, MIN, MAX.
-- For example, we can find the earliest / latest starting date for a reservation using
-- the MIN / MAX aggregate functions respectively
SELECT * FROM reservation;
SELECT MIN(start_date) FROM reservation;
SELECT MAX(start_date) FROM reservation;

-- Suppose I want to look at the reservation table and ask: for each unique
-- customer, how MANY reservations do they have? So not _all_ the reservation
-- data, but the count. In this case, we start by trying a COUNT
SELECT * FROM reservation;
SELECT COUNT(customer_id) FROM reservation;

-- We know there are 6 reservations, so the result makes sense. We could
-- try a WHERE clause to filter ID's, but that doesn't quite get us the
-- answer we're looking for.
SELECT COUNT(*) FROM reservation
WHERE customer_id = 1;

-- We can tell the aggregate function what we want a COUNT for using
-- two special terms: GROUP BY and HAVING. Let's start with GROUP BY.
-- In this case, we want to GROUP our reservations by customer, and THEN
-- grab the count of each of those groups. When COUNT and GROUP BY are
-- used in tandem, SQL knows that you want to group first then count
-- the number of each group.
SELECT COUNT(*) as reservation_count, customer_id
FROM reservation
GROUP BY customer_id;

-- We can now JOIN against the customer table to get more info.
SELECT COUNT(*) as reservation_count, customer_id, customer.first_name
FROM reservation
JOIN customer on customer.id = reservation.customer_id
GROUP BY customer_id, customer.first_name;

-- Let's expand the query a bit to ask: what customers have at least two
-- reservations? We need to ask the SQL engine to give us that same info
-- but filter for just rows with a count greater than 2. So perhaps we try
-- a WHERE clause:
SELECT COUNT(*) AS reservation_count, customer_id, customer.first_name
FROM reservation
JOIN customer on customer.id = reservation.customer_id
GROUP BY customer_id, customer.first_name
WHERE COUNT(*) >= 2;

-- Sadly we get a syntax error, because WHERE _does not_ know how to deal
-- with aggregate functions.
-- WHERE -> used to filter _attributes_
-- HAVING -> used alongside GROUP BY to filter _aggregate functions_
SELECT * FROM customer;
SELECT COUNT(*) FROM customer;

SELECT COUNT(*) AS reservation_count, customer_id, customer.first_name
FROM reservation
JOIN customer on customer.id = reservation.customer_id
GROUP BY customer_id, customer.first_name
HAVING COUNT(*) >= 2; -- NOTE: Use the aggregate function, not the renamed column name.

-- Help me answer the following questions:
-- Provide info on all hotels with any rooms they may have.
SELECT * FROM hotel;
INSERT INTO hotel (name)
VALUES ('La Quinta');

SELECT * FROM hotel
RIGHT OUTER JOIN room ON room.hotel_id = hotel.id;

-- Provide the number of reservations at Hampton Inn & Suites
SELECT * FROM hotel
WHERE name = 'Hampton Inn & Suites';
SELECT COUNT(*) FROM hotel
WHERE hotel.name = 'Hampton Inn & Suites';
SELECT * FROM reservation;

SELECT COUNT(*) FROM reservation
JOIN hotel ON reservation.hotel_id = hotel.id
WHERE hotel.name = 'Hampton Inn & Suites';



SELECT COUNT(*)
FROM reservation
JOIN hotel ON reservation.hotel_id = hotel.id
WHERE hotel.name = 'Hampton Inn & Suites';

-- Provide the number of reservations and hotel name across all hotels
SELECT COUNT(*), h.name
FROM reservation
JOIN hotel h on h.id = reservation.hotel_id
GROUP BY h.name;


SELECT COUNT(*), hotel.name
FROM reservation
JOIN hotel on hotel.id = reservation.hotel_id
GROUP BY hotel.id;

-- Suppose we want to answer the question: give me all customers that
-- have no reservations in my system.
-- There could be some JOIN-fu that we do, but that could get messy.
-- Another way to phrase the question: out of all the customers, provide
-- me a list of the customers with ID's that do not appear in the reservation
-- table.
-- Well to begin, let's find out how to gather the ID's that ARE in the reservation table.
SELECT DISTINCT(customer_id)
FROM reservation;

-- So we know that data, and now we want to select all customers WHERE the ID
-- is NOT IN that list. Hint: look at the capitalized words!
-- This is the first case we're nesting queries together (note the indentation):
SELECT * FROM customer
WHERE id NOT IN (
    SELECT DISTINCT (customer_id)
    FROM reservation
);

-- WHERE id NOT IN is expecting a list of values. You can consider a "list" of
-- values as a table of 1 column. The SQL engine will work from the "inside-out",
-- so it will run the inner query (the one on reservation) first, and THEN use
-- the result in the outer query (the one on customer).

-- If the results of one query depend on the results
-- of another, then use a nested query. If the results of a query depend on combining
-- data across relations, then use a JOIN. It can be hard to determine whether a query
-- falls into one category or another. It just takes practice!

