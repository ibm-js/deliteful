/** @module deliteful/Select */
define([
	"dcl/dcl",
	"dojo/_base/declare", // TODO: replace (when replacement confirmed)
	"dojo/on", // TODO: replace (when replacement confirmed)
	"dojo/dom-class", // TODO: replace (when replacement confirmed)
	"dstore/Memory",
	"dstore/Observable",
	"delite/register",
	"delite/FormValueWidget", // TODO: check whether FormWidget wouldn't be more appropriate (delite/issues/#177)
	"delite/StoreMap",
	"delite/Selection",
	"delite/handlebars!./Select/Select.html",
	"delite/theme!./Select/themes/{{theme}}/Select_css"
], function (dcl, declare, on, domClass, Memory, Observable, register,
	FormValueWidget, StoreMap, Selection, template) {

	/**
	 * A form-aware and store-aware widget leveraging the native HTML5 `<select>`
	 * element.
	 * It has the following characteristics:
	 * * The corresponding custom tag is `<d-select>`.
	 * * Store support (limitation: to avoid graphic glitches, the updates to the
	 * store should not be done while the native dropdown of the select is open).
	 * * The item rendering has the limitations of the `<option>` elements of the
	 * native `<select>`.
	 * 
	 * TODO: improve doc.
	 * 
	 * Remarks:
	 * * The option items must be added, removed or updated exclusively using
	 * the store API. Direct operations using the DOM API are not supported.
	 * * The handling of the selected options of the underlying native `<select>`
	 * must be done using the API inherited by deliteful/Select from delite/Selection.
	 * 
	 * @example <caption>Using the default store</caption>
	 * JS:
	 * require("deliteful/Select", "dom/domReady!"],
	 *   function () {
	 *     select1.store.add({text: "Option 1", value: "1"});
	 *     ...
	 *   });
	 * HTML:
	 * <d-select id="select1"></d-select>
	 * @example <caption>Using user's store</caption>
	 * JS:
	 * require("dojo/_base/declare", "dstore/Memory", "dstore/Observable",
	 *         "deliteful/Select", "dom/domReady!"],
	 *   function (declare, Memory, Observable) {
	 *     var store = new (declare([Memory, Observable]))({});
	 *     select1.store = store;
	 *     store.add({text: "Option 1", value: "1"});
	 *     ...
	 *   });
	 * HTML:
	 * <d-select selectionMode="multiple" id="select1"></d-select>
	 * 
	 * @class module:deliteful/Select
	 * @augments {module:delite/FormWidget}
	 * @augments {module:delite/Store}
	 */
	return register("d-select", [HTMLElement, FormValueWidget, StoreMap, Selection], /** @lends module:deliteful/Select# */ {
		
		// Note: the properties `store` and `query` are inherited from delite/Store, and
		// the property `disabled` is inherited from delite/FormWidget.
		
		/**
		 * The number of rows that should be visible at one time when the widget
		 * is presented as a scrollable list box. Corresponds to the `size` attribute
		 * of the underlying native HTML `<select>`.
		 * @member {number}
		 * @default 0
		 */
		size: 0, 
		
		/**
		 * The name of the property of store items which contains the text of Select's options.
		 * @member {string}
		 * @default "text"
		 */
		textAttr: "text",
		
		/**
		 * The name of the property of store items which contains the value of Select's options.
		 * @member {string}
		 * @default "value"
		 */
		valueAttr: "value",
		
		/**
		 * The name of the property of store items which contains the disabled
		 * value of Select's options.
		 * @member {string}
		 * @default "disabled"
		 */
		disabledAttr: "disabled",
		
		baseClass: "d-select",
		
		/**
		 * Indicates whether multiple options can be selected. If `false`, only one option
		 * can be selected at a time. This private property is used in the widget template
		 * for binding the `multiple` attribute of the underlying native select.
		 * @member {boolean}
		 * @default false
		 * @private
		 */
		multipleSelect: false, // unfortunately an underscore prefix would break the binding in the template
		
		/**
		 * The chosen selection mode.
		 *
		 * Valid values are:
		 *
		 * 1. "single": Only one option can be selected at a time.
		 * 2. "multiple": Several options can be selected (by taping or using the
		 * control key modifier).
		 *
		 * Changing this value impacts the currently selected items to adapt the
		 * selection to the new mode. However, regardless of the selection mode,
		 * it is always possible to set several selected items using the
		 * `selectedItem` or `selectedItems` properties.
		 * The mode will be enforced only when using `setSelected` and/or
		 * `selectFromEvent` APIs.
		 *
		 * @member {string} module:deliteful/Select#selectionMode
		 * @default "single"
		 */
		// The purpose of the above pseudo-property is to adjust the documentation
		// of selectionMode as provided by delite/Selection.
		  
		buildRendering: template,
		
		preCreate: function () {
			// The properties "store" and "query" are added as invalidating properties
			// by delite/Store.preCreate(). delite/FormWidget adds "disabled".
			this.addInvalidatingProperties(
				// renderItems is delite/Store's property; see delite issue #188
				// TODO: check if still needed depending on the result of this issue.
				"renderItems",
				"textAttr",
				"valueAttr",
				"disabledAttr"
			);
		},
		
		postCreate: function () {
			if (!this.store) { // If not specified by the user
				// TODO: replacement for the use of dojo/_base/declare?
				// (can't use dcl because doesn't work with dstore)
				this.store = new (declare([Memory, Observable]))({});
			}
			
			this.focusNode = this.valueNode; // for delite/FormWidget's sake
			
			// To provide graphic feedback for focus, react to focus/blur events
			// on the underlying native select. The CSS class is used instead
			// of the focus pseudo-class because the browsers give the focus
			// to the underlying select, not to the widget.
			this.own(on(this.valueNode, "focus", function () {
				domClass.add(this, "d-select-focus");
			}.bind(this)));
			this.own(on(this.valueNode, "blur", function () {
				domClass.remove(this, "d-select-focus");
			}.bind(this)));
			
			// Thanks to the custom getter of widget's `value`, there is no need for
			// code to keep the property in sync after a form reset.
		},
		
		refreshRendering: function (props) {
			if (props.renderItems) {
				// Populate the select with the items retrieved from the store.
				var items = this.renderItems;
				var n = items ? items.length : 0;
				// TODO: CHECKME/IMPROVEME. Also called after adding, deleting or updating just one item.
				// Worth optimizing to avoid recreating from scratch?
				this.valueNode.innerHTML = ""; // Remove the existing options from the DOM
				if (n > 0) {
					var fragment = document.createDocumentFragment();
					var dataItem, option;
					for (var i = 0; i < n; i++) {
						dataItem = items[i];
						option = document.createElement("option");
						// According to http://www.w3.org/TR/html5/forms.html#the-option-element, we 
						// could use equivalently the label or the text IDL attribute of the option element.
						// However, using the label attr. breaks the rendering in FF29/Win7!
						// This is https://bugzilla.mozilla.org/show_bug.cgi?id=40545.
						// Hence don't do
						// option.label = dataItem.label;
						// Instead:
						if (dataItem.text) { // optional
							option.innerHTML = dataItem.text;
						} 
						if (dataItem.value) { // optional
							option.setAttribute("value", dataItem.value);
						}
						if (this.isSelected(dataItem)) { // optional
							option.setAttribute("selected", "true");
						}
						if (dataItem.disabled) { // optional
							option.setAttribute("disabled", dataItem.disabled);
						}
						
						fragment.appendChild(option);
					}
					this.valueNode.appendChild(fragment);
				}
			}
		},
		
		getIdentity: function (renderItem) {
			// Override of delite/Selection's method
			return renderItem.id;
		},
		
		updateRenderers: function (renderItems) {
			// Override of delite/Selection's method
			// Trigger recreation from scratch:
			this.invalidateRendering("renderItems");
		},
		
		_setValueAttr: function (value) {
			if (this.valueNode) {
				this.valueNode.value = value;
			}
		},
		
		_getValueAttr: function () {
			return this.valueNode ? this.valueNode.value : "";
		},
		
		_setSelectionModeAttr: dcl.superCall(function (sup) {
			// Override of the setter from delite/Selection for 2 purposes:
			// Forbid the value "none" and convert the value of selectionMode
			// into the appropriate value of the non-documented property multiple
			// which is used as target for the binding of the multiple attribute
			// of the native select in the widget template.
			return function (value) {
				if (value !== "single" && value !== "multiple") {
					throw new TypeError("'" + value +
						"' not supported for selectionMode; keeping the previous value of '" +
						this.selectionMode + "'");
				} else {
					// Update the internal widget property used for the binding in the template
					this.multipleSelect = (value == "multiple");
				}
				if (sup) {
					sup.call(this, value);
				}
			};
		})
	});
});
