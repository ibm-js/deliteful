define(function (require) {
	"use strict";

	var registerSuite = require("intern!object");
	var assert = require("intern/chai!assert");
	var Toaster = require("deliteful/Toaster");
	var ToasterMessage = require("deliteful/ToasterMessage");

	var container, toaster, wrapper, mExpirable, mPersistent;

	registerSuite({
		"name": "ToasterMessage insert/show/hide/remove from DOM",

		"setup": function () {
			container = document.createElement("div");
			document.body.appendChild(container);

			// setting up the toaster
			toaster = new Toaster();
			toaster.placeAt(container);

			// setting the wrapper
			wrapper = toaster._wrapper;

			// setting up the message
			mExpirable = new ToasterMessage({
				message: "Hello world",
				type: "error",
				duration: 2000
			});
			mPersistent = new ToasterMessage({
				message: "Hello world",
				type: "error",
				duration: NaN
			});
		},
		"Testing insert in Dom": function () {
			mExpirable._insertInDom(toaster, true);
			assert.strictEqual(mExpirable.compareDocumentPosition(wrapper), 10);
			assert.isTrue(mExpirable.classList.contains(toaster.animationInitialClass));
			assert.isTrue(mExpirable._isInserted);

			mPersistent._insertInDom(toaster, true);
			assert.strictEqual(mPersistent.compareDocumentPosition(wrapper), 10);
			assert.isTrue(mPersistent.classList.contains(toaster.animationInitialClass));
			assert.isTrue(mPersistent._isInserted);
		},
		"Testing show in Dom": function () {
			mPersistent._showInDom(toaster, true);
			var d = this.async(5000);
			setTimeout(function () {
				assert.isTrue(mPersistent.classList.contains(toaster.animationEnterClass));
				d.resolve();
			}, 5); // NOTE: There is a timeout of 1ms (< 5) before toaster.animationEnterClass is set.
			return d;
		},
		"Testing hide in Dom": function () {
			mExpirable._hideInDom(toaster, true);
			assert.isTrue(mExpirable.classList.contains(toaster.animationQuitClass));

			mPersistent._hideInDom(toaster);
			assert.isTrue(mPersistent._toBeRemoved);
		},
		"Testing remove in Dom": function () {
			mExpirable._removeFromDom(toaster, true);
			assert.isTrue(mExpirable.classList.contains(toaster.animationEndClass));
			assert.isTrue(mExpirable._isRemoved);
			assert.isNull(document.getElementById(mExpirable.id));

			mPersistent._removeFromDom(toaster, true);
			assert.isTrue(mExpirable.classList.contains(toaster.animationEndClass));
			assert.isTrue(mPersistent._isRemoved);
			assert.isNull(document.getElementById(mPersistent.id));
		},
		"teardown": function () {
			container.parentNode.removeChild(container);
		}
	});
});
