const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './Scripts/index.jsx',
    output: {
        path: path.resolve(__dirname, './wwwroot/js/dist'),
        publicPath: '/',
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
    plugins: [
        new HtmlWebpackPlugin({
            template: './Views/Home/WebpackTemplate.html',
            filename: 'main.cshtml',
            publicPath: 'js/dist'
        }),
        new CleanWebpackPlugin()
    ]
};