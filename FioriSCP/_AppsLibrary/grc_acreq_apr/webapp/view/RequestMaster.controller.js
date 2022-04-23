/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");sap.ca.scfld.md.controller.ScfldMasterController.extend("fcg.grc.accessrequest.approve.view.RequestMaster",{onInit:function(){sap.ca.scfld.md.controller.ScfldMasterController.prototype.onInit.call(this);this.isRoot=true;this.oRouter.attachRoutePatternMatched(function(e){var h=this.getHiddenList();if(h){h.setVisible(false);}var n=e.getParameter("name");var N=null;this._bIsDetailRoute=false;this._bIsMasterRoute=false;if(n==="detail"){this._bIsDetailRoute=true;N="/"+e.getParameter("arguments").contextPath;}if(n==="roleDetails"){this._bIsDetailRoute=false;N="/"+e.getParameter("arguments").contextPath+"/"+e.getParameter("arguments").key;}if(n==="master"){this._bIsMasterRoute=true;}if(n==="masterUpdate"){this._bIsMasterRoute=true;var l=e.getParameter("arguments").contextPath;if(l){this.handleDeleteSelectedAndSelectNew(l);}}this._hashParam=N;},this);},applySearchPatternToListItem:function(i,f){if(f.substring(0,1)==="#"){var t=f.substr(1);var d=i.getBindingContext().getProperty("Name").toLowerCase();return d.indexOf(t)===0;}else{return sap.ca.scfld.md.controller.BaseMasterController.prototype.applySearchPatternToListItem.call(null,i,f);}},handleDeleteSelectedAndSelectNew:function(p){if(p===null||p===""){return;}var l=this.getList().getSelectedItem();var a=this.getList().indexOfItem(l);var b=this.getList().getItems();if(a<0){a=0;}if(b.length>0){if(b[a].getVisible()==false){for(var i=a;i<b.length;i++){if(b[i].getVisible()){a=i;break;}}}if(b[a].getVisible()==false){for(var i=a;i>=0;i--){if(b[i].getVisible()){a=i;break;}}}if((!sap.ui.Device.system.phone)&&b[a].getVisible()){this.setListItem(b[a]);}else{var a=this.getView().getModel("SELECTED").getProperty("/selectedID");this.getList().removeItem(a);var r=sap.ui.core.UIComponent.getRouterFor(this);this.oRouter.navTo("masterUpdate",{contextPath:"deleteSelected"},false);}}else{if(l!=undefined&&l!=null&&l!=""){l.setVisible(false);}var L=this.getList();L.removeSelections();}},getHeaderFooterOptions:function(){var t=this;return{onBack:false,sI18NMasterTitle:"ACCESS_REQUESTED_TEXT",};},isLiveSearch:function(){return false;},isBackendSearch:function(){return true;},applyBackendSearchPattern:function(f,b){this.searchRequestsFromOdata(f);},searchRequests:function(e){var s=e.getSource().getValue();this.searchRequestsFromOdata(s);},searchRequestsFromOdata:function(s){var r=this.getView().getModel();var R=this.byId("list");s=s.replace("&","_amp;");var l=new sap.ui.model.Filter("WorkItemGroup","EQ",s);var o=this.byId("MAIN_LIST_ITEM");R.setBusy(true);R.setModel(r);R.attachUpdateFinished(this.showRequestDetails,this);R.bindAggregation("items",{path:"/Requests",template:o,filters:l});R.updateBindings(false);this.registerMasterListBind(this.getList());},showRequestDetails:function(){var r=this.byId("list");this.registerMasterListBind(this.getList());this.getView().getModel().detachRequestCompleted(this.showRequestDetails,this);r.detachUpdateFinished(this.showRequestDetails,this);this.byId("list").setBusy(false);this.selectRequestDetail();},selectRequestDetail:function(){var l=this.getList();var i=l.getItems();if(!sap.ui.Device.system.phone&&i.length>0&&!l.getSelectedItem()){this._firstSelection=true;this.setListItem(i[0]);}else if(l.getSelectedItem()){this.setListItem(l.getSelectedItem());}},handleItemPress:function(e){this.handleSelect(e);},handleSelect:function(e){var i=e.getParameter("listItem");if(!i){i=e.getSource();}this.setListItem(i);},setListItem:function(i){if(i==undefined||i==null||i===""){return;}var l=this.getList();l.removeSelections();i.setSelected(true);l.setSelectedItem(i,true);var a=this.getView().byId("list").indexOfItem(i);var m=new sap.ui.model.json.JSONModel({selectedID:a},"SELECTED");this.getView().setModel(m,"SELECTED");this.oRouter.navTo("detail",{contextPath:i.getBindingContext().sPath.substr(1)});},formatItemDisplay:function(v){var r=this.getView().getModel("i18n").getResourceBundle();return r.getText("USER_LBL",[v]);},formatDaysNumberDisplay:function(v){if(v===0){return" ";}else{return v;}},formatRiskDisplay:function(p){var r=this.getView().getModel("i18n").getResourceBundle();if(p>1){return r.getText("RISKS_LBL",[p]);}else if(p===1){return r.getText("RISK_LBL",[p]);}else{return"";}},formatDaysDisplay:function(v){var r=this.getView().getModel("i18n").getResourceBundle();if(v===0){return r.getText("TODAY_TEXT");}else if(v===1){return r.getText("DAY_AGO_TEXT");}else if(v>1){return r.getText("NUMBER_UNIT_TEXT");}},getHiddenList:function(){var l="__list";var a=null;for(var k=0;k<20;k++){a=sap.ui.getCore().getControl(l+k);if(a){break;}}return a;}});