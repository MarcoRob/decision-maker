const fs = require('fs');
const mongoClient = require('../config').mongoClient;
const assert = require('assert');
const mongoUri = require('../config').mongoUri;//'mongodb://localhost/testDta';


var graphParse = function (fileName, pagegraph) {
    //var node_data = '';
    fs.readFile(fileName, (err, data) => {
        if(!err) {
            console.log('reading file ...');
           let dataArray = [];
           dataArray = data.toString().split('\n');
           if(dataArray[0].split('>')[0] != 'nodedef') {
               throw 'Error, No graph file detected';
           } 
           let properties = [];
           let arr = dataArray[0].split('nodedef>')[1].split(',');
           for(var i=0; i<arr.length; i++) {
                properties.push(arr[i]);
           }
           /* -------------- Getting  Nodes ------------------------*/
           let i = 1;
           
           let nodes = [];
           while(dataArray[i].slice(0, 7) != 'edgedef') {
               let nodeData = {};
               let fieldValues = [];
                   fieldValues = dataArray[i].split(',');
               for(var j=0; j<properties.length; j++) {
                   /*if(fieldValues[j] != '' || fieldValues[j]) {
                        fieldValues[j] = j*5;
                   }*/
                   if (properties[j] == 'name VARCHAR') {
                        nodeData.idNode = fieldValues[j];
                   } else if (properties[j] == 'category VARCHAR') {
                        nodeData.category = fieldValues[j];
                   } else if (properties[j] == 'link VARCHAR') {
                        nodeData.link = fieldValues[j];
                   } else {
                        nodeData[properties[j]] = fieldValues[j];
                   }
                   nodeData.pagegraph = pagegraph;
               }
               nodes.push(nodeData);
               //insertNodes(nodeData);
               //break;
               //console.log(nodeData);
               i++;
           }
           insertNodes(nodes);
           /*-------------- Getting Edges -----------------------*/
           
           let edges = [];
           for (var x = ++i; x < dataArray.length; x++) {
                let edgesData = {};
                let edgeValues = dataArray[x].split(",");
                edgesData.v1 = edgeValues[0];
                edgesData.v2 = edgeValues[1];
                //console.log(edgesData);
                edges.push(edgesData);
			}
            insertEdges(edges);
        }
    });

    //return node_data;
}

var insertNodes = (dataArr) => {
    mongoClient.connect(mongoUri, (err, db) => {
        assert.equal(null, err);    
        if(err) {
            console.log("Opps! Error");
        } else {
            console.log("Connected Mongo Server - Insert Nodes");
            db.collection('nodeData').insertMany(dataArr, (err, res) => {
                if(err) { //console.error(err);
                    throw err;
                } 
                console.log('Nodes data inserted');
            })
        }
    });
};

var insertPages = (page) => {
    mongoClient.connect(mongoUri, (err, db) => {
        assert.equal(null, err);    
        if(err) {
            console.log("Opps! Error");
        } else {
            console.log("Connected Mongo Server - FB Pages");
            db.collection('pageData').insert({'page':page}, (err, res) => {
                if(err) { //console.error(err);
                    throw err;
                } 
                console.log('Pages names data inserted');
            })
        }
    });
};

var insertEdges = (dataArr) => {
    mongoClient.connect(mongoUri, (err, db) => {
        assert.equal(null, err);    
        if(err) {
            console.log("Opps! Error");
        } else {
            console.log("Connected Mongo Server - Edges Nodes");
            db.collection('edgeData').insertMany(dataArr, (err, res) => {
                if(err) {
                    //console.error(err);
                    throw err;
                } 
                console.log('Edges data inserted');
            })
        }
    });
};

// Apply some filter to categories
var applyFilterCategories = (ctgs) => {
    var categories = [];
	var duplicated = false;
    if(ctgs) {
        for(var ctg of ctgs) {
            if(ctg) {
                for (var cat of categories) {
                    if (cat.substr(0, 4) == ctg.substr(0,4)) {
                        duplicated = true;
                        break;
                    }
                }
                if (ctg.charAt(0) != ' ' && !duplicated) {
                    categories.push(ctg);
                } 
                duplicated = false;
            }
        }
        categories.sort();
    }
    
    return categories;
}

var addAtribute = (label, value, node) => {
    mongoClient.connect(mongoUri, (err, db) => {
        assert.equal(null, err);    
        if(err) {
            console.log("Opps! Error");
        } else {
            console.log("Connected Mongo Server - Insert Nodes");
            db.collection('nodeData').findAndModify({node : 'idNode'}, null, {label: value}, (err, res) => {
                if(err) { //console.error(err);
                    throw err;
                } 
                console.log('');
            });
        }
    });
};

