function constructCodeFlower(selector) {
    clean(0, selector);
    var currentCodeFlower;
    var createCodeFlower = function (json) {
        // update the jsonData textarea
        //document.getElementById('jsonData').value = JSON.stringify(json);
        // remove previous flower to save memory
        if (currentCodeFlower) currentCodeFlower.cleanup();
        // adapt layout size to the total number of elements
        var total = countElements(json);
        var len = Math.min(parseInt(Math.sqrt(total) * 30, 10), 800);
        w = parseInt(len, 10);
        h = parseInt(len, 10);
        // create a new CodeFlower
        currentCodeFlower = new CodeFlower("#here", "#info", w, h).update(json);
    };
    var res = null;
    document.getElementById("bttn").addEventListener('click', function (e) {
        d3v3.select("#here").html("");
        var file = document.getElementById("fileInput").files[0];
        console.log(file);
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                res = JSON.parse(reader.result);
                createCodeFlower(res);
            }
            reader.readAsText(file);
        } else {
            alert("File not supported!");
        }
    });

    document.getElementById('reset').addEventListener('click', function () {
        clean(0, selector);
        createCodeFlower(res);
    });

}


function constructSVGDepWheel(selector) {
    clean(1, selector);

    document.getElementById("bttn").addEventListener('click', function (e) {
        var file = document.getElementById("fileInput").files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var db = buildDB(reader.result);
                buildDepWheel(db, selector);
            }
            reader.readAsText(file);
        } else {
            alert("File not supported!");
        }
    });
    // document.getElementById('reset').addEventListener('click', function () {
    //     clean(1, selector);
    // });
}

function buildDB(r) {
    var lines = r.trim(" ").split("\n");
    var db = [];
    var max = 0;
    for (x in lines) {
        if (lines[x].split(" ").length == 3) {
            var splitX = lines[x].split(" ");
            if (splitX[0] == "depends") {
                var first = splitX[1].split(".");
                var second = splitX[2].split(".");
                var idx1 = 0;
                var idx2 = 0;
                var maxAbstractionDepth = Math.max(first.length, second.length);
                if (maxAbstractionDepth > max) {
                    max = maxAbstractionDepth;
                }
                for (i = 0; i < maxAbstractionDepth; i++) {
                    idx1 = i;
                    idx2 = i;
                    if (first.length < i) {
                        idx1 = first.length - 1;
                    }
                    if (second.length < i) {
                        idx2 = second.length - 1;
                    }
                    var package1 = first.slice(0, idx1 + 1).join(".");
                    var package2 = second.slice(0, idx2 + 1).join(".");
                    if (package1 != package2 && package1 && package2) {
                        if (!db[i]) {
                            db[i] = new Map();
                        } else {
                            if (!db[i].has(package1)) {
                                db[i].set(package1, new Map());
                                db[i].get(package1).set(package2, 1);
                            } else {
                                if (!db[i].get(package1).has(package2)) {
                                    db[i].get(package1).set(package2, 1)
                                } else {
                                    db[i].get(package1).set(package2, db[i].get(package1).get(package2) + 1)
                                }
                            }
                        }
                    }
                }
            } else {
                alert("Wrong file type!");
            }
        }
    }
    return db;
}

function buildDepWheel(db, selector) {
//    d3.select("#here").attr("width", "960").attr("height", "960");
    var dataArray = [];
    for (i in db) {
        var data = {};
        var input = db[i];
        var packageNames = new Set();
        if (input) {
            input.forEach(function (value, key) {
                packageNames.add(key);
                value.forEach(function (value, key) {
                    packageNames.add(key);
                });
            });
            var pN = Array.from(packageNames);
            data.packageNames = pN;
            data.matrix = zeros([pN.length, pN.length]);
            pN.forEach(function (key1, idx) {
                //look up each package dependencies
                if (input.has(key1)) {
                    for (var [key2, value] of input.get(key1).entries()) {
                        data.matrix[idx][pN.indexOf(key2)] = value;
                    }
                }
            });
            dataArray.push(data);
        } else {
            alert("No dependencies");
        }
    }
    var slider = document.getElementById("myRange");
    var oldx = 0;
    var display = d3.select("#here");
    slider.oninput = function () {
        var aux = (dataArray.length - 1);
        var x = Math.round((this.value * aux) / 100);
        if (oldx != x) {
            display.selectAll("*").remove().transition().duration(2500).style("opacity", 0);
            display.data([dataArray[x]]).call(d3.chart.dependencyWheel()).transition().duration(2500).styleTween("opacity", function () {
                return d3.interpolate(0, 100);
            });
            oldx = x;
        }
    }
    document.getElementById('reset').addEventListener('click', function () {
        clean(1,selector);
    });

    display.data([dataArray[0]]).call(d3.chart.dependencyWheel());
    //    d3.select("#here").transition().duration(1500).styleTween("opacity", function () {
    //        return d3.interpolate(0, 100);
    //    });
    function zeros(dimensions) {
        var array = [];
        for (var i = 0; i < dimensions[0]; ++i) {
            array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
        }
        return array;
    }
}




function gifMagic(selector) {
    clean(2, selector);
     document.getElementById('reset').addEventListener('click', function () {
         clean(2, selector);
     });
}

function clean(n, selector) {

    var t = document.getElementById(selector)
    while (t.firstChild) {
        t.removeChild(t.firstChild);
    }
    var frame = document.getElementById(selector);
    var myframe = document.getElementById("myframe");
    if (!myframe) {
        var div = frame.appendChild(document.createElement("div"));
        div.setAttribute("id", "myframe");
    }

    if (n == 0 || n == 1) {
        var myframe = document.getElementById("myframe");
        var fileInput = myframe.appendChild(document.createElement("input"));
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("id", "fileInput");
        var button = myframe.appendChild(document.createElement("button"));
        button.innerHTML = "Submit";
        button.setAttribute("id", "bttn");
//        if(n == 0){
//            var button = myframe.appendChild(document.createElement("button"));
//        button.innerHTML = "Reset";
//        button.setAttribute("id", "reset");
//        }
        if (n == 1) {
            var sliderdiv = myframe.appendChild(document.createElement("div"));
            var slider = sliderdiv.appendChild(document.createElement("input"));
            slider.setAttribute("id", "myRange");
            slider.setAttribute("min", "0");
            slider.setAttribute("max", "100");
            slider.setAttribute("value", "0");
            slider.setAttribute("class", "slider");
            slider.setAttribute("type", "range");
            document.getElementById("myRange").value = 0;
        }
        var here = myframe.appendChild(document.createElement("div"));
        here.setAttribute("id", "here");
    } else if (n == 2) {
        var myframe = document.getElementById("myframe");
        var gif = myframe.appendChild(document.createElement("img")); 
        gif.setAttribute("src","clusters.gif");
        gif.setAttribute("width",700);
        gif.setAttribute("height",500);
        gif.onclick = function () {
        location.href = "clusters/cluster.html";
    };
       
    }else{
        var myframe = document.getElementById("myframe");
        var finalWordsDiv = myframe.appendChild(document.createElement("text"));
        finalWordsDiv.innerHTML="Placeholder for final words if we are using it";
    }



}
