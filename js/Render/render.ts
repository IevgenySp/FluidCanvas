
import {Shapes} from "./../Interfaces/shapeInterfaces";
import {SHAPES_PARAMETERS, SHAPES, RENDER_SHAPES} from './../Utils/globals';

import Rectangle = require('./Shapes/rectangle');
import Line = require('./Shapes/line');

export default class Render {
    context: CanvasRenderingContext2D;
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    public render(shape: Shapes, type: string): void {
        this.context.beginPath();

        switch (type) {
            case RENDER_SHAPES.point:
                Rectangle(this.context, shape.points,
                    SHAPES_PARAMETERS.pointWidth, SHAPES_PARAMETERS.pointHeight);
                this.style(shape);
                break;
            case RENDER_SHAPES.line:
                Line(this.context, shape.points);
                this.style(shape);
                break;
        }
    }

    private style(shape: Shapes) {
        if (shape.style) {
            if (shape.style.color) {
                this.context.fillStyle = shape.style.color;
                this.context.strokeStyle = shape.style.color;
            }
            if (shape.style.isFill) {
                this.context.fill();
            }
            if (shape.style.isStroke || !shape.style.isFill ||
                shape.type === SHAPES.line ||  shape.type === SHAPES.bezierLine) {
                this.context.stroke();
            }
        } else {
            this.context.fillStyle = SHAPES_PARAMETERS.baseColor;
            this.context.stroke();
        }
    }
}