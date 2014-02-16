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
  border-top-right-radius: 4px;\
  border-bottom-right-radius: 4px;\
  border-top-left-radius: 0;\
  border-bottom-left-radius: 0;\
  float: right;\
  position: relative;\
}\
.d-rtl.d-progress-bar-full .d-progress-bar-indicator {\
  border-top-left-radius: 4px;\
  border-bottom-left-radius: 4px;\
}\
.d-rtl.d-progress-bar-indeterminate .d-progress-bar-indicator {\
  -webkit-animation-direction: reverse;\
  animation-direction: reverse;\
  -webkit-transition: width 0s;\
  transition: width 0s;\
  border-radius: 4px;\
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
