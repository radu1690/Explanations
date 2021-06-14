import pygraphviz as pgv
import csv
import pdb
import sys

G = pgv.AGraph(directed=True)
exp_graph_path = sys.argv[1]
#exp_graph_path="rep.csv"


with open(exp_graph_path) as csv_file:
  csv_reader = csv.reader(csv_file, delimiter='\t')
  for row in csv_reader:
    print(row)
    G.add_edge(row[0], row[2], label=row[1])

G.layout(prog='dot')
G.draw(f'{exp_graph_path.split(".")[0]}.pdf')