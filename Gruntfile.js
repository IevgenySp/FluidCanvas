/**
 * Created by isp on 2/21/16.
 */

module.exports = function(grunt) {
    //Load all Grunt Plugins, only when you need them.
    require('jit-grunt')(grunt);

    grunt.loadNpmTasks('grunt-typedoc');

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
                }
            },
            'watch': {
                src: ['<%=dirs.dts%>/*.d.ts', './index.ts'],
                dest: '<%= dirs.dist %>fcanvas.js',
                options: {
                    watch: true,
                    keepAlive: true,
                    browserifyOptions: {
                        plugin: ['tsify'],
                        debug: true
                    }
                }
            },
            'examples': {
                src: ['<%=dirs.dts%>/*.d.ts', './Examples/index.ts'],
                dest: '<%= dirs.dist %>/Examples/index.js',
                options: {
                    browserifyOptions: {
                        plugin: ['tsify'],
                        debug: true
                    }
                }
            }
        },

        uglify: {
            'main': {
                files: [
                    {src: '<%= dirs.dist %>fcanvas.js',
                        dest: '<%= dirs.dist %>fcanvas.minified.js'}
                ]
            }
        },

        typedoc: {
            build: {
                options: {
                    module: 'commonjs',
                    out: './docs',
                    name: 'FluidCanvas',
                    target: 'es5',
                    ignoreCompilerErrors: true
                },
                src: ['./js/**/*']
            }
        }
    });

    grunt.registerTask('dev', [
        'browserify:watch'
    ]);

    grunt.registerTask('dev-uglify', [
        'uglify:main'
    ]);

    grunt.registerTask('dev-examples', [
        'browserify:examples'
    ]);

    grunt.registerTask('dev-typedoc', [
        'typedoc:build'
    ]);
};
