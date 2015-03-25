define([
	"intern!object",
	"intern/chai!assert",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/register",
	"decor/sniff",
	"deliteful/ViewStack",
	"requirejs-dplugins/css!deliteful/ViewStack/transitions/cover.css",
	"requirejs-dplugins/css!deliteful/ViewStack/transitions/coverv.css",
	"requirejs-dplugins/css!deliteful/ViewStack/transitions/fade.css",
	"requirejs-dplugins/css!deliteful/ViewStack/transitions/flip.css",
	"requirejs-dplugins/css!deliteful/ViewStack/transitions/slidev.css",
	"requirejs-dplugins/css!deliteful/ViewStack/transitions/revealv.css"
], function (registerSuite, assert, $, register, has) {
	var container, node;
	var aaa, bbb, ccc, ddd;
	var asyncHandler;
	var htmlContent = "<d-view-stack id='vs'><div id='aaa'>AAA</div><div id='bbb'>BBB</div><div id='ccc'>CCC</div>" +
		"<div id='ddd'>DDD</div></d-view-stack>";

	function checkNodeVisibility(vs, target) {
		for (var i = 0; i < vs.children.length; i++) {
			assert.isTrue(
				((vs.children[i] === target && vs.children[i].style.display !== "none" &&
					vs.selectedChildId === target.id)) ||
					(vs.children[i] !== target && vs.children[i].style.display === "none")
			);
		}
	}

	function checkReverse(vs, target) {
		assert.isTrue($(vs.children[target]).hasClass("-d-view-stack-reverse"));
	}

	function checkNoReverse(vs, target) {
		assert.isFalse($(vs.children[target]).hasClass("-d-view-stack-reverse"));
	}

	function checkTransition(vs, target, transition) {
		switch (transition) {
		case "slide" :
			assert.isTrue($(vs.children[target]).hasClass("-d-view-stack-slide"));
			break;
		case "slidev" :
			assert.isTrue($(vs.children[target]).hasClass("-d-view-stack-slidev"));
			break;
		case "reveal" :
			assert.isTrue($(vs.children[target]).hasClass("-d-view-stack-reveal"));
			break;
		case "revealv" :
			assert.isTrue($(vs.children[target]).hasClass("-d-view-stack-revealv"));
			break;
		case "flip" :
			assert.isTrue($(vs.children[target]).hasClass("-d-view-stack-flip"));
			break;
		case "fade" :
			assert.isTrue($(vs.children[target]).hasClass("-d-view-stack-fade"));
			break;
		case "cover" :
			assert.isTrue($(vs.children[target]).hasClass("-d-view-stack-cover"));
			break;
		case "coverv" :
			assert.isTrue($(vs.children[target]).hasClass("-d-view-stack-coverv"));
			break;
		case "none" :
			checkNodeVisibility(vs, target);
			break;
		}
	}

	registerSuite({
		name: "ViewStack Markup",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = htmlContent;
			register.parse(container);
			node = document.getElementById("vs");
			aaa = document.getElementById("aaa");
			bbb = document.getElementById("bbb");
			ccc = document.getElementById("ccc");
			ddd = document.getElementById("ddd");
		},
		"Default CSS" : function () {
			assert.isTrue($(node).hasClass("d-view-stack"));
		},
		"Default values" : function () {
			assert.deepEqual(node.transition, "slide");
			assert.deepEqual(node.reverse, false);
		},
		"Show (by widget)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, bbb);
			}));
			node.show(bbb);
		},
		"Show (by id)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, aaa);
			}));
			node.show("aaa");
		},
		"Show (no transition)" : function () {
			// Shorter timing if no transition
			var d = this.async(100);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, bbb);
			}));
			node.show(bbb, {transition: "none"});
		},
		"Show (reverse)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, ccc);
			}));
			node.show(ccc, {reverse: true});
		},
		"Show (reverse, no transition)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, ddd);
			}));
			node.show(ddd, {transition: "none", reverse: true});
		},
		"Show (reveal)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, aaa);
			}));
			node.show(aaa, {transition: "reveal", reverse: false});
		},
		"Show (reverse, reveal)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, bbb);
			}));
			node.show(bbb, {transition: "reveal", reverse: true});
		},
		"Show (flip)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, ccc);
			}));
			node.show(ccc, {transition: "flip", reverse: false});
		},
		"Show (reverse, flip)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, ddd);
			}));
			node.show(ddd, {transition: "flip", reverse: true});
		},
		"Show (slidev)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, aaa);
			}));
			node.show(aaa, {transition: "slidev", reverse: false});
		},
		"Show (reverse, slidev)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, bbb);
			}));
			node.show(bbb, {transition: "slidev", reverse: true});
		},
		"Show (cover)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, ccc);
			}));
			node.show(ccc, {transition: "cover", reverse: false});
		},
		"Show (reverse, cover)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, ddd);
			}));
			node.show(ddd, {transition: "cover", reverse: true});
		},
		"Show (coverv)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, aaa);
			}));
			node.show(aaa, {transition: "coverv", reverse: false});
		},
		"Show (reverse, coverv)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, bbb);
			}));
			node.show(bbb, {transition: "coverv", reverse: true});
		},
		"Show (revealv)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, ccc);
			}));
			node.show(ccc, {transition: "revealv", reverse: false});
		},
		"Show (reverse, revealv)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, ddd);
			}));
			node.show(ddd, {transition: "revealv", reverse: true});
		},
		"Show (fade)" : function () {
			if (has("ie")) {
				this.skip("Disabled on Internet Explorer");
			}
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, ccc);
			}));
			node.show(ccc, {transition: "fade", reverse: false});
		},
		"Show (reverse, slide)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, bbb);
			}));
			node.show(bbb, {transition: "slide", reverse: true});
		},
		"SelectedChildId Setter": function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, ccc);
			}));
			node.selectedChildId = "ccc";
		},
		"Promise resolution: default": function () {
			var d = this.async(1000);
			node.show("aaa").then(d.callback(function () {
				checkNodeVisibility(node, aaa);
			}));
		},
		"Promise resolution: invisible ViewStack": function () {
			var d = this.async(1000);
			node.style.display = "none";
			node.show("bbb").then(d.callback(function () {
				checkNodeVisibility(node, bbb);
			}));
		},
		"Promise resolution: no transition": function () {
			var d = this.async(1000);
			node.show("ccc", {transition: "none"}).then(d.callback(function () {
				checkNodeVisibility(node, ccc);
			}));
		},
		"Promise resolution: invisible ViewStack, no transition": function () {
			var d = this.async(1000);
			// Test also if invisible because of its parent
			node.parentNode.style.display = "none";
			node.show("ddd", {transition: "none"}).then(d.callback(function () {
				checkNodeVisibility(node, ddd);
			}));
		},
		"Check reverse in showPrevious": {
			setup: function () {
				node.style.display = "";
				node.parentNode.style.display = "";
			},
			"ShowPrevious(): default reverse": function () {
				return node.show(ccc, {transition: "none"}).then(function () {
					return node.showPrevious();
				}).then(function () {
					checkReverse(node, "bbb");
				});
			},
			"ShowPrevious(no transition): default reverse": function () {
				return node.show(ddd, {transition: "none"}).then(function () {
					return node.showPrevious({transition: "none"});
				}).then(function () {
					checkNoReverse(node, "ccc");
				});
			},
			"ShowPrevious(fade): default reverse": function () {
				return node.show(bbb, {transition: "none"}).then(function () {
					return node.showPrevious({transition: "fade"});
				}).then(function () {
					checkReverse(node, "aaa");
				});
			},
			"ShowPrevious(revealv): default reverse": function () {
				return node.show(ccc, {transition: "none"}).then(function () {
					return node.showPrevious({transition: "revealv"});
				}).then(function () {
					checkReverse(node, "bbb");
				});
			},
			"ShowPrevious(reveal): default reverse": function () {
				return node.show(ccc, {transition: "none"}).then(function () {
					return node.showPrevious({transition: "reveal"});
				}).then(function () {
					checkReverse(node, "bbb");
				});
			},
			"ShowPrevious(flip): default reverse": function () {
				return node.show(ddd, {transition: "none"}).then(function () {
					return node.showPrevious({transition: "flip"});
				}).then(function () {
					checkReverse(node, "ccc");
				});
			},
			"ShowPrevious(slidev): default reverse": function () {
				return node.show(bbb, {transition: "none"}).then(function () {
					return node.showPrevious({transition: "slidev"});
				}).then(function () {
					checkReverse(node, "aaa");
				});
			},
			"ShowPrevious(slide): default reverse": function () {
				return node.show(ccc, {transition: "none"}).then(function () {
					return node.showPrevious({transition: "slide"});
				}).then(function () {
					checkReverse(node, "bbb");
				});
			},
			"ShowPrevious(coverv): default reverse": function () {
				return node.show(ddd, {transition: "none"}).then(function () {
					return node.showPrevious({transition: "coverv"});
				}).then(function () {
					checkReverse(node, "ccc");
				});
			},
			"ShowPrevious(cover): default reverse": function () {
				return node.show(ccc, {transition: "none"}).then(function () {
					return node.showPrevious({transition: "cover"});
				}).then(function () {
					checkReverse(node, "bbb");
				});
			},
			"ShowPrevious(no reverse, no transition)": function () {
				return node.show(ddd, {transition: "none"}).then(function () {
					return node.showPrevious({reverse: false, transition: "none"});
				}).then(function () {
					checkNoReverse(node, "ccc");
				});
			},
			"ShowPrevious(no reverse, fade)": function () {
				return node.show(bbb, {transition: "none"}).then(function () {
					return node.showPrevious({reverse: false, transition: "fade"});
				}).then(function () {
					checkNoReverse(node, "aaa");
				});
			},
			"ShowPrevious(no reverse, revealv)": function () {
				return node.show(ccc, {transition: "none"}).then(function () {
					return node.showPrevious({reverse: false, transition: "revealv"});
				}).then(function () {
					checkNoReverse(node, "bbb");
				});
			},
			"ShowPrevious(no reverse, reveal)": function () {
				return node.show(ccc, {transition: "none"}).then(function () {
					return node.showPrevious({reverse: false, transition: "reveal"});
				}).then(function () {
					checkNoReverse(node, "bbb");
				});
			},
			"ShowPrevious(no reverse, flip)": function () {
				return node.show(ddd, {transition: "none"}).then(function () {
					return node.showPrevious({reverse: false, transition: "flip"});
				}).then(function () {
					checkNoReverse(node, "ccc");
				});
			},
			"ShowPrevious(no reverse, slidev)": function () {
				return node.show(bbb, {transition: "none"}).then(function () {
					return node.showPrevious({reverse: false, transition: "slidev"});
				}).then(function () {
					checkNoReverse(node, "aaa");
				});
			},
			"ShowPrevious(no reverse, slide)": function () {
				return node.show(ccc, {transition: "none"}).then(function () {
					return node.showPrevious({reverse: false, transition: "slide"});
				}).then(function () {
					checkNoReverse(node, "bbb");
				});
			},
			"ShowPrevious(no reverse, coverv)": function () {
				return node.show(ddd, {transition: "none"}).then(function () {
					return node.showPrevious({reverse: false, transition: "coverv"});
				}).then(function () {
					checkNoReverse(node, "ccc");
				});
			},
			"ShowPrevious(no reverse, cover)": function () {
				return node.show(ccc, {transition: "none"}).then(function () {
					return node.showPrevious({reverse: false, transition: "cover"});
				}).then(function () {
					checkNoReverse(node, "bbb");
				});
			},
			"ShowPrevious(reverse, no transition)": function () {
				return node.show(ddd, {transition: "none"}).then(function () {
					return node.showPrevious({reverse: true, transition: "none"});
				}).then(function () {
					checkNoReverse(node, "ccc");
				});
			},
			"ShowPrevious(reverse, fade)": function () {
				return node.show(bbb, {transition: "none"}).then(function () {
					return node.showPrevious({reverse: true, transition: "fade"});
				}).then(function () {
					checkReverse(node, "aaa");
				});
			},
			"ShowPrevious(reverse, revealv)": function () {
				return node.show(ccc, {transition: "none"}).then(function () {
					return node.showPrevious({reverse: true, transition: "revealv"});
				}).then(function () {
					checkReverse(node, "bbb");
				});
			},
			"ShowPrevious(reverse, reveal)": function () {
				return node.show(ccc, {transition: "none"}).then(function () {
					return node.showPrevious({reverse: true, transition: "reveal"});
				}).then(function () {
					checkReverse(node, "bbb");
				});
			},
			"ShowPrevious(reverse, flip)": function () {
				return node.show(ddd, {transition: "none"}).then(function () {
					return node.showPrevious({reverse: true, transition: "flip"});
				}).then(function () {
					checkReverse(node, "ccc");
				});
			},
			"ShowPrevious(reverse, slidev)": function () {
				return node.show(bbb, {transition: "none"}).then(function () {
					return node.showPrevious({reverse: true, transition: "slidev"});
				}).then(function () {
					checkReverse(node, "aaa");
				});
			},
			"ShowPrevious(reverse, slide)": function () {
				return node.show(ccc, {transition: "none"}).then(function () {
					return node.showPrevious({reverse: true, transition: "slide"});
				}).then(function () {
					checkReverse(node, "bbb");
				});
			},
			"ShowPrevious(reverse, coverv)": function () {
				return node.show(ddd, {transition: "none"}).then(function () {
					return node.showPrevious({reverse: true, transition: "coverv"});
				}).then(function () {
					checkReverse(node, "ccc");
				});
			},
			"ShowPrevious(reverse, cover)": function () {
				return node.show(ccc, {transition: "none"}).then(function () {
					return node.showPrevious({reverse: true, transition: "cover"});
				}).then(function () {
					checkReverse(node, "bbb");
				});
			}
		},
		"Check transition" : {
			"Show(): Default transition": function () {
				return node.show(ccc).then(function () {
					checkTransition(node, "ccc", "slide");
				});
			},
			"Show(): slide transition": function () {
				node.transition = "slide";
				return node.show(ddd).then(function () {
					checkTransition(node, "ddd", "slide");
				});
			},
			"Show(): slidev transition": function () {
				node.transition = "slidev";
				return node.show(aaa).then(function () {
					checkTransition(node, "aaa", "slidev");
				});
			},
			"Show(): reveal transition": function () {
				node.transition = "reveal";
				return node.show(bbb).then(function () {
					checkTransition(node, "bbb", "reveal");
				});
			},
			"Show(): revealv transition": function () {
				node.transition = "revealv";
				return node.show(ddd).then(function () {
					checkTransition(node, "ddd", "revealv");
				});
			},
			"Show(): flip transition": function () {
				node.transition = "flip";
				return node.show(ccc).then(function () {
					checkTransition(node, "ccc", "flip");
				});
			},
			"Show(): fade transition": function () {
				node.transition = "fade";
				return node.show(ddd).then(function () {
					checkTransition(node, "ddd", "fade");
				});
			},
			"Show(): cover transition": function () {
				node.transition = "cover";
				return node.show(aaa).then(function () {
					checkTransition(node, "aaa", "cover");
				});
			},
			"Show(): coverv transition": function () {
				node.transition = "coverv";
				return node.show(bbb).then(function () {
					checkTransition(node, "bbb", "coverv");
				});
			},
			"Show(): no transition": function () {
				node.transition = "none";
				return node.show(ccc).then(function () {
					checkTransition(node, ccc, "none");
				});
			},
			"Show(slide)": function () {
				return node.show(ddd, {transition: "slide"}).then(function () {
					checkTransition(node, "ddd", "slide");
				});
			},
			"Show(slidev)": function () {
				return node.show(aaa, {transition: "slidev"}).then(function () {
					checkTransition(node, "aaa", "slidev");
				});
			},
			"Show(reveal)": function () {
				return node.show(bbb, {transition: "reveal"}).then(function () {
					checkTransition(node, "bbb", "reveal");
				});
			},
			"Show(revealv)": function () {
				return node.show(ddd, {transition: "revealv"}).then(function () {
					checkTransition(node, "ddd", "revealv");
				});
			},
			"Show(flip)": function () {
				return node.show(ccc, {transition: "flip"}).then(function () {
					checkTransition(node, "ccc", "flip");
				});
			},
			"Show(fade)": function () {
				return node.show(ddd, {transition: "fade"}).then(function () {
					checkTransition(node, "ddd", "fade");
				});
			},
			"Show(cover)": function () {
				return node.show(aaa, {transition: "cover"}).then(function () {
					checkTransition(node, "aaa", "cover");
				});
			},
			"Show()": function () {
				return node.show(bbb, {transition: "coverv"}).then(function () {
					checkTransition(node, "bbb", "coverv");
				});
			},
			"Show(no transition)": function () {
				return node.show(ddd, {transition: "none"}).then(function () {
					checkTransition(node, ddd, "none");
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
	});
});
