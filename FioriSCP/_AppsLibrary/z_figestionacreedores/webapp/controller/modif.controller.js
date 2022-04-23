	sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/core/format/DateFormat",
		"z_figestionacreedores/view/utils/connectivity"
	], function(Controller, JSONModel, MessageToast, MessageBox,DateFormat) {
		"use strict";

		return Controller.extend("z_figestionacreedores.controller.modif", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf romrecepcont.reporte
*/
	onInit: function() {
		this.getView().byId("objPageScG").setVisible(false);
		this.getView().byId("objPageScS").setVisible(false);
		this.getView().byId("objPageScC").setVisible(false);
		this.getView().byId("objPageScA").setVisible(false);
		this.getView().byId("objPageScO").setVisible(false);
		this.getView().byId("btnValidar").setVisible(false);
		this.getView().byId("btnValidar").setEnabled(false)
		this.getView().byId("btnGuardar").setVisible(false);
		this.getView().byId("btnGuardar").setEnabled(false);
		this.getView().byId("gsg").setVisible(false);
		this.getView().byId("selectAprobadores").setVisible(false);
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
		var selectBancos = this.getView().byId("selectClaBank");
		var selectComunas = this.getView().byId("selectComunas");
		
		var oModel = new sap.ui.model.odata.ODataModel(url,true);
		oModel.read("/InfoInicialSet?$filter=(Proceso eq 'M')" +
				"&$expand=NAVSociedades,NAVMonedas,NAVPaises," +
				"NAVOrgCompras,NAVGrpCuentas,NAVCondPago," +
				"NAVPaisesRegiones,NAVGerencias,NAVPaisRegComunas,NAVBancos", null, [""], false,
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
				
				var oModelPR = new sap.ui.model.json.JSONModel();
				var resultPR = result[0].NAVPaisesRegiones.results;
				oModelPR.setData({
					Regiones : resultPR});
				selectRegion.setModel(oModelPR);
//				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
//				oStorage.put("PaisesRegiones",resultPR);
				
				var oModelMoneda = new sap.ui.model.json.JSONModel();
				var resultMonedas = result[0].NAVMonedas.results;
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
				
				var oModelCondPago = new sap.ui.model.json.JSONModel();
				var resultCondPago = result[0].NAVCondPago.results;
				oModelCondPago.setData({
					CondPago : resultCondPago});
				selectCondPagoS.setModel(oModelCondPago);
				selectCondPagoC.setModel(oModelCondPago);
				
				var oModelAprobadores = new sap.ui.model.json.JSONModel();
				var resultGerencias = result[0].NAVGerencias.results;
				oModelAprobadores.setData({
					Aprobadores : resultGerencias});
				selectAprobadores.setModel(oModelAprobadores);
				
				var oModelBancos = new sap.ui.model.json.JSONModel();
				var resultBancos = result[0].NAVBancos.results;
				oModelBancos.setData({
					Bancos : resultBancos});
				selectBancos.setModel(oModelBancos);
				var oModelComunas = new sap.ui.model.json.JSONModel();
				var resultComunas = result[0].NAVPaisRegComunas.results;
				oModelComunas.setData({
					Comunas : resultComunas});
				selectComunas.setModel(oModelComunas);
			}, function(err) {
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
			});	
	},
	onSearchAcr:function(oEvent){
		this.getView().byId("gsg").setVisible(false);
		this.getView().byId("selectAprobadores").setVisible(false);
		var lifnr = this.getView().byId("idAcr").getValue();
		this.getView().byId("btnGuardar").setEnabled(false);
		var lif=this.pad(lifnr);
		var url = serviceUrl;
		var oView = this.getView();
		oView.setBusy(true);
		var that = this;
		var oModel = new sap.ui.model.odata.ODataModel(url,true/*,user,pass*/);
		oModel.read("/ConsultarAcreedorSet(LIFNR='"+lif+"',TIPO_PROCESO='U',TIPO_VISTA='')", null, ["" ], false,
		function(data, response) {
				oView.setBusy(false);
				var result = data;
				console.log(data.KTOKK);
				if(result.STATUS==='S'){
					oView.byId("btnValidar").setEnabled(false)
					oView.byId("objPageScG").setVisible(true);
					oView.byId("objPageScS").setVisible(true);
					oView.byId("objPageScC").setVisible(true);
					oView.byId("objPageScA").setVisible(true);
					oView.byId("objPageScO").setVisible(true);
					oView.byId("btnValidar").setVisible(true);
					oView.byId("btnGuardar").setVisible(true);
					oView.byId("gsg").setVisible(true);
					oView.byId("selectAprobadores").setVisible(true);
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(result);
					oView.setModel(oModel,"dataModel");
					oView.byId("txtSociedades").setValue(result.BUKRS_MULTI);
					var grpcta = result.KTOKK;
					if(grpcta==='PEXT'){
						var sex = result.SEXKZ;
						if(sex==='1'){
							oView.byId("RB1-1").selected(true); //id cliente extranjero= 90959
							oView.byId("RB1-2").selected(false);
						}else if(sex==='2'){
							oView.byId("RB1-1").setSelected(false);
							oView.byId("RB1-2").setSelected(true);
						}else{
							oView.byId("RB1-1").setSelected(false);
							oView.byId("RB1-2").setSelected(false);
						}
						oView.byId("fna").setVisible(true);
						oView.byId("lblfna").setVisible(true);
						oView.byId("lna").setVisible(true);
						oView.byId("lbllna").setVisible(true);
						oView.byId("sex").setVisible(true);
						oView.byId("lblsex").setVisible(true);
						oView.byId("pro").setVisible(true);
						oView.byId("lblpro").setVisible(true);
					}else{
						oView.byId("fna").setVisible(false);
						oView.byId("lblfna").setVisible(false);
						oView.byId("lna").setVisible(false);
						oView.byId("lbllna").setVisible(false);
						oView.byId("sex").setVisible(false);
						oView.byId("lblsex").setVisible(false);
						oView.byId("pro").setVisible(false);
						oView.byId("lblpro").setVisible(false);
					}
					
						
					that.onChangePais();
				}else{
					MessageToast.show(result.MESSAGE);
					oView.byId("objPageScG").setVisible(false);
					oView.byId("objPageScS").setVisible(false);
					oView.byId("objPageScC").setVisible(false);
					oView.byId("objPageScA").setVisible(false);
					oView.byId("objPageScO").setVisible(false);
					oView.byId("btnValidar").setVisible(false);
					oView.byId("btnGuardar").setVisible(false);
					oView.byId("btnGuardar").setEnabled(false);
					oView.byId("gsg").setVisible(false);
					oView.byId("selectAprobadores").setVisible(false);
				}
			}, function(err) {
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
			});	
		},
		onChangePais:function(oEvent){
			this.getView().byId("btnGuardar").setEnabled(false);
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
			this.onChangeRegion();
			
		},
		onChangePaisBank:function(oEvent){
			this.getView().byId("btnGuardar").setEnabled(false);
			var selectClaBank = this.getView().byId("selectClaBank");
			var seleccPais = this.getView().byId("selectPaiBank").getSelectedKey();
			var oFilter = new sap.ui.model.Filter("BANKS", sap.ui.model.FilterOperator.Contains, seleccPais);
			selectClaBank.getBinding("items").filter([oFilter]);
			
			console.log(seleccPais);
			
			
		},
		onChangeRegion:function(oEvent){
			this.getView().byId("btnGuardar").setEnabled(false);
			var selectComunas = this.getView().byId("selectComunas");
			var seleccPais = this.getView().byId("selectPais").getSelectedKey();
			var seleccRegion = this.getView().byId("selectRegion").getSelectedKey();
			var oFilter1 = new sap.ui.model.Filter("LAND1", sap.ui.model.FilterOperator.Contains, seleccPais);
			var oFilter2 = new sap.ui.model.Filter("REGIO", sap.ui.model.FilterOperator.Contains, seleccRegion);
			selectComunas.getBinding("items").filter([oFilter1,oFilter2]);
			
			console.log(seleccPais+seleccRegion);
			
			
		},
		onSave:function(){
			var that = this;
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			
			var oModel = new sap.ui.model.odata.ODataModel(url,true);
			var oEntry = new sap.ui.model.json.JSONModel();
			var lifnr = oView.byId("lifnr").getValue();
			
			var anred = oView.byId("selectTrat").getSelectedKey();//tratamiento
			var name1 = oView.byId("name1").getValue();//nombre acreedor
			var ktokk = oView.byId("inpKtokk").getValue();//grupo acreedor
			var sort = oView.byId("concep").getValue();//Concepto
			var stras = oView.byId("direc").getValue();//Direccion calle num
			var ciuda = oView.byId("txtCiudad").getValue();//ciudad
			var comun = oView.byId("txtComuna").getValue();//comuna
			var regio = oView.byId("selectRegion").getSelectedKey();//Region
			var land1 = oView.byId("selectPais").getSelectedKey();//Region
			var telf  = oView.byId("telf").getValue();//Telefono
			var email1 = oView.byId("email1").getValue();//email
			var email2 = oView.byId("email2").getValue();//email cobranza
			var stcd1 = oView.byId("stcd1").getValue();//rut 
			var kunnr = oView.byId("kunnr").getValue();//deudor
			var emnfr = oView.byId("emnfr").getValue();//fab externo
			var banks = oView.byId("selectPaiBank").getSelectedKey();//pais banco
			var bankn = oView.byId("cta").getValue();//cta banco
			var koinh = oView.byId("titcta").getValue();//titular cta banco
			var bukrs = oView.byId("txtSociedades").getValue();//sociedades
			var iban  = oView.byId("iban").getValue();//iban
			var zterm = oView.byId("selectCondPagoS").getSelectedKey();//condicion de pago
			var zterm_compra = oView.byId("selectCondPagoC").getSelectedKey();//condicion de pago
			var waers = oView.byId("selectMoneda").getSelectedKey();//condicion de pago
			var ekorg = oView.byId("txtEkorg").getText();//org compras
			var apro = oView.byId("selectAprobadores").getSelectedKey();
			var obs = oView.byId("txtObs").getValue();
			oEntry =
			{
			    "TIPO_PROCESO" : 'U',
			    "ID_SOLICITUD" : '',
			    "LIFNR" : lifnr,
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
			    "KUNNR" : kunnr,
			    "EMNFR" : emnfr,
			    "BANKS" : banks,
			    "BANKL" : '',
			    "BANKN" : bankn,
			    "KOINH" : koinh,
			    "BUKRS" : '',
			    "HKONT" : '',
			    "IBAN" : iban,
			    "FDGRV" : '',
			    "ZTERM" : zterm,
			    "ZTERM_COMPRAS" : zterm_compra,
			    "ZWELS" : '',
			    "EKORG" : '',
			    "WAERS" : waers,
			    "BUKRS_MULTI" : bukrs,
			    "EKORG_MULTI" : ekorg,
			    "APROBADOR" : apro,
			    "OBS" : obs
			  };
			
				oModel.create("/CrearSolicitudSet", oEntry, null,function(data) {
				    	oView.setBusy(false);
				    	if(data.STATUS==='S'){
				    		MessageToast.show("Solicitud creada, ID= "+data.MESSAGE);
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
		onValida:function(){
			var ok = true;
			var oView = this.getView();
			var socs = [];
			
			this.getView().byId("name1").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("concep").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("direc").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("stcd1").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("email1").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("email2").setValueState(sap.ui.core.ValueState.None);
//			socs = oView.byId("selectSociedades").getSelectedKeys();
			var gcom = [];
//			gcom = oView.byId("selectGrpComp").getSelectedKeys();
			//Rut
			var Fn = {
					// Valida el rut con su cadena completa "XXXXXXXX-X"
					validaRut : function (rutCompleto) {
						if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( rutCompleto ))
							return false;
						var tmp 	= rutCompleto.split('-');
						var digv	= tmp[1]; 
						var rut 	= tmp[0];
						if ( digv == 'K' ) digv = 'k' ;
						return (Fn.dv(rut) == digv );
					},
					dv : function(T){
						var M=0,S=1;
						for(;T;T=Math.floor(T/10))
							S=(S+T%10*(9-M++%6))%11;
						return S?S-1:'k';
					}
				}
			//Emails
			var email1 = this.getView().byId("email1").getValue();
			var email2 = this.getView().byId("email2").getValue();
			var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			
//			if(oView.byId("selectGrpCta").getSelectedIndex()==-1){
//				ok=false;
//				MessageToast.show("Indique Grupo de Cuentas");
//			
//			}else 
				if(oView.byId("selectTrat").getSelectedIndex()==-1){
				ok=false;
				MessageToast.show("Indique tratamiento.");
			
			}else if(oView.byId("name1").getValue()==''||oView.byId("name1").getValue().trim()==''){
				ok=false;
				MessageToast.show("Nombre obligatorio.");
				this.getView().byId("name1").setValueState(sap.ui.core.ValueState.Error);
			}else if(oView.byId("concep").getValue().trim()==''){
				ok=false;
				MessageToast.show("Concepto obligatorio.");
				this.getView().byId("concep").setValueState(sap.ui.core.ValueState.Error);
			}else if(oView.byId("direc").getValue()==''||oView.byId("direc").getValue().trim()==''){
				ok=false;
				MessageToast.show("Indique Dirección/Calle.");
				this.getView().byId("direc").setValueState(sap.ui.core.ValueState.Error);
			}else if(oView.byId("selectPais").getSelectedKey()==="CL" && oView.byId("selectRegion").getSelectedIndex()==-1){
					ok=false;
					MessageToast.show("Indique región.");
			}else if(oView.byId("selectPais").getSelectedIndex()==-1){
				ok=false;
				MessageToast.show("Indique país.");
			
			}else if(oView.byId("stcd1").getValue().trim()==''){
				ok=false;
				MessageToast.show("Indique N° Id.fiscal.");
				this.getView().byId("stcd1").setValueState(sap.ui.core.ValueState.Error);
			}else if(!Fn.validaRut(oView.byId("stcd1").getValue())){
				MessageToast.show('Rut inválido');
				ok=false;
				this.getView().byId("stcd1").setValueState(sap.ui.core.ValueState.Error);
//			}else if(socs.length==0){
//				ok=false;
//				MessageToast.show("Indique Sociedad(es).");
			
//			}else if(gcom.length==0){
//				ok=false;
//				MessageToast.show("Indique grupo(s) de compra.");
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
			
			if(email1!=null && email1 !=''){
			   if (!mailregex.test(email1)) {
			      MessageToast.show(email1 + " no es un e-mail válido.");
			      this.getView().byId("email1").setValueState(sap.ui.core.ValueState.Error);
			      ok=false;
			   }
			}
			if(email2!=null && email2 !=''){
			   if (!mailregex.test(email2)) {
			      MessageToast.show(email2 + " no es un e-mail válido.");
			      this.getView().byId("email2").setValueState(sap.ui.core.ValueState.Error);
			      ok=false;
			   }
			}
			if(ok)
				oView.byId("btnGuardar").setEnabled(true);
			else
				oView.byId("btnGuardar").setEnabled(false);
				
		},
		onChangeTelef:function(oEvent){
			
			var _oInput = oEvent.getSource();
			var val = _oInput.getValue();
			val = val.replace(/[^\d]/g, '');
			_oInput.setValue(val);
			this.disableSave();
		},
		pad:function (n) {
			 
		  n = n + '';
		  return n.length >= 10 ? n : new Array(10 - n.length + 1).join(0) + n;
		},
		disableSave:function(){
			this.getView().byId("btnGuardar").setEnabled(false);
			this.getView().byId("btnValidar").setEnabled(true)
		},
		reset:function(){
			this.getView().byId("objPageScG").setVisible(false);
			this.getView().byId("objPageScS").setVisible(false);
			this.getView().byId("objPageScC").setVisible(false);
			this.getView().byId("objPageScA").setVisible(false);
			this.getView().byId("objPageScO").setVisible(false);
			this.getView().byId("btnValidar").setVisible(false);
			this.getView().byId("btnGuardar").setVisible(false);
			this.getView().byId("btnGuardar").setEnabled(false);
			this.getView().byId("gsg").setVisible(false);
			this.getView().byId("selectAprobadores").setVisible(false);
			this.getView().byId("idAcr").setValue("");
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
	