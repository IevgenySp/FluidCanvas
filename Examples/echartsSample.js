/**
 * Created by isp on 6/4/17.
 */

/*var canvas = document.getElementsByClassName("animizer-canvas-main")[0];
canvas.width = 1000;
canvas.height = 300;
var context = canvas.getContext('2d');

var fluidCanvas = new FluidCanvas(context);
var constructor = fluidCanvas.shapesConstructor;*/

var myChart = echarts.init(document.getElementById('main'));
var styleSwitchButton = document.getElementById('styleSwitch');

var canvasEl = document.createElement("CANVAS");
canvasEl.setAttribute("id", "animationLayer");
document.getElementById("main").appendChild(canvasEl);

canvasEl.width = myChart.getWidth();
canvasEl.height = myChart.getHeight();

var animationContext = canvasEl.getContext('2d');

var option = {
    title: {
        text: 'ECharts entry example'
    },
    tooltip: {},
    legend: {
        data:['Sales']
    },
    xAxis: {
        data: ["shirt","cardign","chiffon shirt","pants","heels","socks"]
    },
    yAxis: {},
    series: [{
        name: 'Sales',
        type: 'bar',
        //data: [5, 20, 36, 10, 10, 20],
        data: [
            {
                value: 5,
                itemStyle: {
                    normal: {
                        //color: '#c23531'
                        color: 'rgba(194, 53, 49, 1)'
                    }
                }
            },
            {
                value: 20,
                itemStyle: {
                    normal: {
                        //color: '#c23531'
                        color: 'rgba(194, 53, 49, 1)'
                    }
                }
            },
            {
                value: 36,
                itemStyle: {
                    normal: {
                        //color: '#c23531'
                        color: 'rgba(194, 53, 49, 1)'
                    }
                }
            },
            {
                value: 10,
                itemStyle: {
                    normal: {
                        //color: '#c23531'
                        color: 'rgba(194, 53, 49, 1)'
                    }
                }
            },
            {
                value: 10,
                itemStyle: {
                    normal: {
                        //color: '#c23531'
                        color: 'rgba(194, 53, 49, 1)'
                    }
                }
            },
            {
                value: 20,
                itemStyle: {
                    normal: {
                        //color: '#c23531'
                        color: 'rgba(194, 53, 49, 1)'
                    }
                }
            }
        ]
    }]
};

var newOption = {
    title: {
        text: 'ECharts entry example'
    },
    tooltip: {},
    legend: {
        data:['Sales']
    },
    xAxis: {
        data: ["shirt","cardign","chiffon shirt","pants","heels","socks"]
    },
    yAxis: {},
    series: [{
        name: 'Sales',
        type: 'line',
        //data: [5, 20, 36, 10, 10, 20],
        data: [
            {
                value: 5,
                itemStyle: {
                    normal: {
                        //color: '#c23531'
                        color: 'rgba(194, 53, 49, 1)'
                    }
                }
            },
            {
                value: 20,
                itemStyle: {
                    normal: {
                        //color: '#c23531'
                        color: 'rgba(194, 53, 49, 1)'
                    }
                }
            },
            {
                value: 36,
                itemStyle: {
                    normal: {
                        //color: '#c23531'
                        color: 'rgba(194, 53, 49, 1)'
                    }
                }
            },
            {
                value: 10,
                itemStyle: {
                    normal: {
                        //color: '#c23531'
                        color: 'rgba(194, 53, 49, 1)'
                    }
                }
            },
            {
                value: 10,
                itemStyle: {
                    normal: {
                        //color: '#c23531'
                        color: 'rgba(194, 53, 49, 1)'
                    }
                }
            },
            {
                value: 20,
                itemStyle: {
                    normal: {
                        //color: '#c23531'
                        color: 'rgba(194, 53, 49, 1)'
                    }
                }
            }
        ]
    }]
};

myChart.setOption(option, {
    /*lazyUpdate: true,
    silent: true*/
});

//var vBarsParams = [];
//var vBarsParamsInit = [];

