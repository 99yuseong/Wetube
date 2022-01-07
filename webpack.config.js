const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    entry: {
        main: './src/client/js/main.js',
        channelCheck: './src/client/js/channelCheck.js',
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'assets'),
        clean: true,
    },
    mode: 'development',
    watch: true,
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/style.css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
        ],
    },
};
