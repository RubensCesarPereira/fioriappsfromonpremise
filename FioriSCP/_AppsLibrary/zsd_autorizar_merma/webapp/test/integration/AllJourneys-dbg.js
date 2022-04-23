/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 HeaderMermaSet in the list
// * All 3 HeaderMermaSet have at least one MermaToPosiciones

sap.ui.require([
	"sap/ui/test/Opa5",
	"conchaytoro/cl/zsd_autorizar_merma/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"conchaytoro/cl/zsd_autorizar_merma/test/integration/pages/App",
	"conchaytoro/cl/zsd_autorizar_merma/test/integration/pages/Browser",
	"conchaytoro/cl/zsd_autorizar_merma/test/integration/pages/Master",
	"conchaytoro/cl/zsd_autorizar_merma/test/integration/pages/Detail",
	"conchaytoro/cl/zsd_autorizar_merma/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "conchaytoro.cl.zsd_autorizar_merma.view."
	});

	sap.ui.require([
		"conchaytoro/cl/zsd_autorizar_merma/test/integration/MasterJourney",
		"conchaytoro/cl/zsd_autorizar_merma/test/integration/NavigationJourney",
		"conchaytoro/cl/zsd_autorizar_merma/test/integration/NotFoundJourney",
		"conchaytoro/cl/zsd_autorizar_merma/test/integration/BusyJourney"
	], function () {
		QUnit.start();
	});
});