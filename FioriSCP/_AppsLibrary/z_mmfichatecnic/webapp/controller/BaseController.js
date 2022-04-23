sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"z_mmfichatecnic/view/utils/connectivity",
	], function (Controller, History) {
	"use strict";

	return Controller.extend("z_mmfichatecnic.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter : function () {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		onNavBackS : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("menu", {}, true);
			}
		},
		getInitInfo: function(){
			var c_time;
			if(!this.getModel('CONF')){
				c_time = 0;
			}else{
				c_time = this.getModel('CONF').getProperty('/TIME');
			}
			var now = new Date().getTime();
			
			console.log(c_time === 0 || (now - c_time) > 600000);
			if(c_time === 0 || (now - c_time) > 600000){
				console.log("INFO INICIAL...")
				var that = this;
				var oModel = new sap.ui.model.odata.ODataModel(serviceUrl,true);
				oModel.read("/InfoInicialSet?&$expand=NAVAditivos," +
						"NAVBarrica,NAVConduccion,NAVPerfil," +
						"NAVEstanque,NAVFerm,NAVLevadura,NAVVinedo,NAVEnologos", null, [""], true,
						function(data, response) {
					that.getModel('NAVS').setProperty('/',data.results[0]);
					that.getModel('CONF').setProperty('/TIME',new Date().getTime());
					if(data.results[0].NAVPerfil.results[0].STATUS === 'S'){
						that.getModel('CONF').setProperty('/BUKRS',data.results[0].NAVPerfil.results[0].BUKRS);
						if(data.results[0].NAVPerfil.results[0].ADM === 'X'){
							sap.ui.getCore().byId('profile-active').setText("Administrador");
							that.getModel('CONF').setProperty('/LVL','ADM');
							that.getModel('CONF').setProperty('/V_P',true);
							that.getModel('CONF').setProperty('/V_H',false);
							that.getModel('CONF').setProperty('/V_A',true);
						}else if(data.results[0].NAVPerfil.results[0].ENOLOGO === 'X'){
							sap.ui.getCore().byId('profile-active').setText("Enólogo");
							that.getModel('CONF').setProperty('/LVL','ENO');
							that.getModel('CONF').setProperty('/V_P',true);
							that.getModel('CONF').setProperty('/V_H',true);
							that.getModel('CONF').setProperty('/V_A',false);
						}else if(data.results[0].NAVPerfil.results[0].LABORATORIO === 'X'){
							that.getModel('CONF').setProperty('/V_P',true);
							that.getModel('CONF').setProperty('/V_H',true);
							that.getModel('CONF').setProperty('/V_A',false);
							that.getModel('CONF').setProperty('/LVL','LAB');
							sap.ui.getCore().byId('profile-active').setText("Laboratorio");
						}else if(data.results[0].NAVPerfil.results[0].COMERCIAL === 'X'){
							that.getModel('CONF').setProperty('/V_P',false);
							that.getModel('CONF').setProperty('/V_H',false);
							that.getModel('CONF').setProperty('/V_A',true);
							that.getModel('CONF').setProperty('/LVL','CMC');
							sap.ui.getCore().byId('profile-active').setText("Comercial");
						}else{
							that.getModel('CONF').setProperty('/V_P',false);
							that.getModel('CONF').setProperty('/V_H',false);
							that.getModel('CONF').setProperty('/V_A',false);
							sap.ui.getCore().byId('profile-active').setText("Indefinido");
							that.getRouter().navTo("menu",false);
							sap.m.MessageBox.error('Usuario sin perfil definido!');
						}
					}else{
						that.getRouter().navTo("menu",false);
						sap.m.MessageBox.error(data.results[0].NAVPerfil.results[0].MESSAGE);
					}
				}, function(err) {
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");

				});	
			}
		}
	});

});
