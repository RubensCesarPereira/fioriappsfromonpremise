/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("ui.s2p.mm.ses.approve.Component");
jQuery.sap.require("ui.s2p.mm.ses.approve.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

sap.ca.scfld.md.ComponentBase.extend("ui.s2p.mm.ses.approve.Component", {
		metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
			"name" : "Master Detail Sample",
			"version" : "1.4.3",
			"library" : "ui.s2p.mm.ses.approve",
			"includes" : [],
				"dependencies" : {
				"libs" : ["sap.m", "sap.me"],
			"components" : []
			},
			"config" : {
			//	"resourceBundle" : "i18n/i18n.properties",
			//	"titleResource" : "SHELL_TITLE",
			//	"icon" : "sap-icon://Fiori2/F0002",
			//	"favIcon" : "./resources/sap/ca/ui/themes/base/img/favicon/F0002_My_Accounts.ico",
			//	"homeScreenIconPhone" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/57_iPhone_Desktop_Launch.png",
			//	"homeScreenIconPhone@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/114_iPhone-Retina_Web_Clip.png",
			//	"homeScreenIconTablet" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/72_iPad_Desktop_Launch.png",
			//	"homeScreenIconTablet@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/144_iPad_Retina_Web_Clip.png",
			//	"startupImage320x460" : null, //add your own app splash screen path here, otherwise you are using Launchpad splash screen
			//	"startupImage640x920" : null,
			//	"startupImage640x1096" : null,
			//	"startupImage768x1004" : null,
			//	"startupImage748x1024" : null,
			//	"startupImage1536x2008" : null,
			//	"startupImage1496x2048" : null
		},
		viewPath : "ui.s2p.mm.ses.approve.view",
		
		// masterPageRoutes : {
		// // fill the routes to your master pages in here. The application will start with a navigation to route "master"
		// leading to master screen S2.
		// // If this is not desired please define your own route "master"
		// },
		 detailPageRoutes : {
		// //fill the routes to your detail pages in here. The application will navigate from the master page to route
		// //"detail" leading to detail screen S3.
		// If this is not desired please define your own route "detail"
		//		"toS5" : {
		//			"pattern" : "toS5",
		//			"view" : "S5",
		//		}
			"subDetail" : {
     			"pattern" : "subDetail/{contextPath}/{backPath}",
				"view" : "S4"
			}
		}
		//fullScreenPageRoutes : {
		//	// fill the routes to your full screen pages in here.
		//	"subDetail" : {
		//		"pattern" : "subDetail/{contextPath}",
		//		"view" : "S4",
		//	}
		//}
	}),
	
	/**
	 * Initialize the application
	 *
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent : function() {
		var oViewData = {
			component : this
		};
		var oView = sap.ui.view({
			viewName : "ui.s2p.mm.ses.approve.Main",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
		
	    var sPrefix = oView.getId() + "--";
	    var oEventBus = sap.ui.getCore().getEventBus();

	    this.oEventBus = {
	      publish: function(channelId, eventId, data) {
	        channelId = sPrefix + channelId;
	        oEventBus.publish(channelId, eventId, data);
	      },
	      subscribe: function(channelId, eventId, data, oListener) {
	        channelId = sPrefix + channelId;
	        oEventBus.subscribe(channelId, eventId, data, oListener);
	      },
	      unsubscribe: function(channelId, eventId, data, oListener) {
	        channelId = sPrefix + channelId;
	        oEventBus.unsubscribe(channelId, eventId, data, oListener);
	      }
	    };
	    return oView;
	}
});
