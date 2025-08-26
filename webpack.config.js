const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

// Определяем переменные окружения
const isProduction = process.env.NODE_ENV === 'production';
const PUBLIC_URL =
  process.env.PUBLIC_URL || (isProduction ? 'https://counterplus.ru' : '/');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: PUBLIC_URL,
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1,
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              implementation: require('sass'),
              sassOptions: {
                outputStyle: 'expanded',
                quietDeps: true,
                silenceDeprecations: ['legacy-js-api'],
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      templateParameters: {
        PUBLIC_URL: PUBLIC_URL,
        DOMAIN: 'counterplus.ru',
        APP_NAME: 'Счетчик+',
        APP_DESCRIPTION: 'Полезные калькуляторы для решения повседневных задач',
      },
    }),
    new webpack.DefinePlugin({
      'process.env.PUBLIC_URL': JSON.stringify(PUBLIC_URL),
      'process.env.DOMAIN': JSON.stringify('counterplus.ru'),
      'process.env.APP_NAME': JSON.stringify('Счетчик+'),
      'process.env.APP_DESCRIPTION': JSON.stringify(
        'Полезные калькуляторы для решения повседневных задач'
      ),
    }),
  ],
  devServer: {
    static: './dist',
    hot: true,
    port: 3000,
    open: true,
    historyApiFallback: true,
    devMiddleware: {
      publicPath: '/',
    },
  },
};
