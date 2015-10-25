var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const ROOT_PATH   = path.resolve(__dirname);
const APP_PATH    = path.resolve(ROOT_PATH, 'app');
const BUILD_PATH  = path.resolve(ROOT_PATH, 'build');

module.exports = {
    entry   : APP_PATH,
    output  : {
        path    : BUILD_PATH,
        filename: 'bundle.js'
    },
    devServer: {
        historyApiFallback  : true,
        hot                 : true,
        inline              : true,
        progress            : true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'React on Node'
        })
    ]
};

