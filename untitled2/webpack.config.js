const path = require('path');

module.exports = {
    mode: 'production', // Możesz zmienić na 'development' podczas testów
    entry: './public/script.js',  // Twoje główne pliki źródłowe
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/dist'), // Pliki wynikowe
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};