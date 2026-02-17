const { src, dest, series } = require('gulp');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const zip = require('gulp-zip');
const del = require('del');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const merge = require('merge-stream');

// MOVE task
function move() {
  // Process only JS files through uglify
  const task1 = src(['./../app/auth/**/*.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/risk-trac-um-api/app/auth'));
  const task1Assets = src(['./../app/auth/**', '!./../app/auth/**/*.js'])
    .pipe(dest('./../dist/risk-trac-um-api/app/auth'));

  const task2 = src(['./../app/user-management/**/*.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/risk-trac-um-api/app/user-management'));
  const task2Assets = src(['./../app/user-management/**', '!./../app/user-management/**/*.js'])
    .pipe(dest('./../dist/risk-trac-um-api/app/user-management'));

  const task3 = src(['./../config/**/*'])
    .pipe(dest('./../dist/risk-trac-um-api/config'));

  const task4 = src(['./../data-access/**/*.js'])
    .pipe(dest('./../dist/risk-trac-um-api/data-access'));
  const task4Assets = src(['./../data-access/**', '!./../data-access/**/*.js'])
    .pipe(dest('./../dist/risk-trac-um-api/data-access'));

  const task5 = src(['./../log-files/**/*'])
    .pipe(dest('./../dist/risk-trac-um-api/log-files'));

  const task6 = src(['./../node_modules/**/*'])
    .pipe(dest('./../dist/risk-trac-um-api/node_modules'));

  const task7 = src(['./../utility/**/*.js'])
    .pipe(dest('./../dist/risk-trac-um-api/utility'));
  const task7Assets = src(['./../utility/**', '!./../utility/**/*.js'])
    .pipe(dest('./../dist/risk-trac-um-api/utility'));

  const task8 = src(['./../app-server.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/risk-trac-um-api/'));

  const task9 = src(['./../*.json'])
    .pipe(dest('./../dist/risk-trac-um-api/'));

  const task10 = src(['./../api-docs/**/*.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/risk-trac-um-api/api-docs/'));

  const task10Assets = src(['./../api-docs/**', '!./../api-docs/**/*.js'])
    .pipe(dest('./../dist/risk-trac-um-api/api-docs/'));

  return merge(
    task1, task1Assets,
    task2, task2Assets,
    task3,
    task4, task4Assets,
    task5,
    task6,
    task7, task7Assets,
    task8,
    task9,
    task10, task10Assets
  );
}

// CLEAN task
function clean() {
  return del('./../dist/**/*', { force: true });
}

// ZIP task
function zipDist() {
  return src('./../dist/**/*')
    .pipe(zip('risk-trac-um-api.zip'))
    .pipe(dest('./../dist/'));
}

// BrowserSync reload
function bsReload(done) {
  browserSync.reload();
  done();
}

// Scripts task
function scripts() {
  return src('*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(concat('main.js'))
    .pipe(dest('scripts/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(dest('scripts/'))
    .pipe(browserSync.reload({ stream: true }));
}


exports.clean = clean;
exports.move = move;
exports.zip = zipDist;
exports.build = series(clean, move);          // clean -> move
exports.package = series(clean, move, zipDist); // clean -> move -> zip
exports.scripts = scripts;
exports["bs-reload"] = bsReload;
