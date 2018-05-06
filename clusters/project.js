var FileSystem = require("fs");

var Filename = [];
FileSystem.readdirSync('Load').forEach(file => {
  Filename.push(file);
})

console.log(Filename.length);

for (var k=0; k < Filename.length; k++){
    var splitted = Filename[k].split("_");
    var systemName = splitted[0];
    if(Filename[k].indexOf('arc') > -1 && Filename[k].indexOf('clusters') > -1 ){
        generate(Filename[k], 'ARC', systemName);
    }else if(Filename[k].indexOf('acdc') > -1 && Filename[k].indexOf('clustered') > -1 ){
        generate(Filename[k], 'ACDC', systemName);
    }else if(Filename[k].indexOf('relax') > -1 && Filename[k].indexOf('clusters') > -1){
        generate(Filename[k], 'RELAX', systemName);
    }
}

function generate(path, type, systemName){
FileSystem.readFile('Load/'+path, function(err, data){
    if (err){
        return console.error(err);
    }

    var recovery = {
        name : type,    
     children : []
    }
    
    function childrenData(name) {
       this.name = name;
        this.size = 200 ;
    };
    
    function clusterData(name){
        this.name = name;
        this.children = [];
    };
//defining all the cluster topic types
    var clusterType = [];
    var inputData = data.toString();
    var lineSlice = inputData.split("\n");
    
    for(var i=0; i< lineSlice.length; i++){
        
        var line = lineSlice[i].split(" ");
       
        if(line.length < 3){
            console.log("in ");
            continue;
    }
        if(clusterType.length == 0){
            clusterType.push(line[1]);
            var newcluster = new clusterData(line[1]);
            recovery.children.push(newcluster);
        }else if ( clusterType.length > 0 && clusterType.indexOf(line[1]) == -1){
            clusterType.push(line[1]);
            var newcluster = new clusterData(line[1]);
            recovery.children.push(newcluster);
            
            
        }
    
    }


    
   for(var i = 0; i < lineSlice.length-1; i++){
        var line = lineSlice[i].split(" ");
        var filename = line[2].split("/");
        var size = filename.length;
        
        var temp = new childrenData(filename[size-1]);
      // console.log("value:" + line[1] )
        var index = clusterType.indexOf(line[1]);
       // console.log("index:" + index);
      // console.log(recovery.children);
        recovery.children[index].children.push(temp);
    }
    
    var target = './JSON';
    if (!FileSystem.existsSync(target)){
        FileSystem.mkdirSync(target);
    }
    var json = JSON.stringify(recovery);
    FileSystem.writeFile('JSON/'+systemName+"_"+type+'.json', json, (err)=>{
        if(err){
            return console.error(err);
        }
    });
})
   
    
    
   
    
    
}