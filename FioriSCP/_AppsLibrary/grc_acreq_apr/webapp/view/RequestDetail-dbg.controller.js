/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ushell.services.CrossApplicationNavigation");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.m.MessageBox");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.grc.accessrequest.approve.view.RequestDetail", {
 
 	 oCrossAppNavigator : null,
	 resBundle:null,
	 gSelectDialog:null,
	 gSelectDialogApprove:null,
	 oCurrentView:null,
	 oCurrentModel:null,
	  gCheckBox:null,
      s_commentsMandtry:"",
      s_rejectLevel:"",
      s_approver:"",
	  s_comments:"",
	  s_rejectComments:"",
	  s_forwardUser:"",
	  s_requestNumber:"",
	  s_wiGroup:"",
	  s_approvedCount:0,
	  s_rejectedCount:0,
	  g_rejectionList:[],
	  g_rejectionCommentsList:[],
	  gRejectDialog:null,
	  gs_approvedCount:0,
	  s_delimit_key:"`:`",
	  g_tlock:false,
      showLockMessage:true,
      showUnauthorizedMessage:true,
	getResBundle: function(){
 	   if(this.resBundle === null){
 		   this.resBundle = this.getView().getModel("i18n").getResourceBundle(); 
 	   }
 	   return this.resBundle;
     },
	
    onInit: function() {
        //execute the onInit for the base class BaseDetailController
        sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
		//var lblSystem = this.getSystemLable();
				
//        sap.ushell.Container.getUser().isJamActive = function() { return true;};
        var lcontrollerHandle = this;
        var oOptions = {
        	 sI18NDetailTitle : "ACCESS_REQUEST_LBL",
        	 
    		 oPositiveAction : {
    	  		  sId : "Submit",
        		  sI18nBtnTxt : "SUBMIT_BTN",
                  onBtnPressed : function(e) {
                	  lcontrollerHandle.doSubmit();
                 },
             },
             oNegativeAction : {
            	 sId : "Forward",
      			 sI18nBtnTxt : "FORWARD_TEXT",
                 onBtnPressed : function(e) {
                	 lcontrollerHandle.handleForward(e);
                 },
             },
             
    		onBack : jQuery.proxy(function() {
    			//window.history.go(-1);
    			this.oRouter.navTo("master", {}, false);
    		}, this),

    		oJamOptions : {
    			oLineItem : this.byId("requestHeader"),
    			fGetShareSettings : function() {

    				var oObjListItem2 = new sap.m.ObjectListItem({
    					title : this.oLineItem.getTitle(),
    					number : this.oLineItem.getNumber(),
    					numberUnit : this.oLineItem.getNumberUnit(),
    					selected : true
    				});
    				return {
    					object : {
    						id : window.location.href.substring(0,  window.location.href.indexOf("&/detail/Requests")),
    						display : oObjListItem2,
    						share : " "

    					},
    				};
    			}

    		},

    		oAddBookmarkSettings : {
    			title : this.resBundle.getText("APPROVER_LBL"),
    			subTitle: this.resBundle.getText("ACCESS_REQUEST_LBL"),
    			info: this.resBundle.getText("ACCESS_DETAILS_TEXT"),
    			icon: "sap-icon://approvals"
    		},
    		bSuppressBookmarkButton: true
    	};

    	this.setHeaderFooterOptions(oOptions);
        	
        this.oCurrentView = this.getView();
		this.oCurrentModel = new sap.ui.model.json.JSONModel();
		this.getView().getModel().attachRequestCompleted(function(){this.requestCompleted(this);}, this);
		var that = this;

		this.getView().getModel().attachRequestFailed(function(oEvent){
			var strResponseText = oEvent.getParameters().responseText;
			if (strResponseText.indexOf("NOT AUTHORIZED") > -1 ){
				if(that.showUnauthorizedMessage){
				sap.m.MessageBox.show(that.getResBundle().getText("NOT_AUTHORIZED_TO_TAKE_ACTION"), sap.m.MessageBox.Icon.ERROR);
				that.showUnauthorizedMessage=false;
				}
			}else{
				sap.m.MessageBox.show('error from Server is ->'+strResponseText, sap.m.MessageBox.Icon.ERROR);
			}
        });
        this.oRouter.attachRouteMatched(function(oEvent) {
            if (oEvent.getParameter("name") === "detail") {
            	this.g_eventContextPath = oEvent.getParameter("arguments").contextPath;
            	
            	this.s_requestNumber = "";
            	this.g_tlock=true;
            	this.showLockMessage=true;
				this.showUnauthorizedMessage=true;

            	this.s_approvedCount=0;
            	this.s_rejectedCount=0; 
            	this.g_rejectionList=[];
            	this.g_rejectionCommentsList=[];

        		this.byId("requestHeader").setVisible(true);
        		this.byId("TABCONT_ROLE_INFO").setVisible(true);

            	var oRejectionDataModel = this.getRejectionDataModel();
                if(oRejectionDataModel){
		            var lRejectionData = oRejectionDataModel.getData();
		            if(lRejectionData){
			        	this.s_approvedCount=lRejectionData.approvedCount;
			        	this.s_rejectedCount=lRejectionData.rejectedCount; 
			        	this.g_rejectionList=lRejectionData.rejectionList;
			        	this.g_rejectionCommentsList=lRejectionData.rejectionCommentsList;
		            }
                }
            	
                this.getView().bindElement("/" + this.g_eventContextPath );
			}
        }, this);

    },
    
    
    
    
    getLockingDetails :function(path) {
    	var that = this;
    	var result = '';
    	$.ajax({
    		type: 'GET',
    		url: path,
			async: false,
			contentType: "application/json",
			dataType: 'json'  ,
			success: function(data){
				if(data) {
					result = data.d.Exception;
				}				
			},
			error :function(err) { 
				var strResponseText = err.responseText;
				if (strResponseText.indexOf("NOT AUTHORIZED") > -1 ){
					//Just Ignore this error as we are showing this message as part attachRequestFailed event of odata
					// if(that.showUnauthorizedMessage){
					// 	sap.m.MessageBox.show(that.getResBundle().getText("NOT_AUTHORIZED_TO_TAKE_ACTION"), sap.m.MessageBox.Icon.ERROR);
					// 	that.showUnauthorizedMessage=false;
					// } 
				}else{
					sap.m.MessageBox.show('error from Server is ->'+err.responseText, sap.m.MessageBox.Icon.ERROR);
				}
			} 			
			
    	
    	});
    	return result;
    },
    
    
    getCheckBoxName: function(pAccessName) {
    	
    	if(this.s_requestNumber == null || this.s_requestNumber == ""){
    		var oContext  =this.getView().getBindingContext();
    		this.s_requestNumber = oContext.getObject().RequestNumber;
    	}//if

    	
    	return pAccessName + this.s_delimit_key + this.s_requestNumber;
    },
    
    isCheckBoxSelected: function(pApprovalStatus) {
    	if(pApprovalStatus ==="RE"){
    		this.s_rejectedCount++;
    		return false;
    	}else{
    		this.s_approvedCount++;
    		return true;
    	};
    },
    
    isEnabled: function(pCanApprove) {
    	if(pCanApprove === false) {
    		this.s_approvedCount--;
    		return false;
    	}else{
    		return true;
    	};
    },    
    
    
    getRejectionDataModel : function() {
    	var lRejectionDataModel = this.getView().getModel("AccessRejectionData/" + this.g_eventContextPath);
    	if(lRejectionDataModel == undefined || lRejectionDataModel == null){
            var lRejectionData = {};
            lRejectionData.approvedCount = 0;
            lRejectionData.rejectedCount = 0; 
            lRejectionData.rejectionList = [];
            lRejectionData.rejectionCommentsList = [];

            var lRejectionDataModel = new sap.ui.model.json.JSONModel();
            lRejectionDataModel.setData(lRejectionData);
            this.getView().setModel(lRejectionDataModel, "AccessRejectionData/" + this.g_eventContextPath);
            
            lRejectionDataModel = this.getView().getModel("AccessRejectionData/" + this.g_eventContextPath);
    	} //if
    	
    	return lRejectionDataModel;
    },
    updateRejectionDataModel:function(){
        var lRejectionData = {};
        
        lRejectionData.approvedCount = this.s_approvedCount;
        lRejectionData.rejectedCount = this.s_rejectedCount; 
        lRejectionData.rejectionList = this.g_rejectionList;
        lRejectionData.rejectionCommentsList = this.g_rejectionCommentsList;
        this.getRejectionDataModel().setData(lRejectionData);
    },

    handleSelect:function(oEvent){
        this.handleItemPress(oEvent);
    },

    handleItemPress: function(oEvent){
    	var context = oEvent.getSource().getBindingContext();
        this.updateRejectionDataModel();
    	
        this.oRouter.navTo("roleDetails", {  
        	contextPath : this.getView().getBindingContext().sPath.substr(1),
        	key: context.sPath.substr(1)
		}, false);

    },
    
    navigateToDetail: function(oItem) {
        var lSelectedIndex = this.getRoleList().indexOfItem(oItem)+1;
        var lTotalCount = this.getRoleList().getItems().length;
        var oContext = oItem.getBindingContext();
        this.oRouter.navTo("roleDetails", {
      	  RoleID: oContext.getModel().getProperty( oContext.getPath() + "/RoleID"),
      	  RoleType: oContext.getModel().getProperty( oContext.getPath() + "/RoleType"),
      	  RoleSystem: oContext.getModel().getProperty( oContext.getPath() + "/System"),
      	  SelectedIndex: lSelectedIndex,
      	  TotalCount: lTotalCount,
        }); 
    },

	handleLineItemPress: function(oEvent){
		this.navigateToDetail(oEvent.getSource());
	},
	
    handleForward: function(oEvent){
  	 this.gSelectDialog = this.initSelectDialog('Forward');
  	 this.gSelectDialog.open();
    },
	
	
	doSearch: function(oEvent){
	       var filter = [];
	       var sVal = oEvent.getParameter("value");
	       if(sVal !== undefined) {
	           //Get the binded items
	           var itemsBinding = oEvent.getParameter("itemsBinding");
	
	           // create the local filter to apply
	           var selectFilter = new sap.ui.model.Filter("UserID", sap.ui.model.FilterOperator.Contains , sVal);
	           filter.push(selectFilter);
	      
	           // and apply the filter to the bound items, and the Select Dialog will update
	           itemsBinding.filter(filter);
	      }
	},
		
	doLiveChange: function(oEvent){
		    var sFilterPattern = oEvent.getParameters().value.toLowerCase();
	 		var aListItems = oEvent.getSource().getItems();
	      var bVisibility;
	      if(aListItems){
	             for ( var i = 0; i < aListItems.length; i++) {
	          	      var oItem = aListItems[i];
	          	      bVisibility = (oItem.getProperty("title").toLowerCase().indexOf(sFilterPattern) != -1 
	          	    		         || oItem.getProperty("description").toLowerCase().indexOf(sFilterPattern) != -1 );
	                    aListItems[i].setVisible(bVisibility);
	                   
	             } //for
	      }//if
	},
	doNothing: function(){
		
		
	},
	showToastMessage: function(pSubmitType){ 
		    var lToastMessage = this.getResBundle().getText("REQ_FORWARD_SUCCESS_MSG", [this.s_requestNumber, this.s_forwardUserName]);
		    if(pSubmitType === 'Approve'){
		    	lToastMessage = this.getResBundle().getText("REQ_SUBMIT_SUCCESS_MSG", [this.s_approvedCount, this.s_rejectedCount, this.s_requestNumber]);
			
		    }
		    var lControlHandle = this;
			var lToastMessageWidth = "25em";
			
			sap.m.MessageToast.show( lToastMessage, {width:lToastMessageWidth, duration:1000, onClose: function() { lControlHandle.onToastClose(); } } );
	},
	onToastClose: function(){
		this.clearScreenElements();
		this.oRouter.navTo("masterUpdate", {contextPath:"deleteSelected"}, false);
	},
	
	clearScreenElements: function(){
		var k = 0.
		for (k=0;k< this._oControlStore.oButtonListHelper.aButtons.length;k++) {
	    	if (k===0 || k==1) {
	   	    	this._oControlStore.oButtonListHelper.aButtons[k].oButton.setVisible(false);	        	        		
	    	}
		}
	    this.byId("requestHeader").setVisible(false);
		this.byId("TABCONT_ROLE_INFO").setVisible(false);
	},
		
	showErrorDialog: function(pErrorMessage) {
		 var lToastMessageWidth = "25em";
		 sap.m.MessageBox.alert(pErrorMessage, this.doNothing, this.getResBundle().getText("ERROR_TEXT"), "");
	},
	
	getStr:function(strValue){
		  return "'"+strValue+"'";
	}, 
	
	getRejectDialog: function(pAccessNameDescription){
		this.gRejectDialog = this.initRejectDialog(pAccessNameDescription);
		this.gRejectDialog.attachAfterClose(this.rejectLineItem, this);	
		this.gRejectDialog.open();
	},
	
	rejectLineItem: function(oEvent){
		var that = this;
		that.gRejectDialog.detachAfterClose(that.rejectLineItem, that);
		that.g_rejectionCommentsList.push(that.s_rejectComments);
		that.updateRejectionDataModel();		
	},
	approveLineItemSelect: function(oEvent){
		this.gCheckBox = oEvent.getSource();
		var oContext  =this.getView().getBindingContext();
		this.s_commentsMandtry = oContext.getObject().CommentsMandtry;
		this.s_rejectLevel = oContext.getObject().RejectLevel;
		var lAccessName = oEvent.getSource().getName();
		
		if(lAccessName.indexOf(this.s_delimit_key) != -1){
			lAccessName = lAccessName.split(this.s_delimit_key)[0];
		}//if
		lAccessName = lAccessName + this.s_delimit_key + oEvent.getSource().getBindingContext().getObject().System;
		if(oEvent.getSource().getSelected()){
			this.s_approvedCount++;
			if(this.s_rejectedCount>0){
				this.s_rejectedCount--;
				var pos = this.g_rejectionList.indexOf(lAccessName);
				if(pos >= 0){
				   this.g_rejectionList[pos]= " ";
				   this.g_rejectionCommentsList[pos]= " ";
				}
			}
			this.updateRejectionDataModel();
		} else {
			
			if(this.s_approvedCount > 0) {
				this.s_approvedCount--;
				this.g_rejectionList.push(lAccessName);
				this.s_rejectedCount++;
				//show popup only if in stage configuration,comments are mandatory for 
				//Reject at system/role or role level
				//if((this.s_commentsMandtry === "REJECT" || this.s_commentsMandtry === "BOTH")
				//&& (this.s_rejectLevel === "SYR" || this.s_rejectLevel === "ROL")){ 
					var lAccessDescription = oEvent.getSource().getBindingContext().getObject().Description;
					this.getRejectDialog(lAccessDescription);
				//}
        	} //comments mandatory
		}
	},
	forwardRequestCreate: function(pSubmitType,pSelectDialog) {
	    var that= this;
	     
	    that.s_comments1 = that.s_comments;
	    that.s_forwardUser1 = that.s_forwardUser;

	    //var oARForwardJson = {SubmitType:pSubmitType,Approver:that.s_approver1,RequestNumber:that.s_requestNumber1,Comments:that.s_comments1,WorkItemGroup:that.s_wiGroup1,ForwardUser:that.s_forwardUser1};
	    var oARForwardJson = {}; //"SubmitType":"","Approver":"","RequestNumber":"","Comments":"","WorkItemGroup":"","ForwardUser":""};
	    
		oARForwardJson.SubmitType    = pSubmitType;
		oARForwardJson.Approver      = that.s_approver;
		oARForwardJson.RequestNumber = that.s_requestNumber1;
		oARForwardJson.Comments      = that.s_comments1;
		oARForwardJson.WorkItemGroup = that.s_wiGroup1;
		oARForwardJson.ForwardUser   = that.s_forwardUser1;

	    var lRejections = {};
	    lRejections.Access = ' ';
	    lRejections.Action = 'RE';
	    lRejections.Comments = ' ';
	    lRejections.System = ' ';
	    oARForwardJson.Rejections = [];
		oARForwardJson.Rejections[0] = lRejections;

	    
	    var dataList = that.byId('accessRequestedList').getItems();
	    
	    for(var i=0;i<dataList.length;i++){
	    	lRejections = {};
	    	lRejections.Access = dataList[i].getBindingContext().getObject().AccessName;
	    	lRejections.System = dataList[i].getBindingContext().getObject().System;
	    	lRejections.Action = 'AP'; //A-Approve R-Reject
	    	lRejections.Comments = ' ';
	    	var lAccessSystem = lRejections.Access + this.s_delimit_key + lRejections.System;
	    	//var lPosIndex = this.g_rejectionList.indexOf(lRejRoleSystem);
	    	var lPosIndex = this.g_rejectionList.indexOf(lAccessSystem);
	    	var chkBoxAccessRequested = dataList[i].getCells()[0];  //Check wither checkbox selected/not selected for Request Line Item Rejection
	    	if(lPosIndex != -1 && !chkBoxAccessRequested.getSelected()){
	    		lRejections.Action = 'RE';
	    		lRejections.Comments = this.g_rejectionCommentsList[lPosIndex];
	    	}//if
	    	oARForwardJson.Rejections[i] = lRejections;
	    } //for i
	    
		var lCartView = this.getView();
		
		lCartView.setBusy(true);
		
		var sServiceUrl = that.getView().getModel().sServiceUrl;
    	that.oARCCartModel = new sap.ui.model.odata.ODataModel(sServiceUrl,true);
    	that.oARCCartModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
    	that.oARCCartModel.setHeaders({DataServiceVersion:"2.0"});
    	
		//that.oARCCartModel.refreshSecurityToken(function(oData, response) {
    	
			that.oARCCartModel.create("/Submits", oARForwardJson, null,
				function(oData, response) {
					that.showToastMessage(pSubmitType);
					lCartView.setBusy(false);
					//Clear the list.
				    this.g_rejectionList=[];
				    
				}, function(oError) {
					lCartView.setBusy(false);
					that.gRequestNumber = "";
					pSelectDialog.close();
					if(oError && oError.response && oError.response.body){
						var sBody = oError.response.body;
						var errorbackend = "";
						var oBody = "";
						try {
							oBody = jQuery.parseXML(sBody);
							if(oBody){
								errorbackend = oBody.getElementsByTagName("message")[0].childNodes[0].nodeValue;
							}
						} catch (e) {
							oBody = jQuery.parseJSON(sBody);
							if(oBody){
								errorbackend = oBody.error.message.value;
							}
						}

						if(errorbackend.indexOf("NOT AUTHORIZED") > -1){
							errorbackend = that.getResBundle().getText("NOT_AUTHORIZED_TO_TAKE_ACTION");
						}
					    that.showErrorDialog(errorbackend);
					}
				});

//		}, function(oError) {
//			that.gRequestNumber = "";
//			lCartView.setBusy(false);
//			pSelectDialog.close();
//			that.showErrorDialog(this.getView().getModel("i18n").getProperty("ERROR_REFRESH_SECURITY_TOKEN"));
//		}, false);
		
	},//accessRequestCreate
	
	getDialog: function(pTitle, pText) {
		var that = this;
		
		//var lText = this.getResBundle().getText("REJECT_ACCESS_TEXT",[pAccessNameDescription]);
	    var lText = new sap.m.Text({ text:pText, design: "Bold"});
		//var lComments = new sap.m.Input({ type:"Text", valueStateText:this.getResBundle().getText("ADD_COMMENTS_TEXT")});
		var ldialogTitle = this.getResBundle().getText(pTitle);
		var hbox = new sap.m.HBox({height:'6em'});
			hbox.setJustifyContent( sap.m.FlexJustifyContent.Center );
		
		var vbox = new sap.m.VBox({width:"85%"});
			vbox.setJustifyContent( sap.m.FlexJustifyContent.SpaceAround );
			vbox.addItem(lText); 
			//vbox.addItem(lComments);
			
	    hbox.addItem(vbox);
		
		var oDialog1 = "";
        oDialog1 = new sap.m.Dialog( {
			title: ldialogTitle,
			content: [ hbox ],
			beginButton:
				new sap.m.Button({
					text: this.getResBundle().getText("OK_BTN"),
					press : function() {
					   // that.s_rejectComments = lComments.getValue();
					    oDialog1.close();
					}
				}),
			endButton:
				new sap.m.Button({
					text: this.getResBundle().getText("CANCEL_BTN"),
					press : function() {
						oDialog1.close();
					}
				})
		});
        return oDialog1;
	},

	
	initRejectDialog: function(pAccessNameDescription) {
		var that = this;
		
		var lText = this.getResBundle().getText("REJECT_ACCESS_TEXT",[pAccessNameDescription]);
	    var lLabel = new sap.m.Text({ text:lText });
		var lComments = new sap.m.Input({ type:"Text", valueStateText:this.getResBundle().getText("ADD_COMMENTS_TEXT")});
		var ldialogTitle = this.getResBundle().getText("REJECT_COMMENTS_TEXT");
		// var hbox = new sap.m.HBox({height:'6em'});
		// 	hbox.setJustifyContent( sap.m.FlexJustifyContent.Center );
		
		var vbox = new sap.m.VBox({width:"85%"});
			vbox.setJustifyContent( sap.m.FlexJustifyContent.SpaceAround );
			vbox.addItem(lLabel); 
			vbox.addItem(lComments);
			
	    hbox.addItem(vbox);
		
		var oRejectDialog = "";
        oRejectDialog = new sap.m.Dialog( {
			title: ldialogTitle,
			content: [ hbox ],
			beginButton:
				new sap.m.Button({
					text: this.getResBundle().getText("OK_BTN"),
					press : function() {	
					   if (lComments.getValue().trim().length > 0){ 
							lComments.setValueState("Success");
  						    that.s_rejectComments = lComments.getValue();
						    oRejectDialog.close();
							
						}else{
							if(that.s_commentsMandtry === "REJECT" || this.s_commentsMandtry === "BOTH"){ 
								// && (this.s_rejectLevel === "SYR" || this.s_rejectLevel === "ROL")
								lComments.setValueState("Error"); // give error if no comments provided	
							}else{
								lComments.setValueState("Success");
								oRejectDialog.close();
							}
						}
//					    that.s_rejectComments = lComments.getValue();
//					    oRejectDialog.close();
			
					}
				}),
			endButton:
				new sap.m.Button({
					text: this.getResBundle().getText("CANCEL_BTN"),
					press : function() {
					 that.gCheckBox.setSelected(true);	// set checkbox to selected on close
					 that.s_rejectedCount--;
					 that.s_approvedCount++;
					 oRejectDialog.close();
					}
				})
		});
        oRejectDialog.attachBrowserEvent("keydown", function(oEvent) {
        	if(oEvent.keyCode === 27){
				that.gCheckBox.setSelected(true);	// set checkbox to selected on close
				that.s_rejectedCount--;
				that.s_approvedCount++;
				oRejectDialog.close();
        	}            
        });
        return oRejectDialog;
	},
	
    initSelectDialog: function(pSubmitType){
	    var that = this;
	    var li18nResource = this.getView().getModel("i18n");
	    
        var oContext  =this.getView().getBindingContext();
        this.s_wiGroup  = oContext.getObject().WorkItemGroup;
        this.s_requestNumber = oContext.getObject().RequestNumber;
        this.s_approver = oContext.getObject().Approver;
        this.s_commentsMandtry = oContext.getObject().CommentsMandtry;
        that.s_approver1 = that.s_approver;
	   
	    that.s_requestNumber1 = that.s_requestNumber;
	    that.s_wiGroup1 = that.s_wiGroup;
        
	    var lToText = li18nResource.getProperty("TO_TEXT");
	    var lToLabel = new sap.m.Text({ text:lToText });
		var lComments = new sap.m.Input({ type:"Text", valueStateText:li18nResource.getProperty("ADD_COMMENTS_TEXT"), value:li18nResource.getProperty("THANKS_TEXT")});
		
		var hbox = new sap.m.HBox({height:"100%"});
			hbox.setJustifyContent( sap.m.FlexJustifyContent.Center );
		
		var vbox = new sap.m.VBox({width:"85%"});
			vbox.setJustifyContent( sap.m.FlexJustifyContent.SpaceAround );
			vbox.addItem(lToLabel); 
			vbox.addItem(lComments);
		
		hbox.addItem(vbox);
		var ldialogTitle = pSubmitType;
		if (pSubmitType === 'Approve'){
		 
		  var lApproveSubTitle = this.getResBundle().getText("APPROVE_REJECT_ITEMS_TEXT", [that.s_approvedCount, that.s_rejectedCount, that.s_requestNumber1, oContext.getObject().UserName]);
		  lToLabel.setText(lApproveSubTitle);
		  ldialogTitle = this.getResBundle().getText("SUBMIT_BTN");
		  lComments.setValue("");
		  lComments.setValueStateText(this.getResBundle().getText("ADD_COMMENTS_MSG"));
		}else{
			ldialogTitle = this.getResBundle().getText("FORWARD_TEXT");
		}
		
		var oDialog1 = "";
        oDialog1 = new sap.m.Dialog( {
			title: ldialogTitle,
			content: [ hbox
			],
			beginButton:
				new sap.m.Button({
					text: li18nResource.getProperty("OK_BTN"),
					press : function() {
					    that.s_comments=lComments.getValue();
					    
					    if(that.s_forwardUserName && that.s_forwardUserName != ""){
					    	
					    	var lpos1 = that.s_forwardUserName.lastIndexOf("(");
					    	
					    	var lpos2 = that.s_forwardUserName.lastIndexOf(")");
					    	
					    	that.s_forwardUser = that.s_forwardUserName.substring(lpos1+1,lpos2);
					    }
						that.forwardRequestCreate(pSubmitType, oDialog1);
						oDialog1.close();
					}
				}),
			endButton:
				new sap.m.Button({
					text: li18nResource.getProperty("CANCEL_BTN"),
					press : function() {
						oDialog1.close();
					}
				})
		});
				
		if (pSubmitType === 'Forward'){
			var oSelectDialog1 = that.gSelectDialog;
			if(!oSelectDialog1){
				var itemTemplate = new sap.m.StandardListItem({
		                   title: "{UserName} ({UserID})",
		                   description: "{Email}", 
		                   icon: "sap-icon://employee",
		                   //active: true
		              });	
				oSelectDialog1 = new sap.m.SelectDialog( {
		            title: li18nResource.getProperty("FORWARD_TEXT"),
		            noDataText: li18nResource.getProperty("NO_FORWARD_USERS_FOUND_TEXT"),
		            search : this.doSearch
		       });
	
				// set model & bind Aggregation
				oSelectDialog1.setModel(this.getView().getModel());
				oSelectDialog1.bindAggregation("items", "/ForwardUsers", itemTemplate);
	       
				// attach close listener
				oSelectDialog1.attachConfirm(function(evt) {
				    var selectedItem = evt.getParameter("selectedItem");
				    if (selectedItem) {
				   	 
							 that.s_forwardUserName=selectedItem.getTitle();
							 
				   	 lToLabel.setText(lToText + " " + selectedItem.getTitle() + ":");
						     oDialog1.open(); 
				    }
				});
			}
			return oSelectDialog1; 
			
	    }else{
	    	return  oDialog1;
	    } 
  
   },
   formatUserNameDisplay:function(oUserName,oRequesterName){
	   var resBundle = this.getResBundle(); 
	   return resBundle.getText("USER_LBL",[oUserName]);
   },
   formatAuthorizedMessage:function(oIsAuthorized){
	   var resBundle = this.getResBundle();
	   if(oIsAuthorized === false){
		   return resBundle.getText("NOT_AUTHORIZED_TO_TAKE_ACTION");
	   } else {
		   return "";
	   }
   },
   
