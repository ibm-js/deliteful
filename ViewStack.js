define(["dcl/dcl",
	"dojo/sniff",
	"dojo/on",
	"dojo/Deferred",
	"dojo/_base/lang",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"delite/register",
	"delite/Widget",
	"delite/DisplayContainer",
	"delite/themes/load!./ViewStack/themes/{{theme}}/ViewStack_css",
	"delite/css!./ViewStack/transitions/slide",
	"delite/css!./ViewStack/transitions/reveal",
	"delite/css!./ViewStack/transitions/flip",
	"delite/css!./ViewStack/transitions/fade"],
	function (dcl, has, on, Deferred, lang, domGeometry, domClass, register, Widget, DisplayContainer) {
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
				domClass.add(node, "-delite-reverse");
			}
		}

		function transitionClass(s) {
			return "-delite-" + s;
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

			_transitionTiming: {default: 0, chrome: 20, ios: 20, android: 100, mozilla: 100},

			_timing: 0,
			_visibleChild: null,
			_transitionEndHandlers: [],

			preCreate: function () {
				for (var o in this._transitionTiming) {
					if (has(o) && this._timing < this._transitionTiming[o]) {
						this._timing = this._transitionTiming[o];
					}
				}
			},

			buildRendering: function () {
				for (var i = 1; i < this.children.length; i++) {
					setVisibility(this.children[i], false);
				}
			},

			showNext: function (props) {
				//		Shows the next children in the container.
				//		The current children must implement getNextSlibling method which is available
				//		in the Contained class.
				if (!this._visibleChild && this.children.length > 0) {
					this._visibleChild = this.children[0];
				}
				if (this._visibleChild && this._visibleChild.getNextSibling) {
					this.show(this._visibleChild.getNextSibling(), props);
				} else {
					console.log("ViewStack's children must implement getNextSibling()");
				}
			},

			showPrevious: function (props) {
				//		Shows the previous children in the container.
				//		The current children must implement getPreviousSlibling method which is available
				//		in the Contained class.
				if (!this._visibleChild && this.children.length > 0) {
					this._visibleChild = this.children[0];
				}
				if (this._visibleChild && this._visibleChild.getPreviousSibling) {
					this.show(this._visibleChild.getPreviousSibling(), props);
				} else {
					console.log("ViewStack's children must implement getPreviousSibling()");
				}
			},

			performDisplay: function (widget, event) {
				var origin = this._visibleChild;
				var dest = widget;
				var deferred = new Deferred();
				setVisibility(dest, true);
				if (event.transition && event.transition !== "none") {
					if (origin) {
						this._setAfterTransitionHandlers(origin, event);
						domClass.add(origin, transitionClass(event.transition));
					}
					if (dest) {
						this._setAfterTransitionHandlers(dest, event, deferred);
						domClass.add(dest, transitionClass(event.transition));
						domClass.remove(dest, "-delite-transition");
						domClass.add(dest, "-delite-in");
					}
					if (event.reverse) {
						setReverse(origin);
						setReverse(dest);
					}
					this.defer(function () {
						if (dest) {
							domClass.add(dest, "-delite-transition");
						}
						if (origin) {
							domClass.add(origin, "-delite-transition");
							domClass.add(origin, "-delite-out");
						}
						if (event.reverse) {
							setReverse(origin);
							setReverse(dest);
						}
						if (dest) {
							domClass.add(dest, "-delite-in");
						}
					}, this._timing);
				} else {
					setVisibility(origin, false);
					deferred.resolve();
				}
				this._visibleChild = dest;
				return deferred;
			},

			show: function (/* HTMLElement */ node, props) {
				//		Shows a children of the ViewStack. The parameter 'props' is optional. If not specified,
				//		its value is {transition: this.transition, reverse: this.reverse}. In other words,
				//		transition and/or reverse properties are used.
				if (!this._visibleChild) {
					this._visibleChild = this.children[0];
				}
				var origin = this._visibleChild;
				if (origin) {
					if (node && origin !== node) {
						if (!props) {
							props = {transition: this.transition, reverse: this.reverse};
						}
						if (!props.transition) {
							props.transition = this.transition;
						}
						dcl.mix(props, {
							dest: node,
							transitionDeferred: new Deferred(),
							bubbles: true,
							cancelable: true
						});
						on.emit(document, "delite-display", props);
					}
				}
			},

			addChild: dcl.superCall(function (sup) {
				return function (/*dui/Widget|DOMNode*/ widget, /*jshint unused: vars */insertIndex) {
					sup.apply(this, arguments);
					setVisibility(widget, false);
				};
			}),

			_setAfterTransitionHandlers: function (node, event, deferred) {
				var handle = lang.hitch(this, this._afterTransitionHandle);
				this._transitionEndHandlers.push({node: node, handle: handle, props: event, deferred: deferred});
				node.addEventListener("webkitTransitionEnd", handle);
				node.addEventListener("transitionend", handle); // IE10 + FF
			},

			_afterTransitionHandle: function (event) {
				var item;
				for (var i = 0; i < this._transitionEndHandlers.length; i++) {
					item = this._transitionEndHandlers[i];
					if (event.target === item.node) {
						if (domClass.contains(item.node, "-delite-out")) {
							setVisibility(item.node, false);
						}
						domClass.remove(item.node, "-delite-in");
						domClass.remove(item.node, "-delite-out");
						domClass.remove(item.node, "-delite-reverse");
						domClass.remove(item.node, transitionClass(item.props.transition));
						domClass.remove(item.node, "-delite-transition");
						item.node.removeEventListener("webkitTransitionEnd", item.handle);
						item.node.removeEventListener("transitionend", item.handle);
						this._transitionEndHandlers.splice(i, 1);
						if (item.props.deferred) {
							item.props.deferred.resolve();
						}
						break;
					}
				}
			}
		});
	});

