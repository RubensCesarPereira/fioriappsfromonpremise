/*global location */
sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/library",
	"cl/conchaytoro/zmm_entrada_vino/model/formatter"

], function (BaseController, JSONModel, mobileLibrary, formatter) {
	"use strict";
	// shortcut for sap.m.URLHelper
	//var URLHelper = mobileLibrary.URLHelper;

	return BaseController.extend("cl.conchaytoro.zmm_entrada_vino.controller.Detail", {

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

			this.addViewController("detail", this);
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
			var dpDate = this.getView().byId("fecha");
			var today = new Date();
			dpDate.setDateValue(today);
			dpDate.setMinDate(today);
			dpDate.setMaxDate(today);
		},

		setPositionListItem: function (i) {
			//var x = this.getOwnerComponent().oListSelector._oList.getFirstListItem();
			//this.getOwnerComponent().getItems()[x].firesPress();

			if (i !== undefined && i !== "") {
				var x = parseInt(i, 10);
				var oItemDetail = this.byId("lineItemsList").getItems(); //[x];
				if (oItemDetail.length > 0) {
					oItemDetail[x].firePress();
				}
			}
		},

		clearValues: function (oAct) {
			// limpiamos los chekbox	
			var oItemsTable = this.byId("lineItemsList");
			var oLineItems = oItemsTable.getItems();
			oLineItems.forEach(function (line) {
				line.getCells()[5].setSelected(false);
			});
			if (oAct !== "undefined" && oAct === "full") {
				var oEbeln = this.byId("objectHeader");
				var oFecha = this.byId("fecha");
				oFecha.setValue("");
				oEbeln.setNumber("");
				oEbeln.setNumberUnit("");
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
				var sObjectPath = this.getModel().createKey("EntradaHeaderSet", {
					Ebeln: sObjectId
				});
				this._bindView("/" + sObjectPath);
				/*var sObjectPath = "EntradaItemsSet?$filter eq Ebeln = '" +
									sObjectId +
									"')";
				this._bindView(sObjectPath);*/
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
				sObjectId = oObject.Ebeln,
				sObjectName = oObject.Ebeln,
				oViewModel = this.getModel("detailView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));

			//this.clearValues();
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

		yearInput: function (oEvt) {
			if (!/^\d{4}$/.test(oEvt.getParameter('value'))) {
				oEvt.getSource().setValueState(sap.ui.core.ValueState.Error);
			} else {
				oEvt.getSource().setValueState(sap.ui.core.ValueState.Success);
			}
		},

		onContabilizarPress: function (oEvent) {
			var oModel = this.getView().getModel();
			var oListMaster = sap.ui.getCore().byId("zmm_entrada_vino---master--list");
			var oListDetail = this.byId("lineItemsList");
			var oLineItems = oListDetail.getItems();
			var oItemList = [];
			var oThis = this;
			// datos de objeto
			var ebeln = this.getView().byId("objectHeader").getNumber();
			var aedat = this.getView().byId("objectHeader").getNumberUnit();
			// var posnr = this.getView().byId("objectHeader").getNumber();
			// var ebeln = this.getView().byId("objectHeader").getNumber();
			oLineItems.forEach(function (line) {
				if (line.getCells()[6].getSelected()) {
					oItemList.push({
						Ebeln: ebeln,
						Ebelp: line.getCells()[0].getText(),
						Matnr: line.getCells()[1].getText(),
						Menge: line.getCells()[3].getText(),
						Meins: line.getCells()[4].getUnit(),
						Gjahr: line.getCells()[5].getValue()
					});
				}
			});
			if (oLineItems.length > 0) {
				/*				var sObjectPath = oModel.createKey("/EntradaItemsSet", {
									properties: {
										Ebeln: ebeln,
										Ebelp: "10"
									}
								});*/
				var oData = {
					Ebeln: ebeln,
					Aedat: aedat,
					//Ebelp: "10",
					HeaderToItems: oItemList
				};
				//var sObjectPath = "/EntradaItemsSet";	//('" + ebeln + "','10')";
				sap.ui.core.BusyIndicator.show();
				oModel.create("/EntradaHeaderSet", oData, {
					success: function (data) {
						sap.ui.core.BusyIndicator.hide();
						if (data.Ebeln !== "") {
							sap.m.MessageBox.success("¡Plan de Entrega N° " + data.Ebeln + " ha sido Contabilizado!", {
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
			/*			var sObjectId = this.getView().getBindingContext().getProperty("Ebeln");
						// discard the new context on cancel
						//this.getModel().deleteCreatedEntry(this.oContext);
						if (oEvent.getParameter("name") === "object") {
							this.getModel("appView").setProperty("/layout", "OneColumn");
						}
						this.getModel().metadataLoaded().then(function () {
							var sObjectPath = this.getModel().createKey("HeaderEntradaSet", {
								SalesOrderID: sObjectId
							});
							this._bindView("/" + sObjectPath);
						}.bind(this));
						//Set the layout property of the FCL control to 'OneColumn'
						this.getModel("appView").setProperty("/layout", "OneColumn");
						// close the second column
						var nav = this.getRouter().getTargets("master");	
						this.getRouter().navTo("master", {}, true);	*/
			this.clearValues();
		},

		/**
		 * Event handler to back 
		 */
		onNavBack: function () {
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
			this.getRouter().navTo("master");
		}

		/*
		onNavigation: function(oEvent){
		  var oValue = oEvent.getParameter("listItem").getTitle();
		  var oApp = sap.ui.getCore().byId("oApp");
		  		var page = app.getPage("idDetail1");
			if(page === null )
			{
			var page = new sap.ui.jsview("idDetail1", "home.Detail");
				oApp.addPage(page);
			}
		  oApp.to("idDetail1",{oTitle:oValue});
		  
		}
		*/

	});

});