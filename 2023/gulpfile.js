// libraries
const fs = require("fs");
const gulp = require("gulp");
const nunjucks = require("gulp-nunjucks");
const nunjucksRender = require("gulp-nunjucks-render");
const data = require("gulp-data");

// post-processing tools
const clean = require("gulp-clean"); // TODO: deprecated

// dev tools
const browserSync = require("browser-sync").create();
const log = require("fancy-log");

function html() {
    const conferencesData = JSON.parse(fs.readFileSync("./conferences.json"));
    return gulp
        .src("scripts/nunjucks/templates/programme.html")
        .pipe(data({conferencesData}))
        .pipe(nunjucksRender())
        .pipe(gulp.dest("."));
}

function serve() {
    browserSync.init({
        open: false,
        server: {
            baseDir: "./",
            serveStaticOptions: {
                extensions: ["html"]
            }
        }
    });
}

function browserSyncReload(done) {
    browserSync.reload();
    done();
}

function watchFiles() {
    gulp.watch("conferences.json", gulp.series(html, browserSyncReload));
    gulp.watch("**/*.njk", gulp.series(html, browserSyncReload));
    gulp.watch("scripts/nunjucks/**/*.html", gulp.series(html, browserSyncReload));
    return;
}

function del() {
    return gulp.src("./programme.html", {read: false}).pipe(clean());
}

exports.html = html;
exports.serve = gulp.parallel(html, watchFiles, serve);
exports.build = gulp.series(del, html);
