# Graphviz
You can generate a visual reppresentation of a graph with [Graphviz](https://graphviz.org/).  
Install requirements:
```
!apt-get install graphviz graphviz-dev
!pip install pygraphviz
```

The graph must be in a csv file with ```\t``` delimiter.  

Run with: 
```python graphviz.py <graph> ```  

Example:
```
!python graphviz.py exp_graph_1_en.csv
```
will generate a pdf file named exp_graph_1_en.pdf with the reppresentation of the graph.