/**
 * Created by isp on 5/28/16.
 */

import {Circle, Rectangle, Polygon} from "../Interfaces/shapeInterfaces";
import {InterpolationInterface, InterpolationIterator} from './../Interfaces/interpolationInterfaces';
import {HELPER} from './../Utils/helper';

type Shapes = Circle | Rectangle | Polygon;

export default class Interpolation implements InterpolationIterator {
    sShape: Shapes;
    eShape: Shapes;
    constructor(startShape: Shapes, endShape?: Shapes) {
        this.sShape = startShape;
        this.eShape = endShape ? endShape : startShape;
    };

    public iterator(): IterableIterator<Float32Array> {
        
        let concatPoints = [this.sShape.points, this.eShape.points];
        
        return concatPoints[Symbol.iterator]();
    }

    public getLinearParameters(): Array<InterpolationInterface> {
        let sPoints = this.sShape.points;
        let ePoints = this.eShape.points;
        let parameters = [];

        for (let index = 0; index < sPoints.length; index++) {
            if (index % 2 === 0) {

                let distance = HELPER.getVectorLength(
                    sPoints[index],
                    sPoints[index + 1],
                    ePoints[index],
                    ePoints[index + 1]);
                let width = HELPER.getLinearDistance(
                    sPoints[index],
                    ePoints[index]);
                let height = HELPER.getLinearDistance(
                    sPoints[index + 1],
                    ePoints[index + 1]);
                let angle = Math.atan(height / width);
                let sVector = [sPoints[index], sPoints[index + 1]];
                let eVector = [ePoints[index], ePoints[index + 1]];

                parameters.push({
                    distance: distance,
                    width: width,
                    height: height,
                    angle: angle,
                    startVector: sVector,
                    endVector: eVector
                });
                
            } else {
                
                let distance = HELPER.getVectorLength(
                    sPoints[index - 1],
                    sPoints[index],
                    ePoints[index - 1],
                    ePoints[index]);
                let width = HELPER.getLinearDistance(
                    sPoints[index - 1],
                    ePoints[index - 1]);
                let height = HELPER.getLinearDistance(
                    sPoints[index],
                    ePoints[index]);
                let angle = Math.atan(height / width);
                let sVector = [sPoints[index - 1], sPoints[index]];
                let eVector = [ePoints[index - 1], ePoints[index]];

                parameters.push({
                    distance: distance,
                    width: width,
                    height: height,
                    angle: angle,
                    startVector: sVector,
                    endVector: eVector
                });
                
            }
        }
        
        return parameters;
    }
}
