define(function(){ return '\
.-delite-coverv {\
  -moz-transition-property: none;\
  -webkit-transition-property: none;\
  transition-property: none;\
  -moz-transition-duration: 0s;\
  -webkit-transition-duration: 0s;\
  transition-duration: 0s;\
}\
.-delite-coverv.-delite-transition {\
  -webkit-transition-property: -webkit-transform;\
  transition-property: transform;\
  -moz-transition-duration: 0.4s;\
  -webkit-transition-duration: 0.4s;\
  transition-duration: 0.4s;\
}\
.-delite-coverv.-delite-out {\
  z-index: -100;\
  -webkit-transform: translate3d(0px, 0%, -1px) !important;\
  transform: translate3d(0px, 0%, -1px) !important;\
}\
.-delite-coverv.-delite-in {\
  -webkit-transform: translate3d(0px, 100%, 0px) !important;\
  transform: translate3d(0px, 100%, 0px) !important;\
}\
.-delite-coverv.-delite-in.-delite-reverse {\
  -webkit-transform: translate3d(0px, -100%, 0px) !important;\
  transform: translate3d(0px, -100%, 0px) !important;\
}\
.-delite-coverv.-delite-out.-delite-transition,\
.-delite-coverv.-delite-in.-delite-transition {\
  -webkit-transform: translate3d(0px, 0%, 0px) !important;\
  transform: translate3d(0px, 0%, 0px) !important;\
}\
.dj_android.dj_tablet .-delite-coverv.-delite-transition {\
  -moz-transition-duration: 0.6s;\
  -webkit-transition-duration: 0.6s;\
  transition-duration: 0.6s;\
  -moz-transition-timing-function: linear;\
  -webkit-transition-timing-function: linear;\
  transition-timing-function: linear;\
}\
'; } );
