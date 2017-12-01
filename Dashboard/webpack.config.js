const path = require('path');

const {main} = require('./package.json');
const basename = path.basename(main, '.js');

module.exports = {
    entry: {
        [`${basename}.js`]: './js/Dashboard.js'
    },
    output: {
        path: path.dirname(path.resolve(__dirname, main)),
        filename: '[name]',
        library: 'Dashboard',
        /*libraryTarget: 'umd'*/
    },
    devtool: 'source-map',
    resolve: {
        // Add '.es6' and '.jsx' as a resolvable extension.
        extensions: [".es6", ".jsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    stats: {
        colors: true
    }
};
