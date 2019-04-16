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
          timeout: 80000
        },
        src: ['test/**/*.js']
      },
      unit: {
        options: {
          reporter: 'spec',
          timeout: 80000
        },
        src: ['test/unit/**/*.js']
      },
      integration: {
        options: {
          reporter: 'spec',
          timeout: 80000
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
  grunt.registerTask('test', ['jshint', 'mochaTest']);
  grunt.registerTask('unit', ['jshint', 'mochaTest:unit']);
  grunt.registerTask('integration', ['jshint', 'mochaTest:integration']);
  grunt.registerTask('default', ['jshint', 'test']);

};