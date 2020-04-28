import register from "delite/register";
import ItemRenderer from "deliteful/list/ItemRenderer";
import List from "deliteful/list/List";
import template from "delite/handlebars!deliteful/tests/functional/list/templates/ComplexRowRenderer.html";

const MyCustomItemRenderer = register("complex-row", [ ItemRenderer ], {
	template: template
});

export default register("complex-list", [ List ], {
	ItemRenderer: MyCustomItemRenderer,

	copyAllItemProps: true
});
