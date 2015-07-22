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
	var container, accordion, panel1, panel2, panel3, accordion2, panel21, panel22, panel23,
		accordion3, panel31, panel32, panel33, accordion4,
		html = "<d-accordion id='accordion' style='height:400px'>" +
					"<d-panel id='panel1' label='panel1'><div>Content1</div></d-panel>" +
					"<d-panel id='panel2' label='panel2'><div>Content2</div></d-panel>" +
					"<d-panel id='panel3' label='panel3'><div>Content3</div></d-panel>" +
				"</d-accordion>" +
				"<d-accordion id='accordion2' singleOpen='false' style='height:400px'>" +
					"<d-panel id='panel21' label='panel21'><div>Content21</div></d-panel>" +
					"<d-panel id='panel22' label='panel22'><div>Content22</div></d-panel>" +
					"<d-panel id='panel23' label='panel23'><div>Content23</div></d-panel>" +
				"</d-accordion>" +
				"<d-accordion id='accordion3' style='height:400px' openIconClass='ic1' closedIconClass='ic2'>" +
					"<d-panel id='panel31' label='panel31'><div>Content31</div></d-panel>" +
					"<d-panel id='panel32' label='panel32' iconClass='ic3'><div>Content32</div></d-panel>" +
					"<d-panel id='panel33' label='panel33' iconClass='ic4' closedIconClass='ic5'>" +
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
					((child === target && child.containerNode.style.display !== "none" &&
						ac.selectedChildId === target.id && child.open && child.headerNode.checked &&
						$(child).hasClass("d-accordion-open-panel")) ||
					(child !== target && child.containerNode.style.display === "none" && !child.open &&
						!child.headerNode.checked && !($(child).hasClass("d-accordion-open-panel"))))),
			message + " checking " + child.id);
		});
	}

	function checkPanelsStatus(openPanels, closedPanels, message) {
		openPanels.forEach(function (panel) {
			assert.isTrue(
				(panel.headerNode.style.display !== "none" && panel.containerNode.style.display !== "none" &&
					panel.open && panel.headerNode.checked && $(panel).hasClass("d-accordion-open-panel")),
			message);
		});
		closedPanels.forEach(function (panel) {
			assert.isTrue(
				(panel.headerNode.style.display !== "none" && panel.containerNode.style.display === "none" &&
					!panel.open && !panel.headerNode.checked && !$(panel).hasClass("d-accordion-open-panel")),
			message);
		});
		checkAriaProperties(openPanels, closedPanels);
	}

	function checkPanelIconProperties(panel, pIc, pCIc, bCIc, bIc, open) {
		assert.isTrue(panel.iconClass === pIc, "Invalid panel iconClass");
		assert.isTrue(panel.closedIconClass === pCIc, "Invalid panel closedIconClass");
		assert.isTrue(panel.headerNode.checkedIconClass === bCIc, "Invalid button checkedIconClass");
		assert.isTrue(panel.headerNode.iconClass === bIc, "Invalid button iconClass");
		assert.isTrue($(panel.headerNode.iconNode).hasClass(open ? bCIc : bIc), "Invalid iconNode class");
	}

	function checkAriaProperties(openPanels, closedPanels) {
		openPanels.forEach(function (panel) {
			assert.strictEqual(panel.getAttribute("role"), "presentation");
			assert.strictEqual(panel.headerNode.getAttribute("role"), "tab");
			assert.strictEqual(panel.headerNode.getAttribute("aria-expanded"), "true");
			assert.strictEqual(panel.headerNode.getAttribute("aria-selected"), "true");
			assert.strictEqual(panel.headerNode.getAttribute("tabindex"), "-1");
			assert.strictEqual(panel.containerNode.getAttribute("role"), "tabpanel");
			assert.strictEqual(panel.containerNode.getAttribute("aria-hidden"), "false");
			assert.strictEqual(panel.containerNode.getAttribute("aria-labelledby"), panel.headerNode.id);
		});
		closedPanels.forEach(function (panel) {
			assert.strictEqual(panel.getAttribute("role"), "presentation");
			assert.strictEqual(panel.headerNode.getAttribute("role"), "tab");
			assert.strictEqual(panel.headerNode.getAttribute("aria-expanded"), "false");
			assert.strictEqual(panel.headerNode.getAttribute("aria-selected"), "false");
			assert.strictEqual(panel.headerNode.getAttribute("tabindex"), "-1");
			assert.strictEqual(panel.containerNode.getAttribute("role"), "tabpanel");
			assert.strictEqual(panel.containerNode.getAttribute("aria-hidden"), "true");
			assert.strictEqual(panel.containerNode.getAttribute("aria-labelledby"), panel.headerNode.id);
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
			assert.isTrue(accordion.singleOpen, "singleOpen should be set to true by default");
			assert.isTrue(accordion.animate, "animate should be set to true by default");
			assert.strictEqual(accordion.selectedChildId, "panel1", "by default the selectedChild is the first one");
			assert.strictEqual(accordion.openIconClass, "", "openIconClass doesn't have a default value");
			assert.strictEqual(accordion.closedIconClass, "", "closedIconClass doesn't have a default value");
			assert.strictEqual(accordion.getAttribute("role"), "tablist");
			assert.strictEqual(accordion.getAttribute("aria-multiselectable"), "false");
			assert.strictEqual(accordion.getAttribute("tabindex"), "0");

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
				assert.strictEqual(accordion2.getAttribute("aria-multiselectable"), "true");
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
				assert.isTrue(accordion3.openIconClass === "ic1");
				assert.isTrue(accordion3.closedIconClass === "ic2");
				checkPanelIconProperties(panel31, "", "", "ic1", "ic2", true);
				checkPanelIconProperties(panel32, "ic3", "", "ic3", "ic2", false);
				checkPanelIconProperties(panel33, "ic4", "ic5", "ic4", "ic5", false);
			},
			"Changing accordion openIconClass": function () {
				accordion3.openIconClass = "ic6";
				accordion3.deliver();
				panel31.headerNode.deliver();
				checkPanelIconProperties(panel31, "", "", "ic6", "ic2", true);
				checkPanelIconProperties(panel32, "ic3", "", "ic3", "ic2", false);
				checkPanelIconProperties(panel33, "ic4", "ic5", "ic4", "ic5", false);
			},
			"Changing accordion closedIconClass": function () {
				accordion3.closedIconClass = "ic7";
				accordion3.deliver();
				panel31.headerNode.deliver();
				panel32.headerNode.deliver();
				checkPanelIconProperties(panel31, "", "", "ic6", "ic7", true);
				checkPanelIconProperties(panel32, "ic3", "", "ic3", "ic7", false);
				checkPanelIconProperties(panel33, "ic4", "ic5", "ic4", "ic5", false);
			},
			"Changing panel iconClass": function () {
				panel31.iconClass = "ic8";
				panel31.deliver();
				panel31.headerNode.deliver();
				checkPanelIconProperties(panel31, "ic8", "", "ic8", "ic7", true);
				checkPanelIconProperties(panel32, "ic3", "", "ic3", "ic7", false);
				checkPanelIconProperties(panel33, "ic4", "ic5", "ic4", "ic5", false);
			},
			"Changing panel closedIconClass": function () {
				panel31.closedIconClass = "ic9";
				panel31.deliver();
				panel31.headerNode.deliver();
				checkPanelIconProperties(panel31, "ic8", "ic9", "ic8", "ic9", true);
				checkPanelIconProperties(panel32, "ic3", "", "ic3", "ic7", false);
				checkPanelIconProperties(panel33, "ic4", "ic5", "ic4", "ic5", false);
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

				function testContent(content, panel) {
					assert.strictEqual(content.style.display, "");
					assert.strictEqual(content.parentNode, panel);
				}

				var panel41 = document.getElementById("panel41");
				var panel42 = document.getElementById("panel42");

				return accordion4.show(panel42, {contentId: "newContent1"}).then(function () {
					var content = document.getElementById("newContent1");
					checkUniqueOpenPanel(accordion4, panel42, "Only panel42 should be open");
					testContent(content, panel42);
				}).then(function () {
					return accordion4.show(panel41, {contentId: "newContent2"});
				}).then(function () {
					var content = document.getElementById("newContent2");
					checkUniqueOpenPanel(accordion4, panel41, "Only panel41 should be open");
					testContent(content, panel41);
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

	dcl.mix(suite, commonSuite);
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
			ac.addChild(p1);
			ac.addChild(p2);
			ac.addChild(p3);
			p1.addChild(c1);
			p2.addChild(c2);
			p3.addChild(c3);
			ac.placeAt(container);
			var ac2 = new Accordion({id: "accordion2", singleOpen: false});
			ac2.style.height = "400px";
			var p21 = new Panel({id: "panel21", label: "panel21"});
			var p22 = new Panel({id: "panel22", label: "panel22"});
			var p23 = new Panel({id: "panel23", label: "panel23"});
			var c21 = document.createElement("div");
			var c22 = document.createElement("div");
			var c23 = document.createElement("div");
			ac2.addChild(p21);
			ac2.addChild(p22);
			ac2.addChild(p23);
			p21.addChild(c21);
			p22.addChild(c22);
			p23.addChild(c23);
			ac2.placeAt(container, "last");
			var ac3 = new Accordion({id: "accordion3", singleOpen: false,
				openIconClass: "ic1", closedIconClass: "ic2"});
			ac3.style.height = "400px";
			var p31 = new Panel({id: "panel31", label: "panel31"});
			var p32 = new Panel({id: "panel32", label: "panel32", iconClass: "ic3"});
			var p33 = new Panel({id: "panel33", label: "panel33", iconClass: "ic4", closedIconClass: "ic5"});
			var c31 = document.createElement("div");
			var c32 = document.createElement("div");
			var c33 = document.createElement("div");
			ac3.addChild(p31);
			ac3.addChild(p32);
			ac3.addChild(p33);
			p31.addChild(c31);
			p32.addChild(c32);
			p33.addChild(c33);
			ac3.placeAt(container, "last");
		},
		"Controller": {
			setup: function () {
				accordion4 = new Accordion();
				var p40 = new Panel();
				accordion4.addChild(p40);
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

				function testContent(content, panel) {
					assert.strictEqual(content.style.display, "");
					assert.strictEqual(content.parentNode, panel);
					assert.strictEqual(panel.parentNode, accordion4);
				}

				return accordion4.show("panel41", {contentId: "newContent1"}).then(function () {
					var panel = document.getElementById("panel41");
					var content = document.getElementById("newContent1");
					checkUniqueOpenPanel(accordion4, panel, "Only panel41 should be open");
					testContent(content, panel);
				}).then(function () {
					return accordion4.show("panel42", {contentId: "newContent2"});
				}).then(function () {
					var panel = document.getElementById("panel42");
					var content = document.getElementById("newContent2");
					checkUniqueOpenPanel(accordion4, panel, "Only panel42 should be open");
					testContent(content, panel);
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

	dcl.mix(suite, commonSuite);
	registerSuite(suite);
});
