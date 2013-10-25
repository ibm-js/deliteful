define([
	"dojo/aspect", // aspect.after
	"dojo/_base/lang", // lang.getObject
	"dojo/parser", // parser._functionFromScript
	"dojo/query", // query
	"./register",
	"./Widget",
	"dojo/NodeList-dom"
], function (aspect, lang, parser, query, register, Widget) {

	// module:
	//		dui/Declaration

	return register("d-declaration", Widget, {
		// summary:
		//		The Declaration widget allows a developer to declare new widget
		//		classes directly from a snippet of markup.

		// _noScript: [private] Boolean
		//		Flag to parser to leave alone the script tags contained inside of me
		_noScript: true,

		// stopParser: [private] Boolean
		//		Flag to parser to not try and parse widgets declared inside of me
		stopParser: true,

		// widgetClass: [const] String
		//		Name of class being declared, ex: "acme.myWidget"
		widgetClass: "",

		// propList: [const] Object
		//		Set of attributes for this widget along with default values, ex:
		//		{delay: 100, title: "hello world"}
		defaults: null,

		// mixins: [const] String[]
		//		List containing the prototype for this widget, and also any mixins,
		//		ex: ["dui.Widget", "dui.Container"]
		mixins: [],

		buildRendering: function () {
			var src = this.srcNodeRef.parentNode.removeChild(this.srcNodeRef),
				methods = query("> script[type='dojo/method']", src).orphan(),
				aspects = query("> script[type='dojo/aspect']", src).orphan(),
				srcType = src.nodeName;

			var propList = this.defaults || {};

			// For all methods defined like <script type="dojo/method" data-dojo-event="foo">,
			// add that method to prototype.
			// If there's no "event" specified then it's code to run on instantiation,
			// so it becomes a connection to "postscript" (handled below).
			methods.forEach(function (s) {
				var evt = s.getAttribute("data-dojo-event"),
					func = parser._functionFromScript(s, "data-dojo-");
				if (evt) {
					propList[evt] = func;
				} else {
					aspects.push(s);
				}
			});

			// map array of strings like [ "dui.form.Button" ] to array of mixin objects
			// (note that this.mixins.map(lang.getObject) doesn't work because it passes
			// a bogus third argument to getObject(), confusing it)
			if (this.mixins.length) {
				this.mixins = this.mixins.map(function (name) {
					return lang.getObject(name);
				});
			} else {
				this.mixins = [ Widget, _TemplatedMixin, _WidgetsInTemplateMixin ];
			}

			propList._skipNodeCache = true;
			propList.templateString =
				"<" + srcType + " class='" + src.className + "'" +
					" data-dojo-attach-point='" +
					(src.getAttribute("data-dojo-attach-point") || "") +
					"' data-dojo-attach-event='" +
					(src.getAttribute("data-dojo-attach-event") || "") +
					"' >" + src.innerHTML.replace(/\%7B/g, "{").replace(/\%7D/g, "}") + "</" + srcType + ">";

			// create the new widget class
			var wc = register(
				this.widgetClass,
				this.mixins,
				propList
			);

			// Handle <script> blocks of form:
			//		<script type="dojo/aspect" data-dojo-advice="after" data-dojo-method="foo">
			// and
			//		<script type="dojo/method">
			// (Note that the second one is just shorthand for a dojo/aspect to postscript)
			// Since this is a connect in the declaration, we are actually connection to the method
			// in the _prototype_.
			aspects.forEach(function (s) {
				var advice = s.getAttribute("data-dojo-advice") || "after",
					method = s.getAttribute("data-dojo-method") || "postscript",
					func = parser._functionFromScript(s);
				aspect.after(wc.prototype, method, func, true);
			});
		}
	});
});
