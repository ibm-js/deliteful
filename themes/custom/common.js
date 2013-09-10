define(function(){ return '\
.duiReset {\
  margin: 0;\
  border: 0;\
  padding: 0;\
  font: inherit;\
  line-height: normal;\
  color: inherit;\
}\
.dj_a11y .duiReset {\
  -moz-appearance: none;\
}\
.duiInline {\
  display: inline-block;\
  border: 0;\
  padding: 0;\
  vertical-align: middle;\
}\
table.duiInline {\
  display: inline-table;\
  box-sizing: content-box;\
  -moz-box-sizing: content-box;\
}\
.duiHidden {\
  display: none !important;\
}\
.duiVisible {\
  display: block !important;\
  position: relative;\
}\
.duiOffScreen {\
  position: absolute !important;\
  left: -10000px !important;\
  top: -10000px !important;\
}\
.duiBackgroundIframe {\
  position: absolute;\
  left: 0;\
  top: 0;\
  width: 100%;\
  height: 100%;\
  z-index: -1;\
  border: 0;\
  padding: 0;\
  margin: 0;\
}\
.duiContainer {\
  overflow: hidden;\
}\
.dj_a11y .duiIcon,\
.dj_a11y div.duiArrowButtonInner,\
.dj_a11y span.duiArrowButtonInner,\
.dj_a11y img.duiArrowButtonInner {\
  display: none;\
}\
.dj_a11y .duiA11ySideArrow {\
  display: inline !important;\
  cursor: pointer;\
}\
.duiLayoutContainer {\
  position: relative;\
  display: block;\
  overflow: hidden;\
}\
.duiAlignTop,\
.duiAlignBottom,\
.duiAlignLeft,\
.duiAlignRight {\
  position: absolute;\
  overflow: hidden;\
}\
body .duiAlignClient {\
  position: absolute;\
}\
.duiNoIcon {\
  display: none;\
}\
.duiReadOnly *,\
.duiDisabled *,\
.duiReadOnly,\
.duiDisabled {\
  cursor: default;\
}\
.dj_gecko .duiArrowButtonInner INPUT,\
.dj_gecko INPUT.duiArrowButtonInner {\
  -moz-user-focus: ignore;\
}\
html.mobile,\
.mobile body {\
  width: 100%;\
  margin: 0;\
  padding: 0;\
}\
.mobile body {\
  overflow-x: hidden;\
  -webkit-text-size-adjust: none;\
  font-family: Helvetica;\
  font-size: 17px;\
  color: #000000;\
}\
.duiBackground {\
  background-color: #c0c0c0;\
}\
.duiColorBlue {\
  color: #ffffff;\
  background-color: #048bf4;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#48adfc), to(#048bf4));\
  background-image: linear-gradient(to bottom, #48adfc 0%, #048bf4 100%);\
}\
.duiColorBlue45 {\
  background-image: -webkit-gradient(linear, left top, right bottom, from(#048bf4), to(#48adfc));\
  background-image: linear-gradient(to right bottom, #048bf4 0%, #48adfc 100%);\
}\
.duiColorDefault {\
  color: #000000;\
  background-color: #a4a4a4;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#e2e2e2), to(#a4a4a4));\
  background-image: linear-gradient(to bottom, #e2e2e2 0%, #a4a4a4 100%);\
}\
.duiColorDefault45 {\
  background-image: -webkit-gradient(linear, left top, right bottom, from(#e2e2e2), to(#a4a4a4));\
  background-image: linear-gradient(to right bottom, #e2e2e2 0%, #a4a4a4 100%);\
}\
.duiColorDefaultSel {\
  color: #ffffff;\
  background-color: #999999;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#bbbbbb), to(#999999));\
  background-image: linear-gradient(to bottom, #bbbbbb 0%, #999999 100%);\
}\
.duiColorDefaultSel45 {\
  background-image: -webkit-gradient(linear, left top, right bottom, from(#bbbbbb), to(#999999));\
  background-image: linear-gradient(to right bottom, #bbbbbb 0%, #999999 100%);\
}\
.duiSpriteIcon {\
  position: absolute;\
}\
.duiSpriteIconParent {\
  position: relative;\
  font-size: 1px;\
}\
.duiImageIcon {\
  vertical-align: top;\
}\
'; } );
