/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//jQuery.sap.require("sap.ca.scfld.md.controller.BaseMasterController");
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("sap.ca.ui.model.type.Date");
jQuery.sap.require("ui.s2p.mm.ses.approve.util.Formatter");

//sap.ca.scfld.md.controller.BaseMasterController.extend("ui.s2p.mm.ses.approve.view.S2", {
sap.ca.scfld.md.controller.ScfldMasterController.extend("ui.s2p.mm.ses.approve.view.S2", {
	onInit : function() { 
		var that = this;

	    this.oDataModel = this.oApplicationFacade.getODataModel();
	    
	    //register event to notify S3 screen once the list is loaded
	    //this is needed because the Approve and Reject Button are handled according to the Workitem
	    //in case of an browser refresh the WorkItem might not be available but the BindingContext already is
	    this.byId("list").getBinding("items").attachDataReceived(this.onListDataReceived, this);
		
		// create a Sorter with very simple grouping by the CreatedByName 
		//var oCreatedByGoupingSorter = new sap.ui.model.Sorter("CreatedByName", false, true);
		
		// create a Sorter for sorting the result 
		var oCreatedAtSorterAscending  = new sap.ui.model.Sorter("CreatedAt", false, false);
		var oCreatedAtSorterDescending = new sap.ui.model.Sorter("CreatedAt", true, false);
		var oCreatedBySorterAscending  = new sap.ui.model.Sorter("CreatedByName", false, false);
		var oCreatedBySorterDescending = new sap.ui.model.Sorter("CreatedByName", true, false);
		var oTotalValueSorterAscending = new sap.ui.model.Sorter("ActualValue", false, false);
		var oTotalValueSorterDescending = new sap.ui.model.Sorter("ActualValue", true, false);

		
		// create a Filter for filtering the result 
		//var oCreatedByFilter  = new sap.ui.model.Filter("CreatedByID", sap.ui.model.FilterOperator.EQ, "HEFFTER");

	    this.registerEvents();
	    this.attachRouteMatchedHandler();
		
		this.oHeaderFooterOptions = {
			sI18NMasterTitle : "MASTER_TITLE",
			oSortOptions : {
				aSortItems : [{
					text : this.getView().getModel("i18n").getResourceBundle().getText("SORT_OPTION_CREATED_BY_ASCENDING"),   //"CreatedBy Ascending",
					key  : "CreatedByAscending"
				}, {
					text : this.getView().getModel("i18n").getResourceBundle().getText("SORT_OPTION_CREATED_BY_DESCENDING"),  //"CreatedBy Descending",
					key  : "CreatedByDescending"
				}, {
					text : this.getView().getModel("i18n").getResourceBundle().getText("SORT_OPTION_CREATED_ON_ASCENDING"),   //"CreatedAt Ascending",
					key  : "CreatedAtAscending"
				}, {
					text : this.getView().getModel("i18n").getResourceBundle().getText("SORT_OPTION_CREATED_ON_DESCENDING"),  //"CreatedAt Descending",
					key  : "CreatedAtDescending"
				}, {
					text : this.getView().getModel("i18n").getResourceBundle().getText("SORT_OPTION_TOTAL_VALUE_ASCENDING"),  //"TotalValue Ascending",
					key  : "TotalValueAscending"
				}, {
					text : this.getView().getModel("i18n").getResourceBundle().getText("SORT_OPTION_TOTAL_VALUE_DESCENDING"), //"TotalValue Descending",
					key  : "TotalValueDescending"
				}],
				
				// default/current sort order
				sSelectedItemKey: "CreatedAtDescending",
				onSortSelected : function(sKey) {
					var oBinding = that.getView().byId('list').getBinding("items");
                    if      (sKey === "CreatedByAscending")   { oBinding.sort([oCreatedBySorterAscending]); } 
                    else if (sKey === "CreatedByDescending")  { oBinding.sort([oCreatedBySorterDescending]); }
                    else if (sKey === "CreatedAtDescending")  { oBinding.sort([oCreatedAtSorterDescending]); }
                    else if (sKey === "CreatedAtAscending")   { oBinding.sort([oCreatedAtSorterAscending]); }
                    else if (sKey === "TotalValueAscending")  { oBinding.sort([oTotalValueSorterAscending]); }
                    else if (sKey === "TotalValueDescending") { oBinding.sort([oTotalValueSorterDescending]); }
                    else { 
                    	  var aSorter = [];
                          aSorter = that.getSorterForSortOption(sKey);
                          oBinding.sort(aSorter);
                          if ( aSorter.length <= 0) {
                        	  that.oHeaderFooterOptions.oSortOptions.sSelectedItemKey = "";
                        	  return;
                         }	
                    }
                    that.oHeaderFooterOptions.oSortOptions.sSelectedItemKey = sKey;
				} 
			},
		};	
    	/**
         * @ControllerHook extHookAddOrChangeSortOptions for adding/changing of the predefined SortOptions.
         *                 This hook method could be used for custom changes of the sort options.
         *                 It is called in the method onInit of the controller.
         * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookAddOrChangeSortOptions
         * @param  {object} oSortOptions current SortOptions
         * @return {object} oSortOptions changed SortOptions ( assuming: The parameter oSortOption is returned if nothing was changed)
         */
	      if (this.extHookAddOrChangeSortOptions){
	    	  // Hook to change/add the sort options
	    	  this.oHeaderFooterOptions.oSortOptions = this.extHookAddOrChangeSortOptions(this.oHeaderFooterOptions.oSortOptions);
	      }
	},
	
	onListDataReceived: function(oEvent) {
	    var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
	    var oComponent = sap.ui.component(sComponentId);
	    oComponent.oEventBus.publish("ui.s2p.mm.ses.approve", "S2DataReceived");
	},
	
	getSorterForSortOption: function(sKey) { 
 	    var aSorter = [];	
		/**
	     * @ControllerHook extHookGetSorterForSortOption to determine the sorter objects or the requested sort key.
	     *                 This hook method has to be used for custom changed sort options.
	     *                 It is called after the sort options was clicked on the UI.
	     * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookGetSorterForSortOption  
	     * @param {string} sSortKey the key of the sort option
	     * @return {array} aSorters Contains the sap.ui.model.Sorter objects which are related to the sort key
	     */
	      if (this.extHookGetSorterForSortOption){
	      	  // Hook to add the sorter for the changed/added sort options
	    	  aSorter = this.extHookGetSorterForSortOption(sKey);
	   	  }
	      return aSorter;	
	},
	
	registerEvents: function() {
		var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
	    var oComponent = sap.ui.component(sComponentId);
	    oComponent.oEventBus.subscribe("ui.s2p.mm.ses.approve", "asesApproveRejectForward",
                       this.handleActionCallBack, this);
	},

	attachRouteMatchedHandler: function(oEvent) {
	    this.oRouter.attachRoutePatternMatched(function(oEvent) {
		    if (oEvent.getParameter("name") === "detail") {
		        var sBindingContextPath = this.getBindingContextPathFor(oEvent.getParameter("arguments"));
		        var oItem = this.findItemByContextPath(sBindingContextPath);
		        var oList = this.getList();
		        var index = oList.indexOfItem(oItem);
		        index = index + 1;
		        if ( index >= oList.getItems().length ) { 
		            index = 0;
		        }
		        if ( oList.getItems().length === 0) { 
		            index = -1;
		        } 		        	
		        if ( index >= 0 ) {
	    	        var oNextItem = oList.getItems()[index];
			        this._sNextDetailPath = oNextItem && oNextItem.getBindingContext(this.sModelName).getPath();
    	        } else {
			        this._sNextDetailPath = "";
			    }
		    }
	    }, this);
	},
	
	handleActionCallBack: function(channelId, eventId, data) {
		if (eventId === "asesApproveRejectForward" ) {
		    var oItem = this.findItemByContextPath(this._sNextDetailPath);
	        if (oItem) { 
                this.setListItem(oItem);
			} else {
			    if (this.getList().getItems().length > 1) { 
			        this.selectFirstItem(); 
			    } else { 
			        this.showEmptyView("DETAIL_TITLE", "NO_ITEMS_AVAILABLE");
			    }
		    }
		}
	},
	
	getHeaderFooterOptions : function() {
		return this.oHeaderFooterOptions;
	}
});