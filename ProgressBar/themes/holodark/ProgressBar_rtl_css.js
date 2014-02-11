define(function(){ return '\
/*\
 * -----------------------------------------------\
 *  Theme     : holodark (RTL)\
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
  position: absolute;\
  -webkit-animation-direction: reverse;\
  animation-direction: reverse;\
  /* fyi: reverse has same effect as normal on android (4.2.2 GS4) */\
}\
.d-rtl .d-progress-bar-label-ext {\
  text-align: right;\
}\
.d-rtl .d-progress-bar-label-ext::after {\
  content: attr(label-ext);\
  float: left;\
}\
'; } );
