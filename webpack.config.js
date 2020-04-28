const webpack = require("webpack");
const merge = require("webpack-merge");

const {CleanWebpackPlugin} = require("clean-webpack-plugin");

const babelLoader = {
	loader: "babel-loader",
	options: {
		presets: [
			["@babel/preset-env", {
				targets: {
					ie: 11
				}
			}]
		]
	}
};

// Configuration shared by Storybook's build and the app's build
const storybook = developmentMode => ({
	mode: developmentMode ? "development" : "production",
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				sideEffects: true,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							sourceMap: developmentMode
						}
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: developmentMode,
							sassOptions: {
								// Other files have imports like @import "@carbon/icons/...".
								includePaths: [
									// Carbon-components has its own copies of the @carbon projects.  Since it's using
									// those copies we might as well use them too.
									"node_modules/carbon-components/scss/globals/scss/vendor",

									// Normal path for third party includes.
									"node_modules"
								]
							}
						}
					}
				]
			},
			{
				test: /\.less$/i,
				sideEffects: true,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							sourceMap: developmentMode
						}
					},
					{
						loader: "less-loader",
						options: {
							sourceMap: developmentMode
						}
					}
				]
			},
			{
				enforce: "pre",
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "eslint-loader",
				options: {
					cache: false
				}
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: babelLoader
			},
			{
				// Nothing in node_modules needs to be transpiled *except* for lit-html.
				test: /node_modules[\\\/]lit-html[\\\/].*\.js$/,
				use: babelLoader
			}
		]
	},
	resolve: {
		modules: [
			"node_modules"
		],
		alias: {
			// myself (exception because not in node_modules)
			/* global __dirname */
			deliteful: __dirname,

			// third party aliases
			dcl: "dcl/amd"
		}
	},
	resolveLoader: {
		modules: [
			"node_modules",
			"webpackLoaders"
		],
		alias: {
			"requirejs-dplugins/i18n": "amdi18n-loader",
			"requirejs-text/text": "raw-loader",

			// custom loaders
			"delite/handlebars": "handlebars-loader"
		}
	},
	plugins: [
		// Get dojo (accessed via dstore) to work.
		new webpack.NormalModuleReplacementPlugin(/has!dom-addeventlistener\?\:/,
			resource => { resource.request = "empty-module"; } ),
		new webpack.NormalModuleReplacementPlugin(/has!config-deferredInstrumentation\?.\/promise\/instrumentation/,
			resource => { resource.request = "dojo/promise/instrumentation"; } ),

		// Get decor/Observable to load.  TODO: remove the "object-observe-api" check; it's always false.
		// Or, just remove support for ObservableArray altogether.
		new webpack.NormalModuleReplacementPlugin(/features!object-observe-api/,
			resource => { resource.request = "ibm-decor/schedule"; } ),

		// Convert "requirejs-dplugins/css!foo.css" into just "foo.css".
		new webpack.NormalModuleReplacementPlugin(/^requirejs-dplugins[\\\/]css!/, function (resource) {
			resource.request = resource.request.replace(/.*css!/, "");
		})
	],

	node: {
		setImmediate: false,
		process: false
	}
});

// Main configuration for the app, unit tests, etc.
const main = developmentMode => merge(storybook(developmentMode), {
	entry: {
		// Bundle to run the unit tests.
		"unit-tests": "./tests/unit/bundle.js",

		// Bundle for the samples and functional tests.
		"functional-tests": "./tests/functional/bundle.js"
	},

	output: {
		// To make webpack-runtime-require work.
		pathinfo: true
	},

	module: {
		rules: [
			{
				// Storybook adds its own rule for CSS files, so this is not part of Storybook's config above.
				test: /\.css$/i,
				sideEffects: true,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							sourceMap: developmentMode
						}
					}
				]
			}
		]
	},

	plugins: [
		// CleanWebpackPlugin breaks the Storybook build, so put it here instead.
		new CleanWebpackPlugin()
	],

	devtool: developmentMode ? "eval-source-map" : false
});

module.exports = main(true);
