// Create db name for mongoDB
const mongooseDBName = 'apexLegendsApp';

// Create the MongoDB URI for Development and Test
const db = {
    dev: `mongodb://localhost:27017/${mongooseDBName}-development`,
    test: `mongodb://localhost:27017/${mongooseDBName}-test`
}

// Id if dev env is used is dev or test
// Select a db based on whether a text file was executed before server.js
const chosenEnv = process.env.TESTENV ? db.test: db.dev;

// Env var MONGODB_URI available in Heroku production env. otherwise use Test of Dev env
const currentDB = process.env.MONGODB_URI || chosenEnv;

// Export
module.exports = currentDB;