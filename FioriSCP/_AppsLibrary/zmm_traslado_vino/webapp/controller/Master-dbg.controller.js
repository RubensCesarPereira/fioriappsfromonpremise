/*global history */
sap.ui.define([
	"cl/conchaytoro/zmm_traslado_vino/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"cl/conchaytoro/zmm_traslado_vino/model/formatter"
], function (BaseController, JSONModel, Filter, FilterOperator, GroupHeaderListItem, Device, formatter) {
	"use strict";

	return BaseController.extend("cl.conchaytoro.zmm_traslado_vino.controller.Master", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
		 * @public
		 */
		onInit: function () {
			// Control state model
			var oList = this.byId("list"),
				oViewModel = this._createViewModel(),
				// Put down master list's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the master list is
				// taken care of by the master list itself.
				iOriginalBusyDelay = oList.getBusyIndicatorDelay();

			this._oList = oList;
			// keeps the filter and search state
			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};

			this.setModel(oViewModel, "masterView");
			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oList.attachEventOnce("updateFinished", function () {
				// Restore original busy indicator delay for the list
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			this.getView().addEventDelegate({
				onBeforeFirstShow: function () {
					this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
				}.bind(this)
			});

			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * After list data is available, this handler method updates the
		 * master list counter and hides the pull to refresh control, if
		 * necessary.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function (oEvent) {
			// update the master list object counter after new data is loaded
			this._updateListItemCount(oEvent.getParameter("total"));
			// hide pull to refresh if necessary
			this.byId("pullToRefresh").hide();
			/*
			http://embed.plnkr.co/nKuwS9FjEt5WL5LHCC0T/preview
			  var oList = oEvent.getSource();
		    var oFirstItem = oEvent.getSource().getItems()[0];
		    oList.setSelectedItem(oFirstItem);
		    var oContext = oFirstItem.getBindingContext();
			  var oDetail = sap.ui.getCore().byId("detail");
			  oDetail.setBindingContext(oContext);
		*/
		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function () {
			this._oList.getBinding("items").refresh();
		},

		/**
		 * Event handler for the list selection event
		 * @param {sap.ui.base.Event} oEvent the list selectionChange event
		 * @public
		 */
		onSelectionChange: function (oEvent) {
			var oList = oEvent.getSource(),
				bSelected = oEvent.getParameter("selected");

			// skip navigation when deselecting an item in multi selection mode
			if (!(oList.getMode() === "MultiSelect" && !bSelected)) {
				// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			}
			/*
			http://embed.plnkr.co/nKuwS9FjEt5WL5LHCC0T/preview
			  var oContext = oEvent.getParameter("listItem").getBindingContext();
			  var oDetail = sap.ui.getCore().byId("detail");
			  oDetail.setBindingContext(oContext);
			*/
		},

		/**
		 * Apply the chosen sorter and grouper to the master list
		 * @param {sap.ui.base.Event} oEvent the confirm event
		 * @private
		 */
		/*		_applySortGroup: function (oEvent) {
					var mParams = oEvent.getParameters(),
						sPath,
						bDescending,
						aSorters = [];
					// apply sorter to binding
					// (grouping comes before sorting)
					if (mParams.groupItem) {
						sPath = mParams.groupItem.getKey();
						bDescending = mParams.groupDescending;
						var vGroup = this._oGroupFunctions[sPath];
						aSorters.push(new Sorter(sPath, bDescending, vGroup));
					}
					sPath = mParams.sortItem.getKey();
					bDescending = mParams.sortDescending;
					aSorters.push(new Sorter(sPath, bDescending));
					this._oList.getBinding("items").sort(aSorters);
				},*/

		/**
		 * Event handler for the bypassed event, which is fired when no routing pattern matched.
		 * If there was an object selected in the master list, that selection is removed.
		 * @public
		 */
		onBypassed: function () {
			this._oList.removeSelections(true);
		},

		/**
		 * Used to create GroupHeaders with non-capitalized caption.
		 * These headers are inserted into the master list to
		 * group the master list's items.
		 * @param {Object} oGroup group whose text is to be displayed
		 * @public
		 * @returns {sap.m.GroupHeaderListItem} group header with non-capitalized caption.
		 */
		createGroupHeader: function (oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.text,
				upperCase: false
			});
		},

		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser historz
		 * @public
		 */
		onNavBack: function () {
			history.go(-1);
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		_createViewModel: function () {
			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("masterTitleCount", [0]),
				noDataText: this.getResourceBundle().getText("masterListNoDataText"),
				sortBy: "Vbeln",
				groupBy: "None"
			});
		},

		/**
		 * If the master route was hit (empty hash) we have to set
		 * the hash to to the first item in the list as soon as the
		 * listLoading is done and the first item in the list is known
		 * @private
		 */
		_onMasterMatched: function () {
			this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(function (mParams) {
					if (mParams.list.getMode() === "None") {
						return;
					}
					var sObjectId = mParams.firstListitem.getBindingContext().getProperty("Vbeln");
					this.getRouter().navTo("object", {
						objectId: sObjectId
					}, true);
				}.bind(this),
				function (mParams) {
					if (mParams.error) {
						return;
					}
					this.getRouter().getTargets().display("detailNoObjectsAvailable");
				}.bind(this)

				//Set the layout property of the FCL control to 'OneColumn'
				//this.getModel("appView").setProperty("/layout", "OneColumn");
			);
		},

		/**
		 * Shows the selected item on the detail page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showDetail: function (oItem) {
			var bReplace = !Device.system.phone;
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("Vbeln")
			}, bReplace);
		},

		/**
		 * Sets the item count on the master list header
		 * @param {integer} iTotalItems the total number of items in the list
		 * @private
		 */
		_updateListItemCount: function (iTotalItems) {
			var sTitle;
			// only update the counter if the length is final
			if (this._oList.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("masterTitleCount", [iTotalItems]);
				this.getModel("masterView").setProperty("/title", sTitle);
			}
		},

		/**
		 * Event handler for the master search field. Applies current
		 * filter value and triggers a new search. If the search field's
		 * 'refresh' button has been pressed, no new search is triggered
		 * and the list binding is refresh instead.
		 * @param {sap.ui.base.Event} oEvent the search event
		 * @public
		 */
		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
				return;
			}
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				this._oListFilterState.aSearch = [new Filter("Vbeln", FilterOperator.Contains, sQuery)];
				//this._oListFilterState.aFilter = [new Filter("Vbeln", FilterOperator.Contains, sQuery)];
			} else {
				this._oListFilterState.aSearch = [];
				//this._oListFilterState.aFilter = [];
			}
			this._applyFilterSearch();
			/*
			// update list binding
			var aFilters = [];
			var oFilter = new sap.ui.model.Filter("Vbeln", FilterOperator.Contains, sQuery);
			aFilters.push(oFilter);
			// Aplicamos el filtro con condicion OR
			//aFilters = new sap.ui.model.Filter([oFilter], false);
			var list = this.byId("list");
			var binding = list.getBinding("items");
			binding.filter(aFilters);	//, "Application");
			//this.getRouter().navTo("object", {objectId : sQuery}, true);
			*/
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @private
		 */
		_applyFilterSearch: function () {
			var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aSearch),
			//var aFilters = this._oListFilterState.aFilter.concat(this._oListFilterState.aFilter),
				oViewModel = this.getModel("masterView");
			this._oList.getBinding("items").filter(aFilters); //, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aFilters.length !== 0) {
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
			} else if (this._oListFilterState.aSearch.length > 0) {
				// only reset the no data text to default when no new search was triggered
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
			}
			//this._oList.getBinding.filter(aFilters);
			/*
			var filter = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sQuery);
			this._oList.bindAggregation("items", {
				path: "/EntregaSet",
				filters: aFilters
			});*/
			// refrescamos el binding context
			//this._onBindingChange();
			/*
			var oData = {
				EVbeln: "0192663050",
				Erdat: ""
			};
			sap.ui.core.BusyIndicator.show();
			var sEntity = "/EntregaSet('" +
				"0192663050" +
				"')";
			oViewModel.read(sEntity, oData, {
				success: function (data) {
					sap.ui.core.BusyIndicator.hide();
					if (data.Vbeln !== "") {
						sap.m.MessageBox.success("La Entrega N° " + data.Vbeln + " ha sido Contabilizada!", {
							title: "Confirmación",
							onClose: function () {
								this._oList.getBinding("items").refresh(true);
								//clear values
								this.clearValues();
								// refrescamos el binding context
								this._onBindingChange();
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
							sap.m.MessageBox.warning("Ocurrio un error inesperado!", {
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
			*/
		},

		onSearchDocuments: function (oEvent) {
			//var oBtn = oEvent.getSource();
			var oViewModel = this.getView().getModel("masterView");
			//var oModel = this.getOwnerComponent().getModel();
			//var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			//var filters = "";
			var numero = this.byId("NuDocumento").getValue();
			var fecha1 = oViewModel.getProperty("/imFecha1");
			var fecha2 = oViewModel.getProperty("/imFecha2");

			if (fecha1 === "") {
				sap.m.MessageToast.show(this.getResourceBundle().getText("date1Invalid"));
				return;
			}

			if (fecha2 === "") {
				sap.m.MessageToast.show(this.oResourceBundle.getText("date2Invalid"));
				return;
			}

			var oFilters = [];
			oFilters.push(new Filter("ImFecha1", FilterOperator.EQ, fecha1));
			oFilters.push(new Filter("ImFecha2", FilterOperator.EQ, fecha2));
			oFilters.push(new Filter("ImProceso", FilterOperator.EQ, "1"));
			if (numero !== "") {
				oFilters.push(new Filter("ImXblnr", FilterOperator.EQ, numero));
			}
			this.getTableItems().filter(oFilters);
			//oFilters.push(new sap.ui.model.Filter("variante", sap.ui.model.FilterOperator.EQ, key));

			//filters = "$filter=ImFecha1 eq '" + fecha1 + "' and ImFecha2 eq '" + fecha2 + "' and ImProceso eq '1'";
			/*var oModel = this.getOwnerComponent().getModel();
			oModel.read("/ZfiDocumentHeaderSet", {
				filters: oFilters,
				success: function (oData) {
					this._oList.setModel(oModel).bindRows("/ZfiDocumentHeaderSet");
				},
				error: function (oData) {

				}
			});*/

			//this._oList.getBinding("items")
			/*
			var oTemplate = new sap.m.ObjectListItem({
								 attributes: [
									  new sap.m.ObjectAttribute({
										   text: "{Description}"
									  }),
									  new sap.m.ObjectAttribute({
										   text: "{Price}"
									  }),
								 ]
							});*/
			//formatter: '.formatter.currencyValue'
			//						press: this.onSelectionChange.bind(this),
			/*
			this._oList.bindAggregation("items", {
				path: "/EntregaSet",
				filters: oFilters,
				template: new sap.m.ObjectListItem({
					title: "{Belnr}",
					type: "Navigation",
					press: this.onSelectionChange.bind(this),
					number: {
						path: "Wrbtr", 
						formatter: ".formatter.currencyValue"
					},
					numberUnit: "{Waers}",
					attributes: [

						new sap.m.ObjectAttribute({
							title: "{i18n>ejercicioTitle}",
							text: "{Gjahr}"
						}),
						new sap.m.ObjectAttribute({
							title: "{i18n>tipoTitle}",
							text: "{Ltext}"
						}),
						new sap.m.ObjectAttribute({
							title: "{i18n>fechaEmision}",
							text: {
								path: "Bldat",
								formatter: function(sDate) {
									var oDate = new Date(sDate);
									var iDay   = oDate.getDate() + 1;
									var iMonth = oDate.getMonth() + 1;
									var sDay   = iDay.toString();
									var sMonth = iMonth.toString();
									var sYear  = oDate.getFullYear().toString();
									if (sDay.length === 1 && sMonth.length === 1) {
										return "0" + sDay + "." + "0" + sMonth + "." + sYear;
									} else if (sDay.length === 1) {
										return "0" + sDay + "." + sMonth + "." + sYear;
									} else if (sMonth.length === 1) {
										return sDay + "." + "0" + sMonth + "." + sYear;
									} else {
										return oDate.toLocaleDateString();
									} 
								}
							}
						})
					]
				})
			});	
			*/
		},

		/**
		 * Internal helper method to apply both group and sort state together on the list binding
		 * @param {sap.ui.model.Sorter[]} aSorters an array of sorters
		 * @private
		 */
		_applyGroupSort: function (aSorters) {
			this._oList.getBinding("items").sort(aSorters);
		},

		/**
		 * Internal helper method that sets the filter bar visibility property and the label's caption to be shown
		 * @param {string} sFilterBarText the selected filter value
		 * @private
		 */
		_updateFilterBar: function (sFilterBarText) {
			var oViewModel = this.getModel("masterView");
			oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
			oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
		}

	});

});