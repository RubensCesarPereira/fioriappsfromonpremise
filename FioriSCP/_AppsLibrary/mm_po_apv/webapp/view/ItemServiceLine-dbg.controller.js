/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.purchorder.approve.view.ItemServiceLine", {

	sOrigin : "",
	sWorkitemID : "",
	sPoNumber : "",
	sItemNumber : "",
	sSrvLine : "",

	onInit: function() {
		this.getView().getModel().setSizeLimit(1000000);
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
			if (oEvent.getParameter("name") === "itemServiceLine") {
				this.sOrigin = oEvent.getParameter("arguments").SAP__Origin;
				this.sWorkitemID = oEvent.getParameter("arguments").WorkitemID;
				this.sPoNumber = oEvent.getParameter("arguments").PoNumber;
				this.sItemNumber = oEvent.getParameter("arguments").ItemNumber;
				this.sSrvLine = oEvent.getParameter("arguments").ServiceLineNumber;

				var sItemServiceLineContextPath = "/ServiceLineCollection(" +
												  "SAP__Origin='" + this.sOrigin + 
												  "',PoNumber='" + this.sPoNumber +
												  "',ItemNumber='" + this.sItemNumber +
												  "',ServiceLineNumber='" + oEvent.getParameter("arguments").ServiceLineNumber + "')";
				this.getView().setBindingContext(new sap.ui.model.Context(this.getView().getModel(),sItemServiceLineContextPath));

				this.setLocalHeaderFooterOptions();
			}
		}, this);

		/**
		 * @ControllerHook Service Line / onInit
		 * With this controller method the onInit method of the ItemServiceLine controller can be enhanced.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookOnInit
		 */
		if (this.extHookOnInit) {
			this.extHookOnInit();
		}
	},

	setLocalHeaderFooterOptions: function() {
		var that = this;

		var sIDColl = this._itemDetailCollection(this.sOrigin, this.sItemNumber, this.sPoNumber);
		var sSLColl = this._serviceLineCollection(this.sOrigin, this.sPoNumber, this.sItemNumber, this.sSrvLine);
		
		var ServicesCollection = this.oDataModel.getProperty("/"+sIDColl+'/ServiceLines');
		if ( typeof ServicesCollection === "undefined" ) {
			//in case someone directly navigates to the details screen, we don't have oDataModel loaded and need to navigate back to the S3 screen
			this.navBack();
			return;
		}
		var len = ServicesCollection.length;
		var currentSrvIndex = ServicesCollection.indexOf(sSLColl);

		var sView = this.oRouter.getView("ui.s2p.mm.purchorder.approve.view.S4");
		var sController = sView.getController();

		var oLocalHeaderFooterOptions = {
			onBack: function() {
				that.navBack();
			},
			oUpDownOptions: {
				iPosition: currentSrvIndex,
				iCount: len,
				fSetPosition: function (iNewItem) {
					if ((iNewItem >= 0) && (iNewItem < len)) {
						var path = ServicesCollection[iNewItem];
						var sSrvLine = that.oDataModel.getProperty('/' + path).ServiceLineNumber;

						that.oRouter.navTo("itemServiceLine", {
							SAP__Origin: that.sOrigin,
							WorkitemID: that.sWorkitemID,
							PoNumber: that.sPoNumber,
							ItemNumber: that.sItemNumber,
							ServiceLineNumber: sSrvLine
						}, true);
					}
				},
				sI18NDetailTitle: "view.ItemServiceLine.title",
				oParent: sController
			}
		};

		/**
		 * @ControllerHook Service Line / HeaderFooterOptions
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

	_refresh: function(channelId, eventId, data) {
		//Override and do nothing
	},

	navBack : function() {
		if (this.sOrigin !== "" && this.sWorkitemID !== "") {
			this.oRouter.navTo("itemDetails", {
				SAP__Origin: this.sOrigin,
				WorkitemID: this.sWorkitemID,
				PoNumber: this.sPoNumber,
				ItemNumber:  this.sItemNumber
			}, true);
		}
	},

	_headerDetailCollection: function(sOrigin, sPoNumber) {
		var sResult = "HeaderDetailCollection(SAP__Origin='" + sOrigin + "',PoNumber='" + sPoNumber + "')";
		return sResult;
	},

	_itemDetailCollection: function(sOrigin,sItemNumber,sPoNumber) {
		var sResult = "ItemDetailCollection(SAP__Origin='" + sOrigin + "',ItemNumber='" + sItemNumber +
					"',PoNumber='" + sPoNumber + "')";
		return sResult;
	},

	_serviceLineCollection: function(sOrigin,sPoNumber,sItemNumber,sServLineNo) {
		var sResult = "ServiceLineCollection(SAP__Origin='" + sOrigin + "',PoNumber='" + sPoNumber +
					"',ItemNumber='" + sItemNumber + "',ServiceLineNumber='" + sServLineNo + "')";
		return sResult;	
	}

});
