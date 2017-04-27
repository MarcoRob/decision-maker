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
var selectedPages = [];
var listNodes = [];
routes.post('/selected', (req, res) => {
    console.log(req.body);
    if(req.body.selectedCat && req.body.selectedPages) {
        selectedCtg = req.body.selectedCat;
        selectedPages = req.body.selectedPages;
    }
    res.end();
});


routes.get('/selectedOptions', (req, res) => {
    if(selectedCtg && selectedPages ) {
        mongoClient.connect(mongoUri, (err, db) => {
            assert.equal(null, err);    
            if(err) {
                console.log("Opps! Error");
            } else {
                console.log("Connected successfully to Mongo server - Options");
                db.collection('nodeData').find({'category': {'$in':selectedCtg}, 
                                    'pagegraph':{'$in':selectedPages}}).toArray((err, data) => {
                    if(err) {
                        throw err;
                    } else {
                        console.log(data.length);
                        if(data.length <= 0) {
                            console.log(data);
                            res.send(data[0]);
                        } else {
                            for(var node=0; node<data.length; node++) {
                                if(data[node]) {
                                    console.log(data[node].idNode);
                                    listNodes.push(data[node].idNode);
                                }
                            }
                            res.send(data);
                        }
                    }
                });
            }
        });
    }
});

routes.get('/test', (req, res) => {
    let edges = [];
    for(let node of listNodes) {
        mongoClient.connect(mongoUri, (err, db) => {
            assert.equal(null, err);    
            if(err) {
                console.log("Opps! Error");
            } else {
                console.log("Connected successfully to Mongo server - Edges Subgraph");
                db.collection('edgeData').find({'v1':node}).toArray( (err, data) => {
                    if(err) {
                        throw err;
                    } else {
                        for(let i of data) {
                            if(data[i]) {
                                edges.push({v1:data[i].v1, v2:data[i].v2});
                            }
                        }
                        
                    }

                })
            }
        });
    }
    res.send(edges);
    
});

routes.get('/pagenames', (req, res) => {
    mongoClient.connect(mongoUri, (err, db) => {
        assert.equal(null, err);    
        if(err) {
            console.log("Opps! Error");
        } else {
            console.log("Connected successfully to Mongo server");
            db.collection('pageData').find().toArray( (err, data) => {
                if(err) {
                    throw err;
                } else {
                    let pages = [];
                    for(var i=0; i<data.length; i++) {
                        pages.push(data[i].page);
                    }
                    res.send(pages);
                }
            })
        }
    });
});

var pages = [];
routes.post('/file', upload.single('txt'), (req, res) => {
    //res.send(req.body);
   /* if(req.body.pagename) {
        let pagesname = req.body.pagename;
        pages.push(pagesname);
        Graph.insertPages(pages);
        //pagenames[req.body.pagename] = pagenames[req.body.pagename] || {};
        console.log(pages);
    }*/
    if(req.file && req.body.pagename) {
        let pages = req.body.pagename;
        Graph.insertPages(pages);
        //pagenames[req.body.pagename] = pagenames[req.body.pagename] || {};
        console.log(pages);
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
                        datanode.push({'node':data[i].idNode, 'category':data[i]['category']});
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
                    let dataedge = [];
                    for(var i=0; i<data.length; i++) {
                        dataedge.push({'id': data[i]._id, edge:{'v1':data[i].v1, 'v2':data[i].v2}});
                    }
                    res.send(dataedge);
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

var influyentNode = [];
routes.post('/pagerank', (req, res) => {
    let nodes = [];
    
});

routes.get('/mostInfluyentNode', (req, res) => {

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

