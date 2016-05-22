module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    less: {
      development: {
        files: {
          "client/lib/bootstrap/dist/css/bootstrap.css": "client/layout/style.less"
        }
      }
    },
    watch: {
      styles: {
        files: ['client/layout/style.less'],
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.registerTask('default', ['less', 'watch']);
};