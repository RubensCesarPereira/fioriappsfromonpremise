sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cl.conchaytoro.zmm_entrada_vino.controller.BaseController",{_ControllerManager:[],getRouter:function(){return this.getOwnerComponent().getRouter()},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()},onNavBack:function(){var e=t.getInstance().getPreviousHash();if(e!==undefined){history.go(-1)}else{this.getRouter().navTo("master")}},addViewController:function(e,t){if(e&&t){this._ControllerManager.push({name:e,obj:t})}},getViewController:function(e){if(e&&this._ControllerManager.lenght>0){this._ControllerManager.forEach(function(t){if(t){if(t.name!=="undefined"&&t.name===e)return t.obj}})}}})});