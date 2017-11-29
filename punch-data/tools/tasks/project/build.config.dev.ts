import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
const plugins = <any>gulpLoadPlugins();
import {join} from 'path';
import {APP_DEST, DEV_API_BASE, PRODUCTS, CONFIG_SRC, CONFIG_FILE} from '../../config';

export = () => {
  gulp.src(join(APP_DEST, CONFIG_FILE))
    .pipe(plugins.replace('inject:API_BASE', DEV_API_BASE))
    .pipe(plugins.replace('inject:PUNCH_ACCOUNTS', PRODUCTS.DEV_ACCOUNTS))
    .pipe(gulp.dest(join(APP_DEST, CONFIG_SRC)));
};
