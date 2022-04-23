sap.ui.define([
	"liberarPrecioExp/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
	], function(BaseController, JSONModel, MessageToast, Dialog, Button, MessageBox, History) {
	"use strict";

	return BaseController.extend("liberarPrecioExp.controller.detalleCondicion", {
		onInit : function(){	
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("detalleCondicion").attachMatched(this._onRouteFound, this);
		},
		_onRouteFound: function(oEvent){
			this.getModel('appView').setProperty('/layout','TwoColumnsBeginExpanded');
			var oArg = oEvent.getParameter("arguments");
			var oModel = this.getModel('DataModel');
			var sId = oArg.id;
			var aList = oModel.getProperty('/PList');
			var oDetail = aList.find(function(item){
				return item.Knumh === sId;
			});
//			oDetail.ZzhoraStatus = new Date(oDetail.ZzhoraStatus.ms);
			this.getView().getModel('DetailModel').setProperty('/',oDetail);
		},
		onNavBackMaster: function(){
			if(this.getModel('appView').getProperty('/layout') === 'TwoColumnsBeginExpanded'){
				this.getModel('appView').setProperty('/layout','OneColumn');
			}else{
				this.onNavBack();
			}
		},
		onCloseDetails: function(){
			this.getModel('appView').setProperty('/layout','OneColumn');
		}
	});	
});