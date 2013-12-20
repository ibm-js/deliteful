// Grunt plugin to convert specified CSS files into JS files

module.exports = function(grunt) {

	var fs = require("fs");
	var path = require("path");

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask("cssToJs", "Convert CSS files to JS files", function() {
			this.files.forEach(function(file) {
			grunt.log.writeln("Processing " + file.src.length + " files.");

			file.src.forEach(function(f){
				var contents = fs.readFileSync(f, {encoding: "utf-8"});

				// Replace {{theme}} with name of current theme; used by ExampleWidget
				var theme = f.replace(/themes\//, "").replace(/\/[^/]+$/, "");
				contents = contents.replace(/{{theme}}/g, theme);

				var destFile = f.replace(/\.css$/, ".js");
				grunt.log.writeln(f + " --> " + destFile);
				fs.writeFileSync(destFile, "define(function(){ return '\\\n" +
					contents.replace(/\n/mg, "\\\n") + "'; } );\n");
				fs.unlinkSync(f);
			});
		});
	});
};