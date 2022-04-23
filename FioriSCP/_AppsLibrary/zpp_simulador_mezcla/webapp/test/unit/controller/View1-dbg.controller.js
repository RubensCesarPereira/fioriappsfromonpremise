/*global QUnit*/

sap.ui.define([
	"cl/conchaytoro/zpp_simulador_mezcla/zpp_simulador_mezcla/controller/View1.controller"
], function (Controller) {
	"use strict";

	QUnit.module("View1 Controller");

	QUnit.test("I should test the View1 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});