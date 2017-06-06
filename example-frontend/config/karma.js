import gulp from '../gulpfile.babel.js';

// karma.conf.js
module.exports = config => {
    config.set({
        basePath: '../',
        preprocessors: {
            'tests/**/*.spec.js': ['webpack'],
            'src/**/*.spec.js': ['webpack'],
            // '**/src/**/*.js': ['coverage']
        },
        files: [
            // 'dev/assets/js/vendor.js',
            // 'src/**/*.js',
            { pattern: 'tests/**/*.spec.js', watched: false },
            { pattern: 'src/**/*.spec.js', watched: false }
            // each file acts as entry point for the webpack configuration
        ],
        browsers: [
            'PhantomJS',
            // 'Firefox',
            // 'Chrome'
        ],
        frameworks: [
            'mocha',
            'chai',
        ],
        webpack: require('./webpack.config.js'),
        webpackMiddleware: {
            stats: 'errors-only',
        },
        // autoWatch: false,
        // reporters: [
        //     'progress',
        //     'coverage'
        // ],
        // coverageReporter: {
        //     reporters: [{
        //         type : 'html',
        //         dir : gulp.data.get('paths.coverage.base'),
        //         // normalization process to keep a consistent browser name across different
        //         // https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md#subdir
        //         subdir: browser => browser.toLowerCase().split(/[ /-]/)[0]
        //     }, {
        //         type : 'cobertura',
        //         dir : gulp.data.get('paths.reports.base'),
        //         // normalization process to keep a consistent browser name across different
        //         // https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md#subdir
        //         subdir: browser => browser.toLowerCase().split(/[ /-]/)[0]
        //     }]
        // }
    });
};
