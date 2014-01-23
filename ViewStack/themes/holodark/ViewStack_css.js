define(function(){ return '\
.d-view-stack {\
  box-sizing: border-box !important;\
  overflow-x: hidden !important;\
  overflow-y: hidden;\
  position: relative !important;\
}\
.d-basic-layout > .d-view-stack {\
  display: block !important;\
}\
.d-view-stack > * {\
  position: absolute;\
  box-sizing: border-box !important;\
  width: 100% !important;\
  height: 100% !important;\
}\
'; } );
