define(function(){ return '\
.d-view-stack {\
  display: inline-block;\
  -webkit-box-sizing: border-box !important;\
  -moz-box-sizing: border-box !important;\
  box-sizing: border-box !important;\
  overflow-x: hidden !important;\
  overflow-y: hidden;\
  position: relative !important;\
}\
.d-view-stack > * {\
  position: absolute;\
  -webkit-box-sizing: border-box !important;\
  -moz-box-sizing: border-box !important;\
  box-sizing: border-box !important;\
  width: 100% !important;\
  height: 100% !important;\
}\
'; } );
