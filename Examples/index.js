/**
 * Created by isp on 4/10/16.
 */

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

var canvas = createHiDPICanvas(1000, 1000);
var context = canvas.getContext('2d');

// SHAPES DEFINITION

var initRect = {
    x: 50,
    y: 148,
    width: 100,
    height: 2,
    points: [50,148,150,148,150,150,50,150],
    advanced: {
        isPolygonRender: false,
        drawAsCanvasShape: false,
        interpolation: 'linear'
    },
    style: {
        isFill: true,
        color: '#f78518'
    }
};

var rect = {
    x: 50,
    y: 50,
    width: 100,
    height: 100,
    points: [50,50,150,50,150,150,50,150,50,50],
    advanced: {
        isPolygonRender: false,
        drawAsCanvasShape: false,
        interpolation: 'linear'
    },
    style: {
        isFill: true,
        color: '#f78518'
    }
};

var testRect = {
    x: 150,
    y: 50,
    width: 70,
    height: 70,
    points: [150,50,170,50,220,50,220,70,220,80,220,120,200,120,190,120,180,120,150,120,150,80,150,70],
    advanced: {
        isPolygonRender: true,
        drawAsCanvasShape: false,
        interpolation: 'linear'
    },
    style: {
        isFill: true
    }
};

var circ = {
    x: 250,
    y: 100,
    r: 50,
    startAngle: 215,
    advanced: {
        isPolygonRender: false,
        drawAsCanvasShape: true
    },
    style: {
        isFill: true,
        color: '#1E88E5'
    }
};

var tri = {
    points: [325, 150, 375, 50, 425, 150],
    advanced: {
        isPolygonRender: false,
        drawAsCanvasShape: true
    },
    style: {
        isFill: true,
        color: '#8BC34A'
    }
};

var lin = {
    points: [475, 50, 495, 80, 515, 150, 545, 100, 575, 50],
    //points: [575, 50, 545, 100, 515, 150, 495, 80, 475, 50],
    advanced: {
        isPolygonRender: false,
        drawAsCanvasShape: false,
        interpolation: 'linear'
    },
    style: {
        isFill: true,
        color: '#FFEA00',
        lineWidth: 1
    }
};

var str = {
    x: 675,
    y: 100,
    spikes: 12,
    outerRadius: 60,
    innerRadius: 35,
    advanced: {
        isPolygonRender: false,
        drawAsCanvasShape: false,
        interpolation: 'linear'
    },
    style: {
        isFill: true,
        color: '#CFD8DC'
    }
};

var text1 = {
    text: 'Rectangle',
    x: 73,
    y: 168,
    style: {
        font: '12px MuseoSansLight, sans-serif',
        fillStyle: '#ffffff'
    }
};

var text2 = {
    text: 'Circle',
    x: 235,
    y: 168,
    style: {
        font: '12px MuseoSansLight, sans-serif',
        fillStyle: '#ffffff'
    }
};

var text3 = {
    text: 'Triangle',
    x: 355,
    y: 168,
    style: {
        font: '12px MuseoSansLight, sans-serif',
        fillStyle: '#ffffff'
    }
};

var text4 = {
    text: 'Line',
    x: 505,
    y: 168,
    style: {
        font: '12px MuseoSansLight, sans-serif',
        fillStyle: '#ffffff'
    }
};

var text5 = {
    text: 'Star',
    x: 665,
    y: 168,
    style: {
        font: '12px MuseoSansLight, sans-serif',
        fillStyle: '#ffffff'
    }
};

var text6 = {
    text: 'Work with Canvas has never been so easy!',
    x: 285,
    y: 515,
    style: {
        font: '12px MuseoSansLight, sans-serif',
        fillStyle: '#ffffff'
    }
};


var fluidCanvas = new FluidCanvas(canvas);

var rectangle = fluidCanvas.shape('rectangle', rect);
var circle = fluidCanvas.shape('circle', circ);
var triangle = fluidCanvas.shape('polygon', tri);
var line = fluidCanvas.shape('line', lin);
var star = fluidCanvas.shape({type:'polygon', subtype: 'star'}, str);
var initRectangle = fluidCanvas.shape('rectangle', initRect);

var rectText = fluidCanvas.shape('text', text1);
var circText = fluidCanvas.shape('text', text2);
var triText = fluidCanvas.shape('text', text3);
var linText = fluidCanvas.shape('text', text4);
var strText = fluidCanvas.shape('text', text5);
var flagText = fluidCanvas.shape('text', text6);

var backgroundRectangle = fluidCanvas.shape('rectangle', rect);
var backgroundCircle = fluidCanvas.shape('circle', circ);
var backgroundTriangle = fluidCanvas.shape('polygon', tri);
var backgroundLine = fluidCanvas.shape('line', lin);
var backgroundStar = fluidCanvas.shape({type:'polygon', subtype: 'star'}, str);

