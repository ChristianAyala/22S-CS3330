## March 21 Lecture: A more fleshed out Express app

This directory contains a more fleshed out Express app with more emphasis on application structure.
There are a few more files + folders now:

-- index.js                 # Entrypoint for the express app. Registers routes and middleware.
-- routes/                  # Folder for any route handlers
    -- student.js           # Route handlers for anything related to students endpoints (e.g. GET /students)
    -- professor.js         # Route handlers for anything related to professors endpoints (e.g. POST /professors)
-- models/                  # Folder for any model files
    -- student.js           # Model for a student, manages the student table in my DB
    -- professor.js         # Model for a professor, manages the professor table in my DB
    -- database-helpers.js  # Miscellaneous helper functions that are used to interact with the DB
-- middleware               # Any custom express middleware that we write goes here
    -- model-middleware.js  # Middleware that sets up a connection to a database

It's not QUITE an MVC app, since all we really have are views (routes) interacting with models
directly. But you can imagine having a `controllers/` directory that contains intermediate
controllers.