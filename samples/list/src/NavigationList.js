import register from "delite/register";
import ItemRenderer from "deliteful/list/ItemRenderer";
import List from "deliteful/list/List";
import template from "delite/handlebars!deliteful/samples/list/templates/NavigationItemRenderer.html";
// Custom item renderer that renders a navigation button
const NavigationItemRenderer = register("d-navigation-item", [ ItemRenderer ], {
	template: template
});

export default register("d-navigation-list", [ List ], {
	ItemRenderer: NavigationItemRenderer,
	copyAllItemProps: true
});
