import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
const plugins = <any>gulpLoadPlugins();
import {join} from 'path';
import {APP_DEST, DEV_API_BASE} from '../../config';

export = () => {
  gulp.src(join(APP_DEST, 'admin/config/config.js'))
    .pipe(plugins.replace('inject:API_BASE', DEV_API_BASE))
    .pipe(gulp.dest(join(APP_DEST, 'admin/config')));
}
