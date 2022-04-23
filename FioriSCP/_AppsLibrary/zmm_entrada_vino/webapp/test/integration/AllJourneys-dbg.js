/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 EntradaHeaderSet in the list
// * All 3 EntradaHeaderSet have at least one HeaderToItems

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
		"cl/conchaytoro/zmm_entrada_vino/test/integration/MasterJourney",
		"cl/conchaytoro/zmm_entrada_vino/test/integration/NavigationJourney",
		"cl/conchaytoro/zmm_entrada_vino/test/integration/NotFoundJourney",
		"cl/conchaytoro/zmm_entrada_vino/test/integration/BusyJourney"
	], function () {
		QUnit.start();
	});
});