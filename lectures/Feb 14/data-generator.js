const fs = require('fs');
const random = new (require('chance'));
const dateFns = require('date-fns');

const entityCount = {
    locations: 10,
    vehicles: 100,
    customers: 100,
    serviceDepartments: 20,
    employees: 60,
    reservations: 600,
    transactions: 2000,
    maintenanceHistories: 500,
    employeeMaintenances: 2000,
}

const mixins = {
    location: (options = {}) => ({
        id: random.integer({ min: 1, max: 100000 }),
        name: `Location ${random.word()}`,
        ...options
    }),
    vehicle: (options = {}) => ({
        vin: random.string({ symbols: false, length: 15 }),
        make: random.word(),
        model: random.word(),
        color: random.color(),
        ...options,
    }),
    customer: (options = {}) => ({
        id: random.integer({ min: 1, max: 100000 }),
        first_name: random.first(),
        last_name: random.last(),
        ...options,
    }),
    serviceDepartment: (options = {}) => ({
        id: random.integer({ min: 1, max: 100000 }),
        name: `Service Dept ${random.word()}`,
        ...options,
    }),
    employee: (options = {}) => ({
        id: random.integer({ min: 1, max: 100000 }),
        first_name: random.first(),
        last_name: random.last(),
        ...options,
    }),
    reservation: (options = {}) => ({
        id: random.integer({ min: 1, max: 100000 }),
        start_date: dateFns.addDays(new Date(), random.integer({ min: -3, max: 3})),
        end_date: dateFns.addDays(new Date(), random.integer({ min: 4, max: 10 })),
        ...options,
    }),
    transaction: (options = {}) => ({
        id: random.integer({ min: 1, max: 100000 }),
        amount: random.floating({ min: -100, max: 100 }),
        type: random.pickone(['charge', 'refund']),
        ...options,
    }),
    maintenanceHistory: (options = {}) => ({
        id: random.integer({ min: 1, max: 100000 }),
        maintenance_date: dateFns.addDays(new Date(), random.integer({ min: -7, max: 0})),
        ...options
    }),
    employeeMaintenance: (options = {}) => ({
        ...options
    }),
};

random.mixin(mixins);

console.log('Generating base entities');
const locations = random.n(random.location, entityCount.locations);
const customers = random.n(random.customer, entityCount.customers);

console.log('Generating vehicles, service_departments, and employees');
const vehicles = [
    ...random.n(() =>
        random.vehicle({
            location_id: random.pickone(locations).id
        }), Math.floor(entityCount.vehicles)),
    ...random.n(random.vehicle, Math.floor(entityCount.vehicles / 4))
];

const serviceDepartments = random.n(() =>
    random.serviceDepartment({
        location_id: random.pickone(locations).id
    }), entityCount.serviceDepartments);

const employees = random.n(() => 
    random.employee({
        service_department_id: random.pickone(serviceDepartments).id
    }), entityCount.employees
);

console.log('Generating reservations');
const reservations = random.n(() =>
    random.reservation({
        vehicle_id: random.pickone(vehicles).vin,
        customer_id: random.pickone(customers).id
    }), entityCount.reservations
);
const transactions = random.n(() =>
    random.transaction({
        reservation_id: random.pickone(reservations).id,
    }), entityCount.transactions
);

console.log('Generating maintenance history');
const maintenanceHistories = random.n(() =>
    random.maintenanceHistory({
        vehicle_id: random.pickone(vehicles).vin,
        service_department_id: random.pickone(serviceDepartments).id
    }), entityCount.maintenanceHistories
);

const employeeMaintenances = random.n(() => 
    random.employeeMaintenance({
        employee_id: random.pickone(employees).id,
        maintenance_history_id: random.pickone(maintenanceHistories).id
    }), entityCount.employeeMaintenances
);

console.log('Creating base entities SQL');
const locationSQL = `INSERT INTO location (id, name) VALUES ${locations.map(location => `(${location.id}, '${location.name}')`).join(',\n')};`;
const customerSQL = `INSERT INTO customer (id, first_name, last_name) VALUES ${customers.map(customer => `(${customer.id}, '${customer.first_name}', '${customer.last_name}')`).join(',\n')};`;

console.log('Creating next batch of entities');
const vehicleSQL = `INSERT INTO vehicle (vin, make, model, color, location_id) VALUES ${vehicles.map(vehicle => `('${vehicle.vin}', '${vehicle.make}', '${vehicle.model}', '${vehicle.color}', ${vehicle.location_id ?? 'NULL'})`).join(',\n')};`;
const serviceDepartmentSQL = `INSERT INTO service_department (id, name, location_id) VALUES ${serviceDepartments.map(sd => `(${sd.id}, '${sd.name}', ${sd.location_id})`).join(',\n')};`;
const employeeSQL = `INSERT INTO employee (id, first_name, last_name, service_department_id) VALUES ${employees.map(e => `(${e.id}, '${e.first_name}', '${e.last_name}', ${e.service_department_id})`).join(',\n')};`;

console.log('Creating reservations');
const reservationSQL = `INSERT INTO reservation (id, vehicle_id, customer_id, start_date, end_date) VALUES ${reservations.map(r => `(${r.id}, '${r.vehicle_id}', '${r.customer_id}', '${dateFns.format(r.start_date, 'MM-dd-yyyy')}', '${dateFns.format(r.end_date, 'MM-dd-yyyy')}')`).join(',\n')};`;
const transactionSQL = `INSERT INTO transaction (id, reservation_id, amount, type) VALUES ${transactions.map(t => `(${t.id}, ${t.reservation_id}, ${t.amount}, '${t.type}')`).join(',\n')};`;

console.log('Creating maintenance histories');
const maintenanceSQL = `INSERT INTO maintenance_history (id, vehicle_id, service_department_id, maintenance_date) VALUES ${maintenanceHistories.map(mh => `(${mh.id}, '${mh.vehicle_id}', ${mh.service_department_id}, '${dateFns.format(mh.maintenance_date, 'MM-dd-yyyy')}')`).join(',\n')};`;
const empMaintenanceSQL = `INSERT INTO employee_maintenance (employee_id, maintenance_history_id) VALUES ${employeeMaintenances.map(em => `(${em.employee_id}, ${em.maintenance_history_id})`).join(',\n')};`;

console.log('Bundling them all together now');
const finalSQL = [
    locationSQL,
    customerSQL,
    vehicleSQL,
    serviceDepartmentSQL,
    employeeSQL,
    reservationSQL,
    transactionSQL,
    maintenanceSQL,
    empMaintenanceSQL
].join('\n\n');

console.log('Writing it out to file');
fs.writeFileSync('./generated-sql.sql', finalSQL);

console.log('All done!');
