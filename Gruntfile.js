'use strict';

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({
    jshint: {
      dev: {
        src: ['*.js', 'lib/*.js', 'models/*.js', 'routes/*.js', 'test/*.js']
      },

      client: {
        src: ['app/**/*.js'],
      },

      options: {
        force: true,
        node: true,
        globals: {
          describe: true,
          it: true,
          before: true,
          after: true,
          beforeEach: true,
          afterEach: true
        }
      }
    },

    simplemocha: {
      dev: {
        src: ['test/*test.js']
      },
      client: {
        src: ['test/client/test.js']
      }
    },

    webpack: {
      client: {
        entry: __dirname + '/app/js/client.js',
        output: {
          path: 'build/',
          filename: 'bundle.js'
        }
      },
      test: {
        entry: __dirname + '/test/client/test.js',
        output: {
          path: 'test/client/',
          filename: 'test_bundle.js'
        }
      },
      karma_test: {
        entry: __dirname + '/test/karma_tests/karma_entry.js'
        output: {
          path: 'test/karma_tests/',
          filename: 'karma_test_bundle.js'
        }
      }
    },

    copy: {
      html: {
        cwd: 'app/',
        expand: true,
        flatten: false,
        src: '**/*.html',
        dest: 'build/',
        filter: 'isFile'
      }
    },

    clean: {
      dev: {
        src: 'build/'
      }
    }
  });

  grunt.registerTask('lint', ['jshint:dev', 'jshint:client']);
  grunt.registerTask('test:c', ['lint', 'simplemocha:client']);
  grunt.registerTask('test:d', ['lint', 'simplemocha:dev']);
  grunt.registerTask('test', ['lint', 'simplemocha:client', 'simplemocha:dev']);
  grunt.registerTask('webpack:k', ['webpack:karma_tests']);
  grunt.registerTask('build:c', ['webpack', 'copy:html']);
  grunt.registerTask('build', ['lint', 'build:c']);
  grunt.registerTask('default', ['test']);
};