//   onListLoaded:function(oEvent){
//	   
//	   
//	   var lAccessCount = this.byId("accessRequestedList").getItems().length;
//	   var lGrowingInfo = this.byId("accessRequestedList").getGrowingInfo();
//	   if(lGrowingInfo != null){
//		   lAccessCount = lGrowingInfo.total;
//	   }//if
//	   
//	   this.byId("AccessTab").setCount(lAccessCount);
//	
//	   
//	   if(this.g_rejectionList.length === 0) {
//	       this.s_approvedCount = lAccessCount;
//	       this.updateRejectionDataModel(); 
//	   }
//   },
   
    customFieldsDisplay: function() {
    	
    	var lInfoForm = this.byId("INFO_FORM");
    	
    	//lInfoForm.destroyContent();
    	
    	var dataList = this.byId('customFieldsDataList').getItems();
	    
	    for(var i=0;i<dataList.length;i++){
	    	
	    	var lLabel  = dataList[i].getBindingContext().getObject().FieldLabel;
	    	var lValue  = dataList[i].getBindingContext().getObject().FieldValue;

	    	var lLabelObj = new sap.m.Label({ text:lLabel, design:"Bold"});
	    	var lTextObj = new sap.m.Text({ text:lValue});

	    	lInfoForm.addContent(lLabelObj);
	    	lInfoForm.addContent(lTextObj);
	    } //for i
    },
   
	requestCompleted: function(oCont) {
		


		this.getView().getModel().detachRequestCompleted(this.requestCompleted, this);
    	var oDataTemp = {};
    	
    	// this.s_approvedCount = 0;
	    // this.s_rejectedCount = 0;
	    this.s_approvedCount = 0;
	    this.s_rejectedCount = 0;
	    
    	this.getView().getModel().updateBindings(true);
    	
    	var oContentList = this.byId("INFO_FORM").getContent();
		 
    	
		this.oDataURL = this.getView().getModel().sServiceUrl;
		var lockingDetails = this.getLockingDetails(this.oDataURL+"/" + this.g_eventContextPath );
		this.byId("lockId").setText(lockingDetails);
    	 
		var lDialogTitle = this.getResBundle().getText("ERROR_TEXT");
		if(this.byId("lockId").getText()!=null && 
				this.byId("lockId").getText()!='' &&
				this.byId("lockId").getText()!='undefined' &&
				this.byId("lockId").getText()!=undefined)
		{    
		
		   if(this.showLockMessage){	 
		   	this.showLockMessage = false;
   			sap.m.MessageBox.show(this.byId("lockId").getText(),{title: lDialogTitle});	

							
	        var k=0;
	        for (k=0;k< this._oControlStore.oButtonListHelper.aButtons.length;k++) {
	        	if (k===0 || k==1) {
	        		this._oControlStore.oButtonListHelper.aButtons[k].oButton.setVisible(true);
	        		this._oControlStore.oButtonListHelper.aButtons[k].oButton.setEnabled(false);	        	        		
	        	}	        	
	        } 
		   }//if
		}
		else {
	        var k=0;
	        for (k=0;k< this._oControlStore.oButtonListHelper.aButtons.length;k++) {
	        	if (k===0 || k==1) {
	        		this._oControlStore.oButtonListHelper.aButtons[k].oButton.setVisible(true);
	        		this._oControlStore.oButtonListHelper.aButtons[k].oButton.setEnabled(true);	        	        		
	        	}	        	
	        }        						
		}
		
		
		// if(this.g_tlock == false){
		// 	return;
		// }
		// this.g_tlock=false;		
    	 
		for(var i=0;i<oContentList.length;i++){	 
		   var oControl = oContentList[i];
			 
		   var key = oControl.getId();
			   
		   if (oControl.getMetadata()._sClassName === 'sap.m.Text') {
			   key = key.replace("_txt","_lbl");
			   oDataTemp[key] = oControl.getText();
			   if(key.indexOf("_txt") == -1 && key.indexOf("_lbl") == -1){
				   this.byId("INFO_FORM").removeContent(oControl).destroy();
				   continue;
			   }
			   
			   oControl.setVisible( this.isVisible( oControl.getText() ) );
		   } 
		}//for i

		for(var i=0;i<oContentList.length;i++){	 
			   var oControl = oContentList[i];
				 
 			   var key = oControl.getId();
			   if (oControl.getMetadata()._sClassName === 'sap.m.Label') {
				   if(key.indexOf("_txt") == -1 && key.indexOf("_lbl") == -1){
					   this.byId("INFO_FORM").removeContent(oControl).destroy();
					   continue;
				   }
				   
				   oControl.setVisible( this.isVisible( oDataTemp[key] ) );
			   } 
	    }//for i
		
		this.customFieldsDisplay();
		
		this.gs_approvedCount = this.byId("AccessTab").getCount();
		//HUANGKE (4/1/2016): since this.s_rejectedCount is always zero, this.s_approvedCount is not correct here.
		//this.s_approvedCount = this.gs_approvedCount - this.s_rejectedCount;
		// this.s_approvedCount = 0;
	 //   this.s_rejectedCount = 0;	
	   // this.s_approvedCount = 0;
	    //this.s_rejectedCount = 0;		
		//this.onListLoaded();
		this.getView().setBusy(false);
		
		//get error message from table content list
		var lv_error_message = "";
		try {
			var dataList = this.byId('accessRequestedList').getItems();
		    
		    for(var i=0;i<dataList.length;i++){
		    	lv_error_message = dataList[i].getBindingContext().getObject().ErrorMessage;
		    	
		    	if(lv_error_message != ""){
		    		break;
		    	}
		    } //for i
		}catch(exception){
		}
		
		//this.byId('Forward').setEnabled(true);
    	//this.byId('Submit').setEnabled(true);
		//show error in error dialog
	    if(lv_error_message != "")
	    	
	    {
	    	//this.byId('Forward').setEnabled(false);
	    	//this.byId('Submit').setEnabled(false);
//	    	lv_error_message = lv_error_message.replace(/&/g,"");
//	    	this.showErrorDialog(lv_error_message); //this.getView().getModel("i18n").getProperty("ERROR_REFRESH_SECURITY_TOKEN"));
	    }
		
	    
	    
    },
	isVisible: function(pValue){
		if(pValue && pValue != null && pValue != ""){
			return true;
		} 
		return false;
		
	},
	formatDaysNumberDisplay : function (oValue){
		   if(oValue === 0){
		     return ".";
		   } else {
			 return oValue;  
		   }
			   
	   },
	   formatDaysDisplay : function (oValue){
		   var resBundle = this.getView().getModel("i18n").getResourceBundle();
			
		   if(oValue === 0){
			   return resBundle.getText("TODAY_TEXT");
		   } else {
			   return resBundle.getText("NUMBER_UNIT_TEXT");
		   }
	  },
	  formatRiskIconDisplay: function(pRiskCount){
		  if(pRiskCount>0){
			  return true;
		  } else {
			  return false;
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

   doSubmit:function(){
	  	this.gSelectDialogApprove = this.initSelectDialog('Approve');
	  	this.gSelectDialogApprove.open();
   }
    
});