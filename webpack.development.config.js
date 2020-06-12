const path = require( 'path' )

module.exports = {
    mode: `development`,
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: [ `babel-loader` ]
            }
        ]
    },
    resolve: {
        extensions: [ `*`, `.js` ]
    },
    entry: {
        bundle: `./build/scripts/frontend/bundle.js`,
        product: `./build/scripts/frontend/product.js`
    },
    output: {
        path: path.resolve( __dirname, `assets/scripts` ),
        filename: `[name].js`
    }
}
