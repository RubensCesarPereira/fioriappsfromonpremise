sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/Device", "conchaytoro/cl/zsd_contabilizar_despacho/model/models", "conchaytoro/cl/zsd_contabilizar_despacho/controller/ListSelector", "conchaytoro/cl/zsd_contabilizar_despacho/controller/ErrorHandler"], function(t, e, s, o, i) {
    "use strict";
    return t.extend("conchaytoro.cl.zsd_contabilizar_despacho.Component", {
        metadata: {
            manifest: "json"
        },
        init: function() {
            this.oListSelector = new o;
            this._oErrorHandler = new i(this);
            this.setModel(s.createDeviceModel(), "device");
            t.prototype.init.apply(this, arguments);
            this.getRouter().initialize()
        },
        destroy: function() {
            this.oListSelector.destroy();
            this._oErrorHandler.destroy();
            t.prototype.destroy.apply(this, arguments)
        },
        getContentDensityClass: function() {
            if (this._sContentDensityClass === undefined) {
                if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
                    this._sContentDensityClass = ""
                } else if (!e.support.touch) {
                    this._sContentDensityClass = "sapUiSizeCompact"
                } else {
                    this._sContentDensityClass = "sapUiSizeCozy"
                }
            }
            return this._sContentDensityClass
        }
    })
});