import gulp from '../gulpfile.babel.js';

module.exports = {
    entry: gulp.data.get('paths.src.files.jsEntry'),
    output: {
        path: gulp.data.get('paths.dev.folder.assets.js'),
        filename: 'main.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['env']
            }
        }]
    },
    devtool: '#source-map'
};
