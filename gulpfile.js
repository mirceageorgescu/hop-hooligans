var gulp         = require('gulp');
var $            = require('gulp-load-plugins')();
var browserSync  = require('browser-sync').create();
var runSequence  = require('run-sequence');
var objectMerge  = require('object-merge');
var del          = require('del');
var fs           = require('fs');
var yaml         = require('js-yaml');
var reload       = browserSync.reload;
var argv         = require('yargs').argv;
var lazypipe     = require('lazypipe');
var browserify   = require('browserify');
var babelify     = require('babelify');
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var download     = require("gulp-download");


function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

var config = {
  defaultPort: 3000,
  supportedBrowsers: [
    'ie >= 10',
    'last 1 Firefox versions',
    'last 1 Chrome versions',
    'Safari >= 7',
    'iOS > 7',
    'ChromeAndroid >= 4.2'
  ],
  version: require('./package.json').version,
  minify: argv.minify || false,
  environment: argv.environment || 'local',
  screenshotSizes: ['320x480', '414x736', '720x1024', '1024x748', '1440x900', '1920x1200']
};

var readYamlFile = function(file){
  var dataFile = 'src/data' + file;
  return fs.existsSync(dataFile) ? yaml.safeLoad(fs.readFileSync(dataFile, 'utf8')) : {};
};

var buildFileList = function(filename){
  return {
    url: filename.replace('.pug', '.html'),
    name: filename
      .replace('.pug', '')
      .replace('styleguide-', '')
      .replace('[archived]', '')
      .replace(/-/g, ' ')
      .replace(/^[a-z]/, function(m){
        return m.toUpperCase();
      })
  };
};

// Clean site directory
gulp.task('clean', del.bind(null, ['dist'], {dot: true}));

var cssFinish = lazypipe()
  .pipe(gulp.dest, 'dist/styles')
  .pipe(function () {
    return $.if(config.minify, $.minifyCss());
  })
  .pipe(function () {
    return $.if(config.minify, $.rename({suffix: '.min'}));
  })
  .pipe(function () {
    return $.if(config.minify, gulp.dest('dist/styles'));
  });

