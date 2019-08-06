const del = require('del');
var ts = require('gulp-typescript');
const { src, dest, series } = require('gulp');

// gulp.task('compile-ts', shell.task('tsc -m commonjs'));

// gulp.task('compile-ts-umd', shell.task('tsc -t es5 -m umd --outDir ./dist/umd/'));

// gulp.task('watch-ts', shell.task('tsc -w -t es5 -m umd --outDir ./dist/umd/'));

// gulp.task('default', sequence('clean', 'compile-ts', 'compile-ts-umd'));

// gulp.task('dev', ['watch-ts']);



function clean() {
  return del('./dist/');
}

function compile_ts(){
    return src('src/index.ts')
        .pipe(ts({
            target: 'es5',
            module: 'commonjs'
        }))
        .pipe(dest('dist'));
};

exports.clean = clean;
exports.compile_ts = compile_ts;

exports.default = series(clean, compile_ts);