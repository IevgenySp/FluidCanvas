/**
 * Created by isp on 5/1/16.
 */

import Interpolation from './interpolation';
import {SYSTEM_PARAMETERS, INTERPOLATION} from "./../Utils/globals";
import {Circle, Rectangle, Polygon} from "../Interfaces/shapeInterfaces";
import {InterpolationParameters} from './../Interfaces/interpolationInterfaces';
import {HELPER} from './../Utils/helper';

type Shapes = Circle | Rectangle | Polygon;

export default class easingInterpolation extends Interpolation {
    xEasing: string; 
    yEasing: string;
    startFrame: number; 
    frames: number;
    constructor(startShape: Shapes, endShape?: Shapes, parameters?: InterpolationParameters) {
        super(startShape, endShape);
        
        if (parameters) {
            this.xEasing = parameters.xEasing ?
                HELPER.hasValue(INTERPOLATION, parameters.xEasing) !== null ?
                parameters.xEasing : INTERPOLATION.linearTween : INTERPOLATION.linearTween;

            this.yEasing = parameters.yEasing ?
                HELPER.hasValue(INTERPOLATION, parameters.yEasing) !== null ?
                    parameters.yEasing : INTERPOLATION.linearTween : INTERPOLATION.linearTween;

            this.startFrame = parameters.startFrame || SYSTEM_PARAMETERS.startFrame;
            this.frames = parameters.frames || SYSTEM_PARAMETERS. frames;
        } else {
            this.xEasing = INTERPOLATION.linearTween;
            this.yEasing = INTERPOLATION.linearTween;
            this.startFrame = SYSTEM_PARAMETERS.startFrame;
            this.frames = SYSTEM_PARAMETERS. frames;
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

            points = this.easingInterpolation(
                vecA, vecB, 
                this.startFrame,
                this.frames,
                this[this.xEasing],
                this[this.yEasing]);

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

    public easingInterpolation(
        vectorStart: Array<number>,
        vectorEnd: Array<number>,
        startFrame: number,
        frames: number,
        xEasing: (t: number, b: number, c: number, d: number) => number,
        yEasing: (t: number, b: number, c: number, d: number) => number): Array<Array<number>> {

        let xPoints = this.coordinateEasing(vectorStart[0], vectorEnd[0], startFrame, frames, xEasing);
        let yPoints = this.coordinateEasing(vectorStart[1], vectorEnd[1], startFrame, frames, yEasing);
        let concatPoints = [];

        for (let i = 0; i < xPoints.length; i++) {
            concatPoints.push(xPoints[i]);
            concatPoints.push(yPoints[i]);
        }

        return concatPoints;
    }

    public coordinateEasing(
        startCoord: number,
        endCoord: number,
        startFrame: number,
        frames: number,
        easing: (t: number, b: number, c: number, d: number) => number): Array<number> {

        let points = [];
        let point;

        let t = startFrame;
        let b = startCoord;
        let c = endCoord - startCoord;
        let d = frames;

        while (t <= d) {
            point = easing(t, b, c, d);

            t++;

            points.push(point);
        }

        return points;
    }

    /*
     Easing algorithms
     See http://gizma.com/easing/#sin3 and
     http://upshots.org/actionscript/jsas-understanding-easing
     for detailed explanation
     */

    // simple linear tweening - no easing, no acceleration
    public linearTween(t: number, b: number, c: number, d: number): number {
        return c * (t / d) + b;
    }

    // quadratic easing in - accelerating from zero velocit
    public easeInQuad(t: number, b: number, c: number, d: number): number {
        t /= d;
        return c*t*t + b;
    };

    // quadratic easing out - decelerating to zero velocity
    public easeOutQuad(t: number, b: number, c: number, d: number): number {
        t /= d;
        return -c * t*(t-2) + b;
    };

    // quadratic easing in/out - acceleration until halfway, then deceleration
    public easeInOutQuad(t: number, b: number, c: number, d: number): number {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };

    // cubic easing in - accelerating from zero velocity
    public easeInCubic(t: number, b: number, c: number, d: number): number {
        t /= d;
        return c*t*t*t + b;
    };

    // cubic easing out - decelerating to zero velocity
    public easeOutCubic(t: number, b: number, c: number, d: number): number {
        t /= d;
        t--;
        return c*(t*t*t + 1) + b;
    };

    // cubic easing in/out - acceleration until halfway, then deceleration
    public easeInOutCubic(t: number, b: number, c: number, d: number): number {
        t /= d/2;
        if (t < 1) return c/2*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t + 2) + b;
    };

    // quartic easing in - accelerating from zero velocity
    public easeInQuart(t: number, b: number, c: number, d: number): number {
        t /= d;
        return c*t*t*t*t + b;
    };

    // quartic easing out - decelerating to zero velocity
    public easeOutQuart(t: number, b: number, c: number, d: number): number {
        t /= d;
        t--;
        return -c * (t*t*t*t - 1) + b;
    };

    // quartic easing in/out - acceleration until halfway, then deceleration
    public easeInOutQuart(t: number, b: number, c: number, d: number): number {
        t /= d/2;
        if (t < 1) return c/2*t*t*t*t + b;
        t -= 2;
        return -c/2 * (t*t*t*t - 2) + b;
    };

    // quintic easing in - accelerating from zero velocity
    public easeInQuint(t: number, b: number, c: number, d: number): number {
        t /= d;
        return c*t*t*t*t*t + b;
    };

    // quintic easing out - decelerating to zero velocity
    public easeOutQuint(t: number, b: number, c: number, d: number): number {
        t /= d;
        t--;
        return c*(t*t*t*t*t + 1) + b;
    };

    // quintic easing in/out - acceleration until halfway, then deceleration
    public easeInOutQuint(t: number, b: number, c: number, d: number): number {
        t /= d/2;
        if (t < 1) return c/2*t*t*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t*t*t + 2) + b;
    };

    // sinusoidal easing in - accelerating from zero velocity
    public easeInSine(t: number, b: number, c: number, d: number): number {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    };

    // sinusoidal easing out - decelerating to zero velocity
    public easeOutSine(t: number, b: number, c: number, d: number): number {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    };

    // sinusoidal easing in/out - accelerating until halfway, then decelerating
    public easeInOutSine(t: number, b: number, c: number, d: number): number {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    };

    // exponential easing in - accelerating from zero velocity
    public easeInExpo(t: number, b: number, c: number, d: number): number {
        return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
    };

    // exponential easing out - decelerating to zero velocity
    public easeOutExpo(t: number, b: number, c: number, d: number): number {
        return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
    };

    // exponential easing in/out - accelerating until halfway, then decelerating
    public easeInOutExpo(t: number, b: number, c: number, d: number): number {
        t /= d/2;
        if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
        t--;
        return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
    };

    // circular easing in - accelerating from zero velocity
    public easeInCirc(t: number, b: number, c: number, d: number): number {
        t /= d;
        return -c * (Math.sqrt(1 - t*t) - 1) + b;
    };

    // circular easing out - decelerating to zero velocity
    public easeOutCirc(t: number, b: number, c: number, d: number): number {
        t /= d;
        t--;
        return c * Math.sqrt(1 - t*t) + b;
    };

    // circular easing in/out - acceleration until halfway, then deceleration
    public easeInOutCirc(t: number, b: number, c: number, d: number): number {
        t /= d/2;
        if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        t -= 2;
        return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
    };
}
