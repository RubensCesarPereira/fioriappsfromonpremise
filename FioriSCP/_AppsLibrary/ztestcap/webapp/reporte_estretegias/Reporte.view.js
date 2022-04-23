sap.ui.jsview("reporte_estretegias.Reporte", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf reporte_estretegias.Reporte
	*/ 
	getControllerName : function() {
		return "reporte_estretegias.Reporte";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf reporte_estretegias.Reporte
	*/ 
	createContent : function(oController) {
 		return new sap.m.Page({
			title: "Title",
			content: [
			
			]
		});
	}

});