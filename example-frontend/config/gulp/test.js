import { Server } from 'karma';

module.exports = options => {
    const { gulp } = options;

    return {
        all: done => {
            Server.start({
                configFile: gulp.data.get('paths.config.karma'),
                singleRun: true
            }, done);
        }
    };
};
