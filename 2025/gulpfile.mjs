// libraries
import gulp from 'gulp';
import fs from 'fs';
import {deleteAsync} from 'del';
import header from 'gulp-header';
import nunjucksRender from 'gulp-nunjucks-render';
import data from 'gulp-data';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import browserSync from "browser-sync";

const { src, dest, parallel, series, watch, task } = gulp;
const sass = gulpSass(dartSass);

// dev tools
browserSync.create();

function clean() {
    return deleteAsync(['dist']);
}

function html() {
    const conferencesData = JSON.parse(fs.readFileSync("src/js/conferences.json"));
    return src('src/html/pages/*.+(html|njk)')
        .pipe(data({ conferencesData }))
        .pipe(nunjucksRender({ path: ['src/html'] }))
        .pipe(header("\n\n<!-- This file generated, do not edit it manually. Instructions in the README. -->\n\n\n"))
        .pipe(dest("dist"));
}

function css() {
    return src([
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'src/scss/*css'
    ])
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('dist/css'));
};

function javascript() {
    return src('src/js/*.js')
        .pipe(dest('dist/js'));
}

function jsVendor() {
    return src([
        'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
        'node_modules/jquery/dist/jquery.slim.min.js'
    ])
        .pipe(dest('dist/js'))
}


function image() {
    return src('src/img/**/*.+(png|jpg|jpeg|gif|svg|pdf)',{ encoding: false })
        .pipe(dest('dist/img'));
}

function font() {
    return src('src/fonts/*.ttf', { encoding: false })
        .pipe(dest('dist/fonts'));
}

// Static Server
function serve() {
    series(clean, html, image, font, css, javascript, jsVendor);
    browserSync.init({
        open: false,
        server: "./dist"
    });
}

function browserSyncReload(done) {
    browserSync.reload();
    done();
}

function watchFiles() {
    watch('src/html/**/*', series(html, browserSyncReload));
    watch('src/scss/*.+(scss|css)', series(css, browserSyncReload));
    watch('src/js/*.js', series(javascript, browserSyncReload));
    watch('src/img/**/*.+(png|jpg|jpeg|svg)', series(image, browserSyncReload));
}

const _build = series(clean, html, image, font, css, javascript, jsVendor);
task('serve', parallel(_build, watchFiles, serve))
task('build', _build)
