var graphlib = require("graphlib")

const parse = require('csv-parse')
const fs = require('fs') 

const delimiter = "\t"

var graphName

var graph = new graphlib.Graph({ directed: true });


class Label {
    constructor(label, value) {
      this.value = value
      this.label = label
      this.object = {}
    }
  }

function graphToObject(graph){
  if(!graphlib.alg.isAcyclic(graph)){
    var cycles = graphlib.alg.findCycles(graph)
    //console.log(cycles)
    var message = ""
    for(cycle in cycles){
      message = message + cycles[cycle] + "\n"
    }
    throw("Explanation graph has one or more cycles:\n"+message)
  }
  var nodes = graphlib.alg.postorder(graph, graphName)
  //console.log(nodes)
  /* var json = {}
  var f = false */
  for (n in nodes){
    //console.log(graph.node(nodes[n]))
    //console.log(graph.successors(nodes[n]))
    //console.log(graph.successors(nodes[n]).length)
    
    if(graph.successors(nodes[n]).length != 0){
      //console.log(graph.node(nodes[n]))
      //this is object
      var children = graph.successors(nodes[n])
      /* if(f){
        console.log(children)
        f=false;
      } */
      var obj = {}
      for (child in children){
        //console.log(graph.node(children[child]))
        let label = graph.node(children[child]).label
        let object = graph.node(children[child]).object
        if(!obj.hasOwnProperty(label)){
          obj[label] = object
        }else if(!Array.isArray(obj[label])){
          let tmp = obj[label]
          obj[label] = [tmp, object]
        }else{
          obj[label].push(object)
        }
        //graph.node(children[child]).object = obj
        graph.node(nodes[n]).object = obj
        //console.log(graph.node(nodes[n]))
      }
      //console.log(graph)
    }else{
      graph.node(nodes[n]).object = graph.node(nodes[n]).value
    }
    
  }
  //console.log(graph.node("explanation"))
  var explanation = graph.node(graphName).object
  //console.log(explanation)
  return explanation
}
  
function main(csvPath){
  const data = []
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
    .pipe(parse({ delimiter: delimiter }))
    .on('data', (r) => {
      //console.log(r);
      data.push(r);        
    })
    .on('end', () => {
      //console.log(data);
      count = 0;
      graphName = data[0][0]
      
      var a = data[0]
      
      for (d of data){
        d[0] = d[0].toLowerCase()
        //d[1] = d[1].toLowerCase()
        d[2] = d[2].toLowerCase()
        //from
        if(graph.node(d[0])==null){
        graph.setNode(d[0], new Label(d[0], d[0]))
        }
        
        //to
        //avoid identical numerical nodes and cycles
        if(isNaN(d[2]) && d[0]!=d[2]){
            graph.setNode(d[2], new Label(d[1], d[2]))
            graph.setEdge(d[0], d[2]) 
        }else{
            graph.setNode(count, new Label(d[1], d[2]))
            graph.setEdge(d[0], count) 
            count++
        }
      }


      var e = graphToObject(graph)
      //console.log(e)
      
      resolve(e)
    })
  })
    
}


function test(csvPath){
  var data = []
  fs.createReadStream(csvPath)
    .pipe(parse({ delimiter: delimiter }))
    .on('data', (r) => {
      //console.log(r);
      data.push(r);        
    })
    .on('end', () => {
      //console.log(data);
      count = 0;
      graphName = data[0][0]
      
      var a = data[0]
      
      for (d of data){
        d[0] = d[0].toLowerCase()
        //d[1] = d[1].toLowerCase()
        d[2] = d[2].toLowerCase()
        //from
        if(graph.node(d[0])==null){
        graph.setNode(d[0], new Label(d[0], d[0]))
        }
        
        //to
        //avoid identical numerical nodes and cycles
        if(isNaN(d[2]) && d[0]!=d[2]){
            graph.setNode(d[2], new Label(d[1], d[2]))
            graph.setEdge(d[0], d[2]) 
        }else{
            graph.setNode(count, new Label(d[1], d[2]))
            graph.setEdge(d[0], count) 
            count++
        }
      }


      var e = graphToObject(graph)
      console.log(e)
    })
    
}

module.exports = {main}

//test("graphs/exp_graph_1_it.csv")