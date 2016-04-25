/*
 |
 | Importing some gulp plugins
 |
 */
var Gulp = require('gulp'),
    Less = require('gulp-less'),
    Nano = require('gulp-cssnano'),
    Sourcemaps = require('gulp-sourcemaps'),
    Concat = require('gulp-concat'),
    Browserify = require('browserify'),
    Vueify = require('vueify'),
    Source = require('vinyl-source-stream'),
    Uglify = require('gulp-uglify'),
    Notify = require('gulp-notify'),
    GulpUtil = require('gulp-util'),
    Plumber = require('gulp-plumber'),
    Merge = require('merge-stream'),
    //-----------------------------
    //-- My requiremnts -----------
    //-----------------------------
    Gettext = require('gulp-gettext'),
    MinifyCss = require('gulp-minify-css'),
    Rename = require("gulp-rename"),
    Uglify = require('gulp-uglify'),
    Sass = require('gulp-sass'),
    CleanCSS = require('gulp-clean-css');





/*
 |
 | Gulp structure based on app being developed
 |
 */
var ProjectGulp = {
    config: {
        bowerDir: './bower_components/',
        npmDir: './node_modules/',
        plugins:'./resources/plugins/', //plugins are someone else code for something (it could be materialize, bootstrap, or anything)
        sourcemaps: true
    },
    notify: {
        success: {
            browserify: 'Browserify: Success!',
            less: 'Less: Success!',
            Scss: 'Scss: Success!',
            sass: 'Sass: Success!'
        },
        error: {
            browserify: 'Browserify: Error. Fuck!',
            less: 'Less: Error. Fuck!',
            scss: 'Scss: Error. Fuck!',
            sass: 'Sass: Error. Fuck!'
        }
    },
    taskNames: {
        app: {
            less: 'app-less',
            sass: 'app-sass',
            scss: 'app-scss',
            js: 'app-js',
            font: 'app-font',
            img: 'app-img'
        },
        nodeserver: {
            js: 'nodeserver-js'
        }
    },
    watchTaskNames: {
        app: {
            less: 'app-watch-less',
            scss: 'app-watch-scss',
            sass: 'app-watch-sass',
            js: 'app-watch-js',
            all: 'app-watch'
        },
        nodeserver: {
            js: 'nodeserver-js'
        }
    }
};

var ProjectLess = {
    app: {
        sourcePath: './resources/less/pages.less',
        destinationPath: './public/css',
        watchPath: './resources/less/**/*.less',
        externalPaths: [
           // ProjectGulp.config.npmDir + 'bootstrap/less/',
           // ProjectGulp.config.npmDir + 'Materialize/dist/css/materialize.css',
            './resources/less/pages.less'
        ],
        styles:[
            // Estamos com problemas na utilizacao do materialize via npm ou bower
            // ProjectGulp.config.bowerDir + 'Materialize/dist/css/materialize.css',
            // ProjectGulp.config.plugins + 'materialize/css/materialize.css',
            // ProjectGulp.config.npmDir + 'dropzone/dist/dropzone.css'
        ],
        outputName: 'app.css'
        // outputName: 'less.css'
    }
};


var ProjectScss = {
    app: {
        sourcePath: './resources/scss/pages.scss',
        destinationPath: './public/css', //I would be nice to add a subfolder for the compiled (ex.: /public/css/scss) and then merge all the compiled css to a single file minified and with maps
        watchPath: './resources/scss/**/*.scss',
        externalPaths: [
           // ProjectGulp.config.npmDir + 'bootstrap/scss/',
            './resources/scss/pages.scss'
        ],
        styles:[
            // Estamos com problemas na utilizacao do materialize via npm ou bower
            // ProjectGulp.config.bowerDir + 'Materialize/dist/css/materialize.css',
            // ProjectGulp.config.plugins + 'materialize/css/materialize.css'
            // ProjectGulp.config.npmDir + 'dropzone/dist/dropzone.css'
        ],
        outputName: 'app.css'
        // outputName: 'scss.css'

    }
};

var ProjectSass = {
    app: {
        sourcePath: './resources/sass/pages.sass',
        destinationPath: './public/css',
        watchPath: './resources/sass/**/*.sass',
        externalPaths: [
           // ProjectGulp.config.npmDir + 'bootstrap/sass/',
            './resources/sass/pages.sass'
        ],
        styles:[
            // Estamos com problemas na utilizacao do materialize via npm ou bower
            // ProjectGulp.config.bowerDir + 'Materialize/dist/css/materialize.css',
            // ProjectGulp.config.plugins + 'materialize/css/materialize.css'
            // ProjectGulp.config.npmDir + 'dropzone/dist/dropzone.css'
        ],
        outputName: 'app.css'
        // outputName: 'sass.css'

    }
};

