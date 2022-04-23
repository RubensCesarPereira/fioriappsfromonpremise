jQuery.sap.registerPreloadedModules({
"name":"ui/s2p/mm/purchorder/approve/Component-preload",
"version":"2.0",
"modules":{
	"ui/s2p/mm/purchorder/approve/Component.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("ui.s2p.mm.purchorder.approve.Component");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");
//jQuery.sap.require("ui.s2p.mm.purchorder.approve.Configuration");

//new Component
sap.ca.scfld.md.ComponentBase
	.extend(
		"ui.s2p.mm.purchorder.approve.Component", {

			metadata: sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
				"name": "Purchase Order Approve",
				"version": "1.5.43",
				"library": "ui.s2p.mm.purchorder.approve",
				"includes": ["css/mmPurchorderApprove.css"],
				"dependencies": {
					"libs": ["sap.m"],
					"components": []
				},
				"config": {
					"resourceBundle": "i18n/i18n.properties",
					"titleResource": "app.Identity",
					"icon": "sap-icon://Fiori2/F0402",
					"favIcon": "./resources/sap/ca/ui/themes/base/img/favicon/Approve_Purchase_Orders.ico",
					"homeScreenIconPhone": "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Purchase_Orders/57_iPhone_Desktop_Launch.png",
					"homeScreenIconPhone@2": "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Purchase_Orders/114_iPhone-Retina_Web_Clip.png",
					"homeScreenIconTablet": "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Purchase_Orders/72_iPad_Desktop_Launch.png",
					"homeScreenIconTablet@2": "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Purchase_Orders/144_iPad_Retina_Web_Clip.png"
				},

				// Navigation related properties
				masterPageRoutes: {
					"master": {
						"pattern": ":scenarioId:",
						"view": "ui.s2p.mm.purchorder.approve.view.S2",
						"viewLevel": 0
					}
				},
				detailPageRoutes: {
					"detail": {
						"pattern": "HeaderDetails/{contextPath}",
						"view": "ui.s2p.mm.purchorder.approve.view.S3",
						"viewLevel": 1
					},
					"itemDetails": {
						"pattern": "ItemDetails/{SAP__Origin}/{WorkitemID}/{PoNumber}/{ItemNumber}",
						"view": "ui.s2p.mm.purchorder.approve.view.S4",
						"viewLevel": 2
					},
					"itemServiceLine": {
						"pattern": "ItemServiceLine/{SAP__Origin}/{WorkitemID}/{PoNumber}/{ItemNumber}/{ServiceLineNumber}",
						"view": "ui.s2p.mm.purchorder.approve.view.ItemServiceLine",
						"viewLevel": 3
					},
					"itemServiceLimit": {
						"pattern": "ItemServiceLimit/{SAP__Origin}/{WorkitemID}/{PoNumber}/{ItemNumber}/{LimitDescription}",
						"view": "ui.s2p.mm.purchorder.approve.view.ItemServiceLimit",
						"viewLevel": 4
					},
					"noData": {
						"pattern": "noData",
						"view": "empty",
					}
				},
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
						viewName: "ui.s2p.mm.purchorder.approve.Main",
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
	"ui/s2p/mm/purchorder/approve/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("ui.s2p.mm.purchorder.approve.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("ui.s2p.mm.purchorder.approve.Configuration", {

	oServiceParams: {
        serviceList: [
            {
                name: "GBAPP_POAPPROVAL",
                masterCollection: "WorkflowTaskCollection",
                serviceUrl: "/FioriSCP.uis2pmmpurchorderapprove/sap/opu/odata/sap/GBAPP_POAPPROVAL/",
                isDefault: true,
                mockedDataSource: "../ui.s2p.mm.purchorder.approve/test-resources/model/metadata.xml"
            }
        ]
    },
    
    getServiceParams: function() {
        return this.oServiceParams;
    },

    /**
     * @inherit
     */
    getServiceList: function() {
        return this.oServiceParams.serviceList;
    },

    getMasterKeyAttributes: function() {
        return ["WorkitemID"];
    }

});
},
	"ui/s2p/mm/purchorder/approve/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("ui.s2p.mm.purchorder.approve.Main", {

	onInit : function() {
		
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		sap.ca.scfld.md.Startup.init('ui.s2p.mm.purchorder.approve', this);
		
		jQuery.sap.require("ui.s2p.mm.purchorder.approve.model.config");
		if (ui.s2p.mm.purchorder.approve.model.Config.isMock) {
			ui.s2p.mm.purchorder.approve.model.Config.setMockResponses();
		}
		
	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf MainXML
	 */
	onExit : function() {
		// exit cleanup code here
	}

});
},
	"ui/s2p/mm/purchorder/approve/Main.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\tcontrollerName="ui.s2p.mm.purchorder.approve.Main"\n\tdisplayBlock="true"\n\theight="100%">\n\t<NavContainer\n\t\tid="fioriContent">\n\t</NavContainer>\n</core:View>',
	"ui/s2p/mm/purchorder/approve/i18n/i18n.properties":'#<Describe your application/i18n file here; required for translation >\n# __ldi.translation.uuid=f1cc3a20-25d2-11e3-8224-0800200c9a66\n\n#XTIT: this is the title for the master section\nMASTER_TITLE=Purchase Orders ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Purchase Order\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=Purchase Order\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=Delivery Date\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=Plant\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=Customer\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=Name\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=Payment Terms\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=Company Code\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=Multiple Assignments\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=G/L Account\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=Share\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=Objects\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=Cost Centre\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=WBS Element\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=Network\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=Order\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=Sales Order\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=Asset\n\n#XFLD: \nview.PurchaseOrder.subtotal=Subtotal\n\n#XFLD: \nview.PurchaseOrder.quantity=Quantity\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=Item Category\n\n#XTIT: Header text of Master List\nview.Master.title=Purchase Orders ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=Price Details\n\n#XFLD: \nview.PurchaseOrder.notes=Notes\n\n#XFLD: \nview.PurchaseOrder.attachments=Attachments\n\n#XFLD: \nview.PurchaseOrder.delivery=Delivery\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=Delivery on\n\n#XFLD: \nview.PurchaseOrder.material=Material\n\n#XFLD: \nview.PurchaseOrder.materialGroup=Material Group\n\n#XFLD: \nview.PurchaseOrder.serviceLines=Service Lines\n\n#XFLD: \nview.PurchaseOrder.limit=Limit\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=Pricing Conditions\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=per\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=Limit Value\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=Expected Value\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=Unlimited\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=Information\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=Account Assignment\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=Account Assignment\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=Description\n\n#XTIT: Application name\napp.Identity=Approve Purchase Orders\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Approve Purchase Orders\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=Service\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=and later\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=Items ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=Service Lines ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=Blocked\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=Item {0} of {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Service Line {0} of {1} - Item {2} of {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Item {0} of {1} - Limit \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=Category\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=Not Assigned\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=Unknown\n\n#XFLD: Components\nview.PurchaseOrder.components=Components\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=Subcontracting\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=Standard\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=Third-party\n\n#XFLD: Return\nview.PurchaseOrder.return=return\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=Consignment\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=Condition\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=Price\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 item\n\n#XFLD: No items\nview.PurchaseOrder.noItem=No items\n\n#XFLD\nview.PurchaseOrder.title=Purchase Order\n\n#XFLD\nview.PurchaseOrder.substituted=Substitute for\n\n#XFLD\nview.PurchaseOrder.forwarded=Forwarded by\n\n#XFLD\nview.PurchaseOrder.name=Name\n\n#XFLD\nview.PurchaseOrder.address=Address\n\n#YMSG\ndialog.question.approve=Approve the purchase order submitted by {0}?\n\n#YMSG\ndialog.question.reject=Reject the purchase order submitted by {0}?\n\n#YMSG\ndialog.success.approve=Purchase order was approved \n\n#YMSG\ndialog.success.reject=Purchase order was rejected\n\n#YMSG\ndialog.success.forward=Purchase order was forwarded to {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder = Add note (optional)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Approve\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Reject\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=Supplier\n\n#XFLD: Employee header label\nBussinessCard.Employee=Employee\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Approval or rejection of this purchase order is still in process. You can refresh the list of purchase orders manually.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=Supplier Name\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=Ordering Address\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=Profit Center\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Approve\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Reject\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Forward\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Cancel\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=Byte\n\n#YMSG: File Size Unit\nFileSize.Bytes=Bytes\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=File is too large\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Today\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 day ago\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} days ago\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Loading...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=No items are currently available',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_ar.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=\\u0623\\u0648\\u0627\\u0645\\u0631 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621 ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=\\u0623\\u0645\\u0631 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=\\u0645\\u0635\\u0637\\u0644\\u062D\\u0627\\u062A \\u0627\\u0644\\u062A\\u062C\\u0627\\u0631\\u0629 \\u0627\\u0644\\u0639\\u0627\\u0644\\u0645\\u064A\\u0629\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=\\u0623\\u0645\\u0631 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u062A\\u0633\\u0644\\u064A\\u0645\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=\\u0627\\u0644\\u0648\\u062D\\u062F\\u0629\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=\\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=\\u0627\\u0644\\u0627\\u0633\\u0645\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=\\u0634\\u0631\\u0648\\u0637 \\u0627\\u0644\\u062F\\u0641\\u0639\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=\\u0631\\u0645\\u0632 \\u0627\\u0644\\u0634\\u0631\\u0643\\u0629\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=\\u062A\\u0639\\u064A\\u064A\\u0646\\u0627\\u062A \\u0645\\u062A\\u0639\\u062F\\u062F\\u0629\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=\\u062D\\u0633\\u0627\\u0628 \\u0627\\u0644\\u0623\\u0633\\u062A\\u0627\\u0630 \\u0627\\u0644\\u0639\\u0627\\u0645\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=\\u0645\\u0634\\u0627\\u0631\\u0643\\u0629\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=\\u0627\\u0644\\u0643\\u0627\\u0626\\u0646\\u0627\\u062A\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=\\u0645\\u0631\\u0643\\u0632 \\u0627\\u0644\\u062A\\u0643\\u0644\\u0641\\u0629\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=\\u0639\\u0646\\u0635\\u0631 \\u0628\\u0646\\u064A\\u0629 \\u062A\\u0646\\u0638\\u064A\\u0645 \\u0627\\u0644\\u0639\\u0645\\u0644\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=\\u0627\\u0644\\u0634\\u0628\\u0643\\u0629\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=\\u0627\\u0644\\u0623\\u0645\\u0631\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=\\u0623\\u0645\\u0631 \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=\\u0627\\u0644\\u0623\\u0635\\u0644\n\n#XFLD: \nview.PurchaseOrder.subtotal=\\u0627\\u0644\\u0625\\u062C\\u0645\\u0627\\u0644\\u064A \\u0627\\u0644\\u0641\\u0631\\u0639\\u064A\n\n#XFLD: \nview.PurchaseOrder.quantity=\\u0627\\u0644\\u0643\\u0645\\u064A\\u0629\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=\\u0641\\u0626\\u0629 \\u0627\\u0644\\u0639\\u0646\\u0635\\u0631\n\n#XTIT: Header text of Master List\nview.Master.title=\\u0623\\u0648\\u0627\\u0645\\u0631 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621 ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u0633\\u0639\\u0631\n\n#XFLD: \nview.PurchaseOrder.notes=\\u0627\\u0644\\u0645\\u0644\\u0627\\u062D\\u0638\\u0627\\u062A\n\n#XFLD: \nview.PurchaseOrder.attachments=\\u0627\\u0644\\u0645\\u0631\\u0641\\u0642\\u0627\\u062A\n\n#XFLD: \nview.PurchaseOrder.delivery=\\u0627\\u0644\\u062A\\u0633\\u0644\\u064A\\u0645\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u062A\\u0633\\u0644\\u064A\\u0645\n\n#XFLD: \nview.PurchaseOrder.material=\\u0627\\u0644\\u0645\\u0627\\u062F\\u0629\n\n#XFLD: \nview.PurchaseOrder.materialGroup=\\u0645\\u062C\\u0645\\u0648\\u0639\\u0629 \\u0627\\u0644\\u0645\\u0648\\u0627\\u062F\n\n#XFLD: \nview.PurchaseOrder.serviceLines=\\u0633\\u0637\\u0648\\u0631 \\u0627\\u0644\\u062E\\u062F\\u0645\\u0629\n\n#XFLD: \nview.PurchaseOrder.limit=\\u0627\\u0644\\u062D\\u062F\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=\\u0634\\u0631\\u0648\\u0637 \\u0627\\u0644\\u062A\\u0633\\u0639\\u064A\\u0631\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=\\u0644\\u0643\\u0644\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=\\u0642\\u064A\\u0645\\u0629 \\u0627\\u0644\\u062D\\u062F\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=\\u0627\\u0644\\u0642\\u064A\\u0645\\u0629 \\u0627\\u0644\\u0645\\u062A\\u0648\\u0642\\u0639\\u0629\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=\\u063A\\u064A\\u0631 \\u0645\\u062D\\u062F\\u0648\\u062F\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=\\u0645\\u0639\\u0644\\u0648\\u0645\\u0627\\u062A\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=\\u062A\\u0639\\u064A\\u064A\\u0646 \\u0627\\u0644\\u062D\\u0633\\u0627\\u0628\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=\\u062A\\u0639\\u064A\\u064A\\u0646 \\u0627\\u0644\\u062D\\u0633\\u0627\\u0628\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=\\u0627\\u0644\\u0648\\u0635\\u0641\n\n#XTIT: Application name\napp.Identity=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0623\\u0648\\u0627\\u0645\\u0631 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0623\\u0648\\u0627\\u0645\\u0631 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=\\u0627\\u0644\\u062E\\u062F\\u0645\\u0629\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=\\u0648\\u0645\\u0627 \\u064A\\u0644\\u064A\\u0647\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=\\u0627\\u0644\\u0628\\u0646\\u0648\\u062F ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=\\u0633\\u0637\\u0648\\u0631 \\u0627\\u0644\\u062E\\u062F\\u0645\\u0629 ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=\\u0645\\u0648\\u0642\\u0648\\u0641\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=\\u0628\\u0646\\u062F {0} \\u0644\\u0640 {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=\\u0633\\u0637\\u0631 \\u0627\\u0644\\u062E\\u062F\\u0645\\u0629 {0} \\u0644\\u0640 {1} - \\u0627\\u0644\\u0628\\u0646\\u062F {2} \\u0644\\u0640 {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=\\u0628\\u0646\\u062F {0} \\u0644\\u0640 {1} - \\u0627\\u0644\\u062D\\u062F \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=\\u0627\\u0644\\u0641\\u0626\\u0629\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=\\u063A\\u064A\\u0631 \\u0645\\u0639\\u064A\\u0651\\u064E\\u0646\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=\\u063A\\u064A\\u0631 \\u0645\\u0639\\u0631\\u0648\\u0641\n\n#XFLD: Components\nview.PurchaseOrder.components=\\u0627\\u0644\\u0645\\u0643\\u0648\\u0646\\u0627\\u062A\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=\\u062A\\u0639\\u0627\\u0642\\u062F \\u0645\\u0646 \\u0627\\u0644\\u0628\\u0627\\u0637\\u0646\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=\\u0642\\u064A\\u0627\\u0633\\u064A\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=\\u0627\\u0644\\u062C\\u0647\\u0629 \\u0627\\u0644\\u062E\\u0627\\u0631\\u062C\\u064A\\u0629\n\n#XFLD: Return\nview.PurchaseOrder.return=\\u0628\\u0646\\u062F \\u0627\\u0644\\u0645\\u0631\\u062A\\u062C\\u0639\\u0627\\u062A\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=\\u0625\\u064A\\u062F\\u0627\\u0639\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=\\u0627\\u0644\\u0634\\u0631\\u0637\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=\\u0627\\u0644\\u0633\\u0639\\u0631\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=\\u0627\\u0644\\u0639\\u0646\\u0635\\u0631 1\n\n#XFLD: No items\nview.PurchaseOrder.noItem=\\u0628\\u0644\\u0627 \\u0639\\u0646\\u0627\\u0635\\u0631\n\n#XFLD\nview.PurchaseOrder.title=\\u0623\\u0645\\u0631 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621\n\n#XFLD\nview.PurchaseOrder.substituted=\\u0628\\u062F\\u064A\\u0644\n\n#XFLD\nview.PurchaseOrder.forwarded=\\u062A\\u0645\\u062A \\u0625\\u0639\\u0627\\u062F\\u0629 \\u0627\\u0644\\u062A\\u0648\\u062C\\u064A\\u0647 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629\n\n#XFLD\nview.PurchaseOrder.name=\\u0627\\u0644\\u0627\\u0633\\u0645\n\n#XFLD\nview.PurchaseOrder.address=\\u0627\\u0644\\u0639\\u0646\\u0648\\u0627\\u0646\n\n#YMSG\ndialog.question.approve=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0623\\u0645\\u0631 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621 \\u0627\\u0644\\u0645\\u0642\\u062F\\u0651\\u064E\\u0645 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 {0}\\u061F\n\n#YMSG\ndialog.question.reject=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0631\\u0641\\u0636 \\u0623\\u0645\\u0631 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621 \\u0627\\u0644\\u0645\\u0642\\u062F\\u0651\\u064E\\u0645 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 {0}?\n\n#YMSG\ndialog.success.approve=\\u062A\\u0645 \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0623\\u0645\\u0631 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621\n\n#YMSG\ndialog.success.reject=\\u062A\\u0645 \\u0631\\u0641\\u0636 \\u0623\\u0645\\u0631 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621\n\n#YMSG\ndialog.success.forward=\\u062A\\u0645\\u062A \\u0625\\u0639\\u0627\\u062F\\u0629 \\u062A\\u0648\\u062C\\u064A\\u0647 \\u0623\\u0645\\u0631 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621 \\u0625\\u0644\\u0649 {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0645\\u0644\\u0627\\u062D\\u0638\\u0629 (\\u0627\\u062E\\u062A\\u064A\\u0627\\u0631\\u064A)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=\\u0631\\u0641\\u0636\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=\\u0627\\u0644\\u0645\\u0632\\u0648\\u0651\\u0650\\u062F\n\n#XFLD: Employee header label\nBussinessCard.Employee=\\u0627\\u0644\\u0645\\u0648\\u0638\\u0641\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=\\u0644\\u0627 \\u064A\\u0632\\u0627\\u0644 \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0623\\u0645\\u0631 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621 \\u0647\\u0630\\u0627 \\u0623\\u0648 \\u0631\\u0641\\u0636\\u0647 \\u0642\\u064A\\u062F \\u0627\\u0644\\u0645\\u0639\\u0627\\u0644\\u062C\\u0629. \\u064A\\u0645\\u0643\\u0646\\u0643 \\u062A\\u062D\\u062F\\u064A\\u062B \\u0642\\u0627\\u0626\\u0645\\u0629 \\u0623\\u0648\\u0627\\u0645\\u0631 \\u0627\\u0644\\u0634\\u0631\\u0627\\u0621 \\u064A\\u062F\\u0648\\u064A\\u064B\\u0627.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0645\\u0632\\u0648\\u0651\\u0650\\u062F\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0627\\u0644\\u0637\\u0644\\u0628\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=\\u0645\\u0631\\u0643\\u0632 \\u0627\\u0644\\u0631\\u0628\\u062D\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=\\u0645\\u0648\\u0627\\u0641\\u0642\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F\n\n#XBUT: Button for Reject action\nXBUT_REJECT=\\u0631\\u0641\\u0636\n\n#XBUT: Button for forward action\nXBUT_FORWARD=\\u0625\\u0639\\u0627\\u062F\\u0629 \\u062A\\u0648\\u062C\\u064A\\u0647\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=\\u0628\\u0627\\u064A\\u062A\n\n#YMSG: File Size Unit\nFileSize.Bytes=\\u0628\\u0627\\u064A\\u062A\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=\\u0643\\u064A\\u0644\\u0648\\u0628\\u0627\\u064A\\u062A\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=\\u0645\\u064A\\u062C\\u0627\\u0628\\u0627\\u064A\\u062A\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=\\u062C\\u064A\\u062C\\u0627\\u0628\\u0627\\u064A\\u062A\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=\\u062A\\u064A\\u0631\\u0627\\u0628\\u0627\\u064A\\u062A\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=\\u0628\\u064A\\u062A\\u0627\\u0628\\u0627\\u064A\\u062A\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=\\u0625\\u0643\\u0633\\u0627\\u0628\\u0627\\u064A\\u062A\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=\\u0632\\u064A\\u062A\\u0627\\u0628\\u0627\\u064A\\u062A\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=\\u064A\\u0648\\u062A\\u0627\\u0628\\u0627\\u064A\\u062A\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=\\u0627\\u0644\\u0645\\u0644\\u0641 \\u0643\\u0628\\u064A\\u0631 \\u062C\\u062F\\u064B\\u0627\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=\\u0627\\u0644\\u064A\\u0648\\u0645\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=\\u0645\\u0646\\u0630 \\u064A\\u0648\\u0645\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=\\u0645\\u0646\\u0630 {0} \\u064A\\u0648\\u0645 (\\u0623\\u064A\\u0627\\u0645)\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u062A\\u062D\\u0645\\u064A\\u0644...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0623\\u064A\\u0629 \\u0639\\u0646\\u0627\\u0635\\u0631 \\u062D\\u0627\\u0644\\u064A\\u064B\\u0627\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_bg.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=\\u041F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0438 \\u0437\\u0430\\u043A\\u0443\\u043F\\u0443\\u0432\\u0430\\u043D\\u0435 ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=\\u041F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0430 \\u0437\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=\\u041F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0430 \\u0437\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=\\u0414\\u0430\\u0442\\u0430 \\u043D\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=\\u0417\\u0430\\u0432\\u043E\\u0434\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=\\u0418\\u043C\\u0435\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=\\u0423\\u0441\\u043B\\u043E\\u0432\\u0438\\u044F \\u043D\\u0430 \\u043F\\u043B\\u0430\\u0449\\u0430\\u043D\\u0435\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=\\u0424\\u0438\\u0440\\u043C\\u0435\\u043D \\u043A\\u043E\\u0434\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=\\u041C\\u043D\\u043E\\u0433\\u043E\\u043A\\u0440\\u0430\\u0442\\u043D\\u0438 \\u043F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u044F\\u0432\\u0430\\u043D\\u0438\\u044F\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=\\u0421\\u043C\\u0435\\u0442\\u043A\\u0430 \\u043E\\u0442 \\u0413\\u043B\\u0430\\u0432\\u043D\\u0430 \\u043A\\u043D\\u0438\\u0433\\u0430\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=\\u0421\\u043F\\u043E\\u0434\\u0435\\u043B\\u044F\\u043D\\u0435\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=\\u041E\\u0431\\u0435\\u043A\\u0442\\u0438\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=\\u0420\\u0430\\u0437\\u0445\\u043E\\u0434\\u0435\\u043D \\u0446\\u0435\\u043D\\u0442\\u044A\\u0440\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=\\u0421\\u041F\\u041F \\u0435\\u043B\\u0435\\u043C\\u0435\\u043D\\u0442\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=\\u041C\\u0440\\u0435\\u0436\\u0430\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=\\u041F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0430\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0441\\u043A\\u0430 \\u043F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0430\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=\\u0410\\u043A\\u0442\\u0438\\u0432\n\n#XFLD: \nview.PurchaseOrder.subtotal=\\u041C\\u0435\\u0436\\u0434\\u0438\\u043D\\u043D\\u0430 \\u0441\\u0443\\u043C\\u0430\n\n#XFLD: \nview.PurchaseOrder.quantity=\\u041A\\u043E\\u043B\\u0438\\u0447\\u0435\\u0441\\u0442\\u0432\\u043E\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=\\u041A\\u0430\\u0442\\u0435\\u0433\\u043E\\u0440\\u0438\\u044F \\u043D\\u0430 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F\n\n#XTIT: Header text of Master List\nview.Master.title=\\u041F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0438 \\u0437\\u0430\\u043A\\u0443\\u043F\\u0443\\u0432\\u0430\\u043D\\u0435 ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u0437\\u0430 \\u0446\\u0435\\u043D\\u0430\n\n#XFLD: \nview.PurchaseOrder.notes=\\u0411\\u0435\\u043B\\u0435\\u0436\\u043A\\u0438\n\n#XFLD: \nview.PurchaseOrder.attachments=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\n\n#XFLD: \nview.PurchaseOrder.delivery=\\u0414\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=\\u0414\\u043E\\u0441\\u0442\\u0430\\u0432\\u0435\\u043D\\u043E \\u043D\\u0430\n\n#XFLD: \nview.PurchaseOrder.material=\\u041C\\u0430\\u0442\\u0435\\u0440\\u0438\\u0430\\u043B\n\n#XFLD: \nview.PurchaseOrder.materialGroup=\\u0413\\u0440\\u0443\\u043F\\u0430 \\u043C\\u0430\\u0442\\u0435\\u0440\\u0438\\u0430\\u043B\\u0438\n\n#XFLD: \nview.PurchaseOrder.serviceLines=\\u0420\\u0435\\u0434\\u043E\\u0432\\u0435 \\u0443\\u0441\\u043B\\u0443\\u0433\\u0438\n\n#XFLD: \nview.PurchaseOrder.limit=\\u0413\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=\\u0423\\u0441\\u043B\\u043E\\u0432\\u0438\\u044F \\u043D\\u0430 \\u0446\\u0435\\u043D\\u043E\\u043E\\u0431\\u0440\\u0430\\u0437\\u0443\\u0432\\u0430\\u043D\\u0435\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=\\u0437\\u0430\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=\\u041F\\u0440\\u0435\\u0434\\u0435\\u043B\\u043D\\u0430 \\u0441\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=\\u041E\\u0447\\u0430\\u043A\\u0432\\u0430\\u043D\\u0430 \\u0441\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=\\u041D\\u0435\\u043E\\u0433\\u0440\\u0430\\u043D\\u0438\\u0447\\u0435\\u043D\\u043E\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=\\u0418\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=\\u041F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u043C\\u0435\\u0442\\u043A\\u0430\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=\\u041F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u043C\\u0435\\u0442\\u043A\\u0430\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n\n#XTIT: Application name\napp.Identity=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0438 \\u0437\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0438 \\u0437\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=\\u0423\\u0441\\u043B\\u0443\\u0433\\u0430\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=\\u0438 \\u043F\\u043E-\\u043A\\u044A\\u0441\\u043D\\u043E\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=\\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0438 ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=\\u0420\\u0435\\u0434\\u043E\\u0432\\u0435 \\u0443\\u0441\\u043B\\u0443\\u0433\\u0430 ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=\\u0411\\u043B\\u043E\\u043A\\u0438\\u0440\\u0430\\u043D\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=\\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F {0} \\u043E\\u0442 {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=\\u0420\\u0435\\u0434 \\u0443\\u0441\\u043B\\u0443\\u0433\\u0430 {0} \\u043E\\u0442 {1} - \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F {2} \\u043E\\u0442 {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=\\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F {0} \\u043E\\u0442 {1} - \\u043B\\u0438\\u043C\\u0438\\u0442 \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=\\u041A\\u0430\\u0442\\u0435\\u0433\\u043E\\u0440\\u0438\\u044F\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=\\u041D\\u0435\\u043F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u0435\\u043D\\u0438\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=\\u041D\\u0435\\u0438\\u0437\\u0432\\u0435\\u0441\\u0442\\u0435\\u043D\n\n#XFLD: Components\nview.PurchaseOrder.components=\\u041A\\u043E\\u043C\\u043F\\u043E\\u043D\\u0435\\u043D\\u0442\\u0438\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=\\u041F\\u043E\\u0434\\u0438\\u0437\\u043F\\u044A\\u043B\\u043D\\u0435\\u043D\\u0438\\u0435\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=\\u0421\\u0442\\u0430\\u043D\\u0434\\u0430\\u0440\\u0442\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=\\u0422\\u0440\\u0435\\u0442\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0430\n\n#XFLD: Return\nview.PurchaseOrder.return=\\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F \\u043D\\u0430 \\u0432\\u0440\\u044A\\u0449\\u0430\\u043D\\u0435\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=\\u041A\\u043E\\u043D\\u0441\\u0438\\u0433\\u043D\\u0430\\u0446\\u0438\\u044F\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=\\u0423\\u0441\\u043B\\u043E\\u0432\\u0438\\u0435\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=\\u0426\\u0435\\u043D\\u0430\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F\n\n#XFLD: No items\nview.PurchaseOrder.noItem=\\u041D\\u044F\\u043C\\u0430 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0438\n\n#XFLD\nview.PurchaseOrder.title=\\u041F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0430 \\u0437\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430\n\n#XFLD\nview.PurchaseOrder.substituted=\\u0417\\u0430\\u043C\\u0435\\u0441\\u0442\\u043D\\u0438\\u043A \\u0437\\u0430\n\n#XFLD\nview.PurchaseOrder.forwarded=\\u041F\\u0440\\u0435\\u043F\\u0440\\u0430\\u0442\\u0435\\u043D\\u043E \\u043E\\u0442\n\n#XFLD\nview.PurchaseOrder.name=\\u0418\\u043C\\u0435\n\n#XFLD\nview.PurchaseOrder.address=\\u0410\\u0434\\u0440\\u0435\\u0441\n\n#YMSG\ndialog.question.approve=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0430 \\u0437\\u0430\\u043A\\u0443\\u043F\\u0443\\u0432\\u0430\\u043D\\u0435 \\u043F\\u043E\\u0434\\u0430\\u0434\\u0435\\u043D\\u0430 \\u043E\\u0442 {0}?\n\n#YMSG\ndialog.question.reject=\\u041E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u044F\\u043D\\u0435 \\u043F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0430 \\u0437\\u0430\\u043A\\u0443\\u043F\\u0443\\u0432\\u0430\\u043D\\u0435 \\u043F\\u043E\\u0434\\u0430\\u0434\\u0435\\u043D\\u0430 \\u043E\\u0442 {0}?\n\n#YMSG\ndialog.success.approve=\\u041F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0430\\u0442\\u0430 \\u0437\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430 \\u0435 \\u043E\\u0434\\u043E\\u0431\\u0440\\u0435\\u043D\\u0430\n\n#YMSG\ndialog.success.reject=\\u041F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0430\\u0442\\u0430 \\u0437\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430 \\u0435 \\u043E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u0435\\u043D\\u0430\n\n#YMSG\ndialog.success.forward=\\u041F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0430 \\u0437\\u0430\\u043A\\u0443\\u043F\\u0443\\u0432\\u0430\\u043D\\u0435 \\u0435 \\u043F\\u0440\\u0435\\u0430\\u0434\\u0440\\u0435\\u0441\\u0438\\u0440\\u0430\\u043D\\u0430 \\u043A\\u044A\\u043C {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430 (\\u043D\\u0435\\u0437\\u0430\\u0434\\u044A\\u043B\\u0436\\u0438\\u0442\\u0435\\u043B\\u043D\\u043E)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u043D\\u0435\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=\\u041E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u044F\\u043D\\u0435\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=\\u0414\\u043E\\u0441\\u0442\\u0430\\u0432\\u0447\\u0438\\u043A\n\n#XFLD: Employee header label\nBussinessCard.Employee=\\u0421\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=\\u041E\\u0434\\u043E\\u0431\\u0440\\u0435\\u043D\\u0438\\u0435\\u0442\\u043E \\u0438\\u043B\\u0438 \\u043E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u044F\\u043D\\u043E\\u0435\\u0442 \\u043D\\u0430 \\u0442\\u0430\\u0437\\u0438 \\u043F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0430 \\u0437\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430 \\u0432\\u0441\\u0435 \\u043E\\u0449\\u0435 \\u0441\\u0435 \\u043E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u0432\\u0430. \\u041C\\u043E\\u0436\\u0435\\u0442\\u0435 \\u0434\\u0430 \\u043E\\u043F\\u0440\\u0435\\u0441\\u043D\\u0438\\u0442\\u0435 \\u0440\\u044A\\u0447\\u043D\\u043E \\u0441\\u043F\\u0438\\u0441\\u044A\\u043A\\u0430 \\u043D\\u0430 \\u043F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0438\\u0442\\u0435 \\u0437\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=\\u0418\\u043C\\u0435 \\u043D\\u0430 \\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u0447\\u0438\\u043A\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=\\u0410\\u0434\\u0440\\u0435\\u0441 \\u043D\\u0430 \\u043F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0430\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=\\u041F\\u0440\\u0438\\u0445\\u043E\\u0434\\u0435\\u043D \\u0446\\u0435\\u043D\\u0442\\u044A\\u0440\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u043D\\u0435\n\n#XBUT: Button for Reject action\nXBUT_REJECT=\\u041E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u044F\\u043D\\u0435\n\n#XBUT: Button for forward action\nXBUT_FORWARD=\\u041F\\u0440\\u0435\\u043F\\u0440\\u0430\\u0449\\u0430\\u043D\\u0435\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=\\u041E\\u0442\\u043A\\u0430\\u0437\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=\\u0411\\u0430\\u0439\\u0442\n\n#YMSG: File Size Unit\nFileSize.Bytes=\\u0411\\u0430\\u0439\\u0442\\u043E\\u0432\\u0435\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=\\u0424\\u0430\\u0439\\u043B\\u044A\\u0442 \\u0435 \\u0442\\u0432\\u044A\\u0440\\u0434\\u0435 \\u0433\\u043E\\u043B\\u044F\\u043C\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=\\u0414\\u043D\\u0435\\u0441\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=\\u041F\\u0440\\u0435\\u0434\\u0438 1 \\u0434\\u0435\\u043D\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=\\u043F\\u0440\\u0435\\u0434\\u0438 {0} \\u0434\\u043D\\u0438\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=\\u0417\\u0430\\u0440\\u0435\\u0436\\u0434\\u0430\\u043D\\u0435...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u0412 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442\\u0430 \\u043D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0438\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_cs.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Objedn\\u00E1vky ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Objedn\\u00E1vka\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=Objedn\\u00E1vka\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=Datum dod\\u00E1vky\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=Z\\u00E1vod\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=Z\\u00E1kazn\\u00EDk\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=Jm\\u00E9no\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=Platebn\\u00ED podm\\u00EDnky\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=\\u00DA\\u010Detn\\u00ED okruh\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=V\\u00EDce p\\u0159i\\u0159azen\\u00ED\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=\\u00DA\\u010Det hlavn\\u00ED knihy\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=Pod\\u00EDl\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=Objekty\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=N\\u00E1kladov\\u00E9 st\\u0159edisko\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=Prvek SPP\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=S\\u00ED\\u0165\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=Zak\\u00E1zka\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=Zak\\u00E1zka odb\\u011Bratele\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=Majetek\n\n#XFLD: \nview.PurchaseOrder.subtotal=Mezisou\\u010Det\n\n#XFLD: \nview.PurchaseOrder.quantity=Mno\\u017Estv\\u00ED\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=Kategorie polo\\u017Eky\n\n#XTIT: Header text of Master List\nview.Master.title=Objedn\\u00E1vky ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=Cenov\\u00E9 detaily\n\n#XFLD: \nview.PurchaseOrder.notes=Pozn\\u00E1mky\n\n#XFLD: \nview.PurchaseOrder.attachments=P\\u0159\\u00EDlohy\n\n#XFLD: \nview.PurchaseOrder.delivery=Dod\\u00E1vka\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=Datum dod\\u00E1n\\u00ED\n\n#XFLD: \nview.PurchaseOrder.material=Materi\\u00E1l\n\n#XFLD: \nview.PurchaseOrder.materialGroup=Skupina materi\\u00E1l\\u016F\n\n#XFLD: \nview.PurchaseOrder.serviceLines=\\u0158\\u00E1dky slu\\u017Eeb\n\n#XFLD: \nview.PurchaseOrder.limit=Limit\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=Cenov\\u00E9 podm\\u00EDnky\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=za\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=Limit \\u2013 hodnota\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=O\\u010Dek\\u00E1van\\u00E1 hodnota\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=Neomezen\\u011B\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=Informace\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=P\\u0159i\\u0159azen\\u00ED \\u00FA\\u010Dtu\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=P\\u0159i\\u0159azen\\u00ED \\u00FA\\u010Dtu\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=Popis\n\n#XTIT: Application name\napp.Identity=Schvalov\\u00E1n\\u00ED objedn\\u00E1vek\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Schvalov\\u00E1n\\u00ED objedn\\u00E1vek\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=Slu\\u017Eba\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=a pozd\\u011Bji\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=Polo\\u017Eky ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=\\u0158\\u00E1dky v\\u00FDkon\\u016F slu\\u017Eeb ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=Blokov\\u00E1no\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=Polo\\u017Eka {0} z {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Servisn\\u00ED polo\\u017Eka {0} z {1} \\u2013 Polo\\u017Eka {2} z {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Polo\\u017Eka {0} z {1} \\u2013 Limit \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=Kategorie\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=Nep\\u0159i\\u0159azeno\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=Nen\\u00ED zn\\u00E1mo\n\n#XFLD: Components\nview.PurchaseOrder.components=Komponenty\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=Pr\\u00E1ce ve mzd\\u011B\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=Standardn\\u00ED\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=T\\u0159et\\u00ED strana\n\n#XFLD: Return\nview.PurchaseOrder.return=Polo\\u017Eka vr\\u00E1cen\\u00ED\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=Konsignace\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=Podm\\u00EDnka\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=Cena\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 polo\\u017Eka\n\n#XFLD: No items\nview.PurchaseOrder.noItem=\\u017D\\u00E1dn\\u00E9 polo\\u017Eky\n\n#XFLD\nview.PurchaseOrder.title=Objedn\\u00E1vka\n\n#XFLD\nview.PurchaseOrder.substituted=Z\\u00E1stup za\n\n#XFLD\nview.PurchaseOrder.forwarded=P\\u0159edal\n\n#XFLD\nview.PurchaseOrder.name=Jm\\u00E9no\n\n#XFLD\nview.PurchaseOrder.address=Adresa\n\n#YMSG\ndialog.question.approve=Schv\\u00E1lit objedn\\u00E1vku, kterou odeslal(a) {0}?\n\n#YMSG\ndialog.question.reject=Zam\\u00EDtnout objedn\\u00E1vku, kterou odeslal(a) {0}?\n\n#YMSG\ndialog.success.approve=Objedn\\u00E1vka byla schv\\u00E1lena\n\n#YMSG\ndialog.success.reject=Objedn\\u00E1vka byla zam\\u00EDtnuta\n\n#YMSG\ndialog.success.forward=Objedn\\u00E1vka byla p\\u0159ed\\u00E1na\\: {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=P\\u0159idat pozn\\u00E1mku (voliteln\\u00E9)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Schv\\u00E1lit\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Odm\\u00EDtnout\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=Dodavatel\n\n#XFLD: Employee header label\nBussinessCard.Employee=Zam\\u011Bstnanec\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Schv\\u00E1len\\u00ED nebo zam\\u00EDtnut\\u00ED t\\u00E9to objedn\\u00E1vky st\\u00E1le prob\\u00EDh\\u00E1. Seznam objedn\\u00E1vek m\\u016F\\u017Eete aktualizovat manu\\u00E1ln\\u011B.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=Jm\\u00E9no dodavatele\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=Objednac\\u00ED adresa\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=Profit centrum\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Schv\\u00E1lit\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Odm\\u00EDtnout\n\n#XBUT: Button for forward action\nXBUT_FORWARD=P\\u0159edat\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Zru\\u0161it\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=Bajt\n\n#YMSG: File Size Unit\nFileSize.Bytes=Bajty\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Soubor je p\\u0159\\u00EDli\\u0161 velk\\u00FD\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Dnes\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=P\\u0159ed 1 dnem\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=P\\u0159ed {0} dny\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Zav\\u00E1d\\u00ED se...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=V sou\\u010Dasn\\u00E9 dob\\u011B nejsou k dispozici \\u017E\\u00E1dn\\u00E9 polo\\u017Eky\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_de.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Bestellungen ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Bestellung\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=Bestellung\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=Lieferdatum\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=Werk\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=Kunde\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=Name\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=Zahlungsbedingungen\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=Buchungskreis\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=Mehrfachkontierung\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=Sachkonto\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=Anteil\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=Objekte\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=Kostenstelle\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=PSP-Element\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=Netzplan\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=Auftrag\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=Kundenauftrag\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=Anlage\n\n#XFLD: \nview.PurchaseOrder.subtotal=Zwischensumme\n\n#XFLD: \nview.PurchaseOrder.quantity=Menge\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=Positionstyp\n\n#XTIT: Header text of Master List\nview.Master.title=Bestellungen ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=Preisdetails\n\n#XFLD: \nview.PurchaseOrder.notes=Notizen\n\n#XFLD: \nview.PurchaseOrder.attachments=Anlagen\n\n#XFLD: \nview.PurchaseOrder.delivery=Lieferung\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=Lieferung am\n\n#XFLD: \nview.PurchaseOrder.material=Material\n\n#XFLD: \nview.PurchaseOrder.materialGroup=Warengruppe\n\n#XFLD: \nview.PurchaseOrder.serviceLines=Leistungszeilen\n\n#XFLD: \nview.PurchaseOrder.limit=Limit\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=Preiskonditionen\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=pro\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=Limitwert\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=Erwarteter Wert\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=Unbegrenzt\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=Details\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=Kontierung\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=Kontierung\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=Beschreibung\n\n#XTIT: Application name\napp.Identity=Bestellungen genehmigen\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Bestellungen genehmigen\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=Leistung\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=und sp\\u00E4ter\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=Positionen ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=Leistungszeilen ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=Gesperrt\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=Position {0} von {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Leistungszeile {0} von {1} - Position {2} von {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Position {0} von {1} - Limit \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=Typ\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=Nicht zugeordnet\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=Unbekannt\n\n#XFLD: Components\nview.PurchaseOrder.components=Komponenten\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=Lohnbearbeitung\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=Normal\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=Strecke\n\n#XFLD: Return\nview.PurchaseOrder.return=Retourenposition\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=Konsignation\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=Kondition\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=Preis\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 Position\n\n#XFLD: No items\nview.PurchaseOrder.noItem=Keine Positionen\n\n#XFLD\nview.PurchaseOrder.title=Bestellung\n\n#XFLD\nview.PurchaseOrder.substituted=Vertreter f\\u00FCr\n\n#XFLD\nview.PurchaseOrder.forwarded=Weitergeleitet von\n\n#XFLD\nview.PurchaseOrder.name=Name\n\n#XFLD\nview.PurchaseOrder.address=Adresse\n\n#YMSG\ndialog.question.approve=Bestellung von {0} genehmigen?\n\n#YMSG\ndialog.question.reject=Bestellung von {0} ablehnen?\n\n#YMSG\ndialog.success.approve=Bestellung genehmigt\n\n#YMSG\ndialog.success.reject=Bestellung abgelehnt\n\n#YMSG\ndialog.success.forward=Bestellung an {0} weitergeleitet\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Notiz hinzuf\\u00FCgen (optional)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Genehmigen\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Ablehnen\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=Lieferant\n\n#XFLD: Employee header label\nBussinessCard.Employee=Mitarbeiter\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Die Genehmigung oder Ablehnung dieser Bestellung wird noch verarbeitet. Sie k\\u00F6nnen die Liste der Bestellungen manuell aktualisieren.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=Lieferantenname\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=Bestelladresse\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=Profitcenter\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Genehmigen\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Ablehnen\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Weiterleiten\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Abbrechen\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=Byte\n\n#YMSG: File Size Unit\nFileSize.Bytes=Byte\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=KB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Datei ist zu gro\\u00DF\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Heute\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=Gestern\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=Vor {0} Tagen\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Laden...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Keine Positionen verf\\u00FCgbar\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_en.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Purchase Orders ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Purchase Order\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=Purchase Order\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=Delivery Date\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=Plant\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=Customer\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=Name\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=Payment Terms\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=Company Code\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=Multiple Assignments\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=G/L Account\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=Share\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=Objects\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=Cost Center\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=WBS Element\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=Network\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=Order\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=Sales Order\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=Asset\n\n#XFLD: \nview.PurchaseOrder.subtotal=Subtotal\n\n#XFLD: \nview.PurchaseOrder.quantity=Quantity\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=Item Category\n\n#XTIT: Header text of Master List\nview.Master.title=Purchase Orders ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=Price Details\n\n#XFLD: \nview.PurchaseOrder.notes=Notes\n\n#XFLD: \nview.PurchaseOrder.attachments=Attachments\n\n#XFLD: \nview.PurchaseOrder.delivery=Delivery\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=Delivery on\n\n#XFLD: \nview.PurchaseOrder.material=Material\n\n#XFLD: \nview.PurchaseOrder.materialGroup=Material Group\n\n#XFLD: \nview.PurchaseOrder.serviceLines=Service Lines\n\n#XFLD: \nview.PurchaseOrder.limit=Limit\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=Pricing Conditions\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=per\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=Limit Value\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=Expected Value\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=Unlimited\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=Information\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=Account Assignment\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=Account Assignment\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=Description\n\n#XTIT: Application name\napp.Identity=Approve Purchase Orders\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Approve Purchase Orders\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=Service\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=and later\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=Items ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=Service Lines ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=Blocked\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=Item {0} of {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Service Line {0} of {1} - Item {2} of {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Item {0} of {1} - Limit \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=Category\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=Not Assigned\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=Unknown\n\n#XFLD: Components\nview.PurchaseOrder.components=Components\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=Subcontracting\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=Standard\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=Third-party\n\n#XFLD: Return\nview.PurchaseOrder.return=Returns Item\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=Consignment\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=Condition\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=Price\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 item\n\n#XFLD: No items\nview.PurchaseOrder.noItem=No items\n\n#XFLD\nview.PurchaseOrder.title=Purchase Order\n\n#XFLD\nview.PurchaseOrder.substituted=Substitute for\n\n#XFLD\nview.PurchaseOrder.forwarded=Forwarded by\n\n#XFLD\nview.PurchaseOrder.name=Name\n\n#XFLD\nview.PurchaseOrder.address=Address\n\n#YMSG\ndialog.question.approve=Approve the purchase order submitted by {0}?\n\n#YMSG\ndialog.question.reject=Reject the purchase order submitted by {0}?\n\n#YMSG\ndialog.success.approve=Purchase order was approved\n\n#YMSG\ndialog.success.reject=Purchase order was rejected\n\n#YMSG\ndialog.success.forward=Purchase order was forwarded to {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Add note (optional)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Approve\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Reject\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=Supplier\n\n#XFLD: Employee header label\nBussinessCard.Employee=Employee\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Approval or rejection of this purchase order is still in process. You can refresh the list of purchase orders manually.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=Supplier Name\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=Ordering Address\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=Profit Center\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Approve\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Reject\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Forward\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Cancel\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=Byte\n\n#YMSG: File Size Unit\nFileSize.Bytes=Bytes\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=File is too large\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Today\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 day ago\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} days ago\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Loading...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=No items are currently available\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_en_US_sappsd.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=[[[\\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u014E\\u0157\\u018C\\u0113\\u0157\\u015F ({0})]]]\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=[[[\\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u014E\\u0157\\u018C\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=[[[\\u012C\\u014B\\u010B\\u014F\\u0163\\u0113\\u0157\\u0271\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=[[[\\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u014E\\u0157\\u018C\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=[[[\\u010E\\u0113\\u013A\\u012F\\u028B\\u0113\\u0157\\u0177 \\u010E\\u0105\\u0163\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=[[[\\u01A4\\u013A\\u0105\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=[[[\\u0108\\u0171\\u015F\\u0163\\u014F\\u0271\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=[[[\\u0143\\u0105\\u0271\\u0113]]]\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=[[[\\u01A4\\u0105\\u0177\\u0271\\u0113\\u014B\\u0163 \\u0162\\u0113\\u0157\\u0271\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=[[[\\u0108\\u014F\\u0271\\u03C1\\u0105\\u014B\\u0177 \\u0108\\u014F\\u018C\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=[[[\\u039C\\u0171\\u013A\\u0163\\u012F\\u03C1\\u013A\\u0113 \\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u0271\\u0113\\u014B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=[[[\\u0122/\\u013B \\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=[[[\\u015C\\u0125\\u0105\\u0157\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=[[[\\u014E\\u0183\\u0135\\u0113\\u010B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=[[[\\u0108\\u014F\\u015F\\u0163 \\u0108\\u0113\\u014B\\u0163\\u0157\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=[[[\\u0174\\u0181\\u015C \\u0114\\u013A\\u0113\\u0271\\u0113\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=[[[\\u0143\\u0113\\u0163\\u0175\\u014F\\u0157\\u0137\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=[[[\\u014E\\u0157\\u018C\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=[[[\\u015C\\u0105\\u013A\\u0113\\u015F \\u014E\\u0157\\u018C\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=[[[\\u0100\\u015F\\u015F\\u0113\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: \nview.PurchaseOrder.subtotal=[[[\\u015C\\u0171\\u0183\\u0163\\u014F\\u0163\\u0105\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: \nview.PurchaseOrder.quantity=[[[\\u01EC\\u0171\\u0105\\u014B\\u0163\\u012F\\u0163\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=[[[\\u012C\\u0163\\u0113\\u0271 \\u0108\\u0105\\u0163\\u0113\\u011F\\u014F\\u0157\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Header text of Master List\nview.Master.title=[[[\\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u014E\\u0157\\u018C\\u0113\\u0157\\u015F ({0})]]]\n\n#XFLD: \nview.PurchaseOrder.priceDetails=[[[\\u01A4\\u0157\\u012F\\u010B\\u0113 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: \nview.PurchaseOrder.notes=[[[\\u0143\\u014F\\u0163\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: \nview.PurchaseOrder.attachments=[[[\\u0100\\u0163\\u0163\\u0105\\u010B\\u0125\\u0271\\u0113\\u014B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: \nview.PurchaseOrder.delivery=[[[\\u010E\\u0113\\u013A\\u012F\\u028B\\u0113\\u0157\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=[[[\\u010E\\u0113\\u013A\\u012F\\u028B\\u0113\\u0157\\u0177 \\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: \nview.PurchaseOrder.material=[[[\\u039C\\u0105\\u0163\\u0113\\u0157\\u012F\\u0105\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: \nview.PurchaseOrder.materialGroup=[[[\\u039C\\u0105\\u0163\\u0113\\u0157\\u012F\\u0105\\u013A \\u0122\\u0157\\u014F\\u0171\\u03C1\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: \nview.PurchaseOrder.serviceLines=[[[\\u015C\\u0113\\u0157\\u028B\\u012F\\u010B\\u0113 \\u013B\\u012F\\u014B\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: \nview.PurchaseOrder.limit=[[[\\u013B\\u012F\\u0271\\u012F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=[[[\\u01A4\\u0157\\u012F\\u010B\\u012F\\u014B\\u011F \\u0108\\u014F\\u014B\\u018C\\u012F\\u0163\\u012F\\u014F\\u014B\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=[[[\\u03C1\\u0113\\u0157\\u2219]]]\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty=[[[{0} {1} / {2} {3}]]]\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=[[[\\u013B\\u012F\\u0271\\u012F\\u0163 \\u01B2\\u0105\\u013A\\u0171\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=[[[\\u0114\\u03C7\\u03C1\\u0113\\u010B\\u0163\\u0113\\u018C \\u01B2\\u0105\\u013A\\u0171\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=[[[\\u016E\\u014B\\u013A\\u012F\\u0271\\u012F\\u0163\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=[[[\\u012C\\u014B\\u0192\\u014F\\u0157\\u0271\\u0105\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163 \\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u0271\\u0113\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163 \\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u0271\\u0113\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=[[[\\u010E\\u0113\\u015F\\u010B\\u0157\\u012F\\u03C1\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Application name\napp.Identity=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113 \\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u014E\\u0157\\u018C\\u0113\\u0157\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113 \\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u014E\\u0157\\u018C\\u0113\\u0157\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=[[[\\u015C\\u0113\\u0157\\u028B\\u012F\\u010B\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=[[[\\u0105\\u014B\\u018C \\u013A\\u0105\\u0163\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=[[[\\u012C\\u0163\\u0113\\u0271\\u015F ({0})]]]\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=[[[\\u015C\\u0113\\u0157\\u028B\\u012F\\u010B\\u0113 \\u013B\\u012F\\u014B\\u0113\\u015F ({0})]]]\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=[[[\\u0181\\u013A\\u014F\\u010B\\u0137\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=[[[\\u012C\\u0163\\u0113\\u0271 {0} \\u014F\\u0192 {1}]]]\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=[[[\\u015C\\u0113\\u0157\\u028B\\u012F\\u010B\\u0113 \\u013B\\u012F\\u014B\\u0113 {0} \\u014F\\u0192 {1} - \\u012C\\u0163\\u0113\\u0271 {2} \\u014F\\u0192 {3}]]]\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=[[[\\u012C\\u0163\\u0113\\u0271 {0} \\u014F\\u0192 {1} - \\u013B\\u012F\\u0271\\u012F\\u0163 ]]]\n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=[[[\\u0108\\u0105\\u0163\\u0113\\u011F\\u014F\\u0157\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=[[[\\u0143\\u014F\\u0163 \\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=[[[\\u016E\\u014B\\u0137\\u014B\\u014F\\u0175\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Components\nview.PurchaseOrder.components=[[[\\u0108\\u014F\\u0271\\u03C1\\u014F\\u014B\\u0113\\u014B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=[[[\\u015C\\u0171\\u0183\\u010B\\u014F\\u014B\\u0163\\u0157\\u0105\\u010B\\u0163\\u012F\\u014B\\u011F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=[[[\\u015C\\u0163\\u0105\\u014B\\u018C\\u0105\\u0157\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=[[[\\u0162\\u0125\\u012F\\u0157\\u018C-\\u03C1\\u0105\\u0157\\u0163\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Return\nview.PurchaseOrder.return=[[[\\u0157\\u0113\\u0163\\u0171\\u0157\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=[[[\\u0108\\u014F\\u014B\\u015F\\u012F\\u011F\\u014B\\u0271\\u0113\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=[[[\\u0108\\u014F\\u014B\\u018C\\u012F\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=[[[\\u01A4\\u0157\\u012F\\u010B\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=[[[1 \\u012F\\u0163\\u0113\\u0271\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: No items\nview.PurchaseOrder.noItem=[[[\\u0143\\u014F \\u012F\\u0163\\u0113\\u0271\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD\nview.PurchaseOrder.title=[[[\\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u014E\\u0157\\u018C\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD\nview.PurchaseOrder.substituted=[[[\\u015C\\u0171\\u0183\\u015F\\u0163\\u012F\\u0163\\u0171\\u0163\\u0113 \\u0192\\u014F\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD\nview.PurchaseOrder.forwarded=[[[\\u0191\\u014F\\u0157\\u0175\\u0105\\u0157\\u018C\\u0113\\u018C \\u0183\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD\nview.PurchaseOrder.name=[[[\\u0143\\u0105\\u0271\\u0113]]]\n\n#XFLD\nview.PurchaseOrder.address=[[[\\u0100\\u018C\\u018C\\u0157\\u0113\\u015F\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG\ndialog.question.approve=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113 \\u0163\\u0125\\u0113 \\u03C1\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u014F\\u0157\\u018C\\u0113\\u0157 \\u015F\\u0171\\u0183\\u0271\\u012F\\u0163\\u0163\\u0113\\u018C \\u0183\\u0177 {0}?]]]\n\n#YMSG\ndialog.question.reject=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163 \\u0163\\u0125\\u0113 \\u03C1\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u014F\\u0157\\u018C\\u0113\\u0157 \\u015F\\u0171\\u0183\\u0271\\u012F\\u0163\\u0163\\u0113\\u018C \\u0183\\u0177 {0}?]]]\n\n#YMSG\ndialog.success.approve=[[[\\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u014F\\u0157\\u018C\\u0113\\u0157 \\u0175\\u0105\\u015F \\u0105\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u018C \\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG\ndialog.success.reject=[[[\\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u014F\\u0157\\u018C\\u0113\\u0157 \\u0175\\u0105\\u015F \\u0157\\u0113\\u0135\\u0113\\u010B\\u0163\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG\ndialog.success.forward=[[[\\u01A4\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u014F\\u0157\\u018C\\u0113\\u0157 \\u0175\\u0105\\u015F \\u0192\\u014F\\u0157\\u0175\\u0105\\u0157\\u018C\\u0113\\u018C \\u0163\\u014F {0}]]]\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=[[[\\u0100\\u018C\\u018C \\u014B\\u014F\\u0163\\u0113 (\\u014F\\u03C1\\u0163\\u012F\\u014F\\u014B\\u0105\\u013A)\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=[[[\\u015C\\u0171\\u03C1\\u03C1\\u013A\\u012F\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Employee header label\nBussinessCard.Employee=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0105\\u013A \\u014F\\u0157 \\u0157\\u0113\\u0135\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B \\u014F\\u0192 \\u0163\\u0125\\u012F\\u015F \\u03C1\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u014F\\u0157\\u018C\\u0113\\u0157 \\u012F\\u015F \\u015F\\u0163\\u012F\\u013A\\u013A \\u012F\\u014B \\u03C1\\u0157\\u014F\\u010B\\u0113\\u015F\\u015F. \\u0176\\u014F\\u0171 \\u010B\\u0105\\u014B \\u0157\\u0113\\u0192\\u0157\\u0113\\u015F\\u0125 \\u0163\\u0125\\u0113 \\u013A\\u012F\\u015F\\u0163 \\u014F\\u0192 \\u03C1\\u0171\\u0157\\u010B\\u0125\\u0105\\u015F\\u0113 \\u014F\\u0157\\u018C\\u0113\\u0157\\u015F \\u0271\\u0105\\u014B\\u0171\\u0105\\u013A\\u013A\\u0177.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=[[[\\u015C\\u0171\\u03C1\\u03C1\\u013A\\u012F\\u0113\\u0157 \\u0143\\u0105\\u0271\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=[[[\\u014E\\u0157\\u018C\\u0113\\u0157\\u012F\\u014B\\u011F \\u0100\\u018C\\u018C\\u0157\\u0113\\u015F\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=[[[\\u01A4\\u0157\\u014F\\u0192\\u012F\\u0163 \\u0108\\u0113\\u014B\\u0163\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=[[[\\u014E\\u0136\\u2219\\u2219]]]\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT: Button for Reject action\nXBUT_REJECT=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT: Button for forward action\nXBUT_FORWARD=[[[\\u0191\\u014F\\u0157\\u0175\\u0105\\u0157\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=[[[\\u0181\\u0177\\u0163\\u0113]]]\n\n#YMSG: File Size Unit\nFileSize.Bytes=[[[\\u0181\\u0177\\u0163\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=[[[\\u0137\\u0181\\u2219\\u2219]]]\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=[[[\\u039C\\u0181\\u2219\\u2219]]]\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=[[[\\u0122\\u0181\\u2219\\u2219]]]\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=[[[\\u0162\\u0181\\u2219\\u2219]]]\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=[[[\\u01A4\\u0181\\u2219\\u2219]]]\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=[[[\\u0114\\u0181\\u2219\\u2219]]]\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=[[[\\u017B\\u0181\\u2219\\u2219]]]\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=[[[\\u0176\\u0181\\u2219\\u2219]]]\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=[[[\\u0191\\u012F\\u013A\\u0113 \\u012F\\u015F \\u0163\\u014F\\u014F \\u013A\\u0105\\u0157\\u011F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=[[[\\u0162\\u014F\\u018C\\u0105\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=[[[1 \\u018C\\u0105\\u0177 \\u0105\\u011F\\u014F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=[[[{0} \\u018C\\u0105\\u0177\\u015F \\u0105\\u011F\\u014F]]]\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId=[[[{0} ({1})]]]\n\n# YMSG: Loading\nLOADING=[[[\\u013B\\u014F\\u0105\\u018C\\u012F\\u014B\\u011F...\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=[[[\\u0143\\u014F \\u012F\\u0163\\u0113\\u0271\\u015F \\u0105\\u0157\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_en_US_saptrc.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Sz+gQA+mDxpjgNdRiEn9Ag_Purchase Orders ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=HAqaBpHW/pFkGIq8ee7XCw_Purchase Order\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=kfSwFOI62sZnltkfX8Qsdg_Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=qX7y7KSxvhbNcJi38jPs6A_Purchase Order\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=fcv6E1vWFubjVjadi5GFkw_Delivery Date\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=rW7yZhkQ2C5Jq4C4IFQiUQ_Plant\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=sF0Gjl7NNjP4Uw59ihQaWg_Customer\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=Uv8p60OLRJLBBrAAcTCsdg_Name\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=B0GcCwmh2HgNJnhqFkW+jw_Payment Terms\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=JAip9JItGAPIlaWrwFdSoQ_Company Code\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=4kqlgd7sVHIfjMtFn+zdnw_Multiple Assignments\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=jItJi2YIPWAF9Rb6B7Xn+g_G/L Account\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=mHxIHtig8YZ7tHNjRQaW8Q_Share\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=H2s10xoWLBrxvsFMWxGUug_Objects\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=zCTpL2OyQo5GcUDFXGr9Zg_Cost Centre\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=9tQYGvdwWFeKJzCUU9135w_WBS Element\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=g75ccqHKVchTsfGFFAP/ag_Network\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=GYGHFyI9peq58cO1Uih9Bg_Order\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=Zor9wsvX9gtGUFkm/5s3uQ_Sales Order\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=gkEilKBX4Q2IwQQxccS4Gg_Asset\n\n#XFLD: \nview.PurchaseOrder.subtotal=t+gEzl+AprLKZxCpoK/+cQ_Subtotal\n\n#XFLD: \nview.PurchaseOrder.quantity=pAtLeDqJRO7tj6h/52kyCw_Quantity\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=PSh4sX2P10aa2sSBb3yoVg_Item Category\n\n#XTIT: Header text of Master List\nview.Master.title=SbglrJ5mf3INXmcDZ2ePzw_Purchase Orders ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=MTK2sIUl8Jt7pa6gZZkUqw_Price Details\n\n#XFLD: \nview.PurchaseOrder.notes=kxz6FWyIeFcks+vHEQRTog_Notes\n\n#XFLD: \nview.PurchaseOrder.attachments=77toyuSjacSv/HSXsUwa6w_Attachments\n\n#XFLD: \nview.PurchaseOrder.delivery=Lqnk0rM202qOE9+0a3AF6g_Delivery\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=BbNBxyxzgryCC1IfM9k30w_Delivery on\n\n#XFLD: \nview.PurchaseOrder.material=7n7EUwq/7lWOT8PKM4PCdg_Material\n\n#XFLD: \nview.PurchaseOrder.materialGroup=XwGVTI8aEhsPlrF4UqPL8g_Material Group\n\n#XFLD: \nview.PurchaseOrder.serviceLines=uJuo1AfRiukekIUFYE6hlQ_Service Lines\n\n#XFLD: \nview.PurchaseOrder.limit=TsZkZDJn2j1hjil1V+LQMw_Limit\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=kLTKD/bIT/rv6QAmoUmrjw_Pricing Conditions\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=hrWV/TADzYg6++vPCfWcSA_per\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty=6hwyk45QX45GG+xBFySSGQ_{0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=NRGSyveVw6pcMdLagwO6EA_Limit Value\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=D95Joiqn37kzPpbxXHKWdg_Expected Value\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=8AWs1AAM8GiBF9YhmPPckw_Unlimited\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=EBBCun03qLntSa7MP6uV9g_Information\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=lF03qD3AjfrzXlHtKn1IXQ_Account Assignment\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=KXyY4RQxuSPvQhtkmWcdoQ_Account Assignment\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=8xe7S98a8f0FZbA1KGUMIA_Description\n\n#XTIT: Application name\napp.Identity=3dDYoXLEmA68XEpyJnswhQ_Approve Purchase Orders\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=aQb272cpncmJoPZI2rN3ig_Approve Purchase Orders\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=MPkCBZwdadGbfGatrrYYNw_Service\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=6u9b99DahA13kgi2N1OW5w_and later\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=+0VzATlEVbGtwkJZ6JnNXg_Items ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=vKaMpLpFsaDODSM5wUolqg_Service Lines ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=9EDuXPfIrbnQ0pVARIfcdg_Blocked\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=iomThQff7bx76KD4ix6SxQ_Item {0} of {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=5AeRGZzep+9s114ZyDp+xQ_Service Line {0} of {1} - Item {2} of {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=JVvdQQTASX9Et3gOhWFpyA_Item {0} of {1} - Limit \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=BIUH19cRhuBrjSo1n5dFRA_Category\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=vXsOJNM8fRImHJ0BzWy3MA_Not Assigned\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=9ep9bhP8UC4os4aFuQaAog_Unknown\n\n#XFLD: Components\nview.PurchaseOrder.components=UgkvU9jWTaIjTNh8Rp5iVg_Components\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=8+yeTV+upu/oLb43afwoDQ_Subcontracting\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=4CDsNdU+F3c60GXbsr8Chg_Standard\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=LyQ29K2iIOVM+QLDj+JFUw_Third-party\n\n#XFLD: Return\nview.PurchaseOrder.return=OQf6hiMTEdtm7HQ6JH/6hQ_return\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=lP766mEnm9hTBzw3ZtfYOA_Consignment\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=hsOPaog8rBi75eTGJ3g4kQ_Condition\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=ILosXcJv7uspUB3zN63UOQ_Price\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=7O04K62cp7ccOxNqemwYkg_1 item\n\n#XFLD: No items\nview.PurchaseOrder.noItem=6wf4MKLIvfQKqoEXYnarkQ_No items\n\n#XFLD\nview.PurchaseOrder.title=6eCfOXEP48fJw6NmLC8xuw_Purchase Order\n\n#XFLD\nview.PurchaseOrder.substituted=nrIYwXQQythLgu3bwYEWpQ_Substitute for\n\n#XFLD\nview.PurchaseOrder.forwarded=0aIxnDdaVnZRz5xX94fv8g_Forwarded by\n\n#XFLD\nview.PurchaseOrder.name=2nACtNb5sqvyCs05mx4lAw_Name\n\n#XFLD\nview.PurchaseOrder.address=DAIXdd5hW4guHxjv+QH+gw_Address\n\n#YMSG\ndialog.question.approve=ru5Qve0S64xNygD4SCyu3Q_Approve the purchase order submitted by {0}?\n\n#YMSG\ndialog.question.reject=MHcfklWKbCW+f2CYemDQKw_Reject the purchase order submitted by {0}?\n\n#YMSG\ndialog.success.approve=aHSpYtKhOXoJBP9u4SIKrA_Purchase order was approved \n\n#YMSG\ndialog.success.reject=OpaNZ49HdYRfEdZeHpxcAQ_Purchase order was rejected\n\n#YMSG\ndialog.success.forward=znxDVkE7BJOK79IhTpmEAg_Purchase order was forwarded to {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=bGwkzjdYUz6vdYPaEwACHQ_Add note (optional)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=p93UB2Ci08mpO2nfc3zs2A_Approve\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=bHPfnmWMNAL5p2nV/DeMvA_Reject\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=MBu6pjI6Lja3SlzuEANXUw_Supplier\n\n#XFLD: Employee header label\nBussinessCard.Employee=A4+UxMahHdVUK1UO6O+BtA_Employee\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=TNMv2QW6jTWpFmHgWJo35A_Approval or rejection of this purchase order is still in process. You can refresh the list of purchase orders manually.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=dxH30/HC7DKvvp7XLMUIhQ_Supplier Name\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=ha5Tjkg5qWPO3BxD7uD29Q_Ordering Address\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=UC/T1ZJ61Q4e+j2Z8KWdlQ_Profit Center\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=MP8qMeUOrXqO4e+csOZW9g_OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Zni+WqN0UHSenGKTJk3Jpg_Approve\n\n#XBUT: Button for Reject action\nXBUT_REJECT=VuuXliW1bi4UvVeK+i+61g_Reject\n\n#XBUT: Button for forward action\nXBUT_FORWARD=GmGcvZbiXmk7MPwUGa3q1w_Forward\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=SIP741I9bzp4khGoEJHM+w_Cancel\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=Iowhx6AwE6Wdtm2nTXY+mA_Byte\n\n#YMSG: File Size Unit\nFileSize.Bytes=45fLFFzUuAE7KXFr9Vp0BA_Bytes\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=QSvhhAxjRrBZmrTlOLoh3Q_kB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=RMbQXWJXFLTMw23+eMNaPg_MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=A1QkM8mrkP4/RvyUstSGlw_GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=9iNK1CDuwdb27Vh34rSYow_TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=tG9fDgIBg3OFnYt8xf9cyA_PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=ohl7Cs4naCNxiW/t33cLqw_EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=Ws1845xoAce6XPgxNpG4fg_ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=XCifjRNh9XWGI6h0R9XIbA_YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=+agpyJsxEZ7qcwocwju/tg_File is too large\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=l2BgLho3jCBkdWs+/Apuzw_Today\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=GJkw/Trt3LPEerFI0r6zOA_1 day ago\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=eNOlDmr0jxreC99Evrq3Xw_{0} days ago\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId=tdS6kJ/TgRnb2p0GWQ1fVQ_{0} ({1})\n\n# YMSG: Loading\nLOADING=fZMlGKh4aEmKBJCY2NQdJg_Loading...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=o9e5x340iIKKJS5wfuYDag_No items are currently available\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_es.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=\\u00D3rdenes de compra ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Pedido de compra\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=Pedido de compra\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=Fecha de entrega\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=Centro\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=Cliente\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=Nombre\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=Condiciones de pago\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=Sociedad\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=Asignaciones m\\u00FAltiples\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=Cuenta mayor\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=Compartir\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=Objetos\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=Centro de coste\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=Elemento PEP\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=Red\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=Orden\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=Pedido de cliente\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=Activo\n\n#XFLD: \nview.PurchaseOrder.subtotal=Subtotal\n\n#XFLD: \nview.PurchaseOrder.quantity=Cantidad\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=Categor\\u00EDa de art\\u00EDculo\n\n#XTIT: Header text of Master List\nview.Master.title=\\u00D3rdenes de compra ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=Detalles de precios\n\n#XFLD: \nview.PurchaseOrder.notes=Notas\n\n#XFLD: \nview.PurchaseOrder.attachments=Anexos\n\n#XFLD: \nview.PurchaseOrder.delivery=Entrega\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=Entrega el\n\n#XFLD: \nview.PurchaseOrder.material=Material\n\n#XFLD: \nview.PurchaseOrder.materialGroup=Grupo de materiales\n\n#XFLD: \nview.PurchaseOrder.serviceLines=L\\u00EDneas de servicios\n\n#XFLD: \nview.PurchaseOrder.limit=L\\u00EDmite\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=Condiciones de precio\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=por\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=Valor l\\u00EDmite\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=Valor previsto\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=Ilimitado\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=Informaci\\u00F3n\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=Asignaci\\u00F3n de costes\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=Asignaci\\u00F3n de costes\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=Descripci\\u00F3n\n\n#XTIT: Application name\napp.Identity=Aprobaci\\u00F3n de \\u00F3rdenes de compra\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Aprobaci\\u00F3n de \\u00F3rdenes de compra\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=Servicio\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=y posteriores\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=Posiciones ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=L\\u00EDneas de servicio ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=Bloqueados\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=Posici\\u00F3n {0} de {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=L\\u00EDnea de servicio {0} de {1} - Posici\\u00F3n {2} de {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Posici\\u00F3n {0} de {1} - L\\u00EDmite \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=Categor\\u00EDa\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=No asignado\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=Desconocido\n\n#XFLD: Components\nview.PurchaseOrder.components=Componentes\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=Subcontrataci\\u00F3n\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=Est\\u00E1ndar\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=Pedido a terceros\n\n#XFLD: Return\nview.PurchaseOrder.return=Devuelve posici\\u00F3n\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=Consignaci\\u00F3n\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=Condici\\u00F3n\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=Precio\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 elemento\n\n#XFLD: No items\nview.PurchaseOrder.noItem=No hay elementos\n\n#XFLD\nview.PurchaseOrder.title=Pedido de compra\n\n#XFLD\nview.PurchaseOrder.substituted=Sustituto para\n\n#XFLD\nview.PurchaseOrder.forwarded=Reenviado  por\n\n#XFLD\nview.PurchaseOrder.name=Nombre\n\n#XFLD\nview.PurchaseOrder.address=Direcci\\u00F3n\n\n#YMSG\ndialog.question.approve=\\u00BFAprobar la orden de compra enviada por {0}?\n\n#YMSG\ndialog.question.reject=\\u00BFRechazar la orden de compra enviada por {0}?\n\n#YMSG\ndialog.success.approve=Orden de compra aprobada\n\n#YMSG\ndialog.success.reject=Orden de compra rechazada\n\n#YMSG\ndialog.success.forward=Orden de compra transmitida a {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=A\\u00F1adir nota (opcional)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Aprobar\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Rechazar\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=Proveedor\n\n#XFLD: Employee header label\nBussinessCard.Employee=Empleado\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=La aprobaci\\u00F3n o el rechazo de esta orden de compra sigue en curso. Puede actualizar la lista de \\u00F3rdenes de compra manualmente.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=Nombre del proveedor\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=Direcci\\u00F3n del pedido\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=Centro de beneficio\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Aprobar\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Rechazar\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Reenviar\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Cancelar\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=Byte\n\n#YMSG: File Size Unit\nFileSize.Bytes=Bytes\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=El fichero es demasiado grande\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Hoy\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=Hace 1 d\\u00EDa\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=Hace {0} d\\u00EDas\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Cargando...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Actualmente no hay posiciones disponibles\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_fr.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Commandes d\'\'achat ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Commande d\'achat\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=Commande d\'achat\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=Date de livraison\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=Division\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=Client\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=Nom\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=Conditions de paiement\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=Soci\\u00E9t\\u00E9\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=Affectations multiples\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=Compte g\\u00E9n\\u00E9ral\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=Part\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=Objets\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=Centre de co\\u00FBts\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=\\u00C9l\\u00E9ment d\'OTP\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=R\\u00E9seau\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=Commande\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=Commande client\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=Immobilisation\n\n#XFLD: \nview.PurchaseOrder.subtotal=Total interm\\u00E9diaire\n\n#XFLD: \nview.PurchaseOrder.quantity=Quantit\\u00E9\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=Cat\\u00E9gorie de poste\n\n#XTIT: Header text of Master List\nview.Master.title=Commandes d\'\'achat ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=D\\u00E9tails du prix\n\n#XFLD: \nview.PurchaseOrder.notes=Notes\n\n#XFLD: \nview.PurchaseOrder.attachments=Pi\\u00E8ces jointes\n\n#XFLD: \nview.PurchaseOrder.delivery=Livraison\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=Livraison le\n\n#XFLD: \nview.PurchaseOrder.material=Article\n\n#XFLD: \nview.PurchaseOrder.materialGroup=Groupe de marchandises\n\n#XFLD: \nview.PurchaseOrder.serviceLines=Lignes de service\n\n#XFLD: \nview.PurchaseOrder.limit=Limite\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=Conditions de prix\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=par\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=Valeur limite\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=Valeur attendue\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=Illimit\\u00E9\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=Informations\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=Imputation\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=Imputation\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=Description\n\n#XTIT: Application name\napp.Identity=Approbation de commandes d\'achat\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Approbation de commandes d\'achat\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=Service\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=et ult\\u00E9rieur\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=Postes ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=Lignes de service ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=Bloqu\\u00E9e\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=Poste ({0}\\u00A0/\\u00A0{1})\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Ligne de service {0}\\u00A0/\\u00A0{1} - Poste {2}\\u00A0/\\u00A0{3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Poste {0}\\u00A0/\\u00A0{1} - limite \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=Cat\\u00E9gorie\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=Non affect\\u00E9\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=Inconnu\n\n#XFLD: Components\nview.PurchaseOrder.components=Composants\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=Sous-traitance\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=Standard\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=Livraison directe\n\n#XFLD: Return\nview.PurchaseOrder.return=Poste de retours\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=Consignation\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=Condition\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=Prix\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 poste\n\n#XFLD: No items\nview.PurchaseOrder.noItem=Aucun poste\n\n#XFLD\nview.PurchaseOrder.title=Commande d\'achat\n\n#XFLD\nview.PurchaseOrder.substituted=Rempla\\u00E7ant de\n\n#XFLD\nview.PurchaseOrder.forwarded=Transf\\u00E9r\\u00E9(e) par\n\n#XFLD\nview.PurchaseOrder.name=Nom\n\n#XFLD\nview.PurchaseOrder.address=Adresse\n\n#YMSG\ndialog.question.approve=Approuver la commande d\'\'achat envoy\\u00E9e par {0}\\u00A0?\n\n#YMSG\ndialog.question.reject=Refuser la commande d\'\'achat envoy\\u00E9e par {0}\\u00A0?\n\n#YMSG\ndialog.success.approve=Commande d\'achat approuv\\u00E9e\n\n#YMSG\ndialog.success.reject=Commande d\'achat refus\\u00E9e\n\n#YMSG\ndialog.success.forward=Commande d\'\'achat transf\\u00E9r\\u00E9e \\u00E0 {0}.\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Ajouter note (facultatif)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Approuver\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Refuser\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=Fournisseur\n\n#XFLD: Employee header label\nBussinessCard.Employee=Salari\\u00E9\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=L\'approbation ou le rejet de cette commande d\'achat est toujours en cours. Vous pouvez actualiser la liste des commandes d\'achat manuellement.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=Nom du fournisseur\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=Adresse de commande\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=Centre de profit\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Approuver\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Refuser\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Transf\\u00E9rer\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Interrompre\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=Octet\n\n#YMSG: File Size Unit\nFileSize.Bytes=Octets\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=Ko\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=Mo\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=Go\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=To\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=Po\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=Eo\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=Zo\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=Yb\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=La taille du fichier est trop grande.\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Aujourd\'hui\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=Il y a 1 jour.\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=Il y a {0} jours.\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Chargement...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Aucun poste disponible actuellement\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_hr.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Narud\\u017Ebenice ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Narud\\u017Ebenica\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=Narud\\u017Ebenica\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=Datum isporuke\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=Pogon\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=Kupac\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=Naziv\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=Uvjeti pla\\u0107anja\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=\\u0160ifra poduze\\u0107a\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=Vi\\u0161estruke dodjele\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=Konto glavne knjige\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=Udio\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=Objekti\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=Mjesto tro\\u0161ka\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=WBS element\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=Mre\\u017Ea\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=Nalog\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=Prodajni nalog\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=Imovina\n\n#XFLD: \nview.PurchaseOrder.subtotal=Me\\u0111uzbroj\n\n#XFLD: \nview.PurchaseOrder.quantity=Koli\\u010Dina\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=Kategorija stavke\n\n#XTIT: Header text of Master List\nview.Master.title=Narud\\u017Ebenice ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=Detalji cijene\n\n#XFLD: \nview.PurchaseOrder.notes=Bilje\\u0161ke\n\n#XFLD: \nview.PurchaseOrder.attachments=Prilozi\n\n#XFLD: \nview.PurchaseOrder.delivery=Isporuka\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=Isporuka dana\n\n#XFLD: \nview.PurchaseOrder.material=Materijal\n\n#XFLD: \nview.PurchaseOrder.materialGroup=Grupa materijala\n\n#XFLD: \nview.PurchaseOrder.serviceLines=Redovi usluge\n\n#XFLD: \nview.PurchaseOrder.limit=Ograni\\u010Denje\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=Uvjeti odre\\u0111ivanja cijena\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=po\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=Vrijednost ograni\\u010Denja\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=O\\u010Dekivana vrijednost\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=Neograni\\u010Deno\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=Informacije\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=Dodjela konta\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=Dodjela konta\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=Opis\n\n#XTIT: Application name\napp.Identity=Odobri narud\\u017Ebenice\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Odobri narud\\u017Ebenice\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=Usluga\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=i kasnije\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=Stavke ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=Redovi usluge ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=Blokirano\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=Stavka {0} od {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Redak usluge {0} od {1} - stavka {2} od {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Stavka {0} od {1} - ograni\\u010Denje \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=Kategorija\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=Nije dodijeljeno\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=Nepoznato\n\n#XFLD: Components\nview.PurchaseOrder.components=Komponente\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=Podugovaranje\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=Standard\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=Tre\\u0107a strana\n\n#XFLD: Return\nview.PurchaseOrder.return=Stavka povrata\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=Konsignacija\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=Uvjet\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=Cijena\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 stavka\n\n#XFLD: No items\nview.PurchaseOrder.noItem=Nema stavki\n\n#XFLD\nview.PurchaseOrder.title=Narud\\u017Ebenica\n\n#XFLD\nview.PurchaseOrder.substituted=Zamjena za\n\n#XFLD\nview.PurchaseOrder.forwarded=Proslijedio\n\n#XFLD\nview.PurchaseOrder.name=Naziv\n\n#XFLD\nview.PurchaseOrder.address=Adresa\n\n#YMSG\ndialog.question.approve=Odobriti narud\\u017Ebenicu koju podnosi {0}?\n\n#YMSG\ndialog.question.reject=Odbiti narud\\u017Ebenicu koju podnosi {0}?\n\n#YMSG\ndialog.success.approve=Narud\\u017Ebenica odobrena\n\n#YMSG\ndialog.success.reject=Narud\\u017Ebenica odbijena\n\n#YMSG\ndialog.success.forward=Narud\\u017Ebenica je proslije\\u0111ena u {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Dodaj bilje\\u0161ku (izborno)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Odobri\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Odbij\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=Dobavlja\\u010D\n\n#XFLD: Employee header label\nBussinessCard.Employee=Zaposlenik\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Odobrenje ili odbijanje ove narud\\u017Ebenice jo\\u0161 se obra\\u0111uje. Listu narud\\u017Ebenica mo\\u017Eete obnoviti ru\\u010Dno.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=Naziv dobavlja\\u010Da\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=Adresa naru\\u010Divanja\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=Profitni centar\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Odobri\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Odbij\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Proslijedi\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Otka\\u017Ei\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=Bajt\n\n#YMSG: File Size Unit\nFileSize.Bytes=Bajtovi\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Datoteka je prevelika\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Danas\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=Prije 1 dan\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} dana prije\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=U\\u010Ditavanje...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Stavke trenutno nisu raspolo\\u017Eive\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_hu.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Megrendel\\u00E9sek ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Megrendel\\u00E9s\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=Megrendel\\u00E9s\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=Sz\\u00E1ll\\u00EDt\\u00E1si d\\u00E1tum\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=Gy\\u00E1r\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=Vev\\u0151\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=N\\u00E9v\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=Fizet\\u00E9si felt\\u00E9telek\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=V\\u00E1llalat\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=T\\u00F6bbsz\\u00F6r\\u00F6s hozz\\u00E1rendel\\u00E9s\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=F\\u0151k\\u00F6nyvi sz\\u00E1mla\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=Sz\\u00E1zal\\u00E9k\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=Objektumok\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=K\\u00F6lts\\u00E9ghely\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=PST-elem\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=H\\u00E1l\\u00F3zat\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=Rendel\\u00E9s\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=Vev\\u0151i rendel\\u00E9s\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=Eszk\\u00F6z\n\n#XFLD: \nview.PurchaseOrder.subtotal=R\\u00E9sz\\u00F6sszeg\n\n#XFLD: \nview.PurchaseOrder.quantity=Mennyis\\u00E9g\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=T\\u00E9telt\\u00EDpus\n\n#XTIT: Header text of Master List\nview.Master.title=Megrendel\\u00E9sek ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=\\u00C1r r\\u00E9szletei\n\n#XFLD: \nview.PurchaseOrder.notes=Megjegyz\\u00E9sek\n\n#XFLD: \nview.PurchaseOrder.attachments=Mell\\u00E9kletek\n\n#XFLD: \nview.PurchaseOrder.delivery=Sz\\u00E1ll\\u00EDt\\u00E1s\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=Sz\\u00E1ll\\u00EDt\\u00E1s d\\u00E1tuma\n\n#XFLD: \nview.PurchaseOrder.material=Anyag\n\n#XFLD: \nview.PurchaseOrder.materialGroup=Anyagcsoport\n\n#XFLD: \nview.PurchaseOrder.serviceLines=Szolg\\u00E1ltat\\u00E1s sorai\n\n#XFLD: \nview.PurchaseOrder.limit=Limit\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=\\u00C1raz\\u00E1si kond\\u00EDci\\u00F3k\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=/\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=Limit \\u00E9rt\\u00E9ke\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=V\\u00E1rt \\u00E9rt\\u00E9k\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=Korl\\u00E1tlan\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=Inform\\u00E1ci\\u00F3k\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=Kont\\u00EDroz\\u00E1s\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=Kont\\u00EDroz\\u00E1s\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=Le\\u00EDr\\u00E1s\n\n#XTIT: Application name\napp.Identity=Megrendel\\u00E9sek enged\\u00E9lyez\\u00E9se\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Megrendel\\u00E9sek enged\\u00E9lyez\\u00E9se\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=Szolg\\u00E1ltat\\u00E1s\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=\\u00E9s k\\u00E9s\\u0151bb\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=T\\u00E9telek ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=Szolg\\u00E1ltat\\u00E1s sorai ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=Z\\u00E1rolt\n\n#XTIT: Title of Items Page\nview.ItemDetails.title={0}/{1} t\\u00E9tel\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title={0} szolg\\u00E1ltat\\u00E1ssor - {1} - {2} t\\u00E9tel - {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title={0}/{1} t\\u00E9tel - limit \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=Kateg\\u00F3ria\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=Nincs hozz\\u00E1rendelve\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=Ismeretlen\n\n#XFLD: Components\nview.PurchaseOrder.components=Komponensek\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=B\\u00E9rfeldolgoz\\u00E1s\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=Norm\\u00E1l\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=H\\u00E1romsz\\u00F6g\\u00FCgylet\n\n#XFLD: Return\nview.PurchaseOrder.return=Vissz\\u00E1rut\\u00E9tel\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=Konszign\\u00E1ci\\u00F3\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=Kond\\u00EDci\\u00F3\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=\\u00C1r\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 t\\u00E9tel\n\n#XFLD: No items\nview.PurchaseOrder.noItem=Nincs t\\u00E9tel\n\n#XFLD\nview.PurchaseOrder.title=Megrendel\\u00E9s\n\n#XFLD\nview.PurchaseOrder.substituted=Helyettes -\n\n#XFLD\nview.PurchaseOrder.forwarded=Tov\\u00E1bb\\u00EDtotta\\:\n\n#XFLD\nview.PurchaseOrder.name=N\\u00E9v\n\n#XFLD\nview.PurchaseOrder.address=C\\u00EDm\n\n#YMSG\ndialog.question.approve=Enged\\u00E9lyezi a k\\u00F6vetkez\\u0151 \\u00E1ltal bek\\u00FCld\\u00F6tt megrendel\\u00E9st\\: {0}?\n\n#YMSG\ndialog.question.reject=Elutas\\u00EDtja a k\\u00F6vetkez\\u0151 \\u00E1ltal bek\\u00FCld\\u00F6tt megrendel\\u00E9st\\: {0}?\n\n#YMSG\ndialog.success.approve=Megrendel\\u00E9s enged\\u00E9lyezve\n\n#YMSG\ndialog.success.reject=Megrendel\\u00E9s elutas\\u00EDtva\n\n#YMSG\ndialog.success.forward=Megrendel\\u00E9s tov\\u00E1bb\\u00EDtva\\: {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Megjegyz\\u00E9s hozz\\u00E1ad\\u00E1sa (nem k\\u00F6telez\\u0151)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Enged\\u00E9lyez\\u00E9s\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Elutas\\u00EDt\\u00E1s\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=Sz\\u00E1ll\\u00EDt\\u00F3\n\n#XFLD: Employee header label\nBussinessCard.Employee=Dolgoz\\u00F3\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=E megrendel\\u00E9s j\\u00F3v\\u00E1hagy\\u00E1sa vagy elutas\\u00EDt\\u00E1sa m\\u00E9g feldolgoz\\u00E1s alatt \\u00E1ll. Megpr\\u00F3b\\u00E1lhatja manu\\u00E1lisan friss\\u00EDteni a megrendel\\u00E9slist\\u00E1t.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=Sz\\u00E1ll\\u00EDt\\u00F3 neve\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=Rendel\\u00E9si c\\u00EDm\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=Profit center\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Enged\\u00E9lyez\\u00E9s\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Elutas\\u00EDt\\u00E1s\n\n#XBUT: Button for forward action\nXBUT_FORWARD=\\u00C1tir\\u00E1ny\\u00EDt\\u00E1s\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=M\\u00E9gse\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=B\\u00E1jt\n\n#YMSG: File Size Unit\nFileSize.Bytes=B\\u00E1jt\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=A f\\u00E1jl t\\u00FAl nagy\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Ma\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 napja\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} napja\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Bet\\u00F6lt\\u00E9s...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Jelenleg nem \\u00E1ll rendelkez\\u00E9sre t\\u00E9tel\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_it.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Ordini di acquisto ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Ordine di acquisto\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=Ordine di acquisto\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=Data di consegna\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=Divisione\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=Cliente\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=Nome\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=Condizioni di pagamento\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=Societ\\u00E0\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=Attribuzioni multiple\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=Conto Co.Ge.\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=Percentuale\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=Oggetti\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=Centro di costo\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=Elemento WBS\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=Network\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=Ordine\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=Ordine di vendita\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=Cespite\n\n#XFLD: \nview.PurchaseOrder.subtotal=Totale parziale\n\n#XFLD: \nview.PurchaseOrder.quantity=Quantit\\u00E0\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=Categoria di posizione\n\n#XTIT: Header text of Master List\nview.Master.title=Ordini di acquisto ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=Dettagli prezzo\n\n#XFLD: \nview.PurchaseOrder.notes=Note\n\n#XFLD: \nview.PurchaseOrder.attachments=Allegati\n\n#XFLD: \nview.PurchaseOrder.delivery=Consegna\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=Data di consegna\n\n#XFLD: \nview.PurchaseOrder.material=Materiale\n\n#XFLD: \nview.PurchaseOrder.materialGroup=Gruppo merci\n\n#XFLD: \nview.PurchaseOrder.serviceLines=Righe prestazione di servizio\n\n#XFLD: \nview.PurchaseOrder.limit=Limite\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=Condizioni prezzo\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=per\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=Valore limite\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=Valore previsto\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=Illimitato\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=Informazioni\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=Contabilizzazione\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=Contabilizzazione\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=Descrizione\n\n#XTIT: Application name\napp.Identity=Approva ordini di acquisto\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Approva ordini di acquisto\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=Servizio\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=e successivi\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=Posizioni ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=Righe della prestazione di servizio ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=Bloccato\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=Posizione {0} di {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Riga prestazione di servizio {0} di {1} - Posizione {2} di {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Posizione {0} di {1} - Limite \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=Categoria\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=Non attribuito\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=Sconosciuto\n\n#XFLD: Components\nview.PurchaseOrder.components=Componenti\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=Lavorazione esterna\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=Standard\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=Conto terzi\n\n#XFLD: Return\nview.PurchaseOrder.return=Posizione resi\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=Conto deposito\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=Condizione\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=Prezzo\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 posizione\n\n#XFLD: No items\nview.PurchaseOrder.noItem=Nessuna posizione\n\n#XFLD\nview.PurchaseOrder.title=Ordine di acquisto\n\n#XFLD\nview.PurchaseOrder.substituted=Sostituto di\n\n#XFLD\nview.PurchaseOrder.forwarded=Inoltrato da\n\n#XFLD\nview.PurchaseOrder.name=Nome\n\n#XFLD\nview.PurchaseOrder.address=Indirizzo\n\n#YMSG\ndialog.question.approve=Approvare l\'\'ordine di acquisto inviato da {0}?\n\n#YMSG\ndialog.question.reject=Rifiutare l\'\'ordine di acquisto inviato da {0}?\n\n#YMSG\ndialog.success.approve=Ordine di acquisto approvato\n\n#YMSG\ndialog.success.reject=Ordine di acquisto rifiutato\n\n#YMSG\ndialog.success.forward=Ordine di acquisto inoltrato a {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Aggiungi nota (facoltativo)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Approva\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Rifiuta\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=Fornitore\n\n#XFLD: Employee header label\nBussinessCard.Employee=Dipendente\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=L\'approvazione o rifiuto dell\'ordine d\'acquisto \\u00E8 ancora in corso; la lista di ordini \\u00E8 aggiornabile manualmente.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=Nome fornitore\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=Indirizzo ordine d\'acquisto\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=Profit center\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Approva\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Rifiuta\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Inoltra\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Annulla\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=Byte\n\n#YMSG: File Size Unit\nFileSize.Bytes=Bytes\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Il file \\u00E8 troppo grande\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Oggi\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 giorno fa\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} giorni fa\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=In caricamento...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Nessuna posizione attualmente disponibile\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_iw.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=\\u05D4\\u05D6\\u05DE\\u05E0\\u05D5\\u05EA \\u05E8\\u05DB\\u05E9 ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=\\u05D4\\u05D6\\u05DE\\u05E0\\u05EA \\u05E8\\u05DB\\u05E9\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=\\u05D4\\u05D6\\u05DE\\u05E0\\u05EA \\u05E8\\u05DB\\u05E9\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D0\\u05E1\\u05E4\\u05E7\\u05D4\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=\\u05D0\\u05EA\\u05E8\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=\\u05DC\\u05E7\\u05D5\\u05D7\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=\\u05E9\\u05DD\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=\\u05EA\\u05E0\\u05D0\\u05D9 \\u05EA\\u05E9\\u05DC\\u05D5\\u05DD\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=\\u05E7\\u05D5\\u05D3 \\u05D7\\u05D1\\u05E8\\u05D4\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=\\u05D4\\u05E7\\u05E6\\u05D0\\u05D5\\u05EA \\u05DE\\u05E8\\u05D5\\u05D1\\u05D5\\u05EA\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=\\u05D7\\u05E9\\u05D1\\u05D5\\u05DF \\u05E1\\u05E4\\u05E8 \\u05D7\\u05E9\\u05D1\\u05D5\\u05E0\\u05D5\\u05EA \\u05E8\\u05D0\\u05E9\\u05D9\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=\\u05E9\\u05EA\\u05E3\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=\\u05D0\\u05D5\\u05D1\\u05D9\\u05D9\\u05E7\\u05D8\\u05D9\\u05DD\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=\\u05DE\\u05E8\\u05DB\\u05D6 \\u05E2\\u05DC\\u05D5\\u05EA\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=\\u05D0\\u05DC\\u05DE\\u05E0\\u05D8 WBS\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=\\u05E8\\u05E9\\u05EA\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=\\u05D4\\u05D6\\u05DE\\u05E0\\u05D4\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=\\u05D4\\u05D6\\u05DE\\u05E0\\u05EA \\u05DC\\u05E7\\u05D5\\u05D7\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=\\u05E0\\u05DB\\u05E1\n\n#XFLD: \nview.PurchaseOrder.subtotal=\\u05E1\\u05D9\\u05DB\\u05D5\\u05DD \\u05D1\\u05D9\\u05E0\\u05D9\\u05D9\\u05DD\n\n#XFLD: \nview.PurchaseOrder.quantity=\\u05DB\\u05DE\\u05D5\\u05EA\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=\\u05E7\\u05D8\\u05D2\\u05D5\\u05E8\\u05D9\\u05D9\\u05EA \\u05E4\\u05E8\\u05D9\\u05D8\n\n#XTIT: Header text of Master List\nview.Master.title=\\u05D4\\u05D6\\u05DE\\u05E0\\u05D5\\u05EA \\u05E8\\u05DB\\u05E9 ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=\\u05E4\\u05E8\\u05D8\\u05D9 \\u05DE\\u05D7\\u05D9\\u05E8\n\n#XFLD: \nview.PurchaseOrder.notes=\\u05D4\\u05E2\\u05E8\\u05D5\\u05EA\n\n#XFLD: \nview.PurchaseOrder.attachments=\\u05E7\\u05D1\\u05E6\\u05D9\\u05DD \\u05DE\\u05E6\\u05D5\\u05E8\\u05E4\\u05D9\\u05DD\n\n#XFLD: \nview.PurchaseOrder.delivery=\\u05D0\\u05E1\\u05E4\\u05E7\\u05D4\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=\\u05D0\\u05E1\\u05E4\\u05E7\\u05D4 \\u05D1\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\n\n#XFLD: \nview.PurchaseOrder.material=\\u05D7\\u05D5\\u05DE\\u05E8\n\n#XFLD: \nview.PurchaseOrder.materialGroup=\\u05E7\\u05D1\\u05D5\\u05E6\\u05EA \\u05D7\\u05D5\\u05DE\\u05E8\\u05D9\\u05DD\n\n#XFLD: \nview.PurchaseOrder.serviceLines=\\u05E9\\u05D5\\u05E8\\u05D5\\u05EA \\u05E9\\u05D9\\u05E8\\u05D5\\u05EA\n\n#XFLD: \nview.PurchaseOrder.limit=\\u05D2\\u05D1\\u05D5\\u05DC\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=\\u05EA\\u05E0\\u05D0\\u05D9 \\u05D4\\u05DE\\u05D7\\u05E8\\u05D4\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=\\u05DC\\u05DB\\u05DC\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=\\u05E2\\u05E8\\u05DA \\u05D4\\u05D2\\u05D1\\u05DC\\u05D4\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=\\u05E2\\u05E8\\u05DA \\u05E6\\u05E4\\u05D5\\u05D9\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=\\u05D1\\u05DC\\u05EA\\u05D9 \\u05DE\\u05D5\\u05D2\\u05D1\\u05DC\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=\\u05DE\\u05D9\\u05D3\\u05E2\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=\\u05D4\\u05E7\\u05E6\\u05D0\\u05EA \\u05D7\\u05E9\\u05D1\\u05D5\\u05DF\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=\\u05D4\\u05E7\\u05E6\\u05D0\\u05EA \\u05D7\\u05E9\\u05D1\\u05D5\\u05DF\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=\\u05EA\\u05D9\\u05D0\\u05D5\\u05E8\n\n#XTIT: Application name\napp.Identity=\\u05D0\\u05E9\\u05E8 \\u05D4\\u05D6\\u05DE\\u05E0\\u05D5\\u05EA \\u05E8\\u05DB\\u05E9\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u05D0\\u05E9\\u05E8 \\u05D4\\u05D6\\u05DE\\u05E0\\u05D5\\u05EA \\u05E8\\u05DB\\u05E9\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=\\u05E9\\u05D9\\u05E8\\u05D5\\u05EA\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=\\u05D5\\u05DE\\u05D0\\u05D5\\u05D7\\u05E8 \\u05D9\\u05D5\\u05EA\\u05E8\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=\\u05E4\\u05E8\\u05D9\\u05D8\\u05D9\\u05DD ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=\\u05E9\\u05D5\\u05E8\\u05D5\\u05EA \\u05E9\\u05D9\\u05E8\\u05D5\\u05EA ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=\\u05D7\\u05E1\\u05D5\\u05DD\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=\\u05E4\\u05E8\\u05D9\\u05D8 {0} \\u05DE\\u05EA\\u05D5\\u05DA {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=\\u05E9\\u05D5\\u05E8\\u05EA \\u05E9\\u05D9\\u05E8\\u05D5\\u05EA {0} \\u05DE\\u05EA\\u05D5\\u05DA {1} - \\u05E4\\u05E8\\u05D9\\u05D8 {2} \\u05DE\\u05EA\\u05D5\\u05DA {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=\\u05E4\\u05E8\\u05D9\\u05D8 {0} \\u05DE\\u05EA\\u05D5\\u05DA {1} - \\u05D4\\u05D2\\u05D1\\u05DC\\u05D4 \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=\\u05E7\\u05D8\\u05D2\\u05D5\\u05E8\\u05D9\\u05D4\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=\\u05DC\\u05D0 \\u05DE\\u05D5\\u05E7\\u05E6\\u05D4\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=\\u05DC\\u05D0 \\u05D9\\u05D3\\u05D5\\u05E2\n\n#XFLD: Components\nview.PurchaseOrder.components=\\u05E8\\u05DB\\u05D9\\u05D1\\u05D9\\u05DD\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=\\u05E7\\u05D1\\u05DC\\u05E0\\u05D5\\u05EA \\u05DE\\u05E9\\u05E0\\u05D4\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=\\u05EA\\u05E7\\u05E0\\u05D9\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=\\u05E6\\u05D3 \\u05E9\\u05DC\\u05D9\\u05E9\\u05D9\n\n#XFLD: Return\nview.PurchaseOrder.return=\\u05E4\\u05E8\\u05D9\\u05D8 \\u05D4\\u05D7\\u05D6\\u05E8\\u05D5\\u05EA\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=\\u05DE\\u05E9\\u05D2\\u05D5\\u05E8\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=\\u05EA\\u05E0\\u05D0\\u05D9\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=\\u05DE\\u05D7\\u05D9\\u05E8\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=\\u05E4\\u05E8\\u05D9\\u05D8 \\u05D0\\u05D7\\u05D3\n\n#XFLD: No items\nview.PurchaseOrder.noItem=\\u05D0\\u05D9\\u05DF \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9\\u05DD\n\n#XFLD\nview.PurchaseOrder.title=\\u05D4\\u05D6\\u05DE\\u05E0\\u05EA \\u05E8\\u05DB\\u05E9\n\n#XFLD\nview.PurchaseOrder.substituted=\\u05DE\\u05D7\\u05DC\\u05D9\\u05E3 \\u05E2\\u05D1\\u05D5\\u05E8\n\n#XFLD\nview.PurchaseOrder.forwarded=\\u05D4\\u05D5\\u05E2\\u05D1\\u05E8 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9\n\n#XFLD\nview.PurchaseOrder.name=\\u05E9\\u05DD\n\n#XFLD\nview.PurchaseOrder.address=\\u05DB\\u05EA\\u05D5\\u05D1\\u05EA\n\n#YMSG\ndialog.question.approve=\\u05D4\\u05D0\\u05DD \\u05DC\\u05D0\\u05E9\\u05E8 \\u05D0\\u05EA \\u05D4\\u05D6\\u05DE\\u05E0\\u05EA \\u05D4\\u05E8\\u05DB\\u05E9 \\u05E9\\u05D4\\u05D5\\u05D2\\u05E9\\u05D4 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 {0}?\n\n#YMSG\ndialog.question.reject=\\u05D4\\u05D0\\u05DD \\u05DC\\u05D3\\u05D7\\u05D5\\u05EA \\u05D0\\u05EA \\u05D4\\u05D6\\u05DE\\u05E0\\u05EA \\u05D4\\u05E8\\u05DB\\u05E9 \\u05E9\\u05D4\\u05D5\\u05D2\\u05E9\\u05D4 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 {0}?\n\n#YMSG\ndialog.success.approve=\\u05D4\\u05D6\\u05DE\\u05E0\\u05EA \\u05D4\\u05E8\\u05DB\\u05E9 \\u05D0\\u05D5\\u05E9\\u05E8\\u05D4\n\n#YMSG\ndialog.success.reject=\\u05D4\\u05D6\\u05DE\\u05E0\\u05EA \\u05D4\\u05E8\\u05DB\\u05E9 \\u05E0\\u05D3\\u05D7\\u05EA\\u05D4\n\n#YMSG\ndialog.success.forward=\\u05D4\\u05D6\\u05DE\\u05E0\\u05EA \\u05D4\\u05E8\\u05DB\\u05E9 \\u05D4\\u05D5\\u05E2\\u05D1\\u05E8\\u05D4 \\u05D0\\u05DC {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05D4\\u05E2\\u05E8\\u05D4 (\\u05D0\\u05D5\\u05E4\\u05E6\\u05D9\\u05D5\\u05E0\\u05D0\\u05DC\\u05D9)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=\\u05D0\\u05E9\\u05E8\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=\\u05D3\\u05D7\\u05D4\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=\\u05E1\\u05E4\\u05E7\n\n#XFLD: Employee header label\nBussinessCard.Employee=\\u05E2\\u05D5\\u05D1\\u05D3\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=\\u05D0\\u05D9\\u05E9\\u05D5\\u05E8 \\u05D0\\u05D5 \\u05D3\\u05D7\\u05D9\\u05D9\\u05D4 \\u05E9\\u05DC \\u05D4\\u05D6\\u05DE\\u05E0\\u05EA \\u05E8\\u05DB\\u05E9 \\u05D6\\u05D5 \\u05E2\\u05D3\\u05D9\\u05D9\\u05DF \\u05D1\\u05EA\\u05D4\\u05DC\\u05D9\\u05DA. \\u05D1\\u05D0\\u05E4\\u05E9\\u05E8\\u05D5\\u05EA\\u05DA \\u05DC\\u05E8\\u05E2\\u05E0\\u05DF \\u05D0\\u05EA \\u05D4\\u05E8\\u05E9\\u05D9\\u05DE\\u05D4 \\u05E9\\u05DC \\u05D4\\u05D6\\u05DE\\u05E0\\u05D5\\u05EA \\u05D4\\u05E8\\u05DB\\u05E9 \\u05D1\\u05D0\\u05D5\\u05E4\\u05DF \\u05D9\\u05D3\\u05E0\\u05D9.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=\\u05E9\\u05DD \\u05E1\\u05E4\\u05E7\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=\\u05DB\\u05EA\\u05D5\\u05D1\\u05EA \\u05D4\\u05D6\\u05DE\\u05E0\\u05D4\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=\\u05DE\\u05E8\\u05DB\\u05D6 \\u05E8\\u05D5\\u05D5\\u05D7\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=\\u05D0\\u05E9\\u05E8\n\n#XBUT: Button for Reject action\nXBUT_REJECT=\\u05D3\\u05D7\\u05D4\n\n#XBUT: Button for forward action\nXBUT_FORWARD=\\u05D4\\u05E2\\u05D1\\u05E8\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=\\u05D1\\u05D8\\u05DC\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=\\u05D1\\u05D9\\u05D9\\u05D8\n\n#YMSG: File Size Unit\nFileSize.Bytes=\\u05D1\\u05D9\\u05D9\\u05D8\\u05D9\\u05DD\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=\\u05E7\\u05D9\\u05DC\\u05D5-\\u05D1\\u05D9\\u05D9\\u05D8\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=\\u05DE\\u05D2\\u05D4\\u05D1\\u05D9\\u05D9\\u05D8\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=\\u05D2\\u05D9\\u05D2\\u05D4-\\u05D1\\u05D9\\u05D9\\u05D8\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=\\u05D8\\u05E8\\u05D4\\u05D1\\u05D9\\u05D9\\u05D8\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=\\u05E4\\u05D8\\u05D4\\u05D1\\u05D9\\u05D9\\u05D8\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=\\u05D0\\u05E7\\u05E1\\u05D4-\\u05D1\\u05D9\\u05D9\\u05D8\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=\\u05D6\\u05D8\\u05D4\\u05D1\\u05D9\\u05D9\\u05D8\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=\\u05D9\\u05D5\\u05D8\\u05D4\\u05D1\\u05D9\\u05D9\\u05D8\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=\\u05E7\\u05D5\\u05D1\\u05E5 \\u05D2\\u05D3\\u05D5\\u05DC \\u05DE\\u05D3\\u05D9\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=\\u05D4\\u05D9\\u05D5\\u05DD\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=\\u05DC\\u05E4\\u05E0\\u05D9 \\u05D9\\u05D5\\u05DD \\u05D0\\u05D7\\u05D3\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=\\u05DC\\u05E4\\u05E0\\u05D9 {0} \\u05D9\\u05DE\\u05D9\\u05DD\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=\\u05D8\\u05D5\\u05E2\\u05DF...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u05D0\\u05D9\\u05DF \\u05DB\\u05E8\\u05D2\\u05E2 \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_ja.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=\\u8CFC\\u8CB7\\u767A\\u6CE8 ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=\\u8CFC\\u8CB7\\u767A\\u6CE8\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=\\u30A4\\u30F3\\u30B3\\u30BF\\u30FC\\u30E0\\u30BA\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=\\u8CFC\\u8CB7\\u767A\\u6CE8\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=\\u7D0D\\u5165\\u65E5\\u4ED8\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=\\u30D7\\u30E9\\u30F3\\u30C8\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=\\u5F97\\u610F\\u5148\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=\\u540D\\u79F0\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=\\u652F\\u6255\\u6761\\u4EF6\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=\\u4F1A\\u793E\\u30B3\\u30FC\\u30C9\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=\\u8907\\u6570\\u5272\\u5F53\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=G/L \\u52D8\\u5B9A\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=\\u30B7\\u30A7\\u30A2\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=\\u30AA\\u30D6\\u30B8\\u30A7\\u30AF\\u30C8\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=\\u539F\\u4FA1\\u30BB\\u30F3\\u30BF\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=WBS \\u8981\\u7D20\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=\\u30CD\\u30C3\\u30C8\\u30EF\\u30FC\\u30AF\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=\\u767A\\u6CE8\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=\\u53D7\\u6CE8\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=\\u8CC7\\u7523\n\n#XFLD: \nview.PurchaseOrder.subtotal=\\u5C0F\\u8A08\n\n#XFLD: \nview.PurchaseOrder.quantity=\\u6570\\u91CF\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=\\u660E\\u7D30\\u30AB\\u30C6\\u30B4\\u30EA\n\n#XTIT: Header text of Master List\nview.Master.title=\\u8CFC\\u8CB7\\u767A\\u6CE8 ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=\\u4FA1\\u683C\\u8A73\\u7D30\n\n#XFLD: \nview.PurchaseOrder.notes=\\u30E1\\u30E2\n\n#XFLD: \nview.PurchaseOrder.attachments=\\u6DFB\\u4ED8\\u6587\\u66F8\n\n#XFLD: \nview.PurchaseOrder.delivery=\\u7D0D\\u5165\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=\\u7D0D\\u5165\\u65E5\\u4ED8\n\n#XFLD: \nview.PurchaseOrder.material=\\u54C1\\u76EE\n\n#XFLD: \nview.PurchaseOrder.materialGroup=\\u54C1\\u76EE\\u30B0\\u30EB\\u30FC\\u30D7\n\n#XFLD: \nview.PurchaseOrder.serviceLines=\\u30B5\\u30FC\\u30D3\\u30B9\\u884C\n\n#XFLD: \nview.PurchaseOrder.limit=\\u5236\\u9650\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=\\u4FA1\\u683C\\u8A2D\\u5B9A\\u6761\\u4EF6\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=/\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=\\u9650\\u5EA6\\u984D\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=\\u898B\\u8FBC\\u91D1\\u984D\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=\\u7121\\u5236\\u9650\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=\\u60C5\\u5831\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=\\u52D8\\u5B9A\\u8A2D\\u5B9A\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=\\u52D8\\u5B9A\\u8A2D\\u5B9A\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=\\u30C6\\u30AD\\u30B9\\u30C8\n\n#XTIT: Application name\napp.Identity=\\u8CFC\\u8CB7\\u767A\\u6CE8\\u627F\\u8A8D\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u8CFC\\u8CB7\\u767A\\u6CE8\\u627F\\u8A8D\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=\\u30B5\\u30FC\\u30D3\\u30B9\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=\\u4EE5\\u964D\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=\\u660E\\u7D30 ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=\\u30B5\\u30FC\\u30D3\\u30B9\\u884C ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=\\u30D6\\u30ED\\u30C3\\u30AF\\u6E08\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=\\u660E\\u7D30 {0}/{1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=\\u30B5\\u30FC\\u30D3\\u30B9\\u884C {0}/{1} - \\u660E\\u7D30 {2}/{3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=\\u660E\\u7D30 {0}/{1} - \\u5236\\u9650 \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=\\u30AB\\u30C6\\u30B4\\u30EA\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=\\u672A\\u5272\\u5F53\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=\\u672A\\u5B9A\\u7FA9\n\n#XFLD: Components\nview.PurchaseOrder.components=\\u69CB\\u6210\\u54C1\\u76EE\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=\\u5916\\u6CE8\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=\\u6A19\\u6E96\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=\\u4ED5\\u5165\\u5148\\u76F4\\u9001\n\n#XFLD: Return\nview.PurchaseOrder.return=\\u8FD4\\u54C1\\u660E\\u7D30\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=\\u53D7\\u8A17\\u54C1/\\u9810\\u8A17\\u54C1\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=\\u6761\\u4EF6\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=\\u4FA1\\u683C\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 \\u660E\\u7D30\n\n#XFLD: No items\nview.PurchaseOrder.noItem=\\u660E\\u7D30\\u306A\\u3057\n\n#XFLD\nview.PurchaseOrder.title=\\u8CFC\\u8CB7\\u767A\\u6CE8\n\n#XFLD\nview.PurchaseOrder.substituted=\\u6B21\\u306E\\u627F\\u8A8D\\u8005\\u306E\\u4EE3\\u884C\\:\n\n#XFLD\nview.PurchaseOrder.forwarded=\\u8EE2\\u9001\\u8005\n\n#XFLD\nview.PurchaseOrder.name=\\u540D\\u524D\n\n#XFLD\nview.PurchaseOrder.address=\\u4F4F\\u6240\n\n#YMSG\ndialog.question.approve={0} \\u304B\\u3089\\u9001\\u4FE1\\u3055\\u308C\\u305F\\u8CFC\\u8CB7\\u767A\\u6CE8\\u3092\\u627F\\u8A8D\\u3057\\u307E\\u3059\\u304B\\u3002\n\n#YMSG\ndialog.question.reject={0} \\u304B\\u3089\\u9001\\u4FE1\\u3055\\u308C\\u305F\\u8CFC\\u8CB7\\u767A\\u6CE8\\u3092\\u5374\\u4E0B\\u3057\\u307E\\u3059\\u304B\\u3002\n\n#YMSG\ndialog.success.approve=\\u8CFC\\u8CB7\\u767A\\u6CE8\\u304C\\u627F\\u8A8D\\u3055\\u308C\\u307E\\u3057\\u305F\n\n#YMSG\ndialog.success.reject=\\u8CFC\\u8CB7\\u767A\\u6CE8\\u304C\\u5374\\u4E0B\\u3055\\u308C\\u307E\\u3057\\u305F\n\n#YMSG\ndialog.success.forward=\\u8CFC\\u8CB7\\u767A\\u6CE8\\u304C {0} \\u306B\\u8EE2\\u9001\\u3055\\u308C\\u307E\\u3057\\u305F\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=\\u30E1\\u30E2\\u8FFD\\u52A0 (\\u30AA\\u30D7\\u30B7\\u30E7\\u30F3)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=\\u627F\\u8A8D\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=\\u5374\\u4E0B\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=\\u30B5\\u30D7\\u30E9\\u30A4\\u30E4\n\n#XFLD: Employee header label\nBussinessCard.Employee=\\u5F93\\u696D\\u54E1\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=\\u3053\\u306E\\u8CFC\\u8CB7\\u767A\\u6CE8\\u306E\\u627F\\u8A8D\\u307E\\u305F\\u306F\\u5374\\u4E0B\\u306F\\u73FE\\u5728\\u3082\\u51E6\\u7406\\u4E2D\\u3067\\u3059\\u3002\\u8CFC\\u8CB7\\u767A\\u6CE8\\u306E\\u4E00\\u89A7\\u3092\\u30DE\\u30CB\\u30E5\\u30A2\\u30EB\\u3067\\u30EA\\u30D5\\u30EC\\u30C3\\u30B7\\u30E5\\u3059\\u308B\\u3053\\u3068\\u304C\\u3067\\u304D\\u307E\\u3059\\u3002\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=\\u30B5\\u30D7\\u30E9\\u30A4\\u30E4\\u540D\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=\\u8CFC\\u8CB7\\u767A\\u6CE8\\u5148\\u4F4F\\u6240\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=\\u5229\\u76CA\\u30BB\\u30F3\\u30BF\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=\\u627F\\u8A8D\n\n#XBUT: Button for Reject action\nXBUT_REJECT=\\u5374\\u4E0B\n\n#XBUT: Button for forward action\nXBUT_FORWARD=\\u8EE2\\u9001\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=\\u4E2D\\u6B62\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=\\u30D0\\u30A4\\u30C8\n\n#YMSG: File Size Unit\nFileSize.Bytes=\\u30D0\\u30A4\\u30C8\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=\\u30D5\\u30A1\\u30A4\\u30EB\\u30B5\\u30A4\\u30BA\\u304C\\u5927\\u304D\\u3059\\u304E\\u307E\\u3059\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=\\u672C\\u65E5\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 \\u65E5\\u524D\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} \\u65E5\\u524D\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=\\u30ED\\u30FC\\u30C9\\u4E2D...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u73FE\\u5728\\u5229\\u7528\\u3067\\u304D\\u308B\\u30A2\\u30A4\\u30C6\\u30E0\\u306F\\u3042\\u308A\\u307E\\u305B\\u3093\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_no.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Innkj\\u00F8psordrer ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Innkj\\u00F8psordre\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=Innkj\\u00F8psordre\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=Leveringsdato\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=Fabrikk\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=Kunde\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=Navn\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=Betalingsvilk\\u00E5r\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=Firmakode\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=Multitilordninger\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=Artskonto\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=Andel\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=Objekter\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=Kostnadssted\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=WBS-element\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=Nettverk\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=Ordre\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=Kundeordre\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=Anleggsmiddel\n\n#XFLD: \nview.PurchaseOrder.subtotal=Delsum\n\n#XFLD: \nview.PurchaseOrder.quantity=Kvantum\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=Posisjonskategori\n\n#XTIT: Header text of Master List\nview.Master.title=Innkj\\u00F8psordrer ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=Prisdetaljer\n\n#XFLD: \nview.PurchaseOrder.notes=Merknader\n\n#XFLD: \nview.PurchaseOrder.attachments=Vedlegg\n\n#XFLD: \nview.PurchaseOrder.delivery=Levering\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=Levering den\n\n#XFLD: \nview.PurchaseOrder.material=Material\n\n#XFLD: \nview.PurchaseOrder.materialGroup=Varegruppe\n\n#XFLD: \nview.PurchaseOrder.serviceLines=Tjenestelinjer\n\n#XFLD: \nview.PurchaseOrder.limit=Grense\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=Prisbetingelser\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=per\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=Grenseverdi\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=Forventet verdi\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=Ubegrenset\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=Informasjon\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=Kontering\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=Kontering\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=Beskrivelse\n\n#XTIT: Application name\napp.Identity=Godkjenn innkj\\u00F8psordrer\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Godkjenn innkj\\u00F8psordrer\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=Tjeneste\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=og senere\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=Varer ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=Tjenestelinjer ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=Sperret\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=Vare {0} av {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Tjenestelinje {0} av {1} - tjeneste {2} av {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Vare {0} av {1} - grense \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=Kategori\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=Ikke tilordnet\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=Ukjent\n\n#XFLD: Components\nview.PurchaseOrder.components=Komponenter\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=Leieproduksjon\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=Normal\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=Tredjepartsordrebehandling\n\n#XFLD: Return\nview.PurchaseOrder.return=Returposisjon\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=Konsignasjon\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=Betingelse\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=Pris\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=\\u00C9n posisjon\n\n#XFLD: No items\nview.PurchaseOrder.noItem=Ingen pos.\n\n#XFLD\nview.PurchaseOrder.title=Innkj\\u00F8psordre\n\n#XFLD\nview.PurchaseOrder.substituted=Stedfortreder for\n\n#XFLD\nview.PurchaseOrder.forwarded=Videresendt av\n\n#XFLD\nview.PurchaseOrder.name=Navn\n\n#XFLD\nview.PurchaseOrder.address=Adresse\n\n#YMSG\ndialog.question.approve=Godkjenne innkj\\u00F8psordren fra {0}?\n\n#YMSG\ndialog.question.reject=Avvise innkj\\u00F8psordren fra {0}?\n\n#YMSG\ndialog.success.approve=Innkj\\u00F8psordre godkjent\n\n#YMSG\ndialog.success.reject=Innkj\\u00F8psordre avvist\n\n#YMSG\ndialog.success.forward=Innkj\\u00F8psordren er videresendt til {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Tilf\\u00F8y merknad (valgfritt)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Godkjenn\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Avvis\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=Leverand\\u00F8r\n\n#XFLD: Employee header label\nBussinessCard.Employee=Medarbeider\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Godkjenning eller avvisning av denne innkj\\u00F8psordren p\\u00E5g\\u00E5r fortsatt. Du kan oppdatere listen over innkj\\u00F8psordrer manuelt.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=Leverand\\u00F8rnavn\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=Bestillingsadresse\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=Profit center\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Godkjenn\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Avvis\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Viderekoble\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Avbryt\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=Byte\n\n#YMSG: File Size Unit\nFileSize.Bytes=Byte\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=KB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Filen er for stor\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=I dag\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=For \\u00E9n dag siden\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} dager siden\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Laster ...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Ingen elementer er for \\u00F8yeblikket tilgjengelige\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_pl.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Zam\\u00F3wienia ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Zam\\u00F3wienie\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=Zam\\u00F3wienie\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=Data dostawy\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=Zak\\u0142ad\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=Klient\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=Nazwa\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=Warunki p\\u0142atno\\u015Bci\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=Jednostka gospodarcza\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=Kilka przypisa\\u0144\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=Konto KG\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=Udzia\\u0142\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=Obiekty\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=Miejsce powstawania koszt\\u00F3w\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=Element PSP\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=Sie\\u0107\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=Zlecenie\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=Zlecenie klienta\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=Aktywa\n\n#XFLD: \nview.PurchaseOrder.subtotal=Suma cz\\u0119\\u015Bciowa\n\n#XFLD: \nview.PurchaseOrder.quantity=Ilo\\u015B\\u0107\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=Typ pozycji\n\n#XTIT: Header text of Master List\nview.Master.title=Zam\\u00F3wienia ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=Szczeg\\u00F3\\u0142y ceny\n\n#XFLD: \nview.PurchaseOrder.notes=Notatki\n\n#XFLD: \nview.PurchaseOrder.attachments=Za\\u0142\\u0105czniki\n\n#XFLD: \nview.PurchaseOrder.delivery=Dostawa\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=Dostawa dnia\n\n#XFLD: \nview.PurchaseOrder.material=Materia\\u0142\n\n#XFLD: \nview.PurchaseOrder.materialGroup=Grupa materia\\u0142owa\n\n#XFLD: \nview.PurchaseOrder.serviceLines=Linie us\\u0142ugi\n\n#XFLD: \nview.PurchaseOrder.limit=Limit\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=Warunki dotycz\\u0105ce cen\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=na\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=Warto\\u015B\\u0107 graniczna\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=Warto\\u015B\\u0107 oczekiwana\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=Nieograniczone\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=Informacja\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=Dekretacja\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=Dekretacja\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=Opis\n\n#XTIT: Application name\napp.Identity=Zatwierdzanie zam\\u00F3wie\\u0144\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Zatwierdzanie zam\\u00F3wie\\u0144\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=Us\\u0142uga\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=i p\\u00F3\\u017Aniej\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=Pozycje ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=Linie us\\u0142ugi ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=Zablokowane\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=Pozycja {0} z {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Linia us\\u0142ugi {0} z {1} - pozycja {2} z {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Pozycja {0} z {1} - limit \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=Kategoria\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=Nieprzypisane\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=Nieznane\n\n#XFLD: Components\nview.PurchaseOrder.components=Sk\\u0142adniki\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=Podwykonawstwo\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=Standard\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=Strona trzecia\n\n#XFLD: Return\nview.PurchaseOrder.return=Pozycja zwrotu\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=Konsygnacja\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=Warunek\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=Cena\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 pozycja\n\n#XFLD: No items\nview.PurchaseOrder.noItem=Brak pozycji\n\n#XFLD\nview.PurchaseOrder.title=Zam\\u00F3wienie\n\n#XFLD\nview.PurchaseOrder.substituted=Zast\\u0119pstwo za\n\n#XFLD\nview.PurchaseOrder.forwarded=Przekazane przez\n\n#XFLD\nview.PurchaseOrder.name=Nazwa\n\n#XFLD\nview.PurchaseOrder.address=Adres\n\n#YMSG\ndialog.question.approve=Czy zatwierdzi\\u0107 zam\\u00F3wienie wys\\u0142ane przez {0}?\n\n#YMSG\ndialog.question.reject=Czy odrzuci\\u0107 zam\\u00F3wienie wys\\u0142ane przez {0}?\n\n#YMSG\ndialog.success.approve=Zatwierdzono zam\\u00F3wienie\n\n#YMSG\ndialog.success.reject=Odrzucono zam\\u00F3wienie\n\n#YMSG\ndialog.success.forward=Zam\\u00F3wienie przekazano do {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Dodaj notatk\\u0119 (opcjonalne)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Zatwierdzanie\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Odrzucanie\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=Dostawca\n\n#XFLD: Employee header label\nBussinessCard.Employee=Pracownik\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Zatwierdzanie lub odrzucanie tego zam\\u00F3wienia jest nadal w toku. Mo\\u017Cesz r\\u0119cznie od\\u015Bwie\\u017Cy\\u0107 list\\u0119 zam\\u00F3wie\\u0144.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=Nazwa dostawcy\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=Adres zam\\u00F3wienia\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=Centrum zysku\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Zatwierd\\u017A\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Odrzu\\u0107\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Przeka\\u017C dalej\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Anuluj\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=Bajt\n\n#YMSG: File Size Unit\nFileSize.Bytes=Bajty\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Plik jest za du\\u017Cy\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Dzisiaj\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 dzie\\u0144 temu\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} dni temu\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Wczytywanie...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Obecnie brak dost\\u0119pnych pozycji\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_pt.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Pedidos de compras ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Pedido de compras\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=Pedido de compras\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=Data da transfer\\u00EAncia\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=Centro\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=Cliente\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=Nome\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=Condi\\u00E7\\u00F5es de pagamento\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=Empresa\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=V\\u00E1rias atribui\\u00E7\\u00F5es\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=Conta do Raz\\u00E3o\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=Compartilhar\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=Objetos\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=Centro de custo\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=Elemento PEP\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=Rede\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=Pedido\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=Pedido do cliente\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=Ativo\n\n#XFLD: \nview.PurchaseOrder.subtotal=Subtotal\n\n#XFLD: \nview.PurchaseOrder.quantity=Quantidade\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=Categoria do item\n\n#XTIT: Header text of Master List\nview.Master.title=Pedidos de compras ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=Detalhes de pre\\u00E7o\n\n#XFLD: \nview.PurchaseOrder.notes=Notas\n\n#XFLD: \nview.PurchaseOrder.attachments=Anexos\n\n#XFLD: \nview.PurchaseOrder.delivery=Entrega\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=Fornecimento em\n\n#XFLD: \nview.PurchaseOrder.material=Material\n\n#XFLD: \nview.PurchaseOrder.materialGroup=Grupo de mercadorias\n\n#XFLD: \nview.PurchaseOrder.serviceLines=Linhas de servi\\u00E7o\n\n#XFLD: \nview.PurchaseOrder.limit=Limite\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=Condi\\u00E7\\u00F5es para determina\\u00E7\\u00E3o de pre\\u00E7os\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=por\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=Valor-limite\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=Valor previsto\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=Ilimitado\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=Informa\\u00E7\\u00E3o\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=Classifica\\u00E7\\u00E3o cont\\u00E1bil\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=Classifica\\u00E7\\u00E3o cont\\u00E1bil\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=Descri\\u00E7\\u00E3o\n\n#XTIT: Application name\napp.Identity=Aprovar pedidos de compras\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Aprovar pedidos de compras\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=Servi\\u00E7o\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=e posteriores\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=Itens ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=Linhas de servi\\u00E7o ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=Bloqueado\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=Item {0} de {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Linha de servi\\u00E7o {0} de {1} - Item {2} de {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Item {0} de {1} - Limite \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=Categoria\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=n\\u00E3o atribu\\u00EDdo\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=Desconhecido\n\n#XFLD: Components\nview.PurchaseOrder.components=Componentes\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=Subcontrata\\u00E7\\u00E3o\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=Padr\\u00E3o\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=Fornecimento direto a terceiros\n\n#XFLD: Return\nview.PurchaseOrder.return=Item de devolu\\u00E7\\u00E3o\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=Consigna\\u00E7\\u00E3o\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=Condi\\u00E7\\u00E3o\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=Pre\\u00E7o\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 item\n\n#XFLD: No items\nview.PurchaseOrder.noItem=Nenhum item\n\n#XFLD\nview.PurchaseOrder.title=Pedido de compras\n\n#XFLD\nview.PurchaseOrder.substituted=Substituto para\n\n#XFLD\nview.PurchaseOrder.forwarded=Encaminhado por\n\n#XFLD\nview.PurchaseOrder.name=Nome\n\n#XFLD\nview.PurchaseOrder.address=Endere\\u00E7o\n\n#YMSG\ndialog.question.approve=Aprovar pedido de compras enviado por {0}?\n\n#YMSG\ndialog.question.reject=Rejeitar pedido de compras enviado por {0}?\n\n#YMSG\ndialog.success.approve=Pedido de compras aprovado\n\n#YMSG\ndialog.success.reject=Pedido de compras rejeitado\n\n#YMSG\ndialog.success.forward=Pedido de compras encaminhado para {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Inserir nota (opcional)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Aprovar\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Rejeitar\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=Fornecedor\n\n#XFLD: Employee header label\nBussinessCard.Employee=Funcion\\u00E1rio\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Aprova\\u00E7\\u00E3o ou rejei\\u00E7\\u00E3o deste pedido de compras ainda em processo. Voc\\u00EA pode atualizar a lista de pedidos de compras manualmente.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=Nome do fornecedor\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=Endere\\u00E7o do pedido\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=Centro de lucro\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Aprovar\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Rejeitar\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Encaminhar\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Anular\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=Byte\n\n#YMSG: File Size Unit\nFileSize.Bytes=Bytes\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Arquivo muito grande\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Hoje\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 dia atr\\u00E1s\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} dias atr\\u00E1s\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Carregando...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Nenhum item atualmente dispon\\u00EDvel\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_ro.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Comenzi de aprovizionare ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Comand\\u0103 aprovizionare\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=Comand\\u0103 aprovizionare\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=Dat\\u0103 livrare\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=Unitate logistic\\u0103\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=Client\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=Nume\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=Condi\\u0163ii de plat\\u0103\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=Cod companie\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=Aloc\\u0103ri multiple\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=Cont de CM\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=Partajare\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=Obiecte\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=Centru de cost\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=Element SDA\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=Re\\u0163ea\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=Comand\\u0103\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=Comand\\u0103 de v\\u00E2nz\\u0103ri\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=Imobilizare\n\n#XFLD: \nview.PurchaseOrder.subtotal=Subtotal\n\n#XFLD: \nview.PurchaseOrder.quantity=Cantitate\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=Categorie pozi\\u0163ie\n\n#XTIT: Header text of Master List\nview.Master.title=Comenzi de aprovizionare ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=Detalii pre\\u0163\n\n#XFLD: \nview.PurchaseOrder.notes=Note\n\n#XFLD: \nview.PurchaseOrder.attachments=Anexe\n\n#XFLD: \nview.PurchaseOrder.delivery=Livrare\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=Livrare pe\n\n#XFLD: \nview.PurchaseOrder.material=Material\n\n#XFLD: \nview.PurchaseOrder.materialGroup=Grup materiale\n\n#XFLD: \nview.PurchaseOrder.serviceLines=Linii de serviciu\n\n#XFLD: \nview.PurchaseOrder.limit=Limit\\u0103\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=Condi\\u0163ii de stabilire pre\\u0163\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=per\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=Valoare limit\\u0103\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=Valoare prev\\u0103zut\\u0103\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=Nelimitat\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=Informa\\u0163ii\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=Alocare cont\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=Alocare cont\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=Descriere\n\n#XTIT: Application name\napp.Identity=Aprobare comenzi de aprovizionare\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Aprobare comenzi de aprovizionare\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=Serviciu\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=\\u015Fi ulterior\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=Pozi\\u0163ii ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=Linii de serviciu ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=Blocat\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=Pozi\\u0163ie {0} din {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Linie de serviciu {0} din {1} - Pozi\\u0163ie {2} din {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Pozi\\u0163ie {0} din {1} - limit\\u0103 \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=Categorie\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=Nealocat\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=Necunoscut\n\n#XFLD: Components\nview.PurchaseOrder.components=Componente\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=Subcontractare\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=Standard\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=Livrare direct\\u0103 la ter\\u0163i\n\n#XFLD: Return\nview.PurchaseOrder.return=Pozi\\u0163ie de retururi\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=Custodie\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=Condi\\u0163ie\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=Pre\\u0163\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 pozi\\u0163ie\n\n#XFLD: No items\nview.PurchaseOrder.noItem=F\\u0103r\\u0103 pozi\\u0163ii\n\n#XFLD\nview.PurchaseOrder.title=Comand\\u0103 aprovizionare\n\n#XFLD\nview.PurchaseOrder.substituted=\\u00CEnlocuitor pt.\n\n#XFLD\nview.PurchaseOrder.forwarded=Redirec\\u0163ionat de\n\n#XFLD\nview.PurchaseOrder.name=Nume\n\n#XFLD\nview.PurchaseOrder.address=Adres\\u0103\n\n#YMSG\ndialog.question.approve=Aproba\\u0163i comanda de aprovizionare transmis\\u0103 de {0}?\n\n#YMSG\ndialog.question.reject=Respinge\\u0163i comanda de aprovizionare transmis\\u0103 de {0}?\n\n#YMSG\ndialog.success.approve=Comanda de aprovizionare a fost aprobat\\u0103\n\n#YMSG\ndialog.success.reject=Comanda de aprovizionare a fost respins\\u0103\n\n#YMSG\ndialog.success.forward=Comanda de aprovizionare a fost redirec\\u0163ionat\\u0103 la {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Ad\\u0103ugare not\\u0103 (op\\u0163ional)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Aprobare\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Respingere\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=Furnizor\n\n#XFLD: Employee header label\nBussinessCard.Employee=Angajat\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Aprobarea sau respingerea pt.aceast\\u0103 comand\\u0103 de aprovizionare \\u00EEnc\\u0103 este \\u00EEn curs. Pute\\u0163i \\u00EEmprosp\\u0103ta manual lista de comenzi de aprovizionare.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=Nume furnizor\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=Adres\\u0103 comand\\u0103\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=Centru de profit\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Aprobare\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Respingere\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Redirec\\u0163ionare\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Anulare\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=Byte\n\n#YMSG: File Size Unit\nFileSize.Bytes=Bytes\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Fi\\u015Fierul este prea mare\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Ast\\u0103zi\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=\\u00CEn urm\\u0103 cu 1 zi\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=\\u00CEn urm\\u0103 cu {0} zile\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=\\u00CEnc\\u0103rcare ...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u00CEn prezent nu sunt disponibile pozi\\u0163ii\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_ru.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=\\u0417\\u0430\\u043A\\u0430\\u0437\\u044B \\u043D\\u0430 \\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0443 ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=\\u0417\\u0430\\u043A\\u0430\\u0437 \\u043D\\u0430 \\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0443\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=\\u0418\\u043D\\u043A\\u043E\\u0442\\u0435\\u0440\\u043C\\u0441\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=\\u0417\\u0430\\u043A\\u0430\\u0437 \\u043D\\u0430 \\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0443\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=\\u0414\\u0430\\u0442\\u0430 \\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0438\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=\\u0417\\u0430\\u0432\\u043E\\u0434\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=\\u0418\\u043C\\u044F\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=\\u0423\\u0441\\u043B\\u043E\\u0432\\u0438\\u044F \\u043F\\u043B\\u0430\\u0442\\u0435\\u0436\\u0430\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=\\u0411\\u0430\\u043B\\u0430\\u043D\\u0441\\u043E\\u0432\\u0430\\u044F \\u0435\\u0434\\u0438\\u043D\\u0438\\u0446\\u0430\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=\\u041C\\u043D\\u043E\\u0436\\u0435\\u0441\\u0442\\u0432\\u0435\\u043D\\u043D\\u044B\\u0435 \\u043A\\u043E\\u043D\\u0442\\u0438\\u0440\\u043E\\u0432\\u043A\\u0438\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=\\u041E\\u0441\\u043D\\u043E\\u0432\\u043D\\u043E\\u0439 \\u0441\\u0447\\u0435\\u0442\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=\\u0414\\u043E\\u043B\\u044F\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=\\u041E\\u0431\\u044A\\u0435\\u043A\\u0442\\u044B\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=\\u041C\\u0412\\u0417\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=\\u0421\\u041F\\u041F-\\u044D\\u043B\\u0435\\u043C\\u0435\\u043D\\u0442\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=\\u0421\\u0435\\u0442\\u0435\\u0432\\u043E\\u0439 \\u0433\\u0440\\u0430\\u0444\\u0438\\u043A\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=\\u0417\\u0430\\u043A\\u0430\\u0437\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=\\u0417\\u0430\\u043A\\u0430\\u0437 \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0430\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=\\u0410\\u043A\\u0442\\u0438\\u0432\n\n#XFLD: \nview.PurchaseOrder.subtotal=\\u041F\\u043E\\u0434\\u044B\\u0442\\u043E\\u0433\n\n#XFLD: \nview.PurchaseOrder.quantity=\\u041A\\u043E\\u043B\\u0438\\u0447\\u0435\\u0441\\u0442\\u0432\\u043E\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=\\u0422\\u0438\\u043F \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0438\n\n#XTIT: Header text of Master List\nview.Master.title=\\u0417\\u0430\\u043A\\u0430\\u0437\\u044B \\u043D\\u0430 \\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0443 ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=\\u0421\\u0432\\u0435\\u0434\\u0435\\u043D\\u0438\\u044F \\u043E \\u0446\\u0435\\u043D\\u0435\n\n#XFLD: \nview.PurchaseOrder.notes=\\u041F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u044F\n\n#XFLD: \nview.PurchaseOrder.attachments=\\u0412\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\n\n#XFLD: \nview.PurchaseOrder.delivery=\\u041F\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0430\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=\\u0414\\u0430\\u0442\\u0430 \\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0438\n\n#XFLD: \nview.PurchaseOrder.material=\\u041C\\u0430\\u0442\\u0435\\u0440\\u0438\\u0430\\u043B\n\n#XFLD: \nview.PurchaseOrder.materialGroup=\\u0413\\u0440\\u0443\\u043F\\u043F\\u0430 \\u043C\\u0430\\u0442\\u0435\\u0440\\u0438\\u0430\\u043B\\u043E\\u0432\n\n#XFLD: \nview.PurchaseOrder.serviceLines=\\u0421\\u0442\\u0440\\u043E\\u043A\\u0438 \\u0443\\u0441\\u043B\\u0443\\u0433\n\n#XFLD: \nview.PurchaseOrder.limit=\\u041B\\u0438\\u043C\\u0438\\u0442\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=\\u0423\\u0441\\u043B\\u043E\\u0432\\u0438\\u044F \\u0440\\u0430\\u0441\\u0447\\u0435\\u0442\\u0430 \\u0446\\u0435\\u043D\\u044B\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=\\u0437\\u0430\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=\\u041F\\u0440\\u0435\\u0434\\u0435\\u043B\\u044C\\u043D\\u0430\\u044F \\u0441\\u0442\\u043E\\u0438\\u043C\\u043E\\u0441\\u0442\\u044C\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=\\u041E\\u0436\\u0438\\u0434\\u0430\\u0435\\u043C\\u0430\\u044F \\u0441\\u0442\\u043E\\u0438\\u043C\\u043E\\u0441\\u0442\\u044C\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=\\u0411\\u0435\\u0437 \\u043E\\u0433\\u0440\\u0430\\u043D\\u0438\\u0447\\u0435\\u043D\\u0438\\u044F\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=\\u0418\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=\\u041A\\u043E\\u043D\\u0442\\u0438\\u0440\\u043E\\u0432\\u043A\\u0430\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=\\u041A\\u043E\\u043D\\u0442\\u0438\\u0440\\u043E\\u0432\\u043A\\u0430\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n\n#XTIT: Application name\napp.Identity=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0437\\u0430\\u043A\\u0430\\u0437\\u043E\\u0432\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0437\\u0430\\u043A\\u0430\\u0437\\u043E\\u0432\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=\\u0421\\u0435\\u0440\\u0432\\u0438\\u0441\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=\\u0438 \\u043F\\u043E\\u0437\\u0436\\u0435\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=\\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0438 ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=\\u0421\\u0442\\u0440\\u043E\\u043A\\u0438 \\u0443\\u0441\\u043B\\u0443\\u0433 ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=\\u0411\\u043B\\u043E\\u043A\\u0438\\u0440\\u043E\\u0432\\u0430\\u043D\\u043E\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=\\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F {0} \\u0438\\u0437 {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=\\u0421\\u0442\\u0440\\u043E\\u043A\\u0430 \\u0443\\u0441\\u043B\\u0443\\u0433\\u0438 {0} \\u0438\\u0437 {1} - \\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F {2} \\u0438\\u0437 {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=\\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F {0} \\u0438\\u0437 {1} - \\u043B\\u0438\\u043C\\u0438\\u0442 \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=\\u041A\\u0430\\u0442\\u0435\\u0433\\u043E\\u0440\\u0438\\u044F\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=\\u041D\\u0435 \\u043F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0435\\u043D\\u043E\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=\\u041D\\u0435\\u0438\\u0437\\u0432\\u0435\\u0441\\u0442\\u043D\\u043E\n\n#XFLD: Components\nview.PurchaseOrder.components=\\u041A\\u043E\\u043C\\u043F\\u043E\\u043D\\u0435\\u043D\\u0442\\u044B\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=\\u041E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u043A\\u0430 \\u0414\\u041C\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=\\u0421\\u0442\\u0430\\u043D\\u0434\\u0430\\u0440\\u0442\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=\\u0422\\u0440\\u0435\\u0442\\u044C\\u0435 \\u043B\\u0438\\u0446\\u043E\n\n#XFLD: Return\nview.PurchaseOrder.return=\\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F \\u0432\\u043E\\u0437\\u0432\\u0440\\u0430\\u0442\\u0430\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=\\u041A\\u043E\\u043D\\u0441\\u0438\\u0433\\u043D\\u0430\\u0446\\u0438\\u044F\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=\\u0423\\u0441\\u043B\\u043E\\u0432\\u0438\\u0435\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=\\u0426\\u0435\\u043D\\u0430\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F\n\n#XFLD: No items\nview.PurchaseOrder.noItem=\\u041D\\u0435\\u0442 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0439\n\n#XFLD\nview.PurchaseOrder.title=\\u0417\\u0430\\u043A\\u0430\\u0437 \\u043D\\u0430 \\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0443\n\n#XFLD\nview.PurchaseOrder.substituted=\\u0417\\u0430\\u043C\\u0435\\u0441\\u0442\\u0438\\u0442\\u0435\\u043B\\u044C \\u0434\\u043B\\u044F\n\n#XFLD\nview.PurchaseOrder.forwarded=\\u041F\\u0435\\u0440\\u0435\\u0430\\u0434\\u0440\\u0435\\u0441\\u043E\\u0432\\u0430\\u043D\\u043E\n\n#XFLD\nview.PurchaseOrder.name=\\u0418\\u043C\\u044F\n\n#XFLD\nview.PurchaseOrder.address=\\u0410\\u0434\\u0440\\u0435\\u0441\n\n#YMSG\ndialog.question.approve=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C \\u0437\\u0430\\u043A\\u0430\\u0437, \\u043F\\u043E\\u043B\\u0443\\u0447\\u0435\\u043D\\u043D\\u044B\\u0439 \\u043E\\u0442 {0}?\n\n#YMSG\ndialog.question.reject=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C \\u0437\\u0430\\u043A\\u0430\\u0437, \\u043F\\u043E\\u043B\\u0443\\u0447\\u0435\\u043D\\u043D\\u044B\\u0439 \\u043E\\u0442 {0}?\n\n#YMSG\ndialog.success.approve=\\u0417\\u0430\\u043A\\u0430\\u0437 \\u043D\\u0430 \\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0443 \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\n\n#YMSG\ndialog.success.reject=\\u0417\\u0430\\u043A\\u0430\\u0437 \\u043D\\u0430 \\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0443 \\u043E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0435\\u043D\n\n#YMSG\ndialog.success.forward=\\u0417\\u0430\\u043A\\u0430\\u0437 \\u043F\\u0435\\u0440\\u0435\\u043D\\u0430\\u043F\\u0440\\u0430\\u0432\\u043B\\u0435\\u043D \\u043A {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u043F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435 (\\u043E\\u043F\\u0446\\u0438\\u043E\\u043D\\u0430\\u043B\\u044C\\u043D\\u043E)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=\\u041F\\u043E\\u0441\\u0442\\u0430\\u0432\\u0449\\u0438\\u043A\n\n#XFLD: Employee header label\nBussinessCard.Employee=\\u0421\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0438\\u043B\\u0438 \\u043E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0435\\u043D\\u0438\\u0435 \\u044D\\u0442\\u043E\\u0433\\u043E \\u0437\\u0430\\u043A\\u0430\\u0437\\u0430 \\u043D\\u0430 \\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0443 \\u0432\\u0441\\u0435 \\u0435\\u0449\\u0435 \\u0432 \\u043E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u043A\\u0435. \\u0421\\u043F\\u0438\\u0441\\u043E\\u043A \\u0437\\u0430\\u043A\\u0430\\u0437\\u043E\\u0432 \\u043D\\u0430 \\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0443 \\u043C\\u043E\\u0436\\u043D\\u043E \\u043E\\u0431\\u043D\\u043E\\u0432\\u0438\\u0442\\u044C \\u0432\\u0440\\u0443\\u0447\\u043D\\u0443\\u044E.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=\\u0418\\u043C\\u044F \\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u0449\\u0438\\u043A\\u0430\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=\\u0410\\u0434\\u0440\\u0435\\u0441 \\u0437\\u0430\\u043A\\u0430\\u0437\\u0430 \\u043D\\u0430 \\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u043A\\u0443\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=\\u041C\\u0435\\u0441\\u0442\\u043E \\u0432\\u043E\\u0437\\u043D\\u0438\\u043A\\u043D\\u043E\\u0432\\u0435\\u043D\\u0438\\u044F \\u043F\\u0440\\u0438\\u0431\\u044B\\u043B\\u0438\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=\\u041E\\u041A\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C\n\n#XBUT: Button for Reject action\nXBUT_REJECT=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C\n\n#XBUT: Button for forward action\nXBUT_FORWARD=\\u041F\\u0435\\u0440\\u0435\\u0430\\u0434\\u0440\\u0435\\u0441\\u043E\\u0432\\u0430\\u0442\\u044C\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=\\u0411\\u0430\\u0439\\u0442\n\n#YMSG: File Size Unit\nFileSize.Bytes=\\u0411\\u0430\\u0439\\u0442\\u044B\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=\\u041A\\u0411\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=\\u041C\\u0411\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=\\u0413\\u0411\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=\\u0422\\u0411\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=\\u041F\\u0411\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=\\u042D\\u0411\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=\\u0417\\u0411\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=\\u0419\\u0411\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=\\u0424\\u0430\\u0439\\u043B \\u0441\\u043B\\u0438\\u0448\\u043A\\u043E\\u043C \\u0431\\u043E\\u043B\\u044C\\u0448\\u043E\\u0439\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=\\u0421\\u0435\\u0433\\u043E\\u0434\\u043D\\u044F\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 \\u0434\\u0435\\u043D\\u044C \\u043D\\u0430\\u0437\\u0430\\u0434\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} \\u0434\\u043D. \\u043D\\u0430\\u0437\\u0430\\u0434\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0430...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u0412 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0439 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442 \\u043D\\u0435\\u0442 \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\\u0445 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0439\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_sh.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Nalozi za nabavku ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Nalog za nabavku\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=Nalog za nabavku\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=Datum isporuke\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=Pogon\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=Kupac\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=Ime\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=Uslovi pla\\u0107anja\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=\\u0160ifra kompanije\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=Vi\\u0161estruke dodele\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=Ra\\u010Dun glavne knjige\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=Podeli\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=Objekti\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=Mesto tro\\u0161ka\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=Element plana strukture projekta\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=Mre\\u017Ea\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=Nalog\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=Prodajni nalog\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=Sredstvo\n\n#XFLD: \nview.PurchaseOrder.subtotal=Me\\u0111uzbir\n\n#XFLD: \nview.PurchaseOrder.quantity=Koli\\u010Dina\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=Kategorija stavke\n\n#XTIT: Header text of Master List\nview.Master.title=Nalozi za nabavku ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=Detalji cene\n\n#XFLD: \nview.PurchaseOrder.notes=Bele\\u0161ke\n\n#XFLD: \nview.PurchaseOrder.attachments=Dodaci\n\n#XFLD: \nview.PurchaseOrder.delivery=Isporuka\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=Isporuka\n\n#XFLD: \nview.PurchaseOrder.material=Materijal\n\n#XFLD: \nview.PurchaseOrder.materialGroup=Grupa materijala\n\n#XFLD: \nview.PurchaseOrder.serviceLines=Redovi usluge\n\n#XFLD: \nview.PurchaseOrder.limit=Ograni\\u010Denje\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=Uslovi odre\\u0111ivanja cena\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=po\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=Grani\\u010Dna vrednost\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=O\\u010Dekivana vrednost\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=Neograni\\u010Deno\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=Informacije\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=Dodela ra\\u010Duna\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=Dodela ra\\u010Duna\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=Opis\n\n#XTIT: Application name\napp.Identity=Odobri naloge za nabavku\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Odobri naloge za nabavku\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=Usluga\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=i kasnije\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=Stavke ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=Redovi usluga ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=Blokirano\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=Stavka {0} od {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Red usluga {0} od {1} - Stavka {2} od {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Stavka {0} od {1} - Ograni\\u010Denje \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=Kategorija\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=Nije dodeljeno\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=Nepoznato\n\n#XFLD: Components\nview.PurchaseOrder.components=Komponente\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=Podugovaranje\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=Standardno\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=Tre\\u0107a strana\n\n#XFLD: Return\nview.PurchaseOrder.return=Stavka vra\\u0107anja\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=Konsignacija\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=Uslov\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=Cena\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 stavka\n\n#XFLD: No items\nview.PurchaseOrder.noItem=Nema stavki\n\n#XFLD\nview.PurchaseOrder.title=Nalog za nabavku\n\n#XFLD\nview.PurchaseOrder.substituted=Zamena za\n\n#XFLD\nview.PurchaseOrder.forwarded=Prosledio\n\n#XFLD\nview.PurchaseOrder.name=Ime\n\n#XFLD\nview.PurchaseOrder.address=Adresa\n\n#YMSG\ndialog.question.approve=Odobriti nalog za nabavku koji je podneo {0}?\n\n#YMSG\ndialog.question.reject=Odbiti nalog za nabavku koji je podneo {0}?\n\n#YMSG\ndialog.success.approve=Nalog za nabavku je odobren\n\n#YMSG\ndialog.success.reject=Nalog za nabavku je odbijen\n\n#YMSG\ndialog.success.forward=Nalog za nabavku je prosle\\u0111en {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Dodaj bele\\u0161ku (izborno)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Odobri\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Odbij\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=Dobavlja\\u010D\n\n#XFLD: Employee header label\nBussinessCard.Employee=Zaposleni\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Odobrenje ili odbijanje ovog naloga za nabavku je jo\\u0161 uvek u toku. Mo\\u017Eete ru\\u010Dno da osve\\u017Eite listu naloga za nabavku.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=Naziv dobavlja\\u010Da\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=Adresa naru\\u010Divanja\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=Profitni centar\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Odobri\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Odbij\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Prosledi\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Odustani\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=Bajt\n\n#YMSG: File Size Unit\nFileSize.Bytes=Bajtovi\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Fajl je prevelik\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Danas\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=Pre jednog dana\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=Pre {0} dana\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=U\\u010Ditavanje...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Stavke trenutno nisu dostupne\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_sk.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Objedn\\u00E1vky ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Objedn\\u00E1vka\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=Objedn\\u00E1vka\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=D\\u00E1tum dod\\u00E1vky\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=Z\\u00E1vod\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=Z\\u00E1kazn\\u00EDk\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=N\\u00E1zov\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=Platobn\\u00E9 podmienky\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=\\u00DA\\u010Dtovn\\u00FD okruh\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=Viacn\\u00E1sobn\\u00E9 priradenia\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=\\u00DA\\u010Det hlavnej knihy\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=Podiel\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=Objekty\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=N\\u00E1kladov\\u00E9 stredisko\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=Prvok \\u0160PP\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=Sie\\u0165.diagram\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=Z\\u00E1kazka\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=Z\\u00E1kazka odberate\\u013Ea\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=Dlhodob\\u00FD majetok\n\n#XFLD: \nview.PurchaseOrder.subtotal=Medzis\\u00FA\\u010Det\n\n#XFLD: \nview.PurchaseOrder.quantity=Mno\\u017Estvo\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=Kateg\\u00F3ria polo\\u017Eky\n\n#XTIT: Header text of Master List\nview.Master.title=Objedn\\u00E1vky ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=Detaily ceny\n\n#XFLD: \nview.PurchaseOrder.notes=Pozn\\u00E1mky\n\n#XFLD: \nview.PurchaseOrder.attachments=Pr\\u00EDlohy\n\n#XFLD: \nview.PurchaseOrder.delivery=Dod\\u00E1vka\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=D\\u00E1tum dodania\n\n#XFLD: \nview.PurchaseOrder.material=Materi\\u00E1l\n\n#XFLD: \nview.PurchaseOrder.materialGroup=Skupina materi\\u00E1lu\n\n#XFLD: \nview.PurchaseOrder.serviceLines=Riadky slu\\u017Eieb\n\n#XFLD: \nview.PurchaseOrder.limit=Limit\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=Cenov\\u00E9 podmienky\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=za\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=Hodnota limitu\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=O\\u010Dak\\u00E1van\\u00E1 hodnota\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=Neobmedzen\\u00E9\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=Inform\\u00E1cie\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=Priradenie \\u00FA\\u010Dtu\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=Priradenie \\u00FA\\u010Dtu\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=Popis\n\n#XTIT: Application name\napp.Identity=Schva\\u013Eovanie objedn\\u00E1vok\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Schva\\u013Eovanie objedn\\u00E1vok\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=Slu\\u017Eba\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=a nesk\\u00F4r\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=Polo\\u017Eky ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=Riadky slu\\u017Eieb ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=Blokovan\\u00E9\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=Polo\\u017Eka {0} z {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Riadok slu\\u017Eby {0} z {1} - polo\\u017Eka {2} z {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Polo\\u017Eka {0} z {1} - limit \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=Kateg\\u00F3ria\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=Nepriraden\\u00E9\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=Nezn\\u00E1me\n\n#XFLD: Components\nview.PurchaseOrder.components=Komponenty\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=Pr\\u00E1ca za mzdu\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=\\u0160tandard\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=Tretia strana\n\n#XFLD: Return\nview.PurchaseOrder.return=Polo\\u017Eka vr\\u00E1tenia\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=Konsign\\u00E1cia\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=Podmienka\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=Cena\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 polo\\u017Eka\n\n#XFLD: No items\nview.PurchaseOrder.noItem=\\u017Diadne polo\\u017Eky\n\n#XFLD\nview.PurchaseOrder.title=Objedn\\u00E1vka\n\n#XFLD\nview.PurchaseOrder.substituted=Z\\u00E1stupca za\n\n#XFLD\nview.PurchaseOrder.forwarded=Odovzdal\n\n#XFLD\nview.PurchaseOrder.name=N\\u00E1zov\n\n#XFLD\nview.PurchaseOrder.address=Adresa\n\n#YMSG\ndialog.question.approve=Schv\\u00E1li\\u0165 objedn\\u00E1vku, ktor\\u00FA predlo\\u017Eil {0}?\n\n#YMSG\ndialog.question.reject=Zamietnu\\u0165 objedn\\u00E1vku, ktor\\u00FA predlo\\u017Eil {0}?\n\n#YMSG\ndialog.success.approve=Objedn\\u00E1vka bola schv\\u00E1len\\u00E1\n\n#YMSG\ndialog.success.reject=Objedn\\u00E1vka bola zamietnut\\u00E1\n\n#YMSG\ndialog.success.forward=Objedn\\u00E1vka bola odovzdan\\u00E1 {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Prida\\u0165 pozn\\u00E1mku (volite\\u013En\\u00E9)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Schv\\u00E1li\\u0165\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Zamietnu\\u0165\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=Dod\\u00E1vate\\u013E\n\n#XFLD: Employee header label\nBussinessCard.Employee=Zamestnanec\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Schv\\u00E1lenie alebo zamietnutie tejto objedn\\u00E1vky st\\u00E1le prebieha. Zoznam objedn\\u00E1vok m\\u00F4\\u017Eete aktualizova\\u0165 manu\\u00E1lne.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=Meno dod\\u00E1vate\\u013Ea\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=Objedn\\u00E1vacia adresa\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=Ziskov\\u00E9 stredisko\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Schv\\u00E1li\\u0165\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Zamietnu\\u0165\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Odovzda\\u0165\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Zru\\u0161i\\u0165\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=Bajt\n\n#YMSG: File Size Unit\nFileSize.Bytes=Bajty\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=S\\u00FAbor je pr\\u00EDli\\u0161 ve\\u013Ek\\u00FD\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Dnes\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=Pred 1 d\\u0148om\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=pred {0} d\\u0148ami\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Na\\u010D\\u00EDtava sa...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Aktu\\u00E1lne nie s\\u00FA k dispoz\\u00EDcii \\u017Eiadne polo\\u017Eky\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_sl.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Naro\\u010Dila ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Naro\\u010Dilo\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incotermi\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=Naro\\u010Dilo\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=Datum dobave\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=Obrat\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=Stranka\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=Naziv\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=Pla\\u010Dilni pogoji\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=\\u0160ifra podjetja\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=Ve\\u010Dkratne dodelitve\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=Konto glavne knjige\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=Daj v skupno rabo\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=Objekti\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=Stro\\u0161kovno mesto\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=PPS-element\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=Mre\\u017Eni plan\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=Nalog\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=Prodajni nalog\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=Sredstvo\n\n#XFLD: \nview.PurchaseOrder.subtotal=Vmesna vsota\n\n#XFLD: \nview.PurchaseOrder.quantity=Koli\\u010Dina\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=Kategorija postavke\n\n#XTIT: Header text of Master List\nview.Master.title=Naro\\u010Dila ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=Detajli cene\n\n#XFLD: \nview.PurchaseOrder.notes=Zabele\\u017Eke\n\n#XFLD: \nview.PurchaseOrder.attachments=Priloge\n\n#XFLD: \nview.PurchaseOrder.delivery=Dobava\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=Dobava dne\n\n#XFLD: \nview.PurchaseOrder.material=Material\n\n#XFLD: \nview.PurchaseOrder.materialGroup=Skupina materiala\n\n#XFLD: \nview.PurchaseOrder.serviceLines=Vrstice storitve\n\n#XFLD: \nview.PurchaseOrder.limit=Meja\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=Pogoji cen\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=na\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=Mejna vrednost\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=Pri\\u010Dakovana vrednost\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=Neomejeno\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=Informacije\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=Kontiranje\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=Kontiranje\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=Opis\n\n#XTIT: Application name\napp.Identity=Odobritev naro\\u010Dil\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Odobritev naro\\u010Dil\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=Storitev\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=in kasneje\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=Postavke ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=Vrstice storitev ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=Blokirano\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=Postavka {0} od {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Vrstica storitve {0} od {1} - postavka {2} od {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Postavka {0} od {1} - limit \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=Kategorija\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=Nedodeljeno\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=Neznano\n\n#XFLD: Components\nview.PurchaseOrder.components=Komponente\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=Kooperacija\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=Standard\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=Tretja oseba\n\n#XFLD: Return\nview.PurchaseOrder.return=Postavka vra\\u010Dila\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=Konsignacija\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=Pogoj\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=Cena\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 postavka\n\n#XFLD: No items\nview.PurchaseOrder.noItem=Ni postavk\n\n#XFLD\nview.PurchaseOrder.title=Naro\\u010Dilo\n\n#XFLD\nview.PurchaseOrder.substituted=Namestnik za\n\n#XFLD\nview.PurchaseOrder.forwarded=Posredoval\n\n#XFLD\nview.PurchaseOrder.name=Naziv\n\n#XFLD\nview.PurchaseOrder.address=Naslov\n\n#YMSG\ndialog.question.approve=\\u017Delite odobriti naro\\u010Dilo, ki ga je poslal {0}?\n\n#YMSG\ndialog.question.reject=\\u017Delite zavrniti naro\\u010Dilo, ki ga je poslal {0}?\n\n#YMSG\ndialog.success.approve=Naro\\u010Dilo je bilo odobreno\n\n#YMSG\ndialog.success.reject=Naro\\u010Dilo je bilo zavrnjeno\n\n#YMSG\ndialog.success.forward=Naro\\u010Dilo je bilo posredovano {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Dodajanje opombe (opcijsko)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Odobritev\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Zavrnitev\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=Dobavitelj\n\n#XFLD: Employee header label\nBussinessCard.Employee=Zaposleni\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Odobritev ali zavrnitev tega naro\\u010Dila je \\u0161e v obdelavi. Seznam naro\\u010Dil lahko osve\\u017Eite ro\\u010Dno.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=Naziv dobavitelja\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=Naslov naro\\u010Dila\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=Profitni center\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=OK\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Odobritev\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Zavrnitev\n\n#XBUT: Button for forward action\nXBUT_FORWARD=Posreduj\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=Prekinitev\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=Bajt\n\n#YMSG: File Size Unit\nFileSize.Bytes=Bajtov\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Datoteka je prevelika\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Danes\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=Pred 1 dnem\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo=Pred {0} dnevi\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Prenos ...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Trenutno ni razpolo\\u017Eljivih postavk\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_tr.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Sat\\u0131nalma sipari\\u015Fleri ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Sat\\u0131nalma sipari\\u015Fi\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=Incoterms\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=Sat\\u0131nalma sipari\\u015Fi\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=Teslimat tarihi\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=\\u00DCretim yeri\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=M\\u00FC\\u015Fteri\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=Ad\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=\\u00D6deme ko\\u015Fullar\\u0131\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=\\u015Eirket kodu\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=\\u00C7oklu tayinler\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=DK hesab\\u0131\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=Oran\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=Nesneler\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=Masraf yeri\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=PYP \\u00F6\\u011Fesi\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=A\\u011F\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=Sipari\\u015F\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=Sat\\u0131\\u015F sipari\\u015Fi\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=Duran varl\\u0131k\n\n#XFLD: \nview.PurchaseOrder.subtotal=Alt toplam\n\n#XFLD: \nview.PurchaseOrder.quantity=Miktar\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=Kalem kategorisi\n\n#XTIT: Header text of Master List\nview.Master.title=Sat\\u0131nalma sipari\\u015Fleri ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=Fiyat ayr\\u0131nt\\u0131lar\\u0131\n\n#XFLD: \nview.PurchaseOrder.notes=Notlar\n\n#XFLD: \nview.PurchaseOrder.attachments=Ekler\n\n#XFLD: \nview.PurchaseOrder.delivery=Teslimat\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=Teslimat tarihi\n\n#XFLD: \nview.PurchaseOrder.material=Malzeme\n\n#XFLD: \nview.PurchaseOrder.materialGroup=Malzeme grubu\n\n#XFLD: \nview.PurchaseOrder.serviceLines=Servis sat\\u0131rlar\\u0131\n\n#XFLD: \nview.PurchaseOrder.limit=S\\u0131n\\u0131r\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=Fiyatland\\u0131rma ko\\u015Fullar\\u0131\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=Birim\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=S\\u0131n\\u0131r de\\u011Feri\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=Beklenen de\\u011Fer\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=S\\u0131n\\u0131rs\\u0131z\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=Bilgi\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=Hesap tayini\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=Hesap tayini\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=Tan\\u0131m\n\n#XTIT: Application name\napp.Identity=Sat\\u0131nalma sipari\\u015Flerini onayla\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Sat\\u0131nalma sipari\\u015Flerini onayla\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=Servis\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=ve daha sonra\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=Kalemler ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=Servis sat\\u0131rlar\\u0131 ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=Bloke\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=Kalem {0} / {1}\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=Servis sat\\u0131r\\u0131 {0} / {1} - kalem {2} / {3}\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=Kalem {0} / {1} - s\\u0131n\\u0131r \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=Kategori\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=Tayin edilmedi\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=Bilinmiyor\n\n#XFLD: Components\nview.PurchaseOrder.components=Bile\\u015Fenler\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=Fason \\u00FCretim\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=Standart\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=\\u00DC\\u00E7\\u00FCnc\\u00FC taraf\n\n#XFLD: Return\nview.PurchaseOrder.return=\\u0130ade kalemi\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=Konsinye\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=Ko\\u015Ful\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=Fiyat\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 kalem\n\n#XFLD: No items\nview.PurchaseOrder.noItem=Kalem yok\n\n#XFLD\nview.PurchaseOrder.title=Sat\\u0131nalma sipari\\u015Fi\n\n#XFLD\nview.PurchaseOrder.substituted=\\u015Eunun i\\u00E7in vekil\n\n#XFLD\nview.PurchaseOrder.forwarded=\\u0130leten\n\n#XFLD\nview.PurchaseOrder.name=Ad\n\n#XFLD\nview.PurchaseOrder.address=Adres\n\n#YMSG\ndialog.question.approve={0} taraf\\u0131ndan g\\u00F6nderilen sat\\u0131nalma sipari\\u015Fi onaylans\\u0131n m\\u0131?\n\n#YMSG\ndialog.question.reject={0} taraf\\u0131ndan g\\u00F6nderilen sat\\u0131nalma sipari\\u015Fi reddedilsin mi?\n\n#YMSG\ndialog.success.approve=Sat\\u0131nalma sipari\\u015Fi onayland\\u0131\n\n#YMSG\ndialog.success.reject=Sat\\u0131nalma sipari\\u015Fi reddedildi\n\n#YMSG\ndialog.success.forward=Sat\\u0131nalma sipari\\u015Fi \\u015Fu al\\u0131c\\u0131ya iletildi\\: {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=Not ekle (iste\\u011Fe ba\\u011Fl\\u0131)\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Onayla\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Reddet\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=Tedarik\\u00E7i\n\n#XFLD: Employee header label\nBussinessCard.Employee=\\u00C7al\\u0131\\u015Fan\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=Bu sat\\u0131nalma sipari\\u015Finin onaylanmas\\u0131 veya reddedilmesi hala devam ediyor. Sat\\u0131nalma sipari\\u015Flerinin listesini man\\u00FCel olarak yenileyebilirsiniz.\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=Tedarik\\u00E7i ad\\u0131\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=Sat\\u0131nalma sipari\\u015Fi adresi\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=K\\u00E2r merkezi\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=Tamam\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Onayla\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Reddet\n\n#XBUT: Button for forward action\nXBUT_FORWARD=\\u0130let\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=\\u0130ptal et\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=Bayt\n\n#YMSG: File Size Unit\nFileSize.Bytes=Bayt\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=kB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=Dosya \\u00E7ok b\\u00FCy\\u00FCk\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=Bug\\u00FCn\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 g\\u00FCn \\u00F6nce\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} g\\u00FCn \\u00F6nce\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=Y\\u00FCkleniyor...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u015Eu anda kalem yok\n',
	"ui/s2p/mm/purchorder/approve/i18n/i18n_zh_CN.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=\\u91C7\\u8D2D\\u8BA2\\u5355 ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=\\u91C7\\u8D2D\\u8BA2\\u5355\n\n#XFLD: Inco Terms field label\nview.PurchaseOrder.incoTermsLabel=\\u56FD\\u9645\\u8D38\\u6613\\u6761\\u6B3E\n\n#XFLD: Purchase Order field label\nview.PurchaseOrder.purchaseOrderLabel=\\u91C7\\u8D2D\\u8BA2\\u5355\n\n#XFLD: Delivery Date field label\nview.PurchaseOrder.deliveryDateLabel=\\u4EA4\\u8D27\\u65E5\\u671F\n\n#XFLD: Plant field label\nview.PurchaseOrder.plantLabel=\\u5DE5\\u5382\n\n#XFLD: Customer field label\nview.PurchaseOrder.customerLabel=\\u5BA2\\u6237\n\n#XFLD: Freestyle adress field label\nview.PurchaseOrder.freestyleAdressLabel=\\u540D\\u79F0\n\n#XFLD: Payment Terms field label\nview.PurchaseOrder.paymentTermsLabel=\\u4ED8\\u6B3E\\u6761\\u4EF6\n\n#XFLD: Company Code field label\nview.PurchaseOrder.companyCodeLabel=\\u516C\\u53F8\\u4EE3\\u7801\n\n#XFLD: Multiply accounting field label\nview.PurchaseOrder.multiAccounting=\\u591A\\u4E2A\\u5206\\u914D\n\n#XFLD: General Ledger Account debited with the costs of the purchase order approval (item)\nview.PurchaseOrder.account=\\u603B\\u8D26\\u79D1\\u76EE\n\n#XFLD: Account Assignment percentage\nview.PurchaseOrder.accountAssignmentPercentage=\\u5171\\u4EAB\n\n#XFLD: Account Assignment: Objects\nview.PurchaseOrder.accountAssignmentObjects=\\u5BF9\\u8C61\n\n#XFLD: Account Assignment: Cost Centre\nview.PurchaseOrder.accountAssignmentCostCentre=\\u6210\\u672C\\u4E2D\\u5FC3\n\n#XFLD: Account Assignment: WBS Element\nview.PurchaseOrder.accountAssignmentWBSElement=WBS \\u8981\\u7D20\n\n#XFLD: Account Assignment: Network\nview.PurchaseOrder.accountAssignmentNetwork=\\u7F51\\u7EDC\n\n#XFLD: Account Assignment: Order\nview.PurchaseOrder.accountAssignmentOrder=\\u8BA2\\u5355\n\n#XFLD: Account Assignment: Sales Order\nview.PurchaseOrder.accountAssignmentSalesOrder=\\u9500\\u552E\\u8BA2\\u5355\n\n#XFLD: Account Assignment: Asset\nview.PurchaseOrder.accountAssignmentAsset=\\u8D44\\u4EA7\n\n#XFLD: \nview.PurchaseOrder.subtotal=\\u5C0F\\u8BA1\n\n#XFLD: \nview.PurchaseOrder.quantity=\\u6570\\u91CF\n\n#XFLD: Item Category\nview.PurchaseOrder.itemCategory=\\u9879\\u76EE\\u7C7B\\u522B\n\n#XTIT: Header text of Master List\nview.Master.title=\\u91C7\\u8D2D\\u8BA2\\u5355 ({0})\n\n#XFLD: \nview.PurchaseOrder.priceDetails=\\u4EF7\\u683C\\u8BE6\\u7EC6\\u4FE1\\u606F\n\n#XFLD: \nview.PurchaseOrder.notes=\\u6CE8\\u91CA\n\n#XFLD: \nview.PurchaseOrder.attachments=\\u9644\\u4EF6\n\n#XFLD: \nview.PurchaseOrder.delivery=\\u4EA4\\u8D27\n\n#XFLD: Delivery on 4 Jan, 2013 (section heading, not label)\nview.PurchaseOrder.deliveryOn=\\u4EA4\\u8D27\\u65E5\\u671F\n\n#XFLD: \nview.PurchaseOrder.material=\\u7269\\u6599\n\n#XFLD: \nview.PurchaseOrder.materialGroup=\\u7269\\u6599\\u7EC4\n\n#XFLD: \nview.PurchaseOrder.serviceLines=\\u670D\\u52A1\\u884C\n\n#XFLD: \nview.PurchaseOrder.limit=\\u9650\\u5236\n\n#XFLD: \nview.PurchaseOrder.pricingConditions=\\u5B9A\\u4EF7\\u6761\\u4EF6\n\n#XFLD: Information about quantity and price of the current purchase order approval position (e.g. 1,000 USD per 1 Piece)\nview.PurchaseOrder.perUnit=/\n\n#XFLD: This text is used for combination of price and quantity (e.g. "10 EUR / 1 piece(s)")\nview.PurchaseOrder.priceQty={0} {1} / {2} {3}\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.valueLimit=\\u9650\\u5236\\u503C\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.expectedValue=\\u9884\\u671F\\u503C\n\n#XFLD: Property of a limit item in a purchase order approval\nview.PurchaseOrder.unlimitedLimit=\\u65E0\\u9650\\u5236\n\n#XFLD: Purchase Order Information\nview.PurchaseOrder.information=\\u4FE1\\u606F\n\n#XGRP: Group header of the section for showing the accounting information for a purchase order approval item\nview.PurchaseOrder.accountAssignment=\\u79D1\\u76EE\\u5206\\u914D\n\n#XFLD: Account Assignment field label\nview.PurchaseOrder.accountAssignmentLabel=\\u79D1\\u76EE\\u5206\\u914D\n\n#XFLD: Service Line and Account Assignment description\nview.PurchaseOrder.descriptionLabel=\\u63CF\\u8FF0\n\n#XTIT: Application name\napp.Identity=\\u5BA1\\u6279\\u91C7\\u8D2D\\u8BA2\\u5355\n\n#XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u5BA1\\u6279\\u91C7\\u8D2D\\u8BA2\\u5355\n\n#XFLD: Service Line Id label\nview.PurchaseOrder.serviceLineIdLabel=\\u670D\\u52A1\n\n#XFLD: Information that the shopping cart items have different delivery dates/periods of performance (e.g. 16.07.2013 and later)\nview.PurchaseOrder.DeliveryAlsoLater=\\u53CA\\u4EE5\\u540E\n\n#XFLD: Multiple items\nview.PurchaseOrder.multipleItems=\\u9879\\u76EE ({0})\n\n#XFLD: Multiple Service Lines\nview.PurchaseOrder.multipleLines=\\u670D\\u52A1\\u884C ({0})\n\n#XFLD: Blocked\nview.PurchaseOrder.blocked=\\u5DF2\\u51BB\\u7ED3\n\n#XTIT: Title of Items Page\nview.ItemDetails.title=\\u7B2C {0} \\u4E2A\\u9879\\u76EE\\uFF0C\\u5171 {1} \\u4E2A\\u9879\\u76EE\n\n#XTIT: Title of Service Line Page\nview.ItemServiceLine.title=\\u7B2C {0} \\u4E2A\\u670D\\u52A1\\u884C\\uFF0C\\u5171 {1} \\u4E2A\\u670D\\u52A1\\u884C - \\u7B2C {2} \\u4E2A\\u9879\\u76EE\\uFF0C\\u5171 {3} \\u4E2A\\u9879\\u76EE\n\n#XTIT: Title of Service Limit Page\nview.ItemServiceLimit.title=\\u7B2C {0} \\u4E2A\\u9879\\u76EE\\uFF0C\\u5171 {1} \\u4E2A\\u9879\\u76EE - \\u9650\\u5236 \n\n#XFLD: Category for Account Assignment\nview.PurchaseOrder.category=\\u7C7B\\u522B\n\n#XFLD: Placeholder for field label in case if item hasn\'t assignment\nview.PurchaseOrder.placeholder=\\u672A\\u5206\\u914D\n\n#XFLD: Unknown field label\nview.PurchaseOrder.unknown=\\u672A\\u77E5\n\n#XFLD: Components\nview.PurchaseOrder.components=\\u7EC4\\u4EF6\n\n#XFLD: Subcontracting\nview.PurchaseOrder.subcontracting=\\u5916\\u534F\\u52A0\\u5DE5\n\n#XFLD: Item category Standard\nview.PurchaseOrder.standard=\\u6807\\u51C6\n\n#XFLD: Third-party\nview.PurchaseOrder.thirdParty=\\u7B2C\\u4E09\\u65B9\n\n#XFLD: Return\nview.PurchaseOrder.return=\\u9000\\u8D27\\u9879\\u76EE\n\n#XFLD: Consignment\nview.PurchaseOrder.consignment=\\u5BC4\\u552E\n\n#XFLD: Price condition\nview.PurchaseOrder.priceCondition=\\u6761\\u4EF6\n\n#XFLD: Price of Price condition\nview.PurchaseOrder.amount=\\u4EF7\\u683C\n\n#XFLD: Multiple items\nview.PurchaseOrder.singleItem=1 \\u4E2A\\u9879\\u76EE\n\n#XFLD: No items\nview.PurchaseOrder.noItem=\\u65E0\\u9879\\u76EE\n\n#XFLD\nview.PurchaseOrder.title=\\u91C7\\u8D2D\\u8BA2\\u5355\n\n#XFLD\nview.PurchaseOrder.substituted=\\u6211\\u7684\\u66FF\\u73ED\\u4EBA\\u5458\n\n#XFLD\nview.PurchaseOrder.forwarded=\\u8F6C\\u53D1\\u4EBA\n\n#XFLD\nview.PurchaseOrder.name=\\u59D3\\u540D\n\n#XFLD\nview.PurchaseOrder.address=\\u5730\\u5740\n\n#YMSG\ndialog.question.approve=\\u662F\\u5426\\u6279\\u51C6 {0} \\u63D0\\u4EA4\\u7684\\u91C7\\u8D2D\\u8BA2\\u5355\\uFF1F\n\n#YMSG\ndialog.question.reject=\\u662F\\u5426\\u62D2\\u7EDD {0} \\u63D0\\u4EA4\\u7684\\u91C7\\u8D2D\\u8BA2\\u5355\\uFF1F\n\n#YMSG\ndialog.success.approve=\\u5DF2\\u6279\\u51C6\\u91C7\\u8D2D\\u8BA2\\u5355\n\n#YMSG\ndialog.success.reject=\\u5DF2\\u62D2\\u7EDD\\u91C7\\u8D2D\\u8BA2\\u5355\n\n#YMSG\ndialog.success.forward=\\u91C7\\u8D2D\\u8BA2\\u5355\\u5DF2\\u8F6C\\u53D1\\u81F3 {0}\n\n#YMSG: Note place holder for text field => will be deleted from text field if the user types in a text\ndialog.ApproveRejectForward.NotePlaceHolder=\\u6DFB\\u52A0\\u6CE8\\u91CA\\uFF08\\u53EF\\u9009\\uFF09\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=\\u6279\\u51C6\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=\\u62D2\\u7EDD\n\n#XFLD: Supplier header label\nBussinessCard.Supplier=\\u4F9B\\u5E94\\u5546\n\n#XFLD: Employee header label\nBussinessCard.Employee=\\u5458\\u5DE5\n\n#YINS: Instruction for the user to refresh the list of work items manually after approval or rejection\ndialog.refreshMasterListManually=\\u6B63\\u5728\\u6279\\u51C6\\u6216\\u62D2\\u7EDD\\u6B64\\u91C7\\u8D2D\\u8BA2\\u5355\\u3002\\u60A8\\u53EF\\u4EE5\\u624B\\u52A8\\u5237\\u65B0\\u91C7\\u8D2D\\u8BA2\\u5355\\u5217\\u8868\\u3002\n\n\n#XFLD: Vendor name label\nview.PurchaseOrder.CPDVendorLabel=\\u4F9B\\u5E94\\u5546\\u540D\\u79F0\n\n#XFLD: Ordering Address label\nview.PurchaseOrder.OrderingAddress=\\u8BA2\\u8D27\\u5730\\u5740\n\n#XFLD: Profit Center label\nview.PurchaseOrder.ProfitCenter=\\u5229\\u6DA6\\u4E2D\\u5FC3\n\n#########\n# Texts for Buttons\n##########\n#XBUT: Button for OK (Decision options)\nXBUT_OK=\\u786E\\u5B9A\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=\\u6279\\u51C6\n\n#XBUT: Button for Reject action\nXBUT_REJECT=\\u62D2\\u7EDD\n\n#XBUT: Button for forward action\nXBUT_FORWARD=\\u8F6C\\u53D1\n\n#XBUT: Button for Approve/Reject/Forward - cancel action\nXBUT_CANCEL=\\u53D6\\u6D88\n\n#########\n# Texts for Attachment List\n##########\n\n#YMSG: File Size Unit one Byte \nFileSize.Byte=\\u5B57\\u8282\n\n#YMSG: File Size Unit\nFileSize.Bytes=\\u5B57\\u8282\n\n#YMSG: File Size Unit Kilobyte (short)\nFileSize.Kilobytes=KB\n\n#YMSG: File Size Unit Megabyte (short)\nFileSize.Megabytes=MB\n\n#YMSG: File Size Unit Gigabyte (short)\nFileSize.Gigabytes=GB\n\n#YMSG: File Size Unit Terabyte (short)\nFileSize.Terabytes=TB\n\n#YMSG: File Size Unit Petabyte (short)\nFileSize.Petabytes=PB\n\n#YMSG: File Size Unit Exabyte (short)\nFileSize.Exabytes=EB\n\n#YMSG: File Size Unit Zettabyte (short)\nFileSize.Zettabytes=ZB\n\n#YMSG: File Size Unit Yottabyte (short)\nFileSize.Yottabytes=YB\n\n#YMSG: File Size Unit Error too big number > 1e23\nFileSize.Error=\\u6587\\u4EF6\\u592A\\u5927\n\n\n#########\n# Texts for DateTimeFormatter\n##########\n\n#YMSG: Time when sth. (e.g. a leave) was created today\nDateTimeFormatter.Today=\\u4ECA\\u5929\n\n#YMSG: Time when sth. (e.g. a leave) was created yesterday\nDateTimeFormatter.Yesterday=1 \\u5929\\u524D\n\n#YMSG: Time when sth. (e.g. a leave) was created x days ago (Plural; e.g. 2 days ago)\nDateTimeFormatter.DaysAgo={0} \\u5929\\u524D\n\n\n#########\n# Texts for Formatting\n##########\n\n#XFLD: This text is used for combination of description and id (e.g. "iPhone (0001)", where {0} = iPhone and {1} = 0001)\nFormatting.DescriptionAndId={0} ({1})\n\n# YMSG: Loading\nLOADING=\\u6B63\\u5728\\u52A0\\u8F7D...\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u9879\\u76EE\n',
	"ui/s2p/mm/purchorder/approve/util/Conversions.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("ui.s2p.mm.purchorder.approve.util.Conversions");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("sap.ca.ui.model.format.FileSizeFormat");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.format.QuantityFormat");
