/**
 * Created by isp on 4/25/16.
 */

const HELPER = {
    /**
     * Convert degrees to radians
     * @param degrees
     * @returns {number}
     */
    toRadians: (degrees) => {
        return degrees * Math.PI / 180;
    },

    /**
     * Length difference between vectors
     * @param startArray
     * @param endArray
     * @returns {Array}
     */
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

    /**
     * Check if all values of input and output array coherently equals
     * @param curDeltas
     * @param nextDeltas
     * @returns {boolean}
     */
    isEqualArrays: (curDeltas: Array<number>, nextDeltas: Array<number>): boolean => {
        let equal = false;

        for (let i = 0; i < curDeltas.length; i++) {
            equal = (Math.floor(nextDeltas[i]) > Math.floor(curDeltas[i]) || 
                Math.floor(curDeltas[i]) === 0 || Math.floor(nextDeltas[i]) === 0);
        }

        return equal;
    },

    /**
     * Adjustment of input and output arrays values
     * @param startArray
     * @param endArray
     */
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

    /**
     * Linear distance between points
     * @param coord1
     * @param coord2
     * @returns {number}
     */
    getLinearDistance: (coord1: number, coord2: number): number => {
        return Math.abs(coord1 - coord2);
    },

    /**
     * Length of vector
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @returns {number}
     */
    getVectorLength: (x1: number, y1: number, x2: number, y2: number): number => {
        return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    },

    /**
     * Difference in length between vectors
     * @param vec1
     * @param vec2
     * @returns {number[]}
     */
    getVectorDiff: (vec1: Array<number>, vec2: Array<number>): Array<number> => {
        return [vec1[0] - vec2[0], vec1[1] - vec2[1]];
    },

    /**
     * Absolute difference in length between vectors
     * @param vec1
     * @param vec2
     * @returns {number[]}
     */
    vecDiffAbs: (vec1: Array<number>, vec2: Array<number>): Array<number> => {
        return [Math.abs(vec1[0] - vec2[0]), Math.abs(vec1[1] - vec2[1])];
    },

    /**
     * Vectors summation
     * @param vec1
     * @param vec2
     * @returns {number[]}
     */
    vecSum: (vec1: Array<number>, vec2: Array<number>): Array<number> => {
        return [vec1[0] + vec2[0], vec1[1] + vec2[1]];
    },

    /**
     * Vector multiplication by constant
     * @param vec
     * @param value
     * @returns {number[]}
     */
    vecConstMultiply: (vec: Array<number>, value: number): Array<number> => {
        return [vec[0] * value, vec[1] * value];
    },

    /**
     * Check if vectors is equal
     * @param vec1
     * @param vec2
     * @returns {boolean}
     */
    isEqualVectors: (vec1: Array<number>, vec2: Array<number>): boolean => {
        return vec1[0] === vec2[0] && vec1[1] === vec2[1];
    },

    /**
     * Points distribution along the set of vectors relatively to vectors length
     * @param weights
     * @param polygons
     * @returns {Array}
     */
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

    /**
     * Number of points that can be evenly distributed among shape sides
     * @param polygonsNumber
     * @param shapeSides
     * @returns {number}
     */
    pointsInShape: (polygonsNumber: number, shapeSides: number): number => {
        let numbersInLine = ~~(polygonsNumber / shapeSides);
        
        return numbersInLine * shapeSides;
    },

    /**
     * Common multiple value for points in different shapes
     * @param sShapePolygons
     * @param eShapePolygons
     * @param sShapeCoef
     * @param eShapeCoef
     * @returns {number}
     */
    commonMultiple: (sShapePolygons: number, eShapePolygons: number, sShapeCoef, eShapeCoef): number => {
        let polygons = Math.max(sShapePolygons, eShapePolygons);

        if (polygons % sShapeCoef === 0 && polygons % eShapeCoef === 0) {
            return polygons;
        } else {
            polygons++;

            return HELPER.commonMultiple(polygons, polygons, sShapeCoef, eShapeCoef);
        }
    },

    /**
     * Check if object has value
     * @param obj
     * @param val
     * @returns {any}
     */
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

    /**
     * Flatten array
     * @param arr
     * @param container
     * @returns {*}
     */
    flattenArray: (arr: Array<any>, container?: Array<any>): Array<any> => {
        let containerArray = container || [];
        
        return [].concat.apply(containerArray, arr);
    }
};

export {HELPER};