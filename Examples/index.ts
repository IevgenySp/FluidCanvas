/**
 * Created by isp on 4/10/16.
 */

import * as coreJs from 'core-js';

import FluidCanvas from './../js/fluidCanvas';

let canvas: any = document.getElementsByClassName("animizer-canvas-main")[0];
canvas.width = 1000;
canvas.height = 300;
let context = canvas.getContext('2d');

let fluidCanvas = new FluidCanvas(context);
let constructor = fluidCanvas.shapesConstructor;

let vBarsParams = [
    [50, 150, 50, 70],
    [105, 100, 50, 120],
    [160, 10, 50, 210],
    [215, 200, 50, 20],
    [270, 180, 50, 40]
];

let v2BarsParams = [
    [50, 20, 50, 200],
    [105, 50, 50, 170],
    [160, 200, 50, 20],
    [215, 80, 50, 140],
    [270, 150, 50, 70]
];

let circlesParams = [
    [215, 10, 25, 100],
    [215, 25, 52.5, 80],
    [215, 5, 80, 200],
    [215, 14, 107.5, 60],
    [215, 20, 135, 50]
];

let linesParams = [
    [50, 50, 75, 75, 105, 100],
    [105, 100, 130, 20, 160, 170],
    [160, 170, 175, 80, 215, 10],
    [215, 10, 230, 60, 270, 150],
    [270, 150, 295, 50, 320, 120]
];

let lineFlatParams = [
    50, 50, 75, 75, 105, 100,
    105, 100, 130, 20, 160, 170,
    160, 170, 175, 80, 215, 10,
    215, 10, 230, 60, 270, 150,
    270, 150, 295, 50, 320, 120
];

let polygons = 50;

let colors = ['#006E90', '#F18F01', '#ADCAD6', '#99C24D', '#41BBD9'];

let params = {
    xEasing: 'easeOutExpo',
    yEasing: 'easeOutExpo'
};


function buildBars(params, polygons) {
    let shapes: Map<any, any> = new coreJs.Map();
    let shape;

    for (let i = 0; i < params.length; i++) {
        let bar = constructor.getRectangle(
            params[i][0],
            params[i][1],
            params[i][2],
            params[i][3], polygons);

        constructor.setStyle(bar, 'color', colors[i]);
        constructor.setStyle(bar, 'isFill', true);

        shape = fluidCanvas.defineShape(bar,
            {renderType: 'line', interpolationType: 'noInterpolation'});

        fluidCanvas.storage.setShapeCompositeId(shape);

        shapes.set(i, shape);
    }

    fluidCanvas.storage.incrementCompositeId();

    return shapes;
}

function buildCircles(params, polygons) {
    let shapes: Map<any, any> = new coreJs.Map();
    let shape;

    for (let i = 0; i < params.length; i++) {
        let circle = constructor.getCircle(
            params[i][0],
            params[i][1],
            params[i][2],
            params[i][3], polygons);

        constructor.setStyle(circle, 'color', colors[i]);
        constructor.setStyle(circle, 'isFill', true);

        shape = fluidCanvas.defineShape(circle,
            {renderType: 'line', interpolationType: 'noInterpolation'});

        fluidCanvas.storage.setShapeCompositeId(shape);

        shapes.set(i, shape);
    }

    fluidCanvas.storage.incrementCompositeId();

    return shapes;
}

function buildLines(params, polygons) {
    let shapes: Map<any, any> = new coreJs.Map();
    let shape;

    for (let i = 0; i < params.length; i++) {
        let line = constructor.getLine(params[i], polygons);

        constructor.setStyle(line, 'color', colors[i]);
        constructor.setStyle(line, 'isFill', true);
        constructor.setStyle(line, 'isStroke', true);

        shape = fluidCanvas.defineShape(line,
            {renderType: 'line', interpolationType: 'noInterpolation'});

        fluidCanvas.storage.setShapeCompositeId(shape);

        shapes.set(i, shape);
    }

    fluidCanvas.storage.incrementCompositeId();

    return shapes;
}