var ProjectJavascript = {
    app: {
        sourcePath: './resources/js/app.js',
        sourcePath2: [
           // ProjectGulp.config.npmDir + 'vue/dist/vue.js',
            // Estamos com problemas na utilizacao do materialize via npm ou bower
            // ProjectGulp.config.bowerDir + 'Materialize/bin/materialize.js',
           // './resources/app/js/app.js'
            //ProjectGulp.config.plugins + 'materialize/js/materialize.js',
            ProjectGulp.config.npmDir + 'vue/dist/vue.js',
           // ProjectGulp.config.plugins + 'adaptive-background/adaptive-backgrounds.js',
            './resources/js/app.js',
        ],
        watchPath: './resources/js/**/*.js',
        destinationPath: './public/js',
        outputName: 'app.js',
        requiredFiles:['jquery']
    },

    nodeserver: {
        sourcePath: './app.js',
        sourcePath2: [
            './routes/**/*.js',
            './app.js',
            './bin/www'
        ],
        destinationPath: './bin/server',
        outputName: 'www-c'
    }
};


var ProjectFont ={
    app: {
        filter: '*.{eot,svg,ttf,woff,woff2}',
        destinationPath: './public/fonts',
        sourcePath: './resources/fonts/*.{eot,svg,ttf,woff,woff2}',
    }
};

/*
 |
 | Gulp Tasks - Generic functions
 |
 */

var lessTask = function (projectData) {

    var cssStream = Gulp.src(projectData.styles)
                     .pipe(Concat('styles.css'))


    var lessStream = Gulp.src(projectData.sourcePath)
            //.pipe(Plumber())
            //.pipe(Sourcemaps.init())
            .pipe(Less({
                paths: projectData.externalPaths
            }))
            .pipe(Concat('less.css'))
            
            

    return Merge(cssStream,lessStream)
            .pipe(Concat(projectData.outputName))
            .pipe(Nano())
            //.pipe(Sourcemaps.write())
            .pipe(Gulp.dest(projectData.destinationPath))
            .pipe(Notify(ProjectGulp.notify.success.less));

};

var fontTask = function(projectData){
    return Gulp.src(projectData.sourcePath)
        .pipe(Gulp.dest(projectData.destinationPath));
};

var javascriptTask = function (projectData) {
    return Browserify(projectData.sourcePath2,{
            debug: false,
            insertGlobals: true,
            fullPaths: false,
            require: projectData.requiredFiles
        })
        //.transform(Vueify)
        .bundle()
        /*.on('error', function (e) {
            GulpUtil.log(e);
            Notify(ProjectGulp.notify.error.browserify);
        })*/
        .pipe(Plumber())
        .pipe(Source(projectData.outputName))
        //.pipe(Buffer())
       // .pipe(Uglify())
        .pipe(Gulp.dest(projectData.destinationPath))
        .pipe(Notify(ProjectGulp.notify.success.browserify));
};


/*
 |
 | Gulp Tasks - Fonts
 |
 */

Gulp.task(ProjectGulp.taskNames.app.font, function () {
    return fontTask(ProjectFont.app);
});


/*
 |
 | Gulp Tasks - Less
 |
 */

Gulp.task(ProjectGulp.taskNames.app.less, function () {
    return lessTask(ProjectLess.app);
});

/*
 |
 | Gulp Tasks - JS
 |
 */

Gulp.task(ProjectGulp.taskNames.app.js, function () {
    return javascriptTask(ProjectJavascript.app);
});

/*
 |
 | Gulp Tasks - NodeJS
 |
 */
Gulp.task(ProjectGulp.taskNames.nodeserver.js, function () {
    return javascriptTask(ProjectJavascript.nodeserver);
});

/*
 |
 | Gulp Watch
 |
 */
Gulp.task(ProjectGulp.watchTaskNames.app.less, function () {
    Gulp.watch(ProjectLess.app.watchPath, [ProjectGulp.taskNames.app.less]);
    Notify('Watch Started: ' + ProjectGulp.watchTaskNames.app.less);
});

