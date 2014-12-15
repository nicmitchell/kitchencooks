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
        src: ['dev/js/angularUI/main.js', 'dev/js/angularUI/kitchenCtrl.js',
             'dev/js/angularUI/tableHelpers.js'],
        dest: 'public/js/app.min.js'
      },
      video: {
        src: ['dev/js/logic/videoFaces.js'],
        dest: 'public/js/videoFaces.js'
      },
      css: {
        src: ['dev/css/*.css'],
        dest: 'public/css/styles.css'
      },
      easyrtc: {
        src: ['dev/js/easyrtc/easyrtc.js', 'dev/js/easyrtc/demo_multiparty.js', 'dev/js/tools/*.js'],
        dest: 'dev/temp/rtc.js'
      }
    },
    jshint:{

    },
    uglify:{
      scripts: {
        files: {
          'public/js/app.min.js': ['dev/temp/app.js']
        }
      },

    },
    watch: {
      dev: {
        files: ['dev/js/angularUI/*.js', 'dev/css/*.css'],
        tasks: ['default'],
      },
    }
  });

  grunt.registerTask('default', ['concat:js', 'concat:css', 'concat:video']);

};

