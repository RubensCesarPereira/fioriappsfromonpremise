	sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/core/format/DateFormat",
		"z_figestionacreedores/view/utils/connectivity"
	], function(Controller, JSONModel, MessageToast, MessageBox,DateFormat) {
		"use strict";

		return Controller.extend("z_figestionacreedores.controller.detalle", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf romrecepcont.reporte
*/
	onInit: function() {
		
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.getRoute("detalle").attachMatched(this._onRouteFound, this);
		
		
	},
	getRouter: function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},
	_onRouteFound: function(oEvent){
		jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
				
		var ID_PROCESO=oStorage.get("ID_PROCESO");
		this.getView().byId("ID_PROCESO").setText(ID_PROCESO);
		var TIPO_PROCESO=oStorage.get("TIPO_PROCESO");
		this.getView().byId("TIPO_PROCESO").setText(TIPO_PROCESO);
		
	},
	backPress : function (event) {
//		var context = event.getSource().getBindingContext();
//		if (!jQuery.device.is.phone){
//			this.nav.back("listadoCondiciones", context);
//		}
//		this.nav.back("master", context);
		jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		oStorage.put("reload","0");
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("listado");
	},
	_getDialog : function () {
		if (!this._oDialog) {
			this._oDialog = sap.ui.xmlfragment("z_figestionacreedores.view.detall", this);
			this.getView().addDependent(this._oDialog);
		}
		return this._oDialog;
	},
	handleOpenDialog: function () {
		this._getDialog().open();
	},
	handleOpenDialogFilter: function () {
		this._getDialog().open("filter");
	},
	handleConfirm: function (oEvent) {
		if (oEvent.getParameters().filterString) {
			MessageToast.show(oEvent.getParameters().filterString);
		}
	}
		
		/**
		* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		* (NOT before the first rendering! onInit() is used for that one!).
		* @memberOf romrecepcont.reporte
		*/
//			onBeforeRendering: function() {
		//
//			},

		/**
		* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		* This hook is the same one that SAPUI5 controls get after being rendered.
		* @memberOf romrecepcont.reporte
		*/
//			onAfterRendering: function() {
		//
//			},

		/**
		* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		* @memberOf romrecepcont.reporte
		*/
//			onExit: function() {
		//
//			}
				});
		});
	