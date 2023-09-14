const gulp = require("gulp");
const concat = require("gulp-concat");
const del = require("delete");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");
const autoprefixer = require("gulp-autoprefixer");
const sass = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename");
const cssmin = require("gulp-cssmin");
const purgecss = require("gulp-purgecss");
const pug = require("gulp-pug");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();

function buildCSS() {
  return (
    gulp
      .src("src/sass/*.scss")
      .pipe(sass().on("error", sass.logError))
      .pipe(concat("style.css"))
      .pipe(
        autoprefixer({
          cascade: true,
        })
      )
      .pipe(cssmin())
      .pipe(rename({ suffix: ".min" }))
      // .pipe(
      //   purgecss({
      //     content: ["src/**/*.pug"],
      //   })
      // )
      .pipe(gulp.dest("dist/css"))
      .pipe(browserSync.stream())
  );
}

function buildHTML() {
  return (
    gulp
      .src("src/*.html")
      .pipe(htmlmin({ collapseWhitespace: true }))
      // .pipe(
      //   pug({
      //     pretty: true,
      //   })
      // )
      .pipe(gulp.dest("dist"))
  );
}

function buildJS() {
  return gulp
    .src("src/js/*.js")
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.stream());
}

function buildImages() {
  return gulp.src("src/img/**/*").pipe(imagemin()).pipe(gulp.dest("dist/img"));
}

function clean() {
  return del("dist/**", { force: true });
}

function build() {
  return gulp.series([clean, gulp.parallel([buildImages, buildCSS, buildHTML, buildJS])]);
}

function start() {
  gulp.watch("src/**/*", build());
}

function browsersync() {
  browserSync.init({
    server: { baseDir: "dist/" },
    notify: false,
    online: true,
  });
}

exports.browsersync = browsersync;
exports.buildHTML = buildHTML;
exports.buildCSS = buildCSS;
exports.buildJS = buildJS;
exports.clean = clean;
exports.start = gulp.parallel(start, browsersync);
exports.default = build();
