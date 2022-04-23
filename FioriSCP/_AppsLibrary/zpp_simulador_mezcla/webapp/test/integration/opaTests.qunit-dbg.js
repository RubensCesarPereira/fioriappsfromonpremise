/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"cl/conchaytoro/zpp_simulador_mezcla/zpp_simulador_mezcla/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});