/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("sap.ca.ui.model.format.QuantityFormat");
jQuery.sap.require("sap.ca.ui.model.type.Date");
jQuery.sap.require("ui.s2p.mm.ses.approve.util.Formatter");
jQuery.sap.require("ui.s2p.mm.ses.approve.util.QuickView");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.ses.approve.view.S3", {

	onInit: function() {
		var view = this.getView();
		var that = this;

		var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());

		// initialize global objects once
		if (!this.oApplication) {
			this.oApplication = sap.ca.scfld.md.app.Application.getImpl();
			this.oResourceBundle = this.oApplication.getResourceBundle();
			this.oDataModel = this.oApplicationFacade.getODataModel();
			//Encapsulate all oData calls into $batch-POST-requests 
			//		    this.oDataModel.setUseBatch(true);	    

			this.bBusinessCardLoadRequested = false;
			this.oBusinessCard = {
				bLoadRequested: false,
				sCreatedByModel: "createdBy",
				oPressedControll: null
			};
		}

		this.setupNotes();

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "detail") {
				var context = new sap.ui.model.Context(view.getModel(), '/' + oEvent.getParameter("arguments").contextPath);
				view.setBindingContext(context);
				// Make sure the master is here
				view.setModel(view.getModel(), "sesHeaderDetail");
				view.bindElement("sesHeaderDetail>" + context.getPath() + "/SESHeaderDetails", {
					expand: "SESItems,SESAccountings,Attachments,Notes"
				});

				// attach the onS3DataLoaded event
				var oBinding = view.getElementBinding("sesHeaderDetail");
				oBinding.attachDataReceived(this.onS3DataLoaded, this);

				var oComponent = sap.ui.component(sComponentId);
				oComponent.oEventBus.subscribe("ui.s2p.mm.ses.approve", "S2DataReceived",
					this.handleS2DataReceived, this);

				// clear the notes
				this.clearNotes(true);
				this.handleS2DataReceived();
			}
		}, this);

		this.oHeaderFooterOptions = {
			oPositiveAction: {
				sI18nBtnTxt: "BUTTON_APPROVE_S3",
				onBtnPressed: jQuery.proxy(that.handleApprove, that)
			},

			oNegativeAction: {
				sI18nBtnTxt: "BUTTON_REJECT_S3",
				onBtnPressed: jQuery.proxy(that.handleReject, that)
			},

			oAddBookmarkSettings: {
				icon: "sap-icon://home"
			}
			/*
						oEmailSettings : {
							sSubject : this.oApplicationFacade.getResourceBundle().getText("EMAIL_SUBJECT"),
							sRecepient : "do.not.reply@sap.com",
							fGetMailBody : function() {
								return "This is a very important mail for you";
							}
						}
			*/
		};
		this.setHeaderFooterOptions(this.oHeaderFooterOptions);
	},

	getHeaderFooterOptions: function() {
		return this.oHeaderFooterOptions;
	},

	handleS2DataReceived: function(oEvent) {
		var oWorkItem = this.getView().getModel().getProperty(this.getView().getBindingContext().getPath());
		if (oWorkItem) {
			if (oWorkItem.NextRejectCode === "") {
				this.oHeaderFooterOptions.oNegativeAction.bDisabled = true;
			} else {
				this.oHeaderFooterOptions.oNegativeAction.bDisabled = false;
			}
			if (oWorkItem.NextReleaseCode === "") {
				this.oHeaderFooterOptions.oPositiveAction.bDisabled = true;
			} else {
				this.oHeaderFooterOptions.oPositiveAction.bDisabled = false;
			}
			this.setHeaderFooterOptions(this.oHeaderFooterOptions);
		}
	},

	handleUpdateFinished: function(oEvent) {
		if ((oEvent.getParameter("reason") === "Binding") ||
			(oEvent.getParameter("reason") === "Refresh") ||
			(oEvent.getParameter("reason") === "Change")) {
			// adjust the header text
			var sHeaderText = oEvent.getSource().getHeaderText();
			var nIndexTo = sHeaderText.indexOf('(');
			sHeaderText = sHeaderText.substring(0, nIndexTo) + '(' + oEvent.getParameter("total") + ")";
			oEvent.getSource().setHeaderText(sHeaderText);
		}
	},

	handleNavToSubDetail: function(oEvent) {
		this.oRouter.navTo("subDetail", {
			contextPath: oEvent.getSource().getBindingContext("sesHeaderDetail").getPath().substr(1),
			backPath: oEvent.getSource().getBindingContext().getPath().substr(1)
		}, true);
	},

	onBack: function() {
		window.history.back();
	},

	// Is called when the data displayed at the S3 screen has been loaded
	onS3DataLoaded: function(oEvent) {
		var oModel = this.getView().getModel("sesHeaderDetail");
		var oContext = this.getView().getBindingContext("sesHeaderDetail");
		if (oContext && oModel) {
			this.bindAttachments(oModel, oContext);
			this.bindNotes(oModel, oContext);
		}
	},

	// Is called when the data displayed at the S3 screen has been loaded
	onBusinessCardDataLoaded: function(oEvent) {
		var oModel = this.getView().getModel("createdBy");

		if (this.oBusinessCard.bLoadRequested) {
			//launch business card only if data was loaded successfully
			if (oModel.getProperty(oEvent.getSource().getPath())) {
				ui.s2p.mm.ses.approve.util.QuickView.EmployeeLaunch(this.oBusinessCard.oPressedControll, this, this.oBusinessCard.sCreatedByModel);
			}
		}
		this.oBusinessCard.bLoadRequested = false;
	},

	// insert new functions from here
	onPurchaseOrderLinkPress: function() {

	},

	onCreatedByLinkPress: function(oEvent) {
		//		ui.s2p.mm.ses.approve.util.QuickView.EmployeeLaunch(oEvent.getSource(), this,  this.oBusinessCard.sCreatedByModel );
		this.oBusinessCard.oPressedControll = oEvent.getSource();
		var oWorkitem = oEvent.getSource().getBindingContext().getObject();
		// we need no oObject, because the work item is used as default if the oObect is undefined
		this.launchBusinessCard(oWorkitem.CreatedByID);
	},

	onNoteCreatedByLinkPress: function(oEvent) {
		this.oBusinessCard.oPressedControll = oEvent.getSource()._oLinkControl;
		var oNotes = oEvent.getSource().getBindingContext("NotesModel").getObject();
		this.launchBusinessCard(oNotes.CreatedByUser, oNotes);
	},

	launchBusinessCard: function(sUserID, oObject) {
		var oBusinessCard = null;
		if (!this.getView().getBindingContext(this.oBusinessCard.sCreatedByModel)) {
			// No business card was fetched before, do it now
			this.readBusinessCard(oObject);
		} else {
			oBusinessCard = this.getView().getBindingContext(this.oBusinessCard.sCreatedByModel).getObject();
			if (oBusinessCard.UserID !== sUserID) {
				// first we have to read the BusinessCard
				this.readBusinessCard(oObject);
			}
		}

		if (this.getView().getBindingContext(this.oBusinessCard.sCreatedByModel)) {
			// business card was fetched before
			// check if data was loaded
			oBusinessCard = this.getView().getBindingContext(this.oBusinessCard.sCreatedByModel).getObject();
			if (oBusinessCard.UserID === sUserID) {
				this.oBusinessCard.bLoadRequested = false;
				ui.s2p.mm.ses.approve.util.QuickView.EmployeeLaunch(this.oBusinessCard.oPressedControll, this, this.oBusinessCard.sCreatedByModel);
			}
		}
	},

	readBusinessCard: function(oObject) {
		this.oBusinessCard.bLoadRequested = true;
		ui.s2p.mm.ses.approve.util.QuickView.setCreatedByModel(this.getView(), oObject);
		// attach the onBusinessCardDataLoaded event
		var oBinding = this.getView().getElementBinding(this.oBusinessCard.sCreatedByModel);
		oBinding.attachDataReceived(this.onBusinessCardDataLoaded, this);

		//var oModel = this.getView().getModel("createdBy");
		//oModel.attachRequestFailed(this.onRequestFailed);
	},

	// ---------------------------------------------------------------------------------
	// Attachments
	// ---------------------------------------------------------------------------------
	buildFileDescriptorObject: function(value) {
		var oFile;
		oFile = {
			name: value.FileName,
			size: value.FileSize,
			url: value.__metadata.media_src, //ui.s2p.mm.ses.approve.util.Formatter.formatMediaURL(value.__metadata.media_src),
			uploadedDate: value.CreatedOn,
			contributor: value.CreatedByUserName,
			mimeType: value.MimeType,
			fileId: value.AttachmentGuid
		};
		return oFile;
	},

	bindAttachments: function(oModel, oContext) {
		// Get attachments from model
		var sPath = oContext.getPath() + "/Attachments";
		var aAttachments = oModel.getProperty(sPath);
		var oAttachmentModel = {
			Attachments: []
		};

		// Build model for FileUpload control
		var oAttachment;
		var oFileDescription;
		for (var i = 0; i < aAttachments.length; i++) {
			oAttachment = oModel.getProperty("/" + aAttachments[i]);
			oFileDescription = this.buildFileDescriptorObject(oAttachment);
			oAttachmentModel.Attachments.push(oFileDescription);
		}

		// Set the model to the control
		this.byId("idFileUpload").setModel(new sap.ui.model.json.JSONModel(oAttachmentModel));
	},

	// ---------------------------------------------------------------------------------
	// Notes
	// ---------------------------------------------------------------------------------
	bindNotes: function(oModel, oContext) {
		// Get attachments from model
		var sPath = oContext.getPath() + "/Notes";
		var aNotes = oModel.getProperty(sPath);

		this.bNotesRead = true;
		var oNotes = {
			Notes: []
		};

		var oNode;
		for (var i = 0; i < aNotes.length; i++) {
			oNode = oModel.getProperty("/" + aNotes[i]);
			oNotes.Notes.push(oNode);
		}
		oNotes.notesExist = (oNotes.Notes.length > 0) ? true : false;
		this.oNotesModel.setData(oNotes);
	},

	onNotesReadSuccess: function(oData) {
		this.bNotesRead = true;
		var oNotes = {
			Notes: []
		};

		for (var i = 0; i < oData.results.length; i++) {
			oNotes.Notes.push(oData.results[i]);
		}
		oNotes.notesExist = (oNotes.Notes.length > 0) ? true : false;
		this.oNotesModel.setData(oNotes);
	},

	setupNotes: function() {
		this.bNotesRead = false;
		var oNotes = {
			notesExist: false,
			Notes: []
		};
		this.oNotesModel = new sap.ui.model.json.JSONModel(oNotes);
		this.getView().setModel(this.oNotesModel, "NotesModel");
	},

	clearNotes: function() {
		this.bNotesRead = false;
		var oNotes = {
			Notes: []
		};
		oNotes.notesExist = false;
		oNotes.Notes = [];
		this.oNotesModel.setData(oNotes);
	},

	handleAddNote: function(oEvent) {},

	// ---------------------------------------------------------------------------------
	// Approve/Reject
	// ---------------------------------------------------------------------------------
	getConfirmationText: function(sMessageText) {
		var msgText = sMessageText;
		var sSESDescription = this.getView().getBindingContext().getProperty("Description");
		var sCreatedByName = this.getView().getBindingContext().getProperty("CreatedByName");
		var sSESNumber = this.getView().getBindingContext().getProperty("SESNumber");

		var sDoubleQuote = String.fromCharCode(34);
		sSESDescription = sDoubleQuote + sSESDescription + sDoubleQuote + " (" + sSESNumber + ")";

		msgText = msgText.replace("{0}", sSESDescription);
		msgText = msgText.replace("{1}", sCreatedByName);

		return msgText;
	},

	handleApprove: function() {
		this.oWorkItem = this.getView().getModel().getProperty(this.getView().getBindingContext().getPath());
		this.bApprove = true;
		// open the confirmation dialog
		sap.ca.ui.dialog.confirmation.open({
			question: this.getConfirmationText(this.getView().getModel("i18n").getResourceBundle().getText("MSGBX_APPROVE_TEXT")),
			showNote: false,
			title: this.getView().getModel("i18n").getResourceBundle().getText("MSG_APPROVE_TITLE"),
			confirmButtonLabel: this.getView().getModel("i18n").getResourceBundle().getText("BUTTON_YES_S3")
		}, jQuery.proxy(this.executeApproveReject, this));
	},

	handleReject: function() {
		this.oWorkItem = this.getView().getModel().getProperty(this.getView().getBindingContext().getPath());
		this.bApprove = false;
		// open the confirmation dialog
		sap.ca.ui.dialog.confirmation.open({
			question: this.getConfirmationText(this.getView().getModel("i18n").getResourceBundle().getText("MSGBX_REJECT_TEXT")),
			showNote: true,
			title: this.getView().getModel("i18n").getResourceBundle().getText("MSG_REJECT_TITLE"),
			confirmButtonLabel: this.getView().getModel("i18n").getResourceBundle().getText("BUTTON_YES_S3")
		}, jQuery.proxy(this.executeApproveReject, this));
		// Limit note length to 255 characters
		// Confirmation control currently supports no character limitation
		var textarea = sap.ui.getCore().byId('CA_VIEW_CONFIRM--TXA_NOTE');
		if (textarea) {
			textarea.setMaxLength(255);
		}
	},

	executeApproveReject: function(oResult) {
		if (oResult.isConfirmed) {
			var oParameters = {};

			if (this.oWorkItem.SAP__Origin) {
				oParameters.SAP__Origin = this.oWorkItem.SAP__Origin;
			}
			oParameters.SESNumber = this.oWorkItem.SESNumber;

			if (this.bApprove) {
				// Approve 
				oParameters.ReleaseCode = this.oWorkItem.NextReleaseCode;
				this.sTextKey = "MSGTX_SUCCESSFUL_APPROVE";
				this.oDataModel.setRefreshAfterChange(false);
				this.oDataModel.callFunction("approveServiceEntrySheet",
					"POST", {
						SAP__Origin: this.oWorkItem.SAP__Origin,
						SESNumber: this.oWorkItem.SESNumber,
						ReleaseCode: this.oWorkItem.NextReleaseCode
					},
					undefined,
					jQuery.proxy(this.approveRejectSuccessCallback, this),
					jQuery.proxy(this.onRequestFailed, this)
				);
			} else {
				// Reject   
				oParameters.ReleaseCode = this.oWorkItem.NextRejectCode;
				oParameters.RejectDescription = "";
				if (oResult.sNote) {
					oParameters.RejectDescription = oResult.sNote;
				}
				this.sTextKey = "MSGTX_SUCCESSFUL_REJECT";
				this.oDataModel.setRefreshAfterChange(false);
				this.oDataModel.callFunction("rejectServiceEntrySheet",
					"POST", {
						SAP__Origin: this.oWorkItem.SAP__Origin,
						SESNumber: this.oWorkItem.SESNumber,
						ReleaseCode: this.oWorkItem.NextRejectCode,
						RejectionText: oParameters.RejectDescription
					},
					undefined,
					jQuery.proxy(this.approveRejectSuccessCallback, this),
					jQuery.proxy(this.onRequestFailed, this)
				);
			}
		}
	},

	approveRejectSuccessCallback: function() {
		var sText = this.getConfirmationText(this.oResourceBundle.getText(this.sTextKey));

		// Publish event Approve/Reject via event bus
		var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
		var oComponent = sap.ui.component(sComponentId);

		// Release the binding of current view, otherwise a model refresh will try
		// to retrieve data of an invalid workitem if the last workitem of the
		// master list was removed
		this.getView().unbindElement();

		oComponent.oEventBus.publish("ui.s2p.mm.ses.approve", "asesApproveRejectForward");

		// Update the model when the event has ben handled (a new item in the S2
		// list has been selected now)
		this.oDataModel.setRefreshAfterChange(true);
		this.oDataModel.refresh(true);

		sap.ca.ui.message.showMessageToast(sText);
	},

	// Common error handler
	onRequestFailed: function(oError) {
		var oMessage = jQuery.parseJSON(oError.response.body);
		var sMsgText = oMessage.error.message.value;
		if (oMessage.error.innererror.errordetails.length >= 0) {
			sMsgText = oMessage.error.innererror.errordetails[0].message;
		}
		sap.ca.ui.message.showMessageBox({
			type: sap.ca.ui.message.Type.ERROR,
			//          message: oMessage.error.message.value,
			message: sMsgText,
			details: oError.response.body
		});
	}
});