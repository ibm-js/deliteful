define(function () {
	/* jshint multistr: true */
	/* jshint -W015 */
	/* jshint -W033 */
	return "\
/* For now, reuse the bootstrap less variables and functions*/\
/* Wrapping the select in a span avoids rounding the select element itself,\
  thus avoids a different rendering on FF and IE than in Chrome on desktop. */\
.d-select {\
  /* Do not hardcode a height because this would misbehave multi-select */\
  display: inline-block;\
  vertical-align: middle;\
  margin: 0;\
  padding: 0;\
  overflow: hidden;\
  /* clip for the rounding */\
  border: 1px solid #cccccc;\
  border-radius: 4px;\
  color: #555555;\
  font-size: 14px;\
  line-height: 1.428571429;\
}\
.d-select-inner {\
  height: inherit;\
  color: inherit;\
  font-family: inherit;\
  font-size: inherit;\
  line-height: inherit;\
  padding: 6px 12px;\
  margin: -1px;\
  /* to compensate the border on d-select */\
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\
  -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\
}\
.d-select-inner[disabled],\
fieldset[disabled] .d-select-inner {\
  opacity: 0.5;\
}\
.d-select-focus {\
  outline: thin dotted;\
  outline: 5px auto -webkit-focus-ring-color;\
  outline-offset: -2px;\
  /* defined in delite/themes/bootstrap/common.less */\
}";
});
