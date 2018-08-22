define([
	"dcl/dcl",
	"intern!object",
	"intern/chai!assert",
	"requirejs-dplugins/jquery!attributes/classes",
	"requirejs-dplugins/Promise!",
	"delite/register",
	"deliteful/Accordion",
	"deliteful/Panel",
	"dojo/domReady!"
], function (dcl, registerSuite, assert, $, Promise, register, Accordion, Panel) {

	function mix(a, b) {
		for (var n in b) {
			a[n] = b[n];
		}
	}

	var container, accordion, panel1, panel2, panel3, accordion2, panel21, panel22, panel23,
		accordion3, panel31, panel32, panel33, accordion4,
		html = "<d-accordion id='accordion' style='height:400px'>" +
					"<d-panel id='panel1' label='panel1'><div>Content1</div></d-panel>" +
					"<d-panel id='panel2' label='panel2'><div>Content2</div></d-panel>" +
					"<d-panel id='panel3' label='panel3'><div>Content3</div></d-panel>" +
				"</d-accordion>" +
				"<d-accordion id='accordion2' mode='multipleOpen' style='height:400px'>" +
					"<d-panel id='panel21' label='panel21'><div>Content21</div></d-panel>" +
					"<d-panel id='panel22' label='panel22'><div>Content22</div></d-panel>" +
					"<d-panel id='panel23' label='panel23'><div>Content23</div></d-panel>" +
				"</d-accordion>" +
				"<d-accordion id='accordion3' style='height:400px' openIconClass='oic' closedIconClass='cic'>" +
					"<d-panel id='panel31' label='panel31'><div>Content31</div></d-panel>" +
					"<d-panel id='panel32' label='panel32' openIconClass='poic'><div>Content32</div></d-panel>" +
					"<d-panel id='panel33' label='panel33' openIconClass='poic' closedIconClass='pcic'>" +
						"<div>Content33</div>" +
					"</d-panel>" +
				"</d-accordion>" +
				"<d-accordion id='accordion4' style='height:400px'>" +
					"<d-panel id='panel41' label='panel41'></d-panel>" +
					"<d-panel id='panel42' label='panel42'></d-panel>" +
				"</d-accordion>";

	var asyncHandler;

	function checkUniqueOpenPanel(ac, target, message) {
		ac.getChildren().forEach(function (child) {
			assert.isTrue(
				(child.headerNode.style.display !== "none" &&
					((child === target && child.style.display !== "none" &&
						ac.selectedChildId === target.id && child.open && child.headerNode.open &&
						$(child).hasClass("d-accordion-open-panel")) ||
					(child !== target && child.style.display === "none" && !child.open &&
						!child.headerNode.open && !($(child).hasClass("d-accordion-open-panel"))))),
			message + " checking " + child.id);
		});
	}

	function checkPanelsStatus(openPanels, closedPanels, message) {
		openPanels.forEach(function (panel) {
			assert.isTrue(
				(panel.headerNode.style.display !== "none" && panel.style.display !== "none" &&
					panel.open && panel.headerNode.open && $(panel).hasClass("d-accordion-open-panel")),
			message);
		});
		closedPanels.forEach(function (panel) {
			assert.isTrue(
				(panel.headerNode.style.display !== "none" && panel.style.display === "none" &&
					!panel.open && !panel.headerNode.open && !$(panel).hasClass("d-accordion-open-panel")),
			message);
		});
		checkAriaProperties(openPanels, closedPanels);
	}

	function checkPanelIconProperties(panel, poic, pcic, hoic, hcic, open) {
		assert.strictEqual(panel.openIconClass, poic, "panel openIconClass");
		assert.strictEqual(panel.closedIconClass, pcic, "panel closedIconClass");
		assert.strictEqual(panel.headerNode.openIconClass, hoic, "header openIconClass");
		assert.strictEqual(panel.headerNode.closedIconClass, hcic, "header closedIconClass");
		assert.isTrue($(panel.headerNode.iconNode).hasClass(open ? hoic : hcic), "header.iconNode class");
	}

	function checkAriaProperties(openPanels, closedPanels) {
		openPanels.forEach(function (panel) {
			var header = panel.headerNode,
				button = header.querySelector("[aria-controls]");

			// When animation is disabled, header hasn't yet delivered changes to set aria-expanded on <button>.
			header.deliver();

			assert.strictEqual(header.getAttribute("role"), "heading", "open heading role");
			assert.strictEqual(button.getAttribute("aria-expanded"), "true", "open heading aria-expanded");
			assert.strictEqual(button.getAttribute("aria-controls"), panel.id, "open heading aria-controls");
			assert.strictEqual(panel.getAttribute("role"), "region", "open panel role");
			assert.strictEqual(panel.getAttribute("aria-hidden"), "false", "open panel aria-hidden");
			assert.strictEqual(panel.getAttribute("aria-labelledby"), panel.headerNode.labelNode.id,
				"open panel aria-labelledby");
		});
		closedPanels.forEach(function (panel) {
			var header = panel.headerNode,
				button = header.querySelector("[aria-controls]");

			// When animation is disabled, header hasn't yet delivered changes to set aria-expanded on <button>.
			header.deliver();

			assert.strictEqual(header.getAttribute("role"), "heading", "closed heading role");
			assert.strictEqual(button.getAttribute("aria-expanded"), "false", "closed heading aria-expanded");
			assert.strictEqual(panel.getAttribute("role"), "region", "closed panel role");
			assert.strictEqual(panel.getAttribute("aria-hidden"), "true", "closed panel aria-hidden");
			assert.strictEqual(panel.getAttribute("aria-labelledby"), panel.headerNode.labelNode.id,
				"closed panel aria-labelledby");
		});
	}

	function loadData(id) {
		return new Promise(function (resolve) {
			var view = document.createElement("div");
			view.innerHTML = "<h3>New Content</h3>";
			view.setAttribute("id", id);
			resolve(view);
		});
	}

	var commonSuite = {
		"Default CSS": function () {
			accordion = document.getElementById("accordion");
			assert.isTrue($(accordion).hasClass("d-accordion"));
		},
		"Default values": function () {
			accordion = document.getElementById("accordion");
			assert.strictEqual(accordion.mode, "singleOpen", "mode");
			assert.isTrue(accordion.animate, "animate");
			assert.strictEqual(accordion.selectedChildId, "panel1", "by default the selectedChild is the first one");
			assert.strictEqual(accordion.openIconClass, "", "openIconClass doesn't have a default value");
			assert.strictEqual(accordion.closedIconClass, "", "closedIconClass doesn't have a default value");

		},
		"SingleOpen Mode": {
			"setup": function () {
				accordion = document.getElementById("accordion");
				panel1 = document.getElementById("panel1");
				panel2 = document.getElementById("panel2");
				panel3 = document.getElementById("panel3");
			},
			"Default open panel": function () {
				checkUniqueOpenPanel(accordion, panel1, "Only panel1 should be open");
				checkAriaProperties([panel1], [panel2, panel3]);
			},
			"Show(by id)": function () {
				return accordion.show("panel3").then(function () {
					checkUniqueOpenPanel(accordion, panel3, "Only panel3 should be open");
					checkAriaProperties([panel3], [panel1, panel2]);
				});
			},
			"Show(by widget)": function () {
				return accordion.show(panel2).then(function () {
					checkUniqueOpenPanel(accordion, panel2, "Only panel2 should be open");
					checkAriaProperties([panel2], [panel1, panel3]);
				});
			},
			"Show(already open panel)": function () {
				return accordion.show(panel2).then(function () {
					checkUniqueOpenPanel(accordion, panel2, "Accordion status shouldn't change");
					checkAriaProperties([panel2], [panel1, panel3]);
				});
			},
			"Trying to hide open panel": function () {
				return accordion.hide(panel2).then(function () {
					checkUniqueOpenPanel(accordion, panel2, "Accordion status shouldn't change");
					checkAriaProperties([panel2], [panel1, panel3]);
				});
			},
			"Trying to hide closed panel": function () {
				return accordion.hide(panel1).then(function () {
					checkUniqueOpenPanel(accordion, panel2, "Accordion status shouldn't change");
					checkAriaProperties([panel2], [panel1, panel3]);
				});
			},
			"Changing selectedChildId": function () {
				var d = this.async(1000);
				asyncHandler = accordion.on("delite-after-show", d.callback(function () {
					checkUniqueOpenPanel(accordion, panel1, "Only panel1 should be open");
					checkAriaProperties([panel1], [panel2, panel3]);
				}));
				accordion.selectedChildId = "panel1";
			},
			"Show() without animation": function () {
				accordion.animate = false;
				return accordion.show(panel2).then(function () {
					checkUniqueOpenPanel(accordion, panel2, "Only panel2 should be open");
					checkAriaProperties([panel2], [panel1, panel3]);
					accordion.animate = true;
				});
			},
			"Show() Invisible Accordion": function () {
				accordion.style.display = "none";
				return accordion.show(panel3).then(function () {
					checkUniqueOpenPanel(accordion, panel3, "Only panel3 should be open");
					accordion.style.display = "";
					checkAriaProperties([panel3], [panel1, panel2]);
				});
			},
			"Show() Invisible Parent": function () {
				accordion.parentNode.style.display = "none";
				return accordion.show(panel1).then(function () {
					checkUniqueOpenPanel(accordion, panel1, "Only panel1 should be open");
					accordion.parentNode.style.display = "";
					checkAriaProperties([panel1], [panel2, panel3]);
				});
			}
		},
		"MultipleOpen Mode": {
			"setup": function () {
				accordion2 = document.getElementById("accordion2");
				panel21 = document.getElementById("panel21");
				panel22 = document.getElementById("panel22");
				panel23 = document.getElementById("panel23");
			},
			"Default open panel": function () {
				checkPanelsStatus([panel21], [panel22, panel23], "Only panel1 should be open");
			},
			"Show(by id)": function () {
				return accordion2.show("panel22").then(function () {
					checkPanelsStatus([panel21, panel22], [panel23], "Invalid panels status");
				});
			},
			"Show(by widget)": function () {
				return accordion2.show(panel23).then(function () {
					checkPanelsStatus([panel21, panel22, panel23], [], "Invalid panels status");
				});
			},
			"Hide(by id)": function () {
				return accordion2.hide("panel22").then(function () {
					checkPanelsStatus([panel21, panel23], [panel22], "Invalid panels status");
				});
			},
			"Hide(by widget)": function () {
				return accordion2.hide(panel23).then(function () {
					checkPanelsStatus([panel21], [panel22, panel23], "Invalid panels status");
				});
			},
			"Show(already open panel)": function () {
				return accordion2.show(panel21).then(function () {
					checkPanelsStatus([panel21], [panel22, panel23], "Accordion status shouldn't change");
				});
			},
			"Trying to hide closed panel": function () {
				return accordion2.hide(panel22).then(function () {
					checkPanelsStatus([panel21], [panel22, panel23], "Accordion status shouldn't change");
				});
			},
			"Trying to hide last open panel": function () {
				return accordion2.hide(panel21).then(function () {
					checkPanelsStatus([panel21], [panel22, panel23], "Accordion status shouldn't change");
				});
			},
			"Show() without animation": function () {
				accordion2.animate = false;
				return accordion2.show(panel22).then(function () {
					checkPanelsStatus([panel21, panel22], [panel23], "Invalid panels status");
					accordion2.animate = true;
				});
			},
			"Hide() without animation": function () {
				accordion2.animate = false;
				return accordion2.hide(panel22).then(function () {
					checkPanelsStatus([panel21], [panel22, panel23], "Invalid panels status");
					accordion2.animate = true;
				});
			},
			"Show() Invisible Accordion": function () {
				accordion2.style.display = "none";
				return accordion2.show(panel22).then(function () {
					checkPanelsStatus([panel21, panel22], [panel23], "Invalid panels status");
					accordion2.style.display = "";
				});
			},
			"Show() Invisible Parent": function () {
				accordion2.parentNode.style.display = "none";
				return accordion2.show(panel23).then(function () {
					checkPanelsStatus([panel21, panel22, panel23], [], "Invalid panels status");
					accordion2.parentNode.style.display = "";
				});
			},
			"Hide() Invisible Accordion": function () {
				accordion2.style.display = "none";
				return accordion2.hide(panel22).then(function () {
					checkPanelsStatus([panel21, panel23], [panel22], "Invalid panels status");
					accordion2.style.display = "";
				});
			},
			"Hide() Invisible Parent": function () {
				accordion2.parentNode.style.display = "none";
				return accordion2.hide(panel23).then(function () {
					checkPanelsStatus([panel21], [panel22, panel23], "Invalid panels status");
					accordion2.parentNode.style.display = "";
				});
			}
		},
		"Icon Support": {
			"setup": function () {
				accordion3 = document.getElementById("accordion3");
				panel31 = document.getElementById("panel31");
				panel32 = document.getElementById("panel32");
				panel33 = document.getElementById("panel33");
			},
			"Initial Setting": function () {
				assert.strictEqual(accordion3.openIconClass, "oic");
				assert.strictEqual(accordion3.closedIconClass, "cic");
				checkPanelIconProperties(panel31, "", "", "oic", "cic", true);
				checkPanelIconProperties(panel32, "poic", "", "poic", "cic", false);
				checkPanelIconProperties(panel33, "poic", "pcic", "poic", "pcic", false);
			},
			"Changing accordion openIconClass": function () {
				accordion3.openIconClass = "ic6";
				accordion3.deliver();
				panel31.headerNode.deliver();
				checkPanelIconProperties(panel31, "", "", "ic6", "cic", true);
				checkPanelIconProperties(panel32, "poic", "", "poic", "cic", false);
				checkPanelIconProperties(panel33, "poic", "pcic", "poic", "pcic", false);
			},
			"Changing accordion closedIconClass": function () {
				accordion3.closedIconClass = "ic7";
				accordion3.deliver();
				panel31.headerNode.deliver();
				panel32.headerNode.deliver();
				checkPanelIconProperties(panel31, "", "", "ic6", "ic7", true);
				checkPanelIconProperties(panel32, "poic", "", "poic", "ic7", false);
				checkPanelIconProperties(panel33, "poic", "pcic", "poic", "pcic", false);
			},
			"Changing panel openIconClass": function () {
				panel31.openIconClass = "ic8";
				panel31.deliver();
				panel31.headerNode.deliver();
				checkPanelIconProperties(panel31, "ic8", "", "ic8", "ic7", true);
				checkPanelIconProperties(panel32, "poic", "", "poic", "ic7", false);
				checkPanelIconProperties(panel33, "poic", "pcic", "poic", "pcic", false);
			},
			"Changing panel closedIconClass": function () {
				panel31.closedIconClass = "ic9";
				panel31.deliver();
				panel31.headerNode.deliver();
				checkPanelIconProperties(panel31, "ic8", "ic9", "ic8", "ic9", true);
				checkPanelIconProperties(panel32, "poic", "", "poic", "ic7", false);
				checkPanelIconProperties(panel33, "poic", "pcic", "poic", "pcic", false);
			}
		}
	};

	//Markup
	var suite = {
		name: "Accordion: Markup",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = html;
			register.deliver();
		},
		"Controller": {
			setup: function () {
				accordion4 = document.getElementById("accordion4");
			},
			"loadContentEmptyPanel": function () {
				var handler;

				accordion4.addEventListener("delite-display-load", handler = function (evt) {
					if (!evt.hide) {
						evt.setChild(new Promise(function (resolve) {
							// load the content for the specified id, then set that data to the panel
							loadData(evt.contentId).then(function (data) {
								evt.setContent(evt.dest, data);
								resolve({child: evt.dest});
							});
						}));
					}
				});

				var panel41 = document.getElementById("panel41");
				var panel42 = document.getElementById("panel42");

				return accordion4.show(panel42, {contentId: "newContent1"}).then(function () {
					assert(panel42.children.length > 0, "has content");
					checkUniqueOpenPanel(accordion4, panel42, "Only panel42 should be open");
				}).then(function () {
					return accordion4.show(panel41, {contentId: "newContent2"});
				}).then(function () {
					assert(panel41.children.length > 0, "has content");
					checkUniqueOpenPanel(accordion4, panel41, "Only panel41 should be open");
					accordion4.removeEventListener("delite-display-load", handler);
				});
			}
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		},
		afterEach: function () {
			if (asyncHandler) {
				asyncHandler.remove();
			}
		}
	};

	mix(suite, commonSuite);
	registerSuite(suite);

	//Programmatic
	suite = {
		name: "Accordion: Programmatic",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			var ac = new Accordion({id: "accordion"});
			ac.style.height = "400px";
			var p1 = new Panel({id: "panel1", label: "panel1"});
			var p2 = new Panel({id: "panel2", label: "panel2"});
			var p3 = new Panel({id: "panel3", label: "panel3"});
			var c1 = document.createElement("div");
			var c2 = document.createElement("div");
			var c3 = document.createElement("div");
			ac.appendChild(p1);
			ac.appendChild(p2);
			ac.appendChild(p3);
			p1.appendChild(c1);
			p2.appendChild(c2);
			p3.appendChild(c3);
			ac.placeAt(container);
			var ac2 = new Accordion({id: "accordion2", mode: "multipleOpen"});
			ac2.style.height = "400px";
			var p21 = new Panel({id: "panel21", label: "panel21"});
			var p22 = new Panel({id: "panel22", label: "panel22"});
			var p23 = new Panel({id: "panel23", label: "panel23"});
			var c21 = document.createElement("div");
			var c22 = document.createElement("div");
			var c23 = document.createElement("div");
			ac2.appendChild(p21);
			ac2.appendChild(p22);
			ac2.appendChild(p23);
			p21.appendChild(c21);
			p22.appendChild(c22);
			p23.appendChild(c23);
			ac2.placeAt(container, "last");
			var ac3 = new Accordion({id: "accordion3", mode: "multipleOpen",
				openIconClass: "oic", closedIconClass: "cic"});
			ac3.style.height = "400px";
			var p31 = new Panel({id: "panel31", label: "panel31"});
			var p32 = new Panel({id: "panel32", label: "panel32", openIconClass: "poic"});
			var p33 = new Panel({id: "panel33", label: "panel33", openIconClass: "poic", closedIconClass: "pcic"});
			var c31 = document.createElement("div");
			var c32 = document.createElement("div");
			var c33 = document.createElement("div");
			ac3.appendChild(p31);
			ac3.appendChild(p32);
			ac3.appendChild(p33);
			p31.appendChild(c31);
			p32.appendChild(c32);
			p33.appendChild(c33);
			ac3.placeAt(container, "last");
		},

		"add/remove children": function () {
			var ac = new Accordion();
			ac.deliver();
			
			var p1 = new Panel({id: "add1", label: "panel 1"});
			var p2 = new Panel({id: "add2", label: "panel 2"});
			ac.appendChild(p1);
			ac.appendChild(p2);

			var childIds1 = Array.prototype.map.call(ac.children, function (child) {
				return child.id;
			});
			assert.deepEqual(childIds1, ["add1-header", "add1", "add2-header", "add2"], "childIds1");
			assert.deepEqual(ac._panelList, [p1, p2], "_panelList after adds");

			ac.removeChild(p1);
			var childIds2 = Array.prototype.map.call(ac.children, function (child) {
				return child.id;
			});
			assert.deepEqual(childIds2, ["add2-header", "add2"], "childIds2");
			assert.deepEqual(ac._panelList, [p2], "_panelList after remove");
		},

		Controller: {
			setup: function () {
				accordion4 = new Accordion();
				var p40 = new Panel();
				accordion4.appendChild(p40);
				accordion4.style.height = "400px";
				accordion4.placeAt(container);
			},
			"newPanelLoadContent": function () {
				var handler;

				accordion4.addEventListener("delite-display-load", handler = function (evt) {
					if (!evt.hide) {
						evt.setChild(new Promise(function (resolve) {
							console.log("id: " + evt.dest);
							// load the data for the specified id, then create a panel with that data
							loadData(evt.contentId).then(function (data) {
								var child = new Panel({label: evt.dest, id: evt.dest});
								evt.setContent(child, data);
								resolve({child: child});
							});
						}));
					}
				});

				return accordion4.show("panel41", {contentId: "newContent1"}).then(function () {
					var panel = document.getElementById("panel41");
					assert(panel.children.length > 0, "has content");
					checkUniqueOpenPanel(accordion4, panel, "Only panel41 should be open");
				}).then(function () {
					return accordion4.show("panel42", {contentId: "newContent2"});
				}).then(function () {
					var panel = document.getElementById("panel42");
					assert(panel.children.length > 0, "has content");
					checkUniqueOpenPanel(accordion4, panel, "Only panel42 should be open");
					accordion4.removeEventListener("delite-display-load", handler);
				});

			}
		},

		allowAllClosed: function () {
			var ac = new Accordion({
				id: "accordionAllowAllClosed",
				allowAllClosed: true
			});
			ac.style.display = "block; height: auto";	// override flex styling
			var p1 = new Panel({id: "acPanel1", label: "All Closeable Panel1"});
			var p2 = new Panel({id: "acPanel2", label: "All Closeable Panel2"});
			var p3 = new Panel({id: "acPanel3", label: "All Closeable Panel3"});
			ac.appendChild(p1);
			ac.appendChild(p2);
			ac.appendChild(p3);
			ac.placeAt(container);
			ac.deliver();

			assert.isFalse(p1.open, "p1.open 1");
			assert.strictEqual(p1.getAttribute("aria-hidden"), "true", "p1 aria-hidden 3");
			assert.isFalse(p2.open, "p2.open 1");
			assert.strictEqual(p2.getAttribute("aria-hidden"), "true", "p2 aria-hidden 3");
			assert.isFalse(p3.open, "p3.open 1");
			assert.strictEqual(p3.getAttribute("aria-hidden"), "true", "p3 aria-hidden 3");
			
			return ac.show(p1).then(function () {
				assert.isTrue(p1.open, "p1.open 2");
				assert.strictEqual(p1.getAttribute("aria-hidden"), "false", "p1 aria-hidden 2");
				assert.isFalse(p2.open, "p2.open 2");
				assert.strictEqual(p2.getAttribute("aria-hidden"), "true", "p2 aria-hidden 2");
				assert.isFalse(p3.open, "p3.open 2");
				assert.strictEqual(p3.getAttribute("aria-hidden"), "true", "p3 aria-hidden 2");
			}).then(function () {
				return ac.hide(p1);
			}).then(function () {
				assert.isFalse(p1.open, "p1.open 3");
				assert.strictEqual(p1.getAttribute("aria-hidden"), "true", "p1 aria-hidden 3");
				assert.isFalse(p2.open, "p2.open 3");
				assert.strictEqual(p2.getAttribute("aria-hidden"), "true", "p2 aria-hidden 3");
				assert.isFalse(p3.open, "p3.open 3");
				assert.strictEqual(p3.getAttribute("aria-hidden"), "true", "p3 aria-hidden 3");
			});
		},

		teardown: function () {
			container.parentNode.removeChild(container);
		},

		afterEach: function () {
			if (asyncHandler) {
				asyncHandler.remove();
			}
		}
	};

	mix(suite, commonSuite);
	registerSuite(suite);
});
