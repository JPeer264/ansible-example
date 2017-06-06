import fs from 'fs-extra';

module.exports = options => {
    const { gulp } = options;

    // lints scss files but does not fail
    const scss = (options = {}, fileStream) => {
        return gulp.src(gulp.data.get('paths.src.allFiles.scss'))
            .pipe(gulp.plugins.sassLint({
                configFile: gulp.data.get('paths.config.scsslint'),
                options
            }))
            .pipe(gulp.plugins.sassLint.format(fileStream));
    };

    // lints scss files and fails
    const scssFail = () => {
        return scss().pipe(gulp.plugins.sassLint.failOnError());
    };

    // lints scss files and create a report
    const scssReport = () => {
        const filePath = gulp.data.get('paths.reports.scss');

        fs.ensureFileSync(filePath);

        const fileStream = fs.createWriteStream(filePath);
        const stream = scss({
                formatter: 'checkstyle',
                options
            }, fileStream);

        stream.on('finish', function() {
            fileStream.end();
        });

        return stream;
    };

    // lints js files but does not fail
    const js = (options = {}, format, fileStream) => {
        return gulp.src(gulp.util._.flatten(gulp.data.get('paths.src.files.js')))
            .pipe(gulp.plugins.eslint({
                configFile: gulp.data.get('paths.config.eslint')
            }))
            .pipe(gulp.plugins.eslint.format(format, fileStream));
    };

    // lints js files and fails
    const jsFail = () => {
        return js().pipe(gulp.plugins.eslint.failOnError());
    };

    // lints js files and create a report
    const jsReport = () => {
        const filePath = gulp.data.get('paths.reports.js');

        fs.ensureFileSync(filePath);

        const fileStream = fs.createWriteStream(filePath);
        const stream = js({
                configFile: gulp.data.get('paths.config.eslint')
            }, 'checkstyle', fileStream);

        stream.on('finish', () => fileStream.end());

        return stream;
    };

    // lints html files but does not fail
    const html = (failOnError = false) => {
        return gulp.src(gulp.data.get('paths.src.allFiles.html'))
            .pipe(gulp.plugins.htmllint({
                failOnError,
                config: gulp.data.get('paths.config.htmllint')
            }));
    };

    // lints html files and fails
    const htmlFail = () => {
        // @todo does not really fail
        return html(true);
    };

    return {
        scss,
        'scss:fail': scssFail,
        'scss:report': scssReport,
        js,
        'js:fail': jsFail,
        'js:report': jsReport,
        html,
        'html:fail': htmlFail
    };
};
