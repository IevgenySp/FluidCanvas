/**
 * Created by isp on 6/5/16.
 */

import ShapesGeometry from './shapes';
import {HELPER} from './../Utils/helper';
import {INTERPOLATION, SYSTEM_PARAMETERS} from './../Utils/globals';
import {Shapes, Rectangle, ShapeParameters} from "./../Interfaces/shapeInterfaces";
import LinearInterpolation from './../Interpolation/linear';
import BezierInterpolation from './../Interpolation/bezier';
import EasingInterpolation from './../Interpolation/easing';

export default class RectangleGeometry extends ShapesGeometry {
    tensionFactor: number;
    frames: number;
    easing: string;
    constructor(parameters: ShapeParameters) {
        super();

        this.tensionFactor = parameters.tensionFactor;
        this.frames = parameters.frames;
        this.easing = parameters.easing;
    }

    public setPoints(shape: Shapes, interpolation: string): Shapes {
        
        switch (interpolation) {
            case INTERPOLATION.noInterpolation:
                shape.polygons = this.setPolygons(shape);
                shape.points = this.setPointToBuffer(
                    this.linearPoints(shape));
                break;
            case INTERPOLATION.linear:
                shape.polygons = this.setPolygons(shape);
                shape.points = this.setPointToBuffer(
                    this.linearIntPoints(shape));
                break;
            case INTERPOLATION.bezier:
                shape.polygons = this.setPolygons(shape);
                shape.points = this.setPointToBuffer(
                    this.bezierIntPoints(shape));
                break;
            case INTERPOLATION.easing:
                shape.polygons = this.setPolygons(shape);
                shape.points = this.setPointToBuffer(
                    this.easingIntPoints(shape));
        }

        shape.polygons = this.setPolygons(shape);
        shape.interpolation = interpolation;
        shape.geometry = this;

        return shape;
    }

    public resetPoint(shape: Shapes): Shapes {

        shape.points = this.setPointToBuffer(
            this.linearIntPoints(shape));

        return shape;
    }

    public setPointToBuffer (points: Array<number>): Float32Array {
        let pointsLength = points.length / 2;
        let buffer = new ArrayBuffer(pointsLength * 4 * SYSTEM_PARAMETERS.dimentions);
        let fl32XY = new Float32Array(buffer);

        fl32XY.set(points);

        return fl32XY;
    }

    public linearPoints (shape: Shapes): Array<number> {

        let keyPoints = [
            (<Rectangle>shape).x, (<Rectangle>shape).y,
            (<Rectangle>shape).x + (<Rectangle>shape).width, (<Rectangle>shape).y,
            (<Rectangle>shape).x + (<Rectangle>shape).width, (<Rectangle>shape).y + (<Rectangle>shape).height,
            (<Rectangle>shape).x, (<Rectangle>shape).y + (<Rectangle>shape).height
        ];

        return keyPoints;
    }

    public linearIntPoints (shape: Shapes): Array<number> {
        let lineVectors = [];

        let lInt = new LinearInterpolation(shape);

        let keyPoints = this.linearPoints(shape);
        let rectPoints = [];

        for (let i = 0; i < keyPoints.length - 2; i += 2) {
            lineVectors.push(HELPER.getVectorLength(
                keyPoints[i],
                keyPoints[i+1],
                keyPoints[i+2],
                keyPoints[i+3]));
        }

        lineVectors.push(HELPER.getVectorLength(
            keyPoints[keyPoints.length - 2],
            keyPoints[keyPoints.length - 1],
            keyPoints[0],
            keyPoints[1]));

        let sumVector = lineVectors.reduce(function(a, b) { return a + b; }, 0);
        let pointsPerSegment = [];

        for (let i = 0; i < lineVectors.length; i ++) {
            pointsPerSegment.push(lineVectors[i] / sumVector);
        }

        let polygons = shape.polygons - keyPoints.length / 2;

        if (polygons !== 0) {

            let pointsInVector = HELPER.splitPoints(pointsPerSegment, polygons);
            let polygonsPerSegment = polygons / this.shapeSidesCoef(shape);

            rectPoints = lInt.getPointsOnVectors(keyPoints, pointsInVector);

        } else {
            
            rectPoints = keyPoints;
        }
        
        return rectPoints;
    }

    public bezierIntPoints (shape: Shapes): Array<number> {
        let basePoints = this.linearPoints(shape);
        let trajectoryPoints = [];
        let points;

        let bInt = new BezierInterpolation(shape);

        for (let i = 0; i < basePoints.length - 2; i+=2) {
            let vecA = [basePoints[i], basePoints[i+1]];
            let vecB = [basePoints[i+2], basePoints[i+3]];

            points = bInt.bezierInterpolation(vecA, vecB, this.frames, this.tensionFactor);

            trajectoryPoints.push(points);
        }

        let vecA = [basePoints[basePoints.length - 2], basePoints[basePoints.length - 1]];
        let vecB = [basePoints[0], basePoints[1]];

        points = bInt.bezierInterpolation(vecA, vecB, this.frames, this.tensionFactor);

        trajectoryPoints.push(points);

        return HELPER.flattenArray(trajectoryPoints);
    }

    public easingIntPoints (shape: Shapes): Array<number> {
        let basePoints = this.linearPoints(shape);
        let trajectoryPoints = [];
        let points;
        
        let frames = (shape.polygons - basePoints.length / 2) / this.shapeSidesCoef(shape);

        let eInt = new EasingInterpolation(shape);

        for (let i = 0; i < basePoints.length - 2; i+=2) {
            let vecA = [basePoints[i], basePoints[i+1]];
            let vecB = [basePoints[i+2], basePoints[i+3]];

            points = eInt.easingInterpolation(vecA, vecB, 0, frames,
                eInt[this.easing], eInt[this.easing]);

            trajectoryPoints.push(points);
        }
        
        let vecA = [basePoints[basePoints.length - 2], basePoints[basePoints.length - 1]];
        let vecB = [basePoints[0], basePoints[1]];

        if (frames > 0) {
            points = eInt.easingInterpolation(vecA, vecB, 0, frames,
                eInt[this.easing], eInt[this.easing]);
        } else {
            points = basePoints;
        }

        trajectoryPoints.push(points);
        
        return HELPER.flattenArray(trajectoryPoints);
    }
}