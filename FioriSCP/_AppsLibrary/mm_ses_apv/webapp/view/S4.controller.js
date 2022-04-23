/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");jQuery.sap.require("sap.ca.ui.model.format.QuantityFormat");sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.ses.approve.view.S4",{onInit:function(){var v=this.getView();var t=this;this.oRouter.attachRouteMatched(function(e){if(e.getParameter("name")==="subDetail"){var c=new sap.ui.model.Context(v.getModel(),'/'+e.getParameter("arguments").contextPath);v.setBindingContext(c);v.setModel(v.getModel(),"sesItemDetail");v.bindElement("sesItemDetail>"+c.getPath()+"/SESItemDetails",{expand:"SESAccountings,SESPackages"});this.sBackPath=e.getParameter("arguments").backPath;var n=-1;var l='/'+e.getParameter("arguments").contextPath;var s=this.oRouter.getView("ui.s2p.mm.ses.approve.view.S3").byId("ServiceItemList").getItems();for(var i=0;i<s.length;i++){if(s[i].getBindingContext("sesHeaderDetail").sPath===l){n=i}}this.oHeaderFooterOptionsWithLedger.oUpDownOptions.iPosition=n;this.oHeaderFooterOptionsWithLedger.oUpDownOptions.iCount=s.length;this.setHeaderFooterOptions(this.oHeaderFooterOptionsWithLedger)}},this);this.oHeaderFooterOptionsWithLedger={onBack:function(){t.handleNavBack()},oUpDownOptions:{iPosition:0,iCount:0,fSetPosition:function(n){t.handleSetNewPosition(n)},sI18NDetailTitle:'SUB_ITEM_TITLE',sI18NPhoneTitle:'SUB_ITEM_TITLE_PHONE'}};this.setHeaderFooterOptions(this.oHeaderFooterOptionsWithLedger)},getHeaderFooterOptions:function(){return this.oHeaderFooterOptionsWithLedger},handleUpdateFinishedAccountAssignment:function(e){if((e.getParameter("reason")==="Binding")||(e.getParameter("reason")==="Refresh")||(e.getParameter("reason")==="Change")){var h=e.getSource().getHeaderText();var n=h.indexOf('(');h=h.substring(0,n)+'('+e.getParameter("total")+")";e.getSource().setHeaderText(h)}},handleUpdateFinishedPackageAssignment:function(e){if((e.getParameter("reason")==="Binding")||(e.getParameter("reason")==="Refresh")||(e.getParameter("reason")==="Change")){var h=e.getSource().getHeaderText();var n=h.indexOf('(');h=h.substring(0,n)+'('+e.getParameter("total")+")";e.getSource().setHeaderText(h)}},handleNavBack:function(){var h=sap.ui.core.routing.History.getInstance();var d=h.getDirection("");this.oRouter.navTo("detail",{contextPath:this.sBackPath},true)},handleSetNewPosition:function(n){var s=this.oRouter.getView("ui.s2p.mm.ses.approve.view.S3").byId("ServiceItemList").getItems();var p=s[n].getBindingContext("sesHeaderDetail").sPath.substr(1);this.oRouter.navTo("subDetail",{contextPath:p,backPath:this.sBackPath},true)},onRequestorLinkPress:function(){},onAccountAssignmentLinkPress:function(){},onBtnDownPress:function(){},onBtnUpPress:function(){}});
