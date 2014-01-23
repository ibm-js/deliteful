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

		function transitionClass(s) {
			return "-d-view-stack-" + s;
		}

		return register("d-view-stack", [HTMLElement, Widget, DisplayContainer], {

			// summary:
			//		ViewStack container widget.
			//
			//		ViewStack displays its first child node by default.
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

			preCreate: function () {
				this._transitionTiming = {default: 0, chrome: 20, ios: 20, android: 100, mozilla: 100};
				for (var o in this._transitionTiming) {
					if (has(o) && this._timing < this._transitionTiming[o]) {
						this._timing = this._transitionTiming[o];
					}
				}
			},

			buildRendering: function () {
				// Keep visible the first child, hide others
				for (var i = 1; i < this.children.length; i++) {
					setVisibility(this.children[i], false);
				}
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

			_cleanCSS: function (node) {
				var classes = [];
				for (var i = 0; i < node.classList.length; i++) {
					if (node.classList[i].indexOf("-d-view-stack") === 0) {
						classes.push(node.classList[i]);
					}
				}
				domClass.remove(node, classes);
			},

			performDisplay: function (widget, event) {
				var origin = this._visibleChild;
				var dest = widget;

				// Needed because the CSS state of a node can be incorrect if a previous transitionEnd has been dropped
				this._cleanCSS(origin);
				this._cleanCSS(dest);

				var deferred = new Deferred();
				setVisibility(dest, true);
				this._visibleChild = dest;
				if (event.transition && event.transition !== "none") {
					if (origin) {
						this._setAfterTransitionHandlers(origin, event);
						domClass.add(origin, transitionClass(event.transition));
					}
					if (dest) {
						this._setAfterTransitionHandlers(dest, event, deferred);
						domClass.add(dest, [transitionClass(event.transition), "-d-view-stack-in"]);
					}
					if (event.reverse) {
						setReverse(origin);
						setReverse(dest);
					}
					this.defer(function () {
						if (dest) {
							domClass.add(dest, "-d-view-stack-transition");
						}
						if (origin) {
							domClass.add(origin, ["-d-view-stack-transition", "-d-view-stack-out"]);
						}
						if (event.reverse) {
							setReverse(origin);
							setReverse(dest);
						}
						if (dest) {
							domClass.add(dest, "-d-view-stack-in");
						}
					}, this._timing);
				} else {
					setVisibility(origin, false);
					deferred.resolve();
				}

				return deferred.promise;
			},

			show: dcl.superCall(function (sup) {
				return function (/* HTMLElement */ node, props) {
					//		Shows a children of the ViewStack. The parameter 'props' is optional. If not specified,
					//		its value is {transition: this.transition, reverse: this.reverse}. In other words,
					//		transition and/or reverse properties are used.
					if (!this._visibleChild) {
						this._visibleChild = this.children[0];
					}
					var origin = this._visibleChild;
					if (origin !== node) {
						if (!props) {
							props = {transition: this.transition, reverse: this.reverse};
						}
						else if (!props.transition) {
							props.transition = this.transition;
						}
					}
					return sup.apply(this, arguments);
				};
			}),

			addChild: dcl.superCall(function (sup) {
				return function (/*HTMLElement*/ widget, /*jshint unused: vars */insertIndex) {
					sup.apply(this, arguments);
					if (this.children.length !== 1) {
						setVisibility(widget, false);
					}
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
				this._cleanCSS(item.node);

				item.node.removeEventListener("webkitTransitionEnd", item.handle);
				item.node.removeEventListener("transitionend", item.handle);
				if (item.deferred) {
					item.deferred.resolve();
				}
			}
		});
	});

