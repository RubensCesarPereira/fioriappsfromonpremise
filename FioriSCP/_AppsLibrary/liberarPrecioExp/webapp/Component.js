sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
//	"liberarPrecioExp/model/models",
	"sap/ui/model/json/JSONModel"
	], function(UIComponent, Device,  JSONModel) {
	"use strict";

	return UIComponent.extend("liberarPrecioExp.Component", {

		metadata: {
			manifest: "json",
			stereotype 	: "component", 
			"abstract"	: true,  
			version 	: "1.0",   
			library 	: "liberarPrecioExp", 	         //required for CSS reference
			includes	: [ "css/Style.css" ],  //CSS style reference     
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

			var detalleCond = new JSONModel({
				entries: [],
				ZzfechaStatus: "",
				showEditAndProceedButton: false
			}); 
			sap.ui.getCore().setModel(detalleCond,"detalleCond");
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			this.setModel(oModel,'Device');
			var oDataModel = new JSONModel({
				NList:[],
				IList:[],
				PList:[]
			});
			oDataModel.setSizeLimit(1000);
			oDataModel.setDefaultBindingMode("OneWay");
			this.setModel(oDataModel,'DataModel');
			var oDetailModel = new JSONModel();
			this.setModel(oDetailModel,'DetailModel');	
			return oModel;
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
				id 		: "app1",
				viewName 	: "liberarPrecioExp.view.ppal",
				type 		: "XML",
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

			//nu
//			// call the init function of the parent
//			UIComponent.prototype.init.apply(this, arguments);
			//
//			// create the views based on the url/hash
//			this.getRouter().initialize();
			//nu

			// done
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

			var lv_bundleUrl = $.sap.getModulePath("liberarPrecioExp", lv_i18nPath);   
			var lv_oBundle 	 = new sap.ui.model.resource.ResourceModel({
				bundleUrl	: lv_bundleUrl,		//"./i18n/i18n_en.properties"		       
			});	  
			return lv_oBundle;

		},
		getContentDensityClass : function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}
	});
});