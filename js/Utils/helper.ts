/**
 * Created by isp on 4/25/16.
 */

const HELPER = {
    toRadians: (degrees) => {
        return degrees * Math.PI / 180;
    },

    isEqualArrays: (startArray: Float32Array, endArray: Float32Array): boolean => {
        let equal = true;
        let sArr = startArray[Symbol.iterator]();
        let eArr = endArray[Symbol.iterator]();
        let counter = 0;

        while (startArray.length > counter) {
            if (sArr.next().value < eArr.next().value) {
                equal = false;
            }
            counter++;
        }

        return equal;
    },
    
    fitToEqual: (startArray: Float32Array, endArray: Float32Array): void => {
        let sArr = startArray[Symbol.iterator]();
        let eArr = endArray[Symbol.iterator]();
        let counter = 0;

        while (startArray.length > counter) {
            let sArrNext = sArr.next().value;
            let eArrNext = eArr.next().value;
            
            if (sArrNext > eArrNext) {
                startArray[counter] = eArrNext;
            }
            counter++;
        }
    },

    getVectorLength: (x1: number, y1: number, x2: number, y2: number): number => {
        return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    },

    vecDiffAbs: (vec1: Array<number>, vec2: Array<number>): Array<number> => {
        return [Math.abs(vec1[0] - vec2[0]), Math.abs(vec1[1] - vec2[1])];
    },

    vecSum: (vec1: Array<number>, vec2: Array<number>): Array<number> => {
        return [vec1[0] + vec2[0], vec1[1] + vec2[1]];
    },

    vecConstMultiply: (vec: Array<number>, value: number): Array<number> => {
        return [vec[0] * value, vec[1] * value];
    },

    normalize: (domain: Array<number>, range: Array<number>): Array<number> => {
        return [];
    },
    
    /*animate: (callback: Function, stopCondition: Function): void => {
        callback();

        requestAnimationFrame(
            () => {
                this.animate();
            }
        );
    }*/
};

export {HELPER};