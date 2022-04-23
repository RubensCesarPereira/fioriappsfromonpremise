sap.ui.jsview("Z_SDConsultaBET.view.ppal", {
	getControllerName: function () {
		return "Z_SDConsultaBET.controller.ppal";
	},	
	createContent: function (oController) {
		this.setDisplayBlock(true);
		this.app = new sap.m.App("RootView");
		var master = sap.ui.xmlview("master", "Z_SDConsultaBET.view.DespliegaBoleta");
		master.getController().nav = this.getController();
		this.app.addPage(master, true);
		return this.app;
	}
});