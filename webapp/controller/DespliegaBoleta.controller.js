sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
], function(Controller, JSONModel, MessageToast, MessageBox, Dialog, Button, History, Filter) {
	"use strict";

	return Controller.extend("Z_SDConsultaBET.controller.DespliegaBoleta", {
	onInit : function() {	
		this.getView().byId("BoletaPanel").setVisible(false);
		this.getView().byId("ErrorPanel").setVisible(false);
		this.getView().byId("t_msj").setVisible(false);
		var param = jQuery.sap.getUriParameters().get("p");
		if(param){
				var decodedString = atob(param);
			console.log(decodedString); // Outputs: "Hello World!"
			var parametros = decodedString.split("&");
			var folio = parametros[0].split("=");
			var total = parametros[1].split("=");
			var fecha = parametros[2].split("=");
			if(!folio||!total||!fecha){
				MessageBox.show("Enlace erroneo");
				this.getView().byId("ErrorPanel").setVisible(true);
			}else{
				this.getView().byId("BoletaPanel").setVisible(true);
				this.getView().byId("t_msj").setVisible(true);
				this.getView().byId("l_folio").setVisible(false);
				this.getView().byId("l_fecha").setVisible(false);
				this.getView().byId("l_monto").setVisible(false);
				this.getView().byId("nb").setVisible(false);
				this.getView().byId("DP1").setVisible(false);
				this.getView().byId("mt").setVisible(false);
				this.getView().byId("b_aceptar").setVisible(false);
				this.getView().byId("b_limpiar").setVisible(false);
				
				console.log(fecha);
				
				var urlService = "sap/opu/odata/sap/ZODATA_SD_WINESHOP_CONSULTA_BET_SRV";
				var sRead = "/ConsultaBET2Set(Fecha='"+fecha[1]+"',MontoTotal='"+total[1]+"',Folio='"+folio[1]+"')/$value" ;
				var oHtml = this.getView().byId("ifrm");
				var oView = this.getView();
				var oModel = new sap.ui.model.odata.ODataModel(urlService,true/*,user,pass*/); 
			       oModel.read( sRead, null, null, true, function(oData, oResponse){
			   		oView.setBusy(false);
			   		var cl = oResponse.headers["content-length"];  
			    	   if(oResponse.statusText==="OK"&&(cl>0)){
			    	   var pdfURL = oResponse.requestUri;
//			            oPanel.addContent(html);
//			            oPanel.placeAt("content");
			            if(sap.ui.Device.system.desktop){
			            	oView.byId("BoletaPanel").setVisible(true);
			            	oHtml.setContent("<iframe src=" + pdfURL + " width='0' height='0' visible=\"false\"></iframe>");
			    		}else{
			    			oView.byId("BoletaPanel").setVisible(true);
			    			oHtml.setContent("<iframe src=" + pdfURL + " width='90%' visible=\"true\"></iframe>");
			    		}
			            	oView.byId("t_msj").setVisible(false);
			    	   } else{
			    		   MessageToast.show("Archivo no encontrado.");
			    	   }    
			        },function(){
			    		oView.setBusy(false);
			            alert("Problemas al descargar archivo");});
				
			}
		}else{
			this.getView().byId("BoletaPanel").setVisible(true);
			this.getView().byId("t_msj").setVisible(false);
			this.getView().byId("ErrorPanel").setVisible(false);
		}
		//&p=Zj0xJnQ9MTAwMCZkPTIwMTgxMDEw
//		var folio = jQuery.sap.getUriParameters().get("f");
//		var total = jQuery.sap.getUriParameters().get("t");
//		var fecha = jQuery.sap.getUriParameters().get("d");
//		if(folio&&total&&fecha){
//			console.log("con parametros URL");
//		}
		
	},
	getRouter: function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
		
	},
	_onRouteFound: function(oEvent){

	},
	
	clear:function(oEvent){
		this.getView().byId("nb").setValue("");
		this.getView().byId("mt").setValue("");
		this.getView().byId("DP1").setValue("");
		this.getView().byId("ifrm").setVisible(false);
	},
	carga:function(oEvent){
		if(this.validaFormulario()){
		var folio = this.getView().byId("nb").getValue();
		var total = this.getView().byId("mt").getValue();
		var fecha_data = this.getView().byId("DP1").getValue();
		console.log(fecha_data);
		var fechaArray= fecha_data.split('-');
		var dateFormatted=fechaArray[2]+fechaArray[1]+fechaArray[0];
		console.log(dateFormatted);
		
		var urlService = "sap/opu/odata/sap/ZODATA_SD_WINESHOP_CONSULTA_BET_SRV";
		var sRead = "/ConsultaBET2Set(Fecha='"+dateFormatted+"',MontoTotal='"+total+"',Folio='"+folio+"')/$value" ;
		var oHtml = this.getView().byId("ifrm");
		var oView = this.getView();
		oView.setBusy(true);
		var oModel = new sap.ui.model.odata.ODataModel(urlService,true/*,user,pass*/); 
	       oModel.read( sRead, null, null, true, function(oData, oResponse){
	    	   oView.setBusy(false);
	    	   var cl = oResponse.headers["content-length"];  
	    	   if(oResponse.statusText==="OK"&&(cl>0)){
	    	   var pdfURL = oResponse.requestUri;            
//	            oPanel.addContent(html);
//	            oPanel.placeAt("content");
	            if(sap.ui.Device.system.desktop){
	            	oHtml.setContent("<iframe src=" + pdfURL + " width='0' height='0' visible=\"false\"></iframe>");
	    		}else{
	    			oHtml.setContent("<iframe src=" + pdfURL + " width='90%' visible=\"true\"></iframe>");
	    		}
	    	   } else{
	    		   MessageToast.show("Venta no válida o En Proceso.");
	    	   }    
	        },function(){
	        	oView.setBusy(false);
	            alert("Problemas al descargar archivo");});
		}else{
			MessageToast.show("Todos los campos son obligatorios");
		}
		
	},
	onLiveChangeFolio:function(oEvent){
		var _oInput = oEvent.getSource();
		var val = _oInput.getValue();
		val = val.replace(/[^\d]/g, '');
		_oInput.setValue(val);
	},
	validaFormulario:function(){
		var folio = this.getView().byId("nb").getValue();
		var total = this.getView().byId("mt").getValue();
		var fecha_data = this.getView().byId("DP1").getValue();
		var ok=true;
		if(folio==="")
			ok=false;
		if(total==="")
			ok=false;
		if(fecha_data==="")
			ok=false;
		return ok;
	}
});
});