import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
const plugins = <any>gulpLoadPlugins();
import {join} from 'path';
import {APP_DEST, DEV_API_BASE, PRODUCTS, CONFIG_SRC, CONFIG_FILE} from '../../config';

export = () => {
  gulp.src(join(APP_DEST, CONFIG_FILE))
    .pipe(plugins.replace('inject:API_BASE', DEV_API_BASE))
    .pipe(plugins.replace('inject:punch-data', PRODUCTS.DEV_DATA))
    .pipe(plugins.replace('inject:punch-candidates', PRODUCTS.DEV_CANDIDATES))
    .pipe(plugins.replace('inject:punch-proposals', PRODUCTS.DEV_PROPOSALS))
    .pipe(gulp.dest(join(APP_DEST, CONFIG_SRC)));
};
