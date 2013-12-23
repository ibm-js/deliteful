/*global module */
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		jshint: {
			src: [
				// only doing top level files for now, to avoid old files in dijit/, form/, layout/, and mobile
				"*.js",

				// Skip files that still have many errors or haven't been updated at all (TODO: fix)
				"!Rule.js",
				"!Slider.js",
				"!a11y.js",
				"!a11yclick.js",
				"!focus.js",
				"!handlebars.js",
				"!place.js",
				"!popup.js",
				"!template.js",
				"!typematic.js"
			],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Task for compiling less files into CSS files
		less : {

			// Compile theme independent files
			transitions: {
				expand: true,
				cwd: "themes/common/transitions",
				src: ["*.less"],
				dest: "themes/common/transitions",
				ext: ".css"
			},

			// Infrastructure per-theme files
			common : {
				files: [
					{
						expand: true,
						src: ["themes/*/*.less", "!themes/common/*.less", "!**/variables.less"],
						ext: ".css"
					}
				]
			},

			// Compile less code for each widget
			widgets : {
				files: [
					{
						expand: true,
						src: ["*/themes/*/*.less", "!{dijit,mobile}/themes/*/*.less"],
						ext: ".css"
					}
				]
			}
		},

		// Convert CSS files to JS files
		cssToJs : {
			src: [
				"themes/*/*.css", "!themes/common/*.css", "themes/common/transitions/*.css",	// infrastructure
				"*/themes/*/*.css", "!{dijit,mobile}/themes/*/*.css"	// widgets
			]
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
		}
	});

	// Load plugins
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadTasks("themes/tasks");// Custom cssToJs task to convert CSS to JS

	grunt.registerTask("default", ["less", "cssToJs"]);
};