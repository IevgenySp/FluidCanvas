/**
 * Created by isp on 6/5/16.
 */

import {HELPER} from './../Utils/helper';
import {INTERPOLATION, SYSTEM_PARAMETERS} from './../Utils/globals';
import {Shapes, Shape, Rectangle,
    ShapeAdvancedOptions, ShapeStyle} from "./../Interfaces/shapeInterfaces";
import LinearInterpolation from './../Interpolation/Linear';
import BezierInterpolation from './../Interpolation/Bezier';
import EasingInterpolation from './../Interpolation/Easing';

export default class RectangleGeometry {
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

        this.minPolygons = 4;
        
        this.geometry.shapeSidesCoefficient = 1;
    }

    public setShapeGeometry(): RectangleGeometry {
        this.geometry.polygons = this.normalizePolygons();
        
        return this.setGeometry();
    }
    
    public resetShapeGeometry(): RectangleGeometry {
        return this.setGeometry();
    }
    
    public setGeometry(): RectangleGeometry {

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
    
    private referencePoints (): Array<number> {
        let geometry = this.geometry;

        if (geometry.referencePoints) {
            if (geometry.referencePoints.length / 2 < this.minPolygons) {
                throw("Rectangle shape should contain at least" + 
                    this.minPolygons + "reference points");
            }
            
            return geometry.referencePoints;
        }

        geometry.referencePoints = [
            (<Rectangle>geometry).x, (<Rectangle>geometry).y,
            (<Rectangle>geometry).x + (<Rectangle>geometry).width, (<Rectangle>geometry).y,
            (<Rectangle>geometry).x + (<Rectangle>geometry).width, 
            (<Rectangle>geometry).y + (<Rectangle>geometry).height,
            (<Rectangle>geometry).x, (<Rectangle>geometry).y + (<Rectangle>geometry).height
        ];
        
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
            this.advanced.interpolationPointsPerSegment, this.advanced.bezierTensionFactor);

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
        let eInt = new EasingInterpolation([this]);
        
        let frames = (this.geometry.polygons - refPoints.length / 2) /
            this.geometry.shapeSidesCoefficient;

        for (let i = 0; i < refPoints.length - 2; i+=2) {
            vecA = [refPoints[i], refPoints[i+1]];
            vecB = [refPoints[i+2], refPoints[i+3]];

            points = eInt.easingInterpolation(vecA, vecB, 0, frames,
                eInt[this.advanced.xEasing], eInt[this.advanced.yEasing]);

            trajectoryPoints.push(points);
        }
        
        vecA = [refPoints[refPoints.length - 2], refPoints[refPoints.length - 1]];
        vecB = [refPoints[0], refPoints[1]];

        if (frames > 0) {
            points = eInt.easingInterpolation(vecA, vecB, 0, frames,
                eInt[this.advanced.xEasing], eInt[this.advanced.yEasing]);
        } else {
            points = refPoints;
        }

        trajectoryPoints.push(points);
        
        return HELPER.flattenArray(trajectoryPoints);
    }
}