define(["dcl/dcl",
	"dojo/sniff",
	"dojo/on",
	"dojo/Deferred",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"delite/register",
	"delite/Widget",
	"delite/DisplayContainer",
	"delite/themes/load!./ViewStack/themes/{{theme}}/ViewStack_css",
	"delite/css!./ViewStack/transitions/slide_css",
	"delite/css!./ViewStack/transitions/reveal_css",
	"delite/css!./ViewStack/transitions/flip_css",
	"delite/css!./ViewStack/transitions/fade_css"],
	function (dcl, has, on, Deferred, domGeometry, domClass, register, Widget, DisplayContainer) {
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
			node.className = node.className.split(/ +/).filter(function (x) {
				return !/^-d-view-stack/.test(x);
			}).join(" ");
		}
		function transitionClass(s) {
			return "-d-view-stack-" + s;
		}

		return register("d-view-stack", [HTMLElement, Widget, DisplayContainer], {

			// summary:
			//		ViewStack container widget. Display one child at a time.
			//
			//		The first child is displayed by default.
			//		The methods 'show' is used to change the visible child.
			//
			//		Styling
			//		The following CSS attributes must not be changed.
			// 			- ViewStack node:  position, box-sizing, overflow-x
			// 			- ViewStack children:  position, box-sizing, width, height
			//
			// example:
			//	|	<d-view-stack id="vs">
			//	|		<div id="childA">...</div>
			//	|		<div id="childB">...</div>
			//	|		<div id="childC">...</div>
			//	|	</d-view-stack>
			//	|	<d-button onclick="vs.show(childB, {transition: 'reveal', reverse: true})">...</d-button>

			baseClass: "d-view-stack",

			// transition: String
			//		The transition type used if not specified in the second argument of the show method.
			//		Default value is "slide".
			//		Transitions type are: "none", "slide", "reveal", "flip", "fade".
			transition: "slide",

			// reverse: Boolean
			//		If true, the transition animation is reversed.
			//		This attribute is supported by "slide" and "reveal" transition types.
			reverse: false,

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
				this.on("DOMNodeInserted", this._setChildrenVisibility.bind(this));
			},

			buildRendering: function () {
				this._setChildrenVisibility();
			},

			showNext: function (props) {
				//		Shows the next child in the container.
				this._showPreviousNext(this.getNextSibling.bind(this), props);
			},

			showPrevious: function (props) {
				//		Shows the previous child in the container.
				this._showPreviousNext(this.getPreviousSibling.bind(this), props);
			},

			_showPreviousNext: function (func, props) {
				if (!this._visibleChild && this.children.length > 0) {
					this._visibleChild = this.children[0];
				}
				if (this._visibleChild) {
					var target = func(this._visibleChild);
					if (target) {
						this.show(target, props);
					}
				}
			},

			performDisplay: function (widget, event) {
				// Resolved when display is completed.
				var deferred = new Deferred();

				if (!widget || widget.parentNode !== this) {
					deferred.resolve();
					return deferred.promise;
				}

				var origin = this._visibleChild;

				// Needed because the CSS state of a node can be incorrect if a previous transitionEnd has been dropped
				cleanCSS(origin);
				cleanCSS(widget);

				setVisibility(widget, true);
				this._visibleChild = widget;

				var transition = event.transition ? event.transition : "slide";
				var reverse = event.reverse ? event.reverse : false;

				if (transition !== "none") {
					if (origin) {
						this._setAfterTransitionHandlers(origin, event);
						domClass.add(origin, transitionClass(transition));
					}
					if (widget) {
						this._setAfterTransitionHandlers(widget, event, deferred);
						domClass.add(widget, [transitionClass(transition), "-d-view-stack-in"]);
					}
					if (reverse) {
						setReverse(origin);
						setReverse(widget);
					}
					this.defer(function () {
						if (widget) {
							domClass.add(widget, "-d-view-stack-transition");
						}
						if (origin) {
							domClass.add(origin, ["-d-view-stack-transition", "-d-view-stack-out"]);
						}
						if (reverse) {
							setReverse(origin);
							setReverse(widget);
						}
						if (widget) {
							domClass.add(widget, "-d-view-stack-in");
						}
					}, this._timing);
				} else {
					if (origin !== widget) {
						setVisibility(origin, false);
					}
					deferred.resolve();
				}

				return deferred.promise;
			},

			show: dcl.superCall(function (sup) {
				return function (dest, params) {
					//		Shows a children of the ViewStack. The parameter 'params' is optional. If not specified,
					//		this.transition, and this.reverse are used.
					// summary:
					//		This method must be called to display a particular destination child on this container.
					// dest:
					//		Widget or HTMLElement or id that points to the child this container must display.
					// params:
					//		Optional params. A hash like {transition: "reveal", reverse: true}. The transition value
					//		can be "slide", "overlay", "fade" or "flip". Reverse transition applies to "slide" and
					//		"reveal".
					// returns:
					//		A promise that will be resolved when the display & transition effect will have been
					//		performed.

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
				node.addEventListener("webkitTransitionEnd", endProps.handle);
				node.addEventListener("transitionend", endProps.handle); // IE10 + FF
			},

			_afterTransitionHandle: function (item) {
				// Defensive approach
				// We should work only on item.node but transitionEnd events can be dropped on aggressive interactions
				for (var i = 0; i < this.children.length; i++) {
					setVisibility(this.children[i], this._visibleChild === this.children[i]);
				}
				cleanCSS(item.node);

				item.node.removeEventListener("webkitTransitionEnd", item.handle);
				item.node.removeEventListener("transitionend", item.handle);
				if (item.deferred) {
					item.deferred.resolve();
				}
			}
		});
	});

