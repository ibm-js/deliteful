define(["intern",
	"intern!object",
	"intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/dojo/node!leadfoot/keys",
	"intern/chai!assert",
	"require",
	"dojo/promise/all"
], function (intern, registerSuite, pollUntil, keys, assert, require, all) {
	var PAGE = "./Accordion.html";

	function checkHasNotClass(classes, className) {
		classes = classes.trim().split(/\s+/g);
		return classes.indexOf(className) === -1;
	}

	function checkPanelIsOpen(remote, panel) {
		return remote
			.findById(panel)
			.getProperty("open")
			.then(function (open) {
				assert.isTrue(open, "This panel should be open");
			})
			.findByCssSelector(".d-toggle-button")
			.getProperty("checked")
			.then(function (checked) {
				assert.isTrue(checked, "This button should be checked");
			})
			.isDisplayed()
			.then(function (displayed) {
				assert.isTrue(displayed, "This button should be visible");
			})
			.end()
			.findByCssSelector(".d-panel-content")
			.isDisplayed()
			.then(function (displayed) {
				assert.isTrue(displayed, "The content of this panel should be visible");
			})
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
				assert.isFalse(open, "This panel should not be open");
			})
			.findByCssSelector(".d-toggle-button")
			.getProperty("checked")
			.then(function (checked) {
				assert.isFalse(checked, "This button should not be checked");
			})
			.isDisplayed()
			.then(function (displayed) {
				assert.isTrue(displayed, "This button should be visible");
			})
			.end()
			.findByCssSelector(".d-panel-content")
			.getAttribute("class")
			.then(function (classes) {
				assert.isTrue(checkHasNotClass(classes, "d-accordion-open-panel"),
					"The content of this panel should not be visible");
			})
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
					.findById("panel2")
						.findByClassName("d-toggle-button")
						.click()
						.end()
					.end()
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsClosed(remote, "panel1"));
						remotes.push(checkPanelIsOpen(remote, "panel2"));
						remotes.push(checkPanelIsClosed(remote, "panel3"));
						return all(remotes);
					});
			},
			"Opening panel by clicking on the label": function () {
				var remote = this.remote;
				return remote
					.findById("panel3")
						.findByClassName("d-toggle-button")
							.findAllByTagName("span")
							.then(function (span) {
								span[1].click();
							})
							.end()
						.end()
					.end()
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsClosed(remote, "panel1"));
						remotes.push(checkPanelIsClosed(remote, "panel2"));
						remotes.push(checkPanelIsOpen(remote, "panel3"));
						return all(remotes);
					});
			},
			"Opening panel by clicking on the icon": function () {
				var remote = this.remote;
				return remote
					.findById("panel2")
						.findByClassName("d-toggle-button")
							.findByClassName("d-icon")
							.click()
							.end()
						.end()
					.end()
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsClosed(remote, "panel1"));
						remotes.push(checkPanelIsOpen(remote, "panel2"));
						remotes.push(checkPanelIsClosed(remote, "panel3"));
						return all(remotes);
					});
			},
			"Trying to close the open panel": function () {
				var remote = this.remote;
				return remote
					.findById("panel2")
						.findByClassName("d-toggle-button")
						.click()
						.end()
					.end()
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsClosed(remote, "panel1"));
						remotes.push(checkPanelIsOpen(remote, "panel2"));
						remotes.push(checkPanelIsClosed(remote, "panel3"));
						return all(remotes);
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
					.execute("document.getElementById('panel1_button').focus();")
					.pressKeys(keys.ENTER)
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsOpen(remote, "panel1"));
						remotes.push(checkPanelIsClosed(remote, "panel2"));
						remotes.push(checkPanelIsClosed(remote, "panel3"));
						return all(remotes);
					})
					.execute("document.getElementById('panel2_button').focus();")
					.pressKeys(keys.SPACE)
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsClosed(remote, "panel1"));
						remotes.push(checkPanelIsOpen(remote, "panel2"));
						remotes.push(checkPanelIsClosed(remote, "panel3"));
						return all(remotes);
					});
			},
			"HOME and END keys": function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return remote
				//Change focus to first and last panel
					.pressKeys(keys.HOME)
					.execute("return document.activeElement.id;")
					.then(function (value) {
						assert.strictEqual(value, "panel1_button");
					})
					.pressKeys(keys.END)
					.execute("return document.activeElement.id;")
					.then(function (value) {
						assert.strictEqual(value, "panel3_button");
					});
			},
			"Arrow keys": function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return remote
					//Moving between panels using arrow keys
					.pressKeys(keys.ARROW_LEFT)
					.execute("return document.activeElement.id;")
					.then(function (value) {
						assert.strictEqual(value, "panel2_button");
					}).pressKeys(keys.ARROW_RIGHT)
					.execute("return document.activeElement.id;")
					.then(function (value) {
						assert.strictEqual(value, "panel3_button");
					})
					.pressKeys(keys.ARROW_UP)
					.execute("return document.activeElement.id;")
					.then(function (value) {
						assert.strictEqual(value, "panel2_button");
					}).pressKeys(keys.ARROW_DOWN)
					.execute("return document.activeElement.id;")
					.then(function (value) {
						assert.strictEqual(value, "panel3_button");
					});
			},
			"Arrow keys - cyclic": function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return remote
					//From last to first and from first to last
					.pressKeys(keys.ARROW_RIGHT)
					.execute("return document.activeElement.id;")
					.then(function (value) {
						assert.strictEqual(value, "panel1_button");
					}).pressKeys(keys.ARROW_LEFT)
					.execute("return document.activeElement.id;")
					.then(function (value) {
						assert.strictEqual(value, "panel3_button");
					})
					.pressKeys(keys.ARROW_DOWN)
					.execute("return document.activeElement.id;")
					.then(function (value) {
						assert.strictEqual(value, "panel1_button");
					}).pressKeys(keys.ARROW_UP)
					.execute("return document.activeElement.id;")
					.then(function (value) {
						assert.strictEqual(value, "panel3_button");
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
			"Check opening all panels": function () {
				var remote = this.remote;
				return remote
					.findById("panel22")
						.findByClassName("d-toggle-button")
						.click()
						.end()
					.end()
					.findById("panel23")
						.findByClassName("d-toggle-button")
						.click()
						.end()
					.end()
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsOpen(remote, "panel21"));
						remotes.push(checkPanelIsOpen(remote, "panel22"));
						remotes.push(checkPanelIsOpen(remote, "panel23"));
						return all(remotes);
					});
			},
			"Check closing panel": function () {
				var remote = this.remote;
				return remote
					.findById("panel22")
						.findByClassName("d-toggle-button")
						.click()
						.end()
					.end()
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsOpen(remote, "panel21"));
						remotes.push(checkPanelIsClosed(remote, "panel22"));
						remotes.push(checkPanelIsOpen(remote, "panel23"));
						return all(remotes);
					});
			},
			"Closing panel by clicking on the label": function () {
				var remote = this.remote;
				return remote
					.findById("panel23")
						.findByClassName("d-toggle-button")
							.findAllByTagName("span")
							.then(function (span) {
								span[1].click();
							})
							.end()
						.end()
					.end()
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsOpen(remote, "panel21"));
						remotes.push(checkPanelIsClosed(remote, "panel22"));
						remotes.push(checkPanelIsClosed(remote, "panel23"));
						return all(remotes);
					});
			},
			"Trying to close last open panel": function () {
				var remote = this.remote;
				return remote
					.findById("panel21")
						.findByClassName("d-toggle-button")
						.click()
						.end()
					.end()
					.then(function () {
						var remotes = [];
						remotes.push(checkPanelIsOpen(remote, "panel21"));
						remotes.push(checkPanelIsClosed(remote, "panel22"));
						remotes.push(checkPanelIsClosed(remote, "panel23"));
						return all(remotes);
					});
			}
		}
	});
});