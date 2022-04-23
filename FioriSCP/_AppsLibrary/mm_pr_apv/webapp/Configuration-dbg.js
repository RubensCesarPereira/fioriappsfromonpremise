/*
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
                mockedDataSource: "/ui.s2p.mm.requisition.approve/test-resources/model/metadata.xml"
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
