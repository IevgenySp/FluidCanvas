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
import CompositeGeometry from './Geometry/CompositeGeometry/composite';
import Render from './Render/render';
import Animation from './Animation/animation';
import {INTERPOLATION, SYSTEM_PARAMETERS, SHAPES_PARAMETERS, SHAPES, RENDER_SHAPES, INTERPOLATION_STEP} from './Utils/globals';
import LinearInterpolation from './Interpolation/linear';
import EasingInterpolation from './Interpolation/easing';
import BezierInterpolation from './Interpolation/bezier';
import {InterpolationParameters} from './Interfaces/interpolationInterfaces';
import Constructor from './Constructor/shapesConstructor';
import {HELPER} from './Utils/helper';

export default class FluidCanvas {
    storage: any;
    geometry: any;
    compositeGeometry: any;
    renderer: any;
    shapesConstructor: any;
    context: CanvasRenderingContext2D;
    constructor (context: CanvasRenderingContext2D) {
        this.context = context;
        this.storage = new Storage();
        this.geometry = new Geometry();
        this.compositeGeometry = new CompositeGeometry();
        this.renderer = new Render(this.context);
        this.shapesConstructor = new Constructor();
    }

    /**
     * Main method to create shape points geometry and place shape into storage
     * @param shape
     * @param parameters
     * @returns {Shapes}
     */
    public defineShape(shape: Shapes, parameters?: ShapeParameters): Shapes {
        let points = parameters ? 
            this.setPoints(shape, parameters) : 
            this.setPoints(shape);
        
        this.addToStorage(points);
        
        return points;
    }
    
