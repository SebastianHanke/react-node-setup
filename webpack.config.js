var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var merge = require('webpack-merge');
var autoPrefixer = require('autoprefixer');

var TARGET = process.env.npm_lifecycle_event;
var ROOT_PATH   = path.resolve(__dirname);
var APP_PATH    = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH  = path.resolve(ROOT_PATH, 'build');

console.log('app-path...',APP_PATH)

var common = {
    entry   : APP_PATH,
    output  : {
        path    : BUILD_PATH,
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test    : /(\.js$)|(\.jsx$)/,
                include : APP_PATH,
                loaders : [
                    'babel-loader'
                ]
            },
            {
                test    : /\.styl$/,
                loader  : 'style-loader!css-loader!postcss-loader!stylus-loader',
                include : APP_PATH
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'React on Node'
        })
    ],
    postcss: [autoPrefixer()]
};

if(TARGET === 'start') {
    module.exports = merge(common, {
        devtool: 'eval-source-map',
        devServer: {
            historyApiFallback  : true,
            hot                 : true,
            inline              : true,
            progress            : true
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });
} else if(TARGET === 'build') {
    module.exports = merge(common, {
        module: {
            loaders: [
                {
                    test    : /\.styl$/,
                    loader  : ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!stylus-loader'),
                    include : APP_PATH
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin("main.css", {
                allChunks: true
            })
        ]
    });
}
