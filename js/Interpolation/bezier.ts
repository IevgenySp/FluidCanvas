/**
 * Created by isp on 5/1/16.
 */

import Interpolation from './interpolation';
import {SYSTEM_PARAMETERS, SHAPES_PARAMETERS} from "./../Utils/globals";
import {Circle, Rectangle, Polygon} from "../Interfaces/shapeInterfaces";
import {InterpolationParameters} from './../Interfaces/interpolationInterfaces';

type Shapes = Circle | Rectangle | Polygon;

export default class BezierInterpolation extends Interpolation {
    frames: number;
    tensionFactor: number;
    constructor(startShape: Shapes, endShape?: Shapes, parameters?: InterpolationParameters) {
        super(startShape, endShape);

        if (parameters) {
            this.frames = parameters.frames || SYSTEM_PARAMETERS. frames;
            this.tensionFactor = parameters.tensionFactor || SHAPES_PARAMETERS.bezierTension;
        } else {
            this.frames = SYSTEM_PARAMETERS. frames;
            this.tensionFactor = SHAPES_PARAMETERS.bezierTension;
        }
    }

    public iterator(): IterableIterator<Float32Array> {
        let startPoints = this.sShape.points;
        let endPoints = this.eShape.points;
        let trajectory = [];
        let params = this.getLinearParameters();

        let trajectoryPoints = [];
        let points = [];

        for (let i = 0; i < startPoints.length; i += 2) {
            let vecA = params[i].startVector;
            let vecB = params[i].endVector;

            points = this.bezierInterpolation(vecA, vecB, this.frames);

            trajectoryPoints.push(points);
        }

        for (let i = 0; i < trajectoryPoints[0].length; i += 2) {
            let pnts = [];

            for (let f = 0; f < trajectoryPoints.length; f++) {
                pnts.push(trajectoryPoints[f][i]);
                pnts.push(trajectoryPoints[f][i+1]);
            }

            trajectory.push(pnts);
        }
        
        return trajectory[Symbol.iterator]();
    }

    public bezierInterpolation(
        vectorStart: Array<number>, vectorEnd: Array<number>, 
        frames: number, tensionFactor?: number): Array<number> {

        let pnts = [vectorStart[0], vectorStart[1], vectorEnd[0], vectorEnd[1]];
        let tension = tensionFactor ? tensionFactor : 
            this.tensionFactor ? this.tensionFactor : SHAPES_PARAMETERS.bezierTension;

        return this.cardinalSplines(pnts, tension, false, frames);
    }
    
    public cardinalSplines(pnts, tensionFactor: number,
                           isClosedContour: boolean, 
                           segmentsNumber: number): Array<number> {

        let tension = tensionFactor;
        let isClosed = isClosedContour || false;
        let numOfSegments = segmentsNumber || SHAPES_PARAMETERS.bezierSegmentsNumber;

        let points = [], bezierPoints = [];   // clone array
        let x, y;                             // x,y coords
        let t1x, t2x, t1y, t2y;               // tension vectors
        let c1, c2, c3, c4;                   // cardinal points
        let st;                               // step based on num. of segments

        for (let f = 0; f < pnts.length; f++) points[f] = pnts[f];

        // The algorithm require a previous and next point to the actual point array.
        // Check if we will draw closed or open curve.
        // If closed, copy end points to beginning and first points to end
        // If open, duplicate first points to befinning, end points to end
        if (isClosed) {
            points.unshift(pnts[pnts.length - 1]);
            points.unshift(pnts[pnts.length - 2]);
            points.unshift(pnts[pnts.length - 1]);
            points.unshift(pnts[pnts.length - 2]);
            points.push(pnts[0]);
            points.push(pnts[1]);
        }
        else {
            points.unshift(pnts[1]);   //copy 1. point and insert at beginning
            points.unshift(pnts[0]);
            points.push(pnts[pnts.length - 2]); //copy last point and append
            points.push(pnts[pnts.length - 1]);
        }

        for (let i = 2; i < (points.length - 4); i += 2) {
            for (let t = 0; t <= numOfSegments; t++) {

                // calc tension vectors
                t1x = (points[i + 2] - points[i - 2]) * tension;
                t2x = (points[i + 4] - points[i]) * tension;

                t1y = (points[i + 3] - points[i - 1]) * tension;
                t2y = (points[i + 5] - points[i + 1]) * tension;

                // calc step
                st = t / numOfSegments;

                // calc cardinals
                c1 =   2 * Math.pow(st, 3)  - 3 * Math.pow(st, 2) + 1;
                c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
                c3 =       Math.pow(st, 3)  - 2 * Math.pow(st, 2) + st;
                c4 =       Math.pow(st, 3)  -     Math.pow(st, 2);

                // calc x and y cords with common control vectors
                x = c1 * points[i] + c2 * points[i + 2] + c3 * t1x + c4 * t2x;
                y = c1 * points[i + 1] + c2 * points[i + 3] + c3 * t1y + c4 * t2y;

                //store points in array
                bezierPoints.push(x);
                bezierPoints.push(y);
            }
        }
        
        return bezierPoints;
    }
}
