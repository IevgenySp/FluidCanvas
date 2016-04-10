/**
 * Created by isp on 4/9/16.
 */

import {Shape, Circle} from "./Vectors/shapeInterfaces";
import Vectors from './Vectors/points';
import Render from './Render/render';

export default class FluidCanvas {
    vectors: any;
    renderer: any;
    context: CanvasRenderingContext2D;
    constructor (context: CanvasRenderingContext2D) {
        this.context = context;
        this.vectors = new Vectors();
        this.renderer = new Render(this.context);
    }
}

