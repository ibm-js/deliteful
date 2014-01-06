define(function(){ return '\
d-linear-layout.-d-linear-layout-h {\
  display: -webkit-box;\
  display: -moz-box;\
  display: -ms-flexbox;\
  display: -webkit-flex;\
  display: flex;\
}\
d-linear-layout.-d-linear-layout-v {\
  display: -webkit-box;\
  display: -moz-box;\
  display: -ms-flexbox;\
  display: -webkit-flex;\
  display: flex;\
  -webkit-flex-direction: column;\
  -ms-flex-direction: column;\
  -webkit-box-orient: vertical;\
  -moz-box-orient: vertical;\
  -ms-box-orient: vertical;\
  flex-direction: column;\
}\
.fill {\
  -webkit-box-flex: 1;\
  -moz-box-flex: 1;\
  -webkit-flex: 1;\
  -ms-flex: 1;\
  flex: 1;\
}\
.height100 {\
  height: 100%;\
}\
.width100 {\
  width: 100%;\
}\
'; } );
