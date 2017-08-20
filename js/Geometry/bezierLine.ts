/**
 * Created by isp on 6/5/16.
 */

import {HELPER} from './../Utils/helper';
import {INTERPOLATION, SYSTEM_PARAMETERS} from './../Utils/globals';
import {Shapes, Shape,
    ShapeAdvancedOptions, ShapeStyle} from "./../Interfaces/shapeInterfaces";
import LinearInterpolation from './../Interpolation/Linear';
import BezierInterpolation from './../Interpolation/Bezier';
import EasingInterpolation from './../Interpolation/Easing';

export default class BezierLineGeometry {
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

    public setShapeGeometry(): BezierLineGeometry {
        this.geometry.polygons = this.normalizePolygons();

        return this.setGeometry();
    }

    public resetShapeGeometry(): BezierLineGeometry {
        return this.setGeometry();
    }
    
    public setGeometry(): BezierLineGeometry {

        let geometry = this.geometry;

        if (geometry.referencePoints.length < 4) {
            throw ('BezierLine shape should consists from at least two pairs of XY points');
        }
        
        switch (this.advanced.interpolation) {
            case INTERPOLATION.noInterpolation:
                geometry.points = HELPER.setPointsToBuffer(
                    this.linearPoints(),
                    SYSTEM_PARAMETERS.dimensions);
                break;
            case INTERPOLATION.linear:
                geometry.points = HELPER.setPointsToBuffer(
                    this.linearIntPoints(),
                    SYSTEM_PARAMETERS.dimensions);
                break;
            case INTERPOLATION.bezier:
                geometry.points = HELPER.setPointsToBuffer(
                    this.bezierIntPoints(),
                    SYSTEM_PARAMETERS.dimensions);
                break;
            case INTERPOLATION.easing:
                geometry.points = HELPER.setPointsToBuffer(
                    this.easingIntPoints(),
                    SYSTEM_PARAMETERS.dimensions);
        }

        return this;
    }

    /**
     * Define polygons number for circle shape
     * @returns {number}
     */
    private normalizePolygons(): number {

        let polygons;
        let geometry = this.geometry;

        if (!geometry.polygons)
            polygons = 0;

        if (geometry.points) {

            polygons = Math.max(geometry.polygons,
                SYSTEM_PARAMETERS.polygonsPerShape,
                geometry.points.length / 2);

        } else if (geometry.referencePoints) {

            polygons = geometry.referencePoints.length / 2;

        } else {
            polygons =
                Math.max(geometry.polygons, SYSTEM_PARAMETERS.polygonsPerShape);
        }

        // this.shape.geometry.referencePoints.length not divided by 2 since same amount
        // of reversed points for contour will be added
        // TODO normalize SHAPES_PARAMETERS.bezierSegmentsNumber and 
        // TODO SYSTEM_PARAMETERS.renderingInterpolationStep parameters
        polygons = geometry.points ? geometry.points.length / 2 : 
            (geometry.referencePoints.length - 1) *
            (SYSTEM_PARAMETERS.interpolationPointsPerSegment + 1);

        return polygons;
    }

    //TODO Implement reset points method
    private resetPoints() {

    }

    public linearPoints (): Array<number> {
        let referencePoints = this.geometry.referencePoints;
        
        let pnts = [];

        for (let i = 0; i < referencePoints.length; i++) {
            pnts.push(referencePoints[i]);
        }

        // Reverse points, needs to create shape from line
        let rpnts = [];

        for (let i = pnts.length - 1; i >= 0; i -= 2) {
            rpnts.push(pnts[i-1]);
            rpnts.push(pnts[i]);
        }

        pnts = HELPER.flattenArray(rpnts, pnts);
        
        let bInt = new BezierInterpolation([this]);

        let frames = this.geometry.polygons /
            (referencePoints.length - 1) - 1;

        return bInt.cardinalSplines(pnts, this.advanced.bezierTensionFactor, false, frames);
    }

