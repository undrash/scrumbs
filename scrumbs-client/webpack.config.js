
const path      = require( "path" );
const webpack   = require( "webpack" );



module.exports = {
    context: path.join( __dirname, "src/pages" ),
    entry: {
        app: "./app/AppEntryPoint.ts",
        resetPassword: "./reset-password/ResetPasswordEntryPoint.ts"
    },
    mode: "production",
    module: {
        rules: [
            { test: /\.html$/, use: "html-loader" },
            { test: /\.js$/, loader: "source-map-loader", enforce: "pre" },
            { test: /\.ts$/, loader: "ts-loader" },
            { test: /\.css$/, use: [ "style-loader", "css-loader" ] },
            { test: /\.scss$/, use: [ "style-loader", "css-loader", "sass-loader" ] },
            { test: /\.(jpg|png|svg|gif)$/, use: { loader: "file-loader", options: { name: "[name].[ext]", outputPath: "../img/", publicPath: "../public/img" } } },
            { test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/, use: { loader: "file-loader", options: { name: "[name].[ext]", outputPath: "../fonts/", publicPath: "../public/fonts" } } },
            { include: path.resolve(__dirname, "node_modules/pixi.js"), loader: "transform-loader?brfs", enforce: "post" }
        ]
    },
    resolve: {
        extensions: [
            ".ts"
        ],
        alias: {
            "TweenLite": "node_modules/gsap/src/uncompressed/TweenLite"
        }
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "../scrumbs-app/public/js")
    },
    externals: [
        { "pixi.js": "PIXI" },
        { "TweenL": "TweenLite" },
        { "jquery": "jQuery" }
    ],
    plugins: [
        new webpack.DefinePlugin({
            "SERVICE_URL": JSON.stringify("http://localhost:3000")
        })
    ]

};