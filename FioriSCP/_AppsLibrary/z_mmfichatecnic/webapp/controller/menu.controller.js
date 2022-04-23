sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/ui/model/Filter",
	"z_mmfichatecnic/view/utils/connectivity",
	"z_mmfichatecnic/js/util"
	], function(BaseController, JSONModel, MessageToast, MessageBox, Dialog, Button, Filter) {
	"use strict";

	return BaseController.extend("z_mmfichatecnic.controller.menu", {
		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("menu").attachMatched(this._onRouteFound, this);
			this.getInitInfo();
		},
		_onRouteFound: function(oEvent){
			this.getInitInfo();
		},
		pressToF:function(oEvet){
			this.getRouter().navTo("listado");
		},
		pressToP:function(oEvent){
			this.getRouter().navTo("listadoant");
		},
		pressToA:function(oEvent){
			this.getRouter().navTo("listadoadm");
		}
	});
});