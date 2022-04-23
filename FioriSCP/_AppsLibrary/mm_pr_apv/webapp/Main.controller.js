/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("ui.s2p.mm.requisition.approve.Main",{onInit:function(){jQuery.sap.require("sap.ca.scfld.md.Startup");sap.ca.scfld.md.Startup.init('ui.s2p.mm.requisition.approve',this);jQuery.sap.require("ui.s2p.mm.requisition.approve.model.config");if(ui.s2p.mm.requisition.approve.model.Config.isMock){ui.s2p.mm.requisition.approve.model.Config.setMockResponses();}},onExit:function(){}});
