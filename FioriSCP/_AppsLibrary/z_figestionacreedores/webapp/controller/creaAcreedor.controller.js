	sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/core/format/DateFormat",
		"z_figestionacreedores/view/utils/connectivity"
	], function(Controller, JSONModel, MessageToast, MessageBox,DateFormat) {
		"use strict";

		return Controller.extend("z_figestionacreedores.controller.creaAcreedor", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf romrecepcont.reporte
*/
	onInit: function() {
		var url = serviceUrl;
		var oView = this.getView();
		oView.setBusy(true);
		var selectPaises = this.getView().byId("selectPais");
		var selectPaiBank = this.getView().byId("selectPaiBank");
		var selectMonedas = this.getView().byId("selectMoneda");
		var selectSociedades = this.getView().byId("selectSociedades");
		var oModel = new sap.ui.model.odata.ODataModel(url,true);
		oModel.read("/InfoInicialSet?$filter=(Proceso eq 'C') &$expand=NAVSociedades,NAVMonedas,NAVPaises,NAVOrgCompras,NAVGrpCuentas", null, ["" ], false,
		function(data, response) {
				oView.setBusy(false);
				var result = data.results;
				
				var oModelPais = new sap.ui.model.json.JSONModel();
				var oModelPaisB = new sap.ui.model.json.JSONModel();
				var resultPaises = result[0].NAVPaises.results;
				oModelPais.setData({
					Paises : resultPaises});
				oModelPaisB.setData({
					Paises : resultPaises});
				selectPaises.setModel(oModelPais);
				selectPaiBank.setModel(oModelPaisB);
				var oModelMoneda = new sap.ui.model.json.JSONModel();
				var resultMonedas = result[0].NAVMonedas.results;
				oModelMoneda.setData({
					Monedas : resultMonedas});
				selectMonedas.setModel(oModelMoneda);
				
				var oModelSociedades = new sap.ui.model.json.JSONModel();
				var resultSociedades = result[0].NAVSociedades.results;
				oModelSociedades.setData({
					Sociedades : resultSociedades});
				selectSociedades.setModel(oModelSociedades);
				
			}, function(err) {
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
			});	
		},
		onSave:function(){
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			var oModel = new sap.ui.model.odata.ODataModel(url,true);
			var oEntry = new sap.ui.model.json.JSONModel();
				
				oEntry =
			{
				 
			    "TIPO_PROCESO" : 'C',
			    "ID_SOLICITUD" : '',
			    "LIFNR" : '',
			    "ANRED" : 'Señor',
			    "NAME1" : 'Divantech',
			    "KTOKK" : '',
			    "SORTL" : '',
			    "STRAS" : '',
			    "CITY1" : '',
			    "CITY2" : '',
			    "BLAND" : '',
			    "LAND1" : '',
			    "TELF1" : '',
			    "SMTP_ADDR" : '',
			    "SMTP_ADDR2" : '',
			    "STCD1" : '',
			    "STENR" : '',
			    "KUNNR" : '',
			    "EMNFR" : '',
			    "BANKS" : '',
			    "BANKL" : '',
			    "BANKN" : '',
			    "KOINH" : '',
			    "BUKRS" : '',
			    "HKONT" : '',
			    "IBAN" : '',
			    "FDGRV" : '',
			    "ZTERM" : '',
			    "ZWELS" : '',
			    "EKORG" : '',
			    "WAERS" : '',
			    "BUKRS_MULTI" : '',
			    "EKORG_MULTI" : ''
			  };
			
//			oModel.update("/CrearSolicitudSet", oEntry, {
//			    method: "POST",
//			    success: function(data) {
//			    	oView.setBusy(false);
//			    	console.log("OK ");
//			    },
//			    error: function(e) {
//			    	oView.setBusy(false);
//			    	console.log("NO OK ");
//			    }
//			   });
				oModel.create("/CrearSolicitudSet", oEntry, null,function(data) {
				    	oView.setBusy(false);
				    	console.log("OK ");
				    },
				    function(e) {
				    	oView.setBusy(false);
				    	console.log("NO OK ");
				    }
				   );
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
	