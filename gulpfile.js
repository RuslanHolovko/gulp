var gulp         = require('gulp'),
		sass         = require('gulp-sass')
		uglify       = require("gulp-uglify"),
		autoprefixer = require("gulp-autoprefixer"),
		cleancss     = require("gulp-clean-css"),
		browserSync  = require("browser-sync"),
		concat       = require("gulp-concat"),
		cache        = require('gulp-cache'),
		del          = require("del"),
		imagemin     = require("gulp-imagemin"),
		pngquant     = require("imagemin-pngquant"),
		rename       = require("gulp-rename")


gulp.task("sass", function(){
	return gulp.src('app/scss/main.scss')
		.pipe(sass())
		.pipe(autoprefixer(["last 15 version", "> 1%", "ie 8", "ie 7"]))
		.pipe(cleancss())
		.pipe(rename({suffix: ".min"}))
		.pipe(gulp.dest("app/css"))
		.pipe(browserSync.stream());
});

gulp.task("scripts", function(){
	return gulp.src([
		"app/libs/jquery/dist/jquery.min.js",
		"app/libs/fotorama/fotorama.js",
		"app/libs/slick-carousel/slick/slick.min.js",
		])

	.pipe(concat("libs.min.js"))
	.pipe(uglify())
	.pipe(gulp.dest("app/js"));	
})

gulp.task("clean", function(){
	return del.sync("dist");
});

gulp.task("img", function(){
	return gulp.src("app/img/**/*")
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 5,
			svgoPlugins: [{removeViewBox: true}]
		})))
		.pipe(gulp.dest("dist/img"));
});

gulp.task('serve', ["sass", "scripts"], function() {

	browserSync.init({
		server: "app"
	});

	gulp.watch("app/scss/*.scss", ['sass']);
	gulp.watch("app/*.html").on('change', browserSync.reload);
	gulp.watch("app/js/*.js").on('change', browserSync.reload);
});


gulp.task("build", ["clean", "img", "sass", "scripts"], function(){
	var buildCss = gulp.src([
			"app/css/main.min.css"
		])
	.pipe(gulp.dest("dist/css"));

	var buildFonts = gulp.src("app/fonts/**/*")
		.pipe(gulp.dest("dist/fonts"));

	var buildJs = gulp.src("app/js/**/*")
	.pipe(gulp.dest("dist/js"));

	var buildHtml = gulp.src("app/*.html")
		.pipe(gulp.dest("dist"));	
});

gulp.task('default', ['serve']);



