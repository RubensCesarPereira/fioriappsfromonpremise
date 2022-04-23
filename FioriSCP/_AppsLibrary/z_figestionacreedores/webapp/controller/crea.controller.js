	sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/core/format/DateFormat",
		"z_figestionacreedores/view/utils/connectivity"
	], function(Controller, JSONModel, MessageToast, MessageBox,DateFormat) {
		"use strict";

		return Controller.extend("z_figestionacreedores.controller.crea", {

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
		var selectAprobadores = this.getView().byId("selectAprobadores");
		var selectBancos = this.getView().byId("selectClaBank");
		var selectComunas = this.getView().byId("selectComunas");
		
		var oModel = new sap.ui.model.odata.ODataModel(url,true);
		oModel.read("/InfoInicialSet?$filter=(Proceso eq 'C') " +
				"&$expand=NAVSociedades,NAVMonedas,NAVPaises," +
				"NAVOrgCompras,NAVGrpCuentas,NAVCondPago," +
				"NAVPaisesRegiones,NAVGerencias,NAVPaisRegComunas,NAVBancos", 
				null, ["" ], false,
		function(data, response) {
				oView.setBusy(false);
				jQuery.sap.require("jquery.sap.storage");
				
				var result = data.results;
				var oModelPais = new sap.ui.model.json.JSONModel();
				var oModelPaisB = new sap.ui.model.json.JSONModel();
				var resultPaises = result[0].NAVPaises.results;
				oModelPais.setData({
					Paises : resultPaises});
				oModelPaisB.setData({
					Paises : resultPaises});
				oModelPais.setSizeLimit(resultPaises.length);
				oModelPaisB.setSizeLimit(resultPaises.length);
				selectPaises.setModel(oModelPais);
				selectPaiBank.setModel(oModelPaisB);
				
				
				var oModelPR = new sap.ui.model.json.JSONModel();
				var resultPR = result[0].NAVPaisesRegiones.results;
				oModelPR.setData({
					Regiones : resultPR});
				selectRegion.setModel(oModelPR);
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
				oStorage.put("PaisesRegiones",resultPR);
				
				var oModelMoneda = new sap.ui.model.json.JSONModel();
				var resultMonedas = result[0].NAVMonedas.results;
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
				
				oView.byId("selectPais").setSelectedKey("CL");//Region
				that.onChangePais();
				oView.byId("selectMoneda").setSelectedKey("CLP");//condicion de pago
				
				oView.byId("selectPaiBank").setSelectedKey("CL");//pais banco
				that.onChangePaisBank();
				selectGrpCta.setSelectedIndex(0);
				that.onChangeGrpCta();
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
			var kunnr = oView.byId("kunnr").getValue();//deudor
			var emnfr = oView.byId("emnfr").getValue();//fab externo
			var banks = oView.byId("selectPaiBank").getSelectedKey();//pais banco
			var bankn = oView.byId("cta").getValue();//cta banco
			var koinh = oView.byId("titcta").getValue();//titular cta banco
			var bukrs = [];
			bukrs = oView.byId("selectSociedades").getSelectedKeys();//sociedades
			var iban = oView.byId("iban").getValue();//iban
			var zterm = oView.byId("selectCondPagoS").getSelectedKey();//condicion de pago
			var zterm_compra = oView.byId("selectCondPagoC").getSelectedKey();//condicion de pago
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
			var aprobador = oView.byId("selectAprobadores").getSelectedKey();
			var obs = oView.byId("txtObs").getValue();
			var masc = oView.byId("RB1-1").getSelected();
			var feme = oView.byId("RB1-2").getSelected();
			
			var sex='2';
			if(masc)
				sex='1';
			var fnac = oView.byId("fna").getValue();	//Fecha nacimiento
			var lnac = oView.byId("lna").getValue();	//Lugar nacimiento
			var prof = oView.byId("pro").getValue();	//Profesion
			
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
			    "PROFS" : prof,
			    "SEXKZ" : sex,
			    "GBDAT" : fnac,
			    "GBORT" : lnac,
			    "STCD1" : stcd1,
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
			    "ZTERM_COMPRAS" : zterm_compra,
			    "ZWELS" : '',
			    "EKORG" : ekorg_single,
			    "WAERS" : waers,
			    "BUKRS_MULTI" : bukrs_multi,
			    "EKORG_MULTI" : ekorg_multi,
			    "APROBADOR" : aprobador,
			    "OBS" : obs,
			    
			  };
			
			oModel.create("/CrearSolicitudSet", oEntry, null,function(data) {
			    	oView.setBusy(false);
			    	if(data.STATUS==='S'){
			    		MessageToast.show("Solicitud creada, ID= "+data.MESSAGE);
			    		oView.byId("btnGuarda").setEnabled(false);
			    		//TODO descomentar
//				    	that.reset();
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
		reset:function(){
			var oView = this.getView();
			oView.byId("selectGrpCta").setSelectedItem(0);
			this.onChangeGrpCta();
			
			oView.byId("selectTrat").setSelectedKey("");//tratamiento
			oView.byId("name1").setValue("");//nombre acreedor
			oView.byId("selectGrpCta").setSelectedIndex(-1);//grupo acreedor
			oView.byId("concep").setValue("");//Concepto
			oView.byId("direc").setValue("");//Direccion calle num
			oView.byId("txtCiudad").setValue("");
			oView.byId("txtComuna").setValue("");
			oView.byId("selectRegion").setSelectedIndex(-1);//Region
			oView.byId("selectPais").setSelectedKey("CL");//Region
			this.onChangePais();
			oView.byId("telf").setValue("");//Telefono
			oView.byId("email1").setValue("");//email
			oView.byId("email2").setValue("");//email cobranza
			oView.byId("stcd1").setValue("");//rut 
			oView.byId("kunnr").setValue("");//deudor
			oView.byId("emnfr").setValue("");//fab externo
			oView.byId("selectPaiBank").setSelectedKey("CL");//pais banco
			this.onChangePaisBank();
			oView.byId("cta").setValue("");//cta banco
			oView.byId("titcta").setValue("");//titular cta banco
			oView.byId("selectSociedades").clearSelection();//sociedades
			oView.byId("iban").setValue("");//iban
			oView.byId("selectGrpComp").clearSelection();
			oView.byId("selectMoneda").setSelectedKey("CLP");//condicion de pago
			oView.byId("txtObs").setValue("");
			oView.byId("selectGrpComp").clearSelection();
			oView.byId("selectSociedades").clearSelection();
			oView.byId("selectAprobadores").setSelectedIndex(-1);
			oView.byId("fna").setVisible(false);
			oView.byId("fna").setValue("");
			oView.byId("lblfna").setVisible(false);
			oView.byId("lna").setVisible(false);
			oView.byId("lna").setValue("");
			oView.byId("lbllna").setVisible(false);
			oView.byId("sex").setVisible(false);
			oView.byId("sex").selectedIndex(0);
			oView.byId("lblsex").setVisible(false);
			oView.byId("lblpro").setVisible(false);
			oView.byId("pro").setVisible(false);
			oView.byId("lblstcd1").setVisible(true);
			oView.byId("stcd1").setVisible(true);
			oView.byId("pro").setValue("");
			
			
		}, 
		valida:function(){
			var ok = true;
			var oView = this.getView();
			var pext = (oView.byId("selectGrpCta").getSelectedKey()==='PEXT')?true:false;
			oView.byId("name1").setValueState(sap.ui.core.ValueState.None);
			oView.byId("concep").setValueState(sap.ui.core.ValueState.None);
			oView.byId("direc").setValueState(sap.ui.core.ValueState.None);
			oView.byId("stcd1").setValueState(sap.ui.core.ValueState.None);
			oView.byId("email1").setValueState(sap.ui.core.ValueState.None);
			oView.byId("email2").setValueState(sap.ui.core.ValueState.None);
			oView.byId("fna").setValueState(sap.ui.core.ValueState.None);
			oView.byId("lna").setValueState(sap.ui.core.ValueState.None);
			oView.byId("pro").setValueState(sap.ui.core.ValueState.None);
			var socs = [];
			socs = oView.byId("selectSociedades").getSelectedKeys();
			var gcom = [];
			gcom = oView.byId("selectGrpComp").getSelectedKeys();
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
			
			if(oView.byId("selectGrpCta").getSelectedIndex()==-1){
				ok=false;
				MessageToast.show("Indique Grupo de Cuentas");
			
			}else if(oView.byId("selectTrat").getSelectedIndex()==-1){
				ok=false;
				MessageToast.show("Indique tratamiento.");
			
			}else if(oView.byId("name1").getValue().trim()==''){
				ok=false;
				MessageToast.show("Nombre obligatorio.");
				this.getView().byId("name1").setValueState(sap.ui.core.ValueState.Error);
			}else if(oView.byId("concep").getValue().trim()==''){
				ok=false;
				MessageToast.show("Concepto obligatorio.");
				this.getView().byId("concep").setValueState(sap.ui.core.ValueState.Error);
			}else if(oView.byId("direc").getValue().trim()==''){
				ok=false;
				MessageToast.show("Indique Dirección/Calle.");
				this.getView().byId("direc").setValueState(sap.ui.core.ValueState.Error);
			}else if(oView.byId("txtCiudad").getValue().trim()==''){
				ok=false;
				MessageToast.show("Indique Ciudad.");
				this.getView().byId("txtCiudad").setValueState(sap.ui.core.ValueState.Error);
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
			}else if(!pext &&(!Fn.validaRut(oView.byId("stcd1").getValue()))){
				MessageToast.show('Rut inválido');
				ok=false;
				this.getView().byId("stcd1").setValueState(sap.ui.core.ValueState.Error);
			}else if(pext && oView.byId("fna").getValue().trim()==''){
				ok=false;
				MessageToast.show("Indique Fecha Nacimiento.");
				this.getView().byId("fna").setValueState(sap.ui.core.ValueState.Error);
			}else if(pext && oView.byId("lna").getValue().trim()==''){
				ok=false;
				MessageToast.show("Indique lugar de nacimiento.");
				this.getView().byId("lna").setValueState(sap.ui.core.ValueState.Error);
			}else if(pext && oView.byId("pro").getValue().trim()==''){
				ok=false;
				MessageToast.show("Indique profesión.");
				this.getView().byId("pro").setValueState(sap.ui.core.ValueState.Error);
			}else if(pext &oView.byId("sex").getSelectedIndex==0){
				ok=false;
				MessageToast.show("Indique sexo.");
				this.getView().byId("sex").setValueState(sap.ui.core.ValueState.Error);
			}else if(socs.length==0){
				ok=false;
				MessageToast.show("Indique Sociedad(es).");
			
			}else if(gcom.length==0){
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
			if(ok){
				oView.byId("btnGuarda").setEnabled(true);
				
			}else{
				oView.byId("btnGuarda").setEnabled(false);
			}
				
		},
		
		onChangeTelef:function(oEvent){
			
			var _oInput = oEvent.getSource();
			var val = _oInput.getValue();
			val = val.replace(/[^\d]/g, '');
			_oInput.setValue(val);
			this.disableSave();
		},
		onChangeGrpCta:function(oEvent){
			
			var item = this.getView().byId("selectGrpCta").getSelectedItem();
			var context = item.getBindingContext("GrpCta");
	        var arrayObject = context.oModel.getProperty(context.sPath);
	        var condPagoSelec = arrayObject.ZTERM;
			this.getView().byId("selectCondPagoS").setSelectedKey(condPagoSelec);
			this.getView().byId("selectCondPagoC").setSelectedKey(condPagoSelec);
			//INI - GRUPO CTAS PEXT
			var grupoctaselec = this.getView().byId("selectGrpCta").getSelectedKey();
			console.log("grp cta: "+grupoctaselec);
			if(grupoctaselec==='PEXT'){
				this.getView().byId("fna").setVisible(true);
				this.getView().byId("lblfna").setVisible(true);
				this.getView().byId("lna").setVisible(true);
				this.getView().byId("lbllna").setVisible(true);
				this.getView().byId("sex").setVisible(true);
				this.getView().byId("lblsex").setVisible(true);
				this.getView().byId("pro").setVisible(true);
				this.getView().byId("lblpro").setVisible(true);
				
			}else{
				this.getView().byId("fna").setVisible(false);
				this.getView().byId("lblfna").setVisible(false);
				this.getView().byId("lna").setVisible(false);
				this.getView().byId("lbllna").setVisible(false);
				this.getView().byId("sex").setVisible(false);
				this.getView().byId("lblsex").setVisible(false);
				this.getView().byId("pro").setVisible(false);
				this.getView().byId("lblpro").setVisible(false);
				
			}
			//FIN - GRUPO CTAS PEXT
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
			this.onChangeRegion();
			console.log(seleccPais);
		},
		onChangePaisBank:function(oEvent){
			this.getView().byId("btnGuarda").setEnabled(false);
			var selectClaBank = this.getView().byId("selectClaBank");
			var seleccPais = this.getView().byId("selectPaiBank").getSelectedKey();
			var oFilter = new sap.ui.model.Filter("BANKS", sap.ui.model.FilterOperator.Contains, seleccPais);
			selectClaBank.getBinding("items").filter([oFilter]);
			
			console.log(seleccPais);
			
			
		},
		onChangeRegion:function(oEvent){
			this.getView().byId("btnGuarda").setEnabled(false);
			var selectComunas = this.getView().byId("selectComunas");
			var seleccPais = this.getView().byId("selectPais").getSelectedKey();
			var seleccRegion = this.getView().byId("selectRegion").getSelectedKey();
			var oFilter1 = new sap.ui.model.Filter("LAND1", sap.ui.model.FilterOperator.Contains, seleccPais);
			var oFilter2 = new sap.ui.model.Filter("REGIO", sap.ui.model.FilterOperator.Contains, seleccRegion);
			selectComunas.getBinding("items").filter([oFilter1,oFilter2]);
			
			console.log(seleccPais+seleccRegion);
			
			
		},
		disableSave:function(){
			this.getView().byId("btnGuarda").setEnabled(false);
		},
		validaRut:function(){
			
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

				// Uso de la función
				alert( Fn.validaRut('11111111-1') ? 'Valido' : 'inválido');
		},
		liveChangeName:function(){
			var nombre = this.getView().byId("name1").getValue();
			this.getView().byId("titcta").setValue(nombre);
			this.getView().byId("btnGuarda").setEnabled(false);
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
	