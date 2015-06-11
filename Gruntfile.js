'use strict';

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    jshint: {
      server: {
        src: ['*.js', 'lib/*.js', 'models/*.js', 'routes/*.js', 'test/server/*test.js'],
        options: {
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

      client: {
        src: ['app/**/*.js', 'test/client/*test.js'],
        options: {
          globals: {
            angular: true,
            describe: true,
            it: true,
            before: true,
            after: true,
          }
        }
      },

      jasmine: {
        src: ['test/karma_tests/*test.js'],
        options: {
          globals: {
            angular: true,
            describe: true,
            it: true,
            expect: true,
            before: true,
            after: true,
            beforeEach: true,
            afterEach: true
          }
        }
      },

      options: {
        node: true,
      }
    },

    simplemocha: {
      server: {
        src: ['test/server/*test.js']
      },
      client: {
        src: ['test/client/*test.js']
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
        entry: __dirname + '/test/karma_tests/karma_entry.js',
        output: {
          path: 'test/karma_tests/',
          filename: 'karma_test_bundle.js'
        }
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
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
      server: {
        src: 'build/'
      }
    }
  });

  grunt.registerTask('test', ['jshint:server', 'jshint:client', 'simplemocha:client', 'simplemocha:server']);
  grunt.registerTask('karmatest', ['webpack:karma_test', 'karma:unit']);
  grunt.registerTask('build', ['jshint:client', 'clean:server', 'webpack:client', 'webpack:test', 'copy:html']);
  grunt.registerTask('default', ['test']);
};
