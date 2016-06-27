/**
 * Created by isp on 5/29/16.
 */

export interface InterpolationInterface {
    distance: number;
    velocity: number;
    width: number;
    height: number;
    angle: number;
    startVector: Array<number>;
    endVector: Array<number>;
}

export interface InterpolationParameters {
    xEasing?: string;
    yEasing?: string;
    startFrame?: number;
    frames?: number;
    bezierTensionFactor?: number;
    easingType?: string;
}

export interface InterpolationIterator {
    iterator(): IterableIterator<Float32Array>
}