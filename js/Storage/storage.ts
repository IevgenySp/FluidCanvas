/**
 * Created by isp on 6/11/16.
 */

import {Shape} from "./../Interfaces/shapeInterfaces";
import {HELPER} from "./../Utils/helper";

export default class Storage {
    shapes: Map<any, any>;
    transformationData: Map<any, any>;
    constructor() {
        this.shapes = new Map();
        this.transformationData = new Map();
    }
    
    public setShape(shapeGeometry: Shape): void {
        
        this.setShapeId(shapeGeometry);

        if (shapeGeometry.children) {
            shapeGeometry.children.forEach(function(child: Shape) {
                child.id = child.id.split(':')[0] + ':' + shapeGeometry.id;
            });
        }

        this.shapes.set(shapeGeometry.id, shapeGeometry);
    }
    
    public getShape(shapeId: string): Shape {
        return this.shapes.get(shapeId);
    }
    
    public getShapes(): Map<string, Shape> {
        return this.shapes;
    }
    
    public getCompositeShape(compositeId: number): Array<Shape> {
        let shapes = [];
        
        this.shapes.forEach(function(shapeGeometry: Shape): void {
            if (shapeGeometry.compositeId &&
                shapeGeometry.compositeId === compositeId) {
                shapes.push(shapeGeometry);
            }
        });
        
        return shapes;
    }
    
    public resetShape(shapeId: string, newShape: Shape): void {
        this.shapes.set(shapeId, newShape);
    }
    
    public deleteShape(shapeId: string): void {
        this.shapes.delete(shapeId);
    }
    
    public setTransformationData(
        shapeId: string, data: {geometry: any, iterator:IterableIterator<Float32Array>}): void {
        this.transformationData.set(shapeId, data);
    }

    public deleteTransformationData(shapeId: string): void {
        this.transformationData.delete(shapeId);
    }

    public getTransformationData(): 
        Map<string, {geometry: any, iterator: IterableIterator<Float32Array>}> {
        return this.transformationData;
    }

    public setShapeId(shape: Shape): void {
        shape.id = shape.type + '_' + HELPER.generateUID();
    }

    public clearShapes(): void {
        this.shapes.clear();
    }
}