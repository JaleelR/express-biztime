
const express = require("express");
const app = express();
const ExpressError = require("./expressError");
//middleware that parses json 
app.use(express.json());

const uRoutes = require("./routes/companies");
const uRoutes2 = require("./routes/invoices");
app.use("/companies", uRoutes);
app.use("/invoices", uRoutes2);

/** 404 handler */

app.use(function (req, res, next) {
    const err = new ExpressError("Not Found", 404);
    return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
    res.status(err.status || 500);

    return res.json({
        error: err,
        message: err.message
    });
});

module.exports = app;
/*
Create routes/companies.js with a router in it.
 DONE -touch companies.js

All routes in this file should be found under companies/.
const uRoutes = require(./wherever routes is found)
 -app.use("/companies", uRoutes)
All routes here will respond with JSON responses. These responses will be in an object format where the value is the data from the database.
DONE
So, for example, the “get list of companies should return”:
{companies: [{code, name}, ...]}

Assuming result is the result from your query, you could produce this with a line like:

return res.json({companies: result.rows})
DONE These routes need to be given data in JSON format, not the standard “url-encoded form body” — so you’ll need to make sure that your app.js includes the middleware to parse JSON. */