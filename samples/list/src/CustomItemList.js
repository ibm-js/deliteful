import register from "delite/register";
import List from "deliteful/list/List";
import { html } from "lit-html";

export default register("d-cust-item-list", [ List ], {
	renderItem: function (item) {
		return html`
			<div role="row" class="d-list-item">
				<div role="gridcell" class="d-list-cell" tabindex="-1">
				<div tabindex='0'>${item.title}</div>
				<div class='d-spacer'></div>
				<div tabindex='0'>ISBN: ${item.isbn}</div>
				</div>
			</div>
		`;
	},
	copyAllItemProps: true
});
