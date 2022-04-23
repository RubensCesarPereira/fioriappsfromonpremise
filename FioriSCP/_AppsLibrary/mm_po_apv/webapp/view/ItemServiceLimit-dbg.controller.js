/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.purchorder.approve.view.ItemServiceLimit", {

	onInit: function() {

		this.oView = this.getView();

		// Get connection manager/resource bundle
		if (!this.oApplication) {
			this.oApplication = sap.ca.scfld.md.app.Application.getImpl();
			this.oConfiguration = this.oApplication.oConfiguration;
			this.oConnectionManager = this.oApplication.getConnectionManager();
			this.resourceBundle = this.oApplication.getResourceBundle();
			this.oDataModel = this.oApplicationFacade.getODataModel();
		}

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "itemServiceLimit") {
				this.sOrigin = oEvent.getParameter("arguments").SAP__Origin;
				this.sWorkitemID = oEvent.getParameter("arguments").WorkitemID;
				this.sPoNumber = oEvent.getParameter("arguments").PoNumber;
				this.sItemNumber = oEvent.getParameter("arguments").ItemNumber;

				var description = oEvent.getParameter("arguments").LimitDescription;

				var sItemServiceLineContextPath = "/LimitCollection(" +
												  "SAP__Origin='" + this.sOrigin + 
												  "',PoNumber='" + this.sPoNumber +
												  "',ItemNumber='" + this.sItemNumber +
												  "',LimitDescription='" + description + "')";

				this.getView().setBindingContext(new sap.ui.model.Context(this.getView().getModel(),sItemServiceLineContextPath));

				this.setLocalHeaderFooterOptions();
			}
		}, this);

		/**
		 * @ControllerHook Limit / onInit
		 * With this controller method the onInit method of the ItemServiceLimit controller can be enhanced.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookOnInit
		 */
		if (this.extHookOnInit) {
			this.extHookOnInit();
		}
	},

	setLocalHeaderFooterOptions: function() {
		var that = this;
		var sHDColl = "HeaderDetailCollection(" + "SAP__Origin='" + this.sOrigin + "',PoNumber='" + this.sPoNumber + "')";
		var sIDColl = "ItemDetailCollection(" + "SAP__Origin='" + this.sOrigin + "',ItemNumber='" + this.sItemNumber +
						"',PoNumber='" + this.sPoNumber + "')";

		var ItemsCollection = this.oDataModel.getProperty("/"+sHDColl+'/ItemDetails');
		if ( typeof ItemsCollection === "undefined" ) {
			//in case someone directly navigates to the details screen, we don't have oDataModel loaded and need to navigate back to the S3 screen
			this.navBack();
			return;
		}
		var numOfItems = ItemsCollection.length;
		var currentItemIndex = ItemsCollection.indexOf(sIDColl);

		var oLocalHeaderFooterOptions = {
			onBack: function() {
				that.navBack();
			},
			sDetailTitle: this.getS9LimitPageTitle(currentItemIndex + 1, numOfItems)
		};

		/**
		 * @ControllerHook Limit / HeaderFooterOptions
		 * With this controller method the setLocalHeaderFooterOptions method of the ItemServiceLimit controller
		 * can be enhanced to change the HeaderFooterOptions.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookSetHeaderFooterOptions
		 * @param {object} oLocalHeaderFooterOptions
		 * @return {object} oLocalHeaderFooterOptions
		 */
		if (this.extHookSetHeaderFooterOptions) {
			oLocalHeaderFooterOptions = this.extHookSetHeaderFooterOptions(oLocalHeaderFooterOptions);
		}

		this.setHeaderFooterOptions(oLocalHeaderFooterOptions);
	},

	_refresh: function(channelId, eventId, data) {
		//Override and do nothing
	},

	getS9LimitPageTitle: function(sCurrentId, sTotalNum){
		return this.resourceBundle.getText("view.ItemServiceLimit.title", [sCurrentId, sTotalNum]);
	},

	navBack: function() {
		if (this.sOrigin !== "" && this.sWorkitemID !== "") {
			this.oRouter.navTo("itemDetails", {
				SAP__Origin: this.sOrigin,
				WorkitemID: this.sWorkitemID,
				PoNumber: this.sPoNumber,
				ItemNumber:  this.sItemNumber
			}, true);
		}
	}

});
