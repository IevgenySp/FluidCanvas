/**
 * Created by isp on 4/9/16.
 */

//import shapeInterfaces = require('./shapeInterfaces');
//import * as shapeInterfaces from "./shapeInterfaces";

import {Shape, Circle} from "./shapeInterfaces";    

export default class Points {
    constructor() {}

    getPointsArray (shape: Shape, pointsNumber: number) {
        switch (shape.type) {
            case 'circle':
                return this._circlePoints(shape, pointsNumber, shape.startAngle);
                break;
        }
    }

    _circlePoints (shape: Shape, pointsNumber: number, startAngle?: number): Array<number> {
        let angleShift = toRadians(360 / pointsNumber);
        let totalAngle = toRadians(360 + startAngle);
        let points = [];
        let sumAngle = toRadians(startAngle) || toRadians(45);

        while (sumAngle < totalAngle) {
            let x = shape.x + shape.r * Math.cos(sumAngle);
            let y = shape.y + shape.r * Math.sin(sumAngle);

            points.push([x, y]);

            sumAngle += angleShift;
        }

        return points;
    }

}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}