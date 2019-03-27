const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { DuplicatesPlugin } = require("inspectpack/plugin")
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

// open Markdown links in new tab
// https://github.com/markedjs/marked/issues/655
const marked = require('marked')
const mdRenderer = new marked.Renderer()
const mdRendererLink = mdRenderer.link
mdRenderer.link = (href, title, text) => {
    const html = mdRendererLink.call(mdRenderer, href, title, text)
    return html.replace(/^<a /, '<a target="_blank" rel="noopener noreferrer" ')
}


module.exports = (env, argv) => {
  const isProd = argv.mode === 'production'

  return {
    entry: {
      main: './src/Root.jsx',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: path.resolve(__dirname, 'src'),
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.md$/,
          use: [
            'html-loader',
            {
              loader: 'markdown-loader',
              options: { renderer: mdRenderer }
            }
          ],
        },
        {
          test: /\.(bmp|png|jpg|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: '[name].[contenthash:8].[ext]',
              }
            }
          ]
  
        }
      ]
    },
    plugins: [
      new webpack.HashedModuleIdsPlugin(), // consistent file hashes based on their content
      new LodashModuleReplacementPlugin,
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      new CopyPlugin([{ from: 'public', to: '.' }]),
      new DuplicatesPlugin(),
    ],
    resolve: {
      extensions: ['*', '.js', '.jsx'],
      alias: {
        '~': path.resolve(__dirname, 'src')
      }
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            name: 'npm',
            chunks: 'all',
          },
        },
      },
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      chunkFilename: '[name].[contenthash:8].js',
      publicPath: '/',
    },
    devtool: 'inline-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      port: 3000,
      // open: true,
    },
  }
}
