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
            `./src/scripts/frontend/core.js`,
            `./src/scripts/frontend/autoload-components.js`,
            `./src/scripts/frontend/site-header.js`,
            `./src/scripts/frontend/main.js`
        ],
        admin: `./src/scripts/backend/admin.js`,
        editor: `./src/scripts/backend/editor.js`
    },
    output: {
        path: path.resolve( __dirname, `assets/scripts` ),
        filename: `[name].js`
    }
}