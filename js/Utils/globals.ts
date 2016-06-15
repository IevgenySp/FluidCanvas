/**
 * Created by isp on 4/16/16.
 */

const SYSTEM_PARAMETERS = {
   polygons: 50,
   dimentions: 2,
   startFrame: 0,
   frames: 140,
   renderingInterpolationStep: 10
};

const SHAPES_PARAMETERS = {
   polygons: 50,
   bezierSegmentsNumber: 16,
   bezierTension: 0.5,
   pointWidth: 4,
   pointHeight: 4,
   baseColor: '#000000'
};

const SHAPES = {
   circle:     'circle',
   rectangle:  'rectangle',
   line:       'line',
   polygon:    'polygon',
   bezierLine: 'bezierLine'
};

const RENDER_SHAPES = {
   point: 'point',
   line: 'line'
};

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