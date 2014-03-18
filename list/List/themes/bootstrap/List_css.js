define(function(){ return '\
/********************************/\
/* iOS theme for all Lists      */\
/*                              */\
/* IMPORTANT: a renderer MUST   */\
/* have the same height (inc.   */\
/* borders) whatever its index  */\
/* in the list !                */\
/********************************/\
d-list-store {\
  display: none;\
}\
.d-list-category {\
  /* Edit display at your own risk */\
  display: block;\
  position: relative;\
  margin: 0;\
  overflow: hidden;\
  font-family: Helvetica;\
  font-size: 16px;\
  font-weight: bold;\
  text-overflow: ellipsis;\
  white-space: nowrap;\
  height: 22px;\
  border-top: 1px solid #a4b0b9;\
  border-bottom: 1px solid #979da3;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#8f9ea9), to(#b7c0c7));\
  background-image: linear-gradient(to bottom, #8f9ea9 0%, #b7c0c7 100%);\
  color: white;\
  line-height: 22px;\
  text-shadow: rgba(0, 0, 0, 0.6) 0 -1px 0;\
}\
.d-list-category [role="gridcell"] {\
  padding: 0 10px;\
}\
.d-list-item {\
  overflow: hidden;\
  list-style-type: none;\
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);\
  border-bottom: 1px solid #adaaad;\
  background-color: #ffffff;\
  display: -webkit-box;\
  display: -moz-box;\
  display: -ms-flexbox;\
  display: -webkit-flex;\
  display: flex;\
  -webkit-box-align: center;\
  -ms-flex-align: center;\
  align-items: center;\
  -webkit-align-items: center;\
}\
.d-list-item [role="gridcell"] {\
  padding: 0 8px;\
}\
.d-list [role="gridcell"] {\
  -webkit-box-flex: 1;\
  -moz-box-flex: 1;\
  -webkit-flex: 1;\
  -ms-flex: 1;\
  flex: 1;\
  display: -webkit-box;\
  display: -moz-box;\
  display: -ms-flexbox;\
  display: -webkit-flex;\
  display: flex;\
  -webkit-box-align: center;\
  -ms-flex-align: center;\
  align-items: center;\
  -webkit-align-items: center;\
}\
.d-list [role="gridcell"] > .d-spacer {\
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
  font-weight: bold;\
  line-height: 43px;\
}\
.d-list-item-right-text {\
  margin-right: 4px;\
  font-weight: bold;\
  overflow: hidden;\
  white-space: nowrap;\
  text-overflow: ellipsis;\
  color: #324f85;\
  line-height: 43px;\
}\
.d-list-loader {\
  padding: 0 8px;\
  color: blue;\
  cursor: pointer;\
  height: 43px;\
  line-height: 43px;\
  background-color: #ffffff;\
  border-bottom: 1px solid #adaaad;\
}\
.d-list-loader.d-loading {\
  color: #808080;\
  cursor: wait;\
}\
.d-list-loading-panel {\
  position: absolute;\
  color: #808080;\
  font-size: xx-large;\
  font-style: italic;\
  text-align: center;\
  background-color: #c5ccd3;\
  cursor: wait;\
}\
.d-list.d-loading {\
  padding-top: 50px;\
  text-align: center;\
}\
.d-list.d-loading:after {\
  content: "Loading...";\
  font-size: large;\
  font-style: italic;\
  color: #808080;\
}\
[aria-selectable="true"] .d-list-item::before,\
[aria-multiselectable="true"] .d-list-item::before {\
  display: block;\
  content: "\\2610";\
}\
[aria-selectable="true"] .d-list-item[aria-selected="true"]::before,\
[aria-multiselectable="true"] .d-list-item[aria-selected="true"]::before {\
  content: "\\2611";\
}\
[aria-selectable="true"] .d-list-item::after,\
[aria-multiselectable="true"] .d-list-item::after {\
  display: none;\
  content: "\\2610";\
}\
[aria-selectable="true"] .d-list-item[aria-selected="true"]::after,\
[aria-multiselectable="true"] .d-list-item[aria-selected="true"]::after {\
  content: "\\2611";\
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
.d-round-rect-list > *:first-child {\
  border-top-left-radius: 8px;\
  border-top-right-radius: 8px;\
}\
.d-round-rect-list > *:last-child {\
  border-bottom-width: 0;\
  /* padding-bottom to compensate the fact that the bottom width is 0 instead of 1 */\
  padding-bottom: 1px;\
  border-bottom-left-radius: 8px;\
  border-bottom-right-radius: 8px;\
}\
/********************************/\
/* iOS theme for EdgeToEdgeList */\
/*                              */\
/* IMPORTANT: a renderer MUST       */\
/* have the same height (inc.   */\
/* borders) whatever its index  */\
/* in the list !                */\
/********************************/\
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
.d-list > *:last-child {\
  border-bottom-width: 0;\
  /* padding-bottom to compensate the fact that the bottom width is 0 instead of 1 */\
  padding-bottom: 1px;\
}\
'; } );
