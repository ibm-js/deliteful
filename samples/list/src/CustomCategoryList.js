import register from "delite/register";
import CategoryRenderer from "deliteful/list/CategoryRenderer";
import List from "deliteful/list/List";
import template from "delite/handlebars!deliteful/samples/list/templates/CustomCategoryRenderer.html";

const MyCustomCategoryRenderer = register("d-cust-category", [ CategoryRenderer ], {
	template: template
});

export default register("d-cust-category-list", [ List ], {
	CategoryRenderer: MyCustomCategoryRenderer,
	categoryAttr: "cat"
});
