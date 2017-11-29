import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
const plugins = <any>gulpLoadPlugins();
import {join} from 'path';
import {TMP_DIR, PROD_API_BASE, PRODUCTS, CONFIG_SRC, CONFIG_FILE} from '../../config';

export = () => {
  gulp.src(join(TMP_DIR, CONFIG_FILE))
    .pipe(plugins.replace('inject:API_BASE', PROD_API_BASE))
    .pipe(plugins.replace('inject:punch-data', PRODUCTS.PROD_DATA))
    .pipe(plugins.replace('inject:punch-candidates', PRODUCTS.PROD_CANDIDATES))
    .pipe(plugins.replace('inject:punch-proposals', PRODUCTS.PROD_PROPOSALS))
    .pipe(gulp.dest(join(TMP_DIR, CONFIG_SRC)));
};
