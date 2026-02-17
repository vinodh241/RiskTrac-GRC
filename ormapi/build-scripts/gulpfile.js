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
  const task1 = src(['./../app/incidents/**/*.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/orm/app/incidents'));
  const task1Assets = src(['./../app/incidents/**', '!./../app/incidents/**/*.js'])
    .pipe(dest('./../dist/orm/app/incidents'));

  const task2 = src(['./../app/kri/**/*.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/orm/app/kri'));
  const task2Assets = src(['./../app/kri/**', '!./../app/kri/**/*.js'])
    .pipe(dest('./../dist/orm/app/kri'));

  const task3 = src(['./../app/rcsa/**/*.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/orm/app/rcsa'));
  const task3Assets = src(['./../app/rcsa/**', '!./../app/rcsa/**/*.js'])
    .pipe(dest('./../dist/orm/app/rcsa'));

  const task4 = src(['./../app/risk-appetite/**/*.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/orm/app/risk-appetite'));
  const task4Assets = src(['./../app/risk-appetite/**', '!./../app/risk-appetite/**/*.js'])
    .pipe(dest('./../dist/orm/app/risk-appetite'));

  const task5 = src(['./../app/risk-assessment/**/*.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/orm/app/risk-assessment'));
  const task5Assets = src(['./../app/risk-assessment/**', '!./../app/risk-assessment/**/*.js'])
    .pipe(dest('./../dist/orm/app/risk-assessment'));

  const task6 = src(['./../app/risk-metric-levels/**/*.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/orm/app/risk-metric-levels'));
  const task6Assets = src(['./../app/risk-metric-levels/**', '!./../app/risk-metric-levels/**/*.js'])
    .pipe(dest('./../dist/orm/app/risk-metric-levels'));

  const task7 = src(['./../app/risk-reports/**/*.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/orm/app/risk-reports'));
  const task7Assets = src(['./../app/risk-reports/**', '!./../app/risk-reports/**/*.js'])
    .pipe(dest('./../dist/orm/app/risk-reports'));

  const task8 = src(['./../config/**/*'])
    .pipe(dest('./../dist/orm/config'));

  const task9 = src(['./../data-access/**/*.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/orm/data-access'));
  const task9Assets = src(['./../data-access/**', '!./../data-access/**/*.js'])
    .pipe(dest('./../dist/orm/data-access'));

  const task10 = src(['./../file-upload/**/*.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/orm/file-upload'));
  const task10Assets = src(['./../file-upload/**', '!./../file-upload/**/*.js'])
    .pipe(dest('./../dist/orm/file-upload'));

  const task11 = src(['./../log-files'])
    .pipe(dest('./../dist/orm'));

  const task12 = src(['./../log-notification'])
    .pipe(dest('./../dist/orm'));

  const task13 = src(['./../node_modules/**/*'])
    .pipe(dest('./../dist/orm/node_modules'));

  const task14 = src(['./../utility/**/*.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/orm/utility'));
  const task14Assets = src(['./../utility/**', '!./../utility/**/*.js'])
    .pipe(dest('./../dist/orm/utility'));

  const task15 = src(['./../app-server.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/orm/'));

  const task16 = src(['./../*.json'])
    .pipe(dest('./../dist/orm/'));

  const task17 = src(['./../app/inApp-notification/**/*.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/orm/app/inApp-notification'));
  const task17Assets = src(['./../app/inApp-notification/**', '!./../app/inApp-notification/**/*.js'])
    .pipe(dest('./../dist/orm/app/inApp-notification'));

  const task18 = src(['./../app/dashboard/**/*.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/orm/app/dashboard'));
  const task18Assets = src(['./../app/dashboard/**', '!./../app/dashboard/**/*.js'])
    .pipe(dest('./../dist/orm/app/dashboard'));

  const task19 = src(['./../app/report/**/*.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/orm/app/report'));
  const task19Assets = src(['./../app/report/**', '!./../app/report/**/*.js'])
    .pipe(dest('./../dist/orm/app/report'));


  const task20 = src(['./../api-docs/**/*.js'])
    .pipe(uglify())
    .pipe(dest('./../dist/orm/api-docs/'));

  const task20Assets = src(['./../api-docs/**', '!./../api-docs/**/*.js'])
    .pipe(dest('./../dist/orm/api-docs/'));


  // ✅ merge all tasks into one stream
  return merge(
    task1, task1Assets, task2, task2Assets, task3, task3Assets,
    task4, task4Assets, task5, task5Assets, task6, task6Assets,
    task7, task7Assets, task8, task9, task9Assets, task10, task10Assets,
    task11, task12, task13, task14, task14Assets, task15, task16,
    task17, task17Assets, task18, task18Assets, task19, task19Assets, task20, task20Assets
  );
}

// CLEAN task
function clean() {
  return del('./../dist/**/*', { force: true });
}

// ZIP task
function zipDist() {
  return src('./../dist/**/*')
    .pipe(zip('orm.zip'))
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

// ✅ Exposed tasks
exports.clean = clean;
exports.move = move;
exports.zip = zipDist;
exports.build = series(clean, move);
exports.package = series(clean, move, zipDist);
exports.scripts = scripts;
exports["bs-reload"] = bsReload;
