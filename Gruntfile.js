module.exports = function (grunt) {
  var browsers = [{
    browserName: "internet explorer",
    platform: "Windows 8.1",
    version: "11"
  },{
    browserName: "opera",
    platform: "Windows 7",
    version: "12"
  },{
    browserName: "googlechrome",
    platform: "OS X 10.6"
  },{
    browserName: "googlechrome",
    platform: "linux"
  },{
    browserName: "chrome",
    platform: "Windows 7"
  },{
    browserName: "googlechrome",
    platform: "Windows XP"
  },{
    browserName: "firefox",
    platform: "Windows 8",
    version: "22"
  },{
    browserName:"safari",
    platform: "OS X 10.8",
    version: "6"
  },{
    browserName:"android",
    platform: "Linux",
    version: "4.0"
  }];

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: grunt.file.readJSON('.jshintrc'),
      src: ['src/*.js']
    },
    browserify: {
      lib: {
        src: 'src/glsl-transition.js',
        dest: 'dist/glsl-transition.js',
        options: {
          standalone: "GlslTransition"
        }
      },
      test: {
        src: 'test/index.js',
        dest: 'test/bundle.js',
        options: {
          debug: true
        }
      }
    },
    watch: {
      lib: {
        files: '<%= browserify.lib.src %>',
        tasks: ['jshint', 'browserify:lib']
      },
      test: {
        files: ['test/**.js', '!test/bundle.js'],
        tasks: ['browserify:test']
      }
    },
    'gh-pages': {
      example: {
        options: {
          base: 'example'
        },
        src: ['bundle.js', 'index.html']
      }
    },
    shell: {
      buildExample: {
        options: {
          execOptions: { cwd: "example" }
        },
        command: "npm install && npm run build"
      }
    },
    connect: {
      test: {
        port: 9999,
        base: 'test'
      }
    },
    'saucelabs-mocha': {
      all: {
        options: {
          urls: ["http://127.0.0.1:9999/"],
          tunnelTimeout: 5,
          build: (new Date()).getTime(),
          concurrency: 3,
          browsers: browsers,
          testname: "glsl-transition tests",
          testReadyTimeout: 30000,
          tags: ["master"]
        }
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'browserify', 'watch']);
  grunt.registerTask('publish', ['shell:buildExample', 'gh-pages']);
  grunt.registerTask('test-sauce', ['connect:test', 'saucelabs-mocha']);
};
