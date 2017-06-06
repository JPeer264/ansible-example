'use strict';

// @todo find alternative for finding recursive template strings
// remove grunt as template finder

/*************
 ** MODULES **
 *************/
import _ from 'lodash';
import gulp from 'gulp';
import grunt from 'grunt';
import merge from 'merge-stream';
import paths from './config/paths';
import deleteEmpty from 'delete-empty';

gulp.plugins = require('gulp-load-plugins')();

const browserSync = require('browser-sync').create();

/**
 * get a task in ./config/gulp/
 *
 * @param  {string} mainTask the filename for the task
 * @param  {string} subTask  the returned task from the filename
 *
 * @return {Stream}
 */
const getTask = (mainTask, subTask) => {
    const task = require('./config/gulp/' + mainTask)({ gulp });

    return task[subTask];
};

gulp.util   = require('gulp-util');
gulp.util._ = _;
gulp.data   = grunt.config;
gulp.data.init(paths);

module.exports = gulp;

/***********
 ** TASKS **
 ***********/
// 0. Helper
// ---------
gulp.task('clean', () => {
    return gulp.src(_.flatten([
            gulp.data.get('paths.dev.base'),
            gulp.data.get('paths.dest.base'),
            gulp.data.get('paths.reports.base'),
            './coverage'
        ]), {
            allowEmpty: true
        })
        .pipe(gulp.plugins.clean());
});

// 1. Managing
// -----------
gulp.task('manage:js:vendor', getTask('manage', 'js:vendor'));
gulp.task('manage:js:own', getTask('manage', 'js:webpack'));
gulp.task('manage:js', gulp.parallel('manage:js:own', 'manage:js:vendor'));
gulp.task('manage:sass:browser', getTask('manage', 'sass:browser'));
gulp.task('manage:sass', gulp.series('manage:sass:browser', getTask('manage', 'sass')));
gulp.task('manage', gulp.parallel('manage:sass', 'manage:js'));

// 2. Linting
// ----------
gulp.task('lint:js:fail', getTask('lint', 'js:fail'));
gulp.task('lint:js', getTask('lint', 'js'));
gulp.task('lint:scss:fail', getTask('lint', 'scss:fail'));
gulp.task('lint:scss', getTask('lint', 'scss'));
gulp.task('lint:html:fail', getTask('lint', 'html:fail'));
gulp.task('lint:html', getTask('lint', 'html'));
gulp.task('lint', gulp.parallel('lint:js', 'lint:scss', 'lint:html'));
gulp.task('lint:fail', gulp.parallel('lint:js:fail', 'lint:scss:fail', 'lint:html:fail'));

// 3. Minifying
// ------------
gulp.task('minify:css', gulp.series('manage:sass', getTask('minify', 'css')));
gulp.task('minify:js', gulp.series(gulp.parallel('manage:js', 'manage:sass'), getTask('minify', 'js')));
gulp.task('minify:html', gulp.series('manage:sass', getTask('minify', 'html')));
gulp.task('minify', gulp.parallel('minify:css', 'minify:js', 'minify:html'));

// 4. Testing
// ----------
gulp.task('test', gulp.series('manage:js:vendor', getTask('test', 'all')));

// 5. Reports
// ----------
gulp.task('reports:test', gulp.parallel('test'));
gulp.task('reports:lint', gulp.parallel(getTask('lint', 'js:report'), getTask('lint', 'scss:report')));
gulp.task('reports', gulp.parallel('reports:test', 'reports:lint'));

// 6. Build
// --------
gulp.task('build:prod:unsafe', gulp.series('clean', 'minify', () => {
    let stream = merge();

    // first stream to copy everything but html, js and scss
    stream.add(gulp.src(_.flatten([
            gulp.data.get('paths.src.copy'),
            gulp.data.get('paths.src.ignore.html')
        ]))
        .pipe(gulp.dest(gulp.data.get('paths.dest.base'))));

    // clean dev dir - optional
    stream.add(gulp.src(gulp.data.get('paths.dev.base'))
        .pipe(gulp.plugins.clean()));

    // clean empty dir
    stream.on('end', () => {
        return deleteEmpty.sync(gulp.data.get('paths.dest.base'));
    });

    return stream;
}));

gulp.task('build:prod', gulp.series(gulp.parallel('test', 'lint:fail'), 'build:prod:unsafe'));
gulp.task('build:dev', gulp.series('manage', () => {
    const stream = gulp.src(gulp.data.get('paths.src.copy'))
        .pipe(gulp.dest(gulp.data.get('paths.dev.base')));

    stream.on('end', () => {
        return deleteEmpty.sync(gulp.data.get('paths.dev.base'))
    });

    return stream;
}));

gulp.task('build', gulp.series('build:prod'));

// 7. Serve
// --------
gulp.task('serve:dev', gulp.series('build:dev', () => {
    browserSync.init({
        server: gulp.data.get('paths.dev.base'),
        open: true
    });

    gulp.plugins.watch(gulp.data.get('paths.src.allFiles.js'), gulp.series('manage:js', browserSync.reload))
    gulp.plugins.watch(gulp.data.get('paths.src.allFiles.scss'), gulp.series('manage:sass', browserSync.reload))
    gulp.plugins.watch(gulp.data.get('paths.src.copy'), () => {
        return gulp.src(gulp.data.get('paths.src.copy'))
            .pipe(gulp.dest(gulp.data.get('paths.dev.base')))
            .pipe(browserSync.reload);
    })
}));

gulp.task('serve:reports', gulp.series('reports', () => {
    browserSync.init({
        server: {
            baseDir: gulp.data.get('paths.coverage.base'),
            directory: true
        },
        open: true
    });
}));

gulp.task('serve', gulp.series('serve:dev'));

// 8. Default
// --------
gulp.task('default', gulp.series('build:prod'));
