/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.core.format.DateFormat"); 
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.grc.accessrequest.approve.view.RoleDetails", {
	
		 oModel:null,
		 mRoleId:0,
		 mRoleType:"", 
		 mRoleSystem:"",
		 mRequestNumber:"",
		 mValidTo:null,
		 mValidFrom:null,		 
		 mAccessType:"",
		 gRecentRoleId:{},
		 glocale : sap.ui.getCore().getConfiguration().getLanguage(), 
		 resBundle:null,

	 	onInit: function () {
 		    //execute the onInit for the base class BaseDetailController
	        sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
	    	this.oRouter.attachRouteMatched(function(oEvent) {
				if (oEvent.getParameter("name") === "roleDetails") {
					
					var lParentContextPath = oEvent.getParameter("arguments").contextPath;
					var lContextPath = oEvent.getParameter("arguments").key;
					
                    var oModel = this.getView().getModel();
					var RoleID= oModel.oData[lContextPath].AccessID;
					var RoleType= oModel.oData[lContextPath].RoleType;
					var RoleSystem= oModel.oData[lContextPath].System;
					var ValidTo= oModel.oData[lContextPath].ValidTo;
					var ValidFrom = oModel.oData[lContextPath].ValidFrom;					
					var RequestNumber= oModel.oData[lParentContextPath].RequestNumber;
					//Hide Risk & Action Icons for FFID Request 
					var AccessType = oModel.oData[lContextPath].AccessType;
					var riskIcon = this.getView().byId("itfRisks");
					var actionIcon = this.getView().byId("itfActions");
					if (AccessType === "FFI") {
						riskIcon.setVisible(false);
						actionIcon.setVisible(false);
					} else {
						riskIcon.setVisible(true);
						actionIcon.setVisible(true);						
					}
					
					var data = {'RoleID':RoleID, 'RoleType':RoleType, 'RoleSystem':RoleSystem, 'RequestNumber':RequestNumber, 'ValidTo':ValidTo, 'ValidFrom':ValidFrom,  'AccessType':AccessType}; //, 'SelectedIndex':SelectedIndex, 'TotalCount':TotalCount };
					this.refreshRoleDetail(data);

				}
			}, this);
	    },
	
	    onBackBtnPressed: function(oEvent){
	        window.history.go(-1);
	    },
	    
	    getResBundle: function(){
	    	   if(this.resBundle === null){
	    		   this.resBundle = this.getView().getModel("i18n").getResourceBundle(); 
	    	   }
	    	   return this.resBundle;
	    },
   
	    getModel:function(){
	    	return this.getView().getModel();
	    },
	    
	    
	    getSelectedRoles:function(oModel){
	    	var oDataProp = oModel.getProperty("/SelectedRoles");
			if(!oDataProp) {
				oDataProp = new Array();
				oModel.setProperty("/SelectedRoles",oDataProp);
			}
			return oDataProp;
	    	
	    },
	    

		isVisible: function(pValue){
			if(pValue && pValue != null && pValue != ""){
				return true;
			} 
			return false;
			
		},
	    
		requestCompletedRole: function(oCont) {
	    	var oDataTemp = {};
	    	
	    	var oContentList = this.byId("INFO_FORM").getContent();
			 
			for(var i=0;i<oContentList.length;i++){	 
			   var oControl = oContentList[i];
				 
 			   var key = oControl.getId();
 			   
			   if (oControl.getMetadata()._sClassName === 'sap.m.Text') {
				   key = key.replace("_txt","_lbl");
				   oDataTemp[key] = oControl.getText();

				   oControl.setVisible( this.isVisible( oControl.getText() ) );
			   } 
			}//for i

			for(var i=0;i<oContentList.length;i++){	 
				   var oControl = oContentList[i];
					 
	 			   var key = oControl.getId();
	 			   
				   if (oControl.getMetadata()._sClassName === 'sap.m.Label') {	 
					   oControl.setVisible( this.isVisible( oDataTemp[key] ) );
				   } 
		    }//for i

			
			this.byId("roleDescription").setVisible(this.isVisible(this.byId("longDescription").getText()));
			this.byId("actionList").setVisible((this.byId("actionList").getItems().length === 0)?false:true);
			
	    	oCont.getView().setBusy(false);
	    },

	    getRoleKey: function() {
	    	return "System='"+this.mRoleSystem+"',RequestNumber='"+this.mRequestNumber+"',RoleType='"+this.mRoleType+"',RoleID='"+this.mRoleId+"',AccessType='"+this.mAccessType+"'";
	    },
	    

	    /**
	     * Refreshes the model
	     */
	    refreshRoleDetail: function (data) {
	        if (data && data.RoleID) {
	        	if(this.gRecentRoleId[data.RoleID] === undefined){
	        		this.gRecentRoleId[data.RoleID] = "X";
	        	}
	        	this.getView().setBusy(true);
	        	
	        	var oModel = this.getModel();
	        	oModel.attachRequestCompleted(function(){this.requestCompletedRole(this);}, this);
	        
	        	
	        	this.mRoleId = data.RoleID;
	        	this.mRoleType = data.RoleType;
	        	this.mRoleSystem = data.RoleSystem;
	        	this.mRequestNumber = data.RequestNumber;
	        	this.mValidTo = data.ValidTo;
	        	this.mValidFrom = data.ValidFrom;	        	
	        	this.mAccessType = data.AccessType;
				this.getView().bindElement("/Roles(" + this.getRoleKey() + ")", {expand: "Actions,Risks"});
				this.getView().setBusy(false);
	        }
	    },
	    
		formatValidityDate: function(ValidtyDate, DefaultValue){
			
			var vValidity = this.mValidTo; //ValidtyDate;
			if(vValidity != null && vValidity != "" && typeof vValidity  === "string"){
				vValidity = new Date(this.mValidTo);
			}
			if(vValidity === null || vValidity === ""  || vValidity.getFullYear() === 9999) {
				vValidity = DefaultValue; 
			}else{
				vValidity = vValidity.toUTCString(); // toDateString();
				//vValidity.toUTCString();
			} //if
			
			return vValidity;
		},

		
		formatValidityFromDate: function(ValidtyDate, DefaultValue){
			
			var vValidity = ValidtyDate; //ValidtyDate;
			if(vValidity != null && vValidity != "" && typeof vValidity  === "string"){
				vValidity = new Date(ValidtyDate);
			}
			if(vValidity === null || vValidity === ""  || vValidity.getFullYear() === 9999) {
				vValidity = DefaultValue; 
			}else{
				vValidity = vValidity.toUTCString(); // toDateString();
				//vValidity.toUTCString();
			} //if
			
			return vValidity;
		},
		
		formatAccessType: function(pAccessType){
			if(pAccessType){
			return this.getResBundle().getText("ACCESS_TYPE_TEXT",[pAccessType]);
			}
		}
});