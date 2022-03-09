/**
 * In this file we will begin to make our first API using ExpressJS.
 * Express is a fairly minimal web framework built on top of NodeJS, and is
 * designed to make API's quick and easy to define.
 * 
 * To start, here is the documentation for express: https://expressjs.com/.
 * 
 * In an express app, you define "API endpoints". Endpoints are a combination
 * of three primary things:
 * 
 * 1. An HTTP verb (typically GET, POST, PUT, PATCH, or DELETE).
 * 2. A path, typically one or a couple nouns that often map to DB tables
 * 3. A function that gets called when a user makes an API call to the HTTP verb + path combo
 * 
 * One of the first routes that you often make is a "health" route. This should
 * do very little to nothing in terms of functionality. All it should do is
 * respond with some success object, so that you know the app is at least running.
 * In AWS / GCP / Azure, a service will use that health route to make sure your
 * app is deployed successfully.
 * 
 * A health route has the following form:
 * 
 * GET /health
 * 
 * So if my app is running on localhost (your computer) on port 3000, then you
 * can go to the following URL in a browser and see a successful response:
 * 
 * http://localhost:3000/health
 */

const express = require('express');

const app = express();
const port = 3000;

// app.get is a function that builds a GET request.
app.get('/health', (request, response) => {
    const responseBody = { status: 'up', port };
    response.json(responseBody);
});

/**
 * If a simple GET /health doesn't work, then your server won't work for more
 * complex operations.
 */

/**
 * API = Application Programming Interface. Imagine you're a browser, phone app,
 * desktop app, or some other device that wants to pull data from some central
 * server. There can be many layers to get from the browser to the DB:
 * 
 * browser -> internet -> Virtual Private Cloud -> Load Balancer -> EC2 -> RDS DB
 * 
 * And back again. Much of that is network routing that you don't have to worry
 * about right now. So let's simplify the model to the following:
 * 
 * Browser -> EC2 (running an express app) -> RDB DB running postgres / mysql
 * 
 * When a browser asks for data, it makes an HTTP REST API call.
 * HTTP REST API = HyperText Transport Protocol Representative State Transfer Application Programming Interface.
 * HTTP = The protocol that defines how network calls are transported
 * REST = Defines what you're asking for, and what action you want to take with that data
 * API = A known set of interfaces that a client (e.g. browser) can use to CRUD data
 * 
 * The browser should almost NEVER have SQL. A front-end client should ONLY communicate
 * with a backend server with these known API's. The back-end server knows how to translate
 * a request like GET /students into a (possibly complex) SQL query, and provide results
 * in a consistent format (often JSON, or JS objects).
 * 
 * So in the case of the students DB, let's start easy. I am a professor using a web app,
 * and would like to fetch all students. So a reasonable request would be:
 * 
 * GET /students
 * 
 * This request should query the DB for all students, and provide a response. Let's do that
 * now.
 */
const connectToDatabase = require('./database-helpers');

app.get('/students', async (request, response) => {
    try {
        console.log('Initiating GET /students request');
        const { DBQuery, disconnect } = await connectToDatabase();
        const results = await DBQuery('SELECT * FROM student');
        disconnect();
        response.json(results);
    } catch (err) {
        console.error('There was an error in GET /students', err);
        response.status(500).json({ message: err.message });
    }
});

