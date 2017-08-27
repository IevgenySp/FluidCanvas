/**
 * Created by isp on 4/9/16.
 */

import * as _ from 'lodash';
import * as events from 'events';
import * as chroma from 'chroma-js';

import {Shape} from './Interfaces/shapeInterfaces';
import Storage from './Storage/Storage';
import Geometry from './Geometry/ShapesGeometry';
import CompositeGeometry from './Geometry/CompositeGeometry/Composite';
import Render from './Render/render';
import Animation from './Animation/Animation';
import ShapesConstructor from './ShapesConstructor/ShapesConstructor';
import {EVENTS, SYSTEM_PARAMETERS, SHAPES} from './Utils/globals';

export default class FluidCanvas {
    storage: any;
    geometry: any;
    compositeGeometry: any;
    renderer: any;
    shapesConstructor: any;
    eventEmitter: any;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    constructor (canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.storage = new Storage();
        this.geometry = new Geometry();
        this.compositeGeometry = new CompositeGeometry();
        this.renderer = new Render(this.context);
        this.shapesConstructor = new ShapesConstructor();
        this.eventEmitter = new events.EventEmitter();
    }

    /**
     * Main method to init shape geometry and place shape into storage
     * @param type
     * @param options
     */
    public shape(type: string, options): any {
        let shape = this.shapesConstructor.defineShape(type, options);
        let geometry = this.geometry.initGeometry(shape);
        
        this.storage.setShape(geometry);

        return geometry;
    };
    
    /**
     * Get all available points
     * @returns {Map<string, Shapes>}
     */
    public getShapes() {
        return this.storage.getShapes();
    }

    /**
     * Get transformation data for shape or series of shapes
     * @param startGeometry
     * @param endGeometry
     * @param interpolation
     */
    private transform(startGeometry: any,
                     endGeometry: any,
                     interpolation?: string): void {

        if (!(Array.isArray(startGeometry)) && !(Array.isArray(endGeometry))) {
            let endShape = this.storage.getShape(endGeometry.id);

            if (!endShape) {
                //throw new Error('End shape does not exist or already transformed');
            }

            let transformData =
                this.geometry.transformShape(startGeometry, endGeometry, interpolation);
            let startColor = startGeometry.style.color || SYSTEM_PARAMETERS.baseShapeColor;
            let endColor = endGeometry.style.color || SYSTEM_PARAMETERS.baseShapeColor;

            this.setRenderState(startGeometry, true);
            this.setRenderState(transformData.geometry, true);

            transformData.transformColors = chroma.scale([startColor, endColor])
                .mode('lch').colors(transformData.frames)[Symbol.iterator]();

            this.storage.setShapeId(transformData.geometry);
            this.storage.deleteShape(startGeometry.id);
            this.storage.setTransformationData(transformData.geometry.id, transformData);
        } else {

            let transformGroupData =
                this.compositeGeometry
                    .transformShapes(startGeometry, endGeometry, interpolation);
            let self = this;
            let transformData = [];

            transformGroupData.forEach(group => {
                let transpondedGroup = group[0].map((shape, index) => {
                    return [shape, group[1][index]];
                });

                return transpondedGroup.forEach(shapes => {
                    transformData.push(this.geometry
                        .transformPreparedShape(shapes[0], shapes[1], interpolation));
                });
            });
            transformData.forEach((data: any, index) => {
                let startColor = data.colors.start;
                let endColor = data.colors.end;

                self.setRenderState(data.geometry, true);

                data.transformColors = chroma.scale([startColor, endColor])
                    .mode('lch').colors(data.frames)[Symbol.iterator]();

                self.storage.setShapeId(data.geometry);
                self.storage.setTransformationData(data.geometry.id, data);
            });

            startGeometry.forEach(geometry => {
                self.storage.deleteShape(geometry.id);
            });
        }
    }

    /**
     * Animate points transformation
     */
    public animate (startGeometry: any,
                    endGeometry: any,
                    interpolation?: string): void {

        this.transform(startGeometry, endGeometry, interpolation);

        let transformData = this.storage.getTransformationData();
        let animation = new Animation();
        let callback =
            this.animationCallback.bind(this, transformData, endGeometry);
        let stop = this.animationStopCondition.bind(this);
        
        animation.animate(callback, stop);
    }
    
    /**
     * Condition to start animation
     * @param transformData
     * @param endGeometry
     */
    private animationCallback(transformData: Map<any, any>, endGeometry: any) {

        let self = this;

        this.clear();

        this.renderAll();

        transformData.forEach((obj, key) => {

            let nextArr = obj.iterator.next().value;
            let shapeGeometry = obj.geometry;

            if (typeof nextArr !== 'undefined') {

                shapeGeometry.geometry.points = nextArr;

                let shapeColor = obj.transformColors.next().value;

                if (typeof shapeColor !== 'undefined') {
                    shapeGeometry.style.color = shapeColor;
                }

                this.eventEmitter.emit(EVENTS.onAnimationStart, shapeGeometry);

                self.render(shapeGeometry);
            } else {
                self.storage.deleteTransformationData(key);

                if (self.storage.transformationData.size === 0) {
                    this.eventEmitter.emit(EVENTS.onAnimationStop, shapeGeometry);
                }

                if (!(Array.isArray(endGeometry))) {
                    this.setRenderState(endGeometry, true);
                    self.render(endGeometry);
                } else {
                    endGeometry.forEach(geometry => {
                        self.setRenderState(geometry, true);
                        self.render(geometry);
                    });
                }
            }

        });
    }

    /**
     * Condition to stop animation
     * @returns {boolean}
     */
    private animationStopCondition() {
        return this.storage.getTransformationData().size === 0;
    }

    /**
     * Render shape, possible render primitives: line, point
     * @param shape
     */
    public render (shape: Shape): void {
        if (shape.type !== SHAPES.text.toUpperCase() && !shape.geometry.points)
            throw ('Rendering points for ' + shape.id + ' is not defined');

        if (shape.isRendered) {
            this.renderer.render(shape);
        }
    }

    /**
     * Change shapes render state
     * @param shape
     * @param state
     */
    public setRenderState(shape: Shape, state: boolean): void {
        this.geometry.setShapeRenderState(shape, state);
    }

    /**
     * Render all shapes
     */
    public renderAll(): void {
        let shapesIterator = this.getShapes().entries();
        let self = this;
        let nextShape = shapesIterator.next();

        while (!nextShape.done) {
            let shape = nextShape.value[1];

            if (shape.isRendered) {
                self.renderer.render(shape);
            }

            nextShape = shapesIterator.next();
        }
    }

    /**
     * Clear canvas
     */
    public clear (): void {
        this.context.clearRect(0, 0,
            this.context.canvas.width, this.context.canvas.height);
    }

    /**
     * Subscribe on animation events
     * @param event
     * @param callback
     */
    public on(event, callback): void {
        this.eventEmitter.on(event, callback);
    }

    /**
     * Subscribe once on animation events
     * @param event
     * @param callback
     */
    public once(event, callback): void {
        this.eventEmitter.once(event, callback);
    }
}
