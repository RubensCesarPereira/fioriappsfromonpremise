/*global location */
sap.ui.define([
	"cl/conchaytoro/zpp_registro_mezcla/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"cl/conchaytoro/zpp_registro_mezcla/model/formatter",
	"sap/m/MessageBox"
], function (BaseController, JSONModel, formatter, MessageBox) {
	"use strict";

	return BaseController.extend("cl.conchaytoro.zpp_registro_mezcla.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));

			this.activeButton();

			var mData = {
				"motivo": [{
					"name": "Turno A",
					"value": "Turno A"
				}, {
					"name": "Turno B",
					"value": "Turno B"
				}, {
					"name": "Turno C",
					"value": "Turno C"
				}]
			};

			var pModel = new JSONModel(mData);
			this.getView().setModel(pModel, "pp");
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
				var sObjectPath = this.getModel().createKey("BuscarCabezeraSet", {
					Aufnr: sObjectId
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
				sObjectId = oObject.Aufnr,
				sObjectName = oObject.Erdat,
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
				oViewModel = this.getModel("detailView");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},

		_selectFirst: function () {
			sap.ui.getCore().byId("application-ZOBJ_SEM_REG_MEZCLA-display-component---master--list").getItems()[0].firePress();
			//("application-ZOBJ_SEM_REG_MEZCLA-display-component---master--list").getItems()[0].firePress();
		},

		clearInput: function () {
			var cGrado = this.getView().byId("grado");
			var cMezcla = this.getView().byId("num_mezcla");
			var cEnologo = this.getView().byId("enologo");
			var cBodega = this.getView().byId("bodega");
			var cTurno = this.getView().byId("turno");
			var cCosecha = this.getView().byId("cosecha");

			cGrado.setValue("");
			cMezcla.setValue("");
			cEnologo.setValue("");
			cBodega.setValue("");
			cTurno.setValue("");
			cCosecha.setValue("");

			cGrado.setValueState(sap.ui.core.ValueState.None);
			cMezcla.setValueState(sap.ui.core.ValueState.None);
			cEnologo.setValueState(sap.ui.core.ValueState.None);
			cBodega.setValueState(sap.ui.core.ValueState.None);
			cTurno.setValueState(sap.ui.core.ValueState.None);
			cCosecha.setValueState(sap.ui.core.ValueState.None);
		},

		activeButton: function () {
			var mensaje = this.getView().byId("msg");
			var btnConta = this.getView().byId("btnConta");
			var cGrado = this.getView().byId("grado");
			var cMezcla = this.getView().byId("num_mezcla");
			var cEnologo = this.getView().byId("enologo");
			var cBodega = this.getView().byId("bodega");
			var cTurno = this.getView().byId("turno");
			var cCosecha = this.getView().byId("cosecha");

			if (cGrado.getValue() === "" ||
				cGrado.getValueState() !== sap.ui.core.ValueState.Success ||
				cMezcla.getValue() === "" || cMezcla.getValueState() !== sap.ui.core.ValueState.Success ||
				cEnologo.getValue() === "" || cEnologo.getValueState() !== sap.ui.core.ValueState.Success ||
				cBodega.getValue() === "" || cBodega.getValueState() !== sap.ui.core.ValueState.Success ||
				cTurno.getSelectedKey() === "" || cTurno.getValueState() !== sap.ui.core.ValueState.Success || cCosecha.getValue() === "" ||
				cCosecha.getValueState() !== sap.ui.core.ValueState.Success) {

				btnConta.setEnabled(false);
				mensaje.setVisible(true);
			} else {
				btnConta.setEnabled(true);
				mensaje.setVisible(false);
			}
		},

		activeMessage: function () {

		},

		onConta: function (oEvent) {
			/*if (!this.validaInput()) {
				return;

			}*/
			var o = this;
			var oList = sap.ui.getCore().byId("application-ZOBJ_SEM_REG_MEZCLA-display-component---master--list");
			//("application-Test-url-component---detail");
			//("application-ZOBJ_SEM_REG_MEZCLA-display-component---master--list");
			var cOrden = o.getView().byId("orden");
			var vOrden = cOrden.getText();

			var cGrado = o.getView().byId("grado");
			var cMezcla = o.getView().byId("num_mezcla");
			var cEnologo = o.getView().byId("enologo");
			var cBodega = o.getView().byId("bodega");
			var cTurno = o.getView().byId("turno");
			var cCosecha = o.getView().byId("cosecha");

			var vGrado = cGrado.getValue();
			var vMezcla = cMezcla.getValue();
			var vEnologo = cEnologo.getValue();
			var vBodega = cBodega.getValue();
			var vTurno = cTurno.getSelectedKey();
			var vCosecha = cCosecha.getValue();

			var oModel = o.getOwnerComponent().getModel();
			var oEntry = {
				ImAction: "",
				Aufnr: vOrden,
				IBodega: vBodega,
				IEnologo: vEnologo,
				IGrado: vGrado,
				INumMezcla: vMezcla,
				ITurno: vTurno,
				IAnocosecha: vCosecha,
				IUpdkz: "",
				EReturn: ""
			};
			sap.ui.core.BusyIndicator.show();
			oModel.create("/CreaProcesoMSet", oEntry, {
				success: function (Respuesta) {
					sap.ui.core.BusyIndicator.hide();
					if (Respuesta.EReturn === "") {
						sap.m.MessageBox.warning("¡La Orden no fue Contabilizada!", {
							title: "Advertencia", // default
							onClose: null, // default
							styleClass: "", // default
							initialFocus: null, // default
							textDirection: sap.ui.core.TextDirection.Inherit // default
						});
					} else {
						sap.m.MessageBox.success("¡Orden N° " + Respuesta.EReturn + " ha sido Contabilizada!", {
							title: "Confirmación",
							onClose: function () {
								oList.getBinding("items").refresh(true);
								o._selectFirst();
								o.clearInput();
							},
							styleClass: "",
							initialFocus: null,
							textDirection: sap.ui.core.TextDirection.Inherit
						});
					}

				}.bind(this),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.error("Error al Contabilizar", {
						title: "Error",
						onClose: function () {
							oList.getBinding("items").refresh(true);
							o._selectFirst();
							o.clearInput();
						},
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}.bind(this)
			});

			/*var cOrden = this.getView().byId("orden");
			var cFase = this.getView().byId("fase");
			var cMezcla = this.getView().byId("mezcla");
			var cNoti = this.getView().byId("noti");
			var cCantidad = this.getView().byId("cantidad");

			var vOrden = cOrden.getText();
			var vFase = cFase.getText();
			var vMezcla = cMezcla.getText();
			var vNoti = cNoti.getText();
			var vCantidad = cCantidad.getText();

			var cTable = this.getView().byId("lineItemsList");
			var vFilas = cTable.getItems();
			var Tabla = [];
			vFilas.forEach(function (entry) {
				//if (entry.getCells()[5].getSelected()) {

				//posiciones
				Tabla.push({
					IAufnr: vOrden, //orden
					Matnr: entry.getCells()[0].getText(), //material
					Psmng: entry.getCells()[1].getText(), //cantidad
					Pwerk: entry.getCells()[2].getText(), //centro
					Lgort: entry.getCells()[3].getText(), //almacen
					Charg: entry.getCells()[4].getText(), //lote
					ClassMov: entry.getCells()[5].getText() //movimiento
				});
				//}
			});
			var oModel = this.getOwnerComponent().getModel();

			//cabecera
			var oData = {
				Aufnr: vOrden, //orden
				Vornr: vFase, //fase
				Stlbez: vMezcla, //mezcla
				Aueru: vNoti, //notificacion
				Gamng: vCantidad, //cantidad
				OrdenToPosiciones: Tabla //crear nueva tabla**
			};
			//return;
			sap.ui.core.BusyIndicator.show();
			oModel.create("/CreaProcesoMSet", oData, {
				success: function (Respuesta) {
					sap.ui.core.BusyIndicator.hide();
					if (Respuesta.Aufnr === "") {
						sap.m.MessageBox.warning("¡Orden No Contabilizada!", {
							title: "Advertencia", // default
							onClose: null, // default
							styleClass: "", // default
							initialFocus: null, // default
							textDirection: sap.ui.core.TextDirection.Inherit // default
						});
					} else {
						sap.m.MessageBox.success("¡La Orden N° " + Respuesta.Aufnr + " ha sido Contabilizada!", {
							title: "Confirmación",
							onClose: function () {
								oList.getBinding("items").refresh(true);
								o._selectFirst();
								o.clearInput();
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
					sap.m.MessageBox.error("Error al Contabilizar", {
						title: "Error",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}.bind(this)
			});*/
		},

		handleValidationError2: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			this.validaInput();
		},

		handleValidationSuccess2: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
			this.validaInput();
		},

		validaInput: function (oEvt) {
			var cGrado = this.getView().byId("grado");
			var cMezcla = this.getView().byId("num_mezcla");
			var cEnologo = this.getView().byId("enologo");
			var cBodega = this.getView().byId("bodega");
			var cTurno = this.getView().byId("turno");
			var cCosecha = this.getView().byId("cosecha");

			var vGrado = cGrado.getValue();
			var vMezcla = cMezcla.getValue();
			var vEnologo = cEnologo.getValue();
			var vBodega = cBodega.getValue();
			var vTurno = cTurno.getSelectedKey();
			var vCosecha = cCosecha.getValue();

			if (vGrado === "") {
				cGrado.setValueState(sap.ui.core.ValueState.Error);
			} else {
				cGrado.setValueState(sap.ui.core.ValueState.Success);
			}

			if (vMezcla === "") {
				cMezcla.setValueState(sap.ui.core.ValueState.Error);
			} else {
				cMezcla.setValueState(sap.ui.core.ValueState.Success);
			}

			if (vEnologo === "") {
				cEnologo.setValueState(sap.ui.core.ValueState.Error);
			} else {
				cEnologo.setValueState(sap.ui.core.ValueState.Success);
			}

			if (vBodega === "") {
				cBodega.setValueState(sap.ui.core.ValueState.Error);
			} else {
				cBodega.setValueState(sap.ui.core.ValueState.Success);
			}

			if (vTurno === "") {
				cTurno.setValueState(sap.ui.core.ValueState.Error);
			} else {
				cTurno.setValueState(sap.ui.core.ValueState.Success);
			}

			if (vCosecha === "" || !/^\d{4}$/.test(oEvt.getParameter('value'))) {
				cCosecha.setValueState(sap.ui.core.ValueState.Error);
			} else {
				cCosecha.setValueState(sap.ui.core.ValueState.Success);
			}

			this.activeButton();
		}

	});

});