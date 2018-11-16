const webpack = require('webpack')
const path = require('path')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const isProduction = process.argv.indexOf('-p') >= 0

module.exports = {
  devtool: isProduction ? 'hidden-source-map' : 'source-map',
  // stats: 'verbose',
  devServer: {
    // stats: 'verbose',
    host: '0.0.0.0',
    port: 8080,
    public: 'localhost:8080',
    open: true,
    historyApiFallback: {
      index: '/',
    },
    publicPath: '/',
    /*
        before(app) {
          require('./dev_api/')(app)
        }
    */
  },
  context: path.join(__dirname, './src'),
  entry: './main.js',
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.[hash].js',
    publicPath: './'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      images: path.resolve(__dirname, 'src/assets/images/'),
      pixi: path.resolve(__dirname, 'src/components/pixi/'),
      constants: path.resolve(__dirname, 'src/constants/'),
    }
  },
  module: {
    rules: [{
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        oneOf: [{
            resourceQuery: /global/, // foo.css?global
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [{
                  loader: 'css-loader'
                },
                {
                  loader: 'sass-loader'
                }
              ]
            })
          },
          {
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [{
                  loader: 'css-loader',
                  options: {
                    modules: true,
                    sourceMap: true,
                    importLoaders: 2,
                    localIdentName: '[local]__[hash:base64:5]'
                  }
                },
                {
                  loader: 'sass-loader'
                }
              ]
            })
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }]
      },
      {
        test: /.(png|jpe?g)$/,
        use: [{
          loader: 'url-loader?limit=500',
        }]
      }
    ]
  },
  plugins: [
    new WebpackCleanupPlugin({
      exclude: ['images/**/*'],
    }),
    new ExtractTextPlugin('bundle.[hash].css'),
    new HtmlWebpackPlugin({
      template: './assets/index.html'
    }),
/*    new CopyWebpackPlugin([{
      from: './assets/images',
      to: 'images'
    }]),*/
    new webpack.NormalModuleReplacementPlugin(/(.*)_BUILD_TARGET_(\.*)/, function (resource) {
      resource.request = resource.request.replace(/_BUILD_TARGET_/, isProduction ? 'production' : 'development');
    })
  ]
}

if (isProduction) {
  module.exports.plugins.push(
    new UglifyJsPlugin({
      sourceMap: true
    })
  )
}
