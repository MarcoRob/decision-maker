const fs = require('fs');
const axios = require('axios');
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
                   if(properties[j] == 'name VARCHAR') {
                        nodeData.idNode = fieldValues[j];
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
            console.log("Connected successfully to Mongo server");
            db.collection('nodeData').insertMany(dataArr, (err, res) => {
                if(err) {
                    //console.error(err);
                    throw err;
                } 
                console.log('Nodes data inserted');
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
            console.log("Connected successfully to Mongo server");
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
    for(var ctg of ctgs) {
        console.log(ctg);
        for (var cat of categories) {
            console.log(cat.substr(0,4) + ", " + ctg.substr(0,4));
            if (cat.substr(0, 4) == ctg.substr(0,4)) {
                duplicated = true;
                break;
            }
        }
        if (ctg.charAt(0) != ' ' && !duplicated) categories.push(ctg);
        duplicated = false;
            //ct += ctg + '<br/>';
    }
    categories.sort();
    return categories;
}


var pagerank = () => {

    return pagerank;
};

var sumranks = (nodes, ranks, card) => {

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


module.exports = {Graph, graphParse, pagerank, applyFilterCategories};