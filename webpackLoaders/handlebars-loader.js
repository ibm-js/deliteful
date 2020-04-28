const jsdom = require("jsdom").jsdom;

module.exports = function handlebarsLoader (templateText) {
	//console.log("handlebars-loader: " + templateText);
	this.cacheable();
	var callback = this.async();

	var dom = jsdom(templateText),
		template = dom.querySelector("template"),
		requiresAttr = template.getAttribute("requires") || template.getAttribute("data-requires");

	var templateRequires = requiresAttr ? requiresAttr.split(/,\s*/) : [];
	template.removeAttribute("requires");
	template.removeAttribute("data-requires");

	var moduleRequires = ["delite/handlebars", ...templateRequires];
	var moduleText = "define(" + JSON.stringify(moduleRequires) + ", function(handlebars){\n" +
		"\treturn handlebars.compile(" + JSON.stringify(template.outerHTML) + ");\n" +
		"});";

	// Ensure all template dependencies are in the bundle
	var promises = templateRequires.map(moduleID => new Promise(resolve => {
		this.loadModule(moduleID, (err, source, sourceMap, module) => {
			this.addDependency(module.resource);
			resolve();
		});
	}));

	Promise.all(promises).then(function () {
		//write module definition string to bundle
		callback(null, moduleText);
	});
};