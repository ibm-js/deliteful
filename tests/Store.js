define(["doh/runner", "../register", "../Widget", "../Store",
	"dojo/store/Observable", "dojo/store/JsonRest", "dojo/store/Memory"],
	function (doh, register, Widget, Store, Observable, JsonRest, Memory) {

		var C = register("test-store", [HTMLElement, Widget, Store]);

		/* jshint -W064 */

		doh.register("Store", [
			{
				timeout: 2000,
				name: "Error",
				runTest: function (t) {
					var d = new doh.Deferred();
					var store = new C();
					var callbackCalled = false;
					store.on("query-error", function () {
						callbackCalled = true;
					});
					store.startup();
					store.store = new JsonRest({ target: "/" });
					// we need to check before the timeout that query-error was called
					setTimeout(d.getTestCallback(function () {
						t.t(callbackCalled, "query-error callback");
					}), 1000);
					return d;
				}
			},

			{
				name: "Updates",
				timeout: 2000,
				runTest: function (t) {
					var d = new doh.Deferred();
					var store = new C();
					var myData = [
						{ id: "foo", name: "Foo" },
						{ id: "bar", name: "Bar" }
					];
					store.on("query-success", d.getTestCallback(function () {
						t.assertEqual(myData, store.items);
						myStore.put({ id: "foo", name: "Foo2" });
						// this works because put is synchronous & same for add etc...
						t.assertEqual([
							{ id: "foo", name: "Foo2" },
							{ id: "bar", name: "Bar" }
						], store.items);
						myStore.add({ id: "fb", name: "FB" });
						t.assertEqual([
							{ id: "foo", name: "Foo2" },
							{ id: "bar", name: "Bar" },
							{ id: "fb", name: "FB" }
						], store.items);
						myStore.remove("bar");
						t.assertEqual([
							{ id: "foo", name: "Foo2" },
							{ id: "fb", name: "FB" }
						], store.items);
					}));
					store.startup();
					var myStore = Observable(new Memory({ data: myData }));
					store.store = myStore;
					return d;
				}
			},
			{
				name: "Destroy",
				timeout: 2000,
				runTest: function (t) {
					var d = new doh.Deferred();
					var store = new C();
					var myData = [
						{ id: "foo", name: "Foo" },
						{ id: "bar", name: "Bar" }
					];
					store.on("query-success", d.getTestCallback(function () {
						t.assertEqual(myData, store.items);
						// we destroy the store, we should not get any notification after that
						store.destroy();
						myStore.put({ id: "foo", name: "Foo2" });
						// this works because put is synchronous & same for add etc...
						t.assertEqual([
							{ id: "foo", name: "Foo" },
							{ id: "bar", name: "Bar" }
						], store.items);
						myStore.add({ id: "fb", name: "FB" });
						t.assertEqual([
							{ id: "foo", name: "Foo" },
							{ id: "bar", name: "Bar" }
						], store.items);
						myStore.remove("bar");
						t.assertEqual([
							{ id: "foo", name: "Foo" },
							{ id: "bar", name: "Bar" }
						], store.items);
					}));
					store.startup();
					var myStore = Observable(new Memory({ data: myData }));
					store.store = myStore;
					return d;
				}
			}
		]);
	});
