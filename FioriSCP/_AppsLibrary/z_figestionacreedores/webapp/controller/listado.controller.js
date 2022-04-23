sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/core/format/DateFormat",
		"z_figestionacreedores/view/utils/connectivity"
	], function(Controller, JSONModel, MessageToast, MessageBox,DateFormat) {
		"use strict";

		return Controller.extend("z_figestionacreedores.controller.listado", {
			
			onInit:function(){
				
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
//				oRouter.getRoute("listado").attachMatched(this._onRouteFound, this);
//				this.getView().byId("detalleScrollContainer").setVisible(false);
				this.getView().byId("ObjectPageLayout").setVisible(false);
				var url = serviceUrl;
				var oModel = new sap.ui.model.odata.ODataModel(url,true);
				var tabla = this.getView().byId("idSolicTable");
				var lista = this.getView().byId("listaTest");
				var oView = this.getView();
				oModel.read("/MisSolicitudesSet", null, [""], false,
				function(data, response) {
						oView.setBusy(false);
						var oModelProceso = new sap.ui.model.json.JSONModel();
						console.log(data.results[0].ID_PROCESO);
						var resultados = data.results;
						var solicitudes=[];
						
						for(var i=0; i<resultados.length; i++){
							var estado="None";
							var icon = "/FioriSCP.z_figestionacreedores/img/Created.png";
							var tipo = "";
							if(resultados[i].TIPO_PROCESO==='C')
								tipo="Creación";
							else if(resultados[i].TIPO_PROCESO==='U')
								tipo="Modificación";
							else if(resultados[i].TIPO_PROCESO==='E')
								tipo="Ampliación";
							else if(resultados[i].TIPO_PROCESO==='D')
								tipo="Borrado";
							
							if(resultados[i].SEMAFORO==='1'){
								estado="None";
							}else if(resultados[i].SEMAFORO==='2'){
								estado="Warning";
								icon = "/FioriSCP.z_figestionacreedores/img/InProcess.png";
							}else if(resultados[i].SEMAFORO==='3'){
								estado="Success";
								icon = "/FioriSCP.z_figestionacreedores/img/Aproved.png";
							}else if(resultados[i].SEMAFORO==='4'){
								estado="Error";
								icon = "/FioriSCP.z_figestionacreedores/img/Reject.png";
							}
						 
							var obj={
									"ID_PROCESO":	resultados[i].ID_PROCESO,
									"TIPO_PROCESO":	tipo,
									"TIPO_PROCESO_ID": resultados[i].TIPO_PROCESO,
									"ERSDA":		resultados[i].ERSDA,
									"ESTADO":		resultados[i].ESTADO,
									"SUBESTADO":	resultados[i].SUBESTADO,
									"NAME1": 		resultados[i].NAME1,
									"KTOKK":		resultados[i].KTOKK,
									"MOTIVO_RECHAZO": resultados[i].MOTIVO_RECHAZO,
									"SEMAFORO":		resultados[i].SEMAFORO,
									"STATE":		estado,
									"ICON":			icon
									
							};
						
							solicitudes.push(obj);
						}
						var data = {
							'listSolicitudes': solicitudes};
						oModelProceso.setData(data);
						tabla.setModel(oModelProceso);
						
						
				}, function(err) {
					oView.setBusy(false);
					var errTxt = err.message + "\n";
					sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
				});	
			},
			getRouter: function() {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},
			_onRouteFound: function(oEvent){
				//**************************************
				this.getView().byId("detalleScrollContainer").setVisible(false);
				console.log("hola");
			},
			onPress:function(oEvent){
				
				var url = serviceUrl;
				var oContext = oEvent.getSource().getBindingContext();
		        console.log(oContext.getObject());
		        var id = oContext.getProperty("ID_PROCESO");
		        var tipo = oContext.getProperty("TIPO_PROCESO_ID");
		        var oModel = new sap.ui.model.odata.ODataModel(url,true);
				var oView = this.getView();
				oView.byId("tit").setObjectTitle("Solicitud: "+id);
				oView.byId("ObjectPageLayout").setVisible(true);
				oModel.read("/DetalleSolicitudSet(TIPO_PROCESO='"+tipo+"',ID_SOLICITUD='"+id+"')", null, [""], false,
						function(data, response) {
								oView.setBusy(false);
								var oModelProceso = new sap.ui.model.json.JSONModel();
								console.log(data.results);
								var resultados = data;
								var oModel = new sap.ui.model.json.JSONModel();
								oModel.setData(resultados);
								oView.setModel(oModel,"dataModel");
									var estado="None";
									var icon = "/FioriSCP.z_figestionacreedores/img/Created.png";
									var tipo = "";
									if(resultados.TIPO_PROCESO==='C')
										tipo="Creación";
									else if(resultados.TIPO_PROCESO==='U')
										tipo="Modificación";
									else if(resultados.TIPO_PROCESO==='E')
										tipo="Ampliación";
									else if(resultados.TIPO_PROCESO==='D')
										tipo="Borrado";
									
									if(resultados.SEMAFORO==='1'){
										estado="None";
									}else if(resultados.SEMAFORO==='2'){
										estado="Warning";
										icon = "/FioriSCP.z_figestionacreedores/img/InProcess.png";
									}else if(resultados.SEMAFORO==='3'){
										estado="Success";
										icon = "/FioriSCP.z_figestionacreedores/img/Aproved.png";
									}else if(resultados.SEMAFORO==='4'){
										estado="Error";
										icon = "/FioriSCP.z_figestionacreedores/img/Reject.png";
									}
								 
									/*var obj={
											"ID_PROCESO":	resultados.ID_PROCESO,
											"TIPO_PROCESO":	tipo,
											"ERSDA":		resultados.ERSDA,
											"ESTADO":		resultados.ESTADO,
											"SUBESTADO":	resultados.SUBESTADO,
											"NAME1": 		resultados.NAME1,
											"KTOKK":		resultados.KTOKK,
											"MOTIVO_RECHAZO": resultados.MOTIVO_RECHAZO,
											"SEMAFORO":		resultados.SEMAFORO,
											"STATE":		estado,
											"ICON":			icon
											
									};
								
								
//									oView.byId("ID_PROCESO").setText(resultados.ID_PROCESO);
//									oView.byId("TIPO_PROCESO").setText(tipo);
//									oView.byId("FECHA").setText(resultados.ERSDA);
//								this.getView().byId("ESTADO").setText(resultados.ESTADO);
								var subest=resultados.SUBESTADO;
								if(subest!=''){
									oView.byId("lblSubEst").setVisible(true);
									oView.byId("SUBESTADO").setText(subest);
								}else{
									oView.byId("lblSubEst").setVisible(false);
									oView.byId("SUBESTADO").setVisible(false);
								}
								oView.byId("ACREEDOR").setText(resultados.NAME1);
								oView.byId("GRUPO").setText(resultados.KTOKK);
								var motrec = resultados.MOTIVO_RECHAZO;
								if(motrec!=''){
									oView.byId("MOTRECH").setText(motrec);
									oView.byId("lblMotRech").setVisible(true);
								}else{
									oView.byId("MOTRECH").setVisible(false);
									oView.byId("lblMotRech").setVisible(false);
								}
								oView.byId("ICON").setSrc(icon);
								oView.byId("ICON").setAlt(estado);
//						        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
//								oRouter.navTo("detalle");
//								this._getDialog();
//								this.onGoToProductTable();
								oView.byId("APROBADOR").setText(resultados.APROBADOR);
								oView.byId("STCD1").setText(resultados.STCD1);*/
								oView.byId("idSolicTable").setVisible(false);
								
								
						}, function(err) {
							oView.setBusy(false);
							var errTxt = err.message + "\n";
							sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
						});	
				
		       				
				
				
				
			},
			toListado:function(){
				
				this.getView().byId("idSolicTable").setVisible(true);
				this.getView().byId("ObjectPageLayout").setVisible(false);
			},
			onGoToProductTable: function(oEvent) {
				var oScrollContainer = sap.ui.getCore().byId("idScrollContainer");
				var oCurrentView = oScrollContainer.getContent();
				if (!oCurrentView[0]) {
				        var view = sap.ui.getCore().byId("detalle");
				        if (view === undefined) {
				            view = sap.ui.view({
				                type: sap.ui.core.mvc.ViewType.JS,
				                viewName: "z_figestionacreedores.view.detalle"
				            });
				        }
				        oScrollContainer.addContent(view);
				}},
			filtrarListado:function(oEvent){
				var filters = [];
			    var query = oEvent.getParameter("query");
			    if (query && query.length > 0) {
			        
			        var oFilter2 = new sap.ui.model.Filter("NAME1", sap.ui.model.FilterOperator.Contains, query);
			        var oFilter3 = new sap.ui.model.Filter("TIPO_PROCESO", sap.ui.model.FilterOperator.Contains, query);
			        var oFilter6 = new sap.ui.model.Filter("ID_PROCESO", sap.ui.model.FilterOperator.Contains, query);
			        var oFilter5 = new sap.ui.model.Filter("KTOKK", sap.ui.model.FilterOperator.Contains, query);
			        var oFilter4 = new sap.ui.model.Filter("ERSDA", sap.ui.model.FilterOperator.Contains, query);
			        var oFilter1 = new sap.ui.model.Filter("ESTADO", sap.ui.model.FilterOperator.Contains, query);
			       
			        var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2,oFilter3,oFilter4,oFilter5,oFilter6]); 
			    }

			    var tabla = this.getView().byId("idSolicTable");
			    var binding = tabla.getBinding("items");
			    binding.filter(allFilter, sap.ui.model.FilterType.Application); 
				
			},
			_getDialog : function () {
				if (!this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("z_figestionacreedores.view.detall", this);
					this.getView().addDependent(this._oDialog);
					
				}
//				return this._oDialog;
				this._oDialog.open();
			},
			handleOpenDialog: function () {
				this._getDialog().open();
			},
			handleOpenDialogFilter: function () {
				this._getDialog().open("filter");
			},
			handleConfirm: function (oEvent) {
				if (oEvent.getParameters().filterString) {
					MessageToast.show(oEvent.getParameters().filterString);
				}
			},
			onExit : function() {
				// destroy the model
				this.oModel.destroy();
			},
	 
			handlePress: function (evt) {
				var sSrc = evt.getSource().getTarget();
				var oDialog = new sap.m.Dialog({
					content: new sap.m.Image({
						src: sSrc
					}),
					beginButton: new sap.m.Button({
						text: 'Close',
						press: function () {
							oDialog.close();
						}
					}),
					afterClose: function() {
						oDialog.destroy();
					}
				});
				oDialog.open();
			},
			
		});
});