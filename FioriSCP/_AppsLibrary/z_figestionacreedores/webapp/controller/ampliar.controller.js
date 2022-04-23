	sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/core/format/DateFormat",
		"z_figestionacreedores/view/utils/connectivity"
	], function(Controller, JSONModel, MessageToast, MessageBox,DateFormat) {
		"use strict";
		

		return Controller.extend("z_figestionacreedores.controller.ampliar", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf romrecepcont.reporte
*/
	onInit: function() {
		
		var url = serviceUrl;
		var oView = this.getView();
//		oView.setBusy(true);
		this.getView().byId("formCompra").setVisible(false);
		this.getView().byId("formContabilidad").setVisible(false);
//		this.getView().byId("onSearchAcrCont").setValue("");
//		this.getView().byId("onSearchAcrComp").setValue("");
//		this.getView().byId("btnGuarda").setEnabled(false);
		var selectPaiBank = this.getView().byId("selectPaiBank");
		var selectMonedas = this.getView().byId("selectMoneda");
		var selectCondPagoC = this.getView().byId("selectCondPagoC");
		var selectCondPagoS = this.getView().byId("selectCondPagoS");
		var selectSociedades = this.getView().byId("selectSociedades");
		var selectRegion = this.getView().byId("selectRegion");
		var selectAprobadores = this.getView().byId("selectAprobadores");
		var selectAprobadores_ = this.getView().byId("selectAprobadores_");
		
		var oModel = new sap.ui.model.odata.ODataModel(url,true);
		oModel.read("/InfoInicialSet?$filter=(Proceso eq 'E')" +
				"&$expand=NAVSociedades,NAVMonedas," +
				"NAVOrgCompras,NAVGrpCuentas,NAVCondPago,NAVGerencias", null, [""], false,
		function(data, response) {
				oView.setBusy(false);
				var result = data.results;
				
				var oModelGrpComp = new sap.ui.model.json.JSONModel();
				var resultGrpComp = result[0].NAVOrgCompras.results;
				oModelGrpComp.setData({
					GrpComp : resultGrpComp});
				var selectGrpComp = oView.byId("selectGrpComp");
				var selectGrpCompCopia = oView.byId("selectGrpCompCopia");
				selectGrpComp.setModel(oModelGrpComp);
				selectGrpCompCopia.setModel(oModelGrpComp);
				var oModelSociedades = new sap.ui.model.json.JSONModel();
				var resultSociedades = result[0].NAVSociedades.results;
				oModelSociedades.setData({
					Sociedades : resultSociedades});
				var selectSociedades = oView.byId("selectSociedades");
				var selectSociedadesCopia = oView.byId("selectSociedadesCopia");
				selectSociedades.setModel(oModelSociedades);
				selectSociedadesCopia.setModel(oModelSociedades);
				
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
	onSearchAcrCont:function(oEvent){
		this.getView().byId("formCompra").setVisible(false);
		this.getView().byId("formContabilidad").setVisible(false);
		var lifnr = this.getView().byId("numacCont").getValue();
		var lif=this.pad(lifnr);
		var url = serviceUrl;
		var oView = this.getView();
		oView.setBusy(true);
		var that = this;
		var oModel = new sap.ui.model.odata.ODataModel(url,true);
		oModel.read("/ConsultarAcreedorSet(LIFNR='"+lif+"',TIPO_PROCESO='E',TIPO_VISTA='CT')", null, [""], false,
		function(data, response) {
				oView.setBusy(false);
				var result = data;
				console.log(data.KTOKK);
				if(data.STATUS==='S'){
//				sap.m.MessageBox.show("OK", sap.m.MessageBox.Icon.SUCCESS,"Éxito");
//				oView.byId("objPageScG").setVisible(true);
//				oView.byId("objPageScS").setVisible(true);
//				oView.byId("objPageScC").setVisible(true);
//				oView.byId("objPageScA").setVisible(true);
//				oView.byId("objPageScO").setVisible(true);
//				oView.byId("btnValidar").setVisible(true);
//				oView.byId("btnGuardar").setVisible(true);
				var oModel = new sap.ui.model.json.JSONModel();
//				oModel.setData({
//					ktokk_desc: result.KTOKK+" - "+result.KTOKK_DESC});
				oModel.setData(result);
//				oView.setModel(oModel);
				oView.setModel(oModel,"dataModel");
//				oView.byId("inpKtokk").setValue(result.KTOKK);
				oView.byId("txtSociedades").setText(result.BUKRS_MULTI);
				oView.byId("formCompra").setVisible(false);
				oView.byId("formContabilidad").setVisible(true);
				
				var oModelSociedades = new sap.ui.model.json.JSONModel();
				var sociedadesCurrent = [];
				sociedadesCurrent = data.BUKRS_MULTI.split('-');
				var soc=[];
				for(var i=0; i<sociedadesCurrent.length; i++){
					var obj={"BURKS":sociedadesCurrent[i],"BUKRS_DESC":sociedadesCurrent[i]};
					soc.push(obj);
				}
				var data = {
					'Sociedades': soc};
				oModelSociedades.setData(data);
				var selSociedades = oView.byId("selectSociedades");
				selSociedades.setModel(oModelSociedades);
				}else{
					MessageToast.show(data.MESSAGE+" Acción no es posible.");
				}
			
			}, function(err) {
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
			});	
		},
		onSearchAcrComp:function(oEvent){
			var lifnr = this.getView().byId("numacComp").getValue();
			this.getView().byId("formCompra").setVisible(false);
			this.getView().byId("formContabilidad").setVisible(false);
			var lif=this.pad(lifnr);
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel(url,true);
			oModel.read("/ConsultarAcreedorSet(LIFNR='"+lif+"',TIPO_PROCESO='E',TIPO_VISTA='CP')", null, [""], false,
			function(data, response) {
					oView.setBusy(false);
					var result = data;
					console.log(data.KTOKK);
					if(data.STATUS==='S'){
						var oModel = new sap.ui.model.json.JSONModel();
//						oModel.setData({
//							ktokk_desc: result.KTOKK+" - "+result.KTOKK_DESC});
						oModel.setData(result);
//						oView.setModel(oModel);
						oView.setModel(oModel,"dataModel");
						oView.byId("formCompra").setVisible(true);
//						oView.byId("onSearchAcrCont").setValue("");
						oView.byId("formContabilidad").setVisible(false);
						
						var oModelGrpCmp = new sap.ui.model.json.JSONModel();
						var gruposCompraCurrent = [];
						gruposCompraCurrent = data.EKORG_MULTI.split('-');
						var grp=[];
						for(var i=0; i<gruposCompraCurrent.length; i++){
							var obj={"EKORG":gruposCompraCurrent[i],"EKORG_DESC":gruposCompraCurrent[i]};
							grp.push(obj);
						}
						var data = {
							'GrpComp': grp};
						oModelGrpCmp.setData(data);
						var selGroCom = oView.byId("selectGrpComp");
						selGroCom.setModel(oModelGrpCmp);
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
			console.log(viewId + "--pageContainer"+"#"+viewId+"--"+item.getKey());
			sap.ui.getCore().byId(viewId + "--pageContainer").to(viewId+"--"+item.getKey());
//			this.reset();
		},
		
		onSave:function(){
			var that = this;
			var url = serviceUrl;
			var oView = this.getView();
//			oView.setBusy(true);
			
			var oModel = new sap.ui.model.odata.ODataModel(url,true);
			var oEntry = new sap.ui.model.json.JSONModel();
//			var lifnr = oView.byId("lifnr").getValue();
			var elModelo = this.getView().getModel("dataModel");
		console.log(elModelo.oData.WAERS);
			
			var lifnr   = elModelo.oData.LIFNR;
			
			var kunnr = elModelo.oData.KUNNR;
			var emnfr = elModelo.oData.EMNFR;
			var stcd1 = elModelo.oData.STCD1;
			var zterm = elModelo.oData.ZTERM;
			var waers = elModelo.oData.WAERS;
			
			var ekorg = this.getView().byId("selectGrpComp").getSelectedKey();
			var ekorgs = [];
			ekorgs = oView.byId("selectGrpCompCopia").getSelectedKeys();//org compras
			var ekorg_multi=ekorgs.join('-');
			
			var aprob = this.getView().byId("selectAprobadores").getSelectedKey();
			
			var bukrs = [];
			bukrs = oView.byId("selectSociedadesCopia").getSelectedKeys();//sociedades
			var bukrs_single=bukrs.join('-');
			var bukrs_multi=bukrs.join('-');
			if(bukrs.lenght==1){
				bukrs_multi='';
			}else{
				bukrs_single='';
			}
			
			oEntry =
			{
			    "TIPO_PROCESO" : 'E',
			    "ID_SOLICITUD" : '',
			    "LIFNR" : lifnr,
			    "STCD1" : stcd1,
			    "TIPO_VISTA" : 'CP',
			    "KUNNR" : kunnr,
			    "EMNFR" : emnfr,
			    "WAERS" : waers,
			    "ZTERM_COMPRAS" : zterm,
			    "EKORG" : ekorg,
			    "EKORG_MULTI" : ekorg_multi,
			    "BUKRS_MULTI" : bukrs_multi,
			    "APROBADOR" : aprob
			  };
			
				oModel.create("/CrearSolicitudSet", oEntry, null,function(data) {
				    	oView.setBusy(false);
				    	if(data.STATUS==='S'){
				    		MessageToast.show(data.MESSAGE);
				    		oView.byId("btnGuardar").setEnabled(false);
					    	that.reset();
				    	}else{
				    		MessageToast.show("Error: "+data.MESSAGE);
				    	}
				    },
				    function(e) {
				    	oView.setBusy(false);
				    	MessageToast.show("Problemas al cargar datos ("+e.getMessage+").");
				    }
				   );
		},
		onSaveCt:function(){
			var that = this;
			var url = serviceUrl;
			var oView = this.getView();
//			oView.setBusy(true);
			
			var oModel = new sap.ui.model.odata.ODataModel(url,true);
			var oEntry = new sap.ui.model.json.JSONModel();
//			var lifnr = oView.byId("lifnr").getValue();
			var elModelo = this.getView().getModel("dataModel");
		console.log(elModelo.oData.WAERS);
			
			var lifnr   = elModelo.oData.LIFNR;
			
			var kunnr = elModelo.oData.KUNNR;
			var emnfr = elModelo.oData.EMNFR;
			var stcd1 = elModelo.oData.STCD1;
			var zterm = elModelo.oData.ZTERM;
			var waers = elModelo.oData.WAERS;
			
			var aprob = this.getView().byId("selectAprobadores_").getSelectedKey();
			var bukrs = this.getView().byId("selectSociedades").getSelectedKey();
			var bukrss = [];
			bukrss = oView.byId("selectSociedadesCopia").getSelectedKeys();//sociedades
			var bukrs_multi=bukrss.join('-');
			
			oEntry =
			{
					
				"TIPO_VISTA" : 'CT',	
			    "TIPO_PROCESO" : 'E',
			    "ID_SOLICITUD" : '',
			    "LIFNR" : lifnr,
			    "STCD1" : stcd1,
			    "KUNNR" : kunnr,
			    "EMNFR" : emnfr,
			    "WAERS" : waers,
			    "ZTERM" : zterm,
			    "BUKRS" : bukrs,
			    "BUKRS_MULTI" : bukrs_multi,
			    "APROBADOR" : aprob
			  };
			
				oModel.create("/CrearSolicitudSet", oEntry, null,function(data) {
				    	oView.setBusy(false);
				    	if(data.STATUS==='S'){
				    		MessageToast.show(data.MESSAGE);
				    		oView.byId("btnGuardaCt").setEnabled(false);
//					    	that.reset();
				    	}else{
				    		MessageToast.show("Error: "+data.MESSAGE);
				    	}
				    },
				    function(e) {
				    	oView.setBusy(false);
				    	MessageToast.show("Problemas al cargar datos ("+e.getMessage+").");
				    }
				   );
		},
		onValida:function(){
			
			var ok = true;
			var oView = this.getView();
			oView.byId("btnGuardar").setEnabled(false);
			var socopia = [];
			socopia = oView.byId("selectGrpCompCopia").getSelectedKeys();
			if(oView.byId("selectAprobadores").getSelectedIndex()==-1){
				ok=false;
				MessageToast.show("Indique Gerente/Subgerente Aprobador.");
			
			}else if(oView.byId("selectGrpComp").getSelectedIndex()==-1){
				ok=false;
				MessageToast.show("Selecione Grupo Copia.");
			
			}else if(socopia.length==0){
				ok=false;
				MessageToast.show("Seleccione Organización(es) Ampliar.");
			}
			if(ok)
				oView.byId("btnGuardar").setEnabled(true);
			else
				oView.byId("btnGuardar").setEnabled(false);
				
		},
		onValidaCt:function(){
			
			var ok = true;
			var oView = this.getView();
			oView.byId("btnGuardaCt").setEnabled(false);
			var socopia = [];
			socopia = oView.byId("selectSociedadesCopia").getSelectedKeys();
			if(oView.byId("selectAprobadores").getSelectedIndex()==-1){
				ok=false;
				MessageToast.show("Indique Gerente/Subgerente Aprobador.");
			}else if(oView.byId("selectSociedades").getSelectedIndex()==-1){
				ok=false;
				MessageToast.show("Selecione Sociedad Copia.");
			}else if(socopia.length==0){
				ok=false;
				MessageToast.show("Seleccione Sociedad(es) Ampliar.");
			}	
			if(ok)
				oView.byId("btnGuardaCt").setEnabled(true);
			else
				oView.byId("btnGuardaCt").setEnabled(false);
				
		},
		pad:function (n) {
			 
		  n = n + '';
		  return n.length >= 10 ? n : new Array(10 - n.length + 1).join(0) + n;
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
	