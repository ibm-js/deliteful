define(function(){ return '\
.-delite-fade {\
  -moz-transition-property: none;\
  -webkit-transition-property: none;\
  transition-property: none;\
  -moz-transition-duration: 0s;\
  -webkit-transition-duration: 0s;\
  transition-duration: 0s;\
}\
.-delite-fade.-delite-transition {\
  -moz-transition-property: opacity;\
  -webkit-transition-property: opacity;\
  transition-property: opacity;\
  -moz-transition-duration: 0.6s;\
  -webkit-transition-duration: 0.6s;\
  transition-duration: 0.6s;\
}\
.-delite-fade.-delite-out {\
  opacity: 1;\
}\
.-delite-fade.-delite-out.-delite-transition {\
  -moz-transition-timing-function: ease-out;\
  -webkit-transition-timing-function: ease-out;\
  transition-timing-function: ease-out;\
  opacity: 0;\
}\
.-delite-fade.-delite-in {\
  opacity: 0;\
}\
.-delite-fade.-delite-in.-delite-transition {\
  -moz-transition-timing-function: ease-in;\
  -webkit-transition-timing-function: ease-in;\
  transition-timing-function: ease-in;\
  opacity: 1;\
}\
'; } );
