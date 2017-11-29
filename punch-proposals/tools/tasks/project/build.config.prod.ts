import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
const plugins = <any>gulpLoadPlugins();
import {join} from 'path';
import {TMP_DIR, PROD_API_BASE} from '../../config';

export = () => {
  gulp.src(join(TMP_DIR, 'admin/config/config.js'))
    .pipe(plugins.replace('inject:API_BASE', PROD_API_BASE))
    .pipe(gulp.dest(join(TMP_DIR, 'admin/config')));
}
