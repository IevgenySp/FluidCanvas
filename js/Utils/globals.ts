/**
 * Created by isp on 4/16/16.
 */

/**
 * General system behaviour parameters
 * @type {{polygonsPerShape: number, dimensions: number, startFrame: number, frames: number, interpolationPointsPerSegment: number, isPolygonRender: boolean, drawAsCanvasShape: boolean, bezierSegmentsNumber: number, bezierTension: number, renderPolygonWidth: number, renderPolygonHeight: number, baseShapeColor: string, circleMinStep: number, circleStartAngle: number, lineWidth: number}}
 */
const SYSTEM_PARAMETERS = {
   polygonsPerShape: 50,
   dimensions: 2,
   startFrame: 0,
   frames: 80,
   interpolationPointsPerSegment: 10,
   isPolygonRender: false,
   drawAsCanvasShape: true,
   bezierSegmentsNumber: 16,
   bezierTension: 0.5,
   renderPolygonWidth: 4,
   renderPolygonHeight: 4,
   baseShapeColor: '#000000',
   circleMinStep: 5,
   circleStartAngle: 215,
   lineWidth: 2
};

/**
 * Supported shapes types
 * @type {{circle: string, rectangle: string, line: string, polygon: string, bezierLine: string}}
 */
const SHAPES = {
   circle:     'circle',
   rectangle:  'rectangle',
   line:       'line',
   polygon:    'polygon',
   bezierLine: 'bezierLine',
   composite:  'composite',
   text:       'text'
};

/**
 * Predefined polygons shapes types
 * @type {{star: string}}
 */
const POLYGON_SHAPES = {
   star: 'star'
};

/**
 * Supported render shapes types
 * @type {{point: string, line: string}}
 */
const RENDER_SHAPES = {
   polygon: 'polygon',
   line: 'line'
};

/**
 * Supported interpolation types
 * @type {{noInterpolation: string, linear: string, easing: string, linearTween: string, quadraticEasingIn: string, quadraticEasingOut: string, quadraticEasingInOut: string, cubicEasingIn: string, cubicEasingOut: string, cubicEasingInOut: string, quarticEasingIn: string, quarticEasingOut: string, quarticEasingInOut: string, quinticEasingIn: string, quinticEasingOut: string, quinticEasingInOut: string, sinusoidalEasingIn: string, sinusoidalEasingOut: string, sinusoidalEasingInOut: string, exponentialEasingIn: string, exponentialEasingOut: string, exponentialEasingInOut: string, circularEasingIn: string, circularEasingOut: string, circularEasingInOut: string, bezier: string}}
 */
const INTERPOLATION = {
   noInterpolation:        'noInterpolation',
   linear:                 'linear',
   easing:                 'easing',
   linearTween:            'linearTween',
   quadraticEasingIn:      'easeInQuad',
   quadraticEasingOut:     'easeOutQuad',
   quadraticEasingInOut:   'easeInOutQuad',
   cubicEasingIn:          'easeInCubic',
   cubicEasingOut:         'easeOutCubic',
   cubicEasingInOut:       'easeInOutCubic',
   quarticEasingIn:        'easeInQuart',
   quarticEasingOut:       'easeOutQuart',
   quarticEasingInOut:     'easeInOutQuart',
   quinticEasingIn:        'easeInQuint',
   quinticEasingOut:       'easeOutQuint',
   quinticEasingInOut:     'easeInOutQuint',
   sinusoidalEasingIn:     'easeInSine',
   sinusoidalEasingOut:    'easeOutSine',
   sinusoidalEasingInOut:  'easeInOutSine',
   exponentialEasingIn:    'easeInExpo',
   exponentialEasingOut:   'easeOutExpo',
   exponentialEasingInOut: 'easeInOutExpo',
   circularEasingIn:       'easeInCirc',
   circularEasingOut:      'easeOutCirc',
   circularEasingInOut:    'easeInOutCirc',
   bezier:                 'bezier'
};

const INTERPOLATION_STEP = {
   linear: 'linear',
   time:   'time'
};

const EVENTS = {
   onAnimationStart: 'onAnimationStart',
   onAnimationStop: 'onAnimationStop'
};

export {SYSTEM_PARAMETERS, INTERPOLATION, SHAPES, POLYGON_SHAPES, RENDER_SHAPES, INTERPOLATION_STEP, EVENTS};