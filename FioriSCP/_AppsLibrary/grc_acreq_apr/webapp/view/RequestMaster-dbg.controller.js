/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");

sap.ca.scfld.md.controller.ScfldMasterController.extend("fcg.grc.accessrequest.approve.view.RequestMaster", {

    onInit : function() {
    	
        // execute the onInit for the base class BaseDetailController
        sap.ca.scfld.md.controller.ScfldMasterController.prototype.onInit.call(this);

        this.isRoot=true;
        
         // needed for set item from bookmark navigation
        this.oRouter.attachRoutePatternMatched(function(oEvent) {
        	var hiddenList = this.getHiddenList();
		 	  if(hiddenList) {
		 		hiddenList.setVisible(false);  
		 	  }
            var sName = oEvent.getParameter("name");
            var sNewHash = null;

            this._bIsDetailRoute = false;
            
            this._bIsMasterRoute = false;

            if (sName === "detail") {
                this._bIsDetailRoute = true;
                sNewHash = "/" + oEvent.getParameter("arguments").contextPath;
                
              //  this._selectDetail();
            }
            
            if (sName === "roleDetails") {
                this._bIsDetailRoute = false;
                sNewHash = "/" + oEvent.getParameter("arguments").contextPath + "/" + oEvent.getParameter("arguments").key;
            }
            if (sName === "master") {
                this._bIsMasterRoute = true;
            }

            if (sName === "masterUpdate") {
                this._bIsMasterRoute = true;
                var lcontextPath = oEvent.getParameter("arguments").contextPath;
                if(lcontextPath){
                   this.handleDeleteSelectedAndSelectNew(lcontextPath);
                }
            }
            this._hashParam = sNewHash;
        }, this);
    },
  
	applySearchPatternToListItem : function(oItem, sFilterPattern) {

		if (sFilterPattern.substring(0, 1) === "#") {
			var sTail = sFilterPattern.substr(1);
			var sDescr = oItem.getBindingContext().getProperty("Name").toLowerCase();
			return sDescr.indexOf(sTail) === 0;
		} else {
			
		    return sap.ca.scfld.md.controller.BaseMasterController.prototype.applySearchPatternToListItem.call(null, oItem,
			  	sFilterPattern);
		}

	},
	handleDeleteSelectedAndSelectNew: function(pContextPath){
		if(pContextPath === null || pContextPath === ""){ //if contextPath empty just return
			return;
		}
        
		// Delete selected one or from context path
		var lSelectedItem = this.getList().getSelectedItem();
		var lSelectedItemPos = this.getList().indexOfItem(lSelectedItem);
		//this.getList().removeItem(lSelectedItemPos);
		//lSelectedItem.setVisible(false);

		var lItemsList = this.getList().getItems();
		
		// Select next item in the list.
		//lSelectedItemPos--;
		
		if( lSelectedItemPos < 0  ) {
			lSelectedItemPos = 0;
		} 
		
		if( lItemsList.length>0){
			if(lItemsList[lSelectedItemPos].getVisible() == false){
				for(var i=lSelectedItemPos;i<lItemsList.length;i++){
					if( lItemsList[i].getVisible() ){
						lSelectedItemPos = i;
						break;
					}
				}//for
			}//if
	
			if(lItemsList[lSelectedItemPos].getVisible() == false){
				for(var i=lSelectedItemPos;i>=0;i--){
					if( lItemsList[i].getVisible() ){
						lSelectedItemPos = i;
						break;
					}
				}//for
			}//if
            //Changes for Mobile Approver Issue
			if((!sap.ui.Device.system.phone ) && lItemsList[lSelectedItemPos].getVisible()){
				this.setListItem(lItemsList[lSelectedItemPos]);
			} else {
				// delete the previous selected item.
				//var oList = this.getList();
				//oList.removeSelections();
				//var lSelectedItemPos = sap.ui.getCore().getModel("SELECTED").getProperty("/selectedID");
				var lSelectedItemPos = this.getView().getModel("SELECTED").getProperty("/selectedID");
				this.getList().removeItem(lSelectedItemPos);
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			        this.oRouter.navTo("masterUpdate", {contextPath:"deleteSelected"}, false);
				//this.searchRequestsFromOdata("");
			}
		} 
		else {
		 	if( lSelectedItem != undefined && lSelectedItem != null && lSelectedItem != "" ) {
		 		lSelectedItem.setVisible(false);				
		 	}
		 	var oList = this.getList();
		 	oList.removeSelections();
		// 	this.searchRequestsFromOdata("");
		 }
		
		//lItemsList = this.getList().getItems(); //Get Latest count.
		
        //this.oApplicationImplementation.oMHFHelper.setMasterTitle(this, lItemsList.length);
	},
	
    //This method is being called by framework and it is required 
	getHeaderFooterOptions : function() {
		var that = this;
		return {
                onBack : false,
			    sI18NMasterTitle : "ACCESS_REQUESTED_TEXT",
		};
	},
	isLiveSearch: function() {
		return false;
	},
	isBackendSearch: function(){
		return true; //return true;
	},
	applyBackendSearchPattern: function(sFilterPattern, oBinding) {	
        this.searchRequestsFromOdata(sFilterPattern);	
    },
	searchRequests: function(oEvent){
		var searchValue = oEvent.getSource().getValue();
		this.searchRequestsFromOdata(searchValue);	
    },
    
    searchRequestsFromOdata: function(searchValue){
    	var oRequestModel = this.getView().getModel();
    	var oRequestList = this.byId("list");
    	searchValue=searchValue.replace("&","_amp;");
    	var lFilter = new sap.ui.model.Filter("WorkItemGroup", "EQ", searchValue);  // Pass searchValue in order to map backend search value.
    	var oRequestTemplate = this.byId("MAIN_LIST_ITEM");
    	oRequestList.setBusy(true);
    	oRequestList.setModel( oRequestModel );
    	oRequestList.attachUpdateFinished(this.showRequestDetails, this);
    	oRequestList.bindAggregation("items", {path:"/Requests", template:oRequestTemplate, filters:lFilter});
    	
    	oRequestList.updateBindings(false);
	    this.registerMasterListBind(this.getList());
    	
    },
    
    showRequestDetails: function(){
       var oRequestList = this.byId("list");
 	   this.registerMasterListBind(this.getList());
 	   this.getView().getModel().detachRequestCompleted(this.showRequestDetails, this);
 	   oRequestList.detachUpdateFinished(this.showRequestDetails, this);
 	   this.byId("list").setBusy(false);
	   this.selectRequestDetail();
    },
    
	   selectRequestDetail : function() {
			var list = this.getList();
			var items = list.getItems();
			if (!sap.ui.Device.system.phone && items.length > 0
					&& !list.getSelectedItem()
					) { 
				this._firstSelection = true;
				this.setListItem(items[0]);
			} else if (list.getSelectedItem()){
				this.setListItem(list.getSelectedItem());
			}
		},
	
	handleItemPress: function(oEvent) {
		this.handleSelect(oEvent);
	},
	
    handleSelect:function(oEvent){
    	var oItem = oEvent.getParameter("listItem");
    	if(!oItem){
    		oItem = oEvent.getSource();
    	}
    	this.setListItem(oItem);
    },
    
    setListItem: function (oItem) {
    	if(oItem == undefined || oItem == null || oItem === "" ){
    		return;
    	}//if
    	
    	var oList = this.getList();
		oList.removeSelections();
		oItem.setSelected(true);
		oList.setSelectedItem(oItem, true);
		
		var id = this.getView().byId("list").indexOfItem(oItem);
         var oModel = new sap.ui.model.json.JSONModel({
				selectedID: id
			}, "SELECTED");

		// Assign the model object to the SAPUI5 core
		this.getView().setModel(oModel,"SELECTED")
		//sap.ui.getCore().setModel(oModel, "SELECTED");

		this.oRouter.navTo("detail", {
			contextPath : oItem.getBindingContext().sPath.substr(1)
		});
    },
    
//    formatDateToNumber : function(oDate){
//    	var lcurrentDate = new Date();
//    	
//    	alert(oDate+":"+lcurrentDate);
//    	var days = Math.round(Math.abs((lcurrentDate - oDate ) / (24*60*60*1000)));
//    	return days;
//    },
    formatItemDisplay : function (oValue){
    	var resBundle = this.getView().getModel("i18n").getResourceBundle(); 
    	
        return resBundle.getText("USER_LBL",[oValue]);
   },
   formatDaysNumberDisplay : function (oValue){
	   if(oValue === 0){
	     return " ";
	   } else {
		 return oValue;  
	   }
		   
   },
   formatRiskDisplay: function (pRiskCount){
	   var resBundle = this.getView().getModel("i18n").getResourceBundle();
	   if(pRiskCount>1){
		   return resBundle.getText("RISKS_LBL",[pRiskCount]);
	   } else if(pRiskCount === 1){
		   return resBundle.getText("RISK_LBL",[pRiskCount]);
	   } else {
		   return "";
	   }
   },
   formatDaysDisplay : function (oValue){
	   var resBundle = this.getView().getModel("i18n").getResourceBundle();
		
	   if(oValue === 0) {
		   return resBundle.getText("TODAY_TEXT");
	   } else if(oValue === 1){
		   return resBundle.getText("DAY_AGO_TEXT");
	   } else if(oValue > 1){
		   return resBundle.getText("NUMBER_UNIT_TEXT");
	   }
  },
  getHiddenList : function() {    	 
  	
 	 var listName = "__list";
 	 var listHandle = null;
 	 for(var k=0;k<20;k++) {
 		 listHandle = sap.ui.getCore().getControl(listName+k);
 		 if(listHandle) {
 			 break;
 		 }
 	 }    	 
        return listHandle;
 }
});