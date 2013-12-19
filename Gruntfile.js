module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		jshint: {
			files: [
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
	grunt.loadNpmTasks("grunt-contrib-uglify");

	// Default task(s).
	grunt.registerTask("default", ["jshint"]);

};