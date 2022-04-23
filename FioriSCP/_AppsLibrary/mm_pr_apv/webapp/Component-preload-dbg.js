jQuery.sap.registerPreloadedModules({
"name":"ui/s2p/mm/requisition/approve/Component-preload",
"version":"2.0",
"modules":{
	"ui/s2p/mm/requisition/approve/Component.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("ui.s2p.mm.requisition.approve.Component");
//jQuery.sap.require("ui.s2p.mm.requisition.approve.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

// new Component
sap.ca.scfld.md.ComponentBase.extend("ui.s2p.mm.requisition.approve.Component", {

	metadata: sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
		"name": "Purchase Requisition Approve",
		"version": "1.5.31",
		"library": "ui.s2p.mm.requisition.approve",
		"includes": ["css/mmRequisitionApprove.css"],
		"dependencies": {
			"libs": ["sap.m", "sap.me"],
			"components": []
		},
		"config": {
			"resourceBundle": "i18n/i18n.properties",
			"titleResource": "SHELL_TITLE",
			"icon": "sap-icon://Fiori2/F0401",
			"favIcon": "./resources/sap/ca/ui/themes/base/img/favicon/Approve_Purchase_Requisition.ico",
			"homeScreenIconPhone": "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Purchase_Requisitions/57_iPhone_Desktop_Launch.png",
			"homeScreenIconPhone@2": "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Purchase_Requisitions/114_iPhone-Retina_Web_Clip.png",
			"homeScreenIconTablet": "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Purchase_Requisitions/72_iPad_Desktop_Launch.png",
			"homeScreenIconTablet@2": "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Purchase_Requisitions/144_iPad_Retina_Web_Clip.png"
		},

		// Navigation
		masterPageRoutes: {
			"master": {
				"pattern": ":scenarioId:",
				"view": "ui.s2p.mm.requisition.approve.view.S2",
				"viewLevel" : "0"
			}
		},

		detailPageRoutes: {
			"detail": {
				"pattern": "detail/{contextPath}",
				"view": "ui.s2p.mm.requisition.approve.view.S3",
				"viewLevel" : "1"
			},
			"subDetail": {
				"pattern": "ServiceLineDetails/{SAP__Origin}/{WorkitemID}/{PrNumber}/{ItemNumber}/{ServiceLineNumber}",
				"view": "ui.s2p.mm.requisition.approve.view.ItemServiceLine",
				"viewLevel" : "2"
			},
			"Limit": {
				"pattern": "Limit/{SAP__Origin}/{WorkitemID}/{PrNumber}/{ItemNumber}",
				"view": "ui.s2p.mm.requisition.approve.view.Limit",
				"viewLevel" : "2"
			},
			"headerDetail": {
				"pattern": "HeaderDetail/{contextPath}",
				"view": "ui.s2p.mm.requisition.approve.view.S3_header",
				"viewLevel" : "1"
			},
			"itemDetails": {
				"pattern": "ItemDetail/{SAP__Origin}/{WorkitemID}/{PrNumber}/{ItemNumber}",
				"view": "ui.s2p.mm.requisition.approve.view.ItemDetails",
				"viewLevel" : "2"
			},
			"itemServiceLine": {
				"pattern": "ItemServiceLine/{SAP__Origin}/{WorkitemID}/{PrNumber}/{ItemNumber}/{ServiceLineNumber}",
				"view": "ui.s2p.mm.requisition.approve.view.ItemServiceLine",
				"viewLevel" : "3"
			},
			"itemServiceLimit": {
				"pattern": "ItemServiceLimit/{SAP__Origin}/{WorkitemID}/{PrNumber}/{ItemNumber}/{LimitDescription}",
				"view": "ui.s2p.mm.requisition.approve.view.Limit",
				"viewLevel" : "3"
			},
			"noData": {
				"pattern": "noData",
				"view": "empty"
			}
		}
	}),

	/**
	 * Initialize the application
	 *
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent: function() {

		var oViewData = {
			component: this
		},
			oView = sap.ui.view({
				viewName: "ui.s2p.mm.requisition.approve.Main",
				type: sap.ui.core.mvc.ViewType.XML,
				viewData: oViewData
			}),
			sPrefix = oView.getId() + "--",
			oEventBus = sap.ui.getCore().getEventBus();

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
},
	"ui/s2p/mm/requisition/approve/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("ui.s2p.mm.requisition.approve.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("ui.s2p.mm.requisition.approve.Configuration", {

	oServiceParams: {
        serviceList: [
            {
                name: "GBAPP_PRAPPROVAL",
                masterCollection: "WorkflowTaskCollection",
                serviceUrl: "/FioriSCP.uis2pmmrequisitionapprove/sap/opu/odata/sap/GBAPP_PRAPPROVAL/",
                isDefault: true,
                mockedDataSource: "../ui.s2p.mm.requisition.approve/test-resources/model/metadata.xml"
                	}
        ]
    },
    

    config: {
        resourceBundle: "i18n/i18n.properties",
        titleResource: "app.Identity",
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
        return ["WorkitemID"];
    }

});
},
	"ui/s2p/mm/requisition/approve/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("ui.s2p.mm.requisition.approve.Main", {

	onInit : function() {
        jQuery.sap.require("sap.ca.scfld.md.Startup");				
		sap.ca.scfld.md.Startup.init('ui.s2p.mm.requisition.approve', this);
		
		jQuery.sap.require("ui.s2p.mm.requisition.approve.model.config");
		if (ui.s2p.mm.requisition.approve.model.Config.isMock) {
			ui.s2p.mm.requisition.approve.model.Config.setMockResponses();
		}
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
	"ui/s2p/mm/requisition/approve/Main.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View \n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\tcontrollerName="ui.s2p.mm.requisition.approve.Main"\n\tdisplayBlock="true"\n \theight="100%">\n\t<NavContainer\n\t\tid="fioriContent">\n\t</NavContainer>\n</core:View>',
	"ui/s2p/mm/requisition/approve/i18n/i18n.properties":'#<Describe your application/i18n file here; required for translation >\n# __ldi.translation.uuid=90e06060-25e1-11e3-8224-0800200c9a66\n\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=Purchase Requisition\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Purchase Requisition\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=Purchase Requisition\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=Limit\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=Item {0} of {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=Service Line {0} of {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Service Line {0} of {1} - Item {2} of {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Item {0} of {1} - Limit\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=Service Lines\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=Service Lines ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=Account Assignment\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=Subtotal\n\n# XTIT: Header text of Master List\nview.Master.title=Purchase Requisitions ({0})\n\n# XTIT: Application name\napp.Identity=Approve Requisitions\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Approve Requisitions\n\n#XTIT: Shell title \nSHELL_TITLE=Approve Purchase Requisitions\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=Employee Business Card\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=Supplier Business Card\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=Information\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=Information\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=Description\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=Description\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=Attachments\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=Notes\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=No items\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=Items ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=Multiple Assignments\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=Account Assignment\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=Category\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=G/L Account\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=Unknown\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=Objects\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=Cost Centre\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=WBS Element\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=Network\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=Order\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=Sales Order\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=Asset\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=Subcontracting\n\n# XFLD: Components\nview.PurchaseRequisition.components=Components\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=Standard\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=Third-party\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=Consignment\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=Share\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=No service lines\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=No limits\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=Description\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=Price\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=Purchase Requisition\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=Material\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=Service\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=Product\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=Product Details\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=Delivery Date\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=Delivery on\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=and later\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=Address\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=Delivery Address\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=Plant\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=Customer\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=Name\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=Limit\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=Quantity\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=Item Category\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=Supplier Name\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=Limit Value\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=Unlimited\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=Expected Value\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=Service Group\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=Material Group\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=Unit Price\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=per\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=Price per Unit\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=Supplier\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=Forwarded by\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=Substitute for\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=Not Assigned\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=Description\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=Subtotal\n\n# YMSG\ndialog.question.approve=Approve the purchase requisition submitted by {0}?\n\n# YMSG\ndialog.question.reject=Reject the purchase requisition submitted by {0}?\n\n# YMSG\ndialog.success.approve=Purchase requisition was approved \n\n# YMSG\ndialog.success.reject=Purchase requisition was rejected\n\n# YMSG\ndialog.success.forward=Purchase requisition was forwarded to {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Approve\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Reject\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Approval or rejection of this requisition is still in process. You can refresh the list of requisitions manually.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=Profit Center\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Approve\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Reject\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Forward\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Cancel\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=Byte\n\n# YMSG: File Size Unit\nFileSize.Bytes=Bytes\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=File is too large\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder = Add note (optional)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Today\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 day ago\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} days ago\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Loading...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=No items are currently available',
	"ui/s2p/mm/requisition/approve/i18n/i18n_ar.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=\\u0627\\u0644\\u062D\\u062F\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=\\u0628\\u0646\\u062F {0} \\u0644\\u0640 {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=\\u0633\\u0637\\u0631 \\u0627\\u0644\\u062E\\u062F\\u0645\\u0629 {0} \\u0644\\u0640 {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=\\u0633\\u0637\\u0631 \\u0627\\u0644\\u062E\\u062F\\u0645\\u0629 {0} \\u0644\\u0640 {1} - \\u0627\\u0644\\u0628\\u0646\\u062F {2} \\u0644\\u0640 {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=\\u0628\\u0646\\u062F {0} \\u0644\\u0640 {1} - \\u0627\\u0644\\u062D\\u062F\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=\\u0633\\u0637\\u0648\\u0631 \\u0627\\u0644\\u062E\\u062F\\u0645\\u0629\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=\\u0633\\u0637\\u0648\\u0631 \\u0627\\u0644\\u062E\\u062F\\u0645\\u0629 ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=\\u062A\\u0639\\u064A\\u064A\\u0646 \\u0627\\u0644\\u062D\\u0633\\u0627\\u0628\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=\\u0627\\u0644\\u0625\\u062C\\u0645\\u0627\\u0644\\u064A \\u0627\\u0644\\u0641\\u0631\\u0639\\u064A\n\n# XTIT: Header text of Master List\nview.Master.title=\\u0637\\u0644\\u0628\\u0627\\u062A \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621 ({0})\n\n# XTIT: Application name\napp.Identity=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0627\\u0644\\u0637\\u0644\\u0628\\u0627\\u062A\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0627\\u0644\\u0637\\u0644\\u0628\\u0627\\u062A\n\n#XTIT: Shell title \nSHELL_TITLE=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0627\\u0644\\u0637\\u0644\\u0628\\u0627\\u062A\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u0645\\u0648\\u0638\\u0641\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u0645\\u0648\\u0631\\u0651\\u0650\\u062F\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=\\u0645\\u0639\\u0644\\u0648\\u0645\\u0627\\u062A\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=\\u0645\\u0639\\u0644\\u0648\\u0645\\u0627\\u062A\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=\\u0627\\u0644\\u0648\\u0635\\u0641\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=\\u0627\\u0644\\u0648\\u0635\\u0641\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=\\u0627\\u0644\\u0645\\u0631\\u0641\\u0642\\u0627\\u062A\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=\\u0645\\u0644\\u0627\\u062D\\u0638\\u0627\\u062A\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=\\u0628\\u0644\\u0627 \\u0639\\u0646\\u0627\\u0635\\u0631\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=\\u0627\\u0644\\u0628\\u0646\\u0648\\u062F ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=\\u062A\\u0639\\u064A\\u064A\\u0646\\u0627\\u062A \\u0645\\u062A\\u0639\\u062F\\u062F\\u0629\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=\\u062A\\u0639\\u064A\\u064A\\u0646 \\u0627\\u0644\\u062D\\u0633\\u0627\\u0628\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=\\u0627\\u0644\\u0641\\u0626\\u0629\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=\\u062D\\u0633\\u0627\\u0628 \\u0627\\u0644\\u0623\\u0633\\u062A\\u0627\\u0630 \\u0627\\u0644\\u0639\\u0627\\u0645\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=\\u063A\\u064A\\u0631 \\u0645\\u0639\\u0631\\u0648\\u0641\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=\\u0627\\u0644\\u0643\\u0627\\u0626\\u0646\\u0627\\u062A\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=\\u0645\\u0631\\u0643\\u0632 \\u0627\\u0644\\u062A\\u0643\\u0644\\u0641\\u0629\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=\\u0639\\u0646\\u0635\\u0631 \\u0628\\u0646\\u064A\\u0629 \\u062A\\u0646\\u0638\\u064A\\u0645 \\u0627\\u0644\\u0639\\u0645\\u0644\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=\\u0627\\u0644\\u0634\\u0628\\u0643\\u0629\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=\\u0627\\u0644\\u0623\\u0645\\u0631\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=\\u0623\\u0645\\u0631 \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=\\u0627\\u0644\\u0623\\u0635\\u0644\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=\\u062A\\u0639\\u0627\\u0642\\u062F \\u0645\\u0646 \\u0627\\u0644\\u0628\\u0627\\u0637\\u0646\n\n# XFLD: Components\nview.PurchaseRequisition.components=\\u0627\\u0644\\u0645\\u0643\\u0648\\u0646\\u0627\\u062A\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=\\u0642\\u064A\\u0627\\u0633\\u064A\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=\\u0627\\u0644\\u062C\\u0647\\u0629 \\u0627\\u0644\\u062E\\u0627\\u0631\\u062C\\u064A\\u0629\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=\\u0625\\u064A\\u062F\\u0627\\u0639\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=\\u0645\\u0634\\u0627\\u0631\\u0643\\u0629\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=\\u0628\\u062F\\u0648\\u0646 \\u0633\\u0637\\u0648\\u0631 \\u062E\\u062F\\u0645\\u0629\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=\\u0628\\u062F\\u0648\\u0646 \\u062D\\u062F\\u0648\\u062F\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=\\u0627\\u0644\\u0648\\u0635\\u0641\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=\\u0627\\u0644\\u0633\\u0639\\u0631\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=\\u0627\\u0644\\u0645\\u0627\\u062F\\u0629\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=\\u0627\\u0644\\u062E\\u062F\\u0645\\u0629\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=\\u0627\\u0644\\u0645\\u0646\\u062A\\u062C\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u0645\\u0646\\u062A\\u062C\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u062A\\u0633\\u0644\\u064A\\u0645\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u062A\\u0633\\u0644\\u064A\\u0645\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=\\u0648\\u0645\\u0627 \\u064A\\u0644\\u064A\\u0647\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=\\u0627\\u0644\\u0639\\u0646\\u0648\\u0627\\u0646\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0627\\u0644\\u062A\\u0633\\u0644\\u064A\\u0645\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=\\u0627\\u0644\\u0648\\u062D\\u062F\\u0629\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=\\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=\\u0627\\u0644\\u0627\\u0633\\u0645\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=\\u0627\\u0644\\u062D\\u062F\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=\\u0627\\u0644\\u0643\\u0645\\u064A\\u0629\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=\\u0641\\u0626\\u0629 \\u0627\\u0644\\u0639\\u0646\\u0635\\u0631\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0645\\u0648\\u0631\\u0651\\u0650\\u062F\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=\\u0642\\u064A\\u0645\\u0629 \\u0627\\u0644\\u062D\\u062F\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=\\u063A\\u064A\\u0631 \\u0645\\u062D\\u062F\\u0648\\u062F\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=\\u0627\\u0644\\u0642\\u064A\\u0645\\u0629 \\u0627\\u0644\\u0645\\u062A\\u0648\\u0642\\u0639\\u0629\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=\\u0645\\u062C\\u0645\\u0648\\u0639\\u0629 \\u0627\\u0644\\u062E\\u062F\\u0645\\u0627\\u062A\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=\\u0645\\u062C\\u0645\\u0648\\u0639\\u0629 \\u0627\\u0644\\u0645\\u0648\\u0627\\u062F\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=\\u0633\\u0639\\u0631 \\u0627\\u0644\\u0648\\u062D\\u062F\\u0629\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=\\u0644\\u0643\\u0644\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=\\u0633\\u0639\\u0631 \\u0643\\u0644 \\u0648\\u062D\\u062F\\u0629\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=\\u0627\\u0644\\u0645\\u0632\\u0648\\u0651\\u0650\\u062F\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=\\u062A\\u0645\\u062A \\u0625\\u0639\\u0627\\u062F\\u0629 \\u0627\\u0644\\u062A\\u0648\\u062C\\u064A\\u0647 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=\\u0628\\u062F\\u064A\\u0644\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=\\u063A\\u064A\\u0631 \\u0645\\u0639\\u064A\\u0651\\u064E\\u0646\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=\\u0627\\u0644\\u0648\\u0635\\u0641\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=\\u0627\\u0644\\u0625\\u062C\\u0645\\u0627\\u0644\\u064A \\u0627\\u0644\\u0641\\u0631\\u0639\\u064A\n\n# YMSG\ndialog.question.approve=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621 \\u0627\\u0644\\u0645\\u0642\\u062F\\u0651\\u064E\\u0645 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 {0}\\u061F\n\n# YMSG\ndialog.question.reject=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0631\\u0641\\u0636 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621 \\u0627\\u0644\\u0645\\u0642\\u062F\\u0651\\u064E\\u0645 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 {0}?\n\n# YMSG\ndialog.success.approve=\\u062A\\u0645 \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621\n\n# YMSG\ndialog.success.reject=\\u062A\\u0645 \\u0631\\u0641\\u0636 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621\n\n# YMSG\ndialog.success.forward=\\u062A\\u0645\\u062A \\u0625\\u0639\\u0627\\u062F\\u0629 \\u062A\\u0648\\u062C\\u064A\\u0647 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621 \\u0625\\u0644\\u0649 {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=\\u0631\\u0641\\u0636\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=\\u0644\\u0627 \\u064A\\u0632\\u0627\\u0644 \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0623\\u0648 \\u0631\\u0641\\u0636 \\u0647\\u0630\\u0627 \\u0627\\u0644\\u0637\\u0644\\u0628 \\u0642\\u064A\\u062F \\u0627\\u0644\\u0645\\u0639\\u0627\\u0644\\u062C\\u0629. \\u064A\\u0645\\u0643\\u0646\\u0643 \\u062A\\u062D\\u062F\\u064A\\u062B \\u0642\\u0627\\u0626\\u0645\\u0629 \\u0627\\u0644\\u0637\\u0644\\u0628\\u0627\\u062A \\u064A\\u062F\\u0648\\u064A\\u064B\\u0627.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=\\u0645\\u0631\\u0643\\u0632 \\u0627\\u0644\\u0631\\u0628\\u062D\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=\\u0645\\u0648\\u0627\\u0641\\u0642\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F\n\n#XBUT: Button for Reject action\nXBUT_REJECT=\\u0631\\u0641\\u0636\n\n#XBUT: Button for forward action\nXBUT_FORWARD=\\u0625\\u0639\\u0627\\u062F\\u0629 \\u0627\\u0644\\u062A\\u0648\\u062C\\u064A\\u0647\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=\\u0628\\u0627\\u064A\\u062A\n\n# YMSG: File Size Unit\nFileSize.Bytes=\\u0628\\u0627\\u064A\\u062A\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=\\u0643\\u064A\\u0644\\u0648\\u0628\\u0627\\u064A\\u062A\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=\\u0645\\u064A\\u062C\\u0627\\u0628\\u0627\\u064A\\u062A\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=\\u062C\\u064A\\u062C\\u0627\\u0628\\u0627\\u064A\\u062A\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=\\u062A\\u064A\\u0631\\u0627\\u0628\\u0627\\u064A\\u062A\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=\\u0628\\u064A\\u062A\\u0627\\u0628\\u0627\\u064A\\u062A\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=\\u0625\\u0643\\u0633\\u0627\\u0628\\u0627\\u064A\\u062A\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=\\u0632\\u064A\\u062A\\u0627\\u0628\\u0627\\u064A\\u062A\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=\\u064A\\u0648\\u062A\\u0627\\u0628\\u0627\\u064A\\u062A\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=\\u0627\\u0644\\u0645\\u0644\\u0641 \\u0643\\u0628\\u064A\\u0631 \\u062C\\u062F\\u064B\\u0627\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0645\\u0644\\u0627\\u062D\\u0638\\u0629 (\\u0627\\u062E\\u062A\\u064A\\u0627\\u0631\\u064A)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=\\u0627\\u0644\\u064A\\u0648\\u0645\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=\\u0645\\u0646\\u0630 \\u064A\\u0648\\u0645\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=\\u0645\\u0646\\u0630 {0} \\u064A\\u0648\\u0645 (\\u0623\\u064A\\u0627\\u0645)\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u062A\\u062D\\u0645\\u064A\\u0644...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0623\\u064A\\u0629 \\u0639\\u0646\\u0627\\u0635\\u0631 \\u062D\\u0627\\u0644\\u064A\\u064B\\u0627\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_bg.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=\\u0413\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=\\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F {0} \\u043E\\u0442 {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=\\u0420\\u0435\\u0434 \\u043D\\u0430 \\u0443\\u0441\\u043B\\u0443\\u0433\\u0430 {0} \\u043E\\u0442 {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=\\u0420\\u0435\\u0434 \\u0443\\u0441\\u043B\\u0443\\u0433\\u0430 {0} \\u043E\\u0442 {1} - \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F {2} \\u043E\\u0442 {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=\\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F {0} \\u043E\\u0442 {1} - \\u043B\\u0438\\u043C\\u0438\\u0442\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=\\u0420\\u0435\\u0434\\u043E\\u0432\\u0435 \\u0443\\u0441\\u043B\\u0443\\u0433\\u0438\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=\\u0420\\u0435\\u0434\\u043E\\u0432\\u0435 \\u0443\\u0441\\u043B\\u0443\\u0433\\u0430 ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=\\u041F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u043C\\u0435\\u0442\\u043A\\u0430\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=\\u041C\\u0435\\u0436\\u0434\\u0438\\u043D\\u043D\\u0430 \\u0441\\u0443\\u043C\\u0430\n\n# XTIT: Header text of Master List\nview.Master.title=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0438 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430 ({0})\n\n# XTIT: Application name\napp.Identity=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0438\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0438\n\n#XTIT: Shell title \nSHELL_TITLE=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0438\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u0437\\u0430 \\u0441\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u0437\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u0447\\u0438\\u043A\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=\\u0418\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=\\u0418\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=\\u0411\\u0435\\u043B\\u0435\\u0436\\u043A\\u0438\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=\\u041D\\u044F\\u043C\\u0430 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0438\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=\\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0438 ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=\\u041C\\u043D\\u043E\\u0433\\u043E\\u043A\\u0440\\u0430\\u0442\\u043D\\u0438 \\u043F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u044F\\u0432\\u0430\\u043D\\u0438\\u044F\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=\\u041F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u043C\\u0435\\u0442\\u043A\\u0430\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=\\u041A\\u0430\\u0442\\u0435\\u0433\\u043E\\u0440\\u0438\\u044F\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=\\u0421\\u043C\\u0435\\u0442\\u043A\\u0430 \\u043E\\u0442 \\u0413\\u043B\\u0430\\u0432\\u043D\\u0430 \\u043A\\u043D\\u0438\\u0433\\u0430\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=\\u041D\\u0435\\u0438\\u0437\\u0432\\u0435\\u0441\\u0442\\u0435\\u043D\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=\\u041E\\u0431\\u0435\\u043A\\u0442\\u0438\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=\\u0420\\u0430\\u0437\\u0445\\u043E\\u0434\\u0435\\u043D \\u0446\\u0435\\u043D\\u0442\\u044A\\u0440\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=\\u0421\\u041F\\u041F \\u0435\\u043B\\u0435\\u043C\\u0435\\u043D\\u0442\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=\\u041C\\u0440\\u0435\\u0436\\u0430\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=\\u041F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0430\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0441\\u043A\\u0430 \\u043F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0430\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=\\u0410\\u043A\\u0442\\u0438\\u0432\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=\\u041F\\u043E\\u0434\\u0438\\u0437\\u043F\\u044A\\u043B\\u043D\\u0435\\u043D\\u0438\\u0435\n\n# XFLD: Components\nview.PurchaseRequisition.components=\\u041A\\u043E\\u043C\\u043F\\u043E\\u043D\\u0435\\u043D\\u0442\\u0438\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=\\u0421\\u0442\\u0430\\u043D\\u0434\\u0430\\u0440\\u0442\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=\\u0422\\u0440\\u0435\\u0442\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0430\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=\\u041A\\u043E\\u043D\\u0441\\u0438\\u0433\\u043D\\u0430\\u0446\\u0438\\u044F\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=\\u0421\\u043F\\u043E\\u0434\\u0435\\u043B\\u044F\\u043D\\u0435\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=\\u041D\\u044F\\u043C\\u0430 \\u0440\\u0435\\u0434\\u043E\\u0432\\u0435 \\u0443\\u0441\\u043B\\u0443\\u0433\\u0438\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=\\u041D\\u044F\\u043C\\u0430 \\u043E\\u0433\\u0440\\u0430\\u043D\\u0438\\u0447\\u0435\\u043D\\u0438\\u044F\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=\\u0426\\u0435\\u043D\\u0430\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=\\u041C\\u0430\\u0442\\u0435\\u0440\\u0438\\u0430\\u043B\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=\\u0423\\u0441\\u043B\\u0443\\u0433\\u0430\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=\\u041F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u0437\\u0430 \\u043F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=\\u0414\\u0430\\u0442\\u0430 \\u043D\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=\\u0414\\u043E\\u0441\\u0442\\u0430\\u0432\\u0435\\u043D\\u043E \\u043D\\u0430\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=\\u0438 \\u043F\\u043E-\\u043A\\u044A\\u0441\\u043D\\u043E\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=\\u0410\\u0434\\u0440\\u0435\\u0441\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=\\u0410\\u0434\\u0440\\u0435\\u0441 \\u0437\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=\\u0417\\u0430\\u0432\\u043E\\u0434\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=\\u0418\\u043C\\u0435\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=\\u0413\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=\\u041A\\u043E\\u043B\\u0438\\u0447\\u0435\\u0441\\u0442\\u0432\\u043E\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=\\u041A\\u0430\\u0442\\u0435\\u0433\\u043E\\u0440\\u0438\\u044F \\u043D\\u0430 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=\\u0418\\u043C\\u0435 \\u043D\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u0447\\u0438\\u043A\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=\\u041F\\u0440\\u0435\\u0434\\u0435\\u043B\\u043D\\u0430 \\u0441\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=\\u041D\\u0435\\u043E\\u0433\\u0440\\u0430\\u043D\\u0438\\u0447\\u0435\\u043D\\u043E\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=\\u041E\\u0447\\u0430\\u043A\\u0432\\u0430\\u043D\\u0430 \\u0441\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=\\u0413\\u0440\\u0443\\u043F\\u0430 \\u0443\\u0441\\u043B\\u0443\\u0433\\u0438\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=\\u0413\\u0440\\u0443\\u043F\\u0430 \\u043C\\u0430\\u0442\\u0435\\u0440\\u0438\\u0430\\u043B\\u0438\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=\\u0415\\u0434\\u0438\\u043D\\u0438\\u0447\\u043D\\u0430 \\u0446\\u0435\\u043D\\u0430\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=\\u0437\\u0430\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=\\u0426\\u0435\\u043D\\u0430 \\u0437\\u0430 \\u0435\\u0434\\u0438\\u043D\\u0438\\u0446\\u0430\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=\\u0414\\u043E\\u0441\\u0442\\u0430\\u0432\\u0447\\u0438\\u043A\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=\\u041F\\u0440\\u0435\\u043F\\u0440\\u0430\\u0442\\u0435\\u043D\\u043E \\u043E\\u0442\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=\\u0417\\u0430\\u043C\\u0435\\u0441\\u0442\\u043D\\u0438\\u043A \\u0437\\u0430\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=\\u041D\\u0435\\u043F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u0435\\u043D\\u0438\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=\\u041C\\u0435\\u0436\\u0434\\u0438\\u043D\\u043D\\u0430 \\u0441\\u0443\\u043C\\u0430\n\n# YMSG\ndialog.question.approve=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u043D\\u0435 \\u0434\\u043E\\u0433\\u043E\\u0432\\u043E\\u0440 \\u0437\\u0430\\u043A\\u0443\\u043F\\u0443\\u0432\\u0430\\u043D\\u0435 \\u043F\\u043E\\u0434\\u0430\\u0434\\u0435\\u043D \\u043E\\u0442 {0}?\n\n# YMSG\ndialog.question.reject=\\u041E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u044F\\u043D\\u0435 \\u0434\\u043E\\u0433\\u043E\\u0432\\u043E\\u0440 \\u0437\\u0430\\u043A\\u0443\\u043F\\u0443\\u0432\\u0430\\u043D\\u0435 \\u043F\\u043E\\u0434\\u0430\\u0434\\u0435\\u043D \\u043E\\u0442 {0}?\n\n# YMSG\ndialog.success.approve=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430\\u0442\\u0430 \\u0437\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430 \\u0435 \\u043E\\u0434\\u043E\\u0431\\u0440\\u0435\\u043D\\u0430\n\n# YMSG\ndialog.success.reject=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430\\u0442\\u0430 \\u0437\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430 \\u0435 \\u043E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u0435\\u043D\\u0430\n\n# YMSG\ndialog.success.forward=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430 \\u0435 \\u043F\\u0440\\u0435\\u0430\\u0434\\u0440\\u0435\\u0441\\u0438\\u0440\\u0430\\u043D\\u0430 \\u043A\\u044A\\u043C {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u043D\\u0435\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=\\u041E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u044F\\u043D\\u0435\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u043D\\u0435\\u0442\\u043E \\u0438\\u043B\\u0438 \\u043E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u044F\\u043D\\u0435\\u0442\\u043E \\u043D\\u0430 \\u0442\\u0430\\u0437\\u0438 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0432\\u0441\\u0435 \\u043E\\u0449\\u0435 \\u0441\\u0435 \\u043E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u0432\\u0430\\u0442. \\u041C\\u043E\\u0436\\u0435\\u0442\\u0435 \\u0440\\u044A\\u0447\\u043D\\u043E \\u0434\\u0430 \\u043E\\u043F\\u0440\\u0435\\u0441\\u043D\\u0438\\u0442\\u0435 \\u0441\\u043F\\u0438\\u0441\\u044A\\u043A\\u0430 \\u0441\\u044A\\u0441 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0438.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=\\u041F\\u0440\\u0438\\u0445\\u043E\\u0434\\u0435\\u043D \\u0446\\u0435\\u043D\\u0442\\u044A\\u0440\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u043D\\u0435\n\n#XBUT: Button for Reject action\nXBUT_REJECT=\\u041E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u044F\\u043D\\u0435\n\n#XBUT: Button for forward action\nXBUT_FORWARD=\\u041F\\u0440\\u0435\\u043F\\u0440\\u0430\\u0449\\u0430\\u043D\\u0435\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=\\u041E\\u0442\\u043A\\u0430\\u0437\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=\\u0411\\u0430\\u0439\\u0442\n\n# YMSG: File Size Unit\nFileSize.Bytes=\\u0411\\u0430\\u0439\\u0442\\u043E\\u0432\\u0435\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=\\u0424\\u0430\\u0439\\u043B\\u044A\\u0442 \\u0435 \\u0442\\u0432\\u044A\\u0440\\u0434\\u0435 \\u0433\\u043E\\u043B\\u044F\\u043C\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430 (\\u043D\\u0435\\u0437\\u0430\\u0434\\u044A\\u043B\\u0436\\u0438\\u0442\\u0435\\u043B\\u043D\\u043E)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=\\u0414\\u043D\\u0435\\u0441\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=\\u041F\\u0440\\u0435\\u0434\\u0438 1 \\u0434\\u0435\\u043D\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=\\u043F\\u0440\\u0435\\u0434\\u0438 {0} \\u0434\\u043D\\u0438\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=\\u0417\\u0430\\u0440\\u0435\\u0436\\u0434\\u0430\\u043D\\u0435...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u0412 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442\\u0430 \\u043D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0438\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_cs.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=Po\\u017Eadavek na objedn\\u00E1vku\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Po\\u017Eadavek na objedn\\u00E1vku\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=Po\\u017Eadavek na objedn\\u00E1vku\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=Limit\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=Polo\\u017Eka {0} z {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=\\u0158\\u00E1dka slu\\u017Eby {0} z {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Servisn\\u00ED polo\\u017Eka {0} z {1} \\u2013 Polo\\u017Eka {2} z {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Polo\\u017Eka {0} z {1} \\u2013 Limit\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=\\u0158\\u00E1dky slu\\u017Eeb\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=\\u0158\\u00E1dky v\\u00FDkon\\u016F slu\\u017Eeb ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=P\\u0159i\\u0159azen\\u00ED \\u00FA\\u010Dtu\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=Mezisou\\u010Det\n\n# XTIT: Header text of Master List\nview.Master.title=Po\\u017Eadavky na objedn\\u00E1vku ({0})\n\n# XTIT: Application name\napp.Identity=Schvalov\\u00E1n\\u00ED po\\u017Eadavk\\u016F na objedn\\u00E1vku\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Schvalov\\u00E1n\\u00ED po\\u017Eadavk\\u016F na objedn\\u00E1vku\n\n#XTIT: Shell title \nSHELL_TITLE=Schvalov\\u00E1n\\u00ED po\\u017Eadavk\\u016F na objedn\\u00E1vku\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=Detaily zam\\u011Bstnance\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=Detaily dodavatele\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=Informace\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=Informace\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=Popis\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=Popis\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=P\\u0159\\u00EDlohy\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=Pozn\\u00E1mky\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=\\u017D\\u00E1dn\\u00E9 polo\\u017Eky\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=Polo\\u017Eky ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=V\\u00EDce p\\u0159i\\u0159azen\\u00ED\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=P\\u0159i\\u0159azen\\u00ED \\u00FA\\u010Dtu\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=Kategorie\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=\\u00DA\\u010Det hlavn\\u00ED knihy\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=Nezn\\u00E1m.\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=Objekty\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=N\\u00E1kladov\\u00E9 st\\u0159edisko\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=Prvek SPP\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=S\\u00ED\\u0165\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=Zak\\u00E1zka\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=Zak\\u00E1zka odb\\u011Bratele\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=Majetek\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=Subdod\\u00E1vka\n\n# XFLD: Components\nview.PurchaseRequisition.components=Komponenty\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=Standardn\\u00ED\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=T\\u0159et\\u00ED strana\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=Konsignace\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=Pod\\u00EDl\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=\\u017D\\u00E1dn\\u00E9 \\u0159\\u00E1dky slu\\u017Eeb\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=\\u017D\\u00E1dn\\u00E9 limity\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=Popis\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=Cena\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=Po\\u017Eadavek na objedn\\u00E1vku\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=Materi\\u00E1l\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=Slu\\u017Eba\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=Produkt\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=Detaily produktu\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=Datum dod\\u00E1vky\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=Datum dod\\u00E1n\\u00ED\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=a pozd\\u011Bji\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=Adresa\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=Dodac\\u00ED adresa\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=Z\\u00E1vod\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=Z\\u00E1kazn\\u00EDk\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=Jm\\u00E9no\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=Limit\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=Mno\\u017Estv\\u00ED\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=Kategorie polo\\u017Eky\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=Jm\\u00E9no dodavatele\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=Limit \\u2013 hodnota\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=Neomezen\\u011B\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=O\\u010Dek\\u00E1van\\u00E1 hodnota\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=Skupina slu\\u017Eeb\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=Skupina materi\\u00E1l\\u016F\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=Jednotkov\\u00E1 cena\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=za\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=Cena za jednotku\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=Dodavatel\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=P\\u0159edal\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=Z\\u00E1stup za\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=Nep\\u0159i\\u0159azeno\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=Popis\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=Mezisou\\u010Det\n\n# YMSG\ndialog.question.approve=Schv\\u00E1lit po\\u017Eadavek na objedn\\u00E1vku, kter\\u00FD podal(a) {0}?\n\n# YMSG\ndialog.question.reject=Zam\\u00EDtnout po\\u017Eadavek na objedn\\u00E1vku, kter\\u00FD podal(a) {0}?\n\n# YMSG\ndialog.success.approve=Po\\u017Eadavek na objedn\\u00E1vku byl schv\\u00E1len\n\n# YMSG\ndialog.success.reject=Po\\u017Eadavek na objedn\\u00E1vku byl zam\\u00EDtnut\n\n# YMSG\ndialog.success.forward=Po\\u017Eadavek na objedn\\u00E1vku byl p\\u0159ed\\u00E1n\\: {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Schv\\u00E1lit\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Odm\\u00EDtnout\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Schv\\u00E1len\\u00ED nebo zam\\u00EDtnut\\u00ED tohoto po\\u017Eadavku st\\u00E1le prob\\u00EDh\\u00E1. Seznam po\\u017Eadavk\\u016F m\\u016F\\u017Eete aktualizovat manu\\u00E1ln\\u011B.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=Profit centrum\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Schv\\u00E1lit\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Odm\\u00EDtnout\n\n#XBUT: Button for forward action\nXBUT_FORWARD=P\\u0159edat\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Zru\\u0161it\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=Bajt\n\n# YMSG: File Size Unit\nFileSize.Bytes=Bajty\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Soubor je p\\u0159\\u00EDli\\u0161 velk\\u00FD\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=P\\u0159idat pozn\\u00E1mku (voliteln\\u00E9)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Dnes\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=P\\u0159ed 1 dnem\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=P\\u0159ed {0} dny\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Zav\\u00E1d\\u00ED se...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=V sou\\u010Dasn\\u00E9 dob\\u011B nejsou k dispozici \\u017E\\u00E1dn\\u00E9 polo\\u017Eky\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_de.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=Bestellanforderung\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Bestellanforderung\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=Bestellanforderung\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=Limit\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=Position {0} von {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=Leistungszeile {0} von {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Leistungszeile {0} von {1} - Position {2} von {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Position {0} von {1} - Limit\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=Leistungszeilen\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=Leistungszeilen ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=Kontierung\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=Zwischensumme\n\n# XTIT: Header text of Master List\nview.Master.title=Bestellanforderungen ({0})\n\n# XTIT: Application name\napp.Identity=Bestellanforderungen genehmigen\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Bestellanforderungen genehmigen\n\n#XTIT: Shell title \nSHELL_TITLE=Bestellanforderungen genehmigen\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=Mitarbeiterdetails\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=Lieferantendetails\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=Details\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=Details\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=Beschreibung\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=Beschreibung\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=Anlagen\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=Notizen\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=Keine Positionen\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=Positionen ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=Mehrfachkontierungen\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=Kontierung\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=Typ\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=Sachkonto\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=Unbekannt\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=Objekte\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=Kostenstelle\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=PSP-Element\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=Netzplan\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=Auftrag\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=Kundenauftrag\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=Anlage\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=Lohnbearbeitung\n\n# XFLD: Components\nview.PurchaseRequisition.components=Komponenten\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=Normal\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=Strecke\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=Konsignation\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=Anteil\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=Keine Leistungszeilen vorhanden\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=Keine Limits\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=Beschreibung\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=Preis\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=Bestellanforderung\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=Material\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=Leistung\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=Produkt\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=Produktdetails\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=Lieferdatum\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=Lieferung am\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=und sp\\u00E4ter\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=Adresse\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=Lieferadresse\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=Werk\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=Kunde\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=Name\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=Limit\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=Menge\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=Positionstyp\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=Lieferantenname\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=Limitwert\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=Unbegrenzt\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=Erwarteter Wert\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=Leistungsgruppe\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=Warengruppe\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=St\\u00FCckpreis\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=pro\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=St\\u00FCckpreis\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=Lieferant\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=Weitergeleitet von\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=Vertreter f\\u00FCr\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=Nicht zugeordnet\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=Beschreibung\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=Zwischensumme\n\n# YMSG\ndialog.question.approve=Bestellanforderung von {0} genehmigen?\n\n# YMSG\ndialog.question.reject=Bestellanforderung von {0} ablehnen?\n\n# YMSG\ndialog.success.approve=Bestellanforderung genehmigt\n\n# YMSG\ndialog.success.reject=Bestellanforderung abgelehnt\n\n# YMSG\ndialog.success.forward=Bestellanforderung an {0} weitergeleitet\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Genehmigen\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Ablehnen\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Die Genehmigung oder Ablehnung dieser Bestellanforderung wird noch verarbeitet. Sie k\\u00F6nnen die Liste der Anforderungen manuell aktualisieren.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=Profitcenter\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Genehmigen\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Ablehnen\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Weiterleiten\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Abbrechen\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=Byte\n\n# YMSG: File Size Unit\nFileSize.Bytes=Byte\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=KB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Datei ist zu gro\\u00DF\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Notiz hinzuf\\u00FCgen (optional)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Heute\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=Gestern\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=Vor {0} Tagen\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Laden...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Keine Positionen verf\\u00FCgbar\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_en.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=Purchase Requisition\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Purchase Requisition\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=Purchase Requisition\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=Limit\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=Item {0} of {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=Service Line {0} of {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Service Line {0} of {1} - Item {2} of {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Item {0} of {1} - Limit\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=Service Lines\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=Service Lines ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=Account Assignment\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=Subtotal\n\n# XTIT: Header text of Master List\nview.Master.title=Purchase Requisitions ({0})\n\n# XTIT: Application name\napp.Identity=Approve Requisitions\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Approve Requisitions\n\n#XTIT: Shell title \nSHELL_TITLE=Approve Requisitions\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=Employee Details\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=Supplier Details\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=Information\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=Information\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=Description\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=Description\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=Attachments\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=Notes\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=No items\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=Items ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=Multiple Assignments\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=Account Assignment\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=Category\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=G/L Account\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=Unknown\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=Objects\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=Cost Center\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=WBS Element\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=Network\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=Order\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=Sales Order\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=Asset\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=Subcontracting\n\n# XFLD: Components\nview.PurchaseRequisition.components=Components\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=Standard\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=Third-party\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=Consignment\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=Share\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=No service lines\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=No limits\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=Description\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=Price\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=Purchase Requisition\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=Material\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=Service\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=Product\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=Product Details\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=Delivery Date\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=Delivery on\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=and later\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=Address\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=Delivery Address\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=Plant\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=Customer\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=Name\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=Limit\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=Quantity\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=Item Category\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=Supplier Name\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=Limit Value\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=Unlimited\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=Expected Value\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=Service Group\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=Material Group\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=Unit Price\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=per\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=Price per Unit\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=Supplier\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=Forwarded by\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=Substitute for\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=Not Assigned\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=Description\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=Subtotal\n\n# YMSG\ndialog.question.approve=Approve the purchase requisition submitted by {0}?\n\n# YMSG\ndialog.question.reject=Reject the purchase requisition submitted by {0}?\n\n# YMSG\ndialog.success.approve=Purchase requisition was approved\n\n# YMSG\ndialog.success.reject=Purchase requisition was rejected\n\n# YMSG\ndialog.success.forward=Purchase requisition was forwarded to {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Approve\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Reject\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Approval or rejection of this requisition is still in process. You can refresh the list of requisitions manually.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=Profit Center\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Approve\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Reject\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Forward\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Cancel\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=Byte\n\n# YMSG: File Size Unit\nFileSize.Bytes=Bytes\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=File is too large\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Add note (optional)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Today\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 day ago\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} days ago\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Loading...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=No items are currently available\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_en_US_sappsd.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=[[[\\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u012F\\u015F\\u012F\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=[[[\\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u012F\\u015F\\u012F\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=[[[\\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u012F\\u015F\\u012F\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219]]]\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=[[[\\u013B\\u012F\\u0271\\u012F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=[[[\\u012C\\u0163\\u0113\\u0271 {0} \\u014F\\u0192 {1}]]]\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=[[[\\u015C\\u0113\\u0157\\u028B\\u012F\\u010B\\u0113 \\u013B\\u012F\\u014B\\u0113 {0} \\u014F\\u0192 {1}]]]\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=[[[\\u015C\\u0113\\u0157\\u028B\\u012F\\u010B\\u0113 \\u013B\\u012F\\u014B\\u0113 {0} \\u014F\\u0192 {1} - \\u012C\\u0163\\u0113\\u0271 {2} \\u014F\\u0192 {3}]]]\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=[[[\\u012C\\u0163\\u0113\\u0271 {0} \\u014F\\u0192 {1} - \\u013B\\u012F\\u0271\\u012F\\u0163]]]\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=[[[\\u015C\\u0113\\u0157\\u028B\\u012F\\u010B\\u0113 \\u013B\\u012F\\u014B\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=[[[\\u015C\\u0113\\u0157\\u028B\\u012F\\u010B\\u0113 \\u013B\\u012F\\u014B\\u0113\\u015F ({0})]]]\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163 \\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u0271\\u0113\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=[[[\\u015C\\u0171\\u0183\\u0163\\u014F\\u0163\\u0105\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XTIT: Header text of Master List\nview.Master.title=[[[\\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u012F\\u015F\\u012F\\u0163\\u012F\\u014F\\u014B\\u015F ({0})]]]\n\n# XTIT: Application name\napp.Identity=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u012F\\u015F\\u012F\\u0163\\u012F\\u014F\\u014B\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u012F\\u015F\\u012F\\u0163\\u012F\\u014F\\u014B\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Shell title \nSHELL_TITLE=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113 \\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u012F\\u015F\\u012F\\u0163\\u012F\\u014F\\u014B\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u0181\\u0171\\u015F\\u012F\\u014B\\u0113\\u015F\\u015F \\u0108\\u0105\\u0157\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=[[[\\u015C\\u0171\\u03C1\\u03C1\\u013A\\u012F\\u0113\\u0157 \\u0181\\u0171\\u015F\\u012F\\u014B\\u0113\\u015F\\u015F \\u0108\\u0105\\u0157\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=[[[\\u012C\\u014B\\u0192\\u014F\\u0157\\u0271\\u0105\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=[[[\\u012C\\u014B\\u0192\\u014F\\u0157\\u0271\\u0105\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=[[[\\u010E\\u0113\\u015F\\u010B\\u0157\\u012F\\u03C1\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=[[[\\u010E\\u0113\\u015F\\u010B\\u0157\\u012F\\u03C1\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=[[[\\u0100\\u0163\\u0163\\u0105\\u010B\\u0125\\u0271\\u0113\\u014B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=[[[\\u0143\\u014F\\u0163\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=[[[\\u0143\\u014F \\u012F\\u0163\\u0113\\u0271\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=[[[\\u012C\\u0163\\u0113\\u0271\\u015F ({0})]]]\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=[[[\\u039C\\u0171\\u013A\\u0163\\u012F\\u03C1\\u013A\\u0113 \\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u0271\\u0113\\u014B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163 \\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u0271\\u0113\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=[[[\\u0108\\u0105\\u0163\\u0113\\u011F\\u014F\\u0157\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=[[[\\u0122/\\u013B \\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=[[[\\u016E\\u014B\\u0137\\u014B\\u014F\\u0175\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=[[[\\u014E\\u0183\\u0135\\u0113\\u010B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=[[[\\u0108\\u014F\\u015F\\u0163 \\u0108\\u0113\\u014B\\u0163\\u0157\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=[[[\\u0174\\u0181\\u015C \\u0114\\u013A\\u0113\\u0271\\u0113\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=[[[\\u0143\\u0113\\u0163\\u0175\\u014F\\u0157\\u0137\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=[[[\\u014E\\u0157\\u018C\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=[[[\\u015C\\u0105\\u013A\\u0113\\u015F \\u014E\\u0157\\u018C\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=[[[\\u0100\\u015F\\u015F\\u0113\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=[[[\\u015C\\u0171\\u0183\\u010B\\u014F\\u014B\\u0163\\u0157\\u0105\\u010B\\u0163\\u012F\\u014B\\u011F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Components\nview.PurchaseRequisition.components=[[[\\u0108\\u014F\\u0271\\u03C1\\u014F\\u014B\\u0113\\u014B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=[[[\\u015C\\u0163\\u0105\\u014B\\u018C\\u0105\\u0157\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=[[[\\u0162\\u0125\\u012F\\u0157\\u018C-\\u03C1\\u0105\\u0157\\u0163\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=[[[\\u0108\\u014F\\u014B\\u015F\\u012F\\u011F\\u014B\\u0271\\u0113\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=[[[\\u015C\\u0125\\u0105\\u0157\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=[[[\\u0143\\u014F \\u015F\\u0113\\u0157\\u028B\\u012F\\u010B\\u0113 \\u013A\\u012F\\u014B\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=[[[\\u0143\\u014F \\u013A\\u012F\\u0271\\u012F\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=[[[\\u010E\\u0113\\u015F\\u010B\\u0157\\u012F\\u03C1\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=[[[\\u01A4\\u0157\\u012F\\u010B\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=[[[\\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u012F\\u015F\\u012F\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=[[[\\u039C\\u0105\\u0163\\u0113\\u0157\\u012F\\u0105\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=[[[\\u015C\\u0113\\u0157\\u028B\\u012F\\u010B\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=[[[\\u01A4\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=[[[\\u01A4\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=[[[\\u010E\\u0113\\u013A\\u012F\\u028B\\u0113\\u0157\\u0177 \\u010E\\u0105\\u0163\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=[[[\\u010E\\u0113\\u013A\\u012F\\u028B\\u0113\\u0157\\u0177 \\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=[[[\\u0105\\u014B\\u018C \\u013A\\u0105\\u0163\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=[[[\\u0100\\u018C\\u018C\\u0157\\u0113\\u015F\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=[[[\\u010E\\u0113\\u013A\\u012F\\u028B\\u0113\\u0157\\u0177 \\u0100\\u018C\\u018C\\u0157\\u0113\\u015F\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=[[[\\u01A4\\u013A\\u0105\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=[[[\\u0108\\u0171\\u015F\\u0163\\u014F\\u0271\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=[[[\\u0143\\u0105\\u0271\\u0113]]]\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=[[[\\u013B\\u012F\\u0271\\u012F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=[[[\\u01EC\\u0171\\u0105\\u014B\\u0163\\u012F\\u0163\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=[[[\\u012C\\u0163\\u0113\\u0271 \\u0108\\u0105\\u0163\\u0113\\u011F\\u014F\\u0157\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=[[[\\u015C\\u0171\\u03C1\\u03C1\\u013A\\u012F\\u0113\\u0157 \\u0143\\u0105\\u0271\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=[[[\\u013B\\u012F\\u0271\\u012F\\u0163 \\u01B2\\u0105\\u013A\\u0171\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=[[[\\u016E\\u014B\\u013A\\u012F\\u0271\\u012F\\u0163\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=[[[\\u0114\\u03C7\\u03C1\\u0113\\u010B\\u0163\\u0113\\u018C \\u01B2\\u0105\\u013A\\u0171\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=[[[\\u015C\\u0113\\u0157\\u028B\\u012F\\u010B\\u0113 \\u0122\\u0157\\u014F\\u0171\\u03C1\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=[[[\\u039C\\u0105\\u0163\\u0113\\u0157\\u012F\\u0105\\u013A \\u0122\\u0157\\u014F\\u0171\\u03C1\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=[[[\\u016E\\u014B\\u012F\\u0163 \\u01A4\\u0157\\u012F\\u010B\\u0113\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=[[[\\u03C1\\u0113\\u0157\\u2219]]]\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty=[[[{0} {1} / {2} {3}]]]\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=[[[\\u01A4\\u0157\\u012F\\u010B\\u0113 \\u03C1\\u0113\\u0157 \\u016E\\u014B\\u012F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=[[[\\u015C\\u0171\\u03C1\\u03C1\\u013A\\u012F\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=[[[\\u0191\\u014F\\u0157\\u0175\\u0105\\u0157\\u018C\\u0113\\u018C \\u0183\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=[[[\\u015C\\u0171\\u0183\\u015F\\u0163\\u012F\\u0163\\u0171\\u0163\\u0113 \\u0192\\u014F\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=[[[\\u0143\\u014F\\u0163 \\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=[[[\\u010E\\u0113\\u015F\\u010B\\u0157\\u012F\\u03C1\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=[[[\\u015C\\u0171\\u0183\\u0163\\u014F\\u0163\\u0105\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG\ndialog.question.approve=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113 \\u0163\\u0125\\u0113 \\u03C1\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u012F\\u015F\\u012F\\u0163\\u012F\\u014F\\u014B \\u015F\\u0171\\u0183\\u0271\\u012F\\u0163\\u0163\\u0113\\u018C \\u0183\\u0177 {0}?]]]\n\n# YMSG\ndialog.question.reject=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163 \\u0163\\u0125\\u0113 \\u03C1\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u012F\\u015F\\u012F\\u0163\\u012F\\u014F\\u014B \\u015F\\u0171\\u0183\\u0271\\u012F\\u0163\\u0163\\u0113\\u018C \\u0183\\u0177 {0}?]]]\n\n# YMSG\ndialog.success.approve=[[[\\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u012F\\u015F\\u012F\\u0163\\u012F\\u014F\\u014B \\u0175\\u0105\\u015F \\u0105\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u018C \\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG\ndialog.success.reject=[[[\\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u012F\\u015F\\u012F\\u0163\\u012F\\u014F\\u014B \\u0175\\u0105\\u015F \\u0157\\u0113\\u0135\\u0113\\u010B\\u0163\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG\ndialog.success.forward=[[[\\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u012F\\u015F\\u012F\\u0163\\u012F\\u014F\\u014B \\u0175\\u0105\\u015F \\u0192\\u014F\\u0157\\u0175\\u0105\\u0157\\u018C\\u0113\\u018C \\u0163\\u014F {0}]]]\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0105\\u013A \\u014F\\u0157 \\u0157\\u0113\\u0135\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B \\u014F\\u0192 \\u0163\\u0125\\u012F\\u015F \\u0157\\u0113\\u01A3\\u0171\\u012F\\u015F\\u012F\\u0163\\u012F\\u014F\\u014B \\u012F\\u015F \\u015F\\u0163\\u012F\\u013A\\u013A \\u012F\\u014B \\u03C1\\u0157\\u014F\\u010B\\u0113\\u015F\\u015F. \\u0176\\u014F\\u0171 \\u010B\\u0105\\u014B \\u0157\\u0113\\u0192\\u0157\\u0113\\u015F\\u0125 \\u0163\\u0125\\u0113 \\u013A\\u012F\\u015F\\u0163 \\u014F\\u0192 \\u0157\\u0113\\u01A3\\u0171\\u012F\\u015F\\u012F\\u0163\\u012F\\u014F\\u014B\\u015F \\u0271\\u0105\\u014B\\u0171\\u0105\\u013A\\u013A\\u0177.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=[[[\\u01A4\\u0157\\u014F\\u0192\\u012F\\u0163 \\u0108\\u0113\\u014B\\u0163\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=[[[\\u014E\\u0136\\u2219\\u2219]]]\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT: Button for Reject action\nXBUT_REJECT=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT: Button for forward action\nXBUT_FORWARD=[[[\\u0191\\u014F\\u0157\\u0175\\u0105\\u0157\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=[[[\\u0181\\u0177\\u0163\\u0113]]]\n\n# YMSG: File Size Unit\nFileSize.Bytes=[[[\\u0181\\u0177\\u0163\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=[[[\\u0137\\u0181\\u2219\\u2219]]]\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=[[[\\u039C\\u0181\\u2219\\u2219]]]\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=[[[\\u0122\\u0181\\u2219\\u2219]]]\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=[[[\\u0162\\u0181\\u2219\\u2219]]]\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=[[[\\u01A4\\u0181\\u2219\\u2219]]]\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=[[[\\u0114\\u0181\\u2219\\u2219]]]\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=[[[\\u017B\\u0181\\u2219\\u2219]]]\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=[[[\\u0176\\u0181\\u2219\\u2219]]]\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=[[[\\u0191\\u012F\\u013A\\u0113 \\u012F\\u015F \\u0163\\u014F\\u014F \\u013A\\u0105\\u0157\\u011F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=[[[\\u0100\\u018C\\u018C \\u014B\\u014F\\u0163\\u0113 (\\u014F\\u03C1\\u0163\\u012F\\u014F\\u014B\\u0105\\u013A)\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=[[[\\u0162\\u014F\\u018C\\u0105\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=[[[1 \\u018C\\u0105\\u0177 \\u0105\\u011F\\u014F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=[[[{0} \\u018C\\u0105\\u0177\\u015F \\u0105\\u011F\\u014F]]]\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId=[[[{0} ({1})]]]\n\n# YMSG: Loading\nLOADING=[[[\\u013B\\u014F\\u0105\\u018C\\u012F\\u014B\\u011F...\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=[[[\\u0143\\u014F \\u012F\\u0163\\u0113\\u0271\\u015F \\u0105\\u0157\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_en_US_saptrc.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=bF+N8XVYxkHL0/g95H0HYg_Purchase Requisition\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=DJLdh20vhPB3oG6GhdKEpw_Purchase Requisition\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=pukFU6fM4klpAzEPCplDGA_Purchase Requisition\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=JlPSxZ6S4MRxIDGJsUlcyQ_Limit\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=RVZ7v46532qKZkh+CqFF4w_Item {0} of {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=ZTpoLQpXeGgNxRtGt5rYsA_Service Line {0} of {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=VNx9W3tkTcY4Nx+tPWVDFA_Service Line {0} of {1} - Item {2} of {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=XvIhC+fhVQ/tlnmzOXELPg_Item {0} of {1} - Limit\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=PHFFLWdg+KRwe2NTW8rwag_Service Lines\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=dL6L52KHVqDEuMy7H+wP7Q_Service Lines ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=EFb6lX+C4IImjHgEFUKKeA_Account Assignment\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=EPr0de3zTqyxze4sAeL8BQ_Subtotal\n\n# XTIT: Header text of Master List\nview.Master.title=i1TwZ01ZS6q9qKdBbmNGCg_Purchase Requisitions ({0})\n\n# XTIT: Application name\napp.Identity=PhLLe6X0Gl1TbEzQXeuNYg_Approve Requisitions\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=xNDUfBo3N0l81rZK3yMBCg_Approve Requisitions\n\n#XTIT: Shell title \nSHELL_TITLE=TbNs+UA62Kfp98lsr/I8oQ_Approve Purchase Requisitions\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=J2nHGwmO8aQVlxgIId5Hvw_Employee Business Card\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=xDKAbA0b7QEtwYIu1zF2zg_Supplier Business Card\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=/rWWbk1hVjhsmR5uvHvl9w_Information\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=psX8EFsHHZyA3Ds+oEaHxA_Information\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=xawnuVF1My7Dk1aqLsjAJw_Description\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=p2fB7HhF35WOgIk2vOTJpA_Description\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=HJVld/bJ2EzUItNSzPgzcA_Attachments\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=3UE7RD8ofzf2Q42Sl3X1WA_Notes\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=tUH++ZVxxb+jEPzom6DBGw_No items\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=iTSFsTTaB6T+IsJYUMw9fg_Items ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=WB2gaM+YqJ3yYkrTLleQLA_Multiple Assignments\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=4nVPC2cA8NGNcCpTDDxoDg_Account Assignment\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=gImKGa8z95N43ri7Wx9vSQ_Category\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=WCqPpTBx28LsqUdC6VkZmA_G/L Account\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=TB1WfGnNLmm5/z6+obXrNA_Unknown\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=zIA2nVTrxScVENRx4IBY7g_Objects\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=03GH7CoWX0VyKgDRVZ0uog_Cost Centre\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=6qOFfderihpDrPjO0PUBRw_WBS Element\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=UUboj5l+EIAa0OMd9m7qAw_Network\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=wwBRqezvaUcoWw/j5Q0cYw_Order\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=S9GZRqCva1MR7lh0/AH16g_Sales Order\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=jUkz00mzPn9fD53LD+9L/Q_Asset\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=w8jduLhd0zY4OpuzUM6l0Q_Subcontracting\n\n# XFLD: Components\nview.PurchaseRequisition.components=tzjG0v4h2TxYwPRICaxILg_Components\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=RWFLLimLpq+OK9kdBbG7KQ_Standard\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=vYnHggQlsolzrKtyLVjIPg_Third-party\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=yTuL3GwdyGCy71XW1K1Y3Q_Consignment\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=TlX832nFLqzfybe6pr0Eow_Share\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=4MuTciu8DLVBI6GB7uhZlw_No service lines\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=HJuA/eYEwLtH0FOy0s+5Rg_No limits\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=Mxk/T7AcwFIxDGFyWp0uRg_Description\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=o/WaviP9Fllzo9L71LnHJw_Price\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=fdrry09u9oqu4WiQYH++Gw_Purchase Requisition\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=fZMlAiMXSQq2DKHYc0/j6A_Material\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=v+x/Gf/PqOx70M1CbR30qA_Service\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=QqxU9lN7uOZi5tI46xU+1g_Product\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=FK8gw2c5yITOHoYY95gqcg_Product Details\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=s13bBVRW7Qm8nUVp0GG5oA_Delivery Date\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=irUZrP7GusKygUTT18IEDA_Delivery on\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=oI+1ptzy+HfXqEIWBNGSIA_and later\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=KEnR2NGA5NYipg28yc5nBg_Address\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=YtNupJVTiEp93ubu9hKlGg_Delivery Address\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=8zn4dg4J+N9ohVE3AB1YAQ_Plant\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=L2Vg4qUTLmD4TNCb0HwXJQ_Customer\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=tO/pKFjUbAqSLTD6eIkOFg_Name\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=gbFJFuMAW1lWsnjiGjcMWA_Limit\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=gEWV7ckRtZ9p7Lb4hZoN9Q_Quantity\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=1FEuZ3OXQnQepr3z5wc+qA_Item Category\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=DysKXqgyLAckyFoX7JQQbA_Supplier Name\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=nDNGC/pezdUFDlIGUhph7w_Limit Value\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=Osk+FcZ+z5Nc1+9wCoiODg_Unlimited\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=WlRiCSsM73L1kMklFBOeoA_Expected Value\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=PABWHVyk3oMROQi+8G7IsQ_Service Group\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=8pkdGaNCwGkM4v7UcENA9A_Material Group\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=noW1Gsph5JPnjlqAEP05yg_Unit Price\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=G81DrnxGSWHAEsGQtcEXYw_per\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty=CrMWBW6+qH40UsDoTGG3CA_{0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=OylHcGKV+2DORO5fJXvJjg_Price per Unit\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=fga3Cl3DqcgmP/xhss1JUw_Supplier\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=o34nrBPk0E8gHZl/NPMUVA_Forwarded by\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=Da4NYbkj8GMTgLKPQ0NZFA_Substitute for\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=AgJyM7Yj+2C5kkJMoV6bsw_Not Assigned\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=bFCY0D5XUFHbWphUy9m5Rg_Description\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=EaNtafaBfwumG4LU4vUs4g_Subtotal\n\n# YMSG\ndialog.question.approve=yeDuKcN//v/zBOUxUGJzTA_Approve the purchase requisition submitted by {0}?\n\n# YMSG\ndialog.question.reject=eUFdxiM/cafGkGj6IaAjBg_Reject the purchase requisition submitted by {0}?\n\n# YMSG\ndialog.success.approve=J/BYj+pmHNPKNXDKOwxiMA_Purchase requisition was approved \n\n# YMSG\ndialog.success.reject=D8ih4k+TMvlHbG6lNTz3Pg_Purchase requisition was rejected\n\n# YMSG\ndialog.success.forward=FsN+1PQe2Nvl1UtZKPz51A_Purchase requisition was forwarded to {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=R1FBE8/ENNk93PbikV8zkA_Approve\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=5GOVKDjBgeJjPbsNlXtWqQ_Reject\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=sxkb51XBI+ZduHlv9z/oLA_Approval or rejection of this requisition is still in process. You can refresh the list of requisitions manually.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=fhyFsJEsylbYyrUL0nkIBw_Profit Center\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=c+/3wo6ySjIx58cEzA39Lg_OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=hz41fO9kb7TvjnI55zTtpA_Approve\n\n#XBUT: Button for Reject action\nXBUT_REJECT=1Xhy36N+qvTWkGd4S0OljA_Reject\n\n#XBUT: Button for forward action\nXBUT_FORWARD=pS9QRjYRj73/UcuVcE1arg_Forward\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=XE5LbbZC/3WDhHDuy7CmYw_Cancel\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=ziM+e0jyCbP9lhEnglx4dA_Byte\n\n# YMSG: File Size Unit\nFileSize.Bytes=HUswtfrttFvTVVlbsR/vxg_Bytes\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=Upkw0UtjtQ1mwKZEkEpDYQ_kB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=yY39P/UnBotKW1rCV3Osmw_MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=ySV5WCSs5ZYNa9mnJS8rBw_GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=RWuyqNpydYBy3am+8w08BA_TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=xnjxlchBDXLfMmiOJofHsg_PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=UDhwVo7GKQwxziKFCrvPMw_EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=3JnDZBf7Hc/kejSJkLafAQ_ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=I3zBIHNkltLntyH6vUKZiw_YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=RgKoRpqi87/Z7+nn/X1oMQ_File is too large\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=24Vcw4zO6dNv1u628S5RRQ_Add note (optional)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=A4cneNBp3KA3SAl9zYdHdA_Today\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=muiNyYXRbVfrgTyIou4Zcg_1 day ago\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=lamUyNRSFHgAWZmTD2JwRA_{0} days ago\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId=dR+HMKtGJ/x9c/oIdHnoUQ_{0} ({1})\n\n# YMSG: Loading\nLOADING=6PqxM/ExVjwYxtGS0Av5Ww_Loading...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Pp/XM25z89h2Jzu0kRG3Bg_No items are currently available\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_es.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=Solicitud de pedido\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Solicitud de pedido\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=Solicitud de pedido\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=L\\u00EDmite\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=Posici\\u00F3n {0} de {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=L\\u00EDnea de servicios {0} de {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=L\\u00EDnea de servicio {0} de {1} - Posici\\u00F3n {2} de {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Posici\\u00F3n {0} de {1} - L\\u00EDmite\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=L\\u00EDneas de servicios\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=L\\u00EDneas de servicio ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=Asignaci\\u00F3n de costes\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=Subtotal\n\n# XTIT: Header text of Master List\nview.Master.title=Solicitudes de pedido ({0})\n\n# XTIT: Application name\napp.Identity=Aprobaci\\u00F3n de solicitudes de pedidos de compra\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Aprobaci\\u00F3n de solicitudes de pedidos de compra\n\n#XTIT: Shell title \nSHELL_TITLE=Aprobaci\\u00F3n de solicitudes de pedidos de compra\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=Detalles de empleado\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=Detalles de proveedor\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=Informaci\\u00F3n\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=Informaci\\u00F3n\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=Descripci\\u00F3n\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=Descripci\\u00F3n\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=Anexos\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=Notas\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=No hay posiciones\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=Posiciones ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=Asignaciones m\\u00FAltiples\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=Asignaci\\u00F3n de costes\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=Categor\\u00EDa\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=Cuenta de mayor\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=Desconocido\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=Objetos\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=Centro de coste\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=Elemento PEP\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=Red\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=Orden\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=Pedido de cliente\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=Activo\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=Subcontrataci\\u00F3n\n\n# XFLD: Components\nview.PurchaseRequisition.components=Componentes\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=Est\\u00E1ndar\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=Pedido a terceros\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=Consignaci\\u00F3n\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=Compartir\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=No hay l\\u00EDneas de servicio\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=No hay l\\u00EDmites\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=Descripci\\u00F3n\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=Precio\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=Solicitud de compra\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=Material\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=Servicio\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=Producto\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=Detalles de producto\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=Fecha de entrega\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=Entrega el\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=y posteriores\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=Direcci\\u00F3n\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=Direcci\\u00F3n de entrega\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=Centro\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=Cliente\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=Nombre\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=L\\u00EDmite\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=Cantidad\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=Categor\\u00EDa de art\\u00EDculo\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=Nombre del proveedor\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=Valor l\\u00EDmite\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=Ilimitado\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=Valor previsto\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=Grupo de servicios\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=Grupo de materiales\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=Precio por unidad\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=por\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=Precio por unidad\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=Proveedor\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=Reenviado  por\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=Sustituto para\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=No asignado\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=Descripci\\u00F3n\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=Subtotal\n\n# YMSG\ndialog.question.approve=\\u00BFAprobar la solicitud de compra enviada por {0}?\n\n# YMSG\ndialog.question.reject=\\u00BFRechazar la solicitud de compra enviada por {0}?\n\n# YMSG\ndialog.success.approve=Solicitud de pedido aprobada\n\n# YMSG\ndialog.success.reject=Solicitud de pedido rechazada\n\n# YMSG\ndialog.success.forward=Se ha transmitido la solicitud de compra a {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Aprobar\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Rechazar\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=La aprobaci\\u00F3n o el rechazo de esta solicitud de pedido sigue en curso. Puede actualizar la lista de solicitudes de pedido manualmente.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=Centro de beneficio\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Aprobar\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Rechazar\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Reenviar\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Cancelar\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=Byte\n\n# YMSG: File Size Unit\nFileSize.Bytes=Bytes\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=El fichero es demasiado grande\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=A\\u00F1adir nota (opcional)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Hoy\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=Hace 1 d\\u00EDa\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=Hace {0} d\\u00EDas\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Cargando...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Actualmente no hay posiciones disponibles\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_fr.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=Demande d\'achat\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Demande d\'achat\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=Demande d\'achat\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=Limite\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=Poste {0}\\u00A0/\\u00A0{1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=Ligne de service {0}\\u00A0/\\u00A0{1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Ligne de service {0}\\u00A0/\\u00A0{1} - Poste {2}\\u00A0/\\u00A0{3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Poste {0}\\u00A0/\\u00A0{1} - limite\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=Lignes de service\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=Lignes de service ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=Imputation\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=Total interm\\u00E9diaire\n\n# XTIT: Header text of Master List\nview.Master.title=Demandes d\'\'achat ({0})\n\n# XTIT: Application name\napp.Identity=Approbation de demandes d\'achat\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Approbation de demandes d\'achat\n\n#XTIT: Shell title \nSHELL_TITLE=Approbation de demandes d\'achat\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=D\\u00E9tails salari\\u00E9\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=D\\u00E9tails fournisseur\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=Informations\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=Informations\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=Description\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=Description\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=Pi\\u00E8ces jointes\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=Notes\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=Aucun poste\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=Postes ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=Affectations multiples\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=Imputation\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=Cat\\u00E9gorie\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=Compte g\\u00E9n\\u00E9ral\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=Inconnu\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=Objets\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=Centre de co\\u00FBts\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=\\u00C9l\\u00E9ment d\'OTP\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=R\\u00E9seau\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=Commande\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=Commande client\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=Immobilisation\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=Sous-traitance\n\n# XFLD: Components\nview.PurchaseRequisition.components=Composants\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=Standard\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=Livraison directe\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=Consignation\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=Part\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=Aucune ligne de service\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=Aucune limite\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=Description\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=Prix\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=Demande d\'achat\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=Article\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=Service\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=Produit\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=D\\u00E9tails produit\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=Date de livraison\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=Livraison le\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=et ult\\u00E9rieur\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=Adresse\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=Adresse de livraison\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=Division\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=Client\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=Nom\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=Limite\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=Quantit\\u00E9\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=Cat\\u00E9gorie de poste\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=Nom du fournisseur\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=Valeur limite\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=Illimit\\u00E9\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=Valeur attendue\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=Groupe de services\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=Groupe de marchandises\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=Prix unitaire\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=par\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=Prix par unit\\u00E9\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=Fournisseur\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=Transf\\u00E9r\\u00E9(e) par\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=Rempla\\u00E7ant de\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=Non affect\\u00E9\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=Description\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=Total interm\\u00E9diaire\n\n# YMSG\ndialog.question.approve=Approuver la demande d\'\'achat envoy\\u00E9e par {0}\\u00A0?\n\n# YMSG\ndialog.question.reject=Rejeter la demande d\'\'achat envoy\\u00E9e par {0}\\u00A0?\n\n# YMSG\ndialog.success.approve=Demande d\'achat approuv\\u00E9e\n\n# YMSG\ndialog.success.reject=Demande d\'achat rejet\\u00E9e\n\n# YMSG\ndialog.success.forward=Demande d\'\'achat transf\\u00E9r\\u00E9e \\u00E0 {0}.\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Approuver\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Refuser\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=L\'approbation ou le rejet de cette demande est toujours en cours. Vous pouvez actualiser la liste des demandes manuellement.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=Centre de profit\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Approuver\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Refuser\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Transf\\u00E9rer\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Interrompre\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=Octet\n\n# YMSG: File Size Unit\nFileSize.Bytes=Octets\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=Ko\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=Mo\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=Go\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=To\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=Po\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=Eo\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=Zo\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=Yb\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=La taille du fichier est trop grande.\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Ajouter note (facultatif)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Aujourd\'hui\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=Il y a 1 jour.\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=Il y a {0} jours.\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Chargement...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Aucun poste disponible actuellement\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_hr.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=Zahtjevnica\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Zahtjevnica\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=Zahtjevnica\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=Ograni\\u010Denje\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=Stavka {0} od {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=Redak usluge {0} od {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Redak usluge {0} od {1} - stavka {2} od {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Stavka {0} od {1} - ograni\\u010Denje\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=Redovi usluge\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=Redovi usluge ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=Dodjela konta\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=Me\\u0111uzbroj\n\n# XTIT: Header text of Master List\nview.Master.title=Zahtjevnice ({0})\n\n# XTIT: Application name\napp.Identity=Odobri zahtjevnice\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Odobri zahtjevnice\n\n#XTIT: Shell title \nSHELL_TITLE=Odobri zahtjevnice\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=Detalji zaposlenika\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=Detalji dobavlja\\u010Da\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=Informacije\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=Informacije\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=Opis\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=Opis\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=Prilozi\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=Bilje\\u0161ke\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=Nema stavki\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=Stavke ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=Vi\\u0161estruke dodjele\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=Dodjela konta\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=Kategorija\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=Konto glavne knjige\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=Nepoznato\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=Objekti\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=Mjesto tro\\u0161ka\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=WBS element\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=Mre\\u017Ea\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=Nalog\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=Prodajni nalog\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=Imovina\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=Podugovaranje\n\n# XFLD: Components\nview.PurchaseRequisition.components=Komponente\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=Standard\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=Tre\\u0107a strana\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=Konsignacija\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=Otpusti\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=Nema redova usluge\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=Nema ograni\\u010Denja\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=Opis\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=Cijena\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=Zahtjevnica\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=Materijal\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=Usluga\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=Proizvod\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=Detalji proizvoda\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=Datum isporuke\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=Isporuka dana\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=i kasnije\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=Adresa\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=Adresa isporuke\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=Pogon\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=Kupac\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=Naziv\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=Ograni\\u010Denje\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=Koli\\u010Dina\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=Kategorija stavke\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=Naziv dobavlja\\u010Da\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=Vrijednost ograni\\u010Denja\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=Neograni\\u010Deno\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=O\\u010Dekivana vrijednost\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=Grupa usluge\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=Grupa materijala\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=Cijena jedinice\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=po\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=Cijena po jedinici\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=Dobavlja\\u010D\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=Proslijedio\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=Zamjena za\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=Nije dodijeljeno\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=Opis\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=Me\\u0111uzbroj\n\n# YMSG\ndialog.question.approve=Odobriti zahtjevnicu koju podnosi {0}?\n\n# YMSG\ndialog.question.reject=Odbiti zahtjevnicu koju podnosi {0}?\n\n# YMSG\ndialog.success.approve=Zahtjevnica odobrena\n\n# YMSG\ndialog.success.reject=Zahtjevnica odbijena\n\n# YMSG\ndialog.success.forward=Zahtjevnica je proslije\\u0111ena u {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Odobri\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Odbij\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Odobrenje ili odbijanje ove zahtjevnice jo\\u0161 se obra\\u0111uje. Listu zahtjevnica mo\\u017Eete odr\\u017Eavati ru\\u010Dno.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=Profitni centar\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Odobri\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Odbij\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Proslijedi\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Otka\\u017Ei\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=Bajt\n\n# YMSG: File Size Unit\nFileSize.Bytes=Bajtovi\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Datoteka je prevelika\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Dodaj bilje\\u0161ku (izborno)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Danas\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=Prije 1 dan\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} dana prije\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=U\\u010Ditavanje...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Stavke trenutno nisu raspolo\\u017Eive\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_hu.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=Beszerz\\u00E9si ig\\u00E9ny\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Beszerz\\u00E9si ig\\u00E9ny\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=Beszerz\\u00E9si ig\\u00E9ny\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=Limit\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=T\\u00E9tel\\: {0} - {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=Szolg\\u00E1ltat\\u00E1s sora\\: {0} - {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Szolg\\u00E1ltat\\u00E1s sora\\: {0} - {1} - T\\u00E9tel\\: {2} - {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=T\\u00E9tel\\: {0} - {1} - Limit\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=Szolg\\u00E1ltat\\u00E1s sorai\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=Szolg\\u00E1ltat\\u00E1s sorai ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=Kont\\u00EDroz\\u00E1s\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=R\\u00E9sz\\u00F6sszeg\n\n# XTIT: Header text of Master List\nview.Master.title=Beszerz\\u00E9si ig\\u00E9nyek ({0})\n\n# XTIT: Application name\napp.Identity=Beszerz\\u00E9si ig\\u00E9nyek enged\\u00E9lyez\\u00E9se\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Beszerz\\u00E9si ig\\u00E9nyek enged\\u00E9lyez\\u00E9se\n\n#XTIT: Shell title \nSHELL_TITLE=Beszerz\\u00E9si ig\\u00E9nyek enged\\u00E9lyez\\u00E9se\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=Dolgoz\\u00F3 r\\u00E9szletes adatai\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=Sz\\u00E1ll\\u00EDt\\u00F3adatok\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=Inform\\u00E1ci\\u00F3k\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=Inform\\u00E1ci\\u00F3k\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=Le\\u00EDr\\u00E1s\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=Le\\u00EDr\\u00E1s\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=Mell\\u00E9kletek\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=Megjegyz\\u00E9sek\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=Nincs t\\u00E9tel\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=T\\u00E9telek ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=T\\u00F6bbsz\\u00F6r\\u00F6s hozz\\u00E1rendel\\u00E9s\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=Kont\\u00EDroz\\u00E1s\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=Kateg\\u00F3ria\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=F\\u0151k\\u00F6nyvi sz\\u00E1mla\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=Ismeretlen\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=Objektumok\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=K\\u00F6lts\\u00E9ghely\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=PST-elem\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=H\\u00E1l\\u00F3zat\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=Rendel\\u00E9s\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=Vev\\u0151i rendel\\u00E9s\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=Eszk\\u00F6z\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=B\\u00E9rfeldolgoz\\u00E1s\n\n# XFLD: Components\nview.PurchaseRequisition.components=Komponensek\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=Norm\\u00E1l\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=H\\u00E1romsz\\u00F6g\\u00FCgylet\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=Konszign\\u00E1ci\\u00F3\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=Sz\\u00E1zal\\u00E9k\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=Nincs szolg\\u00E1lt.sor\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=Nincs limit\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=Le\\u00EDr\\u00E1s\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=\\u00C1r\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=Beszerz\\u00E9si ig\\u00E9ny\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=Anyag\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=Szolg\\u00E1ltat\\u00E1s\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=Term\\u00E9k\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=Term\\u00E9k r\\u00E9szletei\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=Sz\\u00E1ll\\u00EDt\\u00E1si d\\u00E1tum\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=Sz\\u00E1ll\\u00EDt\\u00E1s d\\u00E1tuma\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=\\u00E9s k\\u00E9s\\u0151bb\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=C\\u00EDm\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=Sz\\u00E1ll\\u00EDt\\u00E1si c\\u00EDm\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=Gy\\u00E1r\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=Vev\\u0151\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=N\\u00E9v\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=Limit\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=Mennyis\\u00E9g\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=T\\u00E9telt\\u00EDpus\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=Sz\\u00E1ll\\u00EDt\\u00F3 neve\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=Limit \\u00E9rt\\u00E9ke\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=Korl\\u00E1tlan\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=V\\u00E1rt \\u00E9rt\\u00E9k\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=Szolg\\u00E1ltat\\u00E1scsoport\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=Anyagcsoport\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=Egys\\u00E9g\\u00E1r\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=/\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=Egys\\u00E9genk\\u00E9nti \\u00E1r\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=Sz\\u00E1ll\\u00EDt\\u00F3\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=Tov\\u00E1bb\\u00EDtotta\\:\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=Helyettes -\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=Nincs hozz\\u00E1rendelve\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=Le\\u00EDr\\u00E1s\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=R\\u00E9sz\\u00F6sszeg\n\n# YMSG\ndialog.question.approve=Enged\\u00E9lyezi a k\\u00F6vetkez\\u0151 \\u00E1ltal bek\\u00FCld\\u00F6tt beszerz\\u00E9si ig\\u00E9nyt\\: {0}?\n\n# YMSG\ndialog.question.reject=Elutas\\u00EDtja a k\\u00F6vetkez\\u0151 \\u00E1ltal bek\\u00FCld\\u00F6tt beszerz\\u00E9si ig\\u00E9nyt\\: {0}?\n\n# YMSG\ndialog.success.approve=Beszerz\\u00E9si ig\\u00E9ny enged\\u00E9lyezve\n\n# YMSG\ndialog.success.reject=Beszerz\\u00E9si ig\\u00E9ny elutas\\u00EDtva\n\n# YMSG\ndialog.success.forward=Beszerz\\u00E9si ig\\u00E9ny tov\\u00E1bb\\u00EDtva\\: {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Enged\\u00E9lyez\\u00E9s\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Elutas\\u00EDt\\u00E1s\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Ennek az ig\\u00E9nynek a j\\u00F3v\\u00E1hagy\\u00E1sa vagy elutas\\u00EDt\\u00E1sa m\\u00E9g feldolgoz\\u00E1s alatt \\u00E1ll. Megpr\\u00F3b\\u00E1lhatja manu\\u00E1lisan friss\\u00EDteni az ig\\u00E9nyek list\\u00E1j\\u00E1t.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=Profit center\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Enged\\u00E9lyez\\u00E9s\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Elutas\\u00EDt\\u00E1s\n\n#XBUT: Button for forward action\nXBUT_FORWARD=\\u00C1tir\\u00E1ny\\u00EDt\\u00E1s\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=M\\u00E9gse\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=B\\u00E1jt\n\n# YMSG: File Size Unit\nFileSize.Bytes=B\\u00E1jt\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=A f\\u00E1jl t\\u00FAl nagy\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Megjegyz\\u00E9s hozz\\u00E1ad\\u00E1sa (nem k\\u00F6telez\\u0151)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Ma\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 napja\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} napja\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Bet\\u00F6lt\\u00E9s...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Jelenleg nem \\u00E1ll rendelkez\\u00E9sre t\\u00E9tel\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_it.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=Richiesta di acquisto\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Richiesta di acquisto\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=Richiesta di acquisto\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=Limite\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=Posizione {0} di {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=Riga della prestazione di servizio {0} di {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Riga prestazione di servizio {0} di {1} - Posizione {2} di {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Posizione {0} di {1} - Limite\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=Righe prestazione di servizio\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=Righe della prestazione di servizio ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=Contabilizzazione\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=Totale parziale\n\n# XTIT: Header text of Master List\nview.Master.title=Richieste di acquisto ({0})\n\n# XTIT: Application name\napp.Identity=Approva richieste di acquisto\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Approva richieste di acquisto\n\n#XTIT: Shell title \nSHELL_TITLE=Approva richieste di acquisto\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=Dettagli dipendente\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=Dettagli fornitore\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=Informazioni\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=Informazioni\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=Descrizione\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=Descrizione\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=Allegati\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=Note\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=Nessuna posizione\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=Posizioni ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=Attribuzioni multiple\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=Contabilizzazione\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=Categoria\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=Conto Co.Ge.\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=Sconosciuto\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=Oggetti\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=Centro di costo\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=Elemento WBS\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=Network\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=Ordine\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=Ordine di vendita\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=Cespite\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=Lavorazione esterna\n\n# XFLD: Components\nview.PurchaseRequisition.components=Componenti\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=Standard\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=Conto terzi\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=Conto deposito\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=Percentuale\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=Nessuna riga della prestazione di servizio\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=Nessun limite\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=Descrizione\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=Prezzo\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=Richiesta di acquisto\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=Materiale\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=Servizio\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=Prodotto\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=Dettagli prodotto\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=Data di consegna\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=Data di consegna\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=e successivi\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=Indirizzo\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=Indirizzo di consegna\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=Divisione\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=Cliente\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=Nome\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=Limite\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=Quantit\\u00E0\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=Categoria di posizione\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=Fornitore\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=Valore limite\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=Illimitato\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=Valore previsto\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=Gruppo di servizi\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=Gruppo merci\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=Prezzo unitario\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=per\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=Prezzo per unit\\u00E0\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=Fornitore\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=Inoltrato da\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=Sostituto di\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=Non attribuito\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=Descrizione\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=Totale parziale\n\n# YMSG\ndialog.question.approve=Approvare la richiesta di acquisto inviata da {0}?\n\n# YMSG\ndialog.question.reject=Rifiutare la richiesta di acquisto inviata da {0}?\n\n# YMSG\ndialog.success.approve=Richiesta di acquisto approvata\n\n# YMSG\ndialog.success.reject=Richiesta di acquisto rifiutata\n\n# YMSG\ndialog.success.forward=Richiesta di acquisto inoltrata a {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Approva\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Rifiuta\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=L\'approvazione o rifiuto di questa richiesta \\u00E8 ancora in corso; la lista di richieste \\u00E8 aggiornabile manualmente.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=Profit center\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Approva\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Rifiuta\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Inoltra\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Annulla\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=Byte\n\n# YMSG: File Size Unit\nFileSize.Bytes=Bytes\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Il file \\u00E8 troppo grande\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Aggiungi nota (facoltativo)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Oggi\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 giorno fa\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} giorni fa\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=In caricamento...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Nessuna posizione attualmente disponibile\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_iw.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=\\u05D3\\u05E8\\u05D9\\u05E9\\u05EA \\u05E8\\u05DB\\u05E9\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=\\u05D3\\u05E8\\u05D9\\u05E9\\u05EA \\u05E8\\u05DB\\u05E9\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=\\u05D3\\u05E8\\u05D9\\u05E9\\u05EA \\u05E8\\u05DB\\u05E9\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=\\u05D2\\u05D1\\u05D5\\u05DC\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=\\u05E4\\u05E8\\u05D9\\u05D8 {0} \\u05DE\\u05EA\\u05D5\\u05DA {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=\\u05E9\\u05D5\\u05E8\\u05EA \\u05E9\\u05D9\\u05E8\\u05D5\\u05EA {0} \\u05DE\\u05EA\\u05D5\\u05DA {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=\\u05E9\\u05D5\\u05E8\\u05EA \\u05E9\\u05D9\\u05E8\\u05D5\\u05EA {0} \\u05DE\\u05EA\\u05D5\\u05DA {1} - \\u05E4\\u05E8\\u05D9\\u05D8 {2} \\u05DE\\u05EA\\u05D5\\u05DA {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=\\u05E4\\u05E8\\u05D9\\u05D8 {0} \\u05DE\\u05EA\\u05D5\\u05DA {1} - \\u05D4\\u05D2\\u05D1\\u05DC\\u05D4\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=\\u05E9\\u05D5\\u05E8\\u05D5\\u05EA \\u05E9\\u05D9\\u05E8\\u05D5\\u05EA\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=\\u05E9\\u05D5\\u05E8\\u05D5\\u05EA \\u05E9\\u05D9\\u05E8\\u05D5\\u05EA ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=\\u05D4\\u05E7\\u05E6\\u05D0\\u05EA \\u05D7\\u05E9\\u05D1\\u05D5\\u05DF\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=\\u05E1\\u05D9\\u05DB\\u05D5\\u05DD \\u05D1\\u05D9\\u05E0\\u05D9\\u05D9\\u05DD\n\n# XTIT: Header text of Master List\nview.Master.title=\\u05D3\\u05E8\\u05D9\\u05E9\\u05D5\\u05EA \\u05E8\\u05DB\\u05E9 ({0})\n\n# XTIT: Application name\napp.Identity=\\u05D0\\u05E9\\u05E8 \\u05D3\\u05E8\\u05D9\\u05E9\\u05D5\\u05EA\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u05D0\\u05E9\\u05E8 \\u05D3\\u05E8\\u05D9\\u05E9\\u05D5\\u05EA\n\n#XTIT: Shell title \nSHELL_TITLE=\\u05D0\\u05E9\\u05E8 \\u05D3\\u05E8\\u05D9\\u05E9\\u05D5\\u05EA\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E2\\u05D5\\u05D1\\u05D3\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E1\\u05E4\\u05E7\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=\\u05DE\\u05D9\\u05D3\\u05E2\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=\\u05DE\\u05D9\\u05D3\\u05E2\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=\\u05EA\\u05D9\\u05D0\\u05D5\\u05E8\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=\\u05EA\\u05D9\\u05D0\\u05D5\\u05E8\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=\\u05E7\\u05D1\\u05E6\\u05D9\\u05DD \\u05DE\\u05E6\\u05D5\\u05E8\\u05E4\\u05D9\\u05DD\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=\\u05D4\\u05E2\\u05E8\\u05D5\\u05EA\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=\\u05D0\\u05D9\\u05DF \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9\\u05DD\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=\\u05E4\\u05E8\\u05D9\\u05D8\\u05D9\\u05DD ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=\\u05D4\\u05E7\\u05E6\\u05D0\\u05D5\\u05EA \\u05DE\\u05E8\\u05D5\\u05D1\\u05D5\\u05EA\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=\\u05D4\\u05E7\\u05E6\\u05D0\\u05EA \\u05D7\\u05E9\\u05D1\\u05D5\\u05DF\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=\\u05E7\\u05D8\\u05D2\\u05D5\\u05E8\\u05D9\\u05D4\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=\\u05D7\\u05E9\\u05D1\\u05D5\\u05DF \\u05E1\\u05E4\\u05E8 \\u05D7\\u05E9\\u05D1\\u05D5\\u05E0\\u05D5\\u05EA \\u05E8\\u05D0\\u05E9\\u05D9\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=\\u05DC\\u05D0 \\u05D9\\u05D3\\u05D5\\u05E2\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=\\u05D0\\u05D5\\u05D1\\u05D9\\u05D9\\u05E7\\u05D8\\u05D9\\u05DD\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=\\u05DE\\u05E8\\u05DB\\u05D6 \\u05E2\\u05DC\\u05D5\\u05EA\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=\\u05D0\\u05DC\\u05DE\\u05E0\\u05D8 WBS\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=\\u05E8\\u05E9\\u05EA\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=\\u05D4\\u05D6\\u05DE\\u05E0\\u05D4\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=\\u05D4\\u05D6\\u05DE\\u05E0\\u05EA \\u05DC\\u05E7\\u05D5\\u05D7\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=\\u05E0\\u05DB\\u05E1\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=\\u05E7\\u05D1\\u05DC\\u05E0\\u05D5\\u05EA \\u05DE\\u05E9\\u05E0\\u05D4\n\n# XFLD: Components\nview.PurchaseRequisition.components=\\u05E8\\u05DB\\u05D9\\u05D1\\u05D9\\u05DD\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=\\u05EA\\u05E7\\u05E0\\u05D9\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=\\u05E6\\u05D3 \\u05E9\\u05DC\\u05D9\\u05E9\\u05D9\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=\\u05DE\\u05E9\\u05D2\\u05D5\\u05E8\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=\\u05D7\\u05DC\\u05E7\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=\\u05D0\\u05D9\\u05DF \\u05E9\\u05D5\\u05E8\\u05D5\\u05EA \\u05E9\\u05D9\\u05E8\\u05D5\\u05EA\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=\\u05D0\\u05D9\\u05DF \\u05D4\\u05D2\\u05D1\\u05DC\\u05D5\\u05EA\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=\\u05EA\\u05D9\\u05D0\\u05D5\\u05E8\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=\\u05DE\\u05D7\\u05D9\\u05E8\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=\\u05D3\\u05E8\\u05D9\\u05E9\\u05EA \\u05E8\\u05DB\\u05E9\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=\\u05D7\\u05D5\\u05DE\\u05E8\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=\\u05E9\\u05D9\\u05E8\\u05D5\\u05EA\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=\\u05DE\\u05D5\\u05E6\\u05E8\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=\\u05E4\\u05E8\\u05D8\\u05D9 \\u05DE\\u05D5\\u05E6\\u05E8\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D0\\u05E1\\u05E4\\u05E7\\u05D4\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=\\u05D0\\u05E1\\u05E4\\u05E7\\u05D4 \\u05D1\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=\\u05D5\\u05DE\\u05D0\\u05D5\\u05D7\\u05E8 \\u05D9\\u05D5\\u05EA\\u05E8\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=\\u05DB\\u05EA\\u05D5\\u05D1\\u05EA\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=\\u05DB\\u05EA\\u05D5\\u05D1\\u05EA \\u05DC\\u05D0\\u05E1\\u05E4\\u05E7\\u05D4\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=\\u05D0\\u05EA\\u05E8\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=\\u05DC\\u05E7\\u05D5\\u05D7\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=\\u05E9\\u05DD\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=\\u05D2\\u05D1\\u05D5\\u05DC\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=\\u05DB\\u05DE\\u05D5\\u05EA\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=\\u05E7\\u05D8\\u05D2\\u05D5\\u05E8\\u05D9\\u05D9\\u05EA \\u05E4\\u05E8\\u05D9\\u05D8\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=\\u05E9\\u05DD \\u05E1\\u05E4\\u05E7\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=\\u05E2\\u05E8\\u05DA \\u05D4\\u05D2\\u05D1\\u05DC\\u05D4\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=\\u05D1\\u05DC\\u05EA\\u05D9 \\u05DE\\u05D5\\u05D2\\u05D1\\u05DC\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=\\u05E2\\u05E8\\u05DA \\u05E6\\u05E4\\u05D5\\u05D9\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=\\u05E7\\u05D1\\u05D5\\u05E6\\u05EA \\u05E9\\u05D9\\u05E8\\u05D5\\u05EA\\u05D9\\u05DD\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=\\u05E7\\u05D1\\u05D5\\u05E6\\u05EA \\u05D7\\u05D5\\u05DE\\u05E8\\u05D9\\u05DD\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=\\u05DE\\u05D7\\u05D9\\u05E8 \\u05D9\\u05D7\\u05D9\\u05D3\\u05D4\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=\\u05DC\\u05DB\\u05DC\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=\\u05DE\\u05D7\\u05D9\\u05E8 \\u05DC\\u05D9\\u05D7\\u05D9\\u05D3\\u05D4\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=\\u05E1\\u05E4\\u05E7\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=\\u05D4\\u05D5\\u05E2\\u05D1\\u05E8 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=\\u05DE\\u05D7\\u05DC\\u05D9\\u05E3 \\u05E2\\u05D1\\u05D5\\u05E8\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=\\u05DC\\u05D0 \\u05DE\\u05D5\\u05E7\\u05E6\\u05D4\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=\\u05EA\\u05D9\\u05D0\\u05D5\\u05E8\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=\\u05E1\\u05D9\\u05DB\\u05D5\\u05DD \\u05D1\\u05D9\\u05E0\\u05D9\\u05D9\\u05DD\n\n# YMSG\ndialog.question.approve=\\u05D4\\u05D0\\u05DD \\u05DC\\u05D0\\u05E9\\u05E8 \\u05D0\\u05EA \\u05D3\\u05E8\\u05D9\\u05E9\\u05EA \\u05D4\\u05E8\\u05DB\\u05E9 \\u05E9\\u05D4\\u05D5\\u05D2\\u05E9\\u05D4 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 {0}?\n\n# YMSG\ndialog.question.reject=\\u05D4\\u05D0\\u05DD \\u05DC\\u05D3\\u05D7\\u05D5\\u05EA \\u05D0\\u05EA \\u05D3\\u05E8\\u05D9\\u05E9\\u05EA \\u05D4\\u05E8\\u05DB\\u05E9 \\u05E9\\u05D4\\u05D5\\u05D2\\u05E9\\u05D4 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 {0}?\n\n# YMSG\ndialog.success.approve=\\u05D3\\u05E8\\u05D9\\u05E9\\u05EA \\u05D4\\u05E8\\u05DB\\u05E9 \\u05D0\\u05D5\\u05E9\\u05E8\\u05D4\n\n# YMSG\ndialog.success.reject=\\u05D3\\u05E8\\u05D9\\u05E9\\u05EA \\u05D4\\u05E8\\u05DB\\u05E9 \\u05E0\\u05D3\\u05D7\\u05EA\\u05D4\n\n# YMSG\ndialog.success.forward=\\u05D3\\u05E8\\u05D9\\u05E9\\u05EA \\u05D4\\u05E8\\u05DB\\u05E9 \\u05D4\\u05D5\\u05E2\\u05D1\\u05E8\\u05D4 \\u05D0\\u05DC {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=\\u05D0\\u05E9\\u05E8\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=\\u05D3\\u05D7\\u05D4\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=\\u05D0\\u05D9\\u05E9\\u05D5\\u05E8 \\u05D0\\u05D5 \\u05D3\\u05D7\\u05D9\\u05D9\\u05D4 \\u05E9\\u05DC \\u05D3\\u05E8\\u05D9\\u05E9\\u05EA \\u05E8\\u05DB\\u05E9 \\u05D6\\u05D5 \\u05E2\\u05D3\\u05D9\\u05D9\\u05DF \\u05D1\\u05D0\\u05D9\\u05E9\\u05D5\\u05E8. \\u05D1\\u05D0\\u05E4\\u05E9\\u05E8\\u05D5\\u05EA\\u05DA \\u05DC\\u05E8\\u05E2\\u05E0\\u05DF \\u05D0\\u05EA \\u05D3\\u05E8\\u05D9\\u05E9\\u05D5\\u05EA \\u05D4\\u05E8\\u05DB\\u05E9 \\u05D1\\u05D0\\u05D5\\u05E4\\u05DF \\u05D9\\u05D3\\u05E0\\u05D9.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=\\u05DE\\u05E8\\u05DB\\u05D6 \\u05E8\\u05D5\\u05D5\\u05D7\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=\\u05D0\\u05E9\\u05E8\n\n#XBUT: Button for Reject action\nXBUT_REJECT=\\u05D3\\u05D7\\u05D4\n\n#XBUT: Button for forward action\nXBUT_FORWARD=\\u05D4\\u05E2\\u05D1\\u05E8\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=\\u05D1\\u05D8\\u05DC\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=\\u05D1\\u05D9\\u05D9\\u05D8\n\n# YMSG: File Size Unit\nFileSize.Bytes=\\u05D1\\u05D9\\u05D9\\u05D8\\u05D9\\u05DD\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=\\u05E7\\u05D9\\u05DC\\u05D5-\\u05D1\\u05D9\\u05D9\\u05D8\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=\\u05DE\\u05D2\\u05D4\\u05D1\\u05D9\\u05D9\\u05D8\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=\\u05D2\\u05D9\\u05D2\\u05D4-\\u05D1\\u05D9\\u05D9\\u05D8\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=\\u05D8\\u05E8\\u05D4\\u05D1\\u05D9\\u05D9\\u05D8\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=\\u05E4\\u05D8\\u05D4\\u05D1\\u05D9\\u05D9\\u05D8\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=\\u05D0\\u05E7\\u05E1\\u05D4-\\u05D1\\u05D9\\u05D9\\u05D8\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=\\u05D6\\u05D8\\u05D4\\u05D1\\u05D9\\u05D9\\u05D8\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=\\u05D9\\u05D5\\u05D8\\u05D4\\u05D1\\u05D9\\u05D9\\u05D8\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=\\u05E7\\u05D5\\u05D1\\u05E5 \\u05D2\\u05D3\\u05D5\\u05DC \\u05DE\\u05D3\\u05D9\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05D4\\u05E2\\u05E8\\u05D4 (\\u05D0\\u05D5\\u05E4\\u05E6\\u05D9\\u05D5\\u05E0\\u05D0\\u05DC\\u05D9)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=\\u05D4\\u05D9\\u05D5\\u05DD\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=\\u05DC\\u05E4\\u05E0\\u05D9 \\u05D9\\u05D5\\u05DD \\u05D0\\u05D7\\u05D3\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=\\u05DC\\u05E4\\u05E0\\u05D9 {0} \\u05D9\\u05DE\\u05D9\\u05DD\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=\\u05D8\\u05D5\\u05E2\\u05DF...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u05D0\\u05D9\\u05DF \\u05DB\\u05E8\\u05D2\\u05E2 \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_ja.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=\\u8CFC\\u8CB7\\u4F9D\\u983C\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=\\u8CFC\\u8CB7\\u4F9D\\u983C\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=\\u8CFC\\u8CB7\\u4F9D\\u983C\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=\\u5236\\u9650\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=\\u660E\\u7D30 {0}/{1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=\\u30B5\\u30FC\\u30D3\\u30B9\\u884C {0}/{1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=\\u30B5\\u30FC\\u30D3\\u30B9\\u884C {0}/{1} - \\u660E\\u7D30 {2}/{3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=\\u660E\\u7D30 {0}/{1} - \\u5236\\u9650\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=\\u30B5\\u30FC\\u30D3\\u30B9\\u884C\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=\\u30B5\\u30FC\\u30D3\\u30B9\\u884C ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=\\u52D8\\u5B9A\\u8A2D\\u5B9A\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=\\u5C0F\\u8A08\n\n# XTIT: Header text of Master List\nview.Master.title=\\u8CFC\\u8CB7\\u4F9D\\u983C ({0})\n\n# XTIT: Application name\napp.Identity=\\u8CFC\\u8CB7\\u4F9D\\u983C\\u627F\\u8A8D\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u8CFC\\u8CB7\\u4F9D\\u983C\\u627F\\u8A8D\n\n#XTIT: Shell title \nSHELL_TITLE=\\u8CFC\\u8CB7\\u4F9D\\u983C\\u627F\\u8A8D\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=\\u5F93\\u696D\\u54E1\\u8A73\\u7D30\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=\\u4ED5\\u5165\\u5148\\u8A73\\u7D30\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=\\u60C5\\u5831\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=\\u60C5\\u5831\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=\\u30C6\\u30AD\\u30B9\\u30C8\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=\\u30C6\\u30AD\\u30B9\\u30C8\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=\\u6DFB\\u4ED8\\u6587\\u66F8\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=\\u30E1\\u30E2\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=\\u660E\\u7D30\\u306A\\u3057\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=\\u660E\\u7D30 ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=\\u8907\\u6570\\u5272\\u5F53\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=\\u52D8\\u5B9A\\u8A2D\\u5B9A\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=\\u30AB\\u30C6\\u30B4\\u30EA\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=G/L \\u52D8\\u5B9A\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=\\u672A\\u5B9A\\u7FA9\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=\\u30AA\\u30D6\\u30B8\\u30A7\\u30AF\\u30C8\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=\\u539F\\u4FA1\\u30BB\\u30F3\\u30BF\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=WBS \\u8981\\u7D20\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=\\u30CD\\u30C3\\u30C8\\u30EF\\u30FC\\u30AF\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=\\u767A\\u6CE8\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=\\u53D7\\u6CE8\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=\\u8CC7\\u7523\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=\\u5916\\u6CE8\n\n# XFLD: Components\nview.PurchaseRequisition.components=\\u69CB\\u6210\\u54C1\\u76EE\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=\\u6A19\\u6E96\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=\\u4ED5\\u5165\\u5148\\u76F4\\u9001\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=\\u53D7\\u8A17\\u54C1/\\u9810\\u8A17\\u54C1\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=\\u30B7\\u30A7\\u30A2\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=\\u30B5\\u30FC\\u30D3\\u30B9\\u884C\\u306A\\u3057\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=\\u5236\\u9650\\u306A\\u3057\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=\\u30C6\\u30AD\\u30B9\\u30C8\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=\\u4FA1\\u683C\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=\\u8CFC\\u8CB7\\u4F9D\\u983C\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=\\u54C1\\u76EE\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=\\u30B5\\u30FC\\u30D3\\u30B9\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=\\u88FD\\u54C1\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=\\u88FD\\u54C1\\u8A73\\u7D30\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=\\u51FA\\u8377\\u65E5\\u4ED8\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=\\u7D0D\\u5165\\u65E5\\u4ED8\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=\\u4EE5\\u964D\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=\\u4F4F\\u6240\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=\\u7D0D\\u5165\\u5148\\u4F4F\\u6240\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=\\u30D7\\u30E9\\u30F3\\u30C8\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=\\u5F97\\u610F\\u5148\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=\\u540D\\u79F0\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=\\u5236\\u9650\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=\\u6570\\u91CF\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=\\u660E\\u7D30\\u30AB\\u30C6\\u30B4\\u30EA\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=\\u4ED5\\u5165\\u5148\\u540D\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=\\u9650\\u5EA6\\u984D\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=\\u7121\\u5236\\u9650\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=\\u898B\\u8FBC\\u91D1\\u984D\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=\\u30B5\\u30FC\\u30D3\\u30B9\\u30B0\\u30EB\\u30FC\\u30D7\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=\\u54C1\\u76EE\\u30B0\\u30EB\\u30FC\\u30D7\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=\\u5358\\u4FA1\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=/\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=\\u30E6\\u30CB\\u30C3\\u30C8\\u5225\\u4FA1\\u683C\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=\\u4ED5\\u5165\\u5148\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=\\u8EE2\\u9001\\u8005\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=\\u6B21\\u306E\\u627F\\u8A8D\\u8005\\u306E\\u4EE3\\u884C\\:\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=\\u672A\\u5272\\u5F53\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=\\u30C6\\u30AD\\u30B9\\u30C8\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=\\u5C0F\\u8A08\n\n# YMSG\ndialog.question.approve={0} \\u304B\\u3089\\u9001\\u4FE1\\u3055\\u308C\\u305F\\u8CFC\\u8CB7\\u4F9D\\u983C\\u3092\\u627F\\u8A8D\\u3057\\u307E\\u3059\\u304B\\u3002\n\n# YMSG\ndialog.question.reject={0} \\u304B\\u3089\\u9001\\u4FE1\\u3055\\u308C\\u305F\\u8CFC\\u8CB7\\u4F9D\\u983C\\u3092\\u5374\\u4E0B\\u3057\\u307E\\u3059\\u304B\\u3002\n\n# YMSG\ndialog.success.approve=\\u8CFC\\u8CB7\\u4F9D\\u983C\\u304C\\u627F\\u8A8D\\u3055\\u308C\\u307E\\u3057\\u305F\n\n# YMSG\ndialog.success.reject=\\u8CFC\\u8CB7\\u4F9D\\u983C\\u304C\\u5374\\u4E0B\\u3055\\u308C\\u307E\\u3057\\u305F\n\n# YMSG\ndialog.success.forward=\\u8CFC\\u8CB7\\u4F9D\\u983C\\u304C {0} \\u306B\\u8EE2\\u9001\\u3055\\u308C\\u307E\\u3057\\u305F\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=\\u627F\\u8A8D\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=\\u5374\\u4E0B\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=\\u3053\\u306E\\u8CFC\\u8CB7\\u4F9D\\u983C\\u306E\\u627F\\u8A8D\\u307E\\u305F\\u306F\\u5374\\u4E0B\\u306F\\u73FE\\u5728\\u3082\\u51E6\\u7406\\u4E2D\\u3067\\u3059\\u3002\\u8CFC\\u8CB7\\u4F9D\\u983C\\u306E\\u4E00\\u89A7\\u3092\\u30DE\\u30CB\\u30E5\\u30A2\\u30EB\\u3067\\u30EA\\u30D5\\u30EC\\u30C3\\u30B7\\u30E5\\u3059\\u308B\\u3053\\u3068\\u304C\\u3067\\u304D\\u307E\\u3059\\u3002\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=\\u5229\\u76CA\\u30BB\\u30F3\\u30BF\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=\\u627F\\u8A8D\n\n#XBUT: Button for Reject action\nXBUT_REJECT=\\u5374\\u4E0B\n\n#XBUT: Button for forward action\nXBUT_FORWARD=\\u8EE2\\u9001\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=\\u4E2D\\u6B62\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=\\u30D0\\u30A4\\u30C8\n\n# YMSG: File Size Unit\nFileSize.Bytes=\\u30D0\\u30A4\\u30C8\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=\\u30D5\\u30A1\\u30A4\\u30EB\\u30B5\\u30A4\\u30BA\\u304C\\u5927\\u304D\\u3059\\u304E\\u307E\\u3059\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=\\u30E1\\u30E2\\u8FFD\\u52A0 (\\u30AA\\u30D7\\u30B7\\u30E7\\u30F3)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=\\u672C\\u65E5\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 \\u65E5\\u524D\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} \\u65E5\\u524D\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=\\u30ED\\u30FC\\u30C9\\u4E2D...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u73FE\\u5728\\u5229\\u7528\\u3067\\u304D\\u308B\\u30A2\\u30A4\\u30C6\\u30E0\\u306F\\u3042\\u308A\\u307E\\u305B\\u3093\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_no.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=Innkj\\u00F8psrekvisisjon\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Innkj\\u00F8psrekvisisjon\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=Innkj\\u00F8psrekvisisjon\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=Grense\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=Vare {0} av {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=Tjenestelinje {0} av {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Tjenestelinje {0} av {1} - vare {2} av {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Vare {0} av {1} - grense\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=Tjenestelinjer\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=Tjenestelinjer ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=Kontering\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=Delsum\n\n# XTIT: Header text of Master List\nview.Master.title=Innkj\\u00F8psrekvisisjoner ({0})\n\n# XTIT: Application name\napp.Identity=Godkjenn innkj\\u00F8psrekvisisjoner\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Godkjenn innkj\\u00F8psrekvisisjoner\n\n#XTIT: Shell title \nSHELL_TITLE=Godkjenn innkj\\u00F8psrekvisisjoner\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=Medarbeiderdetaljer\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=Leverand\\u00F8rdetaljer\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=Informasjon\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=Informasjon\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=Beskrivelse\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=Beskrivelse\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=Vedlegg\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=Merknader\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=Ingen posisjoner\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=Varer ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=Multitilordninger\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=Kontering\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=Kategori\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=Artskonto\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=Ukjent\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=Objekter\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=Kostnadssted\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=WBS-element\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=Nettverk\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=Ordre\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=Kundeordre\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=Anleggsmiddel\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=Leieproduksjon\n\n# XFLD: Components\nview.PurchaseRequisition.components=Komponenter\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=Normal\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=Tredjepartsordrebehandling\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=Konsignasjon\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=Andel\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=Ingen tjenestelinjer\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=Ingen grenser\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=Beskrivelse\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=Pris\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=Innkj\\u00F8psrekvisisjon\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=Material\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=Tjeneste\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=Produkt\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=Produktdetaljer\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=Leveringsdato\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=Levering den\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=og senere\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=Adresse\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=Leveringsadresse\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=Fabrikk\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=Kunde\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=Navn\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=Grense\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=Kvantum\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=Posisjonskategori\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=Leverand\\u00F8rnavn\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=Grenseverdi\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=Ubegrenset\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=Forventet verdi\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=Tjenestegruppe\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=Varegruppe\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=Stykkpris\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=per\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=Stykkpris\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=Leverand\\u00F8r\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=Videresendt av\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=Stedfortreder for\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=Ikke tilordnet\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=Beskrivelse\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=Delsum\n\n# YMSG\ndialog.question.approve=Godkjenne innkj\\u00F8psrekvisisjonen fra {0}?\n\n# YMSG\ndialog.question.reject=Avvise innkj\\u00F8psrekvisisjonen fra {0}?\n\n# YMSG\ndialog.success.approve=Innkj\\u00F8psrekvisisjon godkjent\n\n# YMSG\ndialog.success.reject=Innkj\\u00F8psrekvisisjon avvist\n\n# YMSG\ndialog.success.forward=Innkj\\u00F8psrekvisisjonen er videresendt til {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Godkjenn\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Avvis\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Godkjenning eller avvisning av denne innkj\\u00F8psrekvisisjonen p\\u00E5g\\u00E5r fortsatt. Du kan oppdatere listen over innkj\\u00F8psrekvisisjoner manuelt.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=Profit center\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Godkjenn\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Avvis\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Viderekoble\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Avbryt\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=Byte\n\n# YMSG: File Size Unit\nFileSize.Bytes=Byte\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=KB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Filen er for stor\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Tilf\\u00F8y merknad (valgfritt)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=I dag\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=For \\u00E9n dag siden\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} dager siden\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Laster ...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Ingen elementer er for \\u00F8yeblikket tilgjengelige\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_pl.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=Zg\\u0142oszenie zapotrzebowania\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Zg\\u0142oszenie zapotrzebowania\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=Zg\\u0142oszenie zapotrzebowania\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=Limit\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=Pozycja {0} z {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=Linia us\\u0142ugi {0} z {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Linia us\\u0142ugi {0} z {1} - pozycja {2} z {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Pozycja {0} z {1} - limit\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=Linie us\\u0142ugi\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=Linie us\\u0142ugi ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=Dekretacja\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=Suma cz\\u0119\\u015Bciowa\n\n# XTIT: Header text of Master List\nview.Master.title=Zg\\u0142oszenia zapotrzebowania ({0})\n\n# XTIT: Application name\napp.Identity=Zatwierdzanie zg\\u0142osze\\u0144 zapotrzebowania\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Zatwierdzanie zg\\u0142osze\\u0144 zapotrzebowania\n\n#XTIT: Shell title \nSHELL_TITLE=Zatwierdzanie zg\\u0142osze\\u0144 zapotrzebowania\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=Szczeg\\u00F3\\u0142y pracownika\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=Szczeg\\u00F3\\u0142y dostawcy\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=Informacja\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=Informacja\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=Opis\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=Opis\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=Za\\u0142\\u0105czniki\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=Notatki\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=Brak pozycji\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=Pozycje ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=Kilka przypisa\\u0144\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=Dekretacja\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=Kategoria\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=Konto KG\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=Nieznane\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=Obiekty\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=Miejsce powstawania koszt\\u00F3w\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=Element PSP\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=Sie\\u0107\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=Zlecenie\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=Zlecenie klienta\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=Aktywa\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=Podwykonawstwo\n\n# XFLD: Components\nview.PurchaseRequisition.components=Sk\\u0142adniki\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=Standard\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=Strona trzecia\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=Konsygnacja\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=Udzia\\u0142\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=Brak linii us\\u0142ugi\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=Brak limit\\u00F3w\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=Opis\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=Cena\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=Zg\\u0142oszenie zapotrzebowania\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=Materia\\u0142\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=Us\\u0142uga\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=Produkt\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=Szczeg\\u00F3\\u0142y produktu\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=Data dostawy\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=Dostawa dnia\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=i p\\u00F3\\u017Aniej\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=Adres\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=Adres dostawy\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=Zak\\u0142ad\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=Klient\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=Nazwa\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=Limit\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=Ilo\\u015B\\u0107\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=Typ pozycji\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=Nazwa dostawcy\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=Warto\\u015B\\u0107 graniczna\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=Nieograniczone\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=Warto\\u015B\\u0107 oczekiwana\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=Grupa us\\u0142ug\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=Grupa materia\\u0142owa\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=Cena jednostkowa\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=na\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=Cena jednostkowa\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=Dostawca\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=Przekazane przez\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=Zast\\u0119pstwo za\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=Nieprzypisane\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=Opis\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=Suma cz\\u0119\\u015Bciowa\n\n# YMSG\ndialog.question.approve=Czy zatwierdzi\\u0107 zg\\u0142oszenie zapotrzebowania wys\\u0142ane przez {0}?\n\n# YMSG\ndialog.question.reject=Czy odrzuci\\u0107 zg\\u0142oszenie zapotrzebowania wys\\u0142ane przez {0}?\n\n# YMSG\ndialog.success.approve=Zatwierdzono zg\\u0142oszenie zapotrzebowania\n\n# YMSG\ndialog.success.reject=Odrzucono zg\\u0142oszenie zapotrzebowania\n\n# YMSG\ndialog.success.forward=Zg\\u0142oszenie zapotrzebowania przekazano do {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Zatwierdzanie\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Odrzucanie\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Zatwierdzanie lub odrzucanie tego zg\\u0142oszenia zapotrzebowania jest nadal w toku. Mo\\u017Cesz r\\u0119cznie od\\u015Bwie\\u017Cy\\u0107 list\\u0119 zg\\u0142osze\\u0144 zapotrzebowa\\u0144.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=Centrum zysku\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Zatwierd\\u017A\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Odrzu\\u0107\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Przeka\\u017C dalej\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Anuluj\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=Bajt\n\n# YMSG: File Size Unit\nFileSize.Bytes=Bajty\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Plik jest za du\\u017Cy\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Dodaj notatk\\u0119 (opcjonalne)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Dzisiaj\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=Wczoraj\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} dni temu\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Wczytywanie...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Obecnie brak dost\\u0119pnych pozycji\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_pt.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=Requisi\\u00E7\\u00E3o de compra\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Requisi\\u00E7\\u00E3o de compra\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=Requisi\\u00E7\\u00E3o de compra\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=Limite\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=Item {0} de {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=Linha de servi\\u00E7o {0} de {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Linha de servi\\u00E7o {0} de {1} - Item {2} de {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Item {0} de {1} - Limite\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=Linhas de servi\\u00E7o\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=Linhas de servi\\u00E7o ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=Classifica\\u00E7\\u00E3o cont\\u00E1bil\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=Subtotal\n\n# XTIT: Header text of Master List\nview.Master.title=Requisi\\u00E7\\u00F5es de compra ({0})\n\n# XTIT: Application name\napp.Identity=Aprovar requisi\\u00E7\\u00F5es\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Aprovar requisi\\u00E7\\u00F5es\n\n#XTIT: Shell title \nSHELL_TITLE=Aprovar requisi\\u00E7\\u00F5es\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=Detalhes do funcion\\u00E1rio\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=Detalhes do fornecedor\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=Informa\\u00E7\\u00E3o\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=Informa\\u00E7\\u00E3o\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=Descri\\u00E7\\u00E3o\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=Descri\\u00E7\\u00E3o\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=Anexos\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=Observa\\u00E7\\u00F5es\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=Nenhum item\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=Itens ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=V\\u00E1rias atribui\\u00E7\\u00F5es\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=Classifica\\u00E7\\u00E3o cont\\u00E1bil\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=Categoria\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=Conta do Raz\\u00E3o\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=Desconhecidos\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=Objetos\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=Centro de custo\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=Elemento PEP\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=Rede\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=Pedido\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=Ordem do cliente\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=Ativo\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=Subcontrata\\u00E7\\u00E3o\n\n# XFLD: Components\nview.PurchaseRequisition.components=Componentes\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=Padr\\u00E3o\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=Fornecimento direto a terceiros\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=Consigna\\u00E7\\u00E3o\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=Parte\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=Nenhuma linha de servi\\u00E7o\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=Sem limites\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=Descri\\u00E7\\u00E3o\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=Pre\\u00E7o\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=Requisi\\u00E7\\u00E3o de compra\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=Material\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=Servi\\u00E7o\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=Produto\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=Detalhes do produto\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=Data de entrega\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=Fornecimento em\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=e posteriores\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=Endere\\u00E7o\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=Endere\\u00E7o de entrega\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=Centro\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=Cliente\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=Nome\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=Limite\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=Quantidade\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=Categoria do item\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=Nome do fornecedor\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=Valor-limite\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=Ilimitado\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=Valor previsto\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=Grupo de servi\\u00E7os\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=Grupo de mercadorias\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=Pre\\u00E7o por unidade\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=por\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=Pre\\u00E7o por unidade\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=Fornecedor\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=Encaminhado por\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=Substituto para\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=n\\u00E3o atribu\\u00EDdo\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=Descri\\u00E7\\u00E3o\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=Subtotal\n\n# YMSG\ndialog.question.approve=Aprovar requisi\\u00E7\\u00E3o de compra enviada por {0}?\n\n# YMSG\ndialog.question.reject=Rejeitar requisi\\u00E7\\u00E3o de compra enviada por {0}?\n\n# YMSG\ndialog.success.approve=Requisi\\u00E7\\u00E3o de compra aprovada\n\n# YMSG\ndialog.success.reject=Requisi\\u00E7\\u00E3o de compra rejeitada\n\n# YMSG\ndialog.success.forward=Requisi\\u00E7\\u00E3o de compra encaminhada para {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Aprovar\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Rejeitar\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Aprova\\u00E7\\u00E3o ou rejei\\u00E7\\u00E3o desta requisi\\u00E7\\u00E3o ainda em processo. Voc\\u00EA pode atualizar a lista de requisi\\u00E7\\u00F5es manualmente.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=Centro de lucro\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Aprovar\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Rejeitar\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Encaminhar\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Anular\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=Byte\n\n# YMSG: File Size Unit\nFileSize.Bytes=Bytes\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Arquivo muito grande\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Inserir observa\\u00E7\\u00E3o (opcional)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Hoje\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 dia atr\\u00E1s\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} dias atr\\u00E1s\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Carregando...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Nenhum item atualmente dispon\\u00EDvel\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_ro.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=Referat de necesitate\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Referat de necesitate\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=Referat de necesitate\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=Limit\\u0103\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=Pozi\\u0163ie {0} din {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=Linie de serviciu {0} din {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Linie de serviciu {0} din {1} - Pozi\\u0163ie {2} din {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Pozi\\u0163ie {0} din {1} - limit\\u0103\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=Linii de serviciu\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=Linii de serviciu ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=Alocare cont\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=Subtotal\n\n# XTIT: Header text of Master List\nview.Master.title=Referate de necesitate ({0})\n\n# XTIT: Application name\napp.Identity=Arobare referate de necesitate\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Arobare referate de necesitate\n\n#XTIT: Shell title \nSHELL_TITLE=Arobare referate de necesitate\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=Detalii angajat\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=Detalii furnizor\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=Informa\\u0163ii\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=Informa\\u0163ii\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=Descriere\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=Descriere\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=Anexe\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=Note\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=F\\u0103r\\u0103 pozi\\u0163ii\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=Pozi\\u0163ii ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=Aloc\\u0103ri multiple\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=Alocare cont\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=Categorie\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=Cont de CM\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=Necunoscut\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=Obiecte\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=Centru de cost\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=Element SDA\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=Re\\u0163ea\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=Comand\\u0103\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=Comand\\u0103 de v\\u00E2nz\\u0103ri\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=Imobilizare\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=Subcontractare\n\n# XFLD: Components\nview.PurchaseRequisition.components=Componente\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=Standard\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=Livrare direct\\u0103 la ter\\u0163i\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=Custodie\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=Partajare\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=F\\u0103r\\u0103 linii de serviciu\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=F\\u0103r\\u0103 limite\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=Descriere\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=Pre\\u0163\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=Referat de necesitate\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=Material\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=Serviciu\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=Produs\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=Detalii produs\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=Dat\\u0103 livrare\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=Livrare pe\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=\\u015Fi ulterior\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=Adres\\u0103\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=Adres\\u0103 de livrare\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=Unitate logistic\\u0103\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=Client\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=Nume\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=Limit\\u0103\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=Cantitate\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=Categorie pozi\\u0163ie\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=Nume furnizor\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=Valoare limit\\u0103\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=Nelimitat\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=Valoare prev\\u0103zut\\u0103\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=Grup de servicii\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=Grup materiale\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=Pre\\u0163 pe unitate\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=per\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=Pre\\u0163 per unitate\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=Furnizor\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=Redirec\\u0163ionat de\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=\\u00CEnlocuitor pt.\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=Nealocat\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=Descriere\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=Subtotal\n\n# YMSG\ndialog.question.approve=Aproba\\u0163i referatul de necesitate transmis de {0}?\n\n# YMSG\ndialog.question.reject=Respinge\\u0163i referatul de necesitate transmis de {0}?\n\n# YMSG\ndialog.success.approve=Referatul de necesitate a fost aprobat\n\n# YMSG\ndialog.success.reject=Referatul de necesitate a fost respins\n\n# YMSG\ndialog.success.forward=Referatul de necesitate a fost redirec\\u0163ionat la {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Aprobare\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Respingere\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Aprobarea sau respingerea pt.acest referat de necesitate \\u00EEnc\\u0103 este \\u00EEn curs. Pute\\u0163i \\u00EEmprosp\\u0103ta manual lista de referate de necesitate.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=Centru de profit\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Aprobare\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Respingere\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Redirec\\u0163ionare\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Anulare\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=Byte\n\n# YMSG: File Size Unit\nFileSize.Bytes=Bytes\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Fi\\u015Fierul este prea mare\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Ad\\u0103ugare not\\u0103 (op\\u0163ional)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Ast\\u0103zi\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=\\u00CEn urm\\u0103 cu 1 zi\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=\\u00CEn urm\\u0103 cu {0} zile\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=\\u00CEnc\\u0103rcare ...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u00CEn prezent nu sunt disponibile pozi\\u0163ii\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_ru.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=\\u041B\\u0438\\u043C\\u0438\\u0442\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=\\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F {0} \\u0438\\u0437 {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=\\u0421\\u0442\\u0440\\u043E\\u043A\\u0430 \\u0443\\u0441\\u043B\\u0443\\u0433\\u0438 {0} \\u0438\\u0437 {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=\\u0421\\u0442\\u0440\\u043E\\u043A\\u0430 \\u0443\\u0441\\u043B\\u0443\\u0433\\u0438 {0} \\u0438\\u0437 {1} - \\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F {2} \\u0438\\u0437 {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=\\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F {0} \\u0438\\u0437 {1} - \\u043B\\u0438\\u043C\\u0438\\u0442\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=\\u0421\\u0442\\u0440\\u043E\\u043A\\u0438 \\u0443\\u0441\\u043B\\u0443\\u0433\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=\\u0421\\u0442\\u0440\\u043E\\u043A\\u0438 \\u0443\\u0441\\u043B\\u0443\\u0433 ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=\\u041A\\u043E\\u043D\\u0442\\u0438\\u0440\\u043E\\u0432\\u043A\\u0430\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=\\u041F\\u043E\\u0434\\u044B\\u0442\\u043E\\u0433\n\n# XTIT: Header text of Master List\nview.Master.title=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0438 ({0})\n\n# XTIT: Application name\napp.Identity=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0437\\u0430\\u044F\\u0432\\u043E\\u043A\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0437\\u0430\\u044F\\u0432\\u043E\\u043A\n\n#XTIT: Shell title \nSHELL_TITLE=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0437\\u0430\\u044F\\u0432\\u043E\\u043A\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0430\\u044F \\u0438\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\\u0430\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=\\u041F\\u043E\\u0441\\u0442\\u0430\\u0432\\u0449\\u0438\\u043A \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=\\u0418\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=\\u0418\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=\\u0412\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=\\u0417\\u0430\\u043C\\u0435\\u0442\\u043A\\u0438\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=\\u041D\\u0435\\u0442 \\u044D\\u043B\\u0435\\u043C\\u0435\\u043D\\u0442\\u043E\\u0432\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=\\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0438 ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=\\u041C\\u043D\\u043E\\u0436\\u0435\\u0441\\u0442\\u0432\\u0435\\u043D\\u043D\\u044B\\u0435 \\u043A\\u043E\\u043D\\u0442\\u0438\\u0440\\u043E\\u0432\\u043A\\u0438\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=\\u041A\\u043E\\u043D\\u0442\\u0438\\u0440\\u043E\\u0432\\u043A\\u0430\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=\\u041A\\u0430\\u0442\\u0435\\u0433\\u043E\\u0440\\u0438\\u044F\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=\\u041E\\u0441\\u043D\\u043E\\u0432\\u043D\\u043E\\u0439 \\u0441\\u0447\\u0435\\u0442\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=\\u041D\\u0435\\u0438\\u0437\\u0432\\u0435\\u0441\\u0442\\u043D\\u043E\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=\\u041E\\u0431\\u044A\\u0435\\u043A\\u0442\\u044B\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=\\u041C\\u0412\\u0417\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=\\u0421\\u041F\\u041F-\\u044D\\u043B\\u0435\\u043C\\u0435\\u043D\\u0442\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=\\u0421\\u0435\\u0442\\u0435\\u0432\\u043E\\u0439 \\u0433\\u0440\\u0430\\u0444\\u0438\\u043A\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=\\u0417\\u0430\\u043A\\u0430\\u0437\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=\\u0417\\u0430\\u043A\\u0430\\u0437 \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0430\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=\\u0410\\u043A\\u0442\\u0438\\u0432\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=\\u041E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u043A\\u0430 \\u0434\\u0430\\u0432\\u0430\\u043B\\u044C\\u0447\\u0435\\u0441\\u043A\\u043E\\u0433\\u043E \\u043C\\u0430\\u0442\\u0435\\u0440\\u0438\\u0430\\u043B\\u0430\n\n# XFLD: Components\nview.PurchaseRequisition.components=\\u041A\\u043E\\u043C\\u043F\\u043E\\u043D\\u0435\\u043D\\u0442\\u044B\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=\\u0421\\u0442\\u0430\\u043D\\u0434\\u0430\\u0440\\u0442\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=\\u0422\\u0440\\u0435\\u0442\\u044C\\u0435 \\u043B\\u0438\\u0446\\u043E\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=\\u041A\\u043E\\u043D\\u0441\\u0438\\u0433\\u043D\\u0430\\u0446\\u0438\\u044F\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=\\u0414\\u043E\\u043B\\u044F\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=\\u041D\\u0435\\u0442 \\u0441\\u0442\\u0440\\u043E\\u043A \\u0443\\u0441\\u043B\\u0443\\u0433\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=\\u041D\\u0435\\u0442 \\u043B\\u0438\\u043C\\u0438\\u0442\\u043E\\u0432\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=\\u0426\\u0435\\u043D\\u0430\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=\\u041C\\u0430\\u0442\\u0435\\u0440\\u0438\\u0430\\u043B\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=\\u0423\\u0441\\u043B\\u0443\\u0433\\u0430\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=\\u041F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=\\u041F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442 \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=\\u0414\\u0430\\u0442\\u0430 \\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0438\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=\\u0414\\u0430\\u0442\\u0430 \\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0438\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=\\u0438 \\u043F\\u043E\\u0437\\u0436\\u0435\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=\\u0410\\u0434\\u0440\\u0435\\u0441\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=\\u0410\\u0434\\u0440\\u0435\\u0441 \\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0438\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=\\u0417\\u0430\\u0432\\u043E\\u0434\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=\\u0418\\u043C\\u044F\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=\\u041B\\u0438\\u043C\\u0438\\u0442\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=\\u041A\\u043E\\u043B\\u0438\\u0447\\u0435\\u0441\\u0442\\u0432\\u043E\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=\\u0422\\u0438\\u043F \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0438\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=\\u0418\\u043C\\u044F \\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u0449\\u0438\\u043A\\u0430\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=\\u041F\\u0440\\u0435\\u0434\\u0435\\u043B\\u044C\\u043D\\u0430\\u044F \\u0441\\u0442\\u043E\\u0438\\u043C\\u043E\\u0441\\u0442\\u044C\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=\\u0411\\u0435\\u0437 \\u043E\\u0433\\u0440\\u0430\\u043D\\u0438\\u0447\\u0435\\u043D\\u0438\\u044F\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=\\u041E\\u0436\\u0438\\u0434\\u0430\\u0435\\u043C\\u0430\\u044F \\u0441\\u0442\\u043E\\u0438\\u043C\\u043E\\u0441\\u0442\\u044C\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=\\u0413\\u0440\\u0443\\u043F\\u043F\\u0430 \\u0443\\u0441\\u043B\\u0443\\u0433\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=\\u0413\\u0440\\u0443\\u043F\\u043F\\u0430 \\u043C\\u0430\\u0442\\u0435\\u0440\\u0438\\u0430\\u043B\\u043E\\u0432\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=\\u0426\\u0435\\u043D\\u0430 \\u0437\\u0430 \\u0435\\u0434\\u0438\\u043D\\u0438\\u0446\\u0443\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=\\u0437\\u0430\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=\\u0426\\u0435\\u043D\\u0430 \\u0437\\u0430 \\u0435\\u0434\\u0438\\u043D\\u0438\\u0446\\u0443\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=\\u041F\\u043E\\u0441\\u0442\\u0430\\u0432\\u0449\\u0438\\u043A\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=\\u041F\\u0435\\u0440\\u0435\\u0430\\u0434\\u0440\\u0435\\u0441\\u043E\\u0432\\u0430\\u043D\\u043E\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=\\u0417\\u0430\\u043C\\u0435\\u0441\\u0442\\u0438\\u0442\\u0435\\u043B\\u044C \\u0434\\u043B\\u044F\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=\\u041D\\u0435 \\u043F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0435\\u043D\\u043E\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=\\u041F\\u043E\\u0434\\u044B\\u0442\\u043E\\u0433\n\n# YMSG\ndialog.question.approve=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C \\u0437\\u0430\\u044F\\u0432\\u043A\\u0443, \\u043F\\u043E\\u043B\\u0443\\u0447\\u0435\\u043D\\u043D\\u0443\\u044E \\u043E\\u0442 {0}?\n\n# YMSG\ndialog.question.reject=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C \\u0437\\u0430\\u044F\\u0432\\u043A\\u0443, \\u043F\\u043E\\u043B\\u0443\\u0447\\u0435\\u043D\\u043D\\u0443\\u044E \\u043E\\u0442 {0}?\n\n# YMSG\ndialog.success.approve=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0430\n\n# YMSG\ndialog.success.reject=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0435\\u043D\\u0430\n\n# YMSG\ndialog.success.forward=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043F\\u0435\\u0440\\u0435\\u043D\\u0430\\u043F\\u0440\\u0430\\u0432\\u043B\\u0435\\u043D\\u0430 \\u043A {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0438\\u043B\\u0438 \\u043E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0435\\u043D\\u0438\\u0435 \\u044D\\u0442\\u043E\\u0439 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0438 \\u0432\\u0441\\u0435 \\u0435\\u0449\\u0435 \\u0432 \\u043E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u043A\\u0435. \\u0421\\u043F\\u0438\\u0441\\u043E\\u043A \\u0437\\u0430\\u044F\\u0432\\u043E\\u043A \\u043C\\u043E\\u0436\\u043D\\u043E \\u043E\\u0431\\u043D\\u043E\\u0432\\u0438\\u0442\\u044C \\u0432\\u0440\\u0443\\u0447\\u043D\\u0443\\u044E.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=\\u041C\\u0435\\u0441\\u0442\\u043E \\u0432\\u043E\\u0437\\u043D\\u0438\\u043A\\u043D\\u043E\\u0432\\u0435\\u043D\\u0438\\u044F \\u043F\\u0440\\u0438\\u0431\\u044B\\u043B\\u0438\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=\\u041E\\u041A\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C\n\n#XBUT: Button for Reject action\nXBUT_REJECT=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C\n\n#XBUT: Button for forward action\nXBUT_FORWARD=\\u041F\\u0435\\u0440\\u0435\\u0430\\u0434\\u0440\\u0435\\u0441\\u043E\\u0432\\u0430\\u0442\\u044C\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=\\u0411\\u0430\\u0439\\u0442\n\n# YMSG: File Size Unit\nFileSize.Bytes=\\u0411\\u0430\\u0439\\u0442\\u044B\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=\\u041A\\u0411\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=\\u041C\\u0411\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=\\u0413\\u0411\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=\\u0422\\u0411\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=\\u041F\\u0411\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=\\u042D\\u0411\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=\\u0417\\u0411\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=\\u0419\\u0411\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=\\u0424\\u0430\\u0439\\u043B \\u0441\\u043B\\u0438\\u0448\\u043A\\u043E\\u043C \\u0431\\u043E\\u043B\\u044C\\u0448\\u043E\\u0439\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u043F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435 (\\u043E\\u043F\\u0446\\u0438\\u043E\\u043D\\u0430\\u043B\\u044C\\u043D\\u043E)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=\\u0421\\u0435\\u0433\\u043E\\u0434\\u043D\\u044F\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 \\u0434\\u0435\\u043D\\u044C \\u043D\\u0430\\u0437\\u0430\\u0434\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} \\u0434\\u043D. \\u043D\\u0430\\u0437\\u0430\\u0434\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0430...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u0412 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0439 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442 \\u043D\\u0435\\u0442 \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\\u0445 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0439\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_sh.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=Zahtev za nabavku\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Zahtev za nabavku\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=Zahtev za nabavku\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=Ograni\\u010Denje\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=Stavka {0} od {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=Red usluga {0} od {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Red usluga {0} od {1} - Stavka {2} od {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Stavka {0} od {1} - Ograni\\u010Denje\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=Redovi usluge\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=Redovi usluga ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=Dodela ra\\u010Duna\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=Me\\u0111uzbir\n\n# XTIT: Header text of Master List\nview.Master.title=Zahtevi za nabavku ({0})\n\n# XTIT: Application name\napp.Identity=Odobri zahteve za nabavku\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Odobri zahteve za nabavku\n\n#XTIT: Shell title \nSHELL_TITLE=Odobri zahteve za nabavku\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=Detalji o zaposlenom\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=Detalji dobavlja\\u010Da\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=Informacije\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=Informacije\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=Opis\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=Opis\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=Dodaci\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=Bele\\u0161ke\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=Nema stavki\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=Stavke ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=Vi\\u0161estruke dodele\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=Dodela ra\\u010Duna\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=Kategorija\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=Ra\\u010Dun glavne knjige\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=Nepoznato\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=Objekti\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=Mesto tro\\u0161ka\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=Element plana strukture projekta\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=Mre\\u017Ea\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=Nalog\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=Prodajni nalog\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=Sredstvo\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=Podugovaranje\n\n# XFLD: Components\nview.PurchaseRequisition.components=Komponente\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=Standardno\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=Tre\\u0107a strana\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=Konsignacija\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=Podeli\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=Nema redova usluge\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=Nema ograni\\u010Denja\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=Opis\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=Cena\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=Zahtev za nabavku\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=Materijal\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=Usluga\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=Proizvod\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=Detalji proizvoda\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=Datum isporuke\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=Isporuka\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=i kasnije\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=Adresa\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=Adresa isporuke\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=Pogon\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=Kupac\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=Ime\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=Ograni\\u010Denje\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=Koli\\u010Dina\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=Kategorija stavke\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=Naziv dobavlja\\u010Da\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=Grani\\u010Dna vrednost\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=Neograni\\u010Deno\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=O\\u010Dekivana vrednost\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=Grupa usluga\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=Grupa materijala\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=Cena po jedinici\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=po\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=Cena po jedinici\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=Dobavlja\\u010D\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=Prosledio\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=Zamena za\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=Nije dodeljeno\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=Opis\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=Me\\u0111uzbir\n\n# YMSG\ndialog.question.approve=Odobriti zahtev za nabavku koji je podneo {0}?\n\n# YMSG\ndialog.question.reject=Odbiti zahtev za nabavku koji je podneo {0}?\n\n# YMSG\ndialog.success.approve=Zahtev za nabavku je odobren\n\n# YMSG\ndialog.success.reject=Zahtev za nabavku je odbijen\n\n# YMSG\ndialog.success.forward=Zahtev za nabavku je prosle\\u0111en {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Odobri\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Odbij\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Odobrenje ili odbijanje ovog zahteva za nabavku je jo\\u0161 uvek u toku. Mo\\u017Eete ru\\u010Dno da osve\\u017Eite listu zahteva za nabavku.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=Profitni centar\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Odobri\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Odbij\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Prosledi\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Odustani\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=Bajt\n\n# YMSG: File Size Unit\nFileSize.Bytes=Bajtovi\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Fajl je prevelik\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Dodaj bele\\u0161ku (izborno)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Danas\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=Pre jednog dana\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=Pre {0} dana\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=U\\u010Ditavanje...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Stavke trenutno nisu dostupne\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_sk.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=Po\\u017Eiadavka na objedn\\u00E1vku\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Po\\u017Eiadavka na objedn\\u00E1vku\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=Po\\u017Eiadavka na objedn\\u00E1vku\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=Limit\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=Polo\\u017Eka {0} z {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=Riadok slu\\u017Eby {0} z {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Riadok slu\\u017Eby {0} z {1} - polo\\u017Eka {2} z {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Polo\\u017Eka {0} z {1} - limit\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=Riadky slu\\u017Eieb\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=Riadky slu\\u017Eieb ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=Priradenie \\u00FA\\u010Dtu\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=Medzis\\u00FA\\u010Det\n\n# XTIT: Header text of Master List\nview.Master.title=Po\\u017Eiadavky na objedn\\u00E1vku ({0})\n\n# XTIT: Application name\napp.Identity=Schva\\u013Eovanie po\\u017Eiadaviek na objedn\\u00E1vku\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Schva\\u013Eovanie po\\u017Eiadaviek na objedn\\u00E1vku\n\n#XTIT: Shell title \nSHELL_TITLE=Schva\\u013Eovanie po\\u017Eiadaviek na objedn\\u00E1vku\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=Detaily zamestnanca\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=Detaily dod\\u00E1vate\\u013Ea\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=Inform\\u00E1cie\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=Inform\\u00E1cie\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=Popis\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=Popis\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=Pr\\u00EDlohy\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=Pozn\\u00E1mky\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=\\u017Diadne polo\\u017Eky\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=Polo\\u017Eky ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=Viacn\\u00E1sobn\\u00E9 priradenia\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=Priradenie \\u00FA\\u010Dtu\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=Kateg\\u00F3ria\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=\\u00DA\\u010Det hlavnej knihy\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=Nezn\\u00E1me\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=Objekty\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=N\\u00E1kladov\\u00E9 stredisko\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=Prvok \\u0160PP\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=Sie\\u0165.diagram\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=Z\\u00E1kazka\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=Z\\u00E1kazka odberate\\u013Ea\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=Dlhodob\\u00FD majetok\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=Pr\\u00E1ca za mzdu\n\n# XFLD: Components\nview.PurchaseRequisition.components=Komponenty\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=\\u0160tandard\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=Tretia strana\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=Konsign\\u00E1cia\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=Podiel\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=\\u017Diadne riadky v\\u00FDkonu\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=\\u017Diadne limity\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=Popis\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=Cena\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=Po\\u017Eiadavka na objedn\\u00E1vku\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=Materi\\u00E1l\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=Slu\\u017Eba\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=Produkt\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=Detaily produktu\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=D\\u00E1tum dod\\u00E1vky\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=D\\u00E1tum dodania\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=a nesk\\u00F4r\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=Adresa\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=Dodacia adresa\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=Z\\u00E1vod\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=Z\\u00E1kazn\\u00EDk\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=N\\u00E1zov\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=Limit\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=Mno\\u017Estvo\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=Kateg\\u00F3ria polo\\u017Eky\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=N\\u00E1zov dod\\u00E1vate\\u013Ea\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=Hodnota limitu\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=Neobmedzen\\u00E9\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=O\\u010Dak\\u00E1van\\u00E1 hodnota\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=Skupina slu\\u017Eieb\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=Skupina materi\\u00E1lu\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=Jednotkov\\u00E1 cena\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=za\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=Cena na jednotku\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=Dod\\u00E1vate\\u013E\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=Odovzdal\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=Z\\u00E1stupca za\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=Nepriraden\\u00E9\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=Popis\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=Medzis\\u00FA\\u010Det\n\n# YMSG\ndialog.question.approve=Schv\\u00E1li\\u0165 po\\u017Eiadavku na objedn\\u00E1vku, ktor\\u00FA predlo\\u017Eil {0}?\n\n# YMSG\ndialog.question.reject=Odmietnu\\u0165 po\\u017Eiadavku na objedn\\u00E1vku, ktor\\u00FA predlo\\u017Eil {0}?\n\n# YMSG\ndialog.success.approve=Po\\u017Eiadavka na objedn\\u00E1vku bola schv\\u00E1len\\u00E1\n\n# YMSG\ndialog.success.reject=Po\\u017Eiadavka na objedn\\u00E1vku bola odmietnut\\u00E1\n\n# YMSG\ndialog.success.forward=Po\\u017Eiadavka na objedn\\u00E1vku bola odovzdan\\u00E1 {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Schv\\u00E1li\\u0165\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Zamietnu\\u0165\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Schv\\u00E1lenie alebo odmietnutie tejto po\\u017Eiadavky st\\u00E1le prebieha. Zoznam po\\u017Eiadaviek m\\u00F4\\u017Eete aktualizova\\u0165 manu\\u00E1lne.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=Ziskov\\u00E9 stredisko\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Schv\\u00E1li\\u0165\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Zamietnu\\u0165\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Odovzda\\u0165\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Zru\\u0161i\\u0165\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=Bajt\n\n# YMSG: File Size Unit\nFileSize.Bytes=Bajty\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=S\\u00FAbor je pr\\u00EDli\\u0161 ve\\u013Ek\\u00FD\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Prida\\u0165 pozn\\u00E1mku (volite\\u013En\\u00E9)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Dnes\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=Pred 1 d\\u0148om\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=pred {0} d\\u0148ami\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Na\\u010D\\u00EDtava sa...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Aktu\\u00E1lne nie s\\u00FA k dispoz\\u00EDcii \\u017Eiadne polo\\u017Eky\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_sl.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=Interno naro\\u010Dilo\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Interno naro\\u010Dilo\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=Interno naro\\u010Dilo\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=Meja\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=Postavka {0} od {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=Vrstica storitve {0} od {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Vrstica storitve {0} od {1} - postavka {2} od {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Postavka {0} od {1} - limit\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=Vrstice storitve\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=Vrstice storitev ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=Kontiranje\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=Vmesna vsota\n\n# XTIT: Header text of Master List\nview.Master.title=Interna naro\\u010Dila ({0})\n\n# XTIT: Application name\napp.Identity=Odobritev internih naro\\u010Dil\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Odobritev internih naro\\u010Dil\n\n#XTIT: Shell title \nSHELL_TITLE=Odobritev internih naro\\u010Dil\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=Detajli zaposlenega\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=Detajli dobavitelja\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=Informacije\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=Informacije\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=Opis\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=Opis\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=Priloge\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=Zabele\\u017Eke\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=Ni postavk\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=Postavke ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=Ve\\u010Dkratne dodelitve\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=Kontiranje\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=Kategorija\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=Konto glavne knjige\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=Neznano\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=Objekti\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=Stro\\u0161kovno mesto\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=PPS-element\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=Mre\\u017Eni plan\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=Nalog\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=Prodajni nalog\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=Sredstvo\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=Kooperacija\n\n# XFLD: Components\nview.PurchaseRequisition.components=Komponente\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=Standard\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=Tretja oseba\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=Konsignacija\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=Dele\\u017E\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=Brez vrstic storitve\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=Brez omejitev\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=Opis\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=Cena\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=Interno naro\\u010Dilo\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=Material\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=Storitev\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=Proizvod\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=Detajli proizvoda\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=Datum dobave\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=Dobava dne\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=in kasneje\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=Naslov\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=Naslov dostave\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=Obrat\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=Stranka\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=Naziv\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=Meja\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=Koli\\u010Dina\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=Kategorija postavke\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=Naziv dobavitelja\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=Mejna vrednost\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=Neomejeno\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=Pri\\u010Dakovana vrednost\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=Skupina storitev\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=Skupina materiala\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=Cena na enoto\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=na\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=Cena na enoto\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=Dobavitelj\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=Posredoval\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=Namestnik za\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=Nedodeljeno\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=Opis\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=Vmesna vsota\n\n# YMSG\ndialog.question.approve=\\u017Delite odobriti interno naro\\u010Dilo, ki ga je poslal {0}?\n\n# YMSG\ndialog.question.reject=\\u017Delite zavrniti interno naro\\u010Dilo, ki ga je poslal {0}?\n\n# YMSG\ndialog.success.approve=Interno naro\\u010Dilo je bilo odobreno\n\n# YMSG\ndialog.success.reject=Interno naro\\u010Dilo je bilo zavrnjeno\n\n# YMSG\ndialog.success.forward=Interno naro\\u010Dilo je bilo posredovano {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Odobritev\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Zavrnitev\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Odobritev ali zavrnitev tega internega naro\\u010Dila je \\u0161e v obdelavi. Seznam internih naro\\u010Dil lahko osve\\u017Eite ro\\u010Dno.\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=Profitni center\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Odobritev\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Zavrnitev\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Posredovanje\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Prekinitev\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=Bajt\n\n# YMSG: File Size Unit\nFileSize.Bytes=Bajtov\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Datoteka je prevelika\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Dodajanje opombe (opcijsko)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Danes\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=Pred 1 dnem\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=Pred {0} dnevi\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Prenos ...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Trenutno ni razpolo\\u017Eljivih postavk\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_tr.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=Sat\\u0131nalma talebi\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Sat\\u0131nalma talebi\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=Sat\\u0131nalma talebi\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=S\\u0131n\\u0131r\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=Kalem {0} / {1}\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=Servis sat\\u0131r\\u0131 {0} / {1}\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Servis sat\\u0131r\\u0131 {0} / {1} - kalem {2} / {3}\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Kalem {0} / {1} - s\\u0131n\\u0131r\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=Servis sat\\u0131rlar\\u0131\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=Servis sat\\u0131rlar\\u0131 ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=Hesap tayini\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=Alt toplam\n\n# XTIT: Header text of Master List\nview.Master.title=Sat\\u0131nalma talepleri ({0})\n\n# XTIT: Application name\napp.Identity=Sat\\u0131nalma taleplerini onayla\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Sat\\u0131nalma taleplerini onayla\n\n#XTIT: Shell title \nSHELL_TITLE=Sat\\u0131nalma taleplerini onayla\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=\\u00C7al\\u0131\\u015Fan ayr\\u0131nt\\u0131lar\\u0131\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=Tedarik\\u00E7i ayr\\u0131nt\\u0131lar\\u0131\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=Bilgi\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=Bilgi\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=Tan\\u0131m\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=Tan\\u0131m\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=Ekler\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=Notlar\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=Kalem yok\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=Kalemler ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=\\u00C7oklu tayinler\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=Hesap tayini\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=Kategori\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=DK hesab\\u0131\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=Bilinmiyor\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=Nesneler\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=Masraf yeri\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=PYP \\u00F6\\u011Fesi\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=A\\u011F\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=Sipari\\u015F\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=Sat\\u0131\\u015F sipari\\u015Fi\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=Duran varl\\u0131k\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=Fason \\u00FCretim\n\n# XFLD: Components\nview.PurchaseRequisition.components=Bile\\u015Fenler\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=Standart\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=\\u00DC\\u00E7\\u00FCnc\\u00FC taraf\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=Konsinye\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=Oran\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=Servis sat\\u0131rlar\\u0131 yok\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=S\\u0131n\\u0131r yok\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=Tan\\u0131m\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=Fiyat\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=Sat\\u0131nalma talebi\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=Malzeme\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=Servis\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=\\u00DCr\\u00FCn\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=\\u00DCr\\u00FCn ayr\\u0131nt\\u0131lar\\u0131\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=Teslimat tarihi\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=Teslimat tarihi\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=ve daha sonra\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=Adres\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=Teslimat adresi\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=\\u00DCretim yeri\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=M\\u00FC\\u015Fteri\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=Ad\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=S\\u0131n\\u0131r\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=Miktar\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=Kalem kategorisi\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=Tedarik\\u00E7i ad\\u0131\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=S\\u0131n\\u0131r de\\u011Feri\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=S\\u0131n\\u0131rs\\u0131z\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=Beklenen de\\u011Fer\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=Servis grubu\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=Malzeme grubu\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=Birim fiyat\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=Birim\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=Birim ba\\u015F\\u0131na fiyat\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=Tedarik\\u00E7i\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=\\u0130leten\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=\\u015Eunun i\\u00E7in vekil\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=Tayin edilmedi\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=Tan\\u0131m\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=Alt toplam\n\n# YMSG\ndialog.question.approve={0} taraf\\u0131ndan g\\u00F6nderilen sat\\u0131nalma talebi onaylans\\u0131n m\\u0131?\n\n# YMSG\ndialog.question.reject={0} taraf\\u0131ndan g\\u00F6nderilen sat\\u0131nalma talebi reddedilsin mi?\n\n# YMSG\ndialog.success.approve=Sat\\u0131nalma talebi onayland\\u0131\n\n# YMSG\ndialog.success.reject=Sat\\u0131nalma talebi reddedildi\n\n# YMSG\ndialog.success.forward=Sat\\u0131nalma talebi \\u015Fu al\\u0131c\\u0131ya iletildi\\: {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Onayla\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Reddet\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Bu talebin onaylanmas\\u0131 veya reddedilmesi hala devam ediyor. Taleplerin listesini man\\u00FCel olarak yenileyebilirsiniz\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=K\\u00E2r merkezi\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=Tamam\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Onayla\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Reddet\n\n#XBUT: Button for forward action\nXBUT_FORWARD=\\u0130let\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=\\u0130ptal et\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=Bayt\n\n# YMSG: File Size Unit\nFileSize.Bytes=Bayt\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Dosya \\u00E7ok b\\u00FCy\\u00FCk\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Not ekle (iste\\u011Fe ba\\u011Fl\\u0131)\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Bug\\u00FCn\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 g\\u00FCn \\u00F6nce\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} g\\u00FCn \\u00F6nce\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Y\\u00FCkleniyor...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u015Eu anda kalem yok\n',
	"ui/s2p/mm/requisition/approve/i18n/i18n_zh_CN.properties":'\n# XTIT: Header text of a single Purchase Requisition\nview.Detail.title=\\u91C7\\u8D2D\\u7533\\u8BF7\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=\\u91C7\\u8D2D\\u7533\\u8BF7\n\n#XFLD: Purchase Requisition field label\nview.PurchaseRequisition.purchaseRequisitionLabel=\\u91C7\\u8D2D\\u7533\\u8BF7\n\n# XTIT: Header text of a single Limit\nview.LimitDetail.title=\\u9650\\u5236\n\n# XTIT: Title of Items Page\nview.ItemDetails.title=\\u7B2C {0} \\u4E2A\\u9879\\u76EE\\uFF0C\\u5171 {1} \\u4E2A\\u9879\\u76EE\n\n# XTIT: Header text of a single Service\nview.ServiceLineDetail.title=\\u7B2C {0} \\u4E2A\\u670D\\u52A1\\u884C\\uFF0C\\u5171 {1} \\u4E2A\\u670D\\u52A1\\u884C\n\n# XTIT: Title of Service Line Page\nview.ItemServiceLine.title=\\u7B2C {0} \\u4E2A\\u670D\\u52A1\\u884C\\uFF0C\\u5171 {1} \\u4E2A\\u670D\\u52A1\\u884C - \\u7B2C {2} \\u4E2A\\u9879\\u76EE\\uFF0C\\u5171 {3} \\u4E2A\\u9879\\u76EE\n\n# XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=\\u7B2C {0} \\u4E2A\\u9879\\u76EE\\uFF0C\\u5171 {1} \\u4E2A\\u9879\\u76EE - \\u9650\\u5236\n\n# XTIT: Title of list of service lines\nview.DetailItemServiceView.serviceLines=\\u670D\\u52A1\\u884C\n\n# XTIT: Title of list of service lines with number of items\nview.DetailItemServiceView.serviceLinesNum=\\u670D\\u52A1\\u884C ({0})\n\n# XTIT: Title of Account Assignment list\nview.PurchaseRequisition.accountAssignment=\\u79D1\\u76EE\\u5206\\u914D\n\n# XTIT: Column title of sub-totals in the table of service lines\nview.DetailItemServiceView.subTotal=\\u5C0F\\u8BA1\n\n# XTIT: Header text of Master List\nview.Master.title=\\u91C7\\u8D2D\\u7533\\u8BF7 ({0})\n\n# XTIT: Application name\napp.Identity=\\u5BA1\\u6279\\u8BF7\\u8D2D\\u5355\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u5BA1\\u6279\\u8BF7\\u8D2D\\u5355\n\n#XTIT: Shell title \nSHELL_TITLE=\\u5BA1\\u6279\\u8BF7\\u8D2D\\u5355\n\n#XTIT: Shell title for Employee Business Card\nBusinessCard.employee=\\u5458\\u5DE5\\u8BE6\\u7EC6\\u4FE1\\u606F\n\n#XTIT: Shell title for Supplier Business Card\nBusinessCard.supplier=\\u4F9B\\u5E94\\u5546\\u8BE6\\u7EC6\\u4FE1\\u606F\n\n#XFLD: Purchase Requisition Information\nview.PurchaseRequisition.information=\\u4FE1\\u606F\n\n# XTIT: Title of the Information Section\nview.DetailItemServiceView.info=\\u4FE1\\u606F\n\n# XTIT: Title of the Description Section\nview.DetailItemServiceView.desc=\\u63CF\\u8FF0\n\n# XTIT: Title of the Description Section\nview.DetailItemLimitView.desc=\\u63CF\\u8FF0\n\n# XFLD: Attachments contained in the Purchase Requisition Approval\nview.PurchaseRequisition.attachments=\\u9644\\u4EF6\n\n# XFLD: Notes contained in the Purchase Requisition Approval\nview.PurchaseRequisition.notes=\\u6CE8\\u91CA\n\n#XFLD: No items\nview.PurchaseRequisition.noItem=\\u65E0\\u9879\\u76EE\n\n#XFLD: Multiple items\nview.PurchaseRequisition.multipleItems=\\u9879\\u76EE ({0})\n\n#XFLD: Multiply accounting field label\nview.PurchaseRequisition.multiAccounting=\\u591A\\u4E2A\\u5206\\u914D\n\n#XFLD: Accounting field label\nview.PurchaseRequisition.accounting=\\u79D1\\u76EE\\u5206\\u914D\n\n#XFLD: Category for Account Assignment\nview.PurchaseRequisition.category=\\u7C7B\\u522B\n\n#XFLD: General Ledger Account debited with the costs of the purchase requisition approval (item)\nview.PurchaseRequisition.account=\\u603B\\u8D26\\u79D1\\u76EE\n\n#XFLD: Unknown field label\nview.PurchaseRequisition.unknown=\\u672A\\u77E5\n\n#XFLD: Account Assignment: Objects\nview.PurchaseRequisition.accountAssignmentObjects=\\u5BF9\\u8C61\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseRequisition.accountAssignmentCostCentre=\\u6210\\u672C\\u4E2D\\u5FC3\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseRequisition.accountAssignmentWBSElement=WBS \\u8981\\u7D20\n\n#XFLD: Account Assignment: Network\nview.PurchaseRequisition.accountAssignmentNetwork=\\u7F51\\u7EDC\n\n#XFLD: Account Assignment: Order\nview.PurchaseRequisition.accountAssignmentOrder=\\u8BA2\\u5355\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseRequisition.accountAssignmentSalesOrder=\\u9500\\u552E\\u8BA2\\u5355\n\n#XFLD: Account Assignment: Asset\nview.PurchaseRequisition.accountAssignmentAsset=\\u8D44\\u4EA7\n\n#XFLD: Subcontracting\nview.PurchaseRequisition.subcontracting=\\u8F6C\\u5305\n\n# XFLD: Components\nview.PurchaseRequisition.components=\\u7EC4\\u4EF6\n\n#XFLD: Item category Standard\nview.PurchaseRequisition.standard=\\u6807\\u51C6\n\n#XFLD: Third-party\nview.PurchaseRequisition.thirdParty=\\u7B2C\\u4E09\\u65B9\n\n#XFLD: Consignment\nview.PurchaseRequisition.consignment=\\u5BC4\\u552E\n\n#XFLD: Account Assignment percentage\nview.PurchaseRequisition.accountAssignmentPercentage=\\u4EFD\\u989D\n\n# XFLD: Fall-back text for an empty list of service lines\nview.DetailItemServiceView.noServiceLines=\\u65E0\\u670D\\u52A1\\u884C\n\n# XFLD: Fall-backr text for an empty list of limits\nview.DetailItemLimitView.noLimit=\\u65E0\\u9650\\u5236\n\n# XFLD: Name of a Service Line Item\nview.DetailItemServiceView.serviceName=\\u63CF\\u8FF0\n\n# XFLD: Price of a Service Line Item\nview.DetailItemServiceView.servicePrice=\\u4EF7\\u683C\n\n# XFLD: Unique ID for the Purchase Requisition Approval\nview.PRA.ID=\\u91C7\\u8D2D\\u7533\\u8BF7\n\n# XFLD: Material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.material=\\u7269\\u6599\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.service=\\u670D\\u52A1\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.product=\\u4EA7\\u54C1\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.productDetails=\\u4EA7\\u54C1\\u8BE6\\u7EC6\\u4FE1\\u606F\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryDate=\\u4EA4\\u8D27\\u65E5\\u671F\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseRequisition.deliveryOn=\\u4EA4\\u8D27\\u65E5\\u671F\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseRequisition.DeliveryAlsoLater=\\u53CA\\u4EE5\\u540E\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.address=\\u5730\\u5740\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.deliveryAddress=\\u4EA4\\u8D27\\u5730\\u5740\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.plant=\\u5DE5\\u5382\n\n#XFLD: Customer field label\nview.PurchaseRequisition.customerLabel=\\u5BA2\\u6237\n\n#XFLD: Freestyle adress field label\nview.PurchaseRequisition.freestyleAdressLabel=\\u540D\\u79F0\n\n# XFLD: Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limit=\\u9650\\u5236\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.quantity=\\u6570\\u91CF\n\n#XFLD: Item Category\nview.PurchaseRequisition.itemCategory=\\u9879\\u76EE\\u7C7B\\u522B\n\n# XFLD: Service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.supplierName=\\u4F9B\\u5E94\\u5546\\u540D\\u79F0\n\n# XFLD: Value of the Limit contained in the Purchase Requisition Approval\nview.PurchaseRequisition.limitValue=\\u9650\\u5236\\u503C\n\n# XFLD: Property of a limit item in a purchase Requisition approval\nview.PurchaseRequisition.unlimitedLimit=\\u65E0\\u9650\\u5236\n\n# XFLD: Expected Value of the Limit contained in the Purchase Requisition Approval Service\nview.PurchaseRequisition.expValue=\\u9884\\u671F\\u503C\n\n# XFLD: Service group of the service contained in the Purchase Requisition Approval\nview.PurchaseRequisition.serviceGroup=\\u670D\\u52A1\\u7EC4\n\n# XFLD: Material group of the material contained in the Purchase Requisition Approval\nview.PurchaseRequisition.materialGroup=\\u7269\\u6599\\u7EC4\n\n# XFLD: Information about quantity and price of the current Purchase Requisition Approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseRequisition.priceDetails=\\u5355\\u4EF7\n\n# XFLD: "per" in {Price} per {Unit}\nview.PurchaseRequisition.per=/\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseRequisition.priceQty={0} {1} / {2} {3}\n\n# XFLD: Price per (quantity) unit of a service line item \nview.PurchaseRequisition.pricePerUnit=\\u5355\\u4EF7\n\n# XFLD: Supplier that will deliver the ordered Purchase Requisition Approval item\nview.PurchaseRequisition.supplier=\\u4F9B\\u5E94\\u5546\n\n# XFLD, 40: Name of the person that forwarded the Purchase Requisition\nview.PurchaseRequisition.Forwarded=\\u8F6C\\u53D1\\u4EBA\n\n# XFLD, 40: Name of the person that normally does the Purchase Requisition approval \nview.PurchaseRequisition.Substitute=\\u6211\\u7684\\u66FF\\u73ED\\u4EBA\\u5458\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseRequisition.placeholder=\\u672A\\u5206\\u914D\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseRequisition.descriptionLabel=\\u63CF\\u8FF0\n\n#XFLD: Subtotal\nview.PurchaseRequisition.subtotal=\\u5C0F\\u8BA1\n\n# YMSG\ndialog.question.approve=\\u662F\\u5426\\u6279\\u51C6 {0} \\u63D0\\u4EA4\\u7684\\u91C7\\u8D2D\\u7533\\u8BF7\\uFF1F\n\n# YMSG\ndialog.question.reject=\\u662F\\u5426\\u62D2\\u7EDD {0} \\u63D0\\u4EA4\\u7684\\u91C7\\u8D2D\\u7533\\u8BF7\\uFF1F\n\n# YMSG\ndialog.success.approve=\\u5DF2\\u6279\\u51C6\\u91C7\\u8D2D\\u7533\\u8BF7\n\n# YMSG\ndialog.success.reject=\\u5DF2\\u62D2\\u7EDD\\u91C7\\u8D2D\\u7533\\u8BF7\n\n# YMSG\ndialog.success.forward=\\u91C7\\u8D2D\\u7533\\u8BF7\\u5DF2\\u8F6C\\u53D1\\u81F3 {0}\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=\\u6279\\u51C6\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=\\u62D2\\u7EDD\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=\\u6B63\\u5728\\u6279\\u51C6\\u6216\\u62D2\\u7EDD\\u6B64\\u7533\\u8BF7\\u3002\\u60A8\\u53EF\\u4EE5\\u624B\\u52A8\\u5237\\u65B0\\u7533\\u8BF7\\u5217\\u8868\\u3002\n\n#XFLD: Profit Center label\nview.PurchaseRequisition.ProfitCenter=\\u5229\\u6DA6\\u4E2D\\u5FC3\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=\\u786E\\u5B9A\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=\\u6279\\u51C6\n\n#XBUT: Button for Reject action\nXBUT_REJECT=\\u62D2\\u7EDD\n\n#XBUT: Button for forward action\nXBUT_FORWARD=\\u8F6C\\u53D1\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=\\u53D6\\u6D88\n\n#########\n# Texts for Attachment List\n##########\n\n# YMSG: File Size Unit one Byte \nFileSize.Byte=\\u5B57\\u8282\n\n# YMSG: File Size Unit\nFileSize.Bytes=\\u5B57\\u8282\n\n# YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=KB\n\n# YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n# YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n# YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n# YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n# YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n# YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n# YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n# YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=\\u6587\\u4EF6\\u592A\\u5927\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=\\u6DFB\\u52A0\\u6CE8\\u91CA\\uFF08\\u53EF\\u9009\\uFF09\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n# YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=\\u4ECA\\u5929\n\n# YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 \\u5929\\u524D\n\n# YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} \\u5929\\u524D\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=\\u6B63\\u5728\\u52A0\\u8F7D...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u9879\\u76EE\n',
	"ui/s2p/mm/requisition/approve/util/Conversions.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("ui.s2p.mm.requisition.approve.util.Conversions");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("sap.ca.ui.model.format.FileSizeFormat");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.format.QuantityFormat");
jQuery.sap.require("sap.ca.ui.model.format.FormatHelper");
jQuery.sap.require("sap.ca.ui.model.format.FormattingLibrary");

ui.s2p.mm.requisition.approve.util.Conversions =
		{

			// Approval Date Formatting
			ApprovalDateFormatter : function(sDate) {
				return ui.s2p.mm.requisition.approve.util.Conversions.formatDaysAgo(sDate);
			},

			// ID and Description Formatting
			commonIDFormatter : function(sDescription, sID) {
				if (sID) {
					if (sDescription) {
						var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
						return oBundle.getText("Formatting.DescriptionAndId", [ sDescription, sID ]);
					}
					return sID;
				}
				if (sDescription) {
					return sDescription;
				}
				return "";
			},

			salesOrderIDFormatter : function(sSalesOrder, sSalesOrderItem, sSalesOrderScheduleLine) {
				var sResult;
				sResult = sSalesOrder;
				if (sSalesOrderItem) {
					sResult = sResult + "/" + sSalesOrderItem;
				}
				if (sSalesOrderScheduleLine) {
					sResult = sResult + "/" + sSalesOrderScheduleLine;
				}
				return sResult;
			},

			assetIDFormatter : function(sDescription, sAsset, sAssetSubNumber) {
				var sAssetNumber = sAsset;
				if (sAssetSubNumber) {
					sAssetNumber = sAssetNumber + "/" + sAssetSubNumber;
				}

				if (sAssetNumber) {
					if (sDescription) {
						var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
						return oBundle.getText("Formatting.DescriptionAndId", [ sDescription, sAssetNumber ]);
					}
					return sAssetNumber;
				}
				if (sDescription) {
					return sDescription;
				}
				return "";
			},

			accountAssignmentPercentageFormatter : function(percentage) {
				// "%" shall be shown, only if there is a percentage given.
				if (percentage == null || percentage == "") {
					return "";
				} else {
					return "%";
				}
			},

			serviceInformationVisibilityTrigger : function(sServiceID, sLongDescription) {
				var f = ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger;
				return f(sServiceID) || f(sLongDescription);
			},

			lazyRoundNumber : function(sNum) {
				var result = 0;
				var formatter;
				if (sNum) {
					if (!isNaN(parseFloat(sNum)) && isFinite(sNum)) {
						if (Math.abs(sNum) < 1e6) {
							formatter = sap.ca.ui.model.format.NumberFormat.getInstance({
								style : 'standard'
							});
						} else {
							formatter = sap.ca.ui.model.format.NumberFormat.getInstance({
								style : 'short',
								shortDecimals: 2
							});
						}
						result = formatter.format(sNum);
					}
				}
				return result;
			},

			formatAttachmentIcon : function(sMimeType) {
				return sap.ca.ui.model.format.FormattingLibrary.formatAttachmentIcon(sMimeType);
			},

			headerAccountingFormatter : function(oHeaderAcc) {
				if (!oHeaderAcc) {
					return;
				}
				;
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				var sMultiAccounting = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.multiAccounting") : "";
				var sNoAccounting = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.placeholder") : "";
				var sGlAccountLabel = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.account") : "";
				var sUnknown = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.unknown") : "";
				if (oHeaderAcc.CumulatedAccountingTypeCode == '2') {
					return sMultiAccounting;
				} else if (oHeaderAcc.CumulatedAccountingTypeCode == '0') {
					return sNoAccounting;
				} else if (oHeaderAcc.CumulatedAccountingTypeCode == '3') {
					return sUnknown;
				}
				;

				// old logic
				if ((oHeaderAcc.CostCentre === "" || oHeaderAcc.CostCentre === undefined) && (oHeaderAcc.WBSElement === "" || oHeaderAcc.WBSElement === undefined) && (oHeaderAcc.Network === "" || oHeaderAcc.Network === undefined)
						&& (oHeaderAcc.Order === "" || oHeaderAcc.Order === undefined) && (oHeaderAcc.SalesOrder === "" || oHeaderAcc.SalesOrder === undefined) && (oHeaderAcc.Asset === "" || oHeaderAcc.Asset === undefined) &&
						(oHeaderAcc.ProfitCenter === "" || oHeaderAcc.ProfitCenter === undefined)) {

					var sResult1 = ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter(oHeaderAcc.AccountDescription, oHeaderAcc.AccountNumber);
					var sResult2 = ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter(oHeaderAcc.GlAccountDescription, oHeaderAcc.GlAccountNumber);
					return oHeaderAcc.AccountCategoryDescription + ' ' + sResult1 + '\n' + sGlAccountLabel + ' ' + sResult2;
				}

				// new logic
				else {
					var sResult = "";
					if (oHeaderAcc.CostCentre != "") {
						var sCostCentreLabel = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.accountAssignmentCostCentre") : "";
						sResult = sCostCentreLabel + ' ' + ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter(oHeaderAcc.CostCentreDescription, oHeaderAcc.CostCentre);
					}
					if (oHeaderAcc.WBSElement != "") {
						if (sResult !== "") {
							sResult = sResult + '\n';
						}
						;
						var sWBSElement = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.accountAssignmentWBSElement") : "";
						sResult = sResult + sWBSElement + ' ' + ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter(oHeaderAcc.WBSElementDescription, oHeaderAcc.WBSElement);
					}
					if (oHeaderAcc.Network != "") {
						if (sResult !== "") {
							sResult = sResult + '\n';
						}
						;
						var sNetwork = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.accountAssignmentNetwork") : "";
						sResult = sResult + sNetwork + ' ' + ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter(oHeaderAcc.NetworkDescription, oHeaderAcc.Network);
					}
					if (oHeaderAcc.Order != "") {
						if (sResult !== "") {
							sResult = sResult + '\n';
						}
						;
						var sOrder = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.accountAssignmentOrder") : "";
						sResult = sResult + sOrder + ' ' + ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter(oHeaderAcc.OrderDescription, oHeaderAcc.Order);
					}
					if (oHeaderAcc.SalesOrder != "") {
						if (sResult !== "") {
							sResult = sResult + '\n';
						}
						;
						var sSalesOrder = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.accountAssignmentSalesOrder") : "";
						sResult = sResult + sSalesOrder + ' ' + ui.s2p.mm.requisition.approve.util.Conversions.salesOrderIDFormatter(oHeaderAcc.SalesOrder, oHeaderAcc.SalesOrderItem, oHeaderAcc.SalesOrderScheduleLine);
					}
					if (oHeaderAcc.Asset != "") {
						if (sResult !== "") {
							sResult = sResult + '\n';
						}
						;
						var sAsset = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.accountAssignmentAsset") : "";
						sResult = sResult + sAsset + ' ' + ui.s2p.mm.requisition.approve.util.Conversions.assetIDFormatter(oHeaderAcc.AssetDescription, oHeaderAcc.Asset, oHeaderAcc.AssetSubnumber);
					}
					//######################################### ProfitCenter implemented with SP8 note
					if (oHeaderAcc.ProfitCenter != "") {
						if (sResult !== "") {sResult = sResult + '\n';};
						var sProfitCenter = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.ProfitCenter") : "";
						sResult = sResult + sProfitCenter + ' ' + ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter(oHeaderAcc.ProfitCenterDescription, oHeaderAcc.ProfitCenter);
					}
					//#########################################
					if (oHeaderAcc.GlAccountNumber != "") {
						if (sResult !== "") {
							sResult = sResult + '\n';
						}
						;
						var sGlAccount = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.account") : "";
						sResult = sResult + sGlAccount + ' ' + ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter(oHeaderAcc.GlAccountDescription, oHeaderAcc.GlAccountNumber);
					}
					return sResult;
				}
			},

			headerAccountingVisibilityTrigger : function(sCumulatedAccountingTypeCode) {
				if (sCumulatedAccountingTypeCode == '0') {
					return false;
				} else {
					return true;
				}
			},

			noteDateFormatter : function(bNoteIsApproverNote, sDate) {
				if (bNoteIsApproverNote) {
					return ui.s2p.mm.requisition.approve.util.Conversions.formatDaysAgo(sDate);
				} else {
					return '';
				}
				;
			},

			attachmentDateFormatter : function(sDate) {
				return ui.s2p.mm.requisition.approve.util.Conversions.formatLongDate(sDate, true);
			},

			approverNoteValueFormatter : function(bNoteIsApproverNote, sValue) {
				if (bNoteIsApproverNote) {
					return sValue;
				} else {
					return '';
				}
				;
			},

			priceFieldVisibilityTrigger : function(sValue, sItemType) {
				if (sItemType == '2') {
					return false;
				} else {
					return ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger(sValue);
				}
			},

			commonFieldVisibilityTrigger : function(sValue) {
				if (sValue == '' || sValue == null) {
					return false;
				} else {
					return true;
				}
				;
			},

			customerNameFormatter : function(sCustomerName, sCustomerID) {
				if (sCustomerID !== '' && sCustomerID !== undefined && sCustomerID !== null) {
					return sCustomerName + ' (' + sCustomerID + ')';
				} else {
					return sCustomerName;
				}
				;
			},

			plantVisibilityTrigger : function(plantName, customerName, customerID, sItemType) {
				if ((plantName !== '' || plantName !== null) && (customerName === '' || customerName === null || customerName === undefined) && (customerID === '' || customerID === null || customerID === undefined) && sItemType !== "5") {
					return true;
				} else {
					return false;
				}
				;
			},

			customerNameVisibilityTrigger : function(sCustomerName, sCustomerID) {
				// visibility trigger for showing label "Customer"
				// visibility is true, if sCustomerName and sCustomerID is set
				if (sCustomerName !== '' && sCustomerName !== undefined && sCustomerName !== null && sCustomerID !== '' && sCustomerID !== undefined && sCustomerID !== null) {
					return true;
				} else {
					return false;
				}
			},

			freestyleNameVisibilityTrigger : function(sCustomerName, sCustomerID) {
				// visibility trigger for showing label "Name"
				// visibility is true, if sCustomerName is set and sCustomerID is empty
				if (sCustomerName !== '' && sCustomerName !== undefined && sCustomerName !== null && (sCustomerID === '' || sCustomerID === undefined || sCustomerID === null)) {
					return true;
				} else {
					return false;
				}
			},

			// TODO check whether this method is used otherwise remove it
			commonDescriptionAndIDVisibilityTrigger : function(sDescription, sID) {
				if (sDescription == '' || sDescription == null || sID == '' || sID == null) {
					return false;
				} else {
					return true;
				}
				;
			},

			deliveryHeaderFormatter : function(sDeliveryDate, sAlsoLater) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				var prefix = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.deliveryOn") : "";
				return prefix + ' ' + ui.s2p.mm.requisition.approve.util.Conversions.deliveryDateFormatter(sDeliveryDate, sAlsoLater);
			},

			valueLimitFormatter : function(sValue, sUnlimited, sCurrency) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.limitValue") : "";
				sResult += ': ' + ui.s2p.mm.requisition.approve.util.Conversions.valueLimitWithoutLabelFormatter(sValue, sUnlimited, sCurrency);
				return sResult;
			},

			valueLimitWithoutLabelFormatter : function(sValue, sUnlimited, sCurrency) {
				var sResult = "";
				if (sUnlimited === '' || sUnlimited === null || sUnlimited === undefined) {
					sResult += ui.s2p.mm.requisition.approve.util.Conversions.formatAmount(sValue) + ' ' + sCurrency;
				} else {
					var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
					sResult += ((oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.unlimitedLimit") : "");
				}
				return sResult;
			},

			expectedValueFormatter : function(sValue, sCurrency) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.expValue") : "";
				sResult += ': ' + ui.s2p.mm.requisition.approve.util.Conversions.formatAmount(sValue) + ' ' + sCurrency;
				return sResult;
			},

			itemQuantityFormatter : function(sQuantity, sUnit, sType) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				if (sType == 'S') {
					return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.service") : "";
				} else {
					return ui.s2p.mm.requisition.approve.util.Conversions.quantityFormatter(sQuantity, sUnit);
				}
				;
			},

			quantityFormatterWithoutUnit : function(sQuantity, sUnit) {

				var numberFormatter = sap.ui.core.format.NumberFormat.getFloatInstance({}, sap.ui.getCore().getConfiguration().getLocale());

				// var oFormatter =
				// sap.ca.ui.model.format.QuantityFormat.getInstance({sValue: sQuantity,
				// unitCode: sUnit}, sap.ui.getCore().getConfiguration().getLocale());
				return numberFormatter.format(sQuantity);
			},

			quantityFormatter : function(sQuantity, sUnit) {
				return ui.s2p.mm.requisition.approve.util.Conversions.quantityFormatterWithoutUnit(sQuantity, sUnit) + ' ' + sUnit;
			},

			quantityPerUnitItemCategory : function(sQuantity, sUnit, sPrice, sCurrency, sItemCategory) {
				if (sItemCategory === "2") {
					ui.s2p.mm.requisition.approve.util.Conversions.quantityPerUnitFormatter("", "", "", "");
				} else {
					ui.s2p.mm.requisition.approve.util.Conversions.quantityPerUnitFormatter(sQuantity, sUnit, sPrice, sCurrency);
				}
			},

			quantityPerUnitFormatter : function(sQuantity, sUnit, sPrice, sCurrency) {
				var sPrice = ui.s2p.mm.requisition.approve.util.Conversions.formatAmount(sPrice);
				var sQuantity = ui.s2p.mm.requisition.approve.util.Conversions.quantityFormatterWithoutUnit(sQuantity, sUnit);
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();

				return oBundle.getText("view.PurchaseRequisition.priceQty", [ sPrice, sCurrency, sQuantity, sUnit ]);
			},

			serviceLinesNumFormatter : function(sItemsCount) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();

				return oBundle.getText("view.DetailItemServiceView.serviceLinesNum", [ sItemsCount ]);
			},

			totalPriceFormatter : function(sPrice, sCurrency) {
				var sPrice = ui.s2p.mm.requisition.approve.util.Conversions.formatAmount(sPrice);
				return sPrice + ' ' + sCurrency;
			},

			componentVisibilityTrigger : function(iItemCategory) {
				if (iItemCategory === "3") {
					return true;
				} else {
					return false;
				}
			},

			itemCategoryFormatter : function(sItemCategoryDescription, sItemType) {
				if (sItemCategoryDescription && sItemCategoryDescription !== "") {
					return sItemCategoryDescription;
				} else {
					var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
					if (sItemType == 'S') {
						return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.service") : "";
					} else if (sItemType == 'L') {
						return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.limit") : "";
					} else if (sItemType == 'M') {
						return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.standard") : "";
					} else if (sItemType == '2') {
						return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.consignment") : "";
					} else if (sItemType == '3') {
						return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.subcontracting") : "";
					} else if (sItemType == '5') {
						return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.thirdParty") : "";
					}
					;
				}
			},

			notesVisibilityTrigger : function(oNumberOfNotes) {
				if (oNumberOfNotes == '' || oNumberOfNotes == null || oNumberOfNotes == "0" || oNumberOfNotes == 0) {
					return false;
				} else {
					return true;
				}
				;
			},

			attachmentsVisibilityTrigger : function(oNumberOfAttachments) {
				if (oNumberOfAttachments == '' || oNumberOfAttachments == null || oNumberOfAttachments == "0" || oNumberOfAttachments == 0) {
					return false;
				} else {
					return true;
				}
				;
			},

			// create a function that converts Strings into Dates
			fConvert : function(sDate) {
				var oDate = sDate;
				if (typeof sDate === "string") {
					// Handle the format /Date(miliseconds)/
					if (sDate.indexOf("Date") != -1) {
						sDate = sDate.substring(sDate.indexOf("(") + 1, sDate.indexOf(")"));
						sDate = new Number(sDate);
					}
					oDate = new Date(sDate);
				} else if (typeof sDate !== "object" || sDate === null) {
					oDate = "";
				}
				return oDate;
			},

			formatLongDate : function(oDate, bUTC) {
				var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({
					style : "medium"
				}, sap.ui.getCore().getConfiguration().getLocale());

				oDate = ui.s2p.mm.requisition.approve.util.Conversions.fConvert(oDate);
				if (oDate === "") {
					return "";
				}
				return formatter.format(oDate, bUTC);
			},

			deliveryDateFormatter : function(sDeliveryDate, sAlsoLater) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				var oLater = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.DeliveryAlsoLater") : "";

				var oDate = ui.s2p.mm.requisition.approve.util.Conversions.formatLongDate(sDeliveryDate, true);

				if (sAlsoLater == null || sAlsoLater == "") {
					return oDate;
				} else {
					return oDate + ' ' + oLater;
				}
			},

			itemsTableHeader : function(sItemsCount) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				if (sItemsCount === undefined || sItemsCount === null || parseInt(sItemsCount) == 0) {
					return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.noItem") : "";
				} else {
					return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.multipleItems", [ parseInt(sItemsCount) ]) : "";
				}
				;
			},

			serviceLinesTableHeader : function(sItemsCount) {
				if (sItemsCount === undefined || sItemsCount === null || parseInt(sItemsCount) == 0) {
					return '';
				} else {
					var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
					return (oBundle !== undefined) ? oBundle.getText("view.DetailItemServiceView.serviceLinesNum", [ parseInt(sItemsCount) ]) : "";
				}
				;
			},

			commonCountVisibilityTrigger : function(sCount) {
				if (sCount !== null && sCount !== undefined && sCount != '0') {
					return true;
				} else {
					return false;
				}
				;
			},

			materialVisibilityTrigger : function(sProductLineType) {
				if (sProductLineType !== "L" && sProductLineType !== "S") {
					return true;
				}
				return false;
			},

			serviceVisibilityTrigger : function(sProductLineType) {
				if (sProductLineType == "S") {
					return true;
				}
				return false;
			},

			ItemServiceLineVisibilityTrigger : function(sNumberSLine) {
				if (sNumberSLine == '' || sNumberSLine == null || sNumberSLine == "0") {
					return false;
				} else {
					return true;
				}
				;
			},

			ItemLimitVisibilityTrigger : function(sNumberSLine) {
				if (sNumberSLine == '' || sNumberSLine == null || sNumberSLine == "0") {
					return false;
				} else {
					return true;
				}
				;
			},

			ItemAccountAssignmentVisibilityTrigger : function(oAccounting) {
				if (oAccounting !== null && oAccounting !== undefined && oAccounting.length !== 0) {
					return true;
				} else {
					return false;
				}
				;
			},

			GetAccountAssignmentVisibility : function(oAccounting, oObj) {
				if (!oAccounting) {
					return true;
				}
				if (!oAccounting[0]) {
					return true;
				}

				var sPath = oAccounting[0];
				if (!oObj.getModel) {
					return true;
				}
				var oModel = oObj.getModel();
				if (!oModel) {
					return true;
				}
				if (!oModel.oData) {
					return true;
				}
				var oFirstAccountingLine = oModel.oData[sPath];
				if (!oFirstAccountingLine) {
					return true;
				}

				if ((oFirstAccountingLine.CostCentre === "" || oFirstAccountingLine.CostCentre === undefined) && (oFirstAccountingLine.WBSElement === "" || oFirstAccountingLine.WBSElement === undefined)
						&& (oFirstAccountingLine.Network === "" || oFirstAccountingLine.Network === undefined) && (oFirstAccountingLine.Order === "" || oFirstAccountingLine.Order === undefined)
						&& (oFirstAccountingLine.SalesOrder === "" || oFirstAccountingLine.SalesOrder === undefined) && (oFirstAccountingLine.Asset === "" || oFirstAccountingLine.Asset === undefined)) {
					return true;
				}
				return false;
			},

			OldAccountAssignmentVisibilityTrigger : function(oAccounting) {
				var that = this;
				return ui.s2p.mm.requisition.approve.util.Conversions.GetAccountAssignmentVisibility(oAccounting, that);
			},

			NewAccountAssignmentVisibilityTrigger : function(oAccounting) {
				var that = this;
				var bResult = ui.s2p.mm.requisition.approve.util.Conversions.GetAccountAssignmentVisibility(oAccounting, that);
				if (bResult === true) {
					return false;
				}
				return true;
			},

			serviceLinesFormatter : function(sNumberSLine) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				var sSLine = (oBundle !== undefined) ? oBundle.getText("view.DetailItemServiceView.serviceLines") : "";
				if (sNumberSLine == '' || sNumberSLine == null || sNumberSLine == "0") {
					return '0' + ' ' + sSLine;
				} else {
					return sNumberSLine + ' ' + sSLine;
				}
				;
			},

			ItemNoteVisibilityTrigger : function(oNumberOfNotes) {
				if (oNumberOfNotes == '' || oNumberOfNotes == null || oNumberOfNotes == "0" || oNumberOfNotes == 0) {
					return false;
				} else {
					return true;
				}
				;
			},

			formatAttachmentSize : function(sFileSize) {
				var formatter = sap.ca.ui.model.format.FileSizeFormat.getInstance();
				return formatter.format(sFileSize);
			},

			formatAttachmentDesc : function(sDescription, sMimeType) {
				if (sDescription) {
					return sDescription;
				}
				return sMimeType;
			},

			ItemAttachmentVisibilityTrigger : function(oNumberOfAttachments) {
				if (oNumberOfAttachments == '' || oNumberOfAttachments == null || oNumberOfAttachments == "0" || oNumberOfAttachments == 0) {
					return false;
				} else {
					return true;
				}
				;
			},

			forwardedBy : function(sReassignByName) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.Forwarded") : "";

				if (sReassignByName === null || sReassignByName == "") {
					return '';
				} else {
					return sResult + ' ' + sReassignByName;
				}
				;
			},

			substitutedBy : function(sSubstitutingForName) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.Substitute") : "";
				if (sSubstitutingForName === null || sSubstitutingForName == "") {
					return '';
				} else {
					return sResult + ' ' + sSubstitutingForName;
				}
				;
			},

			materialGroupFormatter : function(sMaterialGroup, sMaterialGroupDescription) {
				if (sMaterialGroup !== '' && sMaterialGroup !== undefined && sMaterialGroup !== null) {
					return sMaterialGroupDescription + ' (' + sMaterialGroup + ')';
				} else {
					return sMaterialGroupDescription;
				}
				;
			},

			materialIDVisibilityTrigger : function(sMaterialID) {
				if (sMaterialID !== '' && sMaterialID !== undefined && sMaterialID !== null) {
					return true;
				} else {
					return false;
				}
				;
			},

			// Expects a date in the browsers current timezone
			formatDaysAgo : function(oDate) {
				if (oDate == null || oDate == "" || oDate === undefined) {
					return "";
				} else {
					var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({
						style : "daysAgo"
					}, sap.ui.getCore().getConfiguration().getLocale());
					var oFormatDate = formatter.format(oDate, true);
					return oFormatDate;
				}
			},

			getFormatOptions : function(options, lazy) {
				var formatOptions = {};
				var t = typeof options;
				switch (t) {
				case "number":
					if (lazy) {
						formatOptions.lazyDecimals = options;
					} else {
						formatOptions.decimals = options;
					}
					break;
				case "object":
					if (typeof options.locale === "string") {
						formatOptions.locale = new sap.ui.core.Locale(options.locale);
					} else {
						formatOptions.locale = options.locale;
					}
					formatOptions.decimals = options.decimals;
					formatOptions.rounding = options.rounding;
					formatOptions.lazy = options.lazy;
					formatOptions.lazyDecimals = options.lazyDecimals;
					formatOptions.lazyRounding = options.lazyRounding;
					break;
				default:
					break;
				}
				if (lazy !== undefined) {
					formatOptions.lazy = lazy;
				}
				if (!formatOptions.locale) {
					if (sap.ui.getCore().getConfiguration().getLanguage() == "ZH") {
						formatOptions.locale = new sap.ui.core.Locale("zh_CN");
					} else {
						formatOptions.locale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
					}
				}
				return formatOptions;
			},

			roundNumber : function(number, options) {
				return sap.ca.ui.model.format.FormatHelper.roundNumber(number, options);
			},

			hasRounding : function(options) {
				var rounding;
				if (options !== undefined) {
					if (typeof options === "number") {
						rounding = true;
					} else {
						if (options.lazy) {
							rounding = (options.lazyDecimals !== undefined) || (options.lazyRounding !== undefined);
						} else {
							rounding = (options.decimals !== undefined) || (options.rounding !== undefined);
						}
					}
				} else {
					rounding = false;
				}
				return rounding;
			},

			formatNumberItemType : function(nNum, sItemType) {
				if (sItemType === '2') {
					return "";
				} else {
					return ui.s2p.mm.requisition.approve.util.Conversions.formatAmount(nNum);
				}
			},

			formatNumberUnitItemType : function(sItemType, sCurrency) {
				if (sItemType === '2') {
					return "";
				} else {
					return sCurrency;
				}
			},

			formatAmount : function(number) {
				var formatter = sap.ui.core.format.NumberFormat.getCurrencyInstance({
					showMeasure : false
				});
				return formatter.format(number);
			},

			formatNumber : function(number, options) {
				var numValue = ui.s2p.mm.requisition.approve.util.Conversions.toNumeric(number);
				if (!isFinite(numValue)) {
					return "";
				}
				var formatOptions = ui.s2p.mm.requisition.approve.util.Conversions.getFormatOptions(options);
				var numberFormatter = sap.ui.core.format.NumberFormat.getFloatInstance({}, formatOptions.locale);
				if (ui.s2p.mm.requisition.approve.util.Conversions.hasRounding(options)) {
					numValue = ui.s2p.mm.requisition.approve.util.Conversions.roundNumber(numValue, formatOptions);
					return numberFormatter.format(numValue);
				} else {
					return numberFormatter.format(number);
				}
			},

			formatAccountingPercentage : function(nNum) {
				var nNum1 = ui.s2p.mm.requisition.approve.util.Conversions.toNumeric(nNum);
				var result = ui.s2p.mm.requisition.approve.util.Conversions.formatNumber(nNum1);
				return result;
			},

			toNumeric : function(obj) {
				return sap.ca.ui.model.format.FormatHelper.toNumeric(obj);
			},

			getNumberFormatOptions : function(options, lazy) {
				var formatOptions = {};
				var t = typeof options;
				switch (t) {
				case "number":
					if (lazy) {
						formatOptions.lazyDecimals = options;
					} else {
						formatOptions.decimals = options;
					}
					break;
				case "object":
					if (typeof options.locale == "string") {
						formatOptions.locale = new sap.ui.core.Locale(options.locale);
					} else {
						formatOptions.locale = options.locale;
					}
					formatOptions.decimals = options.decimals;
					formatOptions.rounding = options.rounding;
					formatOptions.lazy = options.lazy;
					formatOptions.lazyDecimals = options.lazyDecimals;
					formatOptions.lazyRounding = options.lazyRounding;
					break;
				default:
					break;
				}
				if (lazy != undefined) {
					formatOptions.lazy = lazy;
				}
				if (!formatOptions.locale) {
					if (sap.ui.getCore().getConfiguration().getLanguage() == "ZH") {
						formatOptions.locale = new sap.ui.core.Locale("zh_CN");
					} else {
						formatOptions.locale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
					}
				}
				return formatOptions;
			},

			getMagnitude : function(number) {
				var getmag = sap.ca.ui.model.format.FormatHelper.getMagnitude(number);
				return getmag;
			},

			businessCardImg : function(sMimeType, sImgUrl) {
				if (sMimeType) {
					return sImgUrl;
				} else {
					return null;
				}
			},

			onAttachment : function(oEvent) {

				var oContext = oEvent.getSource().getBindingContext();
				var sMediaSrc = oContext.getProperty().__metadata.media_src;

				var sUrl = "";
				if (sMediaSrc && typeof sMediaSrc === "string") {
					// ########## change absolute to relative url
					var oLink = document.createElement("a");
					oLink.href = sMediaSrc;
					sUrl = (oLink.pathname.charAt(0) === "/") ? oLink.pathname : "/" + oLink.pathname; // InternetExplorer needs a "/" at the beginning
					// ##########

//					if (sap.ui.Device.system.phone || sap.ui.Device.system.tablet) {
						sap.m.URLHelper.redirect(sUrl, true);
//					} else {
//						sap.m.URLHelper.redirect(sUrl, false);
//					}

				}
			}
		};
},
	"ui/s2p/mm/requisition/approve/view/AccountAssignmentTable.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */

sap.ui.controller("ui.s2p.mm.requisition.approve.view.AccountAssignmentTable", {

    onInit: function() {

    }

});

},
	"ui/s2p/mm/requisition/approve/view/AccountAssignmentTable.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View \n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\txmlns:layout="sap.ui.layout"\n\tcontrollerName="ui.s2p.mm.requisition.approve.view.AccountAssignmentTable">\n\t<Table\n\t\tid="accountAssignmentView_TableAcc"\n\t\tclass="mmRequisitionApprove_padding_rl"\n\t\tnoDataText="{i18n>view.PurchaseRequisition.placeholder}"\n\t\theaderText="{i18n>view.PurchaseRequisition.accountAssignment}"\n\t\tvisible="{parts : [{path : \'Accountings\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.ItemAccountAssignmentVisibilityTrigger\'}"\n\t\titems="{Accountings}">\n\t\t<columns>\n\t\t\t<Column\n\t\t\t\tid="AccountAssignmentTableColumnDescription"\n\t\t\t\thAlign="Left"\n\t\t\t\tvisible="{parts : [{path : \'Accountings\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.OldAccountAssignmentVisibilityTrigger\'}">\n\t\t\t\t<header>\n\t\t\t\t\t<Label\n\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.descriptionLabel}">\n\t\t\t\t\t</Label>\n\t\t\t\t</header>\n\t\t\t</Column>\n\t\t\t<Column\n\t\t\t\tid="AccountAssignmentTableColumnCategory"\n\t\t\t\thAlign="Left"\n\t\t\t\tdemandPopin="true"\n\t\t\t\tminScreenWidth="Tablet"\n\t\t\t\tvisible="{parts : [{path : \'Accountings\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.OldAccountAssignmentVisibilityTrigger\'}">\n\t\t\t\t<header>\n\t\t\t\t\t<Label\n\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.category}">\n\t\t\t\t\t</Label>\n\t\t\t\t</header>\n\t\t\t</Column>\n\t\t\t<Column\n\t\t\t\tid="AccountAssignmentTableColumnObjects"\n\t\t\t\thAlign="Left"\n\t\t\t\tvisible="{parts : [{path : \'Accountings\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.NewAccountAssignmentVisibilityTrigger\'}">\n\t\t\t\t<header>\n\t\t\t\t\t<Label\n\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.accountAssignmentObjects}">\n\t\t\t\t\t</Label>\n\t\t\t\t</header>\n\t\t\t</Column>\n\t\t\t<Column\n\t\t\t\tid="AccountAssignmentTableColumnAccount"\n\t\t\t\thAlign="Left"\n\t\t\t\tdemandPopin="true"\n\t\t\t\tminScreenWidth="Tablet">\n\t\t\t\t<header>\n\t\t\t\t\t<Label\n\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.account}">\n\t\t\t\t\t</Label>\n\t\t\t\t</header>\n\t\t\t</Column>\n\t\t\t<Column\n\t\t\t\tid="AccountAssignmentTableColumnPercentage"\n\t\t\t\thAlign="Right"\n\t\t\t\tdemandPopin="true"\n\t\t\t\tminScreenWidth="Tablet">\n\t\t\t\t<header>\n\t\t\t\t\t<Label \n\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.accountAssignmentPercentage}">\n\t\t\t\t\t</Label>\n\t\t\t\t</header>\n\t\t\t</Column>\n\t\t</columns>\n\t\t<items>\n\t\t\t<ColumnListItem\n\t\t\t\ttype="Inactive">\n\t\t\t\t<cells>\n\t\t\t\t\t<ObjectIdentifier\n\t\t\t\t\t\ttitle="{parts : [{path : \'AccountDescription\'}, {path : \'AccountNumber\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter\'}">\n\t\t\t\t\t</ObjectIdentifier>\n\t\t\t\t\t<Text\n\t\t\t\t\t\ttext="{AccountCategoryDescription}">\n\t\t\t\t\t</Text>\n\t\t\t\t\t<layout:VerticalLayout>\n\t\t\t\t\t\t<ObjectIdentifier\n\t\t\t\t\t\t\ttitle="{parts:[{path : \'CostCentreDescription\'}, {path : \'CostCentre\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter\'}"\n\t\t\t\t\t\t\tvisible="{parts : [{path : \'CostCentre\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</ObjectIdentifier>\n\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.accountAssignmentCostCentre}"\n\t\t\t\t\t\t\tvisible="{parts : [{path : \'CostCentre\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t<ObjectIdentifier\n\t\t\t\t\t\t\ttitle="{parts:[{path : \'WBSElementDescription\'}, {path : \'WBSElement\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter\'}"\n\t\t\t\t\t\t\tvisible="{parts : [{path : \'WBSElement\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</ObjectIdentifier>\n\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.accountAssignmentWBSElement}"\n\t\t\t\t\t\t\tvisible="{parts : [{path : \'WBSElement\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t<ObjectIdentifier\n\t\t\t\t\t\t\ttitle="{parts:[{path : \'NetworkDescription\'}, {path : \'Network\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter\'}"\n\t\t\t\t\t\t\tvisible="{parts : [{path : \'Network\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</ObjectIdentifier>\n\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.accountAssignmentNetwork}"\n\t\t\t\t\t\t\tvisible="{parts : [{path : \'Network\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t<ObjectIdentifier\n\t\t\t\t\t\t\ttitle="{parts:[{path : \'OrderDescription\'}, {path : \'Order\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter\'}"\n\t\t\t\t\t\t\tvisible="{parts : [{path : \'Order\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</ObjectIdentifier>\n\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.accountAssignmentOrder}"\n\t\t\t\t\t\t\tvisible="{parts : [{path : \'Order\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t<ObjectIdentifier\n\t\t\t\t\t\t\ttitle="{parts:[{path : \'SalesOrder\'}, {path : \'SalesOrderItem\'}, {path : \'SalesOrderScheduleLine\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.salesOrderIDFormatter\'}"\n\t\t\t\t\t\t\tvisible="{parts : [{path : \'SalesOrder\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</ObjectIdentifier>\n\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.accountAssignmentSalesOrder}"\n\t\t\t\t\t\t\tvisible="{parts : [{path : \'SalesOrder\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t<ObjectIdentifier\n\t\t\t\t\t\t\ttitle="{parts:[{path : \'AssetDescription\'}, {path : \'Asset\'}, {path : \'AssetSubNumber\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.assetIDFormatter\'}"\n\t\t\t\t\t\t\tvisible="{parts : [{path : \'Asset\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</ObjectIdentifier>\n\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.accountAssignmentAsset}"\n\t\t\t\t\t\t\tvisible="{parts : [{path : \'Asset\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t<ObjectIdentifier\n \t\t\t\t\t\t\ttitle="{parts:[{path : \'ProfitCenterDescription\'}, {path : \'ProfitCenter\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter\'}"\n \t\t\t\t\t\t\tvisible="{parts : [{path : \'ProfitCenter\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</ObjectIdentifier>\n \t\t\t\t\t\t<Text \n \t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.ProfitCenter}"\n \t\t\t\t\t\t\tvisible="{parts : [{path : \'ProfitCenter\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n \t\t\t\t\t\t</Text>\n\t\t\t\t\t</layout:VerticalLayout>\n\t\t\t\t\t<Text\n\t\t\t\t\t\ttext="{parts : [{path : \'GlAccountDescription\'}, {path : \'GlAccountNumber\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter\'}">\n\t\t\t\t\t</Text>\n\t\t\t\t\t<ObjectNumber\n\t\t\t\t\t\tnumber="{parts : [{path : \'DistributionPercentage\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.formatAccountingPercentage\'}"\n\t\t\t\t\t\tnumberUnit="{parts : [{path : \'DistributionPercentage\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.accountAssignmentPercentageFormatter\'}">\n\t\t\t\t\t</ObjectNumber>\n\t\t\t\t</cells>\n\t\t\t</ColumnListItem>\n\t\t</items>\n\t</Table>\n</core:View>\n',
	"ui/s2p/mm/requisition/approve/view/ItemDetails.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("ui.s2p.mm.requisition.approve.util.Conversions");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.requisition.approve.view.ItemDetails", {

	sOrigin : "",
	sWorkitemID : "",
	sPrNumber : "",
	sItemNumber : "",

	onInit: function() {

		//execute the onInit for the base class BaseDetailController
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);

		// Get connection manager/resource bundle
		if (!this.oApplication) {
			this.oApplication = sap.ca.scfld.md.app.Application.getImpl();
			this.oConfiguration = this.oApplication.oConfiguration;
			this.oConnectionManager = this.oApplication.getConnectionManager();
			this.resourceBundle = this.oApplication.getResourceBundle();
			this.oDataModel = this.oApplicationFacade.getODataModel();
		}
		this.getView().getModel().setSizeLimit(1000000);
		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "itemDetails") {
				this.sOrigin = oEvent.getParameter("arguments").SAP__Origin;
				this.sWorkitemID = oEvent.getParameter("arguments").WorkitemID;
				this.sPrNumber = oEvent.getParameter("arguments").PrNumber;
				this.sItemNumber = oEvent.getParameter("arguments").ItemNumber;

				var sItemDetailContextPath = "/WorkflowTaskCollection(SAP__Origin='" + this.sOrigin + "',WorkitemID='" + this.sWorkitemID + "')" 
												+ "/HeaderDetails/HeaderItemDetails(SAP__Origin='" + this.sOrigin + "',WorkitemID='" + this.sWorkitemID 
												+ "',PrNumber='" + this.sPrNumber + "',ItemNumber='" + this.sItemNumber + "')";
				
				var sItemPath = "/HeaderItemDetailCollection(SAP__Origin='" + this.sOrigin + "',WorkitemID='" + this.sWorkitemID + "',PrNumber='"
								+ this.sPrNumber + "',ItemNumber='" + this.sItemNumber + "')";
				var oItemData = this.oDataModel.getProperty(sItemPath);
				if ( typeof oItemData === "undefined" ) {
					//in case someone directly navigates to the details screen, we don't have oDataModel loaded and need to navigate back to the S3 screen
					this.navBack();
					return;
				}

				var sItemCategory = "";
				if (oItemData) {
					sItemCategory = oItemData.ItemCategory;
				}

				var oSubcontractingTable = this.byId("SubcontractingTable");

				if (sItemCategory === "3") {
					this.getView().bindElement(sItemDetailContextPath, {expand : "Accountings,Notes,Attachments,ServiceLines/Accountings,Limits/Accountings,Components"});

					this.getView().getElementBinding().attachEventOnce("dataReceived", function() {
						var aCells = [
							new sap.m.ObjectIdentifier({
								title : "{parts:[{path : 'Description'}, {path : 'Material'}], formatter : 'ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter'}"
							}),
							new sap.m.ObjectNumber({
								number : "{parts: [{path : 'Quantity'}], formatter : 'ui.s2p.mm.requisition.approve.util.Conversions.quantityFormatterWithoutUnit'}",
								numberUnit : "{BaseUnitDescription}"
							})
						];
						var oTemplate = new sap.m.ColumnListItem({cells : aCells});
						oSubcontractingTable.bindItems("Components", oTemplate, null, null);
						oSubcontractingTable.setVisible(true);
					}, this);

				}else{
					oSubcontractingTable.unbindItems();
					oSubcontractingTable.setVisible(false);
					this.getView().bindElement(sItemDetailContextPath, {expand : "Accountings,Notes,Attachments,ServiceLines/Accountings,Limits/Accountings"});
				}

				this.setLocalHeaderFooterOptions();
			}
		}, this);

		/**
		 * @ControllerHook Item Details / onInit
		 * With this controller method the onInit method of the ItemDetails controller can be enhanced.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookOnInit
		 */
		if (this.extHookOnInit) {
			this.extHookOnInit();
		}
	},

	setLocalHeaderFooterOptions: function() {
		var that = this;

		var sHDColl = this._headerDetailCollection(this.sOrigin, this.sWorkitemID);
		var sIDColl = this._itemDetailCollection(this.sOrigin, this.sWorkitemID, this.sPrNumber, this.sItemNumber);

		var ItemsCollection = this.oDataModel.getProperty("/" + sHDColl + '/HeaderItemDetails');
		if ( typeof ItemsCollection === "undefined" ) {
			//in case someone directly navigates to the details screen, we don't have oDataModel loaded and need to navigate back to the S3 screen
			this.navBack();
			return;
		}

		var len = ItemsCollection.length;
		var currentItemIndex = ItemsCollection.indexOf(sIDColl);

		var oLocalHeaderFooterOptions = {
			onBack: function() {
				that.navBack();
			},
			oUpDownOptions: {
				iPosition: currentItemIndex,
				iCount: len,
				fSetPosition: function (iNewItem) {
					var path = ItemsCollection[iNewItem];
					var sItemNumber = that.oDataModel.getProperty("/" + path).ItemNumber;

					that.oRouter.navTo("itemDetails", {
						SAP__Origin: that.sOrigin,
						WorkitemID: that.sWorkitemID,
						PrNumber: that.sPrNumber,
						ItemNumber: sItemNumber
					}, true);
				},
				sI18NDetailTitle: "view.ItemDetails.title"
			}
		};

		/**
		 * @ControllerHook Item Details / HeaderFooterOptions
		 * With this controller method the setLocalHeaderFooterOptions method of the ItemDetails controller 
		 * can be enhanced to change the HeaderFooterOptions.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookSetHeaderFooterOptions
		 * @param {object} oLocalHeaderFooterOptions
		 * @return {object} oLocalHeaderFooterOptions
		 */
		if (this.extHookSetHeaderFooterOptions) {
			oLocalHeaderFooterOptions = this.extHookSetHeaderFooterOptions(oLocalHeaderFooterOptions);
		}

		this.setHeaderFooterOptions(oLocalHeaderFooterOptions);
	},

	navBack: function() {
		if (this.sOrigin !== "" && this.sWorkitemID !== "") {
			var sMasterContextPath = "WorkflowTaskCollection(SAP__Origin='" + this.sOrigin + 
									 "',WorkitemID='" + this.sWorkitemID + "')";
			this.oRouter.navTo("headerDetail", {
				contextPath: sMasterContextPath}, true);
		}
	},

	_refresh: function(channelId, eventId, data) {
		//Override and do nothing
	},

	onServiceItemPress: function(oEvent) {
		var bc = oEvent.getSource().getBindingContext().getPath();
		var oModel = this.getView().getModel();

		this.oRouter.navTo("itemServiceLine", {
			SAP__Origin: this.getView().getBindingContext().getProperty("SAP__Origin"),
			WorkitemID: this.sWorkitemID,
			PrNumber: this.getView().getBindingContext().getProperty("PrNumber"),
			ItemNumber: this.getView().getBindingContext().getProperty("ItemNumber"),
			ServiceLineNumber: oModel.getProperty(bc).ServiceLineNumber
		}, true );
	},

	onServiceLimitPress: function(oEvent) {
		var bc = oEvent.getSource().getBindingContext().getPath();
		var oModel = this.getView().getModel();
		
		var descr = oModel.getProperty(bc).LimitDescription;
		descr = encodeURIComponent(descr.trim());

		this.oRouter.navTo("itemServiceLimit", {
			SAP__Origin: this.getView().getBindingContext().getProperty("SAP__Origin"),
			WorkitemID: this.sWorkitemID,
			PrNumber: this.getView().getBindingContext().getProperty("PrNumber"),
			ItemNumber: this.getView().getBindingContext().getProperty("ItemNumber"),
			LimitDescription: descr
		}, true);
	},

	_headerDetailCollection: function(sOrigin, sWorkitemID) {
		var sResult = "HeaderDetailCollection(SAP__Origin='" + sOrigin + "',WorkitemID='" + sWorkitemID + "')";
		return sResult;
	},

	_itemDetailCollection: function(sOrigin, sWorkitemID, sPrNumber, sItemNumber) {
		var sResult = "HeaderItemDetailCollection(SAP__Origin='" + sOrigin + "',WorkitemID='" + sWorkitemID + 
		 			"',PrNumber='" + sPrNumber + "',ItemNumber='" + sItemNumber + "')";
		return sResult;
	},

	onAttachment: function(oEvent) {
		ui.s2p.mm.requisition.approve.util.Conversions.onAttachment(oEvent);
	},

	onSenderPress: function(oEvent) {
		this.openEmployeeLaunch(oEvent, "CreatedByID");
	},

	openEmployeeLaunch: function(oEvent, sRef){
		var oControl = oEvent.getSource();
		var sTitle= this.resourceBundle.getText("BussinessCard.Employee");

		// Open employee type business card
		var onRequestSuccess = function(oData) {
			var data = oData.results[0],
			oEmpConfig = {
				title: sTitle,
				name: data.FullName,
				department: data.Department,
				contactmobile: data.MobilePhone,
				contactphone: data.WorkPhone,
				contactemail: data.EMail,
				companyname: data.CompanyName,
				companyaddress: data.AddressString
			},
			oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oEmpConfig);
			oEmployeeLaunch.openBy(oControl);
		};

		var sOrigin = oEvent.getSource().getBindingContext().getProperty("SAP__Origin");
		var sUser = oEvent.getSource().getBindingContext().getProperty(sRef);

		// Open connection to read employee data      
	//this.oDataModel = this.oConnectionManager.modelList[this.oConfiguration.getServiceList()[0].name];
		var sFilter = "$filter=" + encodeURIComponent("UserID eq '" + sUser + "' and SAP__Origin eq '" + sOrigin + "'");
		this.oDataModel.read("UserDetailsCollection", null, [sFilter], true,
			jQuery.proxy(onRequestSuccess, this),
			jQuery.proxy(this._onRequestFailed, this));
	},
	
	onSupplierPress: function(oEvent) {
		this.onCompanyLaunch(oEvent, "SupplierID");
	},

	onCompanyLaunch: function(oEvent, sRef) {
		var sTitle = this.oApplicationFacade.getResourceBundle().getText("BusinessCard.supplier");
		var sSupplierId = this.oApplicationFacade.getODataModel().getProperty("SupplierID", this.getView().getBindingContext());
		var oControl = oEvent.getSource();
		var sOrigin = this.getView().getBindingContext().getProperty("SAP__Origin");
		var oApplicationFacade = this.oApplicationFacade;
		var sSupplierDetailsCollection = "SupplierDetailCollection(SupplierID='" + sSupplierId + "',SAP__Origin='" + sOrigin + "')";
		var aParam = ["$expand=SupplierContacts"];
		sap.ca.ui.utils.busydialog.requireBusyDialog();
		oApplicationFacade.getODataModel().read(sSupplierDetailsCollection, null, aParam, true, function(oData, response) {
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
			var hasContacts = (oData.SupplierContacts && (oData.SupplierContacts.length > 0));
			var oSBCData = {
				title: sTitle,
				imgurl: ui.s2p.mm.requisition.approve.util.Conversions.businessCardImg(oData.Mime_Type, oData.__metadata.media_src),
				companyname: oData.SupplierName,
				companyphone: oData.WorkPhone,
				companyaddress: oData.AddressString,
				maincontactname: hasContacts ? oData.SupplierContacts[0].ContactName : oData.ContactName,
				maincontactmobile: hasContacts ? oData.SupplierContacts[0].MobilePhone : oData.MobilePhone,
				maincontactphone: hasContacts ? oData.SupplierContacts[0].WorkPhone : oData.WorkPhone,
				maincontactemail: hasContacts ? oData.SupplierContacts[0].oData.EMail : oData.EMail
			};
			var oSupplierBusinessCard = new sap.ca.ui.quickoverview.CompanyLaunch(oSBCData);
			oSupplierBusinessCard.openBy(oControl);
		}, function(oError) {
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
		});
	},

	_onRequestFailed: function(oError) {
		var sMessage = "";
		var sDetails = null;

		if (oError.response && oError.response.body != "" && 
		   (oError.response.statusCode == "400" || oError.response.statusCode == "500")) {
			var oMessage = JSON.parse(oError.response.body);
			sMessage = oMessage.error.message.value;
		}
		if (sMessage == "") {
			sMessage = oError.message;
			sDetails = oError.response.body;
		}

		sap.ca.ui.message.showMessageBox({
			type: sap.ca.ui.message.Type.ERROR,
			message: sMessage,
			details: sDetails
		});
	}
});
},
	"ui/s2p/mm/requisition/approve/view/ItemDetails.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:form="sap.ui.layout.form"\n\txmlns:layout="sap.ui.layout"\n\tcontrollerName="ui.s2p.mm.requisition.approve.view.ItemDetails">\n\n\t<!-- S4 screen - Item Detail -->\n\t<Page\n\t\tid="itemdetail"\n\t\tclass="sapUiFioriObjectPage"\n\t\tenableScrolling="true">\n\n\t\t<!-- ItemDetailHeader -->\n\t\t<!-- Material -->\n\t\t<ObjectHeader\n\t\t\tid="HeaderMaterial"\n\t\t\tintroActive="false"\n\t\t\tvisible="{parts : [{path : \'HdItmProductDetails/ItemType\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.materialVisibilityTrigger\'}"\n\t\t\ttitle="{Description}"\n\t\t\tnumber="{parts: [{path : \'Value\'}, {path : \'ItemCategory\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.formatNumberItemType\'}"\n\t\t\tnumberUnit="{Currency}">\n\t\t\t<attributes>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="MaterialObjectHeaderAttributeQuantity"\n\t\t\t\t\ttext="{parts : [{path : \'Quantity\'}, {path : \'UnitDescription\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.quantityFormatter\'}"\n\t\t\t\t\tactive="false">\n\t\t\t\t</ObjectAttribute>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="MaterialObjectHeaderAttributePricePerUnit"\n\t\t\t\t\ttext="{parts : [{path : \'QuantityForPPU\'}, {path : \'UnitForPPUDescription\'}, {path : \'PricePerUnit\'}, {path : \'CurrencyForPPU\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.quantityPerUnitItemCategory\'}"\n\t\t\t\t\tactive="false">\n\t\t\t\t</ObjectAttribute>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="MaterialObjectHeaderAttributeItemCategory"\n\t\t\t\t\ttext="{ItemCategoryDescription}"\n\t\t\t\t\tactive="false">\n\t\t\t\t</ObjectAttribute>\n\t\t\t</attributes>\n\n\t\t\t<!-- @ExtensionPoint extMaterialHeaderInfo: material information -->\n\t\t\t<core:ExtensionPoint name="extMaterialHeaderInfo" />\n\t\t</ObjectHeader>\n\n\t\t<!-- Service -->\n\t\t<ObjectHeader\n\t\t\tid="HeaderService"\n\t\t\tintroActive="false"\n\t\t\tvisible="{parts : [{path : \'HdItmProductDetails/ItemType\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.serviceVisibilityTrigger\'}"\n\t\t\ttitle="{Description}"\n\t\t\tnumber="{parts : [{path : \'Value\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.formatAmount\'}"\n\t\t\tnumberUnit="{Currency}">\n\t\t\t<attributes>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="ServiceObjectHeaderAttributeNumberServiceLines"\n\t\t\t\t\ttext="{parts : [{path : \'NumberServiceLines\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.serviceLinesFormatter\'}"\n\t\t\t\t\tactive="false">\n\t\t\t\t</ObjectAttribute>\n\t\t\t</attributes>\n\n\t\t\t<!-- @ExtensionPoint extServiceHeaderInfo: service information -->\n\t\t\t<core:ExtensionPoint name="extServiceHeaderInfo" />\n\t\t</ObjectHeader>\n\t\t<!-- end of Header -->\n\n\t\t<!-- Information area -->\n\t\t<form:Form\n\t\t\tid="ItemDetailInfoFormGeneral"\n\t\t\ttitle="{i18n>view.PurchaseRequisition.information}">\n\t\t\t<form:layout>\n\t\t\t\t<form:ResponsiveLayout></form:ResponsiveLayout>\n\t\t\t</form:layout>\n \t\t\t<form:FormContainer\t>\n\t\t\t\t<form:layoutData>\n\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t</form:layoutData>\n\t\t\t\t<form:formElements>\n\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\tid="ItemDetailInfoMaterial"\n\t\t\t\t\t\tvisible="{parts : [{path : \'HdItmProductDetails/MaterialID\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.materialIDVisibilityTrigger\'}">\n\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.material}">\n\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t<Text text="{HdItmProductDetails/MaterialID}">\n\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\tid="ItemDetailInfoMaterialGroup"\n\t\t\t\t\t\tvisible="{parts : [{path : \'HdItmProductDetails/ItemType\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.materialVisibilityTrigger\'}">\n\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.materialGroup}">\n\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t<Text text="{parts : [{path : \'HdItmProductDetails/MaterialGroup\'}, {path : \'HdItmProductDetails/MaterialGroupDescription\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.materialGroupFormatter\'}">\n\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\tid="ItemDetailInfoServiceGroup"\n\t\t\t\t\t\tvisible="{parts : [{path : \'HdItmProductDetails/ItemType\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.serviceVisibilityTrigger\'}">\n\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.serviceGroup}">\n\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t<Text text="{parts : [{path : \'HdItmProductDetails/MaterialGroup\'}, {path : \'HdItmProductDetails/MaterialGroupDescription\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.materialGroupFormatter\'}">\n\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t</form:FormElement>\n\t\t\t\t</form:formElements>\n\t\t\t</form:FormContainer>\n\t\t</form:Form>\n\t\t\n\t\t\n\t\t<form:Form\n\t\t\tid="ItemDetailInfoFormDelivery"\n\t\t\ttitle="{parts : [{path : \'DeliveryDate\'}, {path : \'DeliveryDateAlsoLater\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.deliveryHeaderFormatter\'}">\n\t\t\t<form:layout>\n\t\t\t\t<form:ResponsiveLayout></form:ResponsiveLayout>\n\t\t\t</form:layout>\n\t\t\t<form:formContainers>\n\t\t\t\t<form:FormContainer>\n\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\n\t\t\t\t\t<form:formElements>\n\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\tid="ItemDetailInfoDeliveryPlant"\n\t\t\t\t\t\tvisible="{parts : [{path : \'HdItmDeliveryAddress/PlantName\'}, {path : \'HdItmDeliveryAddress/CustomerName\'}, {path : \'HdItmDeliveryAddress/CustomerId\'}, {path : \'HdItmDeliveryAddress/ItemType\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.plantVisibilityTrigger\'}">\n\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.plant}">\n\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t<Text \n\t\t\t\t\t\t\t\ttext="{parts : [{path : \'HdItmDeliveryAddress/PlantName\'}, {path : \'HdItmDeliveryAddress/Plant\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter\'}">\n\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\n\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\tid="ItemDetailInfoName"\n\t\t\t\t\t\t\tvisible="{parts:[{path : \'HdItmDeliveryAddress/CustomerName\' }, {path : \'HdItmDeliveryAddress/CustomerId\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.freestyleNameVisibilityTrigger\'}">\n\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.freestyleAdressLabel}"></Label>\n\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\ttext="{HdItmDeliveryAddress/CustomerName}">\n\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\tid="ItemDetailInfoCustomer"\n\t\t\t\t\t\t\tvisible="{parts:[{path : \'HdItmDeliveryAddress/CustomerName\' }, {path : \'HdItmDeliveryAddress/CustomerId\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.customerNameVisibilityTrigger\'}">\n\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.customerLabel}"></Label>\n\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\ttext="{parts:[{path : \'HdItmDeliveryAddress/CustomerName\' }, {path : \'HdItmDeliveryAddress/CustomerId\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.customerNameFormatter\'}">\n\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\tid="ItemDetailInfoDeliveryAddress"\n\t\t\t\t\t\tvisible="{parts : [{path : \'HdItmDeliveryAddress/AddressString\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.deliveryAddress}"></Label>\n\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\ttext="{HdItmDeliveryAddress/AddressString}">\n\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\tid="ItemDetailInfoSupplierName"\n\t\t\t\t\t\tvisible="{path : \'SupplierName\', formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.supplierName}">\n\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t<Link\n\t\t\t\t\t\t\t\tpress="onSupplierPress"\n\t\t\t\t\t\t\t\tactive="true"\n\t\t\t\t\t\t\t\ttext="{SupplierName}"\n\t\t\t\t\t\t\t\tvisible="{path:\'SupplierName\', formatter:\'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t</Link>\n\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t</form:FormElement>\n\n\t\t\t\t\t<!-- @ExtensionPoint extInformation: information area -->\n\t\t\t\t\t<core:ExtensionPoint name="extInformation" />\n\t\t\t\t</form:formElements>\n\t\t\t</form:FormContainer>\n\t\t  </form:formContainers>\n\t\t</form:Form>\n\t\t<!-- end of Information area -->\n\n\t\t<!-- Tables area -->\n\t\t<!-- Item Notes -->  \n\t\t<List\n\t\t\tid="ListItemNotes"\n\t\t\titems="{Notes}"\n\t\t\tshowSeparators="None"\n\t\t\theaderDesign="Plain"\n\t\t\theaderText="{i18n>view.PurchaseRequisition.notes}"\n\t\t\tvisible="{parts : [{path : \'NumberOfNotes\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.ItemNoteVisibilityTrigger\'}">\n\t\t\t<FeedListItem\n\t\t\t\tid="NoteTemplate"\n\t\t\t\tsender="{parts : [{path : \'NoteIsApproverNote\'}, {path : \'CreatedByName\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.approverNoteValueFormatter\'}"\n\t\t\t\ttimestamp="{parts : [{path : \'NoteIsApproverNote\'}, {path : \'CreatedAt\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.noteDateFormatter\'}"\n\t\t\t\ttext="{Text}"\n\t\t\t\tsenderPress="onSenderPress"\n\t\t\t\tinfo="{TypeDescription}">\n\t\t\t</FeedListItem>\n\t\t</List>\n\n\t\t<!--Item Attachments -->  \n\t\t<List\n\t\t\tid="ListItemAttachments"\n\t\t\titems="{Attachments}"\n\t\t\theaderText="{i18n>view.PurchaseRequisition.attachments}" \n\t\t\tshowSeparators="None"\n\t\t\theaderDesign="Plain"\n\t\t\tvisible="{parts : [{path : \'NumberOfAttachments\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.ItemAttachmentVisibilityTrigger\'}">\n\t\t\t<StandardListItem\n\t\t\t\ttitle="{parts : [{path : \'Description\'}, {path : \'MimeType\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.formatAttachmentDesc\'}"\n\t\t\t\ticon="{parts : [{path : \'MimeType\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.formatAttachmentIcon\'}"\n\t\t\t\tdescription="{parts : [{path : \'FileSize\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.formatAttachmentSize\'}"\n\t\t\t\ticonInset="false"\n\t\t\t\tpress="onAttachment"\n\t\t\t\ttype="Active"\n\t\t\t\tinfo="{parts : [{path : \'CreatedAt\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.attachmentDateFormatter\'}">\n\t\t\t</StandardListItem>\n\t    </List>\n\n\t    <!-- Limit -->\n\t    <Table\n\t    \tid="LimitTable"\n\t    \tnoDataText="{i18n>view.PurchaseRequisition.placeholder}" \n\t\t\theaderText="{i18n>view.PurchaseRequisition.limit}" \n\t\t\titems="{Limits}"\n\t\t\theaderDesign="Plain"\n\t\t\tvisible="{parts : [{path : \'Limits\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.ItemLimitVisibilityTrigger\'}">\n\t\t\t <columns>\n\t \t\t\t<Column\n\t \t\t\t\tid="LimitTableColumnDescription"\n\t \t\t\t\talignItems="Start"\n\t \t\t\t\tdemandPopin="true">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.DetailItemLimitView.desc}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t\t<Column\n\t \t\t\t\tid="LimitTableColumnLimitValue"\n\t \t\t\t\talignItems="End"\n\t \t\t\t\thAlign="Right"\n\t \t\t\t\tdemandPopin="true"\n\t \t\t\t\tminScreenWidth="Tablet">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.limitValue}">\n\t\t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t\t<Column\n\t \t\t\t\tid="LimitTableColumnExpectedValue"\n\t \t\t\t\talignItems="End"\n\t \t\t\t\thAlign="Right"\n\t \t\t\t\tdemandPopin="true"\n\t \t\t\t\tminScreenWidth="Tablet">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.expValue}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t</columns>\n\t\t\t<ColumnListItem\n\t \t\t\ttype="Navigation"\n\t \t\t\tpress="onServiceLimitPress">\n\t\t\t\t<cells>\n\t\t\t\t\t<ObjectIdentifier\n\t\t\t\t\t\ttitle="{LimitDescription}">\n\t\t\t\t\t</ObjectIdentifier>\n\t\t\t\t\t<Text\n\t\t\t\t\t\ttext="{parts : [{path : \'ValueLimit\'}, {path : \'IsValueUnLimited\'}, {path : \'Currency\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.valueLimitWithoutLabelFormatter\'}">\n\t\t\t\t\t</Text>\n\t\t\t\t\t<ObjectNumber\n\t\t\t\t\t\tnumber="{parts : [{path : \'ExpectedValue\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.formatAmount\'}"\n\t\t\t\t\t\tnumberUnit="{Currency}">\n\t\t\t\t\t</ObjectNumber>\n\t\t\t\t</cells>\n\t\t\t</ColumnListItem>\n\t\t</Table>\n\n\t\t<!-- Service Lines NumberServiceLines -->\n\t\t<Table\n\t\t\tid="NumberServiceLinesTable"\n\t\t\theaderText="{parts : [{path : \'NumberServiceLines\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.serviceLinesTableHeader\'}"\n\t\t\tvisible="{parts : [{path : \'NumberServiceLines\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.ItemServiceLineVisibilityTrigger\'}"\n\t\t\tnoDataText="{i18n>view.PurchaseRequisition.placeholder}" \n\t\t\theaderDesign="Plain"\n\t\t\titems="{ServiceLines}">\n\t\t\t<columns>\n\t \t\t\t<Column\n\t \t\t\t\tid="NumberServiceLinesTableColumnDescription"\n\t \t\t\t\talignItems="Start"\n\t \t\t\t\tdemandPopin="true">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.DetailItemServiceView.desc}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t\t<Column\n\t \t\t\t\tid="NumberServiceLinesTableColumnQuantity"\n\t \t\t\t\talignItems="End"\n\t \t\t\t\thAlign="Right"\n\t \t\t\t\tdemandPopin="true"\n\t \t\t\t\tminScreenWidth="Tablet">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.quantity}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t\t<Column\n\t \t\t\t\tid="NumberServiceLinesTableColumnSubtotal"\n\t \t\t\t\talignItems="End"\n\t \t\t\t\thAlign="Right"\n\t \t\t\t\tdemandPopin="true"\n\t \t\t\t\tminScreenWidth="Tablet">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.DetailItemServiceView.subTotal}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t\t\t</columns>\n\t\t\t<ColumnListItem\n\t \t\t\ttype="Navigation"\n\t \t\t\tpress="onServiceItemPress">\n\t \t\t\t<cells>\n\t \t\t\t\t<ObjectIdentifier\n\t \t\t\t\t\ttitle="{Description}">\n\t \t\t\t\t</ObjectIdentifier>\n\t \t\t\t\t<Text \n\t \t\t\t\t\ttext="{parts : [{path : \'Quantity\'}, {path : \'UnitDescription\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.quantityFormatter\'}">\n\t \t\t\t\t</Text>\n\t \t\t\t\t<ObjectNumber \n\t \t\t\t\t\tnumber="{parts : [{path : \'Value\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.formatAmount\'}"\n\t \t\t\t\t\tnumberUnit="{Currency}">\n\t \t\t\t\t</ObjectNumber>\n\t \t\t\t</cells>\n\t \t\t</ColumnListItem>\n\t\t</Table>\n\n\t\t<!-- Account Assignment -->\n\t\t<layout:VerticalLayout\n\t\t\tvisible="{parts : [{path : \'Accountings\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.ItemAccountAssignmentVisibilityTrigger\'}"\n\t\t\twidth="100%">\n\t\t\t<mvc:XMLView\n\t\t\t\tid="AccountAssignmentCommonView"\n\t\t\t\tviewName="ui.s2p.mm.requisition.approve.view.AccountAssignmentTable">\n\t\t\t</mvc:XMLView>\n\t\t</layout:VerticalLayout>\n\t\t<!-- end of Account Assignment -->\n\n\t\t<!-- Subcontracting -->\n\t\t<Table\n\t\t\tid="SubcontractingTable"\n\t\t\theaderText="{i18n>view.PurchaseRequisition.components}"\n\t\t\tnoDataText="{i18n>view.PurchaseRequisition.placeholder}"\n\t\t\tvisible="{parts:[{path : \'ItemCategory\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.componentVisibilityTrigger\'}"\n\t\t\theaderDesign="Plain"\n\t\t\tclass="purchaseRequisitionTable">\n\t\t\t<columns>\n\t\t\t\t<Column\n\t\t\t\t\tid="ComponentDescription"\n\t\t\t\t\talignItems="Start"\n\t\t\t\t\tdemandPopin="true"\n\t\t\t\t\tminScreenWidth="Tablet">\n\t\t\t\t\t<header>\n\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.descriptionLabel}">\n\t\t\t\t\t\t</Label>\n\t\t\t\t\t</header>\n\t\t\t\t</Column>\n\t\t\t\t<Column\n\t\t\t\t\tid="ComponentQuantity"\n\t\t\t\t\talignItems="End"\n\t\t\t\t\thAlign="Right"\n\t\t\t\t\tdemandPopin="true"\n\t\t\t\t\tminScreenWidth="Tablet">\n\t\t\t\t\t<header>\n\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.quantity}">\n\t\t\t\t\t\t</Label>\n\t\t\t\t\t</header>\n\t\t\t\t</Column>\n\t\t\t</columns>\n\t\t</Table>\n\n\t</Page>\n</core:View>',
	"ui/s2p/mm/requisition/approve/view/ItemServiceLine.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.SelectDialog");
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("ui.s2p.mm.requisition.approve.util.Conversions");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.requisition.approve.view.ItemServiceLine", {

	_bIsHeaderBasedApproval : false,

	onInit: function() {
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.oRouter.attachRouteMatched(this._handleRouteMatched, this);
		this.getView().getModel().setSizeLimit(1000000);
		/**
		 * @ControllerHook Service Lines / onInit
		 * With this controller method the onInit method of the ItemServiceLine controller can be enhanced.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookOnInit
		 */
		if (this.extHookOnInit) {
			this.extHookOnInit();
		}
	},

	_handleRouteMatched: function(oEvent) {
		if (oEvent.getParameter("name") === "subDetail" || 
			oEvent.getParameter("name") === "itemServiceLine") {
			if (oEvent.getParameter("name") === "itemServiceLine") {
				this._bIsHeaderBasedApproval = true;
			} else {
				this._bIsHeaderBasedApproval = false;
			}
			this.sOrigin = oEvent.getParameter("arguments").SAP__Origin;
			this.sWorkitemID = oEvent.getParameter("arguments").WorkitemID;
			this.sPrNumber = oEvent.getParameter("arguments").PrNumber;
			this.sPrItem = oEvent.getParameter("arguments").ItemNumber;
			this.sServiceItem = oEvent.getParameter("arguments").ServiceLineNumber;
			
			var sItemServiceLineContextPath = "/" + this._ServiceLinesCollection();
			this.getView().setBindingContext(new sap.ui.model.Context(this.getView().getModel(),sItemServiceLineContextPath));
			
			this.setLocalHeaderFooterOptions();
		}
	},

	_ItemCollection: function() {
		var sResult;
		if (this._bIsHeaderBasedApproval === false) {
			sResult = "ItemDetailCollection(SAP__Origin='" + this.sOrigin +
					  "',WorkitemID='" + this.sWorkitemID + "')";
		} else {
			sResult = "HeaderItemDetailCollection(SAP__Origin='" + this.sOrigin +
					  "',WorkitemID='" + this.sWorkitemID + "',PrNumber='" + this.sPrNumber +
					  "',ItemNumber='" + this.sPrItem + "')";
		}
		return sResult;
	},

	_ServiceLinesCollection: function() {
		var sResult = "ServiceLineCollection(SAP__Origin='" + this.sOrigin +
					  "',PrNumber='" + this.sPrNumber + "',ItemNumber='" + this.sPrItem + 
					  "',ServiceLineNumber='" + this.sServiceItem + "')";
		return sResult;
	},

	setLocalHeaderFooterOptions: function() {
		var that = this;
		var sItemCollection = this._ItemCollection();
		var sServiceColl = this._ServiceLinesCollection();

		var ServiceLinesCollection = this.oDataModel.getProperty("/" + sItemCollection + "/ServiceLines");
		if ( typeof ServiceLinesCollection === "undefined" ) {
			//in case someone directly navigates to the details screen, we don't have oDataModel loaded and need to navigate back to the S3 screen
			this.navBack();
			return;
		}

		var len = ServiceLinesCollection.length;
		var currentItemIndex = ServiceLinesCollection.indexOf(sServiceColl);
		var sI18NDetailTitle = (this._bIsHeaderBasedApproval === false) ? "view.ServiceLineDetail.title" : "view.ItemServiceLine.title";
		var sController = null;

		if (this._bIsHeaderBasedApproval === true) {
			var sView = this.oRouter.getView("ui.s2p.mm.requisition.approve.view.ItemDetails");
			sController = sView.getController();
		}
		var oLocalHeaderFooterOptions = {
				onBack: function() {
					that.navBack();
				},
				oUpDownOptions: {
					iPosition: currentItemIndex,
					iCount: len,
					fSetPosition: function (iNewItem) {
						if ((iNewItem >= 0) && (iNewItem < len)) {
							var path = ServiceLinesCollection[iNewItem];
							var sServiceLineNumber = that.oDataModel.getProperty("/" + path).ServiceLineNumber;

							if (that._bIsHeaderBasedApproval === false) {
								that.oRouter.navTo("subDetail", {
									SAP__Origin: that.sOrigin,
									WorkitemID: that.sWorkitemID,
									PrNumber: that.sPrNumber,
									ItemNumber: that.sPrItem,
									ServiceLineNumber: sServiceLineNumber
								}, true);
							} else {
								that.oRouter.navTo("itemServiceLine", {
									SAP__Origin: that.sOrigin,
									WorkitemID: that.sWorkitemID,
									PrNumber: that.sPrNumber,
									ItemNumber: that.sPrItem,
									ServiceLineNumber: sServiceLineNumber
								}, true);
							}
						}
					},
					sI18NDetailTitle: sI18NDetailTitle,
					oParent: sController
				}
		};

		/**
		 * @ControllerHook Service Lines / HeaderFooterOptions
		 * With this controller method the setLocalHeaderFooterOptions method of the ItemServiceLine controller 
		 * can be enhanced to change the HeaderFooterOptions.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookSetHeaderFooterOptions
		 * @param {object} oLocalHeaderFooterOptions
		 * @return {object} oLocalHeaderFooterOptions
		 */
		if (this.extHookSetHeaderFooterOptions) {
			oLocalHeaderFooterOptions = this.extHookSetHeaderFooterOptions(oLocalHeaderFooterOptions);
		}

    	this.setHeaderFooterOptions(oLocalHeaderFooterOptions);
    },

    navBack: function() {
		if (this.sOrigin !== "" && this.sWorkitemID !== "" && this._bIsHeaderBasedApproval === false) {
			var sMasterContextPath = "WorkflowTaskCollection(SAP__Origin='" + this.sOrigin + 
                                     "',WorkitemID='" + this.sWorkitemID + "')";

    		this.oRouter.navTo("detail", {
    			contextPath: sMasterContextPath
    		}, true);
		} else if (this.sOrigin !== "" && this.sWorkitemID !== "" &&
				   this.sPrNumber !== "" && this.sPrItem !== "" && this._bIsHeaderBasedApproval === true) {

			this.oRouter.navTo("itemDetails", {
	            SAP__Origin: this.sOrigin,
	            WorkitemID: this.sWorkitemID,
	            PrNumber: this.sPrNumber,
	            ItemNumber: this.sPrItem
			}, true);
		}
	}

});
},
	"ui/s2p/mm/requisition/approve/view/ItemServiceLine.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\tcontrollerName="ui.s2p.mm.requisition.approve.view.ItemServiceLine"\n\txmlns:form="sap.ui.layout.form"\n\txmlns:layout="sap.ui.layout"\n\txmlns:mvc="sap.ui.core.mvc">\n\t<Page\n\t\tshowNavButton="true"\n\t\tid="ItemDetail"\n\t\tclass="sapUiFioriObjectPage"\n\t\tenableScrolling="true">\n\t\t<content>\n\t\t\t<ObjectHeader\n\t\t\t\tid="Header"\n\t\t\t\tintroActive="true"\n\t\t\t\ttitle="{Description}"\n\t\t\t\ttitleActive="false"\n\t\t\t\tnumber="{parts : [{path : \'Value\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.formatAmount\'}"\n\t\t\t\tnumberUnit="{Currency}">\n\t\t\t\t<firstStatus>\n\t\t\t\t\t<ObjectStatus\n\t\t\t\t\t\tid="HeaderAttributeWiCreatedAt"\n\t\t\t\t\t\ttext="{parts : [{path:\'WiCreatedAt\'}], formatter:\'ui.s2p.mm.requisition.approve.util.Conversions.ApprovalDateFormatter\'}">\n\t\t\t\t\t</ObjectStatus>\n\t\t\t\t</firstStatus>\n\t\t\t\t<attributes>\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="ATTR1"\n\t\t\t\t\t\ttext="{parts : [{path : \'Quantity\'}, {path : \'UnitDescription\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.quantityFormatter\'}" />\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="ATTR2"\n\t\t\t\t\t\ttext="{parts : [{path : \'QuantityForPPU\'}, {path : \'UnitForPPUDescription\'}, {path : \'PricePerUnit\'}, {path : \'CurrencyForPPU\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.quantityPerUnitFormatter\'}" />\n\t\t\t\t</attributes>\n\n\t\t\t\t<!-- @ExtensionPoint extServiceLineHeaderInfo: service line information -->\n\t\t\t\t<core:ExtensionPoint name="extServiceLineHeaderInfo" />\n\t\t\t</ObjectHeader>\n\n\t\t\t<!-- Information area of Service Lines -->\n\t\t\t<form:Form\n\t\t\t\tid="serviceDtlView_ServLineFormPrice"\n\t\t\t\tvisible="{parts : [{path : \'ServiceID\'}, {path : \'LongDescription\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.serviceInformationVisibilityTrigger\'}"\n\t\t        title="{i18n>view.DetailItemServiceView.info}">\n\t\t\t\t<form:layout>\n\t\t\t\t\t<form:ResponsiveLayout \n\t\t\t\t\t\tid="serviceDtlView_ServLineFormLayout"> \n\t\t\t\t\t</form:ResponsiveLayout>\n\t\t\t\t</form:layout>\n\t\t\t\t<form:formContainers>\n\t\t\t\t\t<form:FormContainer \n\t\t\t\t\t\tid = "serviceDtlView_InfoContainer">\n\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t<form:formElements>\n\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\tid="serviceDtlView_InfoContainerServiceID"\n\t\t\t\t\t\t\t\tvisible="{parts : [{path : \'ServiceID\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t        <form:layoutData>\n\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t    margin="false">\n\t\t\t\t\t\t\t\t    </layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t        </form:layoutData>\n\t\t\t\t\t\t        <form:label>\n\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\tid="serviceDtlView_Service"\n\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.service}">\n\t\t\t\t\t\t\t\t\t</Label>\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t        <form:fields>\n\t\t\t\t\t\t\t\t\t<Text text="{ServiceID}">\n\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t</form:FormElement>\t\t\t\n\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\tid="serviceDtlView_InfoContainerLongDescription"\n\t\t\t\t\t\t\tvisible="{parts : [{path : \'LongDescription\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\tid= "serviceDtlView_Desc"\n\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.descriptionLabel}">\n\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\tid="serviceDtlView_DescTx"\n\t\t\t\t\t\t\t\t\t    text="{LongDescription}">\n\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t</form:formElements>\n\t\t\t\t\t</form:FormContainer>\n\t\t\t\t</form:formContainers>\n\t\t\t</form:Form>\n\t\t    <!-- end of Information area of Service Lines -->\n\n\t\t\t<!-- Account Assignment -->\n\t\t\t<mvc:XMLView\n\t\t\t\tid="AccountAssignmentCommonView"\n\t\t\t\tviewName="ui.s2p.mm.requisition.approve.view.AccountAssignmentTable">\n\t\t\t</mvc:XMLView>\n\t\t\t<!-- end of Account Assignment -->\n\t\t</content>\n\t</Page>\n</core:View>',
	"ui/s2p/mm/requisition/approve/view/Limit.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("ui.s2p.mm.requisition.approve.util.Conversions");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.ui.dialog.factory");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.requisition.approve.view.Limit", {

	_bIsHeaderBasedApproval : false,

	onInit: function() {
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.oRouter.attachRouteMatched(this._handleRouteMatched, this);
		this.getView().getModel().setSizeLimit(1000000);
		/**
		 * @ControllerHook Limit / onInit
		 * With this controller method the onInit method of the Limit controller can be enhanced.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookOnInit
		 */
		if (this.extHookOnInit) {
			this.extHookOnInit();
		}
	},

	_handleRouteMatched: function(oEvent) {
		if (oEvent.getParameter("name") === "Limit" ||
			oEvent.getParameter("name") === "itemServiceLimit") {
			if (oEvent.getParameter("name") === "itemServiceLimit") {
				this._bIsHeaderBasedApproval = true;
			} else {
				this._bIsHeaderBasedApproval = false;
			} 
			this.sOrigin = oEvent.getParameter("arguments").SAP__Origin;
			this.sWorkitemID = oEvent.getParameter("arguments").WorkitemID;
			this.sPrNumber = oEvent.getParameter("arguments").PrNumber;
			this.sPrItem = oEvent.getParameter("arguments").ItemNumber;

			var sLimitLineContextPath = "/" + this._LimitCollectionPath();
			this.getView().setBindingContext(new sap.ui.model.Context(this.getView().getModel(),sLimitLineContextPath));
			this.setLocalHeaderFooterOptions();
		}
	},

	_HeaderCollectionPath: function() {
		var sResult = "HeaderDetailCollection(SAP__Origin='" + this.sOrigin +
					  "',WorkitemID='" + this.sWorkitemID + "')";
		return sResult;
	},

	_ItemCollectionPath: function() {
		var sResult = "HeaderItemDetailCollection(SAP__Origin='" + this.sOrigin +
					  "',WorkitemID='" + this.sWorkitemID + "',PrNumber='" + this.sPrNumber +
					  "',ItemNumber='" + this.sPrItem + "')";
		return sResult;
	},
	
	_LimitCollectionPath: function() {
		var sLimitCollection = "LimitCollection(" + "SAP__Origin='" + this.sOrigin +
								"',PrNumber='" + this.sPrNumber + "',ItemNumber='" + this.sPrItem + "')";
		return sLimitCollection;
	},


	setLocalHeaderFooterOptions: function() {
		var that = this;
		var currentItemIndex = "";
		var lenItems = "";

		//Handle refresh, browser forward button, direct link to item  
    	var sLimitLineContextPath = "/" + this._LimitCollectionPath();
		var LimitItem = this.oDataModel.getProperty(sLimitLineContextPath);
    	if ( typeof LimitItem === "undefined" ) {
			//in case someone directly navigates to the details screen, we don't have oDataModel loaded and need to navigate back to the S3 screen
			this.navBack();
			return;
		}
		

    	// determine item count and item number for header based approval  
		if (this._bIsHeaderBasedApproval === true) {

	    	var sHeaderCollection = this._HeaderCollectionPath();
	    	var sItemCollection = this._ItemCollectionPath();
	    	var ItemsCollection = this.oDataModel.getProperty("/" + sHeaderCollection + "/HeaderItemDetails");

			lenItems = ItemsCollection.length;
			currentItemIndex = ItemsCollection.indexOf(sItemCollection);
		} 
		
		var oLocalHeaderFooterOptions = {
			onBack: function() {
				that.navBack();
			},
			sDetailTitle: this.getDetailTitle(currentItemIndex + 1, lenItems)
		};

		/**
		 * @ControllerHook Limit / HeaderFooterOptions
		 * With this controller method the setLocalHeaderFooterOptions method of the Limit controller 
		 * can be enhanced to change the HeaderFooterOptions.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookSetHeaderFooterOptions
		 * @param {object} oLocalHeaderFooterOptions
		 * @return {object} oLocalHeaderFooterOptions
		 */
		if (this.extHookSetHeaderFooterOptions) {
			oLocalHeaderFooterOptions = this.extHookSetHeaderFooterOptions(oLocalHeaderFooterOptions);
		}

		this.setHeaderFooterOptions(oLocalHeaderFooterOptions);
	},

	getDetailTitle: function(sCurrentId, sTotalNum){
		if (this._bIsHeaderBasedApproval === false){
			return this.resourceBundle.getText("view.LimitDetail.title");
		} else {
			return this.resourceBundle.getText("view.ItemServiceLimit.title", [sCurrentId, sTotalNum]);
		}
	},

	navBack: function() {
		if (this.sOrigin !== "" && this.sWorkitemID !== "" && this._bIsHeaderBasedApproval === false) {
			var sMasterContextPath = "WorkflowTaskCollection(SAP__Origin='" + this.sOrigin + 
									 "',WorkitemID='" + this.sWorkitemID + "')";
			this.oRouter.navTo("detail", {
				contextPath: sMasterContextPath
			}, true);
		} else if (this.sOrigin !== "" && this.sWorkitemID !== "" &&
			   this.sPrNumber !== "" && this.sPrItem !== "" && this._bIsHeaderBasedApproval === true){

			this.oRouter.navTo("itemDetails", {
	            SAP__Origin: this.sOrigin,
	            WorkitemID: this.sWorkitemID,
	            PrNumber: this.sPrNumber,
	            ItemNumber: this.sPrItem
			}, true);
		}
	}

});
},
	"ui/s2p/mm/requisition/approve/view/Limit.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\tcontrollerName="ui.s2p.mm.requisition.approve.view.Limit"\n\txmlns:form="sap.ui.layout.form"\n\txmlns:mvc="sap.ui.core.mvc">\n\t<Page\n\t\tshowNavButton="true"\n\t\tid="Limit"\n\t\tclass="sapUiFioriObjectPage"\n\t\ttitle="{i18n>view.LimitDetail.title}"\n\t\tenableScrolling="true">\n\t\t<content>\n\t\t\t<ObjectHeader\n\t\t\t\tid="Header"\n\t\t\t\tintroActive="true"\n\t\t\t\ttitle="{LimitDescription}"\n\t\t\t\ttitleActive="false"\n\t\t\t\tnumber="{parts : [{path : \'ExpectedValue\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.formatAmount\'}"\n\t\t\t\tnumberUnit="{Currency}">\n\t\t\t\t<attributes>\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="ATTR2"\n\t\t\t\t\t\ttext="{parts : [{path : \'ExpectedValue\'}, {path : \'Currency\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.expectedValueFormatter\'}"/>\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="HeaderAttributeValueLimit"\n\t\t\t\t\t\ttext="{parts : [{path : \'ValueLimit\'}, {path : \'IsValueUnLimited\'}, {path : \'Currency\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.valueLimitFormatter\'}"/>\n\t\t\t\t</attributes>\n\n\t\t\t\t<!-- @ExtensionPoint extServiceLimitHeaderInfo: limit information -->\n\t\t\t\t<core:ExtensionPoint name="extServiceLimitHeaderInfo" />\n\t\t\t</ObjectHeader>\n\n\t\t\t<!-- Account Assignment -->\n\t\t\t<mvc:XMLView\n\t\t\t\tid="AccountAssignmentCommonView"\n\t\t\t\tviewName="ui.s2p.mm.requisition.approve.view.AccountAssignmentTable">\n\t\t\t</mvc:XMLView>\n\t\t\t<!-- end of Account Assignment -->\n\t\t</content>\n\t</Page>\n</core:View>',
	"ui/s2p/mm/requisition/approve/view/S2.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("ui.s2p.mm.requisition.approve.util.Conversions");

sap.ca.scfld.md.controller.ScfldMasterController.extend("ui.s2p.mm.requisition.approve.view.S2", {
	_IsItemBasedApproval: false,
	_ItemType: "",

	onInit: function() {

		var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
		var oComponent = sap.ui.component(sComponentId);
		var oList = this.getList();
		this.bIsApproved = false;

		oComponent.oEventBus.subscribe("ui.s2p.mm.requisition.approve", "selectNextWorkItem", this._selectNextWorkItem, this);
		this.getView().getModel().setSizeLimit(1000000);

		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "detail" ||
				oEvent.getParameter("name") === "headerDetail") {
				
				this.sItemBindingContextPath = this.getBindingContextPathFor(oEvent.getParameter("arguments"));
				var iNumberOfItems = oList.getItems().length;
				var oSelectedItem = oList.getSelectedItem();
				if (oSelectedItem !== null && !sap.ui.Device.system.phone) {
					var iSelectedItemIndex = oList.indexOfItem(oSelectedItem);
					this.aNextItems = [];
					var iNextItemIndex = iSelectedItemIndex + 1;
					var iNextAfterNextItemIndex = iSelectedItemIndex + 2;
					this.aNextItems.push(oSelectedItem);
					if (iNumberOfItems >= iNextAfterNextItemIndex) {
						this.aNextItems.push(oList.getItems()[iNextItemIndex]);
						this.aNextItems.push(oList.getItems()[iNextAfterNextItemIndex]);
					} else if (iNumberOfItems >= iNextItemIndex) {
						this.aNextItems.push(oList.getItems()[iNextItemIndex]);
					}
				}
			}
		}, this);

			oList.attachEvent("updateFinished", function(oEvent) {
			if (!sap.ui.Device.system.phone) {
				if(!this.aNextItems){
					var oList = this.getList();
					var oCurrentItem = this.findItemByContextPath(this.sItemBindingContextPath);
					var oSelectedItem = oList.getSelectedItem();
						
					if(oSelectedItem !== null){
						var iSelectedItemIndex = oList.indexOfItem(oSelectedItem);
						var iNumberOfItems = oList.getItems().length;
						this.aNextItems = [];
						var iNextItemIndex = iSelectedItemIndex + 1;
						var iNextAfterNextItemIndex = iSelectedItemIndex + 2;
						this.aNextItems.push(oSelectedItem);										
						if(iNumberOfItems >= iNextAfterNextItemIndex){
							this.aNextItems.push(oList.getItems()[iNextItemIndex]);
							this.aNextItems.push(oList.getItems()[iNextAfterNextItemIndex]);
						}else if(iNumberOfItems >= iNextItemIndex){
							this.aNextItems.push(oList.getItems()[iNextItemIndex]);				
						}
					} else{
						//select item
						oList.setSelectedItem(oCurrentItem);
						oSelectedItem = oCurrentItem;
						}
					
				}else if(this.aNextItems && this.getList().getItems().length > 0){					
					if(!this.getList().getSelectedItem()){					
						var bFound = false;
						for(var i in this.aNextItems){
							if (this.aNextItems[i] == undefined) break;
							var oItem = this.findItemByContextPath(this.aNextItems[i].getBindingContextPath());
							if(oItem){
								this.setListItem(oItem);								
								bFound = true;
								break;
							}
						}
						if(!bFound){
							this.selectFirstItem();
						}
					}
				}else {
					this.showEmptyView("DETAIL_TITLE", "NO_ITEMS_AVAILABLE");
				}
			}		
		}, this);
		
		
		/**
		 * @ControllerHook S2 (List) / onInit With this controller method the onInit method of the S2 (List) controller can be enhanced.
		 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookOnInit
		 */
		if (this.extHookOnInit) {
			this.extHookOnInit();
		}
	},
	/**
	 * @private [_selectNextWorkItem on after approval/reject/forward, to select next row in desktop/phone]
	 */
	_selectNextWorkItem: function(channelId, eventId, data) {
		//perform refresh of master list and select next workitem if the current workitem doesn't exist anymore after the refresh
		//in case of using a phone - navigate to the master list and don't select any workitem
		if (eventId === "selectNextWorkItem") {
			if (sap.ui.Device.system.phone) {
				//Navigation to s2 view is only necessary for mobile phones because only one view can be displayed there (s2 or s3)
				window.history.go(-1);
			}

			var oList = this.getList();
			oList.getBinding('items').refresh();
			oList.attachEventOnce("updateFinished", function() {
				if (data.bMessageToast && data.bMessageToast === true && data.sMessage) {
					sap.ca.ui.message.showMessageToast(data.sMessage);
				}
			}, this);
		}
	},

	getHeaderFooterOptions: function() {
		var oLocalHeaderFooterOptions = {
			sI18NMasterTitle: "view.Master.title"
		};

		/**
		 * @ControllerHook  S2 (List) / HeaderFooterOptions
		 * With this controller method the getHeaderFooterOptions method of the S2 (List) controller
		 * can be enhanced to change the HeaderFooterOptions.
		 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookSetHeaderFooterOptions
		 * @param {object} oLocalHeaderFooterOptions
		 * @return {object} oLocalHeaderFooterOptions
		 */
		if (this.extHookSetHeaderFooterOptions) {
			oLocalHeaderFooterOptions = this.extHookSetHeaderFooterOptions(oLocalHeaderFooterOptions);
		}

		return oLocalHeaderFooterOptions;
	},

	setApprovalType: function(oListItem) {
		if (oListItem) {
			var oBindingContext = oListItem.getBindingContext();
			if (oBindingContext) {
				var oProperty = this.getView().getModel().getProperty(oBindingContext.getPath());
				this._IsItemBasedApproval = oProperty.IsItemBasedApproval;
			}
		}
	},

	setItemType: function(oListItem) {
		if (oListItem) {
			var oBindingContext = oListItem.getBindingContext();
			if (oBindingContext) {
				var oProperty = this.getView().getModel().getProperty(oBindingContext.getPath());
				this._ItemType = oProperty.ItemType;
			}
		}
	},

	getItemType: function() {
		return this._ItemType;
	},

	//overwrite scaffolding _handleSelect function because ApprovalType must be set
	_handleSelect: function(oEvent) {
		this.setApprovalType(oEvent.getParameter("listItem"));
		this.setItemType(oEvent.getParameter("listItem"));

		// call prototype
		sap.ca.scfld.md.controller.ScfldMasterController.prototype._handleSelect.call(this, oEvent);
	},

	_handleItemPress: function(oEvent) {
		this.setApprovalType(oEvent.getSource());
		this.setItemType(oEvent.getSource());

		// call prototype
		sap.ca.scfld.md.controller.ScfldMasterController.prototype._handleItemPress.call(this, oEvent);
	},

	selectFirstItem: function() {
		var oList = this.getList();
		var aItems = oList.getItems();
		var oListItem;

		if (aItems.length < 1) {
			return;
		}
		oListItem = this._oApplicationImplementation.getFirstListItem(this);

		if (oListItem) {
			this.setApprovalType(oListItem);

			// call prototype or this.setListItem(oListItem)?
			this.setListItem(oListItem);
		}
	},

	getDetailRouteName: function() {
		if (this._IsItemBasedApproval != "X") {
			return "headerDetail";
		} else {
			return "detail";
		}
	},

	_searchOnODataFields: function(oItem, sFilterPattern) {
		var aODataSearchFields = this._getODataSearchFields();

		//oData data
		var oModel = oItem.getBindingContext(this.sModelName).getProperty();

		return aODataSearchFields.some(function(sKey) {
			var sValue = "";

			if (sKey === "WiCreatedAt") {
				//enable comparing "medium-date-format" with "days-ago-format"
				//searching for e.g. "Yesterday" will match while searching on UI elements
				var oModelDate = oModel[sKey];
				var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({
					style: "medium"
				}, sap.ui.getCore().getConfiguration().getLocale());
				if (oModelDate !== "") {
					sValue = formatter.format(oModelDate, false);
				}
			} else {
				sValue = oModel[sKey];
			}

			if (typeof sValue === "string") {
				if (sValue.toLowerCase().indexOf(sFilterPattern) !== -1) {
					return true;
				}
			}
		});
	},

	_getODataSearchFields: function() {
		var aODataSearchFields = ["CreatedByName", "ForwardedByName", "ItemDescriptions", "PrNumber", "PrNumberFormatted", "SearchForText",
		                          "SubstitutingForName", "WiCreatedAt", "WorkitemID"];

		/**
		 * @ControllerHook  S2 (List) / Search
		 * With this controller method the document search can be changed. It is possible to remove or add oData search fields.
		 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookModifySearchableODataFieldsForMasterListSearch
		 * @param {object[]}
		 * 			An array which contains the oData fields which will be searchable.
		 * @return {object[]}
		 * 			An array which contains the oData fields which will be searchable.
		 */
		if (this.extHookModifySearchableODataFieldsForMasterListSearch) {
			aODataSearchFields = this.extHookModifySearchableODataFieldsForMasterListSearch(aODataSearchFields);
		}
		return aODataSearchFields;
	},

	_getTextsFromUIElementsForSearch: function(oItem) {
		var aUITexts = [];

		// default = add all UI texts to the array and add all attribute texts to the array
		if (oItem.getIntro()) aUITexts.push(oItem.getIntro());
		if (oItem.getTitle()) aUITexts.push(oItem.getTitle());
		if (oItem.getNumber()) aUITexts.push(oItem.getNumber());
		if (oItem.getNumberUnit()) aUITexts.push(oItem.getNumberUnit());
		if (oItem.getFirstStatus()) aUITexts.push(oItem.getFirstStatus().getText());
		if (oItem.getSecondStatus()) aUITexts.push(oItem.getSecondStatus().getText());

		var aAttributes = oItem.getAttributes();
		for (var j = 0; j < aAttributes.length; j++) {
			aUITexts.push(aAttributes[j].getText());
		}

		/**
		 * @ControllerHook  S2 (List) / Search
		 * With this controller method the document search can be changed. It is possible to define which UI texts are searchable. By default all UI texts are searchable.
		 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookDefineSearchableUITextsForMasterListSearch
		 * @param {object}
		 * 			An object - the List Item
		 * @return {object[]}
		 * 			An array which contains the UI texts which will be searchable.
		 */
		if (this.extHookDefineSearchableUITextsForMasterListSearch) {
			aUITexts = this.extHookDefineSearchableUITextsForMasterListSearch(oItem);
		}
		return aUITexts;
	},

	_searchOnUITexts: function(oItem, sFilterPattern) {

		var aUITexts = this._getTextsFromUIElementsForSearch(oItem);

		return aUITexts.some(function(uiText) {
			if (uiText !== "undefined" && uiText !== "") {
				if (uiText.toLowerCase().indexOf(sFilterPattern) !== -1) {
					return true;
				}
			}
		});
	},

	//Overwrite Scfhld. function because of do not using all OData-properties
	applySearchPatternToListItem: function(oItem, sFilterPattern) {

		if (sFilterPattern === "") {
			return true;
		}
		if (this._searchOnODataFields(oItem, sFilterPattern) === true) {
			return true;
		}
		if (this._searchOnUITexts(oItem, sFilterPattern) === true) {
			return true;
		}

		return false;
	}
});
},
	"ui/s2p/mm/requisition/approve/view/S2.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\tcontrollerName="ui.s2p.mm.requisition.approve.view.S2">\n\t<Page\n\t\tid="page"\n\t\ttitle="{i18n>view.Master.title}">\n\t\t<content>\n\t\t\t<List\n\t\t\t\tid="list"\n\t\t\t\titems="{path : \'/WorkflowTaskCollection\',\n\t\t\t\t\tsorter : {\n\t\t\t\t\t\tpath : \'WiCreatedAt\',\n\t\t\t\t\t\tdescending : true}}"\n\t\t\t\tmode="{device>/listMode}"\n\t\t\t\tselect="_handleSelect">\n\t\t\t\t<ObjectListItem\n\t\t\t\t\tid="MAIN_LIST_ITEM"\n\t\t\t\t\ttype="{device>/listItemType}"\n\t\t\t\t\tpress="_handleItemPress"\n\t\t\t\t\ttitle="{CreatedByName}"\n\t\t\t\t\tnumber="{parts:[{path : \'Value\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.lazyRoundNumber\'}"\n\t\t\t\t\tnumberUnit="{Currency}">\n\t\t\t\t\t<firstStatus>\n\t\t\t\t\t\t<ObjectStatus\n\t\t\t\t\t\t\tid="ListStatusWiCreatedAt"  \n\t\t\t\t\t\t\ttext="{parts:[{path:\'WiCreatedAt\'}], formatter:\'ui.s2p.mm.requisition.approve.util.Conversions.deliveryDateFormatter\'}">\n\t\t\t\t\t\t</ObjectStatus>\n\t\t\t\t\t</firstStatus>\n\t\t\t\t\t<attributes>\n\t\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\t\tid="ATTR1"\n\t\t\t\t\t\t\ttext="{ItemDescriptions}" />\n\t\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\t\tid="ATTR2"\n\t\t\t\t\t\t\ttext="{parts:[{path : \'ForwardedByName\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.forwardedBy\'}"\n\t\t\t\t\t\t\tvisible="{parts:[{path : \'ForwardedByName\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}" />\n\t\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\t\tid="ATTR3"\n\t\t\t\t\t\t\ttext="{parts:[{path : \'SubstitutingForName\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.substitutedBy\'}"\n\t\t\t\t\t\t\tvisible="{parts:[{path : \'SubstitutingForName\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}" />\n\t\t\t\t\t</attributes>\n\n\t\t\t\t\t<!-- @ExtensionPoint extListItemInfo: list item information -->\n\t\t\t\t\t<core:ExtensionPoint name="extListItemInfo" />\n\t\t\t\t</ObjectListItem>\n\t\t\t</List>\n\t\t</content>\n\t\t<footer>\n\t\t\t<Bar id="footer"></Bar>\n\t\t</footer>\n\t</Page>\n</core:View>',
	"ui/s2p/mm/requisition/approve/view/S3.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("ui.s2p.mm.requisition.approve.util.Conversions");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.requisition.approve.view.S3", {

	onInit: function() {

		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.getView().getModel().setSizeLimit(1000000);
		this.setLocalHeaderFooterOptions();

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "detail") {
				var sDetailContextPath = oEvent.getParameter("arguments").contextPath + "/ItemDetails";
				sDetailContextPath = sDetailContextPath.replace("WorkflowTaskCollection", "/WorkflowTaskCollection");
				var sItemType = this.oRouter.getView("ui.s2p.mm.requisition.approve.view.S2").getController().getItemType();

				var oSubcontractingTable = this.byId("SubcontractingTable");

				if (sItemType === "3") {
					this.getView().bindElement(sDetailContextPath, {
						expand: 'Accountings,Notes,Attachments,Limits/Accountings,ServiceLines/Accountings,Components'
					});

					this.getView().getElementBinding().attachEventOnce("dataReceived", function() {
						var aCells = [
							new sap.m.ObjectIdentifier({
								title : "{parts:[{path : 'Description'}, {path : 'Material'}], formatter : 'ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter'}"
							}),
							new sap.m.ObjectNumber({
								number : "{parts: [{path : 'Quantity'}], formatter : 'ui.s2p.mm.requisition.approve.util.Conversions.quantityFormatterWithoutUnit'}",
								numberUnit : "{BaseUnitDescription}"
							})
						];
						var oTemplate = new sap.m.ColumnListItem({cells : aCells});
						oSubcontractingTable.bindItems("Components", oTemplate, null, null);
						oSubcontractingTable.setVisible(true);
					}, this);

				} else {
					oSubcontractingTable.unbindItems();
					oSubcontractingTable.setVisible(false);
					this.getView().bindElement(sDetailContextPath, {
						expand: 'Accountings,Notes,Attachments,Limits/Accountings,ServiceLines/Accountings'
					});
				}

				if (this.getView().byId("tabBar").getSelectedKey() !== "Info") {
					this.getView().byId("tabBar").setSelectedKey("Info");
				}
			}
		}, this);

		/**
		 * @ControllerHook S3 / onInit
		 * With this controller method the onInit method of the S3 controller can be enhanced.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookOnInit
		 */
		if (this.extHookOnInit) {
			this.extHookOnInit();
		}
	},

	setLocalHeaderFooterOptions: function() {
		var that = this;
		var oLocalHeaderFooterOptions = {
				oPositiveAction: {
					sI18nBtnTxt: that.resourceBundle.getText("XBUT_APPROVE"),
					onBtnPressed: jQuery.proxy(that.openApproveRejectDialog, that, ['approve'])
				},
				oNegativeAction: {
					sI18nBtnTxt: that.resourceBundle.getText("XBUT_REJECT"),
					onBtnPressed: jQuery.proxy(that.openApproveRejectDialog, that, ['reject'])
				},
				buttonList: [{
					sId: "btn_Forward",
					sI18nBtnTxt: "XBUT_FORWARD",
					onBtnPressed: jQuery.proxy(this.handleForward, that)
				}],
				onBack: jQuery.proxy(function() {
	                if (sap.ui.Device.system.phone) {	
	                	//Back-button on s3 screen is only displayed on mobile phones
	                    window.history.go(-1);
	                }
				}, this)
		};

		/**
		 * @ControllerHook S3 / HeaderFooterOptions
		 * With this controller method the setLocalHeaderFooterOptions method of the S3 controller 
		 * can be enhanced to change the HeaderFooterOptions.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookSetHeaderFooterOptions
		 * @param {object} oLocalHeaderFooterOptions
		 * @return {object} oLocalHeaderFooterOptions
		 */
		if (this.extHookSetHeaderFooterOptions) {
			oLocalHeaderFooterOptions = this.extHookSetHeaderFooterOptions(oLocalHeaderFooterOptions);
		}

		this.setHeaderFooterOptions(oLocalHeaderFooterOptions);
	},

	openApproveRejectDialog : function(arg){		
		var CreatedByID = this.oView.getBindingContext().getProperty("CreatedByID");
		var sDialogQuestion = "";
		var sDialogTitle = "";
		var sDecisionKey = "";
		var that = this;
		
		switch(arg[0]){
			case 'approve':
				sDialogQuestion = this.resourceBundle.getText("dialog.question.approve", [CreatedByID]);
				sDialogTitle = this.resourceBundle.getText("XTIT_APPROVAL");
				sDecisionKey = "0001";
				this.sTextKey = "dialog.success.approve";
				break;
			case 'reject':
				sDialogQuestion = this.resourceBundle.getText("dialog.question.reject", [CreatedByID]);
				sDialogTitle = this.resourceBundle.getText("XTIT_REJECT");
				sDecisionKey = "0002";
				this.sTextKey = "dialog.success.reject";
				break;
			default:
				break;
		}
		
		new sap.m.Dialog(this.createId("s3ApproveRejectDialog"),{
			title: sDialogTitle,
			showHeader: true,
			content: [
					new sap.ui.layout.VerticalLayout( 
						{
								width: "100%",
								content : [
								 new sap.m.Text(this.createId("S3ConfirmRejectDialogTextField"),{
										text: sDialogQuestion
									}).addStyleClass("sapUiSmallMarginBottom"),
									new sap.m.TextArea(this.createId("S3ConfirmRejectDialogTextFieldForNotes"),{
										maxLength: 0,
										width: "100%",
										placeholder: this.resourceBundle
											.getText("dialog.ApproveRejectForward.NotePlaceHolder"),
										editable: true
									})
							]
						}
					)
				],

			beginButton: new sap.m.Button({
				text: this.resourceBundle.getText("XBUT_OK"),
				press: function() {
					var sNoteText = that.byId("S3ConfirmRejectDialogTextFieldForNotes").getValue();
					var oResult = {
							isConfirmed: true,
							sNote: sNoteText
						};						 
					that.handleApproveRejectExecute(oResult, sDecisionKey);
					that.byId("s3ApproveRejectDialog").close();
				}
			}),
			endButton: new sap.m.Button({
				text: this.resourceBundle.getText("XBUT_CANCEL"),
				press: function() {
					that.byId("s3ApproveRejectDialog").close();
				}
			}),
			afterClose: function(oEvent) {
				this.destroy();
			}
		}).addStyleClass("sapUiPopupWithPadding").open(); 

	},

	handleApproveRejectExecute: function(oResult, sDecisionKey) {
		var oDataObj = this.oView.getModel().getProperty(this.oView.getBindingContext().getPath());
		var comment;
		if (oResult.sNote) {
			comment = oResult.sNote;
		} else {
			comment = "";
		}	  
		this.oDataModel.setRefreshAfterChange(false);
		this.oDataModel.callFunction(
			"ApplyDecision",
			"POST",
			{
				SAP__Origin: oDataObj.SAP__Origin,
				WorkitemID: oDataObj.WorkitemID,
				DecisionKey: sDecisionKey, 
				Comment: comment
			},
			undefined,
			jQuery.proxy(this._handleApproveRejectSuccess, this),
			jQuery.proxy(this._handleApproveRejectForwardFail, this)
		);
},

	_handleApproveRejectSuccess: function(oSuccess) {		
		if(oSuccess){
			if(oSuccess.ApplyDecision.ActionSuccessful !== 'X'){		
				//Approval or rejection of this purchase order is still in process. 
				//Refresh the list of purchase orders manually.
				var sMessage = this.resourceBundle.getText("dialog.refreshMasterListManually");
				var sDetails = null;			
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.INFO,
					message: sMessage,
					details: sDetails
				});
			}
			else{
				//Approval or rejection of this purchase order was successfully proceed. 
				//Refresh the list of purchase orders automatically.
				var sSuccessText = this.resourceBundle.getText(this.sTextKey);
				var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView()),
				oComponent = sap.ui.component(sComponentId);
				var data = {
						bMessageToast : true,
						sMessage : sSuccessText
				};
				//create and open the message toast after the view switch (after automatically select of next work item)  
				oComponent.oEventBus.publish("ui.s2p.mm.requisition.approve", "selectNextWorkItem", data);				
			}
		}	
		this.oDataModel.setRefreshAfterChange(true);
	},

	_handleApproveRejectForwardFail: function(oError) {
		this.oDataModel.setRefreshAfterChange(true);
		if (this.oDataModel.hasPendingChanges()) {
			this.oDataModel.refresh(true);
		}
		this.onRequestFailed(oError);
	},

	handleForward: function(oEvent) {
		var that = this;
		var oDataObj = this.getView().getModel().getProperty(
			this.getView().getBindingContext().getPath());
		var sOrigin = oDataObj.SAP__Origin;
		var sWorkitemID = oDataObj.WorkitemID;
		var fnStartSearch = function(sQeury) {
			var sFilter = "$filter=" + encodeURIComponent("SearchForText eq '" + sQeury + "' and SAP__Origin eq '" + sOrigin + "'");
			that.oDataModel.read("/ForwardingAgentCollection", null, [sFilter], true, function(oData,
				oResponse) {
				sap.ca.ui.dialog.forwarding.setFoundAgents(oData.results);
			}, jQuery.proxy(that.onRequestFailed, this));
		};
		var fnClose = function(oResult) {
			if (oResult && oResult.bConfirmed) {
				var oSelectedAgent = oResult.oAgentToBeForwarded;
				var sText = that.resourceBundle.getText("dialog.success.forward", [oSelectedAgent.FullName]);
				var oEntry = {};
				if (oResult.sNote) {
					oEntry.Comment = oResult.sNote;
				} else {
					oEntry.Comment = "";
				}

				that.oDataModel.setRefreshAfterChange(false);
				that.oDataModel.callFunction(
					"Forward",
					"POST",
					{
						SAP__Origin: sOrigin,
						WorkitemID: sWorkitemID,
						NewApprover: oSelectedAgent.UserId,
						Comment: oEntry.Comment
					},
					undefined,
					function() {
						var sComponentId = sap.ui.core.Component.getOwnerIdFor(that.getView()),
							oComponent = sap.ui.component(sComponentId);
						that.getView().unbindElement();
						oComponent.oEventBus.publish("ui.s2p.mm.requisition.approve", "selectNextWorkItem");
						that.oDataModel.setRefreshAfterChange(true);
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.SUCCESS,
							message: sText,
							details: sText
						});
					},
					jQuery.proxy(that._handleApproveRejectForwardFail, that)
				);
			}
		};
		sap.ca.ui.dialog.forwarding.start(fnStartSearch, fnClose);
	},

	onNamePress: function(oEvent) {
		this.openEmployeeLaunch(oEvent, "CreatedByID");
	},

	onForwardedPress: function(oEvent) {
		this.openEmployeeLaunch(oEvent, "ForwardedByID");
	},

	onSubstitutingPress: function(oEvent) {
		this.openEmployeeLaunch(oEvent, "SubstitutingForID");
	},

	onAgentPress: function(oEvent) {
		this.openEmployeeLaunch(oEvent, "CreatedByID");
	},

	onNoteSenderPress: function(oEvent) {
		this.openEmployeeLaunch(oEvent, "CreatedByID");
	},

	openEmployeeLaunch: function(oEvent, sRef) {

		//var oControl = oEvent.getSource();
		var oControl = oEvent.getParameters().domRef;
		var sTitle = this.resourceBundle.getText("BusinessCard.employee");

		// Open employee type business card
		var onRequestSuccess = function(oData) {
			var data = oData.results[0],
				oEmpConfig = {
					title: sTitle,
					name: data.FullName,
					imgurl: ui.s2p.mm.requisition.approve.util.Conversions.businessCardImg(data.Mime_Type, data.__metadata.media_src),
					department: data.Department,
					contactmobile: data.MobilePhone,
					contactphone: data.WorkPhone,
					contactemail: data.EMail,
					companyname: data.CompanyName,
					companyaddress: data.AddressString
				},
				oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oEmpConfig);
			oEmployeeLaunch.openBy(oControl);
		};

		var sOrigin = oEvent.getSource().getBindingContext().getProperty("SAP__Origin");
		var sUser = oEvent.getSource().getBindingContext().getProperty(sRef);

		var sFilter = "$filter=" + encodeURIComponent("UserID eq '" + sUser + "' and SAP__Origin eq '" + sOrigin + "'");
		this.oDataModel.read("UserDetailsCollection", null, [sFilter], true,
			jQuery.proxy(onRequestSuccess, this),
			jQuery.proxy(this.onRequestFailed, this));
	},

	onSupplierPress: function(oEvent) {
		this.onCompanyLaunch(oEvent, "SupplierID");
	},

	onCompanyLaunch: function(oEvent, sRef) {
		var sTitle = this.oApplicationFacade.getResourceBundle().getText("BusinessCard.supplier");
		var sSupplierId = this.oApplicationFacade.getODataModel().getProperty("SupplierID", this.getView().getBindingContext());

		var oControl = oEvent.getSource();
		var sOrigin = this.getView().getBindingContext().getProperty("SAP__Origin");
		var oApplicationFacade = this.oApplicationFacade;
		var sSupplierDetailsCollection = "SupplierDetailCollection(SupplierID='" + sSupplierId + "',SAP__Origin='" + sOrigin + "')";
		var aParam = ["$expand=SupplierContacts"];
		sap.ca.ui.utils.busydialog.requireBusyDialog();
		oApplicationFacade.getODataModel().read(sSupplierDetailsCollection, null, aParam, true, function(oData, response) {
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
			var hasContacts = (oData.SupplierContacts && (oData.SupplierContacts.results.length > 0));
			var oSBCData = {
				title: sTitle,
				imgurl: ui.s2p.mm.requisition.approve.util.Conversions.businessCardImg(oData.Mime_Type, oData.__metadata.media_src),
				companyname: oData.SupplierName,
				companyphone: oData.WorkPhone,
				companyaddress: oData.AddressString,
				maincontactname: hasContacts ? oData.SupplierContacts.results[0].ContactName : oData.ContactName,
				maincontactmobile: hasContacts ? oData.SupplierContacts.results[0].MobilePhone : oData.MobilePhone,
				maincontactphone: hasContacts ? oData.SupplierContacts.results[0].WorkPhone : oData.WorkPhone,
				maincontactemail: hasContacts ? oData.SupplierContacts.results[0].EMail : oData.EMail
			};
			var oSupplierBusinessCard = new sap.ca.ui.quickoverview.CompanyLaunch(oSBCData);
			oSupplierBusinessCard.openBy(oControl);
		}, function(oError) {
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
		});

	},

	handleServiceLineItemPress: function(oEvent) {
		this.oRouter.navTo("subDetail", {
			SAP__Origin: this.getView().getBindingContext().getProperty("SAP__Origin"),
			WorkitemID: this.getView().getBindingContext().getProperty("WorkitemID"),
			PrNumber: this.getView().getBindingContext().getProperty("PrNumber"),
			ItemNumber: this.getView().getBindingContext().getProperty("ItemNumber"),
			ServiceLineNumber: oEvent.getSource().getBindingContext().getProperty("ServiceLineNumber")
		}, true);
	},

	handleLimitLineItemPress: function(oEvent) {
		this.oRouter.navTo("Limit", {
			SAP__Origin: this.getView().getBindingContext().getProperty("SAP__Origin"),
			WorkitemID: this.getView().getBindingContext().getProperty("WorkitemID"),
			PrNumber: this.getView().getBindingContext().getProperty("PrNumber"),
			ItemNumber: this.getView().getBindingContext().getProperty("ItemNumber")
		}, true);
	},

	onAttachment: function(oEvent) {
		ui.s2p.mm.requisition.approve.util.Conversions.onAttachment(oEvent);
	},

	handleNavBack: function() {
		window.history.back();
	},

	onRequestFailed: function(oError) {
		var that = this;
		var sMessage = "";
		var sDetails = null;

		if (oError.response && oError.response.body != "" && 
		 (oError.response.statusCode == "400" || oError.response.statusCode == "500")) {
			var oMessage = JSON.parse(oError.response.body);
			sMessage = oMessage.error.message.value;
		}
		if (sMessage == "") {
			sMessage = oError.message;
			sDetails = oError.response.body;
		}

		sap.ca.ui.message.showMessageBox({
			type: sap.ca.ui.message.Type.ERROR,
			message: sMessage,
			details: sDetails
		}, function(){
			var sComponentId = sap.ui.core.Component.getOwnerIdFor(that.getView()),
			oComponent = sap.ui.component(sComponentId);			
			oComponent.oEventBus.publish("ui.s2p.mm.requisition.approve", "selectNextWorkItem");
		});
	},

	isMainScreen: function() {
		return true;
	},

	onExit : function() {
		// close open popovers
		if (sap.m.InstanceManager.hasOpenPopover()) {
			sap.m.InstanceManager.closeAllPopovers();
	}
		// close open dialogs
		if (sap.m.InstanceManager.hasOpenDialog()) {
			sap.m.InstanceManager.closeAllDialogs();
		}
	}

});
},
	"ui/s2p/mm/requisition/approve/view/S3.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\tcontrollerName="ui.s2p.mm.requisition.approve.view.S3"\n\txmlns:form="sap.ui.layout.form"\n\txmlns:layout="sap.ui.layout"\n\txmlns:mvc="sap.ui.core.mvc">\n\n\t<Page\n\t\tid="page"\n\t\tclass="sapUiFioriObjectPage"\n\t\ttitle="{i18n>view.Detail.title}"\n\t\tshowNavButton="{device>/isPhone}"\n\t\tnavButtonPress="handleNavBack">\n\t\t<content>\n\t\t\t<ObjectHeader\n\t\t\t\tid="Header"\n\t\t\t\tintroActive="true"\n\t\t\t\ttitle="{CreatedByName}"\n\t\t\t\ttitlePress="onNamePress"\n\t\t\t\ttitleActive="true"\n\t\t\t\tnumber="{parts:[{path : \'Value\'}, {path : \'ItemCategory\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.formatNumberItemType\'}"\n\t\t\t\tnumberUnit="{Currency}">\n\t\t\t\t<statuses>\n\t\t\t\t\t<ObjectStatus\n\t\t\t\t\t\tid="ObjectHeaderStatusWiCreatedAt"  \n\t\t\t\t\t\ttext="{parts:[{path:\'WiCreatedAt\'}], formatter:\'ui.s2p.mm.requisition.approve.util.Conversions.deliveryDateFormatter\'}">\n\t\t\t\t\t</ObjectStatus>\n\t\t\t\t</statuses>\n\t\t\t\t<attributes>\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="ObjectHeaderAttributeDescription"\n\t\t\t\t\t\ttext="{Description}"\n\t\t\t\t\t\tvisible="{parts:[{path : \'Description\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t</ObjectAttribute>\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="ObjectHeaderAttributeForwardedBy"\n\t\t\t\t\t\ttext="{parts:[{path : \'ForwardedByName\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.forwardedBy\'}"\n\t\t\t\t\t\tpress="onForwardedPress"\n\t\t\t\t\t\tactive="true"\n\t\t\t\t\t\tvisible="{parts:[{path : \'ForwardedByName\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t</ObjectAttribute>\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="ObjectHeaderAttributeSubstitutedBy"\n\t\t\t\t\t\ttext="{parts:[{path : \'SubstitutingForName\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.substitutedBy\'}"\n\t\t\t\t\t\tpress="onSubstitutingPress"\n\t\t\t\t\t\tactive="true"\n\t\t\t\t\t\tvisible="{parts:[{path : \'SubstitutingForName\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t</ObjectAttribute>\n\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\tid="ObjectHeaderAttributeItemCategory"\n\t\t\t\t\t\ttext="{ItemCategoryDescription}"\n\t\t\t\t\t\tpress="onSubstitutingPress"\n\t\t\t\t\t\tactive="false"\n\t\t\t\t\t\tvisible="{parts:[{path : \'ItemCategoryDescription\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t</ObjectAttribute>\n\t\t\t\t</attributes>\n\n\t\t\t\t<!-- @ExtensionPoint extHeaderInfo: header information -->\n\t\t\t\t<core:ExtensionPoint name="extHeaderInfo" />\n\t\t\t</ObjectHeader>\n\n\t\t\t<IconTabBar\n\t\t\t\tid="tabBar"\n\t\t\t\texpanded="{device>/isNoPhone}">\n\t\t\t\t<items>\n\t\t\t\t\t<IconTabFilter\n\t\t\t\t\t\tid="IconTabBarFilterPRInformation"\n\t\t\t\t\t\tkey="Info"\n\t\t\t\t\t\ticon="sap-icon://hint">\n\t\t\t\t\t\t<content>\n\t\t\t\t\t\t\t<form:Form\n\t\t\t\t\t\t\t\tid="InfoForm">\n\t\t\t\t\t\t\t\t<form:layout>\n\t\t\t\t\t\t\t\t\t<form:ResponsiveLayout></form:ResponsiveLayout>\n\t\t\t\t\t\t\t\t</form:layout>\n\t\t\t\t\t\t\t\t<form:formContainers>\t\t\t\t\n\t\t\t\t\t\t\t\t\t<form:FormContainer>\n\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<form:formElements>\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\tid="PRInformationPRLabel">\n\t\t\t\t\t\t\t\t\t\t\t    <form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t       <layout:ResponsiveFlowLayoutData\n\t\t\t\t\t     \t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t     \t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t    \t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t        <form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.Detail.title}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t        \t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{PrNumber}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\n\t\t\t\t\t\t\t<!-- Material -->\n\t\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\tid="PRInformationMaterial"\n\t\t\t\t\t\t\t\t\t\t\t\tvisible="{parts:[{path : \'ProductDetails/ItemType\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.materialVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.material}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t    \ttext="{parts:[{path : \'ProductDetails/MaterialID\'}, {path : \'Description\'} ], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.materialGroupFormatter\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t\t</form:FormElement>\t\n\n\t\t\t\t\t\t\t<!-- Service -->\n\t\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\tid="PRInformationService"\n\t\t\t\t\t\t\t\t\t\t\t\tvisible="{parts:[{path : \'ProductDetails/ItemType\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.serviceVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.service}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t    \ttext="{Description}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t\t</form:FormElement>\t\n\n\t\t\t\t\t\t\t<!-- Quantity -->\n\t\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\tid="PRInformationQuantity">\n\t\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.quantity}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t    \ttext="{parts:[{path : \'Quantity\'}, {path : \'UnitDescription\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.quantityFormatter\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t\t</form:FormElement>\t\n\n\t\t\t\t\t\t\t<!-- Price -->\n\t\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\tid="PRInformationPrice"\n\t\t\t\t\t\t\t\t\t\t\t\tvisible="{parts:[{path : \'PricePerUnit\'}, {path : \'ItemCategory\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.priceFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.pricePerUnit}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t    \ttext="{parts:[{path : \'QuantityForPPU\'}, {path : \'UnitDescription\'}, {path : \'PricePerUnit\'}, {path : \'Currency\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.quantityPerUnitFormatter\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t\t</form:FormElement>\t\n\n\t\t\t\t\t\t\t<!-- MaterialGroup -->\n\t\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\tid="PRInformationMaterialGroup"\n\t\t\t\t\t\t\t\t\t\t\t\tvisible="{parts:[{path : \'ProductDetails/ItemType\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.materialVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.materialGroup}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t    \ttext="{parts:[{path : \'ProductDetails/MaterialGroup\'}, {path : \'ProductDetails/MaterialGroupDescription\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.materialGroupFormatter\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t\t</form:FormElement>\t\n\n\t\t\t\t\t\t\t<!-- ServiceGroup -->\n\t\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\tid="PRInformationServiceGroup"\n\t\t\t\t\t\t\t\t\t\t\t\tvisible="{parts:[{path : \'ProductDetails/ItemType\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.serviceVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.serviceGroup}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t    \ttext="{parts:[{path : \'ProductDetails/MaterialGroup\'}, {path : \'ProductDetails/MaterialGroupDescription\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.materialGroupFormatter\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t\t</form:FormElement>\t\n\t\t\t\t\t\t\t\t\t\t</form:formElements>\n\t\t\t\t\t\t\t\t\t</form:FormContainer>\n\t\t\t\t\t\t\t\t</form:formContainers>\n\t\t\t\t\t\t\t</form:Form>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\n\t\t\t\t\t\t\t<!-- @ExtensionPoint extInformation: Do not use this extension point. It has a duplicate name. Use extInformationS3 instead. -->\n\t\t\t\t\t\t\t<core:ExtensionPoint name="extInformation" />\n\t\t\t\t\t\t</content>\n\t\t\t\t\t</IconTabFilter>\n\n\t\t\t\t\t<IconTabFilter\n\t\t\t\t\t\tid="IconTabBarFilterPRNotes"\n\t\t\t\t\t\tkey="Notes"\n\t\t\t\t\t\tcount="{NumberOfNotes}"\n\t\t\t\t\t\tvisible="{path:\'NumberOfNotes\', formatter:\'ui.s2p.mm.requisition.approve.util.Conversions.ItemNoteVisibilityTrigger\'}"\n\t\t\t\t\t\ticon="sap-icon://notes">\n\t\t\t\t\t\t<List\n\t\t\t\t\t\t\tid="list"\n\t\t\t\t\t\t\tshowSeparators="None"\n\t\t\t\t\t\t\tinset="true"\n\t\t\t\t\t\t\titems="{path:\'Notes\'}">\n\t\t\t\t\t\t\t<FeedListItem\n\t\t\t\t\t\t\t\tid="NoteTemplate"\n\t\t\t\t\t\t\t\tsender="{parts:[{path : \'NoteIsApproverNote\'}, {path : \'CreatedByName\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.approverNoteValueFormatter\'}"\n\t\t\t\t\t\t\t\ticon="{Thumbnail}"\n\t\t\t\t\t\t\t\ttimestamp="{parts:[{path : \'NoteIsApproverNote\'}, {path : \'CreatedAt\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.noteDateFormatter\'}"\n\t\t\t\t\t\t\t\tsenderPress="onNoteSenderPress"\n\t\t\t\t\t\t\t\ttext="{Text}"\n\t\t\t\t\t\t\t\tinfo="{TypeDescription}">\n\t\t\t\t\t\t\t</FeedListItem>\n\t\t\t\t\t\t</List>\n\t\t\t\t\t</IconTabFilter>\n\t\t\t\t\t<IconTabFilter\n\t\t\t\t\t\tid="IconTabBarFilterPRAttachments"\n\t\t\t\t\t\tkey="Attachments"\n\t\t\t\t\t\tcount="{NumberOfAttachments}"\n\t\t\t\t\t\ticon="sap-icon://attachment"\n\t\t\t\t\t\tvisible="{path:\'NumberOfAttachments\', formatter:\'ui.s2p.mm.requisition.approve.util.Conversions.ItemAttachmentVisibilityTrigger\'}">\n\t\t\t\t\t\t<List\n\t\t\t\t\t\t\tid="Attachments"\n\t\t\t\t\t\t\tshowSeparators="None"\n\t\t\t\t\t\t\tinset="true"\n\t\t\t\t\t\t\titems="{Attachments}">\n\t\t\t\t\t\t\t<StandardListItem\n\t\t\t\t\t\t\t\tid="AttachmentListItems"\n\t\t\t\t\t\t\t\ttitle="{parts:[{path:\'Description\'},{path:\'MimeType\'}], formatter:\'ui.s2p.mm.requisition.approve.util.Conversions.formatAttachmentDesc\'}"\n\t\t\t\t\t\t\t\ticon="{parts:[{path:\'MimeType\'}], formatter:\'ui.s2p.mm.requisition.approve.util.Conversions.formatAttachmentIcon\'}"\n\t\t\t\t\t\t\t\tdescription="{parts:[{path:\'FileSize\'}], formatter:\'ui.s2p.mm.requisition.approve.util.Conversions.formatAttachmentSize\'}"\n\t\t\t\t\t\t\t\ticonInset="false"\n\t\t\t\t\t\t\t\tpress="onAttachment"\n\t\t\t\t\t\t\t\ttype="Active"\n\t\t\t\t\t\t\t\tinfo="{parts:[{path : \'CreatedAt\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.attachmentDateFormatter\'}">\n\t\t\t\t\t\t\t</StandardListItem>\n\t\t\t\t\t\t</List>\n\t\t\t\t\t</IconTabFilter>\n\t\t\t\t</items>\n\t\t\t</IconTabBar>\n\t\t\t\n\t\t\t\n\t\t\t<form:Form\n\t\t\t\t\t\t\t\tid="ItemDetailInfoFormDelivery"\n\t\t\t\t\t\t\t\ttitle="{parts : [{path : \'DeliveryDate\'}, {path : \'DeliveryDateAlsoLater\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.deliveryHeaderFormatter\'}">\n\t\t\t\t\t\t\t\t<form:layout>\n\t\t\t\t\t\t\t\t\t<form:ResponsiveLayout></form:ResponsiveLayout>\n\t\t\t\t\t\t\t\t</form:layout>\n\t\t\t\t\t\t\t\t<form:formContainers>\n\t\t\t\t\t\t\t\t\t<form:FormContainer>\n\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t<form:formElements>\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<!-- PlantName -->\n\t\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\tid="PRInformationDeliveryPlantName"\n\t\t\t\t\t\t\t\t\t\t\t\tvisible="{parts : [{path : \'DeliveryAddress/PlantName\'}, {path : \'DeliveryAddress/CustomerName\'}, {path : \'DeliveryAddress/CustomerId\'}, {path : \'DeliveryAddress/ItemType\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.plantVisibilityTrigger\'}">\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.plant}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t    \ttext="{parts : [{path : \'DeliveryAddress/PlantName\'}, {path : \'DeliveryAddress/Plant\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t\t</form:FormElement>\t\n\t\t\t\t\t\n\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\tid="ItemDetailInfoName"\n\t\t\t\t\t\t\tvisible="{parts:[{path : \'DeliveryAddress/CustomerName\' }, {path : \'DeliveryAddress/CustomerId\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.freestyleNameVisibilityTrigger\'}">\n\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.freestyleAdressLabel}"></Label>\n\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\ttext="{DeliveryAddress/CustomerName}">\n\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\tid="ItemDetailInfoCustomer"\n\t\t\t\t\t\t\tvisible="{parts:[{path : \'DeliveryAddress/CustomerName\' }, {path : \'DeliveryAddress/CustomerId\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.customerNameVisibilityTrigger\'}">\n\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.customerLabel}"></Label>\n\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\ttext="{parts:[{path : \'DeliveryAddress/CustomerName\' }, {path : \'DeliveryAddress/CustomerId\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.customerNameFormatter\'}">\n\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<!-- Delivery AddressString -->\n\t\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\tid="PRInformationDeliveryAddressString"\n\t\t\t\t\t\t\t\t\t\t\t\tvisible="{parts : [{path : \'DeliveryAddress/AddressString\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.deliveryAddress}"></Label>\n\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\ttext="{DeliveryAddress/AddressString}">\n\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<!-- SupplierName -->\n\t\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\t\tid="PRInformationSupplierName"\n\t\t\t\t\t\t\t\t\t\t\t\tvisible="{path:\'SupplierName\', formatter:\'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.supplierName}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Link\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tpress="onSupplierPress"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tactive="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{SupplierName}"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tvisible="{path:\'SupplierName\', formatter:\'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Link>\n\t\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\n\t\t\t\t\t\t\t\t\t\t\t<!-- @ExtensionPoint extInformationS3: information area -->\n\t\t\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extInformationS3" />\n\n\t\t\t\t\t\t\t\t\t\t</form:formElements>\n\t\t\t\t\t\t\t\t\t</form:FormContainer>\n\t\t\t\t\t\t\t\t</form:formContainers>\n\t\t\t\t\t\t\t</form:Form>\n\t\t\t\t\t\t\t\n\t\t\t<Table\n\t\t\t\tid="LimitItemTable"\n\t\t\t\titems="{Limits}"\n\t\t\t\theaderText="{i18n>view.LimitDetail.title}"\n\t\t\t\tvisible="{path:\'Limits\', formatter:\'ui.s2p.mm.requisition.approve.util.Conversions.ItemLimitVisibilityTrigger\'}">\n\t\t\t\t<columns>\n\t\t\t\t\t<Column\n\t\t\t\t\t\tid="LimitItemTableColumnDescription">\n\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t<Label text="{i18n>view.DetailItemLimitView.desc}" />\n\t\t\t\t\t\t</header>\n\t\t\t\t\t</Column>\n\t\t\t\t\t<Column\n\t\t\t\t\t \tid="LimitItemTableColumnLimitValue"\n\t\t\t\t\t\thAlign="Center">\n\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t<Label text="{i18n>view.PurchaseRequisition.limitValue}" />\n\t\t\t\t\t\t</header>\n\t\t\t\t\t</Column>\n\t\t\t\t\t<Column\n\t\t\t\t\t\tid="LimitItemTableColumnExpectedValue"\n\t\t\t\t\t \thAlign="Right">\n\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t<Label text="{i18n>view.PurchaseRequisition.expValue}" />\n\t\t\t\t\t\t</header>\n\t\t\t\t\t</Column>\n\t\t\t\t</columns>\n\t\t\t\t<ColumnListItem\n\t\t\t\t\ttype="Navigation"\n\t\t\t\t\tpress="handleLimitLineItemPress">\n\t\t\t\t\t<cells>\n\t\t\t\t\t\t<ObjectIdentifier title="{LimitDescription}" />\n\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\ttext="{parts:[{path : \'ValueLimit\'}, {path : \'IsValueUnLimited\'}, {path : \'Currency\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.valueLimitWithoutLabelFormatter\'}" />\n\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\ttext="{parts:[{path : \'ExpectedValue\'}, {path : \'Currency\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.totalPriceFormatter\'}" />\n\t\t\t\t\t</cells>\n\t\t\t\t</ColumnListItem>\n\t\t\t</Table>\n\t\t\t<Label text=""></Label>\n\t\t\t<Table\n\t\t\t\tid="ServiceItemTable"\n\t\t\t\titems="{ServiceLines}"\n\t\t\t\theaderText="{path:\'NumberServiceLines\', formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.serviceLinesNumFormatter\'}"\n\t\t\t\tvisible="{path:\'ServiceLines\', formatter:\'ui.s2p.mm.requisition.approve.util.Conversions.ItemServiceLineVisibilityTrigger\'}">\n\t\t\t\t<columns>\n\t\t\t\t\t<Column\n\t\t\t\t\t\tid="ServiceItemTableColumnDescription">\n\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t<Label text="{i18n>view.DetailItemServiceView.desc}" />\n\t\t\t\t\t\t</header>\n\t\t\t\t\t</Column>\n\t\t\t\t\t<Column\n\t\t\t\t\t\tid="ServiceItemTableColumnQuantity"\n\t\t\t\t\t \thAlign="Right">\n\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t<Label text="{i18n>view.PurchaseRequisition.quantity}" />\n\t\t\t\t\t\t</header>\n\t\t\t\t\t</Column>\n\t\t\t\t\t<Column\n\t\t\t\t\t\tid="ServiceItemTableColumnSubtotal"\n\t\t\t\t\t \thAlign="Right">\n\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t<Label text="{i18n>view.DetailItemServiceView.subTotal}" />\n\t\t\t\t\t\t</header>\n\t\t\t\t\t</Column>\n\t\t\t\t</columns>\n\t\t\t\t<ColumnListItem\n\t\t\t\t\ttype="Navigation"\n\t\t\t\t\tpress="handleServiceLineItemPress">\n\t\t\t\t\t<cells>\n\t\t\t\t\t\t<ObjectIdentifier title="{Description}" />\n\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\ttext="{parts : [{path:\'Quantity\'}, {path : \'UnitDescription\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.quantityFormatter\'}" />\n\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\ttext="{parts : [{path : \'Value\'}, {path : \'Currency\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.totalPriceFormatter\'}" />\n\t\t\t\t\t</cells>\n\t\t\t\t</ColumnListItem>\n\t\t\t</Table>\n\t\t\t<Label text=""></Label>\n\n\t\t\t<!-- Account Assignment -->\n\t\t\t<layout:VerticalLayout\n\t\t\t\tvisible="{parts : [{path : \'Accountings\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.ItemAccountAssignmentVisibilityTrigger\'}"\n\t\t\t\t>\n\t\t\t\t<mvc:XMLView\n\t\t\t\t\tid="AccountAssignmentCommonView"\n\t\t\t\t\tviewName="ui.s2p.mm.requisition.approve.view.AccountAssignmentTable">\n\t\t\t\t</mvc:XMLView>\n\t\t\t</layout:VerticalLayout>\n\t\t\t<!-- end of Account Assignment -->\n\n\t\t\t<!-- Subcontracting -->\n\t\t\t<Table\n\t\t\t\tid="SubcontractingTable"\n\t\t\t\theaderText="{i18n>view.PurchaseRequisition.components}"\n\t\t\t\tnoDataText="{i18n>view.PurchaseRequisition.placeholder}" \n\t\t\t\tvisible="{path: \'ItemCategory\', formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.componentVisibilityTrigger\'}"\n\t\t\t\theaderDesign="Plain"\n\t\t\t\tclass="purchaseRequisitionTable">\n\t\t\t\t<columns>\n\t\t \t\t\t<Column\n\t\t \t\t\t\tid="ComponentDescription"\n\t\t \t\t\t\talignItems="Start"\n\t\t \t\t\t\tdemandPopin="true"\n\t\t \t\t\t\tminScreenWidth="Tablet">\n\t\t \t\t\t\t<header>\n\t\t \t\t\t\t\t<Label\n\t\t \t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.descriptionLabel}">\n\t\t \t\t\t\t\t</Label>\n\t\t \t\t\t\t</header>\n\t\t \t\t\t</Column>\n\t\t \t\t\t<Column\n\t\t \t\t\t\tid="ComponentQuantity"\n\t\t \t\t\t\talignItems="End"\n\t\t \t\t\t\thAlign="Right"\n\t\t \t\t\t\tdemandPopin="true"\n\t\t \t\t\t\tminScreenWidth="Tablet">\n\t\t \t\t\t\t<header>\n\t\t \t\t\t\t\t<Label\n\t\t \t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.quantity}">\n\t\t \t\t\t\t\t</Label>\n\t\t \t\t\t\t</header>\n\t\t \t\t\t</Column>\n\t\t\t\t</columns>\n\t\t\t</Table>\n\n\t\t</content>\n\t\t<footer>\n\t\t\t<Bar id="detailFooter">\n\t\t\t</Bar>\n\t\t</footer>\n\t</Page>\n</core:View>',
	"ui/s2p/mm/requisition/approve/view/S3_header.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("ui.s2p.mm.requisition.approve.util.Conversions");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.requisition.approve.view.S3_header", {

	onInit: function() {
		
		var that = this;
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.getView().getModel().setSizeLimit(1000000);
		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "headerDetail") {

				var sDetailContextPath = oEvent.getParameter("arguments").contextPath + "/HeaderDetails";
				sDetailContextPath = sDetailContextPath.replace("WorkflowTaskCollection", "/WorkflowTaskCollection");

				var oController = this;
				if (oController.sContext !== sDetailContextPath ||
								 oController.sContext === "") {
					this.sContext = sDetailContextPath;
					this.refreshScreen(sDetailContextPath);
				}
			}
		}, this);

		/**
		 * @ControllerHook S3 Header / onInit
		 * With this controller method the onInit method of the S3_header controller can be enhanced.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookOnInit
		 */
		if (this.extHookOnInit) {
			this.extHookOnInit();
		}
	},

	
	refreshScreen : function(sDetailContextPath){
		if (sDetailContextPath) {
			var oView = this.getView();			
			oView.bindElement(sDetailContextPath, {
					expand: 'HeaderItemDetails,Notes,Attachments'
			});
			//make sure that the information tab will be selected
			if (oView.byId("tabBar").getSelectedKey() !== "Info") {
				oView.byId("tabBar").setSelectedKey("Info");
			}
			oView.getElementBinding().attachEventOnce("dataReceived",
						this.onDataLoaded, this);
		}
	},
	
	onDataLoaded : function(oEv) {
		var that = this;
		var oLocalHeaderFooterOptions = {
				oPositiveAction: {
					sI18nBtnTxt: that.resourceBundle.getText("XBUT_APPROVE"),
					onBtnPressed: jQuery.proxy(that.openApproveRejectDialog, that, ['approve'])
				},
				oNegativeAction: {
					sI18nBtnTxt: that.resourceBundle.getText("XBUT_REJECT"),
					onBtnPressed: jQuery.proxy(that.openApproveRejectDialog, that, ['reject'])
				},
				buttonList: [{
					sId: "btn_Forward",
					sI18nBtnTxt: "XBUT_FORWARD",
					onBtnPressed: jQuery.proxy(this.handleForward, that)
				}],
				onBack: jQuery.proxy(function() {
	                if (sap.ui.Device.system.phone) {	
	                	//Back-button on s3 screen is only displayed on mobile phones
	                    window.history.go(-1);
	                }
				}, this)
		};

		/**
		 * @ControllerHook S3 Header / HeaderFooterOptions
		 * With this controller method the onDataLoaded method of the S3_header controller 
		 * can be enhanced to change the HeaderFooterOptions.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookSetHeaderFooterOptions
		 * @param {object} oLocalHeaderFooterOptions
		 * @return {object} oLocalHeaderFooterOptions
		 */
		if (this.extHookSetHeaderFooterOptions) {
			oLocalHeaderFooterOptions = this.extHookSetHeaderFooterOptions(oLocalHeaderFooterOptions);
		}

		this.setHeaderFooterOptions(oLocalHeaderFooterOptions);
	},

	navToItemDetails: function(oEvent) {
		var bc = oEvent.getSource().getBindingContext().getPath();
		var oModel = this.getView().getModel();

		this.oRouter.navTo("itemDetails", {
			SAP__Origin: this.getView().getBindingContext().getProperty("SAP__Origin"),
			WorkitemID: this.getView().getBindingContext().getProperty("WorkitemID"),
			PrNumber: this.getView().getBindingContext().getProperty("PrNumber"),
			ItemNumber: oModel.getProperty(bc).ItemNumber
		}, true);
	},

	
	openApproveRejectDialog : function(arg){
		var CreatedByID = this.oView.getBindingContext().getProperty("CreatedByID");
		var sDialogQuestion = "";
		var sDialogTitle = "";
		var sDecisionKey = "";
		var that = this;

		switch(arg[0]){
			case 'approve':
				sDialogQuestion = this.resourceBundle.getText("dialog.question.approve", [CreatedByID]);
				sDialogTitle = this.resourceBundle.getText("XTIT_APPROVAL");
				sDecisionKey = "0001";
				this.sTextKey = "dialog.success.approve";
				break;
			case 'reject':
				sDialogQuestion = this.resourceBundle.getText("dialog.question.reject", [CreatedByID]);
				sDialogTitle = this.resourceBundle.getText("XTIT_REJECT");
				sDecisionKey = "0002";
				this.sTextKey = "dialog.success.reject";
				break;
			default:
				break;
		}

		new sap.m.Dialog(this.createId("s3ApproveRejectDialog"),{
			title: sDialogTitle,
			showHeader: true,
			content: [
					new sap.ui.layout.VerticalLayout( 
						 {
								width: "100%",
								content : [	
								 new sap.m.Text(this.createId("S3ConfirmRejectDialogTextField"),{
										text: sDialogQuestion
									}).addStyleClass("sapUiSmallMarginBottom"),
									new sap.m.TextArea(this.createId("S3ConfirmRejectDialogTextFieldForNotes"),{
										maxLength: 80,
										width: "100%",
										placeholder: this.resourceBundle
											.getText("dialog.ApproveRejectForward.NotePlaceHolder"),
										editable: true
									})
							 ]
						 }
					)
				],
				
			beginButton: new sap.m.Button({
				text: this.resourceBundle.getText("XBUT_OK"),
				press: function() {
					var sNoteText = that.byId("S3ConfirmRejectDialogTextFieldForNotes").getValue();
					var oResult = {
										isConfirmed: true,
										sNote: sNoteText
						 };
						 that.handleApproveRejectExecute(oResult, sDecisionKey);
						 that.byId("s3ApproveRejectDialog").close();
				}
			}),
			endButton: new sap.m.Button({
				text: this.resourceBundle.getText("XBUT_CANCEL"),
				press: function() {
					that.byId("s3ApproveRejectDialog").close();
				}
			}),
			afterClose: function(oEvent) {
				this.destroy();
			}
		}).addStyleClass("sapUiPopupWithPadding").open(); 

	},

	handleApproveRejectExecute: function(oResult, sDecisionKey) {
		var oDataObj = this.oView.getModel().getProperty(this.oView.getBindingContext().getPath());
		var comment;
		if (oResult.sNote) {
			comment = oResult.sNote;
		} else {
			comment = "";
		}	
		this.oDataModel.setRefreshAfterChange(false);
		this.oDataModel.callFunction(
			"ApplyDecision",
			"POST",
			{
				SAP__Origin: oDataObj.SAP__Origin,
				WorkitemID: oDataObj.WorkitemID,
				DecisionKey: sDecisionKey, 
				Comment: comment
			},
			undefined,
			jQuery.proxy(this._handleApproveRejectSuccess, this),
			jQuery.proxy(this._handleApproveRejectForwardFail, this)
		);
},

	_handleApproveRejectSuccess: function(oSuccess) {
		if(oSuccess){
			if(oSuccess.ApplyDecision.ActionSuccessful !== 'X'){		
				//Approval or rejection of this purchase order is still in process. 
				//Refresh the list of purchase orders manually.
				var sMessage = this.resourceBundle.getText("dialog.refreshMasterListManually"); //oSuccess.ApplyDecision.MsgToUsr;
				var sDetails = null;
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.INFO,
					message: sMessage,
					details: sDetails
				});
			}else{
				//Approval or rejection of this purchase order was successfully proceed. 
				//Refresh the list of purchase orders automatically.
				var sSuccessText = this.resourceBundle.getText(this.sTextKey);
				var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView()),
				oComponent = sap.ui.component(sComponentId);
				var data = {
						bMessageToast : true,
						sMessage : sSuccessText
				};
				//create and open the message toast after the view switch (after automatically select of next work item)
				oComponent.oEventBus.publish("ui.s2p.mm.requisition.approve", "selectNextWorkItem", data);				
			}			
		}
		this.oDataModel.setRefreshAfterChange(true);	
	},

	_handleApproveRejectForwardFail: function(oError) {
		this.oDataModel.setRefreshAfterChange(true);
		if (this.oDataModel.hasPendingChanges()) {
			this.oDataModel.refresh(true);
		}
		this.onRequestFailed(oError);
	},

	handleForward: function(oEvent) {
		var that = this;
		var oDataObj = this.getView().getModel().getProperty(
			this.getView().getBindingContext().getPath());
		var sOrigin = oDataObj.SAP__Origin;
		var sWorkitemID = oDataObj.WorkitemID;
		var fnStartSearch = function(sQeury) {
			var sFilter = "$filter=" + encodeURIComponent("SearchForText eq '" + sQeury + "' and SAP__Origin eq '" + sOrigin + "'");
			that.oDataModel.read("/ForwardingAgentCollection", null, [sFilter], true, function(oData,
				oResponse) {
				sap.ca.ui.dialog.forwarding.setFoundAgents(oData.results);
			}, jQuery.proxy(that.onRequestFailed, this));
		};
		var fnClose = function(oResult) {
			if (oResult && oResult.bConfirmed) {
				var oSelectedAgent = oResult.oAgentToBeForwarded;
				var sText = that.resourceBundle.getText("dialog.success.forward", [oSelectedAgent.FullName]);
				var oEntry = {};
				if (oResult.sNote) {
					oEntry.Comment = oResult.sNote;
				} else {
					oEntry.Comment = "";
				}

				that.oDataModel.setRefreshAfterChange(false);
				that.oDataModel.callFunction(
					"Forward",
					"POST",
					{
						SAP__Origin: sOrigin,
						WorkitemID: sWorkitemID,
						NewApprover: oSelectedAgent.UserId,
						Comment: oEntry.Comment
					},
					undefined,
					function() {
						var sComponentId = sap.ui.core.Component.getOwnerIdFor(that.getView()),
							oComponent = sap.ui.component(sComponentId);
						that.getView().unbindElement();
						oComponent.oEventBus.publish("ui.s2p.mm.requisition.approve", "selectNextWorkItem");
						that.oDataModel.setRefreshAfterChange(true);
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.SUCCESS,
							message: sText,
							details: sText
						});
					},
					jQuery.proxy(that._handleApproveRejectForwardFail, that)
				);
			}
		};
		sap.ca.ui.dialog.forwarding.start(fnStartSearch, fnClose);
	},

	onNamePress: function(oEvent) {
		this.openEmployeeLaunch(oEvent, "CreatedByID");
	},

	onForwardedPress: function(oEvent) {
		this.openEmployeeLaunch(oEvent, "ForwardedByID");
	},

	onSubstitutingPress: function(oEvent) {
		this.openEmployeeLaunch(oEvent, "SubstitutingForID");
	},

	onNoteSenderPress: function(oEvent) {
		this.openEmployeeLaunch(oEvent, "CreatedByID");
	},

	openEmployeeLaunch: function(oEvent, sRef) {
		//var oControl = oEvent.getSource();
		var oControl = oEvent.getParameters().domRef;
		var sTitle = this.resourceBundle.getText("BusinessCard.employee");

		// Open employee type business card
		var onRequestSuccess = function(oData) {

			var data = oData.results[0],
				oEmpConfig = {
					title: sTitle,
					name: data.FullName,
					imgurl: ui.s2p.mm.requisition.approve.util.Conversions.businessCardImg(data.Mime_Type, data.__metadata.media_src),
					department: data.Department,
					contactmobile: data.MobilePhone,
					contactphone: data.WorkPhone,
					contactemail: data.EMail,
					companyname: data.CompanyName,
					companyaddress: data.AddressString
				},
				oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oEmpConfig);
			oEmployeeLaunch.openBy(oControl);
		};

		var sOrigin = oEvent.getSource().getBindingContext().getProperty("SAP__Origin");
		var sUser = oEvent.getSource().getBindingContext().getProperty(sRef);

		var sFilter = "$filter=" + encodeURIComponent("UserID eq '" + sUser + "' and SAP__Origin eq '" + sOrigin + "'");
		this.oDataModel.read("UserDetailsCollection", null, [sFilter], true,
			jQuery.proxy(onRequestSuccess, this),
			jQuery.proxy(this.onRequestFailed, this));
	},

	onSupplierPress: function(oEvent) {
		this.onCompanyLaunch(oEvent, "SupplierID");
	},

	onCompanyLaunch: function(oEvent, sRef) {
		var sTitle = this.oApplicationFacade.getResourceBundle().getText("BusinessCard.supplier");
		var sSupplierId = this.oApplicationFacade.getODataModel().getProperty("SupplierID", this.getView().getBindingContext());
		var oControl = oEvent.getSource();
		var sOrigin = this.getView().getBindingContext().getProperty("SAP__Origin");
		var oApplicationFacade = this.oApplicationFacade;
		var sSupplierDetailsCollection = "SupplierDetailCollection(SupplierID='" + sSupplierId + "',SAP__Origin='" + sOrigin + "')";
		var aParam = ["$expand=SupplierContacts"];
		sap.ca.ui.utils.busydialog.requireBusyDialog();
		oApplicationFacade.getODataModel().read(sSupplierDetailsCollection, null, aParam, true, function(oData, response) {
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
			var hasContacts = (oData.SupplierContacts && (oData.SupplierContacts.results.length > 0));
			var oSBCData = {
				title: sTitle,
				imgurl: ui.s2p.mm.requisition.approve.util.Conversions.businessCardImg(oData.Mime_Type, oData.__metadata.media_src),
				companyname: oData.SupplierName,
				companyphone: oData.WorkPhone,
				companyaddress: oData.AddressString,
				maincontactname: hasContacts ? oData.SupplierContacts.results[0].ContactName : oData.ContactName,
				maincontactmobile: hasContacts ? oData.SupplierContacts.results[0].MobilePhone : oData.MobilePhone,
				maincontactphone: hasContacts ? oData.SupplierContacts.results[0].WorkPhone : oData.WorkPhone,
				maincontactemail: hasContacts ? oData.SupplierContacts.results[0].EMail : oData.EMail
			};
			var oSupplierBusinessCard = new sap.ca.ui.quickoverview.CompanyLaunch(oSBCData);
			oSupplierBusinessCard.openBy(oControl);
		}, function(oError) {
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
		});

	},

	handleServiceLineItemPress: function(oEvent) {
		this.oRouter.navTo("subDetail", {
			SAP__Origin: this.getView().getBindingContext().getProperty("SAP__Origin"),
			WorkitemID: this.getView().getBindingContext().getProperty("WorkitemID"),
			PrNumber: this.getView().getBindingContext().getProperty("PrNumber"),
			ItemNumber: this.getView().getBindingContext().getProperty("ItemNumber"),
			ServiceLineNumber: oEvent.getSource().getBindingContext().getProperty("ServiceLineNumber")
		}, true);
	},

	handleLimitLineItemPress: function(oEvent) {
		this.oRouter.navTo("Limit", {
			SAP__Origin: this.getView().getBindingContext().getProperty("SAP__Origin"),
			WorkitemID: this.getView().getBindingContext().getProperty("WorkitemID"),
			PrNumber: this.getView().getBindingContext().getProperty("PrNumber"),
			ItemNumber: this.getView().getBindingContext().getProperty("ItemNumber")

		}, true);
	},

	onAttachment: function(oEvent) {
		ui.s2p.mm.requisition.approve.util.Conversions.onAttachment(oEvent);
	},


	handleNavBack: function() {
		window.history.back();
	},

	onRequestFailed: function(oError) {
		var that = this;
		var sMessage = "";
		var sDetails = null;

		if (oError.response && oError.response.body != "" && 
		 (oError.response.statusCode == "400" || oError.response.statusCode == "500")) {
			var oMessage = JSON.parse(oError.response.body);
			sMessage = oMessage.error.message.value;
		}
		if (sMessage == "") {
			sMessage = oError.message;
			sDetails = oError.response.body;
		}

		sap.ca.ui.message.showMessageBox({
			type: sap.ca.ui.message.Type.ERROR,
			message: sMessage,
			details: sDetails
		}, function(){
			var sComponentId = sap.ui.core.Component.getOwnerIdFor(that.getView()),
			oComponent = sap.ui.component(sComponentId);			
			oComponent.oEventBus.publish("ui.s2p.mm.requisition.approve", "selectNextWorkItem");
		});
	},

	isMainScreen: function() {
		return true;
	},
	
	onExit : function() {
		// close open popovers
		if (sap.m.InstanceManager.hasOpenPopover()) {
		 sap.m.InstanceManager.closeAllPopovers();
	}
		// close open dialogs
		if (sap.m.InstanceManager.hasOpenDialog()) {
		 sap.m.InstanceManager.closeAllDialogs();
		}
	}

});
},
	"ui/s2p/mm/requisition/approve/view/S3_header.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:form="sap.ui.layout.form"\n\txmlns:layout="sap.ui.layout"\n\tcontrollerName="ui.s2p.mm.requisition.approve.view.S3_header">\n\t\n\t<!-- S3 screen -->\n\t<Page\n\t\tid="page"\n\t\tclass="sapUiFioriObjectPage"\n\t\ttitle="{i18n>view.Detail.title}"\n\t\tshowNavButton="{device>/isPhone}"\n\t\tnavButtonPress="handleNavBack">\n\n\t\t<!-- Header -->\n\t\t<ObjectHeader\n\t\t\tid="Header"\n\t\t\ttitle="{CreatedByName}"\n\t\t\ttitlePress="onNamePress"\n\t\t\ttitleActive="true"\n\t\t\tnumber="{parts : [{path : \'Value\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.formatAmount\'}"\n\t\t\tnumberUnit="{Currency}">\n\t\t\t<statuses>\n\t\t\t\t<ObjectStatus\n\t\t\t\t\tid="ObjectHeaderStatusWiCreatedAt"\n\t\t\t\t\ttext="{parts : [{path : \'WiCreatedAt\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.deliveryDateFormatter\'}">\n\t\t\t\t</ObjectStatus>\n\t\t\t</statuses>\n\t\t\t<attributes>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="ObjectHeaderAttributeDescription"\n\t\t\t\t\ttext="{Description}"\n\t\t\t\t\tvisible="{parts : [{path : \'Description\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t</ObjectAttribute>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="ObjectHeaderAttributeForwardedBy"\n\t\t\t\t\ttext="{parts : [{path : \'ForwardedByName\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.forwardedBy\'}"\n\t\t\t\t\tpress="onForwardedPress"\n\t\t\t\t\tactive="true"\n\t\t\t\t\tvisible="{parts : [{path : \'ForwardedByName\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t</ObjectAttribute>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="ObjectHeaderAttributeSubstitutedBy"\n\t\t\t\t\ttext="{parts : [{path : \'SubstitutingForName\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.substitutedBy\'}"\n\t\t\t\t\tpress="onSubstitutingPress"\n\t\t\t\t\tactive="true"\n\t\t\t\t\tvisible="{parts : [{path : \'SubstitutingForName\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t</ObjectAttribute>\n\n\t\t\t\t<!-- @ExtensionPoint extHeaderInfoOverallRelease: header information -->\n\t\t\t\t<core:ExtensionPoint name="extHeaderInfoOverallRelease" />\n\t\t\t</attributes>\n\n\t\t\t<!-- @ExtensionPoint extHeaderInfo: Do not use this extension point. It has a duplicate name. Use extHeaderInfoOverallRelease instead. -->\n\t\t\t<core:ExtensionPoint name="extHeaderInfo" />\n\t\t</ObjectHeader>\n\t\t<!-- end of Header -->\n\n\t\t<!-- Icon Tab Bar -->\n\t\t<IconTabBar\n\t\t\tid="tabBar"\n\t\t\texpanded="{device>/isNoPhone}">\n\t\t\t<items>\n\t\t\t\t<IconTabFilter\n\t\t\t\t\tid="IconTabBarFilterPRInformation"\n\t\t\t\t\tkey="Info"\n\t\t\t\t\ticon="sap-icon://hint">\n\t\t\t\t\t<!-- Information -->\n\t\t\t\t\t<form:Form \n\t\t\t\t\t\tid="InfoForm">\n\t\t\t\t\t\t<form:layout>\n\t\t\t\t\t\t\t<form:ResponsiveLayout></form:ResponsiveLayout>\n\t\t\t\t\t\t</form:layout>\n\t\t\t\t\t\t<form:formContainers>\n\t\t\t\t\t\t\t<form:FormContainer>\n\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t<form:formElements>\n\t\t\t\t\t\t\t\t     <form:FormElement\n\t\t\t\t\t\t\t\t     \tid="PRInformationPRLabel">\n\t\t\t\t\t\t\t\t        <form:layoutData>\n\t\t\t\t\t\t\t\t\t\t    <layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t     linebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t     margin="false">\n\t\t\t\t\t\t\t\t\t\t    </layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t        <form:label>\n\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.purchaseRequisitionLabel}">\n\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t        <form:fields>\n\t\t\t\t\t\t\t\t\t\t\t<Text text="{PrNumber}">\n\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t</form:FormElement>\n\n\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\tid="PRInformationAccountAssignment"\n\t\t\t\t\t\t\t\t\t\tvisible="{parts : [{path : \'HeaderAcc/CumulatedAccountingTypeCode\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.headerAccountingVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.accountAssignment}">\n\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t<Text text="{parts : [{path : \'HeaderAcc\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.headerAccountingFormatter\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t</form:FormElement>\n\n\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\tid="PRInformationDeliveryDate"\n\t\t\t\t\t\t\t\t\t\tvisible="{parts : [{path : \'DeliveryDate\'}, {path : \'DeliveryDateAlsoLater\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.deliveryDate}">\n\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t    text="{parts : [{path : \'DeliveryDate\'}, {path : \'DeliveryDateAlsoLater\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.deliveryDateFormatter\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t</form:FormElement>\t\n\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\tid="PRInformationDeliveryPlantName"\n\t\t\t\t\t\t\t\t\t\tvisible="{parts : [{path : \'HdDeliveryAddress/PlantName\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.plant}">\n\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t    text="{parts : [{path : \'HdDeliveryAddress/PlantName\'}, {path : \'HdDeliveryAddress/Plant\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t</form:FormElement>\t\n\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\tid="PRInformationSupplierName"\n\t\t\t\t\t\t\t\t\t\tvisible="{path : \'SupplierName\', formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.supplierName}">\n\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t<Link\n\t\t\t\t\t\t\t\t\t\t\t\tpress="onSupplierPress"\n\t\t\t\t\t\t\t\t\t\t\t\tactive="true"\n\t\t\t\t\t\t\t\t\t\t\t\ttext="{SupplierName}"\n\t\t\t\t\t\t\t\t\t\t\t\tvisible="{path : \'SupplierName\', formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t</Link>\n\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t</form:FormElement>\n\n\t\t\t\t\t\t\t\t\t<!-- @ExtensionPoint extInformation: Do not use this extension point. It has a duplicate name. Use extInformationOverallRelease instead. -->\n\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extInformation" />\n\n\t\t\t\t\t\t\t\t\t<!-- @ExtensionPoint extInformationOverallRelease: information area -->\n\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extInformationOverallRelease" />\n\t\t\t\t\t\t\t\t</form:formElements>\n\t\t\t\t\t\t\t</form:FormContainer>\n\t\t\t\t\t\t</form:formContainers>\n\t\t\t\t\t</form:Form>\n\t\t\t\t\t<!-- end of Information -->\n\t\t\t\t</IconTabFilter>\n\t\t\t\t<IconTabFilter\n\t\t\t\t\tid="IconTabBarFilterPRNotes"\n\t\t\t\t\tkey="Notes"\n\t\t\t\t\tcount="{NumberOfNotes}"\n\t\t\t\t\tvisible="{path : \'NumberOfNotes\', formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.notesVisibilityTrigger\'}"\n\t\t\t\t\ticon="sap-icon://notes">\n\t\t\t\t\t<List\n\t\t\t\t\t\tid="list"\n\t\t\t\t\t\tshowSeparators="None"\n\t\t\t\t\t\tinset="true"\n\t\t\t\t\t\titems="{path : \'Notes\'}">\n\t\t\t\t\t\t<FeedListItem\n\t\t\t\t\t\t\tid="NoteTemplate" \n\t\t\t\t\t\t\tsender="{parts : [{path : \'NoteIsApproverNote\'}, {path : \'CreatedByName\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.approverNoteValueFormatter\'}"\n\t\t\t\t\t\t\ticon="{Thumbnail}"\n\t\t\t\t\t\t\ttimestamp="{parts : [{path : \'NoteIsApproverNote\'}, {path : \'CreatedAt\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.noteDateFormatter\'}"\n\t\t\t\t\t\t\tsenderPress="onNoteSenderPress"\n\t\t\t\t\t\t\ttext="{Text}"\n\t\t\t\t\t\t\tinfo="{TypeDescription}">\n\t\t\t\t\t\t</FeedListItem>\n\t\t\t\t\t</List>\n\t\t\t\t</IconTabFilter>\n\t\t\t\t<IconTabFilter\n\t\t\t\t\tid="IconTabBarFilterPRAttachments"\n\t\t\t\t\tkey="Attachments"\n\t\t\t\t\tcount="{NumberOfAttachments}"\n\t\t\t\t\ticon="sap-icon://attachment"\n\t\t\t\t\tvisible="{path : \'NumberOfAttachments\', formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.attachmentsVisibilityTrigger\'}">\n\t\t\t\t\t<List\n\t\t\t\t\t\tid="Attachments"\n\t\t\t\t\t\tshowSeparators="None"\n\t\t\t\t\t\tinset="true"\n\t\t\t\t\t\titems="{Attachments}">\n\t\t\t\t\t\t<StandardListItem\n\t\t\t\t\t\t\tid="AttachmentListItems"\n\t\t\t\t\t\t\ttitle="{parts : [{path : \'Description\'}, {path : \'MimeType\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.formatAttachmentDesc\'}"\n\t\t\t\t\t\t\ticon="{parts : [{path : \'MimeType\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.formatAttachmentIcon\'}"\n\t\t\t\t\t\t\tdescription="{parts : [{path : \'FileSize\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.formatAttachmentSize\'}"\n\t\t\t\t\t\t\ticonInset="false"\n\t\t\t\t\t\t\tpress="onAttachment"\n\t\t\t\t\t\t\ttype="Active"\n\t\t\t\t\t\t\tinfo="{parts : [{path : \'CreatedAt\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.attachmentDateFormatter\'}">\n\t\t\t\t\t\t</StandardListItem>\n\t\t\t\t\t</List>\n\t\t\t\t</IconTabFilter>\n\t\t\t</items>\n\t\t</IconTabBar>\n\t\t<!-- end of Icon Tab Bar -->\n\n\t\t<!-- Item table -->\n\t\t<Table\n\t\t\tid="itemsTable"\n\t\t\titems="{HeaderItemDetails}"\n\t\t\tnoDataText="{i18n>view.PurchaseRequisition.placeholder}"\n\t \t\theaderText="{parts : [{path : \'NumberOfItems\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.itemsTableHeader\'}">\n\t \t\t<columns>\n\t \t\t\t<Column\n\t \t\t\t\tid="ItemsTableColumnDescription"\n\t \t\t\t\thAlign="Left">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.descriptionLabel}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t\t<Column\n\t \t\t\t\tid="ItemsTableColumnItemCategory"\n\t \t\t\t\thAlign="Left"\n\t \t\t\t\tdemandPopin="true"\n\t \t\t\t\tminScreenWidth="Medium">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.itemCategory}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t\t<Column\n\t \t\t\t\tid="ItemsTableColumnQuantity"\n\t \t\t\t\thAlign="Right"\n\t \t\t\t\tdemandPopin="true"\n\t \t\t\t\tminScreenWidth="Medium">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.quantity}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t\t<Column\n\t \t\t\t\tid="ItemsTableColumnSubtotal"\n\t \t\t\t\thAlign="Right"\n\t \t\t\t\tdemandPopin="true"\n\t \t\t\t\tminScreenWidth="Medium">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseRequisition.subtotal}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t</columns>\n\t \t\t<items>\n\t \t\t\t<ColumnListItem\n\t \t\t\t\ttype="Navigation"\n\t \t\t\t\tpress="navToItemDetails">\n\t \t\t\t\t<cells>\n\t \t\t\t\t\t<ObjectIdentifier\n\t \t\t\t\t\t\ttitle="{Description}"\n\t\t\t          \t \tpeople="false"\n\t\t\t\t\t\t \tbadgeNotes="{parts : [{path : \'NumberOfNotes\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonCountVisibilityTrigger\'}"\n\t\t\t\t\t\t \tbadgeAttachments="{parts : [{path : \'NumberOfAttachments\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.commonCountVisibilityTrigger\'}">\n\t\t\t\t\t\t </ObjectIdentifier>\n\t\t\t\t\t\t<Text\n\t \t\t\t\t\t\ttext="{parts : [{path : \'ItemCategoryDescription\'}, {path : \'HdItmProductDetails/ItemType\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.itemCategoryFormatter\'}">\n\t \t\t\t\t\t</Text>\n\t \t\t\t\t\t<ObjectNumber\n\t \t\t\t\t\t\tnumber="{parts : [{path : \'Quantity\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.quantityFormatterWithoutUnit\'}"\n\t \t\t\t\t\t\tnumberUnit="{UnitDescription}">\n\t \t\t\t\t\t</ObjectNumber>\n\t \t\t\t\t\t<ObjectNumber\n\t \t\t\t\t\t\tnumber="{parts : [{path : \'Value\'}, {path : \'ItemCategory\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.formatNumberItemType\'}"\n\t \t\t\t\t\t\tnumberUnit="{parts : [{path : \'ItemCategory\'}, {path: \'Currency\'}], formatter : \'ui.s2p.mm.requisition.approve.util.Conversions.formatNumberUnitItemType\'}">\n\t \t\t\t\t\t</ObjectNumber>\n\t \t\t\t\t</cells>\n\t \t\t\t</ColumnListItem>\n\t \t\t</items>\n\t \t</Table>\n\t\t<!-- end of Item table -->\n\n\t\t<!--  Footer -->\n\t\t<footer>\n\t\t\t<Bar id="detailFooter">\n\t\t\t</Bar>\n\t\t</footer>\n\t\t<!-- end of Footer -->\n\n\t</Page>\n</core:View>'
}});
