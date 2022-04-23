/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("ui.s2p.mm.ses.approve.Main", {

	onInit : function() {
		jQuery.sap.require("sap.ca.scfld.md.Startup");				
		sap.ca.scfld.md.Startup.init('ui.s2p.mm.ses.approve', this);
	}
});