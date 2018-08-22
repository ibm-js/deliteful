define([
	"intern!object",
	"intern/chai!assert",
	"dojo/Deferred",
	"delite/register",
	"deliteful/list/Renderer",
], function (registerSuite, assert, Deferred, register, Renderer) {
/* jshint nonew: false */
	registerSuite({
		name: "list/Renderer",
		"Exception thrown if template does not define renderNode" : function () {
			var FaultyRenderer = register("d-faulty-renderer", [HTMLElement, Renderer], {
				render: function () {
					this.appendChild(this.ownerDocument.createElement("div"));
				}
			});
			var errorMessage = null;
			var oldErrorHandler = window.onerror;
			// On chrome, that supports custom elements, the exception is not re thrown by the constructor
			window.onerror = function (message) {
				errorMessage = message;
			};
			try {
				var fr = new FaultyRenderer();
				fr.deliver();
			} catch (e) {
				errorMessage = e.message;
			}
			window.onerror = oldErrorHandler;
			assert.isNotNull(errorMessage, "error expected");
			assert.isTrue(errorMessage.indexOf(
					"render must define a renderNode property on the Renderer") >= 0, "error message");
		},
		"No exception thrown if render defines renderNode" : function () {
			var CorrectRenderer = register("d-correct-renderer", [HTMLElement, Renderer], {
				render: function () {
					this.renderNode = this.ownerDocument.createElement("div");
					this.appendChild(this.renderNode);
				}
			});
			var errorMessage = null;
			var oldErrorHandler = window.onerror;
			// On chrome, that supports custom elements, the exception is not re thrown by the constructor
			window.onerror = function (message) {
				errorMessage = message;
			};
			try {
				new CorrectRenderer();
			} catch (e) {
				errorMessage = e.message;
			}
			window.onerror = oldErrorHandler;
			assert.isNull(errorMessage, "error not expected");
		}
	});
});
