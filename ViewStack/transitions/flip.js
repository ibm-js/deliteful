define(function(){ return '\
.-delite-flip {\
  -moz-transition-property: none;\
  -webkit-transition-property: none;\
  transition-property: none;\
  -moz-transition-duration: 0s;\
  -webkit-transition-duration: 0s;\
  transition-duration: 0s;\
}\
.-delite-flip.-delite-transition {\
  -moz-transition-property: all;\
  -webkit-transition-property: all;\
  transition-property: all;\
  -moz-transition-duration: 0.2s;\
  -webkit-transition-duration: 0.2s;\
  transition-duration: 0.2s;\
  -moz-transition-timing-function: linear;\
  -webkit-transition-timing-function: linear;\
  transition-timing-function: linear;\
}\
.-delite-flip.-delite-out {\
  opacity: 1;\
  -webkit-transform: scale(1, 1) skew(0, 0) !important;\
  transform: scale(1, 1) skew(0, 0) !important;\
}\
.-delite-flip.-delite-out.-delite-transition {\
  opacity: 0;\
  -webkit-transform: scale(0, 0.8) skew(0, 30deg) !important;\
  transform: scale(0, 0.8) skew(0, 30deg) !important;\
}\
.-delite-flip.-delite-in {\
  opacity: 0;\
  -webkit-transform: scale(0, 0.8) skew(0, -30deg) !important;\
  transform: scale(0, 0.8) skew(0, -30deg) !important;\
}\
.-delite-flip.-delite-in.-delite-transition {\
  -webkit-transition-delay: 0.2s;\
  transition-delay: 0.2s;\
  opacity: 1;\
  -webkit-transform: scale(1, 1) skew(0, 0) !important;\
  transform: scale(1, 1) skew(0, 0) !important;\
}\
.dj_android.dj_tablet .-delite-flip.-delite-transition {\
  -moz-transition-duration: 0.4s;\
  -webkit-transition-duration: 0.4s;\
  transition-duration: 0.4s;\
}\
.dj_android.dj_tablet .-delite-flip.-delite-in.-delite-transition {\
  -webkit-transition-delay: 0.4s;\
  transition-delay: 0.4s;\
}\
'; } );
