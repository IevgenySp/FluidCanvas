
import {Shape} from "./../Interfaces/shapeInterfaces";
import {SYSTEM_PARAMETERS, SHAPES} from './../Utils/globals';

import Rectangle = require('./Shapes/rectangle');
import Line = require('./Shapes/line');
import Text = require('./Shapes/text');

export default class Render {
    context: CanvasRenderingContext2D;
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    public render(shape: Shape): void {
        this.context.beginPath();
        
        if (shape.type.toUpperCase() === SHAPES.text.toUpperCase()) {
            this.style(shape);
            Text(this.context, shape.geometry, this.style);
            
        } else if (shape.advanced.isPolygonRender) {
            Rectangle(this.context, shape.geometry.points,
                SYSTEM_PARAMETERS.renderPolygonWidth,
                SYSTEM_PARAMETERS.renderPolygonHeight);
            this.style(shape);
        } else {
            let linkEnds = shape.type !==
                    (SHAPES.line.toUpperCase() || 
                    SHAPES.bezierLine.toUpperCase());

            Line(this.context, shape.geometry.points, linkEnds);
            this.style(shape);
        }
    }

    private style(shape: Shape) {
        if (shape.style) {
            if (shape.style.color) {
                this.context.fillStyle = shape.style.color;
                this.context.strokeStyle = shape.style.color;
            }
            if (shape.style.lineWidth) {
                this.context.lineWidth = shape.style.lineWidth;
            }
            if (shape.style.font) {
                this.context.font = shape.style.font;
            }
            if (shape.style.fillStyle) {
                this.context.fillStyle = shape.style.fillStyle;
            }
            if (shape.style.isFill) {
                this.context.fill();
            }
            if (shape.style.isStroke || !shape.style.isFill ||
                shape.type === SHAPES.line ||  shape.type === SHAPES.bezierLine) {
                this.context.stroke();
            }
        } else {
            this.context.fillStyle = SYSTEM_PARAMETERS.baseShapeColor;
            this.context.stroke();
        }
    }
}