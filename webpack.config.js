const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    entry: {
        main: './src/client/js/main.js',
        channel_join: './src/client/js/channel/join.js',
        channel_edit: './src/client/js/channel/edit.js',
        watch_watch: './src/client/js/watch/watch.js',
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
