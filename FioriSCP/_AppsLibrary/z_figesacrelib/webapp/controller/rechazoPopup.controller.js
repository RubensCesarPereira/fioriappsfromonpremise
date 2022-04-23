sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/m/Button",
	"sap/ui/core/routing/History"
], function(Controller, Dialog, JSONModel, Device, Button, History) {
	"use strict";

	return Controller.extend("z_figesacrelib.controller.rechazoPopup", {
		
		onInit: function() {

			jQuery.sap.require("jquery.sap.storage");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var motivos = oStorage.get("motRechz");
			var filtros = oStorage.get("filtrado");
			var allFilter = new sap.ui.model.Filter(filtros);
			console.log(motivos);
			var oModelMot = new sap.ui.model.json.JSONModel();
			oModelMot.setData({
				Motivos : filtros});
			this.getView().byId("lista").setModel(oModelMot);
			oModelMot.setSizeLimit(motivos.length);
			if(filtros.length==1)
				this.getView().byId("motOtro").setVisible(true);

	},
	
	getRouter: function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},
	handleSelectChange: function(oEvent){
		jQuery.sap.require("jquery.sap.storage");
	    var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var listado = this.getView().byId("lista");
		var selecc = listado.getSelectedItem().getKey();
		oStorage.put("mot",selecc);
		console.log(oStorage.get("mot"));
		var otroMotivo = this.getView().byId("motOtro");
		if(selecc==="99"){
			otroMotivo.setEnabled(true);
//			otroMotivo.setValueState("Warning");
			otroMotivo.setValue("");
			oStorage.put("mot","");
			otroMotivo.setVisible(true);
		}else{
			otroMotivo.setEnabled(false);
			otroMotivo.setValue("");
//			oStorage.put("mot",elMotivo);
			var text = listado.getSelectedItem().getText();
			oStorage.put("mot",text);
			otroMotivo.setVisible(false);
		}
	},
	handleLiveChange: function(oEvent){
		jQuery.sap.require("jquery.sap.storage");
	    var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var otroMotivo = this.getView().byId("motOtro");
		oStorage.put("mot",otroMotivo.getValue());
		
		
	}
	});

});