/**
 * Created by isp on 6/23/16.
 */

import * as _ from 'lodash';

import ShapesGeometry from './../ShapesGeometry';
import {Shape, ShapeAdvancedOptions} from "./../../Interfaces/shapeInterfaces";
import {SHAPES} from './../../Utils/globals';
import {HELPER} from './../../Utils/helper';

export default class CompositeGeometry extends ShapesGeometry {
    constructor() {
        super();
    }

    /**
     * Get grouped series of shapes for further transformation
     * @param startShapes
     * @param endShapes
     * @param options
     * @returns {Array<Array<Array<Shape>>>}
     */
    public transformShapes(startShapes: Array<Shape>,
                           endShapes: Array<Shape>,
                           options?: ShapeAdvancedOptions): 
                            Array<Array<Array<Shape>>> {

        this.checkShapeTextType(startShapes);
        this.checkShapeTextType(endShapes);
        
        let shapesArrRatio = this.shapesArraysRatio(startShapes, endShapes);
        let groupedShapes = this.groupShapes(startShapes, endShapes, shapesArrRatio);
        
        groupedShapes.forEach((groupedShape, index) =>
            this.decompositeShape(groupedShapes[index], shapesArrRatio));
        
        return groupedShapes;
    }

    /**
     * Split and redefine shapes in smaller and bigger groups
     * @param shapesGroup
     * @param shapesArraysRatio
     * @returns {Array<Array<Shape>>}
     */
    decompositeShape(shapesGroup: Array<Array<Shape>>,
                    shapesArraysRatio: number) {
        
        if (shapesArraysRatio === 0) {
            return shapesGroup;
        } else if (shapesArraysRatio === 1) {
            let shapesPolygons =
                shapesGroup[0].map((shape) => shape.geometry.polygons);
            let shapesPolygonsSum = this.groupPolygonsSum(shapesGroup[0]);
            let normalizedPolygons = HELPER.commonMultiple(
                shapesPolygonsSum, shapesGroup[1][0].geometry.polygons);

            shapesGroup[1][0].geometry.polygons = normalizedPolygons;

            let transformedShape = this.convertToPolygon(shapesGroup[1][0]);
            let shapesNormalizedPolygons =
                this.normalizeShapesPolygons(shapesPolygons, shapesPolygonsSum,
                    transformedShape.geometry.polygons);

            shapesGroup[1] =
                this.splitShapePolygon(transformedShape, shapesNormalizedPolygons);

            shapesGroup[0] = shapesGroup[0].map((shape, index) => {
                shape.geometry.polygons = shapesNormalizedPolygons[index];

                return this.convertToPolygon(shape);
            });
            
        } else {
            let shapesPolygons =
                shapesGroup[1].map((shape) => shape.geometry.polygons);
            let shapesPolygonsSum = this.groupPolygonsSum(shapesGroup[1]);
            let normalizedPolygons = HELPER.commonMultiple(
                shapesPolygonsSum, shapesGroup[0][0].geometry.polygons);

            shapesGroup[0][0].geometry.polygons = normalizedPolygons;

            let transformedShape = this.convertToPolygon(shapesGroup[0][0]);
            let shapesNormalizedPolygons =
                this.normalizeShapesPolygons(shapesPolygons, shapesPolygonsSum,
                    transformedShape.geometry.polygons);

            shapesGroup[0] =
                this.splitShapePolygon(transformedShape, shapesNormalizedPolygons);
            
            shapesGroup[1] = shapesGroup[1].map((shape, index) => {
                shape.geometry.polygons = shapesNormalizedPolygons[index];

                return this.convertToPolygon(shape);
            });
        }
    }

    /**
     * Split polygon points accordingly to bigger group normalized polygons amount
     * Linear method
     * @param polygon
     * @param chunks
     * @param polygonsSum
     * @returns {Array}
     */
    splitPolygon(polygon: Shape, chunks: Array<number>): Array<Shape> {
        let splitPoints = [];
        let points = _.clone(polygon.geometry.points)[Symbol.iterator]();
        
        chunks.forEach((chunk) => {
            let splitGroup = [];

            for (let i = 0; i < chunk; i++) {
                splitGroup.push(points.next().value);
                splitGroup.push(points.next().value);
            }

            splitPoints.push(splitGroup);
        });
        
        let splitPolygons = splitPoints.map(points => {
            polygon.geometry.referencePoints = points;
            polygon.geometry.polygons = points.length / 2;

            return this.convertToPolygon(polygon);
        });
        
        return splitPolygons;
    }

    /**
     * Split smaller shape polygon points into number of polygons fitted with bigger group
     * Random method
     * @param polygon
     * @param chunks
     * @returns {Shape[]}
     */
    splitShapePolygon(polygon: Shape, chunks: Array<number>): Array<Shape> {
        let splitPoints = [];
        let points = _.clone(polygon.geometry.points);
        let counter = 0;
        let pointsPairs = [];

        for (let i = 0; i < points.length - 1; i+=2) {
            pointsPairs.push([points[i], points[i+1]]);
        }

        let pointsPairsShuffled = _.shuffle(pointsPairs);
        
        chunks.forEach((chunk) => {
            let splitGroup = [];

            for (let i = 0; i < chunk; i++) {
                splitGroup.push(pointsPairsShuffled[counter][0]);
                splitGroup.push(pointsPairsShuffled[counter][1]);

               counter++;
            }

            splitPoints.push(splitGroup);
        });

        let splitPolygons = splitPoints.map(points => {
            polygon.geometry.referencePoints = points;
            polygon.geometry.polygons = points.length / 2;

            return this.convertToPolygon(polygon);
        });
        
        return splitPolygons;
    }

