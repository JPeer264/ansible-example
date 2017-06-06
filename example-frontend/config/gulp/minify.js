import merge from 'merge-stream';
import webpack from 'webpack';

module.exports = options => {
    const { gulp } = options;
    const webpackConfig = require(gulp.data.get('paths.config.webpack'));

    webpackConfig.plugins = webpackConfig.plugins || [];

    return {
        js: cb => {
            let stream = merge();

            const baseStream = gulp.src(gulp.data.get('paths.dev.allFiles.js'))
                .pipe(gulp.plugins.rcs({
                    exclude: '**/vendor.js'
                }))
                .pipe(gulp.plugins.uglify())
                .pipe(gulp.plugins.rename({
                    suffix: '.min'
                }));

            // minify
            stream.add(baseStream.pipe(gulp.dest(gulp.data.get('paths.dest.base'))));

            // gzip
            stream.add(baseStream.pipe(gulp.plugins.gzip({ extension: 'gzip' }))
                .pipe(gulp.dest(gulp.data.get('paths.dest.base'))));

            return stream;
        },
        css: () => {
            let stream = merge();

            // minfy
            stream.add(gulp.src(gulp.data.get('paths.dev.allFiles.css'))
                .pipe(gulp.plugins.rcs())
                .pipe(gulp.plugins.cleanCss())
                .pipe(gulp.plugins.rename({
                    suffix: '.min'
                }))
                .pipe(gulp.dest(gulp.data.get('paths.dest.base'))));

            // gzip
            stream.add(gulp.src(gulp.data.get('paths.dest.allFiles.css'))
                .pipe(gulp.plugins.gzip({ extension: 'gzip' }))
                .pipe(gulp.dest(gulp.data.get('paths.dest.base'))))

            return stream;
        },
        html: () => {
            return gulp.src(gulp.data.get('paths.src.allFiles.html'))
                .pipe(gulp.plugins.cdnify({
                    rewriter: url => {
                        var arr = url.split('.');

                        if (arr[arr.length - 2] !== 'min') {
                            arr.splice((arr.length - 1), 0, 'min');
                        }

                        return arr.join('.');
                    }
                }))
                .pipe(gulp.plugins.rcs())
                .pipe(gulp.plugins.htmlmin({collapseWhitespace: true}))
                .pipe(gulp.dest(gulp.data.get('paths.dest.base')));
        }
    };
};
