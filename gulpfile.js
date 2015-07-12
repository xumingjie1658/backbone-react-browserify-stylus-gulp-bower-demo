/************************** modules start *****************************/
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');
var md5 = require('MD5');
var gutil = require('gulp-util');
var argv = require('yargs').argv;
var fs = require('fs');
var inject = require('gulp-inject');
var rimraf = require('gulp-rimraf');
var concat = require('gulp-concat');
var minifyCss = require("gulp-minify-css");
var stylus = require('gulp-stylus');
var nib = require('nib');
/************************** modules end *****************************/


/************************** parameters start***************************/
var config = config || {};
config.isPrd = argv.p;
config.resp = [''];
/************************** parameters end***************************/


/****************************** js tasks start****************************/
gulp.task('cleanJs',function(){
    return gulp.src('./app/assets/*.js', {read:false})
        .pipe(rimraf({force:true}));
});

gulp.task('browserify',['cleanJs'],function(){
    return browserify({
        entries: ['./app/script/main.js'], // Only need initial file, browserify finds the deps
        transform: [reactify] // We want to convert JSX to normal javascript
    })
    .bundle() // Create the initial bundle when starting the task
    .pipe(source('main.js'))
    .pipe(gulp.dest('./app/assets'));
});

gulp.task('uglify',['browserify'],function(){
    return gulp.src('./app/assets/main.js')
            .pipe(config.isPrd ? uglify() : gutil.noop())
            .pipe(gulp.dest('./app/assets'));
});

gulp.task('layoutJs',['uglify'],function(){
    var sourceJs = "./app/assets/main.js";
    var hashJs = md5(fs.readFileSync(sourceJs,"utf8"));
    var finalJs = "./app/assets/discoverapp" + hashJs + '.js';
    fs.renameSync(sourceJs, finalJs);

    return gulp.src('./app/view/index.html')
                .pipe(inject(gulp.src(finalJs,{read : false}),
                {
                      starttag: '<!-- inject:js -->',
                    transform : function(filepath,i,length){
                        var source = null;
                        var fileName = require('path').basename(filepath);
                        if(config.isPrd){
                            source = '//asset-m.huajiaquan.com/app/assets/'+  fileName;
                        }
                        else{
                            source = '/app/assets/'+ fileName;
                        }
                        return "<script src='" + source + "' type='text/jsx'></script>";
                    }
                }))
                .pipe(gulp.dest("./app/view"));
});
/****************************** js tasks end****************************/

/****************************** css tasks start****************************/
gulp.task('cleanCss',function(){
    return gulp.src('./app/assets/*.css',{read:false})
               .pipe(rimraf({force : true}));
})

gulp.task('compileStylus',['cleanCss'],function(){
    return gulp.src('./app/styl/main.styl')
               .pipe(stylus({
                    use: [nib()],
                    sourcemap: { inline: true }
                }))
               .pipe(config.isPrd ? minifyCss() : gutil.noop())
               .pipe(gulp.dest('./app/assets'));

});

gulp.task('layoutCss',['compileStylus'],function(){
    var sourceCss = './app/assets/main.css';
    var hashCss = md5(fs.readFileSync(sourceCss,'utf-8'));
    var finalCss = './app/assets/discoverapp' + hashCss + '.css';
    fs.renameSync(sourceCss, finalCss);

    return gulp.src('./app/view/index.html')
                .pipe(inject(gulp.src(finalCss,{read : false}),
                            {
                                starttag : '<!-- inject:css -->',
                                transform : function(filepath,i,length){
                                    var source = null;
                                    var fileName = require('path').basename(filepath);
                                    if(config.isPrd){
                                        source = '//asset-m.huajiaquan.com/app/assets/'+  fileName;
                                    }
                                    else{
                                        source = '/app/assets/'+ fileName;
                                    }
                                    return '<link rel="stylesheet" href="' + source + '">';
                                }
                            }))
                            .pipe(gulp.dest('./app/view'));
});
/****************************** js tasks end****************************/

gulp.task('discover',function(){
    var runSequence = require('run-sequence');
    runSequence('layoutJs','layoutCss');
});
