const path = require('path');
const webpack = require('webpack');

const webpackConfig = require('./webpack.config');

const {version, author, min} = require('./package.json');

const banner = `/*
 * 2012-2017. All rights reserved.
 */
/*!
 * FluidCanvas v${version}
 * ${author}
 */`;

const basename = path.basename(min, '.min.js');

module.exports = Object.assign({}, webpackConfig, {
    entry: Object.assign({}, webpackConfig.entry, {
        [`${basename}.min.js`]: './index.ts'
    }),
    devtool: 'cheap-module-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js/,
            sourceMap: true,
            mangle: {
                keep_fnames: true
            }
        }),
        new webpack.BannerPlugin({
            banner,
            raw: true,
            entryOnly: true
        })
    ]
});
