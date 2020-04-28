import register from "delite/register";
import Renderer from "deliteful/list/Renderer";

var registerSuite = intern.getPlugin("interface.object").registerSuite;
var assert = intern.getPlugin("chai").assert;

registerSuite("list/Renderer", {
	"create subclass": function () {
		var CorrectRenderer = register("d-correct-renderer", [ HTMLElement, Renderer ], {});
		assert(CorrectRenderer, "subclass defined");
	}
});

