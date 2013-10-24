define([], function () {

	// module:
	//		dui/Bidi

	// UCC - constants that will be used by bidi support.
	var LRE = "\u202A",
		RLE = "\u202B",
		PDF = "\u202C";

	return {
		// summary:
		//		When has("dojo-bidi") is true, Widget will mixin this class.   It enables support for the textdir
		//		property to control text direction independently from the GUI direction.
		// description:
		//		There's a special need for displaying BIDI text in rtl direction
		//		in ltr GUI, sometimes needed auto support.
		//		In creation of widget, if it's want to activate this class,
		//		the widget should define the "textDir".

		// textDir: String
		//		Bi-directional support,	the main variable which is responsible for the direction of the text.
		//		The text direction can be different than the GUI direction by using this parameter in creation
		//		of a widget.
		//
		//		Allowed values:
		//
		//		1. "ltr"
		//		2. "rtl"
		//		3. "auto" - contextual the direction of a text defined by first strong letter.
		//
		//		By default is as the page direction.
		textDir: "",

		getTextDir: function (/*String*/ text) {
			// summary:
			//		Gets the right direction of text.
			// description:
			//		If textDir is ltr or rtl returns the value.
			//		If it's auto, calls to another function that responsible
			//		for checking the value, and defining the direction.
			// tags:
			//		protected.
			return this.textDir === "auto" ? this._checkContextual(text) : this.textDir;
		},

		_checkContextual: function (text) {
			// summary:
			//		Finds the first strong (directional) character, return ltr if isLatin
			//		or rtl if isBidiChar.
			// tags:
			//		private.

			// look for strong (directional) characters
			var fdc = /[A-Za-z\u05d0-\u065f\u066a-\u06ef\u06fa-\u07ff\ufb1d-\ufdff\ufe70-\ufefc]/.exec(text);
			// if found return the direction that defined by the character, else return widgets dir as default.
			return fdc ? (fdc[0] <= "z" ? "ltr" : "rtl") : this.dir ? this.dir : this.isLeftToRight() ? "ltr" : "rtl";
		},

		applyTextDir: function (/*DOMNode*/ element) {
			// summary:
			//		Set element.dir according to this.textDir, assuming this.textDir has a value.
			// element: DOMNode
			//		The text element to be set. Should have dir property.
			// tags:
			//		protected.

			if (this.textDir) {
				var textDir = this.textDir;
				if (textDir === "auto") {
					// convert "auto" to either "ltr" or "rtl"
					var tagName = element.tagName.toLowerCase();
					var text = (tagName === "input" || tagName === "textarea") ? element.value : element.textContent;
					textDir = this._checkContextual(text);
				}
				element.dir = textDir;
			}
		},

		wrapWithUcc: function (/*String*/ text) {
			// summary:
			//		Returns specified text with UCC added to enforce widget's textDir setting
			var dir = this.textDir === "auto" ? this._checkContextual(text) : this.textDir;
			return (dir === "ltr" ? LRE : RLE) + text + PDF;
		},

		enforceTextDirWithUcc: function (node) {
			// summary:
			//		Wraps by UCC (Unicode control characters) option's text according to this.textDir
			//		This function saves the original text value for later restoration if needed,
			//		for example if the textDir will change etc.
			// node: DOMNode
			//		The node we wrapping the text for.

			node.originalText = node.text;
			node.innerHTML = this.wrapWithUcc(node.innerHTML);
		},

		restoreOriginalText: function (/*DOMNode*/ origObj) {
			// summary:
			//		Restores the text of origObj, if needed, after enforceTextDirWithUcc,
			//		e.g. set("textDir", textDir).
			// origObj:
			//		The node to restore.
			// description:
			//		Sets the text of origObj to origObj.originalText, which is the original text, without the UCCs.
			//		The function than removes the originalText from origObj!
			if (origObj.originalText) {
				origObj.text = origObj.originalText;
				delete origObj.originalText;
			}
		}
	};
});
