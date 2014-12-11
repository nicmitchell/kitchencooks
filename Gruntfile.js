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

    },
    jshint:{

    },
    uglify:{

    },
    watch:{

    }
  });

  grunt.registerTask('default', function(){
    console.log("Grunt is installed...")
  });

};

