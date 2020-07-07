// Loads all modules used by samples/functional tests.

// Map from module id to module.  Also makes sure modules tests need are in the bundle.
const map = {
	"dojo-dstore/Memory": require("dojo-dstore/Memory"),
	"dojo-dstore/Trackable": require("dojo-dstore/Trackable"),
	"dcl/advise": require("dcl/advise"),
	"dcl/dcl": require("dcl/dcl"),
	"ibm-decor/Observable": require("ibm-decor/Observable"),
	"ibm-decor/ObservableArray": require("ibm-decor/ObservableArray"),
	"delite/register": require("delite/register"),

	"deliteful/Checkbox": require("deliteful/Checkbox"),
	"deliteful/Combobox": require("deliteful/Combobox"),
	"deliteful/DatePicker": require("deliteful/DatePicker"),
	"deliteful/LinearLayout": require("deliteful/LinearLayout"),
	"deliteful/RadioButton": require("deliteful/RadioButton"),
	"deliteful/ViewStack": require("deliteful/ViewStack"),
	"deliteful/list/List": require("deliteful/list/List"),
	"deliteful/list/PageableList": require("deliteful/list/PageableList"),

	// For List sample pages.
	"deliteful/samples/list/src/CustomCategoryList": require("deliteful/samples/list/src/CustomCategoryList"),
	"deliteful/samples/list/src/CustomItemList": require("deliteful/samples/list/src/CustomItemList"),
	"deliteful/samples/list/src/DataForm": require("deliteful/samples/list/src/DataForm"),
	"deliteful/samples/list/src/InputElementList": require("deliteful/samples/list/src/InputElementList"),
	"deliteful/samples/list/src/NavigationList": require("deliteful/samples/list/src/NavigationList"),

	// For functional test pages.
	"deliteful/tests/functional/SlowStore": require("deliteful/tests/functional/SlowStore"),
	"deliteful/tests/functional/list/src/ComplexList": require("deliteful/tests/functional/list/src/ComplexList"),
	"deliteful/tests/functional/list/src/CustomList1": require("deliteful/tests/functional/list/src/CustomList1"),
	"deliteful/tests/functional/list/src/BookList": require("deliteful/tests/functional/list/src/BookList"),
	"deliteful/tests/functional/list/src/BookTable": require("deliteful/tests/functional/list/src/BookTable")
};

// Create Promise that resolves when the document has finished loading.
const domReady = require("requirejs-domready/domReady");
const readyPromise = new Promise(function (resolve) {
	domReady(resolve);
});

// Global method similar to old AMD require().
module.exports = window.delitefulRequire = function (dependencies, callback) {
	readyPromise.then(function () {
		callback(...dependencies.map(function (mid) {
			const obj = map[mid];
			return obj.__esModule && obj.default ? obj.default : obj;
		}));
	});
};

// Loads webpack-runtime-require as another way to get dependencies.   Require("...") API (but apparently
// with only the module name, not the full module path).
window.webpackData = __webpack_require__;
require("webpack-runtime-require");


