// gulpプラグイン
const gulp = require('gulp');
// Sassをコンパイルするプラグイン
const sass = require('gulp-sass');
// Sassの@importを補助するプラグイン
const sassGlob = require("gulp-sass-glob");
// ベンダープレフィックスを付与するプラグイン
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
// cssにソースマップを付与するプラグイン
const sourcemaps = require('gulp-sourcemaps');
// HTMLの構文チェックするプラグイン
const htmlhint = require('gulp-htmlhint');
// CSSの構文チェックするプラグイン
const csslint = require("gulp-csslint");
// Webpackのプラグイン
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
// JavaScriptの構文チェックするプラグイン
const eslint = require("gulp-eslint");
// pugをコンパイルするプラグイン
const pug = require('gulp-pug');
// HTMLを整形するプラグイン
const htmlbeautify = require('gulp-html-beautify');
// 画像を圧縮するプラグイン
const imagemin = require("gulp-imagemin");
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
// FTPアップロードするプラグイン
const gutil = require('gulp-util');
const ftp = require('gulp-ftp');
const fs   = require('fs');
//  通知を出すプラグイン
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
//  エラーをキャッシュするプラグイン
const cached = require('gulp-cached');
// ブラウザ同期プラグイン
const browserSync = require("browser-sync");

// パス(先頭に「./」を付けるとwatchが変になる)
const paths = {
  'scss': 'source/src/scss/',
  'css': 'source/dist/assets/css/',
  'pug': 'source/src/pug/',
  'html': 'source/dist/',
  'js': 'source/dist/assets/js/',
  'wp': 'source/src/js/',
  'up': 'source/dist/**/*',
  'image': 'source/dist/assets/images/',
  'src': 'source/src/',
  'lint': 'source/lints/'
}

// Sassのコンパイル
gulp.task('sass', () => {
  // style.scssファイルを取得
  gulp.src(paths.scss + 'style.scss')
    .pipe(sassGlob())
    .pipe(plumber({errorHandler: notify.onError({
      title: "Error...",
      icon: 'logo.png',
      message: "<%= error.message %>"
      })
    }))
    // ソースマップの初期化
    .pipe(sourcemaps.init())
    // cssの圧縮形式
    .pipe(sass({
      outputStyle: 'compressed' 
    }))
    // Sassのコンパイルエラーを表示(これがないと自動的に止まってしまう)
    .on('error', sass.logError)
    // cssフォルダー以下に保存
    .pipe(gulp.dest(paths.css))
    // ベンダープレフィックスの付与
    .pipe(postcss([
      autoprefixer({
        // ☆IEは11以上、Androidは4.4以上
        // その他は最新2バージョンで必要なベンダープレフィックスを付与する設定
        grid: "autoplace",
        browsers: ["last 2 versions", "ie >= 11", "Android >= 4"],
        cascade: false,
      })
    ]))
    // ソースマップの書き込み
    .pipe(sourcemaps.write('./map'))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.stream());
});

// HTMLの構文チェック
gulp.task('htmlhint', function(){
　　gulp.src(paths.html + '**/*.html')
  .pipe(htmlhint(paths.lint + '.htmlhintrc'))
  .pipe(htmlhint.reporter());
});

// CSSの構文チェック
gulp.task('csslint', function() {
  gulp.src(paths.css + "**/*.css")
    .pipe(csslint(paths.lint + '.csslintrc'))
    .pipe(csslint.reporter());
});

// JavaScriptの構文チェック
gulp.task('eslint', () => {
  gulp.src([paths.js + '**/*.js'])
    .pipe(eslint(paths.lint + '.eslintrc'))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// Webpack経由でBabelをコンパイル
gulp.task('webpack', function() {
  return webpackStream(webpackConfig, webpack).on('error', function (e) {
      this.emit('end');
  })
  .pipe(gulp.dest(paths.js));
});

//  Pugのコンパイル
gulp.task('pug', () => {
  gulp.src([paths.pug + '**/*.pug', '!' + paths.pug + '**/_*.pug'])
    .pipe(plumber({errorHandler: notify.onError({
      title: "Error...",
      icon: './gulpimage/pug.png',
      message: "<%= error.message %>"
      })
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(htmlbeautify({
      'indent_with_tabs': true,
      'indentSize': 4,
    }))
    .pipe(gulp.dest(paths.html))
    .pipe(browserSync.stream());
});

// 画像圧縮
gulp.task('imagemin', () => {
  gulp.src(paths.src + 'nat_images/**/*.jpg',paths.src + 'nat_images/**/*.jpeg',paths.src + 'nat_images/**/*.JPG',paths.src + 'nat_images/**/*.JPEG')
    .pipe(imagemin([
      mozjpeg({
        quality: 80,
      }),
    ]))
    .pipe(gulp.dest(paths.src + 'comp_images'));
  gulp.src(paths.src + 'nat_images/**/*.png')
    .pipe(imagemin([
      pngquant({
        quality: '65-80',  // 画質
        speed: 1,  // 最低のスピード
        floyd: 0,  // ディザリングなし
      }),
    ]))
    .pipe(gulp.dest(paths.src + 'comp_images'));
});

// 外部ファイルからFTP情報を読み込む
// let ftpInfo = JSON.parse(fs.readFileSync('./ftp.json', 'utf8'));
// FTPアップロード
gulp.task('upload', () => {
  gulp.src([paths.up])
    .pipe(ftp(ftpInfo))
    .pipe(notify({
      title: "Uploaded...",
      icon: 'logo.png',
      message: "やったね"
    }));
});

// ブラウザ同期
gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: paths.html,        //対象ディレクトリ
      index  : "index.html"    //インデックスファイル
    }
  });
});

// ブラウザリロード
gulp.task('bs-reload', () => {
  browserSync.reload();
});

// デフォルトで実行するタスク
gulp.task('default', ['browser-sync'], () => {
  gulp.watch(paths.scss + '**/*.scss',      ['sass']);
  //gulp.watch(paths.css + '**/*.css',         ['csslint']);
  //gulp.watch(paths.js + '**/*.js',            ['eslint']);
  gulp.watch(paths.wp + '**/*.js ',         ['webpack']);
  gulp.watch(paths.pug + '*.pug',         ['pug']);
  gulp.watch(paths.pug + '**/*.pug',        ['pug']);
  //gulp.watch(paths.html + '*.html',         ['htmlhint']);
  gulp.watch(paths.html + '*.html',         ['bs-reload']);
  gulp.watch(paths.css + '**/*.css',         ['bs-reload']);
  gulp.watch(paths.js + '**/*.js',            ['bs-reload']);
});

// 画像圧縮するタスク
gulp.task('img', ['imagemin'], () => {
  gulp.watch(paths.src + 'nat_images/*.jpg', paths.src + 'nat_images/*.jpeg',paths.src + 'nat_images/*.JPEG',paths.src + 'nat_images/*.JPG'  ['imagemin']);
  gulp.watch(paths.src + 'nat_images/*.png',   ['imagemin']);
});

// FTPアップロードするタスク
gulp.task('up', ['upload'], () => {
  gulp.watch(paths.html + '**/*',         ['upload']);
});