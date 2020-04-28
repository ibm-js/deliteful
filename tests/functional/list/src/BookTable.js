import register from "delite/register";
import ItemRenderer from "deliteful/list/ItemRenderer";
import List from "deliteful/list/List";

import bookTemplate from "delite/handlebars!deliteful/tests/functional/list/templates/BookTableRenderer.html";
import bookStoreTemplate from "delite/handlebars!deliteful/tests/functional/list/templates/BookStoreTableRenderer.html";

var BookRenderer = register("d-book-table-item", [ItemRenderer], {
	template: bookTemplate
});
var BookStoreRenderer = register("d-book-table-store", [ItemRenderer], {
	template: bookStoreTemplate
});

export default register("d-book-table", [ List ], {
	ItemRenderer: BookRenderer,

	CategoryRenderer: BookStoreRenderer,

	categoryAttr: "bookstore",

	bookstoreUrlFunc: function (item) {
		if (item.bookstore === "Amazon") {
			return "http://www.amazon.com";
		} else if (item.bookstore === "FNAC") {
			return "http://www.fnac.fr";
		}
	},

	copyAllItemProps: true,

	source: [
		{title: "Dojo: The Definitive Guide", isbn: "0596516487", bookstore: "Amazon"},
		{title: "Dojo: Using the Dojo JavaScript Library to Build Ajax Applications", isbn: "0132358042", bookstore: "Amazon"},
		{title: "Practical Dojo Projects (Expert's Voice in Web Development)", isbn: "1430210664", bookstore: "Amazon"},
		{title: "The Dojo Toolkit: Visual QuickStart Guide", isbn: "0321605128", bookstore: "FNAC"},
		{title: "Mastering Dojo: JavaScript and Ajax Tools for Great Web Experiences", isbn: "1934356115", bookstore: "FNAC"}
	]
});