jQuery.sap.require("sap.ca.ui.model.format.FormatHelper");
jQuery.sap.require("sap.ca.ui.model.format.FormattingLibrary");
jQuery.sap.require("sap.ui.core.format.NumberFormat");

ui.s2p.mm.purchorder.approve.util.Conversions = {

	stringVisibilityTrigger : function(sString){
		if (sString == null || sString == "") {
			return false;
		} else {
			return true;
		}
	},	
	
	stringFormatterInterop : function(sString){
		if (sString != null && sString != "") {
			return sString;
		}else{
			return "";
		}
	},
	
		
	// ID and Description Formatting
	commonIDFormatter: function(sDescription, sID) {
		if (sID){
			if (sDescription){
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
				return oBundle.getText("Formatting.DescriptionAndId", [sDescription, sID]);
			}
			return sID;
		}
		if (sDescription){
		  return sDescription;
		}
		return "";
	},

	salesOrderIDFormatter: function(sSalesOrder, sSalesOrderItem, sSalesOrderScheduleLine) {
		var sResult;
		sResult = sSalesOrder;
		if (sSalesOrderItem){
			sResult = sResult + "/" + sSalesOrderItem;
		}
		if (sSalesOrderScheduleLine){
			sResult = sResult + "/" + sSalesOrderScheduleLine;
		}
		return sResult;
	},
	
	assetIDFormatter: function(sDescription, sAsset, sAssetSubNumber) {
		var sAssetNumber = sAsset;
		if (sAssetSubNumber){
			sAssetNumber = sAssetNumber + "/" + sAssetSubNumber;
		}

		if (sAssetNumber){
			if (sDescription){
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
				return oBundle.getText("Formatting.DescriptionAndId", [sDescription, sAssetNumber]);
			}
			return sAssetNumber;
		}
		if (sDescription){
		  return sDescription;
		}
		return "";
	},

	accountAssignmentPercentageFormatter: function (percentage) {
	//  "%" shall be shown, only if there is a percentage given.	
		if (percentage == null || percentage == "") {
			return "";
		} else {
			return "%";
		}
	},

	incoTermsFormatter: function(sIncoterm, sIncotermLocation, sIncotermDescription) {
		var sResult = ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(sIncotermDescription, sIncoterm);

		if (sIncotermLocation != '') {
			sResult += ', ' + sIncotermLocation;
		}
		return sResult;
	},

	incoTermsVisibilityTrigger: function(sIncoterm, sIncotermLocation, sIncotermDescription) {
		var f = ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger;
		return f(sIncoterm) && f(sIncotermDescription);
	},

	serviceInformationVisibilityTrigger: function( sServiceID, sLongDescription ) {
		var f = ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger;
		return f(sServiceID) || f(sLongDescription);
	},
	
	componentVisibilityTrigger: function(iItemCategory) {
		if(iItemCategory === "3") {
			return true;
		}else{
			return false;
		}
	},

	PriceConditionsVisibilityTriggerItemType: function(sPricingConditions) {
		if (sPricingConditions === null || sPricingConditions === "" ||sPricingConditions.length === 0 || sPricingConditions === undefined ) {
			return false;
		} else {
			return true;
		}
	},

	itemCategoryFormatter: function(sItemCategoryDescription, sItemType) {
		if (sItemCategoryDescription && sItemCategoryDescription !== 'return-item') {
			if (sItemCategoryDescription && sItemCategoryDescription !== "") {
				return sItemCategoryDescription;
			} else  {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				if (sItemType == 'S') {
					return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.serviceLineIdLabel") : "";
				} else if (sItemType == 'L') {
					return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.limit") : "";
				} else if (sItemType == 'M') {
					return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.standard") : "";
				} else if (sItemType == '2') {
					return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.consignment") : "";
				} else if (sItemType == '3') {
					return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.subcontracting") : "";
				} else if (sItemType == '5') {
					return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.thirdParty") : "";
				}; 
			};	
		} else {
			var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
			if (sItemType == 'S') {
				var sItemCategoryDescription = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.serviceLineIdLabel") : "";
			} else if (sItemType == 'L') {
				var sItemCategoryDescription = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.limit") : "";
			} else if (sItemType == 'M') {
				var sItemCategoryDescription = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.standard") : "";
			} else if (sItemType == '2') {
				var sItemCategoryDescription = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.consignment") : "";
			} else if (sItemType == '3') {
				var sItemCategoryDescription = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.subcontracting") : "";
			} else if (sItemType == '5') {
				var sItemCategoryDescription = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.thirdParty") : "";
			}
			var sReturnItem = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.return") : "";
			var sResult = sItemCategoryDescription + ' / ' + sReturnItem;
			return sResult ; 
		};	
 	},

	IDFormatter: function(sDescription, sID) {
		return ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(sDescription, sID);
	},

	companyCodeFormatter: function(sCode, sCodeDescr) {
		return ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(sCodeDescr, sCode);
	},
	
	lazyRoundNumber: function(sNum) {
		var result = 0;
		var formatter;
		if (sNum) {
			if (!isNaN(parseFloat(sNum)) && isFinite(sNum)) {
				if (Math.abs(sNum) < 1e6) {
					formatter = sap.ui.core.format.NumberFormat.getInstance({style:'standard'}); 
				} else {
					formatter = sap.ui.core.format.NumberFormat.getInstance({style:'short'});
				}
				result = formatter.format(sNum);
			}
		}
		return result;
	},

	getNumberFormatOptions: function(options, lazy) {
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

	accountingFormatter: function(oHeaderInfo) {
		if (!oHeaderInfo) {return;};
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		var sMultiAccounting = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.multiAccounting") : "";
		var sNoAccounting = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.placeholder") : "";
		var sUnknown = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.unknown") : "";
		var sGlAccountLabel = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.account") : "";
		if (oHeaderInfo.CumulatedAccountingTypeCode == '2') {
			return sMultiAccounting;
		} else if (oHeaderInfo.CumulatedAccountingTypeCode == '3') {
			return sUnknown; 
		} else if (oHeaderInfo.CumulatedAccountingTypeCode == '0') {
			return sNoAccounting;
		};		

		// old logic
		if ( (oHeaderInfo.CostCentre === "" || oHeaderInfo.CostCentre === undefined) &&
			 (oHeaderInfo.WBSElement === "" || oHeaderInfo.WBSElement === undefined) &&
			 (oHeaderInfo.Network === ""    || oHeaderInfo.Network === undefined) &&
			 (oHeaderInfo.Order === ""      || oHeaderInfo.Order === undefined) &&
			 (oHeaderInfo.SalesOrder === "" || oHeaderInfo.SalesOrder === undefined) &&
			 (oHeaderInfo.Asset === ""      || oHeaderInfo.Asset === undefined) &&
			 (oHeaderInfo.ProfitCenter === "" || oHeaderInfo.ProfitCenter === undefined)) {

			var sResult1 = ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(oHeaderInfo.AccountDescription, oHeaderInfo.AccountNumber);
			var sResult2 = ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(oHeaderInfo.GlAccountDescription, oHeaderInfo.GlAccountNumber);
			return oHeaderInfo.AccountCategoryDescription + ' ' + sResult1 + '\n' + sGlAccountLabel + ' ' + sResult2;	
		} 

		// new logic
		else {
			var sResult = "";
			if (oHeaderInfo.CostCentre != "") {
				var sCostCentreLabel = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.accountAssignmentCostCentre") : "";
				sResult = sCostCentreLabel + ' ' + ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(oHeaderInfo.CostCentreDescription, oHeaderInfo.CostCentre);
			}
			if (oHeaderInfo.WBSElement != "") {
				if (sResult !== "") {sResult = sResult + '\n';};
				var sWBSElement = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.accountAssignmentWBSElement") : "";
				sResult = sResult + sWBSElement + ' ' +  ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(oHeaderInfo.WBSElementDescription, oHeaderInfo.WBSElement);
			}
			if (oHeaderInfo.Network != "") {
				if (sResult !== "") {sResult = sResult + '\n';};
				var sNetwork = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.accountAssignmentNetwork") : "";
				sResult = sResult + sNetwork + ' ' + ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(oHeaderInfo.NetworkDescription, oHeaderInfo.Network);
			}
			if (oHeaderInfo.Order != "") {
				if (sResult !== "") {sResult = sResult + '\n';};
				var sOrder = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.accountAssignmentOrder") : "";
				sResult = sResult + sOrder + ' ' + ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(oHeaderInfo.OrderDescription, oHeaderInfo.Order);
			}
			if (oHeaderInfo.SalesOrder != "") {
				if (sResult !== "") {sResult = sResult + '\n';};
				var sSalesOrder = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.accountAssignmentSalesOrder") : "";
				sResult = sResult + sSalesOrder + ' ' + ui.s2p.mm.purchorder.approve.util.Conversions.salesOrderIDFormatter(oHeaderInfo.SalesOrder, oHeaderInfo.SalesOrderItem, oHeaderInfo.SalesOrderScheduleLine);
			}
			if (oHeaderInfo.Asset != "") {
				if (sResult !== "") {sResult = sResult + '\n';};
				var sAsset = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.accountAssignmentAsset") : "";
				sResult = sResult + sAsset + ' ' + ui.s2p.mm.purchorder.approve.util.Conversions.assetIDFormatter(oHeaderInfo.AssetDescription, oHeaderInfo.Asset, oHeaderInfo.AssetSubnumber);
			}
			//######################################### ProfitCenter implemented with SP8 note
			if (oHeaderInfo.ProfitCenter != "") {
				if (sResult !== "") {sResult = sResult + '\n';};
				var sProfitCenter = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.ProfitCenter") : "";
				sResult = sResult + sProfitCenter + ' ' + ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(oHeaderInfo.ProfitCenterDescription, oHeaderInfo.ProfitCenter);
			}
			//#########################################
			if (oHeaderInfo.GlAccountNumber != "") {
				if (sResult !== "") {sResult = sResult + '\n';};
				var sGlAccount = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.account") : "";
				sResult = sResult + sGlAccount + ' ' + ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(oHeaderInfo.GlAccountDescription, oHeaderInfo.GlAccountNumber);
			}
			return sResult;
		}
	},

	noteDateFormatter: function(bNoteIsApproverNote, sDate) {
		if (bNoteIsApproverNote) {
			return ui.s2p.mm.purchorder.approve.util.Conversions.formatDaysAgo(sDate);
		} else {
			return '';
		};
	},

	approverNoteValueFormatter: function(bNoteIsApproverNote, sValue) {
		if (bNoteIsApproverNote) {
			return sValue;
		} else {
			return '';
		};
	},

	companyCodeVisibilityTrigger: function(sCode, sCodeDescr) {
		if ((sCode == '' || sCode == null) && (sCodeDescr == '' || sCodeDescr == null)) {
			return false;
		} else {
			return true;
		};
	},

	commonFieldVisibilityTrigger: function(sValue) {
		if (sValue == '' || sValue == null) {
			return false;
		} else {
			return true;
		};
	},

	deliveryAddressFormatter: function(sStreet, sPoBox, sCity, sCountry) {
		return sStreet + "," + " " + sPoBox + " " + sCity + "," + " " + sCountry;
	},

	valueLimitFormatter: function(sValue, sUnlimited, sCurrency) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.valueLimit") : "";
		sResult += ': '
				+ ui.s2p.mm.purchorder.approve.util.Conversions.valueLimitWithoutLabelFormatter(sValue, sUnlimited,
						sCurrency);
		return sResult;
	},

	valueLimitWithoutLabelFormatter: function(sValue, sUnlimited, sCurrency) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		var sResult = "";
		if (sUnlimited === '' || sUnlimited === null || sUnlimited === undefined) {
			sResult += ui.s2p.mm.purchorder.approve.util.Conversions.formatAmount(sValue) + ' ' + sCurrency;
		} else {
			sResult += ((oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.unlimitedLimit") : "");
		}
		return sResult;
	},

	expectedValueFormatter: function(sValue, sCurrency) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.expectedValue") : "";
		sResult += ': ' + ui.s2p.mm.purchorder.approve.util.Conversions.formatAmount(sValue) + ' ' + sCurrency;
		return sResult;
	},

	itemQuantityFormatter: function(sQuantity, sUnit, sValueLimit, sUnlimitFlag, sCurrency, sType) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		if (sType == 'S') {
			return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.serviceLineIdLabel") : "";
		} else if (sType == 'L') {
			return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.limit") : "";
			// return sap.mm.purchaseorder.approve.util.Conversions.valueLimitFormatter(sValueLimit, sUnlimitFlag,
			// sCurrency);
		} else {
			return ui.s2p.mm.purchorder.approve.util.Conversions.quantityFormatter(sQuantity, sUnit);
		};
	},

	quantityFormatter: function(sQuantity, sUnit) {
		
		return ui.s2p.mm.purchorder.approve.util.Conversions.formatQuantityWithoutUnit(sQuantity, sUnit) + ' ' + sUnit;
		
	},

	formatQuantityWithoutUnit: function(sQuantity, sUnit) {
		var numberFormatter = sap.ui.core.format.NumberFormat.getFloatInstance({}, sap.ui.getCore().getConfiguration().getLocale());

		return numberFormatter.format(sQuantity);
	},	

	quantityPerUnitItemCategory: function(sQuantity, sUnit, sPrice, sCurrency,sItemCategory){
		if (sItemCategory === "2"){
		return ui.s2p.mm.purchorder.approve.util.Conversions.quantityPerUnitFormatter("", "", "", "", "");
		}
		else{
		return	ui.s2p.mm.purchorder.approve.util.Conversions.quantityPerUnitFormatter(sQuantity, sUnit, sPrice, sCurrency, sItemCategory);
		}
	},

	quantityPerUnitFormatter: function(sQuantity, sUnit, sPrice, sCurrency) {
		var sPrice = ui.s2p.mm.purchorder.approve.util.Conversions.formatAmount(sPrice);
		var sQuantity = ui.s2p.mm.purchorder.approve.util.Conversions.formatQuantityWithoutUnit(sQuantity, sUnit);
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		
		return oBundle.getText("view.PurchaseOrder.priceQty", [sPrice, sCurrency, sQuantity, sUnit]);
	},

	totalPriceFormatter: function(sPrice, sCurrency) {
		return sPrice + ' ' + sCurrency;
	},

	notesVisibilityTrigger: function(oNotes) {
		if (oNotes !== null && oNotes !== undefined && oNotes.length !== 0) {
			return true;
		} else {
			return false;
		};
	},

	attachmentsVisibilityTrigger: function(oAttachments) {
		if (oAttachments !== null && oAttachments !== undefined && oAttachments.length !== 0) {
			return true;
		} else {
			return false;
		};
	},

	createdByFormatter: function(sId, sName) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
		var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.by") : "";
		if (sName !== undefined && sName !== '') {
			sResult += ' ' + sName;
		} else {
			sResult += ' ' + sId;
		}
		return sResult;
	},

	deliveryDateFormatter: function(sDeliveryDate, sAlsoLater) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
		var oLater = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.DeliveryAlsoLater") : "";

		var oDate = ui.s2p.mm.purchorder.approve.util.Conversions.formatLongDate(sDeliveryDate, true);

		if (sAlsoLater == null || sAlsoLater == "") {
			return oDate;
		} else if ( sap.ui.getCore().getConfiguration().getLanguage() == "zh-Hans") {
			return oDate + oLater;
		} else {
			return oDate + ' ' + oLater;
		}
	},

	// create a function that converts Strings into Dates
	fConvert : function(sDate) {
		var oDate = sDate;
		if (typeof sDate === "string") {
			// Handle the format /Date(miliseconds)/
			if (sDate.indexOf("Date") != -1) {
				sDate = sDate.substring(sDate.indexOf("(") + 1, sDate
						.indexOf(")"));
				sDate = new Number(sDate);
			}
			oDate = new Date(sDate);
		} else if (typeof sDate !== "object" || sDate === null) {
			// console.warn("DateTimeFormatter:: Neither a Date Object nor a
			// String was passed. Unable to format " + typeof sDate);
			oDate = "";
		}
		return oDate;
	},

	formatLongDate : function(oDate, bUTC) {
		var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({style : "medium"}, sap.ui.getCore().getConfiguration().getLocale());

		oDate = ui.s2p.mm.purchorder.approve.util.Conversions.fConvert(oDate);
		if (oDate === "") {
			return "";
		}
		return formatter.format(oDate, bUTC);
	},

	deliveryHeaderFormatter: function(sDeliveryDate, sAlsoLater) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
		var prefix = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.deliveryOn") : "";
		return prefix + ' '
				+ ui.s2p.mm.purchorder.approve.util.Conversions.deliveryDateFormatter(sDeliveryDate, sAlsoLater);
	},

	itemsTableHeader: function(sItemsCount) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
		if (sItemsCount === undefined || sItemsCount === null || parseInt(sItemsCount) == 0) {
			return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.noItem") : "";
		} else {
			return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.multipleItems", [parseInt(sItemsCount)]) : "";
		};
	},

	serviceLinesTableHeader: function(sItemsCount) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
		if (sItemsCount === undefined || sItemsCount === null || parseInt(sItemsCount) == 0) {
			return '';
		} else {
			return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.multipleLines", [parseInt(sItemsCount)]) : "";
		};
	},

	commonCountVisibilityTrigger: function(sCount) {
		if (sCount !== null && sCount !== undefined && sCount != '0') {
			return true;
		} else {
			return false;
		};
	},

	materialVisibilityTrigger: function(sProductLineType) {
		if (sProductLineType !== "L" && sProductLineType !== "S") {
			return true;
		}
		return false;
	},

	serviceVisibilityTrigger: function(sProductLineType) {
		if (sProductLineType == "S") {
			return true;
		}
		return false;
	},

	limitVisibilityTrigger: function(sProductLineType) {
		if (sProductLineType == "L") {
			return true;
		}
		return false;
	},

	ItemServiceLineVisibilityTrigger: function(sNumberSLine) {
		if (sNumberSLine == '' || sNumberSLine == null || sNumberSLine == "0") {
			return false;
		} else {
			return true;
		}
	},

	ItemLimitVisibilityTrigger: function(sLimitVal, sExpectedVal, sCategory) {
		if (sCategory == "S" && ((sLimitVal && parseFloat(sLimitVal) > 0) || (sExpectedVal && parseFloat(sExpectedVal) > 0))) {
			return true;
		} else {
			return false;
		}
	},

	ItemAccountAssignmentVisibilityTrigger: function(oAccounting) {
   		if (oAccounting !== null && oAccounting !== undefined && oAccounting.length !== 0) {
			return true;
		} else {
			return false;
		}
	},

	GetAccountAssignmentVisibility: function(oAccounting, oObj) {
		if (!oAccounting) {return true;}
		if (!oAccounting[0]) {return true;}

		var sPath = oAccounting[0];
		if (!oObj.getModel) {return true;}
		var oModel = oObj.getModel();
		if (!oModel) {return true;}
		if (!oModel.oData) {return true;}
		var oFirstAccountingLine = oModel.oData[sPath];
		if (!oFirstAccountingLine) {return true;}

		if ( (oFirstAccountingLine.CostCentre === "" || oFirstAccountingLine.CostCentre === undefined) &&
			 (oFirstAccountingLine.WBSElement === "" || oFirstAccountingLine.WBSElement === undefined) &&
			 (oFirstAccountingLine.Network === ""    || oFirstAccountingLine.Network === undefined) &&
			 (oFirstAccountingLine.Order === ""      || oFirstAccountingLine.Order === undefined) &&
			 (oFirstAccountingLine.SalesOrder === "" || oFirstAccountingLine.SalesOrder === undefined) &&
			 (oFirstAccountingLine.Asset === ""      || oFirstAccountingLine.Asset === undefined) ) {
			return true;
		} 
		return false;
	},

	OldAccountAssignmentVisibilityTrigger: function(oAccounting) {
		var that = this;
		return ui.s2p.mm.purchorder.approve.util.Conversions.GetAccountAssignmentVisibility(oAccounting, that);
	},

	NewAccountAssignmentVisibilityTrigger: function(oAccounting) {
		var that = this;
		var bResult = ui.s2p.mm.purchorder.approve.util.Conversions.GetAccountAssignmentVisibility(oAccounting, that);
		if (bResult === true) {
			return false;
		}
		return true;
	},

	ItemNoteVisibilityTrigger: function(oNumberOfNotes) {
		if (oNumberOfNotes == '' || oNumberOfNotes == null || oNumberOfNotes == "0" || oNumberOfNotes == 0) {
			return false;
		} else {
			return true;
		};
	},
	
	formatAttachmentIcon: function(sMimeType) {
		return sap.ca.ui.model.format.FormattingLibrary.formatAttachmentIcon(sMimeType);
	},
	
	formatAttachmentSize: function(sFileSize) {
		var formatter = sap.ca.ui.model.format.FileSizeFormat.getInstance();
		return formatter.format(sFileSize);
	},

	formatAttachmentDesc: function(sDescription, sMimeType) {
		if (sDescription) {
			return sDescription;
		}
		return sMimeType;
	},

	ItemAttachmentVisibilityTrigger: function(oNumberOfAttachments) {
		if (oNumberOfAttachments == '' || oNumberOfAttachments == null || oNumberOfAttachments == "0"
				|| oNumberOfAttachments == 0) {
			return false;
		} else {
			return true;
		};
	},

	forwardedBy: function(sReassignByName) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
		var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.forwarded") : "";

		if (sReassignByName === null || sReassignByName == ""){
			return '';
		} else {
		return sResult + ' ' + sReassignByName;
		};
	},

	substitutedBy: function(sSubstitutingForName) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
		var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.substituted") : "";
		if (sSubstitutingForName === null || sSubstitutingForName == ""){
			return '';
		} else {
			return sResult + ' ' + sSubstitutingForName;
		};
	},

	
	customerNameFormatter : function(sCustomerName, sCustomerID){
		if (sCustomerID !== '' && sCustomerID !== undefined && sCustomerID !== null) {
			return sCustomerName + ' (' + sCustomerID + ')';
		} else {
			return sCustomerName;
		};
	},	
	
	plantVisibilityTrigger : function(plantName, customerName, customerID, sItemType){
		if ((plantName !== '' || plantName !== null) && 
				(customerName === '' || customerName === null || customerName === undefined) &&
				(customerID === '' || customerID === null || customerID === undefined) && sItemType !== "5"	) {
			return true;
		} else {
			return false;
		};
	},
	
	customerNameVisibilityTrigger : function (sCustomerName, sCustomerID){
		//visibility trigger for showing label "Customer"
		//visibility is true, if  sCustomerName and sCustomerID is set
		if (sCustomerName !== '' && sCustomerName !== undefined && sCustomerName !== null &&
				sCustomerID !== '' && sCustomerID !== undefined && sCustomerID !== null){
			return true;
		}else{
			return false;
		}
	},
	
	freestyleNameVisibilityTrigger : function (sCustomerName, sCustomerID){
		//visibility trigger for showing label "Name"
		//visibility is true, if  sCustomerName is set and sCustomerID is empty
		if (sCustomerName !== '' && sCustomerName !== undefined && sCustomerName !== null &&
				(sCustomerID === '' || sCustomerID === undefined || sCustomerID === null)){
			return true;
		}else{
			return false;
		}
	},
	
	materialGroupFormatter: function(sMaterialGroup, sMaterialGroupDescription) {
		if (sMaterialGroup !== '' && sMaterialGroup !== undefined && sMaterialGroup !== null) {
			return sMaterialGroupDescription + ' (' + sMaterialGroup + ')';
		} else {
			return sMaterialGroupDescription;
		};
	},

	materialGroupVisibilityTrigger: function(sMaterialGroup, sMaterialGroupDescription) {
		if ((sMaterialGroup == '' || sMaterialGroup == null) && (sMaterialGroupDescription == '' || sMaterialGroupDescription == null)) {
			return false;
		} else {
			return true;
		};
	},

	materialIDVisibilityTrigger: function(sMaterialID)  {
		if (sMaterialID !== '' && sMaterialID !== undefined && sMaterialID !== null) {
			return true;
		} else {
			return false;
		};
	},

	// Expects a date in the browsers current timezone
	formatDaysAgo : function(oDate) {
		if (oDate == null || oDate == "") {
			return "";
		} else {
			var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({style : "daysAgo"}, sap.ui.getCore().getConfiguration().getLocale());
			var oFormatDate = formatter.format(oDate, true);
			return oFormatDate;
		}
	},
	
	formatNumberItemType: function(sValue, sItemType) {
		if (sItemType =='2') {
			return "";
		} else {
			return ui.s2p.mm.purchorder.approve.util.Conversions.formatAmount(sValue);
		}
	},
	
	formatNumberUnitItemType:function(sItemType, sCurrency) {
		if (sItemType === '2') {
			return "";
		} else {
			return sCurrency;	
		}
	},
	
	formatAmount: function(number){
		var formatter = sap.ui.core.format.NumberFormat.getCurrencyInstance({showMeasure: false});
		return formatter.format(number);
		
	},
	
	formatNumber: function (number, options) {
		var numValue  = ui.s2p.mm.purchorder.approve.util.Conversions.toNumeric(number);
		if (!isFinite(numValue)) {
			return "";
		}
		var formatOptions = ui.s2p.mm.purchorder.approve.util.Conversions.getFormatOptions(options);
		var numberFormatter = sap.ui.core.format.NumberFormat.getFloatInstance({}, formatOptions.locale);
		if (ui.s2p.mm.purchorder.approve.util.Conversions.hasRounding(options)) {
			numValue = ui.s2p.mm.purchorder.approve.util.Conversions.roundNumber(numValue, formatOptions);
			return numberFormatter.format(numValue);
		} else {
			return numberFormatter.format(number);
		}
	},

	toNumeric: function(obj) {
		return sap.ca.ui.model.format.FormatHelper.toNumeric(obj);
	},

	getFormatOptions: function(options, lazy) {
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

	roundNumber: function(number, options) {
		return sap.ca.ui.model.format.FormatHelper.roundNumber(number, options);
	},

	hasRounding: function(options) {
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

	businessCardImg: function(sMimeType, sImgUrl) {
		if (sMimeType) {
			return sImgUrl;
		} else {
			return null;
		}
	},
	
	onAttachment: function(oEvent) {
    
    	var oContext = oEvent.getSource().getBindingContext();
		var sMediaSrc = oContext.getProperty().__metadata.media_src;
		
		var sUrl = "";
	    if (sMediaSrc && typeof sMediaSrc === "string") {
	    	//########## change absolute to relative url
	        var oLink = document.createElement("a");
	        oLink.href = sMediaSrc;	        
	        sUrl = (oLink.pathname.charAt(0) === "/") ? oLink.pathname : "/" + oLink.pathname;	//InternetExplorer needs a "/" at the beginning
	        //##########
	        
//	          if (sap.ui.Device.system.phone || sap.ui.Device.system.tablet) {
	        	sap.m.URLHelper.redirect(sUrl, true);
//	        } else {
//	             sap.m.URLHelper.redirect(sUrl, false);
//	        }
	        
	    }
	}
};
},
	"ui/s2p/mm/purchorder/approve/view/AccountAssignmentTable.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */

