sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"./utilities",
		"sap/ui/core/routing/History",
		"sap/ui/model/Sorter"
	], function (BaseController, MessageBox, Utilities, History, Sorter) {
		"use strict";
		return BaseController.extend("zac.grc.risk.cust.controller.RiesgosAll", {
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
				//var oView = sap.ui.view({type:sap.ui.core.mvc.ViewType.XML, id:"Page1",viewName:"zac.grc.risk.cust.view.Page1"});
				//var fecha = oView.byId("picker0").getValue();
				//FILTROS A TABLA DETALLE 
				var oMyGlobalModel = sap.ui.getCore().getModel("fecha");
				var PeriodoFilters = [];
				var oRiesgoPeriodo = oMyGlobalModel.getData().fecha;
				if (oRiesgoPeriodo) {
					PeriodoFilters.push(new sap.ui.model.Filter("Periodo", sap.ui.model.FilterOperator.EQ, oRiesgoPeriodo));
				}
				this._oGlobalFilter = PeriodoFilters;
				var oFilter = null;
				if (this._oGlobalFilter) {
					oFilter = new sap.ui.model.Filter(this._oGlobalFilter, true);
				}
				this.byId("tblDetalle_id").getBinding("items").filter(oFilter, "Application");
			},
			onObjectNumberPress: function (e) {
				var oMyGlobalModel = sap.ui.getCore().getModel("fecha");
				var oRiesgoPeriodo = oMyGlobalModel.getData().fecha;
				// use the response as required.
				//var iNumber = "/sap/opu/odata/sap/ZAC_RISK_SRV/RiesgoDetalleSet?$filter=substringof%28%27201807%27,%20Periodo%29%20eq%20true&$format=xlsx&saml2=disabled";
				//var url = "/sap/ZAC_RISK_SRV/RiesgoDetalleSet?$filter=Periodo%20eq%20(%27201807%27)&$format=xlsx&saml2=disabled";
				var url = "/sap/opu/odata/sap/ZAC_RISK_SRV/RiesgoDetalleSet?$filter=Periodo%20eq%20(%27" + oRiesgoPeriodo + "%27)&$format=xlsx";
				window.open(url);
			},
			onInit: function () {
					this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					this.oRouter.getTarget("RiesgosAll").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
				
			//TABLE SORT
				
				
				
			} ///// FINAL
				,
			/**
			 *@memberOf zac.grc.risk.cust.controller.RiesgosAll
			 */
			onNavBack: function (oEvent) {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("overview", true);
			}
		},

				Change: function (oEvent) {
				this._oGlobalFiltros = null;
				var oMyGlobalModel = sap.ui.getCore().getModel("fecha");
				var oRiesgoPeriodo = oMyGlobalModel.getData().fecha;
				var resultado = oRiesgoPeriodo;
				var GerenciaFiltros = [];
				var searchText = oEvent.getParameters();
				var searchTextValor = searchText.query.toUpperCase();
				this._oGlobalFiltros = null;
				var GerenciaFiltros = [];

				
				if (searchTextValor) {
				GerenciaFiltros.push(new sap.ui.model.Filter("Periodo", sap.ui.model.FilterOperator.EQ, resultado));
				GerenciaFiltros.push(new sap.ui.model.Filter("Usuario", sap.ui.model.FilterOperator.Contains, searchTextValor));
				
				this._oGlobalFiltros = GerenciaFiltros;
				var oFiltros = null;
				if (this._oGlobalFiltros) {
					oFiltros = new sap.ui.model.Filter(this._oGlobalFiltros, true);
				}
				this.byId("tblDetalle_id").getBinding("items").filter(oFiltros, "Application");
				this.byId("tblDetalle_id").getBinding("items").applyFilter();
			}else{
				//FILTROS A TABLA DETALLE   SI ESTA VACIO EL FILTRO. 
				var oMyGlobalModel = sap.ui.getCore().getModel("fecha");
				var PeriodoFilters = [];
				var oRiesgoPeriodo = oMyGlobalModel.getData().fecha;
				if (oRiesgoPeriodo) {
					PeriodoFilters.push(new sap.ui.model.Filter("Periodo", sap.ui.model.FilterOperator.EQ, oRiesgoPeriodo));
				}
				this._oGlobalFilter = PeriodoFilters;
				var oFilter = null;
				if (this._oGlobalFilter) {
					oFilter = new sap.ui.model.Filter(this._oGlobalFilter, true);
				}
				this.byId("tblDetalle_id").getBinding("items").filter(oFilter, "Application");	
			}
			},

			Sort: function (oEvent) {
			var oSorter = new sap.ui.model.Sorter("Riskcount");               //A is your column name
			var oTable = this.getView().byId("tblDetalle_id");          //Get Hold of table control, if it is not MVC use sap.ui.getCore().byId("oTable")
			var oBinding = oTable.getBinding("items");
			oBinding.sort(oSorter);
			oTable.getBinding("items").applySort();
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
			var oTable = oView.byId("tblDetalle_id");

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