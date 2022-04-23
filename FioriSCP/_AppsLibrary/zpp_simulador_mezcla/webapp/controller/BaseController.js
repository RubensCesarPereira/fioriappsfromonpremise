sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/UIComponent","sap/ui/model/json/JSONModel","sap/m/library"],function(e,t,n,r){"use strict";var i=r.URLHelper;return e.extend("cl.conchaytor.zpp_simulador_mezcla.controller.BaseController",{onInit:function(){var e,t,r=this.getView().getBusyIndicatorDelay();e=new n({busy:true,delay:0});this.setModel(e,"appView");t=function(){e.setProperty("/busy",false);e.setProperty("/delay",r)};t=function(){e.setProperty("/busy",false);e.setProperty("/delay",r)};this.getOwnerComponent().getModel().metadataLoaded().then(t);this.getOwnerComponent().getModel().attachMetadataFailed(t);this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass())},getRouter:function(){return t.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()},onShareEmailPress:function(){var e=this.getModel("objectView")||this.getModel("ViewModel");i.triggerEmail(null,e.getProperty("/shareSendEmailSubject"),e.getProperty("/shareSendEmailMessage"))},invalidateStep:function(){var e;if(this.getOwnerComponent!==undefined){e=this.getOwnerComponent().getModel("ViewModel")}else{e=this.getModel("ViewModel")}e.setProperty("/stepValidated",false)},validateRequired:function(e){var t,n;var r=e.getSource().getParent().getParent().getParent();if(this.getView!==undefined){t=this.getModel("ViewModel")}else{return}var i=r.getFormContainers();var o=true;for(var a in i){var s=i[a].getFormElements();for(var l in s){var d=s[l].getLabel();if(d.getRequired){if(d.getRequired()){var u=d.getLabelFor();if(this.getView!==undefined){n=this.getView().byId(u)}else{n=sap.ui.getCore().byId(u)}if(n!==undefined&&n.getValue&&n.getValue()===""){t.setProperty("/stepValidated",false);return}}}}}t.setProperty("/stepValidated",o)},addHistoryEntry:function(){var e=[];return function(t,n){if(n){e=[]}var r=e.some(function(e){return e.intent===t.intent});if(!r){e.push(t);this.getOwnerComponent().getService("ShellUIService").then(function(t){t.setHierarchy(e)})}}}()})});