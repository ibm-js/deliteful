var fs = require("fs");

["../ios", "../blackberry", "../holodark", "../windows", "../custom", "../bootstrap", "../common/transitions"].forEach(clean);

// Remove css files that have a matching less file in the same folder or in common folder
function clean(folder) {
	var cssFiles = [];
	getFiles(folder, /.*.js$/, cssFiles);
	var lessFiles = {};
	getFiles("../common/", /.*.less$/, lessFiles);
	getFiles(folder, /.*.less$/, lessFiles);

	for (var i = 0; i < cssFiles.length; i++) {
		if (lessFiles[cssFiles[i].replace(".js", ".less")]) {
			console.log("deleting", folder + "/" + cssFiles[i]);
			fs.unlink(folder + "/" + cssFiles[i], function (err) {
				if (err) {
					console.log(err);
				}
			});
		}
	}

}

function getFiles(folder, pattern, dest) {
	fs.readdirSync(folder).map(function (file) {
		if (pattern.test(file)) {
			if (dest instanceof Array) {
				dest.push(file);
			} else {
				dest[file] = true;
			}
		}
	});
}
