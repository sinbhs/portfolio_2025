const gulp = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const inquirer = require('inquirer');


// Start : portfolio
gulp.task('scss:portfolio', function () {
	console.log('SCSS 컴파일...');

	return gulp.src('./assets/scss/**/*.scss') // Gets all files ending with .scss in ltr/scss and children dirs
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'expanded', indentType: 'tab', indentWidth: 1,}))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest('./assets/css'))
		.pipe(browserSync.reload({
			stream: true
		}));

});


gulp.task('scss_map:portfolio', function () {
	console.log('SCSS min 컴파일...');
	return gulp.src('./assets/scss/**/*.scss') // Gets all files ending with .scss in ltr/scss and children dirs
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(rename({extname: '.min.css'}))
		.pipe(gulp.dest('./assets/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('watch:portfolio', gulp.series(function () {
	var initTask = gulp.series('scss:portfolio');
	initTask();
	console.log('Executing Watch Function');

	browserSync.init({
		server: {
			baseDir: './'
		},
	});

	var html = gulp.watch('./html/**/*.html');
	html.on('change', function (path, stats) {
		browserSync.notify("HTML file Changed!");
		browserSync.reload("*.html");
	});

	var js = gulp.watch('./assets/js/*.js');
	js.on('change', function (path, stats) {
		browserSync.notify("js file Changed!");
		browserSync.reload("*.js");
	});

	var scss = gulp.watch('./assets/scss/**/*.scss', gulp.series('scss:portfolio'));
	scss.on('change', function (path, stats) {
		browserSync.notify("SCSS Changed!");
		browserSync.reload("*.scss");
	});
}));
// End : portfolio

gulp.task('watch', function () {
	let watchList = [
		'watch:portfolio',
	];

	return inquirer.prompt([
		{
			type: 'list',
			name: 'selected',
			message: 'Watch할 타겟을 선택해주세요.',
			choices: watchList,
		},
	]).then(function (res) {
		gulp.series(res.selected)();
	});
});
