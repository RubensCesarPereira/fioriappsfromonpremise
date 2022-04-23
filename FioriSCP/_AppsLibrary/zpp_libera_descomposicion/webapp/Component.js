sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cl/conchaytoro/zpp_libera_descomposicion/model/models","cl/conchaytoro/zpp_libera_descomposicion/controller/ListSelector","cl/conchaytoro/zpp_libera_descomposicion/controller/ErrorHandler"],function(e,t,o,s,i){"use strict";return e.extend("cl.conchaytoro.zpp_libera_descomposicion.Component",{metadata:{manifest:"json"},init:function(){this.oListSelector=new s;this._oErrorHandler=new i(this);this.setModel(o.createDeviceModel(),"device");e.prototype.init.apply(this,arguments);this.getRouter().initialize()},destroy:function(){this.oListSelector.destroy();this._oErrorHandler.destroy();e.prototype.destroy.apply(this,arguments)},getContentDensityClass:function(){if(this._sContentDensityClass===undefined){if(jQuery(document.body).hasClass("sapUiSizeCozy")||jQuery(document.body).hasClass("sapUiSizeCompact")){this._sContentDensityClass=""}else if(!t.support.touch){this._sContentDensityClass="sapUiSizeCompact"}else{this._sContentDensityClass="sapUiSizeCozy"}}return this._sContentDensityClass}})});