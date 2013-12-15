define([
	"intern!object",
	"intern/chai!assert",
	"../register", "../Widget", "../Store",
	"dojo/store/Observable", "dojo/store/JsonRest", "dojo/store/Memory"
], function (registerSuite, assert, register, Widget, Store, Observable, JsonRest, Memory) {
	var C = register("test-store", [HTMLElement, Widget, Store]);
	registerSuite({
		name: "dui/Store",
		"Error" : function () {
			var d = this.async(2000);
			var store = new C();
			var callbackCalled = false;
			store.on("query-error", function () {
				callbackCalled = true;
			});
			store.startup();
			store.store = new JsonRest({ target: "/" });
			// we need to check before the timeout that query-error was called
			setTimeout(d.callback(function () {
				assert.ok(callbackCalled, "query-error callback");
			}), 1000);
			return d;
		},
		"Updates" : function () {
			var d = this.async(2000);
			var store = new C();
			var myData = [
				{ id: "foo", name: "Foo" },
				{ id: "bar", name: "Bar" }
			];
			store.on("query-success", d.callback(function () {
				assert.deepEqual(myData, store.items);
				myStore.put({ id: "foo", name: "Foo2" });
				// this works because put is synchronous & same for add etc...
				assert.deepEqual([
					{ id: "foo", name: "Foo2" },
					{ id: "bar", name: "Bar" }
				], store.items);
				myStore.add({ id: "fb", name: "FB" });
				assert.deepEqual([
					{ id: "foo", name: "Foo2" },
					{ id: "bar", name: "Bar" },
					{ id: "fb", name: "FB" }
				], store.items);
				myStore.remove("bar");
				assert.deepEqual([
					{ id: "foo", name: "Foo2" },
					{ id: "fb", name: "FB" }
				], store.items);
			}));
			store.startup();
			var myStore = Observable(new Memory({ data: myData }));
			store.store = myStore;
			return d;
		},
		"Destroy" : function () {
			var d = this.async(2000);
			var store = new C();
			var myData = [
				{ id: "foo", name: "Foo" },
				{ id: "bar", name: "Bar" }
			];
			store.on("query-success", d.callback(function () {
				assert.deepEqual(myData, store.items);
				// we destroy the store, we should not get any notification after that
				store.destroy();
				myStore.put({ id: "foo", name: "Foo2" });
				// this works because put is synchronous & same for add etc...
				assert.deepEqual([
					{ id: "foo", name: "Foo" },
					{ id: "bar", name: "Bar" }
				], store.items);
				myStore.add({ id: "fb", name: "FB" });
				assert.deepEqual([
					{ id: "foo", name: "Foo" },
					{ id: "bar", name: "Bar" }
				], store.items);
				myStore.remove("bar");
				assert.deepEqual([
					{ id: "foo", name: "Foo" },
					{ id: "bar", name: "Bar" }
				], store.items);
			}));
			store.startup();
			var myStore = Observable(new Memory({ data: myData }));
			store.store = myStore;
			return d;
		},
		teardown : function () {
			//container.parentNode.removeChild(container);
		}
	});
});

