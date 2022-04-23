/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("ui.s2p.mm.requisition.approve.util.Conversions");

sap.ca.scfld.md.controller.ScfldMasterController.extend("ui.s2p.mm.requisition.approve.view.S2", {
	_IsItemBasedApproval: false,
	_ItemType: "",

	onInit: function() {

		var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
		var oComponent = sap.ui.component(sComponentId);
		var oList = this.getList();
		this.bIsApproved = false;

		oComponent.oEventBus.subscribe("ui.s2p.mm.requisition.approve", "selectNextWorkItem", this._selectNextWorkItem, this);
		this.getView().getModel().setSizeLimit(1000000);

		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "detail" ||
				oEvent.getParameter("name") === "headerDetail") {
				
				this.sItemBindingContextPath = this.getBindingContextPathFor(oEvent.getParameter("arguments"));
				var iNumberOfItems = oList.getItems().length;
				var oSelectedItem = oList.getSelectedItem();
				if (oSelectedItem !== null && !sap.ui.Device.system.phone) {
					var iSelectedItemIndex = oList.indexOfItem(oSelectedItem);
					this.aNextItems = [];
					var iNextItemIndex = iSelectedItemIndex + 1;
					var iNextAfterNextItemIndex = iSelectedItemIndex + 2;
					this.aNextItems.push(oSelectedItem);
					if (iNumberOfItems >= iNextAfterNextItemIndex) {
						this.aNextItems.push(oList.getItems()[iNextItemIndex]);
						this.aNextItems.push(oList.getItems()[iNextAfterNextItemIndex]);
					} else if (iNumberOfItems >= iNextItemIndex) {
						this.aNextItems.push(oList.getItems()[iNextItemIndex]);
					}
				}
			}
		}, this);

			oList.attachEvent("updateFinished", function(oEvent) {
			if (!sap.ui.Device.system.phone) {
				if(!this.aNextItems){
					var oList = this.getList();
					var oCurrentItem = this.findItemByContextPath(this.sItemBindingContextPath);
					var oSelectedItem = oList.getSelectedItem();
						
					if(oSelectedItem !== null){
						var iSelectedItemIndex = oList.indexOfItem(oSelectedItem);
						var iNumberOfItems = oList.getItems().length;
						this.aNextItems = [];
						var iNextItemIndex = iSelectedItemIndex + 1;
						var iNextAfterNextItemIndex = iSelectedItemIndex + 2;
						this.aNextItems.push(oSelectedItem);										
						if(iNumberOfItems >= iNextAfterNextItemIndex){
							this.aNextItems.push(oList.getItems()[iNextItemIndex]);
							this.aNextItems.push(oList.getItems()[iNextAfterNextItemIndex]);
						}else if(iNumberOfItems >= iNextItemIndex){
							this.aNextItems.push(oList.getItems()[iNextItemIndex]);				
						}
					} else{
						//select item
						oList.setSelectedItem(oCurrentItem);
						oSelectedItem = oCurrentItem;
						}
					
				}else if(this.aNextItems && this.getList().getItems().length > 0){					
					if(!this.getList().getSelectedItem()){					
						var bFound = false;
						for(var i in this.aNextItems){
							if (this.aNextItems[i] == undefined) break;
							var oItem = this.findItemByContextPath(this.aNextItems[i].getBindingContextPath());
							if(oItem){
								this.setListItem(oItem);								
								bFound = true;
								break;
							}
						}
						if(!bFound){
							this.selectFirstItem();
						}
					}
				}else {
					this.showEmptyView("DETAIL_TITLE", "NO_ITEMS_AVAILABLE");
				}
			}		
		}, this);
		
		
		/**
		 * @ControllerHook S2 (List) / onInit With this controller method the onInit method of the S2 (List) controller can be enhanced.
		 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookOnInit
		 */
		if (this.extHookOnInit) {
			this.extHookOnInit();
		}
	},
	/**
	 * @private [_selectNextWorkItem on after approval/reject/forward, to select next row in desktop/phone]
	 */
	_selectNextWorkItem: function(channelId, eventId, data) {
		//perform refresh of master list and select next workitem if the current workitem doesn't exist anymore after the refresh
		//in case of using a phone - navigate to the master list and don't select any workitem
		if (eventId === "selectNextWorkItem") {
			if (sap.ui.Device.system.phone) {
				//Navigation to s2 view is only necessary for mobile phones because only one view can be displayed there (s2 or s3)
				window.history.go(-1);
			}

			var oList = this.getList();
			oList.getBinding('items').refresh();
			oList.attachEventOnce("updateFinished", function() {
				if (data.bMessageToast && data.bMessageToast === true && data.sMessage) {
					sap.ca.ui.message.showMessageToast(data.sMessage);
				}
			}, this);
		}
	},

	getHeaderFooterOptions: function() {
		var oLocalHeaderFooterOptions = {
			sI18NMasterTitle: "view.Master.title"
		};

		/**
		 * @ControllerHook  S2 (List) / HeaderFooterOptions
		 * With this controller method the getHeaderFooterOptions method of the S2 (List) controller
		 * can be enhanced to change the HeaderFooterOptions.
		 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookSetHeaderFooterOptions
		 * @param {object} oLocalHeaderFooterOptions
		 * @return {object} oLocalHeaderFooterOptions
		 */
		if (this.extHookSetHeaderFooterOptions) {
			oLocalHeaderFooterOptions = this.extHookSetHeaderFooterOptions(oLocalHeaderFooterOptions);
		}

		return oLocalHeaderFooterOptions;
	},

	setApprovalType: function(oListItem) {
		if (oListItem) {
			var oBindingContext = oListItem.getBindingContext();
			if (oBindingContext) {
				var oProperty = this.getView().getModel().getProperty(oBindingContext.getPath());
				this._IsItemBasedApproval = oProperty.IsItemBasedApproval;
			}
		}
	},

	setItemType: function(oListItem) {
		if (oListItem) {
			var oBindingContext = oListItem.getBindingContext();
			if (oBindingContext) {
				var oProperty = this.getView().getModel().getProperty(oBindingContext.getPath());
				this._ItemType = oProperty.ItemType;
			}
		}
	},

	getItemType: function() {
		return this._ItemType;
	},

	//overwrite scaffolding _handleSelect function because ApprovalType must be set
	_handleSelect: function(oEvent) {
		this.setApprovalType(oEvent.getParameter("listItem"));
		this.setItemType(oEvent.getParameter("listItem"));

		// call prototype
		sap.ca.scfld.md.controller.ScfldMasterController.prototype._handleSelect.call(this, oEvent);
	},

	_handleItemPress: function(oEvent) {
		this.setApprovalType(oEvent.getSource());
		this.setItemType(oEvent.getSource());

		// call prototype
		sap.ca.scfld.md.controller.ScfldMasterController.prototype._handleItemPress.call(this, oEvent);
	},

	selectFirstItem: function() {
		var oList = this.getList();
		var aItems = oList.getItems();
		var oListItem;

		if (aItems.length < 1) {
			return;
		}
		oListItem = this._oApplicationImplementation.getFirstListItem(this);

		if (oListItem) {
			this.setApprovalType(oListItem);

			// call prototype or this.setListItem(oListItem)?
			this.setListItem(oListItem);
		}
	},

	getDetailRouteName: function() {
		if (this._IsItemBasedApproval != "X") {
			return "headerDetail";
		} else {
			return "detail";
		}
	},

	_searchOnODataFields: function(oItem, sFilterPattern) {
		var aODataSearchFields = this._getODataSearchFields();

		//oData data
		var oModel = oItem.getBindingContext(this.sModelName).getProperty();

		return aODataSearchFields.some(function(sKey) {
			var sValue = "";

			if (sKey === "WiCreatedAt") {
				//enable comparing "medium-date-format" with "days-ago-format"
				//searching for e.g. "Yesterday" will match while searching on UI elements
				var oModelDate = oModel[sKey];
				var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({
					style: "medium"
				}, sap.ui.getCore().getConfiguration().getLocale());
				if (oModelDate !== "") {
					sValue = formatter.format(oModelDate, false);
				}
			} else {
				sValue = oModel[sKey];
			}

			if (typeof sValue === "string") {
				if (sValue.toLowerCase().indexOf(sFilterPattern) !== -1) {
					return true;
				}
			}
		});
	},

	_getODataSearchFields: function() {
		var aODataSearchFields = ["CreatedByName", "ForwardedByName", "ItemDescriptions", "PrNumber", "PrNumberFormatted", "SearchForText",
		                          "SubstitutingForName", "WiCreatedAt", "WorkitemID"];

		/**
		 * @ControllerHook  S2 (List) / Search
		 * With this controller method the document search can be changed. It is possible to remove or add oData search fields.
		 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookModifySearchableODataFieldsForMasterListSearch
		 * @param {object[]}
		 * 			An array which contains the oData fields which will be searchable.
		 * @return {object[]}
		 * 			An array which contains the oData fields which will be searchable.
		 */
		if (this.extHookModifySearchableODataFieldsForMasterListSearch) {
			aODataSearchFields = this.extHookModifySearchableODataFieldsForMasterListSearch(aODataSearchFields);
		}
		return aODataSearchFields;
	},

	_getTextsFromUIElementsForSearch: function(oItem) {
		var aUITexts = [];

		// default = add all UI texts to the array and add all attribute texts to the array
		if (oItem.getIntro()) aUITexts.push(oItem.getIntro());
		if (oItem.getTitle()) aUITexts.push(oItem.getTitle());
		if (oItem.getNumber()) aUITexts.push(oItem.getNumber());
		if (oItem.getNumberUnit()) aUITexts.push(oItem.getNumberUnit());
		if (oItem.getFirstStatus()) aUITexts.push(oItem.getFirstStatus().getText());
		if (oItem.getSecondStatus()) aUITexts.push(oItem.getSecondStatus().getText());

		var aAttributes = oItem.getAttributes();
		for (var j = 0; j < aAttributes.length; j++) {
			aUITexts.push(aAttributes[j].getText());
		}

		/**
		 * @ControllerHook  S2 (List) / Search
		 * With this controller method the document search can be changed. It is possible to define which UI texts are searchable. By default all UI texts are searchable.
		 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookDefineSearchableUITextsForMasterListSearch
		 * @param {object}
		 * 			An object - the List Item
		 * @return {object[]}
		 * 			An array which contains the UI texts which will be searchable.
		 */
		if (this.extHookDefineSearchableUITextsForMasterListSearch) {
			aUITexts = this.extHookDefineSearchableUITextsForMasterListSearch(oItem);
		}
		return aUITexts;
	},

	_searchOnUITexts: function(oItem, sFilterPattern) {

		var aUITexts = this._getTextsFromUIElementsForSearch(oItem);

		return aUITexts.some(function(uiText) {
			if (uiText !== "undefined" && uiText !== "") {
				if (uiText.toLowerCase().indexOf(sFilterPattern) !== -1) {
					return true;
				}
			}
		});
	},

	//Overwrite Scfhld. function because of do not using all OData-properties
	applySearchPatternToListItem: function(oItem, sFilterPattern) {

		if (sFilterPattern === "") {
			return true;
		}
		if (this._searchOnODataFields(oItem, sFilterPattern) === true) {
			return true;
		}
		if (this._searchOnUITexts(oItem, sFilterPattern) === true) {
			return true;
		}

		return false;
	}
});