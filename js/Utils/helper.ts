/**
 * Created by isp on 4/25/16.
 */

import * as _ from 'lodash';

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
    commonMultiple: (sShapePolygons: number, 
                     eShapePolygons: number, 
                     sShapeCoef?: number, eShapeCoef?: number): number => {
        let startShapeCoef = sShapeCoef || 1;
        let endShapeCoef = eShapeCoef || 1;
        
        let polygons = Math.max(sShapePolygons, eShapePolygons);

        if (polygons % startShapeCoef === 0 && polygons % endShapeCoef === 0) {
            return polygons;
        } else {
            polygons++;

            return HELPER.commonMultiple(polygons, polygons, startShapeCoef, endShapeCoef);
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
    },

    /**
     * Split array for custom array chunks
     * @param arr
     * @param chunks
     * @returns {Array}
     */
    splitArray: (arr: Array<any>, chunks: Array<number>): Array<Array<any>> => {
        let resultArray = [];
        let flatArray = _.clone(arr);
        
        chunks.forEach((number, index) => {
            let chunkArray = [];

            for (let i = 0; i < number; i++) {
                chunkArray.push(flatArray[0]);
                flatArray.shift();
            }
            
            resultArray.push(chunkArray);
        });
        
        return resultArray;
    },

    /**
     * Merge shape and initial options
     * @param shape
     * @param optionsObj1
     * @param optionsObj2
     * @param mergeLeft
     * @returns {any}
     */
    mergeOptions: (shape: any, optionsObj1: any, optionsObj2: any, mergeLeft?: boolean): any => {
        let mergeDirectionLeft = mergeLeft === undefined || mergeLeft === true;

        if (mergeDirectionLeft && !optionsObj1) {
            return optionsObj2;
        }

        if (!mergeDirectionLeft && !optionsObj2) {
            return optionsObj1;
        }
        
        if (mergeDirectionLeft) {
            HELPER.setOptions(shape, optionsObj1);

            Object.keys(optionsObj2).forEach(key => {
                if (!optionsObj1.hasOwnProperty(key)) {
                    HELPER.setOption(shape, key, optionsObj2[key]);
                }
            });
        } else {
            HELPER.setOptions(shape, optionsObj2);

            Object.keys(optionsObj1).forEach(key => {
                if (!optionsObj2.hasOwnProperty(key)) {
                    HELPER.setOption(shape, key, optionsObj1[key]);
                }
            });
        }
        
        return shape;
    },

    /**
     * Set shape options
     * @param shape
     * @param optionsObj
     * @param parentProperty
     */
    setOptions: (shape: any, optionsObj: any, parentProperty?: string): void => {
        Object.keys(optionsObj).forEach(key => {
            if (parentProperty) {
                HELPER.setOption(shape, key, optionsObj[key], parentProperty);
            } else {
                HELPER.setOption(shape, key, optionsObj[key]);
            }
        });
    },

    /**
    * Set single style property
    * @param shape
    * @param property
    * @param value
    * @param parentProperty
    */
    setOption: (shape: any, property: string,
                value: any, parentProperty?: string): void => {

        if (parentProperty) {
            if (!shape[parentProperty]) {
                shape[parentProperty] = {};
            }

            shape[parentProperty][property] = value;
        } else {
            shape[property] = value;
        }
    },

    /**
     * Set points to Float32Array buffer
     * @param points
     * @param dimensions
     * @returns {Float32Array}
     */
    setPointsToBuffer: (points: Array<number>, dimensions: number): Float32Array => {
        let pointsLength = points.length / 2;
        let buffer = new ArrayBuffer(pointsLength * 4 * dimensions);
        let fl32XY = new Float32Array(buffer);

        fl32XY.set(points);

        return fl32XY;
    },

    /**
     * Convert set of points arrays to Float32Array buffer
     * @param arrays
     * @param dimensions
     * @returns {Float32Array[]}
     */
    setArraysToBuffer (arrays: Array<Array<number>>, dimensions: number): Array<Float32Array> {
        return arrays.map(function(arr) {
            return this.setPointsToBuffer(arr, dimensions);
        });
    },

    /**
     * Generates unique ID number for shapes
     * @returns {string}
     */
    generateUID (): string {
        let head = (Math.random() * 46656) | 0;
        let tail = (Math.random() * 46656) | 0;

        let strHead = ("000" + head.toString(36)).slice(-3);
        let strTail = ("000" + tail.toString(36)).slice(-3);
        
        return strHead + strTail;
    }
};

export {HELPER};