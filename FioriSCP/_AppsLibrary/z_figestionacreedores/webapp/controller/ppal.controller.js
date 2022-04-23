sap.ui.controller("z_figestionacreedores.controller.ppal", {				
		
	to : function (pageId, context) {
		
		var app = this.getView().app;
		
		// load page on demand
		var master = ("master" === pageId);
		if (app.getPage(pageId, master) === null) {
			var page = sap.ui.view({
				id 		: pageId,
				viewName: "z_figestionacreedores.view." + pageId,
				type 	: "XML"
			});
			page.getController().nav = this;
			app.addPage(page, master);
			jQuery.sap.log.info("app controller > loaded page: " + pageId);
		}
		
		// show the page
		app.to(pageId);
		
		// set data context on the page
		if (context) {
			var page = app.getPage(pageId);
			page.setBindingContext(context);
		}
	}
	
	
	
});