define(function(){ return '\
/*\
 * -----------------------------------------------\
 *  Theme     : blackberry (RTL)\
 *  Widget    : deliteful/ProgressBar\
 *  baseClass : d-progress-bar\
 * -----------------------------------------------\
 */\
.d-rtl .d-progress-bar-indicator {\
  -webkit-transition: left 0.25s, width 0s;\
  transition: left 0.25s, width 0s;\
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
'; } );
