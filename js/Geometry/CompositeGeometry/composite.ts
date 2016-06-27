/**
 * Created by isp on 6/23/16.
 */

import * as _ from 'lodash';

import ShapesGeometry from './../shapes';
import {Shapes} from "./../../Interfaces/shapeInterfaces";
import {SYSTEM_PARAMETERS, SHAPES} from './../../Utils/globals';

export default class CompositeGeometry extends ShapesGeometry {
    params:any;

    constructor(parameters?:any) {
        super(parameters);
    }

    public getCompositeShape(shapes: Array<Shapes>): any {
        let composite = shapes[0];
        let points = shapes[0].points;

        composite.type = SHAPES.composite;
        composite.isRendered = false;

        for (let i = 1; i < shapes.length; i++) {
            points = this.mergeArrays(points, shapes[i].points);

            composite.polygons += shapes[i].polygons;
            composite.points = points;
        }
    }

    public getDecompositeShapes(shapes: Array<Shapes>, shapeToDecomp: Shapes): Array<Shapes> {
        let compositePolygonsLength = this.getCompositPointsLength(shapes);
        let shapePolygonsLength = shapeToDecomp.polygons;
        let maxPolygons = Math.max(compositePolygonsLength, shapePolygonsLength);
        let polygonsPerShape = ~~(maxPolygons / shapes.length);


        let pointsChunks = this.splitPoints(shapeToDecomp, shapes.length);
        let pointsChunksFloat32Array = this.convertToFloat32Array(pointsChunks);

        let pntsChunks = this.splitBasePoints(shapeToDecomp, shapes.length);
        shapeToDecomp.childs = [];

        let decomposedShapes = shapes.map((shape, index) => {
            let newShape: Shapes = _.clone(shapeToDecomp);

            delete newShape.childs;

            newShape.polygons = polygonsPerShape;

            if (pntsChunks.length > 0) {
                newShape.pnts = pntsChunks[index];
                newShape.polygons = newShape.pnts.length / 2;
            }

            if (pointsChunksFloat32Array.length > 0) {
                newShape.points = pointsChunksFloat32Array[index];
                // shape.points.length not divided by 2 since same amount
                // of reversed points for contour will be added
                newShape.polygons = newShape.points.length;
            }

            newShape.parent = shapeToDecomp;
            shapeToDecomp.childs.push(newShape);

            newShape.id = 'child_' + index + ':' + newShape.id;

            return newShape;
        });
        
        return decomposedShapes;
    }

    public mergeArrays (arr1: Float32Array, arr2: Float32Array): Float32Array {
        let pointsLength = (arr1.length + arr2.length) / 2;
        let buffer = new ArrayBuffer(pointsLength * 4 * SYSTEM_PARAMETERS.dimentions);
        let fl32XY = new Float32Array(buffer);

        let points = [];

        for (let i = 0; i < arr1.length; i++) {
            points.push(arr1[i])
        }

        for (let i = 0; i < arr2.length; i++) {
            points.push(arr2[i]);
        }

        fl32XY.set(points);

        return fl32XY;
    }

    public getCompositPointsLength(shapes: Array<Shapes>): number {
        let polygons = 0;

        for (let i = 0; i < shapes.length; i++) {
            polygons += shapes[i].polygons;
        }

        return polygons;
    }
    
    public getShapesRatio (startShapes: Array<Shapes>, endShapes: Array<Shapes>) {
        let shapes = {
            direction: 'equal',
            ratio: []
        };

        if (startShapes.length === endShapes.length) {
            startShapes.map(() => {
                shapes.ratio.push(1);
            });
        }

        if (startShapes.length > endShapes.length) {
            shapes.direction = 'start';

            let basePart = Math.floor(startShapes.length / endShapes.length);
            let rest = startShapes.length - endShapes.length * basePart;

            shapes.ratio = endShapes.map((shape, index) => {
                return basePart;
            });

            shapes.ratio[0] = shapes.ratio[0] + rest;
        }

        if (startShapes.length < endShapes.length) {
            shapes.direction = 'end';

            let basePart = Math.floor(endShapes.length / startShapes.length);
            let rest = endShapes.length - startShapes.length * basePart;

            shapes.ratio = startShapes.map((shape, index) => {
                return basePart;
            });
            
            shapes.ratio[0] = shapes.ratio[0] + rest;
        }
        
        return shapes;
    }

    public splitPoints (shape: Shapes, splitFactor: number): Array<Array<number>> {
        try {
            
            let polygons = shape.type === SHAPES.line || shape.type === SHAPES.bezierLine ?
                shape.polygons / 2 : shape.polygons;
            let fullPointsSets = Math.floor(polygons / splitFactor);
            let lastPoints = polygons - fullPointsSets * splitFactor;
            let splittedPoints = [];
            let pnts = shape.points[Symbol.iterator]();

            for (let i = 0; i < splitFactor; i++) {
                let pointsChunk = [];

                for (let f = 0; f < fullPointsSets; f++) {
                    pointsChunk.push(pnts.next().value);
                    pointsChunk.push(pnts.next().value);
                }

                splittedPoints.push(pointsChunk);
            }

            let chunk = [];

            while (lastPoints > 0) {
                chunk.push(pnts.next().value);

                lastPoints--;
            }

            if (chunk.length > 0) {
                splittedPoints.push(chunk);
            }

            return splittedPoints;
        } catch (e) {
            console.log('shape points or polygons is not defined');
        }
    }

    public splitBasePoints (shape: Shapes, splitFactor: number): Array<Array<number>> {
        try {

            if (!shape.pnts) return [];

            let polygons = shape.pnts.length / 2;
            let fullPointsSets = Math.floor(polygons / splitFactor);
            let lastPoints = polygons - fullPointsSets * splitFactor;
            let splittedPoints = [];
            let pnts = shape.pnts[Symbol.iterator]();

            for (let i = 0; i < splitFactor; i++) {
                let pointsChunk = [];

                for (let f = 0; f < fullPointsSets; f++) {
                    pointsChunk.push(pnts.next().value);
                    pointsChunk.push(pnts.next().value);
                }

                splittedPoints.push(pointsChunk);
            }

            let chunk = [];

            while (lastPoints > 0) {
                chunk.push(pnts.next().value);

                lastPoints--;
            }

            if (chunk.length > 0) {
                splittedPoints.push(chunk);
            }

            return splittedPoints;
        } catch (e) {
            console.log('shape pnts is not defined');
        }
    }

    public convertToFloat32Array (arrays: Array<Array<number>>): Array<Float32Array> {
        return arrays.map(function(arr) {
            let pointsLength = arr.length / 2;
            let buffer = new ArrayBuffer(pointsLength * 4 * SYSTEM_PARAMETERS.dimentions);
            let fl32XY = new Float32Array(buffer);

            fl32XY.set(arr);

            return fl32XY;
        });
    }
}