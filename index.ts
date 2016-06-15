/**
 * Created by isp on 4/10/16.
 */

import * as coreJs from 'core-js';

import FluidCanvas from './js/fluidCanvas';
import Constructor from './js/Constructor/shapesConstructor'

let canvas: any = document.getElementsByClassName("animizer-canvas-main")[0];
canvas.width = 1000;
canvas.height = 1000;
let context = canvas.getContext('2d');

let constructor = new Constructor();
let fluidCanvas = new FluidCanvas(context);

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

let polygons = 50;

let colors = ['#006E90', '#F18F01', '#ADCAD6', '#99C24D', '#41BBD9'];

let params = {
    xEasing: 'easeInOutCirc',
    yEasing: 'easeInOutCirc'
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

        shape = fluidCanvas.setPoints(bar,
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

        shape = fluidCanvas.setPoints(circle,
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

        shape = fluidCanvas.setPoints(line,
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

        shape = fluidCanvas.setPoints(line,
            {renderType: 'bezier', interpolationType: 'noInterpolation'});

        fluidCanvas.storage.setShapeCompositeId(shape);

        shapes.set(i, shape);
    }

    fluidCanvas.storage.incrementCompositeId();

    return shapes;
}

let vShapes = buildBars(vBarsParams, polygons);
//let v2Shapes = buildBars(v2BarsParams, polygons);
let cShapes = buildCircles(circlesParams, polygons);
let lShapes = buildLines(linesParams, polygons);
let lBShapes = buildBezierLines(linesParams, polygons);

let curShape = vShapes;

vShapes.forEach(function(shape, key) {
    fluidCanvas.render(shape, 'line');
});

let barsButton = document.getElementsByClassName('bars')[0];
let circlesButton = document.getElementsByClassName('circles')[0];
let linesButton = document.getElementsByClassName('lines')[0];
let bezierLinesButton = document.getElementsByClassName('bezierLines')[0];

barsButton.addEventListener('click', function() {
    let newShape: Map<any, any> = new coreJs.Map();
    let ts;

    curShape.forEach(function(shape, key) {
        ts = fluidCanvas.transform(shape, vShapes.get(key), 'easing', params);

        newShape.set(key, ts.shape);
    });

    curShape = newShape;

    fluidCanvas.animate();
});

circlesButton.addEventListener('click', function() {
    let newShape: Map<any, any> = new coreJs.Map();
    let ts;

    curShape.forEach(function(shape, key) {
        ts = fluidCanvas.transform(shape, cShapes.get(key), 'easing', params);

        newShape.set(key, ts.shape);
    });

    curShape = newShape;
    
    fluidCanvas.animate();
});

linesButton.addEventListener('click', function() {
    let newShape: Map<any, any> = new coreJs.Map();
    let ts;

    curShape.forEach(function(shape, key) {
        ts = fluidCanvas.transform(shape, lShapes.get(key), 'easing', params);

        newShape.set(key, ts.shape);
    });

    curShape = newShape;

    fluidCanvas.animate();
});

bezierLinesButton.addEventListener('click', function() {
    let newShape: Map<any, any> = new coreJs.Map();
    let ts;

    curShape.forEach(function(shape, key) {
        ts = fluidCanvas.transform(shape, lBShapes.get(key), 'easing', params);

        newShape.set(key, ts.shape);
    });

    curShape = newShape;

    fluidCanvas.animate();
});


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