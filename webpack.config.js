var path = require("path");
var webpack = require("webpack");
var UglifyJsPlugin = require("uglifyjs-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var NodeExternals = require("webpack-node-externals");

module.exports = {
    entry: {
		'server': "./src/server.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
        filename: "[name].js"
    },
    devServer: {
        historyApiFallback: true
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: [{
                loader: "awesome-typescript-loader",
                options: {
                    configFileName: path.resolve(__dirname, "tsconfig.json")
                }
            }]
        }, {
            test: /\.html$/,
            loader: "html-loader"
        }, {
            test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
            loader: "file-loader?name=assets/[name].[ext]"
        }, {
            test: /\.css$/,
            exclude: path.resolve(__dirname, "src/app"),
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
        }, {
            test: /\.css$/,
            include: path.resolve(__dirname, "src/app"),
            loader: "raw-loader"
        }]
    },
	target: "node",
	externals: [
		NodeExternals()
	],
    plugins: [
        new UglifyJsPlugin(),
		new ExtractTextPlugin("[name].css"),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.LoaderOptionsPlugin({
            htmlLoader: {
                minimize: false
            }
        }),
		new CopyWebpackPlugin([
            {
				from: 'src/img',
				to: 'img'
            },
            {
                from: 'src/config_files',
                to: 'config_files'
            }
        ])
    ]
};