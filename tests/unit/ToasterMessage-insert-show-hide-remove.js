define([
	"intern!object",
	"intern/chai!assert",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"delite/register",
	"deliteful/Toaster",
	"deliteful/ToasterMessage"
], function (registerSuite, assert, domGeom, domClass, register, Toaster, ToasterMessage) {

	var container, toaster, wrapper, mExpirable, mPersistent;
	var triggerAnimationOrTransitionEnd = function(element){
		var events = ["webkitTransitionEnd", "transitionend",
			"webkitAnimationEnd", "mozAnimationEnd", "MSAnimationEnd", "oanimationend", "animationend"];
		events.forEach(function(event){
			element.emit(event, {bubbles: true, cancelable: false});
		});
	};

	registerSuite({
		name: "ToasterMessage insert/show/hide/remove from DOM",

		setup: function () {
			container = document.createElement("div");
			container.setAttribute("id", "container")
			document.body.appendChild(container);
			
			// setting up the toaster
			toaster =  new Toaster();
			toaster.startup();
			toaster.placeAt("container");
			toaster.show();

			// setting the wrapper
			wrapper = toaster._wrapper;

			// setting up the message
			mExpirable = ToasterMessage({
				message: "Hello world",
				type: "error",
				duration: 2000
			});
			mPersistent = ToasterMessage({
				message: "Hello world",
				type: "error",
				duration: NaN
			});
		},
		"Testing insert in Dom": function(){
			mExpirable._insertInDom(toaster, true);
			assert(mExpirable.compareDocumentPosition(wrapper) === 10);
			assert(domClass.contains(mExpirable, toaster.animationInitialClass));
			assert.isTrue(mExpirable._isInserted);

			mPersistent._insertInDom(toaster, true);
			assert(mPersistent.compareDocumentPosition(wrapper) === 10);
			assert(domClass.contains(mPersistent, toaster.animationInitialClass));
			assert.isTrue(mPersistent._isInserted);
		},
		"Testing show in Dom": function(){
			var assertHasClass = function(element, animationClass){
				var d = this.async(1000);
				setTimeout(d.callback(function(){ // NOTE: there is a 1ms timeout inside _showInDom
					assert.isTrue(domClass.contains(element, animationClass), 
						"element should have class " + animationClass);
				}), 100);

				return d;
			}.bind(this);

			//mExpirable._showInDom(wrapper, toaster.animationEnterClass);
			//assertHasClass(mExpirable, toaster.animationEnterClass).then(function(){
				//console.debug(mExpirable.className);
				//triggerAnimationOrTransitionEnd(mExpirable);
			//}).then(function(){
				//console.debug(mExpirable.className)
			//});
			mPersistent._showInDom(wrapper, true);
			//assertHasClass(mPersistent, toaster.animationEnterClass);
		},
		"Testing hide in Dom": function(){
			mExpirable._hideInDom(toaster, true);
			assert(domClass.contains(mExpirable, toaster.animationQuitClass));
			//assert.isTrue(mExpirable._tobeRemoved); // TODO: ._tobeRemoved is still untested

			mPersistent._hideInDom(toaster);
			assert.isTrue(mPersistent._tobeRemoved);
		},
		"Testing remove in Dom": function(){
			mExpirable._removeFromDom(toaster, true);
			assert(domClass.contains(mExpirable, toaster.animationEndClass));
			assert.isNull( document.getElementById(mExpirable.id) );
			assert.isTrue(mExpirable._isRemoved);

			mPersistent._removeFromDom(wrapper, true);
			//assert(domClass.contains(mPersistent, toaster.animationEndClass));
			assert.isNull( document.getElementById(mPersistent.id) );
			assert.isTrue(mPersistent._isRemoved);
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	});
});
