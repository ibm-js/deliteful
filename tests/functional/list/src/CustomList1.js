import register from "delite/register";
import ItemRenderer from "deliteful/list/ItemRenderer";
import List from "deliteful/list/List";
import template from "delite/handlebars!deliteful/tests/functional/list/templates/CustomItemRenderer1.html";

// Custom item renderer with custom keyboard navigation order
const MyCustomItemRenderer = register("d-custom-nav-item", [ ItemRenderer ], {
	template: template
});

export default register("d-custom-nav", [ List ], {
	ItemRenderer: MyCustomItemRenderer
});
