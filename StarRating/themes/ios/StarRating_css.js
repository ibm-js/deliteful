define(function(){ return '\
.d-star-rating.d-star-rating-hovered {\
  opacity: 0.5;\
}\
.d-star-rating {\
  -ms-touch-action: none;\
}\
.d-star-rating-disabled .d-star-rating-star-icon:before {\
  content: url("../../images/grey-stars-40.png");\
}\
.d-star-rating-star-icon {\
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
