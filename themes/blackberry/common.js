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
  font-size: 18px;\
}\
.duiBackground {\
  background-color: #dedfde;\
}\
.duiColorBlue {\
  color: #ffffff;\
  background-color: #366edf;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#7a9de9), to(#2362dd), color-stop(0.5, #366edf), color-stop(0.5, #215fdc));\
  background-image: linear-gradient(to bottom, #7a9de9 0%, #366edf 50%, #215fdc 50%, #2362dd 100%);\
}\
.duiColorBlue45 {\
  background-image: -webkit-gradient(linear, left top, right bottom, from(#7a9de9), to(#2362dd), color-stop(0.5, #366edf), color-stop(0.5, #215fdc));\
  background-image: linear-gradient(to right bottom, #7a9de9 0%, #366edf 50%, #215fdc 50%, #2362dd 100%);\
}\
.duiColorDefault {\
  color: #000000;\
  background-color: #ced3ce;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#f7fbf7), to(#cecfd6), color-stop(0.5, #ced3ce));\
  background-image: linear-gradient(to bottom, #f7fbf7 0%, #ced3ce 50%, #cecfd6 100%);\
}\
.duiColorDefault45 {\
  background-image: -webkit-gradient(linear, left top, right bottom, from(#f7fbf7), to(#cecfd6), color-stop(0.5, #ced3ce));\
  background-image: linear-gradient(to right bottom, #f7fbf7 0%, #ced3ce 50%, #cecfd6 100%);\
}\
.duiColorDefaultSel {\
  color: #ffffff;\
  background-color: #0869c6;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#088eef), to(#0851ad), color-stop(0.5, #0869c6));\
  background-image: linear-gradient(to bottom, #088eef 0%, #0869c6 50%, #0851ad 100%);\
}\
.duiColorDefaultSel45 {\
  background-image: -webkit-gradient(linear, left top, right bottom, from(#088eef), to(#0851ad), color-stop(0.5, #0869c6));\
  background-image: linear-gradient(to right bottom, #088eef 0%, #0869c6 50%, #0851ad 100%);\
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
