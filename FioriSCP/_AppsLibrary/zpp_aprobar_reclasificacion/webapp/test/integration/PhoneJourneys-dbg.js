/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

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
		"cl/conchaytoro/zpp_aprobar_reclasificacion/test/integration/NavigationJourneyPhone",
		"cl/conchaytoro/zpp_aprobar_reclasificacion/test/integration/NotFoundJourneyPhone",
		"cl/conchaytoro/zpp_aprobar_reclasificacion/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});