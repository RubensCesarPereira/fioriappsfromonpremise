sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel"
], function(UIComponent, Device,  JSONModel) {
	"use strict";

	return UIComponent.extend("Z_SDConsultaBET.Component", {

		metadata: {
			manifest: "json",
				 stereotype 	: "component", 
			        "abstract"	: true,  
			        version 	: "1.0",   
			        library 	: "Z_SDConsultaBET", 	         //required for CSS reference
			        dependencies: { 			 //external dependencies
			            libs 	: ["sap.m", 
			                 	   "sap.ui.commons", 
			                 	   "sap.ui.ux3", 
			                 	   "sap.ui.table", 
			                 	   "sap.ui.layout"], 	//the libraries that component will be using            
			            library	: "sap.ui.core",	//what library belongs your component to              
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
				id 		: "app",
				viewName 	: "Z_SDConsultaBET.view.ppal",
				type 		: "JS",
				viewData 	: { component : this }
			});
				
			// set i18n.properties
//			oView.setModel(lv_oBundle, "i18n");	
			
			// set device model
			var deviceModel = new sap.ui.model.json.JSONModel({
				isPhone 	: jQuery.device.is.phone,
				listMode 	: (jQuery.device.is.phone) ? "None" 	: "SingleSelectMaster",
				listItemType: (jQuery.device.is.phone) ? "Active" 	: "Inactive"
			});
			deviceModel.setDefaultBindingMode("OneWay");
			oView.setModel(deviceModel, "device");
				

			return oView;
		},
		get_i18nProperties: function(){				
			
	        /*
		    Set i18n model | for Use of Localized Texts in Applications
		    Language:
		    On Eclipse PlateForm: 			lv_Locale = en-US
		    If BrowserDefaultLang English:	lv_Locale = en
		    If BrowserDefaultLang Hindi:	lv_Locale = hi	
		    */	
			
			// Get browser's language
			var lv_Locale 	 = window.navigator.language;
			
			var lv_i18nPath;
			if(lv_Locale){		
				lv_i18nPath = "/i18n/i18n_" + lv_Locale + ".properties";	
			}
			
			//set default English script "i18n.properties"
			if(lv_Locale != "en" || lv_Locale != "en-US"){				
				lv_i18nPath = "/i18n/i18n.properties";	
			}
				    	    
		    var lv_bundleUrl = $.sap.getModulePath("Z_SDConsultaBET", lv_i18nPath);   
		    var lv_oBundle 	 = new sap.ui.model.resource.ResourceModel({
			      bundleUrl	: lv_bundleUrl,		//"./i18n/i18n_en.properties"		       
			  });	  
		    return lv_oBundle;
	 
		}
	});
});