sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/UploadCollectionParameter",
	'sap/m/Token',
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/m/Button",
	"z_figestionacreedores/view/utils/connectivity",
	'z_figestionacreedores/js/util'],
	function(JQuery,Controller,JSONModel,UploadCollectionParameter,Token,MessageToast,Dialog,Button) {
	"use strict";
	return Controller.extend("z_figestionacreedores.controller.master",{
		onInit : function() {
			this.oObjectPageLayout = this.getView().byId("ObjectPageLayout3");
			this.oTargetSubSection = this.getView().byId("G");
//			this.getView().byId("UploadCollectionM").setUploadUrl("/sap/opu/odata/sap/ZODATA_FI_GESTION_ACREEDORES_SRV/FileSet"
//			+
//			"(ID_PROCESO='27',TIPO_PROCESO='U',FILE_NAME='tt')");
			this.oObjectPageLayout.addEventDelegate({onAfterRendering : function() {
				jQuery.sap.delayedCall(500,this.oObjectPageLayout,this.oObjectPageLayout.scrollToSection,[ this.oTargetSubSection.getId() ]);
			}.bind(this)
			});
			var url = serviceUrl;
			var oView = this.getView();
			jQuery.sap.require("jquery.sap.storage");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var oModelMenu = new sap.ui.model.odata.ODataModel(url, true);
			oModelMenu.read("/RolesViewSet('C')",null,[ "" ],false,function(data,response){
				oView.setBusy(false);
				var vAdm = data.VISTA_ADM;
				oStorage.put("VISTA_ADM",vAdm);
				var vAmp = data.VISTA_AMPLIAR;
				oStorage.put("VISTA_AMPLIAR",vAmp);
				var vBorr = data.VISTA_BORRAR;
				oStorage.put("VISTA_BORRAR",vBorr);
				var vCrear = data.VISTA_CREAR;
				oStorage.put("VISTA_CREAR",vCrear);
				var vLista = data.VISTA_LISTA;
				oStorage.put("VISTA_LISTA",vLista);
				var vModif = data.VISTA_MODIFICAR;
				oStorage.put("VISTA_MODIFICAR",vModif);
				if (vAdm === 'X')// oView.byId('vistaAdm').setEnabled(true);
					oView.byId('vistaAdm').setVisible(true);
				else
					oView.byId('vistaAdm').setVisible(false);
				if (vAmp === 'X')
					oView.byId('vistaAmp').setVisible(true);
				else
					oView.byId('vistaAmp').setVisible(false);
				if (vBorr === 'X')
					oView.byId('vistaBorr').setVisible(true);
				else
					oView.byId('vistaBorr').setVisible(false);
				if (vCrear === 'X')
					oView.byId('vistaCrear').setVisible(true);
				else
					oView.byId('vistaCrear').setVisible(false);
				if (vLista === 'X')
					oView.byId('vistaLista').setVisible(true);
				else
					oView.byId('vistaLista').setVisible(false);
				if (vModif === 'X')
					oView.byId('vistaModif').setVisible(true);
				else
					oView.byId('vistaModif').setVisible(false);
			},
			function(err) {
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,
						"Error en la llamada al servicio Roles");
			});
			var FilesModel = new JSONModel({
				creaFiles : [],
				modiFiles : [],
				MSFiles : [],
				ASFiles : []
			});
			this.getView().setModel(FilesModel,'FileModel');
		},
		onPressValidar : function() {
			this.getView().byId("btnGrabar").setEnabled(true);
		},
		onSearchAcreed : function() {
			this.getView().byId("panGCM").setVisible(true);
			this.getView().byId("panDGM").setVisible(true);
			this.getView().byId("panDSM").setVisible(true);
			this.getView().byId("panDCM").setVisible(true);
			this.getView().byId("panAnM").setVisible(true);
			this.getView().byId("panObM").setVisible(true);
		},
		onCollapseExpandPress : function() {
		},
		onChangeTelef : function(oEvent) {
			var _oInput = oEvent.getSource();
			var val = _oInput.getValue();
			val = val.replace(/[^\d]/g, '');
			_oInput.setValue(val);
			this.crea_disableSave();
		},
		crea_onOrgCompPress: function(){
			this.getView().byId("btnGuarda").setEnabled(false);
			var items = this.byId("selectGrpComp").getSelectedItems();
			if(items.length > 0){
				this.byId("Lico1").setRequired(true);
				this.byId("LGrupEsqPro").setRequired(true);
				this.byId("LctrlConf").setRequired(true);
				
				this.byId("LselectMoneda").setRequired(true);
				this.byId("LselectCondPagoC").setRequired(true);
			}else{
				this.byId("Lico1").setRequired(false);
				this.byId("LGrupEsqPro").setRequired(false);
				this.byId("LctrlConf").setRequired(false);
				
				this.byId("LselectMoneda").setRequired(false);
				this.byId("LselectCondPagoC").setRequired(false);
			}
		},
		modif_onOrgCompPress: function(oEvent){
			this.getView().byId("btnGuardarM").setEnabled(false);
			var items = this.byId("selectGrpCompM").getSelectedItems();
			if(items.length > 0){
				this.byId("Lico1M").setRequired(true);
				this.byId("LGrupEsqProM").setRequired(true);
				this.byId("LctrlConfM").setRequired(true);
				
				this.byId("LselectMonedaM").setRequired(true);
				this.byId("LselectCondPagoCM").setRequired(true);
			}else{
				this.byId("Lico1M").setRequired(false);
				this.byId("LGrupEsqProM").setRequired(false);
				this.byId("LctrlConfM").setRequired(false);
				
				
				this.byId("LselectMonedaM").setRequired(false);
				this.byId("LselectCondPagoCM").setRequired(false);
			}
		},
		crea_onChangeGrpCta : function(oEvent) {
			this.getView().byId("btnGuarda").setEnabled(false);
			var item = this.getView().byId("selectGrpCta").getSelectedItem();
			var context = item.getBindingContext("GrpCta");
			var arrayObject = context.oModel.getProperty(context.sPath);
			var condPagoSelec = arrayObject.ZTERM;
			this.getView().byId("selectCondPagoS").setSelectedKey(condPagoSelec);
			this.getView().byId("selectCondPagoC").setSelectedKey(condPagoSelec);
			// INI - GRUPO CTAS PEXT
			var grupoctaselec = this.getView().byId("selectGrpCta").getSelectedKey();
			this.getView().byId("fna").setVisible(false);
			this.getView().byId("lblfna").setVisible(false);
			this.getView().byId("lna").setVisible(false);
			this.getView().byId("lbllna").setVisible(false);
			this.getView().byId("sex").setVisible(false);
			this.getView().byId("lblsex").setVisible(false);
			this.getView().byId("pro").setVisible(false);
			this.getView().byId("lblpro").setVisible(false);
			this.getView().byId("lblselectIndRet").setVisible(false);
			this.getView().byId("selectIndRet").setVisible(false);
			this.getView().byId("lblselectGrpTes").setVisible(false);
			this.getView().byId("selectGrpTes").setVisible(false);
			this.getView().byId("selectCtaAsoc").setVisible(true);
			this.getView().byId("lblCtaAsoc").setVisible(true);
			this.getView().byId("inpCtaAsoc").setVisible(false);
			this.getView().byId("lblViasPagoC").setVisible(true);
			this.getView().byId("selectViasPago").setVisible(true);
			this.getView().byId("inpswift").setVisible(false);
			this.getView().byId("lblswift").setVisible(false);
			var arrayTrat;
			if (grupoctaselec === 'PEXT'){
				arrayTrat = TRATAMIENTO_PEXT;
				this.byId("Lico1").setVisible(true);
				this.byId("ico1").setVisible(true).setSelectedKey('');
				this.byId("LGrupEsqPro").setVisible(true);
				this.byId("GrupEsqPro").setVisible(true).setSelectedKey('');
				this.byId("LctrlConf").setVisible(true);
				this.byId("ctrlConf").setVisible(true).setSelectedKey('');
			}else{
				arrayTrat = TRATAMIENTO;
				this.byId("Lico1").setVisible(false);
				this.byId("ico1").setVisible(false);
				this.byId("LGrupEsqPro").setVisible(false);
				this.byId("GrupEsqPro").setVisible(false);
				this.byId("LctrlConf").setVisible(false);
				this.byId("ctrlConf").setVisible(false);				
			}			
			// Trat
			var oModelTrat = new sap.ui.model.json.JSONModel();
			oModelTrat.setData({
				Trat : arrayTrat
			});
			this.getView().byId("selectTrat").setModel(oModelTrat);
			this.byId('direc').setVisible(true);
			this.byId('selectRegion').setVisible(true);
			this.byId('selectComunas').setVisible(true);
			this.byId('txtCiudad').setVisible(true);
			// fin selecc ANRED by GrpCta
			if (grupoctaselec === 'PEXT') {
				this.byId("selectTrat").setSelectedIndex(-1);
				this.getView().byId("fna").setVisible(true);
				this.getView().byId("lblfna").setVisible(true);
				this.getView().byId("lna").setVisible(true);
				this.getView().byId("lbllna").setVisible(true);
				this.getView().byId("sex").setVisible(true);
				this.getView().byId("lblsex").setVisible(true);
				this.getView().byId("pro").setVisible(true);
				this.getView().byId("lblpro").setVisible(true);
				this.getView().byId("lblselectIndRet").setVisible(true);
				this.getView().byId("selectIndRet").setVisible(true);
			} else if (grupoctaselec === 'HONO') {	
				this.getView().byId("lblselectIndRet").setVisible(true);
				this.getView().byId("selectIndRet").setVisible(true);
			} else if (grupoctaselec === 'AVRS') {
				this.getView().byId("lblselectGrpTes").setVisible(true);
				this.getView().byId("selectGrpTes").setVisible(true);
			} else if (grupoctaselec === 'PALT') {
				this.getView().byId("selectCtaAsoc").setVisible(false);
				this.getView().byId("lblCtaAsoc").setVisible(false);
				this.getView().byId("inpCtaAsoc").setVisible(false);
				this.getView().byId("lblViasPagoC").setVisible(false);
				this.getView().byId("selectViasPago").setVisible(false);
			} else if (grupoctaselec === 'EREL') {
				this.getView().byId("selectCtaAsoc").setVisible(false);
				this.getView().byId("inpCtaAsoc").setVisible(true);
			}
			// filtrar Cta Asoc
			var selectCtaAsoc = this.getView().byId("selectCtaAsoc");
			var oFilter = new sap.ui.model.Filter("KTOKK",sap.ui.model.FilterOperator.EQ,grupoctaselec);
			selectCtaAsoc.getBinding("items").filter([ oFilter ]);
			// fin filtrar Cta Asoc
			//VIAS DE PAGO
			var viasPagoFiltrar = arrayObject.ZWELS;
			var vparray = [];
			vparray = viasPagoFiltrar.split('');
			var selectViasPago = this.getView().byId("selectViasPago");
			var oFilters = [];
			for (var ini = 0; ini < vparray.length; ini++) {
			
				var oFilter = new sap.ui.model.Filter("ZWELS",sap.ui.model.FilterOperator.Contains,vparray[ini]);
				oFilters.push(oFilter);
			}
			selectViasPago.getBinding("items").filter(oFilters);
		},
		onAddBank: function(focus){
			var blocks = this.byId("objsubseccreaacre").getBlocks();
			var frms = blocks[0].getItems();
			for(var i=0;i<frms.length;i++){
				var elm = frms[i];
				if(!elm.getVisible()){
					var c = elm.getContent();
					c[0].setVisible(true);
					c[1].setVisible(true);
					c[2].setVisible(true);
					c[3].setVisible(true);
					c[4].setVisible(true);
					c[5].setVisible(true);
					c[6].setVisible(true);
					c[7].setVisible(true);
					c[8].setVisible(true);
					c[9].setVisible(true);
//					c[10].setVisible(true);
//					c[11].setVisible(true);
					elm.setVisible(true);
					if(focus){
					jQuery.sap.delayedCall(500, this, function() {
						c[2].focus();
					 });
					}
					return;
				}
			}
			MessageToast.show('No se pueden agregar mas!');
		},
		onRemoveBank: function(){
			var sec = this.byId("objsubseccreaacre").getBlocks();
			var frms = sec[0].getItems();
			for(var i=(frms.length-1);i>1;i--){
				var elm = frms[i-1];
				if(elm.getVisible()){
					var c = elm.getContent();
					c[0].setVisible(false);
					c[1].setSelectedKey(-1).setVisible(false);
					c[2].setVisible(false);
					c[3].setSelectedKey(-1).setVisible(false);
					c[4].setVisible(false);
					c[5].setValue("").setVisible(false);
					c[6].setVisible(false);
					c[7].setValue("").setVisible(false);
					c[8].setVisible(false);
					c[9].setValue("").setVisible(false);
//					c[10].setVisible(false);
//					c[11].setValue("").setVisible(false);
					elm.setVisible(false);
					return;
				}
			}
			
		},
		onAddBankM: function(focus){
			var blocks = this.byId("objsubseccreaacreM").getBlocks();
			var frms = blocks[0].getItems();
			for(var i=0;i<frms.length;i++){
				var elm = frms[i];
				if(!elm.getVisible()){
					var c = elm.getContent();
					c[0].setVisible(true);
					c[1].setVisible(true);
					c[2].setVisible(true);
					c[3].setVisible(true);
					c[4].setVisible(true);
					c[5].setVisible(true);
					c[6].setVisible(true);
					c[7].setVisible(true);
					c[8].setVisible(true);
					c[9].setVisible(true);
//					c[10].setVisible(true);
//					c[11].setVisible(true);
					elm.setVisible(true);
					if(focus){
						jQuery.sap.delayedCall(500, this, function() {
							c[2].focus();
						 });
						}
					return;
				}
			}
			MessageToast.show('No se pueden agregar mas!');
		},
		onRemoveBankM: function(){
			var sec = this.byId("objsubseccreaacreM").getBlocks();
			var frms = sec[0].getItems();
			for(var i=(frms.length-1);i>1;i--){
				var elm = frms[i-1];
				if(elm.getVisible()){
					var c = elm.getContent();
					c[0].setVisible(false);
					c[1].setSelectedKey(-1).setVisible(false);
					c[2].setVisible(false);
					c[3].setSelectedKey(-1).setVisible(false);
					c[4].setVisible(false);
					c[5].setValue("").setVisible(false);
					c[6].setVisible(false);
					c[7].setValue("").setVisible(false);
					c[8].setVisible(false);
					c[9].setValue("").setVisible(false);
//					c[10].setVisible(false);
//					c[11].setValue("").setVisible(false);
					elm.setVisible(false);
					return;
				}
			}
		},
		crea_onChangePais : function(oEvent) {
			var selectRegiones = this.getView().byId("selectRegion");
			var seleccPais = this.getView().byId("selectPais").getSelectedKey();
			var oFilter = new sap.ui.model.Filter("LAND1",sap.ui.model.FilterOperator.Contains,seleccPais);
			selectRegiones.getBinding("items").filter([ oFilter ]);
			var selectCondPago = this.getView().byId("selectCondPagoS");
			selectCondPago.getBinding("items").filter([ oFilter ]);
			if(selectCondPago.getItems().length == 0){
				var oFilter = new sap.ui.model.Filter("LAND1",sap.ui.model.FilterOperator.Contains,'XX');
				selectCondPago.getBinding("items").filter([ oFilter ]);
			}
			var selectCondPagoC = this.getView().byId("selectCondPagoC");
			selectCondPagoC.getBinding("items").filter([ oFilter ]);
			if(selectCondPagoC.getItems().length == 0){
				var oFilter = new sap.ui.model.Filter("LAND1",sap.ui.model.FilterOperator.Contains,'XX');
				selectCondPagoC.getBinding("items").filter([ oFilter ]);
			}
			if (seleccPais == "CL")
				selectRegiones.setSelectedKey("13");
			else
				selectRegiones.setSelectedIndex(0);
			this.crea_onChangeRegion();
		},
		crea_onChangePaisBank : function(oEvent) {
			this.getView().byId("btnGuarda").setEnabled(false);
			var selectClaBank = this.getView().byId("selectClaBank");
			var seleccPais = this.getView().byId("selectPaiBank").getSelectedKey();
			var oFilter = new sap.ui.model.Filter("BANKS",sap.ui.model.FilterOperator.Contains,seleccPais);
			selectClaBank.getBinding("items").filter([ oFilter ]);
		},
		crea_onChangePaisBank2 : function(oEvent) {
			this.getView().byId("btnGuarda").setEnabled(false);
			var selectClaBank = this.getView().byId("selectClaBank2");
			var seleccPais = this.getView().byId("selectPaiBank2").getSelectedKey();
			var oFilter = new sap.ui.model.Filter("BANKS",sap.ui.model.FilterOperator.Contains,seleccPais);
			selectClaBank.getBinding("items").filter([ oFilter ]);
		},
		crea_onChangePaisBank3 : function(oEvent) {
			this.getView().byId("btnGuarda").setEnabled(false);
			var selectClaBank = this.getView().byId("selectClaBank3");
			var seleccPais = this.getView().byId("selectPaiBank3").getSelectedKey();
			var oFilter = new sap.ui.model.Filter("BANKS",sap.ui.model.FilterOperator.Contains,seleccPais);
			selectClaBank.getBinding("items").filter([ oFilter ]);
		},
		onFiscalIdChange : function(){
			this.crea_disableSave();
			this.byId("kunnr").setEnabled(false);
			this.byId("kunnr").destroyItems();
		},
		crea_onChangeRegion : function(oEvent) {
			this.getView().byId("btnGuarda").setEnabled(false);
			var selectComunas = this.getView().byId("selectComunas");
			var seleccPais = this.getView().byId("selectPais").getSelectedKey();
			var seleccRegion = this.getView().byId("selectRegion").getSelectedKey();
			var oFilter1 = new sap.ui.model.Filter("LAND1",sap.ui.model.FilterOperator.Contains,seleccPais);
			var oFilter2 = new sap.ui.model.Filter("REGIO",sap.ui.model.FilterOperator.Contains,seleccRegion);
			selectComunas.getBinding("items").filter([oFilter1,oFilter2 ]);
		},
		crea_disableSave : function() {
			this.getView().byId("btnGuarda").setEnabled(false);
		},
//		crea_reset : function() {
//			var oView = this.getView();
//			oView.byId("selectTrat").setSelectedKey("");// tratamiento
//			oView.byId("name1").setValue("");// nombre acreedor
//			oView.byId("selectGrpCta").setSelectedIndex(-1);// grupo acreedor
//			oView.byId("concep").setValue("");// Concepto
//			oView.byId("direc").setValue("");// Direccion calle num
//			oView.byId("txtCiudad").setValue("");
//			oView.byId("selectComunas").setSelectedIndex(0);
//			oView.byId("selectRegion").setSelectedIndex(-1);// Region
//			oView.byId("selectPais").setSelectedKey("CL");// Region
//			this.onChangePais();
//			oView.byId("telf").setValue("");// Telefono
//			oView.byId("email1").setValue("");// email
//			oView.byId("email2").setValue("");// email cobranza
//			oView.byId("stcd1").setValue("");// rut
//			oView.byId("kunnr").setValue("");// deudor
//			oView.byId("emnfr").setValue("");// fab externo
//			oView.byId("selectPaiBank").setSelectedKey("CL");// pais banco
//			this.onChangePaisBank();
//			oView.byId("cta").setValue("");// cta banco
//			oView.byId("titcta").setValue("");// titular cta banco
//			oView.byId("selectSociedades").clearSelection();// sociedades
//			oView.byId("iban").setValue("");// iban 
//			oView.byId("recaltpago").setValue("");
//			oView.byId("selectGrpComp").clearSelection();
//			oView.byId("selectMoneda").setSelectedKey("CLP");// condicion de pago
//			oView.byId("txtObs").setValue("");
//			oView.byId("selectGrpComp").clearSelection();
//			oView.byId("selectSociedades").clearSelection();
//			oView.byId("selectAprobadores").setSelectedIndex(-1);
//			oView.byId("fna").setVisible(false);
//			oView.byId("fna").setValue("");
//			oView.byId("lblfna").setVisible(false);
//			oView.byId("lna").setVisible(false);
//			oView.byId("lna").setValue("");
//			oView.byId("lbllna").setVisible(false);
//			oView.byId("sex").setVisible(false);
//			// oView.byId("sex").selectedIndex(0);
//			oView.byId("lblsex").setVisible(false);
//			oView.byId("lblpro").setVisible(false);
//			oView.byId("pro").setVisible(false);
//			oView.byId("lblstcd1").setVisible(true);
//			oView.byId("stcd1").setVisible(true);
//			oView.byId("pro").setValue("");
//			oView.byId("lblCtaAsoc").setVisible(true);
//			oView.byId("selecCtaAsoc").setVisible(true);
//			oView.byId("inpCtaAsoc").setVisible(false);
//			oView.byId("vend").setValue("");
//			oView.byId("dctel").setValue("");
//			
//		},
		validaRut : function() {
			var Fn = {
			// Valida el rut con su cadena
			// completa "XXXXXXXX-X"
			validaRut : function(rutCompleto) {
				if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto))
					return false;
				var tmp = rutCompleto.split('-');
				var digv = tmp[1];
				var rut = tmp[0];
				if (digv == 'K')
					digv = 'k';
					return (Fn.dv(rut) == digv);
				},
				dv : function(T) {
					var M = 0, S = 1;
					for (; T; T = Math.floor(T / 10))
						S = (S + T % 10 * (9 - M++ % 6)) % 11;
					return S ? S - 1 : 'k';
					}
				}
			// Uso de la función
			alert(Fn.validaRut('11111111-1') ? 'Valido': 'inválido');
		},
		liveChangeName : function() {
			var nombre = this.getView().byId("name1").getValue();
			this.getView().byId("titcta").setValue(nombre);
			this.getView().byId("titcta2").setValue(nombre);
			this.getView().byId("titcta3").setValue(nombre);
			this.getView().byId("btnGuarda").setEnabled(false);
		},
		onHideShowSubItemPress : function() {
			var navListItem = this.byId('subItemThree');
			navListItem.setVisible(!navListItem.getVisible());
		},
		onItemSelect : function(oEvent) {
			var item = oEvent.getParameter('item');
			var viewId = this.getView().getId();
			sap.ui.getCore().byId(viewId + "--pageContainer").to(viewId+ "--"+ item.getKey());
			this.getView().byId("idAcrACP").setValue("");
			this.getView().byId("idAcrACT").setValue("");
		},
		onItemSelectBorr : function(oEvent) {
			this.getView().byId("idAcrBCP").setValue("");
			this.getView().byId("idAcrBCT").setValue("");
			var item = oEvent.getParameter('item');
			var viewId = this.getView().getId();
			sap.ui.getCore().byId(viewId + "--pageContainerB").to(viewId + "--" + item.getKey());
			this.onResetBorr();
		},
		onItemSelectAmpl : function(oEvent) {
			this.getView().byId("idAcrACP").setValue("");
			this.getView().byId("idAcrACT").setValue("");
			var item = oEvent.getParameter('item');
			var viewId = this.getView().getId();
			sap.ui.getCore().byId(viewId + "--pageContainerA").to(viewId + "--" + item.getKey());
			this.onResetAmpl();
		},
		onSearchAcrComp : function(oEvent) {
			var url = serviceUrl;
			var oView = this.getView();
			var lifnr = this.getView().byId("idAcrACP").getValue();
			var lif = this.pad(lifnr);
			this.onResetAmpl();
			var resultGrpComp;
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.read(
				"/InfoInicialSet?$filter=(Proceso eq 'E')"
				+ "&$expand=NAVSociedades,NAVMonedas,"
				+ "NAVOrgCompras,NAVGrpCuentas,NAVCondPago,NAVGerencias",
				null,[ "" ],false,
				function(data,response){
					oView.setBusy(false);
					var NAVGrpCuentasModel = new sap.ui.model.json.JSONModel()
					NAVGrpCuentasModel.setData(data.results[0].NAVGrpCuentas);
					NAVGrpCuentasModel.setSizeLimit(data.results[0].NAVGrpCuentas.results.length);
//					oView.byId("GrpCtaAmpCom").setModel(NAVGrpCuentasModel);
					
					var NAVGerenciasModel = new sap.ui.model.json.JSONModel()
					NAVGerenciasModel.setData(data.results[0].NAVGerencias);
					NAVGerenciasModel.setSizeLimit(data.results[0].NAVGerencias.results.length);
					oView.byId("selectAprobadoresAmpCom").setModel(NAVGerenciasModel);

					var NAVMonedasModel = new sap.ui.model.json.JSONModel()
					NAVMonedasModel.setData(data.results[0].NAVMonedas);
					NAVMonedasModel.setSizeLimit(data.results[0].NAVMonedas.results.length);
					oView.byId("selectMonedaSAmpCom").setModel(NAVMonedasModel);
					
					var NAVOrgComprasModel = new sap.ui.model.json.JSONModel();
					var NAVOrgComprasModel2 = new sap.ui.model.json.JSONModel();
					var NAVOrgComprasModel3 = new sap.ui.model.json.JSONModel();
					NAVOrgComprasModel.setData(data.results[0].NAVOrgCompras);
					NAVOrgComprasModel.setSizeLimit(data.results[0].NAVOrgCompras.results.length);
					NAVOrgComprasModel2.setData(data.results[0].NAVOrgCompras);
					NAVOrgComprasModel2.setSizeLimit(data.results[0].NAVOrgCompras.results.length);
					NAVOrgComprasModel3.setData(data.results[0].NAVOrgCompras);
					NAVOrgComprasModel3.setSizeLimit(data.results[0].NAVOrgCompras.results.length);
					oView.byId("selectGrpCompAmpCom").setModel(NAVOrgComprasModel);
					oView.byId("selectGrpCompAmpCom2").setModel(NAVOrgComprasModel2);
					oView.byId("selectGrpCompAmpCom3").setModel(NAVOrgComprasModel3);
					},
					function(err) {
						oView.setBusy(false);
						var errTxt = err.message+ "\n";
						sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
					});
			// fin info inicial
			var lifnr = this.getView().byId("idAcrACP").getValue();
			var lif = this.pad(lifnr);
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			oView.byId("ampObsCom").setValue('');
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.read(
				"/ConsultarAcreedorSet(LIFNR='" + lif 
				+ "',TIPO_PROCESO='E',TIPO_VISTA='CP')",null,[ "" ],false,
				function(data,response) {
					oView.setBusy(false);
					if (data.STATUS === 'S') {
						//sort data
						var _data = data;
						_data.EKORG_MULTI = data.EKORG_MULTI.split("-");
						//--------
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(_data);
						oView.setModel(oModel,"dataModel");
						
						oView.byId("formCompraA").setVisible(true);
						
						var nav = oView.byId("selectGrpCompAmpCom2");
						var json =JSON.parse(nav.getModel().getJSON());
						var keys = _data.EKORG_MULTI;


						var m = [];
						var li = [];
						json.results.forEach(function(item){
							if(keys.includes(item.EKORG)){
								m.push(item);
							}else{
								li.push(item);
							}
						});
						nav.getModel().setProperty('/results',m);
						oView.byId("selectGrpCompAmpCom3").getModel().setProperty('/results',li);
				
						} else {
							MessageToast.show(data.MESSAGE);
						}
					},
					function(err) {
						oView.setBusy(false);
						var errTxt = err.message + "\n";
						sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,
								"Error en la llamada al servicio");
					});
		},
		onSearchAcrCont : function(oEvent) {
			var url = serviceUrl;
			var oView = this.getView();
			this.onResetAmpl();
			var lifnr = this.getView().byId("idAcrACT").getValue();
			var lif = this.pad(lifnr);
			var resultSociedades;
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.read(
				"/InfoInicialSet?$filter=(Proceso eq 'E')"
				+ "&$expand=NAVSociedades,NAVMonedas,NAVViasPago,"
				+ "NAVOrgCompras,NAVGrpCuentas,NAVCondPago,NAVGerencias",null,[ "" ],false,
				function(data,response) {
					oView.setBusy(false);
					var NAVGrpCuentasModel = new sap.ui.model.json.JSONModel()
					NAVGrpCuentasModel.setData(data.results[0].NAVGrpCuentas);
					NAVGrpCuentasModel.setSizeLimit(data.results[0].NAVGrpCuentas.results.length);
					oView.byId("GrpCtaAmpCon").setModel(NAVGrpCuentasModel);
					
					var NAVGerenciasModel = new sap.ui.model.json.JSONModel()
					NAVGerenciasModel.setData(data.results[0].NAVGerencias);
					NAVGerenciasModel.setSizeLimit(data.results[0].NAVGerencias.results.length);
					oView.byId("selectAprobadoresAmpCon").setModel(NAVGerenciasModel);
					
					var NAVSociedadesModel = new sap.ui.model.json.JSONModel()
					NAVSociedadesModel.setData(data.results[0].NAVSociedades);
					NAVSociedadesModel.setSizeLimit(data.results[0].NAVSociedades.results.length);
					var NAVSociedadesModel2 = new sap.ui.model.json.JSONModel()
					NAVSociedadesModel2.setData(data.results[0].NAVSociedades);
					NAVSociedadesModel2.setSizeLimit(data.results[0].NAVSociedades.results.length);
					var NAVSociedadesModel3 = new sap.ui.model.json.JSONModel()
					NAVSociedadesModel3.setData(data.results[0].NAVSociedades);
					NAVSociedadesModel3.setSizeLimit(data.results[0].NAVSociedades.results.length);
					oView.byId("selectSociedadesAmpCon").setModel(NAVSociedadesModel);
					oView.byId("selectSociedadesAmpCon2").setModel(NAVSociedadesModel2);
					oView.byId("selectSociedadesAmpCon3").setModel(NAVSociedadesModel3);


					var NAVViasPagoModel = new sap.ui.model.json.JSONModel()
					NAVViasPagoModel.setData(data.results[0].NAVViasPago);
					NAVViasPagoModel.setSizeLimit(data.results[0].NAVViasPago.results.length);
					oView.byId("selectViasPagoAmpCon").setModel(NAVViasPagoModel);
				},
				function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
				});
			// fin info inicial
			
			var lifnr = this.getView().byId("idAcrACT").getValue();
			var lif = this.pad(lifnr);
			var url = serviceUrl;
			var oView = this.getView();
			oView.byId("ampObsCon").setValue('');
			oView.setBusy(true);
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.read(
				"/ConsultarAcreedorSet(LIFNR='" + lif
				+ "',TIPO_PROCESO='E',TIPO_VISTA='CT')",null,[ "" ],false,
				function(data,response) {
					oView.setBusy(false);
					var result = data;
					if (data.STATUS === 'S') {
						var _data = data;
						_data.BUKRS_MULTI = data.BUKRS_MULTI.split('-');
						_data.ZWELS = data.ZWELS.split('');
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(_data);
						oView.setModel(oModel,"dataModel");
						
						var nav = oView.byId("selectSociedadesAmpCon");
						var json =JSON.parse(nav.getModel().getJSON());
						var keys = _data.BUKRS_MULTI;

						var m = [];
						var li = [];
						json.results.forEach(function(item){
							if(keys.includes(item.BUKRS)){
								m.push(item);
							}else{
								li.push(item);
							}
						});
						nav.getModel().setProperty('/results',m);
						oView.byId("selectSociedadesAmpCon2").getModel().setProperty('/results',li);
									
						oView.byId("formContabilidadA").setVisible(true);
					} else {
						MessageToast.show(data.MESSAGE);
					}
				},
				function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
						sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
			});
		},
		onResetAmpl : function(oEvent) {
			this.getView().byId("btnGuardaACT").setEnabled(false);
			this.getView().byId("btnGuardaACP").setEnabled(false);
			this.getView().byId("formCompraA").setVisible(false);
			this.getView().byId("formContabilidadA").setVisible(false);
		},
		onResetBorr : function(oEvent) {
			this.getView().byId("btnGuardaBCP").setEnabled(false);
			this.getView().byId("btnGuardaBCT").setEnabled(false);
			this.getView().byId("selectAprobadoresBCP").setVisible(false);
			this.getView().byId("lifnrBCP").setValue("");
			this.getView().byId("lifnrBCP").setVisible(false);
			this.getView().byId("lifnrBCT").setValue("");
			this.getView().byId("lifnrBCT").setVisible(false);
			this.getView().byId("name1BCP").setVisible(false);
			this.getView().byId("name1BCT").setVisible(false);
			this.getView().byId("name2BCP").setVisible(false);
			this.getView().byId("name2BCT").setVisible(false);
			this.getView().byId("selectAprobadoresBCT").setVisible(false);
			this.getView().byId("selectGrpCompBCP").setVisible(false);
			this.getView().byId("selectSociedadesBCT").setVisible(false);
			this.getView().byId("chk1BCP").setVisible(false);
			this.getView().byId("chk2BCP").setVisible(false);
			this.getView().byId("chk3BCT").setVisible(false);
			this.getView().byId("chk4BCT").setVisible(false);
			this.getView().byId("lblb1").setVisible(false);
			this.getView().byId("lblb4").setVisible(false);
		},
		toListado : function() {
			this.getView().byId("idSolicTable").setVisible(true);
			this.getView().byId("ObjectPageLayout").setVisible(false);
			this.getView().byId("contabKeyBMS").setVisible(false);
			this.getView().byId("comprasKeyBMS").setVisible(false);
			this.getView().byId("contabKeyAMS").setVisible(false);
			this.getView().byId("comprasKeyAMS").setVisible(false);
			this.getView().byId("modif-dos").setVisible(false);
			this.getView().byId("modif-dosADM").setVisible(false);
		},
		toListadoADM : function() {
			this.getView().byId("idSolicTableADM").setVisible(true);
			this.getView().byId("ObjectPageLayoutADM").setVisible(false);
			this.getView().byId("contabKeyBADM").setVisible(false);
			this.getView().byId("comprasKeyBADM").setVisible(false);
			this.getView().byId("contabKeyAADM").setVisible(false);
			this.getView().byId("comprasKeyAADM").setVisible(false);
			this.getView().byId("modif-dosADM").setVisible(false);
			this.getView().byId("modif-dos").setVisible(false);
		},
		crear_showCrear : function() {
			if(sessionStorage.getItem('COPY_MODEL')){
				this.byId('btnPaste').setEnabled(true);
			}else{
				this.byId('btnPaste').setEnabled(false);
			}
			var url = serviceUrl;
			var oView = this.getView();
			var that = this;
			oView.setBusy(true);
			var selectPaises = this.getView().byId("selectPais");
			var selectPaiBank = this.getView().byId("selectPaiBank");
			var selectBancos = this.getView().byId("selectClaBank");
			var selectPaiBank2 = this.getView().byId("selectPaiBank2");
			var selectBancos2 = this.getView().byId("selectClaBank2");
			var selectPaiBank3 = this.getView().byId("selectPaiBank3");
			var selectBancos3 = this.getView().byId("selectClaBank3");
			var selectMonedas = this.getView().byId("selectMoneda");
			var selectSociedades = this.getView().byId("selectSociedades");
			var selectGrpCta = this.getView().byId("selectGrpCta");
			var selectCondPagoS = this.getView().byId("selectCondPagoS");
			var selectCondPagoC = this.getView().byId("selectCondPagoC");
			var selectRegion = this.getView().byId("selectRegion");
			var selectGrpComp = this.getView().byId("selectGrpComp");
			var selectAprobadores = this.getView().byId("selectAprobadores");
			var selectComunas = this.getView().byId("selectComunas");
			var selectViasPago = this.getView().byId("selectViasPago");
			var selectCtaAsoc = this.getView().byId("selectCtaAsoc");
			var selectTrat = this.getView().byId("selectTrat");
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.read(
				"/InfoInicialSet?$filter=(Proceso eq 'C') "
				+ "&$expand=NAVSociedades,NAVMonedas,NAVPaises,"
				+ "NAVOrgCompras,NAVGrpCuentas,NAVCondPago,"
				+ "NAVPaisesRegiones,NAVGerencias,NAVPaisRegComunas,"
				+ "NAVBancos,NAVViasPago,NAVCuentas",null,[ "" ],false,
				function(data,response) {
					oView.setBusy(false);
					jQuery.sap.require("jquery.sap.storage");
					var result = data.results;
					var oModelPais = new sap.ui.model.json.JSONModel();
					var oModelPaisB = new sap.ui.model.json.JSONModel();
					var resultPaises = result[0].NAVPaises.results;
					oModelPais.setData({
						Paises : resultPaises
					});
					oModelPaisB.setData({
						Paises : resultPaises
					});
					oModelPais.setSizeLimit(resultPaises.length);
					oModelPaisB.setSizeLimit(resultPaises.length);
					selectPaises.setModel(oModelPais);
					selectPaiBank.setModel(oModelPaisB);
					selectPaiBank2.setModel(oModelPaisB);
					selectPaiBank3.setModel(oModelPaisB);
					oModelPais.setSizeLimit(resultPaises.length);
					oModelPaisB.setSizeLimit(resultPaises.length);
					var oModelPR = new sap.ui.model.json.JSONModel();
					var resultPR = result[0].NAVPaisesRegiones.results;
					oModelPR.setData({
						Regiones : resultPR
					});
					selectRegion.setModel(oModelPR);
					var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
					oStorage.put("PaisesRegiones",resultPR);
					var oModelMoneda = new sap.ui.model.json.JSONModel();
					var resultMonedas = result[0].NAVMonedas.results;
					var monedas = [];
					for (var i = 0; i < resultMonedas.length; i++) {
						var obj = {
							"WAERS" : resultMonedas[i].WAERS,
							"WAERS_DESC" : resultMonedas[i].WAERS_DESC
						};
						monedas.push(obj);
					}
					var data = {
							'Monedas' : monedas
					};
					oModelMoneda.setData(data);
					oModelMoneda.setSizeLimit(resultMonedas.length);
					selectMonedas.setModel(oModelMoneda);
					var oModelSociedades = new sap.ui.model.json.JSONModel();
					var resultSociedades = result[0].NAVSociedades.results;
					oModelSociedades.setData({
						Sociedades : resultSociedades
					});
					selectSociedades.setModel(oModelSociedades);
					var oModelGrpCta = new sap.ui.model.json.JSONModel();
					var resultGrpCta = result[0].NAVGrpCuentas.results;
					oModelGrpCta.setData({
						GrpCta : resultGrpCta
					});
					selectGrpCta.setModel(oModelGrpCta,"GrpCta");
					var oModelCondPago = new sap.ui.model.json.JSONModel();
					var resultCondPago = result[0].NAVCondPago.results;
					oModelCondPago.setData({
						CondPago : resultCondPago
					});
					oModelCondPago.setSizeLimit(resultCondPago.length);
					selectCondPagoS.setModel(oModelCondPago);
					selectCondPagoC.setModel(oModelCondPago);
					var oModelGrpComp = new sap.ui.model.json.JSONModel();
					var resultGrpComp = result[0].NAVOrgCompras.results;
					oModelGrpComp.setData({
						GrpComp : resultGrpComp
					});
					selectGrpComp.setModel(oModelGrpComp);
					var oModelAprobadores = new sap.ui.model.json.JSONModel();
					var resultGerencias = result[0].NAVGerencias.results;
					if (resultGerencias == null || resultGerencias.length == 0) {
						oView.byId("ObjectPageLayout3").setVisible(false);
						MessageToast.show("Solicitante Sin Gerencia/Subgerencia.");
					}
					oModelAprobadores.setData({
						Aprobadores : resultGerencias
					});
					selectAprobadores.setModel(oModelAprobadores);
					var oModelBancos = new sap.ui.model.json.JSONModel();
					var resultBancos = result[0].NAVBancos.results;
					oModelBancos.setData({
						Bancos : resultBancos
					});
					selectBancos.setModel(oModelBancos);
					selectBancos2.setModel(oModelBancos);
					selectBancos3.setModel(oModelBancos);
					oModelBancos.setSizeLimit(resultBancos.length);
					var oModelComunas = new sap.ui.model.json.JSONModel();
					var resultComunas = result[0].NAVPaisRegComunas.results;
					oModelComunas.setData({
						Comunas : resultComunas
					});
					selectComunas.setModel(oModelComunas);
					var oModelViasPago = new sap.ui.model.json.JSONModel();
					var resultViasPago = result[0].NAVViasPago.results;
					oModelViasPago.setData({
						ViasPago : resultViasPago
					});
					selectViasPago.setModel(oModelViasPago);
					oView.byId("selectPais").setSelectedKey("CL");// Region
					that.crea_onChangePais();
					oView.byId("selectMoneda").setSelectedKey("CLP");// condicion de pago
					oView.byId("selectPaiBank").setSelectedKey("CL");// pais banco
					selectGrpCta.setSelectedIndex(0);
					var oModelCtaAsoc = new sap.ui.model.json.JSONModel();
					var resultCtaAsoc = result[0].NAVCuentas.results;
					oModelCtaAsoc.setData({
						Cta : resultCtaAsoc
					});
					selectCtaAsoc.setModel(oModelCtaAsoc);
					var oModelTrat = new sap.ui.model.json.JSONModel();
					var arrayTrat = TRATAMIENTO;
					oModelTrat.setData({
						Trat : arrayTrat
					});
					selectTrat.setModel(oModelTrat);
					that.crea_onChangePaisBank();
					that.crea_onChangePaisBank2();
					that.crea_onChangePaisBank3();
					that.crea_onChangeGrpCta();
				},function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
				});
			this.crea_reset();
			jQuery.sap.delayedCall(500, this, function() {
			    this.getView().byId("selectTrat").focus();
			 });
		},
		reset_state: function(obj){
			var _oView = this.getView();
			obj.all_id.forEach(function(i){
				_oView.byId(i).setValueState('None');
				});
		},
		acre_valida : function(ev) {
			var btngrd,grupCta,selectTrat,name1,direc,concep,selectPais,txtCiudad,stcd1,fna,lna,pro,selectSociedades,
			selectCondPagoS,selectViasPago,selectPaiBank,selectClaBank,cta,selectPaiBank2,selectClaBank2,cta2,selectPaiBank3,selectClaBank3,cta3,selectIndRet,
			selectGrpComp,selectMoneda,inpCtaAsoc,email1,email2,ico1,GrupEsqPro,ctrlConf,deudor,sex,SelectDeudor,mondp,condpa;
			var ids;
			deudor = '';
			if(ev.getSource().data('viewIDs') === 'CRE_VAL'){
				ids = crea_ids;
			}else if(ev.getSource().data('viewIDs') === 'MOD_VAL'){
				ids = mod_ids;
			}else{
				return;
			}
			btngrd = this.byId(ids.btng);
			grupCta = this.byId(ids.grupCta);
			selectTrat = this.byId(ids.selectTrat);
			name1 = this.byId(ids.name1);
			direc = this.byId(ids.direc);
			concep = this.byId(ids.concep);
			selectPais = this.byId(ids.selectPais);
			txtCiudad = this.byId(ids.txtCiudad);
			stcd1 = this.byId(ids.stcd1);
			fna = this.byId(ids.fna);
			lna = this.byId(ids.lna);
			pro = this.byId(ids.pro);
			selectSociedades = this.byId(ids.selectSociedades);
			selectCondPagoS = this.byId(ids.selectCondPagoS);
			selectViasPago = this.byId(ids.selectViasPago);
			selectPaiBank = this.byId(ids.selectPaiBank);
			selectClaBank = this.byId(ids.selectClaBank);
			cta = this.byId(ids.cta);
			selectPaiBank2 = this.byId(ids.selectPaiBank2);
			selectClaBank2 = this.byId(ids.selectClaBank2);
			cta2 = this.byId(ids.cta2);
			selectPaiBank3 = this.byId(ids.selectPaiBank3);
			selectClaBank3 = this.byId(ids.selectClaBank3);
			cta3 = this.byId(ids.cta3);
			selectIndRet = this.byId(ids.selectIndRet);
			selectGrpComp = this.byId(ids.selectGrpComp);	
			selectMoneda = this.byId(ids.selectMoneda);
			inpCtaAsoc = this.byId(ids.inpCtaAsoc);
			email1 = this.byId(ids.email1);
			email2 = this.byId(ids.email2);
			ico1 = this.byId(ids.ico1);
			GrupEsqPro = this.byId(ids.GrupEsqPro);
			ctrlConf = this.byId(ids.ctrlConf);
			sex = this.byId(ids.sex);
			
			mondp = this.byId(ids.mondp);
			condpa = this.byId(ids.condpa);
			
			SelectDeudor = this.byId(ids.deudor);
			btngrd.setEnabled(false);
			var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			this.reset_state(ids);
			if (!selectTrat.getBlocked() && selectTrat.getSelectedIndex() == -1 && selectTrat.getVisible()) {
				selectTrat.setValueState('Error').focus();
				MessageToast.show("Indique tratamiento.");
				return false;
			}if (name1.getEditable() && name1.getValue().trim() == '' && name1.getVisible()) {
				MessageToast.show("Nombre obligatorio.");
				name1.setValueState('Error').focus();
				return false;
			}if (concep.getEditable() && concep.getValue().trim() == '' && concep.getVisible()) {
				MessageToast.show("Concepto obligatorio.");
				concep.setValueState('Error').focus();
				return false;
			}if (direc.getEditable() && direc.getValue().trim() == '' && direc.getVisible()) {
				MessageToast.show("Indique Dirección/Calle.");
				direc.setValueState('Error').focus();
				return false;
			}if (txtCiudad.getEditable() && txtCiudad.getValue().trim() == '' && txtCiudad.getVisible()) {
				MessageToast.show("Indique Ciudad.");
				txtCiudad.setValueState('Error').focus();
				return false;
			}if (!selectPais.getBlocked() && selectPais.getSelectedKey() === "CL" 
					&& selectPais.getSelectedIndex() == -1 && selectPais.getVisible()) {
				MessageToast.show("Indique región.");
				selectPais.setValueState('Error').focus();
				return false;
			}if (!selectPais.getBlocked() && selectPais.getSelectedIndex() == -1 && selectPais.getVisible()) {
				MessageToast.show("Indique país.");
				txtCiudad.setValueState('Error').focus();
				return false;
			}if (selectSociedades.getEditable() && selectSociedades.getSelectedKeys().length == 0 && selectSociedades.getVisible()) {
				MessageToast.show("Indique Sociedad(es).");
				selectSociedades.setValueState('Error').focus();
				return false;
			}if (stcd1.getEditable() && stcd1.getValue().trim() == '' && stcd1.getVisible()) {
				MessageToast.show("Indique N° Id.fiscal.");
				stcd1.setValueState('Error').focus();
				return false;
			}if (!(grupCta.getSelectedKey() === 'PEXT') 
					&& (!validar_rut.validaRut(stcd1.getValue()))) {
				MessageToast.show('N° Id.fiscal inválido');
				stcd1.setValueState('Error').focus();
				return false;
			}if (!SelectDeudor.getEnabled()){
				this.byId(ids.deudorB).focus();
				MessageToast.show("Realice la busqueda de deudor!");
				return false;
			}if ((SelectDeudor.getItems().length > 0) && (SelectDeudor.getSelectedIndex() == -1)){
				SelectDeudor.setValueState('Error').focus();
				MessageToast.show("Indique Deudor.");
				return false;
			}if (!selectCondPagoS.getBlocked() && selectCondPagoS.getSelectedIndex() == -1 && selectCondPagoS.getVisible()) {
				MessageToast.show('Indique Condiciones de Pago.');
				selectCondPagoS.setValueState('Error').focus();
				return false;
			}if (!selectViasPago.getBlocked() && !(grupCta.getSelectedKey() === 'PALT') && selectViasPago.getSelectedKeys().length == 0) {
				MessageToast.show("Indique Vías de pago (al menos una).");
				selectViasPago.setValueState('Error').focus();
				return false;
			}if (fna.getEditable() && fna.getValue().trim() == '' && fna.getVisible()) {
				MessageToast.show("Indique Fecha Nacimiento.");
				fna.setValueState('Error').focus();
				return false;
			}if (lna.getEditable() && lna.getVisible() && lna.getValue().trim() == '') {
				MessageToast.show("Indique lugar de nacimiento.");
				lna.setValueState('Error').focus();
				return false;
			}if (sex.getEditable() && sex.getVisible() && !sex.getSelectedButton().getSelected()) {
				sex.setValueState('Error').focus();
				MessageToast.show("Indique sexo.");
				return false;
			}if (pro.getEditable() && pro.getVisible() && pro.getValue().trim() == '') {
				MessageToast.show("Indique profesión.");
				pro.setValueState('Error').focus();
				return false;
			}if (!selectPaiBank.getBlocked() && (selectPaiBank.getSelectedIndex() == -1)  && selectPaiBank.getVisible()) {
				MessageToast.show("Indique Dato Banco País.");
				selectPaiBank.setValueState('Error').focus();
				return false;
			}if (!selectClaBank.getBlocked() && selectClaBank.getSelectedIndex() == -1  && selectClaBank.getVisible()) {
				MessageToast.show("Indique Banco-Swift.");
				selectClaBank.setValueState('Error').focus();
				return false;
			}if (cta.getEditable() && cta.getValue().trim() == '' && cta.getVisible()) {
				MessageToast.show("Indique Cuenta Bancaria.");
				cta.setValueState('Error').focus();
				return false;
				// MONEDA - WAERS
			}if (!selectPaiBank2.getBlocked() && selectPaiBank2.getSelectedIndex() == -1  && selectPaiBank2.getVisible()) {
				MessageToast.show("Indique Dato Banco País.");
				selectPaiBank2.setValueState('Error').focus();
				return false;
			}if (!selectClaBank2.getBlocked() && selectClaBank2.getSelectedIndex() == -1  && selectClaBank2.getVisible()) {
				MessageToast.show("Indique Banco-Swift.");
				selectClaBank2.setValueState('Error').focus();
				return false;
			}if (cta2.getEditable() && cta2.getValue().trim() == '' && cta2.getVisible()) {
				MessageToast.show("Indique Cuenta Bancaria.");
				cta2.setValueState('Error').focus();
				return false;
				// MONEDA - WAERS
			}if (!selectPaiBank3.getBlocked() && selectPaiBank3.getSelectedIndex() == -1  && selectPaiBank3.getVisible()) {
				MessageToast.show("Indique Dato Banco País.");
				selectPaiBank3.setValueState('Error').focus();
				return false;
			}if (!selectClaBank3.getBlocked() && selectClaBank3.getSelectedIndex() == -1  && selectClaBank3.getVisible()) {
				MessageToast.show("Indique Banco-Swift.");
				selectClaBank3.setValueState('Error').focus();
				return false;
			}if (cta3.getEditable() && cta3.getValue().trim() == '' && cta3.getVisible()) {
				MessageToast.show("Indique Cuenta Bancaria.");
				cta3.setValueState('Error').focus();
				return false;
			}
//			if (!selectMoneda.getBlocked() && selectMoneda.getSelectedIndex() == -1 && selectMoneda.getVisible()) {
//				MessageToast.show("Indique moneda.");
//				selectMoneda.setValueState('Error').focus();
//				return false;
//			}
			if (email1.getEditable() && email1.getValue() != null && email1.getValue() != '') {
				if (!mailregex.test(email1.getValue())) {
					MessageToast.show(email1.getValue() + " no es un e-mail válido.");
					email1.setValueState('Error').focus();
					return false;
				}
			}
			if (email2.getEditable() && email2.getValue() != null && email2.getValue() != '') {
				if (!mailregex.test(email2.getValue())) {
					MessageToast.show(email2.getValue() + " no es un e-mail válido.");
					email2.setValueState('Error').focus();
					return false;
				}
			}
			
			
			var orgC = selectGrpComp.getSelectedItems().length;

			
			if ((orgC > 0) && !mondp.getBlocked() && mondp.getSelectedIndex() == -1  && mondp.getVisible()) {
				MessageToast.show("Indique Dato Moneda.");
				mondp.setValueState('Error').focus();
				return false;
			}if ((orgC > 0) && !condpa.getBlocked() && condpa.getSelectedIndex() == -1  && condpa.getVisible()) {
				MessageToast.show("Indique Dato Condición De Pago.");
				condpa.setValueState('Error').focus();
				return false;
			}
			
			if ((orgC > 0) && !ico1.getBlocked() && ico1.getSelectedIndex() == -1  && ico1.getVisible()) {
				MessageToast.show("Indique Dato Incoterms.");
				ico1.setValueState('Error').focus();
				return false;
			}if ((orgC > 0) && !GrupEsqPro.getBlocked() && GrupEsqPro.getSelectedIndex() == -1  && GrupEsqPro.getVisible()) {
				MessageToast.show("Indique Grupo Equema Proveedor.");
				GrupEsqPro.setValueState('Error').focus();
				return false;
			}if ((orgC > 0) && !ctrlConf.getBlocked() && ctrlConf.getSelectedIndex() == -1  && ctrlConf.getVisible()) {
				MessageToast.show("Indique Control Confirmación.");
				ctrlConf.setValueState('Error').focus();
				return false;
			}
			switch (grupCta.getSelectedKey()) {
				case 'EREL':
					if (inpCtaAsoc.getEditable() && inpCtaAsoc.getValue().trim() == '' && inpCtaAsoc.getVisible()) {
						MessageToast.show("Indique Cta. Asociada");
						inpCtaAsoc.setValueState('Error').focus();
						return false;
					}
					break;
				case 'PEXT':
					if (selectIndRet.getBlocked() && selectIndRet.getSelectedIndex() == -1 && inpCtaAsoc.getVisible()) {
						MessageToast.show("Seleccione Indicador Retención.");
						selectIndRet.setValueState('Error').focus();
						return false;
					}
					break;
				case 'HONO':
					if (selectIndRet.getBlocked() && selectIndRet.getSelectedIndex() == -1 && inpCtaAsoc.getVisible()) {
						MessageToast.show("Seleccione Indicador Retención.");
						selectIndRet.setValueState('Error').focus();
						return false;
					}
					break;
				default:
			}
			btngrd.setEnabled(true);
			ev.getSource().setEnabled(true);
			MessageToast.show('Todo validado existosamente!');
			return true;
		},
		onFindDeudor : function(oEvent){
			var b = oEvent.getSource();
			var idf = this.byId("stcd1").getValue(); //kunnr
			if(idf == ''){
				this.byId("stcd1").setValueState('Error');
				this.byId("stcd1").focus();
				this.byId("stcd1").setValueStateText('Ingrese un valor valido!');
				return;
			}
			var oView = this.getView();
			oView.setBusy(true);
			var url = serviceUrl;
			var model = new sap.ui.model.odata.ODataModel(url, true);
			b.setEnabled(false);
			model.read("/ConsultaDeudorSet?$filter=STCD1 eq '"+idf+"'",null,[ "" ],true,
			function(data,response){
				b.setEnabled(true);
				oView.setBusy(false);
				oView.byId("kunnr").destroyItems();
				oView.byId("kunnr").setEnabled(true);
				oView.byId("kunnr").setSelectedKey('')
				if(data.results.length == 0){
					oView.byId("kunnr").setSelectedKey('');
				}else{
					data.results.forEach(function(item){
						oView.byId("kunnr").addItem(new sap.ui.core.Item({
							key:item.KUNNR,
							text:item.KUNNR
						}));
					});
				}
			},
			function(err) {
				b.setEnabled(true);
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,
						"Error en la llamada al servicio 'Consulta Deudor'");
			});
			
		},
		onFindDeudorM : function(){
			var idf = this.byId("stcd1M").getValue(); //kunnr
			if(idf == ''){
				this.byId("stcd1M").setValueState('Error');
				this.byId("stcd1M").focus();
				this.byId("stcd1M").setValueStateText('Ingrese un valor valido!');
				return;
			}
			var oView = this.getView();
			oView.setBusy(true);
			var url = serviceUrl;
			var model = new sap.ui.model.odata.ODataModel(url, true);
			model.read("/ConsultaDeudorSet?$filter=STCD1 eq '"+idf+"'",null,[ "" ],true,
			function(data,response){
				oView.setBusy(false);
				oView.byId("kunnrM").setEnabled(true);
				oView.byId("kunnrM").destroyItems();
				oView.byId("kunnrM").setSelectedKey('')
				if(data.results.length == 0){
					oView.byId("kunnrM").setSelectedKey('');
				}else{
					data.results.forEach(function(item){
						oView.byId("kunnrM").addItem(new sap.ui.core.Item({
							key:item.KUNNR,
							text:item.KUNNR
						}));
					});
				}
			},
			function(err) {
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,
						"Error en la llamada al servicio 'Consulta Deudor'");
			});
			
		},
		crea_onSave : function() {
			var that = this;
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			var oEntry = new sap.ui.model.json.JSONModel();
			var anred = oView.byId("selectTrat").getSelectedKey();// tratamiento
			var name1 = oView.byId("name1").getValue();// nombre acreedor
			var name2 = oView.byId("name2").getValue();// nombre acreedor
			var ktokk = oView.byId("selectGrpCta").getSelectedKey();// grupo acreedor
			var sort = oView.byId("concep").getValue();// Concepto
			var stras = oView.byId("direc").getValue();// Direccion calle num
			var ciuda = oView.byId("txtCiudad").getValue();// ciudad
			var comun = oView.byId("selectComunas").getSelectedKey();// comuna
			var regio = oView.byId("selectRegion").getSelectedKey();// Region
			var land1 = oView.byId("selectPais").getSelectedKey();// Region
			var telf = oView.byId("telf").getValue();// Telefono
			var email1 = oView.byId("email1").getValue();// email
			var email2 = oView.byId("email2").getValue();// email cobranza
			var stcd1 = oView.byId("stcd1").getValue();// rut
			var kunnr = oView.byId("kunnr").getSelectedKey();// deudor
			var emnfr = oView.byId("emnfr").getValue();// fab externo
			var banks = oView.byId("selectPaiBank").getSelectedKey();// pais banco
			var clabanks = oView.byId("selectClaBank").getSelectedKey();
			var bankn = oView.byId("cta").getValue();// cta banco
			var koinh = oView.byId("titcta").getValue();// titular cta banco
			var iban = oView.byId("iban").getValue();// iban
			var banks2 = oView.byId("selectPaiBank2").getSelectedKey();// pais banco
			var clabanks2 = oView.byId("selectClaBank2").getSelectedKey();
			var bankn2 = oView.byId("cta2").getValue();// cta banco
			var koinh2 = oView.byId("titcta2").getValue();// titular cta banco
			var iban2 = oView.byId("iban2").getValue();// iban
			var banks3 = oView.byId("selectPaiBank3").getSelectedKey();// pais banco
			var clabanks3 = oView.byId("selectClaBank3").getSelectedKey();
			var bankn3 = oView.byId("cta3").getValue();// cta banco
			var koinh3 = oView.byId("titcta3").getValue();// titular cta banco
			var iban3 = oView.byId("iban3").getValue();// iban
			var lnrza =  oView.byId("recaltpago").getValue();// pago alternativo
			var VERKF = oView.byId("vend").getValue();// vendedor
			var TELFE = oView.byId("dctel").getValue();// telf vendedor
			var INCO1 = oView.byId("ico1").getSelectedKey();// Incoterms
			var KALSK = oView.byId("GrupEsqPro").getSelectedKey();// Grupo Equema Proveedor
			var BSTAE = oView.byId("ctrlConf").getSelectedKey();// Control Confirmación
			var LNRZA = oView.byId("recaltpago").getValue();// pago alt
			var bukrs = [];
			bukrs = oView.byId("selectSociedades").getSelectedKeys();// sociedades
			var zterm = oView.byId("selectCondPagoS").getSelectedKey();// condicion de pago
			var zterm_compra = oView.byId("selectCondPagoC").getSelectedKey();// condicion de pago
			var waers = oView.byId("selectMoneda").getSelectedKey();// condicion de pago
			var ekorg = [];
			ekorg = oView.byId("selectGrpComp").getSelectedKeys();// org compras
			
			var bukrs_multi = bukrs.join('-');
			var bukrs_single = '';
			if(bukrs.length > 0){
				var bukrs_single = bukrs[0];
			}	
			
			var ekorg_single = ''
			var ekorg_multi = ekorg.join('-');
			if (ekorg.lenght > 0) {
				ekorg_single = ekorg[0];
			}
			if (ktokk != 'PALT') {
				var vpg = [];
				vpg = oView.byId("selectViasPago").getSelectedKeys();// Vias
				// Pago
				var vpago_single = vpg.join('');
			} else
				var vpago_single = '';
			var grptes = oView.byId("selectGrpTes").getSelectedKey();
			var aprobador = oView.byId("selectAprobadores").getSelectedKey();
			var obs = oView.byId("txtObs").getValue();
			var masc = oView.byId("RB1-1").getSelected();
			var feme = oView.byId("RB1-2").getSelected();
			var sex = '2';
			if (masc)
				sex = '1';
			var fnac = oView.byId("fna").getValue(); // Fecha nacimiento
			var lnac = oView.byId("lna").getValue(); // Lugar nacimiento
			var prof = oView.byId("pro").getValue(); // Profesion
			var ctaasoc = "";
			var palt = (oView.byId("selectGrpCta").getSelectedKey() === 'PALT') ? true : false;
			var erel = (oView.byId("selectGrpCta").getSelectedKey() === 'EREL') ? true : false;
			var pext = (oView.byId("selectGrpCta").getSelectedKey() === 'PEXT') ? true : false;
			var hono = (oView.byId("selectGrpCta").getSelectedKey() === 'HONO') ? true : false;
			if (!palt && !erel)
				ctaasoc = oView.byId("selectCtaAsoc").getSelectedKey();
			else if (erel)
				ctaasoc = oView.byId("inpCtaAsoc").getValue();
			var indr = '';
			if (pext || hono)
				indr = oView.byId("selectIndRet").getSelectedKey();
			oEntry = {
				"TIPO_PROCESO" : 'C',
				"ID_SOLICITUD" : '',
				"LIFNR" : '',
				"ANRED" : anred,
				"NAME1" : name1,
				"NAME2" : name2,
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
				"BANKL" : clabanks,// *
				"BANKN" : bankn,
				"KOINH" : koinh,
				"IBAN" : iban,
				"BANKS2" : banks2,
				"BANKL2" : clabanks2,// *
				"BANKN2" : bankn2,
				"KOINH2" : koinh2,
				"IBAN2" : iban2,
				"BANKS3" : banks3,
				"BANKL3" : clabanks3,// *
				"BANKN3" : bankn3,
				"KOINH3" : koinh3,
				"IBAN3" : iban3,
				"LNRZA" : lnrza,
				"BUKRS" : bukrs_single,
				"HKONT" : ctaasoc,
				"FDGRV" : '',
				"ZTERM" : zterm,
				"ZTERM_COMPRAS" : zterm_compra,
				"EKORG" : ekorg_single,
				"WAERS" : waers,
				"BUKRS_MULTI" : bukrs_multi,
				"EKORG_MULTI" : ekorg_multi,
				"APROBADOR" : aprobador,
				"OBS" : obs,
				"QSSKZ" : indr,
				"ZWELS" : vpago_single,
				"FDGRV" : grptes,
				"VERKF" : VERKF,
				"TELFE" : TELFE,
				"INCO1" : INCO1,
				"KALSK" : KALSK,
				"BSTAE" : BSTAE,
				"LNRZA" : LNRZA,
				// "SWIFT" : swf
			};
			oModel.create("/CrearSolicitudSet",
				oEntry,
				null,
				function(data) {
					oView.setBusy(false);
					if (data.STATUS === 'S') {
						MessageToast.show(data.MESSAGE);
						var ID_SOLICITUD = parseInt(data.ID_SOLICITUD);
						that.onCreaUploadFile(ID_SOLICITUD);
						oView.byId("btnGuarda").setEnabled(false);
						that.crea_reset();
					} else {
						MessageToast.show("Error: " + data.MESSAGE);
					}
				},function(e) {
					oView.setBusy(false);
					MessageToast.show("Problemas al cargar datos (" + e.getMessage + ").");
				}
			);
		},
		modif_onSave : function() {
			var that = this;
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			var EKORG = '';
			var EKORG_MULTI = '';
			var orgcomp = oView.byId("selectGrpCompM").getSelectedKeys();// Vias Pago
			if (orgcomp.length == 1) {
				EKORG = orgcomp[0];
			}
			EKORG_MULTI = orgcomp.join('-');
			var BUKRS_MULTI = '';
			var BUKRS = '';
			var sociends = oView.byId("selectSociedadesM").getSelectedKeys();// Vias Pago selectSociedadesM
			if (sociends.length == 1) {
				BUKRS = sociends[0];
			}	
			BUKRS_MULTI = sociends.join('-');
			
			var ZWELS = '';
			var vpg = oView.byId("selectViasPagoM").getSelectedKeys();// Vias
			ZWELS = vpg.join('');
			var sex = '';
			if(this.byId("RB1-1M").getSelected()){
				sex = "1"
			}
			if(this.byId("RB1-2M").getSelected()){
				sex = "2"
			}
			jQuery.sap.require("jquery.sap.storage");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			oStorage.put("TIPO_PROCESO", "U");			
			var oEntry = {
					"TIPO_PROCESO" : 'U',
					"ID_SOLICITUD" : '',
					"LIFNR" : this.byId("lifnrM").getValue(),//id acreedor
					"ANRED" : this.byId("selectTratM").getSelectedKey(),//tratamineto
					"NAME1" : this.byId("name1M").getValue(),//nombre 1
					"NAME2" : this.byId("name2M").getValue(),//nombre 2
					"KTOKK" : this.byId("inpKtokkM").getSelectedKey(),//grp de cta
					"SORTL" : this.byId("concepM").getValue(),//concepto
					"STRAS" : this.byId("direcM").getValue(),//calle
					"CITY1" : this.byId("txtCiudadM").getValue(),//ciudad
					"CITY2" : this.byId("selectComunasM").getSelectedKey(),//comuna
					"REGIO" : this.byId("selectRegionM").getSelectedKey(),//region
					"LAND1" : this.byId("selectPaisM").getSelectedKey(),//pais dir
					"TELF1" : this.byId("telfM").getValue(),//telefono
					"SMTP_ADDR" : this.byId("email1M").getValue(),//email
					"SMTP_ADDR2" : this.byId("email2M").getValue(),//email corp
					"STCD1" : this.byId("stcd1M").getValue(), //id.fiscal
					"PROFS" : this.byId("proM").getValue(), //profesion,
					"SEXKZ" : sex,
					"GBDAT" : this.byId("fnaM").getValue(), //fecha nac
					"GBORT" : this.byId("lnaM").getValue(), //lugar nac,
					"KUNNR" : this.byId("kunnrM").getSelectedKey(), //deudor
					"EMNFR" : this.byId("emnfrM").getValue(), //feb.externo
					"BANKS" : this.byId("selectPaiBankM").getSelectedKey(), //pais banco
					"BANKL" : this.byId("selectClaBankM").getSelectedKey(), // banco
					"BANKN" : this.byId("ctaM").getValue(), // cta banco
					"KOINH" : this.byId("titctaM").getValue(), //titular banco
					"IBAN" : this.byId("ibanM").getValue(), // iban
					"BANKS2" : this.byId("selectPaiBankM2").getSelectedKey(), //pais banco
					"BANKL2" : this.byId("selectClaBankM2").getSelectedKey(), // banco
					"BANKN2" : this.byId("ctaM2").getValue(), // cta banco
					"KOINH2" : this.byId("titctaM2").getValue(), //titular banco
					"IBAN2" : this.byId("ibanM2").getValue(), // iban
					"BANKS3" :this.byId("selectPaiBankM3").getSelectedKey(), //pais banco
					"BANKL3" : this.byId("selectClaBankM3").getSelectedKey(), // banco
					"BANKN3" : this.byId("ctaM3").getValue(), // cta banco
					"KOINH3" : this.byId("titctaM3").getValue(), //titular banco
					"IBAN3" : this.byId("ibanM3").getValue(), // iban
					"LNRZA" : this.byId("recaltpagoM").getValue(), //pago alt
					"BUKRS" : BUKRS, // sociedades
					"HKONT" : this.byId("selectCtaAsocM").getSelectedKey(),//cuenta asociada
					"FDGRV" : this.byId("selectGrpTesM").getSelectedKey(), //grp tesoreria
					"ZTERM" : this.byId("selectCondPagoSM").getSelectedKey(),//condicion de pago (sociedad)
					"ZTERM_COMPRAS" : this.byId("selectCondPagoCM").getSelectedKey(), //condicion de pago (compras)
					"EKORG" : EKORG, // Org.Compras
					"WAERS" : this.byId("selectMonedaM").getSelectedKey(),//moneda
					"BUKRS_MULTI" : BUKRS_MULTI, // sociedades
					"EKORG_MULTI" : EKORG_MULTI,// Org.Compras
					"APROBADOR" : this.byId("selectAprobadoresM").getSelectedKey(),//aprobador
					"OBS" : this.byId("txtObsM").getValue(), //obserbaciones
					"QSSKZ" : this.byId("selectIndRetM").getSelectedKey(),//Indicador de Retención
					"ZWELS" : ZWELS, //vias de pago
					"VERKF" : this.byId("vendM").getValue(), //vendedor
					"TELFE" : this.byId("dctelM").getValue(), //telf vendedor
					"INCO1" : this.byId("ico1M").getSelectedKey(), //iconterms
					"KALSK" : this.byId("GrupEsqProM").getSelectedKey(), // Grupo Equema Proveedor
					"BSTAE" : this.byId("ctrlConfM").getSelectedKey(), // Control Confirmación,
			};
			oModel.create("/CrearSolicitudSet",oEntry,null,
				function(data) {
					oView.setBusy(false);
					if (data.STATUS === 'S') {
						MessageToast.show(data.MESSAGE);
						oView.byId("btnGuardarM").setEnabled(false);
						oStorage.put("ID_PROCESO",data.ID_SOLICITUD);
						that.onModiUploadFile(data.ID_SOLICITUD);
						that.modif_reset();
					} else {
						MessageToast.show("Error: " + data.MESSAGE);
					}
					},
				function(e) {
					oView.setBusy(false);
					MessageToast.show("Problemas al cargar datos (" + e.getMessage + ").");
				});
		},
		upload : function() {
			var oUploadCollection = this.getView().byId("UploadCollectionM");
			var resourcemodel = oUploadCollection.getModel("ResourceModel");
			var sServiceUrl1 = resourcemodel.oData.sServiceUrl
				+ "/FileSet(ID_PROCESO='10',TIPO_PROCESO='C',FILE_NAME='nombrearchivo.txt')/$value";
			var sServiceUrl = "/FioriSCP.z_figestionacreedores/sap/opu/odata/sap/ZODATA_FI_GESTION_ACREEDORES_SRV/FileSet('00000111')";
			var headerBanfn = null;
			for (var i = 0; i < oUploadCollection._aFileUploadersForPendingUpload.length; i++) {
				headerBanfn = new sap.ui.unified.FileUploaderParameter(
					{
						name : "banfn",
						value : "123456"
					});
				oUploadCollection._aFileUploadersForPendingUpload[i].setUploadUrl(sServiceUrl1);
				oUploadCollection._aFileUploadersForPendingUpload[i].addHeaderParameter(headerBanfn);
			}
			oUploadCollection.upload();

		},
		upload2 : function() {
			jQuery.sap.require("jquery.sap.storage");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var tipo = oStorage	.get("TIPO_PROCESO");
			var id = oStorage.get("ID_PROCESO");
			var oCustomerHeaderToken = "";
			OData.request({
				requestUri : "/FioriSCP.z_figestionacreedores/sap/opu/odata/sap/ZODATA_FI_GESTION_ACREEDORES_SRV/",
				method : "GET",
				async : false,
				headers : {
					"X-Requested-With" : "XMLHttpRequest",
					"Content-Type" : "application/atom+xml",
					"DataServiceVersion" : "2.0",
					"X-CSRF-Token" : "Fetch"
				}
			},function(data,response) {
				var header_xcsrf_token = response.headers['x-csrf-token'];
				oCustomerHeaderToken = new sap.m.UploadCollectionParameter(
					{
						name : "X-CSRF-Token",
						value : header_xcsrf_token
					});
			});
			var oUploadCollection = this.getView().byId("UploadCollectionM");
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
			oUploadCollection.setUploadUrl("/FioriSCP.z_figestionacreedores/sap/opu/odata/sap/ZODATA_FI_GESTION_ACREEDORES_SRV/FileSet(ID_PROCESO='"
					+ id
					+ "',TIPO_PROCESO='U',FILE_NAME='tt')");

		},
		onUploadComplete : function(oEvent) {
			var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
			setTimeout(function() {
				var oUploadCollection = this.byId("UploadCollectionM");
				for (var i = 0; i < oUploadCollection.getItems().length; i++) {
					if (oUploadCollection.getItems()[i].getFileName() === sUploadedFileName) {
						oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
						break;
					}
				}
				// delay the success message in order to see other messages before
				MessageToast.show("Event uploadComplete triggered en 8");
			}.bind(this), 4000);
		},
		onBeforeUploadStarts : function(oEvent) {
			var oCustomerHeaderSlug = new UploadCollectionParameter(
				{
					name : "slug",
					value : oEvent.getParameter("fileName")
				}
			);
			oEvent.getParameters().addHeaderParameter(
			oCustomerHeaderSlug);
			setTimeout(function() {
				MessageToast.show("Event beforeUploadStarts triggered en 4");
			}, 2000);
		},
		onStartUpload : function(oEvent) {
			var oUploadCollection = this.byId("UploadCollectionM");
			var cFiles = oUploadCollection.getItems().length;
			var uploadInfo = cFiles + " file(s)";
			if (cFiles > 0) {
				oUploadCollection.upload();
				MessageToast.show("Method Upload is called (" + uploadInfo + ")");
				MessageBox.information("Uploaded " + uploadInfo);
			}
		},
		onChange : function(oEvent) {
			MessageToast.show("Event change triggered");
		},
		onFileDeleted : function(oEvent) {
			MessageToast.show("Event fileDeleted triggered");
		},
		onFilenameLengthExceed : function(oEvent) {
			MessageToast.show("Event filenameLengthExceed triggered");
		},
		onFileSizeExceed : function(oEvent) {
			MessageToast.show("Event fileSizeExceed triggered");
		},
		onTypeMissmatch : function(oEvent) {
			MessageToast.show("Event typeMissmatch triggered");
		},
		crea_reset : function(tipo) {
			var oView = this.getView();
			this.crea_onChangeGrpCta();
			oView.byId("selectTrat").setSelectedKey("").setValueState('None');// tratamiento
			oView.byId("name1").setValue("").setValueState('None');// nombre acreedor
			oView.byId("name2").setValue("");// nombre acreedor
			oView.byId("selectGrpCta").setSelectedKey('');// grupo cuenta
			oView.byId("concep").setValue("").setValueState('None');// Concepto
			oView.byId("telf").setValue("");// Telefono
			oView.byId("email1").setValue("");// email
			oView.byId("email2").setValue("");// email cobranza
			oView.byId("direc").setValue("").setValueState('None');// Direccion calle num
			oView.byId("txtCiudad").setValue("").setValueState('None');
			oView.byId("selectComunas").setSelectedKey('');
			oView.byId("selectRegion").setSelectedKey('');// Region
			oView.byId("selectPais").setSelectedKey("CL").setValueState('None');// Region
			oView.byId("recaltpago").setValue("").setValueState('None');
			oView.byId("vend").setValue("").setValueState('None');
			oView.byId("dctel").setValue("").setValueState('None');
			this.crea_onChangePais();
			oView.byId("selectSociedades").setValueState('None').clearSelection();// sociedades
			oView.byId("lblstcd1").setVisible(true);
			oView.byId("stcd1").setVisible(true).setValue("").setValueState('None');// rut
			oView.byId("fna").setVisible(false).setValue("").setValueState('None');
			oView.byId("lblfna").setVisible(false);
			oView.byId("lna").setVisible(false).setValue("").setValueState('None')
			oView.byId("lbllna").setVisible(false);
			oView.byId("sex").setVisible(false).setSelectedIndex(0);
			oView.byId("RB1-1").setSelected(false);
			oView.byId("RB1-2").setSelected(false);
			oView.byId("lblsex").setVisible(false);
			oView.byId("lblpro").setVisible(false);
			oView.byId("pro").setVisible(false).setValue("").setValueState('None');
			oView.byId("kunnr").setEnabled(false);
			oView.byId("kunnr").destroyItems();
			oView.byId("selectCondPagoS").setValueState('None').setSelectedKey('');
			oView.byId("selectViasPago").setValueState('None').clearSelection();
			oView.byId("emnfr").setValue("");// fab externo
			oView.byId("inpCtaAsoc").setValue("");// Cta Asociada
			oView.byId("selectPaiBank").setSelectedKey("CL");// pais banco
			oView.byId("selectClaBank").setValueState('None').setSelectedKey('');
			oView.byId("cta").setValue("").setValueState('None');// cta banco
			oView.byId("titcta").setValue("").setValueState('None');// titular cta banco
			oView.byId("iban").setValue("");// iban
			oView.byId("selectPaiBank2").setVisible(false).setSelectedKey("CL");// pais banco
			oView.byId("selectClaBank2").setVisible(false).setValueState('None').setSelectedKey('');
			oView.byId("cta2").setVisible(false).setValue("").setValueState('None');// cta banco
			oView.byId("titcta2").setVisible(false).setValue("").setValueState('None');// titular cta banco
			oView.byId("iban2").setVisible(false).setValue("");// iban
			oView.byId("frmDB2").setVisible(false);
			oView.byId("selectPaiBank3").setVisible(false).setSelectedKey("CL");// pais banco
			this.crea_onChangePaisBank();
			this.crea_onChangePaisBank2();
			this.crea_onChangePaisBank3();
			oView.byId("selectClaBank3").setVisible(false).setValueState('None').setSelectedKey('');
			oView.byId("cta3").setVisible(false).setValue("").setValueState('None');// cta banco
			oView.byId("titcta3").setVisible(false).setValue("").setValueState('None');// titular cta banco
			oView.byId("iban3").setVisible(false).setValue("");// iban
			oView.byId("frmDB3").setVisible(false);
			oView.byId("selectGrpComp").clearSelection();
			oView.byId("selectMoneda").setSelectedKey("CLP");// condicion de pago
			oView.byId("txtObs").setValue("");
			oView.byId("selectAprobadores").setSelectedKey('');
			oView.byId("selectIndRet").setSelectedKey("H0");
			oView.byId("ico1").setVisible(false).setValueState('None').setSelectedKey('');
			oView.byId("GrupEsqPro").setVisible(false).setValueState('None').setSelectedKey('');
			oView.byId("ctrlConf").setVisible(false).setValueState('None').setSelectedKey('');
			this.crea_onOrgCompPress();
			
		},
		modif_resetStates : function(tipo) {
			var oView = this.getView();
			oView.byId("selectTratM").setSelectedKey("").setValueState('None');// tratamiento
			oView.byId("name1M").setValue("").setValueState('None');// nombre acreedor
			oView.byId("name2M").setValue("");// nombre acreedor
			oView.byId("inpKtokkM").setSelectedKey('');// grupo cuenta
			oView.byId("concepM").setValue("").setValueState('None');// Concepto
			oView.byId("telfM").setValue("");// Telefono
			oView.byId("email1M").setValue("");// email
			oView.byId("email2M").setValue("");// email cobranza
			oView.byId("direcM").setValue("").setValueState('None');// Direccion calle num
			oView.byId("txtCiudadM").setValue("").setValueState('None');
			oView.byId("selectComunasM").setSelectedKey('');
			oView.byId("selectRegionM").setSelectedKey('');// Region
			oView.byId("selectPaisM").setSelectedKey("CL").setValueState('None');// Region
			oView.byId("recaltpagoM").setValue("").setValueState('None');
			oView.byId("vendM").setValue("").setValueState('None');
			oView.byId("dctelM").setValue("").setValueState('None');
			oView.byId("selectSociedadesM").setValueState('None').clearSelection();// sociedades
			oView.byId("lblstcd1").setVisible(true);
			oView.byId("stcd1M").setVisible(true).setValue("").setValueState('None');// rut
			oView.byId("fnaM").setVisible(false).setValue("").setValueState('None');
			oView.byId("lblfnaM").setVisible(false);
			oView.byId("lnaM").setVisible(false).setValue("").setValueState('None')
			oView.byId("lbllnaM").setVisible(false);
			oView.byId("sexM").setVisible(false).setSelectedIndex(0);
			oView.byId("RB1-1M").setSelected(false);
			oView.byId("RB1-2M").setSelected(false);
			oView.byId("lblsexM").setVisible(false);
			oView.byId("lblproM").setVisible(false);
			oView.byId("proM").setVisible(false).setValue("").setValueState('None');
			oView.byId("kunnrM").setEnabled(false);
			oView.byId("kunnrM").destroyItems();
			oView.byId("selectCondPagoSM").setValueState('None').setSelectedKey('');
			oView.byId("selectViasPagoM").setValueState('None').clearSelection();
			oView.byId("emnfrM").setValue("");// fab externo
			oView.byId("selectCtaAsocM").setSelectedKey("");// Cta Asociada
			oView.byId("selectPaiBankM").setSelectedKey("CL");// pais banco
			oView.byId("selectClaBankM").setValueState('None').setSelectedKey('');
			oView.byId("ctaM").setValue("").setValueState('None');// cta banco
			oView.byId("titctaM").setValue("").setValueState('None');// titular cta banco
			oView.byId("ibanM").setValue("");// iban
			oView.byId("selectPaiBankM2").setVisible(false).setSelectedKey("CL");// pais banco
			oView.byId("selectClaBankM2").setVisible(false).setValueState('None').setSelectedKey('');
			oView.byId("ctaM2").setVisible(false).setValue("").setValueState('None');// cta banco
			oView.byId("titctaM2").setVisible(false).setValue("").setValueState('None');// titular cta banco
			oView.byId("ibanM2").setVisible(false).setValue("");// iban
			oView.byId("frmDBM2").setVisible(false);
			oView.byId("selectPaiBankM3").setVisible(false).setSelectedKey("CL");// pais banco
			oView.byId("selectClaBankM3").setVisible(false).setValueState('None').setSelectedKey('');
			oView.byId("ctaM3").setVisible(false).setValue("").setValueState('None');// cta banco
			oView.byId("titctaM3").setVisible(false).setValue("").setValueState('None');// titular cta banco
			oView.byId("ibanM3").setVisible(false).setValue("");// iban
			oView.byId("frmDBM3").setVisible(false);
			oView.byId("selectGrpCompM").clearSelection();
			oView.byId("selectMonedaM").setSelectedKey("CLP");// condicion de pago
			oView.byId("txtObsM").setValue("");
			oView.byId("selectAprobadoresM").setSelectedKey('');
			oView.byId("selectIndRetM").setSelectedKey("H0");
			oView.byId("ico1M").setVisible(false).setValueState('None').setSelectedKey('');
			oView.byId("GrupEsqProM").setVisible(false).setValueState('None').setSelectedKey('');
			oView.byId("ctrlConfM").setVisible(false).setValueState('None').setSelectedKey('');
			this.modif_onOrgCompPress();
		},
		modif_showModif : function() {
			this.getView().byId("idAcrM").setValue("");
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			this.getView().byId("objPageScGM").setVisible(false);
			this.getView().byId("objPageScSM").setVisible(false);
			this.getView().byId("objPageScCM").setVisible(false);
			this.getView().byId("objPageScOM").setVisible(false);
			this.getView().byId("btnValidarM").setVisible(false);
			this.getView().byId("btnValidarM").setEnabled(false)
			this.getView().byId("btnGuardarM").setVisible(false);
			this.getView().byId("btnGuardarM").setEnabled(false);
			oView.byId('MODADJFILE').setVisible(false);
			this.getView().byId("gsgM").setVisible(false);
			this.getView().byId("selectAprobadoresM").setVisible(false);
			var objpagel = this.byId("ObjectPageLayoutM");
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.read(
				"/InfoInicialSet?$filter=(Proceso eq 'U')"
				+ "&$expand=NAVSociedades,NAVMonedas,NAVPaises,"
				+ "NAVOrgCompras,NAVGrpCuentas,NAVCondPago,"
				+ "NAVPaisesRegiones,NAVGerencias,NAVPaisRegComunas,"
				+ "NAVBancos,NAVViasPago,NAVCuentas",
				null,[ "" ],false,
				function(data,response){
					oView.setBusy(false);
					
					var NAVGrpCuentasModel = new sap.ui.model.json.JSONModel()
					NAVGrpCuentasModel.setData(data.results[0].NAVGrpCuentas);
					NAVGrpCuentasModel.setSizeLimit(data.results[0].NAVGrpCuentas.results.length);
					oView.byId("inpKtokkM").setModel(NAVGrpCuentasModel);
					
					var NAVPaisesModel = new sap.ui.model.json.JSONModel()
					NAVPaisesModel.setData(data.results[0].NAVPaises);
					NAVPaisesModel.setSizeLimit(data.results[0].NAVPaises.results.length);
					oView.byId("selectPaisM").setModel(NAVPaisesModel);
					oView.byId("selectPaiBankM").setModel(NAVPaisesModel);
					oView.byId("selectPaiBankM2").setModel(NAVPaisesModel);
					oView.byId("selectPaiBankM3").setModel(NAVPaisesModel);
					
					var NAVMonedasModel = new sap.ui.model.json.JSONModel()
					NAVMonedasModel.setData(data.results[0].NAVMonedas);
					NAVMonedasModel.setSizeLimit(data.results[0].NAVMonedas.results.length);
					oView.byId("selectMonedaM").setModel(NAVMonedasModel);

					var NAVCondPagoModel = new sap.ui.model.json.JSONModel()
					NAVCondPagoModel.setData(data.results[0].NAVCondPago);
					NAVCondPagoModel.setSizeLimit(data.results[0].NAVCondPago.results.length);
					oView.byId("selectCondPagoCM").setModel(NAVCondPagoModel);
					oView.byId("selectCondPagoSM").setModel(NAVCondPagoModel);
					
					var NAVSociedadesModel = new sap.ui.model.json.JSONModel()
					NAVSociedadesModel.setData(data.results[0].NAVSociedades);
					NAVSociedadesModel.setSizeLimit(data.results[0].NAVSociedades.results.length);
					oView.byId("selectSociedadesM").setModel(NAVSociedadesModel);
					
					var NAVPaisesRegionesModel = new sap.ui.model.json.JSONModel()
					NAVPaisesRegionesModel.setData(data.results[0].NAVPaisesRegiones);
					NAVPaisesRegionesModel.setSizeLimit(data.results[0].NAVPaisesRegiones.results.length);
					oView.byId("selectRegionM").setModel(NAVPaisesRegionesModel);
					
					var NAVGerenciasModel = new sap.ui.model.json.JSONModel()
					NAVGerenciasModel.setData(data.results[0].NAVGerencias);
					NAVGerenciasModel.setSizeLimit(data.results[0].NAVGerencias.results.length);
					oView.byId("selectAprobadoresM").setModel(NAVGerenciasModel);
					
					var NAVBancosModel = new sap.ui.model.json.JSONModel()
					NAVBancosModel.setData(data.results[0].NAVBancos);
					NAVBancosModel.setSizeLimit(data.results[0].NAVBancos.results.length);
					oView.byId("selectClaBankM").setModel(NAVBancosModel);
					oView.byId("selectClaBankM2").setModel(NAVBancosModel);
					oView.byId("selectClaBankM3").setModel(NAVBancosModel);
					
					var NAVPaisRegComunasModel = new sap.ui.model.json.JSONModel()
					NAVPaisRegComunasModel.setData(data.results[0].NAVPaisRegComunas);
					NAVPaisRegComunasModel.setSizeLimit(data.results[0].NAVPaisRegComunas.results.length);
					oView.byId("selectComunasM").setModel(NAVPaisRegComunasModel);
					
					var NAVViasPagoModel = new sap.ui.model.json.JSONModel()
					NAVViasPagoModel.setData(data.results[0].NAVViasPago);
					NAVViasPagoModel.setSizeLimit(data.results[0].NAVViasPago.results.length);
					oView.byId("selectViasPagoM").setModel(NAVViasPagoModel);
					
					var NAVCuentasModel = new sap.ui.model.json.JSONModel()
					NAVCuentasModel.setData(data.results[0].NAVCuentas);
					NAVCuentasModel.setSizeLimit(data.results[0].NAVCuentas.results.length);
					oView.byId("selectCtaAsocM").setModel(NAVCuentasModel);
					
					var NAVOrgComprasModel = new sap.ui.model.json.JSONModel()
					NAVOrgComprasModel.setData(data.results[0].NAVOrgCompras);
					NAVOrgComprasModel.setSizeLimit(data.results[0].NAVOrgCompras.results.length);
					oView.byId("selectGrpCompM").setModel(NAVOrgComprasModel);
				},
				function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
				});
		},
		modif_sortForm: function(grpcta,data){
			var TRAT_ALL =TRATAMIENTO;
			var TRAT_PEXT = TRATAMIENTO_PEXT;
			var TRATModel = new sap.ui.model.json.JSONModel();
			TRATModel.setData({Trat : TRAT_ALL});
			this.byId("selectTratM").setModel(TRATModel);
			switch(grpcta){
			case 'PEXT':
				if(this.byId('stcd1M').getValue() === ''){
					this.byId('stcd1M').setEditable(true);
				}
				var TRATModel = new sap.ui.model.json.JSONModel();
				TRATModel.setData({Trat : TRAT_PEXT});
				this.byId("selectTratM").setModel(TRATModel);
				this.byId("Lico1M").setVisible(true);
				this.byId("ico1M").setVisible(true);
				this.byId("LGrupEsqProM").setVisible(true);
				this.byId("GrupEsqProM").setVisible(true);
				this.byId("LctrlConfM").setVisible(true);
				this.byId("ctrlConfM").setVisible(true);
				var trat = this.byId('selectTratM').getSelectedKey();
				var l = !(trat === '0007' || trat === '0008');
				this.byId("sexM").setVisible(l);
				this.byId("lbllnaM").setVisible(l);
				this.byId("lnaM").setVisible(l);
				this.byId("lblproM").setVisible(l);
				this.byId("proM").setVisible(l);
				this.byId("lblfnaM").setVisible(l);
				this.byId("fnaM").setVisible(l);
				break;
			case 'HONO':
				this.byId("lblselectIndRetM").setVisible(true);
				this.byId("selectIndRetM").setVisible(true);
				break;
			case 'AVRS':
				this.byId("lblselectGrpTesM").setVisible(true);
				this.byId("selectGrpTesM").setVisible(true);
				break;
			case 'PALT':
				this.byId("selectViasPagoM").setVisible(false);
				this.byId("lblViasPagoM").setVisible(false);
				this.byId("selectCtaAsocM").setVisible(false);
				this.byId("lblCtaAsocM").setVisible(false);
				break;
			default:
				this.byId("lblselectIndRetM").setVisible(false);
				this.byId("selectIndRetM").setVisible(false);
				this.byId("Lico1M").setVisible(false);
				this.byId("ico1M").setVisible(false);
				this.byId("LGrupEsqProM").setVisible(false);
				this.byId("GrupEsqProM").setVisible(false);
				this.byId("LctrlConfM").setVisible(false);
				this.byId("ctrlConfM").setVisible(false);
				this.byId("sexM").setVisible(false);
				this.byId("lbllnaM").setVisible(false);
				this.byId("lnaM").setVisible(false);
				this.byId("lblproM").setVisible(false);
				this.byId("proM").setVisible(false);
				this.byId("lblfnaM").setVisible(false);
				this.byId("fnaM").setVisible(false);
			}
			var oFilter = new sap.ui.model.Filter("KTOKK",sap.ui.model.FilterOperator.EQ,grpcta);
			this.byId("selectCtaAsocM").getBinding("items").filter([ oFilter ]);
			//VIAS DE PAGO
			var context = this.getView().byId("inpKtokkM").getSelectedItem().getBindingContext();
			var arrayObject = context.oModel.getProperty(context.sPath);
			var vparray = arrayObject.ZWELS.split('');
			var oFilters = [];
			for (var ini = 0; ini < vparray.length; ini++) {
				var oFilter = new sap.ui.model.Filter("ZWELS",sap.ui.model.FilterOperator.Contains,vparray[ini]);
				oFilters.push(oFilter);
			}
			var oFiltersC = new sap.ui.model.Filter("KTOKK",sap.ui.model.FilterOperator.EQ,grpcta);
			this.getView().byId("selectViasPagoM").getBinding("items").filter(oFilters);
			this.getView().byId("selectCtaAsocM").getBinding("items").filter(oFiltersC);
			if(data.BANKN2 != ''){
				this.onAddBankM(false);
			}
			if(data.BANKN3 != ''){
				this.onAddBankM(false);
			}
			if(this.byId('selectGrpCompM').getSelectedItems().length > 0){
				this.byId('selectGrpCompM').setEditable(false);
			}else{
				this.byId('selectGrpCompM').setEditable(true);
			}
		},
		modif_modData: function(data){
			var new_data = data;
			new_data.ZWELS = data.ZWELS.split('');
			new_data.BUKRS_MULTI = data.BUKRS_MULTI.split('-');
			new_data.EKORG_MULTI = data.EKORG_MULTI.split('-');
			return new_data;
		},
		modif_onSearchAcr : function(oEvent) {
			this.modif_resetStates();
			var oView = this.getView();
			var that = this;
			oView.setBusy(true);
			oView.byId("gsgM").setVisible(false);
			oView.byId("selectAprobadoresM").setVisible(false);
			oView.byId("btnGuardarM").setEnabled(false);
			var lif = this.pad(oView.byId("idAcrM").getValue());
			var url = serviceUrl;
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.read("/ConsultarAcreedorSet(LIFNR='"+lif+"',TIPO_PROCESO='U',TIPO_VISTA='')",
				null,[ "" ],false,
				function(data,response) {
					oView.setBusy(false);
					if (data.STATUS === 'S') {
						console.log(data);
						oView.byId("selectCtaAsocM").setVisible(true);
						oView.byId("btnValidarM").setEnabled(false)
						oView.byId("objPageScGM").setVisible(true);
						oView.byId("objPageScSM").setVisible(true);
						oView.byId("objPageScCM").setVisible(true);
						oView.byId("objPageScOM").setVisible(true);
						oView.byId("btnValidarM").setVisible(true);
						oView.byId("btnGuardarM").setVisible(true);
						oView.byId('MODADJFILE').setVisible(true);
						oView.byId("gsgM").setVisible(true);
						oView.byId("selectAprobadoresM").setVisible(true);
						var result = that.modif_modData(data);
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(result);
						oView.setModel(oModel,"dataModel");
						that.modif_sortForm(data.KTOKK,result);
						that.modif_onChangePais();
						that.modif_onChangeRegion();
						that.modif_onChangePaisBank();
						that.modif_onChangePaisBank2();
						that.modif_onChangePaisBank3();
						that.byId("RB1-1M").setSelected(data.SEXKZ == '1');
						that.byId("RB1-2M").setSelected(data.SEXKZ == '2');
//						that.getAttachFilesModi('U',data.ID_SOLICITUD);
					}else{
						MessageToast.show(data.MESSAGE);
						oView.byId("objPageScGM").setVisible(false);
						oView.byId("objPageScSM").setVisible(false);
						oView.byId("objPageScCM").setVisible(false);
						oView.byId("objPageScOM").setVisible(false);
						oView.byId("btnValidarM").setVisible(false);
						oView.byId("btnGuardarM").setVisible(false);
						oView.byId("btnGuardarM").setEnabled(false);
						oView.byId('MODADJFILE').setVisible(false);
						oView.byId("gsgM").setVisible(false);
						oView.byId("selectAprobadoresM").setVisible(false);
					}
				},function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
				}
			);
			this.mod_trat_change();
		},
		modif_onChangePais : function(oEvent) {
			this.getView().byId("btnGuardarM").setEnabled(false);
			var selectRegiones = this.getView()	.byId("selectRegionM");
			var seleccPais = this.getView().byId("selectPaisM").getSelectedKey();
			var oFilter = new sap.ui.model.Filter("LAND1",sap.ui.model.FilterOperator.Contains,seleccPais);
			selectRegiones.getBinding("items").filter([ oFilter ]);
			var selectCondPago = this.getView().byId("selectCondPagoSM");
			selectCondPago.getBinding("items").filter([ oFilter ]);
			if(selectCondPago.getItems().length == 0){
				var oFilter = new sap.ui.model.Filter("LAND1",sap.ui.model.FilterOperator.Contains,'XX');
				selectCondPago.getBinding("items").filter([ oFilter ]);
			}
			var selectCondPagoC = this.getView().byId("selectCondPagoCM");
			selectCondPagoC.getBinding("items").filter([ oFilter ]);
			if(selectCondPagoC.getItems().length == 0){
				var oFilter = new sap.ui.model.Filter("LAND1",sap.ui.model.FilterOperator.Contains,'XX');
				selectCondPagoC.getBinding("items").filter([ oFilter ]);
			}
//			if (seleccPais == "CL")
//				selectRegiones.setSelectedKey("13");
//			else
//				selectRegiones	.setSelectedIndex(0);
			this.modif_onChangeRegion();
		},
		modif_onChangePaisBank : function(oEvent) {
			this.getView().byId("btnGuardarM").setEnabled(false);
			var selectClaBank = this.getView().byId("selectClaBankM");
			var seleccPais = this.getView().byId("selectPaiBankM").getSelectedKey();
			var oFilter = new sap.ui.model.Filter("BANKS",sap.ui.model.FilterOperator.Contains,seleccPais);
			selectClaBank.getBinding("items").filter([ oFilter ]);
		},
		modif_onChangePaisBank2 : function(oEvent) {
			this.getView().byId("btnGuardarM").setEnabled(false);
			var selectClaBank = this.getView().byId("selectClaBankM2");
			var seleccPais = this.getView().byId("selectPaiBankM2").getSelectedKey();
			var oFilter = new sap.ui.model.Filter("BANKS",sap.ui.model.FilterOperator.Contains,seleccPais);
			selectClaBank.getBinding("items").filter([ oFilter ]);
		},
		modif_onChangePaisBank3 : function(oEvent) {
			this.getView().byId("btnGuardarM").setEnabled(false);
			var selectClaBank = this.getView().byId("selectClaBankM3");
			var seleccPais = this.getView().byId("selectPaiBankM3").getSelectedKey();
			var oFilter = new sap.ui.model.Filter("BANKS",sap.ui.model.FilterOperator.Contains,seleccPais);
			selectClaBank.getBinding("items").filter([ oFilter ]);
		},
		modif_onChangeRegion : function(oEvent) {
			this.getView().byId("btnGuardarM").setEnabled(false);
			var selectComunas = this.getView().byId("selectComunasM");
			var seleccPais = this.getView().byId("selectPaisM").getSelectedKey();
			var seleccRegion = this.getView().byId("selectRegionM").getSelectedKey();
			var oFilter1 = new sap.ui.model.Filter("LAND1",sap.ui.model.FilterOperator.Contains,seleccPais);
			var oFilter2 = new sap.ui.model.Filter("REGIO",sap.ui.model.FilterOperator.Contains,seleccRegion);
			selectComunas.getBinding("items").filter([oFilter1,oFilter2 ]);
		},
		crea_trat_change: function(){
			this.modif_disableSave();
			var selectGC = this.getView().byId("selectGrpCta").getSelectedKey();
			var sk = this.getView().byId("selectTrat").getSelectedKey();
			if(selectGC === 'PEXT'){
				var l = !(sk === '0007' || sk === '0008');
				this.byId("sex").setVisible(l);
				this.byId("lbllna").setVisible(l);
				this.byId("lna").setVisible(l);
				this.byId("lblpro").setVisible(l);
				this.byId("pro").setVisible(l);
				this.byId("lblfna").setVisible(l);
				this.byId("fna").setVisible(l);
				
			}else{
				this.byId("sex").setVisible(false);
				this.byId("lbllna").setVisible(false);
				this.byId("lna").setVisible(false);
				this.byId("lblpro").setVisible(false);
				this.byId("pro").setVisible(false);
				this.byId("lblfna").setVisible(false);
				this.byId("fna").setVisible(false);
			}
		},
		mod_trat_change: function(){
			this.modif_disableSave();
			var selectGC = this.getView().byId("inpKtokkM").getSelectedKey();
			var sk = this.getView().byId("selectTratM").getSelectedKey();
			if(selectGC === 'PEXT'){
				var l = !(sk === '0007' || sk === '0008');
				this.byId("sexM").setVisible(l);
				this.byId("lbllnaM").setVisible(l);
				this.byId("lnaM").setVisible(l);
				this.byId("lblproM").setVisible(l);
				this.byId("proM").setVisible(l);
				this.byId("lblfnaM").setVisible(l);
				this.byId("fnaM").setVisible(l);
				
			}else{
				this.byId("sexM").setVisible(false);
				this.byId("lbllnaM").setVisible(false);
				this.byId("lnaM").setVisible(false);
				this.byId("lblproM").setVisible(false);
				this.byId("proM").setVisible(false);
				this.byId("lblfnaM").setVisible(false);
				this.byId("fnaM").setVisible(false);
			}
		},
		modif_disableSave : function(e) {
			this.getView().byId("btnGuardarM").setEnabled(false);
			this.getView().byId("btnValidarM").setEnabled(true);
			this.getView().byId("btnGuarda").setEnabled(false);
			this.getView().byId("creavalida").setEnabled(true);
		},
		modif_reset : function() {
			this.getView().byId("objPageScGM").setVisible(false);
			this.getView().byId("objPageScSM").setVisible(false);
			this.getView().byId("objPageScCM").setVisible(false);
			this.getView().byId("objPageScOM").setVisible(false);
			this.getView().byId("btnValidarM").setVisible(false);
			this.getView().byId("btnGuardarM").setVisible(false);
			this.getView().byId("btnGuardarM").setEnabled(false);
			this.getView().byId("gsgM").setVisible(false);
			this.getView().byId("selectAprobadoresM").setVisible(false);
			this.getView().byId("idAcrM").setValue("");
			this.modif_resetStates();
			this.crea_onOrgCompPress();
		},
		ampliar_showAmpliar : function() {
			this.onResetAmpl();
		},
		borr_showBorrado : function() {
			this.onResetBorr();
		},
		onSearchBorrCP : function() {
			var url = serviceUrl;
			var oView = this.getView();
			this.onResetBorr();
			oView.byId("btnGuardaBCP").setEnabled(false);
			var lifnr = this.getView().byId("idAcrBCP").getValue();
			var lif = this.pad(lifnr);
			var selectAprobadoresBCP = this.getView().byId("selectAprobadoresBCP");
			var selectGrpCompras = this.getView().byId("selectGrpCompBCPCopia");
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.read(
					"/InfoInicialSet?$filter=(Proceso eq 'D')"
					+ "&$expand=NAVGerencias,NAVOrgCompras",
					null,
					[ "" ],
					false,
					function(data,response) {
						oView.setBusy(false);
						var result = data.results;
						var oModelAprobadores = new sap.ui.model.json.JSONModel();
						var resultGerencias = result[0].NAVGerencias.results;
						oModelAprobadores.setData({
							Aprobadores : resultGerencias
						});
						selectAprobadoresBCP.setModel(oModelAprobadores);
						var oModelGrpCompras = new sap.ui.model.json.JSONModel();
						var resultGrpCompras = result[0].NAVOrgCompras.results;
						oModelGrpCompras.setData({
							GrpComp : resultGrpCompras
						});
						selectGrpCompras.setModel(oModelGrpCompras);
					},
					function(err) {
						oView.setBusy(false);
						var errTxt = err.message + "\n";
						sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
					});

			oView.setBusy(true);
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel(url, true/* ,user,pass */);
			oModel.read(
				"/ConsultarAcreedorSet(LIFNR='"+ lif+ "',TIPO_PROCESO='D',TIPO_VISTA='CP')",
				null,[ "" ],false,
				function(data,response) {
					oView.setBusy(false);
					var result = data;
					if (data.STATUS === 'S') {
						oView.byId("formCompraBCP").setVisible(true);
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(result);
					oView.setModel(oModel,"dataModel");
					var oModelGrpComp = new sap.ui.model.json.JSONModel();
					var grpCompCurrent = [];
					grpCompCurrent = data.EKORG_MULTI.split('-');
					var grps = [];
					for (var i = 0; i < grpCompCurrent.length; i++) {
						var obj = {
								"EKORG" : grpCompCurrent[i],
								"EKORG_DESC" : grpCompCurrent[i]
						};
						grps.push(obj);
					}
					var data = {
							'GrpComp' : grps
					};
					oModelGrpComp.setData(data);
					var selgc = oView.byId("selectGrpCompBCP");
					selgc.setModel(oModelGrpComp);
					var loevm = result.LOEVM;
					var loevm_compras = result.LOEVM_COMPRAS;
					var loevm_contabl = result.LOEVM_CONTABLE;
					var nodel = result.NODEL;
					var nodel_conta = result.NODEL_CONTABLE;
					var sperm = result.SPERM;
					if (loevm === '') {
						oView.byId("chk1BCP").setSelected(false);
					} else {
						oView.byId("chk1BCP").setSelected(true);
					}
					if (loevm_compras === '')
						oView.byId("chk2BCP").setSelected(false);
					else
						oView.byId("chk2BCP").setSelected(true);
					if (nodel === '')
						oView.byId("chk3BCT").setSelected(false);
					else
						oView.byId("chk3BCT").setSelected(true);
					if (nodel_conta === '')
						oView.byId("chk4BCT").setSelected(false);
					else
						oView.byId("chk4BCT").setSelected(true);
					oView.byId("btnGuardaBCP").setVisible(true);
					oView.byId("btnValidaBCP").setVisible(true);
					oView.byId("selectAprobadoresBCP").setVisible(true);
					oView.byId("lifnrBCP").setVisible(true);
					oView.byId(	"lifnrBCT").setVisible(true);
					oView.byId(	"name1BCP").setVisible(true);
					oView.byId(	"name1BCT").setVisible(true);
					oView.byId(	"name2BCP").setVisible(true);
					oView.byId(	"name2BCT").setVisible(true);
					oView.byId(	"selectAprobadoresBCT").setVisible(true);
					oView.byId(	"selectGrpCompBCP").setVisible(true);
					oView.byId(	"selectSociedadesBCT").setVisible(true);
					oView.byId(	"chk1BCP").setVisible(true);
					oView.byId("chk2BCP").setVisible(true);
					oView.byId("chk4BCT").setVisible(true);
					oView.byId("lblb1")	.setVisible(true);
					oView.byId("lblb4").setVisible(	true);
				} else {
					MessageToast.show(data.MESSAGE + " Acción no es posible.");
				}
			},
			function(err) {
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
			});
		},
		modif_livechangename1 : function() {
			var name1 = this.getView().byId(
			"name1M").getValue();
			this.getView().byId("titctaM").setValue(name1);			
			this.getView().byId("titctaM2").setValue(name1);
			this.getView().byId("titctaM3").setValue(name1);
			this.modif_disableSave();
		},
		onSearchBorrCT : function() {
			var url = serviceUrl;
			var oView = this.getView();
			this.onResetBorr();

			var selectAprobadoresBCT = this.getView().byId("selectAprobadoresBCT");
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.read("/InfoInicialSet?$filter=(Proceso eq 'D')" 
				+ "&$expand=NAVGerencias,NAVSociedades",
				null,
				[ "" ],
				false,
				function(data,response) {
					oView.setBusy(false);
					var result = data.results;
					var oModelAprobadores = new sap.ui.model.json.JSONModel();
					var resultGerencias = result[0].NAVGerencias.results;
					oModelAprobadores.setData({
						Aprobadores : resultGerencias
					});
					selectAprobadoresBCT.setModel(oModelAprobadores);
					var oModelSociedades = new sap.ui.model.json.JSONModel();
					var resultSociedades = result[0].NAVSociedades.results;
					oModelSociedades.setData({
						Sociedades : resultSociedades
					});
					var selectSociedadesCopia = oView.byId("selectSociedadesBCTCopia");
					selectSociedadesCopia.setModel(oModelSociedades);
				},function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
				});
			var lifnr = this.getView().byId("idAcrBCT").getValue();
			var lif = this.pad(lifnr);
			oView.setBusy(true);
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel(url, true/* ,user,pass */);
			oModel.read(
					"/ConsultarAcreedorSet(LIFNR='" + lif
					+ "',TIPO_PROCESO='D',TIPO_VISTA='CT')",
					null,[ "" ],false,
					function(data,response) {
						oView.setBusy(false);
						var result = data;
						if (data.STATUS === 'S') {
							oView.byId("formContabBCT").setVisible(true);
							var oModel = new sap.ui.model.json.JSONModel();
							oModel.setData(result);
							oView.setModel(oModel,"dataModel");
							var oModelSociedad = new sap.ui.model.json.JSONModel();
							var sociedadesCurrent = [];
							sociedadesCurrent = data.BUKRS_MULTI.split('-');
							var socs = [];
							for (var i = 0; i < sociedadesCurrent.length; i++) {
								var obj = {
										"BUKRS" : sociedadesCurrent[i],
										"BUKRS_DESC" : sociedadesCurrent[i]
								};
								socs.push(obj);
							}
							var data = {
								'Sociedades' : socs
							};
							oModelSociedad.setData(data);
							var selsoc = oView.byId("selectSociedadesBCT");
							selsoc.setModel(oModelSociedad);
							var loevm = result.LOEVM;
							var loevm_compras = result.LOEVM_COMPRAS;
							var loevm_contabl = result.LOEVM_CONTABLE;
							var nodel = result.NODEL;
							var nodel_conta = result.NODEL_CONTABLE;
							var sperm = result.SPERM;
							if (loevm === '') {
								oView.byId("chk1BCP").setSelected(false);
							} else {
								oView.byId("chk1BCP").setSelected(true);
							}
							if (loevm_compras === '')
								oView.byId("chk2BCP").setSelected(false);
							else
								oView.byId("chk2BCP").setSelected(true);
							if (nodel === '')
								oView.byId(	"chk3BCT").setSelected(	false);
							else
								oView.byId(	"chk3BCT").setSelected(	true);
							if (nodel_conta === '')
								oView.byId(	"chk4BCT").setSelected(	false);
							else
								oView.byId(	"chk4BCT").setSelected(	true);
								oView.byId(	"btnGuardaBCT").setVisible(	true);
								oView.byId(	"btnValidaBCT").setVisible(	true);
								oView.byId("selectAprobadoresBCP").setVisible(true);
								oView.byId("lifnrBCP").setVisible(true);
								oView.byId("lifnrBCT").setVisible(true);
								oView.byId("name1BCP").setVisible(true);
								oView.byId("name1BCT").setVisible(true);
								oView.byId("name2BCP").setVisible(true);
								oView.byId("name2BCT").setVisible(true);
								oView.byId("selectAprobadoresBCT").setVisible(true);
								oView.byId("selectGrpCompBCP").setVisible(true);
								oView.byId("selectSociedadesBCT").setVisible(true);
								oView.byId("chk1BCP").setVisible(true);
								oView.byId("chk2BCP").setVisible(true);
								oView.byId("chk3BCT").setVisible(true);
								oView.byId("chk4BCT").setVisible(true);
								oView.byId("lblb1").setVisible(true);
								oView.byId("lblb4").setVisible(true);
						} else {
							MessageToast.show(data.MESSAGE + " Acción no es posible.");
						}
					},
					function(err) {
						oView.setBusy(false);
						var errTxt = err.message + "\n";
						sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
					});
		},
		borr_onSaveCT : function() {
			var that = this;
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			var oEntry = new sap.ui.model.json.JSONModel();
			var lifnr = oView.byId("lifnrBCT").getValue();
			var name1 = oView.byId("name1BCT").getValue();// nombre acreedor
			var name2 = oView.byId("name2BCT").getValue();
			var bukrs = oView.byId("selectSociedadesBCT").getSelectedKey();// sociedades
			var aprob = this.getView().byId("selectAprobadoresBCT").getSelectedKey();
			// campos especiales para borrado
			var ktokk = oView.byId("ktokk").getText();
			var areas = "";
			var compr = "";
			var datgr = "";
			var sosel = "";
			if (oView.byId("chk3BCT").getSelected())
				datgr = "X";
			if (oView.byId("chk4BCT").getSelected())
				sosel = "X";
			oEntry = {
					"TIPO_PROCESO" : 'D',
					"ID_SOLICITUD" : '',
					"LIFNR" : lifnr,
					"ANRED" : '',
					"NAME1" : name1,
					"NAME2" : name2,
					"KTOKK" : ktokk,
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
					"LOEVM_COMPRAS" : '',
					"LOEVM" : areas,
//					"LOEVM_CONTABLE" : compr,
					"NODEL" : datgr,
					"NODEL_CONTABLE" : sosel,
					"APROBADOR" : aprob

			};
			oModel.create(
				"/CrearSolicitudSet",
				oEntry,null,
				function(data) {
					oView.setBusy(false);
					if (data.STATUS === 'S') {
						MessageToast.show(data.MESSAGE);
						oView.byId("btnGuardaBCT").setEnabled(false);
						that.reset_CPT();
						oView.byId("lifnrBCT").getValue();
						oView.byId("name1BCT").getValue();// nombre acreedor
					} else {
						MessageToast.show("Error: " + data.MESSAGE);
					}
				},function(e) {
					oView.setBusy(false);MessageToast.show("Problemas en el proceso(" + e.getMessage + ").");
				}
			);

		},
		reset_CPT:function(){
			this.byId('ktokk').setText('');
			this.byId('lifnrBCP').setValue('');
			this.byId('selectAprobadoresBCP').setSelectedKey('');
			this.byId('name1BCP').setValue('');
			this.byId('name2BCP').setValue('');
			this.byId('selectGrpCompBCP').setSelectedKey('');
			this.byId('chk1BCP').setSelected(false);
			this.byId('chk3BCT').setSelected(false);
			this.byId("chk4BCT").setSelected(false);

			
			this.byId("btnGuardaBCP").setVisible(false);
			this.byId("btnValidaBCP").setVisible(false);
			this.byId("selectAprobadoresBCP").setVisible(false);
			this.byId("lifnrBCP").setVisible(false);
			this.byId("lifnrBCT").setVisible(false);
			this.byId("name1BCP").setVisible(false);
			this.byId("name1BCT").setVisible(false);
			this.byId("name2BCP").setVisible(false);
			this.byId("name2BCT").setVisible(false);
			this.byId("selectAprobadoresBCT").setVisible(false);
			this.byId("selectGrpCompBCP").setVisible(false);
			this.byId("selectSociedadesBCT").setVisible(false);
			this.byId("chk1BCP").setVisible(false);
			this.byId("chk2BCP").setVisible(false);
			this.byId("chk4BCT").setVisible(false);
			this.byId("lblb1")	.setVisible(false);
			this.byId("lblb4").setVisible(false);
			this.byId("chk3BCT").setVisible(false);
		},
		borr_onSaveCP : function() {
			var that = this;
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			var oModel = new sap.ui.model.odata.ODataModel(	url, true);
			var oEntry = new sap.ui.model.json.JSONModel();
			var lifnr = oView.byId("lifnrBCP").getValue();
			var name1 = oView.byId("name1BCP").getValue();// nombre acreedor
			var name2 = oView.byId("name2BCP").getValue();
			var ekorg = oView.byId("selectGrpCompBCP").getSelectedKey();// org com
			var aprob = this.getView().byId("selectAprobadoresBCP").getSelectedKey();
			// campos especiales para borrado
			var ktokk = oView.byId("ktokk").getText();
			var areas = "";
			var compr = "";
			var datgr = "";
			if (oView.byId("chk1BCP").getSelected())
				areas = "X";
			if (oView.byId("chk2BCP").getSelected())
				compr = "X";
//			if (oView.byId("chk3BCP").getSelected())
//			datgr = "X";
			oEntry = {
					"TIPO_PROCESO" : 'D',
					"ID_SOLICITUD" : '',
					"LIFNR" : lifnr,
					"ANRED" : '',
					"NAME1" : name1,
					"NAME2" : name2,
					"KTOKK" : ktokk,
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
					"BUKRS" : '',
					"HKONT" : '',
					"IBAN" : '',
					"FDGRV" : '',
					"ZTERM" : '',
					"ZWELS" : '',
					"EKORG" : ekorg,
					"WAERS" : '',
					"BUKRS_MULTI" : '',
					"EKORG_MULTI" : '',
					"LOEVM" : areas,
					"LOEVM_COMPRAS" : compr,
//					"SPERM" : datgr,
					"APROBADOR" : aprob
			};
			oModel.create("/CrearSolicitudSet",
				oEntry,null,
				function(data) {
					oView.setBusy(false);
					if (data.STATUS === 'S') {
						MessageToast.show(data.MESSAGE);
						oView.byId("btnGuardaBCP").setEnabled(false);
						that.reset_CPT();
					} else {
						MessageToast.show("Error: "+ data.MESSAGE);
					}
				},
				function(e) {
					oView.setBusy(false);
					MessageToast.show("Problemas en el proceso("+ e.getMessage+ ").");
				}
			);

		},
		borr_validaCT : function() {
			var ok = true;
			var oView = this.getView();
			oView.byId("btnGuardaBCT").setEnabled(false);
			if (oView.byId("selectAprobadoresBCT").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Indique Gerente/Subgerente Aprobador.");

			} else if (oView.byId("selectSociedadesBCT").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Selecione Sociedad.");
			}
			if (ok)
				oView.byId("btnGuardaBCT").setEnabled(true);
			else
				oView.byId("btnGuardaBCT").setEnabled(false);
		},
		misol_getListado : function() {
			this.misol_getInit();
			this.getView().byId("idSolicTable").setVisible(true);
			this.getView().byId("ObjectPageLayout").setVisible(false);
			this.getView().byId("contabKeyBMS").setVisible(false);
			this.getView().byId("comprasKeyBMS").setVisible(false);
			this.getView().byId("contabKeyAMS").setVisible(false);
			this.getView().byId("comprasKeyAMS").setVisible(false);
			var url = serviceUrl;
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			var tabla = this.getView().byId("idSolicTable");
			var fecha = this.getView().byId("DRS2").getDateValue();
			var delim = this.getView().byId("DRS2").getSecondDateValue();
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd/MM/yyyy"});
			var dateIni = dateFormat.format(new Date(fecha));
			var dateFin = dateFormat.format(new Date(delim));
			var oView = this.getView();
			var query = "";
			if (fecha != null) {
				query = "?$filter=FECHA ge '" + dateIni + "' and FECHA le '" + dateFin + "'";
			}
			oModel.read(
				"/MisSolicitudesSet"
				+ query,null,[ "" ],false,
				function(data,response) {
					oView.setBusy(false);
					var oModelProceso = new sap.ui.model.json.JSONModel();
					var resultados = data.results;
					var solicitudes = [];
					for (var i = 0; i < resultados.length; i++) {
						var estado = "None";
						var icon = "/FioriSCP.z_figestionacreedores/img/Created.png";
						var tipo = "";
						if (resultados[i].TIPO_PROCESO === 'C')
							tipo = "Creación";
						else if (resultados[i].TIPO_PROCESO === 'U')
							tipo = "Modificación";
						else if (resultados[i].TIPO_PROCESO === 'E')
							tipo = "Ampliación";
						else if (resultados[i].TIPO_PROCESO === 'D')
							tipo = "Bloqueo/Desbloqueo";
						if (resultados[i].SEMAFORO === '1') {
							estado = "None";
						} else if (resultados[i].SEMAFORO === '2') {
							estado = "Warning";
							icon = "/FioriSCP.z_figestionacreedores/img/InProcess.png";
						} else if (resultados[i].SEMAFORO === '3') {
							estado = "Success";
							icon = "/FioriSCP.z_figestionacreedores/img/Aproved.png";
						} else if (resultados[i].SEMAFORO === '4') {
							estado = "Error";
							icon = "/FioriSCP.z_figestionacreedores/img/Reject.png";
						}
						var obj = {
							"ID_PROCESO" : resultados[i].ID_PROCESO,
							"TIPO_PROCESO" : tipo,
							"TIPO_PROCESO_ID" : resultados[i].TIPO_PROCESO,
							"ERSDA" : resultados[i].ERSDA,
							"ESTADO" : resultados[i].ESTADO,
							"SUBESTADO" : resultados[i].SUBESTADO,
							"NAME1" : resultados[i].NAME1,
							"KTOKK" : resultados[i].KTOKK,
							"LIFNR" : resultados[i].LIFNR,
							"MOTIVO_RECHAZO" : resultados[i].MOTIVO_RECHAZO,
							"SEMAFORO" : resultados[i].SEMAFORO,
							"STATE" : estado,
							"ICON" : icon
						};
						solicitudes.push(obj);
					}
					var data = {'listSolicitudes' : solicitudes};
						oModelProceso.setData(data);
						tabla.setModel(oModelProceso);
					},
					function(err) {
						oView.setBusy(false);
						var errTxt = err.message + "\n";
						sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
					});
		},
		misol_getInit:function(){
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
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
					
					var NAVGerenciasModel = new sap.ui.model.json.JSONModel()
					NAVGerenciasModel.setData(data.results[0].NAVGerencias);
					NAVGerenciasModel.setSizeLimit(data.results[0].NAVGerencias.results.length);
					oView.byId("selectAprobadoresS").setModel(NAVGerenciasModel);
					
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
					oView.byId("selectViasPagoAC").setModel(NAVViasPagoModel);
					
					var NAVCuentasModel = new sap.ui.model.json.JSONModel()
					NAVCuentasModel.setData(data.results[0].NAVCuentas);
					NAVCuentasModel.setSizeLimit(data.results[0].NAVCuentas.results.length);
					oView.byId("selectCtaAsocS").setModel(NAVCuentasModel);
					
					var NAVOrgComprasModel = new sap.ui.model.json.JSONModel()
					NAVOrgComprasModel.setData(data.results[0].NAVOrgCompras);
					NAVOrgComprasModel.setSizeLimit(data.results[0].NAVOrgCompras.results.length);
					oView.byId("selectGrpCompS").setModel(NAVOrgComprasModel);
					oView.byId("selectGrpCompBD").setModel(NAVOrgComprasModel);
					oView.byId("selectGrpCompBDA").setModel(NAVOrgComprasModel);
					
					oView.byId("selectGrpCompA").setModel(NAVOrgComprasModel);
					oView.byId("selectGrpCompA2").setModel(NAVOrgComprasModel);
				},
				function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
				});
		},
		admsol_getInit:function(){
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
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
					oView.byId("lblGrpCtaADM").setModel(NAVGrpCuentasModel);
					oView.byId("grupCtaBDA").setModel(NAVGrpCuentasModel);
					oView.byId("grpCtaBDCA").setModel(NAVGrpCuentasModel);
					oView.byId("grpCtaAA").setModel(NAVGrpCuentasModel);
					oView.byId("grpCtaACA").setModel(NAVGrpCuentasModel);
					
					var NAVPaisesModel = new sap.ui.model.json.JSONModel()
					NAVPaisesModel.setData(data.results[0].NAVPaises);
					NAVPaisesModel.setSizeLimit(data.results[0].NAVPaises.results.length);
					oView.byId("selectPaisA").setModel(NAVPaisesModel);
					oView.byId("selectPaiBankA").setModel(NAVPaisesModel);
					oView.byId("selectPaiBankA2").setModel(NAVPaisesModel);
					oView.byId("selectPaiBankA3").setModel(NAVPaisesModel);
					
					var NAVMonedasModel = new sap.ui.model.json.JSONModel()
					NAVMonedasModel.setData(data.results[0].NAVMonedas);
					NAVMonedasModel.setSizeLimit(data.results[0].NAVMonedas.results.length);
					oView.byId("selectMonedaA").setModel(NAVMonedasModel);

					var NAVCondPagoModel = new sap.ui.model.json.JSONModel()
					NAVCondPagoModel.setData(data.results[0].NAVCondPago);
					NAVCondPagoModel.setSizeLimit(data.results[0].NAVCondPago.results.length);
					oView.byId("selectCondPagoCA").setModel(NAVCondPagoModel);
					oView.byId("selectCondPagoSA").setModel(NAVCondPagoModel);
					
					var NAVSociedadesModel = new sap.ui.model.json.JSONModel()
					NAVSociedadesModel.setData(data.results[0].NAVSociedades);
					NAVSociedadesModel.setSizeLimit(data.results[0].NAVSociedades.results.length);
					oView.byId("selectSociedadesA").setModel(NAVSociedadesModel);
					oView.byId("selectSociedadesBDCA").setModel(NAVSociedadesModel);
					oView.byId("selectSociedadesACA").setModel(NAVSociedadesModel);
					oView.byId("selectSociedadesACA2").setModel(NAVSociedadesModel);
					
					var NAVPaisesRegionesModel = new sap.ui.model.json.JSONModel()
					NAVPaisesRegionesModel.setData(data.results[0].NAVPaisesRegiones);
					NAVPaisesRegionesModel.setSizeLimit(data.results[0].NAVPaisesRegiones.results.length);
					oView.byId("selectRegionA").setModel(NAVPaisesRegionesModel);
					
					var NAVGerenciasModel = new sap.ui.model.json.JSONModel()
					NAVGerenciasModel.setData(data.results[0].NAVGerencias);
					NAVGerenciasModel.setSizeLimit(data.results[0].NAVGerencias.results.length);
					oView.byId("lblAprobadoresADM").setModel(NAVGerenciasModel);
					
					var NAVBancosModel = new sap.ui.model.json.JSONModel()
					NAVBancosModel.setData(data.results[0].NAVBancos);
					NAVBancosModel.setSizeLimit(data.results[0].NAVBancos.results.length);
					oView.byId("selectClaBankA").setModel(NAVBancosModel);
					oView.byId("selectClaBankA2").setModel(NAVBancosModel);
					oView.byId("selectClaBankA3").setModel(NAVBancosModel);
					
					var NAVPaisRegComunasModel = new sap.ui.model.json.JSONModel()
					NAVPaisRegComunasModel.setData(data.results[0].NAVPaisRegComunas);
					NAVPaisRegComunasModel.setSizeLimit(data.results[0].NAVPaisRegComunas.results.length);
					oView.byId("selectComunasA").setModel(NAVPaisRegComunasModel);
					
					var NAVViasPagoModel = new sap.ui.model.json.JSONModel()
					NAVViasPagoModel.setData(data.results[0].NAVViasPago);
					NAVViasPagoModel.setSizeLimit(data.results[0].NAVViasPago.results.length);
					oView.byId("selectViasPagoA").setModel(NAVViasPagoModel);
					oView.byId("selectViasPagoACA").setModel(NAVViasPagoModel);
					
					var NAVCuentasModel = new sap.ui.model.json.JSONModel()
					NAVCuentasModel.setData(data.results[0].NAVCuentas);
					NAVCuentasModel.setSizeLimit(data.results[0].NAVCuentas.results.length);
					oView.byId("selectCtaAsocA").setModel(NAVCuentasModel);
					
					var NAVOrgComprasModel = new sap.ui.model.json.JSONModel()
					NAVOrgComprasModel.setData(data.results[0].NAVOrgCompras);
					NAVOrgComprasModel.setSizeLimit(data.results[0].NAVOrgCompras.results.length);
					oView.byId("selectGrpCompA").setModel(NAVOrgComprasModel);
					oView.byId("selectGrpCompAA2").setModel(NAVOrgComprasModel);
					oView.byId("selectGrpCompAA").setModel(NAVOrgComprasModel);
					oView.byId("selectGrpCompADM").setModel(NAVOrgComprasModel);
				},
				function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
				});
		},
