/**
 * Created by isp on 4/30/16.
 */

import {Shape, Circle} from "./../Vectors/shapeInterfaces";

export default class Storage {
    storage: Object;
    id: number;
    constructor () {
        this.storage = {};
        this.id = 0;
    }
    
    public setShape (shape: Shape, points: Float32Array): void {
        shape.points = points;
        this.storage[this.id] = shape;
        this.id++;
    }
}