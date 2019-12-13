/*global module */
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		jshint: {
			src: [
				"**/*.js", "!{node_modules,ViewStack/transitions}/**", "!**/themes/**", "!*/css/*.js"
			],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Task for compiling less files into CSS files
		less: {
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

		// Copied from grunt web site but not tested
		uglify: {
			options: {
				banner: "/*! <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> */\n"
			},
			build: {
				src: "src/<%= pkg.name %>.js",
				dest: "build/<%= pkg.name %>.min.js"
			}
		},

		"jsdoc-amddcl": {
			docs: {
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
			export: {
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
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("jsdoc-amddcl");

	// Aliases
	grunt.registerTask("default", ["less"]);
	grunt.registerTask("jsdoc", "jsdoc-amddcl");
};