const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const postCssFlexbugsFixer = require('postcss-flexbugs-fixes');
const webpack = require('webpack');
const deployConfig = require('./deploy-config');

const name = '[name]-[hash:8].[ext]';

const browsers = [
  '>1%',
  'last 4 versions',
  'Firefox ESR',
  'not ie < 9', // React doesn't support IE8 anyway
];

/*
 * Get the webpack loaders object for the webpack configuration
 */
const rules = [
  {
    test: /\.tsx?$/,
    exclude: /\.spec\.tsx?$/,
    use: {
      loader: require.resolve('awesome-typescript-loader'),
      options: {
        useBabel: true,
        useCache: true,
        babelOptions: {
          presets: [
            [
              'env',
              {
                targets: {
                  browsers,
                },
              },
            ],
          ],
          // Needed in order to transform generators. Babelification can be removed
          // once TypeScript supports generators, probably in TS 2.3.
          // When that is done, also change the output of TS to 'es5' in tsconfig.json
          plugins: ['transform-regenerator'],
        },
      },
    },
  },
  {
    test: /\.svg$/,
    use: [
      {
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          mimetype: 'image/svg+xml',
          name,
        },
      },
    ],
  },
  {
    test: /\.(jpeg|jpg|gif|png)$/,
    use: [
      {
        loader: require.resolve('file-loader'),
        options: {
          name,
        },
      },
    ],
  },
  {
    test: /\.css$/,
    use: [
      require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 1,
          localIdentName: '[name]__[local]___[hash:base64:5]',
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
          plugins: () => [
            postCssFlexbugsFixer,
            autoprefixer({
              browsers,
              flexbox: 'no-2009',
            }),
          ],
        },
      },
    ],
  },
  {
    test: /\.svg$/,
    use: [
      {
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          mimetype: 'image/svg+xml',
          name,
        },
      },
    ],
  },
  {
    test: /\.(woff|woff2|eot|ttf)$/,
    use: [
      {
        loader: require.resolve('file-loader'),
        options: {
          name: 'fonts/[name].[ext]',
        },
      },
    ],
  },
];

const config = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    strictExportPresence: true,
    rules,
  },
  output: {
    filename: 'index-[hash].js',
    path: path.join(__dirname, deployConfig.base.dest),
    publicPath: deployConfig.base.publicPath,
  },
  entry: [
    require.resolve('whatwg-fetch'),
    require.resolve('babel-polyfill'),
    './src/index.tsx',
  ],
  plugins: [
    new HtmlWebpackPlugin({
      template: require.resolve(`${__dirname}/src/index-template.tsx`),
      inject: false,
      filename: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        ['production', 'staging'].indexOf(deployConfig.env) > -1
          ? 'production'
          : 'development'
      ),
    }),
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};

if (['production', 'staging'].indexOf(deployConfig.env) > -1) {
  config.bail = true;
  config.plugins = config.plugins.concat([
    // LopaderOptionsPlugin with minimize:true will be removed in Webpack 3.
    // Will need to add minimize: true to loaders at that point.
    // See https://webpack.js.org/guides/migrating/#uglifyjsplugin-minimize-loaders
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    // Minify the code.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebookincubator/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
      },
      mangle: {
        safari10: true,
      },
      output: {
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebookincubator/create-react-app/issues/2488
        ascii_only: true,
      },
      sourceMap: true,
    }),
  ]);
}

module.exports = config;
