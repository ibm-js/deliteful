define(function () {
	/* jshint multistr: true */
	/* jshint -W015 */
	/* jshint -W033 */
	return "\
/*\
 * -----------------------------------------------\
 *  Theme     : bootstrap\
 *  Widget    : deliteful/list/List\
 *  baseClass : d-list or d-round-rect-list\
 * -----------------------------------------------\
 */\
.d-list {\
  border: 1px solid #dddddd;\
  background-color: #ffffff;\
}\
.d-round-rect-list {\
  border: 1px solid #dddddd;\
  border-radius: 4px;\
  background-color: #ffffff;\
}\
d-list-store {\
  display: none;\
}\
.d-list-category {\
  /* No position should be defined, as the List is using offsetTop to measure distance of elements within the list */\
  /* Edit display at your own risk */\
  display: block;\
  margin: 0;\
  text-overflow: ellipsis;\
  white-space: nowrap;\
  overflow: hidden;\
  background-color: #f5f5f5;\
  color: #333333;\
  border-bottom: 1px solid #dddddd;\
}\
.d-list-category [role=\"gridcell\"] {\
  padding: 0 10px;\
}\
.d-list-category .d-list-cell {\
  height: 35px;\
}\
.d-list-item {\
  /* No position should be defined, as the List is using offsetTop to measure distance of elements within the list */\
  list-style-type: none;\
  display: -webkit-box;\
  display: -moz-box;\
  display: -ms-flexbox;\
  display: -webkit-flex;\
  display: flex;\
  -webkit-box-align: center;\
  -ms-flex-align: center;\
  align-items: center;\
  -webkit-align-items: center;\
  border-bottom: 1px solid #dddddd;\
}\
.d-list-item [role=\"gridcell\"] {\
  padding: 0px 8px;\
}\
.d-list-item .d-list-cell {\
  height: 40px;\
}\
.d-list .d-list-cell,\
.d-round-rect-list .d-list-cell {\
  display: -webkit-box;\
  display: -moz-box;\
  display: -ms-flexbox;\
  display: -webkit-flex;\
  display: flex;\
  -webkit-box-flex: 1;\
  -moz-box-flex: 1;\
  -webkit-flex: 1;\
  -ms-flex: 1;\
  flex: 1;\
  -webkit-box-align: center;\
  -ms-flex-align: center;\
  align-items: center;\
  -webkit-align-items: center;\
  outline-offset: -2px;\
}\
.d-list .d-list-cell .d-spacer,\
.d-round-rect-list .d-list-cell .d-spacer {\
  -webkit-box-flex: 1;\
  -moz-box-flex: 1;\
  -webkit-flex: 1;\
  -ms-flex: 1;\
  flex: 1;\
}\
.d-list-item-icon {\
  margin-right: 7px;\
}\
.d-list-item-label {\
  overflow: hidden;\
  white-space: nowrap;\
  text-overflow: ellipsis;\
}\
.d-list-item-right-text {\
  padding-right: 4px;\
  overflow: hidden;\
  white-space: nowrap;\
  text-overflow: ellipsis;\
}\
.d-list-loader .d-list-cell {\
  white-space: nowrap;\
  text-overflow: ellipsis;\
  overflow: hidden;\
  cursor: pointer;\
  font-weight: 500;\
  height: 38px;\
  border-bottom: 1px solid #dddddd;\
}\
.d-list-loader .d-list-cell:hover {\
  background-color: #ebebeb;\
}\
.d-list-loader [role=\"button\"] {\
  display: -webkit-box;\
  display: -moz-box;\
  display: -ms-flexbox;\
  display: -webkit-flex;\
  display: flex;\
  -webkit-box-flex: 1;\
  -moz-box-flex: 1;\
  -webkit-flex: 1;\
  -ms-flex: 1;\
  flex: 1;\
  margin: 0px 5px;\
}\
.d-list-loader [role=\"button\"] .d-progress-indicator {\
  width: 24px;\
  height: 24px;\
  vertical-align: top;\
}\
.d-list-loader [role=\"button\"] .d-progress-indicator-lines {\
  stroke: #808080;\
}\
.d-list-loader [role=\"button\"] div {\
  padding-left: 10px;\
}\
.d-list-loader.d-loading {\
  cursor: wait;\
  color: #999999;\
  font-weight: normal;\
  font-style: italic;\
}\
.d-list-loader.d-loading:hover {\
  background-color: inherit;\
}\
.d-list-loading-panel {\
  display: table;\
  position: absolute;\
  z-index: 2;\
  height: 100%;\
  width: 100%;\
  text-align: center;\
  cursor: wait;\
  color: #999999;\
  background-color: #ffffff;\
  font-style: italic;\
}\
.d-list-loading-panel-info {\
  display: table-cell;\
  vertical-align: middle;\
}\
.d-list-loading-panel-info .d-progress-indicator {\
  width: 24px;\
  height: 24px;\
  vertical-align: top;\
}\
.d-list-loading-panel-info .d-progress-indicator-lines {\
  stroke: #808080;\
}\
.d-list-loading-panel-info span {\
  vertical-align: middle;\
}\
.d-list-loading-panel-info svg {\
  vertical-align: middle;\
}\
.d-selectable .d-list-item::before,\
.d-multiselectable .d-list-item::before {\
  font-size: large;\
  padding-left: 5px;\
  display: block;\
  content: \"\\2610\";\
}\
.d-selectable .d-list-item.d-selected::before,\
.d-multiselectable .d-list-item.d-selected::before {\
  content: \"\\2611\";\
}\
.d-selectable .d-list-item::after,\
.d-multiselectable .d-list-item::after {\
  font-size: large;\
  padding-right: 5px;\
  display: none;\
  content: \"\\2610\";\
}\
.d-selectable .d-list-item.d-selected::after,\
.d-multiselectable .d-list-item.d-selected::after {\
  content: \"\\2611\";\
}\
.d-list-container {\
  position: relative;\
  height: 100%;\
}\
/*******************************/\
/* iOS theme for RoundRectList */\
/*                             */\
/* IMPORTANT: a renderer MUST      */\
/* have the same height (inc.  */\
/* borders) whatever its index */\
/* in the list !               */\
/*******************************/\
.d-round-rect-list {\
  /* edit display at your own risk */\
  display: block;\
  /* position needed for moving list items in editable mode: do not edit */\
  position: relative;\
  /* Do not change this margin setting when customizing list in the app css */\
  margin: 0 9px;\
  padding: 0;\
  overflow-x: hidden;\
}\
.d-round-rect-list > .d-list-container > *:first-child {\
  border-top-left-radius: 4px;\
  border-top-right-radius: 4px;\
}\
.d-round-rect-list > .d-list-container > *:last-child {\
  border-bottom-width: 0;\
  /* padding-bottom to compensate the fact that the bottom width is 0 instead of 1 */\
  padding-bottom: 1px;\
  border-bottom-left-radius: 4px;\
  border-bottom-right-radius: 4px;\
}\
.d-list {\
  /* edit display at your own risk */\
  display: block;\
  /* position needed for moving list items in editable mode: do not edit */\
  position: relative;\
  padding: 0;\
  /* Do not change this margin setting when customizing list in the app css*/\
  margin: 0;\
  overflow-x: hidden;\
}\
.d-list > .d-list-container > *:last-child {\
  border-bottom-width: 0;\
  /* padding-bottom to compensate the fact that the bottom width is 0 instead of 1 */\
  padding-bottom: 1px;\
}";
});
