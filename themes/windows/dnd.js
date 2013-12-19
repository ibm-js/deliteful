define(function(){ return '\
.dojoDndItem {\
  padding: 2px;\
  -webkit-touch-callout: none;\
  -webkit-user-select: none;\
  border-color: rgba(0, 0, 0, 0);\
  -moz-transition-duration: 0.25s;\
  -webkit-transition-duration: 0.25s;\
  transition-duration: 0.25s;\
  -webkit-transition-property: background-color, border-color;\
  -moz-transition-property: background-color, border-color;\
  transition-property: background-color, border-color;\
}\
.dojoDndHorizontal .dojoDndItem {\
  display: inline-block;\
}\
.dojoDndItemBefore,\
.dojoDndItemAfter {\
  border: 0px solid #369;\
  border-color: #759dc0;\
}\
.dojoDndItemBefore {\
  border-width: 2px 0 0 0;\
  padding: 0 2px 2px 2px;\
}\
.dojoDndItemAfter {\
  border-width: 0 0 2px 0;\
  padding: 2px 2px 0 2px;\
}\
.dojoDndHorizontal .dojoDndItemBefore {\
  border-width: 0 0 0 2px;\
  padding: 2px 2px 2px 0;\
}\
.dojoDndHorizontal .dojoDndItemAfter {\
  border-width: 0 2px 0 0;\
  padding: 2px 0 2px 2px;\
}\
.dojoDndItemOver {\
  cursor: pointer;\
  background-color: #abd6ff;\
  background-image: -moz-linear-gradient(rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 100%);\
  background-image: -webkit-linear-gradient(rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 100%);\
  background-image: -o-linear-gradient(rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 100%);\
  background-image: linear-gradient(rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 100%);\
  padding: 1px;\
  border: solid 1px #759dc0;\
  color: #000000;\
}\
.dojoDndItemAnchor,\
.dojoDndItemSelected {\
  background-color: #cfe5fa;\
  background-image: -moz-linear-gradient(rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 100%);\
  background-image: -webkit-linear-gradient(rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 100%);\
  background-image: -o-linear-gradient(rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 100%);\
  background-image: linear-gradient(rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 100%);\
  padding: 1px;\
  border: solid 1px #759dc0;\
  color: #000000;\
}\
table.dojoDndAvatar {\
  border: 1px solid #b5bcc7;\
  border-collapse: collapse;\
  background-color: #ffffff;\
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);\
  -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);\
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);\
}\
.dojoDndAvatarHeader td {\
  height: 20px;\
  padding-left: 21px;\
}\
.dojoDndMove .dojoDndAvatarHeader,\
.dojoDndCopy .dojoDndAvatarHeader {\
  background-image: url("images/dnd.png");\
  background-repeat: no-repeat;\
  background-position: 2px -122px;\
}\
.dojoDndAvatarItem td {\
  padding: 5px;\
}\
.dojoDndMove .dojoDndAvatarHeader {\
  background-color: #f58383;\
  background-position: 2px -103px;\
}\
.dojoDndCopy .dojoDndAvatarHeader {\
  background-color: #f58383;\
  background-position: 2px -68px;\
}\
.dojoDndMove .dojoDndAvatarCanDrop .dojoDndAvatarHeader {\
  background-color: #97e68d;\
  background-position: 2px -33px;\
}\
.dojoDndCopy .dojoDndAvatarCanDrop .dojoDndAvatarHeader {\
  background-color: #97e68d;\
  background-position: 2px 2px;\
}\
'; } );
