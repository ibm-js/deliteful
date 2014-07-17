/*global module */



module.exports = function (grunt) {
	var generateLessSuite = function () {
		var widgetName = grunt.option("widget"),
			theme = grunt.option("theme");

		var getWidgetFolder = function(widgetName){
			var exceptions = { "List": "list/List/" }
			return widgetName in exceptions ? 
				 exceptions[widgetName] : widgetName;
		}

		var widget = getWidgetFolder(widgetName);

		var generate = function (widget, theme, excludeVars) {
			var path = require("path");
			var output = {compile: [], watch: []};
			theme = theme || "*"; // TODO: this should also check widget and theme are correctly spelled;
			output.compile = [
				path.join(widget, "themes", theme, "*.less") // <widget>/themes/<theme>/*.less
				];
			output.watch = [
				path.join(widget, "themes", theme, "*.less"), // <widget>/themes/<theme>/*.less
				path.join(widget, "themes", "*.less")         // <widget>/themes/*.less
					]
					return output;
		}
		p=  widget ? generate(widget, theme, true) : null;
		console.log("p")
		console.log(p)
		return p
	};

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
		less : {
			// Compile less code for each widget
			widgets : {
				files: [
					{
						expand: true,
						src: ["*/themes/*/*.less", "list/*/themes/*/*.less", "!**/variables.less",
						      "!{dijit,mobile}/themes/*/*.less", "*/css/*.less",
							 "ViewStack/transitions/*.less"],
						ext: ".css"
					}
				]
			},
			// Compile less code for a widget and a theme
			// used by lessToJs.
			widget : {
				files: [
					{
						expand: true, 
						src: generateLessSuite().compile,
						ext: ".css"
					}
				]
			}
		},

		// Convert CSS files to JS files
		cssToJs : {
			src: [
				"*/themes/*/*.css", "list/*/themes/*/*.css",
				"!{dijit,mobile}/themes/*/*.css", "ViewStack/transitions/*.css"
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
		},
		
		intern: {
			local: {
				options: {
					runType: "runner",
					config: "tests/intern.local",
					reporters: ["runner"]
				}
			},
			"local.android": {
				options: {
					runType: "runner",
					config: "tests/intern.local.android",
					reporters: ["runner"]
				}
			},
			"local.ios": {
				options: {
					runType: "runner",
					config: "tests/intern.local.ios",
					reporters: ["runner"]
				}
			},
			remote: {
				options: {
					runType: "runner",
					config: "tests/intern",
					reporters: ["runner"]
				}
			}
		},
		
		"jsdoc-amddcl": {
			docs: {
				files: [
					{
						src: [
							".",
							"./list",
							"./README.md",
							"./package.json"
						],
						imports: [
							"../delite/out"
						]
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
		},
		watch: {
			lessToJs: {
				files:  generateLessSuite().watch,
				tasks: ["less:widget", "cssToJs"],
				options: {
					spawn: false
				}

			}
		}
	});

	// Load plugins
	grunt.loadNpmTasks("intern");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("jsdoc-amddcl");
	grunt.loadTasks("../delite/themes/tasks");// Custom cssToJs task to convert CSS to JS

	// Aliases
	grunt.registerTask("default", ["less", "cssToJs"]);
	grunt.registerTask("less_widget", ["less:widget", "cssToJs"]);
	grunt.registerTask("less_widget_watch", ["less:widget", "cssToJs", "watch"]);
	grunt.registerTask("jsdoc", "jsdoc-amddcl");
	
	// Testing.
	// always specify the target e.g. grunt test:remote, grunt test:remote
	// then add on any other flags afterwards e.g. console, lcovhtml
	var testTaskDescription = "Run this task instead of the intern task directly! \n" +
		"Always specify the test target e.g. \n" +
		"grunt test:local\n" +
		"grunt test:local.android\n" +
		"grunt test:local.ios\n" +
		"grunt test:remote\n\n" +
		"Add any optional reporters via a flag e.g. \n" +
		"grunt test:local:console\n" +
		"grunt test:local:lcovhtml\n" +
		"grunt test:local:console:lcovhtml";
	grunt.registerTask("test", testTaskDescription, function (target) {
		function addReporter(reporter) {
			var property = "intern." + target + ".options.reporters",
				value = grunt.config.get(property);
			if (value.indexOf(reporter) !== -1) {
				return;
			}
			value.push(reporter);
			grunt.config.set(property, value);
		}
		if (this.flags.lcovhtml) {
			addReporter("lcovhtml");
		}

		if (this.flags.console) {
			addReporter("console");
		}
		grunt.task.run("intern:" + target);
	});
};
