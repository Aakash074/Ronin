var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var changed = require('gulp-changed');
var htmlmin = require('gulp-htmlmin');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var ngrok = require('ngrok');


function onError(error) {
	console.log(error);
	this.emit('end');
}

gulp.task('clean', function() {
	return del([
		'dist/**/*'
	]);
});

gulp.task('sass', function() {
	return gulp.src('src/sass/main.scss')
		.pipe(changed('dist/css/'))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on('error', onError)
		.pipe(autoprefixer())
		.pipe(cleanCSS())
		.pipe(sourcemaps.write('./maps'))
		.pipe(connect.reload())
		.pipe(gulp.dest('dist/css/'))
});

gulp.task('sass-gallery', function() {
	return gulp.src('src/sass-gallery/main-gallery.scss')
		.pipe(changed('dist/css/'))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on('error', onError)
		.pipe(autoprefixer())
		.pipe(cleanCSS())
		.pipe(sourcemaps.write('./maps'))
		.pipe(connect.reload())
		.pipe(gulp.dest('dist/css/'))
});

gulp.task('js', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(changed('dist/js/'))
		.pipe(uglify())
		.on('error', onError)
		.pipe(connect.reload())
		.pipe(gulp.dest('dist/js/'))
})

gulp.task('css', function() {
	return gulp.src('src/css/**/*')
		.pipe(gulp.dest('dist/css/'))
})

gulp.task('html', function() {
	return gulp.src('src/*.html')
		.pipe(changed('dist/'))
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.on('error', onError)
		.pipe(connect.reload())
		.pipe(gulp.dest('dist/'));
});

gulp.task('img', function() {
	return gulp.src(['src/img/**/*.+(png|jpg|svg)', '!src/img/**/originals/**'])
		.pipe(changed('dist/img/'))
		.pipe(imagemin({
			verbose: true
		}))
		.pipe(gulp.dest('dist/img/'))
})

gulp.task('extras', function() {
	return gulp.src(['src/favicon.ico', 'CNAME'])
		.pipe(gulp.dest('dist/'))
})

gulp.task('fonts', function() {
	return gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('dist/fonts/'))
})

gulp.task('connect', function() {
	connect.server({
		livereload: true,
		root: 'dist'
	});
	/*ngrok.connect(8080, function(err, url) {
		console.log(err, url);
	});*/
});

gulp.task('watch', function() {
	gulp.watch('src/sass/**/*.scss', ['sass']);
	gulp.watch('src/sass-gallery/**/*.scss', ['sass-gallery']);
	gulp.watch('src/img/**', ['img']);
	gulp.watch('src/js/**', ['js']);
	gulp.watch('src/*.html', ['html']);
});

gulp.task('webserver', ['watch', 'connect'], function() {
	console.log('Starting dev server...');
});

gulp.task('default', ['sass', 'sass-gallery', 'html', 'img', 'js', 'css', 'extras', 'fonts'], function() {
	console.log('Building dist folder...');
});