const express = require('express'),
    app = express(),
    webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    //webpackHotMiddleware = require('webpack-hot-middleware'),
    webpackConfig = require('./../webpack.config'),
    path = require('path');

app.use('/css', express.static('css'))
app.use('/js', express.static('js'))
app.use('/', express.static(__dirname))

let compiler;

compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true }
}));

//app.use(webpackHotMiddleware(compiler));

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});


app.listen(8100, function () {
    console.log('Server is running on port 8100');
});