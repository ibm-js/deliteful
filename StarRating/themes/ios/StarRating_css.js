define(function(){ return '\
.d-star-rating.d-star-rating-hovered {\
  opacity: 0.5;\
}\
.d-star-rating {\
  /* Do not modify the display style */\
  display: inline-block;\
}\
.d-star-rating-disabled .d-star-rating-star-icon:before {\
  content: url("../../images/grey-stars-40.png");\
}\
.d-star-rating-zero {\
  float: left;\
  overflow: hidden;\
  height: 40px;\
  width: 20px;\
}\
.d-star-rating-zero.d-hidden {\
  width: 0px;\
}\
.d-star-rating-star-icon {\
  float: left;\
  overflow: hidden;\
  height: 40px;\
  width: 40px;\
}\
.d-star-rating-star-icon:before {\
  display: inline-block;\
  content: url("../../images/yellow-stars-40.png");\
}\
.d-star-rating-empty-star:before {\
  margin-left: -40px;\
}\
.d-star-rating-half-star:before {\
  margin-left: -80px;\
}\
'; } );
