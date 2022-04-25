const express = require('express');
const bodyParser = require('body-parser');

// Import any route handlers here.
const usersRoutes = require('./routes/users');
const sessionRoutes = require('./routes/session');

// Import any middleware here
const { authenticateJWT, authenticateWithClaims } = require('./middleware/auth');

// Start by defining the express app instance
const app = express();
const port = 3000;

// On every request, this gets called first. This is the first step in our "middleware chain".
// We put this before anything else because we know our route handlers are going to need connections
// to the database
app.use(bodyParser.json());

// Add a health route. Note the new argument: next
app.get('/health', (request, response, next) => {
    const responseBody = { status: 'up', port };
    response.json(responseBody);
    // next() is how we tell express to continue through the middleware chain
    next();
});

app.use('/session', sessionRoutes);


// For any route that starts with `/users`, use the route handler here
// app.use('/students', authenticateJWT, usersRoutes);
// app.use('/students', authenticateWithClaims(['professors', 'student']), usersRoutes);
app.use('/students', usersRoutes);

// Now that we've configured the app, make it listen for incoming requests
app.listen(port, () => {
    console.log(`This app is listening on port ${port}`);
});
