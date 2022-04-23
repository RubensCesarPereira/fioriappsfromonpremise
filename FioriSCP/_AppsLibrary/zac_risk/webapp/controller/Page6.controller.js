sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
	"use strict";

	return BaseController.extend("zac.grc.risk.cust.controller.Page6", {
		handleRouteMatched: function(oEvent) {
			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;
				var oPath;
				if (this.sContext) {
					oPath = {
						path: "/" + this.sContext,
						parameters: oParams
					};
					this.getView().bindObject(oPath);
				}
			}

		},
		_onRowPress: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("RiesgosTi", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		doNavigate: function(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function(bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		_onRowPress1: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("RiesgosAg", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onRowPress2: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("Page6", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onRowPress3: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("RiesgosAll", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		applyFiltersAndSorters: function(sControlId, sAggregationName) {
			var oBindingInfo = this.getView().byId(sControlId).getBindingInfo(sAggregationName);
			var oBindingOptions = this.updateBindingOptions(sControlId);
			this.getView().byId(sControlId).bindAggregation(sAggregationName, {
				model: oBindingInfo.model,
				path: oBindingInfo.path,
				parameters: oBindingInfo.parameters,
				template: oBindingInfo.template,
				templateShareable: true,
				sorter: oBindingOptions.sorters,
				filters: oBindingOptions.filters
			});

		},
		updateBindingOptions: function(sCollectionId, oBindingData, sSourceId) {
			this.mBindingOptions = this.mBindingOptions || {};
			this.mBindingOptions[sCollectionId] = this.mBindingOptions[sCollectionId] || {};

			var aSorters = this.mBindingOptions[sCollectionId].sorters;
			var aGroupby = this.mBindingOptions[sCollectionId].groupby;

			// If there is no oBindingData parameter, we just need the processed filters and sorters from this function
			if (oBindingData) {
				if (oBindingData.sorters) {
					aSorters = oBindingData.sorters;
				}
				if (oBindingData.groupby) {
					aGroupby = oBindingData.groupby;
				}
				// 1) Update the filters map for the given collection and source
				this.mBindingOptions[sCollectionId].sorters = aSorters;
				this.mBindingOptions[sCollectionId].groupby = aGroupby;
				this.mBindingOptions[sCollectionId].filters = this.mBindingOptions[sCollectionId].filters || {};
				this.mBindingOptions[sCollectionId].filters[sSourceId] = oBindingData.filters || [];
			}

			// 2) Reapply all the filters and sorters
			var aFilters = [];
			for (var key in this.mBindingOptions[sCollectionId].filters) {
				aFilters = aFilters.concat(this.mBindingOptions[sCollectionId].filters[key]);
			}

			// Add the groupby first in the sorters array
			if (aGroupby) {
				aSorters = aSorters ? aGroupby.concat(aSorters) : aGroupby;
			}

			var aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, true)] : undefined;
			return {
				filters: aFinalFilters,
				sorters: aSorters
			};

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Page6").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			var oView = this.getView(),
				oData = {},
				self = this;
			var oModel = new sap.ui.model.json.JSONModel();
			oView.setModel(oModel, "staticDataModel");
			self.oBindingParameters = {};

			oData["sap_m_Page_0-content-sap_chart_CombinedChart-1531876347617-blzov2eohewvostc6sd66efc5_S5"] = {};

			oData["sap_m_Page_0-content-sap_chart_CombinedChart-1531876347617-blzov2eohewvostc6sd66efc5_S5"]["data"] = [{
				"dim0": "JULIO",
				"mea0": "680000",
				"mea1": "200000",
				"Dimension1": "Enero",
				"Measure1": "30",
				"__id": 0
			}, {
				"dim0": "AGOSTO",
				"mea0": "780000",
				"mea1": "80000",
				"Dimension1": "Enero",
				"Measure1": "200000",
				"__id": 1
			}, {
				"dim0": "SEPTIEMBRE",
				"mea0": "700000",
				"mea1": "400",
				"Dimension1": "Marzo",
				"Measure1": "20",
				"__id": 2
			}, {
				"dim0": "NOVIEMBRE",
				"mea0": "690000",
				"mea1": "200000",
				"Measure1": "0",
				"__id": 3
			}, {
				"dim0": "OCTUBRE",
				"mea0": "700000",
				"mea1": "200",
				"Measure1": "200000",
				"__id": 4
			}, {
				"dim0": "DICIEMBRE",
				"mea0": "690000",
				"mea1": "200000",
				"Measure1": "80000",
				"__id": 5
			}, {
				"dim0": "ENERO",
				"mea0": "660000",
				"mea1": "100000",
				"Measure1": "80000",
				"__id": 6
			}, {
				"undefined": null,
				"dim0": "FEBRERO",
				"mea0": "660000",
				"Measure1": "200000",
				"mea1": "80000",
				"__id": 7
			}, {
				"undefined": null,
				"dim0": "MARZO",
				"mea0": "680000",
				"mea1": "200000",
				"Measure1": "80000",
				"__id": 8
			}, {
				"undefined": null,
				"dim0": "ABRIL",
				"mea0": "700000",
				"Measure1": "100000",
				"mea1": "80000",
				"__id": 9
			}, {
				"undefined": null,
				"dim0": "MAYO",
				"mea0": "680000",
				"Measure1": "200000",
				"mea1": "80000",
				"__id": 10
			}, {
				"undefined": null,
				"dim0": "JUNIO",
				"mea0": "650000",
				"Measure1": "200000",
				"mea1": "100000",
				"__id": 11
			}];

			self.oBindingParameters['sap_m_Page_0-content-sap_chart_CombinedChart-1531876347617-blzov2eohewvostc6sd66efc5_S5'] = {
				"path": "/sap_m_Page_0-content-sap_chart_CombinedChart-1531876347617-blzov2eohewvostc6sd66efc5_S5/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oView.getModel("staticDataModel").setData(oData, true);

			function dateDimensionFormatter(oDimensionValue, sTextValue) {
				var oValueToFormat = sTextValue !== undefined ? sTextValue : oDimensionValue;
				if (oValueToFormat instanceof Date) {
					var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
						style: "short"
					});
					return oFormat.format(oValueToFormat);
				}
				return oValueToFormat;
			}

			var aDimensions = oView.byId("sap_m_Page_0-content-sap_chart_CombinedChart-1531876347617-blzov2eohewvostc6sd66efc5_S5").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

		},
		onAfterRendering: function() {

			var oChart,
				self = this,
				oBindingParameters = this.oBindingParameters,
				oView = this.getView();

			oChart = oView.byId("sap_m_Page_0-content-sap_chart_CombinedChart-1531876347617-blzov2eohewvostc6sd66efc5_S5");
			oChart.bindData(oBindingParameters['sap_m_Page_0-content-sap_chart_CombinedChart-1531876347617-blzov2eohewvostc6sd66efc5_S5']);

		}
	});
}, /* bExport= */ true);
