/**
 * Created by isp on 6/9/16.
 */

import {Shape} from "./../Interfaces/shapeInterfaces";
import {SHAPES, POLYGON_SHAPES, SYSTEM_PARAMETERS} from './../Utils/globals';
import {HELPER} from './../Utils/helper';

export default class ShapesConstructor {
    constructor() {}

    /**
     * Return basic shape object
     * @param type
     * @param options
     * @returns {null}
     */
    public defineShape(type: any, options: any): Shape {

        if (!options) {
            throw('Options for ' + type + ' should be defined');
        }

        let shapeType = typeof type === 'string' ?
            type.toUpperCase() : type.type.toUpperCase();
        let shape;
        let polygons;
        let startAngle;
        let drawAsCanvasShape = SYSTEM_PARAMETERS.drawAsCanvasShape;

        if (options.advanced &&
            options.advanced.hasOwnProperty("drawAsCanvasShape")) {
            drawAsCanvasShape = options.advanced.drawAsCanvasShape;
        }

        switch(shapeType) {
            default:
                throw('Undefined shape type');
            case SHAPES.rectangle.toUpperCase():
                if (drawAsCanvasShape) {
                    polygons = options.polygons || 
                        SYSTEM_PARAMETERS.polygonsPerShape;
                    shape = getRectangle(options.x, options.y,
                        options.width, options.height, polygons);
                } else {
                    shape = getPolygon(shapeType, options);
                }
                break;
            case SHAPES.circle.toUpperCase():
                if (drawAsCanvasShape) {
                    polygons = options.polygons ||
                        SYSTEM_PARAMETERS.polygonsPerShape;
                    startAngle = options.startAngle || 
                        SYSTEM_PARAMETERS.circleStartAngle;
                    shape = getCircle(options.x, options.y,
                        options.r, startAngle, polygons);
                } else {
                    shape = getPolygon(shapeType, options);
                }
                break;
            case SHAPES.line.toUpperCase():
            case SHAPES.bezierLine.toUpperCase():
            case SHAPES.polygon.toUpperCase():
                if (typeof type === 'string') {
                    shape = getPolygon(shapeType, options);
                } else {
                    shape = getPolygon(type, options);
                }
                break;
            case SHAPES.text.toUpperCase():
                shape = getText(options.text, options.x, options.y);
        }
        
        if (options.style) {
            HELPER.setOptions(shape, options.style, 'style');
        }
        
        if (options.advanced) {
            HELPER.setOptions(shape, options.advanced, 'advanced');
        }
        
        return shape;
    }
}

/**
 * Define basic rectangle shape
 * @param x
 * @param y
 * @param width
 * @param height
 * @param polygons
 * @returns {Shapes}
 */
function getRectangle(
    x: number, y: number, width: number, height: number, polygons: number): any {

    let rectangle: any = {};
    
    rectangle.type = SHAPES.rectangle.toUpperCase();
    rectangle.geometry = {
        x: x,
        y: y,
        width: width,
        height: height
    };
    rectangle.isRendered = false;
    rectangle.geometry.polygons = polygons;
    
    return rectangle;
}

/**
 * Define basic circle shape
 * @param startAngle
 * @param r
 * @param x
 * @param y
 * @param polygons
 * @returns {Shapes}
 */
function getCircle(
    x: number, y: number, r: number, startAngle: number, polygons: number): any {

    let circle: any = {};

    circle.type = SHAPES.circle.toUpperCase();
    circle.geometry = {
        startAngle: startAngle,
        r: r,
        x: x,
        y: y
    };
    circle.isRendered = false;
    circle.geometry.polygons = polygons;

    return circle;
}

function getText(text: 'string', x: number, y: number) {
    
    let textShape: any = {};
    
    textShape.type = SHAPES.text.toUpperCase();
    textShape.geometry = {
        text: text,
        x: x,
        y: y
    };
    textShape.isRendered = false;
    
    return textShape;
}

/**
 * Define basic polygon shape
 * @param type
 * @param options
 * @returns {Shapes}
 */
function getPolygon(type: any, options: any): any {

    if (typeof type === 'string') {

        if (!options.points || options.points.length === 0)
            throw new Error('Points should be defined for polygon shape');

        let polygon: any = {};

        polygon.type = type.toUpperCase();
        polygon.geometry = {
            referencePoints: options.points,
            polygons: options.points.length / 2
        };
        polygon.isRendered = false;

        return polygon;
    } else {

        if (!type.type || !type.subtype || !options)
            throw new Error('Predefined polygon type, subtype and options should be defined');

        let polygon: any = {};

        polygon.type = type.type.toUpperCase();

        switch (type.subtype.toUpperCase()) {
            case POLYGON_SHAPES.star.toUpperCase():
                let points = drawStar(options.x, options.y,
                    options.spikes, options.outerRadius, options.innerRadius);

                polygon.geometry = {
                    referencePoints: points,
                    polygons: points.length / 2
                };
                break;
        }
        polygon.isRendered = false;

        return polygon;
    }
}

/**
 * Define Star - a subtype of polygon shape
 * @param cx
 * @param cy
 * @param spikes
 * @param outerRadius
 * @param innerRadius
 * @returns {Array}
 */
function drawStar(
    cx: number, cy: number, spikes: number,
    outerRadius: number, innerRadius: number): any {

    let starPoints = [];
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    //starPoints.push(x, y - outerRadius);

    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        //ctx.lineTo(x, y)
        starPoints.push(x);
        starPoints.push(y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        //ctx.lineTo(x, y)
        starPoints.push(x);
        starPoints.push(y);
        rot += step;
    }
    
    return starPoints;
}