/** @module deliteful/ViewStack */
define([
	"dcl/dcl",
	"decor/sniff",
	"requirejs-dplugins/Promise!",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/register",
	"delite/DisplayContainer",
	"delite/theme!./ViewStack/themes/{{theme}}/ViewStack.css",
	"requirejs-dplugins/css!./ViewStack/transitions/slide.css",
	"requirejs-dplugins/css!./ViewStack/transitions/reveal.css"
], function (dcl, has, Promise, $, register, DisplayContainer) {
	function setVisibility(node, val) {
		if (node) {
			if (val) {
				node.style.visibility = "visible";
				node.style.display = "";
			} else {
				node.style.visibility = "hidden";
				node.style.display = "none";
			}
		}
	}

	function setReverse(node) {
		if (node) {
			$(node).addClass("-d-view-stack-reverse");
		}
	}

	function cleanCSS(node) {
		if (node) {
			node.className = node.className.split(/ +/).filter(function (x) {
				return !/^-d-view-stack/.test(x);
			}).join(" ");
		}
	}

	function transitionClass(s) {
		return "-d-view-stack-" + s;
	}

	function mix(a, b) {
		for (var n in b) {
			a[n] = b[n];
		}
	}

	/**
	 * ViewStack container widget. Display one child at a time.
	 *
	 * The first child is displayed by default.
	 * The methods 'show' is used to change the visible child.
	 *
	 * Styling
	 * The following CSS attributes must not be changed.
	 *  ViewStack node:  position, box-sizing, overflow-x
	 *  ViewStack children:  position, box-sizing, width, height
	 *
	 * @example
	 * <d-view-stack id="vs">
	 *     <div id="childA">...</div>
	 *     <div id="childB">...</div>
	 *     <div id="childC">...</div>
	 * </d-view-stack>
	 * <button onclick="vs.show(childB, {transition: 'reveal', reverse: true})">...</button>
	 * @class module:deliteful/ViewStack
	 * @augments module:delite/DisplayContainer
	 */
	return register("d-view-stack", [HTMLElement, DisplayContainer], /** @lends module:deliteful/ViewStack# */{
		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-view-stack"
		 */
		baseClass: "d-view-stack",

		/**
		 * The transition type used if not specified in the second argument of the show method.
		 * Transitions type are: "none", "slide", "reveal", "flip", "fade".
		 * @member {string}
		 * @default "slide"
		 */
		transition: "slide",

		/**
		 * If true, the transition animation is reversed.
		 * This attribute is supported by "slide" and "reveal" transition types.
		 * @member {boolean}
		 * @default false
		 */
		reverse: false,

		/**
		 * The selected child id, can be set explicitly or through the show() method.
		 * The effect of setting this property (i.e. getting the value through the getter) might be
		 * asynchronous when an animated transition occurs.
		 * @member {string}
		 * @default ""
		 */
		selectedChildId: dcl.prop({
			set: function (child) {
				if (this.ownerDocument.getElementById(child)) {
					if (this.attached) {
						this.show(child);
					} else {
						this._pendingChild = child;
					}
				}
			},
			get: function () {
				return this._visibleChild ? this._visibleChild.id : "";
			},
			enumerable: true,
			configurable: true
		}),

		_pendingChild: null,

		constructor: function () {
			this._transitionTiming = {default: 0, chrome: 20, ios: 20, android: 100, ff: 100, ie: 20};
			for (var o in this._transitionTiming) {
				if (has(o) && this._timing < this._transitionTiming[o]) {
					this._timing = this._transitionTiming[o];
				}
			}
		},

		connectedCallback: function () {
			var noTransition = {transition: "none"};
			if (this._pendingChild) {
				this.show(this._pendingChild, noTransition);
				this._pendingChild = null;
			} else if (!this._visibleChild && this.children.length > 0) {
				this.show(this.children[0], noTransition);
			}
		},

		_timing: 0,

		_setChildrenVisibility: function () {
			var cdn = this.children;
			if (!this._visibleChild && cdn.length > 0) {
				this._visibleChild = cdn[0];
			}
			for (var i = 0; i < cdn.length; i++) {
				setVisibility(cdn[i], cdn[i] === this._visibleChild);
			}
		},

		/*
		 * @private
		 */
		onAddChild: dcl.superCall(function (sup) {
			return function (node) {
				var res = sup.call(this, node);
				this._setChildrenVisibility();
				return res;
			};
		}),

		removeChild: dcl.superCall(function (sup) {
			return function (node) {
				sup.call(this, node);
				if (this._visibleChild === node) {
					this._visibleChild = null;
				}
			};
		}),

		postRender: function () {
			this._setChildrenVisibility();
		},

		/**
		 * Shows the immediately following sibling of the ViewStack visible element.
		 * The parameter 'params' is optional. If not specified, this.transition, and this.reverse are used.
		 * @param {Object} [params] - Optional params. A hash like {transition: "reveal", reverse: true}.
		 * The transition value can be "slide", "overlay", "fade" or "flip". Reverse transition applies to "slide"
		 * and "reveal". Transition is internally set to "none" if the ViewStack is not visible.
		 * @returns {Promise} A promise that will be resolved when the display and transition effect will have
		 * been performed.
		 */
		showNext: function (params) {
			//		Shows the next child in the container.
			return this._showPreviousNext("nextElementSibling", params);
		},

		/**
		 * Shows the immediately preceding sibling of the ViewStack visible element.
		 * The parameter 'params' is optional. If not specified, this.transition, and reverse = true are used.
		 * @param {Object} [params] - Optional params. A hash like {transition: "reveal", reverse: true}.
		 * The transition value can be "slide", "overlay", "fade" or "flip". Reverse transition applies to "slide"
		 * and "reveal". Transition is internally set to "none" if the ViewStack is not visible.
		 * Reverse is set to true if not specified.
		 * @returns {Promise} A promise that will be resolved when the display and transition effect will have
		 * been performed.
		 */
		showPrevious: function (params) {
			//		Shows the previous child in the container.
			var args = {reverse: true};
			mix(args, params || {});
			return this._showPreviousNext("previousElementSibling", args);
		},

		_showPreviousNext: function (direction, props) {
			var ret = null;
			if (!this._visibleChild && this.children.length > 0) {
				this._visibleChild = this.children[0];
			}
			if (this._visibleChild) {
				var target = this._visibleChild[direction];
				if (target) {
					ret = this.show(target, props);
				}
			}
			return ret;
		},

		_doTransition: function (origin, target, event, transition, reverse) {
			var promises = [];
			$(this).addClass("-d-view-stack-transition");
			if (transition !== "none") {
				if (origin) {
					promises.push(this._startNodeTransition(origin));
					$(origin).addClass(transitionClass(transition));
				}
				if (target) {
					promises.push(this._startNodeTransition(target));
					$(target).addClass(transitionClass(transition) + " -d-view-stack-in");
				}
				if (reverse) {
					setReverse(origin);
					setReverse(target);
				}

				// TODO: figure out why the delay is needed
				this.defer(function () {
					if (target) {
						$(target).addClass("-d-view-stack-transition");
					}
					if (origin) {
						$(origin).addClass("-d-view-stack-transition -d-view-stack-out");
					}
					if (reverse) {
						setReverse(origin);
						setReverse(target);
					}
					if (target) {
						$(target).addClass("-d-view-stack-in");
					}
				}, this._timing);
			} else {
				if (origin !== target) {
					setVisibility(origin, false);
				}
			}
			return Promise.all(promises).then(function () {
				$(this).removeClass("-d-view-stack-transition");
				$(target).removeClass("-d-view-stack-transition -d-view-stack-in");
				$(origin).removeClass("-d-view-stack-transition -d-view-stack-out");
			}.bind(this));
		},

		changeDisplay: function (widget, event) {
			// Resolved when display is completed.
			if (!widget || widget.parentNode !== this) {
				return Promise.resolve();
			}

			var origin = this._visibleChild;

			// Needed because the CSS state of a node can be incorrect
			// if a previous transitionend has been dropped
			cleanCSS(origin);
			cleanCSS(widget);

			setVisibility(widget, true);
			this._visibleChild = widget;

			var transition = (origin === widget) ? "none" : (event.transition || this.transition);
			var reverse = this.effectiveDir === "ltr" ? event.reverse : !event.reverse;
			return this._doTransition(origin, widget, event, transition, reverse);
		},

		/**
		 * Shows a child of the ViewStack.  The parameter 'params' is optional.  If not specified,
		 * `this.transition`, and `this.reverse` are used.
		 * This method must be called to display a particular destination child on this container.
		 * @param {Element|string} dest - Element or Element id that points to the child this container must
		 * show or hide.
		 * @param {Object} [params] - A hash like {transition: "reveal", reverse: true}. The transition value
		 * can be "slide", "overlay", "fade" or "flip". Reverse transition applies to "slide" and
		 * "reveal". Transition is internally set to "none" if the ViewStack is not visible.
		 * @returns {Promise} A promise that will be resolved when the display and transition effect will have
		 * been performed.
		 */
		show: dcl.superCall(function (sup) {
			return function (dest, params) {
				// Check visibility of the ViewStack, forces transition:"none" if not visible.
				//  - Transitions events are broken if the ViewStack is not visible

				var parent = this;
				while (parent && parent.style.display !== "none" && parent !== this.ownerDocument.body) {
					parent = parent.parentNode;
				}
				if (has("ie") === 9 || parent !== this.ownerDocument.body) {
					if (!params) {
						params = {};
					}
					params.transition = "none";
				}

				if (this._visibleChild && this._visibleChild.parentNode !== this) {
					// The visible child has been removed.
					this._visibleChild = null;
				}
				if (!this._visibleChild && this.children.length > 0) {
					// The default visible child is the first one.
					this._visibleChild = this.children[0];
				}
				return sup.apply(this, [dest, params]);
			};
		}),

		_startNodeTransition: function (node) {
			return new Promise(function (resolve) {
				// Set up fail-safe in case we don't get the "transitionend" event below.
				var failsafe = this.defer(resolve, 1000);

				// Set up listener for when the animation completes.
				node.addEventListener("transitionend", function after() {
					node.removeEventListener("transitionend", after);
					failsafe.remove();
					resolve();
				});
			}.bind(this)).then(this._afterNodeTransitionHandler.bind(this, node));
		},

		_afterNodeTransitionHandler: function (node) {
			var isVisibleChild = this._visibleChild === node;
			setVisibility(node, isVisibleChild);
			cleanCSS(node);
		}
	});
});

