/**
 * Created by isp on 4/9/16.
 */

export interface Circle {
    r: number;
    x: number;
    y: number;
    startAngle?: number;
}

export interface Shape extends Circle {
    type: string;
}
