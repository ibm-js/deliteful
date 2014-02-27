define(function(){ return '\
/*\
 * -----------------------------------------------\
 *  Theme     : bootstrap (RTL)\
 *  Widget    : deliteful/ProgressBar\
 *  baseClass : d-progress-bar\
 * -----------------------------------------------\
 */\
.d-rtl .d-progress-bar-indicator {\
  -webkit-transition: width 0.3s linear 0s;\
  transition: width 0.3s linear 0s;\
  float: right;\
  position: relative;\
}\
.d-rtl.d-progress-bar-indeterminate .d-progress-bar-indicator {\
  -webkit-animation-direction: reverse;\
  animation-direction: reverse;\
  -webkit-transition: width 0s;\
  transition: width 0s;\
}\
.d-rtl .d-progress-bar-msg {\
  border-right: 2px solid transparent;\
  border-left: 0;\
}\
.d-rtl .d-progress-bar-msg-invert {\
  position: absolute;\
  overflow: hidden;\
}\
'; } );
