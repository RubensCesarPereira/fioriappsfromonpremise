/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 PedidoSet in the list
// * All 3 PedidoSet have at least one PedidoToPosiciones

sap.ui.require([
	"sap/ui/test/Opa5",
	"conchaytoro/cl/zsd_contabilizar_despacho/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"conchaytoro/cl/zsd_contabilizar_despacho/test/integration/pages/App",
	"conchaytoro/cl/zsd_contabilizar_despacho/test/integration/pages/Browser",
	"conchaytoro/cl/zsd_contabilizar_despacho/test/integration/pages/Master",
	"conchaytoro/cl/zsd_contabilizar_despacho/test/integration/pages/Detail",
	"conchaytoro/cl/zsd_contabilizar_despacho/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "conchaytoro.cl.zsd_contabilizar_despacho.view."
	});

	sap.ui.require([
		"conchaytoro/cl/zsd_contabilizar_despacho/test/integration/MasterJourney",
		"conchaytoro/cl/zsd_contabilizar_despacho/test/integration/NavigationJourney",
		"conchaytoro/cl/zsd_contabilizar_despacho/test/integration/NotFoundJourney",
		"conchaytoro/cl/zsd_contabilizar_despacho/test/integration/BusyJourney"
	], function () {
		QUnit.start();
	});
});