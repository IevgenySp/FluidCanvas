/**
 * Created by isp on 4/9/16.
 */

import * as _ from 'lodash';

import {Shape, Bezier, ShapePoints, ShapeAdvancedOptions} from
    "./../Interfaces/shapeInterfaces";
import {INTERPOLATION, SYSTEM_PARAMETERS, SHAPES,
    INTERPOLATION_STEP} from './../Utils/globals';
import {HELPER} from './../Utils/helper';

import ShapesConstructor from './../ShapesConstructor/ShapesConstructor';
import CircleGeometry from './Circle';
import RectangleGeometry from './Rectangle';
import PolygonGeometry from './Polygon';
import LineGeometry from './Line';
import BezierLineGeometry from './BezierLine';
import TextGeometry from './Text';

import LinearInterpolation from './../Interpolation/Linear';
import EasingInterpolation from './../Interpolation/Easing';
import BezierInterpolation from './../Interpolation/Bezier';

let ADVANCED_OPTIONS = {
    frames:                        SYSTEM_PARAMETERS.frames,
    startFrame:                    SYSTEM_PARAMETERS.startFrame,
    bezierTensionFactor:           SYSTEM_PARAMETERS.bezierTension,
    interpolationPointsPerSegment: SYSTEM_PARAMETERS.interpolationPointsPerSegment,
    isPolygonRender:               SYSTEM_PARAMETERS.isPolygonRender,
    drawAsCanvasShape:             SYSTEM_PARAMETERS.drawAsCanvasShape,
    polygonsPerShape:              SYSTEM_PARAMETERS.polygonsPerShape,
    xEasing:                       INTERPOLATION.linearTween,
    yEasing:                       INTERPOLATION.linearTween,
    interpolationStep:             INTERPOLATION_STEP.linear,
    interpolation:                 INTERPOLATION.noInterpolation
};

export default class ShapesGeometry extends ShapesConstructor implements ShapePoints {
    constructor() {
        super();
    }

    /**
     * Initialize geometry object
     * @param shape
     * @returns {any}
     */
    public initGeometry(shape: any): Shape {

        let type = shape.type.toUpperCase();
        
        shape.advanced = shape.advanced ?
            HELPER.mergeOptions({}, shape.advanced, ADVANCED_OPTIONS) :
            ADVANCED_OPTIONS;
        
        shape.style = shape.style || {};

        let shapeGeometry;

        switch (type) {
            case SHAPES.circle.toUpperCase():
                shapeGeometry = new CircleGeometry(shape);
                shapeGeometry.setShapeGeometry();
                break;
            case SHAPES.rectangle.toUpperCase():
                shapeGeometry = new RectangleGeometry(shape);
                shapeGeometry.setShapeGeometry();
                break;
            case SHAPES.polygon.toUpperCase():
                shapeGeometry = new PolygonGeometry(shape);
                shapeGeometry.setShapeGeometry();
                break;
            case SHAPES.line.toUpperCase():
                shapeGeometry = new LineGeometry(shape);
                shapeGeometry.setShapeGeometry();
                break;
            case SHAPES.bezierLine.toUpperCase():
                shapeGeometry = new BezierLineGeometry(shape);
                shapeGeometry.setShapeGeometry();
                break;
            case SHAPES.text.toUpperCase():
                shapeGeometry = new TextGeometry(shape);
                shapeGeometry.setShapeGeometry();
        }

        return shapeGeometry;
    }


    /**
     * Set equal amount of polygons for shapes
     * @param startGeometry
     * @param endGeometry
     */
    protected normalizePolygons(startGeometry: Shape,
                                endGeometry: Shape): number {

        let startPolygons = startGeometry.geometry.polygons;
        let endPolygons = endGeometry.geometry.polygons;
        let sShapeSides = startGeometry.geometry.shapeSidesCoefficient;
        let eShapeSides = endGeometry.geometry.shapeSidesCoefficient;
        let normalizedPolygons;
        
        if (startGeometry.type === SHAPES.bezierLine ||
            endGeometry.type === SHAPES.bezierLine) {
            normalizedPolygons =
                this.normalizeBezierPolygons(startGeometry, endGeometry);
        } else if (startPolygons === endPolygons) {
            normalizedPolygons = startPolygons;
        } else {
            normalizedPolygons = HELPER.commonMultiple(
                startPolygons, endPolygons, sShapeSides, eShapeSides);
        }

        return normalizedPolygons;
    }

    /**
     * Set equal amount of polygons for bezier shapes
     * @param startGeometry
     * @param endGeometry
     */
    protected normalizeBezierPolygons(startGeometry: Shape,
                                      endGeometry: Shape): void {

        let startPolygons = startGeometry.geometry.polygons;
        let endPolygons = endGeometry.geometry.polygons;

        let sShapeSides = startGeometry.type === SHAPES.bezierLine ?
            startGeometry.geometry.referencePoints.length - 1 :
            startGeometry.geometry.shapeSidesCoefficient;
        let eShapeSides = endGeometry.type === SHAPES.bezierLine ?
            endGeometry.geometry.referencePoints.length - 1 :
            endGeometry.geometry.shapeSidesCoefficient;

        let nPolygons = HELPER.commonMultiple(
            startPolygons, endPolygons, sShapeSides, eShapeSides);

        startPolygons = endPolygons = nPolygons;

        if (startGeometry.type === SHAPES.bezierLine.toUpperCase()) {
            (<Bezier>startGeometry.advanced).bezierSegmentsNumber =
                nPolygons / sShapeSides - 1;
        }

        if (endGeometry.type === SHAPES.bezierLine.toUpperCase()) {
            (<Bezier>endGeometry.advanced).bezierSegmentsNumber = nPolygons / eShapeSides - 1;
        }
    }

