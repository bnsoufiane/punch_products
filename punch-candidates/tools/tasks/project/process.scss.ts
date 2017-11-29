import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import {join} from 'path';
import {APP_SRC, CSS_DEST, ENV, TMP_CSS_DEST} from '../../config';
const plugins = <any>gulpLoadPlugins();

export = () => {

    let sassOptions = {
        includePaths: ['src/assets']
    };

    return gulp.src(join(APP_SRC, '**', '*.scss'))
        .pipe(plugins.sass(sassOptions).on('error', plugins.sass.logError))
        .pipe(gulp.dest(ENV === 'prod'? TMP_CSS_DEST:CSS_DEST));
}
