define([
    "intern!object",
    "intern/chai!assert",
    "dcl/dcl",
    "dui/Destroyable",
    "dojo/Stateful",
    "dojo/on"
], function (registerSuite, assert, dcl, Destroyable, Stateful, on) {
    var container, destroyable1;
    var SupportingWidget = dcl(null, {
        destroyCalls: 0,
        constructor: function (name) {
            this.name = name;
        },
        destroy: function () {
            this.destroyCalls++;
        }
    });
    var watchMe = new Stateful({
        name: "watchMe",
        x: 0
    });
    var DestroyableSubClass = dcl(Destroyable, {
        // number of times my button was clicked
        clicks: 0,

        // number of times watchMe changed value of x
        watches: 0,

        constructor: function () {
            var self = this;
            this.domNode = document.createElement("button");
            this.own(
                // setup an event handler (to be destroyed when I'm destroyed)
                on(this.domNode, "click", function () {
                    self.clicks++;
                }),

                // watch external watchMe class (to be unwatch()'d when I'm destroyed)
                watchMe.watch("x", function (name, oVal, nVal) {
                    self.watches++;
                })
            );

            // Setup two supporting widgets, to be destroyed when I'm destroyed
            this.own(this.sw1 = new SupportingWidget("sw1"));
            this.own(this.sw2 = new SupportingWidget("sw2"));
        }
    });
    registerSuite({
        name: "Destroyable tests",
        setup: function () {
            container = document.createElement("div");
            document.body.appendChild(container);
            destroyable1 = new DestroyableSubClass();
            container.appendChild(destroyable1.domNode);
        },
        "one click" : function () {
            destroyable1.domNode.click();
            assert.strictEqual(1, destroyable1.clicks);
        },
        "one watch notification" : function () {
            // make sure watch handler was setup
            watchMe.set("x", 1);
            assert.strictEqual(1, destroyable1.watches);
        },
        "destroy one of the supporting widgets" : function () {
            // manually destroy one of the supporting widgets
            destroyable1.sw1.destroy();
            assert.strictEqual(1, destroyable1.sw1.destroyCalls);

        },
        // Destroy the Destroyable instance itself.   destroyable1 should:
        // 		- destroy the sw2 supporting widget, but not try to re-destroy sw1
        //		- disconnect the watch() listener on watchMe
        //		- disconnect the click event handler on destroyable1.domNode
        "sw1 wasn't redestroyed" : function () {
            destroyable1.destroy();
            assert.strictEqual(1, destroyable1.sw1.destroyCalls);

        },
        "sw2 was destroyed" : function () {
            destroyable1.domNode.click();
            assert.strictEqual(1, destroyable1.sw2.destroyCalls);
        },
        "no new click notification" : function () {
            destroyable1.domNode.click();
            assert.strictEqual(1, destroyable1.clicks);
        },
        "no new watch notification" : function () {
            watchMe.set("x", 2);
            assert.strictEqual(1, destroyable1.watches);
        },
        teardown : function () {
            container.parentNode = null;
            // TODO: Since intern doesn't have sandboxing, need some way to clear all the registered widgets
        }
    });
});
