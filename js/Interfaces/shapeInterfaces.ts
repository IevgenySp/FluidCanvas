/**
 * Created by isp on 4/9/16.
 */
export interface Shape {
    type: string;
    geometry: Shapes;
    style?: ShapeStyle;
    advanced?: ShapeAdvancedOptions
    id: string;
    compositeId?: number;
    isRendered?: boolean;
    parent?: Shape;
    children?: Array<Shape>;
    setShapeGeometry(): any;
}

export interface ShapeGeometry {
    referencePoints?: Array<number>;
    points?: Float32Array;
    reversePoints?: Array<number>
    polygons?: number;
    shapeSidesCoefficient: number;
}

export interface Circle extends ShapeGeometry {
    r: number;
    x: number;
    y: number;
    startAngle: number;
}

export interface Rectangle extends ShapeGeometry {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Polygon extends ShapeGeometry {
    referencePoints: Array<number>;
}

export interface Bezier extends ShapeGeometry {
    referencePoints: Array<number>;
    bezierSegmentsNumber?: number;
}

export type Shapes = Circle | Rectangle | Polygon | Bezier

export interface ShapePoints {
    setShapeGeometry(): void;
    resetShapesGeometry(shapes: Array<any>): Array<any>;
}

export interface ShapeAdvancedOptions {
    frames?: number;
    startFrame?: number;
    isPolygonRender?: boolean;
    drawAsCanvasShape?: boolean;
    interpolation?: string;
    interpolationStep?: string;
    xEasing?: string;
    yEasing?: string;
    bezierTensionFactor?: number;
    interpolationPointsPerSegment?: number;
}

export interface ShapeStyle {
    color?: string;
    isFill?: boolean;
    isStroke?: boolean;
    lineWidth?: number;
    font?: string;
    fillStyle?: string;
}

export interface TransformObject {
    geometry: any;
    iterator: IterableIterator<Float32Array>
}