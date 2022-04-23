
sap.ui.controller("z_figesacrelib.controller.ppal", {				
	
	to : function (pageId, context) {
		
		var app = this.getView().app;
		
		// load page on demand
		var master = ("master" === pageId);
		if (app.getPage(pageId, master) === null) {
			var page = sap.ui.view({
				id 		: pageId,
				viewName: "z_figesacrelib.view." + pageId,
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