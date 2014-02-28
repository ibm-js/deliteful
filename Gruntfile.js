/*global module */
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		jshint: {
			src: [
				// only doing top level files for now, to avoid old files in dijit/, form/, layout/, and mobile
				"*.js"

			],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Task for compiling less files into CSS files
		less : {
			// Compile less code for each widget
			widgets : {
				files: [
					{
						expand: true,
						src: ["*/themes/*/*.less", "!{dijit,mobile}/themes/*/*.less", "*/css/*.less",
							"ViewStack/transitions/*.less"],
						ext: ".css"
					}
				]
			}
		},

		// Convert CSS files to JS files
		cssToJs : {
			src: [
				"*/themes/*/*.css", "!{dijit,mobile}/themes/*/*.css", "ViewStack/transitions/*.css"
			],
			options: {
				remove: true	// remove intermediate CSS files, generated from LESS files in less step
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
		}
	});

	// Load plugins
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadTasks("../delite/themes/tasks");// Custom cssToJs task to convert CSS to JS

	grunt.registerTask("default", ["less", "cssToJs"]);
};