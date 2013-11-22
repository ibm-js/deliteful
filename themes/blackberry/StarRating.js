define(function(){ return '\
.duiStarRating.duiStarRatingHovered {\
  opacity: 0.5;\
}\
.duiStarRating {\
  -ms-touch-action: none;\
}\
.duiStarRating input {\
  display: none;\
}\
.duiStarRatingDisabled .duiStarRatingStarIcon {\
  background-image: url("../common/images/grey-stars-40.png");\
}\
.duiStarRatingStarIcon {\
  height: 40px;\
  width: 40px;\
  background-image: url("../common/images/yellow-stars-40.png");\
  background-repeat: no-repeat;\
}\
.duiStarRatingEmptyStar {\
  background-position: -40px 0px;\
}\
.duiStarRatingHalfStar {\
  background-position: -80px 0px;\
}\
'; } );
