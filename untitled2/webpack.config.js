const path = require('path');

module.exports = {
    mode: 'production',
    entry: './public/script.js',  // Zakładam, że Twój główny plik JS znajduje się w public
    output: {
        filename: 'bundle.js',  // Nazwa wynikowego pliku JavaScript
        path: path.resolve(__dirname, 'public/dist'),  // Wymaga folderu `public/dist` do wynikowych plików
    },
    module: {
        rules: [
            {
                test: /\.js$/,  // Będziemy obsługiwać tylko pliki .js
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',  // Jeżeli używasz ES6+ lub JSX, musisz skonfigurować Babel
                },
            },
            {
                test: /\.css$/,  // Dodanie obsługi CSS
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        alias: {
            '@data': path.resolve(__dirname, 'data/'),  // Alias do folderu `data`
        },
    },
    devtool: 'source-map',  // Ułatwia debugowanie w produkcji
};