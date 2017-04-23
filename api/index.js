const express = require('express');
const axios = require('axios');
const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const mongoUri = 'mongodb://localhost/testDta';
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest : 'public/upload/'});
const routes =  express.Router();
// ---- Graph Methods ----- //
const Graph = require('./graph');

//Get all info of Nodes Collection
routes.get('/all', (req, res) => {
    mongoClient.connect(mongoUri, (err, db) => {
        assert.equal(null, err);    
        if(err) {
            console.log("Opps! Error");
        } else {
            console.log("Connected successfully to Mongo server");
            db.collection('nodeData').find().toArray( (err, data) => {
                if(err) { 
                    throw err;
                } else {
                    let datanode = [];
                    for(var i=0; i<data.length; i++) {
                        //hashmap??
                        datanode.push([data[i]]);
                    }

                    res.send(datanode);
                }
            })
        }
    });
});

var selectedCtg = [];
routes.post('/selected', (req, res) => {
    console.log(req.body);
    if(req.body.selectedCat) {
        selectedCtg = req.body.selectedCat;
    }
    res.end();
});
routes.get('/getSelectedCategories', (req, res) => {
    if(selectedCtg.length > 0) {
        res.send(selectedCtg);
    } else {
        res.send(['Internet Company', 'Library']);
    }
});
routes.get('/selectedCategories', (req, res) => {
    //Graph.getCategories(selectedCtg);
    //let name = 'Computer Company';
    mongoClient.connect(mongoUri, (err, db) => {
        assert.equal(null, err);    
        if(err) {
            console.log("Opps! Error");
        } else {
            console.log("Connected successfully to Mongo server");
            db.collection('nodeData').find({'category': { '$in':selectedCtg}}).toArray((err, data) => {
                if(err) {
                    throw err;
                } else {
                    if(data) {
                        console.log(data);
                        res.send(data);
                    }
                }
            });
        }
    });
    
});

routes.get('/pagenames', (req, res) => {
    res.send(pagenames);
});

let pagenames = {};

routes.post('/file', upload.single('txt'), (req, res) => {
    //res.send(req.body);
    if(req.body.pagename) {
        pagenames[req.body.pagename] = pagenames[req.body.pagename] || {};
        console.log(pagenames);
    }
    if(req.file && req.body.pagename) {
        console.log('Uploaded');
        const {path, originalname} = req.file;
        Graph.graphParse(path, req.body.pagename);
    } else {
        console.log('Not Uploaded');
        //res.end('File not uploaded');
    }
    res.redirect('/');
});
// Get all the categories without any filter from the database
routes.get('/categories', (req, res) => {
    mongoClient.connect(mongoUri, (err, db) => {
        assert.equal(null, err);    
        if(err) {
            console.log("Opps! Error");
        } else {
            console.log("Connected successfully to Mongo server");
            db.collection('nodeData').find().toArray( (err, data) => {
                if(err) {
                    throw err;
                } else {
                    let datanode = [];
                    for(var i=0; i<data.length; i++) {
                        if(datanode) {
                            if(datanode.indexOf(data[i]['category']) == -1) {
                                datanode.push(data[i]['category']);
                            }
                        }
                    }
                    //console.log(datanode);
                    res.send(Graph.applyFilterCategories(datanode));
                }
            })
        }
    });
});

//Get nodes with categories
routes.get('/nodes', (req, res) => {
    mongoClient.connect(mongoUri, (err, db) => {
        assert.equal(null, err);    
        if(err) {
            console.log("Opps! Error");
        } else {
            console.log("Connected successfully to Mongo server");
            db.collection('nodeData').find().toArray( (err, data) => {
                if(err) {
                    throw err;
                } else {
                    let datanode = [];
                    for(var i=0; i<data.length; i++) {
                        datanode.push({'node':data[i].idNode, 'category':data[i]['category VARCHAR']});
                    }
                    res.send(datanode);
                }
            })
        }
    });
});

//Get edges
routes.get('/edges', (req, res) => {
    mongoClient.connect(mongoUri, (err, db) => {
        assert.equal(null, err);    
        if(err) {
            console.log("Opps! Error");
        } else {
            console.log("Connected successfully to Mongo server");
            db.collection('edgeData').find().toArray( (err, data) => {
                if(err) {
                    throw err;
                } else {
                    let datanode = [];
                    for(var i=0; i<data.length; i++) {
                        datanode.push({'v1':data[i].v1, 'v2':data[i].v2});
                    }
                    res.send(datanode);
                }
            })
        }
    });
});

// Get node by ID
routes.get('/nodes/:id', (req, res) => {
    var nodeId = req.params.id;
    mongoClient.connect(mongoUri, (err, db) => {
        assert.equal(null, err);    
        if(err) {
            console.log("Opps! Error");
        } else {
            console.log("Connected successfully to Mongo server");
            db.collection('nodeData').findOne({'idNode':nodeId}, (err, data) => {
                if(err) {
                    throw err;
                } else {
                    console.log(data);
                    var dataNode = {};
                    dataNode.label = data['label VARCHAR'];
                    dataNode.category = data['category'];
                    dataNode.fbpage = data['link'];
                    dataNode.node = data.pagegraph;
                    dataNode.xc = data.category;
                    res.send(dataNode);
                }
            });
        }
    });
});

routes.post('/pagerank', (req, res) => {
    let nodes = [];
    axios.get('/api/nodes')
        .then(resp => {
            nodesresp.data
        })
});

/*routes.get('/graph', (req, res) => {
    const graph = new Graph();  
    graph.addEdge("start", "end");  
    graph.addEdge("start", "finish");  
    graph.addEdge("here", "there");  
    graph.addEdge("up", "down");  
    graph.printNodes();  
});*/

export default routes;

