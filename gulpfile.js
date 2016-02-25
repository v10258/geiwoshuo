var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

//var spritesmith = require('gulp.spritesmith');
var pngquant = require('imagemin-pngquant');

var webpackConfig = require('./webpack.config.js');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var fs = require('fs');
var path = require('path');

var config = {
    src: 'assets',          // css js img scss 资源目录 开头和结尾不需要/
    subdir: '',             // css js img scss 资源目录 明确指向可以使开发过程中只处理此目录下的文件提高效率 请以/开头 结尾不需要/
    html: 'pages',          // 页面模板文件目录
    dist: 'dist',           // build 构建目录
    rev: 'rev',             // 版本构建目录
    production: !!plugins.util.env.production   // 当前为生产环境
};

// mock 中间件
var mock = function(req, res, next) {
    var urlReg = /^\/mock\/(.*)/,
        match = req.url.match(urlReg),
        result,
        filePath,
        segments;

    plugins.util.log('request from client:' + req.url);

    if (!match) {
        plugins.util.log('not matched,passed...');
        return next();
    }

    segments = match[1].split('/').map(function(n) {
        return /\d+/.test(n) ? 'N' : n;
    });
    filePath = path.join('mock', segments.join('.')) + '.json';

    plugins.util.log('parsed filePath:' + filePath);
    fs.exists(filePath, function(exists) {
        if (exists) {
            result = fs.readFileSync(filePath, 'utf-8');
        } else {
            result = JSON.stringify({
                "success": false,
                "message": 'mock data file:[' + filePath + '] doesn\'t exist!'
            });
        }

        plugins.util.log('fs.exists result:' + result);

        res.setHeader("Content-Type", "application/json");
        res.end(result);
    });

    plugins.util.log('request from client:' + req.url);

    next();
}

// 压缩图片
gulp.task('image', function() {
    console.log(plugins.util.colors.green('Minify images'));

    return gulp.src(config.src + '/img' + config.subdir + '/**/*.+(png|jpg|gif)')
        .pipe(plugins.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(config.dist + '/img'))
        .pipe(plugins.notify({ message: 'images task ok' }));
});


// 编译Scss 合并、压缩、生成css
gulp.task('scss', function() {
    console.log(plugins.util.colors.green('compile scss into css'));

    return gulp.src([config.src + '/scss/**/*.scss', '!assets/scss/mixins/*.scss'])
        .pipe(plugins.cached('scss'))
        .pipe(plugins.plumber())
        .pipe(config.production ? plugins.sass({outputStyle: 'compressed'}) : plugins.sass())
        .pipe(gulp.dest(config.dist + '/scss'))
        .pipe(reload({
            stream: true
        }))
        .pipe(plugins.notify({ message: 'scss task ok' }));
});



gulp.task('clean:rev', function(){
    return gulp.src(config.rev, {read: false})
        .pipe(plugins.clean());
})

// 生成MD5文件版本
gulp.task('rev', ['clean:rev'], function() {

    return gulp.src([config.dist + '/**/*.css', config.dist + '/**/*.js'])
        .pipe(plugins.rev())
        .pipe(gulp.dest(config.rev))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest(config.rev))
})

// 替换html 摸板中的文件为最新的MD5版本
gulp.task('revcollector', ['rev'], function() {

    return gulp.src([config.rev + '/*.json', config.dist + '/**/*.html'])
        .pipe(plugins.revCollector({
            replaceReved: true,
            dirReplacements: {
                '../dist': './'
            }
        }))
        .pipe(gulp.dest('rev'))
})

// 编译引入的组件
gulp.task('fileinclude', function() {
    return gulp.src(config.html + '/**/*.html')
        .pipe(plugins.fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(config.dist));
});


// 检查脚本
gulp.task('jshint', function() {
    console.log(plugins.util.colors.green('jshint execute...'));

    return gulp.src(config.src + '/js' + config.subdir + '/**/*.js')
        .pipe(plugins.cached('jshint'))
        .pipe(plugins.plumber())
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'));
});

// webpack 打包js
gulp.task("webpack", ['jshint'], function(callback) {

    var myConfig = Object.create(webpackConfig);

    return gulp.src('')
        .pipe(plugins.webpack(require('./webpack.config.js')))
        .pipe(config.production ? plugins.uglify({
                compress: {
                  drop_console: true
                }
            }) : plugins.util.noop())
        .pipe(gulp.dest(config.dist + '/js'))
        .pipe(plugins.notify({ message: 'webpack task ok'}));
});


// 静态服务器 + 监视 less/html 文件
gulp.task('serve', function() {

    browserSync({
        server: './'//,
        //middleware: [mock]
    });

    gulp.watch(config.src + '/js/' + config.subdir + '/**/*.js', ['webpack']);
    gulp.watch(config.src + '/**/*.scss', ['scss']);
    gulp.watch(config.html + '/**/*.html').on('change', reload);
});

// 发布，更新版本 任务
gulp.task('release', ['revcollector']);

// bulid 任务
gulp.task('build', ['images', 'fileinclude']);

// 默认任务
gulp.task('default', ['scss', 'webpack', 'serve']);