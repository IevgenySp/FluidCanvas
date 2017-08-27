/**
 * Created by isp on 8/20/17.
 */

var myChart = echarts.init(document.getElementById('main'));
var styleSwitchLineButton = document.getElementById('line');
var styleSwitchBarButton = document.getElementById('bar');
var styleSwitchUsMapButton = document.getElementById('map');

var canvasEl = document.createElement("CANVAS");
canvasEl.setAttribute("id", "animationLayer");
canvasEl.setAttribute("class", "animizer-canvas-main");
document.getElementById("main").appendChild(canvasEl);

var fluidCanvas = new FluidCanvas(canvasEl);
var currentChart = 'bar';
var usaData = USA;

/**
 * Adaptation for retina display
 */
var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.getElementsByClassName("animizer-canvas-main")[0];
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
};

var canvas = createHiDPICanvas(myChart.getWidth(), myChart.getHeight());
var context = canvas.getContext('2d');

var bars = {
    title: {
        text: 'Fluid Canvas Bars-Lines transformation',
        textStyle: {
            color: '#ffffff',
            fontFamily: 'MuseoSansLight',
            fontSize: 14
        }
    },
    tooltip: {},
    legend: {
        data:['Sales'],
        textStyle: {
            color: "#fff"
        },
        inactiveColor: '#ccc'
    },
    xAxis: {
        data: ["shirt","cardign","chiffon shirt","pants","heels","socks"],
        axisLine: {
            lineStyle: {
                color: '#ffffff'
            }
        }
    },
    yAxis: {
        axisLine: {
            lineStyle: {
                color: '#ffffff'
            }
        }
    },
    series: [{
        name: 'Sales',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20],
        itemStyle: {
            normal: {
                color: 'rgba(247, 133, 24, 1)'
            }
        }
    }]
};
var barsTransparent = {
    title: {
        text: 'Fluid Canvas Bars-Lines transformation',
        textStyle: {
            color: '#ffffff',
            fontFamily: 'MuseoSansLight',
            fontSize: 14
        }
    },
    tooltip: {},
    legend: {
        data:['Sales'],
        textStyle: {
            color: "#fff"
        },
        inactiveColor: '#ccc'
    },
    xAxis: {
        data: ["shirt","cardign","chiffon shirt","pants","heels","socks"],
        axisLine: {
            lineStyle: {
                color: '#ffffff'
            }
        }
    },
    yAxis: {
        axisLine: {
            lineStyle: {
                color: '#ffffff'
            }
        }
    },
    series: [{
        name: 'Sales',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20],
        itemStyle: {
            normal: {
                color: 'rgba(247, 133, 24, 0)'
            }
        }
    }]
};
var line = {
    title: {
        text: 'Fluid Canvas Bars-Lines transformation',
        textStyle: {
            color: '#ffffff',
            fontFamily: 'MuseoSansLight',
            fontSize: 14
        }
    },
    tooltip: {},
    legend: {
        data:['Sales'],
        textStyle: {
            color: "#fff"
        },
        inactiveColor: '#ccc'
    },
    xAxis: {
        data: ["shirt","cardign","chiffon shirt","pants","heels","socks"],
        axisLine: {
            lineStyle: {
                color: '#ffffff'
            }
        }
    },
    yAxis: {
        axisLine: {
            lineStyle: {
                color: '#ffffff'
            }
        }
    },
    series: [
        {
            name: 'Sales',
            type: 'line',
            itemStyle: {
                normal: {
                    color: 'rgba(30, 136, 229, 1)'
                }
            },
            data: [5, 20, 36, 10, 10, 20],
            showSymbol: true
        }
    ],
    animation: false
};
var lineTransparent = {
    title: {
        text: 'Fluid Canvas Bars-Lines transformation',
        textStyle: {
            color: '#ffffff',
            fontFamily: 'MuseoSansLight',
            fontSize: 14
        }
    },
    tooltip: {},
    legend: {
        data:['Sales'],
        textStyle: {
            color: "#fff"
        },
        inactiveColor: '#ccc'
    },
    xAxis: {
        data: ["shirt","cardign","chiffon shirt","pants","heels","socks"],
        axisLine: {
            lineStyle: {
                color: '#ffffff'
            }
        }
    },
    yAxis: {
        axisLine: {
            lineStyle: {
                color: '#ffffff'
            }
        }
    },
    series: [
        {
            name: 'Sales',
            type: 'line',
            itemStyle: {
                normal: {
                    color: 'rgba(30, 136, 229, 0)'
                }
            },
            data: [5, 20, 36, 10, 10, 20],
            showSymbol: false
        }
    ],
    animation: false
};

