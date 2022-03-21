const express = require('express');

// Import any route handlers here.
const studentRoutes = require('./routes/student');

// Import any middleware here
const { createModelsMiddleware, disconnectFromDatababaseMiddleware } = require('./middleware/model-middleware');

// Start by defining the express app instance
const app = express();
const port = 3000;

// On every request, this gets called first. This is the first step in our "middleware chain".
// We put this before anything else because we know our route handlers are going to need connections
// to the database
app.use(createModelsMiddleware);

// Add a health route. Note the new argument: next
app.get('/health', (request, response, next) => {
    const responseBody = { status: 'up', port };
    response.json(responseBody);
    // next() is how we tell express to continue through the middleware chain
    next();
});

// For any route that starts with `/students`, use the route handler here
app.use('/students', studentRoutes);

// The last step of a request middleware chain is to disconnect from the DB.
app.use(disconnectFromDatababaseMiddleware);

// Now that we've configured the app, make it listen for incoming requests
app.listen(port, () => {
    console.log(`This app is listening on port ${port}`);
});
