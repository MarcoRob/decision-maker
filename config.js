
const mongoUri = 'mongodb://localhost/testDta';
const mongoClient = require('mongodb').MongoClient;

const port = process.env.port || '4000';


module.exports = {
        mongoUri,
        mongoClient,
        port,
        host : 'http://127.0.0.1'
}