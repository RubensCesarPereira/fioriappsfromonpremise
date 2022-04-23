/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("ui.s2p.mm.purchorder.approve.util.Conversions");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.dialog.factory");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.purchorder.approve.view.S3", {

	onInit: function() {
		this.getView().getModel().setSizeLimit(1000000);
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.oView = this.getView();

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "detail") {
				var sDetailContextPath = oEvent.getParameter("arguments").contextPath + "/HeaderDetails";
				sDetailContextPath = sDetailContextPath.replace("WorkflowTaskCollection", "/WorkflowTaskCollection");
				// Don't refresh the screen on a back navigation
				var oController = this;
				if (oController.sContext !== sDetailContextPath ||
					oController.sContext === "") {
					this.sContext = sDetailContextPath;
					this.refreshScreen(sDetailContextPath);
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

	refreshScreen: function(sDetailContextPath) {
		if (sDetailContextPath) {
			var oView = this.getView();
			oView.bindElement(sDetailContextPath, {
				expand: 'ItemDetails,Notes,Attachments,ItemDetails/Limits'
			});
			//make sure that the information tab will be selected
			if (this.oView.byId("tabBar").getSelectedKey() !== "contentInfo") {
				this.oView.byId("tabBar").setSelectedKey("contentInfo");
			}
			oView.getElementBinding().attachEventOnce("dataReceived",
				this.onDataLoaded, this);
		}
	},

	onDataLoaded: function(oEv) {
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
		this._updateListItem(oEv);

		/**
		 * @ControllerHook  S3 HeaderFooterOptions
		 * With this controller method the HeaderFooterOptions can be changed. For example it is possible to remove the reject-button.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookSetHeaderFooterOptions
		 * @param {object} oLocalHeaderFooterOptions: An object which contains the parameters for the HeaderFooterOptions.
		 * @return {object} oLocalHeaderFooterOptions: An object which contains the parameters for the HeaderFooterOptions.
		 */
		if (this.extHookSetHeaderFooterOptions) {
			oLocalHeaderFooterOptions = this.extHookSetHeaderFooterOptions(oLocalHeaderFooterOptions);
		}
		this.setHeaderFooterOptions(oLocalHeaderFooterOptions);
	},

	navToItemDetails: function(oEvent) {
		var bc = oEvent.getSource().getBindingContext().getPath();
		var oModel = this.getView().getModel();

		this.oRouter.navTo("itemDetails", {
			SAP__Origin: this.oView.getBindingContext().getProperty("SAP__Origin"),
			WorkitemID: this.oView.getBindingContext().getProperty("WorkitemID"),
			PoNumber: this.oView.getBindingContext().getProperty("PoNumber"),
			ItemNumber: oModel.getProperty(bc).ItemNumber
		}, true);
	},

	onAttachment: function(oEvent) {
		ui.s2p.mm.purchorder.approve.util.Conversions.onAttachment(oEvent);
	},

	openApproveRejectDialog: function(arg) {
		var CreatedByID = this.oView.getBindingContext().getProperty("CreatedByID");
		var sDialogQuestion = "";
		var sDialogTitle = "";
		var sDecisionKey = "";
		var that = this;

		switch (arg[0]) {
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

		new sap.m.Dialog(this.createId("s3ApproveRejectDialog"), {
			title: sDialogTitle,
			showHeader: true,
			content: [
				new sap.ui.layout.VerticalLayout({
					width: "100%",
					content: [
						new sap.m.Text(this.createId("S3ConfirmRejectDialogTextField"), {
							text: sDialogQuestion
						}).addStyleClass("sapUiSmallMarginBottom"),
						new sap.m.TextArea(this.createId("S3ConfirmRejectDialogTextFieldForNotes"), {
							maxLength: 0,
							width: "100%",
							placeholder: this.resourceBundle.getText("dialog.ApproveRejectForward.NotePlaceHolder"),
							editable: true
						})
					]
				})
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
			"POST", {
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
		var sSuccessText = "";
		if (oSuccess) {
			if (oSuccess.ApplyDecision.ActionSuccessful !== 'X') {
				//Approval or rejection of this purchase order is still in process. 
				//Refresh the list of purchase orders manually.
				var sMessage = this.resourceBundle.getText("dialog.refreshMasterListManually");
				var sDetails = null;
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.INFO,
					message: sMessage,
					details: sDetails
				});
			} else {
				//Approval or rejection of this purchase order was successfully proceed. 
				//Refresh the list of purchase orders automatically.
				sSuccessText = this.resourceBundle.getText(this.sTextKey);
				var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.oView),
					oComponent = sap.ui.component(sComponentId);
				var data = {
					bMessageToast: true,
					sMessage: sSuccessText
				};
				//create and open the message toast after the view switch (after automatic select of next work item)  
				oComponent.oEventBus.publish("ui.s2p.mm.purchorder.approve", "selectNextWorkItem", data);
				this.oDataModel.setRefreshAfterChange(true);
			}
		}
	},

	_handleApproveRejectForwardFail: function(oError) {
		this.oDataModel.setRefreshAfterChange(true);
		if (this.oDataModel.hasPendingChanges()) {
			this.oDataModel.refresh(true);
		}
		this._onRequestFailed(oError);
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
			}, jQuery.proxy(that._onRequestFailed, this));
		};
		var fnClose = function(oResult) {
			if (oResult && oResult.bConfirmed) {
				var oSelectedAgent = oResult.oAgentToBeForwarded;
				var sSuccessText = that.resourceBundle.getText("dialog.success.forward", [oSelectedAgent.FullName]);

				var sComment = "";
				if (oResult.sNote) {
					sComment = oResult.sNote;
				}

				that.oDataModel.setRefreshAfterChange(false);
				that.oDataModel.callFunction(
					"Forward",
					"POST", {
						SAP__Origin: sOrigin,
						WorkitemID: sWorkitemID,
						NewApprover: oSelectedAgent.UserId,
						Comment: sComment
					},
					undefined,
					function() {
						var sComponentId = sap.ui.core.Component.getOwnerIdFor(that.oView),
							oComponent = sap.ui.component(sComponentId);
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.SUCCESS,
							message: sSuccessText,
							details: sSuccessText
						}, function() {
							that.oView.unbindElement();
							oComponent.oEventBus.publish("ui.s2p.mm.purchorder.approve", "selectNextWorkItem");
							that.oDataModel.setRefreshAfterChange(true);
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
		var sFilter = "$filter=" + encodeURIComponent("UserID eq '" + sUser + "' and SAP__Origin eq '" + sOrigin + "'");
		this.oDataModel.read("UserDetailsCollection", null, [sFilter], true,
			jQuery.proxy(onRequestSuccess, this),
			jQuery.proxy(this._onRequestFailed, this));
	},

	onVendorPress: function(oEvent) {
		this.onCompanyLaunch(oEvent, "SupplierID");
	},

	onCompanyLaunch: function(oEvent, sRef) {
		var sTitle = this.oApplicationFacade.getResourceBundle().getText("BussinessCard.Supplier");
		var sSupplierId = this.oApplicationFacade.getODataModel().getProperty("SupplierID", this.getView().getBindingContext());

		var oControl = oEvent.getParameters().domRef;
		var sOrigin = this.oView.getBindingContext().getProperty("SAP__Origin");
		var oApplicationFacade = this.oApplicationFacade;
		var sSupplierDetailsCollection = "SupplierDetailCollection(SupplierID='" + sSupplierId + "',SAP__Origin='" + sOrigin + "')";
		var aParam = ["$expand=SupplierContacts"];
		sap.ca.ui.utils.busydialog.requireBusyDialog();
		oApplicationFacade.getODataModel().read(sSupplierDetailsCollection, null, aParam, true, function(oData, response) {
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
			var hasContacts = (oData.SupplierContacts && (oData.SupplierContacts.results.length > 0));
			var oSBCData = {
				title: sTitle,
				imgurl: ui.s2p.mm.purchorder.approve.util.Conversions.businessCardImg(oData.Mime_Type, oData.__metadata.media_src),
				companyname: oData.SupplierName,
				companyphone: oData.WorkPhone,
				companyaddress: oData.AddressString,
				maincontactname: hasContacts ? oData.SupplierContacts.results[0].ContactName : "",
				maincontactmobile: hasContacts ? oData.SupplierContacts.results[0].MobilePhone : oData.WorkPhone,
				maincontactphone: hasContacts ? oData.SupplierContacts.results[0].WorkPhone : oData.WorkPhone,
				maincontactemail: hasContacts ? oData.SupplierContacts.results[0].EMail : oData.EMail
			};
			var oSupplierBusinessCard = new sap.ca.ui.quickoverview.CompanyLaunch(oSBCData);
			oSupplierBusinessCard.openBy(oControl);
		}, function(oError) {
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
		});

	},

	_onRequestFailed: function(oError) {
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
		}, function() {
			var sComponentId = sap.ui.core.Component.getOwnerIdFor(that.oView),
				oComponent = sap.ui.component(sComponentId);
			oComponent.oEventBus.publish("ui.s2p.mm.purchorder.approve", "selectNextWorkItem");
		});
	},

	isMainScreen: function() {
		return true;
	},

	onExit: function() {
		// close open popovers
		if (sap.m.InstanceManager.hasOpenPopover()) {
			sap.m.InstanceManager.closeAllPopovers();
		}
		// close open dialogs
		if (sap.m.InstanceManager.hasOpenDialog()) {
			sap.m.InstanceManager.closeAllDialogs();
		}
	},
	_updateListItem: function(oEvent) {
		var oModel = oEvent.getSource().getModel();
		if (!oModel) {
			return false;
		}
		var sListItem = this.sContext.replace("/WorkflowTaskCollection", "WorkflowTaskCollection");
		sListItem = sListItem.replace("/HeaderDetails", "");

		var sContextDetail = "HeaderDetailCollection(";
		if (oModel.oData[sListItem].SAP__Origin) {
			sContextDetail = sContextDetail + "SAP__Origin='" +
				oModel.oData[sListItem].SAP__Origin +
				"',PoNumber=";
		}
		sContextDetail = sContextDetail + "'" + oModel.oData[sListItem].PoNumber +
			"')";
		if (!oModel.oData[sListItem] || !oModel.oData[sContextDetail]) {
			return false;
		}
		oModel.oData[sListItem].CreatedByID = oModel.oData[sContextDetail].CreatedByID;
		oModel.oData[sListItem].CreatedByName = oModel.oData[sContextDetail].CreatedByName;
		oModel.oData[sListItem].Currency = oModel.oData[sContextDetail].Currency;
		oModel.oData[sListItem].ForwardedByID = oModel.oData[sContextDetail].ForwardedByID;
		oModel.oData[sListItem].ForwardedByName = oModel.oData[sContextDetail].ForwardedByName;
		oModel.oData[sListItem].WiCreatedAt = oModel.oData[sContextDetail].WiCreatedAt;
		oModel.oData[sListItem].Value = oModel.oData[sContextDetail].Value;
	}
});