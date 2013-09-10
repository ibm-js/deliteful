define(function(){ return '\
.duiToolBarButtonHasArrow-styles {\
  width: 27px;\
  height: 27px;\
  border-radius: 20px;\
  border: 2px solid #ffffff;\
  padding: 0px;\
  margin: 0px;\
  margin-top: 8px;\
  margin-bottom: 8px;\
  background-image: url("images/dark/back.png");\
  background-position: 50% 50%;\
  background-size: 27px 27px;\
  background-repeat: no-repeat;\
}\
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
.duiPopup {\
  position: absolute;\
  background-color: transparent;\
  margin: 0;\
  border: 0;\
  padding: 0;\
  -webkit-overflow-scrolling: touch;\
  -webkit-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.25);\
  -moz-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.25);\
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.25);\
}\
.duiTooltipDialogPopup {\
  -webkit-box-shadow: none;\
  -moz-box-shadow: none;\
  box-shadow: none;\
}\
.duiComboBoxHighlightMatch {\
  background-color: #abd6ff;\
}\
.duiFocusedLabel {\
  outline: 1px dotted #494949;\
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
  background-color: #000000;\
  font-family: "Segoe WP", "Segoe UI", "HelveticaNeue", "Helvetica-Neue", "Helvetica", "BBAlpha Sans", "sans-serif";\
  font-size: 9pt;\
  color: #ffffff;\
  padding: 8px 0 8px 0;\
}\
.duiBackground {\
  background-color: #000000;\
}\
.duiColorBlue {\
  color: #ffffff;\
  background-color: #2362dd;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#7a9de9), to(#2362dd));\
  background-image: linear-gradient(to bottom, #7a9de9 0%, #2362dd 100%);\
}\
.duiColorBlue45 {\
  background-image: -webkit-gradient(linear, left top, right bottom, from(#7a9de9), to(#2362dd));\
  background-image: linear-gradient(to right bottom, #7a9de9 0%, #2362dd 100%);\
}\
.duiColorDefault {\
  color: #ffffff;\
  background-color: transparent;\
  background-image: none;\
}\
.duiColorDefault45 {\
  background-image: -webkit-gradient(linear, left top, right bottom, from(#e2e2e2), to(#a4a4a4));\
  background-image: linear-gradient(to right bottom, #e2e2e2 0%, #a4a4a4 100%);\
}\
.duiColorDefaultSel {\
  color: #ffffff;\
  background-color: Highlight;\
}\
.duiColorDefaultSel45 {\
  background-image: -webkit-gradient(linear, left top, right bottom, from(#bbbbbb), to(#666666));\
  background-image: linear-gradient(to right bottom, #bbbbbb 0%, #666666 100%);\
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