/**
 * Couple important bits here:
 * - It's standard to create a connection to a DB, then query, then disconnect.
 * - We catch an error, log it, and then return a 500 error code.
 * - A GET /students request provides a list of students in js object form (in this case, an array)
 * 
 * There are many HTTP status codes. Here are the most frequently seen ones,
 * and you can go here to see them all: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * 
 * Codes starting with 2xx are "success responses"
 * - 200: Success. Often has a request body with more info, but not always.
 * - 201: Successfully created resource (used often with POST requests). Also often has a body.
 * - 204: Sucess, but no body. Sometimes seen with DELETE's to show a successful deletion
 * 
 * Codes starting with 4xx are "client errors". The server was able to take in the request,
 * but something about the client REST call led to some error.
 * - 400: Bad Request. Something about the request was malformed, or in a format the server doens't understand.
 * - 401: Unauthorized. The user needs to authenticate themselves and try again
 * - 403: Forbidden. The user is authenticated, but is not allowed to access this resource
 * - 404: Not Found: Either the route doesn't exist, or you're accessing a resource that doesn't exist
 * - 409: Conflict. The request would cause some internal conflict, such as trying to create resources with duplicate primary key ID's
 * 
 * Codes starting with 5xx are "server errors". The server had an exception and the route failed.
 * - 500: Internal Server Error: Some application-level code failed, usually some try / catch.
 * - 502: Bad Gateway. The server took in the request but gave an invalid response or error
 * - 504: Timeout Error: The server took too long to respond. Usually it's a 1 minute timeout.
 *        Sometimes it's because the logic just takes too long, or the server is down and not responding.
 */

/**
 * We know to fetch all of a given resource. When we want to fetch a single specific resource,
 * then the client needs to tell the server what _kind_ of resource it wants, followed by the
 * identifier of the resource. So the route looks like this:
 * 
 * GET /students/:id
 * 
 * The last :id tells express that the value after the second slash is a string that will be stored
 * in a value called id. We would expect that if a request comes in like GET /students/3, then
 * we should get a response with ONLY a student with an id of 3
 */

 app.get('/students/:id', async (request, response) => {
    try {
        console.log('Initiating GET /students/:id request');
        console.log('Request params is an object containing:', request.params);
        // Extract the id from the request parameters
        const id = request.params.id;
        
        const { DBQuery, disconnect } = await connectToDatabase();
        // Add a WHERE clause to fetch that particular student
        const results = await DBQuery('SELECT * FROM student WHERE id = ?', [id]);
        disconnect();
        response.json(results);
    } catch (err) {
        console.error('There was an error in GET /students/:id', err);
        response.status(500).json({ message: err.message });
    }
});

/**
 * Suppose we want to fetch an arbitrary number of students, but also provide
 * some sort of text filtering (e.g. by first name). The route continues to be:
 * 
 * GET /students
 * 
 * because we are still fetching a list of students. However, REST API calls support
 * adding what are known as _query parameters_. These allow a user to _query_ for
 * resources that match a given condition. Note that this is slightly different
 * than fetching by ID. When fetching by ID, the resource is _known_, and thus merits
 * its own route. When fetching by a query, the resource is _unknown_, so we apply
 * a query parameter to the general GET all resources.
 * 
 * Let's implement a route that handles the following:
 * 
 * GET /students?name=Chris
 */
 app.get('/students', async (request, response) => {
    try {
        console.log('Initiating GET /students request');
        console.log('Request query arguments is an object containing:', request.query);
        const name = request.query.name;
        const { DBQuery, disconnect } = await connectToDatabase();
        let results;
        if (name) {
            results = await DBQuery('SELECT * FROM student WHERE name = ?', [name]);
        } else {
            results = await DBQuery('SELECT * FROM student');
        }
        disconnect();
        response.json(results);
    } catch (err) {
        console.error('There was an error in GET /students', err);
        response.status(500).json({ message: err.message });
    }
});

