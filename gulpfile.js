const rename = require('gulp-rename')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const gulpif = require('gulp-if')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const clean = require('gulp-clean')
const { src, dest, parallel, series, watch } = require('gulp')

const rollup = require('gulp-rollup')
const babel = require('rollup-plugin-babel')

const isProd = process.env.NODE_ENV.trim() == 'prod'

const tasks = {
  scss: {
    src: 'scss/**/*.scss',
    entry: 'scss/index.scss',
    dest: 'dest/css',
    rename: {
      basename: 'ui-kit',
      extname: '.css'
    }
  },
  js: {
    src: 'js/**/*.js',
    entry: 'js/index.js',
    dest: 'dest/js',
    rename: {
      basename: 'ui-kit'
    }
  },
  example: {
    src: ['example/start.html', 'example/**/!(start|end).html', 'example/end.html'],
    dest: 'dest/example',
  },
  static: {
    src: ['example/static/**/*'],
    dest: 'dest/example/static'
  }
}

function getRename (rename) {
  return isProd ? {...rename, suffix: '.min'} : rename
}

function compileScss () {
  const scss = tasks.scss
  return src(scss.entry)
    .pipe(postcss())
    .pipe(sass({ outputStyle: isProd ? 'compressed' : 'expanded' }))
    .pipe(rename(getRename(scss.rename)))
    .pipe(dest(scss.dest))
}

function compileJs () {
  const js = tasks.js
  return src(js.src)
    .pipe(rollup({
      input: js.entry,
      output: {
        filename: `ui-kit${isProd ? '.min' : ''}.js`,
        format: 'iife',
        name: 'uiKit'
      },
      plugins: [
        babel({
          runtimeHelpers: true
        })
      ]
    }))
    .pipe(rename(getRename(js.rename)))
    .pipe(gulpif(isProd, uglify()))
    .pipe(dest(js.dest))
}

function concatExample () {
  const exam = tasks.example
  return src(exam.src)
    .pipe(concat('index.html'))
    .pipe(dest(exam.dest))
}

function cleanStatic () {
  return src(tasks.static.dest).pipe(clean())
}

function copystatic () {
  const static = tasks.static
  return src(static.src).pipe(dest(static.dest))
}

const example = parallel(series(cleanStatic, copystatic), concatExample)

function devWatch () {
  watch('example/**/*', example)
  watch(tasks.scss.src, compileScss)
  watch(tasks.js.src, compileJs)
}

exports.compileScss = compileScss
exports.compileJs = compileJs
exports.cleanStatic = cleanStatic
exports.copystatic = copystatic
exports.concatExample = concatExample
exports.example = example
exports.default = parallel(compileScss, compileJs)
exports.watch = devWatch
