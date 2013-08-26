define(["doh/main", "require", "dojo/sniff"], function(doh, require){

	doh.registerUrl("dojox.mobile.tests.doh.FixedBars", require.toUrl("./CustomFixedBarsTests.html"),999999);
	doh.registerUrl("dojox.mobile.tests.doh.FixedBars", require.toUrl("./DeclaredFixedFooterTests.html"),999999);
});



