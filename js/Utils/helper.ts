/**
 * Created by isp on 4/25/16.
 */

const HELPER = {
    toRadians: (degrees) => {
        return degrees * Math.PI / 180;
    },

    getVectorsDeltas: (startArray: Float32Array, endArray: Float32Array): Array<number> => {
        let deltas = [];
        let counter = 0;
        let sArr = startArray[Symbol.iterator]();
        let eArr = endArray[Symbol.iterator]();

        while (startArray.length > counter) {
            let sX = sArr.next().value;
            let sY = sArr.next().value;
            let eX = eArr.next().value;
            let eY = eArr.next().value;
            
            deltas.push(HELPER.getVectorLength(sX, sY, eX, eY));

            counter+=4;
        }
        
        return deltas;
    },
    
    isEqualArrays: (curDeltas: Array<number>, nextDeltas: Array<number>): boolean => {
        let equal = false;

        for (let i = 0; i < curDeltas.length; i++) {
            equal = (Math.floor(nextDeltas[i]) > Math.floor(curDeltas[i]) || 
                Math.floor(curDeltas[i]) === 0 || Math.floor(nextDeltas[i]) === 0);
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

    getLinearDistance: (coord1: number, coord2: number): number => {
        return Math.abs(coord1 - coord2);
    },
    
    getVectorLength: (x1: number, y1: number, x2: number, y2: number): number => {
        return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    },

    getVectorDiff: (vec1: Array<number>, vec2: Array<number>): Array<number> => {
        return [vec1[0] - vec2[0], vec1[1] - vec2[1]];
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

    isEqualVectors: (vec1: Array<number>, vec2: Array<number>): boolean => {
        return vec1[0] === vec2[0] && vec1[1] === vec2[1];
    },

    splitPoints(weights: Array<number>, polygons: number): Array<number> {
        let points = [];

        for (let i = 0; i < weights.length; i++) {
            let p = Math.ceil(polygons * weights[i]);

            points.push(p);
        }

        let sumPoints = points.reduce(function(a, b) { return a + b; }, 0);
        let delta = sumPoints - polygons;

        while (delta !== 0) {
            let indexOfMaxValue = points.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
            if (delta > 0) {
                points[indexOfMaxValue] -= 1;
            } else {
                points[indexOfMaxValue] += 1;
            }

            sumPoints = points.reduce(function(a, b) { return a + b; }, 0);
            delta = sumPoints - polygons;
        }

        return points;
    },

    pointsInShape: (polygonsNumber: number, shapeSides: number): number => {
        let numbersInLine = ~~(polygonsNumber / shapeSides);
        
        return numbersInLine * shapeSides;
    },

    commonMultiple: (sShapePolygons: number, eShapePolygons: number, sShapeCoef, eShapeCoef): number => {
        let polygons = Math.max(sShapePolygons, eShapePolygons);

        if (polygons % sShapeCoef === 0 && polygons % eShapeCoef === 0) {
            return polygons;
        } else {
            polygons++;

            return HELPER.commonMultiple(polygons, polygons, sShapeCoef, eShapeCoef);
        }
    },

    hasValue: (obj: Object, val: any) => {
        for ( var key in obj ) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] === val) {
                    return val;
                }
            }
        }
        
        return null;
    },

    flattenArray: (arr: Array<any>, container?: Array<any>): Array<any> => {
        let containerArray = container || [];
        
        return [].concat.apply(containerArray, arr);
    }
};

export {HELPER};