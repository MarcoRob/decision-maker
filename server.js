const express = require('express');
const mongo = require('mongodb').MongoClient;
import route from './api/index';
const bodyParser = require('body-parser');
const server = express();
const port = require('./config').port;

server.use(bodyParser.json());
server.use(express.static('./public'));
//server.set('views', './views');
server.set('view engine', 'ejs');


server.get('/', function (req, res) {
  res.render('index');
});

server.use('/api', route);

server.listen(port, () => {
    console.log("Listening in port ", port);
});
