
import Rectangle = require('./Shapes/rectangle');

export default class Render {
    context: CanvasRenderingContext2D;
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    render(points: Array<number>, type: string) {
        switch (type) {
            case 'point':
                Rectangle(this.context, points, 10, 10);
                break;
        }
    }
}