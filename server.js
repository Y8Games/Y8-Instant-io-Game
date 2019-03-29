/*
* Server holds the boring stuff to get the server going
*/

const express = require('express');
const helmet = require('helmet');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
let fs = require('fs');
let path = require('path');
var middleware = null;
let pathToModule = path.join(__dirname, 'node_modules', 'webpack-dev-middleware');
if (fs.existsSync(pathToModule)) {
  middleware = require('webpack-dev-middleware') //webpack hot reloading middleware
}

var bodyParser = require('body-parser');
var colors = require('colors');
require('./world.js')(io)

const compiler = webpack({
  output: {
    filename: '[hash].js',
  },
  resolve: {
    modules: ['src', 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: 'file-loader',
      },
      {
        test: [ /\.vert$/, /\.frag$/ ],
        use: 'raw-loader',
      },
    ],
  },
  mode: process.argv[2],
  stats: 'minimal',
  devtool: 'source-map',
  performance: {
    hints: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: true,
      WEBGL_RENDERER: true,
    }),
    new HtmlWebpackPlugin({
      favicon: 'src/img/favicon.png',
      template: 'src/index.html',
    }),
  ]
});

app.use(helmet({
  frameguard: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/src', express.static('src'));

if (process.argv[2] == 'development') {
  app.use(middleware(compiler, {
    // webpack-dev-middleware options
  }));
}


var port = process.env.PORT || 8080;
server.listen(port, () => console.log(('listening on port: ' + port).green))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});

app.use('/', express.static('dist'));
