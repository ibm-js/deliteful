define([
	"dojo/dom", // dom.byId
	"dojo/_base/lang",
	"dojo/_base/window",
	"dui/focus"
], function (dom, lang, baseWindow, focus) {

	// module:
	//		dui/selection

	var SelectionManager = function (win) {
		// summary:
		//		Class for monitoring / changing the selection (typically highlighted text) in a given window
		// win: Window
		//		The window to monitor/adjust the selection on.

		var doc = win.document;

		this.getType = function () {
			// summary:
			//		Get the selection type (like doc.select.type in IE).

			var stype = "text";

			// Check if the actual selection is a CONTROL (IMG, TABLE, HR, etc...).
			var oSel;
			try {
				oSel = win.getSelection();
			} catch (e) { /*squelch*/
			}

			if (oSel && oSel.rangeCount == 1) {
				var oRange = oSel.getRangeAt(0);
				if ((oRange.startContainer == oRange.endContainer) &&
					((oRange.endOffset - oRange.startOffset) == 1) &&
					(oRange.startContainer.nodeType != 3 /* text node*/)
					) {
					stype = "control";
				}
			}
			return stype; //String
		};

		this.getSelectedText = function () {
			// summary:
			//		Return the text (no html tags) included in the current selection or null if no text is selected

			var selection = win.getSelection();
			return selection ? selection.toString() : ""; //String
		};

		this.getSelectedHtml = function () {
			// summary:
			//		Return the html text of the current selection or null if unavailable

			var selection = win.getSelection();
			if (selection && selection.rangeCount) {
				var i;
				var html = "";
				for (i = 0; i < selection.rangeCount; i++) {
					//Handle selections spanning ranges, such as Opera
					var frag = selection.getRangeAt(i).cloneContents();
					var div = doc.createElement("div");
					div.appendChild(frag);
					html += div.innerHTML;
				}
				return html; //String
			}
			return null;
		};

		this.getSelectedElement = function () {
			// summary:
			//		Retrieves the selected element (if any), just in the case that
			//		a single element (object like and image or a table) is
			//		selected.
			if (this.getType() == "control") {
				var selection = win.getSelection();
				return selection.anchorNode.childNodes[ selection.anchorOffset ];
			}
			return null;
		};

		this.getParentElement = function () {
			// summary:
			//		Get the parent element of the current selection
			if (this.getType() == "control") {
				var p = this.getSelectedElement();
				if (p) {
					return p.parentNode;
				}
			} else {
				var selection = doc.getSelection();
				if (selection) {
					var node = selection.anchorNode;
					while (node && (node.nodeType != 1)) { // not an element
						node = node.parentNode;
					}
					return node;
				}
			}
			return null;
		};

		this.hasAncestorElement = function (/*String*/ tagName /* ... */) {
			// summary:
			//		Check whether current selection has a  parent element which is
			//		of type tagName (or one of the other specified tagName)
			// tagName: String
			//		The tag name to determine if it has an ancestor of.
			return this.getAncestorElement.apply(this, arguments) != null; //Boolean
		};

		this.getAncestorElement = function (/*String*/ tagName /* ... */) {
			// summary:
			//		Return the parent element of the current selection which is of
			//		type tagName (or one of the other specified tagName)
			// tagName: String
			//		The tag name to determine if it has an ancestor of.
			var node = this.getSelectedElement() || this.getParentElement();
			return this.getParentOfType(node, arguments); //DOMNode
		};

		this.isTag = function (/*DomNode*/ node, /*String[]*/ tags) {
			// summary:
			//		Function to determine if a node is one of an array of tags.
			// node:
			//		The node to inspect.
			// tags:
			//		An array of tag name strings to check to see if the node matches.
			if (node && node.tagName) {
				var _nlc = node.tagName.toLowerCase();
				for (var i = 0; i < tags.length; i++) {
					var _tlc = String(tags[i]).toLowerCase();
					if (_nlc == _tlc) {
						return _tlc; // String
					}
				}
			}
			return "";
		};

		this.getParentOfType = function (/*DomNode*/ node, /*String[]*/ tags) {
			// summary:
			//		Function to locate a parent node that matches one of a set of tags
			// node:
			//		The node to inspect.
			// tags:
			//		An array of tag name strings to check to see if the node matches.
			while (node) {
				if (this.isTag(node, tags).length) {
					return node; // DOMNode
				}
				node = node.parentNode;
			}
			return null;
		};

		this.collapse = function (/*Boolean*/ beginning) {
			// summary:
			//		Function to collapse (clear), the current selection
			// beginning: Boolean
			//		Indicates whether to collapse the cursor to the beginning of the selection or end.

			var selection = win.getSelection();
			if (selection.removeAllRanges) { // Mozilla
				if (beginning) {
					selection.collapseToStart();
				} else {
					selection.collapseToEnd();
				}
			} else { // Safari
				// pulled from WebCore/ecma/kjs_window.cpp, line 2536
				selection.collapse(beginning);
			}
		};

		this.remove = function () {
			// summary:
			//		Function to delete the currently selected content from the document.
			var sel = doc.selection;

			sel = win.getSelection();
			sel.deleteFromDocument();
			return sel; //Selection
		};

		this.selectElementChildren = function (/*DomNode*/ element, /*Boolean?*/ nochangefocus) {
			// summary:
			//		clear previous selection and select the content of the node
			//		(excluding the node itself)
			// element: DOMNode
			//		The element you wish to select the children content of.
			// nochangefocus: Boolean
			//		Indicates if the focus should change or not.

			var range;
			element = dom.byId(element);

			var selection = win.getSelection();
			selection.selectAllChildren(element);
		};

		this.selectElement = function (/*DomNode*/ element) {
			// summary:
			//		clear previous selection and select element (including all its children)
			// element: DOMNode
			//		The element to select.

			var selection = doc.getSelection(),
				range = doc.createRange();
			if (selection.removeAllRanges) { // Mozilla
				range.selectNode(element);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		};

		this.inSelection = function (node) {
			// summary:
			//		This function determines if 'node' is
			//		in the current selection.
			// tags:
			//		public
			if (node) {
				var newRange;
				var range;

				var sel = win.getSelection();
				if (sel && sel.rangeCount > 0) {
					range = sel.getRangeAt(0);
				}
				if (range && range.compareBoundaryPoints && doc.createRange) {
					try {
						newRange = doc.createRange();
						newRange.setStart(node, 0);
						if (range.compareBoundaryPoints(range.START_TO_END, newRange) === 1) {
							return true;
						}
					} catch (e) { /* squelch */
					}
				}
			}
			return false; // Boolean
		};

		this.getBookmark = function () {
			// summary:
			//		Retrieves a bookmark that can be used with moveToBookmark to reselect the currently selected range.

			// TODO: merge additional code from Editor._getBookmark into this method

			var bm, rg, tg, sel = doc.selection, cf = focus.curNode;

			sel = win.getSelection();
			if (sel) {
				if (sel.isCollapsed) {
					tg = cf ? cf.tagName : "";
					if (tg) {
						// Create a fake rangelike item to restore selections.
						tg = tg.toLowerCase();
						if (tg == "textarea" ||
							(tg == "input" && (!cf.type || cf.type.toLowerCase() == "text"))) {
							sel = {
								start: cf.selectionStart,
								end: cf.selectionEnd,
								node: cf,
								pRange: true
							};
							return {isCollapsed: (sel.end <= sel.start), mark: sel}; //Object.
						}
					}
					bm = {isCollapsed: true};
					if (sel.rangeCount) {
						bm.mark = sel.getRangeAt(0).cloneRange();
					}
				} else {
					rg = sel.getRangeAt(0);
					bm = {isCollapsed: false, mark: rg.cloneRange()};
				}
			}
			return bm; // Object
		};

		this.moveToBookmark = function (/*Object*/ bookmark) {
			// summary:
			//		Moves current selection to a bookmark.
			// bookmark:
			//		This should be a returned object from getBookmark().

			// TODO: merge additional code from Editor._moveToBookmark into this method

			var mark = bookmark.mark;
			if (mark) {
				// W3C Range API (FF, WebKit, Opera, etc)
				var sel = win.getSelection();
				if (sel && sel.removeAllRanges) {
					if (mark.pRange) {
						var n = mark.node;
						n.selectionStart = mark.start;
						n.selectionEnd = mark.end;
					} else {
						sel.removeAllRanges();
						sel.addRange(mark);
					}
				} else {
					console.warn("No idea how to restore selection for this browser!");
				}
			}
		};

		this.isCollapsed = function () {
			// summary:
			//		Returns true if there is no text selected
			return this.getBookmark().isCollapsed;
		};
	};

	// singleton on the main window
	var selection = new SelectionManager(window);

	// hook for editor to use class
	selection.SelectionManager = SelectionManager;

	return selection;
});