    public linearIntPoints (): Array<number> {
        let polygonVectors = [];
        let pnts = this.linearPoints();

        let polygonPoints = [];

        // Reverse points, needs to create shape from line
        let rpnts = [];

        for (let i = pnts.length - 1; i >= 0; i -= 2) {
            rpnts.push(pnts[i-1]);
            rpnts.push(pnts[i]);
        }

        pnts = HELPER.flattenArray(rpnts, pnts);

        let lInt = new LinearInterpolation([this]);

        for (let i = 0; i < pnts.length - 2; i += 2) {
            polygonVectors.push(HELPER.getVectorLength(pnts[i], pnts[i+1], pnts[i+2], pnts[i+3]));
        }

        let sumVector = polygonVectors.reduce(function(a, b) { return a + b; }, 0);
        let pointsPerSegment = [];

        for (let i = 0; i < polygonVectors.length; i ++) {
            pointsPerSegment.push(polygonVectors[i] / sumVector);
        }

        let polygons = this.geometry.polygons - pnts.length / 2;
        
        if (polygons !== 0) {

            let pointsInVector = HELPER.splitPoints(pointsPerSegment, polygons);

            polygonPoints = lInt.getPointsOnVectors(pnts, pointsInVector, true);

        } else {
            polygonPoints = pnts;
        }

        return polygonPoints;
    }

    public bezierIntPoints (): Array<number> {
        let basePoints = this.linearPoints();
        let trajectoryPoints = [];
        let points;

        // Reverse points, needs to create shape from line
        let rpnts = [];

        for (let i = basePoints.length - 1; i >= 0; i -= 2) {
            rpnts.push(basePoints[i-1]);
            rpnts.push(basePoints[i]);
        }
        
        basePoints = HELPER.flattenArray(rpnts, basePoints);

        let bInt = new BezierInterpolation([this]);

        for (let i = 0; i < basePoints.length - 2; i+=2) {
            let vecA = [basePoints[i], basePoints[i+1]];
            let vecB = [basePoints[i+2], basePoints[i+3]];

            points = bInt.bezierInterpolation(vecA, vecB, 
                this.advanced.interpolationPointsPerSegment, this.advanced.bezierTensionFactor);

            trajectoryPoints.push(points);
        }

        let vecA = [basePoints[basePoints.length - 2], basePoints[basePoints.length - 1]];
        let vecB = [basePoints[0], basePoints[1]];

        points = bInt.bezierInterpolation(vecA, vecB, 
            this.advanced.interpolationPointsPerSegment, this.advanced.bezierTensionFactor);

        trajectoryPoints.push(points);

        return HELPER.flattenArray(trajectoryPoints);
    }

    public easingIntPoints (): Array<number> {
        let basePoints = this.linearPoints();
        let trajectoryPoints = [];
        let points;

        // Reverse points, needs to create shape from line
        let rpnts = [];

        for (let i = basePoints.length - 1; i >= 0; i -= 2) {
            rpnts.push(basePoints[i-1]);
            rpnts.push(basePoints[i]);
        }
        
        basePoints = HELPER.flattenArray(rpnts, basePoints);

        let frames = (this.geometry.polygons - basePoints.length / 2) /
            this.geometry.shapeSidesCoefficient;

        let eInt = new EasingInterpolation([this]);

        for (let i = 0; i < basePoints.length - 2; i+=2) {
            let vecA = [basePoints[i], basePoints[i+1]];
            let vecB = [basePoints[i+2], basePoints[i+3]];

            points = eInt.easingInterpolation(vecA, vecB, 0, frames,
                eInt[this.advanced.xEasing], eInt[this.advanced.yEasing]);

            trajectoryPoints.push(points);
        }
        
        let vecA = [basePoints[basePoints.length - 2], basePoints[basePoints.length - 1]];
        let vecB = [basePoints[0], basePoints[1]];

        if (frames > 0) {
            points = eInt.easingInterpolation(vecA, vecB, 0, frames,
                eInt[this.advanced.xEasing], eInt[this.advanced.yEasing]);
        } else {
            points = basePoints;
        }

        trajectoryPoints.push(points);
        
        return HELPER.flattenArray(trajectoryPoints);
    }
}