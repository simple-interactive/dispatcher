module.exports = function(grunt) {

    var config = {
        prod : {
            endpoint: 'http://185.70.109.10:85/dispatcher',
            token: 'dispatcher-prod'
        },
        dev: {
            endpoint: 'http://md-back/dispatcher',
            token: '1234'
        }
    };

    var selectedConfig = config[grunt.option('target') || 'dev'];
    var build = grunt.option('build') || 'build';

    grunt.option('force', true);

    grunt.file.delete(build);

    var configuration = {
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                files: [
                    {cwd: 'images', src: [ '**' ], dest: build+'/images', expand: true},
                    {cwd: 'bower_components/bootstrap/dist/fonts', src: [ '**' ], dest: build+'/fonts', expand: true},
                    {src: 'index.html', dest: build+'/index.html'},
                    {src: '.htaccess', dest: build+'/.htaccess'}
                ]
            }
        },
        uglify: {
            build: {
                files: {
                    'js': [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/bootstrap/dist/js/bootstrap.js',
                        'bower_components/md5/jquery.md5.js',
                        'app/**/*.js'
                    ]
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'css': [
                        'bower_components/bootstrap/dist/css/bootstrap.css',
                        'bower_components/bootflat/bootflat/css/bootflat.css',
                        'bower_components/animatecss/animate.css',
                        'css/**/*.css'
                    ]
                }
            }
        }
    };

    var js = configuration['uglify']['build']['files'];
    configuration['uglify']['build']['files'] = {};
    configuration['uglify']['build']['files'][build+'/app.min.js'] = js['js'];

    var css = configuration['cssmin']['combine']['files'];
    configuration['cssmin']['combine']['files'] = {};
    configuration['cssmin']['combine']['files'][build+'/app.min.css'] = css['css'];

    grunt.initConfig(configuration);

    grunt.registerTask('concatTemplates', null, function(){

        var concatenated = {};

        grunt.file.recurse('app', function(templateFilePath, a, b, c) {

            if (c.substr(-5) == '.html') {
                var templateId = [b, c.substr(0, c.length -5)].join('/').split('/').slice(1).join('/');
                concatenated[templateId] = grunt.file.read(templateFilePath);
            }
        });

        var allJs = grunt.file.read(build+'/app.min.js') + ";window.view.templates="+JSON.stringify(concatenated)+ ";";
        grunt.file.write(build+'/app.min.js', allJs);
    });

    grunt.registerTask('config', null, function(){
        var allJs = "var config = " + JSON.stringify(selectedConfig) + ";" + grunt.file.read(build+'/app.min.js');
        grunt.file.write(build+'/app.min.js', allJs);
    });

    grunt.registerTask('layout', null, function(){

        function replaceSection(section, content) {
            var layout = grunt.file.read(build+'/index.html').split('<!-- ' + section + ' -->');
            layout[1] = content;
            grunt.file.write(build+'/index.html', layout.join(''));
        }

        replaceSection('Grunt:Build:JSSection', "<script src=\"app.min.js?_=" + Number(new Date()) + "\"></script>");
        replaceSection('Grunt:Build:CSSSection', "<link href=\"app.min.css?_=" + Number(new Date()) + "\" rel=\"stylesheet\" />");
        replaceSection('Grunt:Build:Config', null);
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['uglify', 'cssmin', 'copy', 'concatTemplates', 'config', 'layout']);
};