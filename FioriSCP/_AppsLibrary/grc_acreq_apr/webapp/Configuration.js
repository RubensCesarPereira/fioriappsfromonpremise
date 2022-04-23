/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.grc.accessrequest.approve.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");
sap.ca.scfld.md.ConfigurationBase.extend("fcg.grc.accessrequest.approve.Configuration", {
    oServiceParams: {
        serviceList: [{
            name: "GRC_ACCESSREQUEST_APPROVE",
            masterCollection: "Requests",
            serviceUrl: fcg.grc.accessrequest.approve.Component.getMetadata().getManifestEntry("sap.app").dataSources["GRC_ACCESSREQUEST_APPROVE"].uri,
            isDefault: true,
            mockedDataSource: "/fcg.grc.accessrequest.approve/model/metadata.xml"
        }]
    },
    getServiceParams: function() {
        return this.oServiceParams;
    },
    getServiceList: function() {
        return this.oServiceParams.serviceList;
    },
    getMasterKeyAttributes: function() {
        return ["Id"];
    }
});