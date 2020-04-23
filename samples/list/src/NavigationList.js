import register from "delite/register";
import List from "deliteful/list/List";
import { html } from "lit-html";

export default register("d-navigation-list", [ List ], {
	renderItem: function (item) {
		return html`
			<div role="row" .item="${item}">
				<div role="gridcell" class="d-list-cell" tabindex="-1">
					<div role='button' tabindex='0'>
					<div class='d-list-item-label'>${item.label}</div>
					<div class='d-list-item-right-icon'></div>
					</div>
				</div>
			</div>
		`;
	},

	copyAllItemProps: true
});
