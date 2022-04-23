sap.ui.jsview("z_mmfichatecnic.view.ppal", {
	getControllerName: function () {
		return "z_mmfichatecnic.controller.ppal";
	},	
	createContent: function (oController) {
		
		// to avoid scroll bars on desktop the root view must be set to block display
		this.setDisplayBlock(true);
		this.insertContent(new sap.m.Button('profile-active',{text: '...',type: 'Unstyled'}).addStyleClass('divPerfil'),9999);
		// create app
		this.app = new sap.m.App("RootView");
		//modo desktop en eclipse
		this.addStyleClass('sapUiSizeCompact');
		// load the master page
		var master = sap.ui.xmlview("form", "z_mmfichatecnic.view.menu");
		master.getController().nav = this.getController();
		this.app.addPage(master, true);
		
		this.app.addContett
		return this.app;
	}
});