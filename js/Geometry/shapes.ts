/**
 * Created by isp on 4/9/16.
 */

import {Shapes, Bezier, ShapePoints} from "./../Interfaces/shapeInterfaces";
import {INTERPOLATION, SYSTEM_PARAMETERS, SHAPES_PARAMETERS, SHAPES, RENDER_SHAPES, INTERPOLATION_STEP} from './../Utils/globals';
import {HELPER} from './../Utils/helper';

export default class ShapesGeometry implements ShapePoints {
    params: any;
    constructor(parameters?: any) {
        this.params = parameters? 
            ShapesGeometry.initParameters(parameters) : 
            ShapesGeometry.initParameters();
    }

    public shapeSidesCoef(shape: Shapes): number {
        let sidesCoef = 1;

        switch (shape.type) {
            default:
            case SHAPES.circle:
            case SHAPES.line:
            case SHAPES.bezierLine:
                sidesCoef = 1;
                break;
            case SHAPES.rectangle:
                sidesCoef = 4;
                break;
            case SHAPES.polygon:
                sidesCoef = shape.pnts.length / 2 - 1;
        }

        return sidesCoef;
    }

    public setPolygons(shape: Shapes): number {
        if (!shape) return;

        if (!shape.polygons) shape.polygons = 0;

        let rawPolygons = shape.points ? shape.points.length / 2 : shape.pnts ?
            Math.max(shape.polygons, SYSTEM_PARAMETERS.polygons, shape.pnts.length / 2) :
            Math.max(shape.polygons, SYSTEM_PARAMETERS.polygons);
        let optimizedPolygons;

        switch (shape.type) {
            default:
            case SHAPES.circle:
                optimizedPolygons = rawPolygons;
                break;
            case SHAPES.rectangle:
            case SHAPES.polygon:
                optimizedPolygons = HELPER.pointsInShape(rawPolygons,
                    this.shapeSidesCoef(shape));
                break;
            case SHAPES.line:
                // shape.pnts.length not divided by 2 since same amount
                // of reversed points for contour will be added
                optimizedPolygons = shape.points ? shape.points.length / 2 : shape.polygons ?
                    Math.max(shape.polygons, shape.pnts.length) :
                    shape.pnts.length;
                break;
            case SHAPES.bezierLine:
                // shape.pnts.length not divided by 2 since same amount
                // of reversed points for contour will be added
                // TODO normalize SHAPES_PARAMETERS.bezierSegmentsNumber and SYSTEM_PARAMETERS.renderingInterpolationStep parameters
                optimizedPolygons = shape.points ? shape.points.length / 2 : (shape.pnts.length - 1) *
                    (SYSTEM_PARAMETERS.interpolationPointsPerSegment + 1)
        }

        return optimizedPolygons;
    }

    protected normalizePolygons(startShape: Shapes, endShape: Shapes): void {
        if (startShape.type === SHAPES.bezierLine || endShape.type === SHAPES.bezierLine) {
            this.normalizeBezierPolygons(startShape, endShape);
        } else if (startShape.polygons === endShape.polygons) {
            return;
        } else {
            let sShapeSides = this.shapeSidesCoef(startShape);
            let eShapeSides = this.shapeSidesCoef(endShape);
            let nPolygons = HELPER.commonMultiple(
                startShape.polygons, endShape.polygons, sShapeSides, eShapeSides);
            
            startShape.polygons = endShape.polygons = nPolygons;
        }
    }

    protected normalizeBezierPolygons(startShape: Shapes, endShape: Shapes): void {
        let sShapeSides = startShape.type === SHAPES.bezierLine ?
        startShape.pnts.length - 1 : this.shapeSidesCoef(startShape);
        let eShapeSides = endShape.type === SHAPES.bezierLine ?
        endShape.pnts.length - 1 : this.shapeSidesCoef(endShape);

        let nPolygons = HELPER.commonMultiple(
            startShape.polygons, endShape.polygons, sShapeSides, eShapeSides);

        startShape.polygons = endShape.polygons = nPolygons;

        if (startShape.type === SHAPES.bezierLine) {
            (<Bezier>startShape).bezierSegmentsNumber = nPolygons / sShapeSides - 1;
        }

        if (endShape.type === SHAPES.bezierLine) {
            (<Bezier>endShape).bezierSegmentsNumber = nPolygons / eShapeSides - 1;
        }
    }

    public setPoints(shape: Shapes, interpolation: string): Shapes {
        
        // Method should be implemented in child classes
        
        return shape;
    }
    
    public resetPoints(shapes: Array<Shapes>, interpolationType: string): Array<Shapes> {
        for (let i = 0; i < shapes.length; i++) {
            shapes[i].geometry.resetPoint(shapes[i]);
        }
        
        return shapes;
    }

    private static initParameters (parameters?: any): any {
        let params = {
            frames:                        SYSTEM_PARAMETERS.frames,
            startFrame:                    SYSTEM_PARAMETERS.startFrame,
            bezierTensionFactor:           SHAPES_PARAMETERS.bezierTension,
            interpolationPointsPerSegment: SYSTEM_PARAMETERS.interpolationPointsPerSegment,
            xEasing:                       INTERPOLATION.linearTween,
            yEasing:                       INTERPOLATION.linearTween,
            easingType:                    INTERPOLATION_STEP.linear,
            interpolationType:             INTERPOLATION.noInterpolation
        };

        for (let key in params) {
            if (parameters) {
                if(params.hasOwnProperty(key)) {
                    if (parameters[key]) {
                        params[key] = parameters[key];
                    }
                }
            }
        }

        return params;
    }
    
    public setPointsRenderState(shape: Shapes, state: boolean): void {
        if (!shape) return;

        shape.isRendered = state;
    }
    
    public setPointsRenderType(shape: Shapes, type: string): void {
        if (!shape) return;

        shape.renderType = type;
    }

    //TODO Create mapping points mechanism
    private static rearrangePoints(startShape: Shapes, endShape: Shapes): void {}
}
