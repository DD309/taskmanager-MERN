/**
 * main entry point for the backend server application.
 * this file sets up the express server, connects to the mongoDB database,
 * configures middleware, and defines the API routes.
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//
require('dotenv').config();

//start the express application
const app = express();
//use the host, or 5000.
const port = process.env.PORT || 5000;

// --- Middleware Configuration ---

//allow requests from the frontend domain.
app.use(cors());
//nable the express app.
app.use(express.json());


// --- Database Connection ---

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})


// --- API Route Definitions ---

//import the route handlers for users and tasks.
const usersRouter = require('./routes/users');
const tasksRouter = require('./routes/tasks');

//request to '/users' will be handled by the usersRouter.
app.use('/users', usersRouter);
//request to '/tasks' will be handled by the tasksRouter.
app.use('/tasks', tasksRouter);


// --- Server Initialization ---
//start the serve, listen for incoming requests
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});