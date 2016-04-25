/*
 | -----------------------------------------------------------------------------
 | ------------------------------ OBSERVATIONS ---------------------------------
 | -----------------------------------------------------------------------------
 */

/*
--------------------------------------------------------------------------------
-- IMPORTANT --
  - Uglify is not working properly

--------------------------------------------------------------------------------
-- TO DO --
  - Add css frameworks
  - Add JQuery
  - Use a single variable to manage everything
    - watchers, tasks, plugins, frameworks(bootstrap,foudation,materialize, etc)
  - use gulp to compress an image: https://www.youtube.com/watch?v=oXxMdT7T9qU

--------------------------------------------------------------------------------

 - I still did not know how to properly get all js together when using VUE
    - it is not working yet (VUE)
    - I want to create a single file with all js

 - This project structure will allow you to use any kind of css extension (scss, less, sass) together :D
 
 - For now the only js library for building interfaces is VUE. It's intended to add React here (allowing the "user" to choose between then)
*/




/*
 | -----------------------------------------------------------------------------
 | ------------------------- SOME GULP PLUGINS ---------------------------------
 | -----------------------------------------------------------------------------
 */
var gulp = require('gulp'),
    gettext = require('gulp-gettext'),
    minifyCss = require('gulp-minify-css'),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    Plumber = require('gulp-plumber'),
    Vueify = require('vueify'),
    Browserify = require('browserify'),
    Source = require('vinyl-source-stream');


/*
 | -----------------------------------------------------------------------------
 | ----------------------------- GULP STRUCTURE --------------------------------
 | -----------------------------------------------------------------------------
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

var paths = {
  source:{
    js:['./resources/js/**/*.js'],
    css:['./resources/css/**/*.css'],
    scss:['./resources/scss/**/*.scss'],
    less:['./resources/less/**/*.less'],
    sass:['./resources/sass/**/*.sass'],
    img:['./resources/img/**/*.jpg','./resources/img/**/*.png']
  },
  destination:{
    js: './public/js/min',
    css:'./public/css/compiled/fromCss',
    scss:'./public/css/compiled/fromScss',
    less:'./public/css/compiled/fromLess',
    sass:'./public/css/compiled/fromSass',
    mainCss: '/public/css/min',
    img:['./public/img/**/*.jpg','./public/img/**/*.png']
  }
};

/*
 | -----------------------------------------------------------------------------
 | --------------------------- Gulp Tasks - JS ---------------------------------
 | -----------------------------------------------------------------------------
 */



/*
| -- VUE ----------------------------------
*/

gulp.task('vueify', function () {
    return Browserify([ProjectGulp.config.npmDir + 'vue/dist/vue.js','./resources/js/app.js'],{
            debug: false,
            insertGlobals: true,
            fullPaths: false
        })
        // It is not needed since we have it in the package
        // .transform(Vueify)
        .bundle()
        .pipe(Source('app.js'))
        .pipe(gulp.dest('./resources/js/app/'));
});

/*
| -- JS ------------------------------------
*/


gulp.task('compress-js', function() {
  return gulp.src('./resources/js/**/*.js')
    .pipe(sourcemaps.init())
    // .pipe(uglify())
    .pipe(concat('main.js'))
    // .pipe(rename(function (path) {
    //   path.basename += "-min"
    // }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/js/min'));
});

/*
 | -----------------------------------------------------------------------------
 | ----------------------------- Gulp Tasks - Styles ---------------------------
 | -----------------------------------------------------------------------------
 */




/*
| -- SCSS ----------------------------------
*/

gulp.task('scss', function() {
    gulp.src('./resources/scss/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        includePaths: ['scss']
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/css/compiled/fromScss'));
});

/*
| -- LESS ----------------------------------
*/

gulp.task('less', function() {
    gulp.src(paths.source.less)
      .pipe(sourcemaps.init())
      .pipe(less({}))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(paths.destination.less));
});



/*
| -- SASS ----------------------------------
*/


gulp.task('sass', function() {
    gulp.src(paths.source.sass)
      .pipe(sourcemaps.init())
      .pipe(sass().on('error',sass.logError))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(paths.destination.sass));
});



/*
| -- CSS -----------------------------------
*/


//This task get all the compiled css and concat into a single minified css
gulp.task('css', function() {
    gulp.src('./resources/css/**/*.css')
      .pipe(sourcemaps.init())
      .pipe(minifyCss())
      .pipe(concat('main.css'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/css/compiled/fromCss'));
});

/*
| -- MAIN --------------------------------
*/

//This task get all the compiled css and concat into a single minified css
gulp.task('css-main', function() {
    gulp.src('./public/css/compiled/**/*.css')
      .pipe(sourcemaps.init())
      .pipe(minifyCss())
      .pipe(concat('main.css'))
      // .pipe(rename(function (path) {
      // path.basename += ".min"
      // }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/css/min'));
});



/*
 | -----------------------------------------------------------------------------
 | ----------------------------- GULP WATCH ------------------------------------
 | -----------------------------------------------------------------------------
 */

/*
| -- CSS -----------------------------------
*/

var watcherCss = gulp.watch('./resources/css/**/*.css', ['css','css-main']);
watcherCss.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running CSS...');
});


/*
| -- SCSS -----------------------------------
*/

var watcherScss = gulp.watch('./resources/scss/**/*.scss', ['scss', 'css-main']);
watcherScss.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running SCSS...');
});


/*
| -- LESS ------------------------------------
*/

var watcherLess = gulp.watch(paths.source.less, ['less', 'css-main']);
watcherLess.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running LESS...');
});


/*
| -- SASS ------------------------------------
*/


var watcherSass = gulp.watch(paths.source.sass, ['sass', 'css-main']);
watcherSass.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running SASS...');
});



/*
| -- CSS MAIN --------------------------------
*/
var watcherCssMain = gulp.watch('./public/compiled/**/*.css', ['css-main']);
watcherCssMain.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running MAIN CSS...');
});


/*
| -- JS --------------------------------
*/
var watcherJs = gulp.watch('./resources/js/**/*.js', ['compress-js']);
watcherCssMain.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running MAIN JS...');
});


/*
 | -----------------------------------------------------------------------------
 | --------------------------- GULP DEFAULT ------------------------------------
 | -----------------------------------------------------------------------------
 */


/*
|Another way of doingthe watch
*/
// // Rerun the task when a file changes
// gulp.task('watch', function() {
//   gulp.watch(paths.source.js, ['compress-js']);
//   gulp.watch(paths.source.css, ['css','css-main']);
//   gulp.watch(paths.source.scss, ['scss','css-main']);
//   // gulp.watch(paths.source.less, ['less','css-main']);
//   // gulp.watch(paths.source.sass, ['sass','css-main']);
// });


// gulp.task('default', ['watch','scss', 'css', 'compress-js', 'css-main','vueify']);
gulp.task('default', ['sass','scss','less','css', 'compress-js', 'css-main']);