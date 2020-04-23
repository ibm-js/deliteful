import register from "delite/register";
import List from "deliteful/list/List";
import { html } from "lit-html";

export default register("d-cust-category-list", [ List ], {
	renderCategory: function (item) {
		return html`
			<div role="row" class="d-list-category" >
				<div role="columnheader" class="d-list-cell" tabindex="-1">
					${item.category}
					<div class='d-spacer'></div>
					<a class='categoryLink'
						href='http://en.wikipedia.org/wiki/Special:Search?search=${item.category}&go=Go'>
							Wikipedia
					</a>
				</div>
			</div>
		`;
	},

	categoryAttr: "cat"
});
