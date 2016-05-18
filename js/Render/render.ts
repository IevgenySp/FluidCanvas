
import Rectangle = require('./Shapes/rectangle');
import Line = require('./Shapes/line');
import BezierCurve = require('./Shapes/bezierCurve');
import CardinalSplines from './../Interpolation/cardinalSplines';

export default class Render {
    context: CanvasRenderingContext2D;
    interpolationCardinal: any;
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
        this.interpolationCardinal = new CardinalSplines(context);
    }

    render(points: Float32Array, type: string) {
        this.context.beginPath();

        switch (type) {
            case 'point':
                Rectangle(this.context, points, 2, 2);
                this.context.fill();
                this.context.stroke();
                break;
            case 'line':
                Line(this.context, points);
                this.context.fill();
                this.context.stroke();
                break;
            case 'bezierCurve':
                BezierCurve(this.context, points, this.interpolationCardinal);
                this.context.fill();
                this.context.stroke();
                break;
                
        }
    }
}