var jsonQuery = require('json-query')
var fs = require('fs')
var rosaenlgPug = require('rosaenlg');
var pluralize = require('pluralize')

var FoodCategoryList = JSON.parse(fs.readFileSync('resources/FoodCategoryList.json',{encoding:'utf8', flag:'r'})); 
var NutrientList = JSON.parse(fs.readFileSync('resources/NutrientList.json',{encoding:'utf8', flag:'r'})); 
var consequences = JSON.parse(fs.readFileSync('resources/consequences.json',{encoding:'utf8', flag:'r'})); 
var properties = JSON.parse(fs.readFileSync('resources/properties.json',{encoding:'utf8', flag:'r'})); 

var language// = 'en';  //en or it
var conseq_language// = 'cons_en' //cons_en or cons_it
var rosae_language// = 'en_US' //en_US or it_IT
//label della entity
var entity_label;

//nutrienti positivi senza label
var raw_negative = [];
//nutrienti negativi senza label
var raw_positive = [];
//alternative senza label
var raw_alternatives = [];

//nutrienti positivi con label
var label_negative = [];
//nutrienti negativi con label
var label_positive = [];
//alternative con label
var label_alternatives = [];

//consequence positive (array a due dim)
var conseq_positive = [];
//consequence negative (array a due dim)
var conseq_negative = [];


function getLabel(entity){
    let query = entity+'[langCode='+language+'].label'
    //console.log(query)
    var label = jsonQuery(query, {
        data: FoodCategoryList
    })
    return label.value;
}

function getPositive(entity){
    let query = entity+'.positive';
    var label = jsonQuery(query, {
        data: properties
    })
    return label.value;
}

function getNegative(entity){
    let query = entity+'.negative';
    var label = jsonQuery(query, {
        data: properties
    })
    return label.value;
}

function getAlternatives(entity){
    let query = entity+'.alternatives';
    var label = jsonQuery(query, {
        data: properties
    })

    //per qualche motivo quando viene chiamato da server.js non prende Suggestion

    /* if(label.value!=null){
        if(!label.value[label.value.length-1].localeCompare('Suggestion')){
            label.value.pop();
        }
    } */
    return label.value;
}

function getEntityLabels(array){
    var toReturn = [];
    for(i = 0; i<array.length; i++){
        let entity = array[i];
        let query = entity+'[langCode='+language+'].label'
        //console.log(query)
        var label = jsonQuery(query, {
            data: NutrientList
        })
        if(label.value!=null){
            toReturn.push(label.value);
        }else{
            array.splice(i,1);
            i--;
        }
    }
    return toReturn;
}

function getAlternativeLabels(array){
    var toReturn = [];
    for(i = 0; i<array.length; i++){
        let entity = array[i];
        let query = entity+'[langCode='+language+'].label'
        //console.log(query)
        var label = jsonQuery(query, {
            data: FoodCategoryList
        })
        if(label.value!=null){
            toReturn.push(label.value);
        }else{
            array.splice(i,1);
            i--;
        }
        //toReturn.push(label.value);
    }
    return toReturn;
}

function getConsequences(raw_array, label_array){
    var toReturn = [];
    for(i = 0 ; i<raw_array.length; i++){
        let nutrient = raw_array[i];
        let query = nutrient+'.'+conseq_language;
        var label = jsonQuery(query, {
            data: consequences
        })
        if(label.value!=null && label.value.length!=0){
            //console.log('adding: '+ raw_array[i]);
            toReturn.push(label.value);
            
        }else{
            //console.log('splicing: '+ raw_array[i]);
            raw_array.splice(i,1)
            label_array.splice(i,1)
            i--;
        }
    }
    
    
    return toReturn;
}

function toLowerArray(array){
    for(i=0; i<array.length; i++){
        array[i].toLowerCase();
    }
    return array;
}
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function reset(){
    entity_label='';
    raw_negative = [];
    raw_positive = [];
    raw_alternatives = [];
    
    label_negative = [];
    label_positive = [];
    label_alternatives = [];
    
    conseq_positive = [];
    conseq_negative = [];
}

