const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const url = './src/client/js';

module.exports = {
    entry: {
        main: `${url}/main.js`,
        channel_join: `${url}/channel/join.js`,
        channel_edit: `${url}/channel/edit.js`,
        watch_watch: `${url}/watch/watch.js`,
        watch_edit: `${url}/watch/edit.js`,
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'assets/statics'),
        clean: true,
    },
    mode: 'development',
    watch: true,
    devtool: 'source-map',
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
                        sourceMap: false,
                    },
                },
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { url: false, sourceMap: true },
                    },
                    { loader: 'sass-loader', options: { sourceMap: true } },
                ],
            },
        ],
    },
};
