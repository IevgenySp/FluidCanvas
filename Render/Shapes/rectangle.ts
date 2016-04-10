/**
 * Created by isp on 4/10/16.
 */

export = (context: CanvasRenderingContext2D,
           point: Array<number>, 
           width: number, 
           height: number,
           centerPoint?: string): void => {

    //context.beginPath();

    for (let entry of point) {
        context.beginPath();
        context.lineWidth = 1;
        context.rect(entry[0], entry[1], width, height);
        context.stroke();
        context.closePath();
    }
};
