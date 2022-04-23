/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

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
		"conchaytoro/cl/zsd_contabilizar_despacho/test/integration/NavigationJourneyPhone",
		"conchaytoro/cl/zsd_contabilizar_despacho/test/integration/NotFoundJourneyPhone",
		"conchaytoro/cl/zsd_contabilizar_despacho/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});