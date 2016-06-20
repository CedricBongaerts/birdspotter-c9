module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "client/lib/bootstrap/dist/css/bootstrap.min.css": "client/layout/style.less",
        }
      }
    },
    watch: {
      styles: {
        files: ['client/layout/style.less'],
        tasks: ['less'],
        options: {
          nospawn: true,
          minify: true,
        }
      }
    }
  });

  grunt.registerTask('default', ['less', 'watch']);
};