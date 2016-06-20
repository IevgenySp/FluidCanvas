/**
 * Created by isp on 4/10/16.
 */

var canvas = document.getElementsByClassName("animizer-canvas-main")[0];
canvas.width = 1000;
canvas.height = 1000;
var context = canvas.getContext('2d');


var fluidCanvas = new FluidCanvas(context);
var constructor = fluidCanvas.getShapesConstructor();

var bar = constructor.getRectangle(50, 50, 70, 150);
var circle = constructor.getCircle(215, 40, 200, 200);

fluidCanvas.setPoints(bar);
fluidCanvas.setPoints(circle);

fluidCanvas.transform(bar, circle);

fluidCanvas.animate();