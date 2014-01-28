define(function(){ return '\
.-d-view-stack-fade {\
  -moz-transition-property: none;\
  -webkit-transition-property: none;\
  transition-property: none;\
  -moz-transition-duration: 0s;\
  -webkit-transition-duration: 0s;\
  transition-duration: 0s;\
}\
.-d-view-stack-fade.-d-view-stack-transition {\
  -moz-transition-property: opacity;\
  -webkit-transition-property: opacity;\
  transition-property: opacity;\
  -moz-transition-duration: 0.6s;\
  -webkit-transition-duration: 0.6s;\
  transition-duration: 0.6s;\
}\
.-d-view-stack-fade.-d-view-stack-out {\
  opacity: 1;\
}\
.-d-view-stack-fade.-d-view-stack-out.-d-view-stack-transition {\
  -moz-transition-timing-function: ease-out;\
  -webkit-transition-timing-function: ease-out;\
  transition-timing-function: ease-out;\
  opacity: 0;\
}\
.-d-view-stack-fade.-d-view-stack-in {\
  opacity: 0;\
}\
.-d-view-stack-fade.-d-view-stack-in.-d-view-stack-transition {\
  -moz-transition-timing-function: ease-in;\
  -webkit-transition-timing-function: ease-in;\
  transition-timing-function: ease-in;\
  opacity: 1;\
}\
'; } );
