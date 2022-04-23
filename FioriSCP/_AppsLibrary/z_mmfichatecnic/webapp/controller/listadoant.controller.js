sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/ui/model/Filter",
	"z_mmfichatecnic/view/utils/connectivity",
	"z_mmfichatecnic/js/util"
	], function(BaseController, JSONModel, MessageToast, MessageBox, Dialog, Button, Filter) {
	"use strict";

	return BaseController.extend("z_mmfichatecnic.controller.listadoant", {
		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("listadoant").attachMatched(this._onRouteFound, this);
		},
		_onRouteFound: function(oEvent){
			this.getInitInfo();
			this.getListH();
		},
		onNavBack:function(oEvent){
			this.getRouter().navTo("menu");
		},
		onPress:function(oEvent){
			this.getModel('CONF').setProperty('/MODE','HIS');
			var oContext = oEvent.getSource().getBindingContext('HISTLIST');
			var id = oContext.getProperty("MATNR");
			this.getRouter().navTo("ficha",{id:id});
		},
		getListH: function(){
			var date_range = this.byId('range-his-date');
			var dInit = date_range.getDateValue();
			var dEnd = date_range.getSecondDateValue();
			if(!dInit || !dEnd){
				dEnd = "21001231";
				dInit = "19870101";
			}else{
				dEnd = formatDate(dEnd);
				dInit = formatDate(dInit);
			}
			var oView = this.getView();
			var state = this.byId('state-his-select').getSelectedKey();
			var cod = this.byId('his-cod').getValue();
			var pag = this.byId('pag');
			pag.setBusy(true);
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl,true);
			oModel.read("/ListadoHistoricoSet?$filter=(ERSDA ge '"
					+dInit+"' and ERSDA le '"+dEnd+"' and ESTADO eq '"+state+"' and MATNR eq '"+cod+"')",
					null, ["" ], true,
					function(data, response) {
				pag.setBusy(false);
				var _data = [];

				data.results.forEach(function(d){
					switch(d.ESTADO){
					case '01':
						d.STSTEXT = "Pendiente";
						d.CUSSTATE = "SPEND";
						d.ICON = "sap-icon://document";
						break;
					case '02':
						d.STSTEXT = "En Ejecución";
						d.ICON = "sap-icon://document-text";
						d.CUSSTATE = "SEJE";
						break;
					case '03':
						d.STSTEXT = "En Revisión";
						d.ICON = "sap-icon://vds-file";
						d.CUSSTATE = "SREV";
						break;
					case '04':
						d.STSTEXT = "Anulada";
						dd.ICON = "sap-icon://cancel";
						d.CUSSTATE = "SREJ";
						break;
					case '05':
						d.STSTEXT = "Aprobada";
						d.ICON = "sap-icon://approvals";
						d.CUSSTATE = "SAPR";
						break;
					default:
						d.STSTEXT = "Sin Estado";
						d.ICON = "sap-icon://broken-link";
						d.CUSSTATE = "SNONE";
					}
					_data.push(d);
				});
				var oJsonModel = new sap.ui.model.json.JSONModel();
				oJsonModel.setData(_data);
				oJsonModel.setSizeLimit(_data.length);
				oView.setModel(oJsonModel,"HISTLIST");
			}, function(err) {
				pag.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");

			});	
		},
		onSelectPdfLanguage: function(oEvent){
			var items = [];
			if(this.getModel('CONF').getProperty('/BUKRS') === 'C001'){
				items = [
					new sap.ui.core.ListItem({key: 'C001',text: 'Concha y Toro'}),
					new sap.ui.core.ListItem({key: 'C005',text: 'Viña Maipo'}),
					new sap.ui.core.ListItem({key: 'C006',text: 'Canepa'}),
					new sap.ui.core.ListItem({key: 'C007',text: 'Palo Alto'}),
					new sap.ui.core.ListItem({key: 'C014',text: 'Maycas de Limarí'})
				];
			}else if(this.getModel('CONF').getProperty('/BUKRS') === 'C003'){
				items = [
					new sap.ui.core.ListItem({key: 'C003',text: 'Conosur'})
					]
			}else if(this.getModel('CONF').getProperty('/BUKRS') === ''){
				items = [
					new sap.ui.core.ListItem({key: 'C001',text: 'Concha y Toro'}),
					new sap.ui.core.ListItem({key: 'C003',text: 'Conosur'}),
					new sap.ui.core.ListItem({key: 'C005',text: 'Viña Maipo'}),
					new sap.ui.core.ListItem({key: 'C006',text: 'Canepa'}),
					new sap.ui.core.ListItem({key: 'C007',text: 'Palo Alto'}),
					new sap.ui.core.ListItem({key: 'C014',text: 'Maycas de Limarí'})
				];
			}else{
				MessageBox.error('El unsuario no tiene definida la propiedad -BUKRS-');
				return;
			}
			var oContext = oEvent.getSource().getBindingContext('HISTLIST');
			var id = oContext.getProperty("MATNR");
			console.log(id);
			var that = this;
			var oDialog = new Dialog({
				title: 'Seleccione el Lenguaje',
				type: 'Message',
				content: [
					new sap.m.FlexBox({
						alignContent: 'Center',
						justifyContent: 'Center',
						alignItems: 'Center',
						items: [new sap.m.Select('select-vina-pdf',{
							items:items
						}).addStyleClass('sapUiSmallMarginBottom')]
					}),
					new sap.m.HBox({
						items : [
							new Button({
								text: 'Español',
								type: 'Ghost',
								press : function(){
									var sKey = sap.ui.getCore().byId('select-vina-pdf').getSelectedKey();
									that.onDownPdfPress(id,'S',sKey);
									oDialog.close();
								}
							}).addStyleClass('sapUiSmallMarginEnd'),
							new Button({
								text: 'Ingles',
								type: 'Ghost',
								press : function(){
									var sKey = sap.ui.getCore().byId('select-vina-pdf').getSelectedKey();
									that.onDownPdfPress(id,'E',sKey);
									oDialog.close();
								}			
							}).addStyleClass('sapUiSmallMarginStart')
						],
						justifyContent: 'Center',
					})
				],
				endButton: new Button({
					text: 'Cancel',
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}
			}).addStyleClass('sapUiSizeCompact ');

			oDialog.open();
		},
		onDownPdfPress: function(id,lang,vina){
			var url = serviceUrl;
			var oModel = new sap.ui.model.odata.ODataModel(url,true);
			var that = this;
			oModel.read("/GetFileSet(MATNR='"+id+"',IDIOMA='"+lang+"',BUKRS='"+vina+"')", null, [""], true,
					function(data, response) {
				var type = data.TYPE;
				if(type !== 'application/pdf'){
					MessageBox.error('El tipo de archivo no es soportado!');
					return;
				}
				var base64EncodedPDF = data.FILE;
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
			}, function(err) {
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
			});	
		}
	});
});