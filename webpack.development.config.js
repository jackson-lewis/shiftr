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
        main: [
            `./build/scripts/frontend/core.js`,
            `./build/scripts/frontend/autoload-components.js`,
            `./build/scripts/frontend/site-header.js`,
            `./build/scripts/frontend/main.js`
        ],
        admin: `./build/scripts/backend/admin.js`,
        editor: `./build/scripts/backend/editor.js`
    },
    output: {
        path: path.resolve( __dirname, `assets/scripts` ),
        filename: `[name].js`
    }
}