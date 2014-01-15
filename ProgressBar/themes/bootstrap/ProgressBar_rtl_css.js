define(function(){ return '\
/*\
 * -----------------------------------------------\
 *  Theme     : bootstrap (RTL)\
 *  Widget    : deliteful/ProgressBar\
 *  baseClass : d-progress-bar\
 * -----------------------------------------------\
 */\
.d-rtl .d-progress-bar-indicator {\
  -webkit-transition: left 0.25s, width 0s;\
  transition: left 0.25s, width 0s;\
  border-right-width: 0px;\
  border-left: 1px solid #759dc0;\
}\
.d-rtl.d-progress-bar-full .d-progress-bar-indicator {\
  border-left-width: 0;\
}\
.d-rtl.d-progress-bar-indeterminate .d-progress-bar-indicator {\
  -webkit-transition: left 0s;\
  transition: left 0s;\
  -webkit-animation-direction: reverse;\
  animation-direction: reverse;\
  /* fyi: reverse has same effect as normal on android (4.2.2 GS4) */\
}\
/*\
 * -----------------------------------------------\
 *  A11Y (RTL)\
 * -----------------------------------------------\
 */\
.dj_a11y .d-rtl .d-progress-bar-indicator {\
  border-left: 2px solid;\
}\
.dj_a11y .d-rtl.d-progress-bar-full .d-progress-bar-indicator {\
  border-width: 2px;\
}\
'; } );
