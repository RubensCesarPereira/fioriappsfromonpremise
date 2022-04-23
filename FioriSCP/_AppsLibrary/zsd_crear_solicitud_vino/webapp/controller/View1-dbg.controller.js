sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {

	"use strict";
	var gThis = null;
	var gUnidad = "";

	return Controller.extend("conchaytoro.cl.zsd_crear_solicitud_vino.controller.View1", {

		onInit: function () {
			gThis = this;
			var oModel = new JSONModel();
			this.getView().setModel(oModel, "aux");

			this.fecha();

			//Clase de Solicitud
			var oData = {
				"solicitud": [{
					"name": "ZTCE",
					"value": "Traslado Centro Enología"
				}, {
					"name": "ZTRI",
					"value": "Traslado Intercompany"
				}]
			};
			var pModel = new JSONModel(oData);
			this.getView().setModel(pModel, "rr");

		},

		onBeforeRendering: function () {

		},

		//Fecha actual
		fecha: function () {
			var date = this.getView().byId("fecha");
			var now = new Date();
			date.setDateValue(now);
			date.setMinDate(now);
		},

		//N° de posición
		_position: function () {
			var iResult = 0;
			var oTable = this.getView().byId("posTable");
			iResult = oTable.getItems().length;
			iResult = (iResult + 1) * 10;
			return iResult;

		},

		//Descripción del Material
		_descript: function (oEvent) {
			var material = oEvent.getSource().getParent().getCells()[2].getValue();
			var almacen = oEvent.getSource().getParent().getCells()[4];
			almacen.removeAllItems();
			var centroD = oEvent.getSource().getParent().getCells()[1].getSelectedKey(); //sap.ui.getCore().byId("cenDest").getSelectedKey();
			var centro = gThis.getView().byId("centro").getSelectedKey();
			var descript = oEvent.getSource().getParent().getCells()[3]; //sap.ui.getCore().byId("descrip");
			var unidad = oEvent.getSource().getParent().getCells()[7];
			var sResult = "Sin Descripción";
			var oMod = this.getOwnerComponent().getModel();
			oMod.read("/MaterialSet(Matnr='" + material + "',Werks='" + centroD + "')", {
				success: function (mData) {
					if (mData.Matnr === "") {
						sap.m.MessageBox.warning("¡Material no existe en Centro de Destino!", {
							title: "Advertencia", // default
							onClose: null, // default
							styleClass: "", // default
							initialFocus: null, // default
							textDirection: sap.ui.core.TextDirection.Inherit // default
						});
					} else { //Si viene un valor en Matnr se debe preguntar por el centor de origen
						oMod.read("/MaterialSet(Matnr='" + material + "',Werks='" + centro + "')", {
							success: function (oData) {
								if (oData.Matnr === "") {
									sap.m.MessageBox.warning("¡Material no Existe en Centro Suministrador!", {
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
									filter = new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, centroD);
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
								sap.m.MessageBox.error(oError.message, {
									title: "Error",
									onClose: null,
									styleClass: "",
									initialFocus: null,
									textDirection: sap.ui.core.TextDirection.Inherit
								});
							}
						});
					}
					/*if (mData.Matnr === "") {
						oMod.read("/MaterialSet(Matnr='" + material + "',Werks='" + centro + "')", {
							success: function (oData) {
								if (oData.Matnr === "") {
									sap.m.MessageBox.warning(oData.Message, {
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
								}
							}.bind(this),
							error: function (oError) {
								sap.m.MessageBox.error(oError.message, {
									title: "Error",
									onClose: null,
									styleClass: "",
									initialFocus: null,
									textDirection: sap.ui.core.TextDirection.Inherit
								});
							}
						});*/
					/*sap.m.MessageBox.warning(mData.Message, {
						title: "Advertencia", // default
						onClose: null, // default
						styleClass: "", // default
						initialFocus: null, // default
						textDirection: sap.ui.core.TextDirection.Inherit // default
					});*/
					/*} else {
						sResult = mData.Maktx;
						gUnidad = mData.Meins;
						descript.setProperty('text', sResult);
						unidad.setProperty('text', gUnidad);

					}*/

				}.bind(this),
				error: function (oError) {
					sap.m.MessageBox.error(oError.message, {
						title: "Error",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}

			});

		},

		//Agrega nueva posición
		onAdd: function (vDatos) {
			if (!this._validaCamposTabla()) {
				return;
			}

			var cCen = gThis.getView().byId("centro");
			var cGrupo = gThis.getView().byId("grupo");

			var vCen = cCen.getSelectedKey();
			var vGrupo = cGrupo.getSelectedKey();

			if (vCen === '' || vGrupo === '') {
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

					//Centro
					new sap.m.ComboBox({
						required: true,
						showSecondaryValues: true,
						filterSecondaryValues: true,
						items: {
							path: '/CentroSet',
							sorter: {
								path: 'Werks'
							},
							template: new sap.ui.core.ListItem({
								key: "{Werks}",
								text: "{Name1}",
								additionalText: "{Werks}"
							})
						},
						editable: true
					}),

					//Código Material
					new sap.m.Input({
						maxLength: 10,
						liveChange: function (oEvt) {
							var centroD = oEvt.getSource().getParent().getCells()[1].getSelectedKey();
							var material = oEvt.getSource().getParent().getCells()[2];
							if (centroD === '') {
								sap.m.MessageBox.warning("¡Seleccione Centro de Destino!", {
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
						placeholder: "Ej: 2135-2019",
						editable: true
					}),

					//Descripción Material
					new sap.m.Text({}),

					//Almacén
					new sap.m.ComboBox({}),

					//Año Cosecha
					new sap.m.Input({
						maxLength: 4,
						type: sap.m.Input.Number,
						placeholder: "Ej: 2020",
						editable: true
					}),

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

					//Fecha inicio
					new sap.m.DatePicker({
						valueFormat: "dd.MM.yyyy",
						displayFormat: "dd.MM.yyyy",
						required: true,
						validationError: "handleValidationError2",
						validationSuccess: "handleValidationSuccess2",
						editable: true,
						change: this.handleDate,
						minDate: new Date()
					}),

					//Nota
					new sap.m.Input({
						maxLength: 20,
						/*liveChange: function (oEvt) {
							var centroD = oEvt.getSource().getParent().getCells()[1].getSelectedKey();
							var material = oEvt.getSource().getParent().getCells()[2];
							if (centroD === '') {
								sap.m.MessageBox.warning("¡Completar Campos que Anteceden!", {
									title: "Advertencia", // default
									onClose: null, // default
									styleClass: "", // default
									initialFocus: null, // default
									textDirection: sap.ui.core.TextDirection.Inherit // default
								});
								material.setValue('');
							}
						},*/
						placeholder: "",
						editable: true
					}),

					new sap.m.Button({
						icon: "sap-icon://decline",
						width: "3em",
						press: [this.remove, this]
					})
				]
			});

			var oTable = gThis.getView().byId('posTable');
			oTable.addItem(oItem);
			sap.ui.core.BusyIndicator.hide();
		},

		validaInput: function (oEvt) {
			var centroD = oEvt.getSource().getParent().getCells()[1].getSelectedKey();
			var cantidad = oEvt.getSource().getParent().getCells()[6];
			if (centroD === '') {
				sap.m.MessageBox.warning("¡Seleccione Centro de Destino!", {
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
			var cSol = this.getView().byId("solicitud");
			var cCentro = this.getView().byId("centro");
			var cGrupo = this.getView().byId("grupo");
			var cFecha = this.getView().byId("fecha");

			cSol.setValue("");
			cCentro.setValue("");
			cGrupo.setValue("");
			cFecha.setValue("");
		},

		clearCells: function (oEvent) {
			var table = this.getView().byId("posTable");
			table.removeAllItems();
		},

		_clearMatnr: function () {
			this.getView().byId("grupo").setValue("");
			this.clearCells();
			//this.activeButton();
		},

		//DINAMICO
		onSave: function (oEvent) {
			if (!this._validaCamposTabla()) {
				return;
			}
			//Obtiene el control
			var o = this;
			//var cSol = this.getView().byId("solicitud");
			var cCen = this.getView().byId("centro");
			var cGrup = this.getView().byId("grupo");
			var cFech = this.getView().byId("fecha");
			var cTable = this.getView().byId("posTable");

			//Obtiene el valor del control
			//var vSol = cSol.getSelectedKey();
			var vCen = cCen.getSelectedKey();
			var vGrup = cGrup.getSelectedKey();
			var vFech = cFech.getValue();
			var vFilas = cTable.getItems();

			var Tabla = [];
			vFilas.forEach(function (entry) {
				Tabla.push({
					Purchaseorder: "",
					PoItem: entry.getCells()[0].getText(), //posicion
					ShortText: entry.getCells()[3].getText(), //descripcion
					Material: entry.getCells()[2].getValue(), //material
					Plant: entry.getCells()[1].getSelectedKey(), //centro
					StgeLoc: entry.getCells()[4].getSelectedKey(), //almacen aqui no aplica/ ahora si aplica
					Quantity: entry.getCells()[6].getValue(), //cantidad
					PoUnit: entry.getCells()[7].getText(), //unidad
					CreatDate: entry.getCells()[8].getValue(), //fecha entrega
					Texto1: entry.getCells()[5].getValue(), //año cosecha
					Texto2: entry.getCells()[9].getValue() //nota
				});
			});
			var oModel = this.getOwnerComponent().getModel("dos");
			var oData = {
				Purchaseorder: "",
				CreatDate: vFech,
				DocType: "ZTCE",
				PurchOrg: "",
				PurGroup: vGrup,
				SupplPlnt: vCen,
				PedidoToPosiciones: Tabla

			};
			//return;
			sap.ui.core.BusyIndicator.show();
			oModel.create("/PedidoSet", oData, {
				success: function (Respuesta) {
					sap.ui.core.BusyIndicator.hide();
					if (Respuesta.Purchaseorder === "") {
						sap.m.MessageBox.error("¡No fue Posible Crear Solicitud!", {
							title: "Error", // default
							onClose: null, // default
							styleClass: "", // default
							initialFocus: null, // default
							textDirection: sap.ui.core.TextDirection.Inherit // default
						});
					} else {
						sap.m.MessageBox.success("¡El pedido N° " + Respuesta.Purchaseorder + " ha sido Creado!", {
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

				}.bind(this),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.error("¡Error al Crear Solicitud!", {
						title: "Error",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}.bind(this)
			});
		},

		handleValidationError: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			var descript = oEvent.getSource().getParent().getCells()[3];
			var unidad = oEvent.getSource().getParent().getCells()[7];
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

		onSelectionChange: function (oEvent) {
			var oModel = this.getOwnerComponent().getModel("dos");
			var oSelectedItem = oEvent.getParameter("listItem");
			oModel = oSelectedItem.getBindingContext().getObject();
			//alert.(JSON.stringify(oModel));
		},

		edit: function (oEvent) {
			if (oEvent.getSource().getProperty('icon') === "sap-icon://edit") {
				oEvent.getSource().setProperty('icon', 'sap-icon://accept');
				var oItem = oEvent.getSource().getParent();
				oItem.getCells().forEach(function (entry) {
					if (entry.getMetadata()._sClassName === 'sap.m.Input') {
						entry.setEnabled(true);
						entry.setEditable(true);
					}
				});
			} else {
				oEvent.getSource().setProperty('icon', 'sap-icon://edit');
				var oItem = oEvent.getSource().getParent();
				oItem.getCells().forEach(function (entry) {
					if (entry.getMetadata()._sClassName === 'sap.m.Input') {
						entry.setEnabled(false);
						entry.setEditable(false);
					}
				});
			}

		},

		remove: function (oEvent) {
			var oTable = gThis.getView().byId('posTable');
			oTable.removeItem(oEvent.getSource().getParent());
		},

		_validaCamposTabla: function () {
			var oTable = gThis.getView().byId('posTable');
			if (oTable.getItems().length === 0) return true;
			var bError = true;
			oTable.getItems().forEach(function (fila) {
				if (!bError) {
					return;
				}
				if (fila.getCells()[1].getSelectedKey() === "" ||
					fila.getCells()[2].getValue() === "" ||
					fila.getCells()[2].getValueState() !== sap.ui.core.ValueState.Success ||
					fila.getCells()[3].getText() === "" ||
					fila.getCells()[4].getSelectedKey() === "" ||
					fila.getCells()[5].getValue() === "" ||
					fila.getCells()[6].getValue() === "" ||
					fila.getCells()[6].getValueState() !== sap.ui.core.ValueState.Success ||
					fila.getCells()[7].getText() === "" ||
					fila.getCells()[8].getDateValue() === null ||
					fila.getCells()[8].getProperty("valueState") !== sap.ui.core.ValueState.None ||
					!/^\d{2}.\d{2}.\d{4}$/.test(fila.getCells()[8].getValue())) {
					//|| fila.getCells()[8].getValue() === ""
					bError = false;
					return;
				}
				// bError = /^\d{2}.\d{2}.\d{4}$/.test(fila.getCells()[6].getValue());
				/*bError = /^\d{2}.\d{2}.\d{4}$/.test(fila.getCells()[6].getDateValue().getDate() + "." + (fila.getCells()[6].getDateValue().getMonth() <
						10 ? ("0" + fila.getCells()[6].getDateValue().getMonth()) : ("0" + fila.getCells()[6].getDateValue().getMonth())) + "." +
					fila.getCells()[6].getDateValue().getFullYear());*/
			});
			if (!bError)
				sap.m.MessageBox.error("¡Campos Vacíos o con Datos Erróneos!. Favor actualizar campos.", {
					title: "Error en campos", // default
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