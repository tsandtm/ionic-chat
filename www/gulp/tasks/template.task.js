module.exports = function (gulp, config, $, args) {
    var merge = require('merge-stream');

    gulp.task('copy:html', ['clean:html'], function () {
        config.fn.log('copy html templates to html files');
        // 首页
        var htmlStream = gulp
            .src(config.html.source)
            .pipe($.rename("index.html"))
            .pipe(gulp.dest(config.root));
        // 模块内HTML
        var module_Stream = gulp
            .src(config.html.src_module_source)
            .pipe(gulp.dest(config.dist.dev + 'static'));
        return merge(htmlStream, module_Stream);;
    });

    // Inject all js/css files into the index.html file
    gulp.task('inject:js:css', ['copy:js'], function () {
        config.fn.log('Wire up css into the html, after files are ready');

        return gulp
            .src(config.html.target)
            .pipe(config.fn.inject(config.css.target))
            .pipe(config.fn.inject(config.js.app.target, '', config.js.order))
            .pipe(gulp.dest(config.root));
    });

    // Inject all the bower dependencies
    gulp.task('inject:bower', [], function () { // 'copy:vendor'
        config.fn.log('Wiring the bower dependencies into the html');

        var wiredep = require('wiredep').stream;
        var options = config.wiredepOption;

        // Also include mock dependencies with --mock flag
        var mockDeps = [];
        if (args.mock) {
            mockDeps = config.bower.mockDeps;
        }

        return gulp
            .src(config.html.target)
            .pipe(wiredep(options))
            .pipe(config.fn.inject(mockDeps, 'mockDeps'))
            .pipe(gulp.dest(config.root));
    });

    // Compile all template files to $templateCache
    gulp.task('templatecache', ['clean:temp'], function () {
        config.fn.log('Creating an AngularJS $templateCache');

        return gulp
            .src(config.templateCache.sourceHtml)
            .pipe($.if(args.verbose, $.bytediff.start()))
            .pipe($.minifyHtml({ empty: true }))
            .pipe($.if(args.verbose, $.bytediff.stop(bytediffFormatter)))
            .pipe($.angularTemplatecache(
                config.templateCache.target,
                config.templateCache.options
            ))
            .pipe(gulp.dest(config.dist.temp));
    });

    ///////////

    function bytediffFormatter(data) {
        var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
        return data.fileName + ' went from ' +
            (data.startSize / 1000).toFixed(2) + ' kB to ' +
            (data.endSize / 1000).toFixed(2) + ' kB and is ' +
            formatPercent(1 - data.percent, 2) + '%' + difference;
    }

    function formatPercent (num, precision) {
        return (num * 100).toFixed(precision);
    }
};
