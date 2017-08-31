'use strict';

module.exports = function (grunt) {

  // Less
  grunt.loadNpmTasks('grunt-contrib-less');

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);
  grunt.loadNpmTasks('grunt-contrib-coffee');

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn'
  });

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['serve']
      },
      coffeeApp: {
        files: ['app/app.coffee', 'app/*/app_*.coffee', 'app/config.coffee'],
        tasks: ['coffee:app', 'coffee:']
      },
      coffeeController: {
        files: ['app/*/controllers/*.coffee'],
        tasks: ['coffee:controller']
      },
      coffeeService: {
        files: [ 'app/*/services_*.coffee'],
        tasks: ['coffee:service']
      },
      coffeeDirective: {
        files: ['app/*/directives/*.coffee'],
        tasks: ['coffee:directive']
      },
      coffeeConfig: {
        files: ['app/*.config.coffee'],
        tasks: ['coffee:config']
      },
      tpl: {
        files: ['app/*/templates/*.tpl.html'],
        tasks: ['copy:tpl']
      },
      index: {
        files: ['app/*.tpl.html'],
        tasks: ['copy:index', 'wiredep']
      },
      less: {
        files: ['app/*/less/*.less'],
        tasks: ['less:app']
      }
    },

    coffee: {
      compile: {
        files: {
          'public/js/ng_app.js': ['app/app.coffee'], // compile and concat into single file'
          'public/js/apps.js': ['app/*/app_*.coffee', '!.template'], // compile and concat into single file
          'public/js/controllers.js': ['app/*/controllers/*', '!.template'], // compile and concat into single file
          'public/js/services.js': ['app/*/services_*.coffee', '!.template'],// compile and concat into single file
          'public/js/directives.js': ['app/*/directives/*', '!.template'], // compile and concat into single file
          'public/js/config.js': ['app/*.config.coffee', '!.template'] // compile and concat into single file
        },
        options: {
          bare: true
        }
      },
      config: {
        files: {
          'public/js/config.js': ['app/*.config.coffee', '!.template'], // compile and concat into single file
        }
      },
      app: {
        files: {
          'public/js/ng_app.js': ['app/app.coffee'], // compile and concat into single file'
          'public/js/apps.js': ['app/*/app_*.coffee', '!.template'], // compile and concat into single file
        },
        options: {
          bare: true
        }
      },
      controller: {
        files: {
          'public/js/controllers.js': ['app/*/controllers/*', '!.template'], // compile and concat into single file
        }
      },
      service: {
        files: {
          'public/js/services.js': ['app/*/services_*.coffee', '!.template'],// compile and concat into single file
        }
      },
      directive: {
        files: {
          'public/js/directives.js': ['app/*/directives/*', '!.template'] // compile and concat into single file
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      app: ['public/templates', 'public/*.html', 'public/*', '!public/vendors']
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['public/_index.html'],
        ignorePath: /^(\/|\.+(?!\/[^\.]))+\.+/,
        exclude: ['jquery']
      }
    }, 

    less: {
      app: {
        files: {
          'public/css/_app.css': 'app/*/less/*.less'
        }
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      assets: {
        expand: true,
        cwd: 'app/assets',
        src: ['**'],
        dest: 'public/',      
      },
      index: {
        expand: true,
        src: ['app/*.tpl.html'],
        dest: 'public/',
        rename: function(dest, src) {
          var fileName = '_' + src.split('/').splice(-1)[0].replace('tpl.', '');
          dest += src.replace(src.split('/').splice(-1), '').replace('app/', '');

          return dest + fileName;
        }
      },
      tpl: {
        expand: true,
        src: ['app/*/templates/*.tpl.html'],
        dest: 'public/templates/',
        rename: function(dest, src) {
          var arr = src.split('/');
          var name = arr[3].split('.');

          return dest + arr[1] + '/' + name[0];
        }
      }
    },

  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:app',
      'coffee:compile',
      'copy:tpl',
      'copy:index',
      'copy:assets',
      'wiredep:app',
      'less:app',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

};
