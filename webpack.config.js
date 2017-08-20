const path = require('path');

const {main} = require('./package.json');
const basename = path.basename(main, '.js');

module.exports = {
    entry: {
        [`${basename}.js`]: './index.ts'
    },
    output: {
        path: path.dirname(path.resolve(__dirname, main)),
        filename: '[name]',
        library: 'FluidCanvas',
        /*libraryTarget: 'umd'*/
    },
    devtool: 'source-map',
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loaders: ['awesome-typescript-loader']
            }
        ]
    }
};
