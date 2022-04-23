/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"cl/conchaytoro/zpp_crea_reclasificacion/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"cl/conchaytoro/zpp_crea_reclasificacion/test/integration/pages/View1",
	"cl/conchaytoro/zpp_crea_reclasificacion/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "cl.conchaytoro.zpp_crea_reclasificacion.view.",
		autoWait: true
	});
});