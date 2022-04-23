/*global location */
sap.ui.define([
	"conchaytoro/cl/zsd_contabilizar_despacho/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageToast',
	"conchaytoro/cl/zsd_contabilizar_despacho/model/formatter"
], function (BaseController, JSONModel, MessageToast, formatter) {
	"use strict";
	var gThis = null;
	return BaseController.extend("conchaytoro.cl.zsd_contabilizar_despacho.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			$.contSub = 900000;
			gThis = this;
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading")
			});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));

			var oModel = this.getOwnerComponent().getModel("tres");
			oModel.setSizeLimit("500");

			var btnConta = this.getView().byId("btnConta");
			btnConta.setEnabled(false);
		},

		selecPatCamion: function (oEvent) {
			this.getView().byId("patenteCar").setSelectedKey("");
			this.getView().byId("patenteCam").setSelectedKey("");
			this.getView().byId("capacidad").setValue("");
			var vCamion = this.getView().byId("patenteCam");
			var vCarro = oEvent.getSource().getParent().getParent().getContent()[3].getItems()[1];
			var vTransporte = oEvent.getSource().getSelectedKey();
			var oModelo = this.getOwnerComponent().getModel("tres");
			var Filters = [];
			var filter = new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.EQ, vTransporte);
			Filters.push(filter);
			filter = new sap.ui.model.Filter("Parvw", sap.ui.model.FilterOperator.EQ, "VH");
			Filters.push(filter);
			oModelo.read("/TransportistaSet", {
				success: function (Respuesta) {
					var jModel = new sap.ui.model.json.JSONModel(Respuesta.results);
					vCamion.setModel(jModel, "cam");
					var oBinding = vCamion.getBinding("items");
					oBinding.filter(new sap.ui.model.Filter("Parvw", sap.ui.model.FilterOperator.EQ, "VH"));

					//////////CARRO/////////////////
					jModel = new sap.ui.model.json.JSONModel(Respuesta.results);
					vCarro.setModel(jModel, "car");
					oBinding = vCarro.getBinding("items");
					oBinding.filter(new sap.ui.model.Filter("Parvw", sap.ui.model.FilterOperator.EQ, "VV"));
				}.bind(this),
				error: function (oError) {
					var x = "Error en el Servicio";
					return x;
				}.bind(this),
				filters: Filters
			});
		},

		selectPatCarro: function (oEvent) {
			var cCapacidad = this.getView().byId("capacidad");
			var vPatCarro = oEvent.getSource().getSelectedKey();
			var oModelo = this.getOwnerComponent().getModel("tres");
			var Filters = [];
			var filter = new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.EQ, vPatCarro);
			Filters.push(filter);
			filter = new sap.ui.model.Filter("Parvw", sap.ui.model.FilterOperator.EQ, "VV");
			Filters.push(filter);
			oModelo.read("/TransportistaSet", {
				success: function (Respuesta) {
					var oValue = Respuesta.results[0].Name2;
					cCapacidad.setValue(oValue);
				}.bind(this),
				filters: Filters
			});
		},

		clearInput: function (oEvent) {
			this._selectFirst();
			var tabla = this.getView().byId("lineItemsList");
			var vFilas = tabla.getItems();
			var cTrans = this.getView().byId("trans");
			var cPatCam = this.getView().byId("patenteCam");
			var cCapacidad = this.getView().byId("capacidad");
			var cSellos = this.getView().byId("sellos");
			var cPatCar = this.getView().byId("patenteCar");
			var cChofer = this.getView().byId("chofer");
			var cRut = this.getView().byId("rut");
			var cCubaOri = this.getView().byId("cubaOri");
			var cDensidad = this.getView().byId("densidad");
			var cPesoTara = this.getView().byId("pesoTara");
			var cPesoBru = this.getView().byId("pesoBru");

			cTrans.setValue("");
			cPatCam.setValue("");
			cCapacidad.setValue("");
			cPatCar.setValue("");
			cChofer.setValue("");
			cRut.setValue("");
			cCubaOri.setValue("");
			cDensidad.setValue("");
			cPesoTara.setValue("");
			cPesoBru.setValue("");
			cSellos.setValue("");

			cTrans.setValueState(sap.ui.core.ValueState.None);
			cPatCam.setValueState(sap.ui.core.ValueState.None);
			cPatCar.setValueState(sap.ui.core.ValueState.None);
			cChofer.setValueState(sap.ui.core.ValueState.None);
			cRut.setValueState(sap.ui.core.ValueState.None);
			cDensidad.setValueState(sap.ui.core.ValueState.None);
			cPesoTara.setValueState(sap.ui.core.ValueState.None);
			cPesoBru.setValueState(sap.ui.core.ValueState.None);

			/*if (vFilas.getCells()[0].getText().substring(0, 1) !== "9") {
				vFilas.forEach(function (entry) {
					entry.getCells()[11].setValue("");
					entry.getCells()[11].setValueState(sap.ui.core.ValueState.None);
					entry.getCells()[12].setSelected(false);
				});
			}*/

			vFilas.forEach(function (entry) {
				if (entry.getCells()[0].getText().substring(0, 1) !== "9") {
					entry.getCells()[11].setValue("");
					entry.getCells()[11].setValueState(sap.ui.core.ValueState.None);
					entry.getCells()[12].setSelected(false);
				}
			});

		},

		_selectFirst: function () {
			this.getView().getParent().getParent().getMasterPages()[0].getContent()[0].getContent()[1].getItems()[0].firePress();
			//("application-Test-url-component---master--list").getItems()[0].firePress();
			//("zsd_contabilizar_despacho---master--list").getItems()[0].firePress();
		},

		validaCheck: function (oEvt) {
			var btnConta = this.getView().byId("btnConta");
			if (oEvt.getSource().getProperty("selected")) {
				if (oEvt.getSource().getParent().getCells()[11].getValueState() === sap.ui.core.ValueState.None) {
					MessageToast.show("¡Favor Ingresar Grado Alcohólico!");
					oEvt.getSource().getParent().getCells()[11].setValueState(sap.ui.core.ValueState.Error);
					//btnConta.setEnabled(false);
				}

				if (oEvt.getSource().getParent().getCells()[11].getValueState() === sap.ui.core.ValueState.Success) {
					btnConta.setEnabled(true);
				}

			} else {
				if (oEvt.getSource().getParent().getCells()[11].getValue() !== "") {
					oEvt.getSource().getParent().getCells()[11].setValue("");
					oEvt.getSource().getParent().getCells()[11].setValueState(sap.ui.core.ValueState.None);
				} else {
					oEvt.getSource().getParent().getCells()[11].setValueState(sap.ui.core.ValueState.None);
				}
			}
		},

		//Event para Almacen
		_almacen: function (iPos, sMat) {
			var oTable = this.getView().byId("lineItemsList");
			//var vFilas = oTable.getItems()[iPos];
			var centro = gThis.getView().byId("codCentro").getText();
			var material = sMat;
			var almacen = oTable.getItems()[iPos].getCells()[3];
			var oMod = gThis.getOwnerComponent().getModel("tres");
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
				filters: Filters,
				error: function (oError) {
					var x = "hola";
					return x;
				}
			});
			/*return;
			vFilas.forEach(function (entry) {
				var iDesc = entry.getCells()[2].getText();
				var material = entry.getCells()[1].getTitle();
				var almacen = entry.getCells()[3];
				//almacen.removeAllItems();
				var centro = gThis.getView().byId("objectHeader").getTitle();
				

			});*/

		},

		_remove: function (oEvent) {
			var oTable = gThis.getView().byId('lineItemsList');
			oTable.removeItem(oEvent.getSource().getParent());
		},

		_validaCamposTabla: function () {
			var oTable = gThis.getView().byId('lineItemsList');
			if (oTable.getItems().length === 0) return true;
			var bError = true;
			oTable.getItems().forEach(function (fila) {
				if (fila.getCells()[12].getMetadata()._sClassName !== "sap.m.CheckBox") {
					if (fila.getCells()[3].getSelectedKey() === "" || fila.getCells()[4].getSelectedKey() === "" || fila.getCells()[6]
						.getValue() === "" || fila.getCells()[6].getValueState() !== sap.ui.core.ValueState.Success) {
						bError = false;
						return;
					}
				}
				//bError = /^\d{2}.\d{2}.\d{4}$/.test(fila.getCells()[6].getValue());
			});
			if (!bError)
				sap.m.MessageBox.error("¡No es posible Agregar, campos Vacíos o con datos Erróneos!", {
					title: "Error", // default
					onClose: null, // default
					styleClass: "", // default
					initialFocus: null, // default
					textDirection: sap.ui.core.TextDirection.Inherit // default
				});
			return bError;
		},

		onAdd: function (oEvent) {
			$.contSub += 1;
			if (!this._validaCamposTabla()) {
				return;
			}
			var oTable = this.getView().byId("lineItemsList");
			var vFilas = oTable.getItems();
			var iMatnr = oEvent.getSource().getBindingContext().getObject().Material;
			var iDesc = oEvent.getSource().getBindingContext().getObject().ShortText;
			var iPos = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
			var count = iPos + 1;
			var c = 1;
			for (var i = iPos + 1; i <= vFilas.length; i++) {
				if (vFilas[i] === undefined) {
					var oItem = new sap.m.ColumnListItem({
						cells: [
							new sap.m.Text({
								text: $.contSub //900000 + c
							}),
							//Código Material
							new sap.m.Text({
								text: iMatnr
							}),

							//Descripción Material
							new sap.m.Text({
								text: iDesc
							}),

							//Almacen
							new sap.m.ComboBox({
								change: function (oEvt) {
									var material = oEvt.getSource().getParent().getCells()[1].getText();
									var centro = gThis.getView().byId("codCentro").getText();
									var almacen = oEvt.getSource().getParent().getCells()[3].getSelectedKey();
									var lote = oEvt.getSource().getParent().getCells()[4];
									var oMod = this.getModel("tres");
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
													additionalText: e.Batch,
													customData: [
														new sap.ui.core.CustomData({
															key: e.Atwrt
														}),
														new sap.ui.core.CustomData({
															key: e.Clabs
														})
													]
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
									var iCosecha = oEvent.getSource().getSelectedItem().getCustomData()[0].getKey();
									oEvent.getSource().getParent().getCells()[5].setText(iCosecha);
								}
							}),

							//Cosecha
							new sap.m.Text({}),

							//Despacho
							new sap.m.Input({
								liveChange: this.addDot
							}),

							//Pendiente
							new sap.m.Text({}),

							//Unidad
							new sap.m.Text({}),

							//Fecha
							new sap.m.Text({}),

							//Particion 
							new sap.m.Text({}),

							//Grado
							new sap.m.Text({}),

							//Check
							//new sap.m.CheckBox({}),

							//Boton quitar
							new sap.m.Button({
								icon: "sap-icon://decline",
								width: "2em",
								press: [this._remove, this]
							})
						]
					});
					oTable.insertItem(oItem, count);
					break;
				} else {
					if (vFilas[i].getCells()[0].getText().substring(0, 1) !== "9") {

						var oItem = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Text({
									text: $.contSub //900000 + c
								}),
								//Código Material
								new sap.m.Text({
									text: iMatnr
								}),

								//Descripción Material
								new sap.m.Text({
									text: iDesc
								}),

								//Almacen
								new sap.m.ComboBox({
									change: function (oEvt) {
										var material = oEvt.getSource().getParent().getCells()[1].getText();
										var centro = gThis.getView().byId("codCentro").getText();
										var almacen = oEvt.getSource().getParent().getCells()[3].getSelectedKey();
										var lote = oEvt.getSource().getParent().getCells()[4];
										var oMod = this.getModel("tres");
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
														additionalText: e.Batch,
														customData: [
															new sap.ui.core.CustomData({
																key: e.Atwrt
															}),
															new sap.ui.core.CustomData({
																key: e.Clabs
															})
														]
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
										var iCosecha = oEvent.getSource().getSelectedItem().getCustomData()[0].getKey();
										oEvent.getSource().getParent().getCells()[5].setText(iCosecha);
									}
								}),

								//Cosecha
								new sap.m.Text({}),

								//Despacho
								new sap.m.Input({
									liveChange: this.addDot
								}),

								//Pendiente
								new sap.m.Text({}),

								//Unidad
								new sap.m.Text({}),

								//Fecha
								new sap.m.Text({}),

								//Particion 
								new sap.m.Text({}),

								//Grado
								new sap.m.Text({}),

								//Check
								//new sap.m.CheckBox({}),

								//Boton quitar
								new sap.m.Button({
									icon: "sap-icon://decline",
									width: "2em",
									press: [this._remove, this]
								})
							]
						});

						oTable.insertItem(oItem, count);
						break;
					} else {
						c++;
						count++;
						continue;
					}
				}

			}
			this._almacen(count, iMatnr);
		},

		//Funcion valida 5% permitido
		validaTolerancia: function (pendiente) {
			//var pendiente = 0;
			var porcentaje = 0.05;
			var pendConPorcentaje = 0;
			//pendiente = Number(entry.getCells()[7].getText().split(".").join(""));
			porcentaje = (pendiente * 0.05);
			pendConPorcentaje = pendiente + porcentaje;
			return pendConPorcentaje;
		},

		//Funcion valida cantidad menor a disponible
		validaDespacho: function () {
			var totalDespacho = 0;
			var cTable = this.getView().byId("lineItemsList");
			var vFilas = cTable.getItems();
			var pendiente = 0;
			var b = null;
			var n = false;
			for (var i = 0; i < vFilas.length; i++) {
				if (vFilas[i].getCells()[12].getMetadata()._sClassName === "sap.m.CheckBox") { //Posiciones
					if (totalDespacho !== 0) { //If para evaluar la segunda vuelta (si existe)
						if (totalDespacho > pendiente) {
							MessageToast.show("¡Despacho Mayor al Pendiente!");
							return false;
						}
					}
					if (n) { // Si es falso no hubo subposiciones (A)
						MessageToast.show("¡Posición seleccionada Sin partición!");
						return false;
					}
					if (vFilas[i].getCells()[12].getSelected()) { //Pregunta si la posicion se enviará
						if (vFilas[i].getCells()[11].getValueState() === "Error") {
							MessageToast.show("¡Material Sin grado alcohólico!");
							return false;
						}
						b = true;
						totalDespacho = 0;
						pendiente = this.validaTolerancia(Number(vFilas[i].getCells()[7].getText().split(".").join("")));
						n = true;
					} else { // Si no se envia la posición, las subposiciones no seran calculadas
						b = false;
					}
				} else { // Sub-posiciones
					if (b) {
						if (vFilas[i].getCells()[3].getSelectedItem() === null || vFilas[i].getCells()[4].getSelectedItem() === null || vFilas[i].getCells()[
								6].getValue() === "") {
							MessageToast.show("¡Faltan Datos de Partición!");
							return false;
						}
						n = false; // (A) Actualiza valor para indicar que existe subposicion
						var oDesp = Number(vFilas[i].getCells()[6].getValue().split(".").join(""));
						var max = Number(vFilas[i].getCells()[4].getSelectedItem().getCustomData()[1].getKey());
						if (oDesp > max) {
							vFilas[i].getCells()[6].setValueState("Error");
							MessageToast.show("¡Cantidad Mayor a Cantidad de Lote!");
							return false;
						}
						totalDespacho += oDesp;
					}
				}
			}
			if (n) { // Evalua si ultima posicion tiene subposiciones
				MessageToast.show("¡Posición seleccionada Sin partición!");
				return false;
			}
			/*vFilas.forEach(function (entry) {
				if (entry.getCells()[12].getMetadata()._sClassName === "sap.m.CheckBox") {
					if (totalDespacho !== 0) {
						if (totalDespacho > pendiente) {
							MessageToast.show("¡El Despacho es Mayor a la Cantidad Pendiente!");
							return false;
						}
					}
					if (entry.getCells()[12].getSelected()) {
						b = true;
						totalDespacho = 0;
						pendiente = Number(entry.getCells()[7].getText().split(".").join(""));
					} else {
						b = false;
					}
				} else {
					if (b) {
						totalDespacho += Number(entry.getCells()[6].getValue().split(".").join(""));
					}
				}
			});*/
			if (totalDespacho > pendiente) {
				MessageToast.show("¡Cantidad a Despachar Supera la Tolerancia!");
				return false;
			} else {
				return true;
			}
		},

		//DINAMICO
		onContabilizar: function (oEvent) {
			if (!this._validaCampos()) {
				return;
			}
			//Valida que a la tabla se le agregara una subposicion
			if (this.getView().byId("lineItemsList").getBindingInfo("items").binding.aKeys.length === this.getView().byId("lineItemsList").getItems()
				.length) {
				MessageToast.show("¡No se han creado particiones!");
				return;
			}
			if (!this.validaDespacho()) {
				return;
			}

			var o = this;
			var oList = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getMasterPages()[0].getContent()[0].getContent()[
				1];
			//sap.ui.getCore().byId("application-ZOBJ_SEM_CONT_DESPACHO-display-component---master--list");
			//("application-Test-url-component---master--list");
			//("zsd_contabilizar_despacho---master--list");
			var cPedido = this.getView().byId("objectHeader"); //obtener number
			var cTrans = this.getView().byId("trans");
			var cPatCam = this.getView().byId("patenteCam");
			var cSellos = this.getView().byId("sellos");
			var cPatCar = this.getView().byId("patenteCar");
			var cChofer = this.getView().byId("chofer");
			var cRut = this.getView().byId("rut");

			var vPedido = cPedido.getNumber();
			var vTrans = cTrans.getSelectedKey();
			var vPatCam = cPatCam.getSelectedKey();
			var vSellos = cSellos.getValue();
			var vPatCar = cPatCar.getSelectedKey();
			var vChofer = cChofer.getValue();
			var vRut = cRut.getValue();

			var vCubaOri = this.getView().byId("cubaOri").getValue();
			var vDensidad = this.getView().byId("densidad").getValue();
			var vPesoTara = this.getView().byId("pesoTara").getValue();
			var vPesoBru = this.getView().byId("pesoBru").getValue();
			var iPos = -1; //oEvent.getSource().getBindingContext().getObject().PoItem;
			var cTable = this.getView().byId("lineItemsList");
			var vFilas = cTable.getItems();
			var Tabla = [];
			var TablaSub = [];
			/*vFilas.forEach(function (entry) {
				if (entry.getCells()[12].getMetadata()._sClassName === "sap.m.CheckBox") {
					if (entry.getCells()[12].getSelected()) {
						Tabla.push({
							Vbeln: vPedido, //pedido
							Posnr: entry.getCells()[0].getText(), //posicion
							Matnr: entry.getCells()[1].getTitle(), //material
							Grado: entry.getCells()[11].getValue() //grado
						});
					}
				}
			});*/
			///
			var b = false;
			for (var i = 0; i < vFilas.length; i++) {
				if (vFilas[i].getCells()[12].getMetadata()._sClassName === "sap.m.CheckBox") { //Posiciones
					if (vFilas[i].getCells()[12].getSelected()) { //Pregunta si la posicion se enviará
						b = true;
						iPos = vFilas[i].getCells()[0].getText();
						Tabla.push({
							Vbeln: vPedido, //pedido
							Posnr: vFilas[i].getCells()[0].getText(), //posicion
							Matnr: vFilas[i].getCells()[1].getTitle(), //material
							Grado: vFilas[i].getCells()[11].getValue() //grado
						});
					} else { // Si no se envia la posición, las subposiciones no seran calculadas
						b = false;
					}
				} else { // Sub-posiciones
					if (b) {
						TablaSub.push({
							Vbeln: vPedido,
							Posnr: iPos,
							Uecha: vFilas[i].getCells()[0].getText(), //posicion
							Matnr: vFilas[i].getCells()[1].getText(), //material
							Lfimg: vFilas[i].getCells()[6].getValue().split(".").join("").split(",").join("."), //cantidad
							Lgort: vFilas[i].getCells()[3].getSelectedItem().getKey(), //almacen
							Charg: vFilas[i].getCells()[4].getSelectedItem().getKey() //lote
						});
					}
				}
			}
			///
			/*vFilas.forEach(function (entry) {
				if (entry.getCells()[12].getMetadata()._sClassName === "sap.m.CheckBox") {
					iPos = entry.getCells()[0].getText();
					if (entry.getCells()[12].getSelected()) {
						Tabla.push({
							Vbeln: vPedido, //pedido
							Posnr: entry.getCells()[0].getText(), //posicion
							Matnr: entry.getCells()[1].getTitle(), //material
							Grado: entry.getCells()[11].getValue() //grado
						});
					}
				} else {
					if (Tabla[Tabla.length - 1].hasOwnProperty("detalle")) {
						Tabla[Tabla.length - 1].Tabla.push({
							Vbeln: vPedido,
							Posnr: iPos,
							Uecha: entry.getCells()[0].getText(), //subposicion
							Matnr: entry.getCells()[1].getText(), //material
							Lfimg: entry.getCells()[6].getValue(), //despacho
							Lgort: entry.getCells()[3].getSelectedItem().getKey(), //almacen
							Charg: entry.getCells()[4].getSelectedItem().getKey()
						});
					} else {
						Tabla[Tabla.length - 1].Tabla = [];
						Tabla[Tabla.length - 1].Tabla.push({
							Vbeln: vPedido,
							Posnr: iPos,
							Uecha: entry.getCells()[0].getText(), //posicion
							Matnr: entry.getCells()[1].getText(), //material
							Lfimg: entry.getCells()[6].getValue(), //despacho
							Lgort: entry.getCells()[3].getSelectedItem().getKey(), //almacen
							Charg: entry.getCells()[4].getSelectedItem().getKey()
						});
					}
				}
			});*/

			var oModel = this.getOwnerComponent().getModel("dos");
			var oData = {
				Vbeln: vPedido, //pedido
				Bolnr: vChofer, //chofer
				Traid: vRut, //rut
				Parn1: vTrans, // empresa
				Parn2: vPatCam, //patente camion
				Parn3: vPatCar, //patente carro
				Text1: vCubaOri, //cuba origen
				Text2: vDensidad, //densidad
				Text3: vPesoBru, //Peso bruto
				Text4: vPesoTara, //Peso tara 
				Text5: vSellos, // Sellos
				EntregaToPosiciones: Tabla,
				EntregaToSubPos: TablaSub
			};
			//return;
			sap.ui.core.BusyIndicator.show();
			oModel.create("/EntregaSet", oData, {
				success: function (Respuesta) {
					sap.ui.core.BusyIndicator.hide();
					if (Respuesta.Vbeln === "") {
						sap.m.MessageBox.error(Respuesta.ExMsg, {
							title: "Error", // default
							onClose: null, // default
							styleClass: "", // default
							initialFocus: null, // default
							textDirection: sap.ui.core.TextDirection.Inherit // default
						});
					} else {
						sap.m.MessageBox.success("¡La Entrega N° " + Respuesta.Vbeln + " ha sido Contabilizada!", {
							title: "Confirmación",
							onClose: function () {
								o.clearInput();
								oList.getBinding("items").refresh(true);
								//o.getOwnerComponent().oListSelector.clearMasterListSelection();
							},
							styleClass: "",
							initialFocus: null,
							textDirection: sap.ui.core.TextDirection.Inherit
						});

					}
				}.bind(this),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.error("Error al Crear Despacho.", {
						title: "Error",
						onClose: {
							//o.clearInput();
						},
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}.bind(this)
			});
		},

		_getCaracteristica: function (sMat) {
			var tCharact = sap.ui.getCore().byId("charact");
			tCharact.destroyItems();
			tCharact.setEnableBusyIndicator(true);
			/*var cOrigen = sap.ui.getCore().byId("deOrigen");
			var cAptitud = sap.ui.getCore().byId("aptitud");
			var cGrado = sap.ui.getCore().byId("grado");*/

			var oMod = this.getOwnerComponent().getModel("cuatro");
			var Filters = [];
			var filter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, sMat);
			Filters.push(filter);
			//filter = new sap.ui.model.Filter("Updkz", sap.ui.model.FilterOperator.EQ, "R"); //enviar una U
			//Filters.push(filter);
			oMod.read("/CaracteristicaSet", {
				filters: Filters,
				success: function (oData) {
					if (oData.length !== 0) {
						tCharact.setEnableBusyIndicator(false);
						oData.results.forEach(function (entity) {
							var oItem = new sap.m.ColumnListItem({
								cells: [
									/*new sap.m.Text({
										text: entity.Material
									}),
									new sap.m.Text({
										text: entity.IUpdkz
									}),*/
									new sap.m.Text({
										text: entity.CharactDescr
											//enabled: false
											//CharactDescr
									}),
									new sap.m.Text({
										text: entity.ValueChar
											//enabled: (entity.Updkz === "X") ? true : false

									}),
									new sap.m.Text({
										text: entity.Updkz
											//(entity.Updkz === "X") ? "U" : ""
									}),
									new sap.m.Text({
										text: sMat
											//enabled: true
									}),
									new sap.m.Text({
										text: entity.Charact
											//enabled: false
											//CharactDescr
									})
								]
							});

							tCharact.addItem(oItem);

							//console.log(entity.Charact);
						});
					} else {
						tCharact.setEnableBusyIndicator(false);
						sap.m.MessageBox.warning("¡Característica No Encontrada", {
							title: "Advertencia", // default
							onClose: null, // default
							styleClass: "", // default
							initialFocus: null, // default
							textDirection: sap.ui.core.TextDirection.Inherit // default
						});
					}
				}.bind(this),
				error: function (oError) {
					tCharact.setEnableBusyIndicator(false);
					sap.m.MessageBox.error("¡No se Encontraron Características!", {
						title: "Error",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}

			});

			/*var vOrigen = cOrigen.getText();
			var vAptitud = cAptitud.getText();
			var vGrado = cGrado.getText();

			cOrigen.setText(vOrigen);
			cAptitud.setText(vAptitud);
			cGrado.setText(vGrado);*/
		},

		_getDialog: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("conchaytoro.cl.zsd_contabilizar_despacho.view.Detalle", this);
				this.getView().addDependent(this._oDialog);
			}
			return this._oDialog;
		},

		viewDetail: function (oEvent) {
			this._getDialog().open();
			this._getCaracteristica(oEvent.getSource().getParent().getCells()[1].getTitle());
		},

		onGuardar: function (sMat) {
			var cTable = sap.ui.getCore().byId("charact");
			var vFilas = cTable.getItems();
			var aTabla = {};
			var oModel = this.getOwnerComponent().getModel("cuatro");
			vFilas.forEach(function (entity) {
				if (entity.getCells()[2].getValue() === "U") {
					aTabla = {
						Matnr: entity.getCells()[3].getValue(),
						//IUpdkz: "U",
						Charact: entity.getCells()[4].getText(),
						ValueChar: entity.getCells()[1].getValue()
							//CharactDescr: "",
							//Updkz: "X",
							//Message: ""
					};

					var URI_path = "/CaractChangeSet('" + aTabla.Matnr + "')";
					sap.ui.core.BusyIndicator.show();
					oModel.update(URI_path, aTabla, {
						success: function () {
							sap.ui.core.BusyIndicator.hide();
							sap.m.MessageBox.success("¡Grado Alcohólico Actualizado!", {
								title: "Confirmación",
								onClose: null,
								styleClass: "",
								initialFocus: null,
								textDirection: sap.ui.core.TextDirection.Inherit
							});

						},
						error: function (oError) {
							//sap.ui.core.BusyIndicator.hide();
							sap.m.MessageBox.error("Error al Actualizar", {
								title: "Error",
								onClose: null,
								styleClass: "",
								initialFocus: null,
								textDirection: sap.ui.core.TextDirection.Inherit
							});

						}
					});
				}

			});
		},

		_onGuardar: function (sMat) {
			var cTable = sap.ui.getCore().byId("charact");
			var vFilas = cTable.getItems();
			var aTabla = {};
			vFilas.forEach(function (entity) {
				if (entity.getCells()[2].getText() === "U") {
					aTabla = {
						IMatnr: entity.getCells()[3].getText(),
						IUpdkz: "U",
						Charact: entity.getCells()[0].getText(),
						ValueChar: entity.getCells()[1].getValue(),
						CharactDescr: "",
						Updkz: "X",
						Message: ""
					};
				}
			});

			//var oEntry = {};
			//return;
			var oModel = this.getOwnerComponent().getModel("cuatro");
			sap.ui.core.BusyIndicator.show();
			oModel.update("/CaracteristicaSet", aTabla, {
				success: function () {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.success("¡Característica Actualizada!", {
						title: "Confirmación",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});

				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.error("Error al Actualizar", {
						title: "Error",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});

				}
			});

		},

		onCancel: function () {
			this._getDialog().close();
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function () {
			var oViewModel = this.getModel("detailView");

			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		/**
		 * Updates the item count within the line item table's header
		 * @param {object} oEvent an event containing the total number of items in the list
		 * @private
		 */
		onListUpdateFinished: function (oEvent) {
			var sTitle,
				iTotalItems = oEvent.getParameter("total"),
				oViewModel = this.getModel("detailView");

			// only update the counter if the length is final
			if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
				if (iTotalItems) {
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
				} else {
					//Display 'Line Items' instead of 'Line items (0)'
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
				}
				oViewModel.setProperty("/lineItemListTitle", sTitle);
			}
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("PedidoSet", {
					Purchaseorder: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView: function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath),
				sObjectId = oObject.Purchaseorder,
				sObjectName = oObject.Purchaseorder,
				oViewModel = this.getModel("detailView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},

		_onMetadataLoaded: function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView"),
				oLineItemTable = this.byId("lineItemsList"),
				iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);
			oViewModel.setProperty("/lineItemTableDelay", 0);

			oLineItemTable.attachEventOnce("updateFinished", function () {
				// Restore original busy indicator delay for line item table
				oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
			});

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
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

		_validaCampos: function () {
			var cPedido = this.getView().byId("objectHeader"); //obtener number
			var cTrans = this.getView().byId("trans");
			var cPatCam = this.getView().byId("patenteCam");
			var cPatCar = this.getView().byId("patenteCar");
			var cChofer = this.getView().byId("chofer");
			var cRut = this.getView().byId("rut");
			var cCubaOri = this.getView().byId("cubaOri");
			var cCubaDes = this.getView().byId("cubaDes");
			var cPesoNeto = this.getView().byId("pesoNeto");
			var cPesoBru = this.getView().byId("pesoBru");

			var vPedido = cPedido.getNumber();
			var vTrans = cTrans.getSelectedKey();
			var vPatCam = cPatCam.getSelectedKey();
			var vPatCar = cPatCar.getSelectedKey();
			var vChofer = cChofer.getValue();
			var vRut = cRut.getValue();
			var Resultado = true;

			if (vTrans === "") {
				cTrans.setValueState(sap.ui.core.ValueState.Error);
				Resultado = false;
			} else {
				cTrans.setValueState(sap.ui.core.ValueState.Success);
			}

			if (vPatCam === "") {
				cPatCam.setValueState(sap.ui.core.ValueState.Error);
				Resultado = false;
			} else {
				cPatCam.setValueState(sap.ui.core.ValueState.Success);
			}

			if (vPatCar === "") {
				cPatCar.setValueState(sap.ui.core.ValueState.Error);
				Resultado = false;
			} else {
				cPatCar.setValueState(sap.ui.core.ValueState.Success);
			}

			if (vChofer === "") {
				cChofer.setValueState(sap.ui.core.ValueState.Error);
				Resultado = false;
			} else {
				cChofer.setValueState(sap.ui.core.ValueState.Success);
			}

			if (vRut === "" || !/^\d{1,2}.\d{3}.\d{3}-[\d-K]$/.test(vRut)) {
				cRut.setValueState(sap.ui.core.ValueState.Error);
				Resultado = false;
			} else {
				cRut.setValueState(sap.ui.core.ValueState.Success);
			}

			if (Resultado) {
				var iCont = 0;
				this.getView().byId("lineItemsList").getItems().forEach(function (entry) {
					if (entry.getCells()[12].getMetadata()._sClassName === "sap.m.CheckBox") {
						if (entry.getCells()[12].getSelected()) {
							iCont++;
						}
					}

					//entry.getCells()[3].setValueState(sap.ui.core.ValueState.None);
				});

				if (iCont === 0) {
					Resultado = false;
					sap.m.MessageBox.error("¡Seleccione al menos una Posición!", {
						title: "Error", // default
						onClose: null, // default
						styleClass: "", // default
						initialFocus: null, // default
						textDirection: sap.ui.core.TextDirection.Inherit // default
					});
				}
			}

			return Resultado;

		}

	});

});