backgroundRectangle.style.color = '#094a50';
fluidCanvas.setRenderState(backgroundRectangle, true);
fluidCanvas.render(backgroundRectangle);
backgroundCircle.style.color = '#094a50';
fluidCanvas.setRenderState(backgroundCircle, true);
fluidCanvas.render(backgroundCircle);
backgroundTriangle.style.color = '#094a50';
fluidCanvas.setRenderState(backgroundTriangle, true);
fluidCanvas.render(backgroundTriangle);
backgroundLine.style.color = '#094a50';
fluidCanvas.setRenderState(backgroundLine, true);
fluidCanvas.render(backgroundLine);
backgroundStar.style.color = '#094a50';
fluidCanvas.setRenderState(backgroundStar, true);
fluidCanvas.render(backgroundStar);

function rectRender() {
    fluidCanvas.setRenderState(rectText, true);
    fluidCanvas.setRenderState(circText, false);
    fluidCanvas.setRenderState(triText, false);
    fluidCanvas.setRenderState(linText, false);
    fluidCanvas.setRenderState(strText, false);

    fluidCanvas.render(rectText, true);

    this.animate(initRectangle, rectangle);
}

function circRender() {
    fluidCanvas.setRenderState(rectText, false);
    fluidCanvas.setRenderState(circText, true);
    fluidCanvas.setRenderState(triText, false);
    fluidCanvas.setRenderState(linText, false);
    fluidCanvas.setRenderState(strText, false);

    fluidCanvas.render(circText, true);

    this.animate(rectangle, circle);
}

function triRender() {
    fluidCanvas.setRenderState(rectText, false);
    fluidCanvas.setRenderState(circText, false);
    fluidCanvas.setRenderState(triText, true);
    fluidCanvas.setRenderState(linText, false);
    fluidCanvas.setRenderState(strText, false);

    fluidCanvas.render(triText, true);

    this.animate(circle, triangle);
}

function linRender() {
    fluidCanvas.setRenderState(rectText, false);
    fluidCanvas.setRenderState(circText, false);
    fluidCanvas.setRenderState(triText, false);
    fluidCanvas.setRenderState(linText, true);
    fluidCanvas.setRenderState(strText, false);

    fluidCanvas.render(linText, true);

    this.animate(triangle, line);
}

function strRender() {
    fluidCanvas.setRenderState(rectText, false);
    fluidCanvas.setRenderState(circText, false);
    fluidCanvas.setRenderState(triText, false);
    fluidCanvas.setRenderState(linText, false);
    fluidCanvas.setRenderState(strText, true);

    fluidCanvas.render(strText, true);

    this.animate(line, star);
}

function reverseLinRender() {
    fluidCanvas.setRenderState(rectText, false);
    fluidCanvas.setRenderState(circText, false);
    fluidCanvas.setRenderState(triText, false);
    fluidCanvas.setRenderState(linText, true);
    fluidCanvas.setRenderState(strText, false);

    fluidCanvas.render(linText, true);

    //var line = fluidCanvas.shape('line', lin);

    this.animate(star, line);
}

function reverseTriRender() {
    fluidCanvas.setRenderState(rectText, false);
    fluidCanvas.setRenderState(circText, false);
    fluidCanvas.setRenderState(triText, true);
    fluidCanvas.setRenderState(linText, false);
    fluidCanvas.setRenderState(strText, false);

    fluidCanvas.render(triText, true);

    //var triangle = fluidCanvas.shape('polygon', tri);

    this.animate(line, triangle);
}

var usaFlagShapes = [];

function generateStripes() {
    var initX = 200;
    var initY = 300;
    var width = 400;
    var height = 15;
    var firstColor = '#b12035';
    var secondColor = '#ffffff';
    var stripesAmount = 13;

    for (var i = 0; i < stripesAmount; i++) {
        var color = i % 2 === 0 ? firstColor : secondColor;

        var stripe = {
            x: initX,
            y: initY + height * i,
            width: width,
            height: height,
            //points: [50,50,150,50,150,150,50,150],
            advanced: {
                isPolygonRender: false,
                drawAsCanvasShape: true,
                interpolation: 'linear'
            },
            style: {
                isFill: true,
                color: color
            }
        };

        var flagStripe = fluidCanvas.shape('rectangle', stripe);

        usaFlagShapes.push(flagStripe);
        //fluidCanvas.setRenderState(flagStripe, true);
        //fluidCanvas.render(flagStripe);
    }
}

