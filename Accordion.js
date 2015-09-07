/** @module deliteful/Accordion */
define([
	"dcl/dcl",
	"decor/sniff",
	"requirejs-dplugins/Promise!",
	"delite/register",
	"delite/KeyNav",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/DisplayContainer",
	"./ToggleButton",
	"./features",
	"delite/theme!./Accordion/themes/{{theme}}/Accordion.css"
], function (dcl, has, Promise, register, KeyNav, $, DisplayContainer, ToggleButton) {

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
	 * Once the panels are in an accordion, they become collapsible Panels by replacing their headers by ToggleButtons.
	 *
	 * When a panel is open, it fills all the available space with its content.
	 *
	 * @example:
	 * <d-accordion id="accordion" selectedChildId="panel1">
	 *     <d-panel id="panel1">...</d-panel>
	 *     <d-panel id="panel2">...</d-panel>
	 *     <d-panel id="panel3">...</d-panel>
	 * </d-accordion>
	 * @class module:deliteful/Accordion
	 * @augments module:delite/DisplayContainer
	 */
	return register("d-accordion", [HTMLElement, DisplayContainer, KeyNav], /** @lends module:deliteful/Accordion# */ {
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
		 * If true, animation is used when a panel is opened or closed.
		 * @member {boolean}
		 * @default true
		 */
		animate: true,

		/**
		 * The default CSS class to apply to DOMNode in children headers to make them display an icon when they are
		 * open. If a child panel has its own iconClass specified, that value is used on that panel.
		 * @member {string}
		 * @default ""
		 */
		openIconClass: "",

		/**
		 * The default CSS class to apply to DOMNode in children headers to make them display an icon when they are
		 * closed. If a child panel has its own closedIconClass specified, that value is used on that panel.
		 * @member {string}
		 * @default ""
		 */
		closedIconClass: "",

		/**
		 * List of upgraded panels (i.e. `<d-panel>` widgets that have already run createdCallback() and
		 * attachedCallback()).
		 * @member {module:delite/Panel[]}
		 */
		_panelList: null,

		_numOpenPanels: 0,

		_changeHandler: function (event) {
			var panel = event.target.parentNode;
			// Case when the event is fired by the label or the icon
			if (panel.nodeName.toLowerCase() !== "d-panel") {
				panel = panel.parentNode;
			}
			switch (this.mode) {
			case accordionModes.singleOpen :
				this.show(panel);
				break;
			case accordionModes.multipleOpen :
				if (panel.open) {
					this.hide(panel);
				} else {
					this.show(panel);
				}
				break;
			default :
				break;
			}
		},

		_setupUpgradedChild: function (panel) {
			// TODO: To change when https://github.com/ibm-js/delite/issues/414 be solved
			var toggle = new ToggleButton({
				label: panel.label,
				iconClass: panel.closedIconClass || this.closedIconClass,
				checkedIconClass: panel.iconClass || this.openIconClass,
				id: panel.id + "_button"
			});
			toggle.placeAt(panel.headerNode, "replace");
			// React to programmatic changes on the panel to update the button
			panel.observe(function (oldValues) {
				if ("label" in oldValues) {
					this.headerNode.label = this.label;
				}
				if ("iconClass" in oldValues) {
					this.headerNode.checkedIconClass = this.iconClass;
				}
				if ("closedIconClass" in oldValues) {
					this.headerNode.iconClass = this.closedIconClass;
				}
			}.bind(panel));
			toggle.on("click", this._changeHandler.bind(this));
			panel.headerNode = toggle;
			setVisibility(panel.containerNode, false);
			panel.open = false;
			// Setting initial WAI-ARIA properties
			panel.headerNode.setAttribute("tabindex", "-1");
			panel.headerNode.setAttribute("role", "tab");
			panel.headerNode.setAttribute("aria-expanded", "false");
			panel.headerNode.setAttribute("aria-selected", "false");
			panel.containerNode.setAttribute("role", "tabpanel");
			panel.containerNode.setAttribute("aria-labelledby", panel.headerNode.id);
			panel.containerNode.setAttribute("aria-hidden", "true");
			return panel;
		},

		_setupNonUpgradedChild: function (panel) {
			panel.accordion = this;
			panel.addEventListener("customelement-attached", this._attachedlistener = function () {
				this.removeEventListener("customelement-attached", this.accordion._attachedlistener);
				this.accordion._panelList.push(this.accordion._setupUpgradedChild(this));
			}.bind(panel));
		},

		createdCallback: function () {
			this._panelList = [];

			// Declarative case (panels specified declaratively inside the declarative Accordion).
			var panels = this.querySelectorAll("d-panel");
			for (var i = 0, l = panels.length; i < l; i++) {
				if (!panels[i].attached) {
					this._setupNonUpgradedChild(panels[i]);
				} else {
					this._panelList.push(this._setupUpgradedChild(panels[i]));
				}
			}
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

		computeProperties: function (props) {
			if ("mode" in props) {
				if (!(this.mode in accordionModes)) {
					this.mode = props.mode;
				}
			}
		},

		/* jshint maxcomplexity: 14 */
		refreshRendering: function (props) {
			if ("selectedChildId" in props) {
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
			if (("attached" in props || "_panelList" in  props) && this._panelList.length > 0) {
				this._showOpenPanel();
			}

			if ("openIconClass" in props) {
				this.getChildren().forEach(function (panel) {
					if (panel.attached && !panel.iconClass) {
						panel.headerNode.checkedIconClass = this.openIconClass;
					}
				}.bind(this));
			}
			if ("closedIconClass" in props) {
				this.getChildren().forEach(function (panel) {
					if (panel.attached && !panel.closedIconClass) {
						panel.headerNode.iconClass = this.closedIconClass;
					}
				}.bind(this));
			}
			if ("mode" in props) {
				this.setAttribute("aria-multiselectable", this.mode === accordionModes.multipleOpen);
				if (this.mode === accordionModes.singleOpen) {
					this._showOpenPanel();
					this._panelList.forEach(function (panel) {
						if (panel.open && panel !== this._selectedChild) {
							this.hide(panel);
						}
					}.bind(this));
				}
			}
		},
		/* jshint maxcomplexity: 10 */

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
					panel.style.minHeight = window.getComputedStyle(panel.headerNode).getPropertyValue("height");
					$(panel).addClass("d-accordion-closeAnimation").removeClass("d-accordion-open-panel");
					$(panel.containerNode).removeClass("d-panel-content-open");
					panel.containerNode.style.overflow = "hidden"; //To avoid scrollBar on animation
					promise = listenAnimationEndEvent(panel).then(function () {
						setVisibility(panel.containerNode, panel.open);
						$(panel).removeClass("d-accordion-closeAnimation");
						panel.containerNode.style.overflow = "";
						panel.style.minHeight = "";
					});
				} else {
					$(panel).removeClass("d-accordion-open-panel");
					$(panel.containerNode).removeClass("d-panel-content-open");
					setVisibility(panel.containerNode, false);
				}
			} else {
				if (this._useAnimation()) {
					// To avoid hiding the panel title bar on animation
					panel.style.minHeight = window.getComputedStyle(panel.headerNode).getPropertyValue("height");
					$(panel).addClass("d-accordion-openAnimation");
					$(panel.containerNode).addClass("d-panel-content-open");
					setVisibility(panel.containerNode, true);
					panel.containerNode.style.overflow = "hidden"; //To avoid scrollBar on animation
					promise = listenAnimationEndEvent(panel).then(function () {
						$(panel).addClass(function () {
							return panel.open ? "d-accordion-open-panel" : "";
						}).removeClass("d-accordion-openAnimation");
						panel.containerNode.style.overflow = "";
						panel.style.minHeight = "";
					});
				} else {
					$(panel).addClass("d-accordion-open-panel");
					$(panel.containerNode).addClass("d-panel-content-open");
					setVisibility(panel.containerNode, true);
				}
			}
			return Promise.resolve(promise);
		},

		changeDisplay: function (widget, params) {
			var valid = true, promises = [];
			if (params.hide) {
				if (widget.open) {
					if (this._numOpenPanels > 1) {
						this._numOpenPanels--;
						widget.open = false;
						widget.headerNode.checked = false;
					} else {
						widget.headerNode.checked = true;
						valid = false;
					}
				} else {
					widget.headerNode.checked = false;
					valid = false;
				}
			} else {
				if (!widget.open) {
					this._numOpenPanels++;
					if (this.mode === accordionModes.singleOpen) {
						var origin = this._selectedChild;
						this._selectedChild = widget;
						this.selectedChildId = widget.id;
						if (origin !== widget) {
							promises.push(this.hide(origin));
						}
					}
					widget.open = true;
					widget.headerNode.checked = true;
				} else {
					widget.headerNode.checked = true;
					valid = false;
				}
			}
			if (valid) {
				promises.push(this._doTransition(widget, params));
				//Updating WAI-ARIA properties
				widget.headerNode.setAttribute("aria-selected", widget.open);
				widget.headerNode.setAttribute("aria-expanded", widget.open);
				widget.containerNode.setAttribute("aria-hidden", !widget.open);
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
				var event = {
					setContent: function (panel, content) {
						panel.replaceChild(content, panel.containerNode);
						panel.containerNode = content;
						$(panel.containerNode).addClass("d-panel-content");
					}
				};
				dcl.mix(event, params);
				return sup.apply(this, [dest, event]);
			};
		}),

		onAddChild: dcl.superCall(function (sup) {
			return function (node) {
				var res = sup.call(this, node);
				this._panelList.push(this._setupUpgradedChild(node));
				this.notifyCurrentValue("_panelList");
				return res;
			};
		}),

		_onRemoveChild: function (event) {
			this._panelList.splice(this._panelList.indexOf(event.child), 1);
			this.notifyCurrentValue("_panelList");
		},

		//////////// delite/KeyNav implementation ///////////////////////////////////////
		// Keyboard navigation is based on WAI-ARIA Pattern for Accordion:
		// http://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/#accordion
		descendantSelector: "d-panel>.d-toggle-button",

		previousKeyHandler: function () {
			var focusedPanel = this.navigatedDescendant.parentNode;
			this.navigateTo(focusedPanel.previousElementSibling ? focusedPanel.previousElementSibling.headerNode
				: this.lastElementChild.headerNode);
		},

		nextKeyHandler: function () {
			var focusedPanel = this.navigatedDescendant.parentNode;
			this.navigateTo(focusedPanel.nextElementSibling ? focusedPanel.nextElementSibling.headerNode
				: this.firstElementChild.headerNode);
		},

		upKeyHandler: function () {
			this.previousKeyHandler();
		},

		downKeyHandler: function () {
			this.nextKeyHandler();
		},

		_lastFocusedDescendant: null,

		focus: function () {
			this._lastFocusedDescendant ? this.navigateTo(this._lastFocusedDescendant) : this.navigateToFirst();
		},

		_keynavDeactivatedHandler: dcl.superCall(function (sup) {
			return function () {
				this._lastFocusedDescendant = this.navigatedDescendant;
				sup.call(this);
			};
		}),

		postRender: function () {
			this.setAttribute("role", "tablist");
			this.setAttribute("aria-multiselectable", "false");
			this.on("delite-remove-child", this._onRemoveChild.bind(this));
		}

	});
});