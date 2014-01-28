define(function(){ return '\
.-d-view-stack-flip {\
  -moz-transition-property: none;\
  -webkit-transition-property: none;\
  transition-property: none;\
  -moz-transition-duration: 0s;\
  -webkit-transition-duration: 0s;\
  transition-duration: 0s;\
}\
.-d-view-stack-flip.-d-view-stack-transition {\
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
.-d-view-stack-flip.-d-view-stack-out {\
  opacity: 1;\
  -webkit-transform: scale(1, 1) skew(0, 0) !important;\
  transform: scale(1, 1) skew(0, 0) !important;\
}\
.-d-view-stack-flip.-d-view-stack-out.-d-view-stack-transition {\
  opacity: 0;\
  -webkit-transform: scale(0, 0.8) skew(0, 30deg) !important;\
  transform: scale(0, 0.8) skew(0, 30deg) !important;\
}\
.-d-view-stack-flip.-d-view-stack-in {\
  opacity: 0;\
  -webkit-transform: scale(0, 0.8) skew(0, -30deg) !important;\
  transform: scale(0, 0.8) skew(0, -30deg) !important;\
}\
.-d-view-stack-flip.-d-view-stack-in.-d-view-stack-transition {\
  -webkit-transition-delay: 0.2s;\
  transition-delay: 0.2s;\
  opacity: 1;\
  -webkit-transform: scale(1, 1) skew(0, 0) !important;\
  transform: scale(1, 1) skew(0, 0) !important;\
}\
.dj_android.dj_tablet .-d-view-stack-flip.-d-view-stack-transition {\
  -moz-transition-duration: 0.4s;\
  -webkit-transition-duration: 0.4s;\
  transition-duration: 0.4s;\
}\
.dj_android.dj_tablet .-d-view-stack-flip.-d-view-stack-in.-d-view-stack-transition {\
  -webkit-transition-delay: 0.4s;\
  transition-delay: 0.4s;\
}\
'; } );
