import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
const plugins = <any>gulpLoadPlugins();
import {join} from 'path';
import {TMP_DIR, PROD_API_BASE, PRODUCTS, CONFIG_SRC, CONFIG_FILE} from '../../config';

export = () => {
  gulp.src(join(TMP_DIR, CONFIG_FILE))
    .pipe(plugins.replace('inject:API_BASE', PROD_API_BASE))
    .pipe(plugins.replace('inject:PUNCH_ACCOUNTS', PRODUCTS.PROD_ACCOUNTS))
    .pipe(gulp.dest(join(TMP_DIR, CONFIG_SRC)));
};