    /**
     * Split polygons of bigger shapes group accordingly to normalized polygons amount
     * @param shapesPolygons
     * @param shapesPolygonsSum
     * @param normalizedPolygons
     * @returns {number[]}
     */
    normalizeShapesPolygons(shapesPolygons: Array<number>,
                            shapesPolygonsSum: number,
                            normalizedPolygons: number): Array<number> {
        let weightCoefficient = normalizedPolygons / shapesPolygonsSum;
        let nPolygons = shapesPolygons.map(polygon =>
            Math.round(polygon * weightCoefficient));
        let delta = normalizedPolygons -
            nPolygons.reduce((a,b) => a + b);

        if (delta !== 0) {
            if (delta > 0) {
                let counter = 0;

                while (delta !== 0) {
                    if (nPolygons[counter]) {
                        nPolygons[counter]++;
                        counter++
                    } else {
                        counter = 0;
                        nPolygons[0]++;
                        counter++;
                    }

                    delta--;
                }
            } else {
                let counter = 0;

                while (delta !== 0) {
                    if (nPolygons[counter]) {
                        nPolygons[counter]--;
                        counter++
                    } else {
                        counter = 0;
                        nPolygons[0]--;
                        counter++;
                    }

                    delta++;
                }
            }
        }
        
        return nPolygons;
    }

    /**
     * Sum of all polygons from bigger group
     * @param shapesGroup
     * @returns {T|any|number}
     */
    private groupPolygonsSum(shapesGroup:Array<Shape>): number {
        return shapesGroup
            .map((shape) => shape.geometry.polygons)
            .reduce((a, b) => a + b);
    }

    /**
     * Create a set of equally distributed group shapes from both arrays
     * @param sShapes
     * @param eShapes
     * @param ratio
     * @returns {Array}
     */
    private groupShapes(sShapes: Array<Shape>,
                        eShapes: Array<Shape>, ratio: number):
                                        Array<Array<Array<Shape>>> {
        let groupedShapes = [];
        let startShapes = sShapes.map(shape => _.cloneDeep(shape));
        let endShapes = eShapes.map(shape => _.cloneDeep(shape));

        if (ratio === 0) {
            startShapes.forEach((shape, index) => {
                groupedShapes.push([[shape], [endShapes[index]]]);
            });
            
        } else if (ratio === 1) {
            let startShapesSize = startShapes.length;
            let endShapesSize = endShapes.length;
            let shapesRatioArray =
                this.shapesSplitRatio(startShapesSize, endShapesSize);
            let counter = 0;

            endShapes.forEach((shape, index) => {
                let shapesGroup = [];

                for (let i = 0; i < shapesRatioArray[index]; i++) {
                    shapesGroup.push(startShapes[counter]);
                    counter++;
                }

                groupedShapes.push([shapesGroup, [shape]]);
            });
            
        } else {
            let startShapesSize = startShapes.length;
            let endShapesSize = endShapes.length;
            let shapesRatioArray =
                this.shapesSplitRatio(endShapesSize, startShapesSize);
            let counter = 0;

            startShapes.forEach((shape, index) => {
                let shapesGroup = [];

                for (let i = 0; i < shapesRatioArray[index]; i++) {
                    shapesGroup.push(endShapes[counter]);
                    counter++;
                }

                groupedShapes.push([[shape], shapesGroup]);
            });
        }

        return groupedShapes;
    }

    /**
     * Normalized ratio for equal distribution of shapes from both arrays
     * @param startShapesSize
     * @param endShapesSize
     * @param leftDirection
     * @returns {Array}
     */
    private shapesSplitRatio(startShapesSize: number,
                             endShapesSize: number): Array<number> {

        let shapesRatio;
        let delta;
        let shapesRatioArray = [];

        shapesRatio = Math.floor(startShapesSize / endShapesSize);
        delta = startShapesSize -
            endShapesSize * shapesRatio;

        for (let i = 0; i < endShapesSize; i++) {
            shapesRatioArray.push(shapesRatio);
        }

        if (delta !== 0) {
            if (delta > 1) {
                let counter = 0;

                while (delta !== 0) {
                    if (shapesRatioArray[counter]) {
                        shapesRatioArray[counter]++;
                        counter++
                    } else {
                        counter = 0;
                        shapesRatioArray[0]++;
                        counter++;
                    }

                    delta--;
                }
            } else {
                shapesRatioArray[shapesRatioArray.length - 1] = shapesRatio + delta;
            }
        }

        return shapesRatioArray;
    }

    /**
     * Define which shapes group is bigger
     * @param firstShapesArr
     * @param secondShapesArr
     * @returns {number}
     */
    private shapesArraysRatio(firstShapesArr: Array<Shape>,
                             secondShapesArr: Array<Shape>): number {

        if (firstShapesArr.length == secondShapesArr.length) return 0;
        else if (firstShapesArr.length > secondShapesArr.length) return 1;
        else return -1;
    }

    /**
     * Check whether groups do not contain text fields
     * @param shapes
     */
    private checkShapeTextType(shapes) {
        shapes.forEach((shape) => {
            if (shape.type === SHAPES.text.toUpperCase()) {
                throw new Error('Shape of type ' + SHAPES.text.toUpperCase() +
                    ' cannot be used in transformations');
            }
        });
    }
}