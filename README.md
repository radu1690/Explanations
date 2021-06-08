# ExplanationsGraph
This is a simple program that retrieves the information from an explanation graph and uses [RosaeNLG](https://rosaenlg.org/) and [Pug templates](https://pugjs.org/) to generate text.  

## Installation
Clone the repository and install dependecies
```
git clone https://github.com/radu1690/Explanations.git
npm install
```

## Run
You can run the program with:  
```
node explanations.js <template> <graph>
``` 
Template is the location of the pug template while graph is a graph in json format. Example:  
```
node explanations.js templates/english/argument.pug graphs/explanationGraph.json
``` 
  
You can specify the language, English or Italian (the default is English), like in the following example:  
```
node explanations.js templates/italian/feedback.pug graphs/explanationGraph.json italian
```  

# Basic Tutorial for Templates
## Plain text
To insert some plain text you can use the pipe character (`|`) followed by the text you want to write:  
```
|Hello world!
```
will output: ```Hello world!```

Spaces between different plain texts (except only punctuation) are automatically inserted, so:
```
|Hello
|world
|!
```
will still output: ```Hello world!``` 

## Variables  
The object passed to RosaeNLG (after the graph has been processed) is an explanation and has the following fields:
```
"entity", //name of the food
"timing", //time interval (Week or Day)
"quantity", 
"expectedQuantity",
"constraint", //greater or less
"nutrient",
"consequence",
"alternative"
```
To print a field, you write ```!{explanation.field}```. For example, if nutrient is "vitamin d":  
```
|This dish contains !{explanation.entity}.
```
will output: ```This dish contains vitamin d.```

## Conditionals
If-else statements are used like in the following example where _entity=meat_ and _constraint=less_:
```
if explanation.constraint == 'less'
	|You ate too much,
	|enough 
else 
	|You did not eat enough,
	|more
|!{explanation.entity}!
```  
will output: ```You ate too much, enough meat!```  
Note that to use an explanation field in an if-else statement you must not use the ```!{}``` notation.  

## Functions
You can also use javascript functions in a template. With this program you can use ```pluralize.isSingular()``` and ```pluralize.isPlural()``` in a template to check if a word is either singular or plural. Example:  
```
if pluralize.isSingular(explanation.entity)
	|contains
else
	|contain
```  
This will output ```contains``` if the entity field is singular or ```contain``` if the entity field is plural.  

You can also add your own functions to pug (this is explained bellow in the RosaeNLG tutorial)  

For other advanced features in Pug you can check the [Pug main website](https://pugjs.org/).  

# RosaeNLG tutorial
A complete tutorial with advanced features can be found [here](https://rosaenlg.org/rosaenlg/3.0.0/tutorials/tutorial_en_US.html)
## Import library
```
var rosae = require('rosaenlg');
```  

## Usage
```
var output = rosae.renderFile(dir_template, {
        language: 'en_US',
        explanation: processedGraph,
        pluralize: pluralize
    });
```
```dir_template``` is the location of the pug template.  
```language``` is the locale code of the language to be used by RosaeNLG.  
The rest are data (objects or arrays) and functions to be used in the template. Here I pass the function ```pluralize``` and the object called ```processedGraph``` in my js file which will be accessible as ```!{explanation}``` in the template.  

## Functions example
If I want to use my own function from the template which for example will print the input text two times, I can do it like this:
### JS file
```
var rosae = require('rosaenlg');

function customFunction(input){
    text = input + " " + input
    return text
}

console.log( rosae.renderFile('testNLG.pug', {
    language: 'en_US',
    data: ['apples', 'bananas', 'apricots'],
    double : customFunction
}) );
```  
### PUG template testNLG.pug
```
|!{double(data[0])}
```  
This will output: ```Apples apples```. 


