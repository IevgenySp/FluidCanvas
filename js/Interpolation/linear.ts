/**
 * Created by isp on 5/1/16.
 */

import Interpolation from './interpolation';
import {SYSTEM_PARAMETERS} from "./../Utils/globals";
import {Circle, Rectangle, Polygon} from "../Interfaces/shapeInterfaces";
import {InterpolationParameters} from './../Interfaces/interpolationInterfaces';
import {HELPER} from './../Utils/helper';

type Shapes = Circle | Rectangle | Polygon;

export default class LinearInterpolation extends Interpolation {
    frames: number;
    constructor(startShape: Shapes, endShape?: Shapes, parameters?: InterpolationParameters) {
        super(startShape, endShape);

        if (parameters) {
            this.frames = parameters.frames || SYSTEM_PARAMETERS. frames;
        } else {
            this.frames = SYSTEM_PARAMETERS. frames;
        }
    }

    public iterator(): IterableIterator<Float32Array> {
        let startPoints = this.sShape.points;
        let endPoints = this.eShape.points;
        let trajectory = [];
        let params = this.getLinearParameters();
        let curDeltas = HELPER.getVectorsDeltas(startPoints, endPoints);
        let nextDeltas;
        let stopCondition = false;
        let index = 0;

        let counter = 0;
        
        while (!stopCondition) {
            /*let newStartPoints = startPoints.map(function(coord, index) {
                if (index % 2 === 0) {
                    return coord + params[index].velocity * t * Math.cos(params[index].angle + Math.PI / 2);
                } else {
                    return coord + params[index].velocity * t * Math.sin(params[index].angle - Math.PI / 2);
                }
            });*/
            
            let newStartPoints = [];

            for (let i = 0; i < startPoints.length; i += 2) {
                let vecA = params[i].startVector;
                let vecB = params[i].endVector;

                let point = this.getPointOnVector(vecA, vecB, counter, this.frames);

                newStartPoints.push(point[0]);
                newStartPoints.push(point[1]);

            }
            
            counter++;
            
            trajectory.push(newStartPoints);

            startPoints.set(newStartPoints);

            nextDeltas = HELPER.getVectorsDeltas(startPoints, endPoints);
            stopCondition = HELPER.isEqualArrays(curDeltas, nextDeltas);

            curDeltas = nextDeltas;

            index++;
        }

        HELPER.fitToEqual(trajectory[trajectory.length - 1], endPoints);
        
        return trajectory[Symbol.iterator]();
    }

    // P = d(B - A) + A
    public getPointOnVector (vecA: Array<number>, vecB: Array<number>, 
                             stepNumber: number, frames: number): Array<number> {


        let vecLen = HELPER.getVectorLength(vecA[0], vecA[1], vecB[0], vecB[1]);
        let d = vecLen / (frames + 1);
        
        let vecDif = HELPER.getVectorDiff(vecB, vecA);
        let vecMultiply = HELPER.vecConstMultiply(vecDif, (d * stepNumber) / vecLen);

        return HELPER.vecSum(vecMultiply, vecA);
    }

    public getPointsOnVector (vecA: Array<number>, vecB: Array<number>,
                        pointsNumber: number): Array<number> {
        let points = [];

        for (let i = 0; i < pointsNumber; i++) {
            points.push(this.getPointOnVector(vecA, vecB, i + 1, pointsNumber));
        }

        return HELPER.flattenArray(points);
    }

    public getPointsOnVectors (initialPoints: Array<number>,
                         pointsInVector: Array<number>,
                               includeInitial?: boolean): Array<number> {

        let isInitial = includeInitial || true;
        let points = [];

        for (let i = 0, f = 0; i < initialPoints.length - 2; i += 2, f++) {
            if (isInitial) {
                points.push(initialPoints[i]);
                points.push(initialPoints[i + 1]);
            }

            let vecA = [initialPoints[i], initialPoints[i+1]];
            let vecB = [initialPoints[i+2], initialPoints[i+3]];
            
            points.push(this.getPointsOnVector(vecA, vecB, pointsInVector[f]));
        }
        
        points.push(initialPoints[initialPoints.length - 2]);
        points.push(initialPoints[initialPoints.length - 1]);

        let vecA = [initialPoints[initialPoints.length - 2], initialPoints[initialPoints.length - 1]];
        let vecB = [initialPoints[0], initialPoints[1]];

        if (!HELPER.isEqualVectors(vecA, vecB)) {
            points.push(this.getPointsOnVector(vecA, vecB, pointsInVector[pointsInVector.length - 1]));
        }

        return  HELPER.flattenArray(points);
    }
}
