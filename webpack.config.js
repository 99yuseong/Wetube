const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    entry: {
        main: './src/client/js/main.js',
        join: './src/client/js/join.js',
        editChannel: './src/client/js/editChannel.js',
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'assets/statics'),
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
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { url: false } },
                    { loader: 'sass-loader' },
                ],
            },
        ],
    },
};
