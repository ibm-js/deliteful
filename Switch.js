/** @module deliteful/Switch */
define([
	"requirejs-dplugins/has",
	"dojo/dom-class",
	"dpointer/events",
	"delite/register",
	"delite/FormWidget",
	"deliteful/Toggle",
	"delite/handlebars!./Switch/Switch.html",
	"requirejs-dplugins/has!bidi?./Switch/bidi/Switch",
	"requirejs-dplugins/has!bidi?delite/handlebars!./Switch/bidi/Switch_rtl.html",
	"delite/theme!./Switch/themes/{{theme}}/Switch.css"
], function (has, domClass, pointer, register, FormWidget, Toggle, template, BidiSwitch, rtlTemplate) {

	/**
	 * A form-aware switch widget.
	 * @example
	 * <d-switch checkedLabel="ON" uncheckedLabel="OFF" checked="true"></d-checkbox>
	 * @class module:deliteful/Switch
	 * @augments module:deliteful/Toggle
	 * @augments module:delite/FormWidget
	 */
	return register("d-switch", has("bidi") ? [HTMLElement, FormWidget, Toggle, BidiSwitch] :
		[HTMLElement, FormWidget, Toggle], /** @lends module:deliteful/Switch# */ {

		/**
		 * The label corresponding to the checked state.
		 * @member {string}
		 * @default ""
		 */
		checkedLabel: "",

		/**
		 * The label corresponding to the unchecked state.
		 * @member {string}
		 * @default ""
		 */
		uncheckedLabel: "",

		/**
		 * The component css base class.
		 * @member {string}
		 * @default "d-switch"
		 */
		baseClass: "d-switch",

		_pHandlers: null,

		buildRendering: register.superCall(function () {
			return function () {
				this._templateHandle = this.isLeftToRight() ?
					template.bind(this)(this.ownerDocument, register) :
					rtlTemplate.bind(this)(this.ownerDocument, register);
			};
		}),

		postCreate: function () {
			this.on("click", function () {
				this._set("checked", this.focusNode.checked);
			}.bind(this), this.focusNode);
			this.on("pointerdown", this._pointerDownHandler.bind(this), this._knobGlassNode);
		},

		attachedCallback: register.after(function () {
			this.knobWidth = parseInt(window.getComputedStyle(this._knobNode).width, 10);
			this.switchWidth = parseInt(window.getComputedStyle(this).width, 10);
		}),

		destroy: function () {
			this._cleanHandlers();
		},

		_pointerDownHandler: function (e) {
			this._startX = this._curX = e.clientX;
			pointer.setPointerCapture(this._knobGlassNode, e.pointerId);
			if (!this._pHandlers) {
				this._pHandlers = [
					{e: "pointermove", l: this._pointerMoveHandler.bind(this)},
					{e: "pointerup", l: this._pointerUpHandler.bind(this)},
					{e: "lostpointercapture", l: this._lostPointerCaptureHandler.bind(this)}
				];
			}
			this._pHandlers.forEach(function (h) { this._knobGlassNode.addEventListener(h.e, h.l); }.bind(this));
			e.preventDefault();
			e.stopPropagation();
		},

		_pointerMoveHandler: function (e) {
			var dx = e.clientX - this._curX,
				cs = window.getComputedStyle(this._pushNode),
				w = parseInt(cs.width, 10);
			if (!this._drag && Math.abs(e.clientX - this._startX) > 4) {
				this._drag = true;
				domClass.remove(this._innerNode, "-d-switch-transition");
				domClass.remove(this._pushNode, "-d-switch-transition");
				domClass.remove(this._innerWrapperNode, "-d-switch-transition");
			}
			this._curX = e.clientX;
			if (this._drag) {
				var nw = this.isLeftToRight() ? w + dx : w - dx,
					max = this.checked ? this.switchWidth : this.switchWidth - this.knobWidth,
					min = this.checked ? this.knobWidth : 0;
				nw = Math.max(min, Math.min(max, nw));
				this._pushNode.style.width = nw + "px";
			}
			e.preventDefault();
			e.stopPropagation();
		},

		_pointerUpHandler: function (e) {
			if (!this._drag) {
				return;
			}
			this._drag = false;
			var cs = parseInt(window.getComputedStyle(this._pushNode).width, 10);
			var m = parseInt(window.getComputedStyle(this._pushNode).marginLeft, 10);
			if (this.checked) {
				this.checked = cs + m + this.knobWidth / 2 >= this.switchWidth / 2;
			} else {
				this.checked = cs + m + this.knobWidth / 2 >= this.switchWidth / 2;
			}
			e.preventDefault();
			e.stopPropagation();
		},

		_lostPointerCaptureHandler: function () {
			this._cleanHandlers();
			this._drag = false;
			this._pushNode.style.width = "";
			this._innerNode.style.transform = "none";
			domClass.add(this._innerNode, "-d-switch-transition");
			domClass.add(this._pushNode, "-d-switch-transition");
			domClass.add(this._innerWrapperNode, "-d-switch-transition");
		},

		_cleanHandlers: function () {
			this._pHandlers.forEach(function (h) { this._knobGlassNode.removeEventListener(h.e, h.l); }.bind(this));
		}
	});
});