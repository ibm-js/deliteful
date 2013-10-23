define([
	"require",			// require.toUrl
	"dojo/_base/config",
	"dojo/dom-construct", // domConstruct.create
	"dojo/dom-style", // domStyle.set
	"dojo/_base/lang", // lang.extend
	"dojo/on",
	"dojo/sniff" // has("ie"), has("mozilla"), has("quirks")
], function (require, config, domConstruct, domStyle, lang, on, has) {

	// module:
	//		dui/BackgroundIFrame

	// Flag for whether to create background iframe behind popups like Menus and Dialog.
	// A background iframe is useful to prevent problems with popups appearing behind applets/pdf files.
	has.add("config-bgIframe", false);

	// TODO: remove _frames, it isn't being used much, since popups never release their
	// iframes (see [22236])
	var _frames = new function () {
		// summary:
		//		cache of iframes

		var queue = [];

		this.pop = function () {
			var iframe;
			if (queue.length) {
				iframe = queue.pop();
				iframe.style.display = "";
			} else {
				// transparency needed for DialogUnderlay and for tooltips on IE (to see screen near connector)
				if (has("ie") < 9) {
					var burl = config.dojoBlankHtmlUrl || require.toUrl("dojo/resources/blank.html") ||
						"javascript:\"\"";
					var html = "<iframe src='" + burl + "' role='presentation'"
						+ " style='position: absolute; left: 0px; top: 0px;"
						+ "z-index: -1; filter:Alpha(Opacity=\"0\");'>";
					iframe = document.createElement(html);
				} else {
					iframe = domConstruct.create("iframe");
					iframe.src = "javascript:''";
					iframe.className = "duiBackgroundIframe";
					iframe.setAttribute("role", "presentation");
					domStyle.set(iframe, "opacity", 0.1);
				}

				// Magic to prevent iframe from getting focus on tab keypress - as style didn't work.
				iframe.tabIndex = -1;
			}
			return iframe;
		};

		this.push = function (iframe) {
			iframe.style.display = "none";
			queue.push(iframe);
		};
	}();


	var BackgroundIframe = function (/*DomNode*/ node) {
		// summary:
		//		For IE/FF z-index shenanigans. id attribute is required.
		//
		// description:
		//		new BackgroundIframe(node).
		//
		//		Makes a background iframe as a child of node, that fills
		//		area (and position) of node

		if (!node.id) {
			throw new Error("no id");
		}
		if (has("config-bgIframe")) {
			var iframe = (this.iframe = _frames.pop());
			node.appendChild(iframe);
			domStyle.set(iframe, {
				width: "100%",
				height: "100%"
			});
		}
	};

	lang.extend(BackgroundIframe, {
		destroy: function () {
			// summary:
			//		destroy the iframe
			if (this._conn) {
				this._conn.remove();
				this._conn = null;
			}
			if (this.iframe) {
				_frames.push(this.iframe);
				delete this.iframe;
			}
		}
	});

	return BackgroundIframe;
});
