const { src, dest, series, watch } = require('gulp'); // Определяем константы Gulp
// Используйте gulp и гибкость JavaScript, чтобы автоматизировать медленные, повторяющиеся рабочие процессы и объединить их в эффективные конвейеры сборки.
const sass = require('gulp-sass');// Sass синхронная компиляция
const sourcemaps = require('gulp-sourcemaps');//создания исходных карт для компиляции Sass в CSS.
// gulp-sassможет использоваться в тандеме с gulp-sourcemaps для создания исходных карт для компиляции Sass в CSS. Вам нужно будет инициализировать gulp-sourcemaps перед запуском gulp-sassи написать исходные карты после.
const notify = require("gulp-notify");
/*Отправляйте сообщения в Центр уведомлений Windows с использованием   */
const rename = require('gulp-rename');
// gulp-rename предоставляет простые методы переименования файлов.
const autoprefixer = require('gulp-autoprefixer');
// Autoprefixer сканирует ваши CSS файлы, и автоматически проставляет префиксы к css свойствам.
const cleanCSS = require('gulp-clean-css');
// Подключаем модуль gulp-clean-css
const browserSync = require('browser-sync').create();
// Подключаем Browsersync
const fileinclude = require('gulp-file-include');
const svgSprite = require('gulp-svg-sprite');
const uglify = require('gulp-uglify-es').default;
//Сжимаем JavaScript
// Подключаем gulp-uglify-es
const concat = require('gulp-concat');
// Конкатенируем в один файл
const rev = require('gulp-rev');


const CSS = () => {
	return src([// путь к файлам-исходникам
		'node_modules/animate.css/animate.css',
		'node_modules/normalize.css/normalize.css',

	])
		.pipe(concat('_libs.scss')) // Конкатенируем в один файл
		.pipe(dest('src/scss/vendor')) // Выгружаем в папку
}

const styles = () => {
	return src('./src/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', notify.onError()))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(autoprefixer({
			cascade: false,
		}))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(sourcemaps.write('.'))// прогоняем их через плагин
		.pipe(dest('./app/css/'))// путь к папке, куда помещаем конечные файлы
		.pipe(browserSync.stream());// Триггерим Browsersync для обновления страницы
}

const js = () => {
	return src([
		'node_modules/jquery/dist/jquery.js',

	])
		.pipe(concat('_libs.min.js'))// прогоняем их через плагин ,Конкатенируем в файл _libs.min.js
		.pipe(uglify())// прогоняем их через плагин
		.pipe(dest('src/js/vendor'));// Выгружаем готовый файл в папку назначения

}

const script = () => {
	return src('./src/js/**/*.js')
		.pipe(concat('script.js'))
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(rename({
			suffix: '.min'
		}))
			.pipe(dest('./app/js/'))// путь к папке, куда помещаем конечные файлы
			.pipe(browserSync.stream());// Триггерим Browsersync для обновления страницы
}

const svgSprites = () => {
	return src('./src/images/svg/**.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../svg/sprite.svg"
				}
			}
		}))
		.pipe(dest('./app/images'));// путь к папке, куда помещаем конечные файлы
}

const imgToApp = () => {
	return src(['./src/images/**/*.jpg', './src/images/**/*.jpeg', './src/images/**/*.png', './src/images/*svg'])
		.pipe(dest('./app/images'));
}




const htmlInclude = () => {
	return src(['./src/*.html'])
		.pipe(fileinclude({
			prefix: '@',
			basepath: '@file'
		}))
		.pipe(dest('./app'))
		.pipe(browserSync.stream());
}
const clean = () => {
	return del(['app/*'])
}

const resources = () => {
	return src('./src/resources/**')
		.pipe(dest('./app'))
}

// функция отслеживания изменений в файлах
const watchFiles = () => {
	browserSync.init({
		server: {
			baseDir: "./app"// Указываем папку сервера
		},
		notify: false// Отключаем уведомления
	});
	watch('./src/scss/vendor/*.scss', CSS);
	watch('./src/scss/**/*.scss', styles);
	watch('./src/js/libs.min.js', js);
	watch('./src/js/**/*.js', script);
	watch('./src/html/*.html', htmlInclude);
	watch('./src/*.html', htmlInclude);
	watch('./src/img/**.jpg', imgToApp);
	watch('./src/img/**.jpeg', imgToApp);
	watch('./src/img/**.png', imgToApp);
	watch('./src/img/**.svg', svgSprites);
	watch('./src/resources/**', resources);
}
// Использование константы watch, которую мы определили в начале документа, в качестве Gulp-функции, позволит нам выбрать нужные файлы для наблюдения



exports.CSS = CSS;
exports.fileinclude = htmlInclude;
exports.styles = styles;
exports.watchFiles = watchFiles;
exports.js = js;
exports.script = script;
exports.resources = resources;
exports.watchFiles = watchFiles;
// Экспортируем функции


exports.default = series(CSS, resources, js, script, imgToApp, svgSprites, styles, htmlInclude, script, watchFiles);
// Экспортируем дефолтный таск с нужным набором функций
