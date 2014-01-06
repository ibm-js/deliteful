define(function(){ return '\
.-delite-slide {\
  -moz-transition-property: none;\
  -webkit-transition-property: none;\
  transition-property: none;\
  -moz-transition-duration: 0s;\
  -webkit-transition-duration: 0s;\
  transition-duration: 0s;\
}\
.-delite-slide.-delite-transition {\
  -webkit-transition-property: -webkit-transform;\
  transition-property: transform;\
  -moz-transition-duration: 0.3s;\
  -webkit-transition-duration: 0.3s;\
  transition-duration: 0.3s;\
}\
.-delite-slide.-delite-out.-delite-reverse.-delite-transition,\
.-delite-slide.-delite-in {\
  -webkit-transform: translate3d(100%, 0px, 0px) !important;\
  transform: translate3d(100%, 0px, 0px) !important;\
}\
.-delite-slide.-delite-out.-delite-transition,\
.-delite-slide.-delite-in.-delite-reverse {\
  -webkit-transform: translate3d(-100%, 0px, 0px) !important;\
  transform: translate3d(-100%, 0px, 0px) !important;\
}\
.-delite-slide.-delite-out,\
.-delite-slide.-delite-in.-delite-transition {\
  -webkit-transform: translate3d(0%, 0px, 0px) !important;\
  transform: translate3d(0%, 0px, 0px) !important;\
}\
.dj_android.dj_tablet .-delite-slide.-delite-transition {\
  -moz-transition-duration: 0.6s;\
  -webkit-transition-duration: 0.6s;\
  transition-duration: 0.6s;\
  -moz-transition-timing-function: linear;\
  -webkit-transition-timing-function: linear;\
  transition-timing-function: linear;\
}\
'; } );
