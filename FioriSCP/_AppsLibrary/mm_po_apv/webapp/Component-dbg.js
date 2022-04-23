/*
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