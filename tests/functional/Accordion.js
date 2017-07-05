define(["intern",
	"intern!object",
	"intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/dojo/node!leadfoot/keys",
	"intern/chai!assert",
	"require"
], function (intern, registerSuite, pollUntil, keys, assert, require) {
	var PAGE = "./Accordion.html";

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
			.findByCssSelector("#" + panel + "-header")
				.getProperty("open")
				.then(function (checked) {
					assert.isTrue(checked, panel + ".header.open");
				})
				.end()
			.execute("return document.getElementById(" + panel + ")")
				.then(function (elem) {
					pollUntil(function (val) {
						var classes = val.getAttribute("class");
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
			.findByCssSelector("#" + panel + "-header")
				.getProperty("open")
				.then(function (checked) {
					assert.isFalse(checked, panel + ".header.open");
				})
				.end()
			.execute("return document.getElementById(" + panel + ")")
				.then(function (elem) {
					pollUntil(function (val) {
						return val.style.display === "none" ? false : null;
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
					.findByCssSelector("#panel1-header [aria-controls]").click().end();
			},

			"Open panel by clicking": function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("#panel2-header [aria-controls]")
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

			"Try to close the open panel": function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("#panel2-header [aria-controls]").click().end()
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
				// Always start with the first panel open, and focus before the accordion.
				return this.remote
					.findByCssSelector("#panel1-header [aria-controls]").click().end()
					.findById("inputBeforeAccordion1").click().end();
			},

			"Open panel": function () {
				var remote = this.remote;
				return remote
					.pressKeys(keys.TAB)		// go to header 1
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
					.pressKeys(keys.ENTER)
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
					.pressKeys(keys.TAB)		// go to header 1
					.pressKeys(keys.END)		// go from first to last
					.execute("return document.activeElement.querySelector('.d-label').textContent;").then(function (v) {
						assert.strictEqual(v, "Panel3");
					})
					.pressKeys(keys.HOME)		// and back to first
					.execute("return document.activeElement.querySelector('.d-label').textContent;").then(function (v) {
						assert.strictEqual(v, "Panel1");
					});
			},

			"Arrow keys": function () {
				// Moving between panels using arrow keys.
				return this.remote
					.pressKeys(keys.TAB)		// go to header 1
					.pressKeys(keys.ARROW_DOWN)
					.execute("return document.activeElement.querySelector('.d-label').textContent;").then(function (v) {
						assert.strictEqual(v, "Panel2", "after ARROW_DOWN");
					})
					.pressKeys(keys.ARROW_UP)
					.execute("return document.activeElement.querySelector('.d-label').textContent;").then(function (v) {
						assert.strictEqual(v, "Panel1", "after ARROW_UP");
					})
					.pressKeys(keys.ARROW_DOWN)
					.execute("return document.activeElement.querySelector('.d-label').textContent;").then(function (v) {
						assert.strictEqual(v, "Panel2", "after ARROW_DOWN");
					})
					.pressKeys(keys.ARROW_UP)
					.execute("return document.activeElement.querySelector('.d-label').textContent;").then(function (v) {
						assert.strictEqual(v, "Panel1", "after ARROW_UP");
					});
			},

			"Arrow keys - cyclic": function () {
				return this.remote
					// From last to first and from first to last
					.pressKeys(keys.TAB)		// go to header 1
					.pressKeys(keys.ARROW_UP)
					.execute("return document.activeElement.querySelector('.d-label').textContent;")
					.then(function (v) {
						assert.strictEqual(v, "Panel3");
					})
					.pressKeys(keys.ARROW_DOWN)
					.execute("return document.activeElement.querySelector('.d-label').textContent;")
					.then(function (v) {
						assert.strictEqual(v, "Panel1");
					})
					.pressKeys(keys.ARROW_UP)
					.execute("return document.activeElement.querySelector('.d-label').textContent;")
					.then(function (v) {
						assert.strictEqual(v, "Panel3");
					})
					.pressKeys(keys.ARROW_DOWN)
					.execute("return document.activeElement.querySelector('.d-label').textContent;")
					.then(function (v) {
						assert.strictEqual(v, "Panel1");
					});
			},

			"Tab through accordion": function () {
				return this.remote
					.pressKeys(keys.TAB)		// go to header 1
					.execute("return document.activeElement.querySelector('.d-label').textContent;").then(function (v) {
						assert.strictEqual(v, "Panel1", "tab to header 1");
					})
					.pressKeys(keys.TAB)	// tab to panel 1
					.execute("return document.activeElement.id;").then(function (v) {
						assert.strictEqual(v, "panel1_input");
					})
					.pressKeys(keys.TAB)		// go to header 2
					.execute("return document.activeElement.querySelector('.d-label').textContent;").then(function (v) {
						assert.strictEqual(v, "Panel2", "tab to header 1");
					})
					.pressKeys(keys.TAB)		// go to header 3
					.execute("return document.activeElement.querySelector('.d-label').textContent;").then(function (v) {
						assert.strictEqual(v, "Panel3", "tab to header 1");
					})
					.pressKeys(keys.TAB)
					.execute("return document.activeElement.id;").then(function (v) {
						assert.strictEqual(v, "inputAfterAccordion1");
					});
			},

			"Ctrl - PageUp / PageDown": function () {
				if (/^(internet explorer|chrome)$/.test(this.remote.environmentType.browserName)) {
					// works manually but not via webdriver
					return this.skip("webdriver control key issues");
				}

				return this.remote
					.pressKeys(keys.TAB)		// go to header 1
					.pressKeys(keys.TAB)		// go to panel 1
					.execute("return document.activeElement.id;").then(function (v) {
						assert.strictEqual(v, "panel1_input");
					})
					.pressKeys(keys.CONTROL + keys.PAGE_DOWN)		// go to header 2
					.pressKeys(keys.CONTROL)                       // release CONTROL
					.execute("return document.activeElement.querySelector('.d-label').textContent;").then(function (v) {
						assert.strictEqual(v, "Panel2", "Ctrl-PageDown from panel 1 to header 2");
					})
					.pressKeys(keys.CONTROL + keys.PAGE_UP)		// go to header 1
					.pressKeys(keys.CONTROL)                       // release CONTROL
					.execute("return document.activeElement.querySelector('.d-label').textContent;").then(function (v) {
						assert.strictEqual(v, "Panel1", "Ctrl-PageUp from panel 1 to header 2");
					})
					.pressKeys(keys.CONTROL + keys.PAGE_DOWN)		// go to header 2
					.pressKeys(keys.CONTROL)                       // release CONTROL
					.execute("return document.activeElement.querySelector('.d-label').textContent;").then(function (v) {
						assert.strictEqual(v, "Panel2", "Ctrl-PageDown from header 1 to header 2");
					})
					.pressKeys(keys.CONTROL + keys.PAGE_UP)		// go to header 1
					.pressKeys(keys.CONTROL)                       // release CONTROL
					.execute("return document.activeElement.querySelector('.d-label').textContent;").then(function (v) {
						assert.strictEqual(v, "Panel1", "Ctrl-PageUp from header 1 to header 2");
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
					.findByCssSelector("#panel22-header [aria-controls]")
						.click()
						.end()
					.sleep(500)
					.findByCssSelector("#panel23-header [aria-controls]")
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
					.findByCssSelector("#panel22-header [aria-controls]")
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
					})
					.findByCssSelector("#panel23-header [aria-controls]")
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
					.findByCssSelector("#panel21-header [aria-controls]")
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

				return remote
					.findById("inputBeforeAccordion3").click().end()

					// Test navigating into header.
					.pressKeys(keys.TAB)
					.execute("return document.activeElement.querySelector('.d-label').textContent;")
					.then(function (v) {
						assert.strictEqual(v, "Panel31", "initial tab in");
					})
					.pressKeys(keys.TAB)	// should go to the <button>
					.execute("return document.activeElement.className;")
					.then(function (v) {
						assert.strictEqual(v, "custom-button", "tab to button");
					})
					.pressKeys(keys.ENTER)	// should "click" the button not close the panel
					.execute("return document.querySelector('#panel31-header .custom-button').innerHTML;")
					.then(function (v) {
						assert.strictEqual(v, "1 click");
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
					.then(function (v) {
						assert.strictEqual(v, "panel31_input", "tab into panel");
					})

					// Tests that SHIFT-TAB goes back into header.
					.pressKeys(keys.SHIFT + keys.TAB)	// should go back to header button
					.pressKeys(keys.SHIFT)				// release shift
					.execute("return document.activeElement.className;")
					.then(function (v) {
						assert.strictEqual(v, "custom-button", "shift-tab to button");
					})
					.pressKeys(keys.ENTER)				// should "click" the button not close the panel
					.execute("return document.querySelector('#panel31-header .custom-button').innerHTML;")
					.then(function (v) {
						assert.strictEqual(v, "2 clicks");
					})
					.pressKeys(keys.SHIFT + keys.TAB)	// should go back to header itself
					.pressKeys(keys.SHIFT)				// release shift
					.execute("return document.activeElement.querySelector('.d-label').textContent;")
					.then(function (v) {
						assert.strictEqual(v, "Panel31");
					});
			},

			// Test clicking the button inside a header.
			mouse: function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("#panel32-header .custom-button")
					.click()
					.end()
					.execute("return document.querySelector('#panel32-header .custom-button').innerHTML;")
					.then(function (val) {
						assert.strictEqual(val, "1 click");
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
		},

		allowAllClosed: {
			singleOpen: function () {
				var remote = this.remote;
				return remote
					.then(function () {
						return checkPanelIsClosed(remote, "panel41");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel42");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel43");
					})
					.findByCssSelector("#panel41-header [aria-controls]")
					.click()
					.end()
					.sleep(500)
					.then(function () {
						return checkPanelIsOpen(remote, "panel41");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel42");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel43");
					})
					.findByCssSelector("#panel42-header [aria-controls]")
					.click()
					.end()
					.sleep(500)
					.then(function () {
						return checkPanelIsClosed(remote, "panel41");
					})
					.then(function () {
						return checkPanelIsOpen(remote, "panel42");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel43");
					})
					.findByCssSelector("#panel42-header [aria-controls]")
					.click()
					.end()
					.sleep(500)
					.then(function () {
						return checkPanelIsClosed(remote, "panel41");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel42");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel43");
					});
			},

			multipleOpen: function () {
				var remote = this.remote;
				return remote
					.then(function () {
						return checkPanelIsClosed(remote, "panel51");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel52");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel53");
					})
					.findByCssSelector("#panel51-header [aria-controls]")
					.click()
					.end()
					.sleep(500)
					.findByCssSelector("#panel52-header [aria-controls]")
					.click()
					.end()
					.sleep(500)
					.then(function () {
						return checkPanelIsOpen(remote, "panel51");
					})
					.then(function () {
						return checkPanelIsOpen(remote, "panel52");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel53");
					})
					.findByCssSelector("#panel51-header [aria-controls]")
					.click()
					.end()
					.sleep(500)
					.findByCssSelector("#panel52-header [aria-controls]")
					.click()
					.end()
					.sleep(500)
					.then(function () {
						return checkPanelIsClosed(remote, "panel51");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel52");
					})
					.then(function () {
						return checkPanelIsClosed(remote, "panel53");
					});
			}
		}
	});
});
