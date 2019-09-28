import gulp from 'gulp'
import sourcemaps from 'gulp-sourcemaps'
import cleanCSS from 'gulp-clean-css'
import del from 'del'
import browserSync from 'browser-sync'
import rollup from 'gulp-better-rollup'
import babel from 'rollup-plugin-babel'
import eslint from 'gulp-eslint'
import nodeResolve from 'rollup-plugin-node-resolve';
import sass from 'gulp-sass'
import filter from 'gulp-filter'
import imagemin from 'gulp-imagemin'
import imageminGuetzli from 'imagemin-guetzli'

import postcss from 'gulp-postcss'
import postImport from 'postcss-import'
import postcm from 'postcss-custom-media'
import postCalc from 'postcss-calc'
import postDublicates from 'postcss-discard-duplicates'
import postCSSNano from 'cssnano'
import autoprefixer from 'autoprefixer'
import lost from 'lost'
import csso from 'gulp-csso'

import plumber from 'gulp-plumber'
import gulpPug from 'gulp-pug'
import typograf from 'gulp-typograf'
import injectSvg from 'gulp-inject-svg'
import svgStore from 'gulp-svgstore'
import svgInjectViewbox from '@dirkgntly/gulp-inject-viewbox'

const paths = {
  pug: {
	root: 'src/pug/pages/*.pug',
	src: 'src/pug/**/*.pug',
    dest: 'dist/'
  },
  styles: {
    root: 'src/styles/*.scss',
    src: 'src/styles/**/*.scss',
    dest: 'dist/css',
    maps: 'maps'
  },
  scripts: {
	root: 'src/scripts/*.js',
    src: 'src/scripts/**/*.js',
    dest: 'dist/js/'
  },
  files: {
	src: 'src/files/**/*.*',
	images: ['src/files/**/*.jpg', 'src/files/**/*.png', 'src/files/**/*.svg'],
    dest: 'dist/'
  },
  assets: {
	src: ['src/assets/**/*.*'],
	images:  ['src/files/**/*.jpg', 'src/files/**/*.png', 'src/files/**/*.svg'],
    dest: 'dist/'
  },
  svg: {
	src: 'src/svg/components/**/*.svg', 
	components: 'src/svg/components/**/*.svg', 
	sprites: 'src/svg/sprites/**/*.svg', 
  },
  fonts: {
    src: 'src/fonts/**/*.*',
    dest: 'dist/fonts/'
  },
  data: {
    src: 'src/data/**/*.json',
    dest: 'dist/data/'
  }
}

const clean = () => del(['dist'])

const server = browserSync.create()

const imageOptimize = () => {
	return imagemin([
		// imageminGuetzli({quality: 95}),
		imagemin.gifsicle({interlaced: true}),
		imagemin.jpegtran({progressive: true}),
		imagemin.optipng({optimizationLevel: 5}),
		imagemin.svgo({
			plugins: [
				{
					removeViewBox: false
				},
				{
					removeUnknownsAndDefaults: true
				},
				{
					removeDoctype: false
				}, {
					removeComments: false
				}, {
					cleanupNumericValues: {
						floatPrecision: 2
					}
				}, {
					convertColors: {
						names2hex: false,
						rgb2hex: false
					}
				}, {
					mergePaths: false
				}
			]
		})
	]);
}

export function reload (done) {
  server.reload()
  done()
}

export function serve (done) {
  server.init({
    server: {
      baseDir: './dist',
      notify: true,
      open: false,
      ghostMode: true
    }
  })
  done()
}

export function data() {
	return gulp.src(paths.data.src)
		.pipe(gulp.dest(paths.data.dest))
}

export function styles () {
  const plugins = [
    postcm(),
    postImport(),
    lost(),
	postDublicates(),
	postCalc({
		mediaQueries: true
	}),
    postCSSNano({
      discardComments: {
        removeAll: true
      }
    }),
    autoprefixer({
      browsers: ['last 10 versions'],
      cascade: false
    })
  ]
  return gulp.src(paths.styles.root)
    .pipe(sass().on('error', sass.logError))
    .pipe(
      postcss(plugins)
	)
	.pipe(sourcemaps.init())
    .pipe(csso())
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(sourcemaps.write(paths.styles.maps))
    .pipe(gulp.dest(paths.styles.dest))
};

export function pug () {
  return gulp.src(paths.pug.root)
    .pipe(plumber())
    .pipe(gulpPug({
      pretty: true
    }))
    .pipe(typograf({
      locale: ['ru', 'en-US'],
	  disableRule: ['ru/other/phone-number'],
	  safeTags: [
        ['<sup', '</sup>']
		],
    }))
    .pipe(injectSvg({
      base: '/src'
	}))
	.pipe(svgInjectViewbox())
    .pipe(gulp.dest(paths.pug.dest))
}

export function files () {
	const imagesFilter = filter(paths.files.images, {restore: true});
	
	return gulp.src(paths.files.src, {base: 'src'})
		.pipe(imagesFilter)
		.pipe(imageOptimize())
		.pipe(imagesFilter.restore)
		.pipe(gulp.dest(paths.files.dest));
}

export function assets () {
	const imagesFilter = filter(paths.assets.images, {restore: true});
	
	return gulp.src(paths.assets.src, {base: 'src'})
		.pipe(imagesFilter)
		.pipe(imageOptimize())
		.pipe(imagesFilter.restore)
		.pipe(gulp.dest(paths.assets.dest));
}

export function components () {
	return gulp.src(paths.svg.components, {base: './'})
		.pipe(imageOptimize())
		.pipe(gulp.dest('./'))
}

export function sprites () {
	const config = {
		mode: {
			symbol: true
		},
		svg: {
			namespaceClassnames: false, 
		},
	};
	return gulp.src(paths.svg.sprites)
		.pipe(imageOptimize())
		.pipe(svgStore({ inlineSvg: true }))
		.pipe(gulp.dest('src/svg/components/'))
}

export function scripts () {
  return gulp.src(paths.scripts.root)
    // .pipe(eslint({
    //   configFile: './.eslintrc.yml',
	//   fix: true
    // }))
    // .pipe(eslint.format())
    .pipe(rollup({
		treeshake: false,
		context: "window",
     	plugins: [
			nodeResolve({
				jsnext: true
			}),
			babel()
      	]
    }, {
	  format: 'es',
    }))
    .pipe(gulp.dest(paths.scripts.dest))
}

function watchFiles () {
	gulp.watch(paths.pug.src, pug)
	gulp.watch(paths.styles.src, styles)
	gulp.watch(paths.scripts.src, scripts)
	gulp.watch(paths.files.src, files)
	gulp.watch(paths.assets.src, assets)
	gulp.watch(paths.svg.sprites, sprites)
	gulp.watch(paths.data.src, data)
}

const dev = gulp.series(serve, styles, pug, scripts, watchFiles, files, sprites, assets, data, components)
const watch = gulp.parallel(watchFiles, serve)

exports.watch = watch
exports.default = dev