echarts.registerMap('USA', usaData, {
    Alaska: {
        left: -131,
        top: 25,
        width: 15
    },
    Hawaii: {
        left: -110,
        top: 28,
        width: 5
    },
    'Puerto Rico': {
        left: -76,
        top: 26,
        width: 2
    }
});
var usMap = {
    title: {
        text: 'USA Population Estimates (2012)',
        subtext: 'Data from www.census.gov',
        sublink: './../data/USA.json',
        left: 'right'
    },
    tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2,
        formatter: function (params) {
            var value = (params.value + '').split('.');
            value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
            return params.seriesName + '<br/>' + params.name + ': ' + value;
        }
    },
    visualMap: {
        left: 'right',
        min: 500000,
        max: 38000000,
        inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        },
        text:['High','Low'],
        calculable: true
    },
    toolbox: {
        show: true,
        //orient: 'vertical',
        left: 'left',
        top: 'top',
        feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
        }
    },
    series: [
        {
            name: 'USA PopEstimates',
            type: 'map',
            roam: true,
            map: 'USA',
            itemStyle:{
                emphasis:{label:{show:true}}
            },
            textFixed: {
                Alaska: [20, -20]
            },
            data:[
                {name: 'Alabama', value: 4822023},
                {name: 'Alaska', value: 731449},
                {name: 'Arizona', value: 6553255},
                {name: 'Arkansas', value: 2949131},
                {name: 'California', value: 38041430},
                {name: 'Colorado', value: 5187582},
                {name: 'Connecticut', value: 3590347},
                {name: 'Delaware', value: 917092},
                {name: 'District of Columbia', value: 632323},
                {name: 'Florida', value: 19317568},
                {name: 'Georgia', value: 9919945},
                {name: 'Hawaii', value: 1392313},
                {name: 'Idaho', value: 1595728},
                {name: 'Illinois', value: 12875255},
                {name: 'Indiana', value: 6537334},
                {name: 'Iowa', value: 3074186},
                {name: 'Kansas', value: 2885905},
                {name: 'Kentucky', value: 4380415},
                {name: 'Louisiana', value: 4601893},
                {name: 'Maine', value: 1329192},
                {name: 'Maryland', value: 5884563},
                {name: 'Massachusetts', value: 6646144},
                {name: 'Michigan', value: 9883360},
                {name: 'Minnesota', value: 5379139},
                {name: 'Mississippi', value: 2984926},
                {name: 'Missouri', value: 6021988},
                {name: 'Montana', value: 1005141},
                {name: 'Nebraska', value: 1855525},
                {name: 'Nevada', value: 2758931},
                {name: 'New Hampshire', value: 1320718},
                {name: 'New Jersey', value: 8864590},
                {name: 'New Mexico', value: 2085538},
                {name: 'New York', value: 19570261},
                {name: 'North Carolina', value: 9752073},
                {name: 'North Dakota', value: 699628},
                {name: 'Ohio', value: 11544225},
                {name: 'Oklahoma', value: 3814820},
                {name: 'Oregon', value: 3899353},
                {name: 'Pennsylvania', value: 12763536},
                {name: 'Rhode Island', value: 1050292},
                {name: 'South Carolina', value: 4723723},
                {name: 'South Dakota', value: 833354},
                {name: 'Tennessee', value: 6456243},
                {name: 'Texas', value: 26059203},
                {name: 'Utah', value: 2855287},
                {name: 'Vermont', value: 626011},
                {name: 'Virginia', value: 8185867},
                {name: 'Washington', value: 6897012},
                {name: 'West Virginia', value: 1855413},
                {name: 'Wisconsin', value: 5726398},
                {name: 'Wyoming', value: 576412},
                {name: 'Puerto Rico', value: 3667084}
            ]
        }
    ]
};

myChart.setOption(usMap, { notMerge: true });
var usMapShapes = getEchartsParams('usMap');
myChart.setOption(lineTransparent, { notMerge: true });
var lineShapes = getEchartsParams('line');
myChart.setOption(bars, { notMerge: true });
var barShapes = getEchartsParams('bar');

