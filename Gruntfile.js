/**
 * Created by isp on 2/21/16.
 */

module.exports = function(grunt) {
    //Load all Grunt Plugins, only when you need them.
    require('jit-grunt')(grunt);

    grunt.initConfig({
        dirs: {
            dts:  'dts',
            dist: './'
        },

        browserify: {
            options: {
                browserifyOptions: {
                    plugin: ['tsify'],
                    debug: true
                },
                transform: ['babelify']
            },
            'watch-animizer': {
                src: ['<%=dirs.dts%>/*.d.ts', './index.ts'],
                dest: '<%= dirs.dist %>bundle.js',
                options: {
                    watch: true,
                    keepAlive: true,
                    browserifyOptions: {
                        plugin: ['tsify'],
                        debug: true
                    }
                }
            }
        },

        uglify: {
            'animizer': {
                files: [
                    {src: '<%= dirs.dist %>bundle.js',
                        dest: '<%= dirs.dist %>/undle.js'}
                ]
            }
        },

        watch: {
            'babel': {
                files: [
                    '**/*.es6'
                ],
                tasks: [
                    'babel:dist'
                ]
            }
        }
    });

    grunt.registerTask('dev', [
        'browserify:watch-animizer'
    ]);
};
