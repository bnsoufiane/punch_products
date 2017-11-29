import * as gulp from 'gulp';
import {PROD_DEST, API_CLIENT_DIR} from '../../config';
import {join} from 'path';

//copy dependencies to prod dist folder
export = () => {
  return gulp.src([
    join(PROD_DEST, '**/*'),
  ]).pipe(gulp.dest(API_CLIENT_DIR));
}
