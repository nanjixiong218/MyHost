/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import fs from 'fs';
import { dependencies as externals } from './app/package.json';
import { dependencies as possibleExternals } from './package.json';

// Find all the dependencies without a `main` property and add them as webpack externals
function filterDepWithoutEntryPoints(dep: string): boolean {
  // Return true if we want to add a dependency to externals
  try {
    // If the root of the dependency has an index.js, return true
    if (fs.existsSync(path.join(__dirname, `node_modules/${dep}/index.js`))) {
      return false;
    }
    const pgkString = fs
      .readFileSync(path.join(__dirname, `node_modules/${dep}/package.json`))
      .toString();
    const pkg = JSON.parse(pgkString);
    const fields = ['main', 'module', 'jsnext:main', 'browser'];
    return !fields.some(field => field in pkg);
  } catch (e) {
    console.log(e);
    return true;
  }
}

export default {
  externals: [
    ...Object.keys(externals || {}),
    ...Object.keys(possibleExternals || {}).filter(filterDepWithoutEntryPoints)
  ],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      // // EOT Font
      // {
      //   test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      //   use: 'file-loader'
      // },
      // // SVG Font
      // {
      //   test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      //   use: {
      //     loader: 'url-loader',
      //     options: {
      //       limit: 10000,
      //       mimetype: 'image/svg+xml'
      //     }
      //   }
      // },
      // // Common Image Formats
      // {
      //   test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
      //   use: 'url-loader'
      // }
    ]
  },

  output: {
    path: path.join(__dirname, 'app'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [path.join(__dirname, 'app'), 'node_modules'],
    alias: {
      App: path.resolve(__dirname, './app'),
      Utils: path.resolve(__dirname, './app/utils/'),
      Components: path.resolve(__dirname, './app/components/'),
      Asserts: path.resolve(__dirname, './app/asserts/'),
      Actions: path.resolve(__dirname, './app/actions/'),
      Reducers: path.resolve(__dirname, './app/reducers/'),
      Selectors: path.resolve(__dirname, './app/selectors/'),
      Constants: path.resolve(__dirname, './app/constants/')
    }
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),

    new webpack.NamedModulesPlugin()
  ]
};
