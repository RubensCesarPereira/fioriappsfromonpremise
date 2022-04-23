/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("fcg.grc.accessrequest.approve.Main", {
    onInit: function() {
        jQuery.sap.require("sap.ca.scfld.md.Startup");
        sap.ca.scfld.md.Startup.init('fcg.grc.accessrequest.approve', this);
    },
    onExit: function() {}
});