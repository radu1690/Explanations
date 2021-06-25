var rosaenlgPug = require('rosaenlg');
var pluralize = require('pluralize')
var graph2Object = require("./graphToObject")

var rosae_language//en_US or it_IT


function randomElement(items){
    if(Array.isArray(items)){
        return items[Math.floor(Math.random()*items.length)]
    }else{
        return items
    }
}

function setLanguage(lang){
    rosae_language = 'en_US' 
    if(lang!=null){
        if (!lang.localeCompare('italian')){
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

    var dir_template = args[2]; //pug template
    var dir_explanationGraph = args[3]; //csv graph

    //console.log(explanationGraph);
    //console.log(template.toString());
    setLanguage(args[4])
    
    

    graph2Object.main(dir_explanationGraph)
    .then(data =>{
        //console.log(data)
        //console.log(data.entity)
        //console.log(data.entity.negative)
        //console.log(data.entity.alternatives)
        var output = rosaenlgPug.renderFile(dir_template, {
            language: rosae_language,
            explanation: data,
            pluralize: pluralize,
            random: randomElement
        });
        console.log(output)
    })
    .catch(err => console.error(err))
}

main()