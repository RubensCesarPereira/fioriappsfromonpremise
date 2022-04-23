sap.ui.define([
	"liberarPrecioExp/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"liberarPrecioExp/view/utils/connectivity"

	], function(BaseController, JSONModel, MessageToast, MessageBox, Dialog, Button, History, Filter) {
	"use strict";

	return BaseController.extend("liberarPrecioExp.controller.inicio", {
		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("inicio").attachMatched(this._onRouteFound, this);
			this.obtenerODataSrv();
			var oViewModel = new JSONModel({
				CFItems : [],
				SelItems : [],
				RecjList: [],
				key: '01',
				reason:'',
				validValue:'',
				exec: false,
				statusText:'',
				progress: 0
			});
			this.setModel(oViewModel,'Sview');
			this.getPendList();
			this.getRejec();
		},
		_onRouteFound: function(oEvent){
			this.obtenerODataSrv();
			this.getModel('appView').setProperty('/layout','OneColumn');
		},
		obtenerODataSrv: function(){
			var oView = this.getView();
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl,true);
			that.getView().byId('cl-list').setVisible(false);
			that.getView().byId('ar-list').setVisible(false);
			oModel.read("/CondPaisSet", null, ["" ], true,
					function(data, response) {
				var tipo = data.results[0].Vistas;
				if(tipo === 'C'){
					that.getView().byId('cl-list').setVisible(true);
				}else if(tipo === 'A'){
					that.getView().byId('ar-list').setVisible(true);
				}else if(tipo === 'X'){
					that.getView().byId('ar-list').setVisible(true);
					that.getView().byId('cl-list').setVisible(true);
				}else{
					sap.m.MessageBox.info('No tiene pendientes!');
				}
			}, function(err) {
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
			});
		},
		getPendList: function(){
			var that = this;
			var oView = this.getView();
			oView.setBusy(true);
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl,true);
			oModel.read("/CondPendSet", null, ["" ], true,
					function(data, response) {
				data.results.map(function(item){
					return item.selected = false;
				});
				oView.setBusy(false);
				that.getModel('DataModel').setProperty('/PList',data.results);
			}, function(err) {
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.error(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
			});
		},
		onlistItemPress: function(evt){
			var ctx = evt.getSource().getBindingContext('DataModel');
			var id = ctx.getProperty(ctx.sPath).Knumh;
			if(this.getModel('appView').getProperty('/layout') !== 'OneColumn'){
				this.getRouter().navTo('detalleCondicion',{id},true);
			}else{
				this.getModel('appView').setProperty('/layout','TwoColumnsBeginExpanded');
				this.getRouter().navTo('detalleCondicion',{id},false);
			}
			

		},
		onLiveChange: function(evt){
			var ctx = evt.getSource().getBindingContext('DataModel');
			var sQuery = evt.getSource().getValue();
			var oList = this.getView().byId("cl-list");
			var aItems = oList.getBinding("items");
			var aFilter = this.getModel('Sview').getProperty('/CFItems');
			if( !sQuery ) {
				aItems.filter(aFilter);
			} 
			else {
				var oSfilter = new sap.ui.model.Filter([
					new sap.ui.model.Filter("Landx", sap.ui.model.FilterOperator.Contains, sQuery ),
					new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sQuery ),
					new sap.ui.model.Filter("TKschl", sap.ui.model.FilterOperator.Contains, sQuery ),
					new sap.ui.model.Filter("Maktx", sap.ui.model.FilterOperator.Contains, sQuery ),
					],false);
				aFilter = aFilter.concat(oSfilter);
				aItems.filter(aFilter);
			}

		},
		onToggleSelect: function(evt){
			var oBtn = evt.getSource();
			var aItems = this.getView().byId("cl-list").getBinding("items");
			var aIndices = aItems.aIndices;
			var that = this;
			if(oBtn.getPressed()){
				oBtn.setIcon('sap-icon://multiselect-none');
				this._selectAllItems(aItems,aIndices);
//				aIndices.forEach(function(index){
//					that.getModel('DataModel').setProperty('/PList/'+index+'/selected',true);
//				});
			}else{
				oBtn.setIcon('sap-icon://multiselect-all');
				aIndices.forEach(function(index){
					that.getModel('DataModel').setProperty('/PList/'+index+'/selected',false);
				});
				that.getModel('DataModel').refresh(true);
			}	

		},
		openFilterWizard:function(){
			if(!this._Settings){
				this._Settings = new sap.ui.xmlfragment('liberarPrecioExp.view.ViewSettingsDialog',this);
				this._Settings.setModel(this.getModel('Device'));
				this._Settings.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this._Settings.setModel(this.getOwnerComponent().getModel('i18n'),'i18n');
				this._Settings.setModel(this.createFilterModel(this.getModel('DataModel').getProperty('/PList')),'FilterModel');

			}
			var oBinding=this.byId('cl-list').getBinding('items');
			var alist = this.getModel('DataModel').getProperty('/PList');
			var aIndices = oBinding.aIndices;
			var aNewList = [];
			aIndices.forEach((index) => {
				aNewList.push(alist[index]);
			});
//			console.log(oBinding.aIndices);
			this._Settings.setModel(this.createFilterModel(aNewList),'FilterModel');
			this._Settings.open();
		},
		createFilterModel: function(aList){
			var aPaises = this.groupBy(aList,'Landx');
			var aClientes = this.groupBy(aList,'Name1');
			var aProductos = this.groupBy(aList,'Maktx');
			var oFilterModel = new JSONModel({
				paises: aPaises,
				clientes: aClientes,
				productos: aProductos
			});
			return oFilterModel;
		},
		onAcceptFilterPress : function(evt){
			var sQuery = this.byId('search-field').getValue();
			var oBinding=this.byId('cl-list').getBinding('items');
			var mParams = evt.getParameters();
			var aFilters = [];
			mParams.filterItems.forEach(function(oItem) {
				var aSplit = oItem.getKey().split("___"),
				sPath = aSplit[0],
				sOperator = aSplit[1],
				sValue = aSplit[2],
				oFilter = new Filter(sPath, sOperator, sValue);
				aFilters.push(oFilter);
			});
			if( sQuery ){
				var oSFilter = new sap.ui.model.Filter([
					new sap.ui.model.Filter("Landx", sap.ui.model.FilterOperator.Contains, sQuery ),
					new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sQuery ),
					new sap.ui.model.Filter("TKschl", sap.ui.model.FilterOperator.Contains, sQuery ),
					new sap.ui.model.Filter("Maktx", sap.ui.model.FilterOperator.Contains, sQuery ),
					],false);
				aFilters.push(oSFilter);
			}
			this.getModel('Sview').setProperty('/CFItems',aFilters);
			oBinding.filter(aFilters);
			this.byId("vsdFilterBar").setVisible(mParams.filterItems.length > 0);// aFilters.length
			this.byId("vsdFilterLabel").setText(mParams.filterString);
			this._removeSelections();
		},
		groupBy: function(aList, sKey){
			var aPaises = [];
			aList.forEach(function(oItem){
				var sValue = oItem[sKey];
				if(!aPaises.find(function(element){
					return element.text === sValue;
				})){
					var elm = new Object();
					elm.text = sValue;
					aPaises.push(elm);
				}
			});
			return aPaises;
		},
		getRejec: function(){
			var that = this.getView();	
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl,true);
			oModel.read("/MotivoRechazoSet", null, ["" ], false,
					function(data, response) {
				that.getModel('Sview').setProperty('/RecjList',data.results);
			}, function(err) {
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
			});
		},
		onOpenRejectDialog: function(){
			if(this.byId('cl-list').getSelectedItems().length === 0){
				MessageBox.alert('Primero seleccione un elemento de la lista!');
				return;
			}
			if(!this._Dialog){
				this._Dialog = new sap.ui.xmlfragment('liberarPrecioExp.view.RejectDialog',this);
				this._Dialog.setModel(this.getModel('Device'));
				this._Dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this._Dialog.setModel(this.getOwnerComponent().getModel('i18n'),'i18n');
				this._Dialog.setModel(this.getModel('Sview'),'Sview');
			}
			this._Dialog.open();
			var aSelectItems = this.getModel('DataModel').getProperty('/PList').filter(function(item){
				return item.selected === true;
			});
			this.getModel('Sview').setProperty('/SelItems',aSelectItems);
		},
		onCloseDialog: function(){
			this.getModel('Sview').setProperty('/key','01');
			this.getModel('Sview').setProperty('/validValue','');
			this.getModel('Sview').setProperty('/reason','');
			this.getModel('Sview').setProperty('/SelItems',[]);
			this._Dialog.close();
		},
		onCloseDialogA: function(){
			this.getModel('Sview').setProperty('/SelItems',[]);
			this._ApproveDialog.close();
		},
		onAcceptRejectPress: function(){
			var key = this.getModel('Sview').getProperty('/key');
			var reason = this.getModel('Sview').getProperty('/reason');
			var corrValue = this.getModel('Sview').getProperty('/validValue');
			if(reason === '' && key === '06'){
				MessageBox.error('Ingrese Motivo!');
				return;
			}
			if(corrValue === '' && key !== '06'){
				MessageBox.error('Tiene que ingresar el valor correcto!');
				return;
			}
			if(key !== '06'){
				var aRejList = this.getModel('Sview').getProperty('/RecjList');
				aRejList.find(function(oMoti){
					if(oMoti.Motivo_Rechazo === key){
						reason = oMoti.DescMotivoRechazo;
					}
				});
				
			}
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl,true);
			var oList = this.byId('cl-list');
			var aSelectItems = this.getModel('Sview').getProperty('/SelItems');
			var total = aSelectItems.length;
			for(let i = 0 ; i < total ; i++){
				var oItem = aSelectItems[i];
				var oData = {
						IZzstatusExport: '03',
						IMotivoRechazo: reason,
						CondicionCorrecta:corrValue 
				};
				oModel.update("/CondAprobSet(IKnumh='"+oItem.Knumh+"')", oData, {
					method: "PUT",
					success: function(data) {
					},
					error: function(e) {
						MessageBox.error('Ha ocurrido un error al intentar rechazar un elemnto!');
					}
				});		
			};
			this.getPendList();
			this.onCloseDialog();
			this.getModel('DataModel').refresh(true);
			this.byId('cl-list').removeSelections(true);
			this.updateDetail();
		},
		onCancelReject:function(){
			this.getModel('Sview').setProperty('/exec',false);
		},
		onApprovePress:function(){
			if(!this.byId('cl-list').getSelectedItem()){
				MessageBox.alert('Primero seleccione un elemento de la lista!');
				return;
			}
			var that = this;
			var oList = this.byId('cl-list');
			var aSelectItems = this.getModel('Sview').getProperty('/SelItems');
			var total = aSelectItems.length;
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl,true);
			for(let i = 0 ; i < total ; i++){
				var oItem = aSelectItems[i];
				var oData = {
						IKnumh: oItem.Knumh,
						IZzstatusExport: '02'
				};
				oModel.update("/CondAprobSet(IKnumh='"+oItem.Knumh+"')", oData, {
					method: "PUT",
					success: function(data) {
					},
					error: function(e) {
						MessageBox.error('Ha ocurrido un error al intentar Aprobar un elemnto!');
					}
				});
			}
			this.getPendList();
			this._ApproveDialog.close();
			this.getModel('Sview').setProperty('/SelItems',[]);
			this.getModel('DataModel').refresh(true);
			this.byId('cl-list').removeSelections(true);
			this.updateDetail();
		},
		onOpenApproveDialog: function(){
			if(this.byId('cl-list').getSelectedItems().length === 0){
				MessageBox.alert('Primero seleccione un elemento de la lista!');
				return;
			}
			if(!this._ApproveDialog){
				this._ApproveDialog = new sap.ui.xmlfragment('liberarPrecioExp.view.ApproveDialog',this);
				this._ApproveDialog.setModel(this.getModel('Device'));
				this._ApproveDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this._ApproveDialog.setModel(this.getOwnerComponent().getModel('i18n'),'i18n');
				this._ApproveDialog.setModel(this.getModel('Sview'),'Sview');
			}
			this._ApproveDialog.open();
			var aSelectItems = this.getModel('DataModel').getProperty('/PList').filter(function(item){
				return item.selected === true;
			});
			this.getModel('Sview').setProperty('/SelItems',aSelectItems);
		},
		onSelectionChange: function(evt){
			var oPrm = evt.getParameters();
			var oCtx = oPrm.listItem.getBindingContext('DataModel')
			var oItem = this.getModel('DataModel').getProperty(oCtx.sPath);
			if(oItem.selected){
				this.getModel('DataModel').setProperty(oCtx.sPath+'/selected',false);
			}else{
				this.getModel('DataModel').setProperty(oCtx.sPath+'/selected',true);
			}
		},
		_selectAllItems: function(aItems,aIndices){
			var aSItems = [];
			aIndices.forEach((iIndex) => {
				this.getModel('DataModel').setProperty('/PList/'+iIndex+'/selected',true);
				aSItems.push(aItems[iIndex]);
			});
			return aSItems;
		},
		_clearAllItems: function(aItems,aIndices){
			var aSItems = [];
			aIndices.forEach((iIndex) => {
				this.getModel('DataModel').setProperty('/PList/'+iIndex+'/selected',false);
				aSItems.push(aItems[iIndex]);
			});
			return aSItems;
		},
		_removeSelections: function(){
			var aSList = [];
			this.getModel('DataModel').getProperty('/PList').forEach((oItem) => {
				oItem.selected = false;
				aSList.push(oItem);
			});
			this.getModel('DataModel').setProperty('/PList',aSList);
			this.getModel('DataModel').refresh(true);
			this.byId('selection-toggle-button').setIcon('sap-icon://multiselect-none');
			this.byId('selection-toggle-button').setPressed(false);
		},
		updateDetail: function(){
			this.getModel('DetailModel').setProperty('/','');
			this.getModel('DetailModel').refresh(true);
		},
		onInputLiveChange: function(evt){
			var value = evt.getSource().getValue();
			if(value.length > 60){
				evt.getSource().setValue(value.substr(0, 60));
			}
		}
	});
});








