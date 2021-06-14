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
Template is the location of the pug template while graph is a graph in csv format (with "," as delimiter). Example:  
```
node explanations.js templates/english/argument.pug graphs/exp_graph_1_en.csv
``` 
  
You can specify the language, English or Italian (the default is English), like in the following example:  
```
node explanations.js templates/italian/feedback.pug graphs/exp_graph_1_it.csv italian
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
The object passed to RosaeNLG (after the graph has been processed) is an explanation. The following is the object generated from graphs/exp_graph_1_en.csv:
```
{
  timestamp: '1541622487915',
  startTime: '1541440506117',
  endTime: '1541622487915',  
  quantity: '3',
  expectedQuantity: '2',     
  priority: '1',
  level: '3',
  history: '1',
  explanationId: 'explanation_1yfzqe9kjrdmm0sc349qj3x7loeal6tzw7amlhhphpl5z78051_mr-diet-018-nweek_1541622487915',
  user: '1yfzqe9kjrdmm0sc349qj3x7loeal6tzw7amlhhphpl5z78051',
  ruleId: 'mr-diet-018-nweek',
  entityType: 'foodcategory',
  entity: {
    enLabel: 'red meat',
    negative: [
        {   enLabel: 'animal protein', 
            cons_en: [ 'intestinal inflammation', 'the increment of cancer risk' ] 
        },
        {   enLabel: 'animal lipids',
            cons_en: [
                'increment of cardiovascular disease risk',
                'increment of cholesterol in the blood'
            ]
        }
    ],
    alternatives: [ { enLabel: 'processed legumes' }, { enLabel: 'fish' } ]
  },
  timing: 'week',
  meals: [ 'meal-meal-1541440506117', 'meal-meal-1541440506118' ],
  goals: 'sp-goal-d-114',
  constraint: 'less'
}
```
To print a field, you write ```#[+value(explanation.field)]``` or ```!{explanation.field}```. For example, the value of explanation.entity.enLabel is "red meat":  
```
|You ate #[+value(explanation.entity.enLabel)].
```
will output: ```You ate red meat.```  

```#[+value(explanation.field)]``` will throw an error if the field is undefined while ```!{explanation.field}``` will print an empty string.

## Conditionals
If-else statements are used like in the following example where _entity.enLabel=meat_ and _constraint=less_:
```
if explanation.constraint == 'greater'
	|You ate too much,
	|enough 
else 
	|You did not eat enough,
	|more
|#[+value(explanation.entity.enLabel)]!
```  
will output: ```You ate too much, enough meat!```  
Note that to use an explanation field in an if-else statement you must not use the ```#[+value()]``` or the ```!{}``` notation.  

## Javascript code and Functions
You can write javascript code in a template by starting the line with the "```-```" character,for example here i declare two variables and then I use them in the template:
```
- let nutrient = "cheese"
- let food = "pie"

|the !{food} contains a lot of !{nutrient}
```
This will output ```The pie contains a lot of cheese```
### Pluralize
You can use ```pluralize.isSingular()``` and ```pluralize.isPlural()``` in a template to check if a word is either singular or plural. Example:  
```
if pluralize.isSingular(explanation.entity)
	|contains
else
	|contain
```  
This will output ```contains``` if the entity field is singular or ```contain``` if the entity field is plural.  

### Random
The random function will return a random element of an array (if the argument is an array) or the argument if it is not an array.  
```
- let nutrient = random(explanation.entity.negative)
- let consequence = random(nutrient.cons_en)
```

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


