define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/list/List"
], function (registerSuite, assert, List) {

	var list = null;

	var testHelper = {
			"Helper selectionMode 'multiple'" : function (/*Deferred*/ dfd, isListBox) {
				if (isListBox) {
					list.isAriaListbox = true;
				}
				list.selectionMode = "multiple";
				setTimeout(dfd.callback(function () {
					var selectionChangeEvent = null;
					var firstItem = list.getChildren()[0];
					var secondItem = list.getChildren()[1];
					var event = null;
					list.on("selection-change", function (event) {
						selectionChangeEvent = event;
					});
					assert.strictEqual(firstItem.className, "d-list-item");
					// Selection event on first item (select)
					event = {target: firstItem, preventDefault: function () {}};
					list._spaceKeydownHandler(event);
					assert.isNotNull(selectionChangeEvent);
					assert.isNull(selectionChangeEvent.oldValue, 0, "event1 old selection");
					assert.strictEqual(selectionChangeEvent.newValue.label, "item 1", "event1 new selection label");
					assert.strictEqual(selectionChangeEvent.renderer, firstItem, "event1 renderer");
					assert.strictEqual(selectionChangeEvent.triggerEvent, event, "event1 triggerEvent");
					selectionChangeEvent = null;
					assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "true");
					assert.strictEqual(secondItem.renderNode.getAttribute("aria-selected"), "false");
					// Selection event on second item (select)
					event = {target: secondItem, preventDefault: function () {}};
					list._spaceKeydownHandler(event);
					assert.isNotNull(selectionChangeEvent);
					assert.strictEqual(selectionChangeEvent.oldValue.label, "item 1", "event2 old selection label");
					assert.strictEqual(selectionChangeEvent.newValue.label, "item 2", "event2 new selection label 1");
					assert.strictEqual(selectionChangeEvent.renderer, secondItem, "event2 renderer");
					assert.strictEqual(selectionChangeEvent.triggerEvent, event, "event2 triggerEvent");
					selectionChangeEvent = null;
					assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "true");
					assert.strictEqual(secondItem.renderNode.getAttribute("aria-selected"), "true");
					// Selection event on first item (deselect)
					event = {target: firstItem, preventDefault: function () {}};
					list._spaceKeydownHandler(event);
					assert.isNotNull(selectionChangeEvent);
					assert.strictEqual(selectionChangeEvent.oldValue.label, "item 2", "event3 old selection label 1");
					assert.strictEqual(selectionChangeEvent.newValue.label, "item 2", "event3 new selection label");
					assert.strictEqual(selectionChangeEvent.renderer, firstItem, "event3 renderer");
					assert.strictEqual(selectionChangeEvent.triggerEvent, event, "event3 triggerEvent");
					selectionChangeEvent = null;
					// 
					assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "false");
					assert.strictEqual(secondItem.renderNode.getAttribute("aria-selected"), "true");
				}), 10);
				return dfd;
			},
			"Helper selectionMode 'single'" : function (/*Deferred*/ dfd, isListbox) {
				if (isListbox) {
					list.isAriaListbox = true;
				}
				list.selectionMode = "single";
				setTimeout(dfd.callback(function () {
					var selectionChangeEvent = null;
					var firstItem = list.getChildren()[0];
					var secondItem = list.getChildren()[1];
					var event = null;
					list.on("selection-change", function (event) {
						selectionChangeEvent = event;
					});
					assert.strictEqual(firstItem.className, "d-list-item");
					// Selection event on first item (select)
					event = {target: firstItem, preventDefault: function () {}};
					list._spaceKeydownHandler(event);
					assert.isNotNull(selectionChangeEvent);
					assert.strictEqual(selectionChangeEvent.oldValue, null, "event1 old selection");
					assert.strictEqual(selectionChangeEvent.newValue.label, "item 1", "event1 new selection");
					assert.strictEqual(selectionChangeEvent.renderer, firstItem, "event1 renderer");
					assert.strictEqual(selectionChangeEvent.triggerEvent, event, "event1 triggerEvent");
					selectionChangeEvent = null;
					assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "true");
					assert.strictEqual(secondItem.renderNode.getAttribute("aria-selected"), "false");
					// Selection event on second item (select)
					event = {target: secondItem, preventDefault: function () {}};
					list._spaceKeydownHandler(event);
					assert.isNotNull(selectionChangeEvent);
					assert.strictEqual(selectionChangeEvent.oldValue.label, "item 1", "event2 old selection");
					assert.strictEqual(selectionChangeEvent.newValue.label, "item 2", "event2 new selection");
					assert.strictEqual(selectionChangeEvent.renderer, secondItem, "event2 renderer");
					assert.strictEqual(selectionChangeEvent.triggerEvent, event, "event2 triggerEvent");
					selectionChangeEvent = null;
					assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "false");
					assert.strictEqual(secondItem.renderNode.getAttribute("aria-selected"), "true");
					// Selection event on second item (deselect)
					event = {target: secondItem, preventDefault: function () {}};
					list._spaceKeydownHandler(event);
					assert.isNotNull(selectionChangeEvent);
					assert.strictEqual(selectionChangeEvent.oldValue.label, "item 2", "event3 old selection");
					assert.strictEqual(selectionChangeEvent.newValue, null, "event3 new selection");
					assert.strictEqual(selectionChangeEvent.renderer, secondItem, "event3 renderer");
					assert.strictEqual(selectionChangeEvent.triggerEvent, event, "event3 triggerEvent");
					selectionChangeEvent = null;
					assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "false");
					assert.strictEqual(secondItem.renderNode.getAttribute("aria-selected"), "false");
				}), 10);
				return dfd;
			},
			"Helper selectionMode 'radio'" : function (/*Deferred*/ dfd, isListbox) {
				if (isListbox) {
					list.isAriaListbox = true;
				}
				list.selectionMode = "radio";
				setTimeout(dfd.callback(function () {
					var selectionChangeEvent = null;
					var firstItem = list.getChildren()[0];
					var secondItem = list.getChildren()[1];
					var event = null;
					list.on("selection-change", function (event) {
						selectionChangeEvent = event;
					});
					assert.strictEqual(firstItem.className, "d-list-item");
					// Selection event on first item (select)
					event = {target: firstItem, preventDefault: function () {}};
					list._spaceKeydownHandler(event);
					assert.isNotNull(selectionChangeEvent);
					assert.strictEqual(selectionChangeEvent.oldValue, null, "event1 old selection");
					assert.strictEqual(selectionChangeEvent.newValue.label, "item 1", "event1 new selection");
					assert.strictEqual(selectionChangeEvent.renderer, firstItem, "event1 renderer");
					assert.strictEqual(selectionChangeEvent.triggerEvent, event, "event1 triggerEvent");
					selectionChangeEvent = null;
					assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "true");
					assert.strictEqual(secondItem.renderNode.getAttribute("aria-selected"), "false");
					// Selection event on second item (select)
					event = {target: secondItem, preventDefault: function () {}};
					list._spaceKeydownHandler(event);
					assert.isNotNull(selectionChangeEvent);
					assert.strictEqual(selectionChangeEvent.oldValue.label, "item 1", "event2 old selection");
					assert.strictEqual(selectionChangeEvent.newValue.label, "item 2", "event2 new selection");
					assert.strictEqual(selectionChangeEvent.renderer, secondItem, "event2 renderer");
					assert.strictEqual(selectionChangeEvent.triggerEvent, event, "event2 triggerEvent");
					selectionChangeEvent = null;
					assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "false");
					assert.strictEqual(secondItem.renderNode.getAttribute("aria-selected"), "true");
					// Selection event on second item (does not deselect)
					event = {target: secondItem, preventDefault: function () {}};
					list._spaceKeydownHandler(event);
					assert.isNull(selectionChangeEvent);
					assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "false");
					assert.strictEqual(secondItem.renderNode.getAttribute("aria-selected"), "true");
				}), 10);
				return dfd;
			},
			"Helper delete selected item": function (/*Deferred*/ dfd, isListbox) {
				if (isListbox) {
					list.isAriaListbox = true;
				}
				list.selectionMode = "single";
				setTimeout(dfd.callback(function () {
					var selectionChangeEvent = null;
					var firstItem = list.getChildren()[0];
					// select first item
					var event = {target: firstItem, preventDefault: function () {}};
					list._spaceKeydownHandler(event);
					// now listen to selection-change event and remove the selected item from the store
					list.on("selection-change", function (event) {
						selectionChangeEvent = event;
					});
					list.store.remove(firstItem.item.id);
					assert.isNotNull(selectionChangeEvent);
					assert.strictEqual("item 1", selectionChangeEvent.oldValue.label);
					assert.isNull(selectionChangeEvent.newValue);
				}), 10);
				return dfd;
			},
			"Helper move selected item": function (/*Deferred*/ dfd, isListbox) {
				if (isListbox) {
					this.isAriaListbox = true;
				}
				list.selectionMode = "single";
				setTimeout(dfd.callback(function () {
					var firstItem = list.getChildren()[0];
					var thirdItem = list.getChildren()[2];
					// select first item
					var event = {target: firstItem, preventDefault: function () {}};
					list._spaceKeydownHandler(event);
					assert(list.isSelected(firstItem.item), "item selected before move");
					list.store.put(firstItem.item, {before: thirdItem.item});
					var secondItem = list.getChildren()[1];
					assert(list.isSelected(secondItem.item), "item selected after move");
					assert(secondItem.renderNode.getAttribute("aria-selected"),
							"item selected after move (aria-selected attribute)");
				}), 10);
				return dfd;
			},
			"Helper aria properties and classes when selection mode is single": function (/*Deferred*/ dfd, isListbox) {
				if (isListbox) {
					list.isListbox = true;
				}
				list.selectionMode = "single";
				setTimeout(dfd.callback(function () {
					assert.isTrue(list.className.indexOf("d-selectable") >= 0, "d-selectable class");
					assert.isTrue(list.className.indexOf("d-multiselectable") === -1, "d-multiselectable class");
					assert.isFalse(list.hasAttribute("aria-multiselectable"),
							"no aria-multiselectable attribute expected");
					var firstItem = list.getChildren()[0];
					assert.isTrue(firstItem.className.indexOf("d-selected") === -1, "no d-selected class expected");
					assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "false",
							"no aria-selected attribute 'false' expected on first item");
					// select first item
					var event = {target: firstItem, preventDefault: function () {}};
					list._spaceKeydownHandler(event);
					assert.isTrue(firstItem.className.indexOf("d-selected") >= 0, "d-selected class expected");
					assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "true",
							"aria-selected attribute 'true' expected on first item after selection");
				}), 10);
				return dfd;
			},
			"Helper aria properties and classes when selection mode is radio": function (/*Deferred*/ dfd, isListbox) {
				if (isListbox) {
					list.isListbox = true;
				}
				list.selectionMode = "radio";
				setTimeout(dfd.callback(function () {
					assert.isTrue(list.className.indexOf("d-selectable") >= 0, "d-selectable class");
					assert.isTrue(list.className.indexOf("d-multiselectable") === -1, "d-multiselectable class");
					assert.isFalse(list.hasAttribute("aria-multiselectable"),
							"no aria-multiselectable attribute expected");
					var firstItem = list.getChildren()[0];
					assert.isTrue(firstItem.className.indexOf("d-selected") === -1, "no d-selected class expected");
					assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "false",
							"no aria-selected attribute 'false' expected on first item");
					// select first item
					var event = {target: firstItem, preventDefault: function () {}};
					list._spaceKeydownHandler(event);
					assert.isTrue(firstItem.className.indexOf("d-selected") >= 0, "d-selected class expected");
					assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "true",
							"aria-selected attribute 'true' expected on first item after selection");
				}), 10);
				return dfd;
			},
			"Helper aria properties and classes when selection mode is multiple":
				function (/*Deferred*/ dfd, isListbox) {
				if (isListbox) {
					list.isAriaListbox = true;
				}
				list.selectionMode = "multiple";
				setTimeout(dfd.callback(function () {
					assert.isTrue(list.className.indexOf("d-selectable") === -1, "d-selectable class");
					assert.isTrue(list.className.indexOf("d-multiselectable") >= 0, "d-multiselectable class");
					assert.strictEqual(list.getAttribute("aria-multiselectable"), "true",
							"aria-multiselectable attribute expected");
					var firstItem = list.getChildren()[0];
					assert.isTrue(firstItem.className.indexOf("d-selected") === -1, "no d-selected class expected");
					assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "false",
							"aria-selected attribute expected on first item");
					// select first item
					var event = {target: firstItem, preventDefault: function () {}};
					list._spaceKeydownHandler(event);
					assert.isTrue(firstItem.className.indexOf("d-selected") >= 0, "d-selected class expected");
					assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "true",
							"aria-selected attribute expected on first item after selection");
				}), 10);
				return dfd;
			}
		};

	registerSuite({
		name: "list/Selection",
		beforeEach: function () {
			if (list) {
				list.destroy();
			}
			list = new List();
			document.body.appendChild(list);
			list.startup();
			list.store.filter();
			list.store.add({label: "item 1"});
			list.store.add({label: "item 2"});
			list.store.add({label: "item 3"});
		},
		"aria listbox with selectionMode 'multiple'" : function () {
			return testHelper["Helper selectionMode 'multiple'"](this.async(1000), true);
		},
		"selectionMode 'multiple'" : function () {
			return testHelper["Helper selectionMode 'multiple'"](this.async(1000));
		},
		"aria listbox with selectionMode 'single'" : function () {
			return testHelper["Helper selectionMode 'single'"](this.async(1000), true);
		},
		"selectionMode 'single'" : function () {
			return testHelper["Helper selectionMode 'single'"](this.async(1000));
		},
		"aria listbox with selectionMode 'radio'" : function () {
			return testHelper["Helper selectionMode 'radio'"](this.async(1000), true);
		},
		"selectionMode 'radio'" : function () {
			return testHelper["Helper selectionMode 'radio'"](this.async(1000));
		},
		"selectionMode 'none'" : function () {
			var dfd = this.async(1000);
			var selectionChangeEvent = null;
			var firstItem = list.getChildren()[0];
			var event = null;
			list.selectionMode = "none";
			setTimeout(dfd.callback(function () {
				list.on("selection-change", function (event) {
					selectionChangeEvent = event;
				});
				assert.strictEqual(firstItem.className, "d-list-item");
				// Selection event on first item (no effect)
				event = {target: firstItem, preventDefault: function () {}};
				list._spaceKeydownHandler(event);
				assert.isNull(selectionChangeEvent);
				assert.strictEqual(firstItem.className, "d-list-item");
			}), 10);
			return dfd;
		},
		"revert selection to 'none' remove event handler": function () {
			var dfd = this.async(1000);
			list.selectionMode = "single";
			setTimeout(function () {
				assert.isNotNull(list._selectionClickHandle, "single");
				assert.isDefined(list._selectionClickHandle, "single");
				list.selectionMode = "none";
				setTimeout(function () {
					assert.isNull(list._selectionClickHandle, "first none");
					list.selectionMode = "multiple";
					setTimeout(function () {
						assert.isNotNull(list._selectionClickHandle, "multiple");
						assert.isDefined(list._selectionClickHandle, "multiple");
						list.selectionMode = "none";
						setTimeout(function () {
							assert.isNull(list._selectionClickHandle, "second none");
							dfd.resolve();
						}, 10);
					}, 10);
				}, 10);
			}, 10);
			return dfd;
		},
		"aria listbox delete selected item": function () {
			return testHelper["Helper delete selected item"](this.async(1000), true);
		},
		"delete selected item": function () {
			return testHelper["Helper delete selected item"](this.async(1000));
		},
		"aria listbox move selected item": function () {
			return testHelper["Helper move selected item"](this.async(1000), true);
		},
		"move selected item": function () {
			return testHelper["Helper move selected item"](this.async(1000));
		},
		"aria listbox aria properties and classes when selection mode is single": function () {
			return testHelper["Helper aria properties and classes when selection mode is single"](this.async(1000),
					true);
		},
		"aria properties and classes when selection mode is single": function () {
			return testHelper["Helper aria properties and classes when selection mode is single"](this.async(1000));
		},
		"aria listbox aria properties and classes when selection mode is radio": function () {
			return testHelper["Helper aria properties and classes when selection mode is radio"](this.async(1000),
					true);
		},
		"aria properties and classes when selection mode is radio": function () {
			return testHelper["Helper aria properties and classes when selection mode is radio"](this.async(1000));
		},
		"aria listbox aria properties and classes when selection mode is multiple": function () {
			testHelper["Helper aria properties and classes when selection mode is multiple"](this.async(1000), true);
		},
		"aria properties and classes when selection mode is multiple": function () {
			testHelper["Helper aria properties and classes when selection mode is multiple"](this.async(1000));
		},
		"aria properties and classes when selection mode is none": function () {
			var dfd = this.async(1000);
			list.selectionMode = "none";
			setTimeout(dfd.callback(function () {
				assert.isTrue(list.className.indexOf("d-selectable") === -1, "d-selectable class");
				assert.isTrue(list.className.indexOf("d-multiselectable") === -1, "d-multiselectable class");
				var firstItem = list.getChildren()[0];
				assert.isTrue(firstItem.className.indexOf("d-selected") === -1, "no d-selected class expected");
			}), 10);
			return dfd;
		},
		"aria properties and classes updated when selection mode is changed": function () {
			var dfd = this.async(1000);
			list.selectionMode = "single";
			setTimeout(dfd.rejectOnError(function () {
				var firstItem = list.getChildren()[0];
				// select first item
				var event = {target: firstItem, preventDefault: function () {}};
				list._spaceKeydownHandler(event);
				// list
				assert.isFalse(list.hasAttribute("aria-multiselectable"),
						"A: no aria-multiselectable attribute expected");
				assert.isTrue(list.className.indexOf("d-multiselectable") === -1, "A: d-multiselectable class");
				assert.isTrue(list.className.indexOf("d-selectable") >= 0, "A: d-selectable class");
				// first item
				assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "true",
				"A: aria-selected attribute expected on first item");
				assert.isTrue(firstItem.className.indexOf("d-selected") >= 0, "A: d-selected class on first item");
				// second item
				assert.strictEqual(list.getChildren()[1].renderNode.getAttribute("aria-selected"), "false",
						"A: aria-selected 'false' expected on second item");
				assert.isTrue(list.getChildren()[1].className.indexOf("d-selected") === -1,
						"A: no d-selected class on second item");
				// third item
				assert.strictEqual(list.getChildren()[2].renderNode.getAttribute("aria-selected"), "false",
						"A: aria-selected 'false' expected on third item");
				assert.isTrue(list.getChildren()[2].className.indexOf("d-selected") === -1,
						"A: no d-selected class on third item");
				list.selectionMode = "multiple";
				setTimeout(dfd.rejectOnError(function () {
					// list
					assert.isTrue(list.hasAttribute("aria-multiselectable"),
							"B: aria-multiselectable attribute expected");
					assert.isTrue(list.className.indexOf("d-multiselectable") >= 0, "B: d-multiselectable class");
					assert.isTrue(list.className.indexOf("d-selectable") === -1, "B: d-selectable class");
					// first item
					assert.strictEqual(list.getChildren()[0].renderNode.getAttribute("aria-selected"), "true",
						"B: aria-selected attribute expected on first item");
					assert.isTrue(list.getChildren()[0].className.indexOf("d-selected") >= 0,
							"B: d-selected class on first item");
					// second item
					assert.strictEqual(list.getChildren()[1].renderNode.getAttribute("aria-selected"), "false",
					"B: aria-selected attribute expected on second item");
					assert.isTrue(list.getChildren()[1].className.indexOf("d-selected") === -1,
					"B: d-selected class on second item");
					// third item
					assert.strictEqual(list.getChildren()[2].renderNode.getAttribute("aria-selected"), "false",
					"B: aria-selected attribute expected on third item");
					assert.isTrue(list.getChildren()[2].className.indexOf("d-selected") === -1,
					"B: d-selected class on third item");
					list.selectionMode = "none";
					setTimeout(dfd.callback(function () {
						// list
						assert.isFalse(list.hasAttribute("aria-multiselectable"),
								"C: no aria-multiselectable attribute expected");
						assert.isTrue(list.className.indexOf("d-multiselectable") === -1, "C: d-multiselectable class");
						assert.isTrue(list.className.indexOf("d-selectable") === -1, "C: d-selectable class");
						// first item
						assert.isFalse(list.getChildren()[0].renderNode.hasAttribute("aria-selected"),
						"C: no aria-selected attribute expected on first item");
						assert.isTrue(list.getChildren()[0].className.indexOf("d-selected") === -1,
						"C: d-selected class on first item");
						// second item
						assert.isFalse(list.getChildren()[1].renderNode.hasAttribute("aria-selected"),
						"C: no aria-selected attribute expected on second item");
						assert.isTrue(list.getChildren()[1].className.indexOf("d-selected") === -1,
						"C: d-selected class on second item");
						// third item
						assert.isFalse(list.getChildren()[2].renderNode.hasAttribute("aria-selected"),
						"C: no aria-selected attribute expected on third item");
						assert.isTrue(list.getChildren()[2].className.indexOf("d-selected") === -1,
						"C: d-selected class on third item");
					}), 10);
				}), 10);
			}), 10);
			return dfd;
		},
		teardown : function () {
			list.destroy();
		}
	});
});
