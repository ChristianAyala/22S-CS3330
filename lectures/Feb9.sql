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
    name VARCHAR(30)
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