// Pagerank Algorithm
var pagerank = (nodes, nodesOut) => {
    //let nodes = [];
    let pageranks = [];
    let cardinality = [];

    for(let i=0; i<nodes.length; i++) {
        pageranks[i] = 0.00;
        cardinality[i] = getAllEdges(nodes[i], nodesOut).length;
    }
    let maxIter = 0;
    let previous = 0;
    do {
        for(let i=0; i<nodes.length; i++) {
            pageranks[i] = 0.15 + 0.85 * sumRanks(pointedBy(nodes, nodes[i]), pageranks, cardinality, i);
            previous = (i == 0 ? pageranks[i] : previous);
        }
    } while(++maxIter < 100);

    for(let i=0; i < nodes.length; i++) {
        
    }

    return pagerank;
};
/* Return the list of the nodes pointed to a specific node
   Params:
    nodes - Array of nodes
    node - Specific node that are pointed by the nodes
*/
var getAllEdges = (node, nodesEnd) => {
    return mongoClient.connect(mongoUri, (err, db) => {
        assert.equal(null, err);    
        if(err) {
            console.log("Opps! Error");
        } else {
            console.log("Connected successfully to Mongo server");
            db.collection('edgeData').find({'v1':node, 'v2':{'$in':nodesEnd}}).toArray( (err, data) => {
                if(err) {
                    throw err;
                } else {
                    let edges = [];
                    for(let i of data) {
                        if(data[i]) {
                            edges.push(data[i].v1);
                        }
                    }
                    return edges;
                }

            })
        }
    });
};

var getAllNodes = () => {
    return mongoClient.connect(mongoUri, (err, db) => {
        assert.equal(null, err);    
        if(err) {
            console.log("Opps! Error");
        } else {
            console.log("Connected successfully to Mongo server");
            db.collection('nodeData').find().toArray( (err, data) => {
                if(err) {
                    throw err;
                } else {
                    return (data);
                }
            })
        }
    });
}

var pointedBy = (nodes, node) => {
    let list = [];
    for(let i=0; i < nodes.length; i++) {
        for(let pointed of getAllEdges(nodes[i])) {
            if(pointed == node) {
                list.push(i);
            }
        }
    }
    return list;
};
// Apply the sum of the ranks 
/* Params: 
    nodes - Array of nodes
    ranks - Array of the ranks in pagerank
    card - Array of cadinalities in pagerank
*/
var sumranks = (nodes, ranks, card) => {
    let ranksSum = 0;
    for(let node of nodes) {
        if(card[node] != 0) {
            ranksSum += (ranks[node]/card[node]);
        }
    }
    return ranksSum;
};

var maxPageRank = () => {
    let maxNode = getAllNodes()[0];
    for(let node of getAllNodes()) {
        maxNode = node.pagerank > maxNode.pagerank ? node : maxNode;
    }
    return maxNode;
};

Array.prototype.contains = function(name) {  
  let i = this.length;
  while (i--) {
    if (this[i].name === name) {
      return true;
    }
  }
  return false;
};

function Node(name) {  
  this.edge_list = [];
  this.name = name;
};

Node.prototype.addEdge = function(end) {  
  this.edge_list.push(end);
};

function Graph() {  
  this.node_list = [];
};

Graph.prototype.addEdge = function(start, end) {  
  const first = this.node_list.contains(start);
  const second = this.node_list.contains(end);

  if(first){
    //get start node
    var i = this.node_list.length;
    while (i--) {
      if (this.node_list[i].name === start) {
        this.node_list[i].addEdge(end);
        break;    
      }
    }
  }
  if(second){
    //get end node
    i = this.node_list.length;
    while (i--) {
      if (this.node_list[i].name === end) {
        this.node_list[i].addEdge(start);
        break;    
      }
    }
  }

  if( (!first) || (!second) ){
    if( !first ){
      const node = new Node(start);
      node.addEdge(end);
      this.node_list.push(node);
    }
    if( !second ){
      const node = new Node(end);
      node.addEdge(start);
      this.node_list.push(node);
    }
  } 
};

Graph.prototype.printNodes = function() {  
  for(var i = 0;i < this.node_list.length;i++){
    console.log(this.node_list[i].name +":");
    console.log(this.node_list[i].edge_list);
  }
};


module.exports = {Graph, graphParse, maxPageRank, pagerank, applyFilterCategories, insertPages};