Gulp.task(ProjectGulp.watchTaskNames.app.js, function () {
    Gulp.watch(ProjectJavascript.app.watchPath, [ProjectGulp.taskNames.app.js]);
    Notify('Watch Started: ' + ProjectGulp.watchTaskNames.app.js);
});

Gulp.task(ProjectGulp.watchTaskNames.app.all, function () {
    Gulp.watch(ProjectLess.app.watchPath, [ProjectGulp.taskNames.app.less]);
    Gulp.watch(ProjectJavascript.app.watchPath, [ProjectGulp.taskNames.app.js]);
});


/*
 |
 | Gulp Task - Default
 |
 */
//Gulp.task('default', [ProjectGulp.taskNames.app.less, ProjectGulp.taskNames.app.js, ProjectGulp.taskNames.nodeserver.js]);
Gulp.task('default', [ProjectGulp.taskNames.app.scss,ProjectGulp.taskNames.app.font, ProjectGulp.taskNames.app.js]);








// var watcherJs = gulp.watch('./js/*.css', ['css-main']);
// watcherCssMain.on('change', function(event) {
//   console.log('File ' + event.path + ' was ' + event.type + ', running MAIN CSS...');
// });



// gulp.task('default', ['scss', 'css', 'compress-js', 'css-main','vueify']);












// var gulp = require('gulp');
// var gettext = require('gulp-gettext');
// var minifyCss = require('gulp-minify-css');
// var rename = require("gulp-rename");
// var uglify = require('gulp-uglify');
// var sourcemaps = require('gulp-sourcemaps');
// var sass = require('gulp-sass');
// var concat = require('gulp-concat');
// var cleanCSS = require('gulp-clean-css');

// var Plumber = require('gulp-plumber');
// var Vueify = require('vueify');
// var Browserify = require('browserify');
// var Source = require('vinyl-source-stream');


// gulp.task('vueify', function () {
//     return Browserify(['./node_modules/vue/dist/vue.js','./js/app.js'],{
//             debug: false,
//             insertGlobals: true,
//             fullPaths: false
//         })
//         .bundle()
//         .pipe(Source('app.js'))
//         .pipe(gulp.dest('./js/app/'));
// });


// gulp.task('scss', function() {
//     gulp.src('./scss/*.scss')
//       .pipe(sourcemaps.init())
//       .pipe(sass({
//         includePaths: ['scss']
//       }))
//       .pipe(sourcemaps.write('.'))
//       .pipe(gulp.dest('./css/src'));
// });


// gulp.task('css', function() {
//     gulp.src('css/src/*.css')
//       .pipe(sourcemaps.init())
//       .pipe(minifyCss())
//       .pipe(concat('main.css'))
//       .pipe(sourcemaps.write('.'))
//       .pipe(gulp.dest('css/min'));
// });



// gulp.task('css-main', function() {
//     gulp.src(['css/main.css', 'css/auxiliar.css'])
//       .pipe(sourcemaps.init())
//       .pipe(minifyCss())
//       .pipe(rename(function (path) {
//       path.basename += ".min"
//       }))
//       .pipe(sourcemaps.write('.'))
//       .pipe(gulp.dest('css/'));
// });



// gulp.task('compress-js', function() {
//   return gulp.src('js/*.js')
//   	.pipe(sourcemaps.init())
//     .pipe(uglify())
//     .pipe(rename(function (path) {
//     	path.basename += "-min"
//   	}))
//   	.pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest('js/min'));
// });



// var watcherScss = gulp.watch('./scss/*.scss', ['scss', 'css']);
// watcherScss.on('change', function(event) {
//   console.log('File ' + event.path + ' was ' + event.type + ', running SCSS...');
// });



// var watcherCss = gulp.watch('./css/src/*.css', ['css']);
// watcherCss.on('change', function(event) {
//   console.log('File ' + event.path + ' was ' + event.type + ', running CSS...');
// });



// var watcherCssMain = gulp.watch('./css/*.css', ['css-main']);
// watcherCssMain.on('change', function(event) {
//   console.log('File ' + event.path + ' was ' + event.type + ', running MAIN CSS...');
// });


// var watcherJs = gulp.watch('./js/*.css', ['css-main']);
// watcherCssMain.on('change', function(event) {
//   console.log('File ' + event.path + ' was ' + event.type + ', running MAIN CSS...');
// });



// gulp.task('default', ['scss', 'css', 'compress-js', 'css-main','vueify']);