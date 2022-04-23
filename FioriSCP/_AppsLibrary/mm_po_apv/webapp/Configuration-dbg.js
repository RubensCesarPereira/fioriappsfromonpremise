/*
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
