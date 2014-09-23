/** @module deliteful/ViewStack */
define(["dcl/dcl",
	"decor/sniff",
	"dojo/on",
	"dojo/Deferred",
	"dojo/dom-class",
	"delite/register",
	"delite/Widget",
	"delite/DisplayContainer",
	"delite/theme!./ViewStack/themes/{{theme}}/ViewStack.css",
	"requirejs-dplugins/css!./ViewStack/transitions/slide.css",
	"requirejs-dplugins/css!./ViewStack/transitions/reveal.css"],
	function (dcl, has, on, Deferred, domClass, register, Widget, DisplayContainer) {
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
				domClass.add(node, "-d-view-stack-reverse");
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
		 * @example:
		 * <d-view-stack id="vs">
		 *     <div id="childA">...</div>
		 *     <div id="childB">...</div>
		 *     <div id="childC">...</div>
		 * </d-view-stack>
		 * <button onclick="vs.show(childB, {transition: 'reveal', reverse: true})">...</button>
		 * @class module:deliteful/ViewStack
		 * @augments module:delite/DisplayContainer
		 */
		return register("d-view-stack", [HTMLElement, DisplayContainer],
			/** @lends module:deliteful/ViewStack# */{
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
			selectedChildId: "",

			_pendingChild: null,

			_setSelectedChildIdAttr: function (child) {
				if (this.ownerDocument.getElementById(child)) {
					if (this._started) {
						this.show(child);
					} else {
						this._pendingChild = child;
					}
				}
			},

			_getSelectedChildIdAttr: function () {
				return this._visibleChild ? this._visibleChild.id : "";
			},

			startup: function () {
				var noTransition = {transition: "none"};
				if (this._pendingChild) {
					this.show(this._pendingChild, noTransition);
					this._pendingChild = null;
				} else if (this.children.length > 0) {
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

			preCreate: function () {
				this._transitionTiming = {default: 0, chrome: 20, ios: 20, android: 100, mozilla: 100};
				for (var o in this._transitionTiming) {
					if (has(o) && this._timing < this._transitionTiming[o]) {
						this._timing = this._transitionTiming[o];
					}
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

			postCreate: function () {
				this._setChildrenVisibility();
			},

			showNext: function (props) {
				//		Shows the next child in the container.
				this._showPreviousNext("nextElementSibling", props);
			},

			showPrevious: function (props) {
				//		Shows the previous child in the container.
				this._showPreviousNext("previousElementSibling", props);
			},

			_showPreviousNext: function (direction, props) {
				if (!this._visibleChild && this.children.length > 0) {
					this._visibleChild = this.children[0];
				}
				if (this._visibleChild) {
					var target = this._visibleChild[direction];
					if (target) {
						this.show(target, props);
					}
				}
			},

			_doTransition: function (origin, target, event, transition, reverse, deferred) {
				if (transition !== "none") {
					if (origin) {
						this._setAfterTransitionHandlers(origin, event, deferred);
						domClass.add(origin, transitionClass(transition));
					}
					if (target) {
						this._setAfterTransitionHandlers(target, event, deferred);
						domClass.add(target, [transitionClass(transition), "-d-view-stack-in"]);
					}
					if (reverse) {
						setReverse(origin);
						setReverse(target);
					}
					this.defer(function () {
						if (target) {
							domClass.add(target, "-d-view-stack-transition");
						}
						if (origin) {
							domClass.add(origin, ["-d-view-stack-transition", "-d-view-stack-out"]);
						}
						if (reverse) {
							setReverse(origin);
							setReverse(target);
						}
						if (target) {
							domClass.add(target, "-d-view-stack-in");
						}
					}, this._timing);
				} else {
					if (origin !== target) {
						setVisibility(origin, false);
					}
					deferred.resolve();
				}
			},

			changeDisplay: function (widget, event) {
				// Resolved when display is completed.
				var deferred = new Deferred();

				if (!widget || widget.parentNode !== this) {
					deferred.resolve();
					return deferred.promise;
				}

				var origin = this._visibleChild;

				// Needed because the CSS state of a node can be incorrect
				// if a previous transitionend has been dropped
				cleanCSS(origin);
				cleanCSS(widget);

				setVisibility(widget, true);
				this._visibleChild = widget;

				var transition  = (origin === widget) ? "none" : (event.transition || "slide");
				var reverse = this.isLeftToRight() ? event.reverse : !event.reverse;
				this._doTransition(origin, widget, event, transition, reverse, deferred);

				return deferred.promise;
			},
			/**
			 * Shows a children of the ViewStack. The parameter 'params' is optional. If not specified,
			 * this.transition, and this.reverse are used.
			 * This method must be called to display a particular destination child on this container.
			 * @param {dest} Widget or HTMLElement or id that points to the child this container must display.
			 * @param {params} Optional params. A hash like {transition: "reveal", reverse: true}. The transition value
			 * can be "slide", "overlay", "fade" or "flip". Reverse transition applies to "slide" and
			 * "reveal". Transition is internally set to "none" if the ViewStack is not visible.
			 * @returns {module:dojo/promise/Promise} A promise that will be resolved when the display and
			 * transition effect will have been performed.
			 */
			show: dcl.superCall(function (sup) {
				return function (dest, params) {
					// Check visibility of the ViewStack, forces transition:"none" if not visible.
					//  - Transitions events are broken if the ViewStack is not visible

					var parent = this;
					while (parent && parent.style.display  !== "none" && parent !== this.ownerDocument.body) {
						parent = parent.parentNode;
					}
					if (parent !== this.ownerDocument.body) {
						if (! params) {
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

			_setAfterTransitionHandlers: function (node, event, deferred) {
				var self = this, endProps = {
					node: node,
					handle: function () { self._afterTransitionHandle(endProps); },
					props: event,
					deferred: deferred
				};

				domClass.add(this, "-d-view-stack-transition");
				node.addEventListener("webkitTransitionEnd", endProps.handle);
				node.addEventListener("transitionend", endProps.handle); // IE10 + FF
			},

			_afterTransitionHandle: function (item) {
				// Workaround for FF transitionend randomly dropped.
				// This method should be called once, when the target view transition is done.
				// But when 2 transitions (ex: slide) start at the same time, the transitionend event of the
				// target view can be dropped.
				if (!item.deferred.isResolved()) {
					// First call
					var vb;
					for (var i = 0; i < this.children.length; i++) {
						vb = this._visibleChild === this.children[i];
						setVisibility(this.children[i], vb);
						if (!vb) {
							cleanCSS(this.children[i]);
						}
					}

					item.node.removeEventListener("webkitTransitionEnd", item.handle);
					item.node.removeEventListener("transitionend", item.handle);
					item.deferred.resolve();
				} else {
					// Second call (occurs randomly on FF). The following code is not critical but try
					// to keep a clean DOM tree as much as possible.
					cleanCSS(item.node);
					domClass.remove(this, "-d-view-stack-transition");
				}
			}
		});
	});

