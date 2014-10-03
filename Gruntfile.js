'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jasmine: {
            testToConsole: {
                src    : 'public/piemodel.js',
                options: {
                    specs : 'spec/*Spec.js',
                    vendor: [
                        "public/jquery.js",
                    ]
                }
            },
            testToHTML   : {
                src    : 'public/piemodel.js',
                options: {
                    specs  : 'spec/*Spec.js',
                    outfile: 'public/_SpecRunner.html',
                    vendor : [
                        "public/jquery.js"
                    ]
                }
            }
        },
        connect: {
            server: {
                options: {
                    directory: 'public',
                    open: {
                        target   : 'public/_SpecRunner.html'
                    },
                    base     : 'app'
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    // NOTE: We run the task twice to check for file overwrite issues.
    grunt.registerTask('unitTestToConsole', ['jasmine:testToConsole']);
    grunt.registerTask('default', ['jasmine:testToHTML:build', 'connect:server']);
};