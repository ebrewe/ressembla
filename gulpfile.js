var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config');

var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var sourcemaps = require('gulp-sourcemaps');

var watch = require('gulp-watch');

//paths
var DIST_PATH = "dist/";
var STYLE_PATH = "style/**/*.scss";

gulp.task("default", ['styles', 'watch', 'webpack-dev-server']);

gulp.task("watch", function(){
  return gulp.watch([STYLE_PATH], ['styles']);
});

gulp.task("styles", function(){
    console.log('running styles')
    return gulp.src(STYLE_PATH)
      .pipe(sourcemaps.init())
      .pipe(sass({
        output:'compressed'
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(DIST_PATH + 'style/'));
});

gulp.task("migrate", function(){
    gulp.src('index.html')
      .pipe(gulp.dest('dist/'));
    gulp.src('jquery.min.js')
      .pipe(gulp.dest('dist/'));
    gulp.src('bundle.js')
      .pipe(gulp.dest('dist/'));
    gulp.src('bundle.js')
      .pipe(gulp.dest('dist/'));
    gulp.src('style/*/**')
      .pipe(gulp.dest('dist/style/'));
});

gulp.task("webpack-dev-server", function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.devtool = "eval";
	myConfig.debug = true;

	// Start a webpack-dev-server
	/*new WebpackDevServer(webpack(myConfig), {
		publicPath: myConfig.output.publicPath,
		stats: {
			colors: true
		}
	}).listen(8080, "localhost", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
	});*/
  require('./node_modules/webpack-dev-server/bin/webpack-dev-server.js');
});

// Production build
gulp.task("build", ['styles', "webpack:build", 'migrate']);

gulp.task("webpack:build", function() {
	// modify some webpack config options
	/*var myConfig = Object.create(webpackConfig);
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);

	// run webpack
	webpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});*/
  require('./node_modules/webpack/bin/webpack.js').exec;
  return console.log('ran webserver');
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task("webpack:build-dev", function(callback) {
	// run webpack
	devCompiler.run(function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build-dev", err);
		gutil.log("[webpack:build-dev]", stats.toString({
			colors: true
		}));
		callback();
	});
});
