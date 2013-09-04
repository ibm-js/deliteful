define(function(){ return '\
.duiSlidev {\
  -webkit-transition-property: none;\
  transition-property: none;\
  -webkit-transition-duration: 0s;\
  transition-duration: 0s;\
}\
.duiSlidev.duiTransition {\
  -webkit-transition-property: -webkit-transform;\
  transition-property: transform;\
  -webkit-transition-duration: 0.3s;\
  transition-duration: 0.3s;\
}\
.duiSlidev.duiOut.duiReverse.duiTransition,\
.duiSlidev.duiIn {\
  -webkit-transform: translate3d(0px, 100%, 0px) !important;\
  transform: translate3d(0px, 100%, 0px) !important;\
}\
.duiSlidev.duiOut.duiTransition,\
.duiSlidev.duiIn.duiReverse {\
  -webkit-transform: translate3d(0px, -100%, 0px) !important;\
  transform: translate3d(0px, -100%, 0px) !important;\
}\
.duiSlidev.duiOut,\
.duiSlidev.duiIn.duiTransition {\
  -webkit-transform: translate3d(0px, 0%, 0px) !important;\
  transform: translate3d(0px, 0%, 0px) !important;\
}\
.dj_android.dj_tablet .duiSlidev.duiTransition {\
  -webkit-transition-duration: 0.6s;\
  transition-duration: 0.6s;\
  -webkit-transition-timing-function: linear;\
  transition-timing-function: linear;\
}\
'; } );
