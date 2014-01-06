define([
	"dcl/dcl",
	"dpointer/events",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/_base/window",
	"dojo/sniff",
	"delite/register",
	"delite/Widget",
	"delite/Container",
	"delite/Contained",
	"delite/Invalidating",
	"delite/themes/load!./SidePane/themes/{{theme}}/SidePane_css"],
	function (dcl, pointer, lang, domClass, win, has, register, Widget, Container, Contained, Invalidating) {
		function prefix(v) {
			return "-d-side-pane-" + v;
		}
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

		return register("d-side-pane", [HTMLElement, Widget, Container, Contained, Invalidating], {

			// summary:
			//		A container displayed on the side of the screen. It can be displayed on top of the page
			// 		(mode=overlay) or
			//		can push the content of the page (mode=push or mode=reveal).
			// description:
			//		SidePane is a container hidden by default.
			//		This widget must be a sibling of html's body element.
			//		If mode is set to "push" or "reveal", the width of the SidePane can't be changed in the markup
			//		(15em by default).
			//		However it can be changed in SidePane.less (@PANE_WIDTH variable).
			//		In "push" and "reveal" mode, the pushed element is the first sibling of the SidePane which has
			//		of type element (nodeType == 1) and not a SidePane.

			// baseClass: String
			//		The name of the CSS class of this widget.
			baseClass: "d-side-pane",

			// mode: String
			//		Can be "overlay", "reveal" or "push". Default is "push".
			mode: "push",

			// position: String
			//		Can be "start" or "end". If set to "start", the panel is displayed on the
			//		left side in LTR mode.
			position: "start",

			// animate: Boolean
			//		Enable/Disable animations.
			animate: true,

			// swipeClosing: Boolean
			//		Enables the swipe closing of the pane.
			swipeClosing: true,

			_transitionTiming: {default: 0, chrome: 50, ios: 20, android: 100, mozilla: 100},
			_timing: 0,
			_visible: false,
			_opening: false,
			_originX: NaN,
			_originY: NaN,
			_transitionEndHandlers: [],

			open: function () {
				// summary:
				//		Open the pane.
				var nextElement;
				if (!this._visible) {
					if (this.animate) {
						domClass.add(this, prefix("animate"));
						nextElement = this.getNextSibling();
						if (nextElement) {
							domClass.add(nextElement, prefix("animate"));
						}
					}

					if (this.mode === "reveal") {
						nextElement = this.getNextSibling();
						if (nextElement) {
							this._setAfterTransitionHandlers(nextElement, {node: nextElement});
						}
					} else {
						this._setAfterTransitionHandlers(this, {node: this});
					}

					setVisibility(this, true);

					if (this.animate) {
						this.defer(this._openImpl, this._timing);
					} else {
						this._openImpl();
						this.defer(this._afterTransitionHandle, this._timing);
					}
				}
			},

			close: function () {
				// summary:
				//		Close the pane.
				if (this._visible) {
					if (this.mode === "reveal") {
						var nextElement = this.getNextSibling();
						if (nextElement) {
							this._setAfterTransitionHandlers(nextElement, {node: nextElement});
						}
					} else {
						this._setAfterTransitionHandlers(this, {node: this});
					}
					this._hideImpl();
					if (!this.animate) {
						this.defer(this._afterTransitionHandle, this._timing);
					}
				}
			},

			_setAfterTransitionHandlers: function (node, event, deferred) {
				var handle = lang.hitch(this, this._afterTransitionHandle);
				this._transitionEndHandlers.push({node: node, handle: handle, props: event, deferred: deferred});
				node.addEventListener("webkitTransitionEnd", handle);
				node.addEventListener("transitionend", handle); // IE10 + FF
			},

			_afterTransitionHandle: function () {
				var item;
				domClass.remove(this, prefix("under"));

				for (var i = 0; i < this._transitionEndHandlers.length; i++) {
					item = this._transitionEndHandlers[i];
					if (!this._visible) {
						setVisibility(this, false);
					}
					item.node.removeEventListener("webkitTransitionEnd", item.handle);
					item.node.removeEventListener("transitionend", item.handle);
					this._transitionEndHandlers.splice(i, 1);
					if (item.props.deferred) {
						item.props.deferred.resolve();
					}
					break;
				}
			},

			postCreate: function () {
				setVisibility(this, false);
				this.invalidateProperty("mode");
				this.invalidateProperty("position");
				this.invalidateRendering();
			},

			preCreate: function () {
				this.addInvalidatingProperties("position", "mode", "animate");
				if (this._timing === 0) {
					for (var o in this._transitionTiming) {
						if (has(o) && this._timing < this._transitionTiming[o]) {
							this._timing = this._transitionTiming[o];
						}
					}
				}
			},

			buildRendering: function(){
				this.parentNode.style.overflow = "hidden";
				this.setAttribute("data-touch-action", "none");
				this._resetInteractions();
			},

			refreshRendering: function (props) {
				var nextElement = this.getNextSibling();

				// Always remove animation during a refresh. Avoid to see moving the pane on mode changes.
				// Not very reliable on IE11.
				domClass.remove(this, prefix("animate"));
				if (nextElement) {
					domClass.remove(nextElement, prefix("animate"));
				}

				if (props.mode) {
					domClass.remove(this, prefix("push"));
					domClass.remove(this, prefix("overlay"));
					domClass.remove(this, prefix("reveal"));
					domClass.add(this, prefix(this.mode));

					if (nextElement && this._visible) {
						if (this.mode === "overlay") {
							domClass.remove(nextElement, prefix("translated"));
						} else {
							domClass.add(nextElement, prefix("translated"));
						}
					}

					if (this.mode === "reveal" && !this._visible) {
						// Needed by FF only for the first opening.
						domClass.remove(this, prefix("ontop"));
						domClass.add(this, prefix("under"));
					}
					else if (this.mode === "overlay") {
						domClass.remove(this, prefix("under"));
						domClass.add(this, prefix("ontop"));
					} else {
						domClass.remove(this, prefix("under"));
						domClass.remove(this, prefix("ontop"));
					}

				}

				if (props.position) {
					domClass.remove(this, prefix("start"));
					domClass.remove(this, prefix("end"));
					domClass.add(this, prefix(this.position));
					if (nextElement && this._visible) {
						domClass.remove(nextElement, prefix("start"));
						domClass.remove(nextElement, prefix("end"));
						domClass.add(nextElement, prefix(this.position));
					}
				}

				if (this._visible) {
					domClass.remove(this, prefix("hidden"));
					domClass.add(this, prefix("visible"));
				} else {
					domClass.remove(this, prefix("visible"));
					domClass.add(this, prefix("hidden"));
				}

				// Re-enable animation
				if (this.animate) {
					this.defer(function () {
						domClass.add(this, prefix("animate"));
						if (nextElement) {
							domClass.add(nextElement, prefix("animate"));
						}
					}, this._timing);
				}
			},

			_openImpl: function () {
				if (!this._visible) {
					this._visible = true;
					domClass.remove(this, prefix("hidden"));
					domClass.add(this, prefix("visible"));

					if (this.mode === "push" || this.mode === "reveal") {
						var nextElement = this.getNextSibling();
						if (nextElement) {
							domClass.remove(nextElement, prefix("nottranslated"));
							domClass.remove(nextElement, prefix("start"));
							domClass.remove(nextElement, prefix("end"));
							domClass.add(nextElement, prefix(this.position));
							domClass.add(nextElement, prefix("translated"));
						}
					}
				}
			},

			_hideImpl: function () {
				if (this._visible) {
					this._visible = false;
					this._opening = false;
					domClass.remove(win.doc.body, prefix("no-select"));
					domClass.remove(this, prefix("visible"));
					domClass.add(this, prefix("hidden"));
					if (this.mode === "push" || this.mode === "reveal") {
						var nextElement = this.getNextSibling();
						if (nextElement) {
							domClass.remove(nextElement, prefix("translated"));
							domClass.remove(nextElement, prefix("start"));
							domClass.remove(nextElement, prefix("end"));
							domClass.add(nextElement, prefix(this.position));
							domClass.add(nextElement, prefix("nottranslated"));
						}
					}
				}
			},

			_pointerDownHandler: function (event) {
				this._originX = event.pageX;
				this._originY = event.pageY;

				if (this._visible || (this.position === "start" && !this._visible && this._originX <= 10) ||
					(this.position === "end" && !this._visible && this._originX >= win.doc.width - 10)) {
					this._opening = !this._visible;
					this._pressHandle.remove();
					this._moveHandle = this.on("pointermove", lang.hitch(this, this._pointerMoveHandler));
					this._releaseHandle = this.on("pointerup", lang.hitch(this, this._pointerUpHandler));

					domClass.add(win.doc.body, "-d-side-pane-no-select");
				}
			},

			_pointerMoveHandler: function (event) {
				if (!this._opening && Math.abs(event.pageY - this._originY) > 10) {
					this._resetInteractions();
				} else {
					var pos = event.pageX;

					if (this.position === "start") {
						if (this._visible) {
							if (this._originX < pos) {
								this._originX = pos;
							}

							if ((this.swipeClosing && this._originX - pos) > 10) {
								this.close();
								this._originX = pos;
							}
						}
					} else {
						if (this._visible) {
							if (this._originX > pos) {
								this._originX = pos;
							}
							if ((this.swipeClosing && pos - this._originX) > 10) {
								this.close();
								this._originX = pos;
							}
						}
					}
				}
			},

			_pointerUpHandler: function () {
				this._opening = false;
				domClass.remove(win.doc.body, "-d-side-pane-no-select");
				this._resetInteractions();
			},

			_resetInteractions: function () {
				if (this._releaseHandle) {
					this._releaseHandle.remove();
				}
				if (this._moveHandle) {
					this._moveHandle.remove();
				}
				if (this._pressHandle) {
					this._pressHandle.remove();
				}

				if (this.swipeClosing) {
					this._pressHandle = this.on("pointerdown", lang.hitch(this, this._pointerDownHandler));
				}

				this._originX = NaN;
				this._originY = NaN;
			}
		});
	});