var usMapGeometries = getShapeGeometry('polygon', usMapShapes);
var barGeometries = getShapeGeometry('rectangle', barShapes);
var lineGeometries = getShapeGeometry('line', lineShapes);


function getEchartsParams(shapeType) {
    var paramsArr = [];
    var shapes = shapeType !== 'usMap' ?
        myChart._chartsViews[0]._data._itemLayouts :
        myChart._chartsViews[0].group.__storage._displayList;

    _.forEach(shapes, function(obj, index) {
        var params = {};

        switch(shapeType) {
            case 'bar':
                params.x = obj.x;
                params.y = obj.y;
                params.width = obj.width;
                params.height = obj.height;

                params.advanced = {
                    isPolygonRender: false,
                    drawAsCanvasShape: true,
                    interpolation: 'linear'
                };
                params.style = {
                    isFill: true,
                    color: '#f78518'
                };

                paramsArr.push(params);
                break;
            case 'line':
                if (shapes[index + 1]) {
                    params.points = [
                        obj[0], obj[1],
                        shapes[index + 1][0], shapes[index + 1][1]
                    ];

                    params.advanced = {
                        isPolygonRender: false,
                        drawAsCanvasShape: true,
                        interpolation: 'linear'
                    };
                    params.style = {
                        isFill: true,
                        color: '#1e88e5'
                    };

                    paramsArr.push(params);
                }
                break;
            case 'usMap':
                if (obj.shape && obj.shape.paths) {
                    var points = obj.shape.paths[0].shape.points;
                    var transformedPoints = [];
                    var color = obj.style.fill;

                    function applyTransform(out, v, m) {
                        var x = v[0];
                        var y = v[1];
                        out[0] = m[0] * x + m[2] * y + m[4];
                        out[1] = m[1] * x + m[3] * y + m[5];
                        return out;
                    }

                    points.forEach(function(point, index) {

                        transformedPoints.push(
                            applyTransform([], point, obj.transform));

                    });

                    transformedPoints.pop();

                    params.points = _.flattenDeep(transformedPoints);

                    params.advanced = {
                        isPolygonRender: false,
                        drawAsCanvasShape: false,
                        interpolation: 'linear'
                    };
                    params.style = {
                        isFill: true,
                        color: color,
                        state: 'State_' + index
                    };

                    paramsArr.push(params);
                }
        }
    });

    return paramsArr;

}

function getShapeGeometry(shapeType, shapesArr) {
    var shapeGeometry = [];

    shapesArr.forEach(function(shape) {
        shapeGeometry.push(
            fluidCanvas.shape(shapeType, shape));
    });

    return shapeGeometry;
}

function animate(nextChart) {
    canvasEl.style.display = 'block';

    switch (currentChart) {
        case 'bar':
            if (nextChart === 'line') {
                myChart.setOption(barsTransparent, { notMerge: true });
                fluidCanvas.animate(barGeometries, lineGeometries);
            } else if (nextChart === 'usMap') {
                myChart.clear();
                fluidCanvas.animate(barGeometries, usMapGeometries);
            }
            break;
        case 'line':
            if (nextChart === 'bar') {
                myChart.setOption(lineTransparent, { notMerge: true });
                fluidCanvas.animate(lineGeometries, barGeometries);
            } else if (nextChart === 'usMap') {
                myChart.clear();
                fluidCanvas.animate(lineGeometries, usMapGeometries);
            }
            break;
        case 'usMap':
            if (nextChart === 'bar') {
                myChart.clear();
                fluidCanvas.animate(usMapGeometries, barGeometries);
            } else if (nextChart === 'line') {
                myChart.clear();
                fluidCanvas.animate(usMapGeometries, lineGeometries);
            }
            break;

    }

    currentChart = nextChart;
}

fluidCanvas.on('onAnimationStop', function() {
    canvasEl.style.display = 'none';

    if (currentChart === 'line') {
        myChart.setOption(line);
    } else if (currentChart === 'bar') {
        bars.animation = false;
        myChart.setOption(bars);
    } else if (currentChart === 'usMap') {
        myChart.setOption(usMap, { notMerge: true });
    }

});

styleSwitchLineButton.addEventListener("click", function() { animate('line')} );
styleSwitchBarButton.addEventListener("click", function() { animate('bar')} );
styleSwitchUsMapButton.addEventListener("click", function() { animate('usMap')} );