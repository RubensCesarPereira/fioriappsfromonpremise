/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("ui.s2p.mm.requisition.approve.util.Conversions");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.requisition.approve.view.S3", {

	onInit: function() {

		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.getView().getModel().setSizeLimit(1000000);
		this.setLocalHeaderFooterOptions();

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "detail") {
				var sDetailContextPath = oEvent.getParameter("arguments").contextPath + "/ItemDetails";
				sDetailContextPath = sDetailContextPath.replace("WorkflowTaskCollection", "/WorkflowTaskCollection");
				var sItemType = this.oRouter.getView("ui.s2p.mm.requisition.approve.view.S2").getController().getItemType();

				var oSubcontractingTable = this.byId("SubcontractingTable");

				if (sItemType === "3") {
					this.getView().bindElement(sDetailContextPath, {
						expand: 'Accountings,Notes,Attachments,Limits/Accountings,ServiceLines/Accountings,Components'
					});

					this.getView().getElementBinding().attachEventOnce("dataReceived", function() {
						var aCells = [
							new sap.m.ObjectIdentifier({
								title : "{parts:[{path : 'Description'}, {path : 'Material'}], formatter : 'ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter'}"
							}),
							new sap.m.ObjectNumber({
								number : "{parts: [{path : 'Quantity'}], formatter : 'ui.s2p.mm.requisition.approve.util.Conversions.quantityFormatterWithoutUnit'}",
								numberUnit : "{BaseUnitDescription}"
							})
						];
						var oTemplate = new sap.m.ColumnListItem({cells : aCells});
						oSubcontractingTable.bindItems("Components", oTemplate, null, null);
						oSubcontractingTable.setVisible(true);
					}, this);

				} else {
					oSubcontractingTable.unbindItems();
					oSubcontractingTable.setVisible(false);
					this.getView().bindElement(sDetailContextPath, {
						expand: 'Accountings,Notes,Attachments,Limits/Accountings,ServiceLines/Accountings'
					});
				}

				if (this.getView().byId("tabBar").getSelectedKey() !== "Info") {
					this.getView().byId("tabBar").setSelectedKey("Info");
				}
			}
		}, this);

		/**
		 * @ControllerHook S3 / onInit
		 * With this controller method the onInit method of the S3 controller can be enhanced.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookOnInit
		 */
		if (this.extHookOnInit) {
			this.extHookOnInit();
		}
	},

	setLocalHeaderFooterOptions: function() {
		var that = this;
		var oLocalHeaderFooterOptions = {
				oPositiveAction: {
					sI18nBtnTxt: that.resourceBundle.getText("XBUT_APPROVE"),
					onBtnPressed: jQuery.proxy(that.openApproveRejectDialog, that, ['approve'])
				},
				oNegativeAction: {
					sI18nBtnTxt: that.resourceBundle.getText("XBUT_REJECT"),
					onBtnPressed: jQuery.proxy(that.openApproveRejectDialog, that, ['reject'])
				},
				buttonList: [{
					sId: "btn_Forward",
					sI18nBtnTxt: "XBUT_FORWARD",
					onBtnPressed: jQuery.proxy(this.handleForward, that)
				}],
				onBack: jQuery.proxy(function() {
	                if (sap.ui.Device.system.phone) {	
	                	//Back-button on s3 screen is only displayed on mobile phones
	                    window.history.go(-1);
	                }
				}, this)
		};

		/**
		 * @ControllerHook S3 / HeaderFooterOptions
		 * With this controller method the setLocalHeaderFooterOptions method of the S3 controller 
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

	openApproveRejectDialog : function(arg){		
		var CreatedByID = this.oView.getBindingContext().getProperty("CreatedByID");
		var sDialogQuestion = "";
		var sDialogTitle = "";
		var sDecisionKey = "";
		var that = this;
		
		switch(arg[0]){
			case 'approve':
				sDialogQuestion = this.resourceBundle.getText("dialog.question.approve", [CreatedByID]);
				sDialogTitle = this.resourceBundle.getText("XTIT_APPROVAL");
				sDecisionKey = "0001";
				this.sTextKey = "dialog.success.approve";
				break;
			case 'reject':
				sDialogQuestion = this.resourceBundle.getText("dialog.question.reject", [CreatedByID]);
				sDialogTitle = this.resourceBundle.getText("XTIT_REJECT");
				sDecisionKey = "0002";
				this.sTextKey = "dialog.success.reject";
				break;
			default:
				break;
		}
		
		new sap.m.Dialog(this.createId("s3ApproveRejectDialog"),{
			title: sDialogTitle,
			showHeader: true,
			content: [
					new sap.ui.layout.VerticalLayout( 
						{
								width: "100%",
								content : [
								 new sap.m.Text(this.createId("S3ConfirmRejectDialogTextField"),{
										text: sDialogQuestion
									}).addStyleClass("sapUiSmallMarginBottom"),
									new sap.m.TextArea(this.createId("S3ConfirmRejectDialogTextFieldForNotes"),{
										maxLength: 0,
										width: "100%",
										placeholder: this.resourceBundle
											.getText("dialog.ApproveRejectForward.NotePlaceHolder"),
										editable: true
									})
							]
						}
					)
				],

			beginButton: new sap.m.Button({
				text: this.resourceBundle.getText("XBUT_OK"),
				press: function() {
					var sNoteText = that.byId("S3ConfirmRejectDialogTextFieldForNotes").getValue();
					var oResult = {
							isConfirmed: true,
							sNote: sNoteText
						};						 
					that.handleApproveRejectExecute(oResult, sDecisionKey);
					that.byId("s3ApproveRejectDialog").close();
				}
			}),
			endButton: new sap.m.Button({
				text: this.resourceBundle.getText("XBUT_CANCEL"),
				press: function() {
					that.byId("s3ApproveRejectDialog").close();
				}
			}),
			afterClose: function(oEvent) {
				this.destroy();
			}
		}).addStyleClass("sapUiPopupWithPadding").open(); 

	},

	handleApproveRejectExecute: function(oResult, sDecisionKey) {
		var oDataObj = this.oView.getModel().getProperty(this.oView.getBindingContext().getPath());
		var comment;
		if (oResult.sNote) {
			comment = oResult.sNote;
		} else {
			comment = "";
		}	  
		this.oDataModel.setRefreshAfterChange(false);
		this.oDataModel.callFunction(
			"ApplyDecision",
			"POST",
			{
				SAP__Origin: oDataObj.SAP__Origin,
				WorkitemID: oDataObj.WorkitemID,
				DecisionKey: sDecisionKey, 
				Comment: comment
			},
			undefined,
			jQuery.proxy(this._handleApproveRejectSuccess, this),
			jQuery.proxy(this._handleApproveRejectForwardFail, this)
		);
},

	_handleApproveRejectSuccess: function(oSuccess) {		
		if(oSuccess){
			if(oSuccess.ApplyDecision.ActionSuccessful !== 'X'){		
				//Approval or rejection of this purchase order is still in process. 
				//Refresh the list of purchase orders manually.
				var sMessage = this.resourceBundle.getText("dialog.refreshMasterListManually");
				var sDetails = null;			
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.INFO,
					message: sMessage,
					details: sDetails
				});
			}
			else{
				//Approval or rejection of this purchase order was successfully proceed. 
				//Refresh the list of purchase orders automatically.
				var sSuccessText = this.resourceBundle.getText(this.sTextKey);
				var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView()),
				oComponent = sap.ui.component(sComponentId);
				var data = {
						bMessageToast : true,
						sMessage : sSuccessText
				};
				//create and open the message toast after the view switch (after automatically select of next work item)  
				oComponent.oEventBus.publish("ui.s2p.mm.requisition.approve", "selectNextWorkItem", data);				
			}
		}	
		this.oDataModel.setRefreshAfterChange(true);
	},

	_handleApproveRejectForwardFail: function(oError) {
		this.oDataModel.setRefreshAfterChange(true);
		if (this.oDataModel.hasPendingChanges()) {
			this.oDataModel.refresh(true);
		}
		this.onRequestFailed(oError);
	},

	handleForward: function(oEvent) {
		var that = this;
		var oDataObj = this.getView().getModel().getProperty(
			this.getView().getBindingContext().getPath());
		var sOrigin = oDataObj.SAP__Origin;
		var sWorkitemID = oDataObj.WorkitemID;
		var fnStartSearch = function(sQeury) {
			var sFilter = "$filter=" + encodeURIComponent("SearchForText eq '" + sQeury + "' and SAP__Origin eq '" + sOrigin + "'");
			that.oDataModel.read("/ForwardingAgentCollection", null, [sFilter], true, function(oData,
				oResponse) {
				sap.ca.ui.dialog.forwarding.setFoundAgents(oData.results);
			}, jQuery.proxy(that.onRequestFailed, this));
		};
		var fnClose = function(oResult) {
			if (oResult && oResult.bConfirmed) {
				var oSelectedAgent = oResult.oAgentToBeForwarded;
				var sText = that.resourceBundle.getText("dialog.success.forward", [oSelectedAgent.FullName]);
				var oEntry = {};
				if (oResult.sNote) {
					oEntry.Comment = oResult.sNote;
				} else {
					oEntry.Comment = "";
				}

				that.oDataModel.setRefreshAfterChange(false);
				that.oDataModel.callFunction(
					"Forward",
					"POST",
					{
						SAP__Origin: sOrigin,
						WorkitemID: sWorkitemID,
						NewApprover: oSelectedAgent.UserId,
						Comment: oEntry.Comment
					},
					undefined,
					function() {
						var sComponentId = sap.ui.core.Component.getOwnerIdFor(that.getView()),
							oComponent = sap.ui.component(sComponentId);
						that.getView().unbindElement();
						oComponent.oEventBus.publish("ui.s2p.mm.requisition.approve", "selectNextWorkItem");
						that.oDataModel.setRefreshAfterChange(true);
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.SUCCESS,
							message: sText,
							details: sText
						});
					},
					jQuery.proxy(that._handleApproveRejectForwardFail, that)
				);
			}
		};
		sap.ca.ui.dialog.forwarding.start(fnStartSearch, fnClose);
	},

	onNamePress: function(oEvent) {
		this.openEmployeeLaunch(oEvent, "CreatedByID");
	},

	onForwardedPress: function(oEvent) {
		this.openEmployeeLaunch(oEvent, "ForwardedByID");
	},

	onSubstitutingPress: function(oEvent) {
		this.openEmployeeLaunch(oEvent, "SubstitutingForID");
	},

	onAgentPress: function(oEvent) {
		this.openEmployeeLaunch(oEvent, "CreatedByID");
	},

	onNoteSenderPress: function(oEvent) {
		this.openEmployeeLaunch(oEvent, "CreatedByID");
	},

	openEmployeeLaunch: function(oEvent, sRef) {

		//var oControl = oEvent.getSource();
		var oControl = oEvent.getParameters().domRef;
		var sTitle = this.resourceBundle.getText("BusinessCard.employee");

		// Open employee type business card
		var onRequestSuccess = function(oData) {
			var data = oData.results[0],
				oEmpConfig = {
					title: sTitle,
					name: data.FullName,
					imgurl: ui.s2p.mm.requisition.approve.util.Conversions.businessCardImg(data.Mime_Type, data.__metadata.media_src),
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

		var sFilter = "$filter=" + encodeURIComponent("UserID eq '" + sUser + "' and SAP__Origin eq '" + sOrigin + "'");
		this.oDataModel.read("UserDetailsCollection", null, [sFilter], true,
			jQuery.proxy(onRequestSuccess, this),
			jQuery.proxy(this.onRequestFailed, this));
	},

	onSupplierPress: function(oEvent) {
		this.onCompanyLaunch(oEvent, "SupplierID");
	},

	onCompanyLaunch: function(oEvent, sRef) {
		var sTitle = this.oApplicationFacade.getResourceBundle().getText("BusinessCard.supplier");
		var sSupplierId = this.oApplicationFacade.getODataModel().getProperty("SupplierID", this.getView().getBindingContext());

		var oControl = oEvent.getSource();
		var sOrigin = this.getView().getBindingContext().getProperty("SAP__Origin");
		var oApplicationFacade = this.oApplicationFacade;
		var sSupplierDetailsCollection = "SupplierDetailCollection(SupplierID='" + sSupplierId + "',SAP__Origin='" + sOrigin + "')";
		var aParam = ["$expand=SupplierContacts"];
		sap.ca.ui.utils.busydialog.requireBusyDialog();
		oApplicationFacade.getODataModel().read(sSupplierDetailsCollection, null, aParam, true, function(oData, response) {
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
			var hasContacts = (oData.SupplierContacts && (oData.SupplierContacts.results.length > 0));
			var oSBCData = {
				title: sTitle,
				imgurl: ui.s2p.mm.requisition.approve.util.Conversions.businessCardImg(oData.Mime_Type, oData.__metadata.media_src),
				companyname: oData.SupplierName,
				companyphone: oData.WorkPhone,
				companyaddress: oData.AddressString,
				maincontactname: hasContacts ? oData.SupplierContacts.results[0].ContactName : oData.ContactName,
				maincontactmobile: hasContacts ? oData.SupplierContacts.results[0].MobilePhone : oData.MobilePhone,
				maincontactphone: hasContacts ? oData.SupplierContacts.results[0].WorkPhone : oData.WorkPhone,
				maincontactemail: hasContacts ? oData.SupplierContacts.results[0].EMail : oData.EMail
			};
			var oSupplierBusinessCard = new sap.ca.ui.quickoverview.CompanyLaunch(oSBCData);
			oSupplierBusinessCard.openBy(oControl);
		}, function(oError) {
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
		});

	},

	handleServiceLineItemPress: function(oEvent) {
		this.oRouter.navTo("subDetail", {
			SAP__Origin: this.getView().getBindingContext().getProperty("SAP__Origin"),
			WorkitemID: this.getView().getBindingContext().getProperty("WorkitemID"),
			PrNumber: this.getView().getBindingContext().getProperty("PrNumber"),
			ItemNumber: this.getView().getBindingContext().getProperty("ItemNumber"),
			ServiceLineNumber: oEvent.getSource().getBindingContext().getProperty("ServiceLineNumber")
		}, true);
	},

	handleLimitLineItemPress: function(oEvent) {
		this.oRouter.navTo("Limit", {
			SAP__Origin: this.getView().getBindingContext().getProperty("SAP__Origin"),
			WorkitemID: this.getView().getBindingContext().getProperty("WorkitemID"),
			PrNumber: this.getView().getBindingContext().getProperty("PrNumber"),
			ItemNumber: this.getView().getBindingContext().getProperty("ItemNumber")
		}, true);
	},

	onAttachment: function(oEvent) {
		ui.s2p.mm.requisition.approve.util.Conversions.onAttachment(oEvent);
	},

	handleNavBack: function() {
		window.history.back();
	},

	onRequestFailed: function(oError) {
		var that = this;
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
		}, function(){
			var sComponentId = sap.ui.core.Component.getOwnerIdFor(that.getView()),
			oComponent = sap.ui.component(sComponentId);			
			oComponent.oEventBus.publish("ui.s2p.mm.requisition.approve", "selectNextWorkItem");
		});
	},

	isMainScreen: function() {
		return true;
	},

	onExit : function() {
		// close open popovers
		if (sap.m.InstanceManager.hasOpenPopover()) {
			sap.m.InstanceManager.closeAllPopovers();
	}
		// close open dialogs
		if (sap.m.InstanceManager.hasOpenDialog()) {
			sap.m.InstanceManager.closeAllDialogs();
		}
	}

});
