define(function(){ return '\
.duiFade {\
  -moz-transition-property: none;\
  -webkit-transition-property: none;\
  transition-property: none;\
  -moz-transition-duration: 0s;\
  -webkit-transition-duration: 0s;\
  transition-duration: 0s;\
}\
.duiFade.duiTransition {\
  -moz-transition-property: opacity;\
  -webkit-transition-property: opacity;\
  transition-property: opacity;\
  -moz-transition-duration: 0.6s;\
  -webkit-transition-duration: 0.6s;\
  transition-duration: 0.6s;\
}\
.duiFade.duiOut {\
  opacity: 1;\
}\
.duiFade.duiOut.duiTransition {\
  -moz-transition-timing-function: ease-out;\
  -webkit-transition-timing-function: ease-out;\
  transition-timing-function: ease-out;\
  opacity: 0;\
}\
.duiFade.duiIn {\
  opacity: 0;\
}\
.duiFade.duiIn.duiTransition {\
  -moz-transition-timing-function: ease-in;\
  -webkit-transition-timing-function: ease-in;\
  transition-timing-function: ease-in;\
  opacity: 1;\
}\
'; } );
