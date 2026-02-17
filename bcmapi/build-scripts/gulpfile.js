const gulp 			           = require('gulp');
const plumber 		         = require('gulp-plumber');
const browserSync		       = require('browser-sync');
const zip                  = require('gulp-zip');
const del                  = require('del');
const uglify               = require('gulp-uglify-es').default;
const javascriptObfuscator = require('gulp-javascript-obfuscator');

//const series = require('gulp-series'); // For gulp-series
const runSequence = require('gulp4-run-sequence');

// Move all the folder from project structure to dist folder//
gulp.task('move', async function () {

  var task1 = await gulp.src(['./../config/**/*'])
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api/config'));

  var task2 = await gulp.src(['./../data-access/**/*'])
  .pipe(uglify())
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api/data-access'));

  var task3 = await gulp.src(['./../log-files'])
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api'));

  var task4 = await gulp.src(['./../log-notification'])
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api'));

  var task5 = await gulp.src(['./../node_modules/**/*'])
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api/node_modules'));
  
  var task6 = await gulp.src(['./../utility/**/*'])
  .pipe(uglify())
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api/utility'));
  
  var task7 = await gulp.src(['./../app-server.js'])
  .pipe(uglify())
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api/'));

  var task8 = await gulp.src(['./../*.json'])
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api/'));

  var task9 = await gulp.src(['./../app/master/**/*'])
  .pipe(uglify())
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api/app/master'));

  var task10 = await gulp.src(['./../app/site-risk-assessments/*'])
  .pipe(uglify())
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api/app/site-risk-assessments'));

  var task11 = await gulp.src(['./../log-notification'])
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api'));

  var task12 = await gulp.src(['./../app/business-continuity-planning/*'])
  .pipe(uglify())
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api/app/business-continuity-planning'));

  var task13 = await gulp.src(['./../app/bcms-testing/*'])
  .pipe(uglify())
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api/app/bcms-testing'));

  var task14 = await gulp.src(['./../app/crisis-communication/*'])
  .pipe(uglify())
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api/app/crisis-communication'));
  
  var task15 = await gulp.src(['./../app/incident-report/*'])
  .pipe(uglify())
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api/app/incident-report'));

  var task16 = await gulp.src(['./../app/compliance-review/*'])
  .pipe(uglify())
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api/app/compliance-review'));

  var task17 = await gulp.src(['./../app/remediation-tracker/*'])
  .pipe(uglify())
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api/app/remediation-tracker'));

  var task18 = await gulp.src(['./../file-upload/**/*'])
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api/file-upload'));

  var task19 = await gulp.src(['./../app/dashboard/*'])
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api/app/dashboard'));

  var task20 = await gulp.src(['./../app/inApp-notification/*'])
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api/app/inApp-notification'));

  var task21 = await gulp.src(['./../app/risk-rating/*'])
  .pipe( gulp.dest('./../dist/risk-trac-bcm-api/app/risk-rating'));


  
// merging of all tasks
  return [ 
    task1,
    task2,
    task3,
    task4,
    task5,
    task6,
    task7,
    task8,
    task9,
    task10,
    task11,
    task12,
    task13,
    task14,
    task15,
    task16,
    task17,
    task18,
    task19,
    task20,
    task21
    ];
});

// clean
gulp.task('clean', async function () {
  return await del('./../dist/**/*', {force: true});  
}); 

// ziping of folder structure
gulp.task('zip', async () =>
await gulp.src('./../dist/**/*')
    .pipe(zip('risk-trac-bcm-api.zip'))
    .pipe( gulp.dest('./../dist/'))
);

// build the project
gulp.task('sequence1', async function (cb) {
  await runSequence('clean', 'move', cb); 
});
gulp.task('build', gulp.series('sequence1'));


gulp.task('bs-reload', async function () {
 await browserSync.reload();
});

gulp.task('scripts', async function(){
  return await gulp.src('*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('scripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(javascriptObfuscator({
        compact: true,
        sourceMap: false
    }))
    .pipe(gulp.dest('scripts/'))
    .pipe(browserSync.reload({stream:true}))
});