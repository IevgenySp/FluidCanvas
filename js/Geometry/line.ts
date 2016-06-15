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

export default class LineGeometry extends ShapesGeometry {
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
        // Reverse points, needs to create shape from line
        let pnts  = [];
        let rpnts = [];

        for (let i = 0; i < shape.pnts.length; i++) {
            pnts.push(shape.pnts[i]);
        }

        for (let i = shape.pnts.length - 1; i >= 0; i -= 2) {
            rpnts.push(shape.pnts[i-1]);
            rpnts.push(shape.pnts[i]);
        }

        return HELPER.flattenArray(rpnts, pnts);
    }

    public linearIntPoints (shape: Shapes): Array<number> {
        let polygonVectors = [];
        let pnts = [];

        for (let i = 0; i < shape.pnts.length; i++) {
            pnts.push(shape.pnts[i]);
        }

        let polygonPoints = [];

        // Reverse points, needs to create shape from line
        let rpnts = [];

        for (let i = pnts.length - 1; i >= 0; i -= 2) {
            rpnts.push(pnts[i-1]);
            rpnts.push(pnts[i]);
        }

        //pnts = [].concat.apply(pnts, rpnts);
        pnts = HELPER.flattenArray(rpnts, pnts);

        let lInt = new LinearInterpolation(shape);

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
        //let basePoints = this.linearIntPoints(shape);
        let basePoints = [];
        let trajectoryPoints = [];
        let points;

        for (let i = 0; i < shape.pnts.length; i++) {
            basePoints.push(shape.pnts[i]);
        }

        // Reverse points, needs to create shape from line
        let rpnts = [];

        for (let i = basePoints.length - 1; i >= 0; i -= 2) {
            rpnts.push(basePoints[i-1]);
            rpnts.push(basePoints[i]);
        }
        
        basePoints = HELPER.flattenArray(rpnts, basePoints);

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
        let basePoints = [];
        let trajectoryPoints = [];
        let points;

        for (let i = 0; i < shape.pnts.length; i++) {
            basePoints.push(shape.pnts[i]);
        }

        // Reverse points, needs to create shape from line
        let rpnts = [];

        for (let i = basePoints.length - 1; i >= 0; i -= 2) {
            rpnts.push(basePoints[i-1]);
            rpnts.push(basePoints[i]);
        }
        
        basePoints = HELPER.flattenArray(rpnts, basePoints);

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