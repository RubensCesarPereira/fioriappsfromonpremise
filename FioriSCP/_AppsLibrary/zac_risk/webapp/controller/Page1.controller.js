sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"./utilities",
		"sap/ui/core/routing/History",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/Filter",
		"sap/ui/model/Sorter"
		
	], function (BaseController, MessageBox, Utilities, History, JSONModel, FilterOperator, Filter, Sorter) {
		"use strict";
		return BaseController.extend("zac.grc.risk.cust.controller.Page1", {


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
				// TEST FECHA GET CORE FUNCIONA ! FECHA  
				var fecha = this.getView().byId("picker0").getValue();
				var data = {
					fecha: fecha
				};
				var oGlobalModel = new sap.ui.model.json.JSONModel(data);
				sap.ui.getCore().setModel(oGlobalModel, "fecha");
				//PERIODO
				var oText = this.getView().byId("picker0");
				var resultado = oText.getValue();
				/*var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
				     source:{pattern:"yyyyMM"},
				     pattern: "yyyyMM"}
					);
					var oDate = oDateFormat.parse(resultado);
					var oRiesgoPeriodo = oDateFormat.format(oDate);*/
				//
				var ruta = "'" + resultado + "'";
				var oView = this.getView();
				var oModel = this.getView().getModel();
				//oModel.setSizeLimit(1100);
				oModel.read("/RiesgoPeriodoSet(" + ruta + ")", {
					success: function (oDataResult) {
						//MessageBox.show(oDataResult);
						//sap.ui.getCore().setModel(oModel, "totales");
						oView.byId("oNriskcount_id").setNumber(oDataResult.Riskcount);
						oView.byId("oNcritico_id").setNumber(oDataResult.Critico);
						oView.byId("oNalto_id").setNumber(oDataResult.Alto);
						oView.byId("oNmedio_id").setNumber(oDataResult.Medio);
						oView.byId("oNbajo_id").setNumber(oDataResult.Bajo);
					},
					error: function (oError) {}
				}); //TABLE
				//oTable.bindAggregation("items", "/GerenciasSet", null, GerenciaFilters);
				//items="{path:'/GerenciasSet',parameters:{select:'Gerencia,Sociedad,Periodo,Riskcount'},filters:[{path:'Periodo',operator:'EQ',value1:'201808'}],sorter:[{path:'Gerencia',descending:false}]}
			///////// TEST FILTRO GERENCIA
				
				this._oGlobalFilter = null;
				var GerenciaFilters = [];
				var oRiesgoPeriodo = resultado;
				if (resultado) {
				GerenciaFilters.push(new sap.ui.model.Filter("Periodo", sap.ui.model.FilterOperator.EQ, oRiesgoPeriodo));
				}
				this._oGlobalFilter = GerenciaFilters;
				var oFilter = null;
				if (this._oGlobalFilter) {
					oFilter = new sap.ui.model.Filter(this._oGlobalFilter, true);
				}
				this.byId("tblGerencia_id").getBinding("items").filter(oFilter, "Application");
			},
			_onRowPress: function (oEvent) {
				var oBindingContext = oEvent.getSource().getBindingContext();
				return new Promise(function (fnResolve) {
					this.doNavigate("RiesgosTi", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			},
			doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
				var sPath = oBindingContext ? oBindingContext.getPath() : null;
				var oModel = oBindingContext ? oBindingContext.getModel() : null;
				//TEST GERENCIA GLOBAL//
				if (oBindingContext) {
					var propertyGerencia = oBindingContext.getProperty("Gerencia");
					var propertySGerencia = oBindingContext.getProperty("SGerencia");
					var propertySociedad = oBindingContext.getProperty("Sociedad");
					var periodo = this.getView().byId("picker0").getValue();
					var gerencia = propertyGerencia;
					var sociedad = propertySociedad;
					sap.ui.getCore().myGlobalVarsg = propertySGerencia;
					sap.ui.getCore().myGlobalVarg = gerencia;
					sap.ui.getCore().myGlobalVarp = periodo;
					sap.ui.getCore().myGlobalVars = sociedad;
				}
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
					sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
						sRouteName);
				}
				if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
					if (sNavigationPropertyName === "") {
						this.oRouter.navTo(sRouteName, {
							context: sPath,
							masterContext: sMasterContext
						}, false);
					} else {
						oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
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
			
			onObjectNumberPress: function (oEvent) {
				var oMyGlobalModel = sap.ui.getCore().getModel("fecha");
				var oRiesgoPeriodo = oMyGlobalModel.getData().fecha;
				// use the response as required.
				//var iNumber = "/sap/opu/odata/sap/ZAC_RISK_SRV/RiesgoDetalleSet?$filter=substringof%28%27201807%27,%20Periodo%29%20eq%20true&$format=xlsx&saml2=disabled";
				//var url = "/sap/ZAC_RISK_SRV/RiesgoDetalleSet?$filter=Periodo%20eq%20(%27201807%27)&$format=xlsx&saml2=disabled";
				var url = "/sap/opu/odata/sap/ZAC_RISK_SRV/GerenciasSet?$filter=Periodo%20eq%20(%27" + oRiesgoPeriodo + "%27)&$format=xlsx";
				window.open(url);
			},
			
			_onRowPress1: function (oEvent) {
				var oBindingContext = oEvent.getSource().getBindingContext();
				return new Promise(function (fnResolve) {
					this.doNavigate("Page2", oBindingContext, fnResolve, "");
					var propertyGerencia = oBindingContext.getProperty("Gerencia");
					var propertySociedad = oBindingContext.getProperty("Sociedad");
					var gerencia = propertyGerencia;
					var sociedad = propertySociedad;
					var periodo = this.getView().byId("picker0").getValue();
					//sap.ui.getCore().myGlobalVar = gerencia;
					//JSON SET MODEL GLOBAL
					var myJSON = {
						"gerencia": gerencia,
						"periodo": periodo
					};
					var oModelo = new sap.ui.model.json.JSONModel(myJSON);
					sap.ui.getCore().setModel(oModelo, "gerencia"); //	sap.ui.getCore().setModel(oModel, "parametros");
					/*			var datag = {gerencia: gerencia};
			var datap = {periodo: periodo};
			var datas = {sociedad: sociedad}; 
			var oGlobalModelg = new sap.ui.model.json.JSONModel(datag);
			var oGlobalModelp = new sap.ui.model.json.JSONModel(datap);
			var oGlobalModels = new sap.ui.model.json.JSONModel(datas);
			sap.ui.getCore().setModel(oGlobalModelg, "gerencia"); 
			sap.ui.getCore().setModel(oGlobalModelp, "periodo"); 
			sap.ui.getCore().setModel(oGlobalModels, "sociedad");*/
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			},
			_onRowPress2: function (oEvent) {
				var oBindingContext = oEvent.getSource().getBindingContext();
				return new Promise(function (fnResolve) {
					this.doNavigate("Page1", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			},
			_onRowPress3: function (oEvent) {
				var oBindingContext = oEvent.getSource().getBindingContext();
				return new Promise(function (fnResolve) {
					this.doNavigate("RiesgosAll", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			},
			/*			detailPress : function(oEventParams){
            var oListItem = oEventParams.getSource();
            var oBindingContext = oListItem.getBindingContext(); 
            var sSomePropertyValue = oBindingContext.getProperty("Gerencia"); 
			var gerencia = sSomePropertyValue;
				
			//"GERENCIA GLOBAL"
			var data = {gerencia: gerencia};
			var oGlobalModel = new sap.ui.model.json.JSONModel(data);
			sap.ui.getCore().setModel(oGlobalModel, "gerencia");
			sap.ui.getCore().AppContext = new Object();
            sap.ui.getCore().AppContext = gerencia;
			},
			*/
			/**
			 *@memberOf zac.grc.risk.cust.controller.Page1
			 * Filter
			 */
			/*_filter: function () {
				var oFilter = null;
				if (this._oGlobalFilter) {
					oFilter = new sap.ui.model.Filter(this._oGlobalFilter, true);
				}
				this.byId("tblGerencia_id").getBinding("items").filter(oFilter, "Application");
			},
			/**
			 *@memberOf zac.grc.risk.cust.controller.Page1
			 * Filter
			 */
			/*filterGerencia: function (oEvent) {
				//var sQuery = oEvent.getParameter("query");
				var sQuery = this.getView().byId("picker0").getValue();
				this._oGlobalFilter = null;
				var GerenciaFilters = [];
				/*				var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
				     source:{pattern:"yyyyMM"},
				     pattern: "yyyyMM"}
					);
					var oDate = oDateFormat.parse(sQuery);
				var oRiesgoPeriodo = sQuery;
				if (sQuery) {
					GerenciaFilters.push(new sap.ui.model.Filter("Periodo", sap.ui.model.FilterOperator.EQ, oRiesgoPeriodo));
				}
				this._oGlobalFilter = GerenciaFilters;
				this._filter();
			},
			/**
			 *@memberOf zac.grc.risk.cust.controller.Page1
			 */
			onChangeRiskPerioid: function (oEvent) {
				var oText = this.getView().byId("picker0");
				var resultado = oText.getValue();
				/*			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
				     source:{pattern:"yyyyMM"},
				     pattern: "yyyyMM"}
				);
				var oDate = oDateFormat.parse(resultado);*/
				var oRiesgoPeriodo = resultado;
				//CREO RUTA '201807', PARA INGRESARLA EN EL OMODEL.READ
				var path = "'" + oRiesgoPeriodo + "'";
				//modelo fecha
				var data = {
					fecha: oRiesgoPeriodo
				};
				var oGlobalModel = new sap.ui.model.json.JSONModel(data);
				sap.ui.getCore().setModel(oGlobalModel, "fecha");
				// OBTENER MODELO E INCLUIR FECHA POR EVENTO INPUT
				var oView = this.getView();
				var oModel = this.getView().getModel();
				oModel.read("/RiesgoPeriodoSet(" + path + ")", {
					success: function (oDataResult) {
						//MessageBox.show(oDataResult);
						//sap.ui.getCore().setModel(oModel, "totales");
						oView.byId("oNriskcount_id").setNumber(oDataResult.Riskcount);
						oView.byId("oNcritico_id").setNumber(oDataResult.Critico);
						oView.byId("oNalto_id").setNumber(oDataResult.Alto);
						oView.byId("oNmedio_id").setNumber(oDataResult.Medio);
						oView.byId("oNbajo_id").setNumber(oDataResult.Bajo);
					},
					error: function (oError) {}
				});

				this._oGlobalFilter = null;
				var GerenciaFilters = [];
				if (resultado) {
				GerenciaFilters.push(new sap.ui.model.Filter("Periodo", sap.ui.model.FilterOperator.EQ, oRiesgoPeriodo));
				}
				this._oGlobalFilter = GerenciaFilters;
				var oFilter = null;
				if (this._oGlobalFilter) {
					oFilter = new sap.ui.model.Filter(this._oGlobalFilter, true);
				}
				this.byId("tblGerencia_id").getBinding("items").filter(oFilter, "Application");
			},
			/**
			 *@memberOf zac.grc.risk.cust.controller.Page1
			 */
			onInit: function () {
					this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					this.oRouter.getTarget("Page1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
					var date = new Date();
					var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
					var oPeriodo = this.getView().byId("picker0").setDateValue(firstDay);
					// MODELO FECHA //


					//
					var oView = this.getView();
					oView.setModel(new JSONModel({
						globalFilter: "",
						availabilityFilterOn: true,
						cellFilterOn: true
					}), "ui");
					this._oGlobalFilter = null;
			}, // FINAL
			/**
			 *@memberOf zac.grc.risk.cust.controller.Page1
			 */
			onAfterRendering: function () {
				var oView = this.getView();
				var oTable = oView.byId("tblGerencia_id");
				var oBinding = oTable.getBinding("items");

			// apply sorter to binding
			// (grouping comes before sorting)
			var sPath;
			var bDescending = true;
			var vGroup;
			var aSorters = oBinding.aSorters;
			if (aSorters.length == 0) {
				sPath = "Riskcount";
				bDescending = true
				aSorters.push(new Sorter(sPath, bDescending));
				oBinding.sort(aSorters);
			}
				
			}, // FINAL
			/**
			 *@memberOf zac.grc.risk.cust.controller.Page1
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
				var oText = this.getView().byId("picker0");
				var resultado = oText.getValue();
				var GerenciaFiltros = [];
				var searchText = oEvent.getParameters();
				var searchTextValor = searchText.query.toUpperCase();
				this._oGlobalFiltros = null;
				var GerenciaFiltros = [];
				if (searchTextValor) {
				GerenciaFiltros.push(new sap.ui.model.Filter("Periodo", sap.ui.model.FilterOperator.EQ, resultado));
				GerenciaFiltros.push(new sap.ui.model.Filter("Gerencia", sap.ui.model.FilterOperator.Contains, searchTextValor));
				//GerenciaFiltros.push(new sap.ui.model.Filter("Sociedad", sap.ui.model.FilterOperator.Contains, searchTextValor));
				
				this._oGlobalFiltros = GerenciaFiltros;
				var oFiltros = null;
				if (this._oGlobalFiltros) {
					oFiltros = new sap.ui.model.Filter(this._oGlobalFiltros, true);
				}

				this.byId("tblGerencia_id").getBinding("items").filter(oFiltros, "Application");
				this.byId("tblGerencia_id").getBinding("items").applyFilter();
				}else{
				
				///////// TEST FILTRO GERENCIA
				
				var sQuery = this.getView().byId("picker0").getValue();
				this._oGlobalFilter = null;
				var GerenciaFilters = [];
				var oRiesgoPeriodo = sQuery;
				if (sQuery) {
				GerenciaFilters.push(new sap.ui.model.Filter("Periodo", sap.ui.model.FilterOperator.EQ, oRiesgoPeriodo));
				}
				this._oGlobalFilter = GerenciaFilters;
				var oFilter = null;
				if (this._oGlobalFilter) {
					oFilter = new sap.ui.model.Filter(this._oGlobalFilter, true);
				}
				this.byId("tblGerencia_id").getBinding("items").filter(oFilter, "Application");
			}
			},

				Change2: function (oEvent) {
				this._oGlobalFiltros = null;
				var oText = this.getView().byId("picker0");
				var resultado = oText.getValue();
				var GerenciaFiltros = [];
				var searchText = oEvent.getParameters();
				var searchTextValor = searchText.query.toUpperCase();
				this._oGlobalFiltros = null;
				var GerenciaFiltros = [];
				if (searchTextValor) {
				GerenciaFiltros.push(new sap.ui.model.Filter("Periodo", sap.ui.model.FilterOperator.EQ, resultado));
				GerenciaFiltros.push(new sap.ui.model.Filter("Sociedad", sap.ui.model.FilterOperator.Contains, searchTextValor));
				
				this._oGlobalFiltros = GerenciaFiltros;
				var oFiltros = null;
				if (this._oGlobalFiltros) {
					oFiltros = new sap.ui.model.Filter(this._oGlobalFiltros, true);
				}

				this.byId("tblGerencia_id").getBinding("items").filter(oFiltros, "Application");
				this.byId("tblGerencia_id").getBinding("items").applyFilter();
				}else{
				
				///////// TEST FILTRO GERENCIA
				
				var sQuery = this.getView().byId("picker0").getValue();
				this._oGlobalFilter = null;
				var GerenciaFilters = [];
				var oRiesgoPeriodo = sQuery;
				if (sQuery) {
				GerenciaFilters.push(new sap.ui.model.Filter("Periodo", sap.ui.model.FilterOperator.EQ, oRiesgoPeriodo));
				}
				this._oGlobalFilter = GerenciaFilters;
				var oFilter = null;
				if (this._oGlobalFilter) {
					oFilter = new sap.ui.model.Filter(this._oGlobalFilter, true);
				}
				this.byId("tblGerencia_id").getBinding("items").filter(oFilter, "Application");
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
			var oTable = oView.byId("tblGerencia_id");

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