//		misol_getListado2 : function() {
//			this.getView().byId("idSolicTable2").setVisible(true);
//			this.getView().byId("ObjectPageLayout2").setVisible(false);
//			var url = serviceUrl;
//			var oModel = new sap.ui.model.odata.ODataModel(url, true);
//			var tabla = this.getView().byId("idSolicTable2");
//			var oView = this.getView();
//			oModel.read("/MisSolicitudesSet",
//				null,[ "" ],false,
//				function(data,response) {
//					oView.setBusy(false);
//					var oModelProceso = new sap.ui.model.json.JSONModel();
//					var resultados = data.results;
//					var solicitudes = [];
//					for (var i = 0; i < resultados.length; i++) {
//						var estado = "None";
//						var icon = "/z_figestionacreedores/img/Created.png";
//						var tipo = "";
//						if (resultados[i].TIPO_PROCESO === 'C')
//							tipo = "Creación";
//						else if (resultados[i].TIPO_PROCESO === 'U')
//							tipo = "Modificación";
//						else if (resultados[i].TIPO_PROCESO === 'E')
//							tipo = "Ampliación";
//						else if (resultados[i].TIPO_PROCESO === 'D')
//							tipo = "Bloqueo/Desbloqueo";
//						if (resultados[i].SEMAFORO === '1') {
//							estado = "None";
//						} else if (resultados[i].SEMAFORO === '2') {
//							estado = "Warning";
//							icon = "/z_figestionacreedores/img/InProcess.png";
//						} else if (resultados[i].SEMAFORO === '3') {
//							estado = "Success";
//							icon = "/z_figestionacreedores/img/Aproved.png";
//						} else if (resultados[i].SEMAFORO === '4') {
//							estado = "Error";
//							icon = "/z_figestionacreedores/img/Reject.png";
//						}
//						var obj = {
//								"ID_PROCESO" : resultados[i].ID_PROCESO,
//								"TIPO_PROCESO" : tipo,
//								"TIPO_PROCESO_ID" : resultados[i].TIPO_PROCESO,
//								"ERSDA" : resultados[i].ERSDA,
//								"ESTADO" : resultados[i].ESTADO,
//								"SUBESTADO" : resultados[i].SUBESTADO,
//								"NAME1" : resultados[i].NAME1,
//								"KTOKK" : resultados[i].KTOKK,
//								"MOTIVO_RECHAZO" : resultados[i].MOTIVO_RECHAZO,
//								"SEMAFORO" : resultados[i].SEMAFORO,
//								"STATE" : estado,
//								"ICON" : icon
//						};
//						solicitudes.push(obj);
//					}
//					var data = {'listSolicitudes' : solicitudes};
//					oModelProceso.setData(data);
//					tabla.setModel(oModelProceso);
//				},
//				function(err) {
//					oView.setBusy(false);
//					var errTxt = err.message + "\n";
//					sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
//				}
//			);
//		},
		adm_getListado : function() {
			this.admsol_getInit();
			this.getView().byId("idSolicTableADM").setVisible(true);
			this.getView().byId("ObjectPageLayoutADM").setVisible(false);
			this.getView().byId("contabKeyBADM").setVisible(false);
			this.getView().byId("comprasKeyBADM").setVisible(false);
			this.getView().byId("contabKeyAADM").setVisible(false);
			this.getView().byId("comprasKeyAADM").setVisible(false);
			var url = serviceUrl;
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			var tabla = this.getView().byId("idSolicTableADM");
			var fecha = this.getView().byId("DRS2A").getDateValue();
			var delim = this.getView().byId("DRS2A").getSecondDateValue();
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern : "dd/MM/yyyy"
			});
			var dateIni = dateFormat.format(new Date(fecha));
			var dateFin = dateFormat.format(new Date(delim));
			var oView = this.getView();
			var query = "";
			if (fecha != null) {
				query = "?$filter=FECHA ge '" + dateIni + "' and FECHA le '" + dateFin + "'";
			}
			var oView = this.getView();
			var that = this;
			oModel.read(
				"/AdmSolicitudesSet"
				+ query,null,[ "" ],false,
				function(data,response) {
					oView.setBusy(false);
					var oModelProceso = new sap.ui.model.json.JSONModel();
					var resultados = data.results;
					var solicitudes = [];
					for (var i = 0; i < resultados.length; i++) {
						var estado = "None";
						var estadoCm = "None";
						var estadoCn = "None";
						var estadoFi = "None";
						var estadoGe = "None";
						var estadoTe = "None";
						var estadoGC = "None";
						var icon = "/FioriSCP.z_figestionacreedores/img/Created.png";
						var iconCm = "/FioriSCP.z_figestionacreedores/img/Created.png";
						var iconCn = "/FioriSCP.z_figestionacreedores/img/Created.png";
						var iconFi = "/FioriSCP.z_figestionacreedores/img/Created.png";
						var iconGe = "/FioriSCP.z_figestionacreedores/img/Created.png";
						var iconTe = "/FioriSCP.z_figestionacreedores/img/Created.png";
						var iconGC = "/FioriSCP.z_figestionacreedores/img/Created.png";
						var tipo = "";
						if (resultados[i].TIPO_PROCESO === 'C')
							tipo = "Creación";
						else if (resultados[i].TIPO_PROCESO === 'U')
							tipo = "Modificación";
						else if (resultados[i].TIPO_PROCESO === 'E')
							tipo = "Ampliación";
						else if (resultados[i].TIPO_PROCESO === 'D')
							tipo = "Bloqueo/Desbloqueo";
						if (resultados[i].SEMAFORO === '1') {
							estado = "None";
						} else if (resultados[i].SEMAFORO === '2') {
							estado = "Warning";
							icon = "/FioriSCP.z_figestionacreedores/img/InProcess.png";
						} else if (resultados[i].SEMAFORO === '3') {
							estado = "Success";
							icon = "/FioriSCP.z_figestionacreedores/img/Aproved.png";
						} else if (resultados[i].SEMAFORO === '4') {
							estado = "Error";
							icon = "/FioriSCP.z_figestionacreedores/img/Reject.png";
						}
						// COMPRAS
						if (resultados.SEMAFORO_COMPRAS === '1') {
							estadoCm = "None";
						} else if (resultados.SEMAFORO_COMPRAS === '2') {
							estadoCm = "Warning";
							iconCm = "/FioriSCP.z_figestionacreedores/img/InProcess.png";
						} else if (resultados.SEMAFORO_COMPRAS === '3') {
							estadoCm = "Success";
							iconCm = "/FioriSCP.z_figestionacreedores/img/Aproved.png";
						} else if (resultados.SEMAFORO_COMPRAS === '4') {
							estadoCm = "Error";
							iconCm = "/FioriSCP.z_figestionacreedores/img/Reject.png";
						}
						// CONT
						if (resultados.SEMAFORO_CONTABLE === '1') {
							estadoCn = "None";
						} else if (resultados.SEMAFORO_CONTABLE === '2') {
							estadoCn = "Warning";
							iconCn = "/FioriSCP.z_figestionacreedores/img/InProcess.png";
						} else if (resultados.SEMAFORO_CONTABLE === '3') {
							estadoCn = "Success";
							iconCn = "/FioriSCP.z_figestionacreedores/img/Aproved.png";
						} else if (resultados.SEMAFORO_CONTABLE === '4') {
							estadoCn = "Error";
							iconCn = "/FioriSCP.z_figestionacreedores/img/Reject.png";
						}
						// FINANZAS
						if (resultados.SEMAFORO_FINANZAS === '1') {
							estadoFi = "None";
						} else if (resultados.SEMAFORO_FINANZAS === '2') {
							estadoFi = "Warning";
							iconFi = "/FioriSCP.z_figestionacreedores/img/InProcess.png";
						} else if (resultados.SEMAFORO_FINANZAS === '3') {
							estadoFi = "Success";
							iconFi = "/FioriSCP.z_figestionacreedores/img/Aproved.png";
						} else if (resultados.SEMAFORO_FINANZAS === '4') {
							estadoFi = "Error";
							iconFi = "/FioriSCP.z_figestionacreedores/img/Reject.png";
						}
						// FINANZAS
						if (resultados.SEMAFORO_GERENCIA === '1') {
							estadoGe = "None";
						} else if (resultados.SEMAFORO_GERENCIA === '2') {
							estadoGe = "Warning";
							iconGe = "/FioriSCP.z_figestionacreedores/img/InProcess.png";
						} else if (resultados.SEMAFORO_GERENCIA === '3') {
							estadoGe = "Success";
							iconGe = "/FioriSCP.z_figestionacreedores/img/Aproved.png";
						} else if (resultados.SEMAFORO_GERENCIA === '4') {
							estadoGe = "Error";
							iconGe = "/FioriSCP.z_figestionacreedores/img/Reject.png";
						}
						//TESORERIA
						if (resultados.SEMAFORO_TESORERIA === '1') {
							estadoTe = "None";
						} else if (resultados.SEMAFORO_TESORERIA === '2') {
							estadoTe = "Warning";
							iconTe = "/FioriSCP.z_figestionacreedores/img/InProcess.png";
						} else if (resultados.SEMAFORO_TESORERIA === '3') {
							estadoTe = "Success";
							iconTe = "/FioriSCP.z_figestionacreedores/img/Aproved.png";
						} else if (resultados.SEMAFORO_TESORERIA === '4') {
							estadoTe = "Error";
							iconTe = "/FioriSCP.z_figestionacreedores/img/Reject.png";
						}
						//GERENTE_COMPRAS
						if (resultados.SEMAFORO_GERENTE_COMPRAS === '1') {
							estadoGC = "None";
						} else if (resultados.SEMAFORO_GERENTE_COMPRAS === '2') {
							estadoGC = "Warning";
							iconGC = "/FioriSCP.z_figestionacreedores/img/InProcess.png";
						} else if (resultados.SEMAFORO_GERENTE_COMPRAS === '3') {
							estadoGC = "Success";
							iconGC = "/FioriSCP.z_figestionacreedores/img/Aproved.png";
						} else if (resultados.SEMAFORO_GERENTE_COMPRAS === '4') {
							estadoGC = "Error";
							iconGC = "/FioriSCP.z_figestionacreedores/img/Reject.png";
						}
						var obj = {
								"ID_PROCESO" : resultados[i].ID_PROCESO,
								"TIPO_PROCESO" : tipo,
								"TIPO_PROCESO_ID" : resultados[i].TIPO_PROCESO,
								"ERSDA" : resultados[i].ERSDA,
								"ESTADO" : resultados[i].ESTADO,
								"LIFNR" : resultados[i].LIFNR,
								"SUBESTADO" : resultados[i].SUBESTADO,
								"NAME1" : resultados[i].NAME1,
								"KTOKK" : resultados[i].KTOKK,
								"MOTIVO_RECHAZO" : resultados[i].MOTIVO_RECHAZO,
								"SEMAFORO" : resultados[i].SEMAFORO,
								"STATE" : estado,
								"ICON" : icon,
								"FECHA_APROB_COMPRAS" : resultados[i].FECHA_APROB_COMPRAS,
								"FECHA_APROB_CONTABLE" : resultados[i].FECHA_APROB_CONTABLE,
								"FECHA_APROB_FINANZAS" : resultados[i].FECHA_APROB_FINANZAS,
								"FECHA_APROB_GERENCIA" : resultados[i].FECHA_APROB_GERENCIA,
								"FECHA_APROB_TESORERIA" : resultados[i].FECHA_APROB_TESORERIA,
								"FECHA_APROB_GERENTE_COMPRAS" : resultados[i].FECHA_APROB_GERENTE_COMPRAS,
								"USUARIO_APROB_COMPRAS" : resultados[i].USUARIO_APROB_COMPRAS,
								"USUARIO_APROB_CONTABLE" : resultados[i].USUARIO_APROB_CONTABLE,
								"USUARIO_APROB_FINANZAS" : resultados[i].USUARIO_APROB_FINANZAS,
								"USUARIO_APROB_GERENCIA" : resultados[i].USUARIO_APROB_GERENCIA,
								"USUARIO_APROB_TESORERIA" : resultados[i].USUARIO_APROB_TESORERIA,
								"USUARIO_APROB_GERENTE_COMPRAS" : resultados[i].USUARIO_APROB_GERENTE_COMPRAS,
								"ICON_CONTABLE" : iconCn,
								"ICON_FINANZAS" : iconFi,
								"ICON_COMPRAS" : iconCm,
								"ICON_GERENCIA" : iconGe,
								"ICON_TESORERIA": iconTe,
								"ICON_GERENTE_COMPRAS": iconGC

						};
						solicitudes.push(obj);
					}
					var data = {
						'listSolicitudes' : solicitudes
					};
					oModelProceso.setData(data);
					tabla.setModel(oModelProceso);
				},function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
				}
			);
		},
		sol_modifForm: function(data){
			var TRAT_ALL =TRATAMIENTO;
			var TRATModel = new sap.ui.model.json.JSONModel();
			TRATModel.setData({Trat : TRAT_ALL});
			this.byId("selectTratS").setModel(TRATModel);
			switch(data.KTOKK){
			case 'HONO':
				this.byId("lblselectIndRetMS").setVisible(true);
				this.byId("selectIndRetS").setVisible(true);
				break;
			case 'PEXT':
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
				this.byId("sexS").setVisible(l);
				this.byId("lbllnaS").setVisible(l);
				this.byId("lnaS").setVisible(l);
				this.byId("lblproS").setVisible(l);
				this.byId("proS").setVisible(l);
				this.byId("lblfnaS").setVisible(l);
				this.byId("fnaS").setVisible(l);
				break;
			case 'PALT':
				this.byId("lblctaasocms").setVisible(false);
				this.byId("selectCtaAsocS").setVisible(false);
				break;
			default:
			}
			this.byId("lblselectIndRetMS").setVisible(false);
			this.byId("selectIndRetS").setVisible(false);
			this.byId("lblctaasocms").setVisible(true);
			this.byId("selectCtaAsocS").setVisible(true);
			
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
		sol_modifdetails:function(data){
			var new_data = data;
			new_data.ZWELS = data.ZWELS.split('');
			new_data.BUKRS_MULTI = data.BUKRS_MULTI.split('-');
			new_data.EKORG_MULTI = data.EKORG_MULTI.split('-');
			return new_data;
		},
		sol_reset:function(){
			this.byId("Lico1S").setVisible(false);
			this.byId("ico1S").setVisible(false);
			this.byId("LGrupEsqProS").setVisible(false);
			this.byId("GrupEsqProS").setVisible(false);
			this.byId("LctrlConfS").setVisible(false);
			this.byId("ctrlConfS").setVisible(false);
			this.byId("sexS").setVisible(false);
			this.byId("lbllnaS").setVisible(false);
			this.byId("lnaS").setVisible(false);
			this.byId("lblproS").setVisible(false);
			this.byId("proS").setVisible(false);
			this.byId("lblfnaS").setVisible(false);
			this.byId("fnaS").setVisible(false);
			this.byId("bancForm2S").setVisible(false);
			this.byId("bancForm3S").setVisible(false);
		},
		onPress : function(oEvent) {
			var url = serviceUrl;
			var that = this; 
			var oContext = oEvent.getSource().getBindingContext();
			var id = oContext.getProperty("ID_PROCESO");
			var tipo = oContext.getProperty("TIPO_PROCESO_ID");
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			var oView = this.getView();
			this.oObjectPageLayout = this.getView().byId("ObjectPageLayout");
			this.oTargetSubSection = this.getView().byId("dgms");
			this.oObjectPageLayout.addEventDelegate({
				onAfterRendering : 
					function() {
						jQuery.sap.delayedCall(500,this.oObjectPageLayout,
								this.oObjectPageLayout.scrollToSection,
								[this.oTargetSubSection.getId() ]);
					}.bind(this)
			});
			this.getView().byId("idSolicTable").setVisible(false);
			this.getView().byId("ObjectPageLayout").setVisible(false);
			this.getView().byId("contabKeyBMS").setVisible(false);
			this.getView().byId("comprasKeyBMS").setVisible(false);
			this.getView().byId("contabKeyAMS").setVisible(false);
			this.getView().byId("comprasKeyAMS").setVisible(false);
			this.getView().byId("swiftMS").setVisible(false);
			this.getView().byId("modif-dos").setVisible(false);
			this.getView().byId("modif-dosADM").setVisible(false);
			console.log(tipo);
			if(tipo === 'U' && id > 484){
				that.byId("modif-dos").setVisible(true);
				that.getDetalleModifDos(tipo,id);
				return;
			}
			oModel.read(
				"/DetalleSolicitudSet(TIPO_PROCESO='"
				+ tipo + "',ID_SOLICITUD='" + id + "')",
				null,[ "" ],false,
				function(data,response) {
					oView.setBusy(false);
					that.sol_reset();
					var new_data = that.sol_modifdetails(data);
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(new_data);
					oView.setModel(oModel,"dataModel");
					var sTipoL = "";
					switch(data.TIPO_PROCESO){
					case 'C':
						sTipoL = "Creación";
						that.byId("ObjectPageLayout").setVisible(true);
						break;
					case 'U':
						sTipoL = "Modificación";
						that.byId("ObjectPageLayout").setVisible(true);
						break;
					case 'E':
						sTipoL = "Ampliación";
						if(data.TIPO_VISTA === 'CT')
							that.byId("contabKeyAMS").setVisible(true);
						else{
							that.byId("comprasKeyAMS").setVisible(true);
						}
						break;
					case 'D':
						sTipoL = "Bloqueo/Desbloqueo";
						if(data.TIPO_VISTA === 'CP'){
							that.byId("comprasKeyBMS").setVisible(true);
						}else
							that.byId("contabKeyBMS").setVisible(true);
					}
					that.byId("chk1MSBC").setSelected(data.LOEVM === 'X');
					that.byId("chk1MSBCT").setSelected(data.LOEVM === 'X');
					that.byId("chk2MSBC").setSelected((data.LOEVM_COMPRAS === 'X'));
					that.byId("chk3MSBC").setSelected((data.SPERM === 'X'));
					that.byId("chk2MSBCT").setSelected((data.LOEVM_CONTABLE === 'X'));
					that.byId("chk3MSBCT").setSelected((data.NODEL === 'X'));
					that.byId("chk4MSBCT").setSelected((data.NODEL_CONTABLE === 'X'));
					
					that.byId("tit").setObjectTitle("Solicitud " + sTipoL + ": " + id);
					that.byId("titbcpms").setObjectTitle("Solicitud: " + id);
					that.byId("titbctms").setObjectTitle("Solicitud: " + id);
					that.byId("titactms").setObjectTitle("Solicitud: " + id);
					that.byId("titacpms").setObjectTitle("Solicitud: " + id);
					that.sol_modifForm(new_data);
					that.getAttachFiles(tipo,id);
				},function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
				}
			);
		},
		getDetalleModifDos: function(tipo,id){
			var oComModi = this.byId('modif-dos');
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl, true);
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
		getDetalleModifDosADM: function(tipo,id){
			var oComModi = this.byId('modif-dosADM');
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl, true);
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
		getAttachFiles:function(tipo,id){
			//clear model
			this.getView().getModel('FileModel').setProperty('/MSFiles',[]);
			var oList = this.byId('missolFileList');
			oList.setBusy(true);
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl,true);
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
				that.getView().getModel('FileModel').setProperty('/MSFiles',aFiles);
				console.log(aFiles);
				}else{
//					MessageToast.show(data.MESSAGE);
					oList.setBusy(false);
				}
			}, function(err) {
				oList.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.err(errTxt, sap.m.MessageBox.Icon.ERROR, "Error al intentar comprobar archivos adjuntos.");
			});	
			
		},
		getAttachFilesAdm:function(tipo,id){
			//clear model
			this.getView().getModel('FileModel').setProperty('/ASFiles',[]);
			var oList = this.byId('admsolFileList');
			oList.setBusy(true);
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl,true);
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
				that.getView().getModel('FileModel').setProperty('/ASFiles',aFiles);
				console.log(aFiles);
				}else{
//					MessageToast.show(data.MESSAGE);
					oList.setBusy(false);
				}
			}, function(err) {
				oList.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.err(errTxt, sap.m.MessageBox.Icon.ERROR, "Error al intentar comprobar archivos adjuntos.");
			});	
			
		},
		getAttachFilesModi:function(tipo,id){
			//clear model
			this.getView().getModel('FileModel').setProperty('/modiFiles',[]);
			var oList = this.byId('modiFileList');
			oList.setBusy(true);
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl,true);
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
				that.getView().getModel('FileModel').setProperty('/modiFiles',aFiles);
				console.log(aFiles);
				}else{
//					MessageToast.show(data.MESSAGE);
					oList.setBusy(false);
				}
			}, function(err) {
				oList.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.err(errTxt, sap.m.MessageBox.Icon.ERROR, "Error al intentar comprobar archivos adjuntos.");
			});	
			
		},
		onMSFilePress: function(oEvent){
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
		onASFilePress: function(oEvent){
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
		onPress2 : function(oEvent) {
			var url = serviceUrl;
			var oContext = oEvent.getSource().getBindingContext();
			var id = oContext.getProperty("ID_PROCESO");
			var tipo = oContext.getProperty("TIPO_PROCESO_ID");
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			var oView = this.getView();
			this.oObjectPageLayout = this.getView().byId("ObjectPageLayout2");
			this.oTargetSubSection = this.getView().byId("dgms2");
			this.oObjectPageLayout.addEventDelegate({
				onAfterRendering : function() {
				jQuery.sap.delayedCall(500,this.oObjectPageLayout,this.oObjectPageLayout.scrollToSection,
							[ this.oTargetSubSection.getId() ]);
				}.bind(this)
			});
			oView.byId("ObjectPageLayout2").setVisible(true);
			oModel.read("/DetalleSolicitudSet(TIPO_PROCESO='"
				+ tipo + "',ID_SOLICITUD='" + id + "')",
				null,[ "" ],
				false,
				function(data,response) {
					oView.setBusy(false);
					var oModelProceso = new sap.ui.model.json.JSONModel();
					var resultados = data;
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(resultados);
					oView.setModel(oModel,"dataModel");
					var estado = "None";
					var icon = "/FioriSCP.z_figestionacreedores/img/Created.png";
					var tipo = "";
					if (resultados.TIPO_PROCESO === 'C') {
						tipo = "Creación";
						oView.byId("ObjectPageLayoutMS").setVisible(true);
					} else if (resultados.TIPO_PROCESO === 'U') {
						tipo = "Modificación";
						oView.byId("ObjectPageLayoutMS").setVisible(true);
					} else if (resultados.TIPO_PROCESO === 'E') {
						tipo = "Ampliación";
						if (resultados.TIPO_VISTA === 'CT')
							oView.byId("contabKeyAMS").setVisible(true);
						else
							oView.byId("comprasKeyAMS").setVisible(true);
					} else if (resultados.TIPO_PROCESO === 'D') {
						tipo = "Bloqueo/Desbloqueo";
						if (resultados.TIPO_VISTA === 'CP')
							oView.byId("comprasKeyBMS").setVisible(true);
						else
							oView.byId("contabKeyBMS").setVisible(true);
					}
					if (resultados.SEMAFORO === '1') {
						estado = "None";
					} else if (resultados.SEMAFORO === '2') {
						estado = "Warning";
						icon = "/FioriSCP.z_figestionacreedores/img/InProcess.png";
					} else if (resultados.SEMAFORO === '3') {
						estado = "Success";
						icon = "/FioriSCP.z_figestionacreedores/img/Aproved.png";
					} else if (resultados.SEMAFORO === '4') {
						estado = "Error";
						icon = "/FioriSCP.z_figestionacreedores/img/Reject.png";
					}
					oView.byId("tit2").setObjectTitle("Solicitud " + tipo + ": " + id);
					oView.byId("idSolicTable2").setVisible(false);
				},function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
				}
			);
		},
		adm_modifForm: function(data){
			var TRAT_ALL = TRATAMIENTO;
			var TRATModel = new sap.ui.model.json.JSONModel();
			TRATModel.setData({Trat : TRAT_ALL});
			this.byId("selectTratA").setModel(TRATModel);
			switch(data.KTOKK){
			case 'HONO':
				this.byId("lblselectIndRetA").setVisible(true);
				this.byId("selectIndRetA").setVisible(true);
				break;
			case 'PEXT':
				this.byId("lblctaasocadm").setVisible(false);
				this.byId("selectCtaAsocA").setVisible(false);
				this.byId("Lico1A").setVisible(true);
				this.byId("ico1A").setVisible(true);
				this.byId("LGrupEsqProA").setVisible(true);
				this.byId("GrupEsqProA").setVisible(true);
				this.byId("LctrlConfA").setVisible(true);
				this.byId("ctrlConfA").setVisible(true);
				var trat = this.byId('selectTratA').getSelectedKey();
				var l = !(trat === '0007' || trat === '0008');
				this.byId("sexA").setVisible(l);
				this.byId("lbllnaA").setVisible(l);
				this.byId("lnaA").setVisible(l);
				this.byId("lblproA").setVisible(l);
				this.byId("proA").setVisible(l);
				this.byId("lblfnaA").setVisible(l);
				this.byId("fnaA").setVisible(l);
				break;
			case 'PALT':
				this.byId("lblctaasocadm").setVisible(false);
				this.byId("selectCtaAsocA").setVisible(false);
				break;
			default:
			}
			this.byId("lblselectIndRetA").setVisible(false);
			this.byId("selectIndRetA").setVisible(false);
			this.byId("lblctaasocadm").setVisible(	true);
			this.byId("selectCtaAsocA").setVisible(true);
			
			var oFilter = new sap.ui.model.Filter("LAND1",sap.ui.model.FilterOperator.Contains,data.LAND1);
			this.byId("selectRegionA").getBinding("items").filter([ oFilter ]);
			
			var oFilter1 = new sap.ui.model.Filter("LAND1",sap.ui.model.FilterOperator.Contains,data.LAND1);
			var oFilter2 = new sap.ui.model.Filter("REGIO",sap.ui.model.FilterOperator.Contains,data.REGIO);
			this.byId("selectComunasA").getBinding("items").filter([oFilter1,oFilter2 ]);
			
			var oFilter = new sap.ui.model.Filter("BANKS",sap.ui.model.FilterOperator.Contains,
					this.byId("selectPaiBankA").getSelectedKey());
			this.byId("selectClaBankA").getBinding("items").filter([ oFilter ]);
			var oFilter2 = new sap.ui.model.Filter("BANKS",sap.ui.model.FilterOperator.Contains,
					this.byId("selectPaiBankA2").getSelectedKey());
			this.byId("selectClaBankA2").getBinding("items").filter([ oFilter2 ]);
			var oFilter3 = new sap.ui.model.Filter("BANKS",sap.ui.model.FilterOperator.Contains,
					this.byId("selectPaiBankA3").getSelectedKey());
			this.byId("selectClaBankA3").getBinding("items").filter([ oFilter3 ]);
			this.byId("bancForm2A").setVisible(data.BANKN2 != '');
			this.byId("bancForm3A").setVisible(data.BANKN3 != '');
		},
		adm_modifdetails:function(data){
			var new_data = data;
			new_data.ZWELS = data.ZWELS.split('');
			new_data.BUKRS_MULTI = data.BUKRS_MULTI.split('-');
			new_data.EKORG_MULTI = data.EKORG_MULTI.split('-');
			return new_data;
		},
		adm_reset:function(){
			this.byId("Lico1A").setVisible(false);
			this.byId("ico1A").setVisible(false);
			this.byId("LGrupEsqProA").setVisible(false);
			this.byId("GrupEsqProA").setVisible(false);
			this.byId("LctrlConfA").setVisible(false);
			this.byId("ctrlConfA").setVisible(false);
			this.byId("sexA").setVisible(false);
			this.byId("lbllnaA").setVisible(false);
			this.byId("lnaA").setVisible(false);
			this.byId("lblproA").setVisible(false);
			this.byId("proA").setVisible(false);
			this.byId("lblfnaA").setVisible(false);
			this.byId("fnaA").setVisible(false);
			this.byId("bancForm2A").setVisible(false);
			this.byId("bancForm3A").setVisible(false);
		},
		onPressADM : function(oEvent) {
			var url = serviceUrl;
			var that = this;
			var oContext = oEvent.getSource().getBindingContext();
			var id = oContext.getProperty("ID_PROCESO");
			var tipo = oContext.getProperty("TIPO_PROCESO_ID");
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			var oView = this.getView();
			this.oObjectPageLayout = this.getView().byId("ObjectPageLayoutADM");
			this.oTargetSubSection = this.getView().byId("dgmsA");
			this.oObjectPageLayout.addEventDelegate({
				onAfterRendering : 
					function() {
						jQuery.sap.delayedCall(500,this.oObjectPageLayout,
								this.oObjectPageLayout.scrollToSection,
								[this.oTargetSubSection.getId() ]);
					}.bind(this)
			});
			oView.byId("ObjectPageLayoutADM").setVisible(false);
			oView.byId("contabKeyBADM").setVisible(false);
			oView.byId("comprasKeyBADM").setVisible(false);
			oView.byId("contabKeyAADM").setVisible(false);
			oView.byId("comprasKeyAADM").setVisible(false);
			oView.byId("swiftADM").setVisible(false);
			oView.byId("idSolicTableADM").setVisible(false);
			this.getView().byId("modif-dos").setVisible(false);
			this.getView().byId("modif-dosADM").setVisible(false);
			if(tipo === 'U' && id > 484){
				that.byId("modif-dosADM").setVisible(true);
				that.getDetalleModifDosADM(tipo,id);
				return;
			}
			oModel.read("/DetalleSolicitudSet(TIPO_PROCESO='"
				+ tipo + "',ID_SOLICITUD='" + id + "')",
				null,[ "" ],false,
				function(data,response) {
					oView.setBusy(false);
					that.adm_reset();
					var new_data = that.adm_modifdetails(data);
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(new_data);
					oView.setModel(oModel,"dataModel");
					var sTipo = "";
					switch(data.TIPO_PROCESO){
					case 'C':
						sTipo = "Creación";
						that.byId("ObjectPageLayoutADM").setVisible(true);
						break;
					case 'U':
						sTipo = "Modificación";
						that.byId("ObjectPageLayoutADM").setVisible(true);
						break;
					case 'E':
						sTipo = "Ampliación";
						if(data.TIPO_VISTA === 'CT')
							that.byId("contabKeyAADM").setVisible(true);
						else{
							that.byId("comprasKeyAADM").setVisible(true);
						}
						break;
					case 'D':
						sTipo = "Bloqueo/Desbloqueo";
						if(data.TIPO_VISTA === 'CP'){
							that.byId("comprasKeyBADM").setVisible(true);
						}else
							that.byId("contabKeyBADM").setVisible(true);
					}
					that.byId("chk1BCPADM").setSelected(data.LOEVM === 'X');
					that.byId("chk1BCTADM").setSelected(data.LOEVM === 'X');
					that.byId("chk2BCPADM").setSelected((data.LOEVM_COMPRAS === 'X'));
					that.byId("chk3BCPADM").setSelected((data.SPERM === 'X'));
					that.byId("chk2BCTADM").setSelected((data.LOEVM_CONTABLE === 'X'));
					that.byId("chk3BCTADM").setSelected((data.NODEL === 'X'));
					that.byId("chk4BCTADM").setSelected((data.NODEL_CONTABLE === 'X'));
					
					oView.byId("titADM").setObjectTitle("Solicitud " + sTipo + ": " + id);
					oView.byId("titbcpadm").setObjectTitle("Solicitud: " + id);
					oView.byId("titbctadm").setObjectTitle("Solicitud: " + id);
					oView.byId("titactadm").setObjectTitle("Solicitud: " + id);
					oView.byId("titacpadm").setObjectTitle("Solicitud: " + id);
					that.adm_modifForm(new_data);
					that.getAttachFilesAdm(tipo,id);
				},
				function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
				}
			);
		},
		filtrarListado : function(oEvent) {
			var filters = [];
			var query = oEvent.getParameter("query");
			if (query && query.length > 0) {
				var oFilter2 = new sap.ui.model.Filter("NAME1",sap.ui.model.FilterOperator.Contains,query);
				var oFilter3 = new sap.ui.model.Filter("TIPO_PROCESO",sap.ui.model.FilterOperator.Contains,query);
				var oFilter6 = new sap.ui.model.Filter("ID_PROCESO",sap.ui.model.FilterOperator.Contains,query);
				var oFilter5 = new sap.ui.model.Filter("KTOKK",sap.ui.model.FilterOperator.Contains,query);
				var oFilter4 = new sap.ui.model.Filter("ERSDA",sap.ui.model.FilterOperator.Contains,query);
				var oFilter1 = new sap.ui.model.Filter("ESTADO",sap.ui.model.FilterOperator.Contains,query);
				var allFilter = new sap.ui.model.Filter([oFilter1,oFilter2,oFilter3,oFilter4,oFilter5,oFilter6 ]);
			}
			var tabla = this.getView().byId("idSolicTable");
			var binding = tabla.getBinding("items");
			binding.filter(allFilter,sap.ui.model.FilterType.Application);
		},
		filtrarListadoADM : function(oEvent) {
			var filters = [];
			var query = oEvent.getParameter("query");
			if (query && query.length > 0) {
				var oFilter2 = new sap.ui.model.Filter("NAME1",sap.ui.model.FilterOperator.Contains,query);
				var oFilter3 = new sap.ui.model.Filter("TIPO_PROCESO",sap.ui.model.FilterOperator.Contains,query);
				var oFilter6 = new sap.ui.model.Filter("ID_PROCESO",sap.ui.model.FilterOperator.Contains,query);
				var oFilter5 = new sap.ui.model.Filter("KTOKK",sap.ui.model.FilterOperator.Contains,query);
				var oFilter4 = new sap.ui.model.Filter("ERSDA",sap.ui.model.FilterOperator.Contains,query);
				var oFilter7 = new sap.ui.model.Filter("SUBESTADO",sap.ui.model.FilterOperator.Contains,query);
				var oFilter1 = new sap.ui.model.Filter("ESTADO",sap.ui.model.FilterOperator.Contains,query);
				var allFilter = new sap.ui.model.Filter([ oFilter1, oFilter2,oFilter3,oFilter4,oFilter5,oFilter6,oFilter7 ]);
			}
			var tabla = this.getView().byId("idSolicTableADM");
			var binding = tabla.getBinding("items");
			binding.filter(allFilter,sap.ui.model.FilterType.Application);
		},
		amp_validaCP : function() {
			var oView = this.getView();
			oView.byId("btnGuardaACP").setEnabled(false);
			if (oView.byId("selectAprobadoresAmpCom").getSelectedIndex() == -1) {
				MessageToast.show("Indique Gerente/Subgerente Aprobador.");
				return;
			}
			if (oView.byId("selectGrpCompAmpCom2").getSelectedKey() === -1) {
				MessageToast.show("Selecione Grupo Modelo.");
				return;
			}
			if (oView.byId("selectGrpCompAmpCom3").getSelectedKeys().length < 1 ) {
				MessageToast.show("Seleccione Organización(es) Ampliar.");
				return;
			}
			oView.byId("btnGuardaACP").setEnabled(true);
		},
		amp_validaCT : function() {
			var oView = this.getView();
			oView.byId("btnGuardaACT").setEnabled(false);
			if (oView.byId("GrpCtaAmpCon").getSelectedIndex() == -1) {
				MessageToast.show("Indique Gerente/Subgerente Aprobador.");
				return;
			}if (oView.byId("selectSociedadesAmpCon").getSelectedKey === -1) {
				MessageToast.show("Selecione Sociedad Modelo.");
				return;
			}if (oView.byId("selectSociedadesAmpCon2").getSelectedKeys().length < 1) {
				MessageToast.show("Seleccione Sociedad(es) Ampliar.");
				return;
			}
			oView.byId("btnGuardaACT").setEnabled(true);
		},
		borr_validaCP : function() {
			var ok = true;
			var oView = this.getView();
			oView.byId("btnGuardaBCP").setEnabled(false);
			if (oView.byId("selectAprobadoresBCP").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Indique Gerente/Subgerente Aprobador.");
			} else if (oView.byId("selectGrpCompBCP").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Selecione Org. Modelo.");
			}
			if (ok)
				oView.byId("btnGuardaBCP").setEnabled(true);
			else
				oView.byId("btnGuardaBCP").setEnabled(false);
		},
		amp_onSaveCP : function() {
			var that = this;
			var url = serviceUrl;
			var oView = this.getView();
			var oModel = new sap.ui.model.odata.ODataModel(
				url, true);
			var oEntry = new sap.ui.model.json.JSONModel();
			var elModelo = this.getView().getModel("dataModel");
			var lifnr = this.getView().byId("idAcrACP").getValue();
			var kunnr = elModelo.oData.KUNNR;
			var emnfr = elModelo.oData.EMNFR;
			var stcd1 = elModelo.oData.STCD1;
			var zterm = elModelo.oData.ZTERM;
			var waers = elModelo.oData.WAERS;
			var ktokk = elModelo.oData.KTOKK;
			var name1 = elModelo.oData.NAME1;
			var obs = oView.byId("ampObsCom").getValue();
			var ekorg = this.getView().byId("selectGrpCompAmpCom2").getSelectedKey();
			var ekorgs = [];
			ekorgs = oView.byId("selectGrpCompAmpCom3").getSelectedKeys();// org  compras
			var ekorg_multi = ekorgs.join('-');
			var aprob = this.getView().byId("selectAprobadoresAmpCom").getSelectedKey();
			oEntry = {
					"TIPO_PROCESO" : 'E',
					"ID_SOLICITUD" : '',
					"LIFNR" : lifnr,
					"STCD1" : stcd1,
					"TIPO_VISTA" : 'CP',
					"KUNNR" : kunnr,
					"NAME1" : name1,
					"EMNFR" : emnfr,
					"WAERS" : waers,
					"KTOKK" : ktokk,
					"ZTERM_COMPRAS" : zterm,
					"EKORG" : ekorg,
					"EKORG_MULTI" : ekorg_multi,
					"BUKRS_MULTI" : '',
					"APROBADOR" : aprob,
					"OBS" : obs
			};
			oModel.create("/CrearSolicitudSet",
				oEntry,null,
				function(data) {
					oView.setBusy(false);
					if (data.STATUS === 'S') {
						MessageToast.show(data.MESSAGE);
						oView.byId(	"btnGuardaACP").setEnabled(	false);
						oView.byId("idAcrACP").setValue("");
						that.onResetAmpl();
				} else {
					MessageToast.show("Error: " + data.MESSAGE);
				}
			},
			function(e) {
				oView.setBusy(false);
				MessageToast.show("Problemas al cargar datos (" + e.getMessage + ").");
			});
		},
		amp_onSaveCT : function() {
			var that = this;
			var url = serviceUrl;
			var oView = this.getView();
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			var oEntry = new sap.ui.model.json.JSONModel();
			var elModelo = this.getView().getModel("dataModel");
			var lifnr = elModelo.oData.LIFNR;
			var kunnr = elModelo.oData.KUNNR;
			var emnfr = elModelo.oData.EMNFR;
			var stcd1 = elModelo.oData.STCD1;
			var zterm = elModelo.oData.ZTERM;
			var zterm_array = zterm.split('-');
			var zterm_cod = zterm_array[0];
			var waers = elModelo.oData.WAERS;
			var name1 = elModelo.oData.NAME1;
			var ktokk = elModelo.oData.KTOKK;
			var aprob = oView.byId("selectAprobadoresAmpCon").getSelectedKey();
			var bukrs = oView.byId("selectSociedadesAmpCon").getSelectedKey();
			var obs = oView.byId("ampObsCon").getValue();
			var bukrss = [];
			bukrss = oView.byId("selectSociedadesAmpCon2").getSelectedKeys();// sociedades
			var bukrs_multi = bukrss.join('-');
			oEntry = {
					"TIPO_VISTA" : 'CT',
					"TIPO_PROCESO" : 'E',
					"ID_SOLICITUD" : '',
					"LIFNR" : lifnr,
					"NAME1" : name1,
					"STCD1" : stcd1,
					"KUNNR" : kunnr,
					"EMNFR" : emnfr,
					"WAERS" : waers,
					"KTOKK" : ktokk,
					"ZTERM" : zterm_cod,
					"BUKRS" : bukrs,
					"BUKRS_MULTI" : bukrs_multi,
					"APROBADOR" : aprob,
					"OBS" : obs
			};
			oModel.create(
				"/CrearSolicitudSet",
				oEntry,null,
				function(data) {
					oView.setBusy(false);
					if (data.STATUS === 'S') {
						MessageToast.show(data.MESSAGE);
						oView.byId("btnGuardaACT").setEnabled(false);
						that.onResetAmpl();
					} else {
						MessageToast.show("Error: " + data.MESSAGE);
					}
				},
				function(e) {
					oView.setBusy(false);
					MessageToast.show("Problemas al cargar datos (" + e.getMessage + ").");
				});
		},
		crea_validaSwift : function() {
			var swf = this.getView().byId("inpswift").getValue();
			var bancopais = this.getView().byId("selectPaiBank").getSelectedKey();
			var ok = false;
			if (swf.length == 8) {
				var ini = swf.substring(0, 4);
				var bank = swf.substring(4, 6);
				var fin = swf.substring(6, 8);
				const regExp1 = /[a-z]{4}/;
				const regExp2 = /[0-9]{2}/;
				var clave = bancopais.toUpperCase() == bank.toUpperCase();
				var resultado1 = regExp1.test(ini.toLowerCase());
				var resultado2 = regExp2.test(fin);
				if (resultado1 & clave& resultado2)
					ok = true;
			} else if (swf.length == 11) {
				var ini = swf.substring(0, 4);
				var bank = swf.substring(4, 6);
				var fin = swf.substring(6, 11);
				const regExp1 = /[a-z]{4}/;
				const regExp2 = /[0-9]{5}/;
				var clave = bancopais.toUpperCase() == bank.toUpperCase();
				var resultado1 = regExp1.test(ini.toLowerCase());
				var resultado2 = regExp2.test(fin);
				if (resultado1 & clave & resultado2)
					ok = true;
			}
			return ok;
		},
		modif_validaSwift : function() {
			var swf = this.getView().byId("inpswiftM").getValue();
			var bancopais = this.getView().byId("selectPaiBankM").getSelectedKey();
			var ok = false;
			if (swf.length == 8) {
				var ini = swf.substring(0, 4);
				var bank = swf.substring(4, 6);
				var fin = swf.substring(6, 8);
				const regExp1 = /[a-z]{4}/;
				const regExp2 = /[0-9]{2}/;
				var clave = bancopais.toUpperCase() == bank.toUpperCase();
				var resultado1 = regExp1.test(ini.toLowerCase());
				var resultado2 = regExp2.test(fin);
				var ok = resultado1 + clave + resultado2;
				if (resultado1 & clave & resultado2)
					ok = true;
			} else if (swf.length == 11) {
				var ini = swf.substring(0, 4);
				var bank = swf.substring(4, 6);
				var fin = swf.substring(6, 11);
				const regExp1 = /[a-z]{4}/;
				const regExp2 = /[0-9]{5}/;
				var clave = bancopais.toUpperCase() == bank.toUpperCase();
				var resultado1 = regExp1.test(ini.toLowerCase());
				var resultado2 = regExp2.test(fin);
				if (resultado1 & clave& resultado2)
					ok = true;
			}
			return ok;
		},
		validaSwift : function() {
			var Fn = {
				// LLLLbbDD ó LLLLbbDDDDD
				validaRut : function(rutCompleto) {
					if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto))
						return false;
					var tmp = rutCompleto.split('-');
					var digv = tmp[1];
					var rut = tmp[0];
					if (digv == 'K')
						digv = 'k';
						return (Fn.dv(rut) == digv);
					},
				dv : function(T) {
					var M = 0, S = 1;
					for (; T; T = Math.floor(T / 10)) S = (S + T % 10 * (9 - M++ % 6)) % 11;
						return S ? S - 1 : 'k';
				}
			}
			alert(Fn.validaRut('11111111-1') ? 'Valido' : 'inválido');
		},
		modif_changeSwift : function() {
			var swf = this.getView().byId("inpswiftM");
		},
		select1 : function(oEvent) {
		},
		select2 : function(oEvent) {
		},
		select3 : function(oEvent) {
		},
		onCrearAcreedor : function(oEvent) {
		},
		pad : function(n) {
			n = n + '';
			return n.length >= 10 ? n : new Array(10 - n.length + 1).join(0) + n;
		},
		onChangeii : function(oEvent) {
			var oUploadCollection = oEvent.getSource();
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter(
				{
					name : "x-csrf-token",
					value : ""
				});
			var oCustomerHeaderToken2 = "";
			OData.request({
				requestUri : "/FioriSCP.z_figestionacreedores/sap/opu/odata/sap/ZODATA_FI_GESTION_ACREEDORES_SRV/",
				method : "GET",
				async : false,
				headers : {
					"X-Requested-With" : "XMLHttpRequest",
					"Content-Type" : "application/atom+xml",
					"DataServiceVersion" : "2.0",
					"X-CSRF-Token" : "Fetch"
						}
			},function(data,response) {
				var header_xcsrf_token = response.headers['x-csrf-token'];
				oCustomerHeaderToken2 = new sap.m.UploadCollectionParameter({
					name : "x-csrf-token",
					value : header_xcsrf_token
					});
				}
			);
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken2);
		},
		onBeforeUploadStartsii : function(oEvent) {
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter(
				{
					name : "slug",
					value : oEvent.getParameter("fileName")
				});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			setTimeout(function() {
			}, 4000);
		},
		onUploadCompleteii : function(oEvent) {
			var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
			setTimeout(function(){
				var oUploadCollection = this.byId("UploadCollectionM");
				for (var i = 0; i < oUploadCollection.getItems().length; i++) {
					if (oUploadCollection.getItems()[i].getFileName() === sUploadedFileName) {
						oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
						break;
					}
				}
			}.bind(this), 8000);
		},
		onStartUploadii : function(oEvent) {
			// var oTextArea =
			// this.byId("TextArea");
			var oUploadCollection = this.getView()	.byId("UploadCollectionM");
			var cFiles = oUploadCollection.getItems().length;
			var uploadInfo = cFiles + " file(s)";
			if (cFiles > 0){ oUploadCollection.upload();
			}
		},
		onSelectChangeii : function(oEvent) {
			var oUploadCollection = this.byId("UploadCollection");
			oUploadCollection.setShowSeparators(oEvent.getParameters().selectedItem.getProperty("key"));
		},
		onSubirArchivoDialog : function() {// **
			jQuery.sap.require("jquery.sap.storage");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var that = this;
			var oView = this.getView();
			var oInputView = sap.ui.view({
				id : "Acepta",
				viewName : "z_figestionacreedores.view.utils.subirArchivo",
				type : "XML"
			});
			var dialog = new Dialog({
				title : 'Confirmación',
				type : 'Message',
				content : oInputView,
				beginButton : new Button({
					text : 'Cerrar',
					press : function() {
						that.getView().setBusy(true);
						that.getView().setBusy(false);
						dialog.close();
					}
				}),
				afterClose : function() {
					dialog.destroy();
				}
			});
			dialog.open();
		},
		onCreaSelectFile: function(oEvent){
			var oView = this.getView();
			var oCupload = oEvent.getSource();
			var oFileList = this.byId('creaFileList');
			var files = this.getView().getModel('FileModel').getProperty('/creaFiles');
			var oFiles = oCupload.oFileUpload.files;
			if(files.length === 2){
				sap.m.MessageBox.error('Solo se pueden subir un maximo de 2 archivos.');
				return;
			}else{
				if(oFiles.length > 0){
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
						oView.getModel('FileModel').setProperty('/creaFiles',files);
					};
					reader.onerror = function (error) {
						oView.setBusy(false);
						sap.m.MessageBox.error('Error: ', error);
					};
				}
			}

		},
		onModiSelectFile: function(oEvent){
			var oView = this.getView();
			var oCupload = oEvent.getSource();
			var oFileList = this.byId('modiFileList');
			var files = this.getView().getModel('FileModel').getProperty('/modiFiles');
			var oFiles = oCupload.oFileUpload.files;
			if(files.length === 2){
				sap.m.MessageBox.error('Solo se pueden subir un maximo de 2 archivos.');
				return;
			}else{
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
					oView.getModel('FileModel').setProperty('/modiFiles',files);
				};
				reader.onerror = function (error) {
					oView.setBusy(false);
					sap.m.MessageBox.error('Ocurrio un error, intentelo denuevo!');
				};
			}
		},
		onCreaUploadFile : function(ID_SOLICITUD){
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl, true);
			var that = this;
			var files = this.getView().getModel('FileModel').getProperty('/creaFiles');
			if(files.length === 0){
				return;
			}
			var file1 = "";
			var file2 = "";
			var file3 = "";
			var namefile1 = "";
			var namefile2 = "";
			var namefile3 = "";
			var typefile1 = "";
			var typefile2 = "";
			var typefile3 = "";
			if(files[0]){
				file1 = files[0].base64.split(',')[1];
				namefile1 = files[0].name;
				typefile1 = files[0].type;
			}if(files[1]){
				file2 = files[1].base64.split(',')[1];
				namefile2 = files[1].name;
				typefile2 = files[1].type;
			}if(files[2]){
				file3 = files[2].base64.split(',')[1];
				namefile3 = files[2].name;
				typefile3 = files[2].type;
			}
			var oEntry =  {
					"TIPO_PROCESO" : "C",
					"ID_SOLICITUD" : ID_SOLICITUD+'',
					"FILE1" : file1,
					"NAME1" : namefile1,
					"TYPE1" : typefile1,
					"FILE2" : file2,
					"NAME2" : namefile2,
					"TYPE2" : typefile2,
					"FILE3" : file3,
					"NAME3" : namefile3,
					"TYPE3" : typefile3,
					"STATUS" : "",
					"MESSAGE" : ""
				}
			oModel.update("/FileSet(TIPO_PROCESO='C',ID_SOLICITUD='"+ID_SOLICITUD+"')", oEntry, {
				method: "PUT",
				success: function(data) {
					that.getView().getModel('FileModel').setProperty('/creaFiles',[]);
				},
				error: function(e) {
					sap.m.MessageBox.error(e.message);
				}
			});
		},
		onModiUploadFile : function(ID_SOLICITUD){
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl, true);
			var that = this;
			var files = this.getView().getModel('FileModel').getProperty('/modiFiles');
			if(files.length === 0){
				return;
			}
			var file1 = "";
			var file2 = "";
			var file3 = "";
			var namefile1 = "";
			var namefile2 = "";
			var namefile3 = "";
			var typefile1 = "";
			var typefile2 = "";
			var typefile3 = "";
			if(files[0]){
				file1 = files[0].base64.split(',')[1];
				namefile1 = files[0].name;
				typefile1 = files[0].type;
			}if(files[1]){
				file2 = files[1].base64.split(',')[1];
				namefile2 = files[1].name;
				typefile2 = files[1].type;
			}if(files[2]){
				file3 = files[2].base64.split(',')[1];
				namefile3 = files[2].name;
				typefile3 = files[2].type;
			}
			var oEntry =  {
					"TIPO_PROCESO" : "U",
					"ID_SOLICITUD" : ID_SOLICITUD+'',
					"FILE1" : file1,
					"NAME1" : namefile1,
					"TYPE1" : typefile1,
					"FILE2" : file2,
					"NAME2" : namefile2,
					"TYPE2" : typefile2,
					"FILE3" : file3,
					"NAME3" : namefile3,
					"TYPE3" : typefile3,
					"STATUS" : "",
					"MESSAGE" : ""
				}
			oModel.update("/FileSet(TIPO_PROCESO='U',ID_SOLICITUD='"+ID_SOLICITUD+"')", oEntry, {
				method: "PUT",
				success: function(data) {
					that.getView().getModel('FileModel').setProperty('/modiFiles',[]);
				},
				error: function(e) {
					sap.m.MessageBox.error(e.message);
				}
			});
		},
		onFileSizeExceed : function(){
			sap.m.MessageBox.warning('El archivo no puede exeder los 150MB');
		},
		onDeleteCreaFile: function(oEvent){
			var ctx = oEvent.getParameters('listItem').listItem.getBindingContext('FileModel');
			var sPath = ctx.sPath;
			var aItems = this.getView().getModel('FileModel').getProperty('/creaFiles');
			var oItem = this.getView().getModel('FileModel').getProperty(sPath);
			aItems.splice(aItems.indexOf(oItem),1);
			this.getView().getModel('FileModel').setProperty('/creaFiles',aItems);
		},
		onDeleteModiFile: function(oEvent){
			var ctx = oEvent.getParameters('listItem').listItem.getBindingContext('FileModel');
			var sPath = ctx.sPath;
			var aItems = this.getView().getModel('FileModel').getProperty('/modiFiles');
			var oItem = this.getView().getModel('FileModel').getProperty(sPath);
			aItems.splice(aItems.indexOf(oItem),1);
			this.getView().getModel('FileModel').setProperty('/modiFiles',aItems);
		},
		onCreaDownloadFile: function(){
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl,true);
			var that = this;
			oModel.read("/FileSet(TIPO_PROCESO='C',ID_SOLICITUD='15')", null, [""], true,
					function(data, response) {
				if(data.STATUS === 'S'){
				var type = data.TYPE1;
				if(type !== 'application/pdf'){
					var byteCharacters = atob(data.FILE1);
					const byteNumbers = new Array(byteCharacters.length);
					for (let i = 0; i < byteCharacters.length; i++) {
					    byteNumbers[i] = byteCharacters.charCodeAt(i);
					}
					const byteArray = new Uint8Array(byteNumbers);
					var blob = new Blob([byteArray], { type: data.TYPE1 });
					const link = document.createElement('a');
					link.href = URL.createObjectURL(blob);
					link.download = data.NAME1;
					document.body.append(link);
					link.click();
					link.remove();
					window.addEventListener('focus', e=>URL.revokeObjectURL(link.href), {once:true});
					return;
				}
				var base64EncodedPDF = data.FILE1;
				var decodedPdfContent = atob(base64EncodedPDF);
				var byteArray = new Uint8Array(decodedPdfContent.length)
				for(var i=0; i<decodedPdfContent.length; i++){
				    byteArray[i] = decodedPdfContent.charCodeAt(i);
				}
				var blob = new Blob([byteArray.buffer], { type: 'application/pdf' });
				blob.name = data.NAME;
				var _pdfurl = URL.createObjectURL(blob);
				jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
				new sap.m.PDFViewer({
						width:"auto",
						title: data.NAME,
						showDownloadButton: false,
						popupButtons :[
							new sap.m.Button({
								press : function(){
									const link = document.createElement('a');
									  link.href = URL.createObjectURL(blob);
									  link.download = data.NAME;
									  document.body.append(link);
									  link.click();
									  link.remove();
									  window.addEventListener('focus', e=>URL.revokeObjectURL(link.href), {once:true});
								},
								text:"Descargar"
							})
						],
						source:_pdfurl
					}).open();
				}else{
					sap.m.MessageBox.error(data.MESSAGE);
				}
			}, function(err) {
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
			});	
		},
		onGetFilePress: function(e){
			var url = serviceUrl;
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.read("/DetalleSolicitudSet(TIPO_PROCESO='"
					+ tipo + "',ID_SOLICITUD='" + id + "')",
					null,[ "" ],false,
					function(data,response) {
						
					},
					function(err) {
						oView.setBusy(false);
						var errTxt = err.message + "\n";
						sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
					}
				);
		},
		onCopyPress:function(oEvent){
			var oModel = this.getView().getModel('dataModel');
			sessionStorage.setItem('COPY_MODEL',oModel.getJSON());
		},
		crea_onPaste: function(){
			var item = JSON.parse(sessionStorage.getItem('COPY_MODEL'));
			var that = this;
			sap.m.MessageBox.show(
					"Desea pegar la solicitud N°."+item.ID_SOLICITUD+"?", {
						icon: sap.m.MessageBox.Icon.QUESTION,
						title: "Pegar Solicitud",
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						onClose: function(oAction) {
							if(oAction === 'YES'){
								if(item){
									that.byId("selectGrpCta").setSelectedKey(item.KTOKK);
									that.byId("selectAprobadores").setSelectedKey(item.APROBADOR);
									that.byId("name1").setValue(item.NAME1);
									that.byId("name2").setValue(item.NAME2);
									that.byId("concep").setValue(item.SORTL);
									that.byId("telf").setValue(item.TELF1);
									that.byId("email1").setValue(item.SMTP_ADDR);
									that.byId("email2").setValue(item.SMTP_ADDR2);
									that.byId("direc").setValue(item.STRAS);
									that.byId("selectPais").setSelectedKey(item.LAND1);
									that.crea_onChangePais();
									that.byId("selectRegion").setSelectedKey(item.REGIO);
									that.crea_onChangeRegion();
									that.byId("selectComunas").setSelectedKey(item.CITY2);
									that.byId("txtCiudad").setValue(item.CITY1);
									that.byId("selectSociedades").setSelectedKeys(item.BUKRS_MULTI);
									that.byId("stcd1").setValue(item.STCD1);
									that.byId("selectCtaAsoc").setSelectedKey(item.HKONT);
									that.byId("fna").setValue(item.GBDAT);
									that.byId("lna").setValue(item.GBORT);
									if(item.SEXKZ === '1'){
										that.byId("RB1-1").setSelected(true);
										that.byId("RB1-2").setSelected(false);
									}
									if(item.SEXKZ === '2'){
										that.byId("RB1-2").setSelected(true);
										that.byId("RB1-1").setSelected(false);
									}
									that.byId("pro").setValue(item.PROFS);
									that.byId("kunnr").setSelectedKey(item.KUNNR);
									that.byId("emnfr").setValue(item.EMNFR);
									that.byId("selectCondPagoS").setSelectedKey(item.ZTERM);
									that.byId("selectIndRet").setSelectedKey(item.QSSKZ);
									that.byId("selectGrpTes").setSelectedKey(item.FDGRV);
									that.byId("selectViasPago").setSelectedKeys(item.ZWELS);
									that.byId("selectPaiBank").setSelectedKey(item.BANKS);
									that.byId("selectClaBank").setSelectedKey(item.BANKL);
									that.byId("cta").setValue(item.BANKN);
									that.byId("iban").setValue(item.IBAN);
									that.byId("titcta").setValue(item.KOINH);
									that.byId("selectPaiBank2").setSelectedKey(item.BANKS2);
									that.byId("selectClaBank2").setSelectedKey(item.BANKL2);
									that.byId("cta2").setValue(item.BANKN2);
									that.byId("iban2").setValue(item.IBAN2);
									that.byId("titcta2").setValue(item.KOINH2);
									that.byId("selectPaiBank3").setSelectedKey(item.BANKS3);
									that.byId("selectClaBank3").setSelectedKey(item.BANKL3);
									that.byId("cta3").setValue(item.BANKN3);
									that.byId("iban3").setValue(item.IBAN3);
									that.byId("titcta3").setValue(item.KOINH3);
									that.byId("recaltpago").setValue(item.LNRZA);
									that.byId("selectGrpComp").setSelectedKeys(item.EKORG_MULTI);
									that.byId("selectMoneda").setSelectedKey(item.WAERS);
									that.byId("selectCondPagoC").setSelectedKey(item.ZTERM_COMPRAS);
									that.byId("ico1").setSelectedKey(item.INCO1);
									that.byId("GrupEsqPro").setSelectedKey(item.KALSK);
									that.byId("ctrlConf").setSelectedKey(item.BSTAE);
									that.byId("vend").setValue(item.VERKF);
									that.byId("dctel").setValue(item.TELFE);
									that.byId("txtObs").setValue(item.OBS);
									if(item.BANKN2 != ''){
										that.onAddBank();
									}if(item.BANKN3 != ''){
										that.onAddBank();
									}
									that.crea_onChangePaisBank();
									that.crea_onChangePaisBank2();
									that.crea_onChangePaisBank3();
									that.crea_onChangeGrpCta();
									that.byId("selectTrat").setSelectedKey(item.ANRED);
									that.crea_trat_change();
								}
							}
						}
					}
			);	
		},
	});
});