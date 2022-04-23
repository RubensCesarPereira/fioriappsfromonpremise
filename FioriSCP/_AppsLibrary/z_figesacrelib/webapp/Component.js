sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel"
], function(UIComponent, Device,  JSONModel) {
	"use strict";
	
	return UIComponent.extend("z_figesacrelib.Component", {

		metadata: {
			manifest: "json",
				 stereotype 	: "component", 
			        "abstract"	: true,  
			        version 	: "1.0",   
			        library 	: "z_figesacrelib", 	         //required for CSS reference
			        includes	: [ "css/Style.css" ],  //CSS style reference     
			        dependencies: { 			 //external dependencies
			            libs 	: ["sap.m", 
			                 	   "sap.ui.commons", 
			                 	   "sap.uxap", 
			                 	   "sap.ui.table",
			                 	   "sap.tnt",
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
			
			var model = new JSONModel({
				entries: [],
				showEditAndProceedButton: false
		}); 
			
		},	
		
		createContent : function() {
			// get i18n.properties
//			var lv_oBundle = this.get_i18nProperties();
			
			/*		
			Note: i18nModel needs to be called before root view 'sap.ui.view' 
	                      i.e. before view creation
			      so that bundle can be accessed at onInit() of Master Page
			*/
//			gv_i18nBundle = jQuery.sap.resources({url : lv_oBundle.oData.bundleUrl});
			
			// create root view
			var oView = sap.ui.view({
				id 		: "App",
				viewName 	: "z_figesacrelib.view.ppal",
				type 		: "JS",
				viewData 	: { component : this }
			});
			
			// set device model
			var deviceModel = new sap.ui.model.json.JSONModel({
				isPhone 	: jQuery.device.is.phone,
				listMode 	: (jQuery.device.is.phone) ? "None" 	: "SingleSelectMaster",
				listItemType: (jQuery.device.is.phone) ? "Active" 	: "Inactive"
			});
			deviceModel.setDefaultBindingMode("OneWay");
			oView.setModel(deviceModel, "device");
				
//			sap.ui.getCore().setModel(model,"model");
			
			var deviceModel2 = new sap.ui.model.json.JSONModel({
	            isTouch : sap.ui.Device.support.touch,
	            isNoTouch : !sap.ui.Device.support.touch,
	            isPhone : sap.ui.Device.system.phone,
	            isNoPhone : !sap.ui.Device.system.phone,
	            listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
	            listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
	        });
	        deviceModel2.setDefaultBindingMode("OneWay");
	        this.setModel(deviceModel2, "device");
			
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
				    	    
		    var lv_bundleUrl = $.sap.getModulePath("z_figesacrelib", lv_i18nPath);   
		    var lv_oBundle 	 = new sap.ui.model.resource.ResourceModel({
			      bundleUrl	: lv_bundleUrl,		//"./i18n/i18n_en.properties"		       
			  });	  
		    return lv_oBundle;
	 
		}
	});
});