    /**
     * Convert shape into polygon shape
     * @param geometryShape
     * @returns {PolygonGeometry}
     */
    public convertToPolygon(geometryShape: Shape): Shape {
        let polygonShape;

        let polygonObj = {
            type: SHAPES.polygon.toUpperCase(),
            geometry: {
                referencePoints: geometryShape.geometry.referencePoints,
                polygons: geometryShape.geometry.polygons
            },
            advanced: _.clone(geometryShape.advanced),
            style: _.clone(geometryShape.style),
            isRendered: geometryShape.isRendered
        };

        polygonObj.advanced.drawAsCanvasShape = false;

        if (!geometryShape.advanced.isPolygonRender) {
            polygonObj.style.isFill = geometryShape.type ===
                (SHAPES.line.toUpperCase() || SHAPES.bezierLine.toUpperCase()) ?
                true : polygonObj.style.isFill;
        }

        polygonShape = new PolygonGeometry(<Shape>polygonObj);

        return polygonShape.resetShapeGeometry();
    }

    /**
     * Should be defined in child classes
     */
    public setShapeGeometry(): void {
        
        console.log("Method should be implemented in child classes");
    }

    /**
     * Reset geometry for array of shapes
     * @param shapes
     * @returns {Array<Shape>}
     */
    public resetShapesGeometry(shapes: Array<any>): Array<any> {

        for (let i = 0; i < shapes.length; i++) {
            shapes[i].resetShapeGeometry();
        }

        return shapes;
    }
    
    public setShapeRenderState(shape: Shape, state: boolean): void {
        if (!shape) return;

        shape.isRendered = state;
    }
    
    public setShapeRenderType(shape: Shape, isPolygonRender: boolean): void {
        if (!shape || !shape.advanced) return;

        shape.advanced.isPolygonRender = isPolygonRender;
    }

    //TODO Create mapping points mechanism
    private static rearrangePoints(startGeometry: Shape,
                                   endGeometry: Shape): void {

    }

    /**
     * Get coordinates to transform/move shape into another position/shape
     * @param startShape
     * @param endShape
     * @param options
     * @returns {{geometry: Shape, iterator: IterableIterator<Float32Array>, trajectoryPoints: Array<Float32Array>}}
     */
    public transformShape (
        startShape: Shape,
        endShape: Shape,
        options?: ShapeAdvancedOptions): 
                {geometry: Shape, iterator: IterableIterator<Float32Array>,
                frames: number} {
        
        if (startShape.type === SHAPES.text.toUpperCase() ||
        endShape.type === SHAPES.text.toUpperCase()) {
            throw new Error('Shape of type ' + SHAPES.text.toUpperCase() +
                ' cannot be used in transformations');
        }

        let trajectoryPoints;
        let interpolationOptions = options || startShape.advanced;
        let interpolation = options && options.interpolation ||
            startShape.advanced.interpolation;
        let transformedShape;
        let normalizedPolygons =
            this.normalizePolygons(startShape, endShape);

        startShape.geometry.polygons = normalizedPolygons;
        endShape.geometry.polygons = normalizedPolygons;
        
        this.resetShapesGeometry([startShape, endShape]);
        
        switch (interpolation) {
            default:
            case INTERPOLATION.linear:
                trajectoryPoints =
                    new LinearInterpolation([startShape, endShape]);
                break;
            case INTERPOLATION.easing:
                trajectoryPoints =
                    new EasingInterpolation([startShape, endShape]);
                break;
            case INTERPOLATION.bezier:
                trajectoryPoints =
                    new BezierInterpolation([startShape, endShape]);
        }

        transformedShape = this.convertToPolygon(startShape);
        
        return {
            geometry: transformedShape,
            iterator: trajectoryPoints.iterator(),
            frames: trajectoryPoints.frames,
        };
    }

    /**
     * Get coordinates to transform/move already generated shape into another position/shape
     * @param startShape
     * @param endShape
     * @param options
     * @returns {{geometry: (Shape|any), iterator: (any|any<Float32Array>|IterableIterator<Float32Array>), frames: (number|any|Window), colors: {start: (string|string), end: (string|string)}}}
     */
    public transformPreparedShape(startShape: Shape,
                                endShape: Shape,
                                options?: ShapeAdvancedOptions):
    {geometry: Shape, iterator: IterableIterator<Float32Array>,
        frames: number, colors: any} {
        let trajectoryPoints;
        let interpolationOptions = options || startShape.advanced;
        let interpolation = options && options.interpolation ||
            startShape.advanced.interpolation;
        let transformedShape;
        
        switch (interpolation) {
            default:
            case INTERPOLATION.linear:
                trajectoryPoints =
                    new LinearInterpolation([startShape, endShape]);
                break;
            case INTERPOLATION.easing:
                trajectoryPoints =
                    new EasingInterpolation([startShape, endShape]);
                break;
            case INTERPOLATION.bezier:
                trajectoryPoints =
                    new BezierInterpolation([startShape, endShape]);
        }

        transformedShape = this.convertToPolygon(startShape);
        
        return {
            geometry: transformedShape,
            iterator: trajectoryPoints.iterator(),
            frames: trajectoryPoints.frames,
            colors: {
                start: startShape.style.color || SYSTEM_PARAMETERS.baseShapeColor,
                end: endShape.style.color || SYSTEM_PARAMETERS.baseShapeColor,
            }
        };
    }
}
