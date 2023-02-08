// Require the necessary NPM packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Require the Authentication packages
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Require our db config file
const db = require('./config/db');

// Establish db connection
mongoose.connect(db, { useNewUrlParser: true } );
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

// Require passport strat + opt

// Rounds of salting

// Require route files
const generalChatRouter = require('./routes/GeneralChat');
const userRouter = require('./routes/User');
const weaponRouter = require('./routes/Weapon');

// Instantiate express app obj
const app = express();

// Define the port for the api to run on
const port = process.env.PORT || 5001;
const reactPort = 3000;

// Middleware

app.use(express.json());

// Set up CORS headers
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || `http://localhost:${reactPort}`
  }));

// Define our auth strategy from before

// Routes
// Mount imported Routers
app.use(generalChatRouter);
app.use(userRouter);
app.use(weaponRouter);

// Authentication

// Start the server and listen for requests on the given port
app.listen(port, () => {console.log(`blogy is listening on port ${port}`)});