gulp.task('sass', function () {
  return gulp.src(['src/styles/main.scss'])
    .pipe($.sass())
    .pipe($.plumber({errorHandler: $.notify.onError('Error: <%= error.message %>')}))
    .pipe($.autoprefixer({browsers: config.supportedBrowsers}))
    .pipe($.concat('styles-' + config.version + '.css'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(browserSync.stream())
    .pipe(cssFinish());
});

var scriptsFinish = lazypipe()
  .pipe(gulp.dest, 'dist/scripts')
  .pipe(function () {
    return $.if(config.minify, buffer());
  })
  .pipe(function () {
    return $.if(config.minify, $.uglify());
  })
  .pipe(function () {
    return $.if(config.minify, $.rename({suffix: '.min'}));
  })
  .pipe(function () {
    return $.if(config.minify, gulp.dest('dist/scripts'));
  });

// Lint and build scripts
gulp.task('scripts', function() {
  return browserify('src/scripts/index.js')
    .transform(babelify.configure({
        presets: ['es2015']
    })).bundle()
    .pipe(source('app-' + config.version + '.js'))
    .pipe($.plumber({errorHandler: $.notify.onError('Error: <%= error.message %>')}))
    .pipe($.if(config.isWatching, $.jshint()))
    .pipe($.if(config.isWatching, $.jshint.reporter('jshint-stylish')))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')))
    .pipe(scriptsFinish());
});

gulp.task('templates', function() {
  var data = readYamlFile('/data.yaml');

  var f = $.filter(function (file) {
    return file.relative.indexOf('_') === -1;
  });

  var d = $.data(function (file) {
    // var pages = fs.readdirSync('src/templates/pages').map(buildFileList);

    console.log('building template ' + file.relative);

    config.page = file.relative.replace('.pug', '');
    return objectMerge(config, data);
  });

  config.templatesCompilationNo++;

  return gulp.src(['src/templates/pages/*.pug', 'src/templates/mixins/*.pug'])
    .pipe($.plumber({errorHandler: $.notify.onError('Error: <%= error.message %>')}))
    .pipe($.if(config.isWatching && config.templatesCompilationNo > 0, $.pugInheritance({basedir: 'src/templates'})))
    .pipe(f)
    .pipe(d)
    .pipe($.pug({ pretty: true}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('products', function () {
  var data = readYamlFile('/data.yaml');

  console.log('products');

  data.products.list.forEach(function(beer) {
    if(beer.isPlaceholder) {
      return;
    }

    config.page = 'product';
    data = objectMerge(config, data);

    data.currentBeer = beer;

    return gulp.src(['src/templates/pages/_product.pug'])
      .pipe($.plumber({errorHandler: $.notify.onError('Error: <%= error.message %>')}))
      .pipe($.if(config.isWatching && config.templatesCompilationNo > 0, $.pugInheritance({basedir: 'src/templates'})))
      .pipe($.pug({
        pretty: true,
        data: data
      }))
      .pipe($.rename(function (path) {
        console.log('generating ' + beer.url);
        path.basename = beer.url;
      }))
      .pipe(gulp.dest('./dist/beers'));
  });
});

// Resize images
gulp.task('resize', function () {
  var data = readYamlFile('/data.yaml');
  var src = gulp.src(['src/images/resize/**/*.{jpg,png}']);

  data.sizes.forEach(function(size){
    src
      .pipe($.plumber({errorHandler: $.notify.onError('Error: <%= error.message %>')}))
      .pipe($.imageResize({
        width: size,
        upscale: false,
        quality: 0.6,
      }))
      .pipe($.rename(function (path) {
        console.log('resizing and optimizing ' + path.basename + '-' + size + path.extname);
        path.basename += '-' + size;
      }))
      .pipe(gulp.dest('dist/images'));
  });
});

// Copy images to dist
gulp.task('images', function () {
  return gulp.src(['src/images/**/**', '!src/images/resize/**/**'])
    .pipe($.plumber({errorHandler: $.notify.onError('Error: <%= error.message %>')}))
    .pipe($.if(config.isWatching, $.cached('images')))
    .pipe(gulp.dest('dist/images'));
});

// Copy video files
gulp.task('video', function () {
  return gulp.src(['src/video/**/**'])
    .pipe($.plumber({errorHandler: $.notify.onError('Error: <%= error.message %>')}))
    .pipe(gulp.dest('dist/video'));
});

gulp.task('setWatch', function() {
  config.isWatching = true;
});

// Create the svg sprite and copy it to dist
gulp.task('svg', function() {
  return gulp.src(['src/svg/**/*.svg'])
    .pipe($.plumber({errorHandler: $.notify.onError('Error: <%= error.message %>')}))
    .pipe($.if(config.minify, $.svgmin()))
    .pipe($.svgSprite({
      mode: {
        symbol: {
          sprite: 'sprite.symbol.svg',
          prefix: 'icon-%s',
          dimensions: '-size',
          common: 'icon',
          example: false
        }
      }
    }, {cwd: '/'}))
    .pipe(gulp.dest('dist/svg'));
});

// Build JST templates
gulp.task('jst', function() {
  return gulp.src(['src/jst/**/*.html'])
    .pipe($.templateCompile())
    .pipe($.concat('jst-' + config.version + '.js'))
    .pipe(gulp.dest('dist/' + argv.site + '/scripts'))
    .pipe(scriptsFinish());
});

// Development task
gulp.task('dev', ['default', 'setWatch'], function() {
  browserSync.init({
    port: argv.port || config.defaultPort, //default: 3000
    server: { baseDir: './dist/'},
    ui: {
      port: argv.port + 5000 || config.defaultPort + 5000, //default: 8000
      weinre: { port: argv.port + 6092 || config.defaultPort + 6092 } //default: 9092
    },
    ghostMode: false,
    notify: false,
    logLevel: 'silent' //other oprions: info, debug
  });

  gulp.watch(['src/styles/**/*.scss'], ['sass']);
  gulp.watch(['src/images/**/*', '!src/images/resize/**/**'], ['images', reload]);
  gulp.watch(['src/images/resize/**/*'], ['resize', reload]);
  gulp.watch(['src/fonts/**/*'], ['fonts', reload]);
  gulp.watch(['src/jst/**/*'], ['jst', reload]);
  gulp.watch(['src/images/**/*'], ['images', reload]);
  gulp.watch(['src/svg/*.svg'], ['svg', reload]);
  gulp.watch(['src/scripts/**/*.js'], ['scripts', reload]);
  gulp.watch(['src/templates/layouts/default.pug', 'src/templates/pages/*.pug', 'src/templates/mixins/*.pug', 'src/templates/styleguide/*.pug'], ['templates', 'products', reload]);
  gulp.watch(['src/data/**/*.yaml'], ['templates', 'products', reload]);
  gulp.watch(['src/video/**/**'], ['video', reload]);
});

// Copy web fonts to dist
gulp.task('fonts', function () {
  return gulp.src(['src/fonts/**/*'])
    .pipe($.plumber({errorHandler: $.notify.onError('Error: <%= error.message %>')}))
    .pipe(gulp.dest('dist/fonts'));
});

// Download API jsons to use for fallback
gulp.task('cache-api', function () {

  //download latest checkins
  download('https://api.untappd.com/v4/brewery/checkins/268580?client_id=918F01B53FDAC49A915124127738378DE45E9682&client_secret=3A59FA4FDB2B0776A23B7ED7196B1A6920FDB923&limit=50')
    .pipe($.rename('268580.json'))
    .pipe(gulp.dest("dist/api/"));

  //download beer reviews
  var data = readYamlFile('/data.yaml');
  data.products.list.forEach(function(beer) {
    //we need a beer id
    if(!beer.untappdId) { return; }

    download('https://api.untappd.com/v4/beer/info/' + beer.untappdId + '/media/recent?client_id=918F01B53FDAC49A915124127738378DE45E9682&client_secret=3A59FA4FDB2B0776A23B7ED7196B1A6920FDB923&limit=50')
      .pipe($.rename(beer.untappdId + '.json'))
      .pipe(gulp.dest("dist/api/"));
  });
});

// Build production files, the default task
gulp.task('default', ['clean'], function (cb) {

  runSequence([
    'sass',
    'templates',
    'products',
    'cache-api',
    'jst',
    'scripts',
    'images',
    'resize',
    'svg',
    'video',
    'fonts'
  ], cb);
});
