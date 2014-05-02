define(function () {
	/* jshint multistr: true */
	/* jshint -W015 */
	/* jshint -W033 */
	return "\
.d-view-stack {\
  display: inline-block;\
  -webkit-box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  box-sizing: border-box;\
  overflow-x: hidden;\
  position: relative;\
}\
.d-view-stack > * {\
  -webkit-box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  box-sizing: border-box;\
  width: 100%;\
}\
.-d-view-stack-transition > * {\
  position: absolute;\
}\
.-d-view-stack-transition {\
  overflow-y: hidden;\
}";
});
