	sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/core/format/DateFormat",
		"z_figestionacreedores/view/utils/connectivity"
	], function(Controller, JSONModel, MessageToast, MessageBox,DateFormat) {
		"use strict";

		return Controller.extend("z_figestionacreedores.controller.borrado", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf romrecepcont.reporte
*/
	onInit: function() {
		
		this.getView().byId("btnGuardaCt").setVisible(false);
		this.getView().byId("btnGuarda").setVisible(false);
		this.getView().byId("btnValidaCt").setVisible(false);
		this.getView().byId("btnValida").setVisible(false);
		this.getView().byId("formCompra").setVisible(false);
		this.getView().byId("formContab").setVisible(false);
		var url = serviceUrl;
		var oView = this.getView();
		oView.setBusy(true);
		var selectPaises = this.getView().byId("selectPais");
		var selectPaiBank = this.getView().byId("selectPaiBank");
		var selectMonedas = this.getView().byId("selectMoneda");
		var selectCondPagoC = this.getView().byId("selectCondPagoC");
		var selectCondPagoS = this.getView().byId("selectCondPagoS");
		var selectSociedades = this.getView().byId("selectSociedades");
		var selectRegion = this.getView().byId("selectRegion");
		var selectAprobadores = this.getView().byId("selectAprobadores");
		var selectAprobadores_ = this.getView().byId("selectAprobadores_");
		var oModel = new sap.ui.model.odata.ODataModel(url,true);
		oModel.read("/InfoInicialSet?$filter=(Proceso eq 'D')" +
				"&$expand=NAVSociedades,NAVGerencias", null, [""], false,
		function(data, response) {
				oView.setBusy(false);
				var result = data.results;
				
//				var oModelSociedades = new sap.ui.model.json.JSONModel();
//				var resultSociedades = result[0].NAVSociedades.results;
//				
//				
//				
//				oModelSociedades.setData({
//					Sociedades : resultSociedades});
//				selectSociedades.setModel(oModelSociedades);
				
				var oModelAprobadores = new sap.ui.model.json.JSONModel();
				var resultGerencias = result[0].NAVGerencias.results;
				oModelAprobadores.setData({
					Aprobadores : resultGerencias});
				selectAprobadores.setModel(oModelAprobadores);
				selectAprobadores_.setModel(oModelAprobadores);
			}, function(err) {
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
			});	
	},
	onSearchAcrComp:function(){
		this.reset();
		var lifnr = this.getView().byId("numacComp").getValue();
		var lif=this.pad(lifnr);
		var url = serviceUrl;
		var oView = this.getView();
		oView.setBusy(true);
		var that = this;
		var oModel = new sap.ui.model.odata.ODataModel(url,true/*,user,pass*/);
		oModel.read("/ConsultarAcreedorSet(LIFNR='"+lif+"',TIPO_PROCESO='D',TIPO_VISTA='CP')", null, ["" ], false,
		function(data, response) {
				oView.setBusy(false);
				var result = data;
				console.log(data.KTOKK);
				if(data.STATUS==='S'){
					oView.byId("formCompra").setVisible(true);
					
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(result);
					oView.setModel(oModel,"dataModel");
					oView.byId("inpSoc").setValue(result.BUKRS_MULTI);
					var oModelSociedad = new sap.ui.model.json.JSONModel();
					var sociedadesCurrent = [];
					sociedadesCurrent = data.BUKRS_MULTI.split('-');
					var socs=[];
					for(var i=0; i<sociedadesCurrent.length; i++){
						var obj={"BUKRS":sociedadesCurrent[i],"BUKRS_DESC":sociedadesCurrent[i]};
						socs.push(obj);
					}
					var data = {
						'Sociedades': socs};
					oModelSociedad.setData(data);
					var selsoc = oView.byId("selectSociedades");
					selsoc.setModel(oModelSociedad);
					oView.byId("btnGuarda").setVisible(true);
					oView.byId("btnValida").setVisible(true);
				}else{
					MessageToast.show(data.MESSAGE+" Acción no es posible.");
				}
			}, function(err) {
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
			});	
	},
	onSearchAcrCont:function(){
		this.reset();
		var lifnr = this.getView().byId("numacComp").getValue();
		var lif=this.pad(lifnr);
		var url = serviceUrl;
		var oView = this.getView();
		oView.setBusy(true);
		var that = this;
		var oModel = new sap.ui.model.odata.ODataModel(url,true/*,user,pass*/);
		oModel.read("/ConsultarAcreedorSet(LIFNR='"+lif+"',TIPO_PROCESO='D',TIPO_VISTA='CT')", null, ["" ], false,
		function(data, response) {
				oView.setBusy(false);
				var result = data;
				console.log(data.KTOKK);
				if(data.STATUS==='S'){
					oView.byId("formContab").setVisible(true);
					
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(result);
					oView.setModel(oModel,"dataModel");
					oView.byId("inpSoc_").setValue(result.BUKRS_MULTI);
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(result);
					oView.setModel(oModel,"dataModel");
					oView.byId("inpSoc").setValue(result.BUKRS_MULTI);
					var oModelSociedad = new sap.ui.model.json.JSONModel();
					var sociedadesCurrent = [];
					sociedadesCurrent = data.BUKRS_MULTI.split('-');
					var socs=[];
					for(var i=0; i<sociedadesCurrent.length; i++){
						var obj={"BUKRS":sociedadesCurrent[i],"BUKRS_DESC":sociedadesCurrent[i]};
						socs.push(obj);
					}
					var data = {
						'Sociedades': socs};
					oModelSociedad.setData(data);
					var selsoc = oView.byId("selectSociedades_");
					selsoc.setModel(oModelSociedad);
					oView.byId("btnGuardaCt").setVisible(true);
					oView.byId("btnValidaCt").setVisible(true);
				}else{
					MessageToast.show(data.MESSAGE+" Acción no es posible.");
				}
			
			}, function(err) {
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
			});	
	},
		
		onItemSelect:function(oEvent){
			var item = oEvent.getParameter('item');
			var viewId = this.getView().getId();
//			console.log(viewId + "--pageContainer"+"#"+viewId+"--"+item.getKey());
			sap.ui.getCore().byId(viewId + "--pageContainer").to(viewId+"--"+item.getKey());
//			this.reset();
		},
		onSaveCompra:function(){
			var that = this;
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			
			var oModel = new sap.ui.model.odata.ODataModel(url,true);
			var oEntry = new sap.ui.model.json.JSONModel();
			var lifnr = oView.byId("lifnr").getValue();
			var name1 = oView.byId("name1").getValue();//nombre acreedor
			var bukrs = oView.byId("selectSociedades").getSelectedKey();//sociedades
			var aprob = this.getView().byId("selectAprobadores").getSelectedKey();
//			campos especiales para borrado
			var areas = "";
			var compr = "";
			var datgr = "";
			if(oView.byId("chk1").getSelected())
				areas = "X";
			
			if(oView.byId("chk2").getSelected())
				compr = "X";
			
			if(oView.byId("chk3").getSelected())
				datgr = "X";
			
			
			oEntry =
			{
			    "TIPO_PROCESO" : 'D',
			    "ID_SOLICITUD" : '',
			    "LIFNR" : lifnr,
			    "ANRED" : '',
			    "NAME1" : name1,
			    "KTOKK" : '',
			    "SORTL" : '',
			    "STRAS" : '',
			    "CITY1" : '',
			    "CITY2" : '',
			    "REGIO" : '',
			    "LAND1" : '',
			    "TELF1" : '',
			    "SMTP_ADDR" : '',
			    "SMTP_ADDR2" : '',
			    "STCD1" : '',
			    "TIPO_VISTA" : 'CP',
			    "KUNNR" : '',
			    "EMNFR" : '',
			    "BANKS" : '',
			    "BANKL" : '',
			    "BANKN" : '',
			    "KOINH" : '',
			    "BUKRS" : bukrs,
			    "HKONT" : '',
			    "IBAN" : '',
			    "FDGRV" : '',
			    "ZTERM" : '',
			    "ZWELS" : '',
			    "EKORG" : '',
			    "WAERS" : '',
			    "BUKRS_MULTI" : '',
			    "EKORG_MULTI" : '',
			    "LOEVM" : areas,
			    "LOEVM_COMPRAS":compr,
			    "SPERM": datgr,
			    "APROBADOR" : aprob
			  };
				oModel.create("/CrearSolicitudSet", oEntry, null,function(data) {
			    	oView.setBusy(false);
			    	if(data.STATUS==='S'){
			    		MessageToast.show(data.MESSAGE);
			    		oView.byId("btnGuarda").setEnabled(false);
				    	that.reset();
			    	}else{
			    		MessageToast.show("Error: "+data.MESSAGE);
			    	}
			    },
			    function(e) {
			    	oView.setBusy(false);
			    	MessageToast.show("Problemas en el proceso("+e.getMessage+").");
			    }
			   );
		},
		onSaveContab:function(){
			var that = this;
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			
			var oModel = new sap.ui.model.odata.ODataModel(url,true);
			var oEntry = new sap.ui.model.json.JSONModel();
			var lifnr = oView.byId("lifnr_").getValue();
			var name1 = oView.byId("name1_").getValue();//nombre acreedor
			var bukrs = oView.byId("selectSociedades_").getSelectedKey();//sociedades
			var aprob = this.getView().byId("selectAprobadores_").getSelectedKey();
//			campos especiales para borrado
			var areas = "";
			var compr = "";
			var datgr = "";
			var sosel = "";
			if(oView.byId("chk1_").getSelected())
				areas = "X";
			
			if(oView.byId("chk2_").getSelected())
				compr = "X";
			
			if(oView.byId("chk3_").getSelected())
				datgr = "X";
			if(oView.byId("chk4_").getSelected())
				sosel = "X";
			oEntry =
			{
			    "TIPO_PROCESO" : 'D',
			    "ID_SOLICITUD" : '',
			    "LIFNR" : lifnr,
			    "ANRED" : '',
			    "NAME1" : name1,
			    "KTOKK" : '',
			    "SORTL" : '',
			    "STRAS" : '',
			    "CITY1" : '',
			    "CITY2" : '',
			    "REGIO" : '',
			    "LAND1" : '',
			    "TELF1" : '',
			    "SMTP_ADDR" : '',
			    "SMTP_ADDR2" : '',
			    "STCD1" : '',
			    "TIPO_VISTA" : 'CT',
			    "KUNNR" : '',
			    "EMNFR" : '',
			    "BANKS" : '',
			    "BANKL" : '',
			    "BANKN" : '',
			    "KOINH" : '',
			    "BUKRS" : bukrs,
			    "HKONT" : '',
			    "IBAN" : '',
			    "FDGRV" : '',
			    "ZTERM" : '',
			    "ZWELS" : '',
			    "EKORG" : '',
			    "WAERS" : '',
			    "BUKRS_MULTI" : '',
			    "EKORG_MULTI" : '',
			    "LOEVM_COMPRAS":'',
			    "LOEVM" : areas,
			    "LOEVM_CONTABLE":compr,
			    "NODEL": datgr,
			    "NODEL_CONTABLE": sosel,
			    "APROBADOR" : aprob
			    
			  };
			
				oModel.create("/CrearSolicitudSet", oEntry, null,function(data) {
				    	oView.setBusy(false);
				    	if(data.STATUS==='S'){
				    		MessageToast.show(data.MESSAGE);
				    		oView.byId("btnGuardaCt").setEnabled(false);
					    	that.reset();
				    	}else{
				    		MessageToast.show("Error: "+data.MESSAGE);
				    	}
				    },
				    function(e) {
				    	oView.setBusy(false);
				    	MessageToast.show("Problemas en el proceso("+e.getMessage+").");
				    }
				   );
		},
		onValida:function(){
			var ok = true;
			var oView = this.getView();
			
			
			if(oView.byId("selectTrat").getSelectedIndex()==-1){
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
			
			//MONEDA - WAERS
			}else if(oView.byId("selectMoneda").getSelectedIndex()==-1){
				ok=false;
				MessageToast.show("Indique moneda.");
			
			//CONDICION DE PAGO
			}else if(oView.byId("selectCondPagoC").getSelectedIndex()==-1){
				ok=false;
				MessageToast.show("Indique condición de pago.");
			}else if(oView.byId("selectCondPagoS").getSelectedIndex()==-1){
				ok=false;
				MessageToast.show("Indique condición de pago.");
			}
			
			if(ok)
				oView.byId("btnGuardar").setEnabled(true);
			else
				oView.byId("btnGuardar").setEnabled(false);
				
		},
		pad:function (n) {
			 
		  n = n + '';
		  return n.length >= 10 ? n : new Array(10 - n.length + 1).join(0) + n;
		}, 
		reset:function(){
			this.getView().byId("formCompra").setVisible(false);
			this.getView().byId("formContab").setVisible(false);
			this.getView().byId("chk1").setSelected(false);
			this.getView().byId("chk1_").setSelected(false);
			this.getView().byId("chk2").setSelected(false);
			this.getView().byId("chk2_").setSelected(false);
			this.getView().byId("chk3").setSelected(false);
			this.getView().byId("chk3_").setSelected(false);
			this.getView().byId("chk4_").setSelected(false);
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
	