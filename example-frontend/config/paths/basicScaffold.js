import _ from 'lodash';
import names from './names';

export default function (folderName, moreScaffold = {}) {
    let baseName = names[folderName] || folderName;

    const scaffold = {
        base: `<%= paths.base %>/${ baseName }`,
        folder: {
            assets: {
                base: `<%=  paths.${ folderName }.base               %>/<%= names.assets %>`,
                js: `<%=    paths.${ folderName }.folder.assets.base %>/js`,
                jss: `<%=   paths.${ folderName }.folder.assets.js   %>/**`,
                scss: `<%=  paths.${ folderName }.folder.assets.base %>/scss`,
                scsss: `<%= paths.${ folderName }.folder.assets.scss %>/**`,
                css: `<%=   paths.${ folderName }.folder.assets.base %>/css`,
                csss: `<%=  paths.${ folderName }.folder.assets.css  %>/**`
            }
        },
        allFiles: {
            js: `<%=   paths.${ folderName }.base %>/**/*.js`,
            scss: `<%= paths.${ folderName }.base %>/**/*.scss`,
            css: `<%=  paths.${ folderName }.base %>/**/*.css`,
            html: `<%= paths.${ folderName }.base %>/**/*.html`
        },
        ignore: {
            _js: [
                `!<%= paths.${ folderName }.base %>/**/_*.js`
            ],
            _scss: `!<%= paths.${ folderName }.base %>/**/_*.scss`,
            _css: `!<%=  paths.${ folderName }.base %>/**/_*.css`,
            _html: `!<%= paths.${ folderName }.base %>/**/_*.html`,
            html: `!<%=  paths.${ folderName }.base %>/**/*.html`,
            assets: [
                `!<%= paths.${ folderName }.files.assets.js`,
                `!<%= paths.${ folderName }.files.assets.css`,
                `!<%= paths.${ folderName }.files.assets.scss`
            ],
        },
        files: {
            js: [
                `<%= paths.${ folderName }.allFiles.js %>`,
                `<%= paths.${ folderName }.ignore._js %>`,
            ],
            scss: [
                `<%= paths.${ folderName }.allFiles.scss %>`,
                `<%= paths.${ folderName }.ignore._scss %>`
            ],
            css: [
                `<%= paths.${ folderName }.allFiles.css %>`,
                `<%= paths.${ folderName }.ignore._css %>`
            ],
            html: [
                `<%= paths.${ folderName }.allFiles.html %>`,
                `<%= paths.${ folderName }.ignore._scss %>`
            ],
            assets: {
                js: [
                    `<%= paths.${ folderName }.folder.assets.jss %>/*.class.js`,
                    `<%= paths.${ folderName }.folder.assets.jss %>/*.js`,
                    `<%= paths.${ folderName }.folder.assets.jss %>/*.init.js`,
                    `<%= paths.${ folderName }.ignore._js %>`
                ],
                scss: [
                    `<%= paths.${ folderName }.folder.assets.scss %>/*.scss`,
                    `<%= paths.${ folderName }.ignore._scss %>`,
                    `<%= paths.${ folderName }.folder.assets.css %>/*.css`,
                    `<%= paths.${ folderName }.ignore._css %>`
                ]
            }
        }
    };

    _.merge(scaffold, moreScaffold);

    return scaffold;
};
