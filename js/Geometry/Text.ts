/**
 * Created by isp on 8/13/17.
 */

import {Shapes, Shape, ShapeStyle} from "./../Interfaces/shapeInterfaces";

export default class TextGeometry {
    geometry:Shapes;
    type:string;
    style:ShapeStyle;
    isRendered:boolean;

    constructor(shape:Shape) {
        this.geometry = shape.geometry;
        this.type = shape.type;
        this.style = shape.style;
        this.isRendered = shape.isRendered;
    }

    public setShapeGeometry():TextGeometry {
        return this;
    }

    public resetShapeGeometry():TextGeometry {
        return this;
    }
}