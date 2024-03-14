const path = require('path');
var BrotliPlugin = require('brotli-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './Scripts/index.jsx',
    output: {
        path: path.resolve(__dirname, './wwwroot/js/dist'),
        filename: 'main.[contenthash].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'],
            },
            {
                test: /\.(js|jsx)/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: { "presets": ["@babel/preset-env", "@babel/preset-react"] }
                }
            },
            {
                test: /\.css$/i,
                exclude: "/node_modules/",
                use: ["style-loader", "css-loader"],
            },
        ]
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    optimization: {
        minimize: true,
        removeAvailableModules: true,
        removeEmptyChunks: true,
        mergeDuplicateChunks: true,
        moduleIds: 'deterministic'
    },
    plugins: [
        new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new HtmlWebpackPlugin({
            template: './Views/Home/WebpackTemplate.html',
            filename: 'main.cshtml',
            publicPath: 'js/dist'
        }),
        new CleanWebpackPlugin()
    ]
};