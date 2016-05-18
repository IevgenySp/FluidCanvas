/**
 * Created by isp on 4/9/16.
 */

//import shapeInterfaces = require('./shapeInterfaces');
//import * as shapeInterfaces from "./shapeInterfaces";

import {Shape, Circle} from "./shapeInterfaces";
import {SYSTEM_PARAMETERS} from "./../Utils/globals";
import {HELPER} from './../Utils/helper';

export default class Points {
    constructor() {}

    public getPointsArray (shape: Shape, pointsNumber: number) {
        switch (shape.type) {
            case 'circle':
                return this.circlePoints(shape, shape.startAngle);
                break;
            case 'rectangle':
                return this.rectanglePoints(shape);
                break;
        }
    }

    private circlePoints (shape: Shape, startAngle?: number): Float32Array {
        let pointsNumber = shape.polygons || 4;
        let angleShift = HELPER.toRadians(360 / pointsNumber);
        let totalAngle = HELPER.toRadians(360 + startAngle);
        let buffer = new ArrayBuffer(pointsNumber * 4 * SYSTEM_PARAMETERS.dimentions);
        let fl32XY = new Float32Array(buffer);
        //let fl32Y = new Float32Array(buffer);
        //let pointsX = [];
        //let pointsY = [];
        let points = [];
        let pointsCounter = 0;
        let sumAngle = HELPER.toRadians(startAngle) || HELPER.toRadians(45);

        while (pointsCounter < pointsNumber) {
            let x = shape.x + shape.r * Math.cos(sumAngle);
            let y = shape.y + shape.r * Math.sin(sumAngle);

            //pointsX.push(x);
            //pointsY.push(y);
            points.push(x);
            points.push(y);

            sumAngle += angleShift;
            pointsCounter += 1;
        }

        fl32XY.set(points);
        //var eArr = fl32XY[Symbol.iterator]();
        //debugger;
        //fl32X = new Float32Array(pointsX);
        //fl32Y = new Float32Array(pointsY);

        //return [fl32X, fl32Y];

        return fl32XY;
    }

    private rectanglePoints (shape: Shape): Float32Array {
        let pointsNumber = shape.polygons || 4;
        let numbersInLine = ~~(shape.polygons / 4);
        let numbersInShape = numbersInLine * 4;

        let buffer = new ArrayBuffer(pointsNumber * 4 * SYSTEM_PARAMETERS.dimentions);
        let fl32XY = new Float32Array(buffer);
        //let fl32Y = new Float32Array(buffer);
        //let pointsX = [];
        //let pointsY = [];
        let points = [];
        let pointsCounter = 0;

        let keyPoints = [
            [shape.x, shape.y],
            [shape.x + shape.width, shape.y],
            [shape.x + shape.width, shape.y + shape.height],
            [shape.x, shape.y + shape.height]
        ];

        for (let i = 0; i < keyPoints.length; i++ ) {
            let sideLength;

            if (i < keyPoints.length - 1) {
                sideLength = HELPER.getVectorLength(
                    keyPoints[i][0],
                    keyPoints[i][1],
                    keyPoints[i + 1][0],
                    keyPoints[i + 1][1]
                );
            } else {
                sideLength = HELPER.getVectorLength(
                    keyPoints[i][0],
                    keyPoints[i][1],
                    keyPoints[0][0],
                    keyPoints[0][1]
                );
            }

            let distance = sideLength / (numbersInLine - 1);
            let steps = numbersInLine - 1;

            
        }

        return fl32XY;
    }

    private vectorPoints (
        startPoints: Array<number>,
        endPoints: Array<number>,
        step: number,
        container: Array<number>) {
        
    }

}