    /**
     * Create shape points geometry
     * @param shape
     * @param parameters
     * @returns {Shapes}
     */
    private setPoints(shape: Shapes, parameters?: ShapeParameters): Shapes {
        if (!shape) return;

        let shapeGeometry;
        let initParams = parameters? 
            FluidCanvas.initParameters(parameters) : 
            FluidCanvas.initParameters();

        switch (shape.type) {
            case SHAPES.circle:
                shapeGeometry = new CircleGeometry(initParams);
                shapeGeometry.setPoints(shape);
                break;
            case SHAPES.rectangle:
                shapeGeometry = new RectangleGeometry(initParams);
                shapeGeometry.setPoints(shape);
                break;
            case SHAPES.polygon:
                shapeGeometry = new PolygonGeometry(initParams);
                shapeGeometry.setPoints(shape);
                break;
            case SHAPES.line:
                shapeGeometry = new LineGeometry(initParams);
                shapeGeometry.setPoints(shape);
                break;
            case SHAPES.bezierLine:
                shapeGeometry = new BezierLineGeometry(initParams);
                shapeGeometry.setPoints(shape);
        }

        this.geometry.setPointsRenderState(shape, false);
        this.geometry.setPointsRenderType(shape, initParams.renderType);
        
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
    public transformShape (
        startShape: Shapes,
        endShape: Shapes,
        interpolation: string,
        parameters?: InterpolationParameters): TransformObject {
        
        let trajectoryPoints;
        let initParams = parameters?
            FluidCanvas.initInterpolationParameters(parameters) :
            FluidCanvas.initInterpolationParameters();

        this.geometry.normalizePolygons(startShape, endShape);
        this.geometry.resetPoints([startShape, endShape]);

        switch (interpolation) {
            default:
            case INTERPOLATION.linear:
                trajectoryPoints = new LinearInterpolation([startShape, endShape], initParams);
                break;
            case INTERPOLATION.easing:
                trajectoryPoints = new EasingInterpolation([startShape, endShape], initParams);
                break;
            case INTERPOLATION.bezier:
                trajectoryPoints = new BezierInterpolation([startShape, endShape], initParams);
        }

        let iterator = trajectoryPoints.iterator();

        let newShape = this.setTransformedShape(startShape, endShape);

        this.storage.deleteShape(startShape.id);
        if (startShape.parent) {
            this.storage.deleteShape(startShape.parent.id);
        }

        if (newShape.parent) {
            if (newShape.parent.id && !this.storage.getShape(newShape.parent.id)) {
                this.storage.setShape(newShape.parent);
            } else {
                this.storage.resetShape(newShape.parent.id, newShape.parent);
            }
        } else {
            this.storage.setShape(newShape);
        }

        if (newShape.parent) {
            newShape.id = newShape.id.split(':')[0] + ':' + newShape.parent.id;
        }

        this.storage.setTransformationIterator(newShape.id, iterator);

        return {
            shape: newShape,
            iterator: iterator
        };
    }

    /**
     * Get coordinates to transform/move set of shapes into another positions/shapes
     * @param startShapes
     * @param endShapes
     * @param interpolation
     * @param parameters
     * @returns {Array}
     */
    public transform (
        startShapes: Array<Shapes>, 
        endShapes: Array<Shapes>, 
        interpolation: string,
        parameters?: InterpolationParameters): Array<TransformObject> {
        
        let transformObjects = [];
        let shapesRatio = this.compositeGeometry.getShapesRatio(startShapes, endShapes);
        let self = this;

        if (shapesRatio.direction === 'equal') {
            startShapes.forEach((shape, i) => {
                let transform = parameters ?
                    this.transformShape(startShapes[i], endShapes[i], interpolation, parameters) :
                    this.transformShape(startShapes[i], endShapes[i], interpolation);

                transformObjects.push(transform);
            });
        }

        if (shapesRatio.direction === 'start') {
            let partialShapes = HELPER.splitArray(startShapes, shapesRatio.ratio);

            endShapes.forEach((shape, i) => {
                if (partialShapes[i].length === 1) {
                    let transform = parameters ?
                        this.transformShape(partialShapes[i][0], shape, interpolation, parameters) :
                        this.transformShape(partialShapes[i][0], shape, interpolation);

                    transformObjects.push(transform);
                } else {
                    let decompositeObjects = this.compositeGeometry.getDecompositeShapes(partialShapes[i], shape);

                    decompositeObjects.forEach(function(obj, index) {
                        let transform = parameters ?
                            self.transformShape(partialShapes[i][index], obj, interpolation, parameters) :
                            self.transformShape(partialShapes[i][index], obj, interpolation);

                        transformObjects.push(transform);
                    });
                }
            });
        }

        if (shapesRatio.direction === 'end') {
            let partialShapes = HELPER.splitArray(endShapes, shapesRatio.ratio);

            startShapes.forEach((shape, i) => {
                if (partialShapes[i].length === 1) {
                    let transform = parameters ?
                        this.transformShape(shape, partialShapes[i][0], interpolation, parameters) :
                        this.transformShape(shape, partialShapes[i][0], interpolation);

                    transformObjects.push(transform);
                } else {
                    let decompositeObjects = this.compositeGeometry.getDecompositeShapes(partialShapes[i], shape);

                    decompositeObjects.forEach(function(obj, index) {
                        let transform = parameters ?
                            self.transformShape(obj, partialShapes[i][index], interpolation, parameters) :
                            self.transformShape(obj, partialShapes[i][index], interpolation);

                        transformObjects.push(transform);
                    });
                }
            });
        }
        
        return transformObjects;
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
            let keyArr = key.split(':');
            let shapeKey = keyArr.length > 1 ? keyArr[1] : keyArr[0];
            let nextArr = iterator.next().value;
            let nextShape: any = shapes.get(shapeKey);

            if (typeof nextShape !== 'undefined' && nextShape.childs) {
                self.geometry.setPointsRenderState(nextShape, false);

                let nextShapeChild = nextShape.childs.filter(
                    function(obj) {
                        return obj.id === key
                    })[0];

                if (typeof nextArr !== 'undefined' && typeof nextShapeChild !== 'undefined') {
                    nextShapeChild.points = [];

                    for (let i = 0; i < nextArr.length; i++) {
                        nextShapeChild.points.push(nextArr[i]);
                    }

                    self.render(nextShapeChild, nextShapeChild.renderType);

                } else {
                    self.geometry.setPointsRenderState(nextShape, true);
                    self.geometry.setPointsRenderState(nextShapeChild, true);

                    self.storage.deleteTransformationIterator(key);
                }
            } else {
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
     * @param pointsArr
     */
    public render (shape: Shapes, type: string, pointsArr?: Float32Array): void {
        if (pointsArr) {
            shape.points = pointsArr;
        }

        if (!shape.points) return;

        shape.isRendered = true;

        this.renderer.render(shape, type);

        this.geometry.setPointsRenderState(shape, true);
    }

    /**
     * Clear canvas
     */
    public clear () {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    private setTransformedShape(startShape: Shapes, endShape: Shapes): Shapes {
        let eShape = this.setPoints(endShape);

        if (!eShape.style) {
            eShape.style = startShape.style;
        }

        return _.clone(eShape);
    }

    /**
     * Provide instance of shapes constructor
     * @returns {any}
     */
    public getShapesConstructor(): any {
        return this.shapesConstructor;
    }

    /**
     * Add shape to storage
     * @param shape
     */
    private addToStorage(shape: Shapes): void {
        this.storage.setShape(shape);
    }

    /**
     * Set initial parameters
     * @param parameters
     * @returns {{interpolationType: string, interpolationPointsPerSegment: number, bezierTensionFactor: number, easingType: string, renderType: string}}
     */
    private static initParameters (parameters?: any): any {

        let params = {
            interpolationType:             INTERPOLATION.noInterpolation,
            interpolationPointsPerSegment: SYSTEM_PARAMETERS.interpolationPointsPerSegment,
            bezierTensionFactor:           SHAPES_PARAMETERS.bezierTension,
            easingType:                    INTERPOLATION.linearTween,
            renderType:                    RENDER_SHAPES.line,
            frames:                        SYSTEM_PARAMETERS.frames,

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

    /**
     * Set initial interpolation parameters
     * @param parameters
     */
    private static initInterpolationParameters (parameters?: any): any {
        let params = {
            frames:              SYSTEM_PARAMETERS.frames,
            startFrame:          SYSTEM_PARAMETERS.startFrame,
            bezierTensionFactor: SHAPES_PARAMETERS.bezierTension,
            xEasing:             INTERPOLATION.linearTween,
            yEasing:             INTERPOLATION.linearTween,
            easingType:          INTERPOLATION_STEP.linear
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
}
