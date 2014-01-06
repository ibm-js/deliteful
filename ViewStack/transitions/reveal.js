define(function(){ return '\
.-delite-reveal {\
  -moz-transition-property: none;\
  -webkit-transition-property: none;\
  transition-property: none;\
  -moz-transition-duration: 0s;\
  -webkit-transition-duration: 0s;\
  transition-duration: 0s;\
}\
.-delite-reveal.-delite-transition {\
  -webkit-transition-property: -webkit-transform;\
  transition-property: transform;\
  -moz-transition-duration: 0.4s;\
  -webkit-transition-duration: 0.4s;\
  transition-duration: 0.4s;\
}\
.-delite-reveal.-delite-out {\
  -webkit-transform: translate3d(0%, 0px, 0px) !important;\
  transform: translate3d(0%, 0px, 0px) !important;\
}\
.-delite-reveal.-delite-out.-delite-transition {\
  -webkit-transform: translate3d(-100%, 0px, 0px) !important;\
  transform: translate3d(-100%, 0px, 0px) !important;\
}\
.-delite-reveal.-delite-out.-delite-reverse.-delite-transition {\
  -webkit-transform: translate3d(100%, 0px, 0px) !important;\
  transform: translate3d(100%, 0px, 0px) !important;\
}\
.-delite-reveal.-delite-in {\
  z-index: -100;\
  -webkit-transform: translate3d(0%, 0px, -1px) !important;\
  transform: translate3d(0%, 0px, -1px) !important;\
}\
.-delite-reveal.-delite-in.-delite-transition {\
  -webkit-transform: translate3d(0%, 0px, 0px) !important;\
  transform: translate3d(0%, 0px, 0px) !important;\
}\
.dj_android.dj_tablet .-delite-reveal.-delite-transition {\
  -moz-transition-duration: 0.6s;\
  -webkit-transition-duration: 0.6s;\
  transition-duration: 0.6s;\
  -moz-transition-timing-function: linear;\
  -webkit-transition-timing-function: linear;\
  transition-timing-function: linear;\
}\
'; } );
