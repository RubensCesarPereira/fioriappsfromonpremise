/*global location */
sap.ui.define([
	"conchaytoro/cl/zsd_autorizar_merma/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"conchaytoro/cl/zsd_autorizar_merma/model/formatter"
], function (BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("conchaytoro.cl.zsd_autorizar_merma.controller.Detail", {

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
				delay: 0,
				lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading")
			});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));

			//var value = this. getView().byId("autorizado").getSelected();
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
				var sObjectPath = this.getModel().createKey("HeaderMermaSet", {
					Rsnum: sObjectId
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
				sObjectId = oObject.Rsnum,
				sObjectName = oObject.Rsnum,
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

		_selectFirst: function () {
			sap.ui.getCore().byId("application-ZOBJ_SEM_AUT_MERMA-display-component---master--list").getItems()[0].firePress();
			//("application-ZOBJ_SEM_AUT_MERMA-display-component---master--list").getItems()[0].firePress();
			//("application-Test-url-component---master--list").getItems()[0].firePress();
		},

		clearCells: function (oEvent) {
			var table = this.getView().byId("lineItemsList");
			//table.removeAllItems();
		},

		//DINAMICO
		onAutorizar: function (oEvent) {
			/*if (!this._validaCheck()) {
				return;
			}*/

			var o = this;
			var oList = sap.ui.getCore().byId("application-ZOBJ_SEM_AUT_MERMA-display-component---master--list");
			//("application-ZOBJ_SEM_AUT_MERMA-display-component---master--list");
			//("zsd_autorizar_merma---master--list");
			//("application-Test-url-component---master--list");
			var cTable = o.getView().byId("lineItemsList");
			var vFilas = cTable.getItems();
			var cReserva = o.getView().byId("objectHeader");
			var vReserva = cReserva.getNumber(); //pedido
			var cCentro = o.getView().byId("objectAttribute");
			var vCentro = cCentro.getText(); //centr
			var cMotivo = o.getView().byId("motivo");
			var vMotivo = cMotivo.getText(); //motivo

			var Tabla = [];
			vFilas.forEach(function (entry) {
				Tabla.push({
					Rsnum: vReserva,
					Rspos: entry.getCells()[0].getText(),
					Material: entry.getCells()[1].getText(), //es
					StoreLoc: entry.getCells()[5].getText(), //
					Batch: entry.getCells()[6].getText(), //
					Quantity: entry.getCells()[3].getText(),
					Unit: entry.getCells()[4].getUnit(),
					Fedoc: "",
					Nombre: "",
					Fecon: "",
					Motiivo: "",
					Autorizado: entry.getCells()[8].getSelected() ? "X" : "",
					Makt: ""
				});
			});
			var oModel = this.getOwnerComponent().getModel("dos");
			var oData = {
				Rsnum: vReserva,
				MoveType: "",
				Plant: vCentro, //este
				Kostl: "", //este
				Motivo: vMotivo, //este
				MermaToPosiciones: Tabla
			};
			sap.ui.core.BusyIndicator.show();

			oModel.create("/HeaderMermaSet", oData, {
				method: "GET",
				success: function (Respuesta) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.success("¡Documento N° " + vReserva + " ha sido Contabilizado!", {
						title: "Confirmación",
						onClose: function () {
							//o.clearCells();
							oList.getBinding("items").refresh(true);
							o._selectFirst();
						},
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
					//o._selectFirst();
					//oModel.setUseBatch(true);
				}.bind(this),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.error("Error al Autorizar", {
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
		_onAutorizar: function () {
			var Tabla = [];
			Tabla.push({
				Rsnum: "0019393354",
				Rspos: "0001",
				Material: "",
				StoreLoc: "",
				Batch: "",
				Quantity: "",
				Unit: "",
				Fedoc: "",
				Nombre: "",
				Fecon: "",
				Motiivo: "",
				Autorizado: "X",
				Makt: ""
			});

			var oModel = this.getOwnerComponent().getModel();
			var oData = {
				Rsnum: "0019393354",
				MoveType: "",
				Plant: "",
				Kostl: "",
				Motivo: "",
				MermaToPosiciones: Tabla
			};

			//oData.Item = Tabla;
			//return;
			sap.ui.core.BusyIndicator.show();
			oModel.create("/HeaderMermaSet", oData, {
				success: function (Respuesta) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.success("¡Merma N° " + Respuesta.Rsnum + " Autorizada!", {
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
					sap.m.MessageBox.error("Error al Autorizar", {
						title: "Error",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}.bind(this)
			});
			/*var o = this;
			var oList = sap.ui.getCore().byId("application-Test-url-component---master--list");
			var vReserva = "0019393354";
			var vCheck = "X";
			var vPos = "0001";
			var oModel = this.getOwnerComponent().getModel(); //modelo
			var oEntry = {};
			oEntry.Rsnum = vReserva;
			sap.ui.core.BusyIndicator.show();
			oModel.update("/AutorizarMermaSet(Rsnum='" + vReserva + "' Rspos='" + vPos + "' Autorizado='" + vCheck + "' )", {
				success: function () {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.success("¡Merma ha sido Autorizada!", {
						title: "Confirmación",
						onClose: function () {
							oList.getBinding("items").refresh(true);
							o._selectFirst();
						},
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});

				}.bind(this),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.error("Error al Autorizar", {
						title: "Error",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}
			});
			var cTable = this.getView().byId("lineItemsList");
			var vFilas = cTable.getItems();
			var oModel = this.getOwnerComponent().getModel();
			var Tabla = {};
			vFilas.forEach(function (entity) {
				Tabla = {
					Rsnum: "0019393354", //merma
					Rspos: "0001", //posicion
					Autorizado: true
				};

				sap.ui.core.BusyIndicator.show();
				oModel.update("/AutorizarMermaSet", Tabla, {
					success: function () {
						sap.ui.core.BusyIndicator.hide();
						sap.m.MessageBox.success("¡Merma ha sido Autorizada!", {
							title: "Confirmación",
							onClose: null,
							styleClass: "",
							initialFocus: null,
							textDirection: sap.ui.core.TextDirection.Inherit
						});

					}.bind(this),
					error: function () {
						sap.ui.core.BusyIndicator.hide();
						sap.m.MessageBox.error("Error al Autorizar", {
							title: "Error",
							onClose: null,
							styleClass: "",
							initialFocus: null,
							textDirection: sap.ui.core.TextDirection.Inherit
						});
					}
				});

			});*/

			/*Tabla.push({
				Rsnum: "0019393354", //merma
				Rspos: "0001", //posicion
				Autorizado: "X"
			});
*/

		},

		_validaCheck: function (oEvt) {
			if (oEvt.getSource().getProperty("selected"))
				oEvt.getSource().getParent().getCells()[9].setSelected(false);
			else
				oEvt.getSource().getParent().getCells()[9].setSelected(true);
		},
		_validaCheckRech: function (oEvt) {
			if (oEvt.getSource().getProperty("selected"))
				oEvt.getSource().getParent().getCells()[8].setSelected(false);
			else
				oEvt.getSource().getParent().getCells()[8].setSelected(true);
		}

	});

});