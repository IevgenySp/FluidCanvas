# FluidCanvas
Dynamic Canvas transformations

![alt tag](FluidCanvas/assets/Transformations.gif)

Simple example:

```javascript
// Define library
var fluidCanvas = new FluidCanvas(<canvas>);
```

```javascript
// Optional: set shape parameters
var rect = {
    x: 50,
    y: 50,
    width: 100,
    height: 100,
    style: {
        isFill: true,
        color: '#f78518'
    }
};
```

```javascript
// Basic shape geometry
var rectangle = fluidCanvas.shape('rectangle', rect);
```

```javascript
// Change shape render state and render it
fluidCanvas.setRenderState(rectangle, true);
fluidCanvas.render(rectangle);
```

```javascript
// Define another shape geometry
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

var circle = fluidCanvas.shape('circle', circ);
```

```javascript
// Transform first shape into second
fluidCanvas.animate(rectangle, circle);
```
