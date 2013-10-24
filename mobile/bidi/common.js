define(["../../Bidi"], function(){

	// module:
	//		dui/mobile/bidi/common

	// TODO: I don't see the point of this module, seems like dui/Bidi is sufficient.

	var common = {
		// summary:
		//		Module contains functions to support text direction, that can be set independent to GUI direction.
		// description:
		//		Unicode control characters (UCC) used to control text direction.			

		enforceTextDirWithUcc: function(text, textDir){
			// summary:
			//		Wraps by UCC (Unicode control characters) displayed text according to textDir.
			// text:
			//		The text to be wrapped.
			// textDir:
			//		Text direction.
			// description:
			//		There's a dir problem with some HTML elements. For some Android browsers Hebrew text is displayed right to left also
			//		when dir is set to LTR.
			//		Therefore the only solution is to use UCC to display the text in correct orientation.
			if(textDir){
				textDir = (textDir === "auto") ? Bidi._checkContextual(text) : textDir;
				return ((textDir === "rtl") ? common.MARK.RLE : common.MARK.LRE) + text + common.MARK.PDF;
			}
			return text;
		},

		removeUCCFromText: function(text){
			// summary:
			//		Removes UCC from input string.
			// text:
			//		The text to be stripped from UCC.
			if (!text){
				return text;
			}
			return text.replace(/\u202A|\u202B|\u202C/g,"");
		},

		setTextDirForButtons: function(widget){
			// summary:
			//		Sets textDir property to children.
			// widget:
			//		parent widget
			var children = widget.getChildren();
			if (children && widget.textDir){
				children.forEach(function(ch){
					ch.set("textDir", widget.textDir);
				}, widget);
			}
		},

		// UCC - constants that will be used by bidi support.
		MARK: {
			LRE : '\u202A',
			RLE : '\u202B',
			PDF : '\u202C'
		}
	};

	return common;
});
