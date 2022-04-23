/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("ui.s2p.mm.ses.approve.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");
sap.ca.scfld.md.ConfigurationBase.extend("ui.s2p.mm.ses.approve.Configuration", {
    oServiceParams: {
        serviceList: [{
            name: "MM_SES_APPROVE_Entities",
            masterCollection: "Workitems",
            serviceUrl: "/FioriSCP.uis2pmmsesapprove/sap/opu/odata/sap/MM_SES_APPROVE/",
            isDefault: true,
            mockedDataSource: "/ui.s2p.mm.ses.approve/model/metadata.xml"
        }]
    },
    getServiceParams: function() {
        return this.oServiceParams
    },
    getServiceList: function() {
        return this.getServiceParams().serviceList
    },
    getMasterKeyAttributes: function() {
        return ["Id"]
    },
});