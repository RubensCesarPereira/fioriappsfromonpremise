sap.ui.jsview("z_figesacrelib.view.ppal", {
	getControllerName: function () {
		return "z_figesacrelib.controller.ppal";
	},	
	createContent: function (oController) {
		
		// to avoid scroll bars on desktop the root view must be set to block display
		this.setDisplayBlock(true);
		
		// create app
		this.app = new sap.m.App("RootView");
		
		// load the master page
		var master = sap.ui.xmlview("master", "z_figesacrelib.view.master");
		master.getController().nav = this.getController();
		this.app.addPage(master, true);
		
	
		return this.app;
	}
});