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
  color: #ffffff;\
}\
.duiBackground {\
  background-color: #000000;\
}\
.duiColorBlue {\
  color: #ffffff;\
  background-color: #366edf;\
  background-image: none;\
}\
.duiColorBlue45 {\
  background-image: none;\
}\
.duiColorDefault {\
  color: #ffffff;\
  background-color: #333333;\
  background-image: none;\
}\
.duiColorDefault45 {\
  background-color: #333333;\
}\
.duiColorDefaultSel {\
  color: #ffffff;\
  background-color: #33b5e5;\
  background-image: none;\
}\
.duiColorDefaultSel45 {\
  background-color: #33b5e5;\
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