function buildBezierLines(params, polygons) {
    let shapes: Map<any, any> = new coreJs.Map();
    let shape;

    for (let i = 0; i < params.length; i++) {
        let line = constructor.getBezierLine(params[i], polygons);

        constructor.setStyle(line, 'color', colors[i]);
        constructor.setStyle(line, 'isFill', true);
        constructor.setStyle(line, 'isStroke', true);

        shape = fluidCanvas.defineShape(line,
            {renderType: 'line', interpolationType: 'noInterpolation'});

        fluidCanvas.storage.setShapeCompositeId(shape);

        shapes.set(i, shape);
    }

    fluidCanvas.storage.incrementCompositeId();

    return shapes;
}

function buildLine(params, polygons) {
    let line = constructor.getLine(params, polygons);

    constructor.setStyle(line, 'color', colors[0]);
    constructor.setStyle(line, 'isFill', true);
    constructor.setStyle(line, 'isStroke', true);

    return fluidCanvas.defineShape(line,
        {renderType: 'line', interpolationType: 'noInterpolation'});
}

let vShapes = buildBars(vBarsParams, polygons);
//let v2Shapes = buildBars(v2BarsParams, polygons);
let cShapes = buildCircles(circlesParams, polygons);
let lShapes = buildLines(linesParams, polygons);
let lBShapes = buildBezierLines(linesParams, polygons);
let lShape = buildLine(lineFlatParams, polygons);

let curShape = mapToArr(vShapes);

vShapes.forEach(function(shape, key) {
    fluidCanvas.render(shape, 'line');
});

let barsButton = document.getElementsByClassName('bars')[0];
let circlesButton = document.getElementsByClassName('circles')[0];
let linesButton = document.getElementsByClassName('lines')[0];
let bezierLinesButton = document.getElementsByClassName('bezierLines')[0];
let compositeLineButton = document.getElementsByClassName('compositeLine')[0];

barsButton.addEventListener('click', function() {
    let ts = fluidCanvas.transform(curShape, mapToArr(vShapes), 'easing', params);

    curShape = ts.map(function(obj) {
        return obj.shape;
    });

    fluidCanvas.animate();
});

circlesButton.addEventListener('click', function() {
    let ts = fluidCanvas.transform(curShape, mapToArr(cShapes), 'easing', params);

    curShape = ts.map(function(obj) {
        return obj.shape;
    });

    fluidCanvas.animate();
});

linesButton.addEventListener('click', function() {
    let ts = fluidCanvas.transform(curShape, mapToArr(lShapes), 'easing', params);

    curShape = ts.map(function(obj) {
        return obj.shape;
    });

    fluidCanvas.animate();
});

bezierLinesButton.addEventListener('click', function() {
    let ts = fluidCanvas.transform(curShape, mapToArr(lBShapes), 'easing', params);

    curShape = ts.map(function(obj) {
        return obj.shape;
    });

    fluidCanvas.animate();
});

compositeLineButton.addEventListener('click', function() {
    let ts = fluidCanvas.transform(curShape, [lShape], 'easing', params);

    curShape = [lShape];

    fluidCanvas.animate();
});


function mapToArr (map: Map<any, any>): Array<any> {
    let newArr = [];

    map.forEach(function(val) {
        newArr.push(val);
    });

    return newArr;
}

