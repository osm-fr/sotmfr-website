// libraries
const data = require("gulp-data");
const fs = require("fs");
const gulp = require("gulp");
const header = require("gulp-header");
const nunjucksRender = require("gulp-nunjucks-render");

// dev tools
const browserSync = require("browser-sync").create();

function html() {
    const conferencesData = JSON.parse(fs.readFileSync("scripts/conferences.json"));
    return gulp
        .src("scripts/nunjucks/templates/programme.html")
        .pipe(data({conferencesData}))
        .pipe(nunjucksRender())
        .pipe(header("\n\n<!-- This file generated, do not edit it manually. Instructions in the README. -->\n\n\n"))
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

exports.html = html;
exports.serve = gulp.parallel(html, watchFiles, serve);
exports.build = gulp.series(html);
