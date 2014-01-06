define(function(){ return '\
.-delite-slidev {\
  -moz-transition-property: none;\
  -webkit-transition-property: none;\
  transition-property: none;\
  -moz-transition-duration: 0s;\
  -webkit-transition-duration: 0s;\
  transition-duration: 0s;\
}\
.-delite-slidev.-delite-transition {\
  -webkit-transition-property: -webkit-transform;\
  transition-property: transform;\
  -moz-transition-duration: 0.3s;\
  -webkit-transition-duration: 0.3s;\
  transition-duration: 0.3s;\
}\
.-delite-slidev.-delite-out.-delite-reverse.-delite-transition,\
.-delite-slidev.-delite-in {\
  -webkit-transform: translate3d(0px, 100%, 0px) !important;\
  transform: translate3d(0px, 100%, 0px) !important;\
}\
.-delite-slidev.-delite-out.-delite-transition,\
.-delite-slidev.-delite-in.-delite-reverse {\
  -webkit-transform: translate3d(0px, -100%, 0px) !important;\
  transform: translate3d(0px, -100%, 0px) !important;\
}\
.-delite-slidev.-delite-out,\
.-delite-slidev.-delite-in.-delite-transition {\
  -webkit-transform: translate3d(0px, 0%, 0px) !important;\
  transform: translate3d(0px, 0%, 0px) !important;\
}\
.dj_android.dj_tablet .-delite-slidev.-delite-transition {\
  -moz-transition-duration: 0.6s;\
  -webkit-transition-duration: 0.6s;\
  transition-duration: 0.6s;\
  -moz-transition-timing-function: linear;\
  -webkit-transition-timing-function: linear;\
  transition-timing-function: linear;\
}\
'; } );
