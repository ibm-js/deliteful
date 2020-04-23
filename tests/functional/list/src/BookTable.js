import register from "delite/register";
import { html } from "lit-html";
import List from "deliteful/list/List";

export default register("d-book-table", [ List ], {
	renderItem: function (item) {
		return html`
			<div role="row" class="d-list-item">
				<div role="gridcell" class="d-list-cell" tabindex="-1">${item.title}</div>
				<div role="gridcell" class="d-list-cell" tabindex="-1">ISBN: ${item.isbn}</div>
			</div>
		`;
	},

	renderCategory: function (item) {
		return html`
			<div role="row" class="d-list-item">
				<div role="columnheader" class="d-list-cell" tabindex="-1">${item.category}</div>
				<div role="columnheader" class="d-list-cell d-list-control-cell" tabindex="-1">
					<a tabindex="-1" href="${item.bookstoreUrl}">${item.bookstoreUrl}</a>
				</div>
			</div>
		`;
	},

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
