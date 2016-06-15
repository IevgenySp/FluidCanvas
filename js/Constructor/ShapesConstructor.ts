/**
 * Created by isp on 6/9/16.
 */

import {Shapes} from "./../Interfaces/shapeInterfaces";
import {SHAPES} from './../Utils/globals';

export default class ShapesConstructor {
    constructor() {}
    
    public getRectangle(
        x: number, y: number, width: number, height: number, polygons?: number): Shapes {

        let rectangle: Shapes;
        
        rectangle = {
            x: x,
            y: y,
            width: width,
            height: height,
            type: SHAPES.rectangle
        };

        if (polygons) {
            rectangle.polygons = polygons;
        }

        return rectangle;
    }
    
    public getRectangleByPoints(points: Array<number>, polygons?: number): Shapes {

        let rectangle: Shapes = {
            type: SHAPES.rectangle,
            pnts: points
        };
        
        if (polygons) {
            rectangle.polygons = polygons;
        }
        
        return rectangle;
    }

    public getCircle(
        startAngle: number, r: number, x: number, y: number, polygons?: number): Shapes {

        let circle: Shapes;

        circle = {
            startAngle: startAngle,
            r: r,
            x: x,
            y: y,
            type: SHAPES.circle
        };

        if (polygons) {
            circle.polygons = polygons;
        }

        return circle;
    }

    public getCircleByPoints(points: Array<number>, polygons?: number): Shapes {

        let circle: Shapes = {
            type: SHAPES.circle,
            pnts: points
        };

        if (polygons) {
            circle.polygons = polygons;
        }

        return circle;
    }
    
    public getLine(points: Array<number>, polygons?: number): Shapes {
        let line: Shapes = {
            type: SHAPES.line,
            pnts: points
        };

        if (polygons) {
            line.polygons = polygons;
        }

        return line;
    }

    public getBezierLine(points: Array<number>, polygons?: number): Shapes {
        let line: Shapes = {
            type: SHAPES.bezierLine,
            pnts: points
        };

        if (polygons) {
            line.polygons = polygons;
        }

        return line;
    }
    
    public setStyle(shape: Shapes, property: string, value: any): Shapes {
        if (!shape.style) {
            shape.style = {}
        }
        
        shape.style[property] = value;
        
        return shape;
    }
}