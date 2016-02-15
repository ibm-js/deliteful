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
						src: ["*/themes/*/*.less", "*/themes/*.less",
							"!*/themes/*_template{,_*}.less", "!**/variables.less",
							"list/*/themes/*/*.less",
							"!{dijit,mobile}/themes/*/*.less", "*/css/*.less",
							"ViewStack/transitions/*.less"],
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
		
		intern: {
			local: {
				options: {
					runType: "runner",
					config: "tests/intern.local",
					reporters: ["Runner"]
				}
			},
			"local-android": {
				options: {
					runType: "runner",
					config: "tests/intern.local.android",
					reporters: ["Runner"]
				}
			},
			"local-ios": {
				options: {
					runType: "runner",
					config: "tests/intern.local.ios",
					reporters: ["Runner"]
				}
			},
			remote: {
				options: {
					runType: "runner",
					config: "tests/intern",
					reporters: ["Runner"]
				}
			},
			browserstack: {
				options: {
					runType: "runner",
					config: "tests/intern.browserstack",
					reporters: ["Runner"]
				}
			},
			"local-bidi": {
				options: {
					runType: "runner",
					config: "tests/intern.local.bidi",
					reporters: ["Runner"]
				}
			},
			"local-android-bidi": {
				options: {
					runType: "runner",
					config: "tests/intern.local.android.bidi",
					reporters: ["Runner"]
				}
			},
			"local.ios.bidi": {
				options: {
					runType: "runner",
					config: "tests/intern.local.ios.bidi",
					reporters: ["Runner"]
				}
			},
			"remote-bidi": {
				options: {
					runType: "runner",
					config: "tests/intern.bidi",
					reporters: ["Runner"]
				}
			},
			"browserstack-bidi": {
				options: {
					runType: "runner",
					config: "tests/intern.browserstack.bidi",
					reporters: ["Runner"]
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
							"./Combobox",
							"./README.md",
							"./package.json"
						],
						imports: [
							"../delite/out"
						],
						paths: {
							"decor": "../../../../decor/docs/api/0.3.0/decor",
							"delite": "../../../../delite/docs/api/0.4.0/delite"
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
	grunt.loadNpmTasks("intern");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("jsdoc-amddcl");

	// Aliases
	grunt.registerTask("default", ["less"]);
	grunt.registerTask("jsdoc", "jsdoc-amddcl");
	
	// Testing.
	// always specify the target e.g. grunt test:remote, grunt test:remote
	// then add on any other flags afterwards e.g. runner, console, lcovhtml
	var testTaskDescription = "Run this task instead of the intern task directly! \n" +
		"Always specify the test target e.g. \n" +
		"grunt test:local\n" +
		"grunt test:local-android\n" +
		"grunt test:local-ios\n" +
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