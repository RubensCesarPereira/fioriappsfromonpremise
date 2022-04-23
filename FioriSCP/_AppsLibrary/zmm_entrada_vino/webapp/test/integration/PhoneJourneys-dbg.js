/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"cl/conchaytoro/zmm_entrada_vino/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"cl/conchaytoro/zmm_entrada_vino/test/integration/pages/App",
	"cl/conchaytoro/zmm_entrada_vino/test/integration/pages/Browser",
	"cl/conchaytoro/zmm_entrada_vino/test/integration/pages/Master",
	"cl/conchaytoro/zmm_entrada_vino/test/integration/pages/Detail",
	"cl/conchaytoro/zmm_entrada_vino/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "cl.conchaytoro.zmm_entrada_vino.view."
	});

	sap.ui.require([
		"cl/conchaytoro/zmm_entrada_vino/test/integration/NavigationJourneyPhone",
		"cl/conchaytoro/zmm_entrada_vino/test/integration/NotFoundJourneyPhone",
		"cl/conchaytoro/zmm_entrada_vino/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});