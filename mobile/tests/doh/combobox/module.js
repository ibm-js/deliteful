define(["doh/main", "require", "dojo/sniff"], function(doh, require, has){
	if(has("ie") >= 10){
		// ComboBox is broken on IE10 with the native WindowsPhone theme
		doh.registerUrl("dui.mobile.tests.doh.ComboBoxTests", require.toUrl("./ComboBoxTests.html?theme=iPhone"),999999);
	}else{
		doh.registerUrl("dui.mobile.tests.doh.ComboBoxTests", require.toUrl("./ComboBoxTests.html"),999999);
	}
});

