/**
 * Created by isp on 4/9/16.
 */

import {Shape, Circle} from "./Vectors/shapeInterfaces";
import Vectors from './Vectors/points';
import Render from './Render/render';
import Animation from './Animation/animation';
import {MAPPING, TRAJECTORY} from './Utils/globals';
import {HELPER} from './Utils/helper';

import LinearTrajectory = require('./Trajectory/linear');
import LinearExpansionTrajectory = require('./Trajectory/linearExpansion');

export default class FluidCanvas {
    vectors: any;
    renderer: any;
    //storage: any;
    context: CanvasRenderingContext2D;
    constructor (context: CanvasRenderingContext2D) {
        this.context = context;
        this.vectors = new Vectors();
        this.renderer = new Render(this.context);
        //this.storage = new Storage();
    }
    
    /*public setShape (shape: Shape): void {
        let shapePoints = this.vectors.getPointsArray(shape);

        this.storage.setShape(shape, shapePoints);
    }*/

    public transform (startShape: Shape, 
                      endShape: Shape, 
                      trajectory: string, 
                      type: string, 
                      animate?: boolean): void {
        
        let points = this.mapPoints(startShape, endShape);
        let startPoints = points[0];
        let endPoints = points[1];
        //let globalId;

        /*let linearTransform = (startPoints: Float32Array,
                               endPoints: Float32Array,
                               angle: number): void => {

            //while (!HELPER.isEqualArrays(startPoints, endPoints)) {
                startPoints = LinearTrajectory(startPoints, angle);

                HELPER.fitToEqual(startPoints, endPoints);

                this.render(startShape, type, startPoints);
            //}
            console.log('test');

            globalId = requestAnimationFrame(
                () => {
                    linearTransform(startPoints, endPoints, angle);
                }
            );

            if (HELPER.isEqualArrays(startPoints, endPoints)) {
                cancelAnimationFrame(globalId);
            }
        };*/
        
        switch (trajectory) {
            default:
            case TRAJECTORY.linear:
                let width = Math.abs(startPoints[0] - endPoints[0]);
                let height = Math.abs(startPoints[1] - endPoints[1]);
                let theta = Math.atan(height / width);

                let linearParameters = [startPoints, endPoints, theta];

                let linearAnimation = new Animation(linearParameters);

                let linearStartCondition = (startPoints: Float32Array,
                                      endPoints: Float32Array,
                                      angle: number): void => {

                    startPoints = LinearTrajectory(startPoints, angle);

                    linearParameters = [startPoints, endPoints, theta];

                    linearAnimation.setNewParameters(linearParameters);

                    HELPER.fitToEqual(startPoints, endPoints);
                    this.render(startShape, type, startPoints);
                };

                let linearStopCondition = HELPER.isEqualArrays;

                linearAnimation.animate(linearStartCondition, linearStopCondition);

                //linearTransform(startPoints, endPoints, theta);

                /*globalId = requestAnimationFrame(
                    () => {
                        linearTransform(startPoints, endPoints, theta);
                    }
                );*/
                break;
            case TRAJECTORY.linearExpansion:
                /*let width = Math.abs(startPoints[0] - endPoints[0]);
                let height = Math.abs(startPoints[1] - endPoints[1]);
                let theta = Math.atan(height / width);*/

                let angles = [];
                let velocity = [];

                for (let i = 0; i < startPoints.length; i++) {
                    let width;
                    let height;
                    let distance;

                    if (i % 2 === 0) {
                        width = Math.abs(startPoints[i] - endPoints[i]);
                        height = Math.abs(startPoints[i + 1] - endPoints[i + 1]);
                        distance = Math.hypot(width, height);
                        velocity.push(distance);
                    } else {
                        width = Math.abs(startPoints[i - 1] - endPoints[i - 1]);
                        height = Math.abs(startPoints[i] - endPoints[i]);
                        distance = Math.hypot(width, height);
                        velocity.push(distance);
                    }

                    angles.push(Math.atan(height / width));
                }

                let linearExpansionParameters = [startPoints, endPoints, angles];

                let linearExpansionAnimation = new Animation(linearExpansionParameters);

                let linearExpansionStartCondition = (startPoints: Float32Array,
                                      endPoints: Float32Array,
                                      angles: Array<number>): void => {

                    startPoints = LinearExpansionTrajectory(startPoints, angles, velocity);

                    linearExpansionParameters = [startPoints, endPoints, angles];

                    linearExpansionAnimation.setNewParameters(linearExpansionParameters);

                    HELPER.fitToEqual(startPoints, endPoints);
                    this.render(startShape, type, startPoints);
                };

                let linearExpansionStopCondition = HELPER.isEqualArrays;

                linearExpansionAnimation.animate(
                    linearExpansionStartCondition,
                    linearExpansionStopCondition
                );
        }
    }
    
    public render (shape: Shape, type: string, shapePointsArray?: Float32Array): void {
        let shapePoints = shapePointsArray || this.vectors.getPointsArray(shape);

        //this.clear();

        this.renderer.render(shapePoints, type);
    }
    
    public clear () {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    private mapPoints (startShape: Shape, endShape: Shape): Array<Float32Array> {
        let startPoints = this.vectors.getPointsArray(startShape);
        let endPoints = this.vectors.getPointsArray(endShape);
        let mappingType = this.mappingType(startShape, endShape);
        
        switch (mappingType) {
            default:
            case MAPPING.direct:
                return [startPoints, endPoints];
            break;
        }
    }

    private mappingType (startShape: Shape, endShape: Shape): string {
        let shapeType = MAPPING.direct;
        
        if (startShape.type === endShape.type) {
            switch (startShape.type) {
                case 'circle':
                    shapeType = startShape.r > endShape.r ? MAPPING.directConstriction :
                        startShape.r < endShape.r ? MAPPING.directExpansion :
                            MAPPING.direct;
            }
        }
        
        return shapeType;
    }
}

