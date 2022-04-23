/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 BuscCabeceraSet in the list
// * All 3 BuscCabeceraSet have at least one OrdenToPosiciones

sap.ui.require([
	"sap/ui/test/Opa5",
	"cl/conchaytoro/zpp_aprobar_reclasificacion/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"cl/conchaytoro/zpp_aprobar_reclasificacion/test/integration/pages/App",
	"cl/conchaytoro/zpp_aprobar_reclasificacion/test/integration/pages/Browser",
	"cl/conchaytoro/zpp_aprobar_reclasificacion/test/integration/pages/Master",
	"cl/conchaytoro/zpp_aprobar_reclasificacion/test/integration/pages/Detail",
	"cl/conchaytoro/zpp_aprobar_reclasificacion/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "cl.conchaytoro.zpp_aprobar_reclasificacion.view."
	});

	sap.ui.require([
		"cl/conchaytoro/zpp_aprobar_reclasificacion/test/integration/MasterJourney",
		"cl/conchaytoro/zpp_aprobar_reclasificacion/test/integration/NavigationJourney",
		"cl/conchaytoro/zpp_aprobar_reclasificacion/test/integration/NotFoundJourney",
		"cl/conchaytoro/zpp_aprobar_reclasificacion/test/integration/BusyJourney"
	], function () {
		QUnit.start();
	});
});