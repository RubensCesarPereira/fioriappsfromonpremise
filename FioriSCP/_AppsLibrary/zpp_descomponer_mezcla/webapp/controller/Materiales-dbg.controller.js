sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	'sap/ui/model/json/JSONModel',
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"cl/conchaytoro/zpp_descomponer_mezcla/model/formatter"
], function (Controller, History, JSONModel, MessageToast, MessageBox, formatter) {
	"use strict";
	
	var goTableMat;
	return Controller.extend("cl.conchaytoro.zpp_descomponer_mezcla.controller.View1", {
		formatter: formatter,
		_cantidadMax: 0,
		

		onInit: function () {
			$.sap.Adicion = ["11016449", "11016626", "11003526", "11013396", "488000", "488010", "488510", "497010", "497310", "489510"];
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Materiales").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			var sOrden = oEvent.getParameter("arguments").Orden;
			var cOrden = this.getView().byId("orden");
			cOrden.setText(sOrden);

			var sCantidad = oEvent.getParameter("arguments").Cantidad;
			var cCantidad = this.getView().byId("cantidad");
			cCantidad.setValue(sCantidad);

			this._cantidadMax = sCantidad;
			this.calculado = false;
			var oTable2 = this.getView().byId("tablaMateriales");
			var oModel = this.getOwnerComponent().getModel("dos");
			var Filters = [];
			var filter = new sap.ui.model.Filter("Orden", sap.ui.model.FilterOperator.EQ, sOrden);
			Filters.push(filter);
			sap.ui.core.BusyIndicator.show();
			var that = this;
			oModel.read("/DesclistaSet", { //Busca datos tabla
				filters: Filters,
				success: function (oData) {
					sap.ui.core.BusyIndicator.hide();
					oTable2.setModel(new JSONModel(oData.results), "materiales");
					//Guarda dato
					oTable2.getItems().forEach(function (fila, index) {
						fila.getCells()[3].getCustomData()[0].setValue(fila.getModel("materiales").getData()[index].Cantidad);
						if (oTable2.getModel("materiales").oData[index].MTART != ''){
							fila.setVisible(false);
						}
					});
					that.calculaComponente();
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					oTable2.setModel(new JSONModel([]), "materiales");
					sap.m.MessageBox.error("Error en El Servicio", {
						title: "Error",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}

			});

		},

		_onPageNavButtonPress: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("RouteView1", {}, true);
			}
		},

		//Función re calcula cantidades por componente
		calculaComponente: function () {
			this.calculado = true;
			//Obtiene Tabla
			var oTableMat = this.getView().byId("tablaMateriales");
			var oCantDescom = Number(this.getView().byId("cantidad").getValue().split(".").join("").replace(",", "."));
			var iCantMaxima = this._cantidadMax;
			var sCantidad = this.getView().byId("cantidad").getValue();
			var iCantidadMax = Number(this._cantidadMax.split(".").join("").replace(",", "."));

			var oSuma = 0;
			var oCantComp = 0;
			var nvoValorComp = 0;
			
			if (oCantDescom > iCantidadMax) {
				sap.m.MessageBox.error("Stock ingresado supera el máximo disponible de " + this._cantidadMax, {
					title: "Error",
					onClose: function () {
						return;
					},
					styleClass: "",
					initialFocus: null,
					textDirection: sap.ui.core.TextDirection.Inherit
				});
				this.calculado = false;
				return false;
			}

			//Remover imtes oTableMat.removeItems();

			oTableMat.getItems().forEach(function (fila, index) {
				//if ($.sap.Adicion.indexOf(fila.getCells()[1].getText()) === -1) {
					oSuma = oSuma + Number(fila.getCells()[3].data("IniCant").trim().split(".").join("").replace(",", "."));
				//}

			});

			goTableMat = oTableMat;
			oTableMat.getItems().forEach(function (fila, index) {
				//if ($.sap.Adicion.indexOf(fila.getCells()[1].getText()) === -1) {
				if (goTableMat.getModel("materiales").oData[index].MTART == ''){
					oCantComp = Number(fila.getCells()[3].data("IniCant").trim().split(".").join("").replace(",", "."));
					nvoValorComp = (oCantDescom * oCantComp) / oSuma;
					fila.getCells()[3].setText(Intl.NumberFormat('de-DE').format(nvoValorComp.toFixed(3)));
				}

			});

			return true;
		},

		addDot: function (oEvt) {
			this.calculado = false;
			if (!/^[\d]+(\.[\d]{3,})*(\,[\d]{1,3})?$/.test(oEvt.getParameter('value'))) {
				oEvt.getSource().setValue(oEvt.getParameter('value'));
				oEvt.getSource().setValueState(sap.ui.core.ValueState.Error);
				return;
			}

			oEvt.getSource().setValueState(sap.ui.core.ValueState.Success);
			//botonA.setEnabled(true);
			var vInput = oEvt.getParameter('value');
			var entrada = vInput.split('.').join('');
			entrada = entrada.split(',');
			var entrada2 = entrada[0].split('').reverse();
			var salida = [];
			var aux = '';
			var paginador = Math.ceil(entrada2.length / 3);
			for (var i = 0; i < paginador; i++) {
				for (var j = 0; j < 3; j++) {
					if (entrada2[j + (i * 3)] !== undefined) {
						aux += entrada2[j + (i * 3)];
					}
				}
				salida.push(aux);
				aux = '';
				if (entrada[1] !== undefined)
					oEvt.getSource().setValue(salida.join('.').split("").reverse().join('') + "," + entrada[1]);
				else
					oEvt.getSource().setValue(salida.join('.').split("").reverse().join(''));
			}

		},

		onSave: function () {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("dos");
			var orden = this.getView().byId("orden").getText();
			//var oTable = this.getView().byId("tablaMateriales");
			//var vFilas = oTable.getItems();
			//var Tabla = [];
			if (!this.calculaComponente()) {
				return;
			}

			if (!this.calculado) {
				MessageBox.warning("Los Datos fueron Actualizados. Vuelva a ejecutar Descomponer.");
				this.calculaComponente();
				return;
			}
			var oCantidad = this.getView().byId("cantidad");
			var nValueCantidad = Number(oCantidad.getValue().split(".").join("").split(",").join("."));
			if (nValueCantidad > this.maxValue) {
				MessageBox.error("¡Cantidad Supera Actual Stock Disponible!");
				return;
			} else {
				/*vFilas.forEach(function (entry) {
					Tabla.push({
						Orden: orden,
						Total: "",
						Codigo2: entry.getCells()[1].getText(),
						Posicion: entry.getCells()[0].getText(),
						Cantidad: Number(entry.getCells()[3].getText().split(".").join("").split(",").join(".")),
						Almacen: entry.getCells()[4].getText()
					});
				});*/
				var oData = {
					Orden: orden,
					Quantity: nValueCantidad
						//Descordenpo: Tabla
				};
				sap.ui.core.BusyIndicator.show();
				oModel.create("/DescordenSet", oData, {
					success: function (Respuesta) {
						sap.ui.core.BusyIndicator.hide();
						/*if (Respuesta.rorden === "") {
							sap.m.MessageBox.error("¡No se pudo generar Descomposición!", {
								title: "Error", // default
								onClose: function () {
									that._onPageNavButtonPress();
								},
								styleClass: "", // default
								initialFocus: null, // default
								textDirection: sap.ui.core.TextDirection.Inherit // default
							});
						} else {*/
						sap.m.MessageBox.success("¡La Orden N° " + Respuesta.ROrden + " ha sido Creada!", {
							title: "Confirmación",
							onClose: function () {
								that._onPageNavButtonPress();
							},
							styleClass: "",
							initialFocus: null,
							textDirection: sap.ui.core.TextDirection.Inherit
						});
						//}

					}.bind(this),
					error: function (Respuesta) {
						sap.ui.core.BusyIndicator.hide();
						sap.m.MessageBox.error("¡Error al Crear Descomposición!", {
							title: "Error",
							onClose: function () {
								that._onPageNavButtonPress();
							},
							styleClass: "",
							initialFocus: null,
							textDirection: sap.ui.core.TextDirection.Inherit
						});
					}.bind(this)
				});

				//MessageToast.show("Mezcla ha sido Descompuesta");
			}

		}

	});
});