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

	return BaseController.extend("z_mmfichatecnic.controller.listado", {
		onInit : function() {	
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("listado").attachMatched(this._onRouteFound, this);
		},
		_onRouteFound: function(oEvent){
			this.getInitInfo();
			this.getListP();
		},
		onNavBack:function(oEvent){
			this.getRouter().navTo("menu");
		},
		onPress:function(oEvent){
			this.getModel('CONF').setProperty('/MODE','PEN');
			var oContext = oEvent.getSource().getBindingContext('PENDLIST');
			var id = oContext.getProperty("MATNR");
			this.getRouter().navTo("ficha",{id:id});
		},
		onConsultarPress: function(){
			var aList = this.byId('ItemsSP');
			var filters = [];
			var query = this.byId('cod').getValue();
			if (query && query.length > 0) {
				var nameFilter = new sap.ui.model.Filter("MATNR", sap.ui.model.FilterOperator.Contains, query);

				filters.push(nameFilter);
			}

			var binding = aList.getBinding("items");
			binding.filter(filters);
		},
		getListP: function(){
			var url = serviceUrl;
			var oView = this.getView();
			var pag = this.byId('pag');
			pag.setBusy(true);
			var oModel = new sap.ui.model.odata.ODataModel(url,true);
			oModel.read("/ListadoPendienteSet", 
					null, ["" ], true,
					function(data, response) {
				pag.setBusy(false);

				//MODIFY DATA
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
						d.ICON = "sap-icon://cancel";
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
				oView.setModel(oJsonModel,"PENDLIST");
			}, function(err) {
				pag.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");

			});	
		}
	});
});