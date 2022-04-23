	sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/core/format/DateFormat",
		"z_figestionacreedores/view/utils/connectivity"
	], function(Controller, JSONModel, MessageToast, MessageBox,DateFormat) {
		"use strict";

		return Controller.extend("z_figestionacreedores.controller.menu", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf romrecepcont.reporte
*/
	onInit: function() {
		
		var url = serviceUrl;
		var oView = this.getView();
		var that = this;
		oView.setBusy(true);
		var selectPaises = this.getView().byId("selectPais");
		var selectPaiBank = this.getView().byId("selectPaiBank");
		var selectMonedas = this.getView().byId("selectMoneda");
		var selectSociedades = this.getView().byId("selectSociedades");
		var selectGrpCta = this.getView().byId("selectGrpCta");
		var selectCondPagoS = this.getView().byId("selectCondPagoS");
		var selectCondPagoC = this.getView().byId("selectCondPagoC");
		var selectRegion = this.getView().byId("selectRegion");
		var selectGrpComp = this.getView().byId("selectGrpComp");
		oView.byId("btnGuarda").setEnabled(false);
		var oModel = new sap.ui.model.odata.ODataModel(url,true);
		oModel.read("/InfoInicialSet?$filter=(Proceso eq 'C') " +
				"&$expand=NAVSociedades,NAVMonedas,NAVPaises," +
				"NAVOrgCompras,NAVGrpCuentas,NAVCondPago," +
				"NAVPaisesRegiones", 
				null, ["" ], false,
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
				jQuery.sap.require("jquery.sap.storage");
				
				var oModelPR = new sap.ui.model.json.JSONModel();
				var resultPR = result[0].NAVPaisesRegiones.results;
				oModelPR.setData({
					Regiones : resultPR});
				selectRegion.setModel(oModelPR);
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
				oStorage.put("PaisesRegiones",resultPR);
				
				var oModelMoneda = new sap.ui.model.json.JSONModel();
				var resultMonedas = result[0].NAVMonedas.results;
//				oModelMoneda.setData({
//					Monedas : resultMonedas});
//				selectMonedas.setModel(oModelMoneda);
				console.log(resultMonedas.length);
				console.log(resultMonedas[101].WAERS_DESC);
				//Estructura Monedas cortada 0-99;100-199;...
				var monedas=[];
				for(var i=0; i<resultMonedas.length; i++){
					var obj={"WAERS":resultMonedas[i].WAERS,"WAERS_DESC":resultMonedas[i].WAERS_DESC};
					monedas.push(obj);
				}
				var data = {
					'Monedas': monedas};
				oModelMoneda.setData(data);
				oModelMoneda.setSizeLimit(resultMonedas.length);
				selectMonedas.setModel(oModelMoneda);
				
				var oModelSociedades = new sap.ui.model.json.JSONModel();
				var resultSociedades = result[0].NAVSociedades.results;
				oModelSociedades.setData({
					Sociedades : resultSociedades});
				selectSociedades.setModel(oModelSociedades);
				
				
				var oModelGrpCta = new sap.ui.model.json.JSONModel();
				var resultGrpCta = result[0].NAVGrpCuentas.results;
				oModelGrpCta.setData({
					GrpCta : resultGrpCta});
				selectGrpCta.setModel(oModelGrpCta,"GrpCta");
				
				var oModelCondPago = new sap.ui.model.json.JSONModel();
				var resultCondPago = result[0].NAVCondPago.results;
				oModelCondPago.setData({
					CondPago : resultCondPago});
				selectCondPagoS.setModel(oModelCondPago);
				selectCondPagoC.setModel(oModelCondPago);
				
				var oModelGrpComp = new sap.ui.model.json.JSONModel();
				var resultGrpComp = result[0].NAVOrgCompras.results;
				oModelGrpComp.setData({
					GrpComp : resultGrpComp});
				selectGrpComp.setModel(oModelGrpComp);
				
				oView.byId("selectPais").setSelectedKey("CL");//Region
				that.onChangePais();
				oView.byId("selectMoneda").setSelectedKey("CLP");//condicion de pago
				oView.byId("selectPaiBank").setSelectedKey("CL");//pais banco
				
			}, function(err) {
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
			});	
		},
		onSave:function(){
			var that = this;
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			var oModel = new sap.ui.model.odata.ODataModel(url,true);
			var oEntry = new sap.ui.model.json.JSONModel();
			var anred = oView.byId("selectTrat").getSelectedKey();//tratamiento
			var name1 = oView.byId("name1").getValue();//nombre acreedor
			var ktokk = oView.byId("selectGrpCta").getSelectedKey();//grupo acreedor
			var sort = oView.byId("concep").getValue();//Concepto
			var stras = oView.byId("direc").getValue();//Direccion calle num
			var ciuda = oView.byId("txtCiudad").getValue();//ciudad
			var comun = oView.byId("txtComuna").getValue();//comuna
			var regio = oView.byId("selectRegion").getSelectedKey();//Region
			var land1 = oView.byId("selectPais").getSelectedKey();//Region
			var telf = oView.byId("telf").getValue();//Telefono
			var email1 = oView.byId("email1").getValue();//email
			var email2 = oView.byId("email2").getValue();//email cobranza
			var stcd1 = oView.byId("stcd1").getValue();//rut 
			var nif = oView.byId("nif").getValue();//nif
			var kunnr = oView.byId("kunnr").getValue();//deudor
			var emnfr = oView.byId("emnfr").getValue();//fab externo
			var banks = oView.byId("selectPaiBank").getSelectedKey();//pais banco
			var bankn = oView.byId("cta").getValue();//cta banco
			var koinh = oView.byId("titcta").getValue();//titular cta banco
			var bukrs = [];
			bukrs = oView.byId("selectSociedades").getSelectedKeys();//sociedades
			var iban = oView.byId("iban").getValue();//iban
			var zterm = oView.byId("selectCondPagoC").getSelectedKey();//condicion de pago
			var waers = oView.byId("selectMoneda").getSelectedKey();//condicion de pago
			var ekorg = [];
			ekorg = oView.byId("selectGrpComp").getSelectedKeys();//org compras
			var bukrs_single=bukrs.join('-');
			var bukrs_multi=bukrs.join('-');
			if(bukrs.lenght==1){
				bukrs_multi='';
			}else{
				bukrs_single='';
			}
			var ekorg_single=ekorg.join('-');
			var ekorg_multi=ekorg.join('-');
			if(ekorg.lenght==1){
				ekorg_multi='';
			}else{
				ekorg_single='';
			}
			oEntry =
			{
			    "TIPO_PROCESO" : 'C',
			    "ID_SOLICITUD" : '',
			    "LIFNR" : '',
			    "ANRED" : anred,
			    "NAME1" : name1,
			    "KTOKK" : ktokk,
			    "SORTL" : sort,
			    "STRAS" : stras,
			    "CITY1" : ciuda,
			    "CITY2" : comun,
			    "REGIO" : regio,
			    "LAND1" : land1,
			    "TELF1" : telf,
			    "SMTP_ADDR" : email1,
			    "SMTP_ADDR2" : email2,
			    
			    "STCD1" : stcd1,
			    "STENR" : nif,
			    "KUNNR" : kunnr,
			    "EMNFR" : emnfr,
			    "BANKS" : banks,
			    "BANKL" : '',
			    "BANKN" : bankn,
			    "KOINH" : koinh,
			    "BUKRS" : bukrs_single,
			    "HKONT" : '',
			    "IBAN" : iban,
			    "FDGRV" : '',
			    "ZTERM" : zterm,
			    "ZWELS" : '',
			    "EKORG" : ekorg_single,
			    "WAERS" : waers,
			    "BUKRS_MULTI" : bukrs_multi,
			    "EKORG_MULTI" : ekorg_multi
			  };
			/*oEntry =
			{
			    "TIPO_PROCESO" : 'C',
			    "ID_SOLICITUD" : '',
			    "LIFNR" : '',//???????????????????????
			    "ANRED" : anred,
			    "NAME1" : name,
			    "KTOKK" : ktokk,
			    "SORTL" : sort,
			    "STRAS" : stras,
			    "CITY1" : '',//no viene ciudad
			    "CITY2" : '',//no viene comuna
			    "BLAND" : '',//???????????????????
			    "LAND1" : land1,
			    "TELF1" : telf,
			    "SMTP_ADDR" : email1,
			    "SMTP_ADDR2" : email2,
			    "REGIO" : regio,
			    "STCD1" : stcd1,
			    "STENR" : nif,
			    "KUNNR" : kunnr,
			    "EMNFR" : emnfr,
			    "BANKS" : banks,
			    "BANKL" : '',// no viene listado clave banco
			    "BANKN" : bankn,
			    "KOINH" : koinh,
			    "BUKRS" : bukrs,
			    "HKONT" : '',
			    "IBAN" : iban,
			    "FDGRV" : '',
			    "ZTERM" : zterm,
			    "ZWELS" : '',
			    "EKORG" : '',
			    "WAERS" : waers,
			    "BUKRS_MULTI" : '',
			    "EKORG_MULTI" : ''
			  };*/
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
				    	MessageToast.show("Solicitud creada, ID= "+data.ID_SOLICITUD);
				    	oView.byId("btnGuarda").setEnabled(false);
				    	that.reset();
				    },
				    function(e) {
				    	oView.setBusy(false);
				    	MessageToast.show("Problemas al cargar datos ("+e.getMessage+").");
				    }
				   );
		}, 
		reset:function(){
			var oView = this.getView();
			oView.byId("selectTrat").setSelectedKey("");//tratamiento
			oView.byId("name1").setValue("");//nombre acreedor
			oView.byId("selectGrpCta").setSelectedIndex(-1);//grupo acreedor
			oView.byId("concep").setValue("");//Concepto
			oView.byId("direc").setValue("");//Direccion calle num
			oView.byId("txtCiudad").setValue("");
			oView.byId("txtComuna").setValue("");
			oView.byId("selectRegion").setSelectedIndex(-1);//Region
			oView.byId("selectPais").setSelectedKey("CL");//Region
			oView.byId("telf").setValue("");//Telefono
			oView.byId("email1").setValue("");//email
			oView.byId("email2").setValue("");//email cobranza
			oView.byId("stcd1").setValue("");//rut 
			oView.byId("nif").setValue("");//nif
			oView.byId("kunnr").setValue("");//deudor
			oView.byId("emnfr").setValue("");//fab externo
			oView.byId("selectPaiBank").setSelectedKey("CL");//pais banco
			oView.byId("cta").setValue("");//cta banco
			oView.byId("titcta").setValue("");//titular cta banco
			oView.byId("selectSociedades").setSelectedIndex(-1);//sociedades
			oView.byId("iban").setValue("");//iban
			oView.byId("selectGrpComp").setSelectedIndex(-1);
			oView.byId("selectCondPago").setSelectedIndex(-1);//condicion de pago
			oView.byId("selectMoneda").setSelectedKey("CLP");//condicion de pago
			
			
		}, 
		valida:function(){
			var ok = true;
			var oView = this.getView();
			var socs = [];
			socs = oView.byId("selectSociedades").getSelectedKeys();
			var gcom = [];
			gcom = oView.byId("selectGrpComp").getSelectedKeys();
			
			if(oView.byId("selectGrpCta").getSelectedIndex()==-1){
				ok=false;
				MessageToast.show("Indique Grupo de Cuentas");
			
			}else if(oView.byId("selectTrat").getSelectedIndex()==-1){
				ok=false;
				MessageToast.show("Indique tratamiento.");
			
			}else if(oView.byId("name1").getValue()==''||oView.byId("name1").getValue().trim()==''){
				ok=false;
				MessageToast.show("Nombre obligatorio.");
			
			}else if(oView.byId("concep").getValue()==''||oView.byId("concep").getValue().trim()==''){
				ok=false;
				MessageToast.show("Concepto obligatorio.");
			
			}else if(oView.byId("direc").getValue()==''||oView.byId("direc").getValue().trim()==''){
				ok=false;
				MessageToast.show("Indique Dirección/Calle.");
			
			}else if(oView.byId("selectRegion").getSelectedIndex()==-1){
					ok=false;
					MessageToast.show("Indique región.");
			
			}else if(oView.byId("selectPais").getSelectedIndex()==-1){
				ok=false;
				MessageToast.show("Indique país.");
			
			}else if(oView.byId("stcd1").getValue()==''||oView.byId("stcd1").getValue().trim()==''){
				ok=false;
				MessageToast.show("Indique N° Id.fiscal.");
			
			}else if(socs.length==0){
				ok=false;
				MessageToast.show("Indique Sociedad(es).");
			
			}else if(gcom.lenght==0){
				ok=false;
				MessageToast.show("Indique grupo(s) de compra.");
			//MONEDA - WAERS
			}else if(oView.byId("selectMoneda").getSelectedIndex()==-1){
				ok=false;
				MessageToast.show("Indique moneda.");
			}
			//CONDICION DE PAGO
//			}else if(oView.byId("selectCondPago").getSelectedIndex()==-1){
//				ok=false;
//				MessageToast.show("Indique condición de pago.");
//			}
			
			if(ok)
				oView.byId("btnGuarda").setEnabled(true);
			else
				oView.byId("btnGuarda").setEnabled(false);
				
		},
		onChangeGrpCta:function(oEvent){
			
			var item = this.getView().byId("selectGrpCta").getSelectedItem();
			var context = item.getBindingContext("GrpCta");
	        var arrayObject = context.oModel.getProperty(context.sPath);
	        var condPagoSelec = arrayObject.ZTERM;
			this.getView().byId("selectCondPagoS").setSelectedKey(condPagoSelec);
			this.getView().byId("selectCondPagoC").setSelectedKey(condPagoSelec);
		},
		onChangePais:function(oEvent){
			var selectRegiones = this.getView().byId("selectRegion");
			var seleccPais = this.getView().byId("selectPais").getSelectedKey();
//			var oSorter = new sap.ui.model.Sorter("REGIO", true); // descend
//			selectRegiones.getBinding("items").sort(oSorter);
			var oFilter = new sap.ui.model.Filter("LAND1", sap.ui.model.FilterOperator.Contains, seleccPais);
			selectRegiones.getBinding("items").filter([oFilter]);
			if(seleccPais=="CL")
				selectRegiones.setSelectedKey("13");
			else
				selectRegiones.setSelectedIndex(0);
			console.log(seleccPais);
			
			
		},
		
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
	