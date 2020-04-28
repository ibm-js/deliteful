const webpackConfig = require("./webpack.config.js");

/*global module */
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		"pkg": grunt.file.readJSON("package.json"),

		"eslint": {
			src: [
				"**/*.js",
				"!{node_modules,tests}/**",
				"!Gruntfile.js"
			],
			options: {
				configFile: ".eslintrc.json"
			}
		},

		// Task for compiling less files into CSS files
		"less": {
			// Compile less code for each widget
			widgets: {
				files: [
					{
						expand: true,
						src: [
							"**/*.less",
							"!**/variables.less",
							"!node_modules/**"
						],
						ext: ".css"
					}
				]
			}
		},

		"webpack": {
			config: webpackConfig
		},

		"jsdoc-amddcl": {
			"docs": {
				files: [
					{
						src: [
							".",
							"./list",
							"./Combobox",
							"./README.md",
							"./package.json"
						],
						imports: [
							"../delite/out"
						],
						paths: {
							"ibm-decor": "node_modules/ibm-decor/docs/api/0.3.0/ibm-decor",
							"delite": "node_modules/delite/docs/api/0.4.0/delite"
						},
						packagePathFormat: "${name}/docs/api/${version}",
						includeEventsInTOC: "false"
					}
				]
			},
			"export": {
				files: [
					{
						args: [
							"-X"
						],
						src: [
							".",
							"./list",
							"./Combobox",
							"./README.md",
							"./package.json"
						],
						dest: "./out/doclets.json",
						imports: [
							"../delite/out"
						]
					}
				]
			}
		}
	});

	// Load plugins
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("jsdoc-amddcl");
	grunt.loadNpmTasks("grunt-webpack");

	// Aliases
	grunt.registerTask("default", ["less"]);
	grunt.registerTask("jsdoc", "jsdoc-amddcl");
};
