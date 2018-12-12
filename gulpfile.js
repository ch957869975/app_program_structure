/*
 * @Author: chenghao
 * @Date: 2018-12-07 17:14:04
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-12-12 10:42:22
 * @desc: gulp配置文件
 */

var gulp = require('gulp'),
  Less = require('gulp-less'),
  cleanCSS = require('gulp-clean-css'),
  uglify = require('gulp-uglify'),
  postcss = require('gulp-postcss'),
  pump = require('pump'),
  stripDebug = require('gulp-strip-debug'),
  pxtoviewport = require('postcss-px-to-viewport'),
  source = require('vinyl-source-stream'),
  browserify = require('browserify'),
  glob = require('glob'),
  sourcemaps = require('gulp-sourcemaps'),
  buffer = require('vinyl-buffer')

var assets = {
  less: ['./src/less/app.less', './src/less/mixin/*.less', './src/less/page/*.less'],
  page: './src/js/*.js',
  css: './src/less/page/*.less'
}

function less() {
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
  ]
  pump([gulp.src(assets.css), Less(), postcss(processors), cleanCSS(), gulp.dest('assets/css/page')])
}

/**
 * 功能业务js打包
 */
function page() {
  glob(assets.page, function(err, files) {
    files.map(function(entry) {
      var name = entry.substr(entry.lastIndexOf('/') + 1)
      return browserify({ entries: [entry], debug: true })
        .transform('babelify', { presets: ['es2015'], plugins: ['transform-remove-strict-mode'] })
        .bundle()
        .pipe(source(name))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('assets/js/page'))
    })
  })
}

//编译less
gulp.task('less', function() {
  less()
})

//压缩page js
gulp.task('page', function() {
  page()
})

//监听文件变化
gulp.task('watch', function() {
  less()
  page()
  /**
   * 监听page文件修改
   */
  var pageWatcher = gulp.watch('./src/*/*.js', ['page'])
  pageWatcher.on('change', function(event) {
    console.log('Page:File ' + event.path + ' was ' + event.type + ', running tasks...')
  })
  /**
   * 监听less文件修改
   */
  var lessWatcher = gulp.watch(assets.less, ['less'])
  lessWatcher.on('change', function(event) {
    console.log('Less:File ' + event.path + ' was ' + event.type + ', running tasks...')
  })
})

/**
 * 派发默认任务
 */
gulp.task('default', ['less', 'page'])
