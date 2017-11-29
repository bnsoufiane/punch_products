import * as gulp from 'gulp';
import {EXTERNAL_FONTS_SRC, FONTS_DEST} from '../../config';

export = () => {
  return gulp.src(EXTERNAL_FONTS_SRC)
    .pipe(gulp.dest(FONTS_DEST));
};
