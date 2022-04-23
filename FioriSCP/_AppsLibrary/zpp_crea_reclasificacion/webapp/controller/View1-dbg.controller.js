sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {

	"use strict";
	var gThis = null;
	var gUnidad = "";

	return Controller.extend("cl.conchaytoro.zpp_crea_reclasificacion.controller.View1", {
		onInit: function () {

			gThis = this;
			/*var oModel = new JSONModel();
			this.getView().setModel(oModel, "aux");*/

			var oModelo = this.getOwnerComponent().getModel("tres");
			this.getView().setModel(oModelo, "motivo");

			var userID,
				responsable,
				oInput = gThis.getView().byId("enologo");

			if (sap.ushell) {
				responsable = sap.ushell.Container.getService("UserInfo");
				if (responsable) {
					//userID = responsable.getUser().getId();
					userID = responsable.getUser().getFirstName();
					oInput.setValue(userID);
				}
			}
			//return userID;

		},

		//Función que agrega la nueva posición
		onAdd: function (vDatos) {
			if (!this._validaCamposTabla("add")) {
				return;
			}
			var cCen = gThis.getView().byId("centro");
			var cMotivo = gThis.getView().byId("motivo");
			var cCodigo = gThis.getView().byId("codOrigen");
			//var cCantidad = gThis.getView().byId("cantidad");
			var cEnologo = gThis.getView().byId("enologo");
			var vCen = cCen.getSelectedKey();
			var vMotivo = cMotivo.getSelectedKey();
			var vCodigo = cCodigo.getValue();
			//var cosecha = vCodigo.substr(vCodigo.length - 4);
			//var vCantidad = cCantidad.getValue();
			var vEnologo = cEnologo.getValue();

			if (vCen === '' || vMotivo === '' || vCodigo === '' || vEnologo === '') {
				sap.m.MessageBox.warning("¡Favor completar todos los campos de cabecera!", {
					title: "Advertencia", // default
					onClose: null, // default
					styleClass: "", // default
					initialFocus: null, // default
					textDirection: sap.ui.core.TextDirection.Inherit // default
				});
				return;
			}
			//sap.ui.core.BusyIndicator.show();
			var oItem = new sap.m.ColumnListItem({
				cells: [

					//Código Vino Destino
					new sap.m.Input({
						maxLength: 10,
						liveChange: function (oEvt) {
							var material = oEvt.getSource().getParent().getCells()[0];
							var almacen = oEvt.getSource().getParent().getCells()[4];
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
						editable: true,
						change: function (oEvt) {
							var material = oEvt.getSource().getParent().getCells()[0].getValue();
							var centro = gThis.getView().byId("centro").getSelectedKey();
							var almacen = oEvt.getSource().getParent().getCells()[4].getSelectedKey();
							//var lote = oEvt.getSource().getParent().getCells()[5];
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
											text: e.Clabs,
											additionalText: e.Batch
										});
										//lote.addItem(newItem);
									});
								}.bind(this),
								filters: Filters
							});
						}
					}),

					//Año Cosecha
					new sap.m.Input({
						maxLength: 4,
						type: sap.m.Input.Number,
						liveChange: function (oEvt) {
							if (!/^\d{4}$/.test(oEvt.getParameter('value'))) {
								oEvt.getSource().setValueState(sap.ui.core.ValueState.Error);
							} else {
								oEvt.getSource().setValueState(sap.ui.core.ValueState.Success);
							}

						},
						placeholder: "Ej: 2020",
						editable: true
					}),

					//Eliminar
					new sap.m.Button({
						icon: "sap-icon://decline",
						width: "3em",
						press: [this._remove, this]
					})
				]
			});

			var oTable = gThis.getView().byId('posTable');
			oTable.addItem(oItem);
		},

		validaEn: function (oEvt) {
			var cEnologo = gThis.getView().byId("enologo");
			var vEnologo = cEnologo.getValue();
			if (vEnologo === "") {
				//cEnologo.setValue("");
				cEnologo.setValueState(sap.ui.core.ValueState.Error);
			} else {
				cEnologo.setValueState(sap.ui.core.ValueState.Success);
				//this.activeButton();
			}

		},

		selectAlmacen: function (oEvent) {
			var lote = gThis.getView().byId("lote");
			lote.setValue("");
			var material = gThis.getView().byId("codOrigen").getValue();
			var centro = gThis.getView().byId("centro").getSelectedKey();
			var almacen = gThis.getView().byId("almacen").getSelectedKey();
			var oMod = this.getOwnerComponent().getModel();
			var Filters = [];
			var filter = new sap.ui.model.Filter("IMatnr", sap.ui.model.FilterOperator.EQ, material);
			Filters.push(filter);
			filter = new sap.ui.model.Filter("IWerks", sap.ui.model.FilterOperator.EQ, centro);
			Filters.push(filter);
			filter = new sap.ui.model.Filter("ILgort", sap.ui.model.FilterOperator.EQ, almacen);
			Filters.push(filter);
			oMod.read("/LoteSet", {
				success: function (Resu) {
					lote.destroyItems();
					Resu.results.forEach(function (e) {
						var newItem = new sap.ui.core.ListItem({
							key: e.Batch,
							text: e.Clabs + " - " + e.Atwrt,
							additionalText: e.Batch
						});
						lote.addItem(newItem);
					});
				}.bind(this),
				error: function (oEvt) {
					gThis.handleValidationError3(oEvt);
				},
				filters: Filters
			});
		},

		selectLote: function (oEvent) {
			oEvent.getSource().setValue(oEvent.getSource().getSelectedKey());
			var cantidad = gThis.getView().byId("cantidad");
			cantidad.setValue("");
			this.clearCells();
		},

		validaInput: function (oEvt) {
			var cMaterial = gThis.getView().byId("codOrigen");
			var vMaterial = cMaterial.getValue();
			var cCantidad = gThis.getView().byId("cantidad");

			if (vMaterial === '') {
				sap.m.MessageBox.warning("¡Ingrese Material!", {
					title: "Advertencia", // default
					onClose: null, // default
					styleClass: "", // default
					initialFocus: null, // default
					textDirection: sap.ui.core.TextDirection.Inherit // default
				});
				cCantidad.setValue('');
				//cCantidad.setValueState(sap.ui.core.ValueState.None);
			} else {
				gThis.addDot(oEvt);
			}
			gThis._calculaTotal();
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

		_remove: function (oEvent) {
			var oTable = gThis.getView().byId('posTable');
			oTable.removeItem(oEvent.getSource().getParent());
		},

		_validaCamposTabla: function (motivo) {
			var oTable = gThis.getView().byId('posTable');
			var oMotivo = gThis.getView().byId("motivo").getSelectedKey();
			if (oTable.getItems().length === 0) return true;
			var bError = true;
			oTable.getItems().forEach(function (fila) {
				if (!bError) {
					return;
				}
				if ( (oMotivo !== "10" && oMotivo !== "80") && motivo === "add" ) {
					sap.m.MessageBox.error("¡Motivo No Permite más de una Posición!", {
						title: "Error", // default
						onClose: null, // default
						styleClass: "", // default
						initialFocus: null, // default
						textDirection: sap.ui.core.TextDirection.Inherit // default
					});
					bError = false;
					return;
				} else {
					if (fila.getCells()[0].getValue() === "" ||
						fila.getCells()[0].getValueState() !== sap.ui.core.ValueState.Success ||
						fila.getCells()[1].getText() === "" ||
						fila.getCells()[2].getValue() === "" ||
						fila.getCells()[2].getValueState() !== sap.ui.core.ValueState.Success ||
						fila.getCells()[3].getText() === "" ||
						fila.getCells()[4].getValue() === "" || fila.getCells()[5].getValue() === "" ||
						fila.getCells()[5].getValueState() !== sap.ui.core.ValueState.Success) {

						sap.m.MessageBox.error("¡Campos Vacíos o con Datos Erróneos!", {
							title: "Error en Campos", // default
							onClose: null, // default
							styleClass: "", // default
							initialFocus: null, // default
							textDirection: sap.ui.core.TextDirection.Inherit // default
						});
						bError = false;
						return;
					}
				}

			});

			//if (!bError)
			//return;

			return bError;

		},

		_inputMaterial: function (oEvt, oData) {
			var cCen = gThis.getView().byId("centro");
			var vCen = cCen.getSelectedKey();
			var cMaterial = gThis.getView().byId("codOrigen");
			var vMaterial = cMaterial.getValue();
			var almacen = gThis.getView().byId("almacen");
			almacen.removeAllItems();
			if (vCen === '') {
				sap.m.MessageBox.warning("¡Favor seleccione Bodega!", {
					title: "Advertencia", // default
					onClose: null, // default
					styleClass: "", // default
					initialFocus: null, // default
					textDirection: sap.ui.core.TextDirection.Inherit // default
				});
				if (oData.Matnr === "") {
					sap.m.MessageBox.warning("¡Material No Existe en Bodega Seleccionada!", {
						title: "Advertencia", // default
						onClose: null, // default
						styleClass: "", // default
						initialFocus: null, // default
						textDirection: sap.ui.core.TextDirection.Inherit // default
					});
				}
				vMaterial.setValue("");
			} else {
				if (/^(M?\d{4}-?\d{4})|\d{6}$/.test(vMaterial)) {
					gThis.handleValidationSuccess2(oEvt);
				} else {
					gThis.handleValidationError2(oEvt);
				}
			}
		},

		_inputDescript: function (oEvent) {
			var cMaterial = gThis.getView().byId("codOrigen");
			var vMaterial = cMaterial.getValue();
			var centro = gThis.getView().byId("centro").getSelectedKey();
			var cDes = gThis.getView().byId("descripcion");
			var almacen = gThis.getView().byId("almacen");
			//almacen.removeAllItems();
			var sResult = "Sin Descripción";
			var oMod = this.getOwnerComponent().getModel();
			oMod.read("/MaterialSet(Matnr='" + vMaterial + "',Werks='" + centro + "')", {
				success: function (oData) {
					if (oData.Matnr === "") {
						sap.m.MessageBox.warning("¡Material No Existe en Bodega Seleccionada!", {
							title: "Advertencia", // default
							onClose: null, // default
							styleClass: "", // default
							initialFocus: null, // default
							textDirection: sap.ui.core.TextDirection.Inherit // default
						});
					} else {
						sResult = oData.Maktx;
						cDes.setValue(sResult);
						var Filters = [];
						var filter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, vMaterial);
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

			//Buscar almacenes

		},

		//Descripción del Material
		_descript: function (oEvent) {
			var material = oEvent.getSource().getParent().getCells()[0].getValue();
			var centro = gThis.getView().byId("centro").getSelectedKey();
			var descript = oEvent.getSource().getParent().getCells()[1]; //sap.ui.getCore().byId("descrip");
			var unidad = oEvent.getSource().getParent().getCells()[3];
			var almacen = oEvent.getSource().getParent().getCells()[4];
			var sResult = "Sin Descripción";
			var oMod = this.getOwnerComponent().getModel();
			oMod.read("/MaterialSet(Matnr='" + material + "',Werks='" + centro + "')", {
				success: function (oData) {
					if (oData.Matnr === "") {
						sap.m.MessageBox.warning("¡Material No Existe en Bodega Seleccionada!", {
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

		_clearMatnr: function () {
			this.getView().byId("descripcion").setValue("");
			this.getView().byId("cantidad").setValue("");
			this.getView().byId("almacen").setValue("");
			this.getView().byId("lote").setValue("");
			this.getView().byId("codOrigen").setSelectedKey("");
			this.getView().byId("codOrigen").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("cantidad").setValueState(sap.ui.core.ValueState.None);
			this.clearCells();

		},

		clearInput: function (oEvent) {
			var cCentro = this.getView().byId("centro");
			var cMotivo = this.getView().byId("motivo");
			var cOrigen = this.getView().byId("codOrigen");
			var cDescripcion = this.getView().byId("descripcion");
			var cCantidad = this.getView().byId("cantidad");
			var cAlmacen = this.getView().byId("almacen");
			var cLote = this.getView().byId("lote");
			//var cEnologo = this.getView().byId("enologo");

			cCentro.setValue("");
			cMotivo.setValue("");
			cOrigen.setValue("");
			cOrigen.setValueState(sap.ui.core.ValueState.None);
			cDescripcion.setValue("");
			cCantidad.setValue("");
			cCantidad.setValueState(sap.ui.core.ValueState.None);
			cAlmacen.setValue("");
			cLote.setValue("");
			//cEnologo.setValue("");

			this.clearCells();
		},

		clearCells: function (oEvent) {
			var table = this.getView().byId("posTable");
			table.removeAllItems();
		},

		activeButton: function () {
			var boton = this.getView().byId("btnCrear");
			var motivo = this.getView().byId("motivo");
			var centro = this.getView().byId("centro");
			var codigo = this.getView().byId("codOrigen");
			var cantidad = this.getView().byId("cantidad");
			var enologo = this.getView().byId("enologo");

			if (motivo.getSelectedKey() === "" ||
				motivo.getValueState() !== sap.ui.core.ValueState.Success ||
				centro.getSelectedKey() === "" || centro.getValueState() !== sap.ui.core.ValueState.Success ||
				codigo.getValue() === "" || codigo.getValueState() !== sap.ui.core.ValueState.Success ||
				cantidad.getValue() === "" || cantidad.getValueState() !== sap.ui.core.ValueState.Success ||
				enologo.getValue() === "" || enologo.getValueState() !== sap.ui.core.ValueState.Success) {

				boton.setEnabled(false);
			} else {
				boton.setEnabled(true);
			}
		},

		_calculaTotal: function () {
			var totalCantidad = 0;
			var inputTotal = this.getView().byId("cantidad");
			this.getView().byId("posTable").getItems().forEach(function (entry) {
				totalCantidad = totalCantidad + Number(entry.getCells()[2].getValue().split(".").join("").replace(",", "."));
				inputTotal.setValue(Intl.NumberFormat('de-DE').format(totalCantidad));
			});

		},

		_clearChangeMatnr: function () {
			this.getView().byId("cantidad").setValue("");
			this.getView().byId("almacen").setValue("");
			this.getView().byId("lote").setValue("");
			this.getView().byId("codOrigen").setSelectedKey("");
			this.getView().byId("codOrigen").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("cantidad").setValueState(sap.ui.core.ValueState.None);
		},

		onSave: function (oEvent) {
			if (!this._validaCamposTabla("save")) {
				return;
			}
			var cCen = gThis.getView().byId("centro");
			var cMotivo = gThis.getView().byId("motivo");
			var cCodigo = gThis.getView().byId("codOrigen");
			var cCantidad = gThis.getView().byId("cantidad");
			var cAlmacen = gThis.getView().byId("almacen");
			var cLote = gThis.getView().byId("lote");
			var cEnologo = gThis.getView().byId("enologo");

			var vCen = cCen.getSelectedKey();
			var vMotivo = cMotivo.getSelectedKey();
			var vCodigo = cCodigo.getValue();
			var vCantidad = cCantidad.getValue();
			var vAlmacen = cAlmacen.getSelectedKey();
			var vLote = cLote.getValue();
			var vEnologo = cEnologo.getValue();

			if (vCen === '' || vMotivo === '' || vCodigo === '' || vCantidad === '' || vAlmacen === '' || vLote === '' || vEnologo === '') {
				sap.m.MessageBox.warning("¡Favor completar todos los campos de cabecera!", {
					title: "Advertencia", // default
					onClose: null, // default
					styleClass: "", // default
					initialFocus: null, // default
					textDirection: sap.ui.core.TextDirection.Inherit // default
				});
				return;
			}

			/*if (!this._validaCamposTabla()) {
				return;
			}*/

			//Obtiene el control
			var o = this;
			//var cMotivo = this.getView().byId("motivo");
			var cBodega = this.getView().byId("centro");
			var cOrigen = this.getView().byId("codOrigen");
			var cDesc = this.getView().byId("descripcion");
			var cCant = this.getView().byId("cantidad");
			//var cLote = this.getView().byId("lote");
			//var cEnologo = this.getView().byId("enologo");
			var cTable = this.getView().byId("posTable");

			//Obtiene el valor del control
			//var vMotivo = cMotivo.getSelectedKey();
			var vBodega = cBodega.getSelectedKey();
			var vOrigen = cOrigen.getValue();
			var vDesc = cDesc.getValue();
			var vCant = cCant.getValue().split(".").join("").replace(",", ".");
			//var vLote = cLote.getValue();
			//var vEnologo = cEnologo.getValue();
			var vFilas = cTable.getItems();
			var Tabla = [];
			vFilas.forEach(function (entry) {
				Tabla.push({
					IAction: "",
					IAufnr: "",
					MatnrDestino: entry.getCells()[0].getValue(),
					Aufnr: "",
					Gjahr: entry.getCells()[5].getValue(),
					DescripPos: entry.getCells()[1].getText(),
					CantPos: entry.getCells()[2].getValue().split(".").join("").replace(",", "."),
					Lgort: entry.getCells()[4].getSelectedKey()
				});
			});
			var oModel = this.getOwnerComponent().getModel("dos"); //UBICAR SERVICIO
			var oData = {
				ICantCab: vCant,
				IDescripCab: vDesc,
				Motivo: vMotivo,
				IVeraaUser: vEnologo,
				MatnrOrigen: vOrigen,
				Aufnr: "",
				Batch: vLote,
				Werks: vBodega,
				Lgort: vAlmacen,
				Nav_Pos: Tabla
			};
			//return;
			sap.ui.core.BusyIndicator.show();
			oModel.create("/CabeceraSet", oData, {
				success: function (Respuesta) {
					sap.ui.core.BusyIndicator.hide();
					if (Respuesta.Aufnr === "") {
						sap.m.MessageBox.error("¡Material No Puede ser Reclasificado!", {
							title: "Error", // default
							onClose: null, // default
							styleClass: "", // default
							initialFocus: null, // default
							textDirection: sap.ui.core.TextDirection.Inherit // default
						});
					} else {
						sap.m.MessageBox.success("¡Orden de Reclasificación N° " + Respuesta.Aufnr + " ha sido Creada!", {
							//("¡Orden de Reclasificación N° " + Respuesta.EReturn + " ha sido Creada!", {
							title: "Confirmación",
							onClose: function () {
								location.reload(true);
								//o.clearInput();
								//o.clearCells();
							},
							styleClass: "",
							initialFocus: null,
							textDirection: sap.ui.core.TextDirection.Inherit
						});
					}

				}.bind(this),
				error: function (Respuesta) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.error("¡Error al Crear Orden!", {
						title: "Error",
						onClose: "",
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}.bind(this)
			});

		},

		handleValidationError: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			var descript = oEvent.getSource().getParent().getCells()[1];
			var unidad = oEvent.getSource().getParent().getCells()[3];
			descript.setProperty('text', '');
			unidad.setProperty('text', '');

		},

		handleValidationSuccess: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
			gThis._descript(oEvent);
		},

		handleValidationSuccess2: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
			gThis._inputDescript(oEvent);
		},

		handleValidationError2: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			var cDes = gThis.getView().byId("descripcion");
			var cCant = gThis.getView().byId("cantidad");
			var cAlmacen = gThis.getView().byId("almacen").setValue("");
			var cLote = gThis.getView().byId("lote").setValue("");
			cCant.setValueState(sap.ui.core.ValueState.None);
			cDes.setValue('');
			cCant.setValue("");
			cAlmacen.destroyItems();
			cLote.destroyItems();
			this.clearCells();

		}

	});
});