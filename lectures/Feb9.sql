CREATE DATABASE vehicle_rentals;

-- Customer
-- Vehicle
-- Location
-- Service Department
-- Employee
-- Reservation
-- Transaction
-- Maintenance History

CREATE TABLE location (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE vehicle (
    vin VARCHAR(30) PRIMARY KEY,
    make VARCHAR(30),
    model VARCHAR(30),
    color VARCHAR(30),
    location_id INTEGER REFERENCES location(id)
);

CREATE TABLE customer (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30)
);

CREATE TABLE service_department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30),
    location_id INTEGER REFERENCES location(id)
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    service_department_id INTEGER REFERENCES service_department(id)
);

CREATE TABLE reservation (
    id SERIAL PRIMARY KEY,
    vehicle_id VARCHAR(30) REFERENCES vehicle(vin),
    customer_id INTEGER REFERENCES customer(id),
    start_date DATE,
    end_date DATE
);

CREATE TABLE transaction (
    id SERIAL PRIMARY KEY,
    reservation_id INTEGER REFERENCES reservation(id),
    amount FLOAT,
    type VARCHAR(30)
);

CREATE TABLE maintenance_history (
    id SERIAL PRIMARY KEY,
    vehicle_id VARCHAR(30) REFERENCES vehicle(vin),
    service_department_id INTEGER REFERENCES service_department(id),
    maintenance_date DATE
);

CREATE TABLE employee_maintenance(
    employee_id INTEGER REFERENCES employee(id),
    maintenance_history_id INTEGER REFERENCES maintenance_history(id),
    PRIMARY KEY (employee_id, maintenance_history_id)
);

ALTER TABLE service_department
ADD COLUMN location_id INTEGER REFERENCES location(id);


-- What vehicles are in my system?
SELECT * FROM vehicle;

-- What vehicles are in my system? Include the name of the location they are currently
-- parked at. If they are not currently assigned to a location (it is currently rented), I still
-- want to see it in my result set.
SELECT * FROM vehicle
LEFT OUTER JOIN location on vehicle.location_id = location.id;

-- What vehicles belong to Location cew (whatever you may have called it)?
SELECT * FROM location;
SELECT * FROM location
JOIN vehicle v on location.id = v.location_id
WHERE location.id = 50970;

SELECT * FROM vehicle
JOIN location l on vehicle.location_id = l.id
WHERE l.name = 'Location cew';

SELECT * FROM vehicle
WHERE vehicle.location_id = 50970;

-- Give me the reservation history for Vehicle 1. This should include the vehicle info and the
-- customer info, but not the transaction info.
SELECT * FROM reservation;
SELECT * FROM reservation
JOIN vehicle v on reservation.vehicle_id = v.vin
WHERE vin = 'wtwiTLTBn)P&38x';

SELECT v.*, reservation.*, c.first_name FROM reservation
JOIN vehicle v ON reservation.vehicle_id = v.vin
JOIN customer c ON reservation.customer_id = c.id
WHERE vin = 'wtwiTLTBn)P&38x';

-- Provide the transactions for Reservation 1.
SELECT * FROM reservation;
SELECT * FROM transaction
JOIN reservation r on transaction.reservation_id = r.id
WHERE reservation_id = 51409;
SELECT * FROM transaction
WHERE reservation_id = 51409;
SELECT * FROM transaction;

SELECT SUM(amount) FROM transaction
WHERE reservation_id = 51409;

-- Provide the net amount of money that has been tracked in the system
SELECT SUM(amount) FROM transaction;

-- Provide the maintenance history for Vehicle 1
SELECT * FROM vehicle;
SELECT * FROM maintenance_history
WHERE vehicle_id = '3k$e0je!yyZqiC@';
SELECT * FROM maintenance_history;

-- Provide the names of all the employees who have provided service on Vehicle 1.
SELECT * FROM employee_maintenance
JOIN employee e on employee_maintenance.employee_id = e.id
JOIN maintenance_history mh on employee_maintenance.maintenance_history_id = mh.id
WHERE vehicle_id = '3k$e0je!yyZqiC@';


TRUNCATE TABLE employee_maintenance CASCADE ;
TRUNCATE TABLE maintenance_history CASCADE;
TRUNCATE TABLE transaction;
TRUNCATE TABLE reservation CASCADE ;
TRUNCATE TABLE employee CASCADE ;
TRUNCATE TABLE service_department CASCADE ;
TRUNCATE TABLE customer CASCADE ;
TRUNCATE TABLE vehicle CASCADE ;
TRUNCATE TABLE location CASCADE ;
