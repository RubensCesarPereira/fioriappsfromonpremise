	sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		'sap/m/Token',
		"sap/m/Dialog",
		"sap/m/Button",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"z_figesacrelib/view/utils/connectivity",
		"z_figesacrelib/js/util"
	], function(Controller, JSONModel, Token, Dialog, Button, MessageToast,MessageBox) {
		"use strict";
		return Controller.extend("z_figesacrelib.controller.master", {
	onInit: function() {
		var url = serviceUrlLib;
		var oView = this.getView();
		this.loadMetaData();
		this.getView().byId("ObjectPageLayout").setVisible(false);
		this.getView().byId("comprasKeyB").setVisible(false);
		this.getView().byId("contabKeyB").setVisible(false);
		this.getView().byId("comprasKeyA").setVisible(false);
		this.getView().byId("contabKeyA").setVisible(false);
		this.getView().byId("otbFooter").setVisible(false);
		this.getView().byId("detalleMobile").setVisible(false);
		this.getView().byId("formContabBCTADMMob").setVisible(false);
		this.getView().byId("formCompraBCPADMMob").setVisible(false);
		this.getView().byId("formContabAMob").setVisible(false);
		this.getView().byId("formCompraAMob").setVisible(false);
		oView.setBusy(true);
		jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var oModel = new sap.ui.model.odata.ODataModel(url,true);
		oModel.read("/InfoInicialSet?&$expand=NAVMotivos", null, ["" ], false,
		function(data, response) {
				oView.setBusy(false);
				var result = data.results;
				var resultMot = result[0].NAVMotivos.results;
				oStorage.put("motRechz",resultMot);
			}, function(err) {
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
			});	
		var oModelPend = new sap.ui.model.odata.ODataModel(url,true);
		var tabla = this.getView().byId("idSolicTable");
		oModelPend.read("/SolicitudesPendientesSet",null, ["" ], false,
			function(data, response) {
				oView.setBusy(false);
				var result = data.results;
				var oModelProceso = new sap.ui.model.json.JSONModel();
				var resultados = data.results;
				var solicitudes=[];
				for(var i=0; i<resultados.length; i++){				 
					var obj={
							"AREA_PROCESO":	resultados[i].AREA_PROCESO,
							"ERSDA":		resultados[i].ERSDA,
							"GERENCIA" : resultados[i].GERENCIA,
							"TIPO_PROCESO":	resultados[i].TIPO_PROCESO,
							"TIPO_PROCESO_ID": resultados[i].TIPO_PROCESO,
							"TIPO_PROCESO_DESC": resultados[i].TIPO_PROCESO_DESC,
							"ID_SOLICITUD" : parseInt(resultados[i].ID_SOLICITUD),
							"KTOKK":		resultados[i].KTOKK,
							"NAME1": 		resultados[i].NAME1,
							"WI" : resultados[i].WI,
							"UNAME" : resultados[i].UNAME,
							"WI_RH_TASK" : resultados[i].WI_RH_TASK
					};
					solicitudes.push(obj);
				}
				var data = {'listSolicitudes': solicitudes};
				oModelProceso.setData(data);
				tabla.setModel(oModelProceso);
			}, function(err) {
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
			});
		var oFileModel = new JSONModel({
			files : [],
			upFiles: [],
			lastData: null
		});
		this.getView().setModel(oFileModel,'FileModel');
	},
	getSolicitudes:function(){
		var oView = this.getView(); 
		oModelPend.read("/SolicitudesPendientesSet",null, ["" ],true,
				function(data, response) {
					oView.setBusy(false);
					var result = data.results;
					var oModelProceso = new sap.ui.model.json.JSONModel();
					var resultados = data.results;
					var solicitudes=[];
					for(var i=0; i<resultados.length; i++){				 
						var obj={
								"AREA_PROCESO":	resultados[i].AREA_PROCESO,
								"ERSDA":		resultados[i].ERSDA,
								"GERENCIA" : resultados[i].GERENCIA,
								"TIPO_PROCESO":	resultados[i].TIPO_PROCESO,
								"TIPO_PROCESO_ID": resultados[i].TIPO_PROCESO,
								"TIPO_PROCESO_DESC": resultados[i].TIPO_PROCESO_DESC,
								"ID_SOLICITUD" : parseInt(resultados[i].ID_SOLICITUD),
								"KTOKK":		resultados[i].KTOKK,
								"NAME1": 		resultados[i].NAME1,
								"WI" : resultados[i].WI,
								"UNAME" : resultados[i].UNAME,
								"WI_RH_TASK" : resultados[i].WI_RH_TASK
						};
						solicitudes.push(obj);
					}
					var data = {'listSolicitudes': solicitudes};
					oModelProceso.setData(data);
					tabla.setModel(oModelProceso);
				}, function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
				});		
	},
	loadMetaData: function(){
		var url = serviceUrlConsultaLib;
		var oModel = new sap.ui.model.odata.ODataModel(url, true);
		var oView = this.getView(); 
		oModel.read(
			"/InfoInicialSet?$filter=(Proceso eq 'C')"
			+ "&$expand=NAVSociedades,NAVMonedas,NAVPaises,"
			+ "NAVOrgCompras,NAVGrpCuentas,NAVCondPago,"
			+ "NAVPaisesRegiones,NAVGerencias,NAVPaisRegComunas,"
			+ "NAVBancos,NAVViasPago,NAVCuentas",
			null,[ "" ],true,
			function(data,response){
				oView.setBusy(false);					
				var NAVGrpCuentasModel = new sap.ui.model.json.JSONModel()
				NAVGrpCuentasModel.setData(data.results[0].NAVGrpCuentas);
				NAVGrpCuentasModel.setSizeLimit(data.results[0].NAVGrpCuentas.results.length);
				oView.byId("GrpCtaS").setModel(NAVGrpCuentasModel);
				oView.byId("grupCtaBD").setModel(NAVGrpCuentasModel);
				oView.byId("grpCtaBDC").setModel(NAVGrpCuentasModel);
				oView.byId("grpCtaA").setModel(NAVGrpCuentasModel);
				oView.byId("grpCtaAC").setModel(NAVGrpCuentasModel);
				
				var NAVPaisesModel = new sap.ui.model.json.JSONModel()
				NAVPaisesModel.setData(data.results[0].NAVPaises);
				NAVPaisesModel.setSizeLimit(data.results[0].NAVPaises.results.length);
				oView.byId("selectPaisS").setModel(NAVPaisesModel);
				oView.byId("selectPaiBankS").setModel(NAVPaisesModel);
				oView.byId("selectPaiBankS2").setModel(NAVPaisesModel);
				oView.byId("selectPaiBankS3").setModel(NAVPaisesModel);
				
				var NAVMonedasModel = new sap.ui.model.json.JSONModel()
				NAVMonedasModel.setData(data.results[0].NAVMonedas);
				NAVMonedasModel.setSizeLimit(data.results[0].NAVMonedas.results.length);
				oView.byId("selectMonedaS").setModel(NAVMonedasModel);

				var NAVCondPagoModel = new sap.ui.model.json.JSONModel()
				NAVCondPagoModel.setData(data.results[0].NAVCondPago);
				NAVCondPagoModel.setSizeLimit(data.results[0].NAVCondPago.results.length);
				oView.byId("selectCondPagoCS").setModel(NAVCondPagoModel);
				oView.byId("selectCondPagoSS").setModel(NAVCondPagoModel);
				
				var NAVSociedadesModel = new sap.ui.model.json.JSONModel()
				NAVSociedadesModel.setData(data.results[0].NAVSociedades);
				NAVSociedadesModel.setSizeLimit(data.results[0].NAVSociedades.results.length);
				oView.byId("selectSociedadesS").setModel(NAVSociedadesModel);
				oView.byId("selectSociedadesBDC").setModel(NAVSociedadesModel);
				oView.byId("selectSociedadesAC").setModel(NAVSociedadesModel);
				oView.byId("selectSociedadesAC2").setModel(NAVSociedadesModel);
				
				var NAVPaisesRegionesModel = new sap.ui.model.json.JSONModel()
				NAVPaisesRegionesModel.setData(data.results[0].NAVPaisesRegiones);
				NAVPaisesRegionesModel.setSizeLimit(data.results[0].NAVPaisesRegiones.results.length);
				oView.byId("selectRegionS").setModel(NAVPaisesRegionesModel);
				
//				var NAVGerenciasModel = new sap.ui.model.json.JSONModel()
//				NAVGerenciasModel.setData(data.results[0].NAVGerencias);
//				NAVGerenciasModel.setSizeLimit(data.results[0].NAVGerencias.results.length);
//				oView.byId("selectAprobadoresS").setModel(NAVGerenciasModel);
				
				var NAVBancosModel = new sap.ui.model.json.JSONModel()
				NAVBancosModel.setData(data.results[0].NAVBancos);
				NAVBancosModel.setSizeLimit(data.results[0].NAVBancos.results.length);
				oView.byId("selectClaBankS").setModel(NAVBancosModel);
				oView.byId("selectClaBankS2").setModel(NAVBancosModel);
				oView.byId("selectClaBankS3").setModel(NAVBancosModel);
				
				var NAVPaisRegComunasModel = new sap.ui.model.json.JSONModel()
				NAVPaisRegComunasModel.setData(data.results[0].NAVPaisRegComunas);
				NAVPaisRegComunasModel.setSizeLimit(data.results[0].NAVPaisRegComunas.results.length);
				oView.byId("selectComunasS").setModel(NAVPaisRegComunasModel);
				
				var NAVViasPagoModel = new sap.ui.model.json.JSONModel()
				NAVViasPagoModel.setData(data.results[0].NAVViasPago);
				NAVViasPagoModel.setSizeLimit(data.results[0].NAVViasPago.results.length);
				oView.byId("selectViasPagoS").setModel(NAVViasPagoModel);
//				oView.byId("selectViasPagoAC").setModel(NAVViasPagoModel);
				
				var NAVCuentasModel = new sap.ui.model.json.JSONModel()
				NAVCuentasModel.setData(data.results[0].NAVCuentas);
				NAVCuentasModel.setSizeLimit(data.results[0].NAVCuentas.results.length);
				oView.byId("selectCtaAsocS").setModel(NAVCuentasModel);
				
				var NAVOrgComprasModel = new sap.ui.model.json.JSONModel()
				NAVOrgComprasModel.setData(data.results[0].NAVOrgCompras);
				NAVOrgComprasModel.setSizeLimit(data.results[0].NAVOrgCompras.results.length);
				oView.byId("selectGrpCompS").setModel(NAVOrgComprasModel);
				oView.byId("selectGrpCompBD").setModel(NAVOrgComprasModel);
				oView.byId("selectGrpCompA").setModel(NAVOrgComprasModel);
				oView.byId("selectGrpCompA2").setModel(NAVOrgComprasModel);
				
				var trat = TRATAMIENTO;
				var tratModel = new sap.ui.model.json.JSONModel({Trat:trat})
				oView.byId("selectTratS").setModel(tratModel);
				
			},
			function(err) {
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
			});
	},
	reload:function(){
		var url = serviceUrlLib;
		var oView = this.getView();
		this.getView().byId("ObjectPageLayout").setVisible(false);
		this.getView().byId("comprasKeyB").setVisible(false);
		this.getView().byId("contabKeyB").setVisible(false);
		this.getView().byId("comprasKeyA").setVisible(false);
		this.getView().byId("contabKeyA").setVisible(false);
		this.getView().byId("detalleMobile").setVisible(false);
		this.getView().byId("otbFooter").setVisible(false);
		oView.setBusy(true);
		var oModel = new sap.ui.model.odata.ODataModel(url,true);
		oModel.read("/InfoInicialSet?&$expand=NAVMotivos", null, ["" ], false,
		function(data, response) {
				oView.setBusy(false);
				var result = data.results;
				var oModelMot = new sap.ui.model.json.JSONModel();
				var resultMot = result[0].NAVMotivos.results;
				oModelMot.setData({
					Motivos : resultMot});
				oModelMot.setSizeLimit(resultMot.length);
				
			}, function(err) {
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
			});	
		var oModelPend = new sap.ui.model.odata.ODataModel(url,true);
		var tabla = this.getView().byId("idSolicTable");
		oModelPend.read("/SolicitudesPendientesSet", null, ["" ], false,
		function(data, response) {
				oView.setBusy(false);
				var result = data.results;
				var oModelProceso = new sap.ui.model.json.JSONModel();
				var resultados = data.results;
				var solicitudes=[];	
				for(var i=0; i<resultados.length; i++){									 
					var obj={
							"AREA_PROCESO":	resultados[i].AREA_PROCESO,
							"ERSDA":		resultados[i].ERSDA,
							"GERENCIA" : resultados[i].GERENCIA,
							"TIPO_PROCESO":	resultados[i].TIPO_PROCESO,
							"TIPO_PROCESO_ID": resultados[i].TIPO_PROCESO,
							"TIPO_PROCESO_DESC": resultados[i].TIPO_PROCESO_DESC,
							"ID_SOLICITUD" : parseInt(resultados[i].ID_SOLICITUD),
							"KTOKK":		resultados[i].KTOKK,
							"NAME1": 		resultados[i].NAME1,
							"WI" : resultados[i].WI,
							"UNAME" : resultados[i].UNAME,
							"WI_RH_TASK" : resultados[i].WI_RH_TASK
					};				
					solicitudes.push(obj);
				}
				var data = {
					'listSolicitudes': solicitudes};
				oModelProceso.setData(data);
				tabla.setModel(oModelProceso);
				
			}, function(err) {
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
			});	
	},
	sortForm:function(data){
		this.byId("lblselectIndRetMS").setVisible(false);
		this.byId("selectIndRetS").setVisible(false);
		this.byId("lblctaasocms").setVisible(true);
		this.byId("selectCtaAsocS").setVisible(true);
		this.byId("Lico1S").setVisible(false);
		this.byId("ico1S").setVisible(false);
		this.byId("LGrupEsqProS").setVisible(false);
		this.byId("GrupEsqProS").setVisible(false);
		this.byId("LctrlConfS").setVisible(false);
		this.byId("ctrlConfS").setVisible(false);
		
		this.byId("lblsexS").setVisible(false);
		this.byId("sexS").setVisible(false);
		this.byId("lbllnaS").setVisible(false);
		this.byId("lnaS").setVisible(false);
		this.byId("lblproS").setVisible(false);
		this.byId("proS").setVisible(false);
		this.byId("lblfnaS").setVisible(false);
		this.byId("fnaS").setVisible(false);
		this.byId("RB1-1S").setSelected(false);
		this.byId("RB1-2S").setSelected(false);
		switch(data.KTOKK){
		case 'PEXT':
			this.byId("lblselectIndRetMS").setVisible(true);
			this.byId("selectIndRetS").setVisible(true);
			this.byId("lblctaasocms").setVisible(false);
			this.byId("selectCtaAsocS").setVisible(false);
			this.byId("Lico1S").setVisible(true);
			this.byId("ico1S").setVisible(true);
			this.byId("LGrupEsqProS").setVisible(true);
			this.byId("GrupEsqProS").setVisible(true);
			this.byId("LctrlConfS").setVisible(true);
			this.byId("ctrlConfS").setVisible(true);
			var trat = this.byId('selectTratS').getSelectedKey();
			var l = !(trat === '0007' || trat === '0008');
			this.byId("lblsexS").setVisible(l);
			this.byId("sexS").setVisible(l);
			this.byId("lbllnaS").setVisible(l);
			this.byId("lnaS").setVisible(l);
			this.byId("lblproS").setVisible(l);
			this.byId("proS").setVisible(l);
			this.byId("lblfnaS").setVisible(l);
			this.byId("fnaS").setVisible(l);
			this.byId("RB1-1S").setSelected(data.SEXKZ == '1');
			this.byId("RB1-2S").setSelected(data.SEXKZ == '2');
			break;
		case 'HONO':
			this.byId("lblselectIndRetMS").setVisible(true);
			this.byId("selectIndRetS").setVisible(true);
			break;
		case 'PALT':
			this.byId("lblctaasocms").setVisible(false);
			this.byId("selectCtaAsocS").setVisible(false);
			break;
		}
		var oFilter = new sap.ui.model.Filter("LAND1",sap.ui.model.FilterOperator.Contains,data.LAND1);
		this.byId("selectRegionS").getBinding("items").filter([ oFilter ]);
		
		var oFilter1 = new sap.ui.model.Filter("LAND1",sap.ui.model.FilterOperator.Contains,data.LAND1);
		var oFilter2 = new sap.ui.model.Filter("REGIO",sap.ui.model.FilterOperator.Contains,data.REGIO);
		this.byId("selectComunasS").getBinding("items").filter([oFilter1,oFilter2 ]);
		
		var oFilter = new sap.ui.model.Filter("BANKS",sap.ui.model.FilterOperator.Contains,
				this.byId("selectPaiBankS").getSelectedKey());
		this.byId("selectClaBankS").getBinding("items").filter([ oFilter ]);
		var oFilter2 = new sap.ui.model.Filter("BANKS",sap.ui.model.FilterOperator.Contains,
				this.byId("selectPaiBankS2").getSelectedKey());
		this.byId("selectClaBankS2").getBinding("items").filter([ oFilter2 ]);
		var oFilter3 = new sap.ui.model.Filter("BANKS",sap.ui.model.FilterOperator.Contains,
				this.byId("selectPaiBankS3").getSelectedKey());
		this.byId("selectClaBankS3").getBinding("items").filter([ oFilter3 ]);
		
		this.byId("bancForm2S").setVisible(data.BANKN2 != '');

		this.byId("bancForm3S").setVisible(data.BANKN3 != '');
	},
	modifiData: function(data){
		var new_data = data;
		new_data.BUKRS_MULTI = data.BUKRS_MULTI.split('-');
		new_data.EKORG_MULTI = data.EKORG_MULTI.split('-');
		new_data.ZWELS = data.ZWELS.split('');
		return new_data;
	},
	onPress:function(oEvent){
		this.getView().byId("idSolicTable").setVisible(false);
		this.getView().byId("libFileList").setVisible(false);
		var omod = this.getOwnerComponent().getModel("device");
		var url = serviceUrlConsultaLib;
		var oContext = oEvent.getSource().getBindingContext();
        var id = oContext.getProperty("ID_SOLICITUD");
        var tipo = oContext.getProperty("TIPO_PROCESO");
        var _tipo = oContext.getProperty("TIPO_PROCESO");
        var wi = oContext.getProperty("WI");
        var wi_rh_task = oContext.getProperty("WI_RH_TASK");
        var area = oContext.getProperty("AREA_PROCESO");
        var oModel = new sap.ui.model.odata.ODataModel(url,true);
		var oView = this.getView();
		var that = this;
		oView.byId("tit").setObjectTitle("Solicitud: "+id);
		oView.byId("ObjectPageLayout").setVisible(false);
		oView.byId("comprasKeyB").setVisible(false);
		oView.byId("contabKeyB").setVisible(false);
		oView.byId("comprasKeyA").setVisible(false);
		oView.byId("contabKeyA").setVisible(false);
//		oView.byId("detalleMobile").setVisible(false);
		oView.byId("otbFooter").setVisible(false);
		this.getView().byId("btnLiberar").setVisible(true);
		this.getView().byId("btnRechazar").setVisible(true);
		this.getView().byId("btnRechazarFinal").setVisible(false);
		this.getView().byId("swift").setVisible(false);
		this.getView().byId("swift2").setVisible(false);
		this.getView().byId("swift3").setVisible(false);
//		this.getView().byId("swiftMob").setVisible(false);
		if(tipo === 'U' && id > 484){
			that.byId("modif-dos").setVisible(true);
			that.getDetalleModifDos(tipo,id);
			var oModel = new sap.ui.model.json.JSONModel();
			var oDataU = new Object();
			oDataU.WI=wi;
			oDataU.WI_RH_TASK=wi_rh_task;
			oDataU.ID_SOLICITUD=id;
			oDataU.TIPO_PROCESO=_tipo;
			oDataU.AREA_PROCESO=area;
			oModel.setData(oDataU);
			oView.setModel(oModel,"dataModel");
			console.log(oDataU);
			return;
		}
		oModel.read("/DetalleSolicitudSet(TIPO_PROCESO='"+tipo+"',ID_SOLICITUD='"+id+"')", null, [""], false,
				function(data, response) {
						oView.setBusy(false);			
						var _data = that.modifiData(data);
						_data.WI=wi;
						_data.WI_RH_TASK=wi_rh_task;
						_data.ID_SOLICITUD=id;
						_data.TIPO_PROCESO=_tipo;
						_data.AREA_PROCESO=area;
						if(area === 'CO'){
							that.getView().byId("libFileList").setVisible(true);
						}
						if(_tipo==='C'||_tipo==='U')
							_data.VISIBLE=true;
						else
							_data.VISIBLE=false;
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(_data);
						console.log(_data);
						oView.setModel(oModel,"dataModel");
						oView.byId("formContabAMob").setVisible(false);
						oView.byId("formCompraAMob").setVisible(false);
						oView.byId("formContabBCTADMMob").setVisible(false);
						oView.byId("formCompraBCPADMMob").setVisible(false);
						if(_data.TIPO_PROCESO==='C'){
							oView.byId("ObjectPageLayout").setVisible(true);
						}else if(_data.TIPO_PROCESO==='U'){
							oView.byId("ObjectPageLayout").setVisible(true);
						}else if(_data.TIPO_PROCESO==='E'){
							if(_data.TIPO_VISTA==='CP')
								oView.byId("comprasKeyA").setVisible(true);
							else
								oView.byId("contabKeyA").setVisible(true);
						}else if(_data.TIPO_PROCESO==='D'){
							if(_data.TIPO_VISTA==='CP')
								oView.byId("comprasKeyB").setVisible(true);
							else
								oView.byId("contabKeyB").setVisible(true);
						}
//						if(omod.oData.isNoPhone){
							//************
							that.byId("chk1BCPADM").setSelected(data.LOEVM === 'X');
							that.byId("chk1BCTADM").setSelected(data.LOEVM === 'X');
							that.byId("chk2BCPADM").setSelected((data.LOEVM_COMPRAS === 'X'));
							that.byId("chk3BCPADM").setSelected((data.SPERM === 'X'));
							that.byId("chk2BCTADM").setSelected((data.LOEVM_CONTABLE === 'X'));
							that.byId("chk3BCTADM").setSelected((data.NODEL === 'X'));
							that.byId("chk4BCTADM").setSelected((data.NODEL_CONTABLE === 'X'));
							//**********
							oView.byId("detalleMobile").setVisible(false);
							oView.byId("otbFooter").setVisible(false);
							if(!omod.oData.isNoPhone){
								oView.byId("otbFooter").setVisible(true);
							}
							that.sortForm(_data);
							oView.byId("idSolicTable").setVisible(false);
							that.getAttachFiles(_data.TIPO_PROCESO,id);
				}, function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
				});	
	},
	rechaza:function(){
		this.getView().byId("btnRechazar").setVisible(false);
		this.getView().byId("btnRechazarFinal").setVisible(true);		
	},
	rechazaFinal:function(){
		var oModelProceso = new sap.ui.model.json.JSONModel();
		oModelProceso = this.getView().getModel("dataModel");
		var wi = oModelProceso.getProperty('/WI');
		var wi_rh = oModelProceso.getProperty('/WI_RH_TASK');
		var id = oModelProceso.getProperty('/ID_PROCESO');
		var tipo = oModelProceso.getProperty('/TIPO_PROCESO');
		var that = this;
		var url = serviceUrlLib;
		var oModel = new sap.ui.model.odata.ODataModel(url,true/*,user,pass*/);
		var oEntry = {};
		oEntry.WI= wi;
		oEntry.STATUS= '02';
		oEntry.WI_RH_TASK=wi_rh;
		oEntry.ID_PROCESO=id;
		oEntry.TIPO_PROCESO=tipo;
	},
	libera:function(){
		this.getView().byId("btnRechazar").setVisible(true);
		this.getView().byId("btnRechazarFinal").setVisible(false);
		var oModelProceso = new sap.ui.model.json.JSONModel();
		oModelProceso = this.getView().getModel("dataModel");
		var wi = oModelProceso.getProperty('/WI');
		var wi_rh = oModelProceso.getProperty('/WI_RH_TASK');
		var id = oModelProceso.getProperty('/ID_PROCESO');
		var tipo = oModelProceso.getProperty('/TIPO_PROCESO');
		var status = '01';
		var url = serviceUrlLib;
		var that = this;
		var oModel = new sap.ui.model.odata.ODataModel(url,true/*,user,pass*/);
		var oEntry = {};
		oEntry.WI= wi;
		oEntry.STATUS= '01';
		oEntry.WI_RH_TASK=wi_rh;
		oEntry.ID_PROCESO=id;
		oEntry.TIPO_PROCESO=tipo;
		console.log("/LiberarSolicitudSet(WI='"+wi+"',STATUS='01',WI_RH_TASK='"+wi_rh+"',TIPO_PROCESO='"+tipo+"',ID_SOLICITUD='"+id+"')");
	},
	onLiberarDialog: function () {//**
		jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		
		var that = this;
		var oView = this.getView();
		var oInputView = sap.ui.view({
			id: "Acepta",
			viewName: "z_figesacrelib.view.utils.confirmaPopup",
			type: "XML"
		});
		var dialog = new Dialog({
			title: 'Confirmación',
			type: 'Message',
			content: oInputView,
			beginButton: new Button({
				text: 'Aceptar',
				press: function () {
					dialog.close();
					var oModelProceso = new sap.ui.model.json.JSONModel();
					oModelProceso = oView.getModel("dataModel");
					var wi = oModelProceso.getProperty('/WI');
					var wi_rh = oModelProceso.getProperty('/WI_RH_TASK');
					var id = oModelProceso.getProperty('/ID_PROCESO');
					var ids = oModelProceso.getProperty('/ID_SOLICITUD');
					var tipo = oModelProceso.getProperty('/TIPO_PROCESO');
					var status = '01';
					var url = serviceUrlLib;
					
					var oModel = new sap.ui.model.odata.ODataModel(url,true/*,user,pass*/);
					var oEntry = {};
					oEntry.WI= wi;
					oEntry.STATUS= '01';
					oEntry.WI_RH_TASK=wi_rh;
					oEntry.ID_PROCESO=id;
					oEntry.TIPO_PROCESO=tipo;
					oModel.update("/LiberarSolicitudSet(WI='"+wi+"',STATUS='01',WI_RH_TASK='"+wi_rh+"',TIPO_PROCESO='"+tipo+"',ID_SOLICITUD='"+ids+"')", oEntry, {
					    method: "PUT",
					    success: function(data) {
					    	MessageToast.show("Liberado.");
					    	that.onLibUploadFile(ids,tipo);
					    	that.volver();
					    },
					    error: function(e) {
					    	MessageToast.show("Error ("+e.getMessage+")." );
					    }
					   }); 
				}
			}),
			endButton: new Button({
				text: 'Cancelar',
				press: function () {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});
		dialog.open();
	},
	volver:function(){
		this.getView().byId("idSolicTable").setVisible(true);
		this.getView().byId("ObjectPageLayout").setVisible(false);
		this.getView().byId("comprasKeyB").setVisible(false);
		this.getView().byId("contabKeyB").setVisible(false);
		this.getView().byId("comprasKeyA").setVisible(false);
		this.getView().byId("contabKeyA").setVisible(false);
		this.getView().byId("detalleMobile").setVisible(false);
		this.getView().byId("otbFooter").setVisible(false);
		this.getView().byId("formContabBCTADMMob").setVisible(false);
		this.getView().byId("formCompraBCPADMMob").setVisible(false);
		this.getView().byId("formContabAMob").setVisible(false);
		this.getView().byId("formCompraAMob").setVisible(false);
		this.getView().byId("modif-dos").setVisible(false);
		this.reload();
	},
	filtrarListado:function(oEvent){
		var filters = [];
	    var query = oEvent.getParameter("query");
	    if (query && query.length > 0) {
	        
	        var oFilter2 = new sap.ui.model.Filter("NAME1", sap.ui.model.FilterOperator.Contains, query);
	        var oFilter3 = new sap.ui.model.Filter("TIPO_PROCESO_DESC", sap.ui.model.FilterOperator.Contains, query);
	        var oFilter5 = new sap.ui.model.Filter("KTOKK", sap.ui.model.FilterOperator.Contains, query);
	        var oFilter4 = new sap.ui.model.Filter("ERSDA", sap.ui.model.FilterOperator.Contains, query);
	        var oFilter1 = new sap.ui.model.Filter("GERENCIA", sap.ui.model.FilterOperator.Contains, query);
	        var oFilter6 = new sap.ui.model.Filter("UNAME", sap.ui.model.FilterOperator.Contains, query);
	        var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2,oFilter3,oFilter4,oFilter5,oFilter6]); 
	    }

	    var tabla = this.getView().byId("idSolicTable");
	    var binding = tabla.getBinding("items");
	    binding.filter(allFilter, sap.ui.model.FilterType.Application); 
		
	},
	onRechazoDialog: function () {//**
		jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var oModelProceso = new sap.ui.model.json.JSONModel();
		oModelProceso = this.getView().getModel("dataModel");
		var wi = oModelProceso.getProperty('/WI');
		var wi_rh = oModelProceso.getProperty('/WI_RH_TASK');
		var id = oModelProceso.getProperty('/ID_PROCESO');
		var idsol = oModelProceso.getProperty('/ID_SOLICITUD');
		var tipo = oModelProceso.getProperty('/TIPO_PROCESO');
		var area = oModelProceso.getProperty('/AREA_PROCESO');
		var that = this;
		var url = serviceUrlLib;
		var oModel = new sap.ui.model.odata.ODataModel(url,true/*,user,pass*/);
		var oEntry = {};
		oEntry.WI= wi;
		oEntry.STATUS= '02';
		oEntry.WI_RH_TASK=wi_rh;
		oEntry.ID_PROCESO=id;
		oEntry.TIPO_PROCESO=tipo;
		
		//Filtrar la lista de motivos
		var motivos = oStorage.get("motRechz");
		var filtrado = [];
		var oFiltro;
		   for(var i=0;i<motivos.length;i++){
			   var m = motivos[i];
			   if(m.AREA_PROCESO === area && m.TIPO_PROCESO === tipo){
				  var oFiltro = {
						  "MOTIVO_RECHAZO" : m.MOTIVO_RECHAZO,
						   "DESC_RECHAZO"  : m.DESC_RECHAZO
				  } 
				  filtrado.push(oFiltro); 
			   }
		   }
		   if(filtrado.length==0){
			   var oFiltro = {
						  "MOTIVO_RECHAZO" : "99",
						   "DESC_RECHAZO"  : "OTRO"
				  }
			   filtrado.push(oFiltro);
		   }
		   oStorage.put("filtrado",filtrado); 		
		var oInputView = sap.ui.view({
			id: "Acepta",
			viewName: "z_figesacrelib.view.utils.rechazoPopup",
			type: "XML"
		});
		var dialog = new Dialog({
			title: 'Obligatorio',
			type: 'Message',
			content: oInputView,
			
			beginButton: new Button({
				text: 'Aceptar',
				press: function () {
					var motivo = oStorage.get("mot");
					
					console.log("M>"+motivo);
					var sk = oInputView.byId('lista').getSelectedKey();
					if(motivo===""){
						that.onMessageErrorDialogPress();
					}else if(sk === '-1'){
						that.onMessageErrorDialogPress();
					}else{
						that.getView().setBusy(true);
						oEntry.MOTIVO_RECHAZO=motivo;
						console.log("/LiberarSolicitudSet(WI='"+wi+"',STATUS='02',WI_RH_TASK='"+wi_rh+"',TIPO_PROCESO='"+tipo+"',ID_SOLICITUD='"+idsol+"')"+oEntry);
						oModel.update("/LiberarSolicitudSet(WI='"+wi+"',STATUS='02',WI_RH_TASK='"+wi_rh+"',TIPO_PROCESO='"+tipo+"',ID_SOLICITUD='"+idsol+"')", oEntry, {
						    method: "PUT",
						    success: function(data) {
						    	MessageToast.show("Solicitud fue Rechazada.");
						    	that.volver();
						    },
						    error: function(e) {
						    	MessageToast.show("Error al Rechazar.");
						    }
						   });
						console.log("Rechazar : "); 	 
						that.getView().setBusy(false);
						dialog.close();
					}
				}
			}),
			endButton: new Button({
				text: 'Cancelar',
				press: function () {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});

		dialog.open();
	},
	onMessageErrorDialogPress: function () {//**
		var dialog = new Dialog({
			title: 'Motivo es obligatorio',
			type: 'Message',
			state: 'Error',
			content: new Text({
				text: "Indique Motivo."
			}),
			beginButton: new Button({
				text: 'Aceptar',
				press: function () {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});
	
		dialog.open();
	},
	rechazar: function(k){//**
		console.log("RECHAZAR...");	
	},
	onChange : function(oEvent) {
		var oUploadCollection = this.getView().byId("UploadCollection");
		

		var oCustomerHeaderToken2 = "";
		OData.request(
		{

			requestUri : "/FioriSCP.z_figesacrelib/sap/opu/odata/sap/ZODATA_FI_GEST_ACREEDOR_LIB_SRV/",
			method : "GET",
			async : false,
			headers : {
					"X-Requested-With" : "XMLHttpRequest",
					"Content-Type" : "application/atom+xml",
					"DataServiceVersion" : "2.0",
					"X-CSRF-Token" : "Fetch"
				}
			},
			function(data,
					response) {

				var header_xcsrf_token = response.headers['x-csrf-token'];
				oCustomerHeaderToken2 = new sap.m.UploadCollectionParameter(
						{
							name : "x-csrf-token",
							value : header_xcsrf_token

						});
			});
		oUploadCollection.addHeaderParameter(oCustomerHeaderToken2);
		

	},
	upload2:function(oEvent){
		var oUploadCollection = this.getView().byId("UploadCollection");
		var oCustomerHeaderToken2 = "";
		OData.request(
		{

			requestUri : "/FioriSCP.z_figesacrelib/sap/opu/odata/sap/ZODATA_FI_GEST_ACREEDOR_LIB_SRV/",
			method : "GET",
			async : false,
			headers : {
					"X-Requested-With" : "XMLHttpRequest",
					"Content-Type" : "application/atom+xml",
					"DataServiceVersion" : "2.0",
					"X-CSRF-Token" : "Fetch"
				}
			},
			function(data,
					response) {

				var header_xcsrf_token = response.headers['x-csrf-token'];
				oCustomerHeaderToken2 = new sap.m.UploadCollectionParameter(
						{
							name : "x-csrf-token",
							value : header_xcsrf_token

						});
			});
		oUploadCollection.addHeaderParameter(oCustomerHeaderToken2);
//		oUploadCollection.setUploadUrl("/sap/opu/odata/sap/ZODATA_FI_GEST_ACREEDOR_LIB_SRV/FileSet");
		console.log("token"+ oUploadCollection.getUploadUrl());
		oUploadCollection.upload();
	},
	onBeforeUploadStarts : function(
			oEvent) {
		// Header Slug
		var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter(
				{
					name : "slug",
					value : "C,10,tt.txt"
				});
		oEvent
				.getParameters()
				.addHeaderParameter(
						oCustomerHeaderSlug);
	},
	onStartUpload : function(oEvent) {
		var oUploadCollection = this	.getView()	.byId("UploadCollection");
		var cFiles = oUploadCollection	.getItems().length;
		var uploadInfo = cFiles	+ " file(s)";
		if (cFiles > 0) {
			oUploadCollection.upload();
		}
	},
	onUploadComplete : function(oEvent) {
		var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
		setTimeout(
				function() {
					var oUploadCollection = this.byId("UploadCollection");
					for (var i = 0; i < oUploadCollection
							.getItems().length; i++) {
						if (oUploadCollection
								.getItems()[i]
								.getFileName() === sUploadedFileName) {
							oUploadCollection
									.removeItem(oUploadCollection
											.getItems()[i]);
							break;
						}
					}

				}.bind(this), 8000);
	},
	onLibSelectFile: function(oEvent){
		var oView = this.getView();
		var oCupload = oEvent.getSource();
		var oFileList = this.byId('libFileListUp');
		var files = this.getView().getModel('FileModel').getProperty('/upFiles');
		var solFiles = this.getView().getModel('FileModel').getProperty('/files');
		var oFiles = oCupload.oFileUpload.files;
		var total = solFiles.length + files.length;
		if((total === 3 && files.length === 2) || (total === 2 && solFiles.length === 0)){
			sap.m.MessageBox.error('Solo se pueden subir dos archivo.');
			return;
		}
		if(total === 3 && files.length === 1){
			sap.m.MessageBox.error('Solo se pueden subir un archivo.');
			return;	
		}
		else{
			oView.setBusy(true);
			var oFile = new Object();
			oFile.name = oFiles[0].name;
			oFile.type = oFiles[0].type;
			var reader = new FileReader();
			reader.readAsDataURL(oFiles[0]);
			reader.onload = function () {
				oFile.base64 =  reader.result;
				files.push(oFile);
				oView.setBusy(false);
				oView.getModel('FileModel').setProperty('/upFiles',files);
			};
			reader.onerror = function (error) {
				oView.setBusy(false);
				sap.m.MessageBox.error('Error: ', error);
			};
		}
	},
	onDeleteLibFile: function(oEvent){
		var ctx = oEvent.getParameters('listItem').listItem.getBindingContext('FileModel');
		var sPath = ctx.sPath;
		var aItems = this.getView().getModel('FileModel').getProperty('/upFiles');
		var oItem = this.getView().getModel('FileModel').getProperty(sPath);
		aItems.splice(aItems.indexOf(oItem),1);
		this.getView().getModel('FileModel').setProperty('/upFiles',aItems);
	},
	getAttachFiles:function(tipo,id){
		//clear model
		this.getView().getModel('FileModel').setProperty('/files',[]);
		this.getView().getModel('FileModel').setProperty('/lastData',null);
		var oList = this.byId('libFileList');
		oList.setBusy(true);
		var oModel = new sap.ui.model.odata.ODataModel(serviceUrlConsultaLib,true);
		var that = this;
		oModel.read("/FileSet(TIPO_PROCESO='"+tipo+"',ID_SOLICITUD='"+id+"')", null, [""], true,
				function(data, response) {
			if(data.STATUS === 'S'){
				oList.setBusy(false);
				var aFiles = [];
				if(data.FILE1 !== ''){
					var oFile = new Object();
					oFile.file = data.FILE1;
					oFile.name = data.NAME1;
					oFile.type = data.TYPE1;
					aFiles.push(oFile);
				}if(data.FILE2 !== ''){
					var oFile = new Object();
					oFile.file = data.FILE2;
					oFile.name = data.NAME2;
					oFile.type = data.TYPE2;
					aFiles.push(oFile);
				}if(data.FILE3 !== ''){
					var oFile = new Object();
					oFile.file = data.FILE3;
					oFile.name = data.NAME3;
					oFile.type = data.TYPE3;
					aFiles.push(oFile);
				}
			that.getView().getModel('FileModel').setProperty('/files',aFiles);
			that.getView().getModel('FileModel').setProperty('/lastData',data);
			}else{
//				MessageToast.show(data.MESSAGE);
				oList.setBusy(false);
			}
		}, function(err) {
			oList.setBusy(false);
			var errTxt = err.message + "\n";
			sap.m.MessageBox.err(errTxt, sap.m.MessageBox.Icon.ERROR, "Error al intentar comprobar archivos adjuntos.");
		});	
		
	},
	onLibFilePress: function(oEvent){
		var oItemList = oEvent.getSource();
		var ctx = oItemList.getBindingContext('FileModel');
		oItemList.setBusy(true);
		var sPath = ctx.sPath;
		//var aItems = this.getView().getModel('FileModel').getProperty('/MSFiles');
		var oItem = this.getView().getModel('FileModel').getProperty(sPath);
		var byteCharacters = atob(oItem.file);
		const byteNumbers = new Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
		    byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		var blob = new Blob([byteArray], { type: oItem.type });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		oItemList.setBusy(false);
		link.download = oItem.name;
		document.body.append(link);
		link.click();
		link.remove();
		window.addEventListener('focus', e=>URL.revokeObjectURL(link.href), {once:true});
	},
	onLibUploadFile : function(ID_SOLICITUD,TIPO_PROCESO){
		var oModel = new sap.ui.model.odata.ODataModel(serviceUrlConsultaLib, true);
		var that = this;
		var files = this.getView().getModel('FileModel').getProperty('/upFiles');
		var solFiles = this.getView().getModel('FileModel').getProperty('/files');
		if(files.length === 0){
			return;
		}
		var oData = this.getView().getModel('FileModel').getProperty('/lastData');;
		delete oData.STATUS;
		delete oData.MESSAGE;
		if(solFiles.length === 0 && files.length === 1){
			oData.FILE1 = files[0].base64.split(',')[1];
			oData.NAME1 = files[0].name;
			oData.TYPE1 = files[0].type;
		}
		if(solFiles.length === 0 && files.length === 2){
			oData.FILE1 = files[0].base64.split(',')[1];
			oData.NAME1 = files[0].name;
			oData.TYPE1 = files[0].type;
			oData.FILE2 = files[1].base64.split(',')[1];
			oData.NAME2 = files[1].name;
			oData.TYPE2 = files[1].type;
		}
		if(solFiles.length === 1 && files.length === 1){
			oData.FILE2 = files[0].base64.split(',')[1];
			oData.NAME2 = files[0].name;
			oData.TYPE2 = files[0].type;
		}
		if(solFiles.length === 1 && files.length === 2){
			oData.FILE2 = files[0].base64.split(',')[1];
			oData.NAME2 = files[0].name;
			oData.TYPE2 = files[0].type;
			oData.FILE3 = files[1].base64.split(',')[1];
			oData.NAME3 = files[1].name;
			oData.TYPE3 = files[1].type;
		}
		if(solFiles.length === 2 && files.length === 1){
			oData.FILE3 = files[0].base64.split(',')[1];
			oData.NAME3 = files[0].name;
			oData.TYPE3 = files[0].type;
		}
		oModel.update("/FileSet(TIPO_PROCESO='"+oData.TIPO_PROCESO+"',ID_SOLICITUD='"+oData.ID_SOLICITUD+"')", oData,true, {
			method: "PUT",
			success: function(data) {
				that.getView().getModel('FileModel').setProperty('/upFiles',[]);
			},
			error: function(e) {
				sap.m.MessageBox.error(e.message);
			}
		});
	},
	getDetalleModifDos: function(tipo,id){
		var oComModi = this.byId('modif-dos');
		var that = this;
		var oModel = new sap.ui.model.odata.ODataModel(serviceUrlConsultaLib, true);
		that.getView().setBusy(true);
		oModel.read(
				"/DetalleModificacionSet?$filter=(TIPO_PROCESO eq '"+tipo+"' and ID_PROCESO eq '"+id+"')",
				null,[ "" ],false,
				function(data,response) {
					that.getView().setBusy(false);
					that.getView().setModel(new JSONModel({items : data.results}),'MDM');
					console.log(oComModi.getModel('MDM'));
				},
				function(err) {
					that.getView().setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
				}
		);
	},
	});
});