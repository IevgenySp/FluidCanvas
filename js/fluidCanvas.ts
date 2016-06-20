/**
 * Created by isp on 4/9/16.
 */

import * as _ from 'lodash';

import {Shapes, ShapeParameters, TransformObject} from "./Interfaces/shapeInterfaces";
import Storage from './Storage/storage';
import Geometry from './Geometry/shapes';
import CircleGeometry from './Geometry/circle';
import RectangleGeometry from './Geometry/rectangle';
import PolygonGeometry from './Geometry/polygon';
import LineGeometry from './Geometry/line';
import BezierLineGeometry from './Geometry/bezierLine';
import Render from './Render/render';
import Animation from './Animation/animation';
import {INTERPOLATION, SYSTEM_PARAMETERS, SHAPES_PARAMETERS, SHAPES, RENDER_SHAPES} from './Utils/globals';
import LinearInterpolation from './Interpolation/linear';
import EasingInterpolation from './Interpolation/easing';
import BezierInterpolation from './Interpolation/bezier';
import {InterpolationParameters} from './Interfaces/interpolationInterfaces';
import Constructor from './Constructor/shapesConstructor';

export default class FluidCanvas {
    storage: any;
    geometry: any;
    renderer: any;
    shapesConstructor: any;
    context: CanvasRenderingContext2D;
    constructor (context: CanvasRenderingContext2D) {
        this.context = context;
        this.storage = new Storage();
        this.geometry = new Geometry();
        this.renderer = new Render(this.context);
        this.shapesConstructor = new Constructor();
    }

    /**
     * Main method to create shape points geometry and place shape into storage
     * @param shape
     * @param parameters
     * @returns {Shapes}
     */
    public setPoints(shape: Shapes, parameters?: ShapeParameters): Shapes {
        if (!shape) return;

        let shapeGeometry;
        let interpolation;
        let frames;
        let tensionFactor;
        let easing;
        let params;
        let renderType;

        if (parameters) {
            interpolation = parameters.interpolationType || INTERPOLATION.noInterpolation;
            frames = parameters.frames || SYSTEM_PARAMETERS.renderingInterpolationStep;
            tensionFactor = parameters.tensionFactor || SHAPES_PARAMETERS.bezierTension;
            easing = parameters.easing || INTERPOLATION.linearTween;
            renderType = parameters.renderType || RENDER_SHAPES.line;
        } else {
            interpolation = INTERPOLATION.noInterpolation;
            frames = SYSTEM_PARAMETERS.renderingInterpolationStep;
            tensionFactor = SHAPES_PARAMETERS.bezierTension;
            easing = INTERPOLATION.linearTween;
            renderType = RENDER_SHAPES.line;
        }

        params = {
            frames: frames,
            tensionFactor: tensionFactor,
            easing: easing
        };

        switch (shape.type) {
            case SHAPES.circle:
                shapeGeometry = new CircleGeometry(params);
                shapeGeometry.setPoints(shape, interpolation);
                break;
            case SHAPES.rectangle:
                shapeGeometry = new RectangleGeometry(params);
                shapeGeometry.setPoints(shape, interpolation);
                break;
            case SHAPES.polygon:
                shapeGeometry = new PolygonGeometry(params);
                shapeGeometry.setPoints(shape, interpolation);
                break;
            case SHAPES.line:
                shapeGeometry = new LineGeometry(params);
                shapeGeometry.setPoints(shape, interpolation);
                break;
            case SHAPES.bezierLine:
                shapeGeometry = new BezierLineGeometry(params);
                shapeGeometry.setPoints(shape, interpolation);
        }

        this.geometry.setPointsRenderState(shape, false);
        this.geometry.setPointsRenderType(shape, renderType);

        this.storage.setShape(shape);

        return shape;
    }

    /**
     * Get all available points
     * @returns {Map<string, Shapes>}
     */
    public getPoints() {
        return this.storage.getShapes();
    }

    /**
     * Set same id for group of shapes points
     * @param pointsArr
     * @returns {any}
     */
    public defineCompositePoints(pointsArr: Array<Shapes>): Array<Shapes> {
        return this.storage.defineCompositeShape(pointsArr);
    }

    /**
     * Get coordinates to transform/move shape into another position/shape
     * @param startShape
     * @param endShape
     * @param interpolation
     * @param parameters
     * @returns {{shape: Shapes, iterator: any}}
     */
    public transform (
        startShape: Shapes,
        endShape: Shapes,
        interpolation: string,
        parameters?: InterpolationParameters): TransformObject {

        let trajectoryPoints;
        let newShape = _.clone(endShape);

        this.geometry.normalizePolygons(startShape, endShape);
        this.geometry.resetPoints([startShape, endShape]);

        switch (interpolation) {
            default:
            case INTERPOLATION.linear:
                trajectoryPoints = parameters ?
                    new LinearInterpolation(startShape, endShape, parameters) :
                    new LinearInterpolation(startShape, endShape);
                break;
            case INTERPOLATION.easing:
                trajectoryPoints = parameters ?
                    new EasingInterpolation(startShape, endShape, parameters) :
                    new EasingInterpolation(startShape, endShape);
                break;
            case INTERPOLATION.bezier:
                trajectoryPoints = parameters ?
                    new BezierInterpolation(startShape, endShape, parameters) :
                    new BezierInterpolation(startShape, endShape);
        }

        let iterator = trajectoryPoints.iterator();

        this.storage.deleteShape(startShape.id);

        newShape = this.setPoints(newShape);

        this.storage.setTransformationIterator(newShape.id, iterator);

        return {
            shape: newShape,
            iterator: iterator
        };
    }

    /**
     * Animate points transformation
     */
    public animate (): void {
        let shapes = this.storage.getShapes();
        let iterators = this.storage.getTransformationIterators();

        let animation = new Animation();
        let callback =
            this.animationCallback.bind(this, shapes, iterators);
        let stop = this.animationStopCondition.bind(this);

        animation.animate(callback, stop);
    }

    /**
     * Condition to start animation
     * @param shapes
     * @param iterators
     */
    private animationCallback(
        shapes: Map<any, any>, iterators: Map<any, any>) {

        let self = this;

        this.clear();

        iterators.forEach(function(iterator, key) {
            let nextArr = iterator.next().value;
            let nextShape: any = shapes.get(key);

            if (typeof nextArr !== 'undefined' && typeof nextShape !== 'undefined') {
                nextShape.points = [];

                for (let i = 0; i < nextArr.length; i++) {
                    nextShape.points.push(nextArr[i]);
                }

                self.render(nextShape, nextShape.renderType);

            } else {
                self.geometry.setPointsRenderState(nextShape, true);

                self.storage.deleteTransformationIterator(key);
            }
        });

        shapes.forEach(function(shape, key) {
            if (shape.isRendered) {
                self.render(shape, shape.renderType);
            }
        });

    }

    /**
     * Condition to stop animation
     * @returns {boolean}
     */
    private animationStopCondition() {
        return this.storage.getTransformationIterators().size === 0;
    }

    /**
     * Render shape, possible render primitives: line, point
     * @param shape
     * @param type
     */
    public render (shape: Shapes, type: string): void {
        this.renderer.render(shape, type);

        this.geometry.setPointsRenderState(shape, true);
    }

    /**
     * Clear canvas
     */
    public clear () {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    /**
     * Provide instance of shapes constructor
     * @returns {any}
     */
    public getShapesConstructor(): any {
        return this.shapesConstructor;
    }
}
