define([
	"intern!object",
	"intern/chai!assert",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/register",
	"dcl/advise",
	"deliteful/ViewStack",
	"requirejs-dplugins/css!deliteful/ViewStack/transitions/cover.css",
	"requirejs-dplugins/css!deliteful/ViewStack/transitions/coverv.css",
	"requirejs-dplugins/css!deliteful/ViewStack/transitions/fade.css",
	"requirejs-dplugins/css!deliteful/ViewStack/transitions/flip.css",
	"requirejs-dplugins/css!deliteful/ViewStack/transitions/slidev.css",
	"requirejs-dplugins/css!deliteful/ViewStack/transitions/revealv.css"
], function (registerSuite, assert, $, register, advise) {
	var container, node;
	var aaa, bbb, ccc, ddd;
	var asyncHandler, adviseHandler;
	var htmlContent = "<d-view-stack id='vs'><div id='aaa'>AAA</div><div id='bbb'>BBB</div><div id='ccc'>CCC</div>" +
		"<div id='ddd'>DDD</div></d-view-stack>";

	function checkNodeVisibility(vs, target) {
		assert.notStrictEqual(target.style.display, "none", target.id + " display");
		assert.strictEqual(vs.selectedChildId, target.id, "vs.selectedChildId");
		for (var i = 0; i < vs.children.length; i++) {
			var child = vs.children[i];
			assert.strictEqual(child.className, "", child.id + " class");
			if (child !== target) {
				assert.strictEqual(child.style.display, "none", child.id + " style.display");
			}
		}
	}

	function checkReverse(vs, target) {
		assert.isTrue($(vs.children[target]).hasClass("-d-view-stack-reverse"), "has -d-view-stack-reverse");
	}

	function checkNoReverse(vs, target) {
		assert.isFalse($(vs.children[target]).hasClass("-d-view-stack-reverse"), "doesn't have -d-view-stack-reverse");
	}

	function checkTransition(vs, target, transition) {
		switch (transition) {
		case "slide" :
			assert.isTrue($(vs.children[target]).hasClass("-d-view-stack-slide"), "has -d-view-stack-slide");
			break;
		case "slidev" :
			assert.isTrue($(vs.children[target]).hasClass("-d-view-stack-slidev"), "has -d-view-stack-slidev");
			break;
		case "reveal" :
			assert.isTrue($(vs.children[target]).hasClass("-d-view-stack-reveal"), "has -d-view-stack-reveal");
			break;
		case "revealv" :
			assert.isTrue($(vs.children[target]).hasClass("-d-view-stack-revealv"), "has -d-view-stack-revealv");
			break;
		case "flip" :
			assert.isTrue($(vs.children[target]).hasClass("-d-view-stack-flip"), "has -d-view-stack-flip");
			break;
		case "fade" :
			assert.isTrue($(vs.children[target]).hasClass("-d-view-stack-fade"), "has -d-view-stack-fade");
			break;
		case "cover" :
			assert.isTrue($(vs.children[target]).hasClass("-d-view-stack-cover"), "has -d-view-stack-cover");
			break;
		case "coverv" :
			assert.isTrue($(vs.children[target]).hasClass("-d-view-stack-coverv"), "has -d-view-stack-coverv");
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
			register.deliver();
			node = document.getElementById("vs");
			aaa = document.getElementById("aaa");
			bbb = document.getElementById("bbb");
			ccc = document.getElementById("ccc");
			ddd = document.getElementById("ddd");
		},
		"Default CSS" : function () {
			assert.isTrue($(node).hasClass("d-view-stack"), "has d-view-stack");
		},
		"Default values" : function () {
			assert.strictEqual(node.transition, "slide", "node.transition");
			assert.isFalse(node.reverse, "node.reverse");
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
			setTimeout(function () {
				node.show(ddd, {transition: "flip", reverse: true});
			}, 0);	// avoid chrome problem when setting a new transition class immediately after removing the old one
		},
		"Show (slidev)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, aaa);
			}));
			setTimeout(function () {
				node.show(aaa, {transition: "slidev", reverse: false});
			}, 0);	// avoid chrome problem when setting a new transition class immediately after removing the old one
		},
		"Show (reverse, slidev)" : function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, bbb);
			}));
			setTimeout(function () {
				node.show(bbb, {transition: "slidev", reverse: true});
			}, 0);	// avoid chrome problem when setting a new transition class immediately after removing the old one
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
				var d = this.async(1000);
				node.show(ccc, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkReverse(node, "bbb");
						})
					});
					node.showPrevious().then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(no transition): default reverse": function () {
				var d = this.async(1000);
				node.show(ddd, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkNoReverse(node, "ccc");
						})
					});
					node.showPrevious({transition: "none"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(fade): default reverse": function () {
				var d = this.async(1000);
				node.show(bbb, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkReverse(node, "aaa");
						})
					});
					node.showPrevious({transition: "fade"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(revealv): default reverse": function () {
				var d = this.async(1000);
				node.show(ccc, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkReverse(node, "bbb");
						})
					});
					node.showPrevious({transition: "revealv"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(reveal): default reverse": function () {
				var d = this.async(1000);
				node.show(ccc, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkReverse(node, "bbb");
						})
					});
					node.showPrevious({transition: "reveal"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(flip): default reverse": function () {
				var d = this.async(1000);
				node.show(ddd, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkReverse(node, "ccc");
						})
					});
					node.showPrevious({transition: "flip"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(slidev): default reverse": function () {
				var d = this.async(1000);
				node.show(bbb, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkReverse(node, "aaa");
						})
					});
					node.showPrevious({transition: "slidev"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(slide): default reverse": function () {
				var d = this.async(1000);
				node.show(ccc, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkReverse(node, "bbb");
						})
					});
					node.showPrevious({transition: "slide"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(coverv): default reverse": function () {
				var d = this.async(1000);
				node.show(ddd, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkReverse(node, "ccc");
						})
					});
					node.showPrevious({transition: "coverv"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(cover): default reverse": function () {
				var d = this.async(1000);
				node.show(ccc, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkReverse(node, "bbb");
						})
					});
					node.showPrevious({transition: "cover"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(no reverse, no transition)": function () {
				var d = this.async(1000);
				node.show(ddd, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkNoReverse(node, "ccc");
						})
					});
					node.showPrevious({reverse: false, transition: "none"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(no reverse, fade)": function () {
				var d = this.async(1000);
				node.show(bbb, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkNoReverse(node, "aaa");
						})
					});
					node.showPrevious({reverse: false, transition: "fade"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(no reverse, revealv)": function () {
				var d = this.async(1000);
				node.show(ccc, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkNoReverse(node, "bbb");
						})
					});
					node.showPrevious({reverse: false, transition: "revealv"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(no reverse, reveal)": function () {
				var d = this.async(1000);
				node.show(ccc, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkNoReverse(node, "bbb");
						})
					});
					node.showPrevious({reverse: false, transition: "reveal"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(no reverse, flip)": function () {
				var d = this.async(1000);
				node.show(ddd, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkNoReverse(node, "ccc");
						})
					});
					node.showPrevious({reverse: false, transition: "flip"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(no reverse, slidev)": function () {
				var d = this.async(1000);
				node.show(bbb, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkNoReverse(node, "aaa");
						})
					});
					node.showPrevious({reverse: false, transition: "slidev"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(no reverse, slide)": function () {
				var d = this.async(1000);
				node.show(ccc, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkNoReverse(node, "bbb");
						})
					});
					node.showPrevious({reverse: false, transition: "slide"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(no reverse, coverv)": function () {
				var d = this.async(1000);
				node.show(ddd, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkNoReverse(node, "ccc");
						})
					});
					node.showPrevious({reverse: false, transition: "coverv"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(no reverse, cover)": function () {
				var d = this.async(1000);
				node.show(ccc, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkNoReverse(node, "bbb");
						})
					});
					node.showPrevious({reverse: false, transition: "cover"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(reverse, no transition)": function () {
				var d = this.async(1000);
				node.show(ddd, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkNoReverse(node, "ccc");
						})
					});
					node.showPrevious({reverse: true, transition: "none"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(reverse, fade)": function () {
				var d = this.async(1000);
				node.show(bbb, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkReverse(node, "aaa");
						})
					});
					node.showPrevious({reverse: true, transition: "fade"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(reverse, revealv)": function () {
				var d = this.async(1000);
				node.show(ccc, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkReverse(node, "bbb");
						})
					});
					node.showPrevious({reverse: true, transition: "revealv"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(reverse, reveal)": function () {
				var d = this.async(1000);
				node.show(ccc, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkReverse(node, "bbb");
						})
					});
					node.showPrevious({reverse: true, transition: "reveal"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(reverse, flip)": function () {
				var d = this.async(1000);
				node.show(ddd, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkReverse(node, "ccc");
						})
					});
					node.showPrevious({reverse: true, transition: "flip"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(reverse, slidev)": function () {
				var d = this.async(1000);
				node.show(bbb, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkReverse(node, "aaa");
						})
					});
					node.showPrevious({reverse: true, transition: "slidev"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(reverse, slide)": function () {
				var d = this.async(1000);
				node.show(ccc, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkReverse(node, "bbb");
						})
					});
					node.showPrevious({reverse: true, transition: "slide"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(reverse, coverv)": function () {
				var d = this.async(1000);
				node.show(ddd, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkReverse(node, "ccc");
						})
					});
					node.showPrevious({reverse: true, transition: "coverv"}).then(function () {
						d.resolve();
					});
				});
			},
			"ShowPrevious(reverse, cover)": function () {
				var d = this.async(1000);
				node.show(ccc, {transition: "none"}).then(function () {
					adviseHandler = advise(node, "_doTransition", {
						after: d.rejectOnError(function () {
							checkReverse(node, "bbb");
						})
					});
					node.showPrevious({reverse: true, transition: "cover"}).then(function () {
						d.resolve();
					});
				});
			}
		},
		"Check transition" : {
			"Show(): Default transition": function () {
				var d = this.async(1000);
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, "ccc", "slide");
					})
				});
				node.show(ccc).then(function () {
					d.resolve();
				});
			},
			"Show(): slide transition": function () {
				var d = this.async(1000);
				node.transition = "slide";
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, "ddd", "slide");
					})
				});
				node.show(ddd).then(function () {
					d.resolve();
				});
			},
			"Show(): slidev transition": function () {
				var d = this.async(1000);
				node.transition = "slidev";
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, "aaa", "slidev");
					})
				});
				node.show(aaa).then(function () {
					d.resolve();
				});
			},
			"Show(): reveal transition": function () {
				var d = this.async(1000);
				node.transition = "reveal";
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, "bbb", "reveal");
					})
				});
				node.show(bbb).then(function () {
					d.resolve();
				});
			},
			"Show(): revealv transition": function () {
				var d = this.async(1000);
				node.transition = "revealv";
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, "ddd", "revealv");
					})
				});
				node.show(ddd).then(function () {
					d.resolve();
				});
			},
			"Show(): flip transition": function () {
				var d = this.async(1000);
				node.transition = "flip";
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, "ccc", "flip");
					})
				});
				node.show(ccc).then(function () {
					d.resolve();
				});
			},
			"Show(): fade transition": function () {
				var d = this.async(1000);
				node.transition = "fade";
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, "ddd", "fade");
					})
				});
				node.show(ddd).then(function () {
					d.resolve();
				});
			},
			"Show(): cover transition": function () {
				var d = this.async(1000);
				node.transition = "cover";
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, "aaa", "cover");
					})
				});
				node.show(aaa).then(function () {
					d.resolve();
				});
			},
			"Show(): coverv transition": function () {
				var d = this.async(1000);
				node.transition = "coverv";
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, "bbb", "coverv");
					})
				});
				node.show(bbb).then(function () {
					d.resolve();
				});
			},
			"Show(): no transition": function () {
				node.transition = "none";
				var d = this.async(1000);
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, ccc, "none");
					})
				});
				node.show(ccc).then(function () {
					d.resolve();
				});
			},
			"Show(slide)": function () {
				var d = this.async(1000);
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, "ddd", "slide");
					})
				});
				node.show(ddd, {transition: "slide"}).then(function () {
					d.resolve();
				});
			},
			"Show(slidev)": function () {
				var d = this.async(1000);
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, "aaa", "slidev");
					})
				});
				node.show(aaa, {transition: "slidev"}).then(function () {
					d.resolve();
				});
			},
			"Show(reveal)": function () {
				var d = this.async(1000);
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, "bbb", "reveal");
					})
				});
				node.show(bbb, {transition: "reveal"}).then(function () {
					d.resolve();
				});
			},
			"Show(revealv)": function () {
				var d = this.async(1000);
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, "ddd", "revealv");
					})
				});
				node.show(ddd, {transition: "revealv"}).then(function () {
					d.resolve();
				});
			},
			"Show(flip)": function () {
				var d = this.async(1000);
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, "ccc", "flip");
					})
				});
				node.show(ccc, {transition: "flip"}).then(function () {
					d.resolve();
				});
			},
			"Show(fade)": function () {
				var d = this.async(1000);
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, "ddd", "fade");
					})
				});
				node.show(ddd, {transition: "fade"}).then(function () {
					d.resolve();
				});
			},
			"Show(cover)": function () {
				var d = this.async(1000);
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, "aaa", "cover");
					})
				});
				node.show(aaa, {transition: "cover"}).then(function () {
					d.resolve();
				});
			},
			"Show(coverv)": function () {
				var d = this.async(1000);
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, "bbb", "coverv");
					})
				});
				node.show(bbb, {transition: "coverv"}).then(function () {
					d.resolve();
				});
			},
			"Show(no transition)": function () {
				var d = this.async(1000);
				adviseHandler = advise(node, "_doTransition", {
					after: d.rejectOnError(function () {
						checkTransition(node, ddd, "none");
					})
				});
				node.show(ddd, {transition: "none"}).then(function () {
					d.resolve();
				});
			}
		},
		"detach and reattach": function () {
			var d = this.async(1000);

			node.show(bbb, {transition: "none"});	// select node that *isn't* the first node

			node.parentNode.removeChild(node);

			setTimeout(d.rejectOnError(function () {
				container.appendChild(node);

				setTimeout(d.callback(function () {
					assert.strictEqual(node._visibleChild, bbb, "node._visibleChild");
					assert.strictEqual(aaa.style.display, "none", "aaa hidden");
					assert.notStrictEqual(bbb.style.display, "none", "bbb visible");
				}), 10);
			}), 10);
		},

		"repeated show call": function () {
			// Test for race condition on firefox where the transition never finishes if you
			// quickly repeatedly call show() on a node.
			var d = this.async(3000);
			node.show(ccc, {transition: "fade"});
			setTimeout(function () {
				node.show(ccc, {transition: "fade"});
			}, 3);
			setTimeout(d.callback(function () {
				checkNodeVisibility(node, ccc);
			}), 1500);
		},

		// Note: this should be the last test
		"remove visible node": function () {
			var d = this.async(1000);
			asyncHandler = node.on("delite-after-show", d.callback(function () {
				assert.strictEqual(node._visibleChild, aaa);
				node.removeChild(aaa);
				assert.strictEqual(node._visibleChild, null);
			}));
			node.show(aaa);
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		},
		afterEach: function () {
			if (asyncHandler) {
				asyncHandler.remove();
			}
			if (adviseHandler) {
				adviseHandler.unadvise();
			}
		}
	});
});
