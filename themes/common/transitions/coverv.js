define(function(){ return '\
.duiCoverv {\
  -webkit-transition-property: none;\
  transition-property: none;\
  -webkit-transition-duration: 0s;\
  transition-duration: 0s;\
}\
.duiCoverv.duiTransition {\
  -webkit-transition-property: -webkit-transform;\
  transition-property: transform;\
  -webkit-transition-duration: 0.4s;\
  transition-duration: 0.4s;\
}\
.duiCoverv.duiOut {\
  z-index: -100;\
  -webkit-transform: translate3d(0px, 0%, -1px) !important;\
  transform: translate3d(0px, 0%, -1px) !important;\
}\
.duiCoverv.duiIn {\
  -webkit-transform: translate3d(0px, 100%, 0px) !important;\
  transform: translate3d(0px, 100%, 0px) !important;\
}\
.duiCoverv.duiIn.duiReverse {\
  -webkit-transform: translate3d(0px, -100%, 0px) !important;\
  transform: translate3d(0px, -100%, 0px) !important;\
}\
.duiCoverv.duiOut.duiTransition,\
.duiCoverv.duiIn.duiTransition {\
  -webkit-transform: translate3d(0px, 0%, 0px) !important;\
  transform: translate3d(0px, 0%, 0px) !important;\
}\
.dj_android.dj_tablet .duiCoverv.duiTransition {\
  -webkit-transition-duration: 0.6s;\
  transition-duration: 0.6s;\
  -webkit-transition-timing-function: linear;\
  transition-timing-function: linear;\
}\
'; } );
