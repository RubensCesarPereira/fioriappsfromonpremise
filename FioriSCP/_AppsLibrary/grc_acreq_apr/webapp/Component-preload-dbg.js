jQuery.sap.registerPreloadedModules({
"name":"fcg/grc/accessrequest/approve/Component-preload",
"version":"2.0",
"modules":{
	"fcg/grc/accessrequest/approve/Component.js":function(){/*
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
},
	"fcg/grc/accessrequest/approve/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.grc.accessrequest.approve.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("fcg.grc.accessrequest.approve.Configuration", {

	oServiceParams: {
        serviceList: [
            {
                name: "GRC_ACCESSREQUEST_APPROVE",
                masterCollection: "Requests",
                serviceUrl: fcg.grc.accessrequest.approve.Component.getMetadata().getManifestEntry("sap.app").dataSources["GRC_ACCESSREQUEST_APPROVE"].uri, //"/sap/opu/odata/sap/GRC_ACCESSREQUEST_APPROVE/",
                isDefault: true,
                mockedDataSource: "/fcg.grc.accessrequest.approve/model/metadata.xml"
            }
        ]
    },

    getServiceParams: function () {
        return this.oServiceParams;
    },



    /**
     * @inherit
     */
    getServiceList: function () {
        return this.oServiceParams.serviceList;
    },
    
    getMasterKeyAttributes : function() {
        return ["Id"];
    }


});
},
	"fcg/grc/accessrequest/approve/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("fcg.grc.accessrequest.approve.Main", {

	onInit : function() {
        jQuery.sap.require("sap.ca.scfld.md.Startup");				
		sap.ca.scfld.md.Startup.init('fcg.grc.accessrequest.approve', this);
	},
	
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * 
	 * @memberOf MainXML
	 */
	onExit : function() {
		//exit cleanup code here
	}	
	
});
},
	"fcg/grc/accessrequest/approve/Main.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m" controllerName="fcg.grc.accessrequest.approve.Main" xmlns:html="http://www.w3.org/1999/xhtml"\n\tdisplayBlock="true" height="100%">\n\t<NavContainer id="fioriContent" showHeader="false">\n\t</NavContainer>\n</core:View>',
	"fcg/grc/accessrequest/approve/i18n/i18n.properties":'# Approve Access Request.\n# __ldi.translation.uuid=d55fa6c0-599d-11e3-949a-0800200c9a66\n\n#XFLD,15: Search\nSEARCH_TEXT=Search\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=Days ago\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=Day ago\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=Access Requests ({0})\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=System\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=Type\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=Status\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=Approver\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=Request {0}\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=Request reason\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=Logout\n\n#XTIT,44: App title.\nshellTitle=Check Requests for Approval\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=Request Access\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=Business Process\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=Functional Area\n\n#XTIT,16: Company \nCOMPANY_TEXT=Company\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=Prerequisites\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=Technical Name\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=Actions\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=Access Request\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=Role\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=System\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=Validity\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=Submit\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=Unlimited\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=Environment\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=Request {0} has been forwarded to {1}.\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=Access Details\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=No Access Requested\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=Access\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=Info\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=Approve\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL= {0} Risks \n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL= Risks \n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL= {0} Risk \n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=Description\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=Risk Level\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE=Approve Request {0} for {1} ?\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=Add Comments (optional)\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=Forward\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=Requester\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=User: {0}\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=No forward users found\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=OK\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=Cancel\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=Thanks\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=Add Comments\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=To\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG = {0} items has been approved and {1} items has been rejected for request {2}.            \n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT = Today\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT = No Requests Found\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT = No Risks Found\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT = No Actions Found\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT = Reject Comments\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT = Reject Access : {0}\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT = Approve {0} and Reject {1} items in request {2} for {3} ?\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT = Access Type : {0}\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=Retry later\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT = Error\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION = You are not authorized to take action on this access.\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT = Validity From\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT = Validity Till',
	"fcg/grc/accessrequest/approve/i18n/i18n_ar.properties":'\n#XFLD,15: Search\nSEARCH_TEXT=\\u0628\\u062D\\u062B\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=\\u064A\\u0648\\u0645/\\u0623\\u064A\\u0627\\u0645 \\u0645\\u0636\\u062A\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=\\u0645\\u0646\\u0630 \\u064A\\u0648\\u0645 \\u0648\\u0627\\u062D\\u062F\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=\\u0637\\u0644\\u0628\\u0627\\u062A \\u0627\\u0644\\u0648\\u0635\\u0648\\u0644 ({0})\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=\\u0627\\u0644\\u0646\\u0638\\u0627\\u0645\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=\\u0627\\u0644\\u0646\\u0648\\u0639\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=\\u0627\\u0644\\u062D\\u0627\\u0644\\u0629\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=\\u0627\\u0644\\u0645\\u0639\\u062A\\u0645\\u0650\\u062F\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=\\u0627\\u0644\\u0637\\u0644\\u0628 {0}\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=\\u0633\\u0628\\u0628 \\u0627\\u0644\\u0637\\u0644\\u0628\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=\\u062A\\u0633\\u062C\\u064A\\u0644 \\u062E\\u0631\\u0648\\u062C\n\n#XTIT,44: App title.\nshellTitle=\\u0641\\u062D\\u0635 \\u0627\\u0644\\u0637\\u0644\\u0628\\u0627\\u062A \\u0627\\u0644\\u0645\\u0637\\u0644\\u0648\\u0628 \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F\\u0647\\u0627\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0648\\u0635\\u0648\\u0644\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=\\u0639\\u0645\\u0644\\u064A\\u0629 \\u0627\\u0644\\u0623\\u0639\\u0645\\u0627\\u0644\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=\\u0627\\u0644\\u0645\\u0646\\u0637\\u0642\\u0629 \\u0627\\u0644\\u0648\\u0638\\u064A\\u0641\\u064A\\u0629\n\n#XTIT,16: Company \nCOMPANY_TEXT=\\u0627\\u0644\\u0634\\u0631\\u0643\\u0629\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=\\u0627\\u0644\\u0645\\u062A\\u0637\\u0644\\u0628\\u0627\\u062A \\u0627\\u0644\\u0623\\u0633\\u0627\\u0633\\u064A\\u0629\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=\\u0627\\u0644\\u0627\\u0633\\u0645 \\u0627\\u0644\\u062A\\u0642\\u0646\\u064A\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=\\u0627\\u0644\\u0625\\u062C\\u0631\\u0627\\u0621\\u0627\\u062A\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0648\\u0635\\u0648\\u0644\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=\\u0627\\u0644\\u062F\\u0648\\u0631\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=\\u0627\\u0644\\u0646\\u0638\\u0627\\u0645\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=\\u0627\\u0644\\u0635\\u0644\\u0627\\u062D\\u064A\\u0629\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=\\u062A\\u0642\\u062F\\u064A\\u0645\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=\\u063A\\u064A\\u0631 \\u0645\\u062D\\u062F\\u0648\\u062F\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=\\u0627\\u0644\\u0628\\u064A\\u0626\\u0629\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=\\u0644\\u0642\\u062F \\u062A\\u0645\\u062A \\u0625\\u0639\\u0627\\u062F\\u0629 \\u062A\\u0648\\u062C\\u064A\\u0647 \\u0627\\u0644\\u0637\\u0644\\u0628 {0} \\u0625\\u0644\\u0649 {1}.\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u0648\\u0635\\u0648\\u0644\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u0637\\u0644\\u0628 \\u0648\\u0635\\u0648\\u0644\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=\\u0648\\u0635\\u0648\\u0644\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=\\u0645\\u0639\\u0644\\u0648\\u0645\\u0627\\u062A\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL={0} \\u0645\\u062E\\u0627\\u0637\\u0631 \n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL=\\u0645\\u062E\\u0627\\u0637\\u0631\n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL={0} \\u0645\\u062E\\u0627\\u0637\\u0631\\u0629 \n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=\\u0627\\u0644\\u0648\\u0635\\u0641\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=\\u0645\\u0633\\u062A\\u0648\\u0649 \\u0627\\u0644\\u0645\\u062E\\u0627\\u0637\\u0631\\u0629\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE=\\u0647\\u0644 \\u062A\\u0631\\u063A\\u0628 \\u0641\\u064A \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0637\\u0644\\u0628 {0} \\u0644\\u0640 {1} ?\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u062A\\u0639\\u0644\\u064A\\u0642\\u0627\\u062A (\\u0627\\u062E\\u062A\\u064A\\u0627\\u0631\\u064A)\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=\\u0625\\u0639\\u0627\\u062F\\u0629 \\u0627\\u0644\\u062A\\u0648\\u062C\\u064A\\u0647\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=\\u0627\\u0644\\u0637\\u0627\\u0644\\u0628\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=\\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645\\: {0}\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u0627\\u0644\\u0639\\u062B\\u0648\\u0631 \\u0639\\u0644\\u0649 \\u0645\\u0633\\u062A\\u062E\\u062F\\u0645\\u064A\\u0646 \\u0644\\u0644\\u0625\\u0631\\u0633\\u0627\\u0644\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=\\u0645\\u0648\\u0627\\u0641\\u0642\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=\\u0625\\u0644\\u063A\\u0627\\u0621\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=\\u0634\\u0643\\u0631\\u064B\\u0627\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u062A\\u0639\\u0644\\u064A\\u0642\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=\\u0625\\u0644\\u0649\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG=\\u062A\\u0645 \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F {0} \\u0645\\u0646 \\u0627\\u0644\\u0639\\u0646\\u0627\\u0635\\u0631 \\u0648\\u062A\\u0645 \\u0631\\u0641\\u0636 {1} \\u0645\\u0646 \\u0627\\u0644\\u0639\\u0646\\u0627\\u0635\\u0631 \\u0644\\u0644\\u0637\\u0644\\u0628 {2}.            \n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT=\\u0627\\u0644\\u064A\\u0648\\u0645\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT=\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u0627\\u0644\\u0639\\u062B\\u0648\\u0631 \\u0639\\u0644\\u0649 \\u0623\\u064A\\u0629 \\u0637\\u0644\\u0628\\u0627\\u062A\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT=\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u0627\\u0644\\u0639\\u062B\\u0648\\u0631 \\u0639\\u0644\\u0649 \\u0623\\u064A\\u0629 \\u0645\\u062E\\u0627\\u0637\\u0631\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT=\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u0627\\u0644\\u0639\\u062B\\u0648\\u0631 \\u0639\\u0644\\u0649 \\u0623\\u064A\\u0629 \\u0625\\u062C\\u0631\\u0627\\u0621\\u0627\\u062A\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT=\\u062A\\u0639\\u0644\\u064A\\u0642\\u0627\\u062A \\u0627\\u0644\\u0631\\u0641\\u0636\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT=\\u0631\\u0641\\u0636 \\u0627\\u0644\\u0648\\u0635\\u0648\\u0644\\: {0}\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT=\\u0647\\u0644 \\u062A\\u0631\\u063A\\u0628 \\u0641\\u064A \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F {0} \\u0645\\u0646 \\u0627\\u0644\\u0639\\u0646\\u0627\\u0635\\u0631 \\u0648\\u0631\\u0641\\u0636 {1} \\u0645\\u0646 \\u0627\\u0644\\u0639\\u0646\\u0627\\u0635\\u0631 \\u0641\\u064A \\u0627\\u0644\\u0637\\u0644\\u0628 {2} \\u0644\\u0640 {3} ?\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT=\\u0646\\u0648\\u0639 \\u0627\\u0644\\u0648\\u0635\\u0648\\u0644\\: {0}\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=\\u0623\\u0639\\u062F \\u0627\\u0644\\u0645\\u062D\\u0627\\u0648\\u0644\\u0629 \\u0644\\u0627\\u062D\\u0642\\u064B\\u0627\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT=\\u062E\\u0637\\u0623\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION=\\u0644\\u064A\\u0633 \\u0644\\u062F\\u064A\\u0643 \\u062A\\u0641\\u0648\\u064A\\u0636 \\u0644\\u0627\\u062A\\u062E\\u0627\\u0630 \\u0625\\u062C\\u0631\\u0627\\u0621 \\u0628\\u0647\\u0630\\u0627 \\u0627\\u0644\\u0648\\u0635\\u0648\\u0644.\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT=\\u0628\\u062F\\u0621 \\u0627\\u0644\\u0635\\u0644\\u0627\\u062D\\u064A\\u0629\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT=\\u0627\\u0646\\u062A\\u0647\\u0627\\u0621 \\u0627\\u0644\\u0635\\u0644\\u0627\\u062D\\u064A\\u0629\n',
	"fcg/grc/accessrequest/approve/i18n/i18n_cs.properties":'\n#XFLD,15: Search\nSEARCH_TEXT=Hledat\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=dny p\\u0159ed\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=den p\\u0159ed\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=P\\u0159\\u00EDstupov\\u00E9 po\\u017Eadavky ({0})\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=Syst\\u00E9m\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=Typ\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=Status\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=Schvalovatel\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=Po\\u017Eadavek {0}\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=D\\u016Fvod pro po\\u017Eadavek\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=Odhl\\u00E1sit\n\n#XTIT,44: App title.\nshellTitle=Zkontrolovat po\\u017Eadavky ke schv\\u00E1len\\u00ED\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=\\u017D\\u00E1dost o p\\u0159\\u00EDstup\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=Obchodn\\u00ED proces\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=Funk\\u010Dn\\u00ED oblast\n\n#XTIT,16: Company \nCOMPANY_TEXT=Firma\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=P\\u0159edpoklady\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=Technick\\u00FD n\\u00E1zev\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=\\u010Cinnosti\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=P\\u0159\\u00EDstup - po\\u017Eadavek\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=Role\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=Syst\\u00E9m\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=Platnost\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=Odeslat\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=Neomezen\\u011B\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=Prost\\u0159ed\\u00ED\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=Po\\u017Eadavek {0} byl p\\u0159ed\\u00E1n {1}.\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=Detaily p\\u0159\\u00EDstupu\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=Nepo\\u017Eadov\\u00E1n \\u017E\\u00E1dn\\u00FD p\\u0159\\u00EDstup\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=P\\u0159\\u00EDstup\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=Informace\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=Schv\\u00E1lit\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL=Rizika\\: {0} \n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL=Rizika\n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL={0} riziko \n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=Popis\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=\\u00DArove\\u0148 rizika\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE=Schv\\u00E1lit po\\u017Eadavek {0} pro {1} ?\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=P\\u0159idat koment\\u00E1\\u0159e (voliteln\\u00E9)\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=P\\u0159edat\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=\\u017Dadatel\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=U\\u017Eivatel\\: {0}\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=Nebyli nalezeni u\\u017Eivatel\\u00E9 k p\\u0159ed\\u00E1n\\u00ED\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=OK\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=Zru\\u0161it\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=D\\u011Bkujeme\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=P\\u0159idat koment\\u00E1\\u0159\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=Komu\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG={0} polo\\u017Eek bylo schv\\u00E1leno a {1} polo\\u017Eek bylo zam\\u00EDtnuto pro po\\u017Eadavek {2}.            \n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT=Dnes\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT=Nebyly nalezeny \\u017E\\u00E1dn\\u00E9 po\\u017Eadavky\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT=Nebyla nalezena \\u017E\\u00E1dn\\u00E1 rizika\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT=Nebyly nalezeny \\u017E\\u00E1dn\\u00E9 akce\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT=Koment\\u00E1\\u0159e k zam\\u00EDtnut\\u00ED\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT=Zam\\u00EDtnout p\\u0159\\u00EDstup\\: {0}\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT=Schv\\u00E1lit {0} polo\\u017Eek a zam\\u00EDtnout {1} polo\\u017Eek v po\\u017Eadavku {2} pro {3}?\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT=Typ p\\u0159\\u00EDstupu\\: {0}\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=Zkuste znovu pozd\\u011Bji\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT=Chyba\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION=Nem\\u00E1te opr\\u00E1vn\\u011Bn\\u00ED prov\\u00E9st akci pro tento p\\u0159\\u00EDstup.\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT=Platnost od\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT=Platnost do\n',
	"fcg/grc/accessrequest/approve/i18n/i18n_de.properties":'\n#XFLD,15: Search\nSEARCH_TEXT=Suche\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=Tage zuvor\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=Tag zuvor\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=Zugriffsanforderungen ({0})\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=System\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=Art\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=Status\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=Genehmigender\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=Anforderung {0}\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=Anforderungsursache\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=Abmelden\n\n#XTIT,44: App title.\nshellTitle=Zu genehmigende Anforderungen pr\\u00FCfen\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=Zugriff anfordern\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=Gesch\\u00E4ftsprozess\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=Funktionsbereich\n\n#XTIT,16: Company \nCOMPANY_TEXT=Unternehmen\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=Voraussetzungen\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=Technischer Name\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=Aktionen\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=Zugriffsanforderung\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=Rolle\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=System\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=G\\u00FCltigkeit\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=Absenden\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=Unbegrenzt\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=Umgebung\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=Anforderung {0} an {1} weitergeleitet.\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=Zugriffsdetails\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=Kein Zugriff angefordert\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=Zugriff\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=Info\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=Genehmigen\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL={0} Risiken \n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL=Risiken\n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL={0} Risiko \n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=Beschreibung\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=Risikostufe\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE=M\\u00F6chten Sie Anforderung {0} f\\u00FCr {1} genehmigen?\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=Kommentare hinzuf\\u00FCgen (optional)\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=Weiterleiten\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=Anforderer\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=Benutzer\\: {0}\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=Keine Benutzer zum Weiterleiten\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=OK\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=Abbrechen\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=Vielen Dank\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=Kommentar hinzuf\\u00FCgen\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=Bis\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG=F\\u00FCr Anforderung {2} wurden {0} Positionen genehmigt und {1} Positionen abgelehnt.            \n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT=Heute\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT=Keine Anforderungen gefunden\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT=Keine Risiken gefunden\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT=Keine Aktionen gefunden\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT=Kommentare zur Ablehnung\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT=Zugriff ablehnen\\: {0}\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT=M\\u00F6chten Sie in der Anforderung  {2} f\\u00FCr {3} {0} Positionen genehmigen und {1} Positionen ablehnen?\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT=Art des Zugriffs\\: {0}\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=Versuchen Sie es sp\\u00E4ter erneut\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT=Fehler\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION=Sie sind nicht berechtigt, eine Aktion mit diesem Zugriff auszuf\\u00FChren.\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT=G\\u00FCltig ab\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT=G\\u00FCltig bis\n',
	"fcg/grc/accessrequest/approve/i18n/i18n_en.properties":'\n#XFLD,15: Search\nSEARCH_TEXT=Search\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=days ago\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=day ago\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=Access Requests ({0})\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=System\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=Type\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=Status\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=Approver\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=Request {0}\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=Reason for Request\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=Log Out\n\n#XTIT,44: App title.\nshellTitle=Check Requests to Be Approved\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=Request Access\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=Business Process\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=Functional Area\n\n#XTIT,16: Company \nCOMPANY_TEXT=Company\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=Prerequisites\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=Technical Name\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=Actions\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=Access Request\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=Role\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=System\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=Validity\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=Submit\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=Unlimited\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=Environment\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=Request {0} has been forwarded to {1}.\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=Access Details\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=No access requested\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=Access\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=Info\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=Approve\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL={0} Risks \n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL=Risks\n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL={0} Risk \n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=Description\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=Risk Level\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE=Approve request {0} for {1} ?\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=Add comments (optional)\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=Forward\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=Requester\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=User\\: {0}\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=No users found for forwarding\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=OK\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=Cancel\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=Thanks\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=Add a comment\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=To\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG={0} items have been approved and {1} items have been rejected for request {2}.            \n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT=Today\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT=No requests found\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT=No risks found\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT=No actions found\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT=Rejection Comments\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT=Reject Access\\: {0}\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT=Approve {0} items and reject {1} items in request {2} for {3} ?\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT=Access Type\\: {0}\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=Try again later\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT=Error\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION=You are not authorized to take action on this access.\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT=Validity From\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT=Validity To\n',
	"fcg/grc/accessrequest/approve/i18n/i18n_en_US_sappsd.properties":'\n#XFLD,15: Search\nSEARCH_TEXT=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=[[[\\u010E\\u0105\\u0177\\u015F \\u0105\\u011F\\u014F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=[[[\\u010E\\u0105\\u0177 \\u0105\\u011F\\u014F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=[[[\\u0100\\u010B\\u010B\\u0113\\u015F\\u015F \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u015F ({0})]]]\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=[[[\\u015C\\u0177\\u015F\\u0163\\u0113\\u0271\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=[[[\\u0162\\u0177\\u03C1\\u0113]]]\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=[[[\\u015C\\u0163\\u0105\\u0163\\u0171\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=[[[\\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 {0}]]]\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=[[[\\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u0157\\u0113\\u0105\\u015F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=[[[\\u013B\\u014F\\u011F\\u014F\\u0171\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT,44: App title.\nshellTitle=[[[\\u0108\\u0125\\u0113\\u010B\\u0137 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u015F \\u0192\\u014F\\u0157 \\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0105\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=[[[\\!\\!\\!\\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u0100\\u010B\\u010B\\u0113\\u015F\\u015F]]]\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=[[[\\u0181\\u0171\\u015F\\u012F\\u014B\\u0113\\u015F\\u015F \\u01A4\\u0157\\u014F\\u010B\\u0113\\u015F\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=[[[\\u0191\\u0171\\u014B\\u010B\\u0163\\u012F\\u014F\\u014B\\u0105\\u013A \\u0100\\u0157\\u0113\\u0105\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT,16: Company \nCOMPANY_TEXT=[[[\\u0108\\u014F\\u0271\\u03C1\\u0105\\u014B\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=[[[\\u01A4\\u0157\\u0113\\u0157\\u0113\\u01A3\\u0171\\u012F\\u015F\\u012F\\u0163\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=[[[\\u0162\\u0113\\u010B\\u0125\\u014B\\u012F\\u010B\\u0105\\u013A \\u0143\\u0105\\u0271\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=[[[\\u0100\\u010B\\u0163\\u012F\\u014F\\u014B\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=[[[\\u0100\\u010B\\u010B\\u0113\\u015F\\u015F \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=[[[\\u0158\\u014F\\u013A\\u0113]]]\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=[[[\\u015C\\u0177\\u015F\\u0163\\u0113\\u0271\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=[[[\\u01B2\\u0105\\u013A\\u012F\\u018C\\u012F\\u0163\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=[[[\\u015C\\u0171\\u0183\\u0271\\u012F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=[[[\\u016E\\u014B\\u013A\\u012F\\u0271\\u012F\\u0163\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=[[[\\u0114\\u014B\\u028B\\u012F\\u0157\\u014F\\u014B\\u0271\\u0113\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=[[[\\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 {0} \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u0192\\u014F\\u0157\\u0175\\u0105\\u0157\\u018C\\u0113\\u018C \\u0163\\u014F {1}.]]]\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=[[[\\u0100\\u010B\\u010B\\u0113\\u015F\\u015F \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=[[[\\u0143\\u014F \\u0100\\u010B\\u010B\\u0113\\u015F\\u015F \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=[[[\\u0100\\u010B\\u010B\\u0113\\u015F\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=[[[\\u012C\\u014B\\u0192\\u014F]]]\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL=[[[{0} \\u0158\\u012F\\u015F\\u0137\\u015F ]]]\n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL=[[[\\u0158\\u012F\\u015F\\u0137\\u015F \\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL=[[[{0} \\u0158\\u012F\\u015F\\u0137 ]]]\n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=[[[\\u010E\\u0113\\u015F\\u010B\\u0157\\u012F\\u03C1\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=[[[\\u0158\\u012F\\u015F\\u0137 \\u013B\\u0113\\u028B\\u0113\\u013A\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 {0} \\u0192\\u014F\\u0157 {1} ?]]]\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=[[[\\u0100\\u018C\\u018C \\u0108\\u014F\\u0271\\u0271\\u0113\\u014B\\u0163\\u015F (\\u014F\\u03C1\\u0163\\u012F\\u014F\\u014B\\u0105\\u013A)\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=[[[\\u0191\\u014F\\u0157\\u0175\\u0105\\u0157\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=[[[\\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=[[[\\u016E\\u015F\\u0113\\u0157\\: {0}]]]\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=[[[\\u0143\\u014F \\u0192\\u014F\\u0157\\u0175\\u0105\\u0157\\u018C \\u0171\\u015F\\u0113\\u0157\\u015F \\u0192\\u014F\\u0171\\u014B\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=[[[\\u014E\\u0136\\u2219\\u2219]]]\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=[[[\\u0162\\u0125\\u0105\\u014B\\u0137\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=[[[\\u0100\\u018C\\u018C \\u0108\\u014F\\u0271\\u0271\\u0113\\u014B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=[[[\\u0162\\u014F\\u2219\\u2219]]]\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG=[[[{0} \\u012F\\u0163\\u0113\\u0271\\u015F \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u0105\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u018C \\u0105\\u014B\\u018C {1} \\u012F\\u0163\\u0113\\u0271\\u015F \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u0157\\u0113\\u0135\\u0113\\u010B\\u0163\\u0113\\u018C \\u0192\\u014F\\u0157 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 {2}.            ]]]\n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT=[[[\\u0162\\u014F\\u018C\\u0105\\u0177\\u2219]]]\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT=[[[\\u0143\\u014F \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u015F \\u0191\\u014F\\u0171\\u014B\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT=[[[\\u0143\\u014F \\u0158\\u012F\\u015F\\u0137\\u015F \\u0191\\u014F\\u0171\\u014B\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT=[[[\\u0143\\u014F \\u0100\\u010B\\u0163\\u012F\\u014F\\u014B\\u015F \\u0191\\u014F\\u0171\\u014B\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163 \\u0108\\u014F\\u0271\\u0271\\u0113\\u014B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163 \\u0100\\u010B\\u010B\\u0113\\u015F\\u015F \\: {0}]]]\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113 {0} \\u0105\\u014B\\u018C \\u0158\\u0113\\u0135\\u0113\\u010B\\u0163 {1} \\u012F\\u0163\\u0113\\u0271\\u015F \\u012F\\u014B \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 {2} \\u0192\\u014F\\u0157 {3} ?]]]\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT=[[[\\u0100\\u010B\\u010B\\u0113\\u015F\\u015F \\u0162\\u0177\\u03C1\\u0113 \\: {0}]]]\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=[[[\\u0158\\u0113\\u0163\\u0157\\u0177 \\u013A\\u0105\\u0163\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT=[[[\\u0114\\u0157\\u0157\\u014F\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION=[[[\\u0176\\u014F\\u0171 \\u0105\\u0157\\u0113 \\u014B\\u014F\\u0163 \\u0105\\u0171\\u0163\\u0125\\u014F\\u0157\\u012F\\u017E\\u0113\\u018C \\u0163\\u014F \\u0163\\u0105\\u0137\\u0113 \\u0105\\u010B\\u0163\\u012F\\u014F\\u014B \\u014F\\u014B \\u0163\\u0125\\u012F\\u015F \\u0105\\u010B\\u010B\\u0113\\u015F\\u015F.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT=[[[\\u01B2\\u0105\\u013A\\u012F\\u018C\\u012F\\u0163\\u0177 \\u0191\\u0157\\u014F\\u0271\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT=[[[\\u01B2\\u0105\\u013A\\u012F\\u018C\\u012F\\u0163\\u0177 \\u0162\\u012F\\u013A\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n',
	"fcg/grc/accessrequest/approve/i18n/i18n_en_US_saptrc.properties":'\n#XFLD,15: Search\nSEARCH_TEXT=UGIOEFwqafDeW/bRnkhUCg_Search\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=H8sfSMO9l1zccklql8Z4Tg_Days ago\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=jJcveZknBvfGirYas8dsJw_Day ago\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=KTbB8B4perH5KcuZyPj9KA_Access Requests ({0})\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=Dy14RyUmvQj0x08A6ImrfA_System\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=k9NFYGewtit7369ZmbJnRw_Type\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=hsqWEwEbDjRs2kARLIAnsg_Status\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=6nofuRj6xucWuWGhHJuDYw_Approver\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=RhK4Map1z0K2dpWF1KcXZQ_Request {0}\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=BLx2XDcy9o6eJgzyAM/RnQ_Request reason\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=eEjKa0lMU0We2VTvWP1mIw_Logout\n\n#XTIT,44: App title.\nshellTitle=J0wfeHrlhgeQ7NJqvsLaoA_Check Requests for Approval\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=OmdN1X8wD8VcuclO5eJsxA_Request Access\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=bc7/EMBKiCyWYAk27KCtww_Business Process\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=dCi+e9vgPx/ZF2H8LqFPbw_Functional Area\n\n#XTIT,16: Company \nCOMPANY_TEXT=Uzx+lrrjOWoUu1JHlKtaYw_Company\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=yE0pipNc+1btditP6cZNXw_Prerequisites\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=gmef0NgkXfUmY3taDlBZbA_Technical Name\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=6qlty6Si7v09ee4lB8UhmA_Actions\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=0tclPCHou0a+Du4AJwVbNw_Access Request\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=5svadqD/TQscTJV3euzfww_Role\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=J5oGHV5Mvr46LAB8r/GXVw_System\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=QJUj3mu/O4xEl3quqrl7KA_Validity\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=+3Mw4JZZbtBcuxZG5pXspw_Submit\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=eHL/qxORr+Yqi4540OpQjQ_Unlimited\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=M+hcxIXJULOxL9VNYRSuSg_Environment\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=OqpfHQq1z/ciERrlQl67qA_Request {0} has been forwarded to {1}.\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=VtsuNh7b1TOiOxchvZp3EQ_Access Details\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=+rrMKdH5+Utjc+7D94BJSA_No Access Requested\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=miXWOawd1q2PzBe4cQJm6A_Access\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=pNqBmz6zURYldkFQqpq1Xg_Info\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=pftXexR3P4mhbdcNTgxAAw_Approve\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL=sCSj5UM/DomZ8hl67DEmEA_{0} Risks \n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL=BLQn93xdje+I+LAlDtB09A_Risks \n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL=RoYOJmRVTXn7zwQnjBOgqQ_{0} Risk \n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=YZQmyblLtPXf4O1uOE0ZWw_Description\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=l53fUju1QNmW9IowCL8fIg_Risk Level\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE=mHi/28MRH1XJFIuVA5F30g_Approve Request {0} for {1} ?\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=H/mBLIBebLvuDAzKpWC+0A_Add Comments (optional)\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=xuhkLHZgojd/Sa8KDmafPA_Forward\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=KlzGK7RkEzj2dDYvzmq1UA_Requester\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=AFtyBEtHSNaznpxl8FODEA_User\\: {0}\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=/lvwV6nzEKHc3MALWTlpiQ_No forward users found\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=UxDZYfdfofmkNVLeihFhWA_OK\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=ru149vNkeHF+2kUZkyUqUA_Cancel\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=dqQF1dP0waZM/Hf36cp/dA_Thanks\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=t4x/ZSHfV5itCaKz+ax7dQ_Add Comments\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=H9gPEEKWVcEbHfG6NskStw_To\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG=npMAf7kmH7no+4ZqBMhU+A_{0} items has been approved and {1} items has been rejected for request {2}.            \n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT=ygh4o7ow07257LJfwCyb2g_Today\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT=EtIrHdlbi0pRJ0f/6M1mww_No Requests Found\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT=WWJJciY2+FvXefJM5rzh/Q_No Risks Found\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT=rjz1xGLMjgW8e1BXrw2ppw_No Actions Found\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT=b4+Hmtqyr60mMFpUg9NEiQ_Reject Comments\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT=2fYr8+YTLdxg6vZdJm4TkQ_Reject Access \\: {0}\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT=FH8hXyeOk78QRYvnzkFItA_Approve {0} and Reject {1} items in request {2} for {3} ?\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT=y7zLQD6N3dUpwWqlcrGBYA_Access Type \\: {0}\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=sz10OkMKNjS20rOKe+fR6Q_Retry later\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT=FuTZZ1yRMOKUBnBMfqYm7g_Error\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION=Zwxt7RZRbcLf4WXNbV9kfQ_You are not authorized to take action on this access.\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT=9bIS7Uq2nIgvWp0YVEQLWQ_Validity From\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT=65L6HmnIlOahKOr9G+Xt7g_Validity Till\n',
	"fcg/grc/accessrequest/approve/i18n/i18n_es.properties":'\n#XFLD,15: Search\nSEARCH_TEXT=Buscar\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=d\\u00EDas\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=d\\u00EDa\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=Solicitudes de acceso ({0})\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=Sistema\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=Tipo\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=Estado\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=Autorizador\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=Solicitud {0}\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=Motivo de la solicitud\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=Fin.sesi\\u00F3n\n\n#XTIT,44: App title.\nshellTitle=Consulta de solicitudes para aprobar\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=Solicitar acceso\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=Proceso empresarial\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=\\u00C1rea funcional\n\n#XTIT,16: Company \nCOMPANY_TEXT=Empresa\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=Requisitos previos\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=Nombre t\\u00E9cnico\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=Acciones\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=Solicitud de acceso\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=Rol\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=Sistema\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=Validez\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=Enviar\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=Ilimitado\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=Entorno\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=Se ha transmitido la solicitud {0} a {1}.\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=Acceder a detalles\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=No se ha solicitado acceso\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=Acceso\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=Informaci\\u00F3n\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=Aprobar\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL={0} riesgos \n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL=Riesgos\n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL={0} riesgo \n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=Descripci\\u00F3n\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=Nivel de riesgo\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE=Aprobar la solicitud {0} para {1} ?\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=A\\u00F1adir comentarios (opcional)\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=Transmitir\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=Solicitante\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=Usuario\\: {0}\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=No hay usuarios para transmitir\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=OK\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=Cancelar\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=Gracias\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=A\\u00F1adir un comentario\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=Hasta\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG=Se han aprobado {0} posiciones y se han rechazado {1} posiciones para la solicitud {2}.            \n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT=Hoy\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT=No se encontraron solicitudes\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT=No se encontraron riesgos\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT=No se encontraron acciones\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT=Comentarios de rechazo\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT=Rechazar acceso\\: {0}\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT=\\u00BFAprobar {0} solicitudes y rechazar {1} posiciones en la solicitud {2} de {3} ?\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT=Tipo de acceso\\: {0}\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=Vuelva a intentarlo m\\u00E1s tarde\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT=Error\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION=No est\\u00E1 autorizado para tomar acci\\u00F3n en este acceso.\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT=Inicio de validez\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT=Fin de validez\n',
	"fcg/grc/accessrequest/approve/i18n/i18n_fr.properties":'\n#XFLD,15: Search\nSEARCH_TEXT=Rechercher\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=jours avant\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=jour avant\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=Demandes d\'\'acc\\u00E8s ({0})\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=Syst\\u00E8me\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=Type\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=Statut\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=Approbateur\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=Demande {0}\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=Motif de demande\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=D\\u00E9connexion\n\n#XTIT,44: App title.\nshellTitle=Contr\\u00F4le de demandes \\u00E0 approuver\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=Demande d\'acc\\u00E8s\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=Processus de gestion\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=Domaine fonctionnel\n\n#XTIT,16: Company \nCOMPANY_TEXT=Entreprise\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=Conditions\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=Nom technique\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=Actions\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=Demande d\'acc\\u00E8s\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=R\\u00F4le\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=Syst\\u00E8me\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=Validit\\u00E9\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=Envoyer\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=Illimit\\u00E9e\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=Environnement\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=La demande {0} a \\u00E9t\\u00E9 transf\\u00E9r\\u00E9e \\u00E0 {1}.\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=D\\u00E9tails de l\'acc\\u00E8s\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=Aucun acc\\u00E8s demand\\u00E9\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=Acc\\u00E8s\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=Infos\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=Approuver\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL=Risques\\u00A0\\: {0} \n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL=Risques\n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL=Risque\\u00A0\\: {0} \n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=Description\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=Niveau de risque\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE=Approuver la demande {0} pour {1}\\u00A0?\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=Ajouter commentaires (facultatif)\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=Transf\\u00E9rer\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=Demandeur\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=Utilisateur\\u00A0\\: {0}\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=Auc. utilisat. trouv\\u00E9 pr transfert\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=OK\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=Annuler\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=Merci\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=Ajouter un commentaire\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=\\u00E0\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG={0} \\u00E9l\\u00E9ments ont \\u00E9t\\u00E9 approuv\\u00E9s et {1} \\u00E9l\\u00E9ments refus\\u00E9s concernant la demande {2}.            \n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT=Aujourd\'hui\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT=Aucune demande trouv\\u00E9e\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT=Aucun risque trouv\\u00E9\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT=Aucune action trouv\\u00E9e\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT=Commentaires associ\\u00E9s au refus\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT=Refus d\'\'acc\\u00E8s\\u00A0\\: {0}\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT=Approuver {0} \\u00E9l\\u00E9ments et refuser {1} \\u00E9l\\u00E9ments dans la demande {2} pour {3}\\u00A0?\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT=Type d\'\'acc\\u00E8s\\u00A0\\: {0}\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=R\\u00E9essayez ult\\u00E9rieurement.\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT=Erreur\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION=Vous n\'\\u00EAtes pas autoris\\u00E9 \\u00E0 agir sur cet acc\\u00E8s.\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT=D\\u00E9but de validit\\u00E9\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT=Fin de validit\\u00E9\n',
	"fcg/grc/accessrequest/approve/i18n/i18n_hu.properties":'\n#XFLD,15: Search\nSEARCH_TEXT=Keres\\u00E9s\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=napja\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=napja\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=Hozz\\u00E1f\\u00E9r\\u00E9si k\\u00E9relmek ({0})\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=Rendszer\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=T\\u00EDpus\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=St\\u00E1tus\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=Enged\\u00E9lyez\\u0151\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=K\\u00E9relem {0}\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=K\\u00E9relem oka\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=Kijelentkez\\u00E9s\n\n#XTIT,44: App title.\nshellTitle=Enged\\u00E9lyezend\\u0151 k\\u00E9relmek ellen\\u0151rz\\u00E9se\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=Hozz\\u00E1f\\u00E9r\\u00E9s k\\u00E9r\\u00E9se\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=\\u00DCzleti folyamat\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=Funkci\\u00F3ter\\u00FClet\n\n#XTIT,16: Company \nCOMPANY_TEXT=V\\u00E1llalat\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=El\\u0151felt\\u00E9telek\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=M\\u0171szaki n\\u00E9v\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=M\\u0171veletek\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=Hozz\\u00E1f\\u00E9r\\u00E9si k\\u00E9relem\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=Szerep\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=Rendszer\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=\\u00C9rv\\u00E9nyess\\u00E9g\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=Elk\\u00FCld\\u00E9s\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=Korl\\u00E1tlan\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=K\\u00F6rnyezet\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=A k\\u00E9relem {0} tov\\u00E1bb\\u00EDtva {1} sz\\u00E1m\\u00E1ra.\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=Hozz\\u00E1f\\u00E9r\\u00E9s a r\\u00E9szletekhez\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=Nem k\\u00E9relmezett hozz\\u00E1f\\u00E9r\\u00E9st\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=Hozz\\u00E1f\\u00E9r\\u00E9s\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=Inform\\u00E1ci\\u00F3\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=Enged\\u00E9lyez\\u00E9s\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL={0} kock\\u00E1zatok \n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL=Kock\\u00E1zatok\n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL={0} kock\\u00E1zat \n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=Le\\u00EDr\\u00E1s\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=Kock\\u00E1zati szint\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE={0} k\\u00E9relem enged\\u00E9lyez\\u00E9se {1} sz\\u00E1m\\u00E1ra?\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=Megjegyz\\u00E9sek megad\\u00E1sa (opcion\\u00E1lis)\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=Tov\\u00E1bb\\u00EDt\\u00E1s\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=K\\u00E9relmez\\u0151\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=Felhaszn\\u00E1l\\u00F3\\: {0}\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=Nem tal\\u00E1lh. felhaszn. a tov\\u00E1bb.-hoz\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=Rendben\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=M\\u00E9gse\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=K\\u00F6sz\\u00F6nj\\u00FCk\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=Adjon meg megjegyz\\u00E9st\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=V\\u00E9ge\\:\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG={0} t\\u00E9tel enged\\u00E9lyezve \\u00E9s {1} t\\u00E9tel elutas\\u00EDtva {2} k\\u00E9relemn\\u00E9l.            \n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT=Ma\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT=Nem tal\\u00E1lhat\\u00F3k k\\u00E9relmek\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT=Nem tal\\u00E1lhat\\u00F3k kock\\u00E1zatok\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT=Nem tal\\u00E1lhat\\u00F3k m\\u0171veletek\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT=Elutas\\u00EDt\\u00E1s megjegyz\\u00E9sei\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT=Hozz\\u00E1f\\u00E9r\\u00E9s elutas\\u00EDt\\u00E1sa\\: {0}\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT={0} t\\u00E9tel j\\u00F3v\\u00E1hagy\\u00E1sa \\u00E9s {1} t\\u00E9tel elutas\\u00EDt\\u00E1sa {2} k\\u00E9relemben a k\\u00F6vetkez\\u0151h\\u00F6z\\: {3} ?\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT=Hozz\\u00E1f\\u00E9r\\u00E9s t\\u00EDpusa\\: {0}\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=K\\u00E9s\\u0151bb pr\\u00F3b\\u00E1lja \\u00FAjra\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT=Hiba\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION=Nincs jogosults\\u00E1ga a m\\u0171velet elv\\u00E9gz\\u00E9s\\u00E9hez.\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT=\\u00C9rv\\u00E9nyess\\u00E9g kezdete\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT=\\u00C9rv\\u00E9nyess\\u00E9g v\\u00E9ge\n',
	"fcg/grc/accessrequest/approve/i18n/i18n_it.properties":'\n#XFLD,15: Search\nSEARCH_TEXT=Cerca\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=Giorni fa\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=Un giorno fa\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=Richieste di accesso ({0})\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=Sistema\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=Tipo\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=Stato\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=Approvatore\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=Richiesta {0}\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=Motivo della richiesta\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=Esegui logout\n\n#XTIT,44: App title.\nshellTitle=Controlla richieste da approvare\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=Richiedi accesso\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=Business process\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=Area funzionale\n\n#XTIT,16: Company \nCOMPANY_TEXT=Societ\\u00E0\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=Requisiti\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=Nome tecnico\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=Azioni\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=Richiesta di accesso\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=Ruolo\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=Sistema\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=Validit\\u00E0\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=Invia\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=Illimitato\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=Ambiente\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=La richiesta {0} \\u00E8 stata inoltrata a {1}.\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=Dettagli di accesso\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=Nessun accesso richiesto\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=Accesso\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=Informazioni\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=Approva\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL={0} Rischi \n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL=Rischi\n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL={0} Rischio \n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=Descrizione\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=Livello di rischio\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE=Approvare richiesta {0} per {1} ?\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=Aggiungi commenti (facoltativo)\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=Inoltra\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=Richiedente\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=Utente\\: {0}\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=Nessun utente trovato per inoltro\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=OK\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=Annulla\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=Grazie\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=Aggiungi un commento\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=A\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG={0} posizioni sono state approvate e {1} posizioni sono state rifiutate per la richiesta {2}.            \n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT=Oggi\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT=Nessuna richiesta trovata\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT=Nessun rischio trovato\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT=Nessuna azione trovata\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT=Commenti sul rifiuto\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT=Rifiuta accesso\\: {0}\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT=Approvare {0} posizioni e rifiutare {1} posizioni nella richiesta {2} per {3} ?\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT=Tipo di accesso\\: {0}\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=Riprova pi\\u00F9 tardi\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT=Errore\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION=Manca l\'autorizzazione ad eseguire azioni in questo accesso.\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT=Inizio validit\\u00E0\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT=Fine validit\\u00E0\n',
	"fcg/grc/accessrequest/approve/i18n/i18n_iw.properties":'\n#XFLD,15: Search\nSEARCH_TEXT=\\u05D7\\u05E4\\u05E9\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=\\u05D9\\u05DE\\u05D9\\u05DD \\u05E2\\u05D1\\u05E8\\u05D5\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=\\u05DC\\u05E4\\u05E0\\u05D9 \\u05D9\\u05D5\\u05DD\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=\\u05D1\\u05E7\\u05E9\\u05D5\\u05EA \\u05D2\\u05D9\\u05E9\\u05D4 ({0})\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=\\u05E1\\u05D5\\u05D2\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=\\u05E1\\u05D8\\u05D0\\u05D8\\u05D5\\u05E1\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=\\u05DE\\u05D0\\u05E9\\u05E8\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=\\u05D1\\u05E7\\u05E9\\u05D4 {0}\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=\\u05E1\\u05D9\\u05D1\\u05D4 \\u05DC\\u05D1\\u05E7\\u05E9\\u05D4\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=\\u05D4\\u05EA\\u05E0\\u05EA\\u05E7\n\n#XTIT,44: App title.\nshellTitle=\\u05D1\\u05D3\\u05D5\\u05E7 \\u05D1\\u05E7\\u05E9\\u05D5\\u05EA \\u05E9\\u05D9\\u05E9 \\u05DC\\u05D0\\u05E9\\u05E8\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=\\u05D1\\u05E7\\u05E9 \\u05D2\\u05D9\\u05E9\\u05D4\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=\\u05EA\\u05D4\\u05DC\\u05D9\\u05DA \\u05E2\\u05E1\\u05E7\\u05D9\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=\\u05EA\\u05D7\\u05D5\\u05DD \\u05E4\\u05D5\\u05E0\\u05E7\\u05E6\\u05D9\\u05D5\\u05E0\\u05D0\\u05DC\\u05D9\n\n#XTIT,16: Company \nCOMPANY_TEXT=\\u05D7\\u05D1\\u05E8\\u05D4\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=\\u05EA\\u05E0\\u05D0\\u05D9\\u05DD \\u05DE\\u05D5\\u05E7\\u05D3\\u05DE\\u05D9\\u05DD\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=\\u05E9\\u05DD \\u05D8\\u05DB\\u05E0\\u05D9\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=\\u05E4\\u05E2\\u05D5\\u05DC\\u05D5\\u05EA\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D2\\u05D9\\u05E9\\u05D4\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=\\u05EA\\u05E4\\u05E7\\u05D9\\u05D3\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=\\u05EA\\u05D5\\u05E7\\u05E3\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=\\u05D4\\u05D2\\u05E9\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=\\u05D1\\u05DC\\u05EA\\u05D9 \\u05DE\\u05D5\\u05D2\\u05D1\\u05DC\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=\\u05E1\\u05D1\\u05D9\\u05D1\\u05D4\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=\\u05D1\\u05E7\\u05E9\\u05D4 {0} \\u05D4\\u05D5\\u05E2\\u05D1\\u05E8\\u05D4 \\u05D0\\u05DC {1}.\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=\\u05E4\\u05E8\\u05D8\\u05D9 \\u05D2\\u05D9\\u05E9\\u05D4\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=\\u05DC\\u05D0 \\u05D4\\u05D5\\u05D2\\u05E9\\u05D4 \\u05D1\\u05E7\\u05E9\\u05D4 \\u05DC\\u05D2\\u05D9\\u05E9\\u05D4\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=\\u05D2\\u05D9\\u05E9\\u05D4\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=\\u05DE\\u05D9\\u05D3\\u05E2\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=\\u05D0\\u05E9\\u05E8\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL={0} \\u05E1\\u05D9\\u05DB\\u05D5\\u05E0\\u05D9\\u05DD \n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL=\\u05E1\\u05D9\\u05DB\\u05D5\\u05E0\\u05D9\\u05DD\n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL={0} \\u05E1\\u05D9\\u05DB\\u05D5\\u05DF \n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=\\u05EA\\u05D9\\u05D0\\u05D5\\u05E8\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=\\u05E8\\u05DE\\u05EA \\u05E1\\u05D9\\u05DB\\u05D5\\u05DF\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE=\\u05D4\\u05D0\\u05DD \\u05DC\\u05D0\\u05E9\\u05E8 \\u05D1\\u05E7\\u05E9\\u05D4 {0} \\u05E2\\u05D1\\u05D5\\u05E8 {1} ?\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05D4\\u05E2\\u05E8\\u05D5\\u05EA (\\u05D0\\u05D5\\u05E4\\u05E6\\u05D9\\u05D5\\u05E0\\u05D0\\u05DC\\u05D9)\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=\\u05D4\\u05E2\\u05D1\\u05E8\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=\\u05DE\\u05D1\\u05E7\\u05E9\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9\\: {0}\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=\\u05DC\\u05D0 \\u05E0\\u05DE\\u05E6\\u05D0\\u05D5 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9\\u05D9\\u05DD \\u05DC\\u05D4\\u05E2\\u05D1\\u05E8\\u05D4\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=OK\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=\\u05D1\\u05D8\\u05DC\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=\\u05EA\\u05D5\\u05D3\\u05D4\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05D4\\u05E2\\u05E8\\u05D4\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=\\u05E2\\u05D3\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG={0} \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9\\u05DD \\u05D0\\u05D5\\u05E9\\u05E8 \\u05D5-{1} \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9\\u05DD \\u05E0\\u05D3\\u05D7\\u05D5 \\u05E2\\u05D1\\u05D5\\u05E8 \\u05D1\\u05E7\\u05E9\\u05D4 {2}.            \n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT=\\u05D4\\u05D9\\u05D5\\u05DD\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT=\\u05DC\\u05D0 \\u05E0\\u05DE\\u05E6\\u05D0\\u05D5 \\u05D1\\u05E7\\u05E9\\u05D5\\u05EA\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT=\\u05DC\\u05D0 \\u05E0\\u05DE\\u05E6\\u05D0\\u05D5 \\u05E1\\u05D9\\u05DB\\u05D5\\u05E0\\u05D9\\u05DD\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT=\\u05DC\\u05D0 \\u05E0\\u05DE\\u05E6\\u05D0\\u05D5 \\u05E4\\u05E2\\u05D5\\u05DC\\u05D5\\u05EA\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT=\\u05D4\\u05E2\\u05E8\\u05D5\\u05EA \\u05E2\\u05DC \\u05D3\\u05D7\\u05D9\\u05D9\\u05D4\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT=\\u05D3\\u05D7\\u05D4 \\u05D2\\u05D9\\u05E9\\u05D4\\: {0}\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT=\\u05D0\\u05E9\\u05E8 {0} \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9\\u05DD \\u05D5\\u05D3\\u05D7\\u05D4 {1} \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9\\u05DD \\u05D1\\u05D1\\u05E7\\u05E9\\u05D4 {2} \\u05E2\\u05D1\\u05D5\\u05E8 {3} ?\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT=\\u05E1\\u05D5\\u05D2 \\u05D2\\u05D9\\u05E9\\u05D4\\: {0}\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=\\u05E0\\u05E1\\u05D4 \\u05E9\\u05D5\\u05D1 \\u05DE\\u05D0\\u05D5\\u05D7\\u05E8 \\u05D9\\u05D5\\u05EA\\u05E8\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT=\\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION=\\u05D0\\u05D9\\u05E0\\u05DA \\u05DE\\u05D5\\u05E8\\u05E9\\u05D4 \\u05DC\\u05E4\\u05E2\\u05D5\\u05DC \\u05D1\\u05DE\\u05D4\\u05DC\\u05DA \\u05D2\\u05D9\\u05E9\\u05D4 \\u05D6\\u05D5.\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT=\\u05EA\\u05D5\\u05E7\\u05E3 \\u05DE-\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT=\\u05EA\\u05D5\\u05E7\\u05E3 \\u05E2\\u05D3\n',
	"fcg/grc/accessrequest/approve/i18n/i18n_ja.properties":'\n#XFLD,15: Search\nSEARCH_TEXT=\\u691C\\u7D22\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=\\u65E5\\u524D\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=\\u65E5\\u524D\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=\\u30A2\\u30AF\\u30BB\\u30B9\\u7533\\u8ACB ({0})\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=\\u30B7\\u30B9\\u30C6\\u30E0\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=\\u30BF\\u30A4\\u30D7\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=\\u30B9\\u30C6\\u30FC\\u30BF\\u30B9\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=\\u627F\\u8A8D\\u8005\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=\\u7533\\u8ACB {0}\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=\\u7533\\u8ACB\\u7406\\u7531\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=\\u30ED\\u30B0\\u30A2\\u30A6\\u30C8\n\n#XTIT,44: App title.\nshellTitle=\\u627F\\u8A8D\\u3059\\u308B\\u7533\\u8ACB\\u306E\\u30C1\\u30A7\\u30C3\\u30AF\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=\\u30A2\\u30AF\\u30BB\\u30B9\\u7533\\u8ACB\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=\\u30D3\\u30B8\\u30CD\\u30B9\\u30D7\\u30ED\\u30BB\\u30B9\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=\\u30D5\\u30A1\\u30F3\\u30AF\\u30B7\\u30E7\\u30F3\\u9818\\u57DF\n\n#XTIT,16: Company \nCOMPANY_TEXT=\\u4F1A\\u793E\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=\\u524D\\u63D0\\u6761\\u4EF6\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=\\u6280\\u8853\\u540D\\u79F0\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=\\u30A2\\u30AF\\u30B7\\u30E7\\u30F3\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=\\u30A2\\u30AF\\u30BB\\u30B9\\u7533\\u8ACB\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=\\u30ED\\u30FC\\u30EB\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=\\u30B7\\u30B9\\u30C6\\u30E0\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=\\u6709\\u52B9\\u671F\\u9593\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=\\u9001\\u4FE1\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=\\u7121\\u5236\\u9650\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=\\u74B0\\u5883\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=\\u7533\\u8ACB {0} \\u304C {1} \\u306B\\u8EE2\\u9001\\u3055\\u308C\\u307E\\u3057\\u305F\\u3002\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=\\u30A2\\u30AF\\u30BB\\u30B9\\u8A73\\u7D30\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=\\u30A2\\u30AF\\u30BB\\u30B9\\u7533\\u8ACB\\u306A\\u3057\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=\\u30A2\\u30AF\\u30BB\\u30B9\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=\\u60C5\\u5831\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=\\u627F\\u8A8D\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL={0} \\u30EA\\u30B9\\u30AF \n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL=\\u30EA\\u30B9\\u30AF\n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL={0} \\u30EA\\u30B9\\u30AF \n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=\\u8A73\\u7D30\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=\\u30EA\\u30B9\\u30AF\\u30EC\\u30D9\\u30EB\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE={1} \\u306E\\u7533\\u8ACB {0} \\u3092\\u627F\\u8A8D\\u3057\\u307E\\u3059\\u304B\\u3002\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=\\u30B3\\u30E1\\u30F3\\u30C8\\u8FFD\\u52A0 (\\u30AA\\u30D7\\u30B7\\u30E7\\u30F3)\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=\\u8EE2\\u9001\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=\\u7533\\u8ACB\\u8005\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=\\u30E6\\u30FC\\u30B6\\: {0}\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=\\u8EE2\\u9001\\u5BFE\\u8C61\\u306E\\u30E6\\u30FC\\u30B6\\u304C\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=OK\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=\\u4E2D\\u6B62\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=\\u30B3\\u30E1\\u30F3\\u30C8\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=\\u30B3\\u30E1\\u30F3\\u30C8\\u8FFD\\u52A0\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=\\u8EE2\\u9001\\u5148\\:\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG=\\u7533\\u8ACB {2} \\u306B\\u3064\\u3044\\u3066\\u3001{0} \\u30A2\\u30A4\\u30C6\\u30E0\\u304C\\u627F\\u8A8D\\u3055\\u308C\\u3001{1} \\u30A2\\u30A4\\u30C6\\u30E0\\u304C\\u5374\\u4E0B\\u3055\\u308C\\u307E\\u3057\\u305F\\u3002            \n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT=\\u672C\\u65E5\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT=\\u7D50\\u679C\\u304C\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT=\\u30EA\\u30B9\\u30AF\\u304C\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT=\\u30A2\\u30AF\\u30B7\\u30E7\\u30F3\\u304C\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT=\\u5374\\u4E0B\\u30B3\\u30E1\\u30F3\\u30C8\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT=\\u30A2\\u30AF\\u30BB\\u30B9\\u5374\\u4E0B\\: {0}\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT={3} \\u306E\\u7533\\u8ACB {2} \\u306B\\u3064\\u3044\\u3066\\u3001{0} \\u30A2\\u30A4\\u30C6\\u30E0\\u3092\\u627F\\u8A8D\\u3057\\u3001{1} \\u30A2\\u30A4\\u30C6\\u30E0\\u3092\\u5374\\u4E0B\\u3057\\u307E\\u3059\\u304B\\u3002\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT=\\u30A2\\u30AF\\u30BB\\u30B9\\u30BF\\u30A4\\u30D7\\:  {0}\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=\\u5F8C\\u3067\\u518D\\u8A66\\u884C\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT=\\u30A8\\u30E9\\u30FC\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION=\\u3053\\u306E\\u30A2\\u30AF\\u30BB\\u30B9\\u306B\\u95A2\\u3059\\u308B\\u30A2\\u30AF\\u30B7\\u30E7\\u30F3\\u3092\\u5B9F\\u884C\\u3059\\u308B\\u6A29\\u9650\\u304C\\u3042\\u308A\\u307E\\u305B\\u3093\\u3002\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT=\\u6709\\u52B9\\u958B\\u59CB\\u65E5\\u4ED8\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT=\\u6709\\u52B9\\u7D42\\u4E86\\u65E5\\u4ED8\n',
	"fcg/grc/accessrequest/approve/i18n/i18n_no.properties":'\n#XFLD,15: Search\nSEARCH_TEXT=S\\u00F8k\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=dager siden\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=dag siden\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=Tilgangsforesp\\u00F8rsler ({0})\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=System\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=Type\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=Status\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=Godkjenner\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=Foresp\\u00F8rsel {0}\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=Foresp\\u00F8rsels\\u00E5rsak\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=Logg av\n\n#XTIT,44: App title.\nshellTitle=Kontroller foresp\\u00F8rsler som skal godkjennes\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=S\\u00F8k om tilgang\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=Forretningsprosess\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=Funksjonsomr\\u00E5de\n\n#XTIT,16: Company \nCOMPANY_TEXT=Firma\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=Forutsetninger\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=Teknisk navn\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=Aktiviteter\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=Tilgangsforesp\\u00F8rsel\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=Rolle\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=System\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=Gyldighet\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=Send\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=Ubegrenset\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=Milj\\u00F8\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=Foresp\\u00F8rsel {0} er videresendt til {1}.\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=Tilgangsdetaljer\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=Ikke bedt om tilgang\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=Tilgang\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=Info\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=Godkjenn\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL={0} Risikoer \n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL=Risikoer\n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL={0} Risiko \n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=Beskrivelse\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=Risikoniv\\u00E5\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE=Godkjenne foresp\\u00F8rsel {0} for {1}?\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=Tilf\\u00F8y kommentarer (valgfritt)\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=Videresend\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=Rekvirent\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=Bruker\\: {0}\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=Finner ingen brukere for videres.\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=OK\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=Avbryt\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=Takk\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=Tilf\\u00F8y en kommentar\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=Til\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG={0} posisjoner er godkjent og {1} posisjoner ble avvist for foresp\\u00F8rsel {2}.            \n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT=I dag\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT=Finner ingen foresp\\u00F8rsler\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT=Finner ingen risikoer\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT=Finner ingen aktiviteter\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT=Avvisningskommentarer\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT=Avvis tilgang\\: {0}\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT=Godkjenne {0} elementer og avvise {1} elementer i foresp\\u00F8rsel {2} for {3}?\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT=Tilgangstype\\: {0}\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=Pr\\u00F8v igjen senere\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT=Feil\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION=Du er ikke autorisert til \\u00E5 utf\\u00F8re aktivitet p\\u00E5 denne tilgangen\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT=Gyldig fra\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT=Gyldig til\n',
	"fcg/grc/accessrequest/approve/i18n/i18n_pl.properties":'\n#XFLD,15: Search\nSEARCH_TEXT=Szukaj...\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=dni temu\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=dzie\\u0144 temu\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=Wnioski o dost\\u0119p ({0})\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=System\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=Rodzaj\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=Status\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=Zatwierdzaj\\u0105cy\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=Wniosek {0}\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=Pow\\u00F3d zlecenia\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=Wyloguj\n\n#XTIT,44: App title.\nshellTitle=Sprawdzanie zlece\\u0144 do zatwierdzenia\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=Z\\u0142\\u00F3\\u017C wn. o dost\\u0119p\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=Proces biznesowy\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=Obszar funkcjonalny\n\n#XTIT,16: Company \nCOMPANY_TEXT=Firma\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=Warunki wst\\u0119pne\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=Nazwa techniczna\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=Czynno\\u015Bci\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=Wniosek o dost\\u0119p\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=Rola\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=System\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=Wa\\u017Cno\\u015B\\u0107\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=Wy\\u015Blij\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=Nieograniczone\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=\\u015Arodowisko\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=Wniosek {0} zosta\\u0142 przekazany do {1}.\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=Szczeg\\u00F3\\u0142y dost\\u0119pu\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=Nie z\\u0142o\\u017Cono wniosku o dost\\u0119p\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=Dost\\u0119p\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=Informacje\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=Zatwierd\\u017A\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL={0} ryzyka \n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL=Ryzyka\n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL={0} ryzyko \n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=Opis\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=Poziom ryzyka\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE=Czy zatwierdzi\\u0107 wniosek {0} dla {1}?\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=Dodaj komentarze (opcjonalnie)\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=Przeka\\u017C\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=Wnioskodawca\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=U\\u017Cytkownik\\: {0}\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=Nie znaleziono u\\u017Cytk. do przekaz.\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=OK\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=Anuluj\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=Dzi\\u0119kujemy\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=Dodaj komentarz\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=Do\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG={0} pozycje zosta\\u0142y zatwierdzone i {1} pozycje zosta\\u0142y odrzucone dla wniosku {2}.            \n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT=Dzisiaj\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT=Nie znaleziono \\u017C\\u0105da\\u0144\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT=Nie znaleziono ryzyk\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT=Nie znaleziono czynno\\u015Bci\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT=Komentarze odrzucenia\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT=Odm\\u00F3w dost\\u0119pu\\: {0}\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT=Zatwierdzi\\u0107 {0} poz. i odrzuci\\u0107 {1} poz. w \\u017C\\u0105daniu {2} dla {3}?\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT=Rodzaj dost\\u0119pu\\: {0}\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=Spr\\u00F3buj ponownie p\\u00F3\\u017Aniej\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT=B\\u0142\\u0105d\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION=Brak uprawnie\\u0144 do wykonania czynno\\u015Bci dla tego dost\\u0119pu.\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT=Wa\\u017Cno\\u015B\\u0107 od\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT=Wa\\u017Cno\\u015B\\u0107 do\n',
	"fcg/grc/accessrequest/approve/i18n/i18n_pt.properties":'\n#XFLD,15: Search\nSEARCH_TEXT=Pesquisa\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=dias atr\\u00E1s\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=dia atr\\u00E1s\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=Solicita\\u00E7\\u00F5es de acesso ({0})\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=Sistema\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=Tipo\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=Status\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=Autorizador\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=Solicitar {0}\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=Motivo para solicita\\u00E7\\u00E3o\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=Enc.sess\\u00E3o\n\n#XTIT,44: App title.\nshellTitle=Verificar solicita\\u00E7\\u00F5es a aprovar\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=Acesso solicita\\u00E7\\u00E3o\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=Processo empresarial\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=\\u00C1rea funcional\n\n#XTIT,16: Company \nCOMPANY_TEXT=Empresa\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=Pr\\u00E9-requisitos\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=Nome t\\u00E9cnico\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=A\\u00E7\\u00F5es\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=Solicita\\u00E7\\u00E3o de acesso\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=Fun\\u00E7\\u00E3o\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=Sistema\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=Validade\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=Enviar\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=Ilimitado\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=Ambiente\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=Solicita\\u00E7\\u00E3o {0} encaminhada a {1}.\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=Detalhes de acesso\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=Nenhum acesso solicitado\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=Acesso\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=Info\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=Aprovar\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL={0} riscos \n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL=Riscos\n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL={0} risco \n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=Descri\\u00E7\\u00E3o\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=N\\u00EDvel do risco\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE=Aprovar solicita\\u00E7\\u00E3o {0} para {1} ?\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=Adicionar coment\\u00E1rios (opcional)\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=Encaminhar\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=Solicitante\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=Usu\\u00E1rio\\: {0}\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=Nenhum usu\\u00E1rio para encaminhar\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=OK\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=Cancelar\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=Obrigado\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=Adicionar um coment\\u00E1rio\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=At\\u00E9\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG={0} itens foram aprovados e {1} itens foram rejeitados para a solicita\\u00E7\\u00E3o {2}.            \n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT=Hoje\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT=Nenhuma solicita\\u00E7\\u00E3o encontrada\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT=Nenhum risco encontrado\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT=Nenhuma a\\u00E7\\u00E3o encontrada\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT=Coment\\u00E1rios de rejei\\u00E7\\u00E3o\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT=Rejeitar acesso\\: {0}\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT=Aprovar {0} itens e rejeitar {1} itens na solicita\\u00E7\\u00E3o {2} para {3}?\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT=Tipo de acesso\\: {0}\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=Tente mais tarde novamente\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT=Erro\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION=Voc\\u00EA n\\u00E3o tem autoriza\\u00E7\\u00E3o para executar a\\u00E7\\u00E3o neste acesso.\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT=Validade desde\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT=Validade at\\u00E9\n',
	"fcg/grc/accessrequest/approve/i18n/i18n_ru.properties":'\n#XFLD,15: Search\nSEARCH_TEXT=\\u041F\\u043E\\u0438\\u0441\\u043A\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=\\u0434\\u043D. \\u043D\\u0430\\u0437\\u0430\\u0434\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=\\u0434\\u0435\\u043D\\u044C \\u043D\\u0430\\u0437\\u0430\\u0434\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441\\u044B \\u043D\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F ({0})\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=\\u0421\\u0438\\u0441\\u0442\\u0435\\u043C\\u0430\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=\\u0422\\u0438\\u043F\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0430\\u044E\\u0449\\u0438\\u0439\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441 {0}\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=\\u041F\\u0440\\u0438\\u0447\\u0438\\u043D\\u0430 \\u0437\\u0430\\u043F\\u0440\\u043E\\u0441\\u0430\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=\\u0412\\u044B\\u0445\\u043E\\u0434\n\n#XTIT,44: App title.\nshellTitle=\\u041F\\u0440\\u043E\\u0432\\u0435\\u0440\\u043A\\u0430 \\u0437\\u0430\\u043F\\u0440\\u043E\\u0441\\u043E\\u0432 \\u043D\\u0430 \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441 \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u0430\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=\\u0411\\u0438\\u0437\\u043D\\u0435\\u0441-\\u043F\\u0440\\u043E\\u0446\\u0435\\u0441\\u0441\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=\\u0424\\u0443\\u043D\\u043A\\u0446\\u0438\\u043E\\u043D\\u0430\\u043B\\u044C\\u043D\\u0430\\u044F \\u0441\\u0444\\u0435\\u0440\\u0430\n\n#XTIT,16: Company \nCOMPANY_TEXT=\\u041A\\u043E\\u043C\\u043F\\u0430\\u043D\\u0438\\u044F\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=\\u041F\\u0440\\u0435\\u0434\\u043F\\u043E\\u0441\\u044B\\u043B\\u043A\\u0438\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=\\u0422\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u043E\\u0435 \\u0438\\u043C\\u044F\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=\\u041E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441 \\u043D\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=\\u0420\\u043E\\u043B\\u044C\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=\\u0421\\u0438\\u0441\\u0442\\u0435\\u043C\\u0430\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=\\u041E\\u0431\\u043B\\u0430\\u0441\\u0442\\u044C \\u0434\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u044F\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=\\u041E\\u0442\\u043F\\u0440\\u0430\\u0432\\u0438\\u0442\\u044C\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=\\u0411\\u0435\\u0437 \\u043E\\u0433\\u0440\\u0430\\u043D\\u0438\\u0447\\u0435\\u043D\\u0438\\u044F\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=\\u0421\\u0440\\u0435\\u0434\\u0430\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441 {0} \\u043F\\u0435\\u0440\\u0435\\u0430\\u0434\\u0440\\u0435\\u0441\\u043E\\u0432\\u0430\\u043D {1}.\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=\\u0414\\u0430\\u043D\\u043D\\u044B\\u0435 \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u0430\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=\\u0414\\u043E\\u0441\\u0442\\u0443\\u043F \\u043D\\u0435 \\u0437\\u0430\\u043F\\u0440\\u043E\\u0448\\u0435\\u043D\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=\\u0414\\u043E\\u0441\\u0442\\u0443\\u043F\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=\\u0418\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL=\\u0420\\u0438\\u0441\\u043A\\u0438 {0}  \n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL=\\u0420\\u0438\\u0441\\u043A\\u0438\n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL=\\u0420\\u0438\\u0441\\u043A {0}  \n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=\\u0423\\u0440\\u043E\\u0432\\u0435\\u043D\\u044C \\u0440\\u0438\\u0441\\u043A\\u0430\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C \\u0437\\u0430\\u043F\\u0440\\u043E\\u0441 {0} \\u0434\\u043B\\u044F {1} ?\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u043A\\u043E\\u043C\\u043C\\u0435\\u043D\\u0442\\u0430\\u0440\\u0438\\u0438 (\\u043D\\u0435\\u043E\\u0431\\u044F\\u0437\\u0430\\u0442\\u0435\\u043B\\u044C\\u043D\\u043E)\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=\\u041F\\u0435\\u0440\\u0435\\u0430\\u0434\\u0440\\u0435\\u0441\\u043E\\u0432\\u0430\\u0442\\u044C\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441\\u0438\\u043B\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=\\u041F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044C\\: {0}\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=\\u041D\\u0435\\u0442 \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u0435\\u0439 \\u0434\\u043B\\u044F \\u043F\\u0435\\u0440\\u0435\\u0430\\u0434\\u0440\\u0435\\u0441\\u0430\\u0446\\u0438\\u0438\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=\\u041E\\u041A\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=\\u0421\\u043F\\u0430\\u0441\\u0438\\u0431\\u043E\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u043A\\u043E\\u043C\\u043C\\u0435\\u043D\\u0442\\u0430\\u0440\\u0438\\u0439\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=\\u041A\\u043E\\u043C\\u0443\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG={0} \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0439 \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u043E \\u0438 {1} \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0439 \\u043E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0435\\u043D\\u043E \\u043F\\u043E \\u0437\\u0430\\u043F\\u0440\\u043E\\u0441\\u0443 {2}.            \n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT=\\u0421\\u0435\\u0433\\u043E\\u0434\\u043D\\u044F\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441\\u044B \\u043D\\u0435 \\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u044B\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT=\\u0420\\u0438\\u0441\\u043A\\u0438 \\u043D\\u0435 \\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u044B\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT=\\u041E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438 \\u043D\\u0435 \\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u044B\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT=\\u041A\\u043E\\u043C\\u043C\\u0435\\u043D\\u0442\\u0430\\u0440\\u0438\\u0438 \\u043A \\u043E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0435\\u043D\\u0438\\u044E\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\: {0}\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C {0} \\u044D\\u043B\\u0435\\u043C. \\u0438 \\u043E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C {1} \\u044D\\u043B\\u0435\\u043C. \\u0432 \\u0437\\u0430\\u043F\\u0440\\u043E\\u0441\\u0435 {2} \\u0434\\u043B\\u044F {3} ?\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT=\\u0422\\u0438\\u043F \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u0430\\: {0}\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=\\u041F\\u043E\\u0432\\u0442\\u043E\\u0440\\u0438\\u0442\\u0435 \\u043F\\u043E\\u043F\\u044B\\u0442\\u043A\\u0443 \\u043F\\u043E\\u0437\\u0436\\u0435\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT=\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION=\\u0423 \\u0432\\u0430\\u0441 \\u043D\\u0435\\u0442 \\u043F\\u043E\\u043B\\u043D\\u043E\\u043C\\u043E\\u0447\\u0438\\u0439 \\u043D\\u0430 \\u044D\\u0442\\u0443 \\u043E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0438\\u044E\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT=\\u0414\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u043E \\u0441\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT=\\u0414\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u043E \\u043F\\u043E\n',
	"fcg/grc/accessrequest/approve/i18n/i18n_tr.properties":'\n#XFLD,15: Search\nSEARCH_TEXT=Arama\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=g\\u00FCn \\u00F6nce\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=g\\u00FCn \\u00F6nce\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=Eri\\u015Fim talepleri ({0})\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=Sistem\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=T\\u00FCr\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=Durum\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=Onaylayan\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=Talep {0}\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=Talep i\\u00E7in neden\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=Oturumu kapat\n\n#XTIT,44: App title.\nshellTitle=Onaylanacak talepleri kontrol et\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=Eri\\u015Fim talep et\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=\\u0130\\u015F s\\u00FCreci\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=\\u0130\\u015Flevsel alan\n\n#XTIT,16: Company \nCOMPANY_TEXT=\\u015Eirket\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=\\u00D6nko\\u015Fullar\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=Teknik ad\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=\\u0130\\u015Flemler\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=Eri\\u015Fim talebi\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=Rol\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=Sistem\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=Ge\\u00E7erlilik\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=G\\u00F6nder\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=S\\u0131n\\u0131rs\\u0131z\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=Ortam\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=Talep {0} iletilen {1}.\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=Eri\\u015Fim ayr\\u0131nt\\u0131lar\\u0131\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=Eri\\u015Fim talep edilmedi\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=Eri\\u015Fim\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=Bilgi\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=Onayla\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL={0} risk \n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL=Riskler\n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL={0} risk \n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=Tan\\u0131m\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=Risk d\\u00FCzeyi\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE={1} i\\u00E7in talep {0} onaylans\\u0131n m\\u0131 ?\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=A\\u00E7\\u0131klamalar ekle (iste\\u011Fe ba\\u011Fl\\u0131)\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=\\u0130let\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=Talep eden\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=Kullan\\u0131c\\u0131 \\: {0}\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=\\u0130letme i\\u00E7in kullan\\u0131c\\u0131 bulunamad\\u0131\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=Tamam\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=\\u0130ptal\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=Te\\u015Fekk\\u00FCrler\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=A\\u00E7\\u0131klama ekle\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=Hedef\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG={0} kalem onayland\\u0131 ve {1} kalem talep {2} i\\u00E7in reddedildi.            \n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT=Bug\\u00FCn\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT=Talep bulunamad\\u0131\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT=Risk bulunamad\\u0131\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT=\\u0130\\u015Flem bulunamad\\u0131\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT=Ret a\\u00E7\\u0131klamalar\\u0131\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT=Eri\\u015Fimi reddet\\: {0}\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT={3} i\\u00E7in {2} talebinde {0} kalemi onayla ve {1} kalemi reddet?\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT=Eri\\u015Fim t\\u00FCr\\u00FC\\: {0}\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=Sonra yeniden deneyin\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT=Hata\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION=Bu eri\\u015Fimde i\\u015Flemi yapmak i\\u00E7in yetkili de\\u011Filsiniz.\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT=Ge\\u00E7erlilik ba\\u015Flang\\u0131c\\u0131\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT=Ge\\u00E7erlilik sonu\n',
	"fcg/grc/accessrequest/approve/i18n/i18n_zh_CN.properties":'\n#XFLD,15: Search\nSEARCH_TEXT=\\u641C\\u7D22\n\n#XFLD,17: Number of days since last submitted\nNUMBER_UNIT_TEXT=\\u5929\\u524D\n\n#XFLD,17: 1 day since last submitted\nDAY_AGO_TEXT=\\u5929\\u524D\n\n#XGRP,32: Table header for the list of roles in the request status screen\nACCESS_REQUESTED_TEXT=\\u8BBF\\u95EE\\u7533\\u8BF7 ({0})\n\n#XGRP,16: Column Header for System Name\nSYSTEM_TEXT=\\u7CFB\\u7EDF\n\n#XGRP,16: Column Header for Item Type Name\nITEM_TYPE_TEXT=\\u7C7B\\u578B\n\n#XGRP,16: Column header for Status\nSTATUS_TEXT=\\u72B6\\u6001\n\n#XGRP,16: Column header for Approvers\nAPPROVER_LBL=\\u5BA1\\u6279\\u4EBA\n\n#XFLD,18: Request Label. (length restrictive)\nREQUEST_LBL=\\u7533\\u8BF7 {0}\n\n#XTIT,25: Request Reason title.\nREQUEST_REASON_TEXT=\\u7533\\u8BF7\\u539F\\u56E0\n\n#XBUT,14 : Logout text\nLOGOUT_BTN=\\u767B\\u51FA\n\n#XTIT,44: App title.\nshellTitle=\\u68C0\\u67E5\\u5F85\\u5BA1\\u6279\\u7684\\u7533\\u8BF7\n\n#XTIT,18: Welcome title on the request access page\nREQUEST_ACCESS_TEXT=\\u7533\\u8BF7\\u8BBF\\u95EE\n\n#XTIT,24: Business Process \nBUS_PROC_TEXT=\\u4E1A\\u52A1\\u6D41\\u7A0B\n\n#XTIT,21: Functional Area \nFUN_AREA_TEXT=\\u804C\\u80FD\\u8303\\u56F4\n\n#XTIT,16: Company \nCOMPANY_TEXT=\\u516C\\u53F8\n\n#XTIT,20: Prerequisites\nPRE_REQ_TEXT=\\u524D\\u63D0\\u6761\\u4EF6\n\n#XTIT,25 : Technical Role Name\nROLE_TECH_TEXT=\\u6280\\u672F\\u540D\\u79F0\n\n#XTIT,16: Column header for actions table. \nACTIONS_TEXT=\\u64CD\\u4F5C\n\n#XTIT,25: Access Request page title\nACCESS_REQUEST_LBL=\\u8BBF\\u95EE\\u7533\\u8BF7\n\n#XGRP,15: Column Header for Role Name\nROLE_TEXT=\\u89D2\\u8272\n\n#XGRP,16: Column Header for System Name\nSYS_TEXT=\\u7CFB\\u7EDF\n\n#XGRP,18: Column Header for Validity Period\nVALIDITY_TEXT=\\u6709\\u6548\\u671F\n\n#XBUT,14: Button to submit a request\nSUBMIT_BTN=\\u63D0\\u4EA4\n\n#XTIT,16: Indefinite validity period\nMAX_VALIDITY_TEXT=\\u65E0\\u9650\\u5236\n\n#XFLD,21: Label for Environment in role search results\nENVIRONMENT_TEXT=\\u73AF\\u5883\n\n#YMSG,42: Message for user Forward\nREQ_FORWARD_SUCCESS_MSG=\\u7533\\u8BF7 {0} \\u5DF2\\u8F6C\\u53D1\\u7ED9 {1}\\u3002\n\n#XTIT,25: Page title for Access details page.\nACCESS_DETAILS_TEXT=\\u8BBF\\u95EE\\u8BE6\\u7EC6\\u4FE1\\u606F\n\n#YMSG,32: No Access Requested message on table data\nNO_ACCESS_REQUESTED_MSG=\\u672A\\u7533\\u8BF7\\u8BBF\\u95EE\\u6743\\u9650\n\n#XGRP,15: Column heading for table access\nACCESS_LBL=\\u8BBF\\u95EE\n\n#XGRP,15:Label for info tab icon\nINFO_LBL=\\u4FE1\\u606F\n\n#XTIT,18: Title for Approve select Dialog box\nAPPROVE_LBL=\\u6279\\u51C6\n\n#XFLD,19: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_LBL={0} \\u98CE\\u9669 \n\n#XFLD,15: Risks Column heading for access table and Label for Risk Icons Tab in Access Details\nRISKS_COL_LBL=\\u98CE\\u9669\n\n#XFLD,15: Risk Column heading for access table and Label for Risk Icons Tab in Access Details\nRISK_LBL={0} \\u98CE\\u9669 \n\n#XFLD,22: Access Description for Access Column\nDESCRIPTION_LBL=\\u63CF\\u8FF0\n\n#XFLD,24: Level column label for Risks table in Access Details page.\nLEVEL_LBL=\\u98CE\\u9669\\u7EA7\\u522B\n\n#XTIT,46: Subtitle for Approve confirm select dialog.\nSUBMIT_APPROVE_SUBTITLE=\\u662F\\u5426\\u6279\\u51C6 {1} \\u7684\\u7533\\u8BF7 {0}\\uFF1F\n\n#XTIT,38: Ghost text in input comments box for Approve select dialog\nADD_COMMENTS_MSG=\\u6DFB\\u52A0\\u6CE8\\u91CA\\uFF08\\u53EF\\u9009\\uFF09\n\n#XTIT,18:Title for Forward select dialog and also for button at bottom of detail page.\nFORWARD_TEXT=\\u8F6C\\u53D1\n\n#XFLD,18: Requester Label for Status field for both Master list and detail page\nREQUESTER_TXT=\\u7533\\u8BF7\\u4EBA\n\n#XFLD,20: User Label for Status field for both Master list and detail page\nUSER_LBL=\\u7528\\u6237\\uFF1A{0}\n\n#XFLD,35: Default message when no users data found in Forward Select Dialog Box\nNO_FORWARD_USERS_FOUND_TEXT=\\u672A\\u627E\\u5230\\u53EF\\u8F6C\\u53D1\\u7684\\u7528\\u6237\n\n#XBUT,10: OK button for confirm dialog\nOK_BTN=\\u786E\\u5B9A\n\n#XBUT,15: Cancel button for confirm dialog\nCANCEL_BTN=\\u53D6\\u6D88\n\n#XFLD,15: Default input comments for confirm dialog\nTHANKS_TEXT=\\u8C22\\u8C22\\uFF01\n\n#XFLD,25: Ghost text for input comments for confirm dialog\nADD_COMMENTS_TEXT=\\u6DFB\\u52A0\\u6CE8\\u91CA\n\n#XFLD,8: Forward To XXX message text in Forward confirm dialog\nTO_TEXT=\\u6536\\u4EF6\\u4EBA\n\n#YMSG,100: Submit success message after submit button clicked\nREQ_SUBMIT_SUCCESS_MSG=\\u5BF9\\u4E8E\\u7533\\u8BF7 {2}\\uFF0C\\u5DF2\\u6279\\u51C6 {0} \\u4E2A\\u9879\\u76EE\\uFF0C\\u62D2\\u7EDD {1} \\u4E2A\\u9879\\u76EE\\u3002            \n\n#XFLD,12: days elapsed status text "Today" for master list and Details page.\nTODAY_TEXT=\\u4ECA\\u5929\n\n#YMSG,35: No data found message for Master List\nNO_REQUESTS_FOUND_TEXT=\\u672A\\u627E\\u5230\\u7533\\u8BF7\n\n#YMSG,35: No data found message for Risk Icon Tab under Access Detail Page\nNO_ACCESS_RISKS_FOUND_TEXT=\\u672A\\u627E\\u5230\\u98CE\\u9669\n\n#YMSG,35: No data found message for Actions Icon Tab under Access Detail Page\nNO_ACTIONS_FOUND_TEXT=\\u672A\\u627E\\u5230\\u64CD\\u4F5C\n\n#XTIT,30: Title for Reject Comments Dialog \nREJECT_COMMENTS_TEXT=\\u62D2\\u7EDD\\u6CE8\\u91CA\n\n#XTIT,30: Subtitle for Reject confirm select dialog.\nREJECT_ACCESS_TEXT=\\u62D2\\u7EDD\\u8BBF\\u95EE\\uFF1A{0}\n\n#XTIT,80: Subtitle for Approve confirm select dialog.\nAPPROVE_REJECT_ITEMS_TEXT=\\u5BF9\\u4E8E {3} \\u7684\\u7533\\u8BF7 {2}\\uFF0C\\u662F\\u5426\\u6279\\u51C6 {0} \\u9879\\u3001\\u62D2\\u7EDD {1} \\u9879\\uFF1F\n\n#XTIT,30: Subtitle for Access Details page under Access Description\nACCESS_TYPE_TEXT=\\u8BBF\\u95EE\\u7C7B\\u578B\\uFF1A{0}\n\n#YMSG,30: Error displayed in Message box if the refresh token failed\nERROR_REFRESH_SECURITY_TOKEN=\\u8BF7\\u7A0D\\u540E\\u91CD\\u8BD5\n\n#XTIT,15: Title for error dialog box\nERROR_TEXT=\\u9519\\u8BEF\n\n#XTIT,75: Title for error dialog box\nNOT_AUTHORIZED_TO_TAKE_ACTION=\\u60A8\\u65E0\\u6743\\u5BF9\\u6B64\\u8BBF\\u95EE\\u6267\\u884C\\u64CD\\u4F5C\\u3002\n\n#XGRP,76: Column Header for Validity From Period\nVALIDITY_FROM_TEXT=\\u6709\\u6548\\u671F\\u81EA\n\n#XGRP,77: Column Header for Validity To Period\nVALIDITY_TO_TEXT=\\u6709\\u6548\\u671F\\u81F3\n',
	"fcg/grc/accessrequest/approve/view/RequestDetail.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ushell.services.CrossApplicationNavigation");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.m.MessageBox");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.grc.accessrequest.approve.view.RequestDetail", {
 
 	 oCrossAppNavigator : null,
	 resBundle:null,
	 gSelectDialog:null,
	 gSelectDialogApprove:null,
	 oCurrentView:null,
	 oCurrentModel:null,
	  gCheckBox:null,
      s_commentsMandtry:"",
      s_rejectLevel:"",
      s_approver:"",
	  s_comments:"",
	  s_rejectComments:"",
	  s_forwardUser:"",
	  s_requestNumber:"",
	  s_wiGroup:"",
	  s_approvedCount:0,
	  s_rejectedCount:0,
	  g_rejectionList:[],
	  g_rejectionCommentsList:[],
	  gRejectDialog:null,
	  gs_approvedCount:0,
	  s_delimit_key:"`:`",
	  g_tlock:false,
      showLockMessage:true,
      showUnauthorizedMessage:true,
	getResBundle: function(){
 	   if(this.resBundle === null){
 		   this.resBundle = this.getView().getModel("i18n").getResourceBundle(); 
 	   }
 	   return this.resBundle;
     },
	
    onInit: function() {
        //execute the onInit for the base class BaseDetailController
        sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
		//var lblSystem = this.getSystemLable();
				
//        sap.ushell.Container.getUser().isJamActive = function() { return true;};
        var lcontrollerHandle = this;
        var oOptions = {
        	 sI18NDetailTitle : "ACCESS_REQUEST_LBL",
        	 
    		 oPositiveAction : {
    	  		  sId : "Submit",
        		  sI18nBtnTxt : "SUBMIT_BTN",
                  onBtnPressed : function(e) {
                	  lcontrollerHandle.doSubmit();
                 },
             },
             oNegativeAction : {
            	 sId : "Forward",
      			 sI18nBtnTxt : "FORWARD_TEXT",
                 onBtnPressed : function(e) {
                	 lcontrollerHandle.handleForward(e);
                 },
             },
             
    		onBack : jQuery.proxy(function() {
    			//window.history.go(-1);
    			this.oRouter.navTo("master", {}, false);
    		}, this),

    		oJamOptions : {
    			oLineItem : this.byId("requestHeader"),
    			fGetShareSettings : function() {

    				var oObjListItem2 = new sap.m.ObjectListItem({
    					title : this.oLineItem.getTitle(),
    					number : this.oLineItem.getNumber(),
    					numberUnit : this.oLineItem.getNumberUnit(),
    					selected : true
    				});
    				return {
    					object : {
    						id : window.location.href.substring(0,  window.location.href.indexOf("&/detail/Requests")),
    						display : oObjListItem2,
    						share : " "

    					},
    				};
    			}

    		},

    		oAddBookmarkSettings : {
    			title : this.resBundle.getText("APPROVER_LBL"),
    			subTitle: this.resBundle.getText("ACCESS_REQUEST_LBL"),
    			info: this.resBundle.getText("ACCESS_DETAILS_TEXT"),
    			icon: "sap-icon://approvals"
    		},
    		bSuppressBookmarkButton: true
    	};

    	this.setHeaderFooterOptions(oOptions);
        	
        this.oCurrentView = this.getView();
		this.oCurrentModel = new sap.ui.model.json.JSONModel();
		this.getView().getModel().attachRequestCompleted(function(){this.requestCompleted(this);}, this);
		var that = this;

		this.getView().getModel().attachRequestFailed(function(oEvent){
			var strResponseText = oEvent.getParameters().responseText;
			if (strResponseText.indexOf("NOT AUTHORIZED") > -1 ){
				if(that.showUnauthorizedMessage){
				sap.m.MessageBox.show(that.getResBundle().getText("NOT_AUTHORIZED_TO_TAKE_ACTION"), sap.m.MessageBox.Icon.ERROR);
				that.showUnauthorizedMessage=false;
				}
			}else{
				sap.m.MessageBox.show('error from Server is ->'+strResponseText, sap.m.MessageBox.Icon.ERROR);
			}
        });
        this.oRouter.attachRouteMatched(function(oEvent) {
            if (oEvent.getParameter("name") === "detail") {
            	this.g_eventContextPath = oEvent.getParameter("arguments").contextPath;
            	
            	this.s_requestNumber = "";
            	this.g_tlock=true;
            	this.showLockMessage=true;
				this.showUnauthorizedMessage=true;

            	this.s_approvedCount=0;
            	this.s_rejectedCount=0; 
            	this.g_rejectionList=[];
            	this.g_rejectionCommentsList=[];

        		this.byId("requestHeader").setVisible(true);
        		this.byId("TABCONT_ROLE_INFO").setVisible(true);

            	var oRejectionDataModel = this.getRejectionDataModel();
                if(oRejectionDataModel){
		            var lRejectionData = oRejectionDataModel.getData();
		            if(lRejectionData){
			        	this.s_approvedCount=lRejectionData.approvedCount;
			        	this.s_rejectedCount=lRejectionData.rejectedCount; 
			        	this.g_rejectionList=lRejectionData.rejectionList;
			        	this.g_rejectionCommentsList=lRejectionData.rejectionCommentsList;
		            }
                }
            	
                this.getView().bindElement("/" + this.g_eventContextPath );
			}
        }, this);

    },
    
    
    
    
    getLockingDetails :function(path) {
    	var that = this;
    	var result = '';
    	$.ajax({
    		type: 'GET',
    		url: path,
			async: false,
			contentType: "application/json",
			dataType: 'json'  ,
			success: function(data){
				if(data) {
					result = data.d.Exception;
				}				
			},
			error :function(err) { 
				var strResponseText = err.responseText;
				if (strResponseText.indexOf("NOT AUTHORIZED") > -1 ){
					//Just Ignore this error as we are showing this message as part attachRequestFailed event of odata
					// if(that.showUnauthorizedMessage){
					// 	sap.m.MessageBox.show(that.getResBundle().getText("NOT_AUTHORIZED_TO_TAKE_ACTION"), sap.m.MessageBox.Icon.ERROR);
					// 	that.showUnauthorizedMessage=false;
					// } 
				}else{
					sap.m.MessageBox.show('error from Server is ->'+err.responseText, sap.m.MessageBox.Icon.ERROR);
				}
			} 			
			
    	
    	});
    	return result;
    },
    
    
    getCheckBoxName: function(pAccessName) {
    	
    	if(this.s_requestNumber == null || this.s_requestNumber == ""){
    		var oContext  =this.getView().getBindingContext();
    		this.s_requestNumber = oContext.getObject().RequestNumber;
    	}//if

    	
    	return pAccessName + this.s_delimit_key + this.s_requestNumber;
    },
    
    isCheckBoxSelected: function(pApprovalStatus) {
    	if(pApprovalStatus ==="RE"){
    		this.s_rejectedCount++;
    		return false;
    	}else{
    		this.s_approvedCount++;
    		return true;
    	};
    },
    
    isEnabled: function(pCanApprove) {
    	if(pCanApprove === false) {
    		this.s_approvedCount--;
    		return false;
    	}else{
    		return true;
    	};
    },    
    
    
    getRejectionDataModel : function() {
    	var lRejectionDataModel = this.getView().getModel("AccessRejectionData/" + this.g_eventContextPath);
    	if(lRejectionDataModel == undefined || lRejectionDataModel == null){
            var lRejectionData = {};
            lRejectionData.approvedCount = 0;
            lRejectionData.rejectedCount = 0; 
            lRejectionData.rejectionList = [];
            lRejectionData.rejectionCommentsList = [];

            var lRejectionDataModel = new sap.ui.model.json.JSONModel();
            lRejectionDataModel.setData(lRejectionData);
            this.getView().setModel(lRejectionDataModel, "AccessRejectionData/" + this.g_eventContextPath);
            
            lRejectionDataModel = this.getView().getModel("AccessRejectionData/" + this.g_eventContextPath);
    	} //if
    	
    	return lRejectionDataModel;
    },
    updateRejectionDataModel:function(){
        var lRejectionData = {};
        
        lRejectionData.approvedCount = this.s_approvedCount;
        lRejectionData.rejectedCount = this.s_rejectedCount; 
        lRejectionData.rejectionList = this.g_rejectionList;
        lRejectionData.rejectionCommentsList = this.g_rejectionCommentsList;
        this.getRejectionDataModel().setData(lRejectionData);
    },

    handleSelect:function(oEvent){
        this.handleItemPress(oEvent);
    },

    handleItemPress: function(oEvent){
    	var context = oEvent.getSource().getBindingContext();
        this.updateRejectionDataModel();
    	
        this.oRouter.navTo("roleDetails", {  
        	contextPath : this.getView().getBindingContext().sPath.substr(1),
        	key: context.sPath.substr(1)
		}, false);

    },
    
    navigateToDetail: function(oItem) {
        var lSelectedIndex = this.getRoleList().indexOfItem(oItem)+1;
        var lTotalCount = this.getRoleList().getItems().length;
        var oContext = oItem.getBindingContext();
        this.oRouter.navTo("roleDetails", {
      	  RoleID: oContext.getModel().getProperty( oContext.getPath() + "/RoleID"),
      	  RoleType: oContext.getModel().getProperty( oContext.getPath() + "/RoleType"),
      	  RoleSystem: oContext.getModel().getProperty( oContext.getPath() + "/System"),
      	  SelectedIndex: lSelectedIndex,
      	  TotalCount: lTotalCount,
        }); 
    },

	handleLineItemPress: function(oEvent){
		this.navigateToDetail(oEvent.getSource());
	},
	
    handleForward: function(oEvent){
  	 this.gSelectDialog = this.initSelectDialog('Forward');
  	 this.gSelectDialog.open();
    },
	
	
	doSearch: function(oEvent){
	       var filter = [];
	       var sVal = oEvent.getParameter("value");
	       if(sVal !== undefined) {
	           //Get the binded items
	           var itemsBinding = oEvent.getParameter("itemsBinding");
	
	           // create the local filter to apply
	           var selectFilter = new sap.ui.model.Filter("UserID", sap.ui.model.FilterOperator.Contains , sVal);
	           filter.push(selectFilter);
	      
	           // and apply the filter to the bound items, and the Select Dialog will update
	           itemsBinding.filter(filter);
	      }
	},
		
	doLiveChange: function(oEvent){
		    var sFilterPattern = oEvent.getParameters().value.toLowerCase();
	 		var aListItems = oEvent.getSource().getItems();
	      var bVisibility;
	      if(aListItems){
	             for ( var i = 0; i < aListItems.length; i++) {
	          	      var oItem = aListItems[i];
	          	      bVisibility = (oItem.getProperty("title").toLowerCase().indexOf(sFilterPattern) != -1 
	          	    		         || oItem.getProperty("description").toLowerCase().indexOf(sFilterPattern) != -1 );
	                    aListItems[i].setVisible(bVisibility);
	                   
	             } //for
	      }//if
	},
	doNothing: function(){
		
		
	},
	showToastMessage: function(pSubmitType){ 
		    var lToastMessage = this.getResBundle().getText("REQ_FORWARD_SUCCESS_MSG", [this.s_requestNumber, this.s_forwardUserName]);
		    if(pSubmitType === 'Approve'){
		    	lToastMessage = this.getResBundle().getText("REQ_SUBMIT_SUCCESS_MSG", [this.s_approvedCount, this.s_rejectedCount, this.s_requestNumber]);
			
		    }
		    var lControlHandle = this;
			var lToastMessageWidth = "25em";
			
			sap.m.MessageToast.show( lToastMessage, {width:lToastMessageWidth, duration:1000, onClose: function() { lControlHandle.onToastClose(); } } );
	},
	onToastClose: function(){
		this.clearScreenElements();
		this.oRouter.navTo("masterUpdate", {contextPath:"deleteSelected"}, false);
	},
	
	clearScreenElements: function(){
		var k = 0.
		for (k=0;k< this._oControlStore.oButtonListHelper.aButtons.length;k++) {
	    	if (k===0 || k==1) {
	   	    	this._oControlStore.oButtonListHelper.aButtons[k].oButton.setVisible(false);	        	        		
	    	}
		}
	    this.byId("requestHeader").setVisible(false);
		this.byId("TABCONT_ROLE_INFO").setVisible(false);
	},
		
	showErrorDialog: function(pErrorMessage) {
		 var lToastMessageWidth = "25em";
		 sap.m.MessageBox.alert(pErrorMessage, this.doNothing, this.getResBundle().getText("ERROR_TEXT"), "");
	},
	
	getStr:function(strValue){
		  return "'"+strValue+"'";
	}, 
	
	getRejectDialog: function(pAccessNameDescription){
		this.gRejectDialog = this.initRejectDialog(pAccessNameDescription);
		this.gRejectDialog.attachAfterClose(this.rejectLineItem, this);	
		this.gRejectDialog.open();
	},
	
	rejectLineItem: function(oEvent){
		var that = this;
		that.gRejectDialog.detachAfterClose(that.rejectLineItem, that);
		that.g_rejectionCommentsList.push(that.s_rejectComments);
		that.updateRejectionDataModel();		
	},
	approveLineItemSelect: function(oEvent){
		this.gCheckBox = oEvent.getSource();
		var oContext  =this.getView().getBindingContext();
		this.s_commentsMandtry = oContext.getObject().CommentsMandtry;
		this.s_rejectLevel = oContext.getObject().RejectLevel;
		var lAccessName = oEvent.getSource().getName();
		
		if(lAccessName.indexOf(this.s_delimit_key) != -1){
			lAccessName = lAccessName.split(this.s_delimit_key)[0];
		}//if
		lAccessName = lAccessName + this.s_delimit_key + oEvent.getSource().getBindingContext().getObject().System;
		if(oEvent.getSource().getSelected()){
			this.s_approvedCount++;
			if(this.s_rejectedCount>0){
				this.s_rejectedCount--;
				var pos = this.g_rejectionList.indexOf(lAccessName);
				if(pos >= 0){
				   this.g_rejectionList[pos]= " ";
				   this.g_rejectionCommentsList[pos]= " ";
				}
			}
			this.updateRejectionDataModel();
		} else {
			
			if(this.s_approvedCount > 0) {
				this.s_approvedCount--;
				this.g_rejectionList.push(lAccessName);
				this.s_rejectedCount++;
				//show popup only if in stage configuration,comments are mandatory for 
				//Reject at system/role or role level
				//if((this.s_commentsMandtry === "REJECT" || this.s_commentsMandtry === "BOTH")
				//&& (this.s_rejectLevel === "SYR" || this.s_rejectLevel === "ROL")){ 
					var lAccessDescription = oEvent.getSource().getBindingContext().getObject().Description;
					this.getRejectDialog(lAccessDescription);
				//}
        	} //comments mandatory
		}
	},
	forwardRequestCreate: function(pSubmitType,pSelectDialog) {
	    var that= this;
	     
	    that.s_comments1 = that.s_comments;
	    that.s_forwardUser1 = that.s_forwardUser;

	    //var oARForwardJson = {SubmitType:pSubmitType,Approver:that.s_approver1,RequestNumber:that.s_requestNumber1,Comments:that.s_comments1,WorkItemGroup:that.s_wiGroup1,ForwardUser:that.s_forwardUser1};
	    var oARForwardJson = {}; //"SubmitType":"","Approver":"","RequestNumber":"","Comments":"","WorkItemGroup":"","ForwardUser":""};
	    
		oARForwardJson.SubmitType    = pSubmitType;
		oARForwardJson.Approver      = that.s_approver;
		oARForwardJson.RequestNumber = that.s_requestNumber1;
		oARForwardJson.Comments      = that.s_comments1;
		oARForwardJson.WorkItemGroup = that.s_wiGroup1;
		oARForwardJson.ForwardUser   = that.s_forwardUser1;

	    var lRejections = {};
	    lRejections.Access = ' ';
	    lRejections.Action = 'RE';
	    lRejections.Comments = ' ';
	    lRejections.System = ' ';
	    oARForwardJson.Rejections = [];
		oARForwardJson.Rejections[0] = lRejections;

	    
	    var dataList = that.byId('accessRequestedList').getItems();
	    
	    for(var i=0;i<dataList.length;i++){
	    	lRejections = {};
	    	lRejections.Access = dataList[i].getBindingContext().getObject().AccessName;
	    	lRejections.System = dataList[i].getBindingContext().getObject().System;
	    	lRejections.Action = 'AP'; //A-Approve R-Reject
	    	lRejections.Comments = ' ';
	    	var lAccessSystem = lRejections.Access + this.s_delimit_key + lRejections.System;
	    	//var lPosIndex = this.g_rejectionList.indexOf(lRejRoleSystem);
	    	var lPosIndex = this.g_rejectionList.indexOf(lAccessSystem);
	    	var chkBoxAccessRequested = dataList[i].getCells()[0];  //Check wither checkbox selected/not selected for Request Line Item Rejection
	    	if(lPosIndex != -1 && !chkBoxAccessRequested.getSelected()){
	    		lRejections.Action = 'RE';
	    		lRejections.Comments = this.g_rejectionCommentsList[lPosIndex];
	    	}//if
	    	oARForwardJson.Rejections[i] = lRejections;
	    } //for i
	    
		var lCartView = this.getView();
		
		lCartView.setBusy(true);
		
		var sServiceUrl = that.getView().getModel().sServiceUrl;
    	that.oARCCartModel = new sap.ui.model.odata.ODataModel(sServiceUrl,true);
    	that.oARCCartModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
    	that.oARCCartModel.setHeaders({DataServiceVersion:"2.0"});
    	
		//that.oARCCartModel.refreshSecurityToken(function(oData, response) {
    	
			that.oARCCartModel.create("/Submits", oARForwardJson, null,
				function(oData, response) {
					that.showToastMessage(pSubmitType);
					lCartView.setBusy(false);
					//Clear the list.
				    this.g_rejectionList=[];
				    
				}, function(oError) {
					lCartView.setBusy(false);
					that.gRequestNumber = "";
					pSelectDialog.close();
					if(oError && oError.response && oError.response.body){
						var sBody = oError.response.body;
						var errorbackend = "";
						var oBody = "";
						try {
							oBody = jQuery.parseXML(sBody);
							if(oBody){
								errorbackend = oBody.getElementsByTagName("message")[0].childNodes[0].nodeValue;
							}
						} catch (e) {
							oBody = jQuery.parseJSON(sBody);
							if(oBody){
								errorbackend = oBody.error.message.value;
							}
						}

						if(errorbackend.indexOf("NOT AUTHORIZED") > -1){
							errorbackend = that.getResBundle().getText("NOT_AUTHORIZED_TO_TAKE_ACTION");
						}
					    that.showErrorDialog(errorbackend);
					}
				});

//		}, function(oError) {
//			that.gRequestNumber = "";
//			lCartView.setBusy(false);
//			pSelectDialog.close();
//			that.showErrorDialog(this.getView().getModel("i18n").getProperty("ERROR_REFRESH_SECURITY_TOKEN"));
//		}, false);
		
	},//accessRequestCreate
	
	getDialog: function(pTitle, pText) {
		var that = this;
		
		//var lText = this.getResBundle().getText("REJECT_ACCESS_TEXT",[pAccessNameDescription]);
	    var lText = new sap.m.Text({ text:pText, design: "Bold"});
		//var lComments = new sap.m.Input({ type:"Text", valueStateText:this.getResBundle().getText("ADD_COMMENTS_TEXT")});
		var ldialogTitle = this.getResBundle().getText(pTitle);
		var hbox = new sap.m.HBox({height:'6em'});
			hbox.setJustifyContent( sap.m.FlexJustifyContent.Center );
		
		var vbox = new sap.m.VBox({width:"85%"});
			vbox.setJustifyContent( sap.m.FlexJustifyContent.SpaceAround );
			vbox.addItem(lText); 
			//vbox.addItem(lComments);
			
	    hbox.addItem(vbox);
		
		var oDialog1 = "";
        oDialog1 = new sap.m.Dialog( {
			title: ldialogTitle,
			content: [ hbox ],
			beginButton:
				new sap.m.Button({
					text: this.getResBundle().getText("OK_BTN"),
					press : function() {
					   // that.s_rejectComments = lComments.getValue();
					    oDialog1.close();
					}
				}),
			endButton:
				new sap.m.Button({
					text: this.getResBundle().getText("CANCEL_BTN"),
					press : function() {
						oDialog1.close();
					}
				})
		});
        return oDialog1;
	},

	
	initRejectDialog: function(pAccessNameDescription) {
		var that = this;
		
		var lText = this.getResBundle().getText("REJECT_ACCESS_TEXT",[pAccessNameDescription]);
	    var lLabel = new sap.m.Text({ text:lText });
		var lComments = new sap.m.Input({ type:"Text", valueStateText:this.getResBundle().getText("ADD_COMMENTS_TEXT")});
		var ldialogTitle = this.getResBundle().getText("REJECT_COMMENTS_TEXT");
		// var hbox = new sap.m.HBox({height:'6em'});
		// 	hbox.setJustifyContent( sap.m.FlexJustifyContent.Center );
		
		var vbox = new sap.m.VBox({width:"85%"});
			vbox.setJustifyContent( sap.m.FlexJustifyContent.SpaceAround );
			vbox.addItem(lLabel); 
			vbox.addItem(lComments);
			
	    hbox.addItem(vbox);
		
		var oRejectDialog = "";
        oRejectDialog = new sap.m.Dialog( {
			title: ldialogTitle,
			content: [ hbox ],
			beginButton:
				new sap.m.Button({
					text: this.getResBundle().getText("OK_BTN"),
					press : function() {	
					   if (lComments.getValue().trim().length > 0){ 
							lComments.setValueState("Success");
  						    that.s_rejectComments = lComments.getValue();
						    oRejectDialog.close();
							
						}else{
							if(that.s_commentsMandtry === "REJECT" || this.s_commentsMandtry === "BOTH"){ 
								// && (this.s_rejectLevel === "SYR" || this.s_rejectLevel === "ROL")
								lComments.setValueState("Error"); // give error if no comments provided	
							}else{
								lComments.setValueState("Success");
								oRejectDialog.close();
							}
						}
//					    that.s_rejectComments = lComments.getValue();
//					    oRejectDialog.close();
			
					}
				}),
			endButton:
				new sap.m.Button({
					text: this.getResBundle().getText("CANCEL_BTN"),
					press : function() {
					 that.gCheckBox.setSelected(true);	// set checkbox to selected on close
					 that.s_rejectedCount--;
					 that.s_approvedCount++;
					 oRejectDialog.close();
					}
				})
		});
        oRejectDialog.attachBrowserEvent("keydown", function(oEvent) {
        	if(oEvent.keyCode === 27){
				that.gCheckBox.setSelected(true);	// set checkbox to selected on close
				that.s_rejectedCount--;
				that.s_approvedCount++;
				oRejectDialog.close();
        	}            
        });
        return oRejectDialog;
	},
	
    initSelectDialog: function(pSubmitType){
	    var that = this;
	    var li18nResource = this.getView().getModel("i18n");
	    
        var oContext  =this.getView().getBindingContext();
        this.s_wiGroup  = oContext.getObject().WorkItemGroup;
        this.s_requestNumber = oContext.getObject().RequestNumber;
        this.s_approver = oContext.getObject().Approver;
        this.s_commentsMandtry = oContext.getObject().CommentsMandtry;
        that.s_approver1 = that.s_approver;
	   
	    that.s_requestNumber1 = that.s_requestNumber;
	    that.s_wiGroup1 = that.s_wiGroup;
        
	    var lToText = li18nResource.getProperty("TO_TEXT");
	    var lToLabel = new sap.m.Text({ text:lToText });
		var lComments = new sap.m.Input({ type:"Text", valueStateText:li18nResource.getProperty("ADD_COMMENTS_TEXT"), value:li18nResource.getProperty("THANKS_TEXT")});
		
		var hbox = new sap.m.HBox({height:"100%"});
			hbox.setJustifyContent( sap.m.FlexJustifyContent.Center );
		
		var vbox = new sap.m.VBox({width:"85%"});
			vbox.setJustifyContent( sap.m.FlexJustifyContent.SpaceAround );
			vbox.addItem(lToLabel); 
			vbox.addItem(lComments);
		
		hbox.addItem(vbox);
		var ldialogTitle = pSubmitType;
		if (pSubmitType === 'Approve'){
		 
		  var lApproveSubTitle = this.getResBundle().getText("APPROVE_REJECT_ITEMS_TEXT", [that.s_approvedCount, that.s_rejectedCount, that.s_requestNumber1, oContext.getObject().UserName]);
		  lToLabel.setText(lApproveSubTitle);
		  ldialogTitle = this.getResBundle().getText("SUBMIT_BTN");
		  lComments.setValue("");
		  lComments.setValueStateText(this.getResBundle().getText("ADD_COMMENTS_MSG"));
		}else{
			ldialogTitle = this.getResBundle().getText("FORWARD_TEXT");
		}
		
		var oDialog1 = "";
        oDialog1 = new sap.m.Dialog( {
			title: ldialogTitle,
			content: [ hbox
			],
			beginButton:
				new sap.m.Button({
					text: li18nResource.getProperty("OK_BTN"),
					press : function() {
					    that.s_comments=lComments.getValue();
					    
					    if(that.s_forwardUserName && that.s_forwardUserName != ""){
					    	
					    	var lpos1 = that.s_forwardUserName.lastIndexOf("(");
					    	
					    	var lpos2 = that.s_forwardUserName.lastIndexOf(")");
					    	
					    	that.s_forwardUser = that.s_forwardUserName.substring(lpos1+1,lpos2);
					    }
						that.forwardRequestCreate(pSubmitType, oDialog1);
						oDialog1.close();
					}
				}),
			endButton:
				new sap.m.Button({
					text: li18nResource.getProperty("CANCEL_BTN"),
					press : function() {
						oDialog1.close();
					}
				})
		});
				
		if (pSubmitType === 'Forward'){
			var oSelectDialog1 = that.gSelectDialog;
			if(!oSelectDialog1){
				var itemTemplate = new sap.m.StandardListItem({
		                   title: "{UserName} ({UserID})",
		                   description: "{Email}", 
		                   icon: "sap-icon://employee",
		                   //active: true
		              });	
				oSelectDialog1 = new sap.m.SelectDialog( {
		            title: li18nResource.getProperty("FORWARD_TEXT"),
		            noDataText: li18nResource.getProperty("NO_FORWARD_USERS_FOUND_TEXT"),
		            search : this.doSearch
		       });
	
				// set model & bind Aggregation
				oSelectDialog1.setModel(this.getView().getModel());
				oSelectDialog1.bindAggregation("items", "/ForwardUsers", itemTemplate);
	       
				// attach close listener
				oSelectDialog1.attachConfirm(function(evt) {
				    var selectedItem = evt.getParameter("selectedItem");
				    if (selectedItem) {
				   	 
							 that.s_forwardUserName=selectedItem.getTitle();
							 
				   	 lToLabel.setText(lToText + " " + selectedItem.getTitle() + ":");
						     oDialog1.open(); 
				    }
				});
			}
			return oSelectDialog1; 
			
	    }else{
	    	return  oDialog1;
	    } 
  
   },
   formatUserNameDisplay:function(oUserName,oRequesterName){
	   var resBundle = this.getResBundle(); 
	   return resBundle.getText("USER_LBL",[oUserName]);
   },
   formatAuthorizedMessage:function(oIsAuthorized){
	   var resBundle = this.getResBundle();
	   if(oIsAuthorized === false){
		   return resBundle.getText("NOT_AUTHORIZED_TO_TAKE_ACTION");
	   } else {
		   return "";
	   }
   },
   
//   onListLoaded:function(oEvent){
//	   
//	   
//	   var lAccessCount = this.byId("accessRequestedList").getItems().length;
//	   var lGrowingInfo = this.byId("accessRequestedList").getGrowingInfo();
//	   if(lGrowingInfo != null){
//		   lAccessCount = lGrowingInfo.total;
//	   }//if
//	   
//	   this.byId("AccessTab").setCount(lAccessCount);
//	
//	   
//	   if(this.g_rejectionList.length === 0) {
//	       this.s_approvedCount = lAccessCount;
//	       this.updateRejectionDataModel(); 
//	   }
//   },
   
    customFieldsDisplay: function() {
    	
    	var lInfoForm = this.byId("INFO_FORM");
    	
    	//lInfoForm.destroyContent();
    	
    	var dataList = this.byId('customFieldsDataList').getItems();
	    
	    for(var i=0;i<dataList.length;i++){
	    	
	    	var lLabel  = dataList[i].getBindingContext().getObject().FieldLabel;
	    	var lValue  = dataList[i].getBindingContext().getObject().FieldValue;

	    	var lLabelObj = new sap.m.Label({ text:lLabel, design:"Bold"});
	    	var lTextObj = new sap.m.Text({ text:lValue});

	    	lInfoForm.addContent(lLabelObj);
	    	lInfoForm.addContent(lTextObj);
	    } //for i
    },
   
	requestCompleted: function(oCont) {
		


		this.getView().getModel().detachRequestCompleted(this.requestCompleted, this);
    	var oDataTemp = {};
    	
    	// this.s_approvedCount = 0;
	    // this.s_rejectedCount = 0;
	    this.s_approvedCount = 0;
	    this.s_rejectedCount = 0;
	    
    	this.getView().getModel().updateBindings(true);
    	
    	var oContentList = this.byId("INFO_FORM").getContent();
		 
    	
		this.oDataURL = this.getView().getModel().sServiceUrl;
		var lockingDetails = this.getLockingDetails(this.oDataURL+"/" + this.g_eventContextPath );
		this.byId("lockId").setText(lockingDetails);
    	 
		var lDialogTitle = this.getResBundle().getText("ERROR_TEXT");
		if(this.byId("lockId").getText()!=null && 
				this.byId("lockId").getText()!='' &&
				this.byId("lockId").getText()!='undefined' &&
				this.byId("lockId").getText()!=undefined)
		{    
		
		   if(this.showLockMessage){	 
		   	this.showLockMessage = false;
   			sap.m.MessageBox.show(this.byId("lockId").getText(),{title: lDialogTitle});	

							
	        var k=0;
	        for (k=0;k< this._oControlStore.oButtonListHelper.aButtons.length;k++) {
	        	if (k===0 || k==1) {
	        		this._oControlStore.oButtonListHelper.aButtons[k].oButton.setVisible(true);
	        		this._oControlStore.oButtonListHelper.aButtons[k].oButton.setEnabled(false);	        	        		
	        	}	        	
	        } 
		   }//if
		}
		else {
	        var k=0;
	        for (k=0;k< this._oControlStore.oButtonListHelper.aButtons.length;k++) {
	        	if (k===0 || k==1) {
	        		this._oControlStore.oButtonListHelper.aButtons[k].oButton.setVisible(true);
	        		this._oControlStore.oButtonListHelper.aButtons[k].oButton.setEnabled(true);	        	        		
	        	}	        	
	        }        						
		}
		
		
		// if(this.g_tlock == false){
		// 	return;
		// }
		// this.g_tlock=false;		
    	 
		for(var i=0;i<oContentList.length;i++){	 
		   var oControl = oContentList[i];
			 
		   var key = oControl.getId();
			   
		   if (oControl.getMetadata()._sClassName === 'sap.m.Text') {
			   key = key.replace("_txt","_lbl");
			   oDataTemp[key] = oControl.getText();
			   if(key.indexOf("_txt") == -1 && key.indexOf("_lbl") == -1){
				   this.byId("INFO_FORM").removeContent(oControl).destroy();
				   continue;
			   }
			   
			   oControl.setVisible( this.isVisible( oControl.getText() ) );
		   } 
		}//for i

		for(var i=0;i<oContentList.length;i++){	 
			   var oControl = oContentList[i];
				 
 			   var key = oControl.getId();
			   if (oControl.getMetadata()._sClassName === 'sap.m.Label') {
				   if(key.indexOf("_txt") == -1 && key.indexOf("_lbl") == -1){
					   this.byId("INFO_FORM").removeContent(oControl).destroy();
					   continue;
				   }
				   
				   oControl.setVisible( this.isVisible( oDataTemp[key] ) );
			   } 
	    }//for i
		
		this.customFieldsDisplay();
		
		this.gs_approvedCount = this.byId("AccessTab").getCount();
		//HUANGKE (4/1/2016): since this.s_rejectedCount is always zero, this.s_approvedCount is not correct here.
		//this.s_approvedCount = this.gs_approvedCount - this.s_rejectedCount;
		// this.s_approvedCount = 0;
	 //   this.s_rejectedCount = 0;	
	   // this.s_approvedCount = 0;
	    //this.s_rejectedCount = 0;		
		//this.onListLoaded();
		this.getView().setBusy(false);
		
		//get error message from table content list
		var lv_error_message = "";
		try {
			var dataList = this.byId('accessRequestedList').getItems();
		    
		    for(var i=0;i<dataList.length;i++){
		    	lv_error_message = dataList[i].getBindingContext().getObject().ErrorMessage;
		    	
		    	if(lv_error_message != ""){
		    		break;
		    	}
		    } //for i
		}catch(exception){
		}
		
		//this.byId('Forward').setEnabled(true);
    	//this.byId('Submit').setEnabled(true);
		//show error in error dialog
	    if(lv_error_message != "")
	    	
	    {
	    	//this.byId('Forward').setEnabled(false);
	    	//this.byId('Submit').setEnabled(false);
//	    	lv_error_message = lv_error_message.replace(/&/g,"");
//	    	this.showErrorDialog(lv_error_message); //this.getView().getModel("i18n").getProperty("ERROR_REFRESH_SECURITY_TOKEN"));
	    }
		
	    
	    
    },
	isVisible: function(pValue){
		if(pValue && pValue != null && pValue != ""){
			return true;
		} 
		return false;
		
	},
	formatDaysNumberDisplay : function (oValue){
		   if(oValue === 0){
		     return ".";
		   } else {
			 return oValue;  
		   }
			   
	   },
	   formatDaysDisplay : function (oValue){
		   var resBundle = this.getView().getModel("i18n").getResourceBundle();
			
		   if(oValue === 0){
			   return resBundle.getText("TODAY_TEXT");
		   } else {
			   return resBundle.getText("NUMBER_UNIT_TEXT");
		   }
	  },
	  formatRiskIconDisplay: function(pRiskCount){
		  if(pRiskCount>0){
			  return true;
		  } else {
			  return false;
		  }
	  },
	   formatRiskDisplay: function (pRiskCount){
		   var resBundle = this.getView().getModel("i18n").getResourceBundle();
		   if(pRiskCount>1){
			   return resBundle.getText("RISKS_LBL",[pRiskCount]);
		   } else if(pRiskCount === 1){
			   return resBundle.getText("RISK_LBL",[pRiskCount]);
		   } else {
			   return "";
		   }
	   },

   doSubmit:function(){
	  	this.gSelectDialogApprove = this.initSelectDialog('Approve');
	  	this.gSelectDialogApprove.open();
   }
    
});
},
	"fcg/grc/accessrequest/approve/view/RequestDetail.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core"  xmlns:form="sap.ui.layout.form"\n\txmlns="sap.m" controllerName="fcg.grc.accessrequest.approve.view.RequestDetail">\n\t<Page id="RequestDetail" title="{i18n>ACCESS_REQUEST_LBL}">\n\t\t<content>\n\t\t\t<core:ExtensionPoint name="extHeader" />\n            <ObjectHeader id="requestHeader" title="{RequestReason}"\n             \t\t\t  number="{path:\'DaysElapsed\', formatter:\'.formatDaysNumberDisplay\'}"\n                    \t  numberUnit="{path:\'DaysElapsed\', formatter:\'.formatDaysDisplay\'}"\n                          >\n                <attributes>\n\t\t\t\t\t<ObjectAttribute text="{parts:[{path:\'i18n>REQUEST_LBL\'}, {path:\'RequestNumber\'}], formatter:\'jQuery.sap.formatMessage\'}" />\n\t\t\t\t\t<ObjectAttribute text="{parts:[ {path:\'UserName\'}, {path:\'RequesterName\'}], formatter:\'.formatUserNameDisplay\'}"  />\n\t\t\t\t</attributes>\n\t\t\t     <firstStatus>\n\t\t\t\t\t<ObjectStatus\n\t\t\t\t\t\ttext="{path:\'RisksCount\', formatter:\'.formatRiskDisplay\'}"\n\t\t\t\t\t\tstate="Error" />\n\t\t\t\t</firstStatus>\n            </ObjectHeader>\n\n          <Text id="lockId" text="{Exception}" visible="false"></Text>\n             \n            \n            \n            <IconTabBar id="TABCONT_ROLE_INFO">\n            <items>\n            \t<IconTabFilter  id="AccessTab" icon="sap-icon://menu" key="Acess" text="{i18n>ACCESS_LBL}" count="{AccessCount}">\n            \t<content>\n            \t\t<core:ExtensionPoint name="extAccessTab" />\n\t\t             <Table\n\t\t\t\t\t\tid="accessRequestedList" select="handleSelect"\n\t\t\t\t\t\tgrowing="false" growingScrollToLoad="false" items="{Roles}" class="sapFixHeaderList" noDataText="{i18n>NO_ACCESS_REQUESTED_MSG}" >\n\t\t\t\t\t\t<!--  updateFinished="onListLoaded" -->\n\t\t\t\t\t\t<columns>\n\t\t\t\t\t\t    <Column hAlign="Left" styleClass="limit" width="20%"><header><Label text="{i18n>APPROVE_LBL}"></Label></header></Column>\n\t\t\t\t\t\t\t<Column hAlign="Left" styleClass="limit" width="60%"><header><Label text="{i18n>ACCESS_LBL}"></Label></header></Column>\n\t\t\t\t\t\t\t<Column hAlign="Left" styleClass="limit" width="20%"><header><Label text="{i18n>RISKS_COL_LBL}"></Label></header></Column>\n\t\t\t\t\t\t\t<!-- extension point for Validity Field-->\n\t\t\t\t\t\t\t<core:ExtensionPoint name="extValidityField" />\n\t\t\t\t\t\t</columns>\n\t\t\t\t\t\t<items  >\n\t\t\t\t\t\t\t<ColumnListItem id="accessRequestedListItem" press="handleItemPress"  type="Navigation" >\n\t\t\t\t\t\t\t\t<cells>\n\t\t\t\t\t\t\t\t    <CheckBox  selected="{path:\'ApprovalStatus\', formatter:\'.isCheckBoxSelected\'}" visible="true" enabled="{path:\'CanApprove\', formatter:\'.isEnabled\'}" \n\t\t\t\t\t\t\t\t    design="Small" value="{AccessName}"  name="{path:\'AccessName\', formatter:\'.getCheckBoxName\'}" \n\t\t\t\t\t\t\t\t    select="approveLineItemSelect" tooltip="{path:\'CanApprove\', formatter:\'.formatAuthorizedMessage\'}"></CheckBox>\n\t\t\t\t\t\t\t\t\t<Text text="{Description}"></Text>\n\t\t\t\t\t\t\t\t\t<core:Icon src="sap-icon://alert" color="red" visible="{path:\'RisksCount\', formatter:\'.formatRiskIconDisplay\'}"/>\n\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extension2" />\n\t\t\t\t\t\t\t\t</cells>\n\t\t\t\t\t\t\t</ColumnListItem>\n\t\t\t\t\t\t</items>\n\t\t\t\t\t</Table>\n\t\t\t    </content>\n\t\t\t\t</IconTabFilter>\n\t\t\t\t<IconTabFilter  icon="sap-icon://hint" key="Info" text="{i18n>INFO_LBL}">\n\t\t\t       <content>\n\t\t\t        <form:SimpleForm id="INFO_FORM" minWidth="300">\n\t\t\t\t\t  <form:content>\n                        <Label id="BusinessProcess_lbl" text="{i18n>BUS_PROC_TEXT}"\n\t\t\t\t\t\t\t\tdesign="Bold" visible="false"></Label>\n\t\t\t\t        <Text id="BusinessProcess_txt" text="{BusinessProcess}" visible="false"></Text> \n\n                        <Label id="FunctionalArea_lbl" text="{i18n>FUN_AREA_TEXT}"\n\t\t\t\t\t\t\t\tdesign="Bold" visible="false"></Label>\n\t\t\t\t        <Text id="FunctionalArea_txt" text="{FunctionalArea}" visible="false"></Text> \n\n                        <Label id="Requester_lbl" text="{i18n>REQUESTER_TXT}"\n\t\t\t\t\t\t\t\tdesign="Bold" visible="false"></Label>\n\t\t\t\t        <Text id="Requester_txt" text="{RequesterName}" visible="false"></Text> \n\n                        <Label id="RequestReason_lbl" text="{i18n>REQUEST_REASON_TEXT}"\n\t\t\t\t\t\t\t\tdesign="Bold" visible="false"></Label>\n\t\t\t\t        <Text id="RequestReason_txt" text="{RequestReason}" visible="false"></Text> \n\t\t\t\t        <core:ExtensionPoint name="extInfoView" />\n\t\t\t\t       </form:content>\n\t\t\t\t\t </form:SimpleForm>\n\t\t             <Table\n\t\t\t\t\t\tid="customFieldsDataList" select="handleSelect"\n\t\t\t\t\t\tgrowing="false" growingScrollToLoad="false" items="{CustomFields}" class="sapFixHeaderList" noDataText="" visible="false">\n\t\t\t\t\t\t  <columns>\n\t\t\t\t\t\t    <Column hAlign="Left" styleClass="limit" width="20%"><header><Label text="{i18n>NAME_LBL}"></Label></header></Column>\n\t\t\t\t\t\t\t<Column hAlign="Left" styleClass="limit" width="60%"><header><Label text="{i18n>VALUE_LBL}"></Label></header></Column>\n\t\t\t\t\t\t</columns>\n\t\t\t\t\t\t<items  >\n\t\t\t\t\t\t\t<ColumnListItem id="customFieldsDataListItem"  >\n\t\t\t\t\t\t\t\t<cells>\n\t\t\t\t\t\t\t\t\t<Text text="{FieldLabel}"></Text>\n\t\t\t\t\t\t\t\t\t<Text text="{FieldValue}"></Text>\n\t\t\t\t\t\t\t\t</cells>\n\t\t\t\t\t\t\t</ColumnListItem>\n\t\t\t\t\t\t</items>\n\t\t\t\t\t</Table>\n\t\t\t\t\t \n                    </content>\n\t\t\t\t</IconTabFilter>\n\t\t\t</items>\n        </IconTabBar>\n\t\t\t             \n\t\t</content>\n\t\t\n\t\t<!--  <footer>\n\t\t   <Bar id="detailFooter">\n\t\t\t\t<contentRight>\n\t\t\t\t\t<Button id="Submit" text="{i18n>SUBMIT_BTN}" tap="doSubmit"\n\t\t\t\t\t\ttype="Emphasized"></Button>\n\t\t\t\t\t<Button id="Forward" text="{i18n>FORWARD_TEXT}" \n\t\t\t\t\t\tenabled="true" press="handleForward" />\n\t\t\t\t</contentRight>\n\t\t\t</Bar>\n\t\t</footer> -->\n\t</Page>\n</core:View>',
	"fcg/grc/accessrequest/approve/view/RequestMaster.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");

