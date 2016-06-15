/**
 * Created by isp on 4/14/16.
 */

export = (context: CanvasRenderingContext2D,
          points: Float32Array): void => {

    let eArr = points[Symbol.iterator]();
    let counter = 0;
    let firstX = eArr.next().value;
    let firstY = eArr.next().value;

    context.moveTo(firstX, firstY);

    while (counter < points.length / 2) {
        context.lineTo(eArr.next().value, eArr.next().value);

        counter++;
    }

    context.lineTo(firstX, firstY);
};
