define(function(){ return '\
.d-rtl .d-list-item-icon {\
  margin-right: 0px;\
  margin-left: 7px;\
}\
.d-rtl .d-list-item-right-text {\
  margin-right: 0px;\
  margin-left: 4px;\
}\
.d-rtl[aria-selectable="true"] .d-list-item::before,\
.d-rtl[aria-multiselectable="true"] .d-list-item::before {\
  margin-right: 0px;\
  margin-left: 8px;\
}\
.d-rtl[aria-selectable="true"] .d-list-item::after,\
.d-rtl[aria-multiselectable="true"] .d-list-item::after {\
  margin-left: 0px;\
  margin-right: 8px;\
}\
'; } );
