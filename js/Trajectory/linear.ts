/**
 * Created by isp on 4/24/16.
 */

import {SYSTEM_PARAMETERS} from "./../Utils/globals";

export = (startPoints: Float32Array, angle: number): Float32Array => {
    /*let width = Math.abs(startPoints[0] - endPoints[0]);
    let height = Math.abs(startPoints[1] - endPoints[1]);
    let theta = Math.atan(height / width);*/
    let v = SYSTEM_PARAMETERS.velocity;
    let t = SYSTEM_PARAMETERS.time;
    
    return startPoints.map(function(coord, index) {
        if (index % 2 === 0) {
            return coord + v * t * Math.sin(angle);
        } else {
            return coord + v * t * Math.cos(angle);
        }
    });
}