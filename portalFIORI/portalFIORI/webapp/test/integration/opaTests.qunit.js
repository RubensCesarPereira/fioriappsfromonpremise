/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/grupointelsis/portalfiori/portalFIORI/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
