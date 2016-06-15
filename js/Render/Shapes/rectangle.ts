/**
 * Created by isp on 4/10/16.
 */

export = (context: CanvasRenderingContext2D,
           points: Float32Array,
           width: number, 
           height: number,
           centerPoint?: string): void => {
    
    let center = centerPoint || 'center';
    let eArr = points[Symbol.iterator]();
    let counter = 0;

    while (counter < points.length / 2) {
        switch (center) {
            case 'center':
                let x = eArr.next().value - width / 2;
                let y = eArr.next().value - height / 2;

                counter++;

                context.lineWidth = 1;
                context.rect(x, y, width, height);
                break;
        }
    }
};
