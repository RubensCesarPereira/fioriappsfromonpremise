/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
/*global history */
sap.ui.define([
	
	"zsm/itsm/myreq/cust/view/BaseController",
	"sap/ui/core/routing/History",
	"zsm/itsm/myreq/cust/util/Util",
	"sap/m/MessageBox"
], function(BaseController, History, Util, MessageBox) {
	"use strict";

	return BaseController.extend("zsm.itsm.myreq.cust.view.Create", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		_sIdentity: "zsm.itsm.myreq.cust",
		onInit: function() {
            var that = this;
            
            var oModel = this.getOwnerComponent().getModel("createRequest"); 
            this.getView().setModel(oModel);

			 this.getRouter().attachRoutePatternMatched(function(oEvent) {
				// when create navigation occurs, initialize  the create form
				if (oEvent.getParameter("name") === "toCreate") {
					that.initializeCreateForm();
					// Set default Priority
					that.setDefaultPriority();
				}
			});
			
			//get  Controls
			this.oTitleControl = this.byId("ShortTextInput");
			this.oPrioSelect = this.byId("PrioritySelect");
			this.oDescriptionTextArea = this.byId("DescriptionTextArea");
			this.oComponentInput = this.byId("ComponentInput");
			this.aFilterStack = [];
			this.mClearModel = false;

			this.jModel = new sap.ui.model.json.JSONModel({
				title: "",
				component: "",
				description: ""
			});

			this.oTitleControl.setModel(this.jModel);
			this.oComponentInput.setModel(this.jModel);
			this.oDescriptionTextArea.setModel(this.jModel);

			// attach handlers for validation errors
			sap.ui.getCore().attachValidationError(function(evt) {
				var control = evt.getParameter("element");
				if (control && control.setValueState) {
					control.setValueState("Error");
				}
			});
			// sap.ui.getCore().attachValidationSuccess(function(evt) {
			// 	var control = evt.getParameter("element");
			// 	if (control && control.setValueState) {
			// 		control.setValueState("None");
			// 	}
			// });

			/**    
			 * @ControllerHook [Hook to update/initialize ]
			 *
			 * This hook is called in the onInit method of the create controller
			 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookCreateOnInit
			 * @param {sap.ca.scfld.md.controller.ScfldMasterController} Create View Controller
			 * @return {void}  ...
			 */
			if (this.extHookCreateOnInit) { // check whether any extension has implemented the hook...
				this.extHookCreateOnInit(this); // ...and call it
			}

        },
        
		onCatTitleClicked: function(oEvent) {
			var oCtx = oEvent.getSource().getBindingContext();
			var oDetailPage = sap.ui.core.Fragment.byId("categoryPopover", "master");
			var oEntity = oDetailPage.getModel().getData(oCtx.getPath(), oCtx);
			var oInput = this.byId("CategoryInput");
			oInput.setValue(oEntity.CategoryDescription);
			oInput.data("CategoryId", oEntity.CategoryId);
			oInput.data("CategoryCatalogType", oEntity.CategoryCatalogType);
            oInput.data("CategoryAspId", oEntity.CategoryAspId);
			oInput.setValueState("None");
			this._oPopover.close();
			this.destroyPopover();
		},        

		initializeCreateForm: function() {
			this.jModel.setData({
				title: "",
				component: "",
				description: ""
			});

			var inputs = [
				this.oComponentInput,
				this.oTitleControl,
				this.oDescriptionTextArea
			];

			jQuery.each(inputs, function(i, input) {
				input.setValue("");
				input.setValueState("None");
			});

		},


		onAfterRendering: function() {
			this.initializeCreateForm();
		},
        onChange: function(oEvent) {
			//r oView = this.getView();
			var oModel = this.getModel();
			var oUploadCollection = oEvent.getSource();

			var token = this.sToken || oModel.getSecurityToken();

			// If filename exceeds 40 characters, trim it
			var filename = oEvent.getParameter("mParameters").files[0].name;
			if (filename.length > 40) {
				var aFilenameParts = filename.split(".");
				if (aFilenameParts.length === 1) {
					filename = filename.substring(0, 40);
				} else {
					var filenameExtension = aFilenameParts[aFilenameParts.length - 1];
					aFilenameParts = aFilenameParts.slice(0, aFilenameParts.length - 1);
					var remainingCharacters = 39 - filenameExtension.length;
					filename = aFilenameParts.join(".").substring(0, remainingCharacters) + "." + filenameExtension;
				}
			}
			/* eslint-disable JS_ODATA_MANUAL_TOKEN */
			// Header Token
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: token
			});
			/* eslint-enable JS_ODATA_MANUAL_TOKEN */
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);

			// Header Content-Disposition
			var oCustomerHeaderContentDisp = new sap.m.UploadCollectionParameter({
				name: "content-disposition",
				value: "inline; filename=\"" + encodeURIComponent(filename) + "\""
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderContentDisp);
		},

		getXsrfToken: function() {
			var sToken = this.getView().getModel().getHeaders()["x-csrf-token"];
			if (!sToken) {

				this.getView().getModel().refreshSecurityToken(
					function(e, o) {
						sToken = o.headers["x-csrf-token"];
					},
					function() {
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: this.bundle.getText("XSRF_TOKEN_ERROR"),
							details: ""
						});
					},
					false);
			}
			return sToken;
		},
		onUploadComplete: function(oEvent) {
			var that = this;

			if (oEvent.getParameters().getParameter("status") === 400) // Bad request
			{
				var errorMsg = $($.parseXML(oEvent.getParameters().getParameter("responseRaw"))).find("message").text();
				//util.Util.oDataServiceErrorHandling(this, this.bundle, response, this.bundle.getText("TEXT_POST_FAILURE"));
				Util.showErrorMessageBox(that.bundle, "ERROR_CONTACT_SYSADMIN", "ATTACHMENT_UPLOAD_ERROR", null, errorMsg); //function(resourceBundle, message, messageTitle, goBack, details)
			}

			this.numberOfAttachmentsToUpload = this.numberOfAttachmentsToUpload - 1;

			if (this.numberOfAttachmentsToUpload === 0) {

				this.postProcessSave();

			}

		},

		postProcessSave: function() {
			this._dialog.close();
             location.reload(); 
		//	if (Util.hasCreateListener()) {

		//		this.eventBus.publish("zsm.itsm.myreq.cust", "afterCreate", {
		//			objectId: this._oView.createdObjectId,
		//			objectGuid: this._oView.createdGuid
		//		});
		//	} else {

				// Navigate per default to MyIncidents App (if exists)
				// Otherwise back to Launchpad
		//		if (Util.myIncidentsAvailable) {
		//			Util.navToMyIncidents(this._oView.createdGuid);
		//		} else {
		//			Util.navToLaunchpad();
		//		}

		//	}
		},

		onSave: function() {
	
			var oComponentData = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView())).getComponentData();
            var sStringPType = "";
			// if (typeof oComponentData.startupParameters.PROCESS_TYPE !== "undefined") {
			// 	var pPType = oComponentData.startupParameters.PROCESS_TYPE[0];
			// 	sStringPType = pPType.toString();
			// }

			//      Get access to View
			var oView = this.getView();
			//      Get Process Type
			var sValueProcessType = this.sValueProcessType;

			//      If parameter is provided we will ignore the select field
			if (sStringPType !== "") {
				sValueProcessType = sStringPType;
			}
            sValueProcessType = "ZMRQ";

			//      Get value in Input Field
			var sValueDescription = oView.byId("DescriptionTextArea").getValue();
			var sValueShortText = oView.byId("ShortTextInput").getValue();
			var sValueCategory = oView.byId("CategoryInput").data("CategoryId");
            var sValueCategoryCategoryCatalogType = oView.byId("CategoryInput").data("CategoryCatalogType");
            var sValueCategoryAspId = oView.byId("CategoryInput").data("CategoryAspId");			
			var sValueComponent = oView.byId("ComponentInput").getValue();

			if (oView.byId("ConfigItemInput").data("type")) {
				var sValueConfigItem = oView.byId("ConfigItemInput").data("type");
			}

			if (oView.byId("ContactPerson").data("type")) {
				this.sValueContactPerson = oView.byId("ContactPerson").data("type");
			}

			var sValuePriority = oView.byId("PrioritySelect").getSelectedKey();

			var inputsToCheckForMandatoryInput = [
				oView.byId("ShortTextInput"),
				oView.byId("CategoryInput")
			];

			var inputsToCheckForValidation = [
				oView.byId("ConfigItemInput"),
				oView.byId("ContactPerson")
			];

			var inputsToCheckForErrorState = [
				oView.byId("ShortTextInput"),
				oView.byId("CategoryInput"),
				oView.byId("ConfigItemInput"),
				oView.byId("ContactPerson")
			];


			// check that inputs are not empty
			// this does not happen during data binding as this is only triggered by changes
			jQuery.each(inputsToCheckForMandatoryInput, function(i, input) {
				if (!input.getValue()) {
					input.setValueState("Error");
				}
			});

			// jQuery.each(inputsToCheckForValidation, function(i, input) {
			// 	if (input.getValue()) {
			// 		if (!input.data("type")) {
			// 			input.setValueState("Error");
			// 		}

			// 	}

			// });

			// check states of inputs
			var canContinue = true;

			jQuery.each(inputsToCheckForErrorState, function(i, input) {
				if (input.getValueState() === "Error") {
					canContinue = false;
					return false;
				}
			});

			if (!canContinue) {
				MessageBox.alert(this.getView().getModel("i18n").getResourceBundle().getText("COMPLETE_INPUT"));
				return;

			}

			// jQuery.each(inputsToValidate, function(i, input) {

			// 	input.fn(input.input.getValue(),oView.getModel());

			// });

			// 		while (oView.getModel().hasPendingRequests()) {
			//     	jQuery.log("still running");
			// }

			var oUploadCollection = this.getView().byId("fileUpload");

			this.numberOfAttachmentsToUpload = oUploadCollection.getItems().length;
			//oUploadCollection.upload();

			this._dialog = Util.getBusyDialog("busyPopoverSave", this.getView().getModel("i18n").getResourceBundle().getText(
				"CREATING_IN_PROGRESS"), this.getView(), this);
			this._dialog.setTitle(this.getView().getModel("i18n").getResourceBundle().getText(
				"CREATING_IN_PROGRESS"));
			this._dialog.open();

			//      Define entity var for message for OData as Json
			var entity = {
				ProcessType: sValueProcessType,
				Description: sValueShortText,
				LongText: sValueDescription,
				Priority: sValuePriority,
				SAPComponent: sValueComponent,
				CategoryCatalogType: sValueCategoryCategoryCatalogType,
				CategoryAspectId: sValueCategoryAspId,
				CategoryId: sValueCategory,
				ConfigurationItemId: sValueConfigItem,
				Partner2: this.sValueContactPerson
			};

			/**    
			 * @ControllerHook [Hook to change entity data before Creation]
			 *
			 * This hook is called before the Incident is created
			 * This happens after the selection of the Create Button
			 * @callback zsm.itsm.createrequirement.cust.view.Details~extHookOnBeforeCreateIncident
			 * @param {array} Incident Data
			 * @return {void}  ...
			 */
			if (this.extHookOnBeforeCreateIncident) { // check whether any extension has implemented the hook...
				this.extHookOnBeforeCreateIncident(entity); // ...and call it
			}

			this.getView().getModel().create("/IncidentSet", entity, {
				success: jQuery.proxy(function(mResponse) {
				//	this._oView.createdGuid = mResponse.Guid;
				//	this._oView.createdObjectId = mResponse.ObjectId;
					sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText(
				"CREATED_NEW_INCIDENT") + " '" + mResponse.ObjectId + "' ");

					// Also Upload Attachments
					if (this.numberOfAttachmentsToUpload >= 1) {

						// construct Upload URL from response GUID 
						var uploadURL = this.getView().getModel().sServiceUrl + "/IncidentSet(guid'" + mResponse.Guid + "')" + "/AttachmentSet";
						$.each(oUploadCollection._aFileUploadersForPendingUpload, function(index, value) {
							oUploadCollection._aFileUploadersForPendingUpload[index].setProperty("uploadUrl", uploadURL);
						});

						if (this.numberOfAttachmentsToUpload === 1) {
							this._dialog.setTitle(this.getView().getModel("i18n").getResourceBundle().getText("ATTACHMENT_IN_PROGRESS"));
						} else {
							this._dialog.setTitle(this.getView().getModel("i18n").getResourceBundle().getText("ATTACHMENTS_IN_PROGRESS"));
						}
						oUploadCollection.upload();
					} else {
						this.postProcessSave();
					}

				}, this),

				error: jQuery.proxy(function() {
					sap.m.MessageToast.show("Error posting Incident!");
					this._dialog.close();
				}, this)

			});

        },
        
		// for the fast search in the business partner fields
		handleSuggest: function(oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");
			var aFilters = [];
			if (sTerm.value !== "") {
				aFilters.push(new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sTerm));
				oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
			}
		},

		// used to fill the custom data 'type into the Contact Person field input field so we can read it later	
		suggestionItemSelected: function(oControlEvent) {
			var oSelectedItem = oControlEvent.getParameters("selectedItem");
			var oSelected = oSelectedItem.selectedItem;
			var sBp = oSelected.data("type");
			var oView = this.getView();
			var oInput = oView.byId("ContactPerson");
			oInput.data("type", sBp);
			this.sValueContactPerson = sBp;
			oInput.setValueState(sap.ui.core.ValueState.None);
		},

		// for the fast search in the config item field
		CIhandleSuggest: function(oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");
			var aFilters = [];
			if (sTerm.value !== "") {
				aFilters.push(new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sTerm));
				oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
			}
		},

		// used to fill the config Item input field
		CIsuggestionItemSelected: function(oControlEvent) {
			var oSelectedItem = oControlEvent.getParameters("selectedItem");
			var oSelected = oSelectedItem.selectedItem;
			var sCItem = oSelected.data("type");
			var oView = this.getView();
			var oInput = oView.byId("ConfigItemInput");
			oInput.data("type", sCItem);
			this.sValuesCItem = sCItem;
			oInput.setValueState(sap.ui.core.ValueState.None);
		},

		onShortTextLiveChange: function() {

			if (this.getView().byId("ShortTextInput").getValue().length < 1 || this.getView().byId("ShortTextInput").getValue().length > 40)

			{
				this.getView().byId("ShortTextInput").setValueState("Error");
			} else {
				this.getView().byId("ShortTextInput").setValueState("None");
			}

		},

		
		getUI2ODataWrapper: function() {
			var
				sBaseUrl = "/sap/opu/odata/UI2/INTEROP/",
				oDataWrapper;

				jQuery.sap.require("sap.ui2.srvc.ODataWrapper");
				jQuery.sap.require("sap.ui2.srvc.ODataService");
				oDataWrapper = new sap.ui2.srvc.ODataWrapper(sBaseUrl, this);
				sap.ui2.srvc.ODataService.call(this, oDataWrapper, function() {
					return false;
				});
			return oDataWrapper;
		},

		onNavToNextLevel: function(oEvent) {
			var oCtx = oEvent.getSource().getBindingContext();
			//var oNavCon = sap.ui.core.Fragment.byId("componentPopover", "navCon");
			var oDetailPage = sap.ui.core.Fragment.byId("componentPopover", "master");
			var oEntity = oDetailPage.getModel().getData(oCtx.getPath(), oCtx);

			var oListDetail = sap.ui.core.Fragment.byId("componentPopover", "PopoverList");
			var listBinding = oListDetail.getBinding("items");
			var oFilter = new sap.ui.model.Filter("CompID", sap.ui.model.FilterOperator.EQ, oEntity.CompID);
			this.aFilterStack.unshift(oFilter);

			if (this.aFilterStack.length >= 1) {
				oDetailPage.setShowNavButton(true);
			}

			jQuery.sap.delayedCall(100, this, function() {
				listBinding.filter([oFilter]);
			});

			//	oDetailPage.bindElement(oCtx.getPath());
		},

		// onTextAreaLiveChange: function() {

		// 	if (this.oDescriptionTextArea.getValue().length < 1) {
		// 		this.oDescriptionTextArea.setValueState("Error");
		// 	} else {
		// 		this.oDescriptionTextArea.setValueState("None");
		// 	}

		// },

		onTitleInputLiveChange: function() {

			if (this.oTitleControl.getValue().length < 1 || this.oTitleControl.getValue().length > 40)

			{
				this.oTitleControl.setValueState("Error");
			} else {
				this.oTitleControl.setValueState("None");
			}

		},

		onChangePriority: function() {

			if (this.oPrioSelect.getSelectedKey !== 1)

			{
				this.oComponentInput.setValueState("None");
			}

		},

		onComponentValueHelp: function(oEvent) {

			this._oPopover = sap.ui.xmlfragment("componentPopover", "zsm.itsm.myreq.cust.view.fragments.ComponentPopover", this);
			this._oPopover.setModel(this.getView().getModel());
			this._oPopover.setModel(this.getOwnerComponent().getModel("i18n"), "i18n");

			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oPopover);

			var oDetailPage = sap.ui.core.Fragment.byId("componentPopover", "master");
			if (this.aFilterStack.length === 0) {
				oDetailPage.setShowNavButton(false);
			}

			// check if entry already exists to enable/disable "clear" button.
			var oClearButton = sap.ui.core.Fragment.byId("componentPopover", "clearButton");
			if (!oEvent.getSource().getValue()) {
				oClearButton.setEnabled(false);
			} else {
				oClearButton.setEnabled(true);
			}

			this._oPopover.open();

		},

		onComponentSearch: function(oEvent) {
			var searchedValue = oEvent.getParameter("newValue");
			var oListDetail = sap.ui.core.Fragment.byId("componentPopover", "PopoverList");
			var listBinding = oListDetail.getBinding("items");
			var oDetailPage = sap.ui.core.Fragment.byId("componentPopover", "master");
			if (searchedValue.length > 1) {
				//	var oDetailPage = sap.ui.core.Fragment.byId("componentPopover", "master");
				//var oEntity = oDetailPage.getModel().getData(oCtx.getPath(), oCtx);

				oDetailPage.setShowNavButton(false);
				this.aFilterStack = [];
				var oFilter = new sap.ui.model.Filter("CompID", sap.ui.model.FilterOperator.Contains, searchedValue);
				jQuery.sap.delayedCall(0, this, function() {
					listBinding.filter([oFilter]);
				});
			} else if (searchedValue.length === 0) {
				var oFilter2 = new sap.ui.model.Filter("CompID", sap.ui.model.FilterOperator.Contains, searchedValue);
				jQuery.sap.delayedCall(0, this, function() {
					listBinding.filter([oFilter2]);
				});
			}
		},

		onCompTitleClicked: function(oEvent) {
			var oCtx = oEvent.getSource().getBindingContext();
			var oDetailPage = sap.ui.core.Fragment.byId("componentPopover", "master");
			var oEntity = oDetailPage.getModel().getData(oCtx.getPath(), oCtx);
			var oInput = this.byId("ComponentInput");
			oInput.setValue(oEntity.CompID);
			oInput.setValueState("None");
			this._oPopover.close();
			this.destroyPopover();

			//	oDetailPage.bindElement(oCtx.getPath());
		},

		onCompPopoverClear: function() {
			this._oPopover.close();
			this.destroyPopover();
			var oInput = this.byId("ComponentInput");
			oInput.setValue("");
			oInput.setValueState("None");

		},

		// onNavButtonPressCreate: function() {
		// 	if (sap.ui.Device.system.phone) {
		// 		this.oRouter.navTo("master");
		// 	} else {
		// 		this.oRouter.navTo("toDetail", true);
		// 	}
		// },

		onNavButtonPress: function() {
			var oDetailPage = sap.ui.core.Fragment.byId("componentPopover", "master");
			var oListDetail = sap.ui.core.Fragment.byId("componentPopover", "PopoverList");
			var listBinding = oListDetail.getBinding("items");

			if (this.aFilterStack.length > 1) {
				this.aFilterStack.shift();
				listBinding.filter([this.aFilterStack[0]]);
			} else {
				var oInitialFilter = [];
				oDetailPage.setShowNavButton(false);
				this.aFilterStack.shift();
				listBinding.filter(oInitialFilter);
			}
		},
		onPopoverCancel: function() {
			this._oPopover.close();
			this.destroyPopover();

		},

		onPopoverAfterClose: function() {

			this.destroyPopover();
		},

		destroyPopover: function() {

			//component Popover
			if (sap.ui.core.Fragment.byId("componentPopover", "compPopoverList")) {
				sap.ui.core.Fragment.byId("componentPopover", "compPopoverList").destroy();
			}
			if (sap.ui.core.Fragment.byId("componentPopover", "closeButton")) {
				sap.ui.core.Fragment.byId("componentPopover", "closeButton").destroy();
			}

			if (sap.ui.core.Fragment.byId("componentPopover", "searchField")) {
				sap.ui.core.Fragment.byId("componentPopover", "searchField").destroy();
			}

			if (sap.ui.core.Fragment.byId("componentPopover", "componentListItem")) {
				sap.ui.core.Fragment.byId("componentPopover", "componentListItem").destroy();
			}

			if (sap.ui.core.Fragment.byId("componentPopover", "master")) {
				sap.ui.core.Fragment.byId("componentPopover", "master").destroy();
			}

			//category Popover
			if (sap.ui.core.Fragment.byId("categoryPopover", "catPopoverList")) {
				sap.ui.core.Fragment.byId("categoryPopover", "catPopoverList").destroy();
			}
			if (sap.ui.core.Fragment.byId("categoryPopover", "closeButton")) {
				sap.ui.core.Fragment.byId("categoryPopover", "closeButton").destroy();
			}

			if (sap.ui.core.Fragment.byId("componentPopover", "searchField")) {
				sap.ui.core.Fragment.byId("componentPopover", "searchField").destroy();
			}

			if (sap.ui.core.Fragment.byId("categoryPopover", "categoryListItem")) {
				sap.ui.core.Fragment.byId("categoryPopover", "categoryListItem").destroy();
			}

			if (sap.ui.core.Fragment.byId("categoryPopover", "master")) {
				sap.ui.core.Fragment.byId("categoryPopover", "master").destroy();
			}

			// if (this._oPopover) {
			// 	this._oPopover.destroy();
			// } 

			this.aFilterStack = [];

		},

		onAfterModelUpdate: function() {
			this._dialog.close();
		},
		onCategoryValueHelp: function(oEvent) {
			this._oPopover = sap.ui.xmlfragment("categoryPopover", "zsm.itsm.myreq.cust.view.fragments.CategoryPopover", this);
            this._oPopover.setModel(this.getView().getModel());
			this._oPopover.setModel(this.getView().getModel("i18n"), "i18n");
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oPopover);
			var oDetailPage = sap.ui.core.Fragment.byId("categoryPopover", "master");
			if (this.aFilterStack.length === 0) {
				oDetailPage.setShowNavButton(false);
			}

			// check if entry already exists to enable/disable "clear" button.
			var oClearButton = sap.ui.core.Fragment.byId("categoryPopover", "clearButton");
			if (!oEvent.getSource().getValue()) {
				oClearButton.setEnabled(false);
			} else {
				oClearButton.setEnabled(true);
			}

			var oListDetail = sap.ui.core.Fragment.byId("categoryPopover", "catPopoverList");
			var listBinding = oListDetail.getBinding("items");
			var oFilterProcType = new sap.ui.model.Filter("ProcessType", sap.ui.model.FilterOperator.EQ, "ZMRQ");

			listBinding.filter([oFilterProcType]);
			this._oPopover.openBy(oEvent.getSource());
		},

		onCatSearch: function(oEvent) {
			var searchedValue = oEvent.getParameter("newValue");
			var oListDetail = sap.ui.core.Fragment.byId("categoryPopover", "catPopoverList");
			var listBinding = oListDetail.getBinding("items");
			var oDetailPage = sap.ui.core.Fragment.byId("categoryPopover", "master");
			if (searchedValue.length >= 1) {
				oDetailPage.setShowNavButton(false);
				this.aFilterStack = [];
				var oFilterCatID = new sap.ui.model.Filter("CategoryId", sap.ui.model.FilterOperator.Contains, searchedValue);
				var oFilterProcType = new sap.ui.model.Filter("ProcessType", sap.ui.model.FilterOperator.EQ, "ZMRQ");
				jQuery.sap.delayedCall(0, this, function() {
					listBinding.filter([oFilterCatID, oFilterProcType]);
				});
			} else if (searchedValue.length === 0) {
				var oFilterProcType2 = new sap.ui.model.Filter("ProcessType", sap.ui.model.FilterOperator.EQ, "ZMRQ");
				jQuery.sap.delayedCall(0, this, function() {
					listBinding.filter([oFilterProcType2]);
				});
			}
		},
		onCatNavToNextLevel: function(oEvent) {
			var oCtx = oEvent.getSource().getBindingContext();
			var oDetailPage = sap.ui.core.Fragment.byId("categoryPopover", "master");
			var oEntity = oDetailPage.getModel().getData(oCtx.getPath(), oCtx);

			var oListDetail = sap.ui.core.Fragment.byId("categoryPopover", "catPopoverList");
			var listBinding = oListDetail.getBinding("items");
			var oFilterCatID = new sap.ui.model.Filter("CategoryId", sap.ui.model.FilterOperator.EQ, oEntity.CategoryId);
			var oFilterProcType = new sap.ui.model.Filter("ProcessType", sap.ui.model.FilterOperator.EQ, "ZMRQ");
			this.aFilterStack.unshift(oFilterCatID);

			if (this.aFilterStack.length >= 1) {
				oDetailPage.setShowNavButton(true);
			}

			jQuery.sap.delayedCall(100, this, function() {
				listBinding.filter([oFilterCatID, oFilterProcType]);
			});
		},

		onCatNavButtonPress: function() {
			var oDetailPage = sap.ui.core.Fragment.byId("categoryPopover", "master");
			var oListDetail = sap.ui.core.Fragment.byId("categoryPopover", "catPopoverList");
			var listBinding = oListDetail.getBinding("items");
			var oFilterProcType = new sap.ui.model.Filter("ProcessType", sap.ui.model.FilterOperator.EQ, "ZMRQ");

			if (this.aFilterStack.length > 1) {
				this.aFilterStack.shift();
				listBinding.filter([this.aFilterStack[0], oFilterProcType]);
			} else {
				oDetailPage.setShowNavButton(false);
				this.aFilterStack.shift();
				listBinding.filter(oFilterProcType);
			}
		},
		onCatPopoverClear: function() {
			this._oPopover.close();
			this.destroyPopover();
			var oInput = this.byId("CategoryInput");
			oInput.setValue("");
			oInput.data("CategoryId", "");
			oInput.setValueState("None");

		},
		setDefaultPriority: function() {
			if (this.oPrioSelect) {
				if (this.defaultPrio) {
					this.oPrioSelect.setSelectedKey(this.defaultPrio);

				} else {
					var that = this;
					var url = "/getDefaultPriority";

					this.getView().getModel().callFunction(url, {
						method: "GET",

						success: function(oData) {

							that.defaultPrio = oData.getDefaultPriority.defaultPrio;
							if (that.defaultPrio) {
								that.oPrioSelect.setSelectedKey(that.defaultPrio);
							}
						},
						error: function() {}
					});
				}

			}
		}



	});

});