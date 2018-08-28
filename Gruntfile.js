'use strict';

module.exports = function (grunt) {

  // add grunt tasks.
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  //configure grunt
  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          timeout: 20000
        },
        src: ['test/**/*.js']
      },
      unit: {
        options: {
          reporter: 'spec',
          timeout: 20000
        },
        src: ['test/unit/**/*.js']
      },
      integration: {
        options: {
          reporter: 'spec',
          timeout: 20000
        },
        src: ['test/integration/**/*.js']
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'index.js',
        'lib/**/*.js',
        'test/**/*.js'
      ]
    },
    watch: {
      all: {
        files: [
          'Gruntfile.js',
          'index.js',
          'lib/**/*.js',
          'test/**/*.js'
        ],
        tasks: ['default']
      }
    }
  });

  //custom tasks
  grunt.registerTask('default', ['jshint', 'mochaTest']);
  grunt.registerTask('unit', ['jshint', 'mochaTest']);
  grunt.registerTask('integration', ['jshint', 'mochaTest']);
  grunt.registerTask('test', ['jshint', 'mochaTest']);

};