/**
 * You can specify any number of query params, separated by ampersands (&).
 * The route above would also handle something like:
 * 
 * GET /students?name=Chris&age=30
 * 
 * Which would map to some front-end form that allows for both name and age filtering.
 * You would have to update the route handler to be sure to account for any and all
 * filters
 * 
 * Now let's make a request to support adding a student to the database. The route
 * would look like:
 * 
 * POST /students
 * 
 * POST here means "create a resource". The /students part clearly shows what kind of resource
 * we aim to create. If we want to create a new professor, then it would be:
 * 
 * POST /professors
 * 
 * Even though we are creating a single student / professor in the routes above, we continue
 * to pluralize routes due to convention.
 * 
 * The route is expecting not only the verb / noun combo, but since we're creating a student
 * record, the student data must come in as a part of the _body_ or _payload_ of the request.
 * Express doesn't know how to parse payload bodies on its own. Instead, it uses the concept
 * of _middleware_, which is a set of functions that runs on every request. We can tell express
 * to use a body-parser middleware library, which knows how to do that for us.
 */

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.post('/students', async (request, response) => {
    try {
        console.log('Initiating POST /students request');
        console.log('Request has a body / payload containing:', request.body);
        const payload = request.body; // This payload should be an object containing student data
        const { DBQuery, disconnect } = await connectToDatabase();
        const results = await DBQuery('INSERT INTO student(name) VALUES (?)', [payload.name]);
        console.log('Results of my INSERT statement:', results);
        
        // the results object contains an insertId, which tells us what the ID is of the newly
        // created record. Let's load that record now and pull the full object to provide a
        // good response body
        const newlyCreatedRecord = await DBQuery('SELECT * FROM student WHERE id = ?', [results.insertId]);
        disconnect();
        response.status(201).json(newlyCreatedRecord); // 201 status = resource created
    } catch (err) {
        console.error('There was an error in POST /students', err);
        response.status(500).json({ message: err.message });
    }
});

/**
 * Now that we know how to fetch and create new records, it would be great to know how to
 * update a record. Perhaps a student changed their name, or any number of other attributes.
 * An API request to do that would be the following:
 * 
 * PUT /students/:id
 * 
 * PUT here means "update a resource", and since we want to target an update to a specific _known_
 * record, we pass in the id as a param like we did earlier. Again, this has to come from the
 * front-end somewhere, so this route should support a payload as well. It will look very similar
 * to our POST request, but with an UPDATE query instead of an INSERT.
 */

 app.put('/students/:id', async (request, response) => {
    try {
        console.log('Initiating PUT /students/:id request');
        console.log('Request has a body / payload containing:', request.body);
        console.log('Request has params containing:', request.params);
        
        const payload = request.body; // This payload should be an object containing update student data
        const id = request.params.id; // And pull the ID from the request params

        const { DBQuery, disconnect } = await connectToDatabase();
        const results = await DBQuery('UPDATE student SET name = ? WHERE id = ?', [payload.name, id]);
        console.log('Results of my UPDATE statement:', results);
        
        // Since we already know the id we're looking for, let's load the most up to date data
        const newlyCreatedRecord = await DBQuery('SELECT * FROM student WHERE id = ?', [id]);
        disconnect();
        response.json(newlyCreatedRecord);
    } catch (err) {
        console.error('There was an error in PUT /students', err);
        response.status(500).json({ message: err.message });
    }
});

/**
 * The last thing we need to do is to support deleting records. Again, this is typically a specific
 * action / record we want to delete, so a DELETE route usually has this form:
 * 
 * DELETE /students/:id
 * 
 * Since we delete a record, there's no need for a response. The server just acknowledges that the
 * deletion was successful with a 204 status code.
 */

 app.delete('/students/:id', async (request, response) => {
    try {
        console.log('Initiating DELETE /students/:id request');
        console.log('Request has params containing:', request.params);
        
        const id = request.params.id;

        const { DBQuery, disconnect } = await connectToDatabase();
        const results = await DBQuery('DELETE FROM student WHERE id = ?', [id]);
        console.log('Results of my UPDATE statement:', results);
        
        disconnect();
        response.status(204).end(); // End the request with a 204 status and no response body
    } catch (err) {
        console.error('There was an error in PUT /students', err);
        response.status(500).json({ message: err.message });
    }
});

/**
 * That outlines the four main operations of CRUD:
 * Create -   POST /resource
 * Read   -    GET /resource      or GET /resource/:id
 * Update -    PUT /resource/:id
 * Delete - DELETE /resource/:id
 * 
 * And with express, we can very quickly define these routes and interact with a database
 */

app.listen(port, () => {
    console.log(`This app is listening on port ${port}`);
});
