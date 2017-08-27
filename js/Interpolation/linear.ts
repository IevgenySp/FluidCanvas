/**
 * Created by isp on 5/1/16.
 */

import Interpolation from './Interpolation';
import {HELPER} from './../Utils/helper';

export default class LinearInterpolation extends Interpolation {
    frames: number;
    constructor(shapes: Array<any>) {
        super(shapes);
        
        this.frames = shapes[0].advanced.frames;
    }

    public iterator(): IterableIterator<Float32Array> {
        let startPoints = this.startShape.geometry.points;
        let endPoints = this.endShape.geometry.points;
        let trajectory = [];
        let params = this.getLinearParameters();
        let curDeltas = HELPER.getVectorsDeltas(startPoints, endPoints);
        let nextDeltas;
        let stopCondition = false;
        let index = 0;
        let counter = 0;
        //console.log(this.startShape);
        //console.log(this.endShape);

        if (startPoints.length !== endPoints.length)
            throw new Error('Amount of start and end points should be equal.');
        
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
        let step = vecLen > 0 ? (d * stepNumber) / vecLen : vecLen;
        
        let vecDif = HELPER.getVectorDiff(vecB, vecA);
        let vecMultiply = HELPER.vecConstMultiply(vecDif, step);

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

    public getPointsOnVectors (referencePoints: Array<number>,
                               pointsInVector: Array<number>,
                               includeInitial?: boolean,
                               includeLinkEndsVector?:boolean): Array<number> {

        let isInitial = typeof includeInitial === 'undefined' ? true : includeInitial;
        let points = [];
        let vecA, vecB;
        let refPoints = referencePoints;
        let linkEnds = 
            typeof includeLinkEndsVector === 'undefined' ? true : includeLinkEndsVector;

        for (let i = 0, f = 0; i < refPoints.length - 2; i += 2, f++) {
            vecA = [refPoints[i], refPoints[i+1]];
            vecB = [refPoints[i+2], refPoints[i+3]];

            if (isInitial) {
                points.push(refPoints[i]);
                points.push(refPoints[i + 1]);

                points.push(this.getPointsOnVector(vecA, vecB, pointsInVector[f] - 1));
            } else {
                points.push(this.getPointsOnVector(vecA, vecB, pointsInVector[f]));
            }
            
        }
        
        points.push(refPoints[refPoints.length - 2]);
        points.push(refPoints[refPoints.length - 1]);

        vecA = [refPoints[refPoints.length - 2], refPoints[refPoints.length - 1]];
        vecB = [refPoints[0], refPoints[1]];

        if (!HELPER.isEqualVectors(vecA, vecB) && linkEnds) {
            if (isInitial) {
                points.push(this.getPointsOnVector(vecA, vecB,
                    pointsInVector[pointsInVector.length - 1] - 1));
            } else {
                points.push(this.getPointsOnVector(vecA, vecB,
                    pointsInVector[pointsInVector.length - 1]));
            }
        }
        
        return  HELPER.flattenArray(points);
    }
}
