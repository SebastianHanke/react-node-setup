var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var merge = require('webpack-merge');
var autoPrefixer = require('autoprefixer');

var TARGET      = process.env.npm_lifecycle_event;

var ROOT_PATH   = path.resolve(__dirname);
var APP_PATH    = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH  = path.resolve(ROOT_PATH, 'build');

if (process.env.NODE_ENV === 'production') {
    console.log('--------------------------------');
    console.log('Building for PRODUCTION mode....', process.env.NODE_ENV);
    console.log('--------------------------------');
} else {
    console.log('--------------------------------');
    console.log('Serving for development mode....');
    console.log('--------------------------------');
}


/*
 *
 * COMMONS section
 * these options define options used in both modes
 *
 * - entry
 * - output
 * - resolve
 * - loaders
 *      - babel
 *      - stylus
 *      - url
 * - HtmlWebpackPlugin
 * - postcss (autoprefixer)
 *
 * */

var common = {
    entry   : {
        firstPage: './app/index.js',
        vendor: ['react']
    },
    output  : {
        path    : BUILD_PATH,
        filename: '[name]_bundle.js', //template based on keys in entry above
        chunkFilename: '[name]_[id].js', //template based on keys in entry above
        hash: true
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
            },
            {
                test    : /\.(png|jpg)$/,
                // inline base64 URLs for <=8k images, direct URLs for the rest
                loader  : 'url-loader?limit=8192'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'React on Webpack',
            template: 'app/template/index-template.html', //use this template
            inject: 'body' //inject javascript at body end
        })
    ],
    postcss: [autoPrefixer()]
};

/*
*
* DEVELOPMENT section
* these options define options used in development mode
*
* - devtool
* - devServer
* - HotModuleReplacementPlugin
*
* */

if(TARGET === 'start') {
    module.exports = merge(common, {
        devtool: 'eval-source-map',
        devServer: {
            historyApiFallback  : true,
            hot                 : true,
            inline              : true,
            progress            : true,
            contentBase         : BUILD_PATH
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });
}

/*
 *
 * PRODUCTION section
 * these options define options used in production mode
 *
 * - ExtractTextPlugin (generate css files)
 * - OccurenceOrderPlugin
 * - CommonsChunkPlugin
 * - UglifyJsPlugin
 * - DefinePlugin
 *
 * */

if(TARGET === 'build') {
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
            //if you use libraries with huge dependency trees, it may happen that some files are identical
            //this plugin will prevent inclusion of duplicate code (downside: adds some overhead to entry chunk)
            //new webpack.optimize.DedupePlugin(),

            //webpack varies the distribution of ids to get smalles id length for often used ids
            //entry chunks have higher priority for file size
            new webpack.optimize.OccurenceOrderPlugin(true),

            //seperate vendor and app-specific code
            new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),

            new webpack.optimize.UglifyJsPlugin({
                compress: {warnings: false},
                output: {comments: false},
                sourcemap: false
            }),
            //extract css into fill after preprocessing etc.
            new ExtractTextPlugin("main.css", {
                allChunks: true
            }),
            //remove all code in React that is inside a 'dev-only' conditional
            new webpack.DefinePlugin({
                'process.env' : {NODE_ENV: JSON.stringify('production')}
            })
        ]
    });
}