sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/m/Button",
	"sap/ui/core/routing/History"
], function(Controller, Dialog, JSONModel, Device, Button, History) {
	"use strict";

	return Controller.extend("z_figestionacreedores.controller.subirArchivo", {
		
	onInit: function() {

		jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		console.log(oStorage.get("ID_PROCESO"));
		var id = oStorage.get("ID_PROCESO");
		this.getView().byId("UploadCollection").setUploadUrl("/FioriSCP.z_figestionacreedores/sap/opu/odata/sap/ZODATA_FI_GESTION_ACREEDORES_SRV/FileSet" +
		"(ID_PROCESO='"+id+"',TIPO_PROCESO='U',FILE_NAME='tt')");
		var opc = this.getView().byId("UploadCollection");
		var url = opc.getUploadUrl();
	},
	
	getRouter: function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},
	onEnviar:function(){
		this.getView().byId("UploadCollection").upload();
	},
	handleSelectChange: function(oEvent){
		jQuery.sap.require("jquery.sap.storage");
	    var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		
	},
	onChange: function(oEvent) {
		var oUploadCollection = oEvent.getSource();
		// Header Token
		var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
		name: "x-csrf-token",
		value: ""
		});
//		oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		//MessageToast.show("Event change triggered");
		var oCustomerHeaderToken2="";
		OData.request({

			  requestUri: "/FioriSCP.z_figestionacreedores/sap/opu/odata/sap/ZODATA_FI_GESTION_ACREEDORES_SRV/",

			  method: "GET",

			  async: false,

			  headers: {

			  "X-Requested-With": "XMLHttpRequest",

			  "Content-Type": "application/atom+xml",

			  "DataServiceVersion": "2.0",

			  "X-CSRF-Token": "Fetch"

			  }

			  }, function(data, response) {

			 var header_xcsrf_token = response.headers['x-csrf-token'];

			  oCustomerHeaderToken2 = new sap.m.UploadCollectionParameter({

			  name: "x-csrf-token",

			  value: header_xcsrf_token
			  
			  });
			  });
		oUploadCollection.addHeaderParameter(oCustomerHeaderToken2);
		
		
		},
	handleLiveChange: function(oEvent){
		jQuery.sap.require("jquery.sap.storage");
	    var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		
	}
	});

});