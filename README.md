# FluidCanvas
Dynamic Canvas transformations

Simple example:

```javascript
// Define library
var fluidCanvas = new FluidCanvas(<context>);
```

```javascript
// Optional: set basic shpaes using constructor
// Supported shapes types: polygon, line, rectangle, circle, bezier line
var shapeConstructor = fluidCanvas.getShapesConstructor();
```

```javascript
// Basic rectangle
var shape1 = shapeConstructor.getRectangle(<x>, <y>, <width>, <height>);
```

```javascript
// Basic circle
var shape2 = shapeConstructor.getCircle(<startAngle>, <radius>, <x>, <y>);
```

```javascript
// Add shapes to fluid canvas storage, define shape points geometry
fluidCanvas.defineShape(shape1);
fluidCanvas.defineShape(shape2);
```

```javascript
// Return iterator of shapes transformations arrays, add iterator to storage
fluidCanvas.transform([shape1], [shape2]);
```

```javascript
// Shape transformation animation based on iterator
fluidCanvas.animate();
```