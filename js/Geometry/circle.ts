/**
 * Created by isp on 6/5/16.
 */

import ShapesGeometry from './shapes';
import {HELPER} from './../Utils/helper';
import {INTERPOLATION, SYSTEM_PARAMETERS, SHAPES_PARAMETERS} from './../Utils/globals';
import {Shapes,Circle, ShapeParameters} from "./../Interfaces/shapeInterfaces";
import LinearInterpolation from './../Interpolation/linear';
import BezierInterpolation from './../Interpolation/bezier';
import EasingInterpolation from './../Interpolation/easing';

export default class CircleGeometry extends ShapesGeometry {
    tensionFactor:                 number;
    interpolationPointsPerSegment: number;
    easingType:                    string;
    interpolationType:             string;
    constructor(parameters: ShapeParameters) {
        super(parameters);

        this.tensionFactor                 = parameters.bezierTensionFactor;
        this.interpolationPointsPerSegment = parameters.interpolationPointsPerSegment;
        this.easingType                    = parameters.easingType;
        this.interpolationType             = parameters.interpolationType;
    }

    public setPoints(shape: Shapes): Shapes {
        
        switch (this.interpolationType) {
            case INTERPOLATION.noInterpolation:
                shape.polygons = this.setPolygons(shape);
                shape.points = this.setPointToBuffer(
                    this.linearPoints(shape, (<Circle>shape).startAngle));
                break;
            case INTERPOLATION.linear:
                shape.polygons = this.setPolygons(shape);
                shape.points = this.setPointToBuffer(
                    this.linearIntPoints(shape, (<Circle>shape).startAngle));
                break;
            case INTERPOLATION.bezier:
                shape.polygons = this.setPolygons(shape);
                shape.points = this.setPointToBuffer(
                    this.bezierIntPoints(shape, (<Circle>shape).startAngle));
                break;
            case INTERPOLATION.easing:
                shape.polygons = this.setPolygons(shape);
                shape.points = this.setPointToBuffer(
                    this.easingIntPoints(shape, (<Circle>shape).startAngle));
        }
        
        shape.polygons = this.setPolygons(shape);
        shape.interpolation = this.interpolationType;
        shape.geometry = this;        

        return shape;
    }

    public resetPoint(shape: Shapes): Shapes {
        shape.points = this.setPointToBuffer(
            this.linearPoints(shape, (<Circle>shape).startAngle));

        return shape;
    }
    
    public setPointToBuffer (points: Array<number>): Float32Array {
        let pointsLength = points.length / 2;
        let buffer = new ArrayBuffer(pointsLength * 4 * SYSTEM_PARAMETERS.dimentions);
        let fl32XY = new Float32Array(buffer);

        fl32XY.set(points);

        return fl32XY;
    }
    
    public linearPoints (shape: Shapes, startAngle?: number): Array<number> {
        let pointsNumber = shape.pnts ? shape.pnts.length / 2 :
            shape.polygons ? shape.polygons : SHAPES_PARAMETERS.polygons;
        let angleShift = HELPER.toRadians(360 / pointsNumber);

        let points = [];
        let pointsCounter = 0;
        let sumAngle = HELPER.toRadians(startAngle) || HELPER.toRadians(45);

        while (pointsCounter < pointsNumber) {
            let x = (<Circle>shape).x + (<Circle>shape).r * Math.cos(sumAngle);
            let y = (<Circle>shape).y + (<Circle>shape).r * Math.sin(sumAngle);

            points.push(x);
            points.push(y);

            sumAngle += angleShift;
            pointsCounter += 1;
        }
        
        return points;
    }

    public linearIntPoints (shape: Shapes, startAngleValue?: number): Array<number> {
        let startAngle = startAngleValue || HELPER.toRadians(45);
        let basePoints = this.linearPoints(shape, startAngle);
        let trajectoryPoints = [];
        let self = this;
        let pointsInVector = basePoints.map(function(point) {
            return self.interpolationPointsPerSegment;
        });

        let lInt = new LinearInterpolation([shape], this.params);

        trajectoryPoints = lInt.getPointsOnVectors(basePoints, pointsInVector);

        let vecA = [basePoints[basePoints.length - 2], basePoints[basePoints.length - 1]];
        let vecB = [basePoints[0], basePoints[1]];
        let pnts = lInt.getPointsOnVector(vecA, vecB, self.interpolationPointsPerSegment);

        trajectoryPoints.push(pnts);

        return HELPER.flattenArray(trajectoryPoints);
    }
    
    public bezierIntPoints (shape: Shapes, startAngleValue?: number): Array<number> {
        let startAngle = startAngleValue || HELPER.toRadians(45);
        let basePoints = this.linearPoints(shape, startAngle);
        let trajectoryPoints = [];
        let points;

        let bInt = new BezierInterpolation([shape], this.params);

        for (let i = 0; i < basePoints.length - 2; i+=2) {
            let vecA = [basePoints[i], basePoints[i+1]];
            let vecB = [basePoints[i+2], basePoints[i+3]];

            points = bInt.bezierInterpolation(vecA, vecB, this.interpolationPointsPerSegment, this.tensionFactor);

            trajectoryPoints.push(points);
        }

        let vecA = [basePoints[basePoints.length - 2], basePoints[basePoints.length - 1]];
        let vecB = [basePoints[0], basePoints[1]];

        points = bInt.bezierInterpolation(vecA, vecB, this.interpolationPointsPerSegment, this.tensionFactor);

        trajectoryPoints.push(points);
        
        return HELPER.flattenArray(trajectoryPoints);
    }
    
    public easingIntPoints (shape: Shapes, startAngleValue?: number): Array<number> {
        let startAngle = startAngleValue || HELPER.toRadians(45);
        let basePoints = this.linearPoints(shape, startAngle);
        let trajectoryPoints = [];
        let points;

        let eInt = new EasingInterpolation([shape], this.params);

        for (let i = 0; i < basePoints.length - 2; i+=2) {
            let vecA = [basePoints[i], basePoints[i+1]];
            let vecB = [basePoints[i+2], basePoints[i+3]];

            points = eInt.easingInterpolation(vecA, vecB, 0, this.interpolationPointsPerSegment,
                eInt[this.easingType], eInt[this.easingType]);

            trajectoryPoints.push(points);
        }

        let vecA = [basePoints[basePoints.length - 2], basePoints[basePoints.length - 1]];
        let vecB = [basePoints[0], basePoints[1]];

        points = eInt.easingInterpolation(vecA, vecB, 0, this.interpolationPointsPerSegment,
            eInt[this.easingType], eInt[this.easingType]);

        trajectoryPoints.push(points);

        return HELPER.flattenArray(trajectoryPoints);
    }
}