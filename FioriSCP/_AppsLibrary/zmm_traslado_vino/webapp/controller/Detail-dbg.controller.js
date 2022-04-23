/*global location */
sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/library",
	"cl/conchaytoro/zmm_traslado_vino/model/formatter"

], function (BaseController, JSONModel, mobileLibrary, formatter) {
	"use strict";
	// shortcut for sap.m.URLHelper
	//var URLHelper = mobileLibrary.URLHelper;

	return BaseController.extend("cl.conchaytoro.zmm_traslado_vino.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			// Control state model
			var oList = this.byId("lineItemsList");

			this._oList = oList;

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

			this.initView();
		},
		/*		
				onAfterRendering: function () {
					if (!this.getOwnerComponent().oListSelector._oList._bItemNavigationInvalidated) {
					//if (this.getOwnerComponent().oListSelector._oList.getSelectedItem() !== null &&
					//	this.byId("lineItemsList").getItems().length > 0) {
						this.setPositionListItem(0);
					}
					
				},
		*/
		/* =========================================================== */
		/* custom event handlers                                       */
		/* =========================================================== */
		initView: function () {
			this.setToDay();
			this.setDayConta();
			//_selectFirst: function() {
			//sap.ui.getCore().byId("zsd_contabilizar_despacho---master--list").getItems()[0].firePress()
			//}				
			this.setPositionListItem(0);
		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function () {
			this._oList.getBinding("items").refresh();
		},

		navButtonPress: function (sEvent) {
			//alert("entro");
		},

		setToDay: function () {
			var dpDate = this.getView().byId("erdat");
			var today = new Date();
			dpDate.setDateValue(today);
			dpDate.setMinDate(today);
			dpDate.setMaxDate(today);

		},

		setDayConta: function () {
			var today = new Date();
			var contDate = this.getView().byId("fechaConta");
			contDate.setDateValue(today);

			var minimo = new Date();
			minimo = minimo.setDate(minimo.getDate() - 5);
			minimo = new Date(minimo);

			contDate.setMinDate(minimo);
			contDate.setMaxDate(today);
		},

		/*_fechaConta: function (oEvt) {
			var contDate = this.getView().byId("fechaConta");
			var today = new Date();
			contDate.setMinDate(today.getDate() - 5);
			contDate.setMaxDate(today);

		},*/

		setPositionListItem: function (i) {
			//var x = this.getOwnerComponent().oListSelector._oList.getFirstListItem();
			//this.getOwnerComponent().getItems()[x].firesPress();

			if (i !== undefined && i !== "") {
				var x = parseInt(i, 10);
				//var id = this.byId("lineItemsList").sId;
				var oItemMaster = this.byId("lineItemsList").getItems(); //[x];

				if (oItemMaster.length > 0) {
					oItemMaster[x].firePress();
				}
			}
		},

		clearValues: function (oAct) {
			// limpiamos los chekbox	
			var oListDetail = this.byId("lineItemsList");
			var oLineItems = oListDetail.getItems();
			oLineItems.forEach(function (line) {
				line.getCells()[8].setSelected(false);
			});
			if (oAct !== "undefined" && oAct === "full") {
				var oVbeln = this.byId("objectHeader");
				var oFecha = this.byId("erdat");
				var oWerks = this.byId("werks");
				oFecha.setValue("");
				oWerks.setValue("");
				oVbeln.setNumber("");
				oVbeln.setNumberUnit("");
			}
		},

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
			if (!sObjectId) {
				return;
			}
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("EntregaSet", {
					Vbeln: sObjectId
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
				sObjectId = oObject.Vbeln,
				sObjectName = oObject.Vbeln,
				oViewModel = this.getModel("detailView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));

			this.clearValues();
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

		onContabilizarPress: function (oEvent) {
			//oView.byId("lineItemsList").getItems()[0].getCells()[4].setSelected(true)
			//var oModel = this.getView().getModel("detailView");
			var oModel = this.getOwnerComponent().getModel();
			if (oModel === "undefined")
				return;
			var oListMaster = sap.ui.getCore().byId("application-ZOBJ_SEM_TRAS_VINO-display-component---master--list");
			//("zmm_traslado_vino---master--list"); 
			var oListDetail = this.byId("lineItemsList");
			var oLineItems = oListDetail.getItems();
			var oItemList = [];
			var oThis = this;
			// datos de cabecera
			var vbeln = this.getView().byId("objectHeader").getNumber();
			var erdat = this.getView().byId("objectHeader").getNumberUnit();
			var fechaConta = this.getView().byId("fechaConta").getValue();
			oLineItems.forEach(function (line) {
				if (line.getCells()[9].getSelected()) {
					oItemList.push({
						Vbeln: vbeln,
						Posnr: line.getCells()[0].getText(),
						Matnr: line.getCells()[1].getText(),
						Lfimg: line.getCells()[3].getText(),
						Meins: line.getCells()[4].getUnit(),
						Werks: line.getCells()[5].getText(),
						Lgort: line.getCells()[6].getText(),
						Charg: line.getCells()[7].getText(),
						Gjahr: line.getCells()[8].getText(),
						Updkz: "U"
					});
				}
			});

			if (oLineItems.length > 0) {
				var oData = {
					Vbeln: vbeln,
					Erdat: erdat,
					Fecha: fechaConta,
					EntregaToPosiciones: oItemList
				};
				sap.ui.core.BusyIndicator.show();
				oModel.create("/EntregaSet", oData, {
					success: function (data) {
						sap.ui.core.BusyIndicator.hide();
						if (data.Vbeln !== "") {
							sap.m.MessageBox.success("La Entrega N° " + data.Vbeln + " ha sido Contabilizada!", {
								title: "Confirmación",
								onClose: function () {
									oListDetail.getBinding("items").refresh(true);
									var lines = oListDetail.getItems().length;
									if (lines === 1) {
										// Refresh Master List
										oListMaster.getBinding("items").refresh(true);
										var rows = oListMaster.getItems().length;
										if (rows >= 1) {
											oListMaster.getItems()[0].firePress();
										}
										//clear values
										oThis.clearValues("full");
									} else {
										//clear values
										oThis.clearValues();
									}
								},
								styleClass: "",
								initialFocus: null,
								textDirection: sap.ui.core.TextDirection.Inherit
							});
						} else {
							if (data.Message !== "") {
								sap.m.MessageBox.warning(data.Message, {
									title: "Advertencia",
									onClose: null,
									styleClass: "",
									initialFocus: null,
									textDirection: sap.ui.core.TextDirection.Inherit
								});

							} else {
								sap.m.MessageBox.warning("¡Error al Contabilizar!", {
									title: "Advertencia",
									onClose: null,
									styleClass: "",
									initialFocus: null,
									textDirection: sap.ui.core.TextDirection.Inherit
								});
							}
						}
					}.bind(this),
					error: function () {
						sap.ui.core.BusyIndicator.hide();
						sap.m.MessageBox.error("Ocurrio un error en la contabilización!", {
							title: "Error",
							onClose: null,
							styleClass: "",
							initialFocus: null,
							textDirection: sap.ui.core.TextDirection.Inherit
						});
					}.bind(this)
				});
			}
		},

		/**
		 * Event handler to cancelar press button
		 */
		onCancelarPress: function (oEvent) {
			this.clearValues();
		},

		/**
		 * Event handler to back 
		 */
		onNavBack: function () {
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
			this.getRouter().navTo("master");
		}

	});

});