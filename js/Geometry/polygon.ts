/**
 * Created by isp on 6/5/16.
 */

import {HELPER} from './../Utils/helper';
import {INTERPOLATION, SYSTEM_PARAMETERS} from './../Utils/globals';
import {Shape, Shapes,
    ShapeAdvancedOptions, ShapeStyle} from "./../Interfaces/shapeInterfaces";
import LinearInterpolation from './../Interpolation/Linear';
import BezierInterpolation from './../Interpolation/Bezier';
import EasingInterpolation from './../Interpolation/Easing';

export default class PolygonGeometry {
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

        this.minPolygons = 2;
        
        this.geometry.shapeSidesCoefficient = 1;
    }

    public setShapeGeometry(): PolygonGeometry {
        this.geometry.polygons = this.normalizePolygons();

        return this.setGeometry();
    }

    public resetShapeGeometry(): PolygonGeometry {
        return this.setGeometry();
    }
    
    public setGeometry(): PolygonGeometry {

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

    //TODO Implement reset points method
    private resetPoints() {

    }

    public referencePoints(): Array<number> {
        let geometry = this.geometry;
        
        if (geometry.referencePoints.length / 2 < this.minPolygons) {
            throw new Error("Rectangle shape should contain at least " +
                this.minPolygons + " reference points");
        }

        return geometry.referencePoints;
    }

    public linearPoints (): Array<number> {
        let refPoints = this.referencePoints();
        let polygonVectors = [];
        let pointsPerSegment = [];
        let sumVector;
        let pointsInVector;
        let geometry = this.geometry;
        let polygons = geometry.polygons;
        let lInt = new LinearInterpolation([this]);

        for (let i = 0; i < refPoints.length - 2; i += 2) {
            polygonVectors.push(HELPER.getVectorLength(
                refPoints[i], refPoints[i+1], refPoints[i+2], refPoints[i+3]));
        }

        polygonVectors.push(HELPER.getVectorLength(
            refPoints[refPoints.length - 2],
            refPoints[refPoints.length - 1], refPoints[0], refPoints[1]));

        sumVector = polygonVectors.reduce(function(a, b) { return a + b; }, 0);

        for (let i = 0; i < polygonVectors.length; i ++) {
            pointsPerSegment.push(polygonVectors[i] / sumVector);
        }
        
        pointsInVector = HELPER.splitPoints(pointsPerSegment, polygons);

        return lInt.getPointsOnVectors(refPoints, pointsInVector);
    }
    
    public bezierPoints (): Array<number> {
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
                this.advanced.interpolationPointsPerSegment, this.advanced.bezierTensionFactor);

            trajectoryPoints.push(points);
        }

        vecA = [refPoints[refPoints.length - 2], refPoints[refPoints.length - 1]];
        vecB = [refPoints[0], refPoints[1]];

        points = bInt.bezierInterpolation(vecA, vecB, 
            this.advanced.interpolationPointsPerSegment, this.advanced.bezierTensionFactor);

        trajectoryPoints.push(points);

        return HELPER.flattenArray(trajectoryPoints);
    }

    public easingPoints (): Array<number> {
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