/*
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