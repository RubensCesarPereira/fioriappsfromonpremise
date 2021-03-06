sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel"
], function (Controller, History,Device,JSONModel) {
	"use strict";
	return Controller.extend("liberarPrecioExp.controller.BaseController", {

		getRouter : function () {
			return this.getOwnerComponent().getRouter();
		},

		getModel : function (sName) {
			return this.getView().getModel(sName);
		},
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},
		getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("inicio", {}, true);
			}
		},
	});

});
