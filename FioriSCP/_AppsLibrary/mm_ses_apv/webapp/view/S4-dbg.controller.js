/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("sap.ca.ui.model.format.QuantityFormat");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.ses.approve.view.S4", {

	onInit : function() {
	    var view = this.getView();
	    var that = this;

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "subDetail") {
			    var context = new sap.ui.model.Context(view.getModel(), '/' + oEvent.getParameter("arguments").contextPath);
			    view.setBindingContext(context);

				view.setModel(view.getModel(), "sesItemDetail");
				view.bindElement("sesItemDetail>" +context.getPath()+"/SESItemDetails", { expand: "SESAccountings,SESPackages"});

				this.sBackPath = oEvent.getParameter("arguments").backPath;

				var nSelectedLine = -1;
				// adjust the Up/Down options
                var sLastSubDetailContextPath = '/' + oEvent.getParameter("arguments").contextPath;
				var aSESLines   = this.oRouter.getView("ui.s2p.mm.ses.approve.view.S3").byId("ServiceItemList").getItems();
				for(var i=0;i< aSESLines.length;i++) {
                    if(aSESLines[i].getBindingContext("sesHeaderDetail").sPath ===sLastSubDetailContextPath) {
                        nSelectedLine = i;
                    }
                }
				this.oHeaderFooterOptionsWithLedger.oUpDownOptions.iPosition = nSelectedLine;
				this.oHeaderFooterOptionsWithLedger.oUpDownOptions.iCount =  aSESLines.length;
				this.setHeaderFooterOptions(this.oHeaderFooterOptionsWithLedger);				
            }
		}, this);

		this.oHeaderFooterOptionsWithLedger = 
		{
	        onBack: function(){
			    that.handleNavBack();
			},
	
			oUpDownOptions: {
				iPosition : 0,
				iCount : 0,
				fSetPosition : function(iNewPosition){that.handleSetNewPosition(iNewPosition);},
				sI18NDetailTitle : 'SUB_ITEM_TITLE',					
				sI18NPhoneTitle : 'SUB_ITEM_TITLE_PHONE'
			}
		};
		this.setHeaderFooterOptions(this.oHeaderFooterOptionsWithLedger);
	},
	
	getHeaderFooterOptions : function() {
		return this.oHeaderFooterOptionsWithLedger;
	},
	
	handleUpdateFinishedAccountAssignment: function(oEvent) {
		if ((oEvent.getParameter("reason") === "Binding") || 
			(oEvent.getParameter("reason") === "Refresh")  ||
			(oEvent.getParameter("reason") === "Change")){
			// adjust the header text
			var sHeaderText = oEvent.getSource().getHeaderText();
			var nIndexTo   = sHeaderText.indexOf('(');               
			sHeaderText = sHeaderText.substring(0, nIndexTo) + '(' + oEvent.getParameter("total") + ")";
			oEvent.getSource().setHeaderText(sHeaderText);				
		} 
	},

	handleUpdateFinishedPackageAssignment: function(oEvent) {
		if ((oEvent.getParameter("reason") === "Binding") || 
			(oEvent.getParameter("reason") === "Refresh")  ||
			(oEvent.getParameter("reason") === "Change")){
			// adjust the header text
			var sHeaderText = oEvent.getSource().getHeaderText();
			var nIndexTo   = sHeaderText.indexOf('(');               
			sHeaderText = sHeaderText.substring(0, nIndexTo) + '(' + oEvent.getParameter("total") + ")";
			oEvent.getSource().setHeaderText(sHeaderText);				
		} 
	},
	
	handleNavBack : function() {
	    var oHistory = sap.ui.core.routing.History.getInstance();
		var sDir = oHistory.getDirection("");

		//if (sDir === "Backwards") {
		//	window.history.go(-1);
		//} else {
		//	if (this.sBackPath !== '') {
		this.oRouter.navTo("detail", {
			contextPath : this.sBackPath
		}, true);
		//	}
		//}
	},	

	handleSetNewPosition: function(iNewPosition){
		var aSESLines = this.oRouter.getView("ui.s2p.mm.ses.approve.view.S3").byId("ServiceItemList").getItems();
		var path = aSESLines[iNewPosition].getBindingContext("sesHeaderDetail").sPath.substr(1);		
		this.oRouter.navTo("subDetail", {
			contextPath  : path,
			backPath:      this.sBackPath
		},true);
	},
	
	onRequestorLinkPress: function(){
		
	},

	onAccountAssignmentLinkPress: function(){
		
	},

	onBtnDownPress: function(){
		
	},

	onBtnUpPress: function(){
		
	}
});
