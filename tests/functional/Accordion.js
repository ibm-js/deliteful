define(["intern",
	"intern!object",
	"intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/dojo/node!leadfoot/keys",
	"intern/chai!assert",
	"require",
	"requirejs-dplugins/Promise!"
], function (intern, registerSuite, pollUntil, keys, assert, require, Promise) {
	var PAGE = "./Accordion.html";

	function checkPanelIsOpen(remote, panel) {
		return remote
			.findById(panel)
				.getProperty("open")
				.then(function (open) {
					assert.isTrue(open, "panel.open");
				})
				.isDisplayed()
				.then(function (displayed) {
					assert.isTrue(displayed, "panel visible");
				})
				.end()
			.findByCssSelector("[aria-controls=" + panel + "]")
				.getProperty("open")
				.then(function (checked) {
					assert.isTrue(checked, "header.open");
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
					assert.isFalse(open, "panel.open");
				})
				.isDisplayed()
				.then(function (displayed) {
					assert.isFalse(displayed, "panel visible");
				})
				.end()
			.findByCssSelector("[aria-controls=" + panel + "]")
				.getProperty("open")
				.then(function (checked) {
					assert.isFalse(checked, "header.open");
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

		"SingleOpen Mode": {
			"Check opening panel": function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("[aria-controls=panel2]")
						.click()
						.end()
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsClosed(remote, "panel1"));
						remotes.push(checkPanelIsOpen(remote, "panel2"));
						remotes.push(checkPanelIsClosed(remote, "panel3"));
						return Promise.all(remotes);
					});
			},
			"Opening panel by clicking on the label": function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("[aria-controls=panel3] > span:last-child")
						.click()
						.end()
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsClosed(remote, "panel1"));
						remotes.push(checkPanelIsClosed(remote, "panel2"));
						remotes.push(checkPanelIsOpen(remote, "panel3"));
						return Promise.all(remotes);
					});
			},
			"Opening panel by clicking on the icon": function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("[aria-controls=panel2] > span:last-child")
						.click()
						.end()
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsClosed(remote, "panel1"));
						remotes.push(checkPanelIsOpen(remote, "panel2"));
						remotes.push(checkPanelIsClosed(remote, "panel3"));
						return Promise.all(remotes);
					});
			},
			"Trying to close the open panel": function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("[aria-controls=panel2]")
						.click()
						.end()
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsClosed(remote, "panel1"));
						remotes.push(checkPanelIsOpen(remote, "panel2"));
						remotes.push(checkPanelIsClosed(remote, "panel3"));
						return Promise.all(remotes);
					});
			}
		},

		"Keyboard Support": {
			"Open panel by using ENTER or SPACE key" : function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return remote
					// TODO: tab into accordion instead
					.execute("document.querySelector('[aria-controls=panel1]').focus();")
					.pressKeys(keys.ENTER)
					.sleep(500)
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsOpen(remote, "panel1"));
						remotes.push(checkPanelIsClosed(remote, "panel2"));
						remotes.push(checkPanelIsClosed(remote, "panel3"));
						return Promise.all(remotes);
					})
					.pressKeys(keys.ARROW_DOWN)
					.pressKeys(keys.SPACE)
					.sleep(500)
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsClosed(remote, "panel1"));
						remotes.push(checkPanelIsOpen(remote, "panel2"));
						remotes.push(checkPanelIsClosed(remote, "panel3"));
						return Promise.all(remotes);
					});
			},
			"HOME and END keys": function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return remote
					// Change focus to first and last panel
					.pressKeys(keys.HOME)
					.execute("return document.activeElement.getAttribute('aria-controls');")
					.then(function (value) {
						assert.strictEqual(value, "panel1");
					})
					.pressKeys(keys.END)
					.execute("return document.activeElement.getAttribute('aria-controls');")
					.then(function (value) {
						assert.strictEqual(value, "panel3");
					});
			},
			"Arrow keys": function () {
				// Moving between panels using arrow keys.  Assumes that we start on last header.
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return remote
					.pressKeys(keys.ARROW_LEFT)
					.execute("return document.activeElement.getAttribute('aria-controls');")
					.then(function (value) {
						assert.strictEqual(value, "panel2");
					}).pressKeys(keys.ARROW_RIGHT)
					.execute("return document.activeElement.getAttribute('aria-controls');")
					.then(function (value) {
						assert.strictEqual(value, "panel3");
					})
					.pressKeys(keys.ARROW_UP)
					.execute("return document.activeElement.getAttribute('aria-controls');")
					.then(function (value) {
						assert.strictEqual(value, "panel2");
					}).pressKeys(keys.ARROW_DOWN)
					.execute("return document.activeElement.getAttribute('aria-controls');")
					.then(function (value) {
						assert.strictEqual(value, "panel3");
					});
			},
			"Arrow keys - cyclic": function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return remote
					// From last to first and from first to last
					.pressKeys(keys.ARROW_RIGHT)
					.execute("return document.activeElement.getAttribute('aria-controls');")
					.then(function (value) {
						assert.strictEqual(value, "panel1");
					}).pressKeys(keys.ARROW_LEFT)
					.execute("return document.activeElement.getAttribute('aria-controls');")
					.then(function (value) {
						assert.strictEqual(value, "panel3");
					})
					.pressKeys(keys.ARROW_DOWN)
					.execute("return document.activeElement.getAttribute('aria-controls');")
					.then(function (value) {
						assert.strictEqual(value, "panel1");
					}).pressKeys(keys.ARROW_UP)
					.execute("return document.activeElement.getAttribute('aria-controls');")
					.then(function (value) {
						assert.strictEqual(value, "panel3");
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
			"Check opening Promise.all panels": function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("[aria-controls=panel22]")
						.click()
						.end()
					.findByCssSelector("[aria-controls=panel23]")
						.click()
						.end()
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsOpen(remote, "panel21"));
						remotes.push(checkPanelIsOpen(remote, "panel22"));
						remotes.push(checkPanelIsOpen(remote, "panel23"));
						return Promise.all(remotes);
					});
			},
			"Check closing panel": function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("[aria-controls=panel22]")
						.click()
						.end()
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsOpen(remote, "panel21"));
						remotes.push(checkPanelIsClosed(remote, "panel22"));
						remotes.push(checkPanelIsOpen(remote, "panel23"));
						return Promise.all(remotes);
					});
			},
			"Closing panel by clicking on the label": function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("[aria-controls=panel23] span:last-child")
						.click()
						.end()
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsOpen(remote, "panel21"));
						remotes.push(checkPanelIsClosed(remote, "panel22"));
						remotes.push(checkPanelIsClosed(remote, "panel23"));
						return Promise.all(remotes);
					});
			},
			"Trying to close last open panel": function () {
				var remote = this.remote;
				return remote
					.findByCssSelector("[aria-controls=panel21]")
						.click()
						.end()
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsOpen(remote, "panel21"));
						remotes.push(checkPanelIsClosed(remote, "panel22"));
						remotes.push(checkPanelIsClosed(remote, "panel23"));
						return Promise.all(remotes);
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
					.findById("inputBeforeAccordion3")
						.click()
						.end()
					.pressKeys(keys.TAB)
					.execute("return document.activeElement.id;")
					.then(function (value) {
						// Note this is checking that the mouse test above didn't change the navigatedDescendant.
						assert.strictEqual(value, "panel31_panelHeader");
					})
					.pressKeys(keys.TAB)	// should go to the <button>
					.execute("return document.activeElement.tagName;")
					.then(function (value) {
						assert.strictEqual(value.toLowerCase(), "button");
					})
					.pressKeys(keys.SPACE)	// should "click" the button not close the panel
					.execute("return panel31_panelHeader.querySelector('button').innerHTML;")
					.then(function (value) {
						assert.strictEqual(value, "1 click");
						var remotes = [];
						remotes.push(checkPanelIsOpen(remote, "panel31"));
						remotes.push(checkPanelIsClosed(remote, "panel32"));
						remotes.push(checkPanelIsClosed(remote, "panel33"));
						return Promise.all(remotes);
					})
					.pressKeys(keys.TAB)	// should go into the open panel
					.execute("return document.activeElement.id;")
					.then(function (value) {
						assert.strictEqual(value, "panel31_input");
					})
					.pressKeys(keys.TAB)	// should leave the accordion altogether
					.execute("return document.activeElement.id;")
					.then(function (value) {
						assert.strictEqual(value, "inputAfterAccordion3");
					})

					.findById("inputBeforeAccordion3")
						.click()
						.end()
					.pressKeys(keys.TAB)		// enter accordion
					.pressKeys(keys.ARROW_DOWN)	// go to second header
					.pressKeys(keys.TAB)		// go to the second header's <button>
					.execute("return document.activeElement.tagName;")
					.then(function (value) {
						assert.strictEqual(value.toLowerCase(), "button");
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

						// Check that the panel 2 wasn't opened.
						var remotes = [];
						remotes.push(checkPanelIsOpen(remote, "panel31"));
						remotes.push(checkPanelIsClosed(remote, "panel32"));
						remotes.push(checkPanelIsClosed(remote, "panel33"));
						return Promise.all(remotes);
					});
			}
		}
	});
});