sap.ui.controller("ui.s2p.mm.purchorder.approve.view.AccountAssignmentTable", {

    onInit: function() {

    }

});

},
	"ui/s2p/mm/purchorder/approve/view/AccountAssignmentTable.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View \n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\txmlns:layout="sap.ui.layout"\n\tcontrollerName="ui.s2p.mm.purchorder.approve.view.AccountAssignmentTable">\n\t<Table\n\t\tid="accountAssignmentView_TableAcc"\n\t\tclass="mmPurchorderApprove_padding_rl"\n\t\tnoDataText="{i18n>view.PurchaseOrder.placeholder}"\n\t\theaderText="{i18n>view.PurchaseOrder.accountAssignmentLabel}"\n\t\tvisible="{parts : [{path : \'Accountings\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.ItemAccountAssignmentVisibilityTrigger\'}"\n\t\titems="{Accountings}">\n \t\t<columns>\n \t\t\t<Column\n \t\t\t\thAlign="Left"\n \t\t\t\tvisible="{parts : [{path : \'Accountings\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.OldAccountAssignmentVisibilityTrigger\'}">\n \t\t\t\t<header> \n \t\t\t\t\t<Label\n \t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.descriptionLabel}">\n \t\t\t\t\t</Label>\n \t\t\t\t</header>\n \t\t\t</Column>\n \t\t\t<Column\n \t\t\t\thAlign="Left"\n \t\t\t\tdemandPopin="true"\n \t\t\t\tminScreenWidth="Tablet"\n \t\t\t\tvisible="{parts : [{path : \'Accountings\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.OldAccountAssignmentVisibilityTrigger\'}">\n \t\t\t\t<header>\n \t\t\t\t\t<Label \n \t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.category}">\n \t\t\t\t\t</Label>\n \t\t\t\t</header>\n \t\t\t</Column>\n \t\t\t<Column\n \t\t\t\thAlign="Left"\n \t\t\t\tvisible="{parts : [{path : \'Accountings\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.NewAccountAssignmentVisibilityTrigger\'}">\n \t\t\t\t<header> \n \t\t\t\t\t<Label\n \t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.accountAssignmentObjects}">\n \t\t\t\t\t</Label>\n \t\t\t\t</header>\n \t\t\t</Column>\n \t\t\t<Column\n \t\t\t\thAlign="Left"\n \t\t\t\tdemandPopin="true"\n \t\t\t\tminScreenWidth="Tablet">\n \t\t\t\t<header>\n \t\t\t\t\t<Label \n \t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.account}">\n \t\t\t\t\t</Label>\n \t\t\t\t</header>\n \t\t\t</Column>\n \t\t\t<Column\n \t\t\t\thAlign="Right"\n \t\t\t\tdemandPopin="true"\n \t\t\t\tminScreenWidth="Tablet">\n \t\t\t\t<header>\n \t\t\t\t\t<Label \n \t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.accountAssignmentPercentage}">\n \t\t\t\t\t</Label>\n \t\t\t\t</header>\n \t\t\t</Column>\n \t\t</columns>\n \t\t<items>\n \t\t\t<ColumnListItem\n \t\t\t\ttype="Inactive"> \n \t\t\t\t<cells>\n \t\t\t\t\t<ObjectIdentifier\n \t\t\t\t\t\ttitle="{parts:[{path : \'AccountDescription\'}, {path : \'AccountNumber\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter\'}">\n\t\t\t\t\t</ObjectIdentifier>\n \t\t\t\t\t<Text \n \t\t\t\t\t\ttext="{AccountCategoryDescription}">\n \t\t\t\t\t</Text>\n \t\t\t\t\t<layout:VerticalLayout>\n \t\t\t\t\t\t<ObjectIdentifier\n \t\t\t\t\t\t\ttitle="{parts:[{path : \'CostCentreDescription\'}, {path : \'CostCentre\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter\'}"\n \t\t\t\t\t\t\tvisible="{parts : [{path : \'CostCentre\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</ObjectIdentifier>\n \t\t\t\t\t\t<Text \n \t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.accountAssignmentCostCentre}"\n \t\t\t\t\t\t\tvisible="{parts : [{path : \'CostCentre\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n \t\t\t\t\t\t</Text>\n \t\t\t\t\t\t<ObjectIdentifier\n \t\t\t\t\t\t\ttitle="{parts:[{path : \'WBSElementDescription\'}, {path : \'WBSElement\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter\'}"\n \t\t\t\t\t\t\tvisible="{parts : [{path : \'WBSElement\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</ObjectIdentifier>\n \t\t\t\t\t\t<Text \n \t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.accountAssignmentWBSElement}"\n \t\t\t\t\t\t\tvisible="{parts : [{path : \'WBSElement\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n \t\t\t\t\t\t</Text>\n \t\t\t\t\t\t<ObjectIdentifier\n \t\t\t\t\t\t\ttitle="{parts:[{path : \'NetworkDescription\'}, {path : \'Network\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter\'}"\n \t\t\t\t\t\t\tvisible="{parts : [{path : \'Network\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</ObjectIdentifier>\n \t\t\t\t\t\t<Text \n \t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.accountAssignmentNetwork}"\n \t\t\t\t\t\t\tvisible="{parts : [{path : \'Network\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n \t\t\t\t\t\t</Text>\n \t\t\t\t\t\t<ObjectIdentifier\n \t\t\t\t\t\t\ttitle="{parts:[{path : \'OrderDescription\'}, {path : \'Order\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter\'}"\n \t\t\t\t\t\t\tvisible="{parts : [{path : \'Order\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</ObjectIdentifier>\n \t\t\t\t\t\t<Text \n \t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.accountAssignmentOrder}"\n \t\t\t\t\t\t\tvisible="{parts : [{path : \'Order\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n \t\t\t\t\t\t</Text>\n \t\t\t\t\t\t<ObjectIdentifier\n \t\t\t\t\t\t\ttitle="{parts:[{path : \'SalesOrder\'}, {path : \'SalesOrderItem\'}, {path : \'SalesOrderScheduleLine\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.salesOrderIDFormatter\'}"\n \t\t\t\t\t\t\tvisible="{parts : [{path : \'SalesOrder\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</ObjectIdentifier>\n \t\t\t\t\t\t<Text \n \t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.accountAssignmentSalesOrder}"\n \t\t\t\t\t\t\tvisible="{parts : [{path : \'SalesOrder\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n \t\t\t\t\t\t</Text>\n \t\t\t\t\t\t<ObjectIdentifier\n \t\t\t\t\t\t\ttitle="{parts:[{path : \'AssetDescription\'}, {path : \'Asset\'}, {path : \'AssetSubNumber\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.assetIDFormatter\'}"\n \t\t\t\t\t\t\tvisible="{parts : [{path : \'Asset\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</ObjectIdentifier>\n \t\t\t\t\t\t<Text \n \t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.accountAssignmentAsset}"\n \t\t\t\t\t\t\tvisible="{parts : [{path : \'Asset\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n \t\t\t\t\t\t</Text>\n \t\t\t\t\t\t<ObjectIdentifier\n \t\t\t\t\t\t\ttitle="{parts:[{path : \'ProfitCenterDescription\'}, {path : \'ProfitCenter\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter\'}"\n \t\t\t\t\t\t\tvisible="{parts : [{path : \'ProfitCenter\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t</ObjectIdentifier>\n \t\t\t\t\t\t<Text \n \t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.ProfitCenter}"\n \t\t\t\t\t\t\tvisible="{parts : [{path : \'ProfitCenter\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n \t\t\t\t\t\t</Text>\n \t\t\t\t\t</layout:VerticalLayout>\n \t\t\t\t\t<Text \n \t\t\t\t\t\ttext="{parts:[{path : \'GlAccountDescription\'}, {path : \'GlAccountNumber\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter\'}">\n \t\t\t\t\t</Text>\n \t\t\t\t\t<ObjectNumber \n \t\t\t\t\t\tnumber="{parts:[{path: \'DistributionPercentage\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.formatNumber\'}"\n \t\t\t\t\t\tnumberUnit="{parts:[{path: \'DistributionPercentage\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.accountAssignmentPercentageFormatter\'}">\n \t\t\t\t\t</ObjectNumber>\n \t\t\t\t</cells>\n \t\t\t</ColumnListItem>\n \t\t</items>\n \t</Table>\n</core:View>\n',
	"ui/s2p/mm/purchorder/approve/view/ItemServiceLimit.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.purchorder.approve.view.ItemServiceLimit", {

	onInit: function() {

		this.oView = this.getView();

		// Get connection manager/resource bundle
		if (!this.oApplication) {
			this.oApplication = sap.ca.scfld.md.app.Application.getImpl();
			this.oConfiguration = this.oApplication.oConfiguration;
			this.oConnectionManager = this.oApplication.getConnectionManager();
			this.resourceBundle = this.oApplication.getResourceBundle();
			this.oDataModel = this.oApplicationFacade.getODataModel();
		}

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "itemServiceLimit") {
				this.sOrigin = oEvent.getParameter("arguments").SAP__Origin;
				this.sWorkitemID = oEvent.getParameter("arguments").WorkitemID;
				this.sPoNumber = oEvent.getParameter("arguments").PoNumber;
				this.sItemNumber = oEvent.getParameter("arguments").ItemNumber;

				var description = oEvent.getParameter("arguments").LimitDescription;

				var sItemServiceLineContextPath = "/LimitCollection(" +
												  "SAP__Origin='" + this.sOrigin + 
												  "',PoNumber='" + this.sPoNumber +
												  "',ItemNumber='" + this.sItemNumber +
												  "',LimitDescription='" + description + "')";

				this.getView().setBindingContext(new sap.ui.model.Context(this.getView().getModel(),sItemServiceLineContextPath));

				this.setLocalHeaderFooterOptions();
			}
		}, this);

		/**
		 * @ControllerHook Limit / onInit
		 * With this controller method the onInit method of the ItemServiceLimit controller can be enhanced.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookOnInit
		 */
		if (this.extHookOnInit) {
			this.extHookOnInit();
		}
	},

	setLocalHeaderFooterOptions: function() {
		var that = this;
		var sHDColl = "HeaderDetailCollection(" + "SAP__Origin='" + this.sOrigin + "',PoNumber='" + this.sPoNumber + "')";
		var sIDColl = "ItemDetailCollection(" + "SAP__Origin='" + this.sOrigin + "',ItemNumber='" + this.sItemNumber +
						"',PoNumber='" + this.sPoNumber + "')";

		var ItemsCollection = this.oDataModel.getProperty("/"+sHDColl+'/ItemDetails');
		if ( typeof ItemsCollection === "undefined" ) {
			//in case someone directly navigates to the details screen, we don't have oDataModel loaded and need to navigate back to the S3 screen
			this.navBack();
			return;
		}
		var numOfItems = ItemsCollection.length;
		var currentItemIndex = ItemsCollection.indexOf(sIDColl);

		var oLocalHeaderFooterOptions = {
			onBack: function() {
				that.navBack();
			},
			sDetailTitle: this.getS9LimitPageTitle(currentItemIndex + 1, numOfItems)
		};

		/**
		 * @ControllerHook Limit / HeaderFooterOptions
		 * With this controller method the setLocalHeaderFooterOptions method of the ItemServiceLimit controller
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

	_refresh: function(channelId, eventId, data) {
		//Override and do nothing
	},

	getS9LimitPageTitle: function(sCurrentId, sTotalNum){
		return this.resourceBundle.getText("view.ItemServiceLimit.title", [sCurrentId, sTotalNum]);
	},

	navBack: function() {
		if (this.sOrigin !== "" && this.sWorkitemID !== "") {
			this.oRouter.navTo("itemDetails", {
				SAP__Origin: this.sOrigin,
				WorkitemID: this.sWorkitemID,
				PoNumber: this.sPoNumber,
				ItemNumber:  this.sItemNumber
			}, true);
		}
	}

});
},
	"ui/s2p/mm/purchorder/approve/view/ItemServiceLimit.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View \n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:layout="sap.ui.layout"\n\tcontrollerName="ui.s2p.mm.purchorder.approve.view.ItemServiceLimit">\n\t\n\t<!-- View for S9 screen of Service Limit -->\n\t<Page\n\t\tid="limitdetail"\n\t\tclass="sapUiFioriObjectPage"\n\t\tenableScrolling="true">\n\t    \n\t    <!-- Header of Service Limit (ItemServiceLimitHeader) -->\n \t\t<ObjectHeader\n \t\t\tid="Header"\n\t\t\tintroActive="false"\n\t\t\ttitle="{LimitDescription}"\n\t\t\tnumber="{parts : [{path : \'ExpectedValue\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.formatAmount\'}"\n\t\t\tnumberUnit="{Currency}">\n     \t\t<attributes>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="HeaderAttributeExpectedValue"\n\t\t\t\t\ttext="{parts : [{path : \'ExpectedValue\'}, {path : \'Currency\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.expectedValueFormatter\'}"\n\t\t\t\t\tactive="false">\n\t\t\t\t</ObjectAttribute>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="HeaderAttributeValueLimit"\n\t\t\t\t\ttext="{parts : [{path : \'ValueLimit\'}, {path : \'IsValueUnLimited\'}, {path : \'Currency\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.valueLimitFormatter\'}" \n\t\t\t\t\tactive="false">\n\t\t\t\t</ObjectAttribute>\n\t\t\t</attributes>\n\n\t\t\t<!-- @ExtensionPoint extServiceLimitHeaderInfo: limit information -->\n\t\t\t<core:ExtensionPoint name="extServiceLimitHeaderInfo" />\n\t\t</ObjectHeader>\n\t\t<!-- end of Header of Service Limit (ItemServiceLimitHeader) -->\n\n\t\t<!-- Accounting Table of Service Limit (ItemServiceLimitAccounting) -->\n \t\t<mvc:XMLView\n\t\t\tviewName="ui.s2p.mm.purchorder.approve.view.AccountAssignmentTable"\n\t\t\tid="AccountAssignmentCommonView">\n\t\t</mvc:XMLView>\n\t\t<!-- end of Accounting Table of Service Limit (ItemServiceLimitAccounting) -->\n\t\t\n\t</Page>\n</core:View>',
	"ui/s2p/mm/purchorder/approve/view/ItemServiceLine.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.purchorder.approve.view.ItemServiceLine", {

	sOrigin : "",
	sWorkitemID : "",
	sPoNumber : "",
	sItemNumber : "",
	sSrvLine : "",

	onInit: function() {
		this.getView().getModel().setSizeLimit(1000000);
		this.oView = this.getView();

		// Get connection manager/resource bundle
		if (!this.oApplication) {
			this.oApplication = sap.ca.scfld.md.app.Application.getImpl();
			this.oConfiguration = this.oApplication.oConfiguration;
			this.oConnectionManager = this.oApplication.getConnectionManager();
			this.resourceBundle = this.oApplication.getResourceBundle();
			this.oDataModel = this.oApplicationFacade.getODataModel();
		}

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "itemServiceLine") {
				this.sOrigin = oEvent.getParameter("arguments").SAP__Origin;
				this.sWorkitemID = oEvent.getParameter("arguments").WorkitemID;
				this.sPoNumber = oEvent.getParameter("arguments").PoNumber;
				this.sItemNumber = oEvent.getParameter("arguments").ItemNumber;
				this.sSrvLine = oEvent.getParameter("arguments").ServiceLineNumber;

				var sItemServiceLineContextPath = "/ServiceLineCollection(" +
												  "SAP__Origin='" + this.sOrigin + 
												  "',PoNumber='" + this.sPoNumber +
												  "',ItemNumber='" + this.sItemNumber +
												  "',ServiceLineNumber='" + oEvent.getParameter("arguments").ServiceLineNumber + "')";
				this.getView().setBindingContext(new sap.ui.model.Context(this.getView().getModel(),sItemServiceLineContextPath));

				this.setLocalHeaderFooterOptions();
			}
		}, this);

		/**
		 * @ControllerHook Service Line / onInit
		 * With this controller method the onInit method of the ItemServiceLine controller can be enhanced.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookOnInit
		 */
		if (this.extHookOnInit) {
			this.extHookOnInit();
		}
	},

	setLocalHeaderFooterOptions: function() {
		var that = this;

		var sIDColl = this._itemDetailCollection(this.sOrigin, this.sItemNumber, this.sPoNumber);
		var sSLColl = this._serviceLineCollection(this.sOrigin, this.sPoNumber, this.sItemNumber, this.sSrvLine);
		
		var ServicesCollection = this.oDataModel.getProperty("/"+sIDColl+'/ServiceLines');
		if ( typeof ServicesCollection === "undefined" ) {
			//in case someone directly navigates to the details screen, we don't have oDataModel loaded and need to navigate back to the S3 screen
			this.navBack();
			return;
		}
		var len = ServicesCollection.length;
		var currentSrvIndex = ServicesCollection.indexOf(sSLColl);

		var sView = this.oRouter.getView("ui.s2p.mm.purchorder.approve.view.S4");
		var sController = sView.getController();

		var oLocalHeaderFooterOptions = {
			onBack: function() {
				that.navBack();
			},
			oUpDownOptions: {
				iPosition: currentSrvIndex,
				iCount: len,
				fSetPosition: function (iNewItem) {
					if ((iNewItem >= 0) && (iNewItem < len)) {
						var path = ServicesCollection[iNewItem];
						var sSrvLine = that.oDataModel.getProperty('/' + path).ServiceLineNumber;

						that.oRouter.navTo("itemServiceLine", {
							SAP__Origin: that.sOrigin,
							WorkitemID: that.sWorkitemID,
							PoNumber: that.sPoNumber,
							ItemNumber: that.sItemNumber,
							ServiceLineNumber: sSrvLine
						}, true);
					}
				},
				sI18NDetailTitle: "view.ItemServiceLine.title",
				oParent: sController
			}
		};

		/**
		 * @ControllerHook Service Line / HeaderFooterOptions
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

	_refresh: function(channelId, eventId, data) {
		//Override and do nothing
	},

	navBack : function() {
		if (this.sOrigin !== "" && this.sWorkitemID !== "") {
			this.oRouter.navTo("itemDetails", {
				SAP__Origin: this.sOrigin,
				WorkitemID: this.sWorkitemID,
				PoNumber: this.sPoNumber,
				ItemNumber:  this.sItemNumber
			}, true);
		}
	},

	_headerDetailCollection: function(sOrigin, sPoNumber) {
		var sResult = "HeaderDetailCollection(SAP__Origin='" + sOrigin + "',PoNumber='" + sPoNumber + "')";
		return sResult;
	},

	_itemDetailCollection: function(sOrigin,sItemNumber,sPoNumber) {
		var sResult = "ItemDetailCollection(SAP__Origin='" + sOrigin + "',ItemNumber='" + sItemNumber +
					"',PoNumber='" + sPoNumber + "')";
		return sResult;
	},

	_serviceLineCollection: function(sOrigin,sPoNumber,sItemNumber,sServLineNo) {
		var sResult = "ServiceLineCollection(SAP__Origin='" + sOrigin + "',PoNumber='" + sPoNumber +
					"',ItemNumber='" + sItemNumber + "',ServiceLineNumber='" + sServLineNo + "')";
		return sResult;	
	}

});
},
	"ui/s2p/mm/purchorder/approve/view/ItemServiceLine.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View \n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:form="sap.ui.layout.form"\n\txmlns:layout="sap.ui.layout"\n\tcontrollerName="ui.s2p.mm.purchorder.approve.view.ItemServiceLine">\n\t\n \t<!-- S9 screen of Service Lines -->\t\n\t<Page\n\t    id="servicedetail"\n\t\tclass="sapUiFioriObjectPage"\n\t\tenableScrolling="true">\n\t\t\n\t\t<!-- Header of Service Lines (ItemServiceLineHeader) -->\n\t\t<ObjectHeader\n\t\t\tid="Header"\n\t\t\tintroActive="false"\n\t\t\ttitle="{Description}"\n\t\t\tnumber="{parts : [{path: \'Value\'}], formatter: \'ui.s2p.mm.purchorder.approve.util.Conversions.formatAmount\'}"\n\t\t\tnumberUnit="{Currency}">\n     \t\t<attributes>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="HeaderAttributeQuantity"\n\t\t\t\t\ttext="{parts : [{path : \'Quantity\'}, {path : \'UnitDescription\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.quantityFormatter\'}"\n\t\t\t\t\tactive="false">\n\t\t\t\t</ObjectAttribute>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="HeaderAttributeQuantityForPPU"\n\t\t\t\t\ttext="{parts : [{path : \'QuantityForPPU\'}, {path : \'UnitForPPUDescription\'}, {path : \'PricePerUnit\'}, {path : \'CurrencyForPPU\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.quantityPerUnitFormatter\'}"\n\t\t\t\t\tactive="false">\n\t\t\t\t</ObjectAttribute>\n\t\t\t</attributes>\n\n\t\t\t<!-- @ExtensionPoint extServiceLineHeaderInfo: service line information -->\n\t\t\t<core:ExtensionPoint name="extServiceLineHeaderInfo" />\n\t\t</ObjectHeader>\n\t\t<!-- end of Header of Service Lines (ItemServiceLineHeader) -->\n\n\t    <!-- Information area of Service Lines (ItemServiceLineInfo) -->\n\t\t<form:Form\n\t\t\tid="serviceDtlView_ServLineFormPrice"\n\t\t\tvisible="{parts : [{path : \'ServiceID\'}, {path : \'LongDescription\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.serviceInformationVisibilityTrigger\'}">\n\t\t\t<form:layout>\n\t\t\t\t<form:ResponsiveLayout \n\t\t\t\t\tid="serviceDtlView_ServLineFormLayout"> \n\t\t\t\t</form:ResponsiveLayout>\n\t\t\t</form:layout>\n\t\t\t<form:formContainers>\n\t\t\t\t<form:FormContainer \n\t\t\t\t\tid = "serviceDtlView_InfoContainer"\n\t            \ttitle="{i18n>view.PurchaseOrder.information}">\n\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t<form:formElements>\n\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\tid="serviceDtlView_InfoContainerServiceID"\n\t\t\t\t\t\t\tvisible="{parts : [{path : \'ServiceID\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t        <form:layoutData>\n\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t    margin="false">\n\t\t\t\t\t\t\t    </layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t        </form:layoutData>\n\t\t\t\t\t        <form:label>\n\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\tid="serviceDtlView_Service"\n\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.serviceLineIdLabel}">\n\t\t\t\t\t\t\t\t</Label>\t\t\t\t\t\t\n\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t        <form:fields>\n\t\t\t\t\t\t\t\t<Text text="{ServiceID}">\n\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t</form:FormElement>\t\t\t\n\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\tid="serviceDtlView_InfoContainerLongDescription"\n\t\t\t\t\t\tvisible="{parts : [{path : \'LongDescription\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\tid= "serviceDtlView_Desc"\n\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.descriptionLabel}">\n\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\tid="serviceDtlView_DescTx"\n\t\t\t\t\t\t\t\t    text="{LongDescription}">\n\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t</form:formElements>\n\t\t\t\t</form:FormContainer>\n\t\t\t</form:formContainers>\n\t\t</form:Form>\n\t    <!-- end of Information area of Service Lines (ItemServiceLineInfo) -->\n\n\t\t<!-- Accounting Table of Service Lines (ItemServiceLineAccounting) -->  \t \n\t\t<mvc:XMLView\n\t\t\tviewName="ui.s2p.mm.purchorder.approve.view.AccountAssignmentTable"\n\t\t\tid="AccountAssignmentCommonView">\n\t\t</mvc:XMLView>\n\t\t<!-- end of Accounting Table of Service Lines (ItemServiceLineAccounting) -->\n\t\t\n\t</Page>\n</core:View>',
	"ui/s2p/mm/purchorder/approve/view/S2.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("ui.s2p.mm.purchorder.approve.util.Conversions");
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
 
sap.ca.scfld.md.controller.ScfldMasterController.extend("ui.s2p.mm.purchorder.approve.view.S2", {

	onInit: function() {
		this.getView().getModel().setSizeLimit(1000000);
		this.getData();
		this.bIsApproved = false;
		var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
		var oComponent = sap.ui.component(sComponentId);

		oComponent.oEventBus.subscribe("ui.s2p.mm.purchorder.approve", "selectNextWorkItem", this._selectNextWorkItem, this);
		var oList = this.getList();

		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "detail") {
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
				if (!this.aNextItems) {
					var oList = this.getList();
					var oSelectedItem = oList.getSelectedItem();
					if (oSelectedItem !== null) {
						var iSelectedItemIndex = oList.indexOfItem(oSelectedItem);
						var iNumberOfItems = oList.getItems().length;
						this.aNextItems = [];
						var iNextItemIndex = iSelectedItemIndex + 1;
						var iNextAfterNextItemIndex = iSelectedItemIndex + 2;
						this.aNextItems.push(oSelectedItem);
						if (iNumberOfItems >= iNextAfterNextItemIndex) {
							this.aNextItems.push(oList.getItems()[iNextItemIndex]);
							this.aNextItems.push(oList.getItems()[iNextAfterNextItemIndex]);
						} else if (iNumberOfItems >= iNextItemIndex) {
							this.aNextItems.push(oList.getItems()[iNextItemIndex]);
						};
					} else {
						this.showEmptyView("DETAIL_TITLE", "NO_ITEMS_AVAILABLE");
					}
				} else if (this.aNextItems && this.getList().getItems().length > 0) {
					if (!this.getList().getSelectedItem()) {
						var bFound = false;
						for (var i in this.aNextItems) {
							var oItem = this.findItemByContextPath(this.aNextItems[i].getBindingContextPath());
							if (oItem) {
								this.setListItem(oItem);
								bFound = true;
								break;
							};
						};
						if (!bFound) {
							this.selectFirstItem();
						};
					}
				} else {
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
	 * @private [_selectNextWorkItem on after approval/reject/forward, to select next row in desktop mode]
	 */
	_selectNextWorkItem: function(channelId, eventId, data) {
		if (eventId === "selectNextWorkItem") {
			if (sap.ui.Device.system.phone) {
				// Navigation to s2 view is only necessary for mobile phones because only one view can be displayed there (s2 or s3)
				window.history.go(-1);
			}
			var oList = this.getList();
			oList.getBinding('items').refresh();
			oList.attachEventOnce("updateFinished", function() {
				if (data.bMessageToast && data.bMessageToast === true && data.sMessage) {
					sap.m.MessageToast.show(data.sMessage, {
						duration: 3500
					});
				}
			}, this);
		}
	},

	getData: function() {
		var oList = this.getList();
		var oTemplate = oList.getItems()[0].clone();
		var oSorter = new sap.ui.model.Sorter("WiCreatedAt", true);
		var aFilters = [];

		oList.bindItems("/WorkflowTaskCollection", oTemplate, oSorter, aFilters);
	},

	getHeaderFooterOptions: function() {
		var oLocalHeaderFooterOptions = {
			sI18NMasterTitle: "MASTER_TITLE"
		};

		/**
		 * @ControllerHook S2 (List) / HeaderFooterOptions With this controller method the getHeaderFooterOptions method of the S2 (List) controller can be enhanced to change the HeaderFooterOptions.
		 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookSetHeaderFooterOptions
		 * @param {object}
		 *            oLocalHeaderFooterOptions
		 * @return {object} oLocalHeaderFooterOptions
		 */
		if (this.extHookSetHeaderFooterOptions) {
			oLocalHeaderFooterOptions = this.extHookSetHeaderFooterOptions(oLocalHeaderFooterOptions);
		}

		return oLocalHeaderFooterOptions;
	},

	_getODataSearchFields: function() {
		var aODataSearchFields = ["CreatedByName", "ForwardedByName", "ItemDescriptions", "PoNumber", "PoNumberFormatted", "SearchForText",
			"SubstitutingForName", "SupplierID", "SupplierName", "WiCreatedAt", "WorkitemID"
		];
		/**
		 * @ControllerHook S2 (List) / Search With this controller method the document search can be changed. It is possible to remove or add oData search fields.
		 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookModifySearchableODataFieldsForMasterListSearch
		 * @param {object[]}
		 *            An array which contains the oData fields which will be searchable.
		 * @return {object[]} An array which contains the oData fields which will be searchable.
		 */
		if (this.extHookModifySearchableODataFieldsForMasterListSearch) {
			aODataSearchFields = this.extHookModifySearchableODataFieldsForMasterListSearch(aODataSearchFields);
		}
		return aODataSearchFields;
	},

	_getTextsFromUIElementsForSearch: function(oItem) {
		var aUITexts = [];

		// default = add all UI texts to the array and add all attribute texts to the array
		if (oItem.getIntro())
			aUITexts.push(oItem.getIntro());
		if (oItem.getTitle())
			aUITexts.push(oItem.getTitle());
		if (oItem.getNumber())
			aUITexts.push(oItem.getNumber());
		if (oItem.getNumberUnit())
			aUITexts.push(oItem.getNumberUnit());
		if (oItem.getFirstStatus())
			aUITexts.push(oItem.getFirstStatus().getText());
		if (oItem.getSecondStatus())
			aUITexts.push(oItem.getSecondStatus().getText());

		var aAttributes = oItem.getAttributes();
		for (var j = 0; j < aAttributes.length; j++) {
			aUITexts.push(aAttributes[j].getText());
		}

		/**
		 * @ControllerHook S2 (List) / Search With this controller method the document search can be changed. It is possible to define which UI texts are searchable. By default all UI texts are
		 *                 searchable.
		 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookDefineSearchableUITextsForMasterListSearch
		 * @param {object}
		 *            An object - the List Item
		 * @return {object[]} An array which contains the UI texts which will be searchable.
		 */
		if (this.extHookDefineSearchableUITextsForMasterListSearch) {
			aUITexts = this.extHookDefineSearchableUITextsForMasterListSearch(oItem);
		}
		return aUITexts;
	},

	_searchOnODataFields: function(oItem, sFilterPattern) {
		var aODataSearchFields = this._getODataSearchFields();

		// oData data
		var oModel = oItem.getBindingContext(this.sModelName).getProperty();

		for (var iter = 0; iter <= aODataSearchFields.length; iter++) {
			var sKey = aODataSearchFields[iter];
			var sValue = "";
			if (sKey === "WiCreatedAt") {
				// enable comparing "medium-date-format" with "days-ago-format"
				// searching for e.g. "Yesterday" will match while searching on UI elements
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
		}
	},

	_searchOnUITexts: function(oItem, sFilterPattern) {
		var aUITexts = this._getTextsFromUIElementsForSearch(oItem);
		for (var iter = 0; iter <= aUITexts.length; iter++) {
			if (typeof aUITexts[iter] !== "undefined" && aUITexts[iter] !== "") {
				if (aUITexts[iter].toLowerCase().indexOf(sFilterPattern) !== -1) {
					return true;
				}
			}
		}
	},

	// Overwrite Scfhld. function because of do not using all OData-properties
	applySearchPatternToListItem: function(oItem, sFilterPattern) {
		if (sFilterPattern === "") {
			return true;
		}

		// Search on oData fields
		if (this._searchOnODataFields(oItem, sFilterPattern) === true) {
			return true;
		}

		// if nothing found in unformatted data, check UI elements
		if (this._searchOnUITexts(oItem, sFilterPattern) === true) {
			return true;
		}

		// if there is no match, return false
		return false;
	}
});
},
	"ui/s2p/mm/purchorder/approve/view/S2.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View \n  \txmlns:core="sap.ui.core"\n  \txmlns="sap.m"\n  \tcontrollerName="ui.s2p.mm.purchorder.approve.view.S2">\n\t<Page \n\t\tid="page" \n\t\ttitle="{i18n>MASTER_TITLE}">\n\t\t<content>\n\t\t\t<List \n\t\t\t\tid="list" \n\t\t\t\tmode="{device>/listMode}" \n\t\t\t\tselect="_handleSelect">  \n\t\t\t\t<ObjectListItem \n\t\t\t\t\tid="MAIN_LIST_ITEM" \n\t\t\t\t\ttype="{device>/listItemType}" \n\t\t\t\t\tpress="_handleItemPress"\n\t\t\t\t\ttitle="{SupplierName}"\n                    number="{parts:[{path : \'Value\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.lazyRoundNumber\'}"\n                    numberUnit="{Currency}">\n\t\t\t\t\t<firstStatus>\n\t\t\t\t\t\t<ObjectStatus\n\t\t\t\t\t\t\tid="ListStatusWiCreatedAt"\n\t\t\t\t\t\t\ttext="{parts:[{path:\'WiCreatedAt\'}], formatter:\'ui.s2p.mm.purchorder.approve.util.Conversions.deliveryDateFormatter\'}">\n\t\t\t\t\t\t</ObjectStatus>\n\t\t\t\t\t</firstStatus> \n\t\t\t\t\t<attributes> \n\t\t\t\t\t\t<ObjectAttribute id="ListAttributeItemDescription" text="{ItemDescriptions}" />\n\t\t\t\t\t\t<ObjectAttribute id="ListAttributeCreatedByName" text="{CreatedByName}" />\n\t\t\t\t\t\t<ObjectAttribute id="ListAttributeForwardedByName" text="{parts:[{path : \'ForwardedByName\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.forwardedBy\'}"\n\t\t\t\t\t\t\t\t\t\t visible="{parts:[{path : \'ForwardedByName\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}" />\n\t\t\t\t\t\t<ObjectAttribute id="ListAttributeSubstitutingForName" text="{parts:[{path : \'SubstitutingForName\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.substitutedBy\'}"\n\t\t\t\t\t\t\t\t\t\t visible="{parts:[{path : \'SubstitutingForName\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}" />\n\t\t\t\t\t</attributes>\n\n\t\t\t\t\t<!-- @ExtensionPoint extListItemInfo: document list (S2 view) -->\n\t\t\t\t\t<core:ExtensionPoint name="extListItemInfo" />\n\t\t\t\t</ObjectListItem>\n\t\t\t</List>\n\t\t</content>\n\t\t<footer>\n\t\t\t<Bar \n\t\t\t\tid="footer">\n\t\t\t</Bar>\n\t\t</footer>\n\t</Page>\n</core:View>',
	"ui/s2p/mm/purchorder/approve/view/S3.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("ui.s2p.mm.purchorder.approve.util.Conversions");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.dialog.factory");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.purchorder.approve.view.S3", {

	onInit: function() {
		this.getView().getModel().setSizeLimit(1000000);
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.oView = this.getView();

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "detail") {
				var sDetailContextPath = oEvent.getParameter("arguments").contextPath + "/HeaderDetails";
				sDetailContextPath = sDetailContextPath.replace("WorkflowTaskCollection", "/WorkflowTaskCollection");
				// Don't refresh the screen on a back navigation
				var oController = this;
				if (oController.sContext !== sDetailContextPath ||
					oController.sContext === "") {
					this.sContext = sDetailContextPath;
					this.refreshScreen(sDetailContextPath);
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

	refreshScreen: function(sDetailContextPath) {
		if (sDetailContextPath) {
			var oView = this.getView();
			oView.bindElement(sDetailContextPath, {
				expand: 'ItemDetails,Notes,Attachments,ItemDetails/Limits'
			});
			//make sure that the information tab will be selected
			if (this.oView.byId("tabBar").getSelectedKey() !== "contentInfo") {
				this.oView.byId("tabBar").setSelectedKey("contentInfo");
			}
			oView.getElementBinding().attachEventOnce("dataReceived",
				this.onDataLoaded, this);
		}
	},

	onDataLoaded: function(oEv) {
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
		this._updateListItem(oEv);

		/**
		 * @ControllerHook  S3 HeaderFooterOptions
		 * With this controller method the HeaderFooterOptions can be changed. For example it is possible to remove the reject-button.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookSetHeaderFooterOptions
		 * @param {object} oLocalHeaderFooterOptions: An object which contains the parameters for the HeaderFooterOptions.
		 * @return {object} oLocalHeaderFooterOptions: An object which contains the parameters for the HeaderFooterOptions.
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
			SAP__Origin: this.oView.getBindingContext().getProperty("SAP__Origin"),
			WorkitemID: this.oView.getBindingContext().getProperty("WorkitemID"),
			PoNumber: this.oView.getBindingContext().getProperty("PoNumber"),
			ItemNumber: oModel.getProperty(bc).ItemNumber
		}, true);
	},

	onAttachment: function(oEvent) {
		ui.s2p.mm.purchorder.approve.util.Conversions.onAttachment(oEvent);
	},

	openApproveRejectDialog: function(arg) {
		var CreatedByID = this.oView.getBindingContext().getProperty("CreatedByID");
		var sDialogQuestion = "";
		var sDialogTitle = "";
		var sDecisionKey = "";
		var that = this;

		switch (arg[0]) {
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

		new sap.m.Dialog(this.createId("s3ApproveRejectDialog"), {
			title: sDialogTitle,
			showHeader: true,
			content: [
				new sap.ui.layout.VerticalLayout({
					width: "100%",
					content: [
						new sap.m.Text(this.createId("S3ConfirmRejectDialogTextField"), {
							text: sDialogQuestion
						}).addStyleClass("sapUiSmallMarginBottom"),
						new sap.m.TextArea(this.createId("S3ConfirmRejectDialogTextFieldForNotes"), {
							maxLength: 0,
							width: "100%",
							placeholder: this.resourceBundle.getText("dialog.ApproveRejectForward.NotePlaceHolder"),
							editable: true
						})
					]
				})
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
			"POST", {
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
		var sSuccessText = "";
		if (oSuccess) {
			if (oSuccess.ApplyDecision.ActionSuccessful !== 'X') {
				//Approval or rejection of this purchase order is still in process. 
				//Refresh the list of purchase orders manually.
				var sMessage = this.resourceBundle.getText("dialog.refreshMasterListManually");
				var sDetails = null;
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.INFO,
					message: sMessage,
					details: sDetails
				});
			} else {
				//Approval or rejection of this purchase order was successfully proceed. 
				//Refresh the list of purchase orders automatically.
				sSuccessText = this.resourceBundle.getText(this.sTextKey);
				var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.oView),
					oComponent = sap.ui.component(sComponentId);
				var data = {
					bMessageToast: true,
					sMessage: sSuccessText
				};
				//create and open the message toast after the view switch (after automatic select of next work item)  
				oComponent.oEventBus.publish("ui.s2p.mm.purchorder.approve", "selectNextWorkItem", data);
				this.oDataModel.setRefreshAfterChange(true);
			}
		}
	},

	_handleApproveRejectForwardFail: function(oError) {
		this.oDataModel.setRefreshAfterChange(true);
		if (this.oDataModel.hasPendingChanges()) {
			this.oDataModel.refresh(true);
		}
		this._onRequestFailed(oError);
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
			}, jQuery.proxy(that._onRequestFailed, this));
		};
		var fnClose = function(oResult) {
			if (oResult && oResult.bConfirmed) {
				var oSelectedAgent = oResult.oAgentToBeForwarded;
				var sSuccessText = that.resourceBundle.getText("dialog.success.forward", [oSelectedAgent.FullName]);

				var sComment = "";
				if (oResult.sNote) {
					sComment = oResult.sNote;
				}

				that.oDataModel.setRefreshAfterChange(false);
				that.oDataModel.callFunction(
					"Forward",
					"POST", {
						SAP__Origin: sOrigin,
						WorkitemID: sWorkitemID,
						NewApprover: oSelectedAgent.UserId,
						Comment: sComment
					},
					undefined,
					function() {
						var sComponentId = sap.ui.core.Component.getOwnerIdFor(that.oView),
							oComponent = sap.ui.component(sComponentId);
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.SUCCESS,
							message: sSuccessText,
							details: sSuccessText
						}, function() {
							that.oView.unbindElement();
							oComponent.oEventBus.publish("ui.s2p.mm.purchorder.approve", "selectNextWorkItem");
							that.oDataModel.setRefreshAfterChange(true);
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
		var oControl = oEvent.getSource();
		var sTitle = this.resourceBundle.getText("BussinessCard.Employee");

		// Open employee type business card
		var onRequestSuccess = function(oData) {

			var data = oData.results[0],
				oEmpConfig = {
					title: sTitle,
					name: data.FullName,
					imgurl: ui.s2p.mm.purchorder.approve.util.Conversions.businessCardImg(data.Mime_Type, data.__metadata.media_src),
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
		var sFilter = "$filter=" + encodeURIComponent("UserID eq '" + sUser + "' and SAP__Origin eq '" + sOrigin + "'");
		this.oDataModel.read("UserDetailsCollection", null, [sFilter], true,
			jQuery.proxy(onRequestSuccess, this),
			jQuery.proxy(this._onRequestFailed, this));
	},

	onVendorPress: function(oEvent) {
		this.onCompanyLaunch(oEvent, "SupplierID");
	},

	onCompanyLaunch: function(oEvent, sRef) {
		var sTitle = this.oApplicationFacade.getResourceBundle().getText("BussinessCard.Supplier");
		var sSupplierId = this.oApplicationFacade.getODataModel().getProperty("SupplierID", this.getView().getBindingContext());

		var oControl = oEvent.getParameters().domRef;
		var sOrigin = this.oView.getBindingContext().getProperty("SAP__Origin");
		var oApplicationFacade = this.oApplicationFacade;
		var sSupplierDetailsCollection = "SupplierDetailCollection(SupplierID='" + sSupplierId + "',SAP__Origin='" + sOrigin + "')";
		var aParam = ["$expand=SupplierContacts"];
		sap.ca.ui.utils.busydialog.requireBusyDialog();
		oApplicationFacade.getODataModel().read(sSupplierDetailsCollection, null, aParam, true, function(oData, response) {
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
			var hasContacts = (oData.SupplierContacts && (oData.SupplierContacts.results.length > 0));
			var oSBCData = {
				title: sTitle,
				imgurl: ui.s2p.mm.purchorder.approve.util.Conversions.businessCardImg(oData.Mime_Type, oData.__metadata.media_src),
				companyname: oData.SupplierName,
				companyphone: oData.WorkPhone,
				companyaddress: oData.AddressString,
				maincontactname: hasContacts ? oData.SupplierContacts.results[0].ContactName : "",
				maincontactmobile: hasContacts ? oData.SupplierContacts.results[0].MobilePhone : oData.WorkPhone,
				maincontactphone: hasContacts ? oData.SupplierContacts.results[0].WorkPhone : oData.WorkPhone,
				maincontactemail: hasContacts ? oData.SupplierContacts.results[0].EMail : oData.EMail
			};
			var oSupplierBusinessCard = new sap.ca.ui.quickoverview.CompanyLaunch(oSBCData);
			oSupplierBusinessCard.openBy(oControl);
		}, function(oError) {
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
		});

	},

	_onRequestFailed: function(oError) {
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
		}, function() {
			var sComponentId = sap.ui.core.Component.getOwnerIdFor(that.oView),
				oComponent = sap.ui.component(sComponentId);
			oComponent.oEventBus.publish("ui.s2p.mm.purchorder.approve", "selectNextWorkItem");
		});
	},

	isMainScreen: function() {
		return true;
	},

	onExit: function() {
		// close open popovers
		if (sap.m.InstanceManager.hasOpenPopover()) {
			sap.m.InstanceManager.closeAllPopovers();
		}
		// close open dialogs
		if (sap.m.InstanceManager.hasOpenDialog()) {
			sap.m.InstanceManager.closeAllDialogs();
		}
	},
	_updateListItem: function(oEvent) {
		var oModel = oEvent.getSource().getModel();
		if (!oModel) {
			return false;
		}
		var sListItem = this.sContext.replace("/WorkflowTaskCollection", "WorkflowTaskCollection");
		sListItem = sListItem.replace("/HeaderDetails", "");

		var sContextDetail = "HeaderDetailCollection(";
		if (oModel.oData[sListItem].SAP__Origin) {
			sContextDetail = sContextDetail + "SAP__Origin='" +
				oModel.oData[sListItem].SAP__Origin +
				"',PoNumber=";
		}
		sContextDetail = sContextDetail + "'" + oModel.oData[sListItem].PoNumber +
			"')";
		if (!oModel.oData[sListItem] || !oModel.oData[sContextDetail]) {
			return false;
		}
		oModel.oData[sListItem].CreatedByID = oModel.oData[sContextDetail].CreatedByID;
		oModel.oData[sListItem].CreatedByName = oModel.oData[sContextDetail].CreatedByName;
		oModel.oData[sListItem].Currency = oModel.oData[sContextDetail].Currency;
		oModel.oData[sListItem].ForwardedByID = oModel.oData[sContextDetail].ForwardedByID;
		oModel.oData[sListItem].ForwardedByName = oModel.oData[sContextDetail].ForwardedByName;
		oModel.oData[sListItem].WiCreatedAt = oModel.oData[sContextDetail].WiCreatedAt;
		oModel.oData[sListItem].Value = oModel.oData[sContextDetail].Value;
	}
});
},
	"ui/s2p/mm/purchorder/approve/view/S3.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\txmlns:form="sap.ui.layout.form"\n\txmlns:layout="sap.ui.layout"\n\tcontrollerName="ui.s2p.mm.purchorder.approve.view.S3">\n\t\n\t<!-- S3 screen -->\n\t<Page\n\t\tid="WIDetail"\n\t\tclass="sapUiFioriObjectPage" \n\t\ttitle="{i18n>view.PurchaseOrder.title}">\n\n\t\t<!-- Header (PurchaseOrderHeader) -->\n\t\t<ObjectHeader\n\t\t\tid="Header"\n\t\t\tintroPress="onAgentPress"\n\t\t\tintroActive="true"\n\t     \ttitle="{SupplierName}"\n\t     \ttitlePress="onVendorPress"\n\t     \ttitleActive="true"\n\t     \tnumber="{parts : [{path : \'Value\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.formatAmount\'}"\n\t     \tnumberUnit="{Currency}">\n\t\t\t<firstStatus>\n\t\t\t\t<ObjectStatus \n\t\t\t\t\tid="ObjectHeaderStatusWiCreatedAt" \n\t\t\t\t\ttext="{parts : [{path : \'WiCreatedAt\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.deliveryDateFormatter\'}">\n\t\t\t\t</ObjectStatus>\n\t\t\t</firstStatus>\n\t\t\t<attributes>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="ObjectHeaderAttributeCreatedByName"\n\t\t\t\t\ttext="{CreatedByName}"\n\t\t\t\t\tpress="onNamePress"\n\t\t\t\t\tactive="true">\n\t\t\t\t</ObjectAttribute>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="ObjectHeaderAttributeForwardedBy"\n\t\t\t\t\ttext="{parts : [{path : \'ForwardedByName\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.forwardedBy\'}"\n\t\t\t\t\tpress="onForwardedPress"\n\t\t\t\t\tactive="true"\n\t\t\t\t\tvisible="{parts : [{path : \'ForwardedByName\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t</ObjectAttribute>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="ObjectHeaderAttributeSubstitutedBy"\n\t\t\t\t\ttext="{parts : [{path : \'SubstitutingForName\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.substitutedBy\'}"\n\t\t\t\t\tpress="onSubstitutingPress"\n\t\t\t\t\tactive="true"\n\t\t\t\t\tvisible="{parts : [{path : \'SubstitutingForName\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t</ObjectAttribute>\n\t\t\t</attributes>\n\n\t\t\t<!-- @ExtensionPoint extHeaderInfo: header details -->\n\t\t\t<core:ExtensionPoint name="extHeaderInfo" />\n\t\t</ObjectHeader>\n\t\t<!-- end of Header (PurchaseOrderHeader) -->\n\n\t\t<!-- ToggleArea (PurchaseOrderToggleArea) -->\n\t\t<IconTabBar\n\t\t\tid="tabBar"\n\t\t\tselect="handleTabSelect">\n\t\t\t<items>\n\t\t\t\t<IconTabFilter\n\t\t\t\t\tid="IconTabBarFilterPOInformation"\n\t\t\t\t\ticon="sap-icon://hint"\n\t\t\t\t\ticonColor="Default"\n\t\t\t\t\tkey="contentInfo">\n\t\t\t\t\t<content>\n\n\t\t\t\t\t\t<!-- Information (PurchaseOrderInformation) -->\n\t\t\t\t\t\t<form:Form \n\t\t\t\t\t\t\tid="InfoForm"\n\t\t\t\t\t\t\tclass="detailInfoForm">\n\t\t\t\t\t\t\t<form:layout>\n\t\t\t\t\t\t\t\t<form:ResponsiveLayout></form:ResponsiveLayout>\n\t\t\t\t\t\t\t</form:layout>\n\t\t\t\t\t\t\t<form:formContainers>\n\t\t\t\t\t\t\t\t<form:FormContainer>\n\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t<form:formElements>\n\t\t\t\t\t\t\t\t\t     <form:FormElement \n\t\t\t\t\t\t\t\t\t     \tid="POInformationPOLabel">\n\t\t\t\t\t\t\t\t\t        <form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t    <layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t     linebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t     margin="false">\n\t\t\t\t\t\t\t\t\t\t\t    </layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t        <form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.purchaseOrderLabel}">\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t        <form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{PoNumber}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\t\n\t\t\t\t\t\t\t\t\t\t<form:FormElement \n\t\t\t\t\t\t\t\t\t\t\tid="POInformationAccountAssignment">\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.accountAssignment}">\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{parts : [{path : \'HeaderInfo\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.accountingFormatter\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\t\n\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\tid="POInformationDeliveryDate"\n\t\t\t\t\t\t\t\t\t\t\tvisible="{parts : [{path : \'DeliveryDate\'}, {path : \'DeliveryDateAlsoLater\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.deliveryDateLabel}">\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t    text="{parts : [{path : \'DeliveryDate\'}, {path : \'DeliveryDateAlsoLater\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.deliveryDateFormatter\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\t\n\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\tid="POInformationPlant"\n\t\t\t\t\t\t\t\t\t\t\tvisible="{parts : [{path : \'PlantName\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.plantLabel}">\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t    text="{PlantName}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\t\n\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\tid="POInformationPaymentTerm"\n\t\t\t\t\t\t\t\t\t\t\tvisible="{parts : [{path : \'PaymentTermDescription\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.paymentTermsLabel}">\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t    text="{PaymentTermDescription}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\tid="POInformationIncoterm"\n\t\t\t\t\t\t\t\t\t\t\tvisible="{parts : [{path : \'Incoterm\'}, {path : \'IncotermLocation\'}, {path : \'IncotermDescription\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.incoTermsVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.incoTermsLabel}">\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text \n\t\t\t\t\t\t\t\t\t\t\t    \t text="{parts : [{path : \'Incoterm\'}, {path : \'IncotermLocation\'}, {path : \'IncotermDescription\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.incoTermsFormatter\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\t\n\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\tid="POInformationCompany"\n\t\t\t\t\t\t\t\t\t\t\tvisible="{parts : [{path : \'CompanyCode\'}, {path : \'CompanyCodeDescription\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.companyCodeVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.companyCodeLabel}">\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t    text="{parts : [{path : \'CompanyCode\'}, {path : \'CompanyCodeDescription\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.companyCodeFormatter\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\n<!-- \t\t\t\t\t\t\t\t\t\tCPDVendorName -->\n\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\tid="POInformationCPDVendor"\n\t\t\t\t\t\t\t\t\t\t\tvisible="{parts : [{path : \'CPDVendorName\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.stringVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.CPDVendorLabel}">\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t    text="{parts : [{path : \'CPDVendorName\'}], formatter: \'ui.s2p.mm.purchorder.approve.util.Conversions.stringFormatterInterop\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\tid="POInformationOrderingAdress"\n\t\t\t\t\t\t\t\t\t\t\tvisible="{parts : [{path : \'OrderingAddress\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.stringVisibilityTrigger\'}">\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.OrderingAddress}">\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t    text="{parts : [{path : \'OrderingAddress\'}], formatter: \'ui.s2p.mm.purchorder.approve.util.Conversions.stringFormatterInterop\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\n\n\t\t\t\t\t\t\t\t\t\t<!-- @ExtensionPoint extInformation: information area -->\n\t\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extInformation" />\n\t\t\t\t\t\t\t\t\t</form:formElements>\n\t\t\t\t\t\t\t\t</form:FormContainer>\n\t\t\t\t\t\t\t</form:formContainers>\n\t\t\t\t\t\t</form:Form>\n\t\t\t\t\t\t<!-- end of Information (PurchaseOrderInformation) -->\t\t\t\t\t\t\n\t\t\t\t\t</content>\n\t\t\t\t</IconTabFilter>\n\t\t\t\t<IconTabFilter\n\t\t\t\t\tid="IconTabBarFilterPONotes"\n\t\t\t\t\ticon="sap-icon://notes"\n\t\t\t\t\ticonColor="Default"\n\t\t\t\t\tcount="{NumberOfNotes}"\n\t\t\t\t\tkey="contentNotes"\n\t\t\t\t\tvisible="{parts : [{path : \'Notes\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.notesVisibilityTrigger\'}">\n\t\t\t\t\t<content>\n\n\t\t\t\t\t\t<!-- Notes (PurchaseOrderNotes)  -->\n\t\t\t\t\t\t<List\n\t\t\t\t\t\t\tid="NotesBox"\n\t\t\t\t            items ="{Notes}"\n\t\t\t\t\t\t\tinset="true"\n\t\t\t\t\t\t\tshowSeparators="None">\n\t\t\t\t\t\t\t<items>\n\t\t\t\t                <FeedListItem\n\t\t\t\t\t\t\t\t\tid="NoteTemplate" \n\t\t\t\t\t\t\t\t\tsenderPress="onNoteSenderPress"  \n\t\t\t\t\t\t\t\t\ttext="{Text}" \n\t\t\t\t\t\t\t\t\tinfo="{TypeDescription}" \n\t\t\t\t\t\t\t\t\tsender="{parts : [{path : \'NoteIsApproverNote\'}, {path : \'CreatedByName\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.approverNoteValueFormatter\'}" \n\t\t\t\t\t\t\t\t\ttimestamp="{parts : [{path : \'NoteIsApproverNote\'}, {path : \'CreatedAt\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.noteDateFormatter\'}">\n\t\t\t\t            \t</FeedListItem> \n\t\t\t\t        \t</items>  \n\t\t\t\t\t\t</List>\n\t\t\t\t\t\t<!-- end of Notes (PurchaseOrderNotes)  -->\n\t\t\t\t\t</content>\n\t\t\t\t</IconTabFilter>\n\t\t\t\t<IconTabFilter\n\t\t\t\t\tid="IconTabBarFilterPOAttachments"\n\t\t\t\t\ticon="sap-icon://attachment"\n\t\t\t\t\ticonColor="Default"\n\t\t\t\t\tcount="{NumberOfAttachments}"\n\t\t\t\t\tkey="contentAttachments"\n\t\t\t\t\tvisible="{parts : [{path : \'Attachments\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.attachmentsVisibilityTrigger\'}">\n\t\t\t\t\t<content>\n\n\t\t\t\t\t\t<!-- Attachments (PurchaseOrderAttachments) -->\n\t\t\t\t\t\t<List\n\t\t\t\t\t\t\tid="AttachmentList"\n\t\t\t\t\t\t\titems ="{Attachments}"\n\t\t\t\t\t\t\tinset="true"\n\t\t\t\t\t\t\tshowSeparators="None">\n\t\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t\t<StandardListItem\n\t\t\t\t\t\t\t\t\tid="AttachmentListItems"\n\t\t\t\t\t\t\t\t\tpress="onAttachment"\n\t\t\t\t\t\t\t\t\ttype="Navigation"\n\t\t\t\t\t\t\t\t\ticon-inset="false"\n\t\t\t\t\t\t\t\t\ttitle="{parts : [{path : \'Description\'},{path : \'MimeType\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.formatAttachmentDesc\'}"\n\t\t\t\t\t\t\t\t\ticon="{parts : [{path : \'MimeType\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.formatAttachmentIcon\'}"\n\t\t\t\t\t\t\t\t\tdescription="{parts : [{path : \'FileSize\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.formatAttachmentSize\'}">\n\t\t\t\t\t\t\t\t</StandardListItem>\n\t\t\t\t\t\t\t</items>\n\t\t\t\t\t\t</List>\n\t\t\t\t\t\t<!-- end of Attachments (PurchaseOrderAttachments) -->\n\t\t\t\t\t</content>\n\t\t\t\t</IconTabFilter>\n\t\t\t</items>\n\t\t</IconTabBar>\n\t\t<!-- end of ToggleArea (PurchaseOrderToggleArea -->\n\n\t\t<!-- Item table (PurchaseOrderItems) -->\n\t\t<Table\n\t\t\tid="itemsTable"\n\t\t\titems="{ItemDetails}"\n\t\t\tnoDataText="{i18n>view.PurchaseOrder.placeholder}"\n\t\t \tclass="detailControlPadding"\n\t\t \tgrowing="true"\n\t\t \tgrowingScrollToLoad="false"\n\t \t\theaderText="{parts : [{path : \'NumberOfItems\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.itemsTableHeader\'}">\n\t \t\t<columns>\n\t \t\t\t<Column\n\t \t\t\t\tid="ItemsTableColumnDescription"\n\t \t\t\t\thAlign="Left">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.descriptionLabel}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t\t<Column\n\t \t\t\t\tid="ItemsTableColumnItemCategory"\n\t \t\t\t\thAlign="Left"\n\t \t\t\t\tdemandPopin="true"\n\t \t\t\t\tminScreenWidth="Medium">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.itemCategory}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t\t<Column\n\t \t\t\t\tid="ItemsTableColumnQuantity"\n\t \t\t\t\thAlign="Right"\n\t \t\t\t\tdemandPopin="true"\n\t \t\t\t\tminScreenWidth="Medium">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.quantity}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t\t<Column\n\t \t\t\t\tid="ItemsTableColumnSubtotal"\n\t \t\t\t\thAlign="Right"\n\t \t\t\t\tdemandPopin="true"\n\t \t\t\t\tminScreenWidth="Medium">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.subtotal}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t\t\t</columns>\n\t\t\t<items>\n\t\t\t\t<ColumnListItem\n\t\t\t\t\ttype="Navigation"\n\t\t\t\t\tpress="navToItemDetails">\n\t\t\t\t\t<cells>\n\t\t\t\t\t\t<layout:VerticalLayout>\n\t\t\t\t\t\t\t<ObjectIdentifier\n\t\t\t\t\t\t\t\ttitle="{Description}"\n\t\t\t\t\t\t\t\tpeople="false"\n\t\t\t\t\t\t\t\tbadgeNotes="{parts : [{path : \'NumberOfNotes\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonCountVisibilityTrigger\'}"\n\t\t\t\t\t\t\t\tbadgeAttachments="{parts : [{path : \'NumberOfAttachments\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonCountVisibilityTrigger\'}">\n\t\t\t\t\t\t\t</ObjectIdentifier>\n\t\t\t\t\t\t\t<ObjectStatus\n\t\t\t\t\t\t\t\ticon="sap-icon://locked"\n\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.blocked}"\n\t\t\t\t\t\t\t\tstate="Warning"\n\t\t\t\t\t\t\t\tvisible="{parts : [{path : \'Blocked\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}"/>\n\t\t\t\t\t\t</layout:VerticalLayout>\n\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\ttext="{parts : [{path : \'ItemCategoryDescription\'}, {path : \'ProductDetails/ItemType\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.itemCategoryFormatter\'}">\n\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t<ObjectNumber\n\t\t\t\t\t\t\tnumber="{parts : [{path : \'Quantity\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.formatNumber\'}"\n\t\t\t\t\t\t\tnumberUnit="{UnitDescription}">\n\t\t\t\t\t\t</ObjectNumber>\n\t\t\t\t\t\t<ObjectNumber\n\t\t\t\t\t\t\tnumber="{parts : [{path : \'Value\'}, {path : \'ItemCategory\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.formatNumberItemType\'}"\n\t\t\t\t\t\t\tnumberUnit="{parts : [{path : \'ItemCategory\'}, {path: \'Currency\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.formatNumberUnitItemType\'}">\n\t\t\t\t\t\t</ObjectNumber>\n\t\t\t\t\t</cells>\n\t\t\t\t</ColumnListItem>\n\t\t\t</items>\n\t\t</Table>\n\t\t<!-- end of Item table (PurchaseOrderItems) -->\n\n\t\t<footer>\n\t\t\t<Bar id="detailFooter">\n\t\t\t</Bar>\n\t\t</footer>\n\t</Page>\n</core:View>',
	"ui/s2p/mm/purchorder/approve/view/S4.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("ui.s2p.mm.purchorder.approve.util.Conversions");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.purchorder.approve.view.S4", {

	sOrigin : "",
	sWorkitemID : "",
	sPoNumber : "",
	sItemNumber : "",

	onInit: function() {
		this.getView().getModel().setSizeLimit(1000000);
		// Get connection manager/resource bundle
		if (!this.oApplication) {
			this.oApplication = sap.ca.scfld.md.app.Application.getImpl();
			this.oConfiguration = this.oApplication.oConfiguration;
			this.oConnectionManager = this.oApplication.getConnectionManager();
			this.resourceBundle = this.oApplication.getResourceBundle();
			this.oDataModel = this.oApplicationFacade.getODataModel();
		}

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "itemDetails") {
				this.sOrigin = oEvent.getParameter("arguments").SAP__Origin;
				this.sWorkitemID = oEvent.getParameter("arguments").WorkitemID;
				this.sPoNumber = oEvent.getParameter("arguments").PoNumber;
				this.sItemNumber = oEvent.getParameter("arguments").ItemNumber;

				var sItemDetailContextPath = "/WorkflowTaskCollection(SAP__Origin='" + this.sOrigin + "',WorkitemID='" + this.sWorkitemID + "')" 
										+ "/HeaderDetails/ItemDetails(SAP__Origin='" + this.sOrigin + "',PoNumber='" + this.sPoNumber + "',ItemNumber='" + this.sItemNumber + "')";
				var sItemPath = "/ItemDetailCollection(SAP__Origin='" + this.sOrigin + "',ItemNumber='" + this.sItemNumber + "',PoNumber='" + this.sPoNumber + "')";
				var oItemData = this.oDataModel.getProperty(sItemPath);
				var sItemCategory = "";
				if (oItemData) {
					sItemCategory = oItemData.ItemCategory;
				}

				// subcontracting
				var oSubcontractingTable = this.byId("SubcontractingTable");
				if (sItemCategory === "3") {
					this.getView().bindElement(sItemDetailContextPath, {expand : 'Accountings,Notes,PricingConditions,Attachments,ServiceLines/Accountings,Limits/Accountings,Components'});

					this.getView().getElementBinding().attachEventOnce("dataReceived", function() {
						var aCells = [
							new sap.m.ObjectIdentifier({
								title : "{parts:[{path : 'Description'}, {path : 'Material'}], formatter : 'ui.s2p.mm.purchorder.approve.util.Conversions.IDFormatter'}"
							}),
							new sap.m.ObjectNumber({
								number : "{parts: [{path : 'Quantity'}], formatter : 'ui.s2p.mm.purchorder.approve.util.Conversions.formatQuantityWithoutUnit'}",
								numberUnit : "{BaseUnitDescription}"
							})
						];
						var oTemplate = new sap.m.ColumnListItem({cells : aCells});
						oSubcontractingTable.bindItems("Components", oTemplate, null, null);
						oSubcontractingTable.setVisible(true);
					}, this);

				} else {
					this.getView().bindElement(sItemDetailContextPath, {expand : 'Accountings,Notes,PricingConditions,Attachments,ServiceLines/Accountings,Limits/Accountings'});
					oSubcontractingTable.setVisible(false);
				}

				this.setLocalHeaderFooterOptions();
			}
		}, this);

		/**
		 * @ControllerHook S4 / onInit
		 * With this controller method the onInit method of the S4 controller can be enhanced.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookOnInit
		 */
		if (this.extHookOnInit) {
			this.extHookOnInit();
		}
	},

	setLocalHeaderFooterOptions: function() {
		var that = this;

		var sHDColl = this._headerDetailCollection(this.sOrigin, this.sPoNumber);
		var sIDColl = this._itemDetailCollection(this.sOrigin, this.sItemNumber, this.sPoNumber);

		var ItemsCollection = this.oDataModel.getProperty("/" + sHDColl + "/ItemDetails");
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
						PoNumber: that.sPoNumber,
						ItemNumber: sItemNumber
					}, true);
				},
				sI18NDetailTitle: "view.ItemDetails.title"
			}
		};

		/**
		 * @ControllerHook S4 / HeaderFooterOptions
		 * With this controller method the setLocalHeaderFooterOptions method of the S4 controller
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
			this.oRouter.navTo("detail", {
				contextPath: sMasterContextPath}, true);
		}
	},

	_refresh: function(channelId, eventId, data) {
		//Override and do nothing
	},

	onServiceItemPress : function(oEvent) {
		var bc = oEvent.getSource().getBindingContext().getPath();
		var oModel = this.getView().getModel();

		this.oRouter.navTo("itemServiceLine", {
			SAP__Origin: this.getView().getBindingContext().getProperty("SAP__Origin"),
			WorkitemID: this.sWorkitemID,
			PoNumber: this.getView().getBindingContext().getProperty("PoNumber"),
			ItemNumber: this.getView().getBindingContext().getProperty("ItemNumber"),
			ServiceLineNumber: oModel.getProperty(bc).ServiceLineNumber
		}, true);
	},

	onServiceLimitPress : function(oEvent) {
		var bc = oEvent.getSource().getBindingContext().getPath();
		var oModel = this.getView().getModel();

//		var descr = oModel.getProperty(bc).LimitDescription;
//		descr = encodeURIComponent(descr.trim());
		
	    var descr = bc.substring(bc.indexOf("LimitDescription='"), bc.length);
        descr = descr.substring(descr.indexOf("'")+1, descr.lastIndexOf("'"));
		
		this.oRouter.navTo("itemServiceLimit", {
			SAP__Origin: this.getView().getBindingContext().getProperty("SAP__Origin"),
			WorkitemID: this.sWorkitemID,
			PoNumber: this.getView().getBindingContext().getProperty("PoNumber"),
			ItemNumber: this.getView().getBindingContext().getProperty("ItemNumber"),
			LimitDescription: descr
		}, true);
	},

	_headerDetailCollection: function(sOrigin, sPoNumber) {
		var sResult = "HeaderDetailCollection(SAP__Origin='" + sOrigin + "',PoNumber='" + sPoNumber + "')";
		return sResult;
	},

	_itemDetailCollection: function(sOrigin,sItemNumber,sPoNumber) {
		var sResult = "ItemDetailCollection(SAP__Origin='" + sOrigin + "',ItemNumber='" + sItemNumber + 
						"',PoNumber='" + sPoNumber + "')";
		return sResult;
	},

		onAttachment: function(oEvent) {
		ui.s2p.mm.purchorder.approve.util.Conversions.onAttachment(oEvent);
	},


	onSenderPress: function(oEvent) {
		this.openEmployeeLaunch(oEvent, "CreatedByID");
	},

	openEmployeeLaunch: function(oEvent, sRef){
		var oControl = oEvent.getSource();
		var sTitle = this.resourceBundle.getText("BussinessCard.Employee");

		// Open employee type business card
		var onRequestSuccess = function(oData) {
			var data = oData.results[0],
			oEmpConfig = {
				title: sTitle,
				name: data.FullName,
                imgurl: ui.s2p.mm.purchorder.approve.util.Conversions.businessCardImg(data.Mime_Type, data.__metadata.media_src),
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
		this.oDataModel = this.oConnectionManager.modelList[this.oConfiguration.getServiceList()[0].name];
		var sFilter = "$filter=" + encodeURIComponent("=UserID eq '" + sUser + "' and SAP__Origin eq '" + sOrigin + "'");
		this.oDataModel.read("UserDetailsCollection", null, [sFilter], true,
			jQuery.proxy(onRequestSuccess, this),
			jQuery.proxy(this._onRequestFailed, this));
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
	"ui/s2p/mm/purchorder/approve/view/S4.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:form="sap.ui.layout.form"\n\txmlns:layout="sap.ui.layout"\n\tcontrollerName="ui.s2p.mm.purchorder.approve.view.S4">\n\t\n\t<!-- S4 screen - Item Detail -->\n\t<Page\n\t\tid="itemdetail"\n\t \tclass="sapUiFioriObjectPage"\n\t\tenableScrolling="true">\n\t\t\n\t\t<!-- ItemDetailHeader -->\n\t\t<!-- Material -->\n\t\t<ObjectHeader\n\t\t\tid="HeaderMaterial"\n\t\t\tintroActive="false"\n\t\t\tvisible="{parts:[{path : \'ProductDetails/ItemType\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.materialVisibilityTrigger\'}"\n\t\t\ttitle="{Description}"\n\t\t\tnumber="{parts: [{path : \'Value\'}, {path : \'ItemCategory\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.formatNumberItemType\'}"\n\t\t\tnumberUnit="{Currency}">\n     \t\t<attributes>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="MaterialObjectHeaderAttributeQuantity"\n\t\t\t\t\ttext="{parts:[{path : \'Quantity\'}, {path : \'UnitDescription\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.quantityFormatter\'}"\n\t\t\t\t\tactive="false">\n\t\t\t\t</ObjectAttribute>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="MaterialObjectHeaderAttributePricePerUnit"\n\t\t\t\t\ttext="{parts:[{path : \'QuantityForPPU\'}, {path : \'UnitForPPUDescription\'}, {path : \'PricePerUnit\'}, {path : \'CurrencyForPPU\'}, {path : \'ItemCategory\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.quantityPerUnitItemCategory\'}"\n\t\t\t\t\tactive="false">\n\t\t\t\t</ObjectAttribute>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="MaterialObjectHeaderAttributeItemCategoryDescription"\n\t\t\t\t\ttext="{parts : [{path : \'ItemCategoryDescription\'}, {path : \'ProductDetails/ItemType\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.itemCategoryFormatter\'}"\n\t\t\t\t\tactive="false">\n\t\t\t\t</ObjectAttribute>\n\t\t\t</attributes>\n\t\t\t<statuses>\n\t\t\t\t<ObjectStatus\n\t\t\t\t\ticon="sap-icon://locked"\n\t\t\t\t\ttext="{i18n>view.PurchaseOrder.blocked}"\n\t\t\t\t\tstate="Warning"\n\t\t\t\t\tvisible="{parts : [{path : \'Blocked\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}"/>\n\t\t\t</statuses>\n\n\t\t\t<!-- @ExtensionPoint extMaterialHeaderInfo: material header information -->\n\t\t\t<core:ExtensionPoint name="extMaterialHeaderInfo" />\n\t\t</ObjectHeader>\n\n\t<!-- Service -->\n\t\t<ObjectHeader\n\t\t\tid="HeaderService"\n\t\t\tintroActive="false"\n\t\t\tvisible="{parts:[{path : \'ProductDetails/ItemType\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.serviceVisibilityTrigger\'}"\n\t\t\ttitle="{Description}"\n\t\t\tnumber="{parts: [{path : \'Value\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.formatAmount\'}"\n\t\t\tnumberUnit="{Currency}">\n\t\t\t<attributes>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="ServiceObjectHeaderAttributeItemCategoryDescription"\n\t\t\t\t\ttext="{ItemCategoryDescription}"\n\t\t\t\t\tactive="false">\n\t\t\t\t</ObjectAttribute>\n\t\t\t</attributes>\n\t\t\t<statuses>\n\t\t\t\t<ObjectStatus\n\t\t\t\t\ticon="sap-icon://locked"\n\t\t\t\t\ttext="{i18n>view.PurchaseOrder.blocked}"\n\t\t\t\t\tstate="Warning"\n\t\t\t\t\tvisible="{parts : [{path : \'Blocked\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}"/>\n\t\t\t</statuses>\n\n\t\t\t<!-- @ExtensionPoint extServiceHeaderInfo: service header information -->\n\t\t\t<core:ExtensionPoint name="extServiceHeaderInfo" />\n\t\t</ObjectHeader>\n\n\t\t<!-- Limit -->\n\t\t<ObjectHeader\n\t\t\tid="HeaderLimit"\n\t\t\tintroActive="false"\n\t\t\tvisible="{parts:[{path : \'ProductDetails/ItemType\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.limitVisibilityTrigger\'}"\n\t\t\ttitle="{LimitDetails/LimitDescription}"\n\t\t\tnumber="{parts: [{path : \'Value\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.formatAmount\'}"\n\t\t\tnumberUnit="{Currency}">\n\t\t\t<attributes>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="LimitObjectHeaderAttributeExpectedValue"\n\t\t\t\t\ttext="{parts:[{path : \'LimitDetails/ExpectedValue\'}, {path : \'LimitDetails/Currency\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.expectedValueFormatter\'}"\n\t\t\t\t\tactive="false">\n\t\t\t\t</ObjectAttribute>\n\t\t\t\t<ObjectAttribute\n\t\t\t\t\tid="LimitObjectHeaderAttributeValueLimit"\n\t\t\t\t\ttext="{parts:[{path : \'LimitDetails/ValueLimit\'}, {path : \'LimitDetails/IsValueUnLimited\'}, {path : \'LimitDetails/Currency\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.valueLimitFormatter\'}"\n\t\t\t\t\tactive="false">\n\t\t\t\t</ObjectAttribute>\n\t\t\t</attributes>\n\t\t\t<statuses>\n\t\t\t\t<ObjectStatus\n\t\t\t\t\ticon="sap-icon://locked"\n\t\t\t\t\ttext="{i18n>view.PurchaseOrder.blocked}"\n\t\t\t\t\tstate="Warning"\n\t\t\t\t\tvisible="{parts : [{path : \'Blocked\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}"/>\n\t\t\t</statuses>\n\n\t\t\t<!-- @ExtensionPoint extLimitHeaderInfo: limit header information -->\n\t\t\t<core:ExtensionPoint name="extLimitHeaderInfo" />\n\t\t</ObjectHeader>\n\t\t<!-- end of Header (ItemDetailHeader) -->\n\n\t\t<!-- Information area (ItemDetailInfo) -->\n\t\t<form:Form\n\t\t\tid="ItemDetailInfoFormGeneral"\n\t\t\ttitle="{i18n>view.PurchaseOrder.information}">\n\t\t\t<form:layout>\n\t\t\t\t<form:ResponsiveLayout></form:ResponsiveLayout>\n\t\t\t</form:layout>\n \t\t\t<form:FormContainer>\t\t\t\t\n\t\t\t\t<form:layoutData>\n\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t</form:layoutData>\n\t\t\t\t<form:formElements>\n\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\tid="ItemDetailInfoMaterial"\n\t\t\t\t\t\tvisible="{parts:[{path : \'ProductDetails/MaterialID\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.materialIDVisibilityTrigger\'}">\n\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.material}">\n\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t<Text text="{ProductDetails/MaterialID}">\n\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\tid="ItemDetailInfoMaterialGroup"\n\t\t\t\t\t\tvisible="{parts:[{path : \'ProductDetails/MaterialGroup\'}, {path : \'ProductDetails/MaterialGroupDescription\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.materialGroupVisibilityTrigger\'}">\n\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.materialGroup}">\n\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t<Text text="{parts:[{path : \'ProductDetails/MaterialGroup\'}, {path : \'ProductDetails/MaterialGroupDescription\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.materialGroupFormatter\'}">\n\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\tid="ItemDetailInfoIncoterm"\n\t\t\t\t\t\tvisible="{parts:[{path : \'Incoterm\'}, {path : \'IncotermLocation\'}, {path : \'IncotermDescription\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.incoTermsVisibilityTrigger\'}">\n\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.incoTermsLabel}">\n\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t<Text text="{parts:[{path : \'Incoterm\'}, {path : \'IncotermLocation\'}, {path : \'IncotermDescription\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.incoTermsFormatter\'}">\n\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t</form:FormElement>\n\n\t\t\t\t\t<!-- @ExtensionPoint extInformation: Do not use this extension point. It has a duplicate name. Use extInformationS4 instead. -->\n\t\t\t\t\t<core:ExtensionPoint name="extInformation" />\n\n\t\t\t\t\t<!-- @ExtensionPoint extInformationS4: information area-->\n\t\t\t\t\t<core:ExtensionPoint name="extInformationS4" />\n\t\t\t\t</form:formElements>\n\t\t\t</form:FormContainer>\n\t\t</form:Form>\n\t\t\n\t\t<form:Form\n\t\t\tid="ItemDetailInfoFormDelivery"\n\t\t\ttitle="{parts:[{path : \'DeliveryDate\'}, {path : \'DeliveryDateAlsoLater\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.deliveryHeaderFormatter\'}">\n\t\t\t<form:layout>\n\t\t\t\t<form:ResponsiveLayout></form:ResponsiveLayout>\n\t\t\t</form:layout>\n\t\t\t<form:formContainers>\n\t\t\t\t<form:FormContainer>\n\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t</form:layoutData>\n \t\t\t\t\t<form:formElements>\n\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\tid="ItemDetailInfoDeliveryPlant"\n\t\t\t\t\t\t\tvisible="{parts:[{path : \'DeliveryAddress/PlantName\'}, {path : \'DeliveryAddress/CustomerName\' }, {path : \'DeliveryAddress/CustomerId\'}, {path : \'ProductDetails/ItemType\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.plantVisibilityTrigger\'}">\n\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.plantLabel}">\n\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t<Text \n\t\t\t\t\t\t\t\t\ttext="{parts : [{path : \'DeliveryAddress/PlantName\'}, {path : \'DeliveryAddress/Plant\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter\'}">\n\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t</form:FormElement>\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\tid="ItemDetailInfoName"\n\t\t\t\t\t\t\tvisible="{parts:[{path : \'DeliveryAddress/CustomerName\' }, {path : \'DeliveryAddress/CustomerId\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.freestyleNameVisibilityTrigger\'}">\n\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.freestyleAdressLabel}"></Label>\n\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\ttext="{DeliveryAddress/CustomerName}">\n\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\tid="ItemDetailInfoCustomer"\n\t\t\t\t\t\t\tvisible="{parts:[{path : \'DeliveryAddress/CustomerName\' }, {path : \'DeliveryAddress/CustomerId\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.customerNameVisibilityTrigger\'}">\n\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.customerLabel}"></Label>\n\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\ttext="{parts:[{path : \'DeliveryAddress/CustomerName\' }, {path : \'DeliveryAddress/CustomerId\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.customerNameFormatter\'}">\n\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\tid="ItemDetailInfoDeliveryAddress"\n\t\t\t\t\t\t\tvisible="{parts:[{path : \'DeliveryAddress/AddressString\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger\'}">\n\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\tlinebreak="true" \n\t\t\t\t\t\t\t\t\tmargin="false">\n\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.address}"></Label>\n\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\ttext="{DeliveryAddress/AddressString}">\n\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\tweight="2"\n\t\t\t\t\t\t\t\t\t\t\talignItems="End">\n\t\t\t\t\t\t\t\t\t\t</layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t</form:formElements>\n\t\t\t\t</form:FormContainer>\n\t\t\t</form:formContainers>\n\t\t</form:Form>\n\t\t<!-- end of Information area (ItemDetailInfo) -->\n\n\t\t<!-- Tables area (ItemDetailTables) -->\n\t\t<!-- Item Notes -->  \n\t\t<List\n\t\t\tid="ListItemNotes"\n\t\t\titems="{Notes}"\n\t\t\tclass=\'detailControlPadding detailControlPaddingSubsequent purchaseOrderTable\'\n\t\t\tshowSeparators="None"\n\t\t\theaderDesign="Plain"\n\t\t\theaderText="{i18n>view.PurchaseOrder.notes}"\n\t\t\tvisible="{parts:[{path : \'NumberOfNotes\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.ItemNoteVisibilityTrigger\'}">\n\t\t\t<FeedListItem\n\t\t\t\tid="NoteTemplate"\n\t\t\t\ttext="{Text}"\n\t\t\t\tsenderPress="onSenderPress"\n\t\t\t\tclass="viewPadding" \n\t\t\t\tinfo="{TypeDescription}">\n\t\t\t</FeedListItem>\n\t\t</List>\n\t\t\n\t\t<!--Item Attachments -->  \n\t\t<List\n\t\t\tid="ListItemAttachments"\n\t\t\titems="{Attachments}"\n\t\t\theaderText="{i18n>view.PurchaseOrder.attachments}" \n\t\t\tshowSeparators="None"\n\t\t\theaderDesign="Plain"\n\t\t\tclass="purchaseOrderTable"\n\t\t\tvisible="{parts:[{path : \'NumberOfAttachments\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.ItemAttachmentVisibilityTrigger\'}">\n\t\t\t<StandardListItem\n\t\t\t\tpress="onAttachment"\n\t\t\t\ttype="Navigation"\n\t\t\t\ticonInset="false"\n\t\t\t\ttitle="{parts : [{path : \'Description\'},{path : \'MimeType\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.formatAttachmentDesc\'}"\n\t\t\t\ticon="{parts : [{path : \'MimeType\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.formatAttachmentIcon\'}"\n\t\t\t\tdescription="{parts : [{path : \'FileSize\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.formatAttachmentSize\'}">\n\t\t\t</StandardListItem>\n\t    </List>\n\t    \n\t    <!-- Limit -->\n\t    <Table\n\t    \tid="LimitTable"\n\t    \tnoDataText="{i18n>view.PurchaseOrder.placeholder}" \n\t\t\theaderText="{i18n>view.PurchaseOrder.limit}" \n\t\t\titems="{Limits}"\n\t\t\tclass="purchaseOrderTable"\n\t\t\theaderDesign="Plain"\n\t\t\tvisible="{parts:[{path : \'LimitDetails/ValueLimit\'}, {path : \'LimitDetails/ExpectedValue\'}, {path : \'ProductDetails/ItemType\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.ItemLimitVisibilityTrigger\'}">\n\t\t\t <columns>\n\t \t\t\t<Column\n\t \t\t\t\tid="LimitTableColumnName"\n\t \t\t\t\talignItems="Start"\n\t \t\t\t\tdemandPopin="true">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.name}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t\t<Column\n\t \t\t\t\tid="LimitTableColumnLimitValue"\n\t \t\t\t\talignItems="End"\n\t \t\t\t\thAlign="Right"\n\t \t\t\t\tdemandPopin="true"\n\t \t\t\t\tminScreenWidth="Tablet">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t\t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.valueLimit}">\n\t\t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t\t<Column\n\t \t\t\t\tid="LimitTableColumnExpectedValue"\n\t \t\t\t\talignItems="End"\n\t \t\t\t\thAlign="Right"\n\t \t\t\t\tdemandPopin="true"\n\t \t\t\t\tminScreenWidth="Tablet">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.expectedValue}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t</columns>\n\t\t\t<ColumnListItem\n\t \t\t\ttype="Navigation"\n\t \t\t\tpress="onServiceLimitPress">\n\t\t\t\t<cells>\n\t\t\t\t\t<ObjectIdentifier\n\t\t\t\t\t\ttitle="{LimitDescription}">\n\t\t\t\t\t</ObjectIdentifier>\n\t\t\t\t\t<Text\n\t\t\t\t\t\ttext="{parts:[{path : \'ValueLimit\'}, {path : \'IsValueUnLimited\'}, {path : \'Currency\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.valueLimitWithoutLabelFormatter\'}">\n\t\t\t\t\t</Text>\n\t\t\t\t\t<ObjectNumber\n\t\t\t\t\t\tnumber="{parts: [{path : \'ExpectedValue\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.formatAmount\'}"\n\t\t\t\t\t\tnumberUnit="{Currency}">\n\t\t\t\t\t</ObjectNumber>\n\t\t\t\t</cells>\n\t\t\t</ColumnListItem>\n\t\t</Table>\n\t\n\t\t<!-- Service Lines NumberServiceLines -->\n\t\t<Table\n\t\t\tid="NumberServiceLinesTable"\n\t\t\theaderText="{parts:[{path : \'NumberServiceLines\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.serviceLinesTableHeader\'}"\n\t\t\tvisible="{parts:[{path : \'NumberServiceLines\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.ItemServiceLineVisibilityTrigger\'}"\n\t\t\tnoDataText="{i18n>view.PurchaseOrder.placeholder}" \n\t\t\theaderDesign="Plain"\n\t\t\tclass="purchaseOrderTable"\n\t\t\titems="{ServiceLines}">\n\t\t\t<columns>\n\t \t\t\t<Column\n\t \t\t\t\tid="NumberServiceLinesTableColumnLabel"\n\t \t\t\t\talignItems="Start"\n\t \t\t\t\tdemandPopin="true">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.descriptionLabel}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t\t<Column\n\t \t\t\t\tid="NumberServiceLinesTableColumnQuantity"\n\t \t\t\t\talignItems="End"\n\t \t\t\t\thAlign="Right"\n\t \t\t\t\tdemandPopin="true"\n\t \t\t\t\tminScreenWidth="Tablet">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.quantity}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t\t<Column\n\t \t\t\t\tid="NumberServiceLinesTableColumnSubtotal"\n\t \t\t\t\talignItems="End"\n\t \t\t\t\thAlign="Right"\n\t \t\t\t\tdemandPopin="true"\n\t \t\t\t\tminScreenWidth="Tablet">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.subtotal}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t\t\t</columns>\n\t\t\t<ColumnListItem\n\t \t\t\ttype="Navigation"\n\t \t\t\tpress="onServiceItemPress">\n\t \t\t\t<cells>\n\t \t\t\t\t<ObjectIdentifier\n\t \t\t\t\t\ttitle="{Description}">\n\t \t\t\t\t</ObjectIdentifier>\n\t \t\t\t\t<Text \n\t \t\t\t\t\ttext="{parts:[{path : \'Quantity\'}, {path : \'UnitDescription\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.quantityFormatter\'}">\n\t \t\t\t\t</Text>\n\t \t\t\t\t<ObjectNumber \n\t \t\t\t\t\tnumber="{parts: [{path : \'Value\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.formatAmount\'}"\n\t \t\t\t\t\tnumberUnit="{Currency}">\n\t \t\t\t\t</ObjectNumber>\n\t \t\t\t</cells>\n\t \t\t</ColumnListItem>\n\t\t</Table>\n\t\n\t\t<!-- Account Assignment -->\n\t\t<layout:VerticalLayout\n\t\t\tvisible="{parts : [{path : \'Accountings\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.ItemAccountAssignmentVisibilityTrigger\'}"\n\t\t\twidth="100%">\n\t\t\t<mvc:XMLView\n\t\t\t\tid="AccountAssignmentCommonView"\n\t\t\t\tviewName="ui.s2p.mm.purchorder.approve.view.AccountAssignmentTable">\n\t\t\t</mvc:XMLView>\n\t\t</layout:VerticalLayout>\n\t\t<!-- end of Account Assignment -->\n\n\t\t<!-- Subcontracting -->\n\t\t<Table\n\t\t\tid="SubcontractingTable"\n\t\t\theaderText="{i18n>view.PurchaseOrder.components}"\n\t\t\tnoDataText="{i18n>view.PurchaseOrder.placeholder}" \n\t\t\tvisible="{parts:[{path : \'ItemCategory\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.componentVisibilityTrigger\'}"\n\t\t\theaderDesign="Plain"\n\t\t\tclass="purchaseOrderTable">\n\t\t\t<columns>\n\t \t\t\t<Column\n\t \t\t\t\tid="ComponentDescription"\n\t \t\t\t\talignItems="Start"\n\t \t\t\t\tdemandPopin="true"\n\t \t\t\t\tminScreenWidth="Tablet">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.descriptionLabel}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t\t<Column\n\t \t\t\t\tid="ComponentQuantity"\n\t \t\t\t\talignItems="End"\n\t \t\t\t\thAlign="Right"\n\t \t\t\t\tdemandPopin="true"\n\t \t\t\t\tminScreenWidth="Tablet">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.quantity}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t\t\t</columns>\n\t\t</Table>\n\t\t\t\t\n\t\t<!-- Price Conditions -->\n\t\t<Table\n\t\t\tid="PricingCondTable"\n\t\t\theaderText="{i18n>view.PurchaseOrder.pricingConditions}"\n\t\t\tnoDataText="{i18n>view.PurchaseOrder.placeholder}" \n\t\t\tvisible="{parts:[{path : \'PricingConditions\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.PriceConditionsVisibilityTriggerItemType\'}"\n\t\t\theaderDesign="Plain"\n\t\t\tclass="purchaseOrderTable"\n\t\t\titems="{PricingConditions/}">\n\t\t\t<columns>\n\t \t\t\t<Column\n\t \t\t\t\tid="PricingCondTableColumnLabel"\n\t \t\t\t\talignItems="Start"\n\t \t\t\t\tdemandPopin="true"\n\t \t\t\t\tminScreenWidth="Tablet">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.descriptionLabel}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t \t\t\t<Column\n\t \t\t\t\tid="PricingCondTableColumnAmount"\n\t \t\t\t\talignItems="End"\n\t \t\t\t\thAlign="Right"\n\t \t\t\t\tdemandPopin="true"\n\t \t\t\t\tminScreenWidth="Tablet">\n\t \t\t\t\t<header>\n\t \t\t\t\t\t<Label\n\t \t\t\t\t\t\ttext="{i18n>view.PurchaseOrder.amount}">\n\t \t\t\t\t\t</Label>\n\t \t\t\t\t</header>\n\t \t\t\t</Column>\n\t\t\t</columns>\n\t\t\t<ColumnListItem\n\t \t\t\ttype="Inactive">\n\t \t\t\t<cells>\n\t \t\t\t\t<ObjectIdentifier\n\t \t\t\t\t\ttitle="{parts:[{path : \'Description\'}, {path : \'PricingConditionType\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.IDFormatter\'}">\n\t \t\t\t\t</ObjectIdentifier>\n\t \t\t\t\t<ObjectNumber \n\t \t\t\t\t\tnumber="{parts: [{path : \'Value\'}], formatter : \'ui.s2p.mm.purchorder.approve.util.Conversions.formatAmount\'}"\n\t \t\t\t\t\tnumberUnit="{Currency}">\n\t \t\t\t\t</ObjectNumber>\n\t \t\t\t</cells>\n\t \t\t</ColumnListItem>\n\t\t</Table>\n\t\t<!-- end of Tables area (ItemDetailTables) -->\n\t\t\n\t</Page>\n</core:View>'
}});
