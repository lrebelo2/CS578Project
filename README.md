# architecture-wizards
CSCI 578 Project

Ryan Chase
Negar Abolhassani
Lucas Rebelo
Vahagen Sinanian

Scrolling the page, three tools are available for visualzations:

1. Structure Visualization

1.1. Generating Input: The input for this tool is a JSON file containing the information of the source code. To generate a JSON file from a system's code. We used a Java code which is available as structure.jar. This jar file go over the directories and files of a system starting from a path given to it from the input. It also uses dependencies.rsf file to find class dependencies. The jar file aslo accepts file extentions to consider those file types and ignore other file types. 

The command to run the jar file is:

	java -jar structure.jar {path to the root directory}[mandatory] {path to the dependencies.rsf file}[mandatory] {system's name}[mandatory] {specific file formats}[optional]

For example:

To run the jar file to consider all files: 

	java -jar structure.jar /Users/negar/Desktop/chukwa-0.3.0/build/chukwa /Users/negar/Desktop/chukwa-0.3.0_deps.rsf chukwa-0.3.0 

To run the jar file to consider specific files: 

	java -jar structure.jar /Users/negar/Desktop/chukwa-0.3.0/build/chukwa /Users/negar/Desktop/chukwa-0.3.0_deps.rsf chukwa-0.3.0 .js .java .class

The output of this jar file is a JSON file named {system's name}_struct.json

1.2. Generate the graph: After preparing the input file, on the page click on choose file and select the generated file or any other struct.json file. Then, submit to see the graph. 

1.3. Reading the graph: The black node is the root node. If the mouse pointer moves onto a node some information is displayed.

Directory nodes display : name and total LOC of their children

General file nodes display: name and LOC of that file 

Class file nodes display: name, LOC of that file, number of dependers, number of dependees

Clicking on each node, the visualization starts from that node. That node becomes the root node and a smaller visualization will be displayed.

1.4 Reseting the graph: Anytime while working with the graph, you can click on the reset button to revert to the intial state.

2. Dependencies Visualization

3. Clusters Visualization

This application should be placed on local server to prevent cross domain issue. Since it is reading json files from a local folder. Apache servers are preinstalled on MAC OS.

This application is written in Node.js, make sure your system has Node configured. 

place your ARC, ACDC, and RELAX cluster(s/ed).rsf file into the Load directory of the application.

Run the project.js file from the command line with  "> node project.js" command through terminal to generate the JSON files.

Now files are ready to be visualized, check the webpage. Before generating the visualization, you should select the target system and the recovery method using the file input and drop down menu.
