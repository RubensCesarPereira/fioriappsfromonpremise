sap.ui.define([
	"liberarPrecioExp/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
], function (BaseController, JSONModel,MessageToast) {
	"use strict";
	return BaseController.extend("liberarPrecioExp.controller.app", {

		onInit : function () {
			var oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy : false,
				delay : 0,
				layout : "OneColumn",
				previousLayout : "",
				headerVisible: false,
				actionButtonsInfo: {
					midColumn:{
						fullScreen:false
					}
				},
			});
			this.setModel(oViewModel, "appView");

			fnSetAppNotBusy = function() {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};
//			this.getOwnerComponent().getModel().metadataLoaded().then(fnSetAppNotBusy);
//			this.getOwnerComponent().getModel().attachMetadataFailed(fnSetAppNotBusy);

			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		onBeforeRendering: function(){
			console.log('App_onBeforeRendering');
		}

	});
});