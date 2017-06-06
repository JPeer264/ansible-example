import basicScaffold from './basicScaffold';

const vendor = basicScaffold('vendor', {
    allFiles: {
        min: {
            js: '<%=  paths.vendor.base %>/**/*.min.js',
            css: '<%= paths.vendor.base %>/**/*.min.css'
        }
    }
});

const src = basicScaffold('src', {
    tests: '<%= paths.src.base  %>/**/*.spec.js',
    copy: [
        '<%= paths.src.base %>/**/*',
        '!<%= paths.src.base %>/**/*.js',
        '!<%= paths.src.base %>/**/*.scss'
    ],
    ignore: {
        modules: [
            '!<%= paths.src.base %>/**/node_modules/**/*.js',
            '!<%= paths.src.base %>/**/node_modules/**/*.css',
            '!<%= paths.src.base %>/**/node_modules/**/*.html'
        ],
        tests: [
            '!<%= paths.src.tests %>'
        ],
        browser_scss: '!<%= paths.src.folder.assets.scss %>/browser.*/**/*.scss',
        couldBeVendor: [
            '!<%= paths.src.base %>/**/*.min.js',
            '!<%= paths.src.base %>/**/*jquery*.js',
            '!<%= paths.src.base %>/**/*angular*.js',
            '!<%= paths.src.base %>/**/*ember*.js',
            '!<%= paths.src.base %>/**/*bootstrap*.js',
            '!<%= paths.src.base %>/**/*.min.css',
            '!<%= paths.src.base %>/**/*bootstrap*.css'
        ],
        assets: [
            '!<%= paths.src.files.assets.js',
            '!<%= paths.src.files.assets.css',
            '!<%= paths.src.files.assets.scss'
        ],
        min: [
            '!<%= paths.src.base %>/**/*.min.*'
        ]
    },
    files: {
        // overwrite basicScaffold options due to ignore browser_scss
        scss: [
            '<%= paths.src.allFiles.scss %>',
            '<%= paths.src.ignore.browser_scss %>',
            '<%= paths.src.ignore._scss %>'
        ],
        // overwrite basicScaffold options due to ignore all tests
        js: [
            '<%= paths.src.allFiles.js %>',
            '<%= paths.src.ignore._js %>',
            '<%= paths.src.ignore.tests %>'
        ],
        jsEntry: '<%= paths.src.folder.assets.js %>/<%= names.files.jsEntry %>',
        assets: {
            js: [
                '<%= paths.src.folder.assets.jss %>/*.js',
                '<%= paths.src.ignore._js %>',
                '<%= paths.src.ignore.tests %>'
            ],
        },
        couldBeVendor: {
            js: [
                '<%= paths.src.base %>/**/*.min.js',
                '<%= paths.src.base %>/**/*jquery*.js',
                '<%= paths.src.base %>/**/*angular*.js',
                '<%= paths.src.base %>/**/*ember*.js',
                '<%= paths.src.base %>/**/*bootstrap*.js'
            ],
            css: [
                '<%= paths.src.base %>/**/*.min.css',
                '<%= paths.src.base %>/**/*bootstrap*.css'
            ]
        }
    }
});

export default {
    base: process.cwd(),
    dev: basicScaffold('dev'),
    vendor,
    src,
    dest: basicScaffold('dest'),
    coverage: {
        base: '<%= paths.base %>/coverage'
    },
    reports: {
        base: '<%= paths.base %>/reports',
        scss: '<%= paths.reports.base %>/sasslint.xml',
        js: '<%= paths.reports.base %>/eslint.xml'
    },
    config: {
        base: '<%= paths.base %>/config',
        scsslint: '<%= paths.config.base %>/scsslint.yml',
        htmllint: '<%= paths.config.base %>/.htmllintrc',
        eslint: '<%= paths.config.base %>/.eslintrc',
        karma: '<%= paths.config.base %>/karma.js',
        webpack: '<%= paths.config.base %>/webpack.config.js'
    }
};
