sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"./utilities",
		"sap/ui/core/routing/History",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Sorter"
	], function (BaseController, MessageBox, JSONModel, Utilities, History, Sorter) {
		"use strict";
		return BaseController.extend("zac.grc.risk.cust.controller.RiesgosAg", {
			handleRouteMatched: function (oEvent) {
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
				var oModelo = this.getView().getModel("oModelo");
				var sGlobalVariableg = sap.ui.getCore().myGlobalVarg;
				var sGlobalVariablesg = sap.ui.getCore().myGlobalVarsg;
				var sGlobalVariablep = sap.ui.getCore().myGlobalVarp;
				var sGlobalVariables = sap.ui.getCore().myGlobalVars;
				var txtGerencia = "Riesgos por Subgerencia: " + sGlobalVariablesg + " - Periodo: " + sGlobalVariablep;
				var oView = this.getView();
				var gerencia = oView.byId("txtGerencia_id");
				this.getView().byId("txtGerencia_id").setText(txtGerencia);

				// FILTRO TABLA GERENCIA PERIODO.
				this._oGlobalFilter = null;
				var GerenciaFilters = [];
				var oRiesgoPeriodo = sGlobalVariablep;
				if (sGlobalVariableg) {
					GerenciaFilters.push(new sap.ui.model.Filter("Periodo", sap.ui.model.FilterOperator.EQ, oRiesgoPeriodo));
					GerenciaFilters.push(new sap.ui.model.Filter("Gerencia", sap.ui.model.FilterOperator.EQ, sGlobalVariableg));
					GerenciaFilters.push(new sap.ui.model.Filter("SGerencia", sap.ui.model.FilterOperator.EQ, sGlobalVariablesg));
					GerenciaFilters.push(new sap.ui.model.Filter("Sociedad", sap.ui.model.FilterOperator.EQ, sGlobalVariables));
				}
				this._oGlobalFilter = GerenciaFilters;
				var oFilter = null;
				if (this._oGlobalFilter) {
					oFilter = new sap.ui.model.Filter(this._oGlobalFilter, true);
				}
				this.byId("tblGerenciaPeriodo_id").getBinding("items").filter(oFilter, "Application");
			},
			onInit: function () {
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.oRouter.getTarget("RiesgosAg").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			},
			/**
			 *@memberOf zac.grc.risk.cust.controller.RiesgosAg
			 */
			onNavBack: function (oEvent) {
				var oHistory = new sap.ui.core.routing.History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("overview", true);
				}
			},
			/**
			 *@memberOf zac.grc.risk.cust.controller.RiesgosAg
			 */
			onObjectNumberPress: function (oEvent) {
				var oMyGlobalModel = sap.ui.getCore().getModel("fecha");
				var oRiesgoPeriodo = oMyGlobalModel.getData().fecha;
				var sGlobalVariableg = sap.ui.getCore().myGlobalVarg;
				var sGlobalVariables = sap.ui.getCore().myGlobalVars;
				var sGlobalVariablesg = sap.ui.getCore().myGlobalVarsg;
				// use the response as required.
				//var iNumber = "/sap/opu/odata/sap/ZAC_RISK_SRV/RiesgoDetalleSet?$filter=substringof%28%27201807%27,%20Periodo%29%20eq%20true&$format=xlsx&saml2=disabled";
				//var url = "/sap/ZAC_RISK_SRV/RiesgoDetalleSet?$filter=Periodo%20eq%20(%27201807%27)&$format=xlsx&saml2=disabled";
				var url = "/sap/opu/odata/sap/ZAC_RISK_SRV/RiesgoDetalleSet?$filter=Periodo%20eq%20(%27" + oRiesgoPeriodo + "%27)%20and%20Gerencia%20eq%20(%27"+ sGlobalVariableg + "%27)%20and%20Sociedad%20eq%20(%27"+ sGlobalVariables + "%27)" + "%20and%20SGerencia%20eq%20(%27"+ sGlobalVariablesg + "%27)&$format=xlsx";
				 
				window.open(url);
			},
			/**
			 *@memberOf zac.grc.risk.cust.controller.RiesgosAg
			 */
			action: function (oEvent) {
				var that = this;
				var actionParameters = JSON.parse(oEvent.getSource().data("wiring").replace(/'/g, "\""));
				var eventType = oEvent.getId();
				var aTargets = actionParameters[eventType].targets || [];
				aTargets.forEach(function (oTarget) {
					var oControl = that.byId(oTarget.id);
					if (oControl) {
						var oParams = {};
						for (var prop in oTarget.parameters) {
							oParams[prop] = oEvent.getParameter(oTarget.parameters[prop]);
						}
						oControl[oTarget.action](oParams);
					}
				});
				var oNavigation = actionParameters[eventType].navigation;
				if (oNavigation) {
					var oParams = {};
					(oNavigation.keys || []).forEach(function (prop) {
						oParams[prop.name] = encodeURIComponent(JSON.stringify({
							value: oEvent.getSource().getBindingContext(oNavigation.model).getProperty(prop.name),
							type: prop.type
						}));
					});
					if (Object.getOwnPropertyNames(oParams).length !== 0) {
						this.getOwnerComponent().getRouter().navTo(oNavigation.routeName, oParams);
					} else {
						this.getOwnerComponent().getRouter().navTo(oNavigation.routeName);
					}
				}
			},

				Change: function (oEvent) {
				this._oGlobalFiltros = null;
				var sGlobalVariableg = sap.ui.getCore().myGlobalVarg;
				var sGlobalVariablep = sap.ui.getCore().myGlobalVarp;
				var sGlobalVariables = sap.ui.getCore().myGlobalVars;
				var GerenciaFiltros = [];
				var searchText = oEvent.getParameters();
				var searchTextValor = searchText.query.toUpperCase();
				this._oGlobalFiltros = null;
				var GerenciaFiltros = [];

				if (searchTextValor) {
				GerenciaFiltros.push(new sap.ui.model.Filter("Periodo", sap.ui.model.FilterOperator.EQ, sGlobalVariablep));
				GerenciaFiltros.push(new sap.ui.model.Filter("Gerencia", sap.ui.model.FilterOperator.EQ, sGlobalVariableg));
				GerenciaFiltros.push(new sap.ui.model.Filter("Usuario", sap.ui.model.FilterOperator.Contains, searchTextValor));
				
				this._oGlobalFiltros = GerenciaFiltros;
				var oFiltros = null;
				if (this._oGlobalFiltros) {
					oFiltros = new sap.ui.model.Filter(this._oGlobalFiltros, true);
				}
				this.byId("tblGerenciaPeriodo_id").getBinding("items").filter(oFiltros, "Application");
				this.byId("tblGerenciaPeriodo_id").getBinding("items").applyFilter();
				}else{

				// FILTRO TABLA GERENCIA PERIODO.
				this._oGlobalFilter = null;
				var GerenciaFilters = [];
				if (sGlobalVariableg) {
					GerenciaFilters.push(new sap.ui.model.Filter("Periodo", sap.ui.model.FilterOperator.EQ, sGlobalVariablep));
					GerenciaFilters.push(new sap.ui.model.Filter("Gerencia", sap.ui.model.FilterOperator.EQ, sGlobalVariableg));
					GerenciaFilters.push(new sap.ui.model.Filter("Sociedad", sap.ui.model.FilterOperator.EQ, sGlobalVariables));
				}
				this._oGlobalFilter = GerenciaFilters;
				var oFilter = null;
				if (this._oGlobalFilter) {
					oFilter = new sap.ui.model.Filter(this._oGlobalFilter, true);
				}
				this.byId("tblGerenciaPeriodo_id").getBinding("items").filter(oFilter, "Application");
			}
		},
		onExit : function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
			},

			handleViewSettingsDialogButtonPressed: function (oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("zac.grc.risk.cust.view.fragments.Dialog", this);
			}
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},

		handleConfirm: function(oEvent) {

			var oView = this.getView();
			var oTable = oView.byId("tblGerenciaPeriodo_id");

			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");

			// apply sorter to binding
			// (grouping comes before sorting)
			var sPath;
			var bDescending;
			var vGroup;
			var aSorters = [];
			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				vGroup = this.mGroupFunctions[sPath];
				aSorters.push(new Sorter(sPath, bDescending, vGroup));
			}
			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			oBinding.sort(aSorters);
		}
 
		});
	}, /* bExport= */
	true);