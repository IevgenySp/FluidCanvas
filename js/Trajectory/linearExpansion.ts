/**
 * Created by isp on 5/1/16.
 */

import {SYSTEM_PARAMETERS} from "./../Utils/globals";

export = (startPoints: Float32Array, angles: Array<number>, velocity: Array<number>): Float32Array => {
    /*let width = Math.abs(startPoints[0] - endPoints[0]);
     let height = Math.abs(startPoints[1] - endPoints[1]);
     let theta = Math.atan(height / width);*/
    let v = SYSTEM_PARAMETERS.velocity;
    let t = SYSTEM_PARAMETERS.time;
    
    return startPoints.map(function(coord, index) {
        if (index % 2 === 0) {
            return coord + velocity[index] * t * Math.sin(angles[index] + Math.PI / 2);
        } else {
            return coord + velocity[index] * t * Math.cos(angles[index] - Math.PI / 2);
        }
    });
}