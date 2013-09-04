define(function(){ return '\
.duiReveal {\
  -webkit-transition-property: none;\
  transition-property: none;\
  -webkit-transition-duration: 0s;\
  transition-duration: 0s;\
}\
.duiReveal.duiTransition {\
  -webkit-transition-property: -webkit-transform;\
  transition-property: transform;\
  -webkit-transition-duration: 0.4s;\
  transition-duration: 0.4s;\
}\
.duiReveal.duiOut {\
  -webkit-transform: translate3d(0%, 0px, 0px) !important;\
  transform: translate3d(0%, 0px, 0px) !important;\
}\
.duiReveal.duiOut.duiTransition {\
  -webkit-transform: translate3d(-100%, 0px, 0px) !important;\
  transform: translate3d(-100%, 0px, 0px) !important;\
}\
.duiReveal.duiOut.duiReverse.duiTransition {\
  -webkit-transform: translate3d(100%, 0px, 0px) !important;\
  transform: translate3d(100%, 0px, 0px) !important;\
}\
.duiReveal.duiIn {\
  z-index: -100;\
  -webkit-transform: translate3d(0%, 0px, -1px) !important;\
  transform: translate3d(0%, 0px, -1px) !important;\
}\
.duiReveal.duiIn.duiTransition {\
  -webkit-transform: translate3d(0%, 0px, 0px) !important;\
  transform: translate3d(0%, 0px, 0px) !important;\
}\
.dj_android.dj_tablet .duiReveal.duiTransition {\
  -webkit-transition-duration: 0.6s;\
  transition-duration: 0.6s;\
  -webkit-transition-timing-function: linear;\
  transition-timing-function: linear;\
}\
'; } );
