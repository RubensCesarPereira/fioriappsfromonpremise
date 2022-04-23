/*global location */
sap.ui.define([
	"cl/conchaytoro/zpp_elaboracion_mezcla/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"cl/conchaytoro/zpp_elaboracion_mezcla/model/formatter",
	"sap/m/MessageBox"
], function (BaseController, JSONModel, formatter, MessageBox) {
	"use strict";

	return BaseController.extend("cl.conchaytoro.zpp_elaboracion_mezcla.controller.Detail", {

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
				var sObjectPath = this.getModel().createKey("BuscarSet", {
					Plnum: sObjectId
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
				sObjectId = oObject.Plnum,
				sObjectName = oObject.Psttr,
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
			sap.ui.getCore().byId("application-ZOBJ_SEM_ELAB_MEZCLA-display-component---master--list").getItems()[0].firePress();
			//("application-Test-url-component---master--list");
		},

		onAprobar: function () {
			var o = this;
			var oList = sap.ui.getCore().byId("application-ZOBJ_SEM_ELAB_MEZCLA-display-component---master--list");
			//("application-Test-url-component---master--list");
			var oSim = oList.getSelectedItem().getProperty("number");
			var oModel = o.getOwnerComponent().getModel();
			MessageBox.show("Realmente desea Aprobar Simulación N° " + oSim + "" + "?\n",
				//"Mezcla: " + oList[2].getText() + "\n" +
				//"Fecha: " + oList[1].getText() + "\n", 
				{
					icon: MessageBox.Icon.QUESTION,
					title: "Aprobar Simulación",
					actions: [MessageBox.Action.OK, MessageBox.Action.CLOSE],
					onClose: function (oAction) {
						if (oAction === "OK") {
							var oEntry = {
								IPlannedOrder: oSim
							};
							//oEntry.IPlannedOrder = oSim;
							sap.ui.core.BusyIndicator.show();
							oModel.create("/CreaProcesoSet", oEntry, {
								success: function (Respuesta) {
									sap.ui.core.BusyIndicator.hide();
									if (Respuesta.IPlannedOrder === "") {
										sap.m.MessageBox.warning("El pedido no fue creado", {
											title: "Advertencia", // default
											onClose: null, // default
											styleClass: "", // default
											initialFocus: null, // default
											textDirection: sap.ui.core.TextDirection.Inherit // default
										});
									} else {
										sap.m.MessageBox.success("Simulación N° " + Respuesta.IPlannedOrder + "  Aprobada Exitosamente!", {
											title: "Confirmación",
											onClose: function () {
												oList.getBinding("items").refresh(true);
												o.getOwnerComponent().oListSelector.clearMasterListSelection();
												o.getRouter().navTo("master");
											},
											styleClass: "",
											initialFocus: null,
											textDirection: sap.ui.core.TextDirection.Inherit
										});
									}

								}.bind(this),
								error: function () {
									sap.ui.core.BusyIndicator.hide();
									sap.m.MessageBox.error("Error al Aprobar Simulación.", {
										title: "Error",
										onClose: function () {
											oList.getBinding("items").refresh(true);
											o.getOwnerComponent().oListSelector.clearMasterListSelection();
											o.getRouter().navTo("master");
										},
										styleClass: "",
										initialFocus: null,
										textDirection: sap.ui.core.TextDirection.Inherit
									});
								}.bind(this)
							});
							/*oData.create("/CreaProcesoSet(IPlannedOrder='" + oSim + "')", oEntry, {
								success: function () {
									sap.ui.core.BusyIndicator.hide();
									MessageBox.success("Â¡Simulación Aprobada Exitosamente!");
									oList.getBinding("items").refresh(true);
									o.getOwnerComponent().oListSelector.clearMasterListSelection();
									//o.getRouter().navTo("master");
								},
								error: function (oError) {
									sap.ui.core.BusyIndicator.hide();
									MessageBox.error("Error al Aprobar Simulación");
									o.getOwnerComponent().oListSelector.clearMasterListSelection();
									//o.getRouter().navTo("master");
								}
							});*/
						} else {
							//NO
						}
					}
				}
			);
		}

	});

});