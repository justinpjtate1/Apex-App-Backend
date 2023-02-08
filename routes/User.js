// Require necessary NPM Packages
const express = require('express');

// Require Mongoose Model for Article
const User = require('./../models/User');

// Instantiate a Router (mini app that only handles routes)
const router = express.Router();