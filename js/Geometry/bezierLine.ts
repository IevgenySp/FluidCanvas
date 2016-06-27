/**
 * Created by isp on 6/5/16.
 */

import ShapesGeometry from './shapes';
import {HELPER} from './../Utils/helper';
import {INTERPOLATION, SYSTEM_PARAMETERS} from './../Utils/globals';
import {Shapes, ShapeParameters} from "./../Interfaces/shapeInterfaces";
import LinearInterpolation from './../Interpolation/linear';
import BezierInterpolation from './../Interpolation/bezier';
import EasingInterpolation from './../Interpolation/easing';

export default class BezierLineGeometry extends ShapesGeometry {
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
        shape.interpolation = this.interpolationType;
        shape.geometry = this;

        return shape;
    }

    public resetPoint(shape: Shapes): Shapes {
        shape.points = this.setPointToBuffer(
            this.linearPoints(shape));

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
        let pnts = [];

        for (let i = 0; i < shape.pnts.length; i++) {
            pnts.push(shape.pnts[i]);
        }

        // Reverse points, needs to create shape from line
        let rpnts = [];

        for (let i = pnts.length - 1; i >= 0; i -= 2) {
            rpnts.push(pnts[i-1]);
            rpnts.push(pnts[i]);
        }

        pnts = HELPER.flattenArray(rpnts, pnts);
        
        let bInt = new BezierInterpolation([shape], this.params);

        let frames = shape.polygons / (shape.pnts.length - 1) - 1;

        return bInt.cardinalSplines(pnts, this.tensionFactor, false, frames);
    }

    public linearIntPoints (shape: Shapes): Array<number> {
        let polygonVectors = [];
        let pnts = this.linearPoints(shape);

        let polygonPoints = [];

        // Reverse points, needs to create shape from line
        let rpnts = [];

        for (let i = pnts.length - 1; i >= 0; i -= 2) {
            rpnts.push(pnts[i-1]);
            rpnts.push(pnts[i]);
        }

        pnts = HELPER.flattenArray(rpnts, pnts);

        let lInt = new LinearInterpolation([shape], this.params);

        for (let i = 0; i < pnts.length - 2; i += 2) {
            polygonVectors.push(HELPER.getVectorLength(pnts[i], pnts[i+1], pnts[i+2], pnts[i+3]));
        }

        let sumVector = polygonVectors.reduce(function(a, b) { return a + b; }, 0);
        let pointsPerSegment = [];

        for (let i = 0; i < polygonVectors.length; i ++) {
            pointsPerSegment.push(polygonVectors[i] / sumVector);
        }

        let polygons = shape.polygons - pnts.length / 2;
        
        if (polygons !== 0) {

            let pointsInVector = HELPER.splitPoints(pointsPerSegment, polygons);

            polygonPoints = lInt.getPointsOnVectors(pnts, pointsInVector, true);

        } else {
            polygonPoints = pnts;
        }

        return polygonPoints;
    }

    public bezierIntPoints (shape: Shapes): Array<number> {
        let basePoints = this.linearPoints(shape);
        let trajectoryPoints = [];
        let points;

        // Reverse points, needs to create shape from line
        let rpnts = [];

        for (let i = basePoints.length - 1; i >= 0; i -= 2) {
            rpnts.push(basePoints[i-1]);
            rpnts.push(basePoints[i]);
        }
        
        basePoints = HELPER.flattenArray(rpnts, basePoints);

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

    public easingIntPoints (shape: Shapes): Array<number> {
        let basePoints = this.linearPoints(shape);
        let trajectoryPoints = [];
        let points;

        // Reverse points, needs to create shape from line
        let rpnts = [];

        for (let i = basePoints.length - 1; i >= 0; i -= 2) {
            rpnts.push(basePoints[i-1]);
            rpnts.push(basePoints[i]);
        }
        
        basePoints = HELPER.flattenArray(rpnts, basePoints);

        let frames = (shape.polygons - basePoints.length / 2) / this.shapeSidesCoef(shape);

        let eInt = new EasingInterpolation([shape], this.params);

        for (let i = 0; i < basePoints.length - 2; i+=2) {
            let vecA = [basePoints[i], basePoints[i+1]];
            let vecB = [basePoints[i+2], basePoints[i+3]];

            points = eInt.easingInterpolation(vecA, vecB, 0, frames,
                eInt[this.easingType], eInt[this.easingType]);

            trajectoryPoints.push(points);
        }
        
        let vecA = [basePoints[basePoints.length - 2], basePoints[basePoints.length - 1]];
        let vecB = [basePoints[0], basePoints[1]];

        if (frames > 0) {
            points = eInt.easingInterpolation(vecA, vecB, 0, frames,
                eInt[this.easingType], eInt[this.easingType]);
        } else {
            points = basePoints;
        }

        trajectoryPoints.push(points);
        
        return HELPER.flattenArray(trajectoryPoints);
    }
}