// gulpfile.js (Gulp 4)

const { src, dest, series, parallel } = require("gulp");
const plumber = require("gulp-plumber");
const browserSync = require("browser-sync").create();
const del = require("del");
const zip = require("gulp-zip");
const terser = require("gulp-terser");
const fancyLog = require("fancy-log");
const PluginError = require("plugin-error");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const merge = require("merge-stream");

// Paths
const DIST_ROOT = "./../dist/risk-trac-auth-api/";
const SRC_ROOT = "./../";

// Helper: auto-create JS + asset streams
function jsAndAssets(folderPath) {
  const jsStream = src([`${SRC_ROOT}${folderPath}/**/*.js`], { allowEmpty: true })
    .pipe(
      terser().on("error", err => fancyLog.error(err))
    )
    .pipe(dest(`${DIST_ROOT}${folderPath}`));

  const assetStream = src(
    [
      `${SRC_ROOT}${folderPath}/**/*`,
      `!${SRC_ROOT}${folderPath}/**/*.js`
    ],
    { allowEmpty: true }
  ).pipe(dest(`${DIST_ROOT}${folderPath}`));

  return merge(jsStream, assetStream);
}

// ---------- MOVE TASKS ----------

function moveAuth() {
  return jsAndAssets("app/auth");
}

function moveUserManagement() {
  return jsAndAssets("app/user-management");
}

function moveConfig() {
  return src([`${SRC_ROOT}config/**/*`], { allowEmpty: true })
    .pipe(dest(`${DIST_ROOT}config`));
}

function moveDataAccess() {
  return jsAndAssets("data-access");
}

function moveLogFiles() {
  return src([`${SRC_ROOT}log-files/**/*`], { allowEmpty: true })
    .pipe(dest(`${DIST_ROOT}log-files`));
}

function moveNodeModules() {
  return src([`${SRC_ROOT}node_modules/**/*`], { allowEmpty: true })
    .pipe(dest(`${DIST_ROOT}node_modules`));
}

function moveUtility() {
  return jsAndAssets("utility");
}

function moveAppServer() {
  return src([`${SRC_ROOT}app-server.js`], { allowEmpty: true })
    .pipe(
      terser().on("error", err => fancyLog.error(err))
    )
    .pipe(dest(DIST_ROOT));
}

function copyJson() {
  return src([`${SRC_ROOT}*.json`], { allowEmpty: true })
    .pipe(dest(DIST_ROOT));
}

function moveApiDocs() {
  return jsAndAssets("api-docs");
}


// Combined move tasks (parallel)
const move = parallel(
  moveAuth,
  moveUserManagement,
  moveConfig,
  moveDataAccess,
  moveLogFiles,
  moveNodeModules,
  moveUtility,
  moveAppServer,
  copyJson,
  moveApiDocs
);

// ----------- CLEAN -----------
function clean() {
  return del([`${DIST_ROOT}**/*`], { force: true });
}

// ----------- ZIP -----------
function zipDist() {
  return src(`${DIST_ROOT}**/*`, { allowEmpty: true })
    .pipe(zip("risk-trac-auth-api.zip"))
    .pipe(dest(DIST_ROOT));
}

// ----------- BROWSER SYNC -----------
function bsReload(done) {
  browserSync.reload();
  done();
}

// ----------- SCRIPTS -----------
function scripts() {
  return src("*.js", { allowEmpty: true })
    .pipe(
      plumber({
        errorHandler: function (err) {
          fancyLog.error(err);
          this.emit("end");
        }
      })
    )
    .pipe(concat("main.js"))
    .pipe(dest("scripts/"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(
      terser().on("error", err => {
        fancyLog.error(new PluginError("terser", err).toString());
        this.emit("end");
      })
    )
    .pipe(dest("scripts/"))
    .pipe(browserSync.stream());
}

// Exported Tasks
exports.clean = clean;
exports.move = move;
exports.zip = zipDist;
exports.build = series(clean, move);
exports.package = series(clean, move, zipDist);
exports.scripts = scripts;
exports["bs-reload"] = bsReload;
exports.default = exports.build;