function generateStarsBackground() {
    var starsBackground = {
        x: 200,
        y: 300,
        width: 160,
        height: 105,
        //points: [50,50,150,50,150,150,50,150],
        advanced: {
            isPolygonRender: false,
            drawAsCanvasShape: true,
            interpolation: 'linear'
        },
        style: {
            isFill: true,
            color: '#3A3A6C'
        }
    };

    var flagStarsBackground = fluidCanvas.shape('rectangle', starsBackground);

    usaFlagShapes.push(flagStarsBackground);
    //fluidCanvas.setRenderState(flagStarsBackground, true);
    //fluidCanvas.render(flagStarsBackground);
}

function generateStars() {
    var oddStars = 6;
    var evenStars = 5;
    var oddStarsRows = 5;
    var evenStarsRows = 4;
    var initOddX = 217;
    var initOddY = 312;
    var initEvenX = 230;
    var initEvenY = 322;

    for (var f = 0; f < oddStarsRows; f++) {
        for (var i = 0; i < oddStars; i++) {
            var oddStar = {
                x: initOddX + 25 * i,
                y: initOddY + 20 * f,
                spikes: 5,
                outerRadius: 7,
                innerRadius: 3,
                advanced: {
                    isPolygonRender: false,
                    drawAsCanvasShape: false,
                    interpolation: 'linear'
                },
                style: {
                    isFill: true,
                    color: '#ffffff'
                }
            };

            var flagOddStars = fluidCanvas.shape({type:'polygon', subtype: 'star'}, oddStar);

            usaFlagShapes.push(flagOddStars);
            //fluidCanvas.setRenderState(flagOddStars, true);
            //fluidCanvas.render(flagOddStars);
        }
    }

    for (var k = 0; k < evenStarsRows; k++) {
        for (var j = 0; j < evenStars; j++) {
            var evenStar = {
                x: initEvenX + 25 * j,
                y: initEvenY + 20 * k,
                spikes: 5,
                outerRadius: 7,
                innerRadius: 3,
                advanced: {
                    isPolygonRender: false,
                    drawAsCanvasShape: false,
                    interpolation: 'linear'
                },
                style: {
                    isFill: true,
                    color: '#ffffff'
                }
            };

            var flagEvenStars = fluidCanvas.shape({type:'polygon', subtype: 'star'}, evenStar);

            usaFlagShapes.push(flagEvenStars);
            //fluidCanvas.setRenderState(flagEvenStars, true);
            //fluidCanvas.render(flagEvenStars);
        }
    }
}

function generateUSAFlag() {
    generateStripes();
    generateStarsBackground();
    generateStars();
}

// USA FLAG

generateUSAFlag();

function flagRender() {
    fluidCanvas.setRenderState(rectText, false);
    fluidCanvas.setRenderState(circText, false);
    fluidCanvas.setRenderState(triText, false);
    fluidCanvas.setRenderState(linText, false);
    fluidCanvas.setRenderState(strText, false);
    fluidCanvas.setRenderState(flagText, true);

    fluidCanvas.render(flagText, true);

    this.animate([triangle], usaFlagShapes);
}

function flagReverseRender() {
    fluidCanvas.setRenderState(rectText, true);
    fluidCanvas.setRenderState(circText, true);
    fluidCanvas.setRenderState(triText, true);
    fluidCanvas.setRenderState(linText, true);
    fluidCanvas.setRenderState(strText, true);
    fluidCanvas.setRenderState(flagText, false);

    var rectangle = fluidCanvas.shape('rectangle', rect);
    var circle = fluidCanvas.shape('circle', circ);
    var triangle = fluidCanvas.shape('polygon', tri);
    var line = fluidCanvas.shape('line', lin);
    var star = fluidCanvas.shape({type:'polygon', subtype: 'star'}, str);

    this.animate(usaFlagShapes, [rectangle, circle, triangle, line, star]);
}


setTimeout(rectRender.bind(fluidCanvas, initRectangle, rectangle), 0);
setTimeout(circRender.bind(fluidCanvas, rectangle, circle), 3000);
setTimeout(triRender.bind(fluidCanvas, circle, triangle), 5000);
setTimeout(linRender.bind(fluidCanvas, triangle, line), 7000);
setTimeout(strRender.bind(fluidCanvas, line, star), 9000);
setTimeout(reverseLinRender.bind(fluidCanvas, star, line), 11000);
setTimeout(reverseTriRender.bind(fluidCanvas, line, triangle), 13000);
setTimeout(flagRender.bind(fluidCanvas, [triangle], usaFlagShapes), 15000);
setTimeout(flagReverseRender.bind(fluidCanvas, usaFlagShapes, [rectangle, circle, triangle, line, star]), 17000);

//fluidCanvas.animate(rectangle, circle);