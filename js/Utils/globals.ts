/**
 * Created by isp on 4/16/16.
 */

/**
 * General system behaviour parameters
 * @type {{polygons: number, dimentions: number, startFrame: number, frames: number, renderingInterpolationStep: number}}
 */
const SYSTEM_PARAMETERS = {
   polygons: 50,
   dimentions: 2,
   startFrame: 0,
   frames: 80,
   renderingInterpolationStep: 10
};

/**
 * Shapes, points, interpolations parameters
 * @type {{polygons: number, bezierSegmentsNumber: number, bezierTension: number, pointWidth: number, pointHeight: number, baseColor: string}}
 */
const SHAPES_PARAMETERS = {
   polygons: 50,
   bezierSegmentsNumber: 16,
   bezierTension: 0.5,
   pointWidth: 4,
   pointHeight: 4,
   baseColor: '#000000'
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
   bezierLine: 'bezierLine'
};

/**
 * Supported render shapes types
 * @type {{point: string, line: string}}
 */
const RENDER_SHAPES = {
   point: 'point',
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

export {SYSTEM_PARAMETERS, INTERPOLATION, SHAPES_PARAMETERS, SHAPES, RENDER_SHAPES};