function setLanguage(lang){
    language = 'en';  
    conseq_language = 'cons_en' 
    rosae_language = 'en_US' 
    if(lang!=null){
        if (!lang.localeCompare('italian')){
            language = 'it';  
            conseq_language = 'cons_it' 
            rosae_language = 'it_IT' 
        }else if(lang.localeCompare('english')){
            console.log('Language ' + lang + ' is not supported')
            console.log("Defualt English set")
        }
    }
}

function processGraph(input_graph){
    var entity = input_graph.entity;
    //console.log(getLabel(entity));
    entity_label = getLabel(entity);
    if(entity_label==null){
        //return ['entity not found', 'entity not found', 'entity not found'];
        //console.log("Entity not found in FoodCategoryList.json")
        throw("Entity not found in FoodCategoryList.json");
    }
    raw_positive = getPositive(entity);
    raw_negative = getNegative(entity);
    raw_alternatives = getAlternatives(entity);
    
    label_positive = getEntityLabels(raw_positive);
    label_negative = getEntityLabels(raw_negative);
    label_alternatives = getAlternativeLabels(raw_alternatives);
    
    conseq_positive = getConsequences(raw_positive, label_positive);
    conseq_negative = getConsequences(raw_negative, label_negative);
    
    entity_label = entity_label.toLowerCase();
    input_graph.entity = entity_label;
    for(i=0; i<label_positive.length; i++){
        label_positive[i] = label_positive[i].toLowerCase();
    }
    for(i=0; i<label_negative.length; i++){
        label_negative[i] = label_negative[i].toLowerCase();
    }
    for(i=0; i<label_alternatives.length; i++){
        label_alternatives[i] = label_alternatives[i].toLowerCase();
    }
    
    /* console.log('Raw positive:');
    console.log(raw_positive);
    console.log('Raw negative:');
    console.log(raw_negative);
    console.log('Raw alternatives:');
    console.log(raw_alternatives);
    
    console.log('Food: '+entity_label);
    console.log('Positive nutrients:');
    console.log(label_positive);
    console.log('Negative nutrients:');
    console.log(label_negative);
    console.log('Alternatives:');
    console.log(label_alternatives);
    console.log('Positive consequences:');
    console.log(conseq_positive);
    console.log('Negative consequences:');
    console.log(conseq_negative); */
    
    
    if(!input_graph.constraint.localeCompare('greater')){
        //positive
        if(label_positive.length==0){
            input_graph.nutrient='null';
            input_graph.consequence='null';
        }else{
            let index = random(0, label_positive.length-1);
            input_graph.nutrient=label_positive[index];
            let c_index = random(0, conseq_positive[index].length-1);
            input_graph.consequence=conseq_positive[index][c_index];
        }
        
    }else if(!input_graph.constraint.localeCompare('less')){
        //negative
        if(label_negative.length==0){
            input_graph.nutrient='null';
            input_graph.consequence='null';
        }else{
            let index = random(0, label_negative.length-1);
            input_graph.nutrient=label_negative[index];
            let c_index = random(0, conseq_negative[index].length-1);
            input_graph.consequence=conseq_negative[index][c_index];
        }
    }
    
    if(label_alternatives.length==0){
        input_graph.alternative='null';
    }else{
        let index = random(0, label_alternatives.length-1);
        input_graph.alternative = label_alternatives[index];
    }
    return input_graph;
}

function main(){
    //arguments: pugTemplate -> 2, explanationGraph -> 3, language -> 4 (defualt english)
    const args = process.argv;
    //console.log(args);

    var dir_template = args[2];
    var dir_explanationGraph = args[3];

    const fs = require('fs');

    try{
        var template = fs.readFileSync(dir_template);
    }catch(e){
        console.log("Template file not found ("+dir_template)+")";
        return;
    }
    
    try{
        var raw_explanationGraph = fs.readFileSync(dir_explanationGraph);
    }catch(e){
        console.log("Explanation graph not found ("+dir_explanationGraph+")")
        return;
    }
    
    var explanationGraph = JSON.parse(raw_explanationGraph);
    //console.log(explanationGraph);
    //console.log(template.toString());
    setLanguage(args[4])
    
    var processedGraph = (processGraph(explanationGraph));
    //console.log(processedGraph);

    var output = rosaenlgPug.renderFile(dir_template, {
        language: rosae_language,
        explanation: processedGraph,
        pluralize: pluralize
    });

    console.log(output);
    return output;

}

main()