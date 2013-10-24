define(["doh/runner", "../../register", "../../Widget", "../../mixins/StoreMap",
	"dojo/store/Observable", "dojo/store/JsonRest", "dojo/store/Memory"],
	function (doh, register, Widget, StoreMap, Observable, JsonRest, Memory) {

		/* jshint -W064 */


		doh.register("mixins.StoreMap", [
			{
				name: "Regular",
				timeout: 2000,
				runTest: function (t) {
					var C = register("test-storemap-1", [HTMLElement, Widget, StoreMap], {
						fooAttr: "name",
						barFunc: function (item) {
							return item.firstname;
						}
					});
					var d = new doh.Deferred();
					var store = new C();
					var myData = [
						{ id: "foo", name: "Foo", firstname: "1" },
						{ id: "bar", name: "Bar", firstname: "2" }
					];
					var callbackCalled = false;
					store.on("query-success", function () {
						t.assertEqual([
							{ id: "foo", foo: "Foo", bar: "1" },
							{ id: "bar", foo: "Bar", bar: "2" }
						], store.items);
						myStore.put({ id: "foo", name: "Foo2", firstname: "3" });
						// this works because put is synchronous & same for add etc...
						t.assertEqual([
							{ id: "foo", foo: "Foo2", bar: "3" },
							{ id: "bar", foo: "Bar", bar: "2" }
						], store.items);
						myStore.add({ id: "fb", name: "FB", firstname: "4" });
						t.assertEqual([
							{ id: "foo", foo: "Foo2", bar: "3" },
							{ id: "bar", foo: "Bar", bar: "2" },
							{ id: "fb", foo: "FB", bar: "4" }
						], store.items);
						myStore.remove("bar");
						t.assertEqual([
							{ id: "foo", foo: "Foo2", bar: "3" },
							{ id: "fb", foo: "FB", bar: "4" }
						], store.items);
						callbackCalled = true;
					});
					store.startup();
					var myStore = Observable(new Memory({ data: myData }));
					store.store = myStore;
					// we need to check before the timeout that refresh-complete was called
					setTimeout(d.getTestCallback(function () {
						t.t(callbackCalled, "refresh-complete callback");
					}), 1000);
					return d;
				}
			},
			{
				name: "CopyAll",
				timeout: 2000,
				runTest: function (t) {
					var C = register("test-storemap-2", [HTMLElement, Widget, StoreMap], {
						copyAllItemProps: true
					});
					var d = new doh.Deferred();
					var store = new C();
					var myData = [
						{ id: "foo", name: "Foo", firstname: "1" },
						{ id: "bar", name: "Bar", firstname: "2" }
					];
					var callbackCalled = false;
					store.on("query-success", function () {
						t.assertEqual([
							{ id: "foo", name: "Foo", firstname: "1" },
							{ id: "bar", name: "Bar", firstname: "2" }
						], store.items);
						myStore.put({ id: "foo", name: "Foo2", firstname: "3" });
						// this works because put is synchronous & same for add etc...
						t.assertEqual([
							{ id: "foo", name: "Foo2", firstname: "3" },
							{ id: "bar", name: "Bar", firstname: "2" }
						], store.items);
						myStore.add({ id: "fb", name: "FB", firstname: "4" });
						t.assertEqual([
							{ id: "foo", name: "Foo2", firstname: "3" },
							{ id: "bar", name: "Bar", firstname: "2" },
							{ id: "fb", name: "FB", firstname: "4" }
						], store.items);
						myStore.remove("bar");
						t.assertEqual([
							{ id: "foo", name: "Foo2", firstname: "3" },
							{ id: "fb", name: "FB", firstname: "4" }
						], store.items);
						callbackCalled = true;
					});
					store.startup();
					var myStore = Observable(new Memory({ data: myData }));
					store.store = myStore;
					// we need to check before the timeout that refresh-complete was called
					setTimeout(d.getTestCallback(function () {
						t.t(callbackCalled, "refresh-complete callback");
					}), 1000);
					return d;
				}
			}
		]);
	});
