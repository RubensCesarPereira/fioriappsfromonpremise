sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/m/Button",
	"sap/ui/core/routing/History"
], function(Controller, Dialog, JSONModel, Device, Button, History) {
	"use strict";

	return Controller.extend("z_figesacrelib.controller.confirmaPopup", {
		
		onInit: function() {
//			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
//			oRouter.getRoute("confirmaPopup").attachMatched(this._onObjectMatched, this);
			 jQuery.sap.require("jquery.sap.storage");
			    var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
				this.getView().byId("msj").setText("¿Confirma Liberación?");
	},
	
	getRouter: function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},
	_onObjectMatched: function(oEvent) {
	    var oArgs = oEvent.getParameter("arguments");
	    alert(oArgs);
	    jQuery.sap.require("jquery.sap.storage");
	    var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
	
		
		this.getView().byId("msj").setText("¿Confirma la Liberación.");
	    //If any values were passed in the URL then those will be available in oArgs
	    //Do other stuff here
	}
	
		/*onInit: function() {
			jQuery.sap.require("jquery.sap.storage");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var cant = oStorage.get("cant");
			this.getView().byId("msj").setText("¿Confirma la aprobación de "+cant+ " condiciones comerciales?");
			
			
		},
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		handleLiveChange: function(oEvent) {
			jQuery.sap.require("jquery.sap.storage");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var cant = oStorage.get("cant");
			this.getView().byId("msj").setText("¿Confirma la aprobación de "+cant+ " condiciones comerciales?");
		}*/

	});

});