/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("fcg.grc.accessrequest.approve.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
//jQuery.sap.require("fcg.grc.accessrequest.approve.Configuration");
jQuery.sap.require("sap.ui.core.routing.Router");                                                   
jQuery.sap.require("sap.ui.core.routing.History");  

// new Component
sap.ui.core.UIComponent.extend("fcg.grc.accessrequest.approve.Component", {
	metadata : {
		"manifest": "json",		  
		
	    "routing" : {

	        "config" : {
	            viewType : "XML",
				viewPath : "fcg.grc.accessrequest.approve.view",
				targetControl : "MainSplitContainer",
				targetAggregation : "detailPages",
				"viewLevel" : undefined,
				clearTarget : false,
				"resourceBundle" : "i18n/i18n.properties",
				"titleResource" : "shellTitle",
				"icon" : "sap-icon://Fiori2/F0412",
				"favIcon" : "./resources/sap/ca/ui/themes/base/img/favicon/F0412_Check_Request_Status.ico",
				"homeScreenIconPhone" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0412_Check_Request_Status/57_iPhone_Desktop_Launch.png",
				"homeScreenIconPhone@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0412_Check_Request_Status/114_iPhone-Retina_Web_Clip.png",
				"homeScreenIconTablet" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0412_Check_Request_Status/72_iPad_Desktop_Launch.png",
				"homeScreenIconTablet@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0412_Check_Request_Status/144_iPad_Retina_Web_Clip.png"
			},
	        "routes" : [{
				pattern : "", // will be the url and from has to be provided in the data
				view : "MainSplitContainer",
				name : "masterDetail",
				viewPath : "sap.ca.scfld.md.view",
				targetControl : "fioriContent", // This is the control in which the new view will be placed
				targetAggregation : "pages", // This is the aggregation in which the new view will be placed
				subroutes : [  {
	                        pattern : "",
	                        view : "RequestMaster",
	                        name : "master",
	                        targetAggregation: "masterPages"
	                    }, {
	                        pattern : "detail/{contextPath}", // will be the url and from has to be provided in the data
	                        view : "RequestDetail",
	                        name : "detail" //name used for listening or navigating to this route

	                    }, {
	                        pattern : "roleDetails/{contextPath}/{key}",//:?keyValue:",///{roleDesc}/{instanceId}/{lineItem}", // will be the url and from has to be provided in the data
	                        view : "RoleDetails",
	                        name : "roleDetails" //name used for listening or navigating to this route

	                    },{
	                        pattern : "masterUpdate/{contextPath}",
	                        view : "RequestMaster",
	                        name : "masterUpdate",
	                        targetAggregation: "masterPages"
	                    }]
			}]
		}

		},

	
	/**
	 * Initialize the application
	 * 
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent : function() {
        var oViewData = {component: this};
        return sap.ui.view({
			viewName : "fcg.grc.accessrequest.approve.Main",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	},
		

    init : function() {
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments); // calls createContent (among others)

        this.getRouter().attachRouteMatched(this._handleRouteMatched);

        // this component should automatically initialize the router!
        this.getRouter().initialize();
    },

    _handleRouteMatched : function (evt) {

        var oApp = evt.getParameter("targetControl");

        if (!(oApp instanceof sap.m.NavContainer || oApp instanceof sap.m.SplitContainer)) {
                return;
        }

        // close open popovers
        if (sap.m.InstanceManager.hasOpenPopover()) {
                sap.m.InstanceManager.closeAllPopovers();
        }

        // close open dialogs
        if (sap.m.InstanceManager.hasOpenDialog()) {
                sap.m.InstanceManager.closeAllDialogs();
        }

        // navigate to the view in nav container
        var oView = evt.getParameter("view");
        var iViewLevel = evt.getParameter("config").viewLevel;

        var bNextPageIsMaster = (oApp instanceof sap.m.SplitContainer) && !!oApp.getMasterPage(oView.getId()) ;

        var oHistory = sap.ui.core.routing.History.getInstance();

        var bBack;

        if(iViewLevel === undefined || this._iCurrentViewLevel === undefined || iViewLevel === this._iCurrentViewLevel){
                bBack = oHistory.getDirection() === "Backwards";
        } else {
                bBack = (iViewLevel !== undefined && iViewLevel < this._iCurrentViewLevel);
        }

        if (bBack) {
                // insert previous page if not in nav container yet
                var oPreviousPage = oApp.getPreviousPage(bNextPageIsMaster);
                if (!oPreviousPage || oPreviousPage.getId() !== oView.getId()) {
                    oApp.insertPreviousPage(oView.getId());
                }
                oApp.backToPage(oView.getId());
        } else {
                oApp.to(oView.getId());
        }

        this._iCurrentViewLevel = iViewLevel;
    }

	
});
