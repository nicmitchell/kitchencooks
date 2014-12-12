module.exports = function(grunt){

  // load up all of the necessary grunt plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');


   // grunt setup
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      js: {
        src: ['dev/js/logic/*js', 'dev/js/angularUI/*js'],
        dest: 'dev/temp/app.js'
      },
      css: {
        src: ['dev/css/*.css'],
        dest: 'public/css/styles.css'
      },
      easyrtc: {
        src: ['dev/js/easyrtc/easyrtc.js', 'dev/js/tools/*.js'],
        dest: 'public/js/rtctools.js'
      }
    },
    jshint:{

    },
    uglify:{
      scripts: {
        files: {
          'public/js/app.min.js': ['dev/temp/app.js']
        }
      }

    },
    watch: {
      dev: {
        files: ['dev/js/*.js', 'dev/css/*.css'],
        tasks: ['default'],
      },
    }
  });

  grunt.registerTask('default', ['concat:js', 'uglify:scripts', 'concat:css', 'concat:easyrtc']);

};

