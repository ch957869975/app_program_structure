/*
 * 说明：gulp配置文件
 */

var gulp = require('gulp'),
	Less = require('gulp-less'),
	cleanCSS = require('gulp-clean-css'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	postcss = require('gulp-postcss'),
	pump = require('pump'),
	stripDebug = require('gulp-strip-debug'),
	pxtoviewport = require('postcss-px-to-viewport');

var assets = {
	less: ['src/less/app.less', 'src/less/mixin/*.less', 'src/less/page/*.less'],
	config: './src/js/config/*.js',
	page: './src/js/page/*.js',
	util: './src/js/util/*.js',
	css: 'src/less/page/*.less'
};

function less(cb) {
	var processors = [
		pxtoviewport({
			viewportWidth: 750,
			viewportHeight: 1334,
			unitPrecision: 2,
			viewportUnit: 'vw',
			selectorBlackList: [],
			minPixelValue: 1,
			mediaQuery: false
		})
	];

	pump([gulp.src(assets.css),
		Less(),
		postcss(processors),
		cleanCSS(),
		gulp.dest('assets/css/page')
	], cb);
}

function config(cb) {
	pump([
		gulp.src(assets.config),
		concat('config.js'),
		uglify(),
		gulp.dest('assets/js')
	], cb);
}

function util(cb) {
	pump([
		gulp.src(assets.util),
		concat('util.js'),
		uglify(),
		gulp.dest('assets/js')
	], cb);
}

function page(cb) {
	pump([
		gulp.src(assets.page),
		stripDebug(),
		uglify(),
		gulp.dest('assets/js/page')
	], cb);
}

//编译less
gulp.task('less', function(cb) {
	less(cb)
});

//压缩合并config
gulp.task('config', function(cb) {
	config(cb)
});

//压缩合并util
gulp.task('util', function(cb) {
	util(cb)
});

//压缩page js
gulp.task('page', function(cb) {
	page(cb)
});

//监听文件变化
gulp.task('watch', function(cb) {
	less();
	config();
	util();
	page();
	//监听config文件修改
	var configWatcher = gulp.watch(assets.config, ['config']);
	configWatcher.on('change', function(event) {
		console.log('Config:File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
	//监听util文件修改
	var utilWatcher = gulp.watch(assets.util, ['util']);
	utilWatcher.on('change', function(event) {
		console.log('Util:File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
	//监听page文件修改
	var pageWatcher = gulp.watch(assets.page, ['page']);
	pageWatcher.on('change', function(event) {
		console.log('Page:File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
	//监听less文件修改
	var lessWatcher = gulp.watch(assets.less, ['less']);
	lessWatcher.on('change', function(event) {
		console.log('Less:File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});

//默认任务
gulp.task('default', ['less', 'config', 'util', 'page']);