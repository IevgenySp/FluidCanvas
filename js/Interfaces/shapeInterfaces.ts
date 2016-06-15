/**
 * Created by isp on 4/9/16.
 */

export interface Shape {
    type: string;
    polygons?: number;
    points?: Float32Array;
    interpolation?: string;
    geometry?: any;
    style?: Style;
    id?: string;
    compositeId?: number;
    isRendered?: boolean;
    renderType?: string;
}

export interface Circle extends Shape {
    r: number;
    x: number;
    y: number;
    startAngle?: number;
    pnts?: Array<number>;
}

export interface Rectangle extends Shape {
    x: number;
    y: number;
    width: number;
    height: number;
    pnts?: Array<number>;
}

export interface Polygon extends Shape {
    pnts: Array<number>;
}

export interface Bezier extends Shape {
    pnts: Array<number>;
    bezierSegmentsNumber?: number;
}

export type Shapes = Circle | Rectangle | Polygon | Bezier

export interface ShapePoints {
    setPoints(shape: Shapes, interpolation: string): Shapes;
    resetPoints(shapes: Array<Shapes>, interpolation: string): Array<Shapes>;
}

export interface ShapeParameters {
    interpolationType?: string;
    tensionFactor?: number;
    frames?: number;
    easing?: string;
    renderType?: string;
}

export interface Style {
    color?: string;
    isFill?: boolean;
    isStroke?: boolean;
}

export interface TransformObject {
    shape: Shapes;
    iterator: IterableIterator<Float32Array>
}