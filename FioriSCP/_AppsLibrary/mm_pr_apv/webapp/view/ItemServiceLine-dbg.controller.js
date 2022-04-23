/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.SelectDialog");
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("ui.s2p.mm.requisition.approve.util.Conversions");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.requisition.approve.view.ItemServiceLine", {

	_bIsHeaderBasedApproval : false,

	onInit: function() {
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.oRouter.attachRouteMatched(this._handleRouteMatched, this);
		this.getView().getModel().setSizeLimit(1000000);
		/**
		 * @ControllerHook Service Lines / onInit
		 * With this controller method the onInit method of the ItemServiceLine controller can be enhanced.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookOnInit
		 */
		if (this.extHookOnInit) {
			this.extHookOnInit();
		}
	},

	_handleRouteMatched: function(oEvent) {
		if (oEvent.getParameter("name") === "subDetail" || 
			oEvent.getParameter("name") === "itemServiceLine") {
			if (oEvent.getParameter("name") === "itemServiceLine") {
				this._bIsHeaderBasedApproval = true;
			} else {
				this._bIsHeaderBasedApproval = false;
			}
			this.sOrigin = oEvent.getParameter("arguments").SAP__Origin;
			this.sWorkitemID = oEvent.getParameter("arguments").WorkitemID;
			this.sPrNumber = oEvent.getParameter("arguments").PrNumber;
			this.sPrItem = oEvent.getParameter("arguments").ItemNumber;
			this.sServiceItem = oEvent.getParameter("arguments").ServiceLineNumber;
			
			var sItemServiceLineContextPath = "/" + this._ServiceLinesCollection();
			this.getView().setBindingContext(new sap.ui.model.Context(this.getView().getModel(),sItemServiceLineContextPath));
			
			this.setLocalHeaderFooterOptions();
		}
	},

	_ItemCollection: function() {
		var sResult;
		if (this._bIsHeaderBasedApproval === false) {
			sResult = "ItemDetailCollection(SAP__Origin='" + this.sOrigin +
					  "',WorkitemID='" + this.sWorkitemID + "')";
		} else {
			sResult = "HeaderItemDetailCollection(SAP__Origin='" + this.sOrigin +
					  "',WorkitemID='" + this.sWorkitemID + "',PrNumber='" + this.sPrNumber +
					  "',ItemNumber='" + this.sPrItem + "')";
		}
		return sResult;
	},

	_ServiceLinesCollection: function() {
		var sResult = "ServiceLineCollection(SAP__Origin='" + this.sOrigin +
					  "',PrNumber='" + this.sPrNumber + "',ItemNumber='" + this.sPrItem + 
					  "',ServiceLineNumber='" + this.sServiceItem + "')";
		return sResult;
	},

	setLocalHeaderFooterOptions: function() {
		var that = this;
		var sItemCollection = this._ItemCollection();
		var sServiceColl = this._ServiceLinesCollection();

		var ServiceLinesCollection = this.oDataModel.getProperty("/" + sItemCollection + "/ServiceLines");
		if ( typeof ServiceLinesCollection === "undefined" ) {
			//in case someone directly navigates to the details screen, we don't have oDataModel loaded and need to navigate back to the S3 screen
			this.navBack();
			return;
		}

		var len = ServiceLinesCollection.length;
		var currentItemIndex = ServiceLinesCollection.indexOf(sServiceColl);
		var sI18NDetailTitle = (this._bIsHeaderBasedApproval === false) ? "view.ServiceLineDetail.title" : "view.ItemServiceLine.title";
		var sController = null;

		if (this._bIsHeaderBasedApproval === true) {
			var sView = this.oRouter.getView("ui.s2p.mm.requisition.approve.view.ItemDetails");
			sController = sView.getController();
		}
		var oLocalHeaderFooterOptions = {
				onBack: function() {
					that.navBack();
				},
				oUpDownOptions: {
					iPosition: currentItemIndex,
					iCount: len,
					fSetPosition: function (iNewItem) {
						if ((iNewItem >= 0) && (iNewItem < len)) {
							var path = ServiceLinesCollection[iNewItem];
							var sServiceLineNumber = that.oDataModel.getProperty("/" + path).ServiceLineNumber;

							if (that._bIsHeaderBasedApproval === false) {
								that.oRouter.navTo("subDetail", {
									SAP__Origin: that.sOrigin,
									WorkitemID: that.sWorkitemID,
									PrNumber: that.sPrNumber,
									ItemNumber: that.sPrItem,
									ServiceLineNumber: sServiceLineNumber
								}, true);
							} else {
								that.oRouter.navTo("itemServiceLine", {
									SAP__Origin: that.sOrigin,
									WorkitemID: that.sWorkitemID,
									PrNumber: that.sPrNumber,
									ItemNumber: that.sPrItem,
									ServiceLineNumber: sServiceLineNumber
								}, true);
							}
						}
					},
					sI18NDetailTitle: sI18NDetailTitle,
					oParent: sController
				}
		};

		/**
		 * @ControllerHook Service Lines / HeaderFooterOptions
		 * With this controller method the setLocalHeaderFooterOptions method of the ItemServiceLine controller 
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

    navBack: function() {
		if (this.sOrigin !== "" && this.sWorkitemID !== "" && this._bIsHeaderBasedApproval === false) {
			var sMasterContextPath = "WorkflowTaskCollection(SAP__Origin='" + this.sOrigin + 
                                     "',WorkitemID='" + this.sWorkitemID + "')";

    		this.oRouter.navTo("detail", {
    			contextPath: sMasterContextPath
    		}, true);
		} else if (this.sOrigin !== "" && this.sWorkitemID !== "" &&
				   this.sPrNumber !== "" && this.sPrItem !== "" && this._bIsHeaderBasedApproval === true) {

			this.oRouter.navTo("itemDetails", {
	            SAP__Origin: this.sOrigin,
	            WorkitemID: this.sWorkitemID,
	            PrNumber: this.sPrNumber,
	            ItemNumber: this.sPrItem
			}, true);
		}
	}

});
