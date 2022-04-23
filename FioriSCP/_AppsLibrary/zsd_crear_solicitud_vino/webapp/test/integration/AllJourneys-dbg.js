/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"conchaytoro/cl/zsd_crear_solicitud_vino/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"conchaytoro/cl/zsd_crear_solicitud_vino/test/integration/pages/View1",
	"conchaytoro/cl/zsd_crear_solicitud_vino/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "conchaytoro.cl.zsd_crear_solicitud_vino.view.",
		autoWait: true
	});
});