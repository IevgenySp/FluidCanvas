/**
 * Created by isp on 4/10/16.
 */

import FluidCanvas from './fluidCanvas';

let canvas: any = document.getElementsByClassName("animizer-canvas-main")[0];
canvas.width = 500;
canvas.height = 500;
let context = canvas.getContext('2d');

let fluidCanvas = new FluidCanvas(context);

let circle = {
    type: 'circle',
    startAngle: 45,
    r: 50,
    x: 100,
    y: 100
};

let circlePoints = fluidCanvas.vectors.getPointsArray(circle, 10);

fluidCanvas.renderer.render(circlePoints, 'point');