function getEchartsParams(shapeType) {
    /*_.forEach(myChart._chartsMap, function(val, key) {
        _.forEach(val._data._itemLayouts, function(obj) {
            var params = [];

            params.push(obj.x);
            params.push(obj.y);
            params.push(obj.width);
            params.push(obj.height);

            vBarsParams.push(params);

        });
    });*/

    var paramsArr = [];
    var shapes = myChart._chartsViews[0]._data._itemLayouts;

    _.forEach(shapes, function(obj, index) {
        var params = [];
        //var initParams = [];

        switch(shapeType) {
            case 'bar':
                params.push(obj.x);
                params.push(obj.y);
                params.push(obj.width);
                params.push(obj.height);

                paramsArr.push(params);
                break;
            case 'lines':
                if (shapes[index + 1]) {
                    params.push(obj[0]);
                    params.push(obj[1]);
                    params.push(shapes[index + 1][0]);
                    params.push(shapes[index + 1][1]);

                    paramsArr.push(params);
                }
                break;
            case 'singleLine':
                paramsArr.push(obj[0]);
                paramsArr.push(obj[1]);
        }

        /*initParams.push(obj.x);
        initParams.push(obj.y);
        initParams.push(obj.width);
        initParams.push(0);*/

        //vBarsParams.push(params);
        //vBarsParamsInit.push(initParams);

    });

    return paramsArr;

}

var vBarsParams = getEchartsParams('bar');

//var chartContext = $('.widgetContent').find('canvas')[0].getContext('2d');

var fluidCanvas = new FluidCanvas(animationContext);
var constructor = fluidCanvas.shapesConstructor;

var polygons = 50;

//var colors = ['#006E90', '#F18F01', '#ADCAD6', '#99C24D', '#41BBD9'];

var colors = ['#c23531', '#c23531', '#c23531', '#c23531', '#c23531'];

var params = {
    xEasing: 'easeOutExpo',
    yEasing: 'easeOutExpo'
};

//getEchartsParams();
//debugger;
//myChart.clear();

function buildBars(params, polygons) {
    var shapes = new Map();
    var shape;

    for (var i = 0; i < params.length; i++) {
        var bar = constructor.getRectangle(
            params[i][0],
            params[i][1],
            params[i][2],
            params[i][3], polygons);

        constructor.setStyle(bar, 'color', colors[i]);
        constructor.setStyle(bar, 'isFill', true);

        shape = fluidCanvas.defineShape(bar,
            {renderType: 'line', interpolationType: 'noInterpolation'});

        fluidCanvas.storage.setShapeCompositeId(shape);

        shapes.set(i, shape);
    }

    fluidCanvas.storage.incrementCompositeId();

    return shapes;
}

function buildLines(params, polygons) {
    var shapes = new Map();
    var shape;

    for (var i = 0; i < params.length; i++) {
        var line = constructor.getLine(params[i], polygons);

        constructor.setStyle(line, 'color', colors[i]);
        constructor.setStyle(line, 'isFill', true);
        constructor.setStyle(line, 'isStroke', true);

        shape = fluidCanvas.defineShape(line,
            {renderType: 'line', interpolationType: 'noInterpolation'});

        fluidCanvas.storage.setShapeCompositeId(shape);

        shapes.set(i, shape);
    }

    fluidCanvas.storage.incrementCompositeId();

    return shapes;
}

function buildLine(params, polygons) {
    var line = constructor.getLine(params, polygons);

    constructor.setStyle(line, 'color', colors[0]);
    constructor.setStyle(line, 'isFill', true);
    constructor.setStyle(line, 'isStroke', true);

    return fluidCanvas.defineShape(line,
        {renderType: 'line', interpolationType: 'noInterpolation'});
}

var vShapes = buildBars(vBarsParams, polygons);
//var vShapesInit = buildBars(vBarsParamsInit, polygons);

//var curShape = mapToArr(vShapesInit);

function render() {

    vShapes.forEach(function(shape, key) {
        fluidCanvas.render(shape, 'line');
    });

    canvasEl.style.display = 'block';

    myChart.setOption(newOption, {
        /*lazyUpdate: true,
         silent: true*/
    });

    var vLinesParams = getEchartsParams('lines');
    var lShapes = buildLines(vLinesParams, polygons);

    var curShape = mapToArr(vShapes);
    
    var ts = fluidCanvas.transform(curShape, mapToArr(lShapes), 'easing', params);

    curShape = ts.map(function(obj) {
        return obj.shape;
    });

    fluidCanvas.animate();



//debugger;
    /*var ts = fluidCanvas.transform(curShape, mapToArr(vShapes), 'easing', params);

    curShape = ts.map(function(obj) {
        return obj.shape;
    });

    fluidCanvas.animate();*/
}

styleSwitchButton.addEventListener("click", render);

//setTimeout(getEchartsParams, 3000);

function mapToArr (map) {
    var newArr = [];

    map.forEach(function(val) {
        newArr.push(val);
    });

    return newArr;
}