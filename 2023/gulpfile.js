// libraries
import fs from "fs";
import gulp from "gulp";
import data from "gulp-data";
import header from "gulp-header";
import nunjucksRender from "gulp-nunjucks-render";

// dev tools
import browserSync from "browser-sync";

export function html() {
    const conferencesData = JSON.parse(fs.readFileSync("scripts/conferences.json"));
    return gulp
        .src("scripts/nunjucks/templates/programme.html")
        .pipe(data({ conferencesData }))
        .pipe(nunjucksRender())
        .pipe(header("\n\n<!-- This file generated, do not edit it manually. Instructions in the README. -->\n\n\n"))
        .pipe(gulp.dest("."));
}

function _serve() {
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

const serve = gulp.parallel(html, watchFiles, _serve);
export { serve, html as build };
