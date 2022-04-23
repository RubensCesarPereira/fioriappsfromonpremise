/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("ui.s2p.mm.requisition.approve.util.Conversions");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.ui.dialog.factory");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.requisition.approve.view.Limit", {

	_bIsHeaderBasedApproval : false,

	onInit: function() {
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.oRouter.attachRouteMatched(this._handleRouteMatched, this);
		this.getView().getModel().setSizeLimit(1000000);
		/**
		 * @ControllerHook Limit / onInit
		 * With this controller method the onInit method of the Limit controller can be enhanced.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookOnInit
		 */
		if (this.extHookOnInit) {
			this.extHookOnInit();
		}
	},

	_handleRouteMatched: function(oEvent) {
		if (oEvent.getParameter("name") === "Limit" ||
			oEvent.getParameter("name") === "itemServiceLimit") {
			if (oEvent.getParameter("name") === "itemServiceLimit") {
				this._bIsHeaderBasedApproval = true;
			} else {
				this._bIsHeaderBasedApproval = false;
			} 
			this.sOrigin = oEvent.getParameter("arguments").SAP__Origin;
			this.sWorkitemID = oEvent.getParameter("arguments").WorkitemID;
			this.sPrNumber = oEvent.getParameter("arguments").PrNumber;
			this.sPrItem = oEvent.getParameter("arguments").ItemNumber;

			var sLimitLineContextPath = "/" + this._LimitCollectionPath();
			this.getView().setBindingContext(new sap.ui.model.Context(this.getView().getModel(),sLimitLineContextPath));
			this.setLocalHeaderFooterOptions();
		}
	},

	_HeaderCollectionPath: function() {
		var sResult = "HeaderDetailCollection(SAP__Origin='" + this.sOrigin +
					  "',WorkitemID='" + this.sWorkitemID + "')";
		return sResult;
	},

	_ItemCollectionPath: function() {
		var sResult = "HeaderItemDetailCollection(SAP__Origin='" + this.sOrigin +
					  "',WorkitemID='" + this.sWorkitemID + "',PrNumber='" + this.sPrNumber +
					  "',ItemNumber='" + this.sPrItem + "')";
		return sResult;
	},
	
	_LimitCollectionPath: function() {
		var sLimitCollection = "LimitCollection(" + "SAP__Origin='" + this.sOrigin +
								"',PrNumber='" + this.sPrNumber + "',ItemNumber='" + this.sPrItem + "')";
		return sLimitCollection;
	},


	setLocalHeaderFooterOptions: function() {
		var that = this;
		var currentItemIndex = "";
		var lenItems = "";

		//Handle refresh, browser forward button, direct link to item  
    	var sLimitLineContextPath = "/" + this._LimitCollectionPath();
		var LimitItem = this.oDataModel.getProperty(sLimitLineContextPath);
    	if ( typeof LimitItem === "undefined" ) {
			//in case someone directly navigates to the details screen, we don't have oDataModel loaded and need to navigate back to the S3 screen
			this.navBack();
			return;
		}
		

    	// determine item count and item number for header based approval  
		if (this._bIsHeaderBasedApproval === true) {

	    	var sHeaderCollection = this._HeaderCollectionPath();
	    	var sItemCollection = this._ItemCollectionPath();
	    	var ItemsCollection = this.oDataModel.getProperty("/" + sHeaderCollection + "/HeaderItemDetails");

			lenItems = ItemsCollection.length;
			currentItemIndex = ItemsCollection.indexOf(sItemCollection);
		} 
		
		var oLocalHeaderFooterOptions = {
			onBack: function() {
				that.navBack();
			},
			sDetailTitle: this.getDetailTitle(currentItemIndex + 1, lenItems)
		};

		/**
		 * @ControllerHook Limit / HeaderFooterOptions
		 * With this controller method the setLocalHeaderFooterOptions method of the Limit controller 
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

	getDetailTitle: function(sCurrentId, sTotalNum){
		if (this._bIsHeaderBasedApproval === false){
			return this.resourceBundle.getText("view.LimitDetail.title");
		} else {
			return this.resourceBundle.getText("view.ItemServiceLimit.title", [sCurrentId, sTotalNum]);
		}
	},

	navBack: function() {
		if (this.sOrigin !== "" && this.sWorkitemID !== "" && this._bIsHeaderBasedApproval === false) {
			var sMasterContextPath = "WorkflowTaskCollection(SAP__Origin='" + this.sOrigin + 
									 "',WorkitemID='" + this.sWorkitemID + "')";
			this.oRouter.navTo("detail", {
				contextPath: sMasterContextPath
			}, true);
		} else if (this.sOrigin !== "" && this.sWorkitemID !== "" &&
			   this.sPrNumber !== "" && this.sPrItem !== "" && this._bIsHeaderBasedApproval === true){

			this.oRouter.navTo("itemDetails", {
	            SAP__Origin: this.sOrigin,
	            WorkitemID: this.sWorkitemID,
	            PrNumber: this.sPrNumber,
	            ItemNumber: this.sPrItem
			}, true);
		}
	}

});
