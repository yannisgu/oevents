module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            base: {
                src: ['src/lib/**/*.ts'],
                dest: 'public/js/app.js',
                options: {
                    module: 'amd', //or commonjs
                    sourcemap: true,
                    fullSourceMapPath: true,
                    declaration: false
                }
            }
        },
        html2js: {
            options: {
                base: 'src'
            },
            main: {
                src: ['src/templates/**/*.html'],
                dest: 'public/js/templates.js'
            }
        },
        less: {
            development: {
                options: {
                },
                files: {
                    "public/css/app.css": "src/less/**/*.less"
                }

            }
        }
    });

    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-less');


    grunt.registerTask('default', ['typescript', 'html2js', 'less']);

};