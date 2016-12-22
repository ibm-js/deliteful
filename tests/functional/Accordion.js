define(["intern",
	"intern!object",
	"intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/dojo/node!leadfoot/keys",
	"intern/chai!assert",
	"require"
], function (intern, registerSuite, pollUntil, keys, assert, require) {
	var PAGE = "./Accordion.html";

	var panelHeaderStr = "_panelHeader";

	function checkPanelIsOpen(remote, panel) {
		return remote
			.findById(panel)
				.getProperty("open")
				.then(function (open) {
					assert.isTrue(open, panel + ".open");
				})
				.isDisplayed()
				.then(function (displayed) {
					assert.isTrue(displayed, panel + " visible");
				})
				.end()
			.findByCssSelector("#" + panel + panelHeaderStr)
				.getProperty("open")
				.then(function (checked) {
					assert.isTrue(checked, panel + ".header.open");
				})
				.end()
			.execute("return document.getElementById(" + panel + ")")
				.then(function (elem) {
					pollUntil(function (value) {
						var classes = value.getAttribute("class");
						classes = classes.trim().split(/\s+/g);
						return classes.indexOf("d-accordion-open-panel") !== -1 ? true : null;
					}, [elem], intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL);
				})
				.end();
	}

	function checkPanelIsClosed(remote, panel) {
		return remote
			.findById(panel)
				.getProperty("open")
				.then(function (open) {
					assert.isFalse(open, panel + ".open");
				})
				.isDisplayed()
				.then(function (displayed) {
					assert.isFalse(displayed, panel + " hidden");
				})
				.end()
			.findByCssSelector("#" + panel + panelHeaderStr)
				.getProperty("open")
				.then(function (checked) {
					assert.isFalse(checked, panel + ".header.open");
				})
				.end()
			.execute("return document.getElementById(" + panel + ")")
				.then(function (elem) {
					pollUntil(function (value) {
						return value.style.display === "none" ? false : null;
					}, [elem], intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL);
				})
				.end();
	}

	registerSuite({
		name: "Accordion tests",
		setup: function () {
			var remote = this.remote;
			return remote
				.get(require.toUrl(PAGE))
				.then(pollUntil("return ready ? true : null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
		},

		"Initial state": function () {
			var remote = this.remote;
			return remote
				.then(function () {
					return checkPanelIsOpen(remote, "panel1");
				})
				.then(function () {
					return checkPanelIsClosed(remote, "panel2");
				})
				.then(function () {
					return checkPanelIsClosed(remote, "panel3");
				});
		},

		"SingleOpen Mode - mouse": {
			beforeEach: function () {
				// Try to make the tests independent by starting in a state where the first panel is open.
				return this.remote
					.findByCssSelector("#panel1" + panelHeaderStr).click().end();
			},

			"Open panel by clicking": function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("#panel2" + panelHeaderStr)
					.click()
					.end()
					.sleep(500)
					.then(function () {
						return checkPanelIsClosed(remote, "panel1");
					})
					.then(function () {
						return checkPanelIsOpen(remote, "panel2");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel3");
					});
			},

			"Open panel by clicking on the label": function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("#panel3" + panelHeaderStr + " > span:last-child").click().end()
					.sleep(500)
					.then(function () {
						return checkPanelIsClosed(remote, "panel1");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel2");
					})
					.then(function () {
						return checkPanelIsOpen(remote, "panel3");
					});
			},

			"Open panel by clicking on the icon": function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("#panel2" + panelHeaderStr + " > span:first-child").click().end()
					.sleep(500)
					.then(function () {
						return checkPanelIsClosed(remote, "panel1");
					})
					.then(function () {
						return checkPanelIsOpen(remote, "panel2");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel3");
					});
			},

			"Try to close the open panel": function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("#panel1" + panelHeaderStr + " > span:last-child").click().end()
					.sleep(500)
					.then(function () {
						return checkPanelIsOpen(remote, "panel1");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel2");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel3");
					});
			}
		},

		"SingleOpen Mode - keyboard": {
			setup: function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
			},

			beforeEach: function () {
				// Always start with the first panel open, and focus on the first header.
				return this.remote
					.findByCssSelector("#panel1" + panelHeaderStr).click().end()
					.findById("inputBeforeAccordion1").click().end()
					.pressKeys(keys.TAB);
			},

			"Open panel by using ENTER or SPACE key": function () {
				var remote = this.remote;
				return remote
					.pressKeys(keys.ARROW_DOWN)	// panel 1 already open, so try panel 2
					.pressKeys(keys.ENTER)
					.sleep(500)
					.then(function () {
						return checkPanelIsClosed(remote, "panel1");
					})
					.then(function () {
						return checkPanelIsOpen(remote, "panel2");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel3");
					})
					.pressKeys(keys.ARROW_DOWN)
					.pressKeys(keys.SPACE)
					.sleep(500)
					.then(function () {
						return checkPanelIsClosed(remote, "panel1");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel2");
					})
					.then(function () {
						return checkPanelIsOpen(remote, "panel3");
					});
			},

			"HOME and END keys": function () {
				return this.remote
					.pressKeys(keys.END)		// go from first to last
					.execute("return document.activeElement.getAttribute('id');").then(function (value) {
						assert.strictEqual(value.replace(panelHeaderStr, ""), "panel3");
					})
					.pressKeys(keys.HOME)		// and back to first
					.execute("return document.activeElement.getAttribute('id');").then(function (value) {
						assert.strictEqual(value.replace(panelHeaderStr, ""), "panel1");
					});
			},

			"Arrow keys": function () {
				// Moving between panels using arrow keys.
				return this.remote
					.pressKeys(keys.ARROW_RIGHT)
					.execute("return document.activeElement.getAttribute('id');").then(function (value) {
						assert.strictEqual(value.replace(panelHeaderStr, ""), "panel2", "after ARROW_RIGHT");
					})
					.pressKeys(keys.ARROW_LEFT)
					.execute("return document.activeElement.getAttribute('id');").then(function (value) {
						assert.strictEqual(value.replace(panelHeaderStr, ""), "panel1", "after ARROW_LEFT");
					})
					.pressKeys(keys.ARROW_DOWN)
					.execute("return document.activeElement.getAttribute('id');").then(function (value) {
						assert.strictEqual(value.replace(panelHeaderStr, ""), "panel2", "after ARROW_DOWN");
					})
					.pressKeys(keys.ARROW_UP)
					.execute("return document.activeElement.getAttribute('id');").then(function (value) {
						assert.strictEqual(value.replace(panelHeaderStr, ""), "panel1", "after ARROW_UP");
					});
			},

			"Tab into accordion": function () {
				return this.remote
					.pressKeys(keys.ARROW_DOWN)			// go to header 2
					.execute("return document.activeElement.getAttribute('id');").then(function (value) {
						assert.strictEqual(value.replace(panelHeaderStr, ""), "panel2", "arrow to header 2");
					})
					.pressKeys(keys.SPACE)				// open panel 2
					.pressKeys(keys.ARROW_DOWN)			// go to panel 3
					.execute("return document.activeElement.getAttribute('id');").then(function (value) {
						assert.strictEqual(value.replace(panelHeaderStr, ""), "panel3", "arrow to header 3");
					})
					.pressKeys(keys.SHIFT + keys.TAB)	// shift-tab to panel 2
					.execute("return document.activeElement.getAttribute('id');").then(function (value) {
						assert.strictEqual(value, "panel2_input");
					})
					.pressKeys(keys.TAB)				// shift-tab to header 2
					.execute("return document.activeElement.getAttribute('id');").then(function (value) {
						assert.strictEqual(value.replace(panelHeaderStr, ""), "panel2",
							"shift-tab to header 2");
					})
					.pressKeys(keys.TAB)	// shift-tab to before accordion
					.execute("return document.activeElement.getAttribute('id');").then(function (value) {
						assert.strictEqual(value, "inputBeforeAccordion1");
					})
					.pressKeys(keys.SHIFT)				// release shift key
					.pressKeys(keys.TAB)				// tab back in to accordion, to header 2
					.execute("return document.activeElement.getAttribute('id');").then(function (value) {
						assert.strictEqual(value.replace(panelHeaderStr, ""), "panel2",
							"tab to header 2");
					});
			},

			// Shift-tab into Accordion is non-intuitive since there's no infrastructure to differentiate
			// when a user shift-tabs into the accordion rather than clicking into it.
			// Shift-tab currently goes to the last open panel with a
			// tab-navigable element, or if there are no open panels with focusable elements, then to the
			// header for the first open panel.
			"shift-tab into accordion": function () {
				return this.remote
					.pressKeys(keys.ARROW_DOWN)			// go to panel 2
					.execute("return document.activeElement.getAttribute('id');").then(function (value) {
						assert.strictEqual(value.replace(panelHeaderStr, ""), "panel2", "header 2");
					})
					.pressKeys(keys.SPACE)				// open panel 2
					.pressKeys(keys.ARROW_DOWN)			// go to panel 3
					.pressKeys(keys.TAB)				// tab out of accordion
					.pressKeys(keys.SHIFT + keys.TAB)	// shift-tab back in to panel 2
					.pressKeys(keys.SHIFT)				// release shift key
					.execute("return document.activeElement.getAttribute('id');").then(function (value) {
						assert.strictEqual(value, "panel2_input", "shift-tab into panel 2");
					})
					.pressKeys(keys.SHIFT + keys.TAB)	// shift-tab to header 2
					.pressKeys(keys.SHIFT)				// release shift key
					.execute("return document.activeElement.getAttribute('id');").then(function (value) {
						assert.strictEqual(value.replace(panelHeaderStr, ""), "panel2",
							"shift-tab to header 2");
					});
			},

			"Arrow keys - cyclic": function () {
				return this.remote
					// From last to first and from first to last
					.pressKeys(keys.ARROW_LEFT)
					.execute("return document.activeElement.getAttribute('id');")
					.then(function (value) {
						assert.strictEqual(value.replace(panelHeaderStr, ""), "panel3");
					})
					.pressKeys(keys.ARROW_RIGHT)
					.execute("return document.activeElement.getAttribute('id');")
					.then(function (value) {
						assert.strictEqual(value.replace(panelHeaderStr, ""), "panel1");
					})
					.pressKeys(keys.ARROW_UP)
					.execute("return document.activeElement.getAttribute('id');")
					.then(function (value) {
						assert.strictEqual(value.replace(panelHeaderStr, ""), "panel3");
					})
					.pressKeys(keys.ARROW_DOWN)
					.execute("return document.activeElement.getAttribute('id');")
					.then(function (value) {
						assert.strictEqual(value.replace(panelHeaderStr, ""), "panel1");
					});
			},

			"Tab and shift-tab within accordion": function () {
				return this.remote
					.execute("return document.activeElement.getAttribute('id');")
					.then(function (value) {
						assert.strictEqual(value.replace(panelHeaderStr, ""), "panel1"); // header
					})
					.pressKeys(keys.TAB)
					.execute("return document.activeElement.getAttribute('id');")
					.then(function (value) {
						assert.strictEqual(value, "panel1_input");	// first element in panel
					})
					.pressKeys(keys.SHIFT + keys.TAB)
					.execute("return document.activeElement.getAttribute('id');")
					.then(function (value) {
						assert.strictEqual(value.replace(panelHeaderStr, ""), "panel1");
					})
					.pressKeys(keys.TAB)		// shift-tab
					.pressKeys(keys.SHIFT)		// release shift
					.execute("return document.activeElement.getAttribute('id');")
					.then(function (value) {
						assert.strictEqual(value, "inputBeforeAccordion1");
					});
			}
		},

		"MultipleOpen Mode": {
			setup: function () {
				var remote = this.remote;
				return remote
					.execute("document.getElementById('accordion').style.display = 'none'")
					.execute("document.getElementById('accordion2').style.display = ''");
			},
			"Open all panels": function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("#panel22" + panelHeaderStr)
						.click()
						.end()
					.sleep(500)
					.findByCssSelector("#panel23" + panelHeaderStr)
						.click()
						.end()
					.sleep(500)
					.then(function () {
						return checkPanelIsOpen(remote, "panel21");
					})
					.then(function () {
						return checkPanelIsOpen(remote, "panel22");
					})
					.then(function () {
						return checkPanelIsOpen(remote, "panel23");
					});
			},
			"Close panel": function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("#panel22" + panelHeaderStr)
						.click()
						.end()
					.sleep(500)
					.then(function () {
						return checkPanelIsOpen(remote, "panel21");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel22");
					})
					.then(function () {
						return checkPanelIsOpen(remote, "panel23");
					});
			},
			"Close panel by clicking on the label": function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("#panel23" + panelHeaderStr + " > span:last-child")
						.click()
						.end()
					.sleep(500)
					.then(function () {
						return checkPanelIsOpen(remote, "panel21");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel22");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel23");
					});
			},
			"Try to close last open panel": function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("#panel21" + panelHeaderStr)
						.click()
						.end()
					.sleep(500)
					.then(function () {
						return checkPanelIsOpen(remote, "panel21");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel22");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel23");
					});
			}
		},

		"Custom headers": {
			setup: function () {
				var remote = this.remote;
				return remote
					.execute("document.getElementById('accordion2').style.display = 'none'")
					.execute("document.getElementById('accordion3').style.display = ''");
			},

			// Test navigation to buttons inside of headers, and also using the keyboard to click those buttons.
			keyboard: function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				if (remote.environmentType.safari) {
					return this.skip("on safari w/default, tab key doesn't navigate to <button>");
				}
				if (remote.environmentType.browserName === "internet explorer") {
					// Shift-tab handling in header works on IE manually but not via webdriver, even in Intern 3.4.
					return this.skip("shift-tab keydown event broken for IE webdriver, evt.shiftKey not set");
				}

				return remote
					.findById("inputBeforeAccordion3").click().end()

					// Test navigating into header.
					.pressKeys(keys.TAB)
					.execute("return document.activeElement.id;")
					.then(function (value) {
						// Note this is checking that the mouse test above didn't change the navigatedDescendant.
						assert.strictEqual(value, "panel31_panelHeader", "initial tab in");
					})
					.pressKeys(keys.TAB)	// should go to the <button>
					.execute("return document.activeElement.tagName;")
					.then(function (value) {
						assert.strictEqual(value.toLowerCase(), "button", "tab to button");
					})
					.pressKeys(keys.ENTER)	// should "click" the button not close the panel
					.execute("return panel31_panelHeader.querySelector('button').innerHTML;")
					.then(function (value) {
						assert.strictEqual(value, "1 click");
					})
					.then(function () {
						return checkPanelIsOpen(remote, "panel31");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel32");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel33");
					})
					.pressKeys(keys.TAB)	// should go into the open panel 1
					.execute("return document.activeElement.id;")
					.then(function (value) {
						assert.strictEqual(value, "panel31_input", "tab into panel");
					})

					// Tests that SHIFT-TAB goes back into header.
					.pressKeys(keys.SHIFT + keys.TAB)	// should go back to header button
					.pressKeys(keys.SHIFT)				// release shift
					.execute("return document.activeElement.tagName.toLowerCase();")
					.then(function (value) {
						assert.strictEqual(value, "button", "shift-tab to button");
					})
					.pressKeys(keys.ENTER)				// should "click" the button not close the panel
					.execute("return panel31_panelHeader.querySelector('button').innerHTML;")
					.then(function (value) {
						assert.strictEqual(value, "2 clicks");
					})
					.pressKeys(keys.SHIFT + keys.TAB)	// should go back to header itself
					.pressKeys(keys.SHIFT)				// release shift
					.execute("return document.activeElement.id;")
					.then(function (value) {
						// Note this is checking that the mouse test above didn't change the navigatedDescendant.
						assert.strictEqual(value, "panel31_panelHeader", "shift-tab from button to header");
					})

					// Test that TAB doesn't go backwards to previous open panels.
					.findById("inputBeforeAccordion3").click().end()
					.pressKeys(keys.TAB)		// enter accordion
					.pressKeys(keys.ARROW_DOWN)	// go to second header
					.pressKeys(keys.TAB)		// go to the second header's <button>
					.execute("return document.activeElement.tagName;")
					.then(function (value) {
						assert.strictEqual(value.toLowerCase(), "button", "second header's button");
					})
					.pressKeys(keys.TAB)// should leave accordion altogether, since open panel is above current header
					.execute("return document.activeElement.id;")
					.then(function (value) {
						assert.strictEqual(value, "inputAfterAccordion3");
					});
			},

			// Test clicking the button inside a header.
			// Note that focusing anything in a header sets that header as the navigatedDescendant,
			// so the mouse test is intentionally after the keyboard test, to not interfere with it.
			mouse: function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("#panel32_panelHeader button")
					.click()
					.end()
					.execute("return panel32_panelHeader.querySelector('button').innerHTML;")
					.then(function (value) {
						assert.strictEqual(value, "1 click");
					})
					.sleep(500)
					.then(function () {
						return checkPanelIsOpen(remote, "panel31");
					})
					.then(function () {
						// Check that the panel 2 wasn't opened.
						return checkPanelIsClosed(remote, "panel32");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel33");
					});
			}
		}
	});
});
