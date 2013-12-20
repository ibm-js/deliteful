module.exports = function (grunt) {

	// Helper function to return target for compiling less files for given theme.
	// This should be doable with templates (<%= this.target =>) but unfortunately it doesn't seem to work.
	function lessToTheme(theme){
		return {
			files: [
				{
					// Enable dynamic expansion.
					expand: true,

					// process less files in themes/common (ex: themes/common/Button.less)
					cwd: "themes/common",
					src: ["*.less"],

					// and put output into theme dir (ex: themes/blackberry/Button.css)
					dest: "themes/" + theme,
					ext: ".css"
				}
			],
			options: {
				// Look for @import files in theme directory (ex: themes/blackberry), then fallback to themes/common
				paths: ["themes/" + theme, "themes/common"]
			}
		};
	}

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

		// Task for compiling less files into CSS files
		less : {
			// Compile each theme
			blackberry : lessToTheme("blackberry"),
			bootstrap : lessToTheme("bootstrap"),
			custom : lessToTheme("custom"),
			holodark : lessToTheme("holodark"),
			ios : lessToTheme("ios"),
			windows : lessToTheme("windows"),

			// Compile theme independent files
			transitions: {
				expand: true,
				cwd: "themes/common/transitions",
				src: ["*.less"],
				dest: "themes/common/transitions",
				ext: ".css"
			}
		},

		// Convert CSS files to JS files
		cssToJs : {
			src: ["themes/*/*.css", "!themes/common/*.css"]
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