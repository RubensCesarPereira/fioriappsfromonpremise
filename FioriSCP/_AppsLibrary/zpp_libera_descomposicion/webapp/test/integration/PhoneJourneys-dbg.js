/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"cl/conchaytoro/zpp_libera_descomposicion/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"cl/conchaytoro/zpp_libera_descomposicion/test/integration/pages/App",
	"cl/conchaytoro/zpp_libera_descomposicion/test/integration/pages/Browser",
	"cl/conchaytoro/zpp_libera_descomposicion/test/integration/pages/Master",
	"cl/conchaytoro/zpp_libera_descomposicion/test/integration/pages/Detail",
	"cl/conchaytoro/zpp_libera_descomposicion/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "cl.conchaytoro.zpp_libera_descomposicion.view."
	});

	sap.ui.require([
		"cl/conchaytoro/zpp_libera_descomposicion/test/integration/NavigationJourneyPhone",
		"cl/conchaytoro/zpp_libera_descomposicion/test/integration/NotFoundJourneyPhone",
		"cl/conchaytoro/zpp_libera_descomposicion/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});