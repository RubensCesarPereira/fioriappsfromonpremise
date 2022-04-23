sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {

	"use strict";
	var gThis = null;
	var gUnidad = "";

	return Controller.extend("conchaytoro.cl.zsd_crear_merma.controller.View1", {
		onInit: function () {
			gThis = this;
			var oModel = new JSONModel();
			this.getView().setModel(oModel, "aux");

			var oData = {
				"merma": [{
					"name": "Y03",
					"value": "Merma por Relleno"
				}, {
					"name": "Y05",
					"value": "Merma por Accidente"
				}]
			};

			var mModel = new JSONModel(oData);
			this.getView().setModel(mModel, "mm");

			var mData = {
				"motivo": [{
					"name": "1",
					"value": "Por Proceso"
				}, {
					"name": "2",
					"value": "Extraordinaria"
				}, {
					"name": "3",
					"value": "Por Ineficiencia"
				}]
			};

			var pModel = new JSONModel(mData);
			this.getView().setModel(pModel, "pp");
		},

		_position: function () {
			var iResult = 0;
			var oTable = this.getView().byId("posTable");
			iResult = oTable.getItems().length;
			iResult = (iResult + 1) * 10;
			return iResult;

		},

		//Descripción del Material
		_descript: function (oEvent) {
			var material = oEvent.getSource().getParent().getCells()[1].getValue();
			var almacen = oEvent.getSource().getParent().getCells()[5];
			almacen.removeAllItems();
			var centro = gThis.getView().byId("centro").getSelectedKey();
			var descript = oEvent.getSource().getParent().getCells()[2]; //sap.ui.getCore().byId("descrip");
			var unidad = oEvent.getSource().getParent().getCells()[4];
			var sResult = "Sin Descripción";
			var oMod = this.getOwnerComponent().getModel();
			oMod.read("/MaterialSet(Matnr='" + material + "',Werks='" + centro + "')", {
				success: function (oData) {
					if (oData.Matnr === "") {
						sap.m.MessageBox.warning("¡Material No Existe en Bodega seleccionada!", {
							title: "Advertencia", // default
							onClose: null, // default
							styleClass: "", // default
							initialFocus: null, // default
							textDirection: sap.ui.core.TextDirection.Inherit // default
						});
					} else {
						sResult = oData.Maktx;
						gUnidad = oData.Meins;
						descript.setProperty('text', sResult);
						unidad.setProperty('text', gUnidad);
						var Filters = [];
						var filter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, material);
						Filters.push(filter);
						filter = new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, centro);
						Filters.push(filter);
						oMod.read("/AlmacenSet", {
							success: function (Resultado) {
								Resultado.results.forEach(function (e) {
									var newItem = new sap.ui.core.ListItem({
										key: e.Lgort,
										text: e.Lgobe,
										additionalText: e.Lgort
									});
									almacen.addItem(newItem);
								});
							}.bind(this),
							filters: Filters
						});
					}
				}.bind(this),
				error: function (oError) {
					var x = "hola";
					return x;
				}

			});

		},

		//Función que agrega la nueva posición
		onAdd: function (vDatos) {
			if (!this._validaCamposTabla()) {
				return;
			}
			var cTypeMer = gThis.getView().byId("movimiento");
			var cCen = gThis.getView().byId("centro");
			var cCos = gThis.getView().byId("costo");
			var cMotMer = gThis.getView().byId("motivo");

			var vTypeMer = cTypeMer.getSelectedKey();
			var vCen = cCen.getSelectedKey();
			var vCos = cCos.getSelectedKey();
			var vMotMer = cMotMer.getSelectedKey();

			var vPath = '/AlmacenSet?$filter=Werks%20eq%20%27' + vCen + '%27';
			if (vTypeMer === '' || vCen === '' || vCos === '' || vMotMer === '') {
				sap.m.MessageBox.warning("¡Favor Completar todos los Campos de Cabecera!", {
					title: "Advertencia", // default
					onClose: null, // default
					styleClass: "", // default
					initialFocus: null, // default
					textDirection: sap.ui.core.TextDirection.Inherit // default
				});
				return;
			}
			sap.ui.core.BusyIndicator.show();
			var pos = this._position();
			var oItem = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Text({
						text: pos
					}),
					//Código Material
					new sap.m.Input({
						maxLength: 10,
						liveChange: function (oEvt) {
							//var cCen = gThis.getView().byId("centro");
							//vCen = cCen.getSelectedKey();
							var material = oEvt.getSource().getParent().getCells()[1];
							var almacen = oEvt.getSource().getParent().getCells()[5];
							almacen.removeAllItems();
							if (vCen === '') {
								sap.m.MessageBox.warning("¡Seleccione Bodega!", {
									title: "Advertencia", // default
									onClose: null, // default
									styleClass: "", // default
									initialFocus: null, // default
									textDirection: sap.ui.core.TextDirection.Inherit // default
								});
								material.setValue('');
							} else {
								if (/^(M?\d{4}-?\d{4})|\d{6}$/.test(material.getValue())) {
									gThis.handleValidationSuccess(oEvt);
								} else {
									gThis.handleValidationError(oEvt);
								}
							}
						},
						placeholder: "Ej: 1112-2006",
						editable: true
					}),

					//Descripción Material
					new sap.m.Text({}),

					//Cantidad
					new sap.m.Input({
						required: true,
						maxLength: 12,
						type: sap.m.Input.Currency,
						liveChange: this.validaInput,
						placeholder: "Ej: 5.000",
						editable: true

					}),

					//Unidad
					new sap.m.Text({}),

					//Almacén
					new sap.m.ComboBox({
						required: true,
						showSecondaryValues: true,
						filterSecondaryValues: true,
						/*items: {
							path: "/AlmacenSet",
							sorter: {
								path: 'Lgort'
							},
							filters: [new sap.ui.model.Filter({
								path: "Werks",
								operator: sap.ui.model.FilterOperator.EQ,
								value1: vCen
							})],
							template: new sap.ui.core.ListItem({
								key: "{Lgort}",
								text: "{Lgobe}",
								additionalText: "{Lgort}"
							})
						},*/
						editable: true,
						change: function (oEvt) {
							var material = oEvt.getSource().getParent().getCells()[1].getValue();
							var centro = gThis.getView().byId("centro").getSelectedKey();
							var almacen = oEvt.getSource().getParent().getCells()[5].getSelectedKey();
							var lote = oEvt.getSource().getParent().getCells()[6];
							var oMod = this.getModel();
							var Filters = [];
							var filter = new sap.ui.model.Filter("IMatnr", sap.ui.model.FilterOperator.EQ, material);
							Filters.push(filter);
							filter = new sap.ui.model.Filter("IWerks", sap.ui.model.FilterOperator.EQ, centro);
							Filters.push(filter);
							filter = new sap.ui.model.Filter("ILgort", sap.ui.model.FilterOperator.EQ, almacen);
							Filters.push(filter);
							oMod.read("/LoteSet", {
								success: function (Resu) {
									Resu.results.forEach(function (e) {
										var newItem = new sap.ui.core.ListItem({
											key: e.Batch,
											text: e.Clabs + " - " + e.Atwrt,
											additionalText: e.Batch
										});
										lote.addItem(newItem);
									});
								}.bind(this),
								filters: Filters
							});
						}
					}),

					//Lote
					new sap.m.ComboBox({
						required: true,
						showSecondaryValues: true,
						filterSecondaryValues: true,
						editable: true,
						change: function (oEvent) {
							oEvent.getSource().setValue(oEvent.getSource().getSelectedKey());
						}
					}),
					/*new sap.m.Input({
						maxLength: 10,
						liveChange: function (oEvt) {
							var centroD = oEvt.getSource().getParent().getCells()[5].getSelectedKey();
							if (centroD === '') {
								sap.m.MessageBox.warning("¡Seleccione Almacén!", {
									title: "Advertencia", // default
									onClose: null, // default
									styleClass: "", // default
									initialFocus: null, // default
									textDirection: sap.ui.core.TextDirection.Inherit // default
								});
							}
						},
						placeholder: "Ej: 0000411957",
						editable: true
					}),*/

					new sap.m.Button({
						icon: "sap-icon://decline",
						width: "3em",
						press: [this._remove, this]
					})
				]
			});
			sap.ui.core.BusyIndicator.hide();
			var oTable = gThis.getView().byId('posTable');
			oTable.addItem(oItem);
		},

		validaInput: function (oEvt) {
			var centroD = oEvt.getSource().getParent().getCells()[1].getValue();
			var cantidad = oEvt.getSource().getParent().getCells()[3];
			if (centroD === '') {
				sap.m.MessageBox.warning("¡Ingrese Material!", {
					title: "Advertencia", // default
					onClose: null, // default
					styleClass: "", // default
					initialFocus: null, // default
					textDirection: sap.ui.core.TextDirection.Inherit // default
				});
				cantidad.setValue('');
			} else {
				gThis.addDot(oEvt);
			}
		},

		addDot: function (oEvt) {
			if (!/^[\d]+(\.[\d]{3,})*(\,[\d]{1,3})?$/.test(oEvt.getParameter('value'))) {
				oEvt.getSource().setValue(oEvt.getParameter('value'));
				oEvt.getSource().setValueState(sap.ui.core.ValueState.Error);
				return;
			}
			oEvt.getSource().setValueState(sap.ui.core.ValueState.Success);
			var vInput = oEvt.getParameter('value');
			var entrada = vInput.split('.').join('');
			entrada = entrada.split(',');
			var entrada2 = entrada[0].split('').reverse();
			var salida = [];
			var aux = '';
			var paginador = Math.ceil(entrada2.length / 3);
			for (var i = 0; i < paginador; i++) {
				for (var j = 0; j < 3; j++) {
					if (entrada2[j + (i * 3)] != undefined) {
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

		clearInput: function (oEvent) {
			var cMov = this.getView().byId("movimiento");
			var cCentro = this.getView().byId("centro");
			var cCosto = this.getView().byId("costo");
			var cMotivo = this.getView().byId("motivo");

			cMov.setValue("");
			cCentro.setValue("");
			cCosto.setValue("");
			cMotivo.setValue("");
		},

		clearCells: function (oEvent) {
			var table = this.getView().byId("posTable");
			table.removeAllItems();
		},

		_clearMatnr: function () {
			this.getView().byId("costo").setValue("");
			this.getView().byId("motivo").setValue("");
			this.clearCells();
			//this.activeButton();
		},

		//DINAMICO
		onSave: function (oEvent) {
			if (!this._validaCamposTabla()) {
				return;
			}
			var o = this;
			//Obtiene el control
			var cMov = this.getView().byId("movimiento");
			var cCen = this.getView().byId("centro");
			var cCosto = this.getView().byId("costo");
			var cMotivo = this.getView().byId("motivo");
			var cTable = this.getView().byId("posTable");

			//Obtiene el valor del control
			var vMov = cMov.getSelectedKey();
			var vCen = cCen.getSelectedKey();
			var vCosto = cCosto.getSelectedKey();
			var vMotivo = cMotivo.getSelectedKey();
			var vFilas = cTable.getItems();

			var Tabla = [];
			vFilas.forEach(function (entry) {
				//debugger;
				Tabla.push({
					Rsnum: "",
					Rspos: entry.getCells()[0].getText(),
					Material: entry.getCells()[1].getValue(),
					StoreLoc: entry.getCells()[5].getSelectedKey(),
					Batch: entry.getCells()[6].getSelectedKey(),
					Quantity: entry.getCells()[3].getValue(),
					Unit: entry.getCells()[4].getText()
				});

			});

			var oModel = this.getOwnerComponent().getModel("dos");
			var oData = {
				Rsnum: "",
				MoveType: vMov,
				Plant: vCen,
				Kostl: vCosto,
				Motivo: vMotivo,
				MermaToPosiciones: Tabla
			};

			//return;
			sap.ui.core.BusyIndicator.show();
			oModel.create("/HeaderMermaSet", oData, {
				success: function (Respuesta) {
					sap.ui.core.BusyIndicator.hide();
					if (Respuesta.Rsnum === "0000000000") {
						sap.m.MessageBox.warning("¡El pedido no se ha creado! Verifique Datos Ingresados.", {
							title: "Advertencia", // default
							onClose: null, // default
							styleClass: "", // default
							initialFocus: null, // default
							textDirection: sap.ui.core.TextDirection.Inherit // default
						});
					} else {
						sap.m.MessageBox.success("¡Merma N° " + Respuesta.Rsnum + " ha sido Creada!", {
							title: "Confirmación",
							onClose: function () {
								o.clearInput();
								o.clearCells();
							},
							styleClass: "",
							initialFocus: null,
							textDirection: sap.ui.core.TextDirection.Inherit
						});
					}
					//oModel.setUseBatch(true);
				}.bind(this),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.error("¡Error al Crear Merma!", {
						title: "Error",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}.bind(this)
			});

		},

		//EN DURO
		_onSave: function (oEvent) {
			var Tabla = [];
			Tabla.push({
				Rsnum: "",
				Rspos: "",
				Material: "1104-2019",
				StoreLoc: "0005",
				Batch: "0000411957",
				Quantity: "1.320",
				Unit: "L"
			});

			var oModel = this.getOwnerComponent().getModel("dos");
			var oData = {
				Rsnum: "",
				MoveType: "Y03",
				Plant: "1021",
				Kostl: "1020207",
				Motivo: "ZT",
				MermaToPosiciones: Tabla
			};

			//oData.Item = Tabla;
			//return;
			sap.ui.core.BusyIndicator.show();
			oModel.create("/HeaderMermaSet", oData, {
				success: function (Respuesta) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.success("¡Merma N° " + Respuesta.Rsnum + " ha sido Creada!", {
						title: "Confirmación",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
					//oModel.setUseBatch(true);
				}.bind(this),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.error("Error al Crear Solicitud", {
						title: "Error",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}.bind(this)
			});

		},

		//Función para mostrar contador de items
		onUpdateFinished: function (oEvent) {
			var sTitle = "Posiciones",
				oTable = this.getView().byId("posTable");

			if (oTable.getBinding("items").isLengthFinal()) {
				var iCount = oEvent.getParameter("total"),
					iItems = oTable.getItems().length;
				//sTitle += "(" + iItems + "/" + iCount + ")";
				sTitle += "(" + iCount + ")";
			}
			this.getView().byId("title").setText(sTitle);
		},

		handleValidationError: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			var descript = oEvent.getSource().getParent().getCells()[2];
			var unidad = oEvent.getSource().getParent().getCells()[4];
			descript.setProperty('text', '');
			unidad.setProperty('text', '');

		},

		handleValidationSuccess: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
			gThis._descript(oEvent);
		},

		handleValidationError2: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			this.validaInput();
		},

		handleValidationSuccess2: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
			this.validaInput();
			//evaluar input
		},

		_remove: function (oEvent) {
			var oTable = gThis.getView().byId('posTable');
			oTable.removeItem(oEvent.getSource().getParent());
		},

		_validaCamposTabla: function () {
			var oTable = gThis.getView().byId('posTable');
			if (oTable.getItems().length === 0) return true;
			var bError = true;
			oTable.getItems().forEach(function (fila) {
				if (fila.getCells()[0].getText() === "" || fila.getCells()[1]
					.getValue() === "" || fila.getCells()[1].getValueState() !== sap.ui.core.ValueState.Success || fila.getCells()[2].getText() ===
					"" || fila.getCells()[3]
					.getValue() === "" || fila.getCells()[3].getValueState() !== sap.ui.core.ValueState.Success || fila.getCells()[4].getText() ===
					"" || fila.getCells()[5]
					.getValue() === "" || fila.getCells()[6]
					.getValue() === "") {
					bError = false;
					return;
				}
				bError = /^\d{2}.\d{2}.\d{4}$/.test(fila.getCells()[6].getValue());
			});
			if (!bError)
				sap.m.MessageBox.error("¡No es posible Crear, campos Vacíos o con datos Erróneos!", {
					title: "Error", // default
					onClose: null, // default
					styleClass: "", // default
					initialFocus: null, // default
					textDirection: sap.ui.core.TextDirection.Inherit // default
				});
			return bError;
		},

		handleDate: function (oEvent) {
			var cDate = oEvent.getSource();
			var bValid = oEvent.getParameter("valid");
			if (bValid) {
				cDate.setValueState(sap.ui.core.ValueState.None);

			} else {
				cDate.setValueState(sap.ui.core.ValueState.Error);
			}

		}

	});
});