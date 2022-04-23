sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/library"
], function (Controller, UIComponent, JSONModel, mobileLibrary) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return Controller.extend("cl.conchaytor.zpp_simulador_mezcla.controller.BaseController", {
		
		onInit: function () {
			var oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
				
			oViewModel = new JSONModel({
				busy : true,
				delay : 0
			});
			this.setModel(oViewModel, "appView");
	
			fnSetAppNotBusy = function() {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};			
			
			fnSetAppNotBusy = function() {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};

			// since then() has no "reject"-path attach to the MetadataFailed-Event to disable the busy indicator in case of an error
			this.getOwnerComponent().getModel().metadataLoaded().
					then(fnSetAppNotBusy);
			this.getOwnerComponent().getModel().attachMetadataFailed(fnSetAppNotBusy);			
			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

		},
		
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress : function () {
			var oViewModel = (this.getModel("objectView") || this.getModel("ViewModel"));
			URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		invalidateStep: function () {
			var oModelView;

			if (this.getOwnerComponent !== undefined) {
				oModelView = this.getOwnerComponent().getModel("ViewModel");
			} else {
				oModelView = this.getModel("ViewModel");
			}
			oModelView.setProperty("/stepValidated", false);
		},
	
		//validateRequired: function (oForm) {
		validateRequired: function (oInput) {
			var oModelView, controlAssoci;
			var oForm = oInput.getSource().getParent().getParent().getParent();

			if (this.getView !== undefined) {
				//oForm = this.getView().getContent()[0].getPages()[0].getPages()[0].getContent()[0].getProgressStep().getContent()[0];
				oModelView = this.getModel("ViewModel");
			} 
			else {
				return;
				//oForm = this.getParent().getParent().getParent().getParent();
				//oModelView = this.getModel("ViewModel");
			}

			//var content = oForm.mAggregations.form.getFormContainers();
			var content = oForm.getFormContainers();
			var flagNotNull = true;

			for (var i in content) {
				var control = content[i].getFormElements();

				for (var c in control) {
					var oControl = control[c].getLabel();
					if (oControl.getRequired) {
						if (oControl.getRequired()) {
							var a = oControl.getLabelFor();

							if (this.getView !== undefined) {
								controlAssoci = this.getView().byId(a);
							} else {
								controlAssoci = sap.ui.getCore().byId(a);
							}

							if (controlAssoci !== undefined && controlAssoci.getValue && controlAssoci.getValue() === "") {
								oModelView.setProperty("/stepValidated", false);
								return;
							}
						}
					}
				}
			}
			oModelView.setProperty("/stepValidated", flagNotNull);
		},

		/**
		* Adds a history entry in the FLP page history
		* @public
		* @param {object} oEntry An entry object to add to the hierachy array as expected from the ShellUIService.setHierarchy method
		* @param {boolean} bReset If true resets the history before the new entry is added
		*/
		addHistoryEntry: (function() {
			var aHistoryEntries = [];

			return function(oEntry, bReset) {
				if (bReset) {
					aHistoryEntries = [];
				}

				var bInHistory = aHistoryEntries.some(function(oHistoryEntry) {
					return oHistoryEntry.intent === oEntry.intent;
				});

				if (!bInHistory) {
					aHistoryEntries.push(oEntry);
					this.getOwnerComponent().getService("ShellUIService").then(function(oService) {
						oService.setHierarchy(aHistoryEntries);
					});
				}
			};
		})()
	});

});