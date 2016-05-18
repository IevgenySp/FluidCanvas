/**
 * Created by isp on 4/10/16.
 */

import FluidCanvas from './js/fluidCanvas';

let canvas: any = document.getElementsByClassName("animizer-canvas-main")[0];
canvas.width = 500;
canvas.height = 500;
let context = canvas.getContext('2d');
//context.imageSmoothingEnabled = false;

/*context.beginPath();
context.lineWidth = 1;
context.arc(100,100,50,0,2*Math.PI);
context.stroke();
context.closePath();*/

let fluidCanvas = new FluidCanvas(context);

let circle1 = {
    type: 'circle',
    startAngle: 45,
    r: 50,
    x: 100,
    y: 100,
    polygons: 50
};

let circle2 = {
    type: 'circle',
    startAngle: 45,
    r: 100,
    x: 350,
    y: 350,
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

//let circlePoints1 = fluidCanvas.vectors.getPointsArray(circle1);
//let circlePoints2 = fluidCanvas.vectors.getPointsArray(circle2);
//debugger;
//let begin = performance.now();

fluidCanvas.render(circle1, 'point');
//fluidCanvas.renderer.render(circlePoints1, 'polygon');
//let end = performance.now();

//console.log((end - begin)/1000);

fluidCanvas.render(circle2, 'point');
fluidCanvas.render(rectangle, 'point');

//fluidCanvas.transform(circle1, circle2, 'linearExpansion', 'bezierCurve');
//fluidCanvas.transform(circle1, circle2, 'linearExpansion', 'polygon');



