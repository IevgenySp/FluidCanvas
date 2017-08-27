/**
 * Created by isp on 6/5/16.
 */

import {HELPER} from './../Utils/helper';
import {INTERPOLATION, SYSTEM_PARAMETERS} from './../Utils/globals';
import {Shape, Circle, Shapes,
    ShapeAdvancedOptions, ShapeStyle} from "./../Interfaces/shapeInterfaces";
import LinearInterpolation from './../Interpolation/Linear';
import BezierInterpolation from './../Interpolation/Bezier';
import EasingInterpolation from './../Interpolation/Easing';

export default class CircleGeometry {
    geometry:   Shapes;
    advanced:   ShapeAdvancedOptions;
    type:       string;
    style:      ShapeStyle;
    isRendered: boolean;
    minPolygons: number;
    constructor(shape: Shape) {
        this.geometry = shape.geometry;
        this.advanced = shape.advanced;
        this.type = shape.type;
        this.style = shape.style;
        this.isRendered = shape.isRendered;

        this.minPolygons = this.setCirclePolygons(shape);

        this.geometry.shapeSidesCoefficient = 1;
    }

    public setShapeGeometry(): CircleGeometry {
        this.geometry.polygons = this.normalizePolygons();

        return this.setGeometry();
    }

    public resetShapeGeometry(): CircleGeometry {
        return this.setGeometry();
    }
    
    /**
     * Define scope of points for circle shape
     * @returns {CircleGeometry}
     */
    public setGeometry(): CircleGeometry {
        
        let geometry = this.geometry;
        
        switch (this.advanced.interpolation) {
            case INTERPOLATION.noInterpolation:
            case INTERPOLATION.linear:
                geometry.points = HELPER.setPointsToBuffer(
                    this.linearPoints(),
                    SYSTEM_PARAMETERS.dimensions);
                break;
            case INTERPOLATION.bezier:
                geometry.points = HELPER.setPointsToBuffer(
                    this.bezierPoints(),
                    SYSTEM_PARAMETERS.dimensions);
                break;
            case INTERPOLATION.easing:
                geometry.points = HELPER.setPointsToBuffer(
                    this.easingPoints(),
                    SYSTEM_PARAMETERS.dimensions);
        }

        return this;
    }

    /**
     * Define polygons number for circle shape
     * @returns {number}
     */
    private normalizePolygons(): number {
        return this.referencePoints().length / 2;
    }
    
    private referencePoints(): Array<number> {
        let geometry = this.geometry;
        //let angleShift = HELPER.toRadians(360 / polygons);
        let angleShift = HELPER.toRadians(SYSTEM_PARAMETERS.circleMinStep);
        let polygons = 360 / SYSTEM_PARAMETERS.circleMinStep;
        let points = [];
        let pointsCounter = 0;
        let sumAngle = HELPER.toRadians(
                (<Circle>geometry).startAngle) || HELPER.toRadians(45);
        
        if (geometry.referencePoints) {
            if (geometry.referencePoints.length / 2 < this.minPolygons) {
                throw("Circle shape witch current radius should contain at least " +
                        this.minPolygons +  " reference points");
            }

            return geometry.referencePoints;
        }
        
        while (pointsCounter < polygons) {
            let x = (<Circle>geometry).x +
                (<Circle>geometry).r * Math.cos(sumAngle);
            let y = (<Circle>geometry).y +
                (<Circle>geometry).r * Math.sin(sumAngle);

            points.push(x);
            points.push(y);

            sumAngle += angleShift;
            pointsCounter += 1;
        }

        geometry.referencePoints = points;
        geometry.polygons = polygons;
        
        return geometry.referencePoints;
    }

    private linearPoints (): Array<number> {
        let refPoints = this.referencePoints();
        let lineVectors = [];
        let pointsPerSegment = [];
        let sumVector;
        let pointsInVector;
        let geometry = this.geometry;
        let polygons = geometry.polygons;
        let lInt = new LinearInterpolation([this]);

        for (let i = 0; i < refPoints.length - 2; i += 2) {
            lineVectors.push(HELPER.getVectorLength(
                refPoints[i], refPoints[i+1],
                refPoints[i+2], refPoints[i+3]));
        }

        lineVectors.push(HELPER.getVectorLength(
            refPoints[refPoints.length - 2], refPoints[refPoints.length - 1],
            refPoints[0], refPoints[1]));

        sumVector = lineVectors.reduce((a, b) => { return a + b; }, 0);

        for (let i = 0; i < lineVectors.length; i ++) {
            pointsPerSegment.push(lineVectors[i] / sumVector);
        }

        pointsInVector = HELPER.splitPoints(pointsPerSegment, polygons);

        return lInt.getPointsOnVectors(refPoints, pointsInVector);
    }
    
    private bezierPoints (): Array<number> {
        let refPoints = this.referencePoints();
        let trajectoryPoints = [];
        let points;
        let vecA;
        let vecB;
        let geometry = this.geometry;
        let polygons = geometry.polygons;

        if (polygons === refPoints.length / 2) {
            return refPoints;
        }
        
        let bInt = new BezierInterpolation([this]);

        for (let i = 0; i < refPoints.length - 2; i+=2) {
            vecA = [refPoints[i], refPoints[i+1]];
            vecB = [refPoints[i+2], refPoints[i+3]];

            points = bInt.bezierInterpolation(vecA, vecB, 
                this.advanced.interpolationPointsPerSegment, 
                this.advanced.bezierTensionFactor);

            trajectoryPoints.push(points);
        }

        vecA = [refPoints[refPoints.length - 2], refPoints[refPoints.length - 1]];
        vecB = [refPoints[0], refPoints[1]];

        points = bInt.bezierInterpolation(vecA, vecB, 
            this.advanced.interpolationPointsPerSegment, 
            this.advanced.bezierTensionFactor);

        trajectoryPoints.push(points);
        
        return HELPER.flattenArray(trajectoryPoints);
    }
    
    private easingPoints (): Array<number> {
        let refPoints = this.referencePoints();
        let trajectoryPoints = [];
        let points;
        let vecA;
        let vecB;
        let geometry = this.geometry;
        let polygons = geometry.polygons;

        if (polygons === refPoints.length / 2) {
            return refPoints;
        }
        
        let eInt = new EasingInterpolation([this]);

        for (let i = 0; i < refPoints.length - 2; i+=2) {
            vecA = [refPoints[i], refPoints[i+1]];
            vecB = [refPoints[i+2], refPoints[i+3]];

            points = eInt.easingInterpolation(vecA, vecB, 0, 
                this.advanced.interpolationPointsPerSegment,
                eInt[this.advanced.xEasing], eInt[this.advanced.yEasing]);

            trajectoryPoints.push(points);
        }

        vecA = [refPoints[refPoints.length - 2], refPoints[refPoints.length - 1]];
        vecB = [refPoints[0], refPoints[1]];

        points = eInt.easingInterpolation(vecA, vecB, 0, 
            this.advanced.interpolationPointsPerSegment,
            eInt[this.advanced.xEasing], eInt[this.advanced.yEasing]);

        trajectoryPoints.push(points);

        return HELPER.flattenArray(trajectoryPoints);
    }

    private setCirclePolygons(shape: Shape): number {
        let circleLength = 2 * Math.PI * (<Circle>shape.geometry).r;
        let minStep = SYSTEM_PARAMETERS.circleMinStep;

        if (circleLength < minStep) {
            return 1;
        }

        return Math.round(circleLength / minStep);
    }
}