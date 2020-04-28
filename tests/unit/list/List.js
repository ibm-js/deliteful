import List from "deliteful/list/List";
import ListBaseTests from "./resources/ListBaseTests";

var registerSuite = intern.getPlugin("interface.object").registerSuite;

registerSuite("list/List", ListBaseTests.buildSuite(List));


