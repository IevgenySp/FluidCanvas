/**
 * Created by isp on 4/9/16.
 */

export interface Circle {
    r?: number;
    x: number;
    y: number;
    startAngle?: number;
}

export interface Rectangle {
    x: number;
    y: number;
    width?: number;
    height?: number;
}

export interface Shape extends Circle, Rectangle {
    type: string;
    polygons?: number;
    points?: Float32Array;
}
