sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/UploadCollectionParameter",
	'sap/m/Token',
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/m/Button",
	"z_figestionacreedores/view/utils/connectivity"],
	function(JQuery,Controller,JSONModel,UploadCollectionParameter,Token,MessageToast,Dialog,Button) {
	"use strict";
	return Controller.extend("z_figestionacreedores.controller.master",{
		/**
		 * Called when a controller is
		 * instantiated and its View controls
		 * (if available) are already created.
		 * Can be used to modify the View before
		 * it is displayed, to bind event
		 * handlers and do other one-time
		 * initialization.
		 * 
		 * @memberOf romrecepcont.reporte
		 */
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
				else oView.byId('vistaAdm').setVisible(true);
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
			// var oDataResource = {
			// sServiceUrl:"/sap/opu/odata/sap/ZODATA_FI_GESTION_ACREEDORES_SRV/FileSet"
			// };
			// var jsonResource = new
			// JSONModel(oDataResource);
			// this.getView().byId("UploadCollectionM").setModel(jsonResource,
			// "ResourceModel");
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
			// var oSideNavigation =
			// this.byId('sideNavigation');
			// var bExpanded =
			// oSideNavigation.getExpanded();
			//		
			// oSideNavigation.setExpanded(!bExpanded);
		},
		onChangeTelef : function(oEvent) {
			var _oInput = oEvent.getSource();
			var val = _oInput.getValue();
			val = val.replace(/[^\d]/g, '');
			_oInput.setValue(val);
			this.crea_disableSave();
		},
		crea_onChangeGrpCta : function(oEvent) {
			this.getView().byId("btnGuarda").setEnabled(false);
			var item = this.getView().byId("selectGrpCta").getSelectedItem();
			var context = item.getBindingContext("GrpCta");
			var arrayObject = context.oModel.getProperty(context.sPath);
			var condPagoSelec = arrayObject.ZTERM;
			var viasPagoFiltrar = arrayObject.ZWELS;
			var vparray = [];
			vparray = viasPagoFiltrar.split('');
			
			this.getView().byId("selectCondPagoS").setSelectedKey(condPagoSelec);
			this.getView().byId("selectCondPagoC").setSelectedKey(condPagoSelec);
			// INI - GRUPO CTAS PEXT
			var grupoctaselec = this.getView().byId("selectGrpCta").getSelectedKey();
			console.log("grp cta: " + grupoctaselec);
			this.getView().byId("selectViasPago").clearSelection();
			this.getView().byId("selectGrpTes").setSelectedKey("");
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
			var ob1 = {
					"ANRED" : "0001",
					"ANRED_DESC" : "Sra."
				};
			var ob2 = {
					"ANRED" : "0002",
					"ANRED_DESC" : "Sr."
			};
			var ob3 = {
					"ANRED" : "0003",
					"ANRED_DESC" : "Empresa"
			};
			var ob4 = {
					"ANRED" : "0004",
					"ANRED_DESC" : "Señores"
			};
			var ob5 = {
					"ANRED" : "0005",
					"ANRED_DESC" : "Estimados"
			};
			var ob6 = {
					"ANRED" : "0006",
					"ANRED_DESC" : "Persona Natural"
			};
			var ob7 = {
					"ANRED" : "0007",
					"ANRED_DESC" : "Persona Jurídica"
			};
			var ob8 = {
					"ANRED" : "0008",
					"ANRED_DESC" : "Fondo de Inversión"
			};
			// ini selecc ANRED by GrpCta
			var arrayTrat = [];
			if (grupoctaselec === 'PEXT')
				arrayTrat = [ ob6, ob7, ob8 ];
			else
				arrayTrat = [ ob1, ob2, ob3,
					ob4, ob5, ob6, ob7, ob8 ];
			// Trat
			var oModelTrat = new sap.ui.model.json.JSONModel();
			oModelTrat.setData({
				Trat : arrayTrat
			});
			this.getView().byId("selectTrat")
			.setModel(oModelTrat);
			// fin selecc ANRED by GrpCta
			if (grupoctaselec === 'PEXT') {
				this.getView().byId("fna").setVisible(true);
				this.getView().byId("lblfna").setVisible(true);
				this.getView().byId("lna").setVisible(true);
				this.getView().byId("lbllna").setVisible(true);
				this.getView().byId("sex").setVisible(true);
				this.getView().byId("lblsex").setVisible(true);
				this.getView().byId("pro").setVisible(true);
				this.getView().byId("lblpro").setVisible(true);
				// this.getView().byId("inpswift").setVisible(true);
				// this.getView().byId("lblswift").setVisible(true);
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
			//fitrar Vias de Pago según Grp Cta
			//VIAS DE PAGO
			var oFilters = [];
			for (var ini = 0; ini < vparray.length; ini++) {
			
				var oFilter = new sap.ui.model.Filter("ZWELS",sap.ui.model.FilterOperator.Contains,vparray[ini]);
				oFilters.push(oFilger);
			}
			selectViasPago.getBinding("items").filter(oFilters);
			
			/*if (grupoctaselec === 'PEXT') {
				var selectViasPago = this.getView().byId("selectViasPago");
				var filtro1 = "B";
				var filtro2 = "K";
				
				var oFilter1 = new sap.ui.model.Filter("ZWELS",sap.ui.model.FilterOperator.Contains,filtro1);
				var oFilter2 = new sap.ui.model.Filter("ZWELS",sap.ui.model.FilterOperator.Contains,filtro2);
				selectViasPago.getBinding("items").filter([ oFilter1, oFilter2 ]);
			}else{
				var selectViasPago = this.getView().byId("selectViasPago");
				var filtro1 = "C";
				var filtro2 = "D";
				var filtro3 = "V";
				var oFilter1 = new sap.ui.model.Filter("ZWELS",sap.ui.model.FilterOperator.Contains,filtro1);
				var oFilter2 = new sap.ui.model.Filter("ZWELS",sap.ui.model.FilterOperator.Contains,filtro2);
				var oFilter3 = new sap.ui.model.Filter("ZWELS",sap.ui.model.FilterOperator.Contains,filtro3);
				selectViasPago.getBinding("items").filter([ oFilter1, oFilter2, oFilter3 ]);
			}*/
			
			//fin 
		},
		crea_onChangePais : function(oEvent) {
			var selectRegiones = this.getView().byId("selectRegion");
			var seleccPais = this.getView().byId("selectPais").getSelectedKey();
			// var oSorter = new
			// sap.ui.model.Sorter("REGIO",
			// true); // descend
			// selectRegiones.getBinding("items").sort(oSorter);
			var oFilter = new sap.ui.model.Filter("LAND1",sap.ui.model.FilterOperator.Contains,seleccPais);
			selectRegiones.getBinding("items").filter([ oFilter ]);
			if (seleccPais == "CL")
				selectRegiones.setSelectedKey("13");
			else
				selectRegiones.setSelectedIndex(0);
			this.crea_onChangeRegion();
			console.log(seleccPais);
		},
		crea_onChangePaisBank : function(oEvent) {
			this.getView().byId("btnGuarda").setEnabled(false);
			var selectClaBank = this.getView().byId("selectClaBank");
			var seleccPais = this.getView().byId("selectPaiBank").getSelectedKey();
			var oFilter = new sap.ui.model.Filter("BANKS",sap.ui.model.FilterOperator.Contains,seleccPais);
			selectClaBank.getBinding("items").filter([ oFilter ]);
			console.log(seleccPais);
		},
		crea_onChangeRegion : function(oEvent) {
			this.getView().byId("btnGuarda").setEnabled(false);
			var selectComunas = this.getView().byId("selectComunas");
			var seleccPais = this.getView().byId("selectPais").getSelectedKey();
			var seleccRegion = this.getView().byId("selectRegion").getSelectedKey();
			var oFilter1 = new sap.ui.model.Filter("LAND1",sap.ui.model.FilterOperator.Contains,seleccPais);
			var oFilter2 = new sap.ui.model.Filter("REGIO",sap.ui.model.FilterOperator.Contains,seleccRegion);
			selectComunas.getBinding("items").filter([oFilter1,oFilter2 ]);
			console.log(seleccPais + seleccRegion);
		},
		crea_disableSave : function() {
			this.getView().byId("btnGuarda").setEnabled(false);
		},
		crea_reset : function() {
			var oView = this.getView();
			oView.byId("selectTrat").setSelectedKey("");// tratamiento
			oView.byId("name1").setValue("");// nombre
			// acreedor
			oView.byId("selectGrpCta")
			.setSelectedIndex(-1);// grupo
			// acreedor
			oView.byId("concep").setValue("");// Concepto
			oView.byId("direc").setValue("");// Direccion
			// calle
			// num
			oView.byId("txtCiudad").setValue("");
			oView.byId("selectComunas").setSelectedIndex(0);
			oView.byId("selectRegion").setSelectedIndex(-1);// Region
			oView.byId("selectPais").setSelectedKey("CL");// Region
			this.onChangePais();
			oView.byId("telf").setValue("");// Telefono
			oView.byId("email1").setValue("");// email
			oView.byId("email2").setValue("");// email
			// cobranza
			oView.byId("stcd1").setValue("");// rut
			oView.byId("kunnr").setValue("");// deudor
			oView.byId("emnfr").setValue("");// fab
			// externo
			oView.byId("selectPaiBank").setSelectedKey("CL");// pais
			// banco
			this.onChangePaisBank();
			oView.byId("cta").setValue("");// cta
			// banco
			oView.byId("titcta").setValue("");// titular
			// cta
			// banco
			oView.byId("selectSociedades").clearSelection();// sociedades
			oView.byId("iban").setValue("");// iban
			oView.byId("selectGrpComp").clearSelection();
			oView.byId("selectMoneda").setSelectedKey("CLP");// condicion
			// de
			// pago
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
			// oView.byId("sex").selectedIndex(0);
			oView.byId("lblsex").setVisible(false);
			oView.byId("lblpro").setVisible(false);
			oView.byId("pro").setVisible(false);
			oView.byId("lblstcd1").setVisible(true);
			oView.byId("stcd1").setVisible(true);
			oView.byId("pro").setValue("");
			oView.byId("lblCtaAsoc").setVisible(true);
			oView.byId("selecCtaAsoc").setVisible(true);
			oView.byId("inpCtaAsoc").setVisible(false);
			// oView.byId("selectGrpCta").setSelectedItem(0);
			// this.onChangeGrpCta();
		},
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
			this.getView().byId("btnGuarda").setEnabled(false);
		},
		onHideShowSubItemPress : function() {
			var navListItem = this.byId('subItemThree');
			navListItem.setVisible(!navListItem.getVisible());
		},
		onItemSelect : function(oEvent) {
			var item = oEvent.getParameter('item');
			var viewId = this.getView().getId();
			console.log(viewId + "--pageContainer" + "#" + viewId + "--" + item.getKey());
			sap.ui.getCore().byId(viewId + "--pageContainer").to(viewId+ "--"+ item.getKey());
			// this.reset();
			this.getView().byId("idAcrACP").setValue("");
			this.getView().byId("idAcrACT").setValue("");
			// if(item.getKey()===''){
			// MessageToast.show("Sin
			// Autorización.");
			// }

		},
		onItemSelectBorr : function(oEvent) {
			this.getView().byId("idAcrBCP").setValue("");
			this.getView().byId("idAcrBCT").setValue("");
			// this.getView().byId("formCompraA").setVisible(false);
			// this.getView().byId("formContabilidadA").setVisible(false);
			var item = oEvent.getParameter('item');
			var viewId = this.getView().getId();
			console.log(viewId + "--pageContainerB" + "#" + viewId + "--" + item.getKey());
			sap.ui.getCore().byId(viewId + "--pageContainerB").to(viewId + "--" + item.getKey());
			this.onResetBorr();
		},
		onItemSelectAmpl : function(oEvent) {
			this.getView().byId("idAcrACP").setValue("");
			this.getView().byId("idAcrACT").setValue("");
			// this.getView().byId("formCompraA").setVisible(false);
			// this.getView().byId("formContabilidadA").setVisible(false);
			var item = oEvent.getParameter('item');
			var viewId = this.getView().getId();
			console.log(viewId + "--pageContainerB" + "#" + viewId + "--" + item.getKey());
			sap.ui.getCore().byId(viewId + "--pageContainerA").to(viewId + "--" + item.getKey());
			this.onResetAmpl();
			// this.reset();
		},
		onSearchAcrComp : function(oEvent) {
			var url = serviceUrl;
			var oView = this.getView();
			var lifnr = this.getView().byId("idAcrACP").getValue();
			var lif = this.pad(lifnr);
			var selectAprobadores = this.getView().byId("selectAprobadoresACP");
			// var selectAprobadores_ =
			// this.getView().byId("selectAprobadores2_");
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
					var result = data.results;
					var oModelGrpComp = new sap.ui.model.json.JSONModel();
					resultGrpComp = result[0].NAVOrgCompras.results;
					oModelGrpComp.setData({GrpComp : resultGrpComp});
					var selectGrpComp = oView.byId("selectGrpCompACP");
					var selectGrpCompCopia = oView.byId("selectGrpCompCopiaACP");
					selectGrpComp.setModel(oModelGrpComp);
					selectGrpCompCopia.setModel(oModelGrpComp);
					// var
					// oModelSociedades
					// = new
					// sap.ui.model.json.JSONModel();
					// var
					// resultSociedades
					// =
					// result[0].NAVSociedades.results;
					// oModelSociedades.setData({
					// Sociedades :
					// resultSociedades});
					// var
					// selectSociedades
					// =
					// oView.byId("selectSociedades2");
					// var
					// selectSociedadesCopia
					// =
					// oView.byId("selectSociedadesCopia2");
					// selectSociedades.setModel(oModelSociedades);
					// selectSociedadesCopia.setModel(oModelSociedades);
					var oModelAprobadores = new sap.ui.model.json.JSONModel();
					var resultGerencias = result[0].NAVGerencias.results;
					oModelAprobadores.setData({
						Aprobadores : resultGerencias
					});
					selectAprobadores.setModel(oModelAprobadores);
					selectAprobadores.setSelectedIndex(0);
					},
					function(err) {
						oView.setBusy(false);
						var errTxt = err.message+ "\n";
						sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
					});
			// fin info inicial
			var lifnr = this.getView().byId(
			"idAcrACP").getValue();
			var lif = this.pad(lifnr);
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.read(
				"/ConsultarAcreedorSet(LIFNR='" + lif 
				+ "',TIPO_PROCESO='E',TIPO_VISTA='CP')",null,[ "" ],false,
				function(data,response) {
					oView.setBusy(false);
					var result = data;
					console.log(data.KTOKK);
					if (data.STATUS === 'S') {
						var oModel = new sap.ui.model.json.JSONModel();
						// oModel.setData({
						// ktokk_desc:
						// result.KTOKK+"
						// -
						// "+result.KTOKK_DESC});
						oModel.setData(result);
						// oView.setModel(oModel);
						oView.setModel(oModel,"dataModel");
						// oView.byId("onSearchAcrCont").setValue("");
						// oView.byId("formContabilidad").setVisible(false);
						var oModelGrpCmp = new sap.ui.model.json.JSONModel();
						var gruposCompraCurrent = [];
						gruposCompraCurrent = data.EKORG_MULTI.split('-');
						var grp = [];
						for (var i = 0; i < gruposCompraCurrent.length; i++) {
							var obj = {
									"EKORG" : gruposCompraCurrent[i],
									"EKORG_DESC" : gruposCompraCurrent[i]
							};
							grp.push(obj);
						}
						var data = {'GrpComp' : grp};
						oModelGrpCmp.setData(data);
						var selGroCom = oView.byId("selectGrpCompACP");
						selGroCom.setModel(oModelGrpCmp);
						if (grp.length > 0)
							selGroCom.setSelectedIndex(0);
						var grpcomp_final = [];
						for (var j = 0; j < resultGrpComp.length; j++) {
							if (!gruposCompraCurrent.includes(resultGrpComp[j].EKORG)) {
								var obj = {
									"EKORG" : resultGrpComp[j].EKORG,
									"EKORG_DESC" : resultGrpComp[j].EKORG_DESC
								};
								grpcomp_final.push(obj);
							}
						}
						var oModelgcmp = new sap.ui.model.json.JSONModel();
						oModelgcmp.setData({
							GrpComp : grpcomp_final
						});
						var selectGrpCompCopia = oView.byId("selectGrpCompCopiaACP");
						selectGrpCompCopia.setModel(oModelgcmp);
						// oView.byId("formCompraA").setVisible(true);
						oView.byId("selectAprobadoresACP").setVisible(true);
						oView.byId("NAME1ACP").setVisible(true);
						oView.byId("NAME1ACT").setVisible(true);
						oView.byId("txtGrpCompACP").setVisible(true);
						oView.byId("selectMonedaACP").setVisible(true);
						oView.byId("condPagoACP").setVisible(true);
						oView.byId("selectGrpCompACP").setVisible(true);
						oView.byId("selectGrpCompCopiaACP").setVisible(true);
						oView.byId("selectGrpCompCopiaACP").clearSelection();
						oView.byId("selectAprobadoresACT").setVisible(true);
						oView.byId("txtSociedadesACT").setVisible(true);
						oView.byId("stcd1ACT").setVisible(true);
						oView.byId("kunnrACT").setVisible(true);
						oView.byId("emnfrACT").setVisible(true);
						oView.byId("selectCondPagoACT").setVisible(true);
						oView.byId("viasPagoACT").setVisible(true);
						oView.byId("selectSociedadesACT").setVisible(true);
						oView.byId("selectSociedadesCopiaACT").setVisible(true);
						// oView.byId("selectSociedadesCopiaACT").clearSelection();
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
			var lifnr = this.getView().byId(
			"idAcrACT").getValue();
			var lif = this.pad(lifnr);
			// var selectAprobadores =
			// this.getView().byId("selectAprobadores2");
			// var selectAprobadores_ =
			// this.getView().byId("selectAprobadoresA_");
			var resultSociedades;
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.read(
				"/InfoInicialSet?$filter=(Proceso eq 'E')"
				+ "&$expand=NAVSociedades,NAVMonedas,"
				+ "NAVOrgCompras,NAVGrpCuentas,NAVCondPago,NAVGerencias",
				null,
				[ "" ],
				false,
				function(data,response) {
					oView.setBusy(false);
					var result = data.results;
					// oView.byId("formContabilidadA").setVisible(true);
					// var
					// oModelGrpComp
					// = new
					// sap.ui.model.json.JSONModel();
					// var
					// resultGrpComp
					// =
					// result[0].NAVOrgCompras.results;
					// oModelGrpComp.setData({
					// GrpComp :
					// resultGrpComp});
					var selectAprobadores = oView.byId("selectAprobadoresACT");
					// var
					// selectGrpCompCopia
					// =
					// oView.byId("selectGrpCompCopia2_");
					// selectGrpComp.setModel(oModelGrpComp);
					// selectGrpCompCopia.setModel(oModelGrpComp);
					// var
					// oModelSociedades
					// = new
					// sap.ui.model.json.JSONModel();
					resultSociedades = result[0].NAVSociedades.results;
					//					
					// oModelSociedades.setData({
					// Sociedades :
					// resultSociedades});
					//					
					// var
					// selectSociedadesCopia
					// =
					// oView.byId("selectSociedadesCopiaACT");
					//				
					// selectSociedadesCopia.setModel(oModelSociedades);
					var oModelAprobadores = new sap.ui.model.json.JSONModel();
					var resultGerencias = result[0].NAVGerencias.results;
					oModelAprobadores.setData({
						Aprobadores : resultGerencias
					});
					selectAprobadores.setModel(oModelAprobadores);
					selectAprobadores.setSelectedIndex(0);
					// selectAprobadores_.setModel(oModelAprobadores);
				},
				function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
				});
			// fin info inicial
			var lifnr = this.getView().byId("idAcrACT").getValue();
			// this.getView().byId("formContabilidad").setVisible(false);
			var lif = this.pad(lifnr);
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.read(
				"/ConsultarAcreedorSet(LIFNR='"
				+ lif
				+ "',TIPO_PROCESO='E',TIPO_VISTA='CT')",
				null,
				[ "" ],
				false,
				function(data,response) {
					oView.setBusy(false);
					var result = data;
					console.log(data.KTOKK);
					if (data.STATUS === 'S') {
						var oModel = new sap.ui.model.json.JSONModel();
						// oModel.setData({
						// ktokk_desc:
						// result.KTOKK+"
						// -
						// "+result.KTOKK_DESC});
						oModel.setData(result);
						// oView.setModel(oModel);
						oView.setModel(oModel,"dataModel");
						// oView.byId("onSearchAcrCont").setValue("");
						// oView.byId("formContabilidad").setVisible(false);
						var oModelSociedades = new sap.ui.model.json.JSONModel();
						var sociedadesCurrent = [];
						sociedadesCurrent = data.BUKRS_MULTI.split('-');
						var soc = [];
						for (var i = 0; i < sociedadesCurrent.length; i++) {
							var obj = {
								"BURKS" : sociedadesCurrent[i],
								"BUKRS_DESC" : sociedadesCurrent[i]
							};
							soc.push(obj);
						}
						var data = {
							'Sociedades' : soc
						};
						oModelSociedades.setData(data);
						var selSociedades = oView.byId("selectSociedadesACT");
						selSociedades.setModel(oModelSociedades);
						if (soc.length > 0)
							selSociedades.setSelectedIndex(0);
						//						
						var soc_finales = [];
						for (var j = 0; j < resultSociedades.length; j++) {
							if (!sociedadesCurrent.includes(resultSociedades[j].BUKRS)) {
								var obj = {
									"BUKRS" : resultSociedades[j].BUKRS,
									"BUKRS_DESC" : resultSociedades[j].BUKRS_DESC
								};
								soc_finales.push(obj);
							}
						}
						var oModelSociedades2 = new sap.ui.model.json.JSONModel();
						oModelSociedades2.setData({
							Sociedades : soc_finales
						});
						var selectSociedadesCopia = oView.byId("selectSociedadesCopiaACT");
						selectSociedadesCopia.setModel(oModelSociedades2);
						// oView.byId("selectSociedadesCopiaACT").setSelectedKeys("[C001]");
						// oView.byId("formContabilidadA").setVisible(true);
						oView.byId("selectAprobadoresACP").setVisible(true);
						oView.byId("NAME1ACP").setVisible(true);
						oView.byId("NAME1ACT").setVisible(true);
						oView.byId("txtGrpCompACP").setVisible(true);
						oView.byId("selectMonedaACP").setVisible(true);
						oView.byId("condPagoACP").setVisible(true);
						oView.byId("selectGrpCompACP").setVisible(true);
						oView.byId("selectGrpCompCopiaACP").setVisible(true);
						oView.byId("selectGrpCompCopiaACP").clearSelection();
						oView.byId("selectAprobadoresACT").setVisible(true);
						oView.byId("txtSociedadesACT").setVisible(true);
						oView.byId("stcd1ACT").setVisible(true);
						oView.byId("kunnrACT").setVisible(true);
						oView.byId("emnfrACT").setVisible(true);
						oView.byId("selectCondPagoACT").setVisible(true);
						oView.byId("viasPagoACT").setVisible(true);
						oView.byId("selectSociedadesACT").setVisible(true);
						oView.byId("selectSociedadesCopiaACT").setVisible(true);
						// oView.byId("selectSociedadesCopiaACT").clearSelection();
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
			this.getView().byId("selectAprobadoresACP").setVisible(false);
			this.getView().byId("NAME1ACP").setVisible(false);
			this.getView().byId("NAME1ACT").setVisible(false);
			this.getView().byId("txtGrpCompACP").setVisible(false);
			this.getView().byId("selectMonedaACP").setVisible(false);
			this.getView().byId("condPagoACP").setVisible(false);
			this.getView().byId("selectGrpCompACP").setVisible(false);
			this.getView().byId("selectGrpCompCopiaACP").setVisible(false);
			this.getView().byId("selectAprobadoresACT").setVisible(false);
			this.getView().byId("txtSociedadesACT").setVisible(false);
			this.getView().byId("stcd1ACT").setVisible(false);
			this.getView().byId("kunnrACT").setVisible(false);
			this.getView().byId("emnfrACT").setVisible(false);
			this.getView().byId("selectCondPagoACT").setVisible(false);
			this.getView().byId("viasPagoACT").setVisible(false);
			this.getView().byId("selectSociedadesACT").setVisible(false);
			this.getView().byId("selectSociedadesCopiaACT").setVisible(false);
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
			this.getView().byId("selectAprobadoresBCT").setVisible(false);
			this.getView().byId("selectGrpCompBCP").setVisible(false);
			this.getView().byId("selectSociedadesBCT").setVisible(false);
			this.getView().byId("chk1BCP").setVisible(false);
			this.getView().byId("chk2BCP").setVisible(false);
//			this.getView().byId("chk3BCP")
//			.setVisible(false);
//			this.getView().byId("chk1BCT")
//			.setVisible(false);
//			this.getView().byId("chk2BCT")
//			.setVisible(false);
			this.getView().byId("chk3BCT").setVisible(false);
			this.getView().byId("chk4BCT").setVisible(false);
			this.getView().byId("lblb1").setVisible(false);
//			this.getView().byId("lblb2")
//			.setVisible(false);
//			this.getView().byId("lblb3")
//			.setVisible(false);
			this.getView().byId("lblb4").setVisible(false);
		},
		toListado : function() {
			this.getView().byId("idSolicTable").setVisible(true);
			this.getView().byId("ObjectPageLayout").setVisible(false);
			this.getView().byId("contabKeyBMS").setVisible(false);
			this.getView().byId("comprasKeyBMS").setVisible(false);
			this.getView().byId("contabKeyAMS").setVisible(false);
			this.getView().byId("comprasKeyAMS").setVisible(false);
		},
		toListadoADM : function() {
			this.getView().byId("idSolicTableADM").setVisible(true);
			this.getView().byId("ObjectPageLayoutADM").setVisible(false);
			this.getView().byId("contabKeyBADM").setVisible(false);
			this.getView().byId("comprasKeyBADM").setVisible(false);
			this.getView().byId("contabKeyAADM").setVisible(false);
			this.getView().byId("comprasKeyAADM").setVisible(false);
		},
		crear_showCrear : function() {
			var url = serviceUrl;
			var oView = this.getView();
			var that = this;
			oView.setBusy(true);
			///
			var subs = oView.byId('ObjectPageLayout3').getSections()[1].getSubSections()[1];
			//
			jQuery.sap.delayedCall(1500, this, function() {
			    this.getView().byId("selectTrat").focus();
			 });
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
			var selectViasPago = this.getView().byId("selectViasPago");
			var selectCtaAsoc = this.getView().byId("selectCtaAsoc");
			var selectTrat = this.getView().byId("selectTrat");
			oView.byId("selectTrat").setSelectedKey("");// tratamiento
			oView.byId("name1").setValue("");// nombre
			// acreedor
			oView.byId("concep").setValue("");// Concepto
			oView.byId("direc").setValue("");// Direccion
			// calle
			// num
			oView.byId("txtCiudad").setValue("");
			oView.byId("telf").setValue("");// Telefono
			oView.byId("email1").setValue("");// email
			oView.byId("email2").setValue("");// email cobranza
			oView.byId("stcd1").setValue("");// rut
			oView.byId("kunnr").setValue("");// deudor
			oView.byId("emnfr").setValue("");// fab externo
//			oView.byId("cta").setValue("");// cta banco
//			oView.byId("titcta").setValue("");// titular cta banco
//			oView.byId("iban").setValue("");// iban
			oView.byId("txtObs").setValue("");
			oView.byId("fna").setVisible(false);
			oView.byId("fna").setValue("");
			oView.byId("lblfna").setVisible(false);
			oView.byId("lna").setVisible(false);
			oView.byId("lna").setValue("");
			oView.byId("lbllna").setVisible(false);
			oView.byId("sex").setVisible(false);
			oView.byId("lblsex").setVisible(false);
			oView.byId("lblpro").setVisible(false);
			oView.byId("pro").setVisible(false);
			oView.byId("lblstcd1").setVisible(true);
			oView.byId("stcd1").setVisible(true);
			oView.byId("lblCtaAsoc").setVisible(true);
			oView.byId("selectCtaAsoc").setVisible(true);
			oView.byId("inpCtaAsoc").setVisible(false);
			oView.byId("pro").setValue("");
//			oView.byId("inpswift").setVisible(false);
//			oView.byId("lblswift").setVisible(false);
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
					// Estructura
					// Monedas
					// cortada
					// 0-99;100-199;...
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
					that.crea_onChangePaisBank();
					selectGrpCta.setSelectedIndex(0);
					var oModelCtaAsoc = new sap.ui.model.json.JSONModel();
					var resultCtaAsoc = result[0].NAVCuentas.results;
					oModelCtaAsoc.setData({
						Cta : resultCtaAsoc
					});
					selectCtaAsoc.setModel(oModelCtaAsoc);
					var oModelTrat = new sap.ui.model.json.JSONModel();
					var ob1 = {
						"ANRED" : "0001",
						"ANRED_DESC" : "Sra."
					};
					var ob2 = {
						"ANRED" : "0002",
						"ANRED_DESC" : "Sr."
					};
					var ob3 = {
						"ANRED" : "0003",
						"ANRED_DESC" : "Empresa"
					};
					var ob4 = {
						"ANRED" : "0004",
						"ANRED_DESC" : "Señores"
					};
					var ob5 = {
						"ANRED" : "0005",
						"ANRED_DESC" : "Estimados"
					};
					var ob6 = {
						"ANRED" : "0006",
						"ANRED_DESC" : "Persona Natural"
					};
					var ob7 = {
						"ANRED" : "0007",
						"ANRED_DESC" : "Persona Jurídica"
					};
					var ob8 = {
						"ANRED" : "0008",
						"ANRED_DESC" : "Fondo de Inversión"
					};
					var arrayTrat = [ob1,ob2,ob3,ob4,ob5,ob6,ob7,ob8 ];
					oModelTrat.setData({
						Trat : arrayTrat
					});
					selectTrat.setModel(oModelTrat);
					that.crea_onChangeGrpCta();
				},function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
				});
		},
		crea_valida : function() {
			var ok = true;
			var oView = this.getView();
			var pext = (oView.byId("selectGrpCta").getSelectedKey() === 'PEXT') ? true : false;
			var hono = (oView.byId("selectGrpCta").getSelectedKey() === 'HONO') ? true : false;
			var palt = (oView.byId("selectGrpCta").getSelectedKey() === 'PALT') ? true : false;
			var erel = (oView.byId("selectGrpCta").getSelectedKey() === 'EREL') ? true : false;
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
			var vpg = [];
			vpg = oView.byId("selectViasPago").getSelectedKeys();
			// Rut
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
					for (; T; T = Math.floor(T / 10)) S = (S + T % 10 * (9 - M++ % 6)) % 11;
						return S ? S - 1 : 'k';
					}
			}
			// Emails
			var email1 = this.getView().byId("email1").getValue();
			var email2 = this.getView().byId("email2").getValue();
			var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			if (oView.byId("selectGrpCta").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Indique Grupo de Cuentas");
			} else if (oView.byId("selectTrat").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Indique tratamiento.");
			} else if (oView.byId("name1").getValue().trim() == '') {
				ok = false;
				MessageToast.show("Nombre obligatorio.");
				this.getView().byId("name1").setValueState(sap.ui.core.ValueState.Error);
			} else if (oView.byId("concep").getValue().trim() == '') {
				ok = false;
				MessageToast.show("Concepto obligatorio.");
				this.getView().byId("concep").setValueState(sap.ui.core.ValueState.Error);
			} else if (oView.byId("direc").getValue().trim() == '') {
				ok = false;
				MessageToast.show("Indique Dirección/Calle.");
				this.getView().byId("direc").setValueState(sap.ui.core.ValueState.Error);
			} else if (oView.byId("txtCiudad").getValue().trim() == '') {
				ok = false;
				MessageToast.show("Indique Ciudad.");
				this.getView().byId("txtCiudad").setValueState(sap.ui.core.ValueState.Error);
			} else if (oView.byId("selectPais").getSelectedKey() === "CL" 
					&& oView.byId("selectRegion").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Indique región.");
			} else if (oView.byId("selectPais").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Indique país.");
			} else if (oView.byId("stcd1").getValue().trim() == '') {
				ok = false;
				MessageToast.show("Indique N° Id.fiscal.");
				this.getView().byId("stcd1").setValueState(sap.ui.core.ValueState.Error);
			} else if (!pext && (!Fn.validaRut(oView.byId("stcd1").getValue()))) {
				MessageToast.show('N° Id.fiscal inválido');
				ok = false;
				this.getView().byId("stcd1").setValueState(sap.ui.core.ValueState.Error);
			} else if (pext && oView.byId("fna").getValue().trim() == '') {
				ok = false;
				MessageToast.show("Indique Fecha Nacimiento.");
				this.getView().byId("fna").setValueState(sap.ui.core.ValueState.Error);
			} else if (pext && oView.byId("lna").getVisible() && oView.byId("lna").getValue().trim() == '') {
				ok = false;
				MessageToast.show("Indique lugar de nacimiento.");
				this.getView().byId("lna").setValueState(sap.ui.core.ValueState.Error);
			} else if (pext && oView.byId("pro").getVisible() && oView.byId("pro").getValue().trim() == '') {
				ok = false;
				MessageToast.show("Indique profesión.");
				this.getView().byId("pro").setValueState(sap.ui.core.ValueState.Error);
			} else if (pext && !oView.byId("RB1-1").getSelected() 
					&& !oView.byId("RB1-2").getSelected()) {
				ok = false;
				MessageToast.show("Indique sexo.");
				this.getView().byId("sex").setValueState(sap.ui.core.ValueState.Error);
			} else if (socs.length == 0) {
				ok = false;
				MessageToast.show("Indique Sociedad(es).");
			} else if (erel && oView.byId("inpCtaAsoc").getValue().trim() == '') {
				ok = false;
				MessageToast.show("Indique Cta. Asociada");
				// }else if(pext &
				// !this.crea_validaSwift()){
				// MessageToast.show("Código
				// Swift erróneo.");
			} else if ((pext || hono) & oView.byId("selectIndRet").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Seleccione Indicador Retención.");
				// }else if(gcom.length==0){
				// ok=false;
				// MessageToast.show("Indique
				// grupo(s) de compra.");
			} else if (oView.byId("selectPaiBank").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Indique Dato Banco País.");
			} else if (oView.byId("selectClaBank").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Indique Banco-Swift.");
			} else if (oView.byId("cta").getValue().trim() == '') {
				ok = false;
				MessageToast.show("Indique Cuenta Bancaria.");
				// MONEDA - WAERS
			} else if (oView.byId("selectMoneda").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Indique moneda.");
				// VIAS PAGO
			} else if (!palt && vpg.length == 0) {
				ok = false;
				MessageToast.show("Indique Vías de pago (al menos una).");
			}
			if (email1 != null && email1 != '') {
				if (!mailregex.test(email1)) {
					MessageToast.show(email1 + " no es un e-mail válido.");
					this.getView().byId("email1").setValueState(sap.ui.core.ValueState.Error);
					ok = false;
				}
			}
			if (email2 != null && email2 != '') {
				if (!mailregex.test(email2)) {
					MessageToast.show(email2 + " no es un e-mail válido.");
					this.getView().byId("email2").setValueState(sap.ui.core.ValueState.Error);
					ok = false;
				}
			}
			if (ok) {
				oView.byId("btnGuarda").setEnabled(true);
				oView.byId("btnValida").setEnabled(true);
			} else {
				oView.byId("btnGuarda").setEnabled(false);
				oView.byId("btnValida").setEnabled(true);
			}
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
			var kunnr = oView.byId("kunnr").getValue();// deudor
			var emnfr = oView.byId("emnfr").getValue();// fab externo
			var banks = oView.byId("selectPaiBank").getSelectedKey();// pais banco
			var clabanks = oView.byId("selectClaBank").getSelectedKey();
			var bankn = oView.byId("cta").getValue();// cta banco
			var koinh = oView.byId("titcta").getValue();// titular cta banco
			var bukrs = [];
			bukrs = oView.byId("selectSociedades").getSelectedKeys();// sociedades
			var iban = oView.byId("iban").getValue();// iban
			var zterm = oView.byId("selectCondPagoS").getSelectedKey();// condicion de pago
			var zterm_compra = oView.byId("selectCondPagoC").getSelectedKey();// condicion de pago
			var waers = oView.byId("selectMoneda").getSelectedKey();// condicion de pago
			var ekorg = [];
			ekorg = oView.byId("selectGrpComp").getSelectedKeys();// org compras
			var bukrs_single = bukrs.join('-');
			var bukrs_multi = bukrs.join('-');
			if (bukrs.lenght == 1) {
				bukrs_multi = '';
			} else {
				bukrs_single = '';
			}
			var ekorg_single = ekorg.join('-');
			var ekorg_multi = ekorg.join('-');
			if (ekorg.lenght == 1) {
				ekorg_multi = '';
			} else {
				ekorg_single = '';
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
			// var swf =
			// this.getView().byId("inpswift").getValue();
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
				"BUKRS" : bukrs_single,
				"HKONT" : ctaasoc,
				"IBAN" : iban,
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
				// "SWIFT" : swf
			};
			oModel.create("/CrearSolicitudSet",
				oEntry,
				null,
				function(data) {
					oView.setBusy(false);
					if (data.STATUS === 'S') {
						MessageToast.show(data.MESSAGE);
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
			var oEntry = new sap.ui.model.json.JSONModel();
			var lifnr = oView.byId("lifnrM").getValue();
			var anred = oView.byId("selectTratM").getSelectedKey();// tratamiento
			var name1 = oView.byId("name1M").getValue();// nombre acreedor
			var name2 = oView.byId("name2M").getValue();// nombre acreedor
			var ktokk = oView.byId("inpKtokkM").getValue();// grupo acreedor var ktokk =
			// oView.byId("selectCtaAsocM").getSelectedKey();
			var sort = oView.byId("concepM").getValue();// Concepto
			var stras = oView.byId("direcM").getValue();// Direccion
			// calle num
			var ciuda = oView.byId("txtCiudadM").getValue();// ciudad
			var hkont = oView.byId("hkont").getValue();// comuna
			var comun = oView.byId("selectComunasM").getSelectedKey();
			var regio = oView.byId("selectRegionM").getSelectedKey();// Region
			var land1 = oView.byId("selectPaisM").getSelectedKey();// Region
			var telf = oView.byId("telfM").getValue();// Telefono
			var email1 = oView.byId("email1M").getValue();// email
			var email2 = oView.byId("email2M").getValue();// email cobranza
			var stcd1 = oView.byId("stcd1M").getValue();// rut
			var kunnr = oView.byId("kunnrM").getValue();// deudor
			var emnfr = oView.byId("emnfrM").getValue();// fab externo
			var banks = oView.byId("selectPaiBankM").getSelectedKey();// pais
			var bankl = oView.byId("selectClaBankM").getSelectedKey();// pais
			var bankn = oView.byId("ctaM").getValue();// cta banco
			var koinh = oView.byId("titctaM").getValue();// titular cta banco
			var bukrs = oView.byId("txtSociedadesM").getValue();// sociedades
			var iban = oView.byId("ibanM").getValue();// iban
			var zterm = oView.byId("selectCondPagoSM").getSelectedKey();// condicion de pago
			var zterm_compra = oView.byId("selectCondPagoCM").getSelectedKey();// condicion de pago
			var waers = oView.byId("selectMonedaM").getSelectedKey();// condicion de pago
			var ekorg = "";
			var orgcomp = [];
			orgcomp = oView.byId("selectGrpCompM").getSelectedKeys();// Vias Pago
			if (orgcomp.length > 0) {
				ekorg = orgcomp.join('-');
			} else {
				ekorg = oView.byId("txtEkorgM").getText();// org compras
			}
			var qsskz = '';
			if (ktokk === 'HONO') {
				qsskz = oView.byId("selectIndRetM").getSelectedKey();
			}
			// var swift =
			// oView.byId("inpswiftM").getValue();
			var apro = oView.byId("selectAprobadoresM").getSelectedKey();
			var obs = oView.byId("txtObsM").getValue();
			var vpg = [];
			vpg = oView.byId("selectViasPagoM").getSelectedKeys();// Vias
			// Pago
			var vpago_single = vpg.join('');
			jQuery.sap.require("jquery.sap.storage");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			oStorage.put("TIPO_PROCESO", "U");
			var grptes = oView.byId("selectGrpTesM").getSelectedKey();
			//PEXT
			var masc ='';
			var feme='';
			var sex='';
			var fnac = '';
			var lnac='';
			var prof = '';
			if (ktokk === 'PEXT') {			
				masc = oView.byId("RB1-1M").getSelected();
				feme = oView.byId("RB1-2M").getSelected();
				sex = '2';
				if (masc)
					sex = '1';
				fnac = oView.byId("fnaM").getValue(); // Fecha// nacimiento
				lnac = oView.byId("lnaM").getValue(); // Lugar// nacimiento
				prof = oView.byId("proM").getValue(); // Profesion
			}
			//PEXT
			oEntry = {
					"TIPO_PROCESO" : 'U',
					"ID_SOLICITUD" : '',
					"LIFNR" : lifnr,
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
					"BANKL" : bankl,
					"BANKN" : bankn,
					"KOINH" : koinh,
					"BUKRS" : '',
					"HKONT" : hkont,
					"IBAN" : iban,
					// "SWIFT" : swift,
					"FDGRV" : '',
					"QSSKZ" : qsskz,
					"ZTERM" : zterm,
					"ZTERM_COMPRAS" : zterm_compra,
					"EKORG" : '',
					"WAERS" : waers,
					"BUKRS_MULTI" : bukrs,
					"EKORG_MULTI" : ekorg,
					"APROBADOR" : apro,
					"OBS" : obs,
					"ZWELS" : vpago_single,
					"FDGRV" : grptes
			};
			oModel.create(
				"/CrearSolicitudSet",
				oEntry,
				null,
				function(data) {
					oView.setBusy(false);
					if (data.STATUS === 'S') {
						MessageToast.show(data.MESSAGE);
						oView.byId("btnGuardarM").setEnabled(false);
						oStorage.put("ID_PROCESO",data.ID_SOLICITUD);
						// that.upload2();
						// var
						// oUploadCollection
						// =
						// oView.byId("UploadCollectionM");
						// oUploadCollection.setUploadUrl("/sap/opu/odata/sap/ZODATA_FI_GESTION_ACREEDORES_SRV/FileSet"
						// +
						// "(ID_PROCESO='"+data.ID_SOLICITUD+"',TIPO_PROCESO='U',FILE_NAME='tt')");
						// that.onStartUploadii();
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
			var oUploadCollection = this	.getView()	.byId("UploadCollectionM");
			// var resourcemodel =
			// oUploadCollection.getModel("ResourceModel");
			// oUploadCollection.setUploadUrl("/sap/opu/odata/sap/ZODATA_FI_GESTION_ACREEDORES_SRV/FileSet"
			// +
			// "(ID_PROCESO='"+id+"',TIPO_PROCESO='"+tipo+"',FILE_NAME='tt')");
			// var sServiceUrl1 =
			// resourcemodel.oData.sServiceUrl;
			// oUploadCollection.setUploadUrl(sServiceUrl1);
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
			oUploadCollection.setUploadUrl("/FioriSCP.z_figestionacreedores/sap/opu/odata/sap/ZODATA_FI_GESTION_ACREEDORES_SRV/FileSet(ID_PROCESO='"
					+ id
					+ "',TIPO_PROCESO='U',FILE_NAME='tt')");
			console.log("token"
					+ oUploadCollection.getUploadUrl());
			oUploadCollection.upload();
			// var file =
			// jQuery.sap.domById("UploadCollectionM").files[0];
			// var oRequest =
			// sap.ui.getCore().getModel(this.getModelName())._createRequest();
			// var oHeaders = {
			// "x-csrf-token":
			// oRequest.headers['x-csrf-token'],
			// "slug": this.getSlug(),
			// };
			// jQuery.ajax({
			// type: 'POST',
			// url: this.getUploadUrl(),
			// headers: oHeaders,
			// cache: false,
			// contentType: false,
			// processData: false,
			// data: file,
			// success: _handleSuccess,
			// error: _handleError
			// });
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
			// Header Slug
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
			// var oTextArea =
			// this.byId("TextArea");
			var cFiles = oUploadCollection.getItems().length;
			var uploadInfo = cFiles + " file(s)";
			if (cFiles > 0) {
				oUploadCollection.upload();
				// if
				// (oTextArea.getValue().length
				// === 0) {
				// uploadInfo = uploadInfo + "
				// without notes";
				// } else {
				// uploadInfo = uploadInfo + "
				// with notes";
				// }
				MessageToast.show("Method Upload is called (" + uploadInfo + ")");
				MessageBox.information("Uploaded " + uploadInfo);
				// oTextArea.setValue("");
			}
		},
		onChange : function(oEvent) {
			// var oUploadCollection =
			// oEvent.getSource();
			// // Header Token
			// var oCustomerHeaderToken = new
			// UploadCollectionParameter({
			// name: "x-csrf-token",
			// value: "securityTokenFromModel"
			// });
			// oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
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
			oView.byId("selectGrpCta").setSelectedItem(0);
			this.crea_onChangeGrpCta();
			oView.byId("selectTrat").setSelectedKey("");// tratamiento
			oView.byId("name1").setValue("");// nombre acreedor
			oView.byId("name2").setValue("");// nombre acreedor
			oView.byId("selectGrpCta").setSelectedIndex(-1);// grupo acreedor
			oView.byId("concep").setValue("");// Concepto
			oView.byId("direc").setValue("");// Direccion calle num
			oView.byId("txtCiudad").setValue("");
			oView.byId("selectComunas").setSelectedIndex(-1);
			oView.byId("selectRegion").setSelectedIndex(-1);// Region
			oView.byId("selectPais").setSelectedKey("CL");// Region
			this.crea_onChangePais();
			oView.byId("telf").setValue("");// Telefono
			oView.byId("email1").setValue("");// email
			oView.byId("email2").setValue("");// email cobranza
			oView.byId("stcd1").setValue("");// rut
			oView.byId("kunnr").setValue("");// deudor
			oView.byId("emnfr").setValue("");// fab externo
			oView.byId("inpCtaAsoc").setValue("");// Cta Asociada
			oView.byId("selectPaiBank").setSelectedKey("CL");// pais banco
			this.crea_onChangePaisBank();
			oView.byId("cta").setValue("");// cta banco
			oView.byId("titcta").setValue("");// titular cta banco
			oView.byId("selectSociedades").clearSelection();// sociedades
			oView.byId("iban").setValue("");// iban
			oView.byId("selectGrpComp").clearSelection();
			oView.byId("selectMoneda").setSelectedKey("CLP");// condicion de pago
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
			oView.byId("sex").setSelectedIndex(0);
			oView.byId("lblsex").setVisible(false);
			oView.byId("lblpro").setVisible(false);
			oView.byId("pro").setVisible(false);
			oView.byId("lblstcd1").setVisible(true);
			oView.byId("stcd1").setVisible(true);
			oView.byId("pro").setValue("");
			oView.byId("selectIndRet").setSelectedKey("H0");
		},
		modif_showModif : function() {
			this.oObjectPageLayout = this.getView().byId("ObjectPageLayoutM");
			this.oTargetSubSection = this.getView().byId("opssM");
			this.oObjectPageLayout.addEventDelegate({
				onAfterRendering : function() {
					// need to wait for the scrollEnablement to be active
					jQuery.sap.delayedCall(500,this.oObjectPageLayout,
							this.oObjectPageLayout.scrollToSection,
							[ this.oTargetSubSection.getId() ]);
				}.bind(this)
			});
			this.getView().byId("idAcrM").setValue("");
			this.getView().byId("objPageScGM").setVisible(false);
			this.getView().byId("objPageScSM").setVisible(false);
			this.getView().byId("objPageScCM").setVisible(false);
			// this.getView().byId("objPageScAM").setVisible(false);
			this.getView().byId("objPageScOM").setVisible(false);
			this.getView().byId("btnValidarM").setVisible(false);
			this.getView().byId("btnValidarM").setEnabled(false)
			this.getView().byId("btnGuardarM").setVisible(false);
			this.getView().byId("btnGuardarM").setEnabled(false);
			this.getView().byId("gsgM").setVisible(false);
			this.getView().byId("selectAprobadoresM").setVisible(false);
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			var selectPaises = this.getView().byId("selectPaisM");
			var selectPaiBank = this.getView().byId("selectPaiBankM");
			var selectMonedas = this.getView().byId("selectMonedaM");
			var selectCondPagoC = this.getView().byId("selectCondPagoCM");
			var selectCondPagoS = this.getView().byId("selectCondPagoSM");
			var selectSociedades = this.getView().byId("selectSociedadesM");
			var selectRegion = this.getView().byId("selectRegionM");
			var selectAprobadores = this.getView().byId("selectAprobadoresM");
			var selectBancos = this.getView().byId("selectClaBankM");
			var selectComunas = this.getView().byId("selectComunasM");
			var selectViasPago = this.getView().byId("selectViasPagoM");
			var selectCtaAsoc = this.getView().byId("selectCtaAsocM");
			var selectGrpComp = this.getView().byId("selectGrpCompM");
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.read(
				"/InfoInicialSet?$filter=(Proceso eq 'U')"
				+ "&$expand=NAVSociedades,NAVMonedas,NAVPaises,"
				+ "NAVOrgCompras,NAVGrpCuentas,NAVCondPago,"
				+ "NAVPaisesRegiones,NAVGerencias,NAVPaisRegComunas,"
				+ "NAVBancos,NAVViasPago,NAVCuentas",
				null,
				[ "" ],
				false,
				function(data,response) {
					oView.setBusy(false);
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
					var oModelPR = new sap.ui.model.json.JSONModel();
					var resultPR = result[0].NAVPaisesRegiones.results;
					oModelPR.setData({
						Regiones : resultPR
					});
					selectRegion.setModel(oModelPR);
					// var oStorage
					// =
					// jQuery.sap.storage(jQuery.sap.storage.Type.local);
					// oStorage.put("PaisesRegiones",resultPR);
					var oModelMoneda = new sap.ui.model.json.JSONModel();
					var resultMonedas = result[0].NAVMonedas.results;
					console.log(resultMonedas.length);
					console.log(resultMonedas[101].WAERS_DESC);
					// Estructura
					// Monedas
					// cortada
					// 0-99;100-199;...
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
					var oModelCondPago = new sap.ui.model.json.JSONModel();
					var resultCondPago = result[0].NAVCondPago.results;
					oModelCondPago.setData({
						CondPago : resultCondPago
					});
					oModelCondPago.setSizeLimit(resultCondPago.length);
					selectCondPagoS.setModel(oModelCondPago);
					selectCondPagoC.setModel(oModelCondPago);
					var oModelAprobadores = new sap.ui.model.json.JSONModel();
					var resultGerencias = result[0].NAVGerencias.results;
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
					var oModelCtaAsoc = new sap.ui.model.json.JSONModel();
					var resultCtaAsoc = result[0].NAVCuentas.results;
					oModelCtaAsoc.setData({
						Cta : resultCtaAsoc
					});
					selectCtaAsoc.setModel(oModelCtaAsoc);
					var oModelGrpComp = new sap.ui.model.json.JSONModel();
					var resultGrpComp = result[0].NAVOrgCompras.results;
					oModelGrpComp.setData({
						GrpComp : resultGrpComp
					});
					selectGrpComp.setModel(oModelGrpComp);
				},
				function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
				});
		},
		modif_onSearchAcr : function(oEvent) {
			// var upc =
			// this.getView().byId("UploadCollectionM");
			// if(upc.aItems.length>0)
			// upc.removeAllItems();
			this.getView().byId("gsgM").setVisible(false);
			this.getView().byId("selectAprobadoresM").setVisible(false);
			var lifnr = this.getView().byId("idAcrM").getValue();
			this.getView().byId("btnGuardarM").setEnabled(false);
			var lif = this.pad(lifnr);
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel(url, true/* ,user,pass */);
			oModel.read("/ConsultarAcreedorSet(LIFNR='"
				+ lif
				+ "',TIPO_PROCESO='U',TIPO_VISTA='')",
				null,
				[ "" ],
				false,
				function(data,response) {
					oView.setBusy(false);
					var result = data;
					console.log(data.KTOKK);
					if (result.STATUS === 'S') {
						var selectCtaAsoc = oView.byId("selectCtaAsocM");
						selectCtaAsoc.setVisible(true);
						oView.byId("btnValidarM").setEnabled(false)
						oView.byId("objPageScGM").setVisible(true);
						oView.byId("objPageScSM").setVisible(true);
						oView.byId("objPageScCM").setVisible(true);
						// oView.byId("objPageScAM").setVisible(true);
						oView.byId("objPageScOM").setVisible(true);
						oView.byId("btnValidarM").setVisible(true);
						oView.byId("btnGuardarM").setVisible(true);
						oView.byId("gsgM").setVisible(true);
						oView.byId("selectAprobadoresM").setVisible(true);
						var oModel = new sap.ui.model.json.JSONModel();
						var zwels = [];
						var oDataZwels = result.ZWELS;
						zwels = oDataZwels.split('');
						result.ZWELS_LISTA = zwels;
						var oEkorg = result.EKORG;
						var oEkorg_multi = result.EKORG_MULTI;
						if (oEkorg === ''&& oEkorg_multi === '') {
							oView.byId("selectGrpCompM").setVisible(true);
							oView.byId("txtEkorgM").setVisible(false);
						} else {
							oView.byId("selectGrpCompM").setVisible(false);
							oView.byId("txtEkorgM").setVisible(true);
						}
						oModel.setData(result);
						oView.setModel(oModel,"dataModel");
						oView.byId("txtSociedadesM").setValue(result.BUKRS_MULTI);
						var grpcta = result.KTOKK;
						var idfiscal = result.STCD1;
						if (idfiscal == null|| idfiscal === '')
							oView.byId("stcd1M").setEditable(true);
						oView.byId("fnaM").setVisible(false);
						oView.byId("lblfnaM").setVisible(false);
						oView.byId("lnaM").setVisible(false);
						oView.byId("lbllnaM").setVisible(false);
						oView.byId("sexM").setVisible(false);
						oView.byId("lblsexM").setVisible(false);
						oView.byId("proM").setVisible(false);
						oView.byId("lblproM").setVisible(false);
						oView.byId("lblselectIndRetM").setVisible(false);
						oView.byId("selectIndRetM").setVisible(false);
						oView.byId("lblselectGrpTesM").setVisible(false);
						oView.byId("selectGrpTesM").setVisible(false);
						oView.byId("selectViasPagoM").setVisible(true);
						oView.byId("lblViasPagoM").setVisible(true);
						oView.byId("inpswiftM").setVisible(false);
						oView.byId("lblswiftM").setVisible(false);
						var ob1 = {
								"ANRED" : "0001",
								"ANRED_DESC" : "Sra."
						};
						var ob2 = {
								"ANRED" : "0002",
								"ANRED_DESC" : "Sr."
						};
						var ob3 = {
								"ANRED" : "0003",
								"ANRED_DESC" : "Empresa"
						};
						var ob4 = {
								"ANRED" : "0004",
								"ANRED_DESC" : "Señores"
						};
						var ob5 = {
								"ANRED" : "0005",
								"ANRED_DESC" : "Estimados"
						};
						var ob6 = {
								"ANRED" : "0006",
								"ANRED_DESC" : "Persona Natural"
						};
						var ob7 = {
								"ANRED" : "0007",
								"ANRED_DESC" : "Persona Jurídica"
						};
						var ob8 = {
								"ANRED" : "0008",
								"ANRED_DESC" : "Fondo de Inversión"
						};
						// ini selecc ANRED by GrpCta
						var arrayTrat = [];
						if (grpcta === 'PEXT')
							arrayTrat = [ob6,ob7,ob8 ];
						else
							arrayTrat = [ob1,ob2,ob3,ob4,ob5,ob6,ob7,ob8 ];// Trat
						var oModelTrat = new sap.ui.model.json.JSONModel();
						oModelTrat.setData({Trat : arrayTrat});
						oView.byId("selectTratM").setModel(	oModelTrat);
						// fin select ANRED by GrpCta filtrar Cta Asoc by GrpCta
						var oFilter = new sap.ui.model.Filter("KTOKK",sap.ui.model.FilterOperator.EQ,grpcta);
						selectCtaAsoc.getBinding("items").filter([ oFilter ]);
						// fin filtrar Cta Asoc
						if (grpcta === 'PEXT') {
							var sex = result.SEXKZ;
							if (sex === '1') {
								oView.byId("RB1-1M").setSelected(true); // idcliente extranjero= 90959
								oView.byId("RB1-2M").setSelected(false);
							} else if (sex === '2') {
								oView.byId("RB1-1M").setSelected(false);
								oView.byId("RB1-2M").setSelected(true);
							} else {
								oView.byId("RB1-1M").setSelected(false);
								oView.byId("RB1-2M").setSelected(false);
							}
//							var fn = result.GBDAT;
//							if(fn==='00000000'){
//							oView.byId("fnaM").setVisible(true);
//							oView.byId("lblfnaM").setVisible(true);
//							}
//							var ln=result.GBORT;
//							if(ln===''){
//							oView.byId("lnaM").setVisible(true);
//							oView.byId("lbllnaM").setVisible(true);				
//							}
//							if(sex===''){
//							oView.byId("sexM").setVisible(true);
//							oView.byId("lblsexM").setVisible(true);
//							}
//							oView.byId("proM").setVisible(true);
//							oView.byId("lblproM").setVisible(true);
							// oView.byId("inpswiftM").setVisible(true);
							// oView.byId("lblswiftM").setVisible(true);

						} else if (grpcta === 'HONO') {
							oView.byId("lblselectIndRetM").setVisible(true);
							oView.byId("selectIndRetM").setVisible(true);

						} else if (grpcta === 'AVRS') {
							oView.byId("lblselectGrpTesM").setVisible(true);
							oView.byId("selectGrpTesM").setVisible(true);

						} else if (grpcta === 'PALT') {
							oView.byId("selectViasPagoM").setVisible(false);
							oView.byId("lblViasPagoM").setVisible(false);
							oView.byId("selectCtaAsocM").setVisible(false);
							oView.byId("lblCtaAsocM").setVisible(false);
						}
//						that.modif_onChangePais();
						that.modif_onChangePaisBank();
						//*****
						var selecR = result.REGIO;
						var selectRegiones = oView	.byId("selectRegionM");
						var seleccPais = oView	.byId("selectPaisM").getSelectedKey();
						// var oSorter = new
						// sap.ui.model.Sorter("REGIO",
						// true); // descend
						// selectRegiones.getBinding("items").sort(oSorter);
						var oFilter = new sap.ui.model.Filter("LAND1",sap.ui.model.FilterOperator.Contains,seleccPais);
						selectRegiones.getBinding("items")	.filter([ oFilter ]);
						that.modif_onChangeRegion();
						selectRegiones.setSelectedKey(selecR);
						//VIAS DE PAGO
						if (grpcta === 'PEXT') {
							var selectViasPago = this.getView().byId("selectViasPagoM");
							var filtro1 = "B";
							var filtro2 = "K";
							
							var oFilter1 = new sap.ui.model.Filter("ZWELS",sap.ui.model.FilterOperator.Contains,filtro1);
							var oFilter2 = new sap.ui.model.Filter("ZWELS",sap.ui.model.FilterOperator.Contains,filtro2);
							selectViasPago.getBinding("items").filter([ oFilter1, oFilter2 ]);
						}else{
							var selectViasPago = this.getView().byId("selectViasPagoM");
							var filtro1 = "C";
							var filtro2 = "D";
							var filtro3 = "V";
							var oFilter1 = new sap.ui.model.Filter("ZWELS",sap.ui.model.FilterOperator.Contains,filtro1);
							var oFilter2 = new sap.ui.model.Filter("ZWELS",sap.ui.model.FilterOperator.Contains,filtro2);
							var oFilter3 = new sap.ui.model.Filter("ZWELS",sap.ui.model.FilterOperator.Contains,filtro3);
							selectViasPago.getBinding("items").filter([ oFilter1, oFilter2, oFilter3 ]);
						}
						
					} else {
						MessageToast.show(result.MESSAGE);
						oView.byId("objPageScGM").setVisible(false);
						oView.byId("objPageScSM").setVisible(false);
						oView.byId("objPageScCM").setVisible(false);
						// oView.byId("objPageScAM").setVisible(false);
						oView.byId("objPageScOM").setVisible(false);
						oView.byId("btnValidarM").setVisible(false);
						oView.byId("btnGuardarM").setVisible(false);
						oView.byId("btnGuardarM").setEnabled(false);
						oView.byId("gsgM").setVisible(false);
						oView.byId("selectAprobadoresM").setVisible(false);
					}
				},function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
				}
			);
		},
		modif_onChangePais : function(oEvent) {
			this.getView().byId("btnGuardarM")	.setEnabled(false);
			var selectRegiones = this.getView()	.byId("selectRegionM");
			var seleccPais = this.getView()	.byId("selectPaisM").getSelectedKey();
			// var oSorter = new
			// sap.ui.model.Sorter("REGIO",
			// true); // descend
			// selectRegiones.getBinding("items").sort(oSorter);
			var oFilter = new sap.ui.model.Filter("LAND1",sap.ui.model.FilterOperator.Contains,seleccPais);
			selectRegiones.getBinding("items")	.filter([ oFilter ]);
			if (seleccPais == "CL")
				selectRegiones	.setSelectedKey("13");
			else
				selectRegiones	.setSelectedIndex(0);
			console.log(seleccPais);
			this.modif_onChangeRegion();
		},
		modif_onChangePaisBank : function(oEvent) {
			this.getView().byId("btnGuardarM").setEnabled(false);
			var selectClaBank = this.getView().byId("selectClaBankM");
			var seleccPais = this.getView().byId("selectPaiBankM").getSelectedKey();
			var oFilter = new sap.ui.model.Filter("BANKS",sap.ui.model.FilterOperator.Contains,seleccPais);
			selectClaBank.getBinding("items").filter([ oFilter ]);
			console.log(seleccPais);
		},
		modif_onChangeRegion : function(oEvent) {
			this.getView().byId("btnGuardarM").setEnabled(false);
			var selectComunas = this.getView().byId("selectComunasM");
			var seleccPais = this.getView().byId("selectPaisM").getSelectedKey();
			var seleccRegion = this.getView().byId("selectRegionM").getSelectedKey();
			var oFilter1 = new sap.ui.model.Filter("LAND1",sap.ui.model.FilterOperator.Contains,seleccPais);
			var oFilter2 = new sap.ui.model.Filter("REGIO",sap.ui.model.FilterOperator.Contains,seleccRegion);
			selectComunas.getBinding("items").filter([oFilter1,oFilter2 ]);
			console.log(seleccPais + seleccRegion);
		},
		modif_disableSave : function(e) {
			this.getView().byId("btnGuardarM").setEnabled(false);
			this.getView().byId("btnValidarM").setEnabled(true);
			var selectGC = this.getView().byId("selectGrpCta").getSelectedKey();
			var sk = e.getSource().getSelectedKey();
			if(selectGC === 'PEXT'){
				var l = !(sk === '0007' || sk === '0008');
				this.byId("sex").setVisible(l);
				this.byId("lbllna").setVisible(l);
				this.byId("lna").setVisible(l);
				this.byId("lblpro").setVisible(l);
				this.byId("pro").setVisible(l);
				this.byId("lblfna").setText( l ? '(*)Fecha Nacimiento':'(*)Fecha Creación' );
				
			}else{
				this.byId("sex").setVisible(true);
				this.byId("lbllna").setVisible(true);
				this.byId("lna").setVisible(true);
				this.byId("lblpro").setVisible(true);
				this.byId("pro").setVisible(true);
				this.byId("lblfna").setText('(*)Fecha Nacimiento');
			}
		},
		modif_reset : function() {
			this.getView().byId("objPageScGM").setVisible(false);
			this.getView().byId("objPageScSM").setVisible(false);
			this.getView().byId("objPageScCM").setVisible(false);
			// this.getView().byId("objPageScAM").setVisible(false);
			this.getView().byId("objPageScOM").setVisible(false);
			this.getView().byId("btnValidarM").setVisible(false);
			this.getView().byId("btnGuardarM").setVisible(false);
			this.getView().byId("btnGuardarM").setEnabled(false);
			this.getView().byId("gsgM").setVisible(false);
			this.getView().byId("selectAprobadoresM").setVisible(false);
			this.getView().byId("idAcrM").setValue("");
			// this.getView().byId("UploadCollectionM").removeAllItems();
		},
		modif_onValida : function() {
			var ok = true;
			var oView = this.getView();
			var socs = [];
			var pext = (oView.byId("inpKtokkM").getValue() === 'PEXT') ? true: false;
			var palt = (oView.byId("inpKtokkM").getValue() === 'PALT') ? true: false;
			this.getView().byId("name1M").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("concepM").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("direcM").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("stcd1M").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("email1M").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("email2M").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("fnaM").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("lnaM").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("proM").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("sexM").setValueState(sap.ui.core.ValueState.None);
			var orgcmp = [];
			orgcmp = this.getView().byId("selectGrpCompM").getSelectedKeys();
			var grpcta = this.getView().byId("")
			// socs =
			// oView.byId("selectSociedades").getSelectedKeys();
			var gcom = [];
			// gcom =
			// oView.byId("selectGrpComp").getSelectedKeys();
			var vpg = [];
			vpg = oView.byId("selectViasPagoM").getSelectedKeys();
			// Rut
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
					for (; T; T = Math.floor(T / 10)) S = (S + T % 10 * (9 - M++ % 6)) % 11;
						return S ? S - 1 : 'k';
					}
			}
			// Emails
			var email1 = this.getView().byId("email1M").getValue();
			var email2 = this.getView().byId("email2M").getValue();
			var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			// if(oView.byId("selectGrpCta").getSelectedIndex()==-1){
			// ok=false;
			// MessageToast.show("Indique Grupo
			// de Cuentas");
			//			
			// }else
			if (oView.byId("selectTratM").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Indique tratamiento.");
			} else if (oView.byId("name1M").getValue().trim() == '') {
				ok = false;
				MessageToast.show("Nombre obligatorio.");
				this.getView().byId("name1M").setValueState(sap.ui.core.ValueState.Error);
			} else if (oView.byId("concepM").getValue().trim() == '') {
				ok = false;
				MessageToast.show("Concepto obligatorio.");
				this.getView().byId("concepM").setValueState(sap.ui.core.ValueState.Error);
			} else if (oView.byId("direcM").getValue().trim() == '') {
				ok = false;
				MessageToast.show("Indique Dirección/Calle.");
				this.getView().byId("direcM").setValueState(sap.ui.core.ValueState.Error);
			} else if (oView.byId("selectPaisM").getSelectedKey() === "CL" 
				&& oView.byId("selectRegionM").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Indique región.");
			} else if (oView.byId("selectPaisM").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Indique país.");
			} else if (oView.byId("stcd1M").getValue().trim() == '') {
				ok = false;
				MessageToast.show("Indique N° Id.fiscal.");
				this.getView().byId("stcd1M").setValueState(sap.ui.core.ValueState.Error);
			} else if (!pext && (!Fn.validaRut(oView.byId("stcd1M").getValue()))) {
				MessageToast.show('Id.fiscal inválido');
				ok = false;
				this.getView().byId("stcd1M").setValueState(sap.ui.core.ValueState.Error);
//				} else if (pext
//				&& oView.byId("fnaM")
//				.getValue().trim() == '') {
//				ok = false;
//				MessageToast
//				.show("Indique Fecha Nacimiento.");
//				this
//				.getView()
//				.byId("fnaM")
//				.setValueState(
//				sap.ui.core.ValueState.Error);
//				} else if (pext
//				&& oView.byId("lnaM")
//				.getValue().trim() == '') {
//				ok = false;
//				MessageToast
//				.show("Indique lugar de nacimiento.");
//				this
//				.getView()
//				.byId("lnaM")
//				.setValueState(
//				sap.ui.core.ValueState.Error);
//				} else if (pext
//				&& oView.byId("proM")
//				.getValue().trim() == '') {
//				ok = false;
//				MessageToast
//				.show("Indique profesión.");
//				this
//				.getView()
//				.byId("proM")
//				.setValueState(
//				sap.ui.core.ValueState.Error);
//				} else if (pext
//				&& !oView.byId("RB1-1M")
//				.getSelected()
//				&& !oView.byId("RB1-2M")
//				.getSelected()) {
//				ok = false;
//				MessageToast
//				.show("Indique sexo.");
//				this
//				.getView()
//				.byId("sexM")
//				.setValueState(
//				sap.ui.core.ValueState.Error);
				// }else if(pext &
				// !this.modif_validaSwift()){
				// MessageToast.show("Código
				// Swift erróneo.");
			} else if (oView.byId("selectPaiBankM").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Indique Dato Banco País.");
			} else if (oView.byId("selectClaBankM").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Indique Banco-Swift.");
			} else if (oView.byId("ctaM").getValue().trim() == '') {
				ok = false;
				MessageToast.show("Indique Cuenta Bancaria.");
			} else if ((orgcmp.length > 0 || oView.byId("txtEkorgM").getText() != '') 
					&& oView.byId("selectMonedaM").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Indique moneda.");
			} else if (!palt&&vpg.length == 0) {
				ok = false;
				MessageToast.show("Indique Vías de pago (al menos una).");
				// CONDICION DE PAGO
			} else if ((orgcmp.length > 0 || oView.byId("txtEkorgM").getText() != '') 
					&& oView.byId("selectCondPagoCM").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Indique condición de pago.");
			}
			if (email1 != null && email1 != '') {
				if (!mailregex.test(email1)) {
					MessageToast.show(email1 + " no es un e-mail válido.");
					this.getView().byId("email1M").setValueState(sap.ui.core.ValueState.Error);
					ok = false;
				}
			}
			if (email2 != null && email2 != '') {
				if (!mailregex.test(email2)) {
					MessageToast.show(email2 + " no es un e-mail válido.");
					this.getView().byId("email2M").setValueState(sap.ui.core.ValueState.Error);
					ok = false;
				}
			}
			if (ok)
				oView.byId("btnGuardarM").setEnabled(true);
			else
				oView.byId("btnGuardarM").setEnabled(false);
		},
		ampliar_showAmpliar : function() {
//			this.getView().byId("btnGuardaACT").setEnabled(false);
//			this.getView().byId("btnGuardaACP").setEnabled(false);
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
					console.log(data.KTOKK);
					if (data.STATUS === 'S') {
						oView.byId("formCompraBCP").setVisible(true);
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(result);
					oView.setModel(oModel,"dataModel");
					// oView.byId("inpGrpCompBCP").setValue(data.EKORG_MULTI);
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
//						oView.byId("chk1BCT").setSelected(false);
					} else {
						oView.byId("chk1BCP").setSelected(true);
//						oView.byId("chk1BCT").setSelected(true);
					}
					if (loevm_compras === '')
						oView.byId("chk2BCP").setSelected(false);
					else
						oView.byId("chk2BCP").setSelected(true);

//					if (sperm === '')
//					oView.byId("chk3BCP").setSelected(false);
//					else
//					oView.byId("chk3BCP").setSelected(true);

//					if (loevm_contabl === '')
//					oView.byId("chk2BCT").setSelected(false);
//					else
//					oView.byId("chk2BCT").setSelected(true);

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
					oView.byId(	"selectAprobadoresBCT").setVisible(true);
					oView.byId(	"selectGrpCompBCP").setVisible(true);
					oView.byId(	"selectSociedadesBCT").setVisible(true);
					oView.byId(	"chk1BCP").setVisible(true);
					oView.byId("chk2BCP").setVisible(true);
//					oView.byId("chk3BCP").setVisible(true);
//					oView.byId("chk1BCT").setVisible(true);
//					oView.byId("chk2BCT").setVisible(true);
//					oView.byId("chk3BCT").setVisible(true);
					oView.byId("chk4BCT").setVisible(true);
					oView.byId("lblb1")	.setVisible(true);
//					oView.byId(	"lblb2").setVisible(true);
//					oView.byId("lblb3").setVisible(true);
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
			this.modif_disableSave();
		},
		onSearchBorrCT : function() {
			// this.reset();
			var url = serviceUrl;
			var oView = this.getView();
			this.onResetBorr();
			// oView.byId("formCompraBCP").setVisible(false);
			// oView.byId("btnGuardaBCT").setEnabled(false);
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
						console.log(data.KTOKK);
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
//							if (sperm === '')
//								oView.byId("chk3BCP").setSelected(false);
//							else
//								oView.byId("chk3BCP").setSelected(true);
//							if (loevm_contabl === '')
//								oView.byId("chk2BCT").setSelected(false);
//							else
//								oView.byId("chk2BCT").setSelected(true);
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
								oView.byId("selectAprobadoresBCT").setVisible(true);
								oView.byId("selectGrpCompBCP").setVisible(true);
								oView.byId("selectSociedadesBCT").setVisible(true);
								oView.byId("chk1BCP").setVisible(true);
								oView.byId("chk2BCP").setVisible(true);
//								oView.byId("chk3BCP").setVisible(true);
//								oView.byId("chk1BCT").setVisible(true);
//								oView.byId("chk2BCT").setVisible(true);
								oView.byId("chk3BCT").setVisible(true);
								oView.byId("chk4BCT").setVisible(true);
								oView.byId("lblb1").setVisible(true);
//								oView.byId("lblb2").setVisible(true);
//								oView.byId("lblb3").setVisible(true);
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
			var bukrs = oView.byId("selectSociedadesBCT").getSelectedKey();// sociedades
			var aprob = this.getView().byId("selectAprobadoresBCT").getSelectedKey();
			// campos especiales para borrado
			var ktokk = oView.byId("ktokk").getText();
			var areas = "";
			var compr = "";
			var datgr = "";
			var sosel = "";
//			if (oView.byId("chk1BCT").getSelected())
//				areas = "X";
//			if (oView.byId("chk2BCT").getSelected())
//				compr = "X";
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
					"LOEVM_CONTABLE" : compr,
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
						// that.reset();
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
		borr_onSaveCP : function() {
			var that = this;
			var url = serviceUrl;
			var oView = this.getView();
			oView.setBusy(true);
			var oModel = new sap.ui.model.odata.ODataModel(	url, true);
			var oEntry = new sap.ui.model.json.JSONModel();
			var lifnr = oView.byId("lifnrBCP").getValue();
			var name1 = oView.byId("name1BCP").getValue();// nombre acreedor
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
					"SPERM" : datgr,
					"APROBADOR" : aprob
			};
			oModel.create("/CrearSolicitudSet",
				oEntry,null,
				function(data) {
					oView.setBusy(false);
					if (data.STATUS === 'S') {
						MessageToast.show(data.MESSAGE);
						oView.byId("btnGuardaBCP").setEnabled(false);
						// that.reset();
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
			console.log("getListado");
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
							icon = "/FioriSCP.z_figestionacreedores/img/InProcess@2.png";
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
		misol_getListado2 : function() {
			console.log("getListado2");
			this.getView().byId("idSolicTable2").setVisible(true);
			this.getView().byId("ObjectPageLayout2").setVisible(false);
			var url = serviceUrl;
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			var tabla = this.getView().byId("idSolicTable2");
			var oView = this.getView();
			oModel.read("/MisSolicitudesSet",
				null,[ "" ],false,
				function(data,response) {
					oView.setBusy(false);
					var oModelProceso = new sap.ui.model.json.JSONModel();
					console.log(data.results[0].ID_PROCESO);
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
							icon = "/FioriSCP.z_figestionacreedores/img/InProcess@2.png";
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
				}
			);
		},
		adm_getListado : function() {
			console.log("getListado");
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
						var icon = "/FioriSCP.z_figestionacreedores/img/Created.png";
						var iconCm = "/FioriSCP.z_figestionacreedores/img/Created.png";
						var iconCn = "/FioriSCP.z_figestionacreedores/img/Created.png";
						var iconFi = "/FioriSCP.z_figestionacreedores/img/Created.png";
						var iconGe = "/FioriSCP.z_figestionacreedores/img/Created.png";
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
							icon = "/FioriSCP.z_figestionacreedores/img/InProcess@2.png";
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
							iconCm = "/FioriSCP.z_figestionacreedores/img/InProcess@2.png";
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
							iconCn = "/FioriSCP.z_figestionacreedores/img/InProcess@2.png";
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
							iconFi = "/FioriSCP.z_figestionacreedores/img/InProcess@2.png";
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
							iconGe = "/FioriSCP.z_figestionacreedores/img/InProcess@2.png";
						} else if (resultados.SEMAFORO_GERENCIA === '3') {
							estadoGe = "Success";
							iconGe = "/FioriSCP.z_figestionacreedores/img/Aproved.png";
						} else if (resultados.SEMAFORO_GERENCIA === '4') {
							estadoGe = "Error";
							iconGe = "/FioriSCP.z_figestionacreedores/img/Reject.png";
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
								"USUARIO_APROB_COMPRAS" : resultados[i].USUARIO_APROB_COMPRAS,
								"USUARIO_APROB_CONTABLE" : resultados[i].USUARIO_APROB_CONTABLE,
								"USUARIO_APROB_FINANZAS" : resultados[i].USUARIO_APROB_FINANZAS,
								"USUARIO_APROB_GERENCIA" : resultados[i].USUARIO_APROB_GERENCIA,
								"ICON_CONTABLE" : iconCn,
								"ICON_FINANZAS" : iconFi,
								"ICON_COMPRAS" : iconCm,
								"ICON_GERENCIA" : iconGe

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
		onPress : function(oEvent) {
			var url = serviceUrl;
			var oContext = oEvent.getSource().getBindingContext();
			console.log(oContext.getObject());
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
			oModel.read(
				"/DetalleSolicitudSet(TIPO_PROCESO='"
				+ tipo + "',ID_SOLICITUD='" + id + "')",
				null,[ "" ],false,
				function(data,response) {
					oView.setBusy(false);
					var oModelProceso = new sap.ui.model.json.JSONModel();
					console.log(data.results);
					var resultados = data;
					var grpcta = resultados.KTOKK;
					var idgrp = grpcta.substring(0,4);
					if (idgrp === 'HONO') {oView.byId("lblselectIndRetMS").setVisible(true);
						oView.byId("selectIndRetMS").setVisible(true);
					// }else if(grpcta==='Proveedores Extranjeros'){
						// oView.byId("swiftMS").setVisible(true);
					} else {
						oView.byId("lblselectIndRetMS").setVisible(false);
						oView.byId("selectIndRetMS").setVisible(false);
					}
					if (idgrp === 'PALT') {
						oView.byId("lblctaasocms").setVisible(false);
						oView.byId("txactaasocms").setVisible(false);

					} else {
						oView.byId("lblctaasocms").setVisible(true);
						oView.byId("txactaasocms").setVisible(true);
					}
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(resultados);
					oView.setModel(oModel,"dataModel");
					var estado = "None";
					var icon = "/FioriSCP.z_figestionacreedores/img/Created.png";
					var tipo = "";
					if (resultados.TIPO_PROCESO === 'C') {
						tipo = "Creación";
						oView.byId("ObjectPageLayout").setVisible(true);
					} else if (resultados.TIPO_PROCESO === 'U') {
						tipo = "Modificación";
						oView.byId("ObjectPageLayout").setVisible(true);
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
						icon = "/FioriSCP.z_figestionacreedores/img/InProcess@2.png";
					} else if (resultados.SEMAFORO === '3') {
						estado = "Success";
						icon = "/FioriSCP.z_figestionacreedores/img/Aproved.png";
					} else if (resultados.SEMAFORO === '4') {
						estado = "Error";
						icon = "/FioriSCP.z_figestionacreedores/img/Reject.png";
					}
					var loevm = resultados.LOEVM;
					var loevm_compras = resultados.LOEVM_COMPRAS;
					var sperm = resultados.SPERM;
					var loevm_contable = resultados.LOEVM_CONTABLE;
					var nodel = resultados.NODEL;
					var nodel_contable = resultados.NODEL_CONTABLE;
					if (loevm === '') {
						oView.byId("chk1MSBC").setSelected(false);
						oView.byId("chk1MSBCT").setSelected(false);
					} else {
						oView.byId("chk1MSBC").setSelected(true);
						oView.byId("chk1MSBCT").setSelected(true);
					}
					if (loevm_compras === '') {
						oView.byId("chk2MSBC").setSelected(false);
					} else {
						oView.byId("chk2MSBC").setSelected(true);
					}
					if (sperm === '') {
						oView.byId("chk3MSBC").setSelected(false);
					} else {
						oView.byId("chk3MSBC").setSelected(true);
					}
					if (loevm_contable === '') {
						oView.byId("chk2MSBCT").setSelected(false);
					} else {
						oView.byId("chk2MSBCT").setSelected(true);
					}
					if (nodel === '') {
						oView.byId("chk3MSBCT").setSelected(false);
					} else {
						oView.byId("chk3MSBCT").setSelected(true);
					}
					if (nodel_contable === '') {
						oView.byId("chk4MSBCT").setSelected(false);
					} else {
						oView.byId("chk4MSBCT").setSelected(true);
					}
					oView.byId("tit").setObjectTitle("Solicitud " + tipo + ": " + id);
					oView.byId("titbcpms").setObjectTitle("Solicitud: " + id);
					oView.byId("titbctms").setObjectTitle("Solicitud: " + id);
					oView.byId("titactms").setObjectTitle("Solicitud: " + id);
					oView.byId("titacpms").setObjectTitle("Solicitud: " + id);
				},function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt,sap.m.MessageBox.Icon.ERROR,"Error en la llamada al servicio");
				}
			);
		},
		onPress2 : function(oEvent) {
			var url = serviceUrl;
			var oContext = oEvent.getSource().getBindingContext();
			console.log(oContext.getObject());
			var id = oContext.getProperty("ID_PROCESO");
			var tipo = oContext.getProperty("TIPO_PROCESO_ID");
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			var oView = this.getView();
			this.oObjectPageLayout = this.getView().byId("ObjectPageLayout2");
			this.oTargetSubSection = this.getView().byId("dgms2");
			this.oObjectPageLayout.addEventDelegate({
				onAfterRendering : function() {
					// need to wait for
					// the
					// scrollEnablement
					// to be active
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
					console.log(data.results);
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
						icon = "/FioriSCP.z_figestionacreedores/img/InProcess@2.png";
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
		onPressADM : function(oEvent) {
			var url = serviceUrl;
			var oContext = oEvent.getSource().getBindingContext();
			console.log(oContext.getObject());
			var id = oContext.getProperty("ID_PROCESO");
			var tipo = oContext.getProperty("TIPO_PROCESO_ID");
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			var oView = this.getView();
			// oView.byId("titADM").setObjectTitle("Solicitud:
			// "+id);
			oView.byId("ObjectPageLayoutADM").setVisible(false);
			oView.byId("contabKeyBADM").setVisible(false);
			oView.byId("comprasKeyBADM").setVisible(false);
			oView.byId("contabKeyAADM").setVisible(false);
			oView.byId("comprasKeyAADM").setVisible(false);
			oView.byId("swiftADM").setVisible(false);
			oModel.read("/DetalleSolicitudSet(TIPO_PROCESO='"
				+ tipo + "',ID_SOLICITUD='" + id + "')",
				null,[ "" ],false,
				function(data,response) {
					oView.setBusy(false);
					var oModelProceso = new sap.ui.model.json.JSONModel();
					console.log(data.results);
					var resultados = data;
					var grpcta = resultados.KTOKK;
					var idgrp = grpcta.substring(0,4);
					if (idgrp === 'HONO') {
						oView.byId("lblselectIndRetADM").setVisible(true);
						oView.byId("selectIndRetADM").setVisible(true);
						// }else
						// if(grpcta==='Proveedores
						// Extranjeros'){
						// oView.byId("swiftADM").setVisible(true);

					} else {
						oView.byId("lblselectIndRetADM").setVisible(false);
						oView.byId("selectIndRetADM").setVisible(false);
					}
					if (idgrp === 'PALT') {
						oView.byId("lblctaasocadm").setVisible(false);
						oView.byId("txactaasocadm").setVisible(false);


					} else {
						oView.byId("lblctaasocadm").setVisible(	true);
						oView.byId(	"txactaasocadm").setVisible(true);
					}
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(resultados);
					oView.setModel(oModel,"dataModel");
					var estado = "None";
					var icon = "/FioriSCP.z_figestionacreedores/img/Created.png";
					var tipo = "";
					if (resultados.TIPO_PROCESO === 'C') {
						tipo = "Creación";
						oView.byId("ObjectPageLayoutADM").setVisible(true);
					} else if (resultados.TIPO_PROCESO === 'U') {
						tipo = "Modificación";
						oView.byId("ObjectPageLayoutADM").setVisible(true);
					} else if (resultados.TIPO_PROCESO === 'E') {
						tipo = "Ampliación";
						if (resultados.TIPO_VISTA === 'CT')
							oView.byId("contabKeyAADM").setVisible(true);
						else
							oView.byId("comprasKeyAADM").setVisible(true);
					} else if (resultados.TIPO_PROCESO === 'D') {
						tipo = "Bloqueo/Desbloqueo";
						if (resultados.TIPO_VISTA === 'CP')
							oView.byId("comprasKeyBADM").setVisible(true);
						else
							oView.byId("contabKeyBADM").setVisible(true);
					}
					if (resultados.SEMAFORO === '1') {
						estado = "None";
					} else if (resultados.SEMAFORO === '2') {
						estado = "Warning";
						icon = "/FioriSCP.z_figestionacreedores/img/InProcess@2.png";
					} else if (resultados.SEMAFORO === '3') {
						estado = "Success";
						icon = "/FioriSCP.z_figestionacreedores/img/Aproved.png";
					} else if (resultados.SEMAFORO === '4') {
						estado = "Error";
						icon = "/FioriSCP.z_figestionacreedores/img/Reject.png";
					}
					var loevm = resultados.LOEVM;
					var loevm_compras = resultados.LOEVM_COMPRAS;
					var sperm = resultados.SPERM;
					var loevm_contable = resultados.LOEVM_CONTABLE;
					var nodel = resultados.NODEL;
					var nodel_contable = resultados.NODEL_CONTABLE;
					if (loevm === '') {
						oView.byId("chk1BCPADM").setSelected(false);
						oView.byId("chk1BCTADM").setSelected(false);
					} else {
						oView.byId("chk1BCPADM").setSelected(true);
						oView.byId("chk1BCTADM").setSelected(true);
					}
					if (loevm_compras === '') {
						oView.byId("chk2BCPADM").setSelected(false);
					} else {
						oView.byId("chk2BCPADM").setSelected(true);
					}
					if (sperm === '') {
						oView.byId("chk3BCPADM").setSelected(false);
					} else {
						oView.byId("chk3BCPADM").setSelected(true);
					}
					if (loevm_contable === '') {
						oView.byId("chk2BCTADM").setSelected(false);
					} else {
						oView.byId("chk2BCTADM").setSelected(true);
					}
					if (nodel === '') {
						oView.byId("chk3BCTADM").setSelected(false);
					} else {
						oView.byId("chk3BCTADM").setSelected(true);
					}
					if (nodel_contable === '') {
						oView.byId("chk4BCTADM").setSelected(false);
					} else {
						oView.byId("chk4BCTADM").setSelected(true);
					}
					oView.byId("idSolicTableADM").setVisible(false);
					oView.byId("titADM").setObjectTitle("Solicitud " + tipo + ": " + id);
					oView.byId("titbcpadm").setObjectTitle("Solicitud: " + id);
					oView.byId("titbctadm").setObjectTitle("Solicitud: " + id);
					oView.byId("titactadm").setObjectTitle("Solicitud: " + id);
					oView.byId("titacpadm").setObjectTitle("Solicitud: " + id);
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
			var ok = true;
			var oView = this.getView();
			oView.byId("btnGuardaACP").setEnabled(false);
			var socopia = [];
			socopia = oView.byId("selectGrpCompCopiaACP").getSelectedKeys();
			if (oView.byId("selectAprobadoresACP").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Indique Gerente/Subgerente Aprobador.");
			} else if (oView.byId("selectGrpCompACP").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Selecione Grupo Modelo.");
			} else if (socopia.length == 0) {
				ok = false;
				MessageToast.show("Seleccione Organización(es) Ampliar.");
			}
			if (ok)
				oView.byId("btnGuardaACP").setEnabled(true);
			else
				oView.byId("btnGuardaACP").setEnabled(false);
		},
		amp_validaCT : function() {
			var ok = true;
			var oView = this.getView();
			oView.byId("btnGuardaACT").setEnabled(false);
			var socopia = [];
			socopia = oView.byId("selectSociedadesCopiaACT").getSelectedKeys();
			if (oView.byId("selectAprobadoresACT").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Indique Gerente/Subgerente Aprobador.");
			} else if (oView.byId("selectSociedadesACT").getSelectedIndex() == -1) {
				ok = false;
				MessageToast.show("Selecione Sociedad Modelo.");
			} else if (socopia.length == 0) {
				ok = false;
				MessageToast.show("Seleccione Sociedad(es) Ampliar.");
			}
			if (ok)
				oView.byId("btnGuardaACT").setEnabled(true);
			else
				oView.byId("btnGuardaACT").setEnabled(false);
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
			// oView.setBusy(true);
			var oModel = new sap.ui.model.odata.ODataModel(
				url, true);
			var oEntry = new sap.ui.model.json.JSONModel();
			// var lifnr = oView.byId("lifnr").getValue();
			var elModelo = this.getView().getModel("dataModel");
			console.log(elModelo.oData.WAERS);
			var lifnr = this.getView().byId("idAcrACP").getValue();
			var kunnr = elModelo.oData.KUNNR;
			var emnfr = elModelo.oData.EMNFR;
			var stcd1 = elModelo.oData.STCD1;
			var zterm = elModelo.oData.ZTERM;
			var waers = elModelo.oData.WAERS;
			var ktokk = elModelo.oData.KTOKK;
			var name1 = elModelo.oData.NAME1;
			var ekorg = this.getView().byId("selectGrpCompACP").getSelectedKey();
			var ekorgs = [];
			ekorgs = oView.byId("selectGrpCompCopiaACP").getSelectedKeys();// org  compras
			var ekorg_multi = ekorgs.join('-');
			var aprob = this.getView().byId("selectAprobadoresACP").getSelectedKey();
			// var bukrs = [];
			// bukrs =
			// oView.byId("selectSociedadesCopiaACP").getSelectedKeys();//sociedades
			// var bukrs_single=bukrs.join('-');
			// var bukrs_multi=bukrs.join('-');
			// if(bukrs.lenght==1){
			// bukrs_multi='';
			// }else{
			// bukrs_single='';
			// }
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
					"APROBADOR" : aprob
			};
			oModel.create("/CrearSolicitudSet",
				oEntry,null,
				function(data) {
					oView.setBusy(false);
					if (data.STATUS === 'S') {
						MessageToast.show(data.MESSAGE);
						oView.byId(	"btnGuardaACP").setEnabled(	false);
						oView.byId("idAcrACP").setValue("");
						oView.byId("formCompraA").setVisible(false);
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
			// oView.setBusy(true);
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			var oEntry = new sap.ui.model.json.JSONModel();
			// var lifnr = oView.byId("lifnr").getValue();
			var elModelo = this.getView().getModel("dataModel");
			console.log(elModelo.oData.WAERS);
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
			var aprob = oView.byId("selectAprobadoresACT").getSelectedKey();
			var bukrs = oView.byId("selectSociedadesACT").getSelectedKey();
			var bukrss = [];
			bukrss = oView.byId("selectSociedadesCopiaACT").getSelectedKeys();// sociedades
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
					"APROBADOR" : aprob
			};
			oModel.create(
				"/CrearSolicitudSet",
				oEntry,null,
				function(data) {
					oView.setBusy(false);
					if (data.STATUS === 'S') {
						MessageToast.show(data.MESSAGE);
						oView.byId("btnGuardaACT").setEnabled(false);
						oView.byId("formContabilidadA").setVisible(false);
						// that.reset();
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
			// Uso de la función
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
			// Header Token
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter(
				{
					name : "x-csrf-token",
					value : ""
				});
			// oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
			// MessageToast.show("Event change
			// triggered");
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
			// Header Slug
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter(
				{
					name : "slug",
					value : oEvent.getParameter("fileName")
				});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			setTimeout(function() {
				// MessageToast.show("Event
				// beforeUploadStarts
				// triggered");
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
			// delay the success
			// message in order to
			// see other messages
			// before
			// MessageToast.show("Event
			// uploadComplete
			// triggered");
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
						// tabla.removeSelections(true);
					}
				}),
				afterClose : function() {
					dialog.destroy();
				}
			});
			dialog.open();
		},
		/**
		 * Similar to onAfterRendering, but this
		 * hook is invoked before the controller's
		 * View is re-rendered (NOT before the first
		 * rendering! onInit() is used for that
		 * one!).
		 * 
		 * @memberOf romrecepcont.reporte
		 */
		// onBeforeRendering: function() {
		//		
		// },
		/**
		 * Called when the View has been rendered
		 * (so its HTML is part of the document).
		 * Post-rendering manipulations of the HTML
		 * could be done here. This hook is the same
		 * one that SAPUI5 controls get after being
		 * rendered.
		 * 
		 * @memberOf romrecepcont.reporte
		 */
		// onAfterRendering: function() {
		//
		// },
		/**
		 * Called when the Controller is destroyed.
		 * Use this one to free resources and
		 * finalize activities.
		 * 
		 * @memberOf romrecepcont.reporte
		 */
		// onExit: function() {
		//
		// }
	});
});