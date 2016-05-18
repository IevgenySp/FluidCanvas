/**
 * Created by isp on 5/2/16.
 */

export = (context: CanvasRenderingContext2D,
          points: Float32Array,
          interpolation: any): void => {

    interpolation.drawLines(interpolation.getCurvePoints(points, 0.5, true));

    /*let eArr = points[Symbol.iterator]();
    let counter = 0;
    let firstX = eArr.next().value;
    let firstY = eArr.next().value;

    context.moveTo(firstX, firstY);

    while (counter < points.length / 2) {
        context.lineTo(eArr.next().value, eArr.next().value);
        context.bezierCurveTo(20,100,200,100,200,20);
        counter++;
    }*/

    //context.lineTo(firstX, firstY);

    /*context.moveTo(points[0][0], points[0][1]);

     for (let i = 0; i < points.length; i++) {
     if (i !== 0) {
     context.lineTo(points[i][0], points[i][1]);
     }
     }*/
};