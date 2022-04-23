/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"cl/conchaytoro/zpp_descomponer_mezcla/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});