sap.ca.scfld.md.controller.ScfldMasterController.extend("fcg.grc.accessrequest.approve.view.RequestMaster", {

    onInit : function() {
    	
        // execute the onInit for the base class BaseDetailController
        sap.ca.scfld.md.controller.ScfldMasterController.prototype.onInit.call(this);

        this.isRoot=true;
        
         // needed for set item from bookmark navigation
        this.oRouter.attachRoutePatternMatched(function(oEvent) {
        	var hiddenList = this.getHiddenList();
		 	  if(hiddenList) {
		 		hiddenList.setVisible(false);  
		 	  }
            var sName = oEvent.getParameter("name");
            var sNewHash = null;

            this._bIsDetailRoute = false;
            
            this._bIsMasterRoute = false;

            if (sName === "detail") {
                this._bIsDetailRoute = true;
                sNewHash = "/" + oEvent.getParameter("arguments").contextPath;
                
              //  this._selectDetail();
            }
            
            if (sName === "roleDetails") {
                this._bIsDetailRoute = false;
                sNewHash = "/" + oEvent.getParameter("arguments").contextPath + "/" + oEvent.getParameter("arguments").key;
            }
            if (sName === "master") {
                this._bIsMasterRoute = true;
            }

            if (sName === "masterUpdate") {
                this._bIsMasterRoute = true;
                var lcontextPath = oEvent.getParameter("arguments").contextPath;
                if(lcontextPath){
                   this.handleDeleteSelectedAndSelectNew(lcontextPath);
                }
            }
            this._hashParam = sNewHash;
        }, this);
    },
  
	applySearchPatternToListItem : function(oItem, sFilterPattern) {

		if (sFilterPattern.substring(0, 1) === "#") {
			var sTail = sFilterPattern.substr(1);
			var sDescr = oItem.getBindingContext().getProperty("Name").toLowerCase();
			return sDescr.indexOf(sTail) === 0;
		} else {
			
		    return sap.ca.scfld.md.controller.BaseMasterController.prototype.applySearchPatternToListItem.call(null, oItem,
			  	sFilterPattern);
		}

	},
	handleDeleteSelectedAndSelectNew: function(pContextPath){
		if(pContextPath === null || pContextPath === ""){ //if contextPath empty just return
			return;
		}
        
		// Delete selected one or from context path
		var lSelectedItem = this.getList().getSelectedItem();
		var lSelectedItemPos = this.getList().indexOfItem(lSelectedItem);
		//this.getList().removeItem(lSelectedItemPos);
		//lSelectedItem.setVisible(false);

		var lItemsList = this.getList().getItems();
		
		// Select next item in the list.
		//lSelectedItemPos--;
		
		if( lSelectedItemPos < 0  ) {
			lSelectedItemPos = 0;
		} 
		
		if( lItemsList.length>0){
			if(lItemsList[lSelectedItemPos].getVisible() == false){
				for(var i=lSelectedItemPos;i<lItemsList.length;i++){
					if( lItemsList[i].getVisible() ){
						lSelectedItemPos = i;
						break;
					}
				}//for
			}//if
	
			if(lItemsList[lSelectedItemPos].getVisible() == false){
				for(var i=lSelectedItemPos;i>=0;i--){
					if( lItemsList[i].getVisible() ){
						lSelectedItemPos = i;
						break;
					}
				}//for
			}//if
            //Changes for Mobile Approver Issue
			if((!sap.ui.Device.system.phone ) && lItemsList[lSelectedItemPos].getVisible()){
				this.setListItem(lItemsList[lSelectedItemPos]);
			} else {
				// delete the previous selected item.
				//var oList = this.getList();
				//oList.removeSelections();
				//var lSelectedItemPos = sap.ui.getCore().getModel("SELECTED").getProperty("/selectedID");
				var lSelectedItemPos = this.getView().getModel("SELECTED").getProperty("/selectedID");
				this.getList().removeItem(lSelectedItemPos);
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			        this.oRouter.navTo("masterUpdate", {contextPath:"deleteSelected"}, false);
				//this.searchRequestsFromOdata("");
			}
		} 
		else {
		 	if( lSelectedItem != undefined && lSelectedItem != null && lSelectedItem != "" ) {
		 		lSelectedItem.setVisible(false);				
		 	}
		 	var oList = this.getList();
		 	oList.removeSelections();
		// 	this.searchRequestsFromOdata("");
		 }
		
		//lItemsList = this.getList().getItems(); //Get Latest count.
		
        //this.oApplicationImplementation.oMHFHelper.setMasterTitle(this, lItemsList.length);
	},
	
    //This method is being called by framework and it is required 
	getHeaderFooterOptions : function() {
		var that = this;
		return {
                onBack : false,
			    sI18NMasterTitle : "ACCESS_REQUESTED_TEXT",
		};
	},
	isLiveSearch: function() {
		return false;
	},
	isBackendSearch: function(){
		return true; //return true;
	},
	applyBackendSearchPattern: function(sFilterPattern, oBinding) {	
        this.searchRequestsFromOdata(sFilterPattern);	
    },
	searchRequests: function(oEvent){
		var searchValue = oEvent.getSource().getValue();
		this.searchRequestsFromOdata(searchValue);	
    },
    
    searchRequestsFromOdata: function(searchValue){
    	var oRequestModel = this.getView().getModel();
    	var oRequestList = this.byId("list");
    	searchValue=searchValue.replace("&","_amp;");
    	var lFilter = new sap.ui.model.Filter("WorkItemGroup", "EQ", searchValue);  // Pass searchValue in order to map backend search value.
    	var oRequestTemplate = this.byId("MAIN_LIST_ITEM");
    	oRequestList.setBusy(true);
    	oRequestList.setModel( oRequestModel );
    	oRequestList.attachUpdateFinished(this.showRequestDetails, this);
    	oRequestList.bindAggregation("items", {path:"/Requests", template:oRequestTemplate, filters:lFilter});
    	
    	oRequestList.updateBindings(false);
	    this.registerMasterListBind(this.getList());
    	
    },
    
    showRequestDetails: function(){
       var oRequestList = this.byId("list");
 	   this.registerMasterListBind(this.getList());
 	   this.getView().getModel().detachRequestCompleted(this.showRequestDetails, this);
 	   oRequestList.detachUpdateFinished(this.showRequestDetails, this);
 	   this.byId("list").setBusy(false);
	   this.selectRequestDetail();
    },
    
	   selectRequestDetail : function() {
			var list = this.getList();
			var items = list.getItems();
			if (!sap.ui.Device.system.phone && items.length > 0
					&& !list.getSelectedItem()
					) { 
				this._firstSelection = true;
				this.setListItem(items[0]);
			} else if (list.getSelectedItem()){
				this.setListItem(list.getSelectedItem());
			}
		},
	
	handleItemPress: function(oEvent) {
		this.handleSelect(oEvent);
	},
	
    handleSelect:function(oEvent){
    	var oItem = oEvent.getParameter("listItem");
    	if(!oItem){
    		oItem = oEvent.getSource();
    	}
    	this.setListItem(oItem);
    },
    
    setListItem: function (oItem) {
    	if(oItem == undefined || oItem == null || oItem === "" ){
    		return;
    	}//if
    	
    	var oList = this.getList();
		oList.removeSelections();
		oItem.setSelected(true);
		oList.setSelectedItem(oItem, true);
		
		var id = this.getView().byId("list").indexOfItem(oItem);
         var oModel = new sap.ui.model.json.JSONModel({
				selectedID: id
			}, "SELECTED");

		// Assign the model object to the SAPUI5 core
		this.getView().setModel(oModel,"SELECTED")
		//sap.ui.getCore().setModel(oModel, "SELECTED");

		this.oRouter.navTo("detail", {
			contextPath : oItem.getBindingContext().sPath.substr(1)
		});
    },
    
//    formatDateToNumber : function(oDate){
//    	var lcurrentDate = new Date();
//    	
//    	alert(oDate+":"+lcurrentDate);
//    	var days = Math.round(Math.abs((lcurrentDate - oDate ) / (24*60*60*1000)));
//    	return days;
//    },
    formatItemDisplay : function (oValue){
    	var resBundle = this.getView().getModel("i18n").getResourceBundle(); 
    	
        return resBundle.getText("USER_LBL",[oValue]);
   },
   formatDaysNumberDisplay : function (oValue){
	   if(oValue === 0){
	     return " ";
	   } else {
		 return oValue;  
	   }
		   
   },
   formatRiskDisplay: function (pRiskCount){
	   var resBundle = this.getView().getModel("i18n").getResourceBundle();
	   if(pRiskCount>1){
		   return resBundle.getText("RISKS_LBL",[pRiskCount]);
	   } else if(pRiskCount === 1){
		   return resBundle.getText("RISK_LBL",[pRiskCount]);
	   } else {
		   return "";
	   }
   },
   formatDaysDisplay : function (oValue){
	   var resBundle = this.getView().getModel("i18n").getResourceBundle();
		
	   if(oValue === 0) {
		   return resBundle.getText("TODAY_TEXT");
	   } else if(oValue === 1){
		   return resBundle.getText("DAY_AGO_TEXT");
	   } else if(oValue > 1){
		   return resBundle.getText("NUMBER_UNIT_TEXT");
	   }
  },
  getHiddenList : function() {    	 
  	
 	 var listName = "__list";
 	 var listHandle = null;
 	 for(var k=0;k<20;k++) {
 		 listHandle = sap.ui.getCore().getControl(listName+k);
 		 if(listHandle) {
 			 break;
 		 }
 	 }    	 
        return listHandle;
 }
});
},
	"fcg/grc/accessrequest/approve/view/RequestMaster.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core"\n\txmlns="sap.m" controllerName="fcg.grc.accessrequest.approve.view.RequestMaster">\n\t<Page id="page" title="{i18n>ACCESS_REQUESTED_TEXT}">\n\t   <subHeader>\n            <Bar enableFlexBox="true" id="subheader">\n                <contentMiddle>\n                    <SearchField id="searchfield" liveChange="onSearchFieldChanged" placeholder="{i18n>SEARCH_TEXT}" >\n                    </SearchField>\n                </contentMiddle>\n            </Bar>\n        </subHeader>\n\t\n\t\t<content>\n\t\t\t<List id="list" items="{/Requests}" mode="{device>/listMode}" \n\t\t\t select="handleSelect" noDataText="{i18n>NO_REQUESTS_FOUND_TEXT}" growing="true" growingScrollToLoad="true" growingThreshold="5" >\n\t\t\t\t<ObjectListItem id="MAIN_LIST_ITEM"\n                                press="handleItemPress"\n                                type="{device>/listItemType}"\n\t\t\t\t\ttitle="{RequestReason}"\n                    number="{path:\'DaysElapsed\', formatter:\'.formatDaysNumberDisplay\'}"\n                    numberUnit="{path:\'DaysElapsed\', formatter:\'.formatDaysDisplay\'} "\n                    >\n                    \n\t\t\t\t\t<attributes>\n\t\t\t\t\t\t<ObjectAttribute text="{parts:[{path:\'i18n>REQUEST_LBL\'}, {path:\'RequestNumber\'}],formatter:\'jQuery.sap.formatMessage\'}" />\n\t\t\t\t\t\t<ObjectAttribute text="{path:\'UserName\', formatter:\'.formatItemDisplay\'}" />\n\t\t\t\t\t\t<ObjectAttribute text="{CommentsMandtry}" visible="false"/>\n\t\t\t\t\t\t<ObjectAttribute text="{RejectLevel}" visible="false"/>\n\t\t\t\t\t</attributes>\n\t\t\t\t\t<secondStatus>\n\t\t\t\t\t\t<ObjectStatus\n\t\t\t\t\t\t\ttext="{path:\'RisksCount\', formatter:\'.formatRiskDisplay\'}"\n\t\t\t\t\t\t\tstate="Error" />\n\t\t\t\t\t</secondStatus>\n\t\t\t\t</ObjectListItem>\n\t\t\t\t<core:ExtensionPoint name="extReasonField"></core:ExtensionPoint>\t\t\t\t\n\t\t\t</List>\n\t\t</content>\n\t\t<footer>\n\t\t</footer>\n\t</Page>\n</core:View>',
	"fcg/grc/accessrequest/approve/view/RoleDetails.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.core.format.DateFormat"); 
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.grc.accessrequest.approve.view.RoleDetails", {
	
		 oModel:null,
		 mRoleId:0,
		 mRoleType:"", 
		 mRoleSystem:"",
		 mRequestNumber:"",
		 mValidTo:null,
		 mValidFrom:null,		 
		 mAccessType:"",
		 gRecentRoleId:{},
		 glocale : sap.ui.getCore().getConfiguration().getLanguage(), 
		 resBundle:null,

	 	onInit: function () {
 		    //execute the onInit for the base class BaseDetailController
	        sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
	    	this.oRouter.attachRouteMatched(function(oEvent) {
				if (oEvent.getParameter("name") === "roleDetails") {
					
					var lParentContextPath = oEvent.getParameter("arguments").contextPath;
					var lContextPath = oEvent.getParameter("arguments").key;
					
                    var oModel = this.getView().getModel();
					var RoleID= oModel.oData[lContextPath].AccessID;
					var RoleType= oModel.oData[lContextPath].RoleType;
					var RoleSystem= oModel.oData[lContextPath].System;
					var ValidTo= oModel.oData[lContextPath].ValidTo;
					var ValidFrom = oModel.oData[lContextPath].ValidFrom;					
					var RequestNumber= oModel.oData[lParentContextPath].RequestNumber;
					//Hide Risk & Action Icons for FFID Request 
					var AccessType = oModel.oData[lContextPath].AccessType;
					var riskIcon = this.getView().byId("itfRisks");
					var actionIcon = this.getView().byId("itfActions");
					if (AccessType === "FFI") {
						riskIcon.setVisible(false);
						actionIcon.setVisible(false);
					} else {
						riskIcon.setVisible(true);
						actionIcon.setVisible(true);						
					}
					
					var data = {'RoleID':RoleID, 'RoleType':RoleType, 'RoleSystem':RoleSystem, 'RequestNumber':RequestNumber, 'ValidTo':ValidTo, 'ValidFrom':ValidFrom,  'AccessType':AccessType}; //, 'SelectedIndex':SelectedIndex, 'TotalCount':TotalCount };
					this.refreshRoleDetail(data);

				}
			}, this);
	    },
	
	    onBackBtnPressed: function(oEvent){
	        window.history.go(-1);
	    },
	    
	    getResBundle: function(){
	    	   if(this.resBundle === null){
	    		   this.resBundle = this.getView().getModel("i18n").getResourceBundle(); 
	    	   }
	    	   return this.resBundle;
	    },
   
	    getModel:function(){
	    	return this.getView().getModel();
	    },
	    
	    
	    getSelectedRoles:function(oModel){
	    	var oDataProp = oModel.getProperty("/SelectedRoles");
			if(!oDataProp) {
				oDataProp = new Array();
				oModel.setProperty("/SelectedRoles",oDataProp);
			}
			return oDataProp;
	    	
	    },
	    

		isVisible: function(pValue){
			if(pValue && pValue != null && pValue != ""){
				return true;
			} 
			return false;
			
		},
	    
		requestCompletedRole: function(oCont) {
	    	var oDataTemp = {};
	    	
	    	var oContentList = this.byId("INFO_FORM").getContent();
			 
			for(var i=0;i<oContentList.length;i++){	 
			   var oControl = oContentList[i];
				 
 			   var key = oControl.getId();
 			   
			   if (oControl.getMetadata()._sClassName === 'sap.m.Text') {
				   key = key.replace("_txt","_lbl");
				   oDataTemp[key] = oControl.getText();

				   oControl.setVisible( this.isVisible( oControl.getText() ) );
			   } 
			}//for i

			for(var i=0;i<oContentList.length;i++){	 
				   var oControl = oContentList[i];
					 
	 			   var key = oControl.getId();
	 			   
				   if (oControl.getMetadata()._sClassName === 'sap.m.Label') {	 
					   oControl.setVisible( this.isVisible( oDataTemp[key] ) );
				   } 
		    }//for i

			
			this.byId("roleDescription").setVisible(this.isVisible(this.byId("longDescription").getText()));
			this.byId("actionList").setVisible((this.byId("actionList").getItems().length === 0)?false:true);
			
	    	oCont.getView().setBusy(false);
	    },

	    getRoleKey: function() {
	    	return "System='"+this.mRoleSystem+"',RequestNumber='"+this.mRequestNumber+"',RoleType='"+this.mRoleType+"',RoleID='"+this.mRoleId+"',AccessType='"+this.mAccessType+"'";
	    },
	    

	    /**
	     * Refreshes the model
	     */
	    refreshRoleDetail: function (data) {
	        if (data && data.RoleID) {
	        	if(this.gRecentRoleId[data.RoleID] === undefined){
	        		this.gRecentRoleId[data.RoleID] = "X";
	        	}
	        	this.getView().setBusy(true);
	        	
	        	var oModel = this.getModel();
	        	oModel.attachRequestCompleted(function(){this.requestCompletedRole(this);}, this);
	        
	        	
	        	this.mRoleId = data.RoleID;
	        	this.mRoleType = data.RoleType;
	        	this.mRoleSystem = data.RoleSystem;
	        	this.mRequestNumber = data.RequestNumber;
	        	this.mValidTo = data.ValidTo;
	        	this.mValidFrom = data.ValidFrom;	        	
	        	this.mAccessType = data.AccessType;
				this.getView().bindElement("/Roles(" + this.getRoleKey() + ")", {expand: "Actions,Risks"});
				this.getView().setBusy(false);
	        }
	    },
	    
		formatValidityDate: function(ValidtyDate, DefaultValue){
			
			var vValidity = this.mValidTo; //ValidtyDate;
			if(vValidity != null && vValidity != "" && typeof vValidity  === "string"){
				vValidity = new Date(this.mValidTo);
			}
			if(vValidity === null || vValidity === ""  || vValidity.getFullYear() === 9999) {
				vValidity = DefaultValue; 
			}else{
				vValidity = vValidity.toUTCString(); // toDateString();
				//vValidity.toUTCString();
			} //if
			
			return vValidity;
		},

		
		formatValidityFromDate: function(ValidtyDate, DefaultValue){
			
			var vValidity = ValidtyDate; //ValidtyDate;
			if(vValidity != null && vValidity != "" && typeof vValidity  === "string"){
				vValidity = new Date(ValidtyDate);
			}
			if(vValidity === null || vValidity === ""  || vValidity.getFullYear() === 9999) {
				vValidity = DefaultValue; 
			}else{
				vValidity = vValidity.toUTCString(); // toDateString();
				//vValidity.toUTCString();
			} //if
			
			return vValidity;
		},
		
		formatAccessType: function(pAccessType){
			if(pAccessType){
			return this.getResBundle().getText("ACCESS_TYPE_TEXT",[pAccessType]);
			}
		}
});
},
	"fcg/grc/accessrequest/approve/view/RoleDetails.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns="sap.m" xmlns:form="sap.ui.layout.form" xmlns:me="sap.me" \n          controllerName="fcg.grc.accessrequest.approve.view.RoleDetails">\n\t<Page id="AccessRequestDetails" enableScrolling="true">\n\t\t<customHeader>\n\t\t\t<Bar id="cartBtnBar">\n               <contentLeft>\n                  <Button\n                     id="backBtn"\n                     type="Back"\n                     press="onBackBtnPressed" ></Button>\n                </contentLeft>\t\t\t\n\t\t\t\t<contentMiddle>\n\t\t\t\t\t<Label text="{i18n>ACCESS_DETAILS_TEXT}"></Label>\n\t\t\t\t</contentMiddle>\n\t\t\t</Bar>\n\t\t</customHeader>\n\t\t<content>\n\t\t\t<ObjectHeader title="{ShortDescription}" id="headerInfo">\t\t\t\t\n\t\t\t\t<attributes>\n\t\t\t\t\t\t<ObjectAttribute text="{path:\'AccessType\', formatter:\'.formatAccessType\'}"></ObjectAttribute>\n\t\t\t\t</attributes>\n\t\t\t\t<statuses>\n\t\t\t\t\t<ObjectStatus id="attStatus" text="" state="Error"></ObjectStatus>\n\t\t\t\t</statuses>\n\t\t\t</ObjectHeader>\n\t\t\t<IconTabBar id="TABCONT_ROLE_INFO">\n\t\t\t\t<items>\n\t\t\t\t\t<IconTabFilter id = "itfRisks" icon="sap-icon://alert" key="Risks" text="{i18n>RISKS_COL_LBL}" count="{RiskCount}" iconColor="Critical" >\n\t\t\t\t\t <content>\n\t\t\t\t\t\t<Table id="riskList" \n\t\t\t\t\t\t\titems="{Risks}" inset="true" growing="true" growingThreshold="10" growingScrollToLoad="false" \n\t\t\t\t\t\t\t visible="true" noDataText="{i18n>NO_ACCESS_RISKS_FOUND_TEXT}">\n\t\t\t\t\t\t\t \n\t\t\t\t\t\t\t<columns>\n\t\t\t\t\t\t\t    <Column hAlign="Left" header="Description"  width="80%" ><header><Label text="{i18n>DESCRIPTION_LBL}" design="Bold"></Label></header></Column>\n\t\t\t\t\t\t\t\t<Column hAlign="Left" header="Level"  width="20%" ><header><Label text="{i18n>LEVEL_LBL}" design="Bold"></Label></header></Column>\n\t\t\t\t\t\t\t</columns>\n\t\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t\t<ColumnListItem press="handleLineItemPress">\n\t\t\t\t\t\t\t\t\t<cells>\n\t\t\t\t\t\t\t\t\t    <Text text="{RiskDesc}"></Text>\n\t\t\t\t\t\t\t\t\t</cells>\n\t\t\t\t\t\t\t\t\t<cells>\n\t\t\t\t\t\t\t\t\t\t<Text text="{LevelName}"></Text>\n\t\t\t\t\t\t\t\t\t</cells>\n\t\t\t\t\t\t\t\t</ColumnListItem>\n\t\t\t\t\t\t\t</items>\n\t\t\t\t\t\t</Table>\n\t\t\t\t\t </content>\n\t\t\t\t\t</IconTabFilter>\n\t\t\t\t\t<IconTabFilter id = "itfActions" icon="sap-icon://menu" key="Actions" text="{i18n>ACTIONS_TEXT}" count="{ActionCount}">\n\t\t\t\t\t <content>\n\t\t\t\t\t\t<Table id="actionList" \n\t\t\t\t\t\t\titems="{Actions}" inset="true" growing="true" growingThreshold="10" growingScrollToLoad="false" \n\t\t\t\t\t\t\t visible="true" noDataText="{i18n>NO_ACTIONS_FOUND_TEXT}">\n\t\t\t\t\t\t\t<columns>\n\t\t\t\t\t\t\t\t<Column hAlign="Left" header="Description"><header><Label text="{i18n>DESCRIPTION_LBL}" design="Bold"></Label></header></Column>\n\t\t\t\t\t\t\t</columns>\n\t\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t\t<ColumnListItem press="handleLineItemPress">\n\t\t\t\t\t\t\t\t\t<cells>\n\t\t\t\t\t\t\t\t\t\t<Text text="{Description}"></Text>\n\t\t\t\t\t\t\t\t\t</cells>\n\t\t\t\t\t\t\t\t</ColumnListItem>\n\t\t\t\t\t\t\t</items>\n\t\t\t\t\t\t</Table>\n\t\t\t\t\t </content>\n\t\t\t\t\t</IconTabFilter>\n\n\t\t\t\t\t<IconTabFilter icon="sap-icon://hint" key="Info" text="{i18n>INFO_LBL}">\n\t\t\t\t\t <content>\n\t\t\t\t\t \n\t\t\t\t\t\t<form:SimpleForm id="INFO_FORM" minWidth="300">\n\t\t\t\t\t\t\t<form:content>\n\t\t\t\t\t\t\t\t<Label id="BusinessProcess_lbl" text="{i18n>BUS_PROC_TEXT}"\n\t\t\t\t\t\t\t\t\tdesign="Bold" visible="false"></Label>\n\t\t\t\t\t\t\t\t<Text id="BusinessProcess_txt" text="{BusinessProcess}"\n\t\t\t\t\t\t\t\t\tvisible="false"></Text>\n\t\t\t\n\t\t\t\t\t\t\t\t<Label id="FunctionalArea_lbl" text="{i18n>FUN_AREA_TEXT}"\n\t\t\t\t\t\t\t\t\tdesign="Bold" visible="false"></Label>\n\t\t\t\t\t\t\t\t<Text id="FunctionalArea_txt" text="{FunctionalArea}"\n\t\t\t\t\t\t\t\t\tvisible="false"></Text>\n\t\t\t\n\t\t\t\t\t\t\t\t<Label id="Company_lbl" text="{i18n>COMPANY_TEXT}" design="Bold"\n\t\t\t\t\t\t\t\t\tvisible="false"></Label>\n\t\t\t\t\t\t\t\t<Text id="Company_txt" text="{Company}" visible="false"></Text>\n\t\t\t\n\t\t\t\t\t\t\t\t<Label id="Prerequisite_lbl" text="{i18n>PRE_REQ_TEXT}"\n\t\t\t\t\t\t\t\t\tdesign="Bold" visible="false"></Label>\n\t\t\t\t\t\t\t\t<Text id="Prerequisite_txt" text="{Prerequisite}" visible="false"></Text>\n\t\t\t\n\t\t\t\t\t\t\t\t<Label id="RoleName_lbl" text="{i18n>ROLE_TECH_TEXT}"\n\t\t\t\t\t\t\t\t\tdesign="Bold" visible="false"></Label>\n\t\t\t\t\t\t\t\t<Text id="RoleName_txt" text="{RoleName}" visible="false"></Text>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<Label id="System_lbl" text="{i18n>SYSTEM_TEXT}"\n\t\t\t\t\t\t\t\t\tdesign="Bold" visible="false"></Label>\n\t\t\t\t\t\t\t\t<Text id="System_txt" text="{System}" visible="false"></Text>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<Label id="ItemType_lbl" text="{i18n>ITEM_TYPE_TEXT}"\n\t\t\t\t\t\t\t\t\tdesign="Bold" visible="false"></Label>\n\t\t\t\t\t\t\t\t<Text id="ItemType_txt" text="{RoleTypeDesc}" visible="false"></Text>\n                                <!-- Valid From Added -->  \n\t\t\t\t\t\t\t\t<Label id="Validityfrom_lbl" text="{i18n>VALIDITY_FROM_TEXT}"\n\t\t\t\t\t\t\t\t\tdesign="Bold" visible="false"></Label>\n\t\t\t\t\t\t\t\t<Text id="Validityfrom_txt" text="{parts:[{path:\'ValidFrom\'},{path:\'i18n>MAX_VALIDITY_TEXT\'}], formatter:\'.formatValidityFromDate\'}" visible="false"></Text>\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<Label id="Validity_lbl" text="{i18n>VALIDITY_TO_TEXT}"\n\t\t\t\t\t\t\t\t\tdesign="Bold" visible="false"></Label>\n\t\t\t\t\t\t\t\t<Text id="Validity_txt" text="{parts:[{path:\'ValidTo\'},{path:\'i18n>MAX_VALIDITY_TEXT\'}], formatter:\'.formatValidityDate\'}" visible="false"></Text>\n\t\t\t\t\t\t\t</form:content>\n\t\t\t\t\t\t</form:SimpleForm>\n\t\t\t\t\t\t\n\t\t\t\t\t\t<Table id="roleDescription" headerText="{i18n>DESCRIPTION_LBL}"\n\t\t\t\t\t\t inset="true" growing="false" visible="false">\n\t\t\t  \t\t\t\t<columns>\n\t\t\t\t\t\t\t\t<Column hAlign="Left" header=""></Column>\n\t\t\t\t\t\t\t</columns>\n\t\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t\t<ColumnListItem>\n\t\t\t\t\t\t\t\t\t<cells>\n\t\t\t\t\t\t\t\t\t\t<Text id="longDescription" text="{LongDescription}" editable="false"></Text>\n\t\t\t\t\t\t\t\t\t</cells>\n\t\t\t\t\t\t\t\t</ColumnListItem>\n\t\t\t\t\t\t\t</items>\n\t\t\t\t\t\t</Table>\n\t\t\t\t\t</content>\n\t\t\t\t\t</IconTabFilter>\n\t\t\t\t</items>\n\t\t\t</IconTabBar>\n\t\t</content>\n\n\t\t<footer>\n\t\t\t<Bar id="detailFooter">\n\t\t\t</Bar>\n\t\t</footer>\n\t</Page>\n</core:View>'
}});