/*let canvas2: any = document.getElementsByClassName("animizer-canvas-background")[0];
 canvas2.width = 1000;
 canvas2.height = 1000;
 let context2 = canvas2.getContext('2d');


 let circle1 = {
 type: 'circle',
 startAngle: 215,
 r: 50,
 x: 100,
 y: 100,
 polygons: 50,
 };

 let circle2 = {
 type: 'circle',
 startAngle: 215,
 r: 100,
 x: 750,
 y: 250,
 polygons: 50
 };

 let rectangle = {
 type: 'rectangle',
 x: 250,
 y: 400,
 width: 75,
 height: 75,
 polygons: 50
 };

 let line = {
 type: 'line',
 pnts: [200, 200, 250, 300, 500, 400, 700, 25],
 polygons: 50
 };

 let line2 = {
 type: 'line',
 pnts: [300, 300, 400, 300, 400, 300, 300, 300],
 polygons: 50
 };

 let star = {
 type: 'polygon',
 pnts: [129.38926261462365, 140.45084971874738, 100, 125, 70.61073738537632, 140.45084971874735, 76.22358709262116, 107.72542485937367, 52.447174185242325, 84.54915028125262, 85.30536869268818, 79.77457514062631, 100, 50, 114.69463130731182, 79.77457514062631, 147.55282581475768, 84.54915028125264, 123.77641290737884, 107.72542485937369, 129.38926261462365, 140.45084971874738],
 polygons: 50
 };

 let bezierCurve = {
 type: 'bezierLine',
 pnts: [200, 200, 250, 300, 500, 400, 700, 200, 600, 100],
 polygons: 50
 };*/



let canvas2: any = document.getElementsByClassName("animizer-canvas-main2")[0];
canvas2.width = 1000;
canvas2.height = 300;
let context2 = canvas2.getContext('2d');

let fluidCanvas2 = new FluidCanvas(context2);
let constructor2 = fluidCanvas2.shapesConstructor;

let circlesParams2 = [
    [215, 10, 25, 100],
    [215, 25, 52.5, 150]
];

let linesParams2 = [
    [50, 50, 100, 75, 105, 100],
    [105, 100, 180, 20, 160, 170],
    [160, 170, 175, 100, 215, 10],
    [215, 50, 230, 60, 270, 150],
    [270, 150, 295, 150, 320, 120]
];

function buildCircles2(params, polygons) {
    let shapes: Map<any, any> = new coreJs.Map();
    let shape;

    for (let i = 0; i < params.length; i++) {
        let circle = constructor.getCircle(
            params[i][0],
            params[i][1],
            params[i][2],
            params[i][3], polygons);

        constructor2.setStyle(circle, 'color', colors[i]);
        constructor2.setStyle(circle, 'isFill', true);

        shape = fluidCanvas2.defineShape(circle,
            {renderType: 'line', interpolationType: 'noInterpolation'});

        fluidCanvas2.storage.setShapeCompositeId(shape);

        shapes.set(i, shape);
    }

    fluidCanvas2.storage.incrementCompositeId();

    return shapes;
}

function buildLines2(params, polygons) {
    let shapes: Map<any, any> = new coreJs.Map();
    let shape;

    for (let i = 0; i < params.length; i++) {
        let line = constructor2.getLine(params[i], polygons);

        constructor2.setStyle(line, 'color', colors[i]);
        constructor2.setStyle(line, 'isFill', true);
        constructor2.setStyle(line, 'isStroke', true);

        shape = fluidCanvas2.defineShape(line,
            {renderType: 'line', interpolationType: 'noInterpolation'});

        fluidCanvas2.storage.setShapeCompositeId(shape);

        shapes.set(i, shape);
    }

    fluidCanvas2.storage.incrementCompositeId();

    return shapes;
}

let c2Shapes = buildCircles2(circlesParams2, polygons);
let l2Shapes = buildLines2(linesParams2, polygons);

let curShape2 = mapToArr(c2Shapes);

c2Shapes.forEach(function(shape, key) {
    fluidCanvas2.render(shape, 'line');
});

/*l2Shapes.forEach(function(shape, key) {
    fluidCanvas2.render(shape, 'line');
});*/

let circles2Button = document.getElementsByClassName('circles2')[0];
let lines2Button = document.getElementsByClassName('lines2')[0];

circles2Button.addEventListener('click', function() {
    let ts;

    ts = fluidCanvas2.transform(curShape2, mapToArr(c2Shapes), 'easing', params);

    curShape2 = ts.map(function(obj) {
        return obj.shape;
    });

    fluidCanvas2.animate();
});

lines2Button.addEventListener('click', function() {
    let ts;

     ts = fluidCanvas2.transform(curShape2, mapToArr(l2Shapes), 'easing', params);

     curShape2 = ts.map(function(obj) {
        return obj.shape;
     });

     fluidCanvas2.animate();
});