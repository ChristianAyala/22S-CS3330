const express = require('express');

/**
 * https://expressjs.com/en/guide/routing.html#express-router
 * 
 * A router is a special Express object that can be used to define how to route and manage
 * requests. We configure a router here to handle a few routes specific to students
 */
const router = express.Router();

// Note: we don't specify `/students`, just `/`. The association to `/students` happens
// in the root index.js file
router.get('/', async (req, res, next) => {
    // Route handlers are often this straightforward. Take in a request, call a couple functions,
    // and then provide the response
    const allStudents = await req.models.student.fetchAllStudents();
    res.json(allStudents);
    next();
});

module.exports = router;

