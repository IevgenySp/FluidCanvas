/**
 * Created by isp on 6/11/16.
 */

import {Shapes} from "./../Interfaces/shapeInterfaces";
import * as coreJs from 'core-js';

export default class Storage {
    shapes: Map<any, any>;
    transformationIterators: Map<any, any>;
    id: number;
    compositeId: number;
    constructor() {
        this.shapes = new coreJs.Map();
        this.transformationIterators = new coreJs.Map();
        this.id = 0;
        this.compositeId = 0;
    }

    private incrementId(): void {
        this.id++;
    }

    public incrementCompositeId(): void {
        this.compositeId++;
    }
    
    public setShape(shape: Shapes): void {
        
        this.setShapeId(shape);

        this.shapes.set(shape.id, shape);
        
        this.incrementId();
    }
    
    public getShape(shapeId: string): Shapes {
        return this.shapes.get(shapeId);
    }
    
    public getShapes(): Map<string, Shapes> {
        return this.shapes;
    }
    
    public getCompositeShape(compositeId: number): Array<Shapes> {
        let shapes = [];
        
        this.shapes.forEach(function(shape: Shapes): void {
            if (shape.compositeId && shape.compositeId === compositeId) {
                shapes.push(shape);
            }
        });
        
        return shapes;
    }
    
    public resetShape(shapeId: string, newShape: Shapes): void {
        let key = this.shapes.get(shapeId);
        
        this.shapes.set(key, newShape);
    }
    
    public deleteShape(shapeId: string): void {
        this.shapes.delete(shapeId);
    }
    
    public setTransformationIterator(shapeId: string, iterator: IterableIterator<Float32Array>): void {
        this.transformationIterators.set(shapeId, iterator);
    }

    public deleteTransformationIterator(shapeId: string): void {
        this.transformationIterators.delete(shapeId);
    }

    public getTransformationIterators(): Map<string, IterableIterator<Float32Array>> {
        return this.transformationIterators;
    }

    public setShapeId(shape: Shapes): void {
        shape.id = shape.type + '_' + this.id;
    }

    public setShapeCompositeId(shape: Shapes): void {
        shape.compositeId = this.compositeId;
    }
}