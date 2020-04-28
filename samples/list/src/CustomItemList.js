import register from "delite/register";
import ItemRenderer from "deliteful/list/ItemRenderer";
import List from "deliteful/list/List";
import template from "delite/handlebars!deliteful/samples/list/templates/CustomItemRenderer.html";

const MyCustomRenderer = register("d-cust-item", [ ItemRenderer ], {
	template: template
});

export default register("d-cust-item-list", [ List ], {
	ItemRenderer: MyCustomRenderer,
	categoryAttr: "cat",
	copyAllItemProps: true
});
