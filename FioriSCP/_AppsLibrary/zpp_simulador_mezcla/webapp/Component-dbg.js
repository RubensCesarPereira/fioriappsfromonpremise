sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"cl/conchaytoro/zpp_simulador_mezcla/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("cl.conchaytoro.zpp_simulador_mezcla.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();
			/*
			var oModelView = new JSONModel({
				stepValidated: false,
				fechaValida: false,
				errorText: "",
				errorDescrip: "",
				busyApp: false
			});*/
				
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		},

		getContentDensityClass : function () {
			if (!this._sContentDensityClass) {
				if (!Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}		
	});
});