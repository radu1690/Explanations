var rosaenlgPug = require('rosaenlg');
var pluralize = require('pluralize')
var graph2Object = require("./graphToObject")

var language// = 'en';  //en or it
var conseq_language// = 'cons_en' //cons_en or cons_it
var rosae_language// = 'en_US' //en_US or it_IT

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomElement(items){
    if(Array.isArray(items)){
        return items[Math.floor(Math.random()*items.length)]
    }else{
        return items
    }
    
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

function main(){
    //arguments: 2: pugTemplate (.pug), 3: explanationGraph (.csv delimiter with ','), 4: language (english or italian, defualt english)
    const args = process.argv;
    //console.log(args);

    var dir_template = args[2];
    var dir_explanationGraph = args[3];

    const fs = require('fs');

    /* try{
        var template = fs.readFileSync(dir_template);
    }catch(e){
        console.log("Template file not found ("+dir_template)+")";
        return;
    } */
    
    
    //console.log(explanationGraph);
    //console.log(template.toString());
    setLanguage(args[4])
    
    

    graph2Object.main(dir_explanationGraph)
    .then(data =>{
        var output = rosaenlgPug.renderFile(dir_template, {
            language: rosae_language,
            explanation: data,
            pluralize: pluralize,
            random: randomElement
        });
        //console.log(data)
        //console.log(data.entity)
        //console.log(data.entity.negative)
        //console.log(data.entity.alternatives)
        console.log(output)
    })
    .catch(err => console.error(err))
}

main()