define(function(){ return '\
/*\
 * -----------------------------------------------\
 *  Theme     : ios (RTL)\
 *  Widget    : deliteful/ProgressBar\
 *  baseClass : d-progress-bar\
 * -----------------------------------------------\
 */\
.d-rtl .d-progress-bar-indicator {\
  -webkit-transition: left 0.25s, width 0s;\
  transition: left 0.25s, width 0s;\
  border-right-width: 0px;\
}\
.d-rtl.d-progress-bar-indeterminate .d-progress-bar-indicator {\
  -webkit-transition: left 0s;\
  transition: left 0s;\
  -webkit-animation-direction: reverse;\
  animation-direction: reverse;\
  /* fyi: reverse has same effect as normal on android (4.2.2 GS4) */\
}\
.d-rtl .d-progress-bar-background {\
  border-right: 1px solid #5e6fa3;\
}\
.d-rtl.d-progress-bar-empty .d-progress-bar-background {\
  border-right: 0px;\
}\
'; } );
