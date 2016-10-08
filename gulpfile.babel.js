import path from 'path'
import gulp from 'gulp'
import uglify from 'gulp-uglify'
import webpack from 'webpack'
import webpackDevServer from 'webpack-dev-server'
import nodemon from 'gulp-nodemon'

import webpackConfig from './webpack.config'

gulp.task('watch-server', () => {
  nodemon({
    ignore: path.resolve(__dirname, 'app'),
    script: path.resolve(__dirname, 'server', 'index.js')
  })
})

gulp.task('watch-client', () => {
  const compiler = webpack(webpackConfig)
  new webpackDevServer(compiler, webpackConfig.devServer)
    .listen(webpackConfig.devServer.port)
})

gulp.task('build-client', (done) => {
  webpack(webpackConfig).run((err, stats) => {
    if (err) console.error(err)
    else console.log(stats.toString())
    done()
  })
})

gulp.task('compress', ['build-client'], () => {
  return gulp.src('public/*.js')
    .pipe(uglify({
      compress: {warnings: false}
    }))
    .pipe(gulp.dest('public', {
      overwrite: true
    }))
})

gulp.task('watch', ['watch-server', 'watch-client'])
gulp.task('build', ['build-client', 'compress'])
