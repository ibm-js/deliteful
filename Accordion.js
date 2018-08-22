/** @module deliteful/Accordion */
define([
	"dcl/dcl",
	"decor/sniff",
	"requirejs-dplugins/Promise!",
	"delite/register",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/DisplayContainer",
	"./Accordion/AccordionHeader",
	"./features",
	"delite/theme!./Accordion/themes/{{theme}}/Accordion.css"
], function (dcl, has, Promise, register, $, DisplayContainer, AccordionHeader) {

	function setVisibility(node, val) {
		node.style.display = val ? "" : "none";
	}

	function listenAnimationEndEvent(element) {
		return new Promise(function (resolve) {
			var handler = element.on(has("animationEndEvent"), function () {
				handler.remove();
				resolve();
			});
		});
	}

	/* Accordion modes */
	var accordionModes = {
		singleOpen: "singleOpen", // default
		multipleOpen: "multipleOpen"
	};

	var defaultMode = accordionModes.singleOpen;

	/**
	 * A layout container that displays a vertically stacked list of Panels whose titles are all visible, but only one
	 * or at least one panel's content is visible at a time (depending on the `mode` property value).
	 *
	 * Once the panels are in an Accordion, they become collapsible.
	 *
	 * When a panel is open, it fills all the available space with its content.
	 *
	 * @example
	 * <d-accordion id="accordion" selectedChildId="panel1">
	 *     <d-panel id="panel1">...</d-panel>
	 *     <d-panel id="panel2">...</d-panel>
	 *     <d-panel id="panel3">...</d-panel>
	 * </d-accordion>
	 * @class module:deliteful/Accordion
	 * @augments module:delite/DisplayContainer
	 */
	return register("d-accordion", [HTMLElement, DisplayContainer], /** @lends module:deliteful/Accordion# */ {
		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-accordion"
		 */
		baseClass: "d-accordion",

		/**
		 * The id of the panel to be open at initialization.
		 * If not specified, the default open panel is the first one.
		 * @member {string}
		 * @default ""
		 */
		selectedChildId: "",

		/**
		 * The mode of the Accordion
		 * `mode` is one of `["singleOpen", "multipleOpen"]`.
		 * @member {string}
		 * @default "singleOpen"
		 */
		mode: defaultMode,

		/**
		 * Allow all the accordion panes to be closed.
		 * @member {boolean}
		 * @default false
		 */
		allowAllClosed: false,

		/**
		 * If true, animation is used when a panel is opened or closed.
		 * @member {boolean}
		 * @default true
		 */
		animate: true,

		/**
		 * The default CSS class to apply to DOMNode in panel headers to make them display an icon when they are
		 * open.  If a child panel has its own openIconClass specified, that value is used on that panel.
		 * @member {string}
		 * @default ""
		 */
		openIconClass: "",

		/**
		 * The default CSS class to apply to DOMNode in panel headers to make them display an icon when they are
		 * closed.  If a child panel has its own closedIconClass specified, that value is used on that panel.
		 * @member {string}
		 * @default ""
		 */
		closedIconClass: "",

		/**
		 * The aria-level value to set on accordion headers.
		 * @member {number}
		 * @default 3
		 */
		ariaLevel: 3,

		/**
		 * List of upgraded panels (i.e. `<d-panel>` widgets that have already run constructor() and
		 * connectedCallback()).
		 * @member {module:delite/Panel[]}
		 */
		_panelList: null,

		_numOpenPanels: 0,

		postRender: function () {
			this._panelList = [];

			// Declarative case (panels specified declaratively inside the declarative Accordion).
			var panels = Array.prototype.slice.call(this.children);	// copy array since we'll be adding more children
			for (var i = 0, l = panels.length; i < l; i++) {
				if (!panels[i].attached) {
					this._setupNonUpgradedChild(panels[i]);
				} else {
					this._panelList.push(this._setupUpgradedChild(panels[i]));
				}
			}

			this.on("delite-remove-child", this._onRemoveChild.bind(this));
			this.on("keydown", this.keyDownHandler.bind(this));

			// Process clicks on header's <button aria-controls="panelId"> to open associated panel.
			// Ignore clicks on other buttons or controls in headers or panels.  Click may occur on the
			// <span> inside the <button> (at least on Chrome), so trace up until <button> is found.
			this.on("click", function (event) {
				for (var target = event.target; target !== this; target = target.parentNode) {
					var panelId = target.getAttribute("aria-controls"),
						panel = panelId && this.ownerDocument.getElementById(panelId);
					if (panel && panel.parentNode === this) {
						event.stopPropagation();
						event.preventDefault();
						this.activatePanel(panel);
						break;
					}
				}
			}.bind(this));
		},

		/**
		 * Open a panel due to a click or spacebar on the panel header.
		 * @param panel
		 */
		activatePanel: function (panel) {
			if (panel.open) {
				if (this.mode === accordionModes.multipleOpen || this.allowAllClosed) {
					this.hide(panel);
				}
			} else {
				this.show(panel);
			}
		},

		/**
		 * Overridable method to create the header corresponding to a panel.
		 * The header displays the panel's title, and the user clicks it to open the panel.
		 * @param panel
		 */
		createHeader: function (panel, params) {
			return new AccordionHeader(params);
		},

		_setupUpgradedChild: function (panel) {
			// Panel must have id for the rest of this code to work.
			if (!panel.id) {
				panel.id = panel.widgetId;
			}

			// Create the header (that displays the panel's title).
			// Note: Be sure to call header.deliver() before adding the header to the Accordion, so
			// that Accordion#onAddChild() can detect that it's a header, and ignore it.
			var header = this.createHeader(panel, {
				id: panel.id + "-header",
				label: panel.label,
				openIconClass: panel.openIconClass || this.openIconClass,
				closedIconClass: panel.closedIconClass || this.closedIconClass,
				panelId: panel.id
			});
			if (this.ariaLevel) {
				header.setAttribute("aria-level", this.ariaLevel);
			}
			header.deliver();

			header.placeAt(panel, "before");

			// React to programmatic changes on the panel to update the header.
			header.own(panel.observe(function (oldValues) {
				if ("label" in oldValues) {
					header.label = panel.label;
				}
				if ("openIconClass" in oldValues) {
					header.openIconClass = panel.openIconClass;
				}
				if ("closedIconClass" in oldValues) {
					header.closedIconClass = panel.closedIconClass;
				}
			}));

			// And set up the panel itself.
			setVisibility(panel, false);
			panel.open = false;
			panel.setAttribute("role", "region");
			panel.setAttribute("aria-labelledby", header.labelNode.id);
			panel.setAttribute("aria-hidden", "true");
			panel.headerNode = header;

			return panel;
		},

		_setupNonUpgradedChild: function (panel) {
			var attachListener;
			panel.accordion = this;
			panel.addEventListener("customelement-attached", attachListener = function () {
				this.removeEventListener("customelement-attached", attachListener);
				this.accordion._panelList.push(this.accordion._setupUpgradedChild(this));
			}.bind(panel));
		},

		/**
		 * If no panel is shown then show the first one.
		 * @private
		 */
		_showOpenPanel: function () {
			if (!this._selectedChild && this._panelList.length > 0) {
				this._selectedChild = this._panelList[0];
				this.show(this._selectedChild);
			}
		},

		getChildren: function () {
			// Override getChildren() to only return the panels, not the headers
			return Array.prototype.filter.call(this.children, function (element) {
				return element.getAttribute("role") === "region";
			});
		},

		getHeaders: function () {
			return Array.prototype.filter.call(this.children, function (element) {
				return element.getAttribute("role") === "heading";
			});
		},

		refreshRendering: function (props) {
			/* jshint maxcomplexity: 14 */
			if ("selectedChildId" in props && this.selectedChildId) {
				var childNode = this.ownerDocument.getElementById(this.selectedChildId);
				if (childNode) {
					if (childNode.attached) {
						if (childNode !== this._selectedChild) { // To avoid calling show() method twice
							if (!this._selectedChild) { // If selectedChild is not initialized, then initialize it
								this._selectedChild = childNode;
							}
							this.show(childNode);
						}
					} else {
						// TODO: don't we need to set up a listener for when the child finishes initializing,
						// to call show() then?
						this._selectedChild = childNode;
					}
				}
			}

			// If no panel was selected, then show the first one.
			if (("attached" in props || "_panelList" in  props) && this._panelList.length > 0 &&
					!this.allowAllClosed) {
				this._showOpenPanel();
			}

			if ("openIconClass" in props) {
				this.getChildren().forEach(function (panel) {
					if (panel.attached && !panel.openIconClass) {
						panel.headerNode.openIconClass = this.openIconClass;
					}
				}.bind(this));
			}
			if ("closedIconClass" in props) {
				this.getChildren().forEach(function (panel) {
					if (panel.attached && !panel.closedIconClass) {
						panel.headerNode.closedIconClass = this.closedIconClass;
					}
				}.bind(this));
			}
			if ("mode" in props) {
				if (this.mode === accordionModes.singleOpen) {
					if (!this.allowAllClosed) {
						this._showOpenPanel();
					}
					if (this._selectedChild) {
						this._panelList.forEach(function (panel) {
							if (panel.open && panel !== this._selectedChild) {
								this.hide(panel);
							}
						}.bind(this));
					}
				}
			}
		},

		_useAnimation: function () {
			return (this.animate && (function () {
				// Animation events are broken if the widget is not visible
				var parent = this;
				while (parent && parent.style.display !== "none" && parent !== this.ownerDocument.documentElement) {
					parent = parent.parentNode;
				}
				var visible =  parent === this.ownerDocument.documentElement;

				// Flexbox animation is not supported on IE
				// TODO: Create a feature test for flexbox animation
				return (!!has("animationEndEvent") && visible && (!has("ie")));
			}.bind(this))());
		},

		_doTransition: function (panel, params) {
			var promise;
			if (params.hide) {
				if (this._useAnimation()) {
					// To avoid hiding the panel title bar on animation
					$(panel).addClass("d-accordion-close-animation").removeClass("d-accordion-open-panel");
					panel.style.overflow = "hidden"; //To avoid scrollBar on animation
					promise = listenAnimationEndEvent(panel).then(function () {
						setVisibility(panel, panel.open);
						$(panel).removeClass("d-accordion-close-animation");
						panel.style.overflow = "";
					});
				} else {
					$(panel).removeClass("d-accordion-open-panel");
					setVisibility(panel, false);
				}
			} else {
				if (this._useAnimation()) {
					$(panel).addClass("d-accordion-open-animation");
					setVisibility(panel, true);
					panel.style.overflow = "hidden"; //To avoid scrollBar on animation
					promise = listenAnimationEndEvent(panel).then(function () {
						$(panel).addClass(function () {
							return panel.open ? "d-accordion-open-panel" : "";
						}).removeClass("d-accordion-open-animation");
						panel.style.overflow = "";
						panel.style.minHeight = "";
					});
				} else {
					$(panel).addClass("d-accordion-open-panel");
					setVisibility(panel, true);
				}
			}
			return Promise.resolve(promise);
		},

		changeDisplay: function (widget, params) {
			var valid = true, promises = [];
			if (params.hide) {
				if (widget.open) {
					if (this._numOpenPanels > 1 || this.allowAllClosed) {
						this._numOpenPanels--;
						widget.open = false;
						widget.headerNode.open = false;
					} else {
						widget.headerNode.open = true;
						valid = false;
					}
				} else {
					widget.headerNode.open = false;
					valid = false;
				}
			} else {
				if (!widget.open) {
					this._numOpenPanels++;
					if (this.mode === accordionModes.singleOpen) {
						var origin = this._selectedChild;
						this._selectedChild = widget;
						this.selectedChildId = widget.id;
						if (origin && origin !== widget) {
							promises.push(this.hide(origin));
						}
					}
					widget.open = true;
					widget.headerNode.open = true;
				} else {
					widget.headerNode.open = true;
					valid = false;
				}
			}
			if (valid) {
				promises.push(this._doTransition(widget, params));
				// Update WAI-ARIA attributes.
				widget.setAttribute("aria-hidden", "" + !widget.open);
			}
			return Promise.all(promises);
		},

		/**
		 * This method must be called to hide the content of a particular child Panel on this container.
		 * The parameter 'params' is optional and only used to specify the content to load on the panel specified.
		 * @method module:deliteful/Accordion#hide
		 * @param {Element|string} dest - Element or Element id that points to the Panel whose content must be hidden
		 * @param {Object} [params] - A hash like {contentId: "newContentId"}. The 'contentId' is the id of the element
		 * to load as content of the Panel.
		 * @returns {Promise} A promise that will be resolved when the display and transition effect will have
		 * been performed.
		 * @fires module:delite/DisplayContainer#delite-display-load
		 * @fires module:delite/DisplayContainer#delite-before-hide
		 * @fires module:delite/DisplayContainer#delite-after-hide
		 */

		/**
		 * This method must be called to display the content of a particular child Panel on this container.
		 * The parameter 'params' is optional and only used to specify the content to load on the panel specified.
		 * loadChild() is used to do this, so a controller could load/create the content by listening the
		 * `delite-display-load` event.
		 * @method module:deliteful/Accordion#show
		 * @param {Element|string} dest - Element or Element id that points to the Panel whose content must be shown
		 * @param {Object} [params] - A hash like {contentId: "newContentId"}. The 'contentId' is the id of the element
		 * to load as content of the Panel.
		 * @returns {Promise} A promise that will be resolved when the display and transition effect will have
		 * been performed.
		 * @fires module:delite/DisplayContainer#delite-display-load
		 * @fires module:delite/DisplayContainer#delite-before-show
		 * @fires module:delite/DisplayContainer#delite-after-show
		 */

		/**
		 * This method must be called to load a particular child on this container.
		 * A `delite-display-load` event is fired giving the chance to a controller to load/create the child by using
		 * the event's setChild() method (the child has to be a deliteful/Panel Element) and/or to load/create
		 * the content for a Panel by using the event's setContent() method. This last method takes as first parameter
		 * the deliteful/Panel Element and as second parameter the Element to load as content for the panel.
		 * @method
		 * @param {Element|string} dest  - Element or Element id that points to the child this container must
		 * load.
		 * @param {Object} [params] - A hash like {contentId: "newContentId"}. The 'contentId' is the id passed to the
		 * controller to load/create an element as content of the Panel.
		 * @returns {Promise} A promise that will be resolved when the child will have been
		 * loaded with an object of the following form: `{ child: panelElement }` or with an optional index
		 * `{ child: panelElement, index: index }`.
		 * @fires module:delite/DisplayContainer#delite-display-load
		 */
		loadChild: dcl.superCall(function (sup) {
			return function (dest, params) {
				var event = params ? Object.create(params) : {};
				event.setContent = function (panel, content) {
					panel.innerHTML = "";
					while (content.firstChild) {
						panel.appendChild(content.firstChild);
					}
				};
				return sup.apply(this, [dest, event]);
			};
		}),

		onAddChild: dcl.superCall(function (sup) {
			return function (node) {
				var res = sup.call(this, node);
				if (node.getAttribute("role") !== "heading") {
					// Process new panels (but not the headers created to go along with the panels).
					this._panelList.push(this._setupUpgradedChild(node));
					this.notifyCurrentValue("_panelList");
				}
				return res;
			};
		}),

		_onRemoveChild: function (event) {
			// If panel was removed, then destroy associated header and update this._panelList.
			// Ignore notification for removed header.

			var panel = event.child;
			if (panel.headerNode) {
				panel.headerNode.destroy();
			}

			var index = this._panelList.indexOf(panel);
			if (index >= 0) {
				this._panelList.splice(index, 1);
				this.notifyCurrentValue("_panelList");
			}
		},

		// Keyboard navigation is based on WAI-ARIA Pattern for Accordion:
		// https://www.w3.org/TR/wai-aria-practices/#accordion

		_getEnclosingHeader: function (node) {
			while (node && node !== this) {
				if (node.getAttribute("role") === "heading") {
					return node;
				}
				node = node.parentElement;
			}
		},

		_getEnclosingPanel: function (node) {
			while (node && node !== this) {
				if (node.getAttribute("role") === "region") {
					return node;
				}
				node = node.parentElement;
			}
		},

		keyDownHandler: function (evt) {
			// Handle keystrokes from headers.
			var headers = this.getHeaders();

			// Return next (offset=1) or previous (offset=-1) header, with looping.
			function nextPrevHeader(header, offset) {
				var idx = headers.indexOf(header),
					newIdx = (idx + headers.length + offset) % headers.length;
				return headers[newIdx];
			}

			// Return the new header to navigate to given the specified focusedHeader and the keydown event.
			function headerKeystrokeHandler(focusedHeader, evt) {
				switch (((evt.ctrlKey || evt.metaKey) ? "Ctrl-" : "") + evt.key) {
				case "ArrowDown":
					return nextPrevHeader(focusedHeader, 1);
				case "ArrowUp":
					return nextPrevHeader(focusedHeader, -1);
				case "Home":
					return headers[0];
				case "End":
					return headers[headers.length - 1];
				case "Ctrl-PageDown":
					return nextPrevHeader(focusedHeader, 1);
				case "Ctrl-PageUp":
					return nextPrevHeader(focusedHeader, -1);
				}
			}

			// Return the new header to navigate to given the specified focused panel and the keydown event.
			function panelKeystrokeHandler(focusedPanel, evt) {
				if (evt.ctrlKey || evt.metaKey) {
					if (evt.key === "PageUp") {
						return focusedPanel.headerNode;
					} else if (evt.key === "PageDown") {
						return nextPrevHeader(focusedPanel.headerNode, 1);
					}
				}
			}

			// Handle keystroke on headers and panels.
			var focusedHeader = this._getEnclosingHeader(evt.target);
			var newHeader;
			if (focusedHeader) {
				newHeader =  headerKeystrokeHandler(focusedHeader, evt);
			} else {
				var focusedPanel = this._getEnclosingPanel(evt.target);
				if (focusedPanel) {
					newHeader = panelKeystrokeHandler(focusedPanel, evt);
				}
			}
			if (newHeader) {
				newHeader.focus();
				evt.stopPropagation();
				evt.preventDefault();
			}
		},

		focus: function () {
			// Navigate to first header, regardless of which panels are open.
			// Seems to be what Aria 1.1 Accordion spec implies.
			var headers = this.getHeaders();
			headers[0].focus();
		}
	});
});
