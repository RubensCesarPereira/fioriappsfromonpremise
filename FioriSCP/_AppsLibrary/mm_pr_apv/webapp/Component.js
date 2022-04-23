/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("ui.s2p.mm.requisition.approve.Component");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");
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
        masterPageRoutes: {
            "master": {
                "pattern": ":scenarioId:",
                "view": "ui.s2p.mm.requisition.approve.view.S2",
                "viewLevel": "0"
            }
        },
        detailPageRoutes: {
            "detail": {
                "pattern": "detail/{contextPath}",
                "view": "ui.s2p.mm.requisition.approve.view.S3",
                "viewLevel": "1"
            },
            "subDetail": {
                "pattern": "ServiceLineDetails/{SAP__Origin}/{WorkitemID}/{PrNumber}/{ItemNumber}/{ServiceLineNumber}",
                "view": "ui.s2p.mm.requisition.approve.view.ItemServiceLine",
                "viewLevel": "2"
            },
            "Limit": {
                "pattern": "Limit/{SAP__Origin}/{WorkitemID}/{PrNumber}/{ItemNumber}",
                "view": "ui.s2p.mm.requisition.approve.view.Limit",
                "viewLevel": "2"
            },
            "headerDetail": {
                "pattern": "HeaderDetail/{contextPath}",
                "view": "ui.s2p.mm.requisition.approve.view.S3_header",
                "viewLevel": "1"
            },
            "itemDetails": {
                "pattern": "ItemDetail/{SAP__Origin}/{WorkitemID}/{PrNumber}/{ItemNumber}",
                "view": "ui.s2p.mm.requisition.approve.view.ItemDetails",
                "viewLevel": "2"
            },
            "itemServiceLine": {
                "pattern": "ItemServiceLine/{SAP__Origin}/{WorkitemID}/{PrNumber}/{ItemNumber}/{ServiceLineNumber}",
                "view": "ui.s2p.mm.requisition.approve.view.ItemServiceLine",
                "viewLevel": "3"
            },
            "itemServiceLimit": {
                "pattern": "ItemServiceLimit/{SAP__Origin}/{WorkitemID}/{PrNumber}/{ItemNumber}/{LimitDescription}",
                "view": "ui.s2p.mm.requisition.approve.view.Limit",
                "viewLevel": "3"
            },
            "noData": {
                "pattern": "noData",
                "view": "empty"
            }
        }
    }),
    createContent: function() {
        var v = {
                component: this
            },
            V = sap.ui.view({
                viewName: "ui.s2p.mm.requisition.approve.Main",
                type: sap.ui.core.mvc.ViewType.XML,
                viewData: v
            }),
            p = V.getId() + "--",
            e = sap.ui.getCore().getEventBus();
        this.oEventBus = {
            publish: function(c, a, d) {
                c = p + c;
                e.publish(c, a, d);
            },
            subscribe: function(c, a, d, l) {
                c = p + c;
                e.subscribe(c, a, d, l);
            },
            unsubscribe: function(c, a, d, l) {
                c = p + c;
                e.unsubscribe(c, a, d, l);
            }
        };
        return V;
    }
});