sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel"
	], function(UIComponent, Device,  JSONModel) {
	"use strict";

	return UIComponent.extend("z_mmfichatecnic.Component", {

		metadata: {
			manifest: "json",
			stereotype   : "component", 
			"abstract"  : true,  
			version   : "1.0",   
			library   : "z_mmfichatecnic",           //required for CSS reference
			includes  : [ "css/style.css" ],  //CSS style reference     
			dependencies: {        //external dependencies
				libs  : ["sap.m", 
					"sap.ui.commons", 
					"sap.ui.table", 
					"sap.ui.layout"],  //the libraries that component will be using            
					library : "sap.ui.core",  //what library belongs your component to              
			},   
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();

		},
		createContent : function() {

			// create root view
			var oView = sap.ui.view({
				id    : "app1",
				viewName  : "z_mmfichatecnic.view.ppal",
				type    : "JS",
				viewData  : { component : this }
			});



			// set device model
			var deviceModel = new sap.ui.model.json.JSONModel({
				isPhone   : jQuery.device.is.phone,
				listMode  : (jQuery.device.is.phone) ? "None"   : "SingleSelectMaster",
						listItemType: (jQuery.device.is.phone) ? "Active"   : "Inactive"
			});
			deviceModel.setDefaultBindingMode("OneWay");

			oView.setModel(deviceModel, "device");
			var GM = new JSONModel({//				
//				imgPath : '/sap/bc/ui5_ui5/sap/z_mmfichatecnic/'
				imgPath : '/FioriSCP.z_mmfichatecnic/'
			});
			oView.setModel(GM,'GM');
			var navs = new JSONModel();
			navs.setSizeLimit(99999);
			oView.setModel(navs,'NAVS');
			var conf = new JSONModel({
				MODE:"NAN",
				A:false,
				E:false,
				L:false,
				LVL:'NAN',
				TIME:0,
				FORM_STATE:{
					S1:false,
					S2:false,
					S3:false,
					S4:false,
					S5:false,
					S6:false,
					S7:false,
					S8:false,
					S9:false,
					S10:false,
				},
				V_P:false,
				V_H:false,
				V_A:false,
				BUKRS:'NULL'
			});
			conf.setDefaultBindingMode('OneWay');
			oView.setModel(conf,'CONF');
			return oView;
		},
		get_i18nProperties: function(){


			// Get browser's language
			var lv_Locale    = window.navigator.language;

			var lv_i18nPath;
			if(lv_Locale){
				lv_i18nPath = "/i18n/i18n_" + lv_Locale + ".properties";
			}

			//set default English script "i18n.properties"
			if(lv_Locale != "en" || lv_Locale != "en-US"){
				lv_i18nPath = "/i18n/i18n.properties";
			}

			var lv_bundleUrl = $.sap.getModulePath("z_mmfichatecnic", lv_i18nPath);   
			var lv_oBundle   = new sap.ui.model.resource.ResourceModel({
				bundleUrl : lv_bundleUrl,   //"./i18n/i18n_en.properties"          
			});   
			return lv_oBundle;

		}
	});
});