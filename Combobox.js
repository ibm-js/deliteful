/** @module deliteful/Combobox */
define([
	"dcl/dcl",
	"dstore/Filter",
	"dojo/string",
	"delite/register",
	"delite/FormValueWidget",
	"delite/HasDropDown",
	"./channelBreakpoints",
	"./features",
	"./Dialog",
	"./TooltipDialog",
	"./Combobox/ComboboxAPI",
	"./Combobox/ComboboxImplementation",
	"./Combobox/ComboPopup",
	"delite/handlebars!./Combobox/Combobox-desktop.html",
	"delite/handlebars!./Combobox/Combobox-mobile.html",
	"requirejs-dplugins/i18n!./Combobox/nls/Combobox"
], function (
	dcl,
	Filter,
	string,
	register,
	FormValueWidget,
	HasDropDown,
	channelBreakpoints,
	has,
	Dialog,
	TooltipDialog,
	ComboboxAPI,
	ComboboxImplementation,
	ComboPopup,
	desktopTemplate,
	mobileTemplate
) {
	var isMobile = !has("desktop-like-channel");

	/**
	 * Shared base class for ComboPopupDialog and ComboPopupTooltipDialog.
	 */
	var ComboPopupTooltipDialog = register("combo-popup-tooltip-dialog", [TooltipDialog], {
		focus: function () {
			// Call ComboPopup#focus().
			var focused = this.containerNode.firstChild.focus();

			// And if that doesn't work, fallback to focusing on the close icon
			// (which should be defined for both the Dialog and the TooltipDialog).
			if (!focused) {
				this.closeButtonNode.focus();
			}
		}
	});

	/**
	 * Methods and properties for the desktop version, which has an <input>
	 * and toggles and filters a List dropdown.
	 */
	var DesktopImplementation = dcl([ComboboxImplementation, HasDropDown], {
		template: desktopTemplate,

		// Flag used for binding the readonly attribute of the input element in the template
		_inputReadOnly: true,

		// Set aria-hasdropdown=listbox rather than aria-hasdropdown=menu.
		dropDownType: "listbox",

		// Leave focus in the original <input>.
		focusOnPointerOpen: false,

		/**
		 * Handle clicks on the `<input>`.
		 * Note that HasDropDown handles clicks on the arrow icon.
		 */
		inputClickHandler: function (event) {
			event.stopPropagation();
			event.preventDefault();

			if (this.disabled) {
				return;
			}

			if (!this.minFilterChars || this._inputReadOnly) {
				this.toggleDropDown();
			}
		},

		computeProperties: function () {
			this._inputReadOnly = this.readOnly || !this.autoFilter || this.selectionMode === "multiple";

			// Leave focus in the original <input>, except for multi-select mode, where you need to
			// focus the list to get JAWS to work.
			this.focusOnKeyboardOpen = this.selectionMode === "multiple";
		},

		refreshRendering: function (oldValues) {
			if ("_inputReadOnly" in oldValues) {
				// Note: Can't just put readonly={{_inputReadOnly}} in the template because we need to override
				// when delite/FormWidget sets the <input>'s readonly attribute based on this.readOnly.
				this.inputNode.readOnly = this._inputReadOnly;
			}

			// Update <input>'s value if necessary, but don't update the value because the user
			// typed a character into the <input> as that will move the caret to the end of the
			// <input>.
			if ("displayedValue" in oldValues) {
				if (this.displayedValue !== this.inputNode.value) {
					this.inputNode.value = this.displayedValue;
				}
			}
		},

		dropDownPosition: function () {
			return ["below", "above"];
		},

		// HasDropDown#_dropDownKeyUpHandler() override.
		// Do not call openDropDown if widget does not have a down arrow shown (auto-complete mode).
		// In this mode the popup will open when the user typed something and text.length > this.minFilterChars.
		_dropDownKeyUpHandler: dcl.superCall(function (sup) {
			return function () {
				if (this.hasDownArrow) {
					sup.call(this);
				}
			};
		}),

		/**
		 * Opens or closes the dropdown as appropriate.
		 */
		_showOrHideList: function (suppressChangeEvent) {
			// Compute whether or not to show the list.  Note that in mobile mode ComboPopup doesn't display a
			var inputElement = this.inputNode;
			var showList = inputElement.value.length >= this.minFilterChars;
			if (showList) {
				this.openDropDown();
			} else {
				this.closeDropDown(true /*refocus*/, suppressChangeEvent);
			}
		},

		openDropDown: dcl.superCall(function (sup) {
			return function () {
				// Adjust the dropdown contents to be filtered by the current value of the <input>.
				this.filter(this.inputNode.value);

				var promise = sup.apply(this, arguments);

				return promise.then(function () {
					// For single mode, keep focus on <input>, so user can type a search string.
					// But for multiple mode, send focus to the List, to make JAWS work.
					this.dropDown.focusDescendants = this.selectionMode === "multiple";

					// Aria-owns and aria-controls must point to the role=listbox, not the wrapper node.
					// See https://www.w3.org/TR/wai-aria-practices/#combobox.
					this.setAttribute("aria-owns", this.list.widgetId + "-container");
					this.inputNode.setAttribute("aria-controls", this.list.widgetId + "-container");

					this._updateScroll(undefined, true);	// sets this.list.navigatedDescendant
					this._setActiveDescendant(this.list.navigatedDescendant);

					// Avoid spurious error from accessibility DOM scanning tool.
					this.dropDown.tabIndex = -1;
				}.bind(this));
			};
		}),

		closeDropDown: dcl.superCall(function (sup) {
			return function (focus, suppressChangeEvent) {
				this.inputNode.removeAttribute("aria-activedescendant");
				this.inputNode.removeAttribute("aria-controls");

				// Closing the dropdown represents a commit interaction, unless the dropdown closes
				// automatically because the user backspaced, in which case suppressChangeEvent is true.
				if (!suppressChangeEvent) {
					this.handleOnChange(this.value); // emit "change" event
				}

				sup.apply(this, arguments);

				// TODO: destroy dropdown?
			};
		})
	});

	/**
	 * Methods and properties for the mobile version, which is essentially just a button
	 * that displays the ComboPopup widget.
	 */
	var MobileImplementation = dcl([FormValueWidget, HasDropDown], {
		template: mobileTemplate,

		// Set aria-hasdropdown=dialog rather than aria-hasdropdown=menu.
		dropDownType: "dialog",

		shouldInitializeRendering: dcl.superCall(function (sup) {
			return function (oldVals) {
				this._focusOnRender = this.contains(document.activeElement);

				// Workaround bizarre VoiceOver bug where it keeps announcing the button's original label
				// regardless of what it was changed to.
				return sup.call(this, oldVals) || "displayedValue" in oldVals;
			};
		}),

		postRender: function () {
			if (this._focusOnRender) {
				this.focus();
			}
		},

		/**
		 * Return true if the ComboPopup should be displayed in a centered Dialog,
		 * false to display in a TooltipDialog
		 */
		useCenteredDialog: function () {
			// TODO: this should depend on height, not width, and "height" needs to exclude the space
			// for the virtual keyboard.   Not sure what the cutoff should be.
			return window.innerWidth <= parseInt(channelBreakpoints.smallScreen, 10);
		},

		dropDownPosition: function () {
			return this.useCenteredDialog() ? ["center"] : ["below-centered", "above-centered"];
		},

		/**
		 * Factory method which creates the ComboPopup.
		 * @protected
		 */
		createComboPopup: function (labelledBy) {
			return new this.ComboPopupConstructor({
				autoFilter: this.autoFilter,
				defaultQuery: this.defaultQuery,
				displayedValue: this.displayedValue,
				filterDelay: this.filterDelay,
				filterMode: this.filterMode,
				ignoreCase: this.ignoreCase,
				labelledBy: labelledBy,
				list: this.list,
				minFilterChars: this.hasDownArrow ? 0 : this.minFilterChars,
				okMsg: this.okMsg,
				searchPlaceholder: this.searchPlaceholder,
				selectionMode: this.selectionMode,
				source: this.source,
				value: this.value
			});
		},

		/**
		 * Factory method which creates the Dialog/TooltipDialog holding the ComboPopup.
		 * @protected
		 */
		createDialog: function () {
			var dialog = new this.TooltipDialogConstructor({
				label: this.getLabel()
			});
			dialog.classList.add("d-combo-popup-tooltip-dialog");
			dialog.deliver();

			var labelledBy = dialog.widgetId + "-label";

			this.list.setAttribute("aria-labelledby", labelledBy);

			// Create ComboPopup.
			// Since the ComboPopup doesn't have a down arrow, if the Combobox does, then when
			// user clicks it the ComboPopup list should be instantly shown.
			this.comboPopup = this.createComboPopup(labelledBy);

			this.comboPopup.on("execute", function () {
				this.handleOnChange(this.comboPopup.value);
				this.displayedValue = this.comboPopup.displayedValue;
			}.bind(this));

			this.comboPopup.deliver();

			dialog.containerNode.appendChild(this.comboPopup);

			return dialog;
		},

		openDropDown: dcl.superCall(function (sup) {
			return function () {

				var promise = sup.apply(this, arguments);

				return promise.then(function () {
					if (this.hasDownArrow) {
						this.comboPopup.inputNode.value = this.displayedValue;
					}
				}.bind(this));
			};
		})
	});

	/**
	 * A form-aware and store-aware multichannel widget leveraging the `deliteful/list/List`
	 * widget for rendering the options.
	 *
	 * The corresponding custom tag is `<d-combobox>`.
	 *
	 * The property `list` allows to specify the List instance used by the widget.
	 * The customization of the mapping of data item attributes into render item
	 * attributes can be done on the `List` instance using the mapping API of `List`
	 * inherited from its superclass `delite/StoreMap`.
	 *
	 * The property `selectionMode` allows to choose between single and multiple
	 * choice modes.
	 *
	 * In single selection mode, if the property `autoFilter` is set to `true`
	 * (default is `false`) the widget allows to type one or more characters which
	 * are used for filtering the shown list items. By default, the filtering is
	 * case-insensitive, and an item is shown if its label contains the entered
	 * string. The default filtering policy can be customized thanks to the
	 * `filterMode` and `ignoreCase` properties.
	 *
	 * The widget provides multichannel rendering:
	 *
	 * - For desktop, the options are display in a dropdown below or above the root node.
	 * - For mobile, clicking the widget opens a Dialog (on phones) or a TooltipDialog
	 * (on tablets) that displays a list of options and optionally an <input> for filtering
	 * that list of options.   Note that this design was chosen in part to support VoiceOver
	 * navigation.
	 *
	 * The `value` property of the widget contains:
	 *
	 * - Single selection mode: the value of the selected list items. By default, the
	 * value of the first item is selected.
	 * - Multiple selection mode: an array containing the values of the selected items.
	 * Defaults to `[]`.
	 *
	 * If the widget is used in an HTML form, the submitted value contains:
	 *
	 * - Single selection mode: the same as widget's `value` property.
	 * - Multiple selection mode: a string containing a comma-separated list of the values
	 * of the selected items. Defaults to `""`.
	 *
	 * By default, the `label` field of the list render item is used as item value.
	 * A different field can be specified by using attribute mapping for `value` on the
	 * List instance.
	 *
	 * Remark: the option items must be added, removed or updated exclusively using
	 * List's store API. Direct operations using the DOM API are not supported.
	 *
	 * @example <caption>Markup</caption>
	 * JS:
	 * require(["deliteful/Combobox", "requirejs-domready/domReady!"],
	 *   function () {
	 *   });
	 * HTML:
	 * <d-combobox id="combobox1">
	 *   { "label": "France", "sales": 500, "profit": 50, "region": "EU" },
	 *   { "label": "Germany", "sales": 450, "profit": 48, "region": "EU" },
	 *   { "label": "UK", "sales": 700, "profit": 60, "region": "EU" },
	 *   { "label": "USA", "sales": 2000, "profit": 250, "region": "America" },
	 *   { "label": "Canada", "sales": 600, "profit": 30, "region": "America" },
	 *   { "label": "Brazil", "sales": 450, "profit": 30, "region": "America" },
	 *   { "label": "China", "sales": 500, "profit": 40, "region": "Asia" },
	 *   { "label": "Japan", "sales": 900, "profit": 100, "region": "Asia" }
	 * </d-combobox>
	 *
	 * @example <caption>Programmatic</caption>
	 * JS:
	 * require(["deliteful/Combobox", ..., "requirejs-domready/domReady!"],
	 *   function (Combobox, ...) {
	 *     var dataStore = ...; // Create data store
	 *     var combobox = new Combobox({source: dataStore, selectionMode: "multiple"}).
	 *       placeAt(...);
	 *   });
	 *
	 * @class module:deliteful/Combobox
	 * @augments module:deliteful/Combobox/ComboboxAPI
	 */
	var Imp = isMobile ? MobileImplementation : DesktopImplementation;
	var Combobox = register("d-combobox", [HTMLElement, ComboboxAPI, Imp], /** @lends module:deliteful/Combobox# */ {
		baseClass: "d-combobox",

		/**
		 * Widget used on mobile to display the ComboPopup in a tooltip dialog / dialog.
		 */
		TooltipDialogConstructor: ComboPopupTooltipDialog,

		/**
		 * Widget to edit value on mobile, containing the options list and filtering <input>.
		 */
		ComboPopupConstructor: ComboPopup,

		focus: function () {
			this.focusNode.focus();
		},

		/**
		 * Search for label of Combobox, so it can be applied to dropdown too.
		 * @returns {any}
		 */
		getLabel: function () {
			var labelNode = (this.focusNode.id &&
				this.ownerDocument.querySelector("label[for=" + this.focusNode.id + "]")) ||
				(this.hasAttribute("aria-labelledby") &&
					this.ownerDocument.getElementById(this.getAttribute("aria-labelledby")));
			return labelNode ? labelNode.textContent.trim() : (this.getAttribute("aria-label") || "");
		},

		loadDropDown: function () {
			// Destroy the old ComboPopup and create new one, in case properties (value,
			// displayedValue, list, source, etc.) have been changed.
			if (this.comboPopup) {
				this.dropDown.destroy();
				this.dropDown = this.comboPopup = null;
			}

			var dropDown = isMobile ? this.createDialog() : this.list;

			// Since the dropdown is not a child of the Combobox, it will not inherit
			// its dir attribute. Hence:
			var dir = this.getAttribute("dir");
			if (dir) {
				dropDown.setAttribute("dir", dir);
			}

			// Mobile dialog already has a label, but plain this.list doesn't.
			if (dropDown === this.list) {
				dropDown.setAttribute("aria-label", this.getLabel());
			}

			this.dropDown = dropDown; // delite/HasDropDown's property

			return dropDown;
		}
	});

	Combobox.ComboPopupTooltipDialog = ComboPopupTooltipDialog;

	return Combobox;
});
