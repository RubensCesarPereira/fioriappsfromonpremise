sap.ui.define(["conchaytoro/cl/zsd_contabilizar_despacho/controller/BaseController","sap/ui/model/json/JSONModel"],function(t,e){"use strict";return t.extend("conchaytoro.cl.zsd_contabilizar_despacho.controller.App",{onInit:function(){var t,o,n=this.getOwnerComponent().oListSelector,a=this.getView().getBusyIndicatorDelay();t=new e({busy:true,delay:0});this.setModel(t,"appView");o=function(){t.setProperty("/busy",false);t.setProperty("/delay",a)};this.getOwnerComponent().getModel().metadataLoaded().then(o);this.getOwnerComponent().getModel().attachMetadataFailed(o);n.attachListSelectionChange(function(){this.byId("idAppControl").hideMaster()},this);this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass())}})});