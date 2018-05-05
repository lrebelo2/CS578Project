// using d3 for convenience, and storing selected elements
var $container = d3.select('#scroll');
var $graphic = $container.select('.scroll__graphic');
var $chart = $graphic.select('.chart');
var $text = $container.selectAll('.scroll__text');
var $step = $text.selectAll('.step');

// initialize the scrollama
var scroller = scrollama();

function handleResize() { //  resize function to set dimensions on load and page size resize

    var stepHeight = Math.floor(window.innerHeight * 1.75); // 1. update height of step elements 
    $step.style('height', stepHeight + 'px'); //    for breathing room between steps

    var bodyWidth = d3.select('body').node().offsetWidth; // 2. update height of graphic element

    $graphic
        .style('height', window.innerHeight + 'px');

    var chartMargin = 32; // 3. update width of chart by subtracting 
    var textWidth = $text.node().offsetWidth; //     from text width
    var chartWidth = $graphic.node().offsetWidth - textWidth - chartMargin;

    var chartHeight = Math.floor(window.innerHeight * 1); // make the height of 1/2 of viewport

    $chart
        .style('width', chartWidth + 'px')
        .style('height', chartHeight + 'px');

    scroller.resize(); // 4. tell scrollama to update new element dimensions
}

function handleStepEnter(response) { // response = { element, direction, index }

    // scrollama event handlers

    // every step-item needs a way of determing whether or not their index is
    //  the one being looked at. simply check your index vs the one JS is
    //  holding (via response)  
    $step.classed('is-active', function (d, i) { // fade in current step
        return i === response.index;
    });

    var stepData = $step.attr('data-step') // update graphic based on step here
    // ...
    //    0 = structure
    //    1 = dependencies
    //    2 = clusters
    switch (response.index) {
        case 0:
            constructCodeFlower("visualization");
            break;
        case 1:
            constructSVGDepWheel("visualization");
            break;
        case 2:
            gifMagic("visualization");
            break;
        default:
            clean(3, "visualization");
            document.getElementById('reset').addEventListener('click', function () {
                clean(3, selector);
            });
    }
}

function handleContainerEnter(response) { // response = { direction }    

    $graphic.classed('is-fixed', true); // sticky the graphic
    $graphic.classed('is-bottom', true);
}

function handleContainerExit(response) {
    // repsonse = { direction }

    $graphic.classed('is-fixed', false); // un-sticky the graphic, and pin to top/bottom of container
    $graphic.classed('is-bottom', response.direction === 'down');
}

function init() { // kick-off code to run once on load

    handleResize(); // 1. call a resize on load to update width/height/position of elements
    scroller // 2. setup the scrollama instance
        .setup({
            container: '#scroll', // our outtermost scrollytelling element
            graphic: '.scroll__graphic', // the graphic
            text: '.scroll__text', // the step container
            step: '.scroll__text .step', // the step elements
            offset: 0.675, // set the trigger to be halfway down screen
            debug: false, //display the trigger offset for testing
        })
        .onStepEnter(handleStepEnter) // 3. bind scrollama event handlers (chained below)
        .onContainerEnter(handleContainerEnter)
        .onContainerExit(handleContainerExit);


    window.addEventListener('resize', handleResize); // setup resize event

}

init(); // start it UP
