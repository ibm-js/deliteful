define(function () {
	/* jshint multistr: true */
	/* jshint -W015 */
	/* jshint -W033 */
	return "\
/*\
 * -----------------------------------------------\
 *  Theme     : ios (RTL)\
 *  Widget    : deliteful/ProgressBar\
 *  baseClass : d-progress-bar\
 * -----------------------------------------------\
 */\
.d-progress-bar-msg-ext::after {\
  content: attr(msg-ext);\
  float: left;\
  display: block;\
}\
.d-rtl .d-progress-bar-indicator {\
  -webkit-transition: width 0.3s linear 0s;\
  transition: width 0.3s linear 0s;\
  float: right;\
  position: relative;\
}\
.d-rtl.d-progress-bar-indeterminate .d-progress-bar-indicator {\
  position: absolute;\
  -webkit-animation-direction: reverse;\
  animation-direction: reverse;\
  /* fyi: reverse has same effect as normal on android (4.2.2 GS4) */\
}\
.d-rtl .d-progress-bar-msg-ext {\
  text-align: right;\
}";
});
