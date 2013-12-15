define([
	"intern!object",
	"intern/chai!assert",
	"../register",
	"../Widget",
	"../StoreMap",
	"dojo/store/Observable",
	"dojo/store/JsonRest",
	"dojo/store/Memory"
], function (registerSuite, assert, register, Widget, StoreMap, Observable, JsonRest, Memory) {

	registerSuite({
		name: "dui/StoreMap",
		"Regular" : function () {
			var C = register("test-storemap-1", [HTMLElement, Widget, StoreMap], {
				fooAttr: "name",
				barFunc: function (item) {
					return item.firstname;
				}
			});
			var d = this.async(2000);
			var store = new C();
			var myData = [
				{ id: "foo", name: "Foo", firstname: "1" },
				{ id: "bar", name: "Bar", firstname: "2" }
			];
			store.on("query-success", d.callback(function () {
				assert.deepEqual([
					{ id: "foo", foo: "Foo", bar: "1" },
					{ id: "bar", foo: "Bar", bar: "2" }
				], store.items);
				myStore.put({ id: "foo", name: "Foo2", firstname: "3" });
				// this works because put is synchronous & same for add etc...
				assert.deepEqual([
					{ id: "foo", foo: "Foo2", bar: "3" },
					{ id: "bar", foo: "Bar", bar: "2" }
				], store.items);
				myStore.add({ id: "fb", name: "FB", firstname: "4" });
				assert.deepEqual([
					{ id: "foo", foo: "Foo2", bar: "3" },
					{ id: "bar", foo: "Bar", bar: "2" },
					{ id: "fb", foo: "FB", bar: "4" }
				], store.items);
				myStore.remove("bar");
				assert.deepEqual([
					{ id: "foo", foo: "Foo2", bar: "3" },
					{ id: "fb", foo: "FB", bar: "4" }
				], store.items);
			}));
			store.startup();
			var myStore = Observable(new Memory({ data: myData }));
			store.store = myStore;
			return d;
		},
		"copyAll" : function () {
			var C = register("test-storemap-2", [HTMLElement, Widget, StoreMap], {
				copyAllItemProps: true
			});
			var d = this.async(2000);
			var store = new C();
			var myData = [
				{ id: "foo", name: "Foo", firstname: "1" },
				{ id: "bar", name: "Bar", firstname: "2" }
			];
			store.on("query-success", d.callback(function () {
				assert.deepEqual([
					{ id: "foo", name: "Foo", firstname: "1" },
					{ id: "bar", name: "Bar", firstname: "2" }
				], store.items);
				myStore.put({ id: "foo", name: "Foo2", firstname: "3" });
				// this works because put is synchronous & same for add etc...
				assert.deepEqual([
					{ id: "foo", name: "Foo2", firstname: "3" },
					{ id: "bar", name: "Bar", firstname: "2" }
				], store.items);
				myStore.add({ id: "fb", name: "FB", firstname: "4" });
				assert.deepEqual([
					{ id: "foo", name: "Foo2", firstname: "3" },
					{ id: "bar", name: "Bar", firstname: "2" },
					{ id: "fb", name: "FB", firstname: "4" }
				], store.items);
				myStore.remove("bar");
				assert.deepEqual([
					{ id: "foo", name: "Foo2", firstname: "3" },
					{ id: "fb", name: "FB", firstname: "4" }
				], store.items);
			}));
			store.startup();
			var myStore = Observable(new Memory({ data: myData }));
			store.store = myStore;
			return d;
		},
		"InCtor" : function () {
			var C = register("test-storemap-3", [HTMLElement, Widget, StoreMap], {
			});
			var d = this.async(2000);
			var store = new C({"fooAttr": "name"});
			var myData = [
				{ id: "foo", name: "Foo", firstname: "1" },
				{ id: "bar", name: "Bar", firstname: "2" }
			];
			store.on("query-success", d.callback(function () {
				assert.deepEqual([
					{ id: "foo", foo: "Foo" },
					{ id: "bar", foo: "Bar" }
				], store.items);
				myStore.put({ id: "foo", name: "Foo2" });
				// this works because put is synchronous & same for add etc...
				assert.deepEqual([
					{ id: "foo", foo: "Foo2" },
					{ id: "bar", foo: "Bar" }
				], store.items);
				myStore.add({ id: "fb", name: "FB" });
				assert.deepEqual([
					{ id: "foo", foo: "Foo2" },
					{ id: "bar", foo: "Bar" },
					{ id: "fb", foo: "FB" }
				], store.items);
				myStore.remove("bar");
				assert.deepEqual([
					{ id: "foo", foo: "Foo2" },
					{ id: "fb", foo: "FB" }
				], store.items);
			}));
			store.startup();
			var myStore = Observable(new Memory({ data: myData }));
			store.store = myStore;
			return d;

		},
		"AllowRemap" : function () {
			var value = "1";
			var C = register("test-storemap-4", [HTMLElement, Widget, StoreMap], {
				allowRemap: true,
				fooAttr: "name",
				barFunc: function (item) {
					return item.firstname + value;
				}
			});
			var d = this.async(2000);
			var store = new C();
			var myData = [
				{ id: "foo", name: "Foo", firstname: "1" },
				{ id: "bar", name: "Bar", firstname: "2" }
			];
			store.on("query-success", d.callback(function () {
				assert.deepEqual("Foo", store.items[0].foo);
				assert.deepEqual("11", store.items[0].bar);
				myStore.put({ id: "foo", name: "Foo2", firstname: "3" });
				// this works because put is synchronous & same for add etc...
				assert.deepEqual("Foo2", store.items[0].foo);
				assert.deepEqual("31", store.items[0].bar);
				value = 2;
				assert.deepEqual("Foo2", store.items[0].foo);
				assert.deepEqual("31", store.items[0].bar);
				store.remap();
				assert.deepEqual("Foo2", store.items[0].foo);
				assert.deepEqual("32", store.items[0].bar);
			}));
			store.startup();
			var myStore = Observable(new Memory({ data: myData }));
			store.store = myStore;
			return d;

		},
		"Markup" : function () {
			register("test-storemap-5", [HTMLElement, Widget, StoreMap], {
				fooAttr: "name"
			});
			var tag = "<test-storemap-5 id='ts6' barAttr='firstname'></test-storemap-6>";
			var tagHolder = document.createElement("div");
			tagHolder.innerHTML = tag;
			register.parse(tagHolder);
			var d = this.async(2000);
			var store = tagHolder.children[0];
			var myData = [
				{ id: "foo", name: "Foo", firstname: "1" },
				{ id: "bar", name: "Bar", firstname: "2" }
			];
			store.on("query-success", d.callback(function () {
				assert.deepEqual([
					{ id: "foo", foo: "Foo", bar: "1" },
					{ id: "bar", foo: "Bar", bar: "2" }
				], store.items);
				myStore.put({ id: "foo", name: "Foo2", firstname: "3" });
				// this works because put is synchronous & same for add etc...
				assert.deepEqual([
					{ id: "foo", foo: "Foo2", bar: "3" },
					{ id: "bar", foo: "Bar", bar: "2" }
				], store.items);
				myStore.add({ id: "fb", name: "FB", firstname: "4" });
				assert.deepEqual([
					{ id: "foo", foo: "Foo2", bar: "3" },
					{ id: "bar", foo: "Bar", bar: "2" },
					{ id: "fb", foo: "FB", bar: "4" }
				], store.items);
				myStore.remove("bar");
				assert.deepEqual([
					{ id: "foo", foo: "Foo2", bar: "3" },
					{ id: "fb", foo: "FB", bar: "4" }
				], store.items);
			}));
			var myStore = Observable(new Memory({ data: myData }));
			store.store = myStore;
			return d;

		},
		teardown : function () {
			//container.parentNode.removeChild(container);
		}
	});
});

