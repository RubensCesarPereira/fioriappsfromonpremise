/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("ui.s2p.mm.purchorder.approve.util.Conversions");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.purchorder.approve.view.S4", {

	sOrigin : "",
	sWorkitemID : "",
	sPoNumber : "",
	sItemNumber : "",

	onInit: function() {
		this.getView().getModel().setSizeLimit(1000000);
		// Get connection manager/resource bundle
		if (!this.oApplication) {
			this.oApplication = sap.ca.scfld.md.app.Application.getImpl();
			this.oConfiguration = this.oApplication.oConfiguration;
			this.oConnectionManager = this.oApplication.getConnectionManager();
			this.resourceBundle = this.oApplication.getResourceBundle();
			this.oDataModel = this.oApplicationFacade.getODataModel();
		}

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "itemDetails") {
				this.sOrigin = oEvent.getParameter("arguments").SAP__Origin;
				this.sWorkitemID = oEvent.getParameter("arguments").WorkitemID;
				this.sPoNumber = oEvent.getParameter("arguments").PoNumber;
				this.sItemNumber = oEvent.getParameter("arguments").ItemNumber;

				var sItemDetailContextPath = "/WorkflowTaskCollection(SAP__Origin='" + this.sOrigin + "',WorkitemID='" + this.sWorkitemID + "')" 
										+ "/HeaderDetails/ItemDetails(SAP__Origin='" + this.sOrigin + "',PoNumber='" + this.sPoNumber + "',ItemNumber='" + this.sItemNumber + "')";
				var sItemPath = "/ItemDetailCollection(SAP__Origin='" + this.sOrigin + "',ItemNumber='" + this.sItemNumber + "',PoNumber='" + this.sPoNumber + "')";
				var oItemData = this.oDataModel.getProperty(sItemPath);
				var sItemCategory = "";
				if (oItemData) {
					sItemCategory = oItemData.ItemCategory;
				}

				// subcontracting
				var oSubcontractingTable = this.byId("SubcontractingTable");
				if (sItemCategory === "3") {
					this.getView().bindElement(sItemDetailContextPath, {expand : 'Accountings,Notes,PricingConditions,Attachments,ServiceLines/Accountings,Limits/Accountings,Components'});

					this.getView().getElementBinding().attachEventOnce("dataReceived", function() {
						var aCells = [
							new sap.m.ObjectIdentifier({
								title : "{parts:[{path : 'Description'}, {path : 'Material'}], formatter : 'ui.s2p.mm.purchorder.approve.util.Conversions.IDFormatter'}"
							}),
							new sap.m.ObjectNumber({
								number : "{parts: [{path : 'Quantity'}], formatter : 'ui.s2p.mm.purchorder.approve.util.Conversions.formatQuantityWithoutUnit'}",
								numberUnit : "{BaseUnitDescription}"
							})
						];
						var oTemplate = new sap.m.ColumnListItem({cells : aCells});
						oSubcontractingTable.bindItems("Components", oTemplate, null, null);
						oSubcontractingTable.setVisible(true);
					}, this);

				} else {
					this.getView().bindElement(sItemDetailContextPath, {expand : 'Accountings,Notes,PricingConditions,Attachments,ServiceLines/Accountings,Limits/Accountings'});
					oSubcontractingTable.setVisible(false);
				}

				this.setLocalHeaderFooterOptions();
			}
		}, this);

		/**
		 * @ControllerHook S4 / onInit
		 * With this controller method the onInit method of the S4 controller can be enhanced.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookOnInit
		 */
		if (this.extHookOnInit) {
			this.extHookOnInit();
		}
	},

	setLocalHeaderFooterOptions: function() {
		var that = this;

		var sHDColl = this._headerDetailCollection(this.sOrigin, this.sPoNumber);
		var sIDColl = this._itemDetailCollection(this.sOrigin, this.sItemNumber, this.sPoNumber);

		var ItemsCollection = this.oDataModel.getProperty("/" + sHDColl + "/ItemDetails");
		if ( typeof ItemsCollection === "undefined" ) {
			//in case someone directly navigates to the details screen, we don't have oDataModel loaded and need to navigate back to the S3 screen
			this.navBack();
			return;
		}
		var len = ItemsCollection.length;
		var currentItemIndex = ItemsCollection.indexOf(sIDColl);

		var oLocalHeaderFooterOptions = {
			onBack: function() {
				that.navBack();
			},
			oUpDownOptions: {
				iPosition: currentItemIndex,
				iCount: len,
				fSetPosition: function (iNewItem) {
					var path = ItemsCollection[iNewItem];
					var sItemNumber = that.oDataModel.getProperty("/" + path).ItemNumber;

					that.oRouter.navTo("itemDetails", {
						SAP__Origin: that.sOrigin,
						WorkitemID: that.sWorkitemID,
						PoNumber: that.sPoNumber,
						ItemNumber: sItemNumber
					}, true);
				},
				sI18NDetailTitle: "view.ItemDetails.title"
			}
		};

		/**
		 * @ControllerHook S4 / HeaderFooterOptions
		 * With this controller method the setLocalHeaderFooterOptions method of the S4 controller
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
		if (this.sOrigin !== "" && this.sWorkitemID !== "") {
			var sMasterContextPath = "WorkflowTaskCollection(SAP__Origin='" + this.sOrigin + 
									 "',WorkitemID='" + this.sWorkitemID + "')";
			this.oRouter.navTo("detail", {
				contextPath: sMasterContextPath}, true);
		}
	},

	_refresh: function(channelId, eventId, data) {
		//Override and do nothing
	},

	onServiceItemPress : function(oEvent) {
		var bc = oEvent.getSource().getBindingContext().getPath();
		var oModel = this.getView().getModel();

		this.oRouter.navTo("itemServiceLine", {
			SAP__Origin: this.getView().getBindingContext().getProperty("SAP__Origin"),
			WorkitemID: this.sWorkitemID,
			PoNumber: this.getView().getBindingContext().getProperty("PoNumber"),
			ItemNumber: this.getView().getBindingContext().getProperty("ItemNumber"),
			ServiceLineNumber: oModel.getProperty(bc).ServiceLineNumber
		}, true);
	},

	onServiceLimitPress : function(oEvent) {
		var bc = oEvent.getSource().getBindingContext().getPath();
		var oModel = this.getView().getModel();

//		var descr = oModel.getProperty(bc).LimitDescription;
//		descr = encodeURIComponent(descr.trim());
		
	    var descr = bc.substring(bc.indexOf("LimitDescription='"), bc.length);
        descr = descr.substring(descr.indexOf("'")+1, descr.lastIndexOf("'"));
		
		this.oRouter.navTo("itemServiceLimit", {
			SAP__Origin: this.getView().getBindingContext().getProperty("SAP__Origin"),
			WorkitemID: this.sWorkitemID,
			PoNumber: this.getView().getBindingContext().getProperty("PoNumber"),
			ItemNumber: this.getView().getBindingContext().getProperty("ItemNumber"),
			LimitDescription: descr
		}, true);
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

		onAttachment: function(oEvent) {
		ui.s2p.mm.purchorder.approve.util.Conversions.onAttachment(oEvent);
	},


	onSenderPress: function(oEvent) {
		this.openEmployeeLaunch(oEvent, "CreatedByID");
	},

	openEmployeeLaunch: function(oEvent, sRef){
		var oControl = oEvent.getSource();
		var sTitle = this.resourceBundle.getText("BussinessCard.Employee");

		// Open employee type business card
		var onRequestSuccess = function(oData) {
			var data = oData.results[0],
			oEmpConfig = {
				title: sTitle,
				name: data.FullName,
                imgurl: ui.s2p.mm.purchorder.approve.util.Conversions.businessCardImg(data.Mime_Type, data.__metadata.media_src),
				department: data.Department,
				contactmobile: data.MobilePhone,
				contactphone: data.WorkPhone,
				contactemail: data.EMail,
				companyname: data.CompanyName,
				companyaddress: data.AddressString
			},
			oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oEmpConfig);
			oEmployeeLaunch.openBy(oControl);
		};

		var sOrigin = oEvent.getSource().getBindingContext().getProperty("SAP__Origin");
		var sUser = oEvent.getSource().getBindingContext().getProperty(sRef);

		// Open connection to read employee data
		this.oDataModel = this.oConnectionManager.modelList[this.oConfiguration.getServiceList()[0].name];
		var sFilter = "$filter=" + encodeURIComponent("=UserID eq '" + sUser + "' and SAP__Origin eq '" + sOrigin + "'");
		this.oDataModel.read("UserDetailsCollection", null, [sFilter], true,
			jQuery.proxy(onRequestSuccess, this),
			jQuery.proxy(this._onRequestFailed, this));
	},

    _onRequestFailed: function(oError) {
		var sMessage = "";
		var sDetails = null;

		if (oError.response && oError.response.body != "" && 
		   (oError.response.statusCode == "400" || oError.response.statusCode == "500")) {
			var oMessage = JSON.parse(oError.response.body);
			sMessage = oMessage.error.message.value;
		}
		if (sMessage == "") {
			sMessage = oError.message;
			sDetails = oError.response.body;
		}

		sap.ca.ui.message.showMessageBox({
			type: sap.ca.ui.message.Type.ERROR,
			message: sMessage,
			details: sDetails
		});
    }

});
