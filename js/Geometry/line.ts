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

export default class LineGeometry {
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

    public setShapeGeometry(): LineGeometry {
        this.geometry.polygons = this.normalizePolygons();

        return this.setGeometry();
    }

    public resetShapeGeometry(): LineGeometry {
        return this.setGeometry();
    }
    
    public setGeometry(): LineGeometry {

        let geometry = this.geometry;
        
        geometry.reversePoints = 
            this.getReversePoints(geometry.referencePoints);

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
        return this.contourPoints().length / 2;
    }

    private getReversePoints(points: Array<number>): Array<number> {
        // Reverse points, needs to create shape from line
        let reversePoints = [];

        //var x = 575 + 20 * (100-50) / Math.sqrt(Math.pow((545 - 575), 2) + Math.pow((100 - 50), 2));
        //var y = 50 - 20 * (545-575) / Math.sqrt(Math.pow((545-575), 2) + Math.pow((100-50), 2));

        //let dX, dY;
        let offset = this.style.lineWidth && this.style.lineWidth > 1 ?
            this.style.lineWidth : SYSTEM_PARAMETERS.lineWidth;
        let segments = [];

        //Skip start and end values as a duplicates for creating contour
        for (let i = points.length - 1; i >= 2; i -= 2) {
            segments.push([points[i-1], points[i], points[i-3], points[i-2]]);
        }

        //var Dx = Cx + offset * (Ay - By) / Math.sqrt(Math.pow((Ax - Bx), 2) + Math.pow((Ay - By), 2));
        //var Dy = Cy - offset * (Ax - Bx) / Math.sqrt(Math.pow((Ax - Bx), 2) + Math.pow((Ay - By), 2));

        let lastSetPair = [];

        segments.forEach((arr) => {
            let dXFirst, dYFirst, dXSecond, dYSecond;

            dXFirst = arr[0] + offset * (arr[3] - arr[1]) /
                Math.sqrt(Math.pow((arr[2] - arr[0]), 2) + Math.pow((arr[3] - arr[1]), 2));
            dYFirst = arr[1] - offset * (arr[2] - arr[0]) /
                Math.sqrt(Math.pow((arr[2] - arr[0]), 2) + Math.pow((arr[3] - arr[1]), 2));
            dXSecond = arr[2] + offset * (arr[3] - arr[1]) /
                Math.sqrt(Math.pow((arr[2] - arr[0]), 2) + Math.pow((arr[3] - arr[1]), 2));
            dYSecond = arr[3] - offset * (arr[2] - arr[0]) /
                Math.sqrt(Math.pow((arr[2] - arr[0]), 2) + Math.pow((arr[3] - arr[1]), 2));

            if (lastSetPair.length > 0 && dXFirst === lastSetPair[0] &&
                dYFirst === lastSetPair[1]) {
                reversePoints.push(dXSecond, dYSecond);
            } else {
                reversePoints.push(dXFirst, dYFirst, dXSecond, dYSecond);
            }

            lastSetPair = [dXSecond, dYSecond];

        });

        //reversePoints.push(points[0], points[1]);
        
        return reversePoints;
    }
    
    public referencePoints (): Array<number> {
        let geometry = this.geometry;

        if (geometry.referencePoints.length < 4) {
            throw new Error('Line shape should consists from at least two pairs of XY points');
        }

        return geometry.referencePoints;
    }
    
    public contourPoints (): Array<number> {
        let referencePoints = this.referencePoints();
        let reversePoints = this.getReversePoints(referencePoints);
        
        return HELPER.flattenArray(reversePoints, referencePoints);
    }

    public linearPoints (): Array<number> {
        let refPoints = this.contourPoints();
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

        sumVector = lineVectors.reduce((a, b) => { return a + b; }, 0);

        for (let i = 0; i < lineVectors.length; i ++) {
            pointsPerSegment.push(lineVectors[i] / sumVector);
        }

        // polygons - 1 since line contour is not linked at the ends
        pointsInVector = HELPER.splitPoints(pointsPerSegment, polygons - 1);
        
        return lInt.getPointsOnVectors(refPoints, pointsInVector, true, false);
    }
    
    public bezierPoints (): Array<number> {
        let referencePoints = this.geometry.referencePoints;

        let basePoints = [];
        let trajectoryPoints = [];
        let points;

        for (let i = 0; i < referencePoints.length; i++) {
            basePoints.push(referencePoints[i]);
        }

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

    public easingPoints (): Array<number> {
        let referencePoints = this.geometry.referencePoints;

        let basePoints = [];
        let trajectoryPoints = [];
        let points;

        for (let i = 0; i < referencePoints.length; i++) {
            basePoints.push(referencePoints[i]);
        }

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