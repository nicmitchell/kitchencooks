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
    watch:{

    }
  });

  grunt.registerTask('default', ['concat:js', 'uglify